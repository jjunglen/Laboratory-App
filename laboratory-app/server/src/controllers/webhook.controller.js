const {
  Inventory,
  Alert,
  User,
  NotificationLog,
} = require("../models/index.js");
const { serverError } = require("../utils/response.js");

// Helper function that extracts size, condition, and box status
const parseVariantTitle = (variantTitle) => {
  const splitTitle = variantTitle.split(" - ").map((part) => part.trim());

  const size = splitTitle[0];
  const itemCondition = splitTitle[1] || null;
  const boxCondition = splitTitle[2] || "Original Box (Good)";

  // match condition to the ENUM value
  let condition = "either";
  if (itemCondition === "Brand New") condition = "brand_new";
  if (itemCondition === "Pre-Owned") condition = "pre_owned";

  return { size, condition, boxCondition };
};

// Maps box status string to our ENUM values
// Orginal Box (Good) maps to original_good
const boxStatus = (box) => {
  if (box === "Original Box (Good)") return "original_good";
  return "any";
};

// Helper function that checks if an alert match a shopify product
const isMatch = (alert, product, variant) => {
  const { size, condition, boxCondition } = parseVariantTitle(variant.title);

  // SKU match
  const skuMatch =
    alert.sku && variant.sku && alert.sku.toLowerCase() === variant.sku.toLowerCase();

  if (!skuMatch) {
    // SKU didnt match - try keyword
    const alertWords = alert.shoe_name.toLowerCase().split(" ");
    const productName = product.title.toLowerCase();
    const allWordsMatch = alertWords.every((word) =>
      productName.includes(word),
    );
    if (!allWordsMatch) return false;
  }

  // Size Match
  if (alert.size !== size) return false;

  // Condition Preference
  if (
    alert.condition_preference !== "either" &&
    alert.condition_preference !== condition
  )
    return false;

  // Box preference match
  if (alert.box_preference !== "no_preference") {
    const box = boxStatus(boxCondition);

    if (alert.box_preference === "original_good" && box !== "original_good") {
      return false;
    }
  }

  // Price match
  const price = parseFloat(variant.price);
  if (alert.max_price && price > parseFloat(alert.max_price)) return false;

  return true;
};

// HANDLE PRODUCT CREATE
// POST api/webhook/shopify/products/create
// Fires when a new shoe is listed on your shopify store
const handleProductCreate = async (req, res) => {
  try {
    // Parse raw body shopify sends
    const data = JSON.parse(req.body);

    // Shopify sends one product with multiple variants
    const variants = data.variants || [];

    // Save each size varient to the inventory table
    for (const variant of variants) {
        const { size } = parseVariantTitle(variant.title);

        await Inventory.upsert({
            shopify_product_id: String(data.id),
            shopify_variant_id: String(variant.id),
            shoe_name: data.title,
            sku: variant.sku || null,
            size: size,
            price: parseFloat(variant.price) || null,
            available: variant.inventory_quantity || 0,
            shopify_url: `https://thelabdtx.com/products/${data.handle}`,
            image_url: data.images?.[0]?.src || null,
            last_synced_at: new Date()
        });
    }

    // Respond 200 immediately so shopify knows we got it
    res.status(200).json({ received: true })

    // Get all active alerts
    const activeAlerts = await Alert.findAll({
        where: { active: true },
        include: [{ model: User }],
    });

    // Loop through each variant and check for matching alerts
    for (const variant of variants) {
        if (!variant.inventory_quantity || variant.inventory_quantity < 1) {
            continue;

        }

        for (const alert of activeAlerts) {
            const matchedAlert = isMatch(alert, data, variant);
            if (!matchedAlert) continue;

            // All checks passed - log notification
            const { size, condition, boxCondition } = parseVariantTitle(variant.title);
            
            await NotificationLog.create({
                user_id: alert.user_id,
                alert_id: alert.id,
                channel: alert.notify_email ? "email" : "in_app",
                message: `${data.title} in size ${size}`,
                read: false,
                sent_at: new Date(),
            });

            // TODO - send email via resend
            console.log(`Alert matched - notifying ${alert.User.email} for ${data.title} size ${size}`);

        }
    }
    } catch (error) {
        console.error("Producte create webhook error:", error.message);
    }
};


// Handle Product DELETE
// POST /api/webhooks/shopify/products/delete
// Fires when a shoe is sold and removed from your store
const handleProductDelete = async (req, res) => {
    try {
        const data = JSON.parse(req.body);

        const item = await Inventory.findOne({
            where: {shopify_product_id: String(data.id)},
        });

        if (item) {
            await item.update({
                available: 0,
                last_synced_at: new Date(),

            })
        }

        res.status(200).json({ received: true });
    
    } catch(error) {
        console.error("Product delete webhook error:", error.message);
    }
};

module.exports = { handleProductCreate, handleProductDelete };
