const {
  AlertClick,
  Inventory,
  NotificationLog,
} = require("../models/index.js");

const trackRedirect = async (req, res) => {
  try {
    const { alert_id, inventory_id, notification_id } = req.query;

    if (!inventory_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing inventory_id" });
    }

    const item = await Inventory.findByPk(inventory_id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    if (item.available < 1) {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?tab=browse`);
    }

    const click = await AlertClick.create({
      user_id: req.user?.id || null,
      alert_id: alert_id !== "null" ? alert_id : null,
      notification_id: notification_id || null,
      shoe_name: item.shoe_name,
      sku: item.sku || null,
      size: item.size || null,
      clicked_at: new Date(),
    });

    // Mark the notification as read when the user clicks through it
    if (notification_id) {
      await NotificationLog.update(
        { read: true },
        { where: { id: notification_id } },
      );
    }

    const cartUrl = `https://thelabdtx.com/cart/${item.shopify_variant_id}:1?attributes[labsync_click_id]=${click.id}`;

    return res.redirect(cartUrl);
  } catch (error) {
    console.error("Track redirect error:", error.message);
    return res.status(500).json({ success: false, message: "Redirect failed" });
  }
};

module.exports = { trackRedirect };
