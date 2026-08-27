const { Op } = require("sequelize");
const {
  Inventory,
  User,
  Alert,
  AlertClick,
  Purchase,
} = require("../models/index.js");
const { parseVariantTitle } = require("../utils/parseVariantTitle.js");
const {
  checkAlertsForInventory,
  checkPriceDropAlerts,
} = require("../services/alert.service.js");

const ATTRIBUTION_WINDOW_DAYS = 30;

const isItemMatch = (source, item) => {
  const skuMatch =
    source.sku &&
    item.sku &&
    source.sku.toLowerCase() === item.sku.toLowerCase();
  if (skuMatch) return true;
  if (!source.shoe_name) return false;
  const sourceWords = source.shoe_name.toLowerCase().split(" ");
  const itemName = (item.title || "").toLowerCase();
  return sourceWords.every((word) => itemName.includes(word));
};

// HANDLE PRODUCT CREATE
// POST /api/webhooks/shopify/products/create
const handleProductCreate = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const variants = data.variants || [];

    for (const variant of variants) {
      const { size, condition, boxCondition } = parseVariantTitle(
        variant.title,
        data.handle,
      );

      await Inventory.upsert({
        shopify_product_id: String(data.id),
        shopify_variant_id: String(variant.id),
        shoe_name: data.title,
        sku: variant.sku || null,
        size: size,
        condition: condition,
        box_status: boxCondition,
        price: parseFloat(variant.price) || null,
        available: variant.inventory_quantity || 0,
        shopify_url: `https://thelabdtx.com/products/${data.handle}`,
        image_url: data.images?.[0]?.src || null,
        last_synced_at: new Date(),
      });
    }

    res.status(200).json({ received: true });

    // Only notify once the listing is actually ready
    const isPublished = !!data.published_at;
    const hasImage = !!data.images?.[0]?.src;

    if (!isPublished || !hasImage) {
      console.log(
        `Skipping alert check — ${data.title} not ready yet (published: ${isPublished}, image: ${hasImage})`,
      );
      return;
    }

    const notifiedUsers = new Set();

    for (const variant of variants) {
      if (!variant.inventory_quantity || variant.inventory_quantity < 1) {
        continue;
      }

      const inventoryItem = await Inventory.findOne({
        where: { shopify_variant_id: String(variant.id) },
      });

      if (inventoryItem) {
        await checkAlertsForInventory(inventoryItem, notifiedUsers);
      }
    }
  } catch (error) {
    console.error("Product create webhook error:", error.message);
  }
};

// HANDLE PRODUCT DELETE
// POST /api/webhooks/shopify/products/delete
const handleProductDelete = async (req, res) => {
  try {
    const data = JSON.parse(req.body);

    await Inventory.update(
      { available: 0, last_synced_at: new Date() },
      { where: { shopify_product_id: String(data.id) } },
    );

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Product delete webhook error:", error.message);
  }
};

