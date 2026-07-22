require("dotenv").config();
const { NotificationLog } = require("../models/index.js");
const { sendAlertEmail } = require("./email.service.js");

// Creates a notification log entry and sends
const sendNotification = async ({ alert, inventory }) => {
  try {
    // redirect tracking URL
    const redirectUrl = `${process.env.BACKEND_URL}/api/redirect?alert_id=${alert.id}&inventory_id=${inventory.id}`;

    // Build the notification message
    // inventory already has clean data from the webhook upsert
    const message = `${inventory.shoe_name} in size ${inventory.size} is now available for $${inventory.price} at The Laboratory DTX`;

    // Creates in-app notification
    if (alert.notify_inapp) {
      await NotificationLog.create({
        user_id: alert.user_id,
        alert_id: alert.id,
        inventory_id: inventory.id,
        channel: "in_app",
        message,
        read: false,
        sent_at: new Date(),
      });
    }

    // Sends email notification
    if (alert.notify_email && alert.User) {
      const emailSent = await sendAlertEmail({
        to: alert.User.email,
        shoe_name: inventory.shoe_name,
        size: inventory.size,
        condition: inventory.condition || "brand_new",
        boxCondition: inventory.boxCondition || "Original Box (Good)",
        price: inventory.price,
        shopify_url: redirectUrl,
        image_url: inventory.image_url || null,
        
      });

      // Logs the email notification
      if (emailSent) {
        await NotificationLog.create({
          user_id: alert.user_id,
          alert_id: alert.id,
          inventory_id: inventory.id,
          channel: "email",
          message,
          read: false,
          sent_at: new Date(),
        });
      }
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
