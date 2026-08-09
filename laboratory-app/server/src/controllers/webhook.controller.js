const { Inventory, Alert, User, Purchase } = require("../models/index.js");
const { parseVariantTitle } = require("../utils/parseVariantTitle.js");
const { checkAlertsForInventory, checkPriceDropAlerts } = require("../services/alert.service.js");
const { Op } = require("sequelize")

// HANDLE PRODUCT CREATE
// POST /api/webhooks/shopify/products/create
const handleProductCreate = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const variants = data.variants || [];

    // Save each variant to inventory
    for (const variant of variants) {
      const { size, condition, boxCondition } = parseVariantTitle(
        variant.title,
        data.handle
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

    // Respond 200 immediately
    res.status(200).json({ received: true });

    // Shared set across all variants - one email per
    const notifiedUsers = new Set();

    // Check alerts for each variant
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
      { where: { shopify_product_id: String(data.id) } }
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

    console.log("Order source:", data.source)
    console.log("Landing site:", data.landing_site);
    console.log("Referring site:", data.referring_site);
    console.log("Customer email:", data.email);
    
  } catch (error) {
    console.error("Order create webhook error:", error.message);
  }
};

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

    const notifiedUsers = new Set();

    // Check regular alerts
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

    // Check price drop alerts
    if (priceDropVariants.length > 0) {
      for (const {
        variant,
        size,
        newPrice,
        compareAtPrice,
      } of priceDropVariants) {
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


module.exports = { handleProductCreate, handleProductDelete, handleProductUpdate, handleOrderCreate };
