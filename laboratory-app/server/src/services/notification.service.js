const { NotificationLog, Inventory } = require("../models/index.js");
const { Op } = require("sequelize");
const { sendAlertEmail } = require("./email.service.js");

const sendNotification = async ({ alert, inventory }) => {
  try {
    // Check if we already sent a notification for this shoe to this user in the last hour
    const recentNotification = await NotificationLog.findOne({
      where: {
        user_id: alert.user_id,
        message: { [Op.iLike]: `%${inventory.shoe_name}%` },
        sent_at: { [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) }, // last 1 hour
      },
    });

    if (recentNotification) {
      console.log(
        `Skipping duplicate notification for ${alert.User?.email} — already notified about ${inventory.shoe_name} recently`,
      );
      return false;
    }

    const redirectUrl = `${process.env.BACKEND_URL}/api/redirect?alert_id=${alert.id}&inventory_id=${inventory.id}`;
    const message = `${inventory.shoe_name} in size ${inventory.size} is now available for $${inventory.price} at The Laboratory DTX`;

    if (alert.notify_inapp) {
      await NotificationLog.create({
        user_id: alert.user_id,
        alert_id: alert.id,
        inventory_id: inventory.id,
        channel: "in_app",
        message,
        image_url: inventory.image_url || null,
        read: false,
        sent_at: new Date(),
      });
    }

    if (alert.notify_email && alert.User) {
      const emailSent = await sendAlertEmail({
        to: alert.User.email,
        shoe_name: inventory.shoe_name,
        size: inventory.size,
        condition: inventory.condition || "brand_new",
        boxCondition: inventory.box_status || "Original Box",
        price: inventory.price,
        shopify_url: redirectUrl,
        image_url: inventory.image_url || null,
      });
    }

    console.log(
      `Notification sent to ${alert.User?.email} for ${inventory.shoe_name}`,
    );
    return true;
  } catch (error) {
    console.error("Send notification error:", error.message);
    return false;
  }
};

module.exports = { sendNotification };