const handleOrderCreate = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    res.status(200).json({ received: true });

    const customerEmail = data.email;
    const shopifyOrderId = String(data.id);
    const lineItems = data.line_items || [];

    const tags = (data.tags || "").toLowerCase();
    const sourceName = (data.source_name || "").toLowerCase();
    if (
      sourceName === "pos" ||
      tags.includes("store-owned") ||
      tags.includes("pos")
    ) {
      console.log(`Skipping POS/store orders for ${customerEmail}`);
      return;
    }

    // Definitive path: did this order carry our click attribute?
    const clickAttr = (data.note_attributes || []).find(
      (attr) => attr.name === "labsync_click_id",
    );

    if (clickAttr) {
      const click = await AlertClick.findByPk(clickAttr.value);
      if (click) {
        const item = lineItems[0]; // cart permalink adds exactly one item
        await Purchase.create({
          user_id: click.user_id,
          alert_id: click.alert_id,
          shopify_order_id: shopifyOrderId,
          shoe_name: click.shoe_name,
          sku: click.sku,
          size: click.size,
          price_paid: parseFloat(item?.price) || null,
          customer_email: customerEmail,
          purchased_at: new Date(data.created_at),
        });
        console.log(
          `Purchase attributed via click tag — ${click.shoe_name} for ${customerEmail}`,
        );
        return;
      }
    }

    // Fallback: no click tag (e.g. they bought independently, not via
    // a redirect link) — same soft matching as before
    if (!customerEmail) return;

    const user = await User.findOne({ where: { email: customerEmail } });
    if (!user) return;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - ATTRIBUTION_WINDOW_DAYS);

    const userAlerts = await Alert.findAll({
      where: { user_id: user.id, created_at: { [Op.gte]: cutoff } },
    });
    const recentClicks = await AlertClick.findAll({
      where: { user_id: user.id, clicked_at: { [Op.gte]: cutoff } },
    });

    for (const item of lineItems) {
      const matchedAlert = userAlerts.find((alert) => isItemMatch(alert, item));
      const matchedClick = recentClicks.find((click) =>
        isItemMatch(click, item),
      );
      if (!matchedAlert && !matchedClick) continue;

      await Purchase.create({
        user_id: user.id,
        alert_id: matchedAlert?.id || null,
        shopify_order_id: shopifyOrderId,
        shoe_name: item.title,
        sku: item.sku || null,
        size: item.variant_title?.split(" - ")?.[0] || null,
        price_paid: parseFloat(item.price) || null,
        customer_email: customerEmail,
        purchased_at: new Date(data.created_at),
      });
      console.log(
        `Purchase attributed via matching — ${item.title} for ${customerEmail}`,
      );
    }
  } catch (error) {
    console.error("Order create webhook error:", error.message);
  }
};

// HANDLE PRODUCT UPDATE
// POST /api/webhooks/shopify/products/update
const handleProductUpdate = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const variants = data.variants || [];
    const imageUrl = data.images?.[0]?.src || null;

    const priceDropVariants = [];

    for (const variant of variants) {
      const { size, condition, boxCondition } = parseVariantTitle(
        variant.title,
        data.handle,
      );

      const newPrice = parseFloat(variant.price) || null;
      const compareAtPrice = parseFloat(variant.compare_at_price) || null;
      const isPriceDrop =
        compareAtPrice && newPrice && newPrice < compareAtPrice;

      await Inventory.upsert({
        shopify_product_id: String(data.id),
        shopify_variant_id: String(variant.id),
        shoe_name: data.title,
        sku: variant.sku || null,
        size: size,
        condition: condition,
        box_status: boxCondition,
        price: newPrice,
        compare_at_price: compareAtPrice || null,
        available: variant.inventory_quantity || 0,
        shopify_url: `https://thelabdtx.com/products/${data.handle}`,
        image_url: imageUrl,
        last_synced_at: new Date(),
      });

      if (isPriceDrop && variant.inventory_quantity > 0) {
        priceDropVariants.push({
          variant,
          size,
          condition,
          newPrice,
          compareAtPrice,
        });
      }
    }

    res.status(200).json({ received: true });

    const isPublished = !!data.published_at;
    const hasImage = !!data.images?.[0]?.src;

    if (!isPublished || !hasImage) {
      console.log(
        `Skipping alert check — ${data.title} not ready yet (published: ${isPublished}, image: ${hasImage})`,
      );
      return;
    }

    const notifiedUsers = new Set();

    for (const variant of variants) {
      if (!variant.inventory_quantity || variant.inventory_quantity < 1)
        continue;
      const inventoryItem = await Inventory.findOne({
        where: { shopify_variant_id: String(variant.id) },
      });
      if (inventoryItem) {
        await checkAlertsForInventory(inventoryItem, notifiedUsers);
      }
    }

    if (priceDropVariants.length > 0) {
      for (const { variant } of priceDropVariants) {
        const inventoryItem = await Inventory.findOne({
          where: { shopify_variant_id: String(variant.id) },
        });
        if (inventoryItem) {
          await checkPriceDropAlerts(inventoryItem, notifiedUsers);
        }
      }
    }
  } catch (error) {
    console.error("Product update webhook error:", error.message);
  }
};

module.exports = {
  handleProductCreate,
  handleProductDelete,
  handleProductUpdate,
  handleOrderCreate,
};
