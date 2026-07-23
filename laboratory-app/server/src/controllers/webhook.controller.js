const { Inventory, Alert, User } = require("../models/index.js");
const { parseVariantTitle } = require("../utils/parseVariantTitle.js");
const { checkAlertsForInventory } = require("../services/alert.service.js");

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

    const item = await Inventory.findOne({
      where: { shopify_product_id: String(data.id) },
    });

    if (item) {
      await item.update({
        available: 0,
        last_synced_at: new Date(),
      });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Product delete webhook error:", error.message);
  }
};

const handleProductUpdate = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const variants = data.variants || [];
    const imageUrl = data.images?.[0]?.src || null;

    for (const variant of variants) {
      const { size, condition, boxCondition } = parseVariantTitle(
        variant.title,
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
        image_url: imageUrl,
        last_synced_at: new Date(),
      });
    }

    res.status(200).json({ received: true });

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
  } catch (error) {
    console.error("Product update webhook error:", error.message);
  }
};


module.exports = { handleProductCreate, handleProductDelete, handleProductUpdate };
