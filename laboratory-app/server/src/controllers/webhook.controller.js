const { Op } = require("sequelize");
const { User, Alert, AlertClick, Purchase } = require("../models/index.js");

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

const handleOrderCreate = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    res.status(200).json({ received: true });

    const customerEmail = data.email;
    const shopifyOrderId = String(data.id);
    const lineItems = data.line_items || [];

    if (!customerEmail) return;

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

    const user = await User.findOne({ where: { email: customerEmail } });

    if (!user) return;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - ATTRIBUTION_WINDOW_DAYS);

    const userAlerts = await Alert.findAll({
      where: { user_id: user.id },
    });
    const recentClicks = await AlertClick.findAll({
      where: { user_id: user.id, clicked_at: { [Op.gte]: cutoff } },
    });

    for (const item of lineItems) {
      const shoeName = item.title;
      const sku = item.sku || null;
      const price = parseFloat(item.price) || null;

      const matchedAlert = userAlerts.find((alert) => isItemMatch(alert, item));
      const matchedClick = recentClicks.find((click) =>
        isItemMatch(click, item),
      );

      if (!matchedAlert && !matchedClick) {
        continue;
      }

      await Purchase.create({
        user_id: user.id,
        alert_id: matchedAlert?.id || null,
        shopify_order_id: shopifyOrderId,
        shoe_name: shoeName,
        sku,
        size: item.variant_title?.split(" - ")?.[0] || null,
        price_paid: price,
        customer_email: customerEmail,
        purchased_at: new Date(data.created_at),
      });

      console.log(`Purchase attributed — ${shoeName} for ${customerEmail}`);
    }
  } catch (error) {
    console.error("Order create webhook error:", error.message);
  }
};

module.exports = { handleOrderCreate };
