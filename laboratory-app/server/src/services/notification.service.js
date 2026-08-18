const {
  NotificationLog,
  PendingNotification,
  Inventory,
} = require("../models/index.js");
const { Op } = require("sequelize");
const { sendPushNotification } = require("./push.service.js");

const sendNotification = async ({ alert, inventory }) => {
  try {
    const recentlyQueuedOrSent = await PendingNotification.findOne({
      where: { user_id: alert.user_id, inventory_id: inventory.id },
    });
    if (recentlyQueuedOrSent) {
      console.log(
        `Skipping duplicate — ${inventory.shoe_name} already queued/sent for this user`,
      );
      return false;
    }

    const recentEmail = await NotificationLog.findOne({
      where: {
        user_id: alert.user_id,
        inventory_id: inventory.id,
        channel: "email",
        sent_at: { [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });
    if (recentEmail) {
      console.log(
        `Skipping duplicate — ${inventory.shoe_name} already emailed to this user in the last hour`,
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

    await sendPushNotification(alert.user_id, {
      title: "Your shoe is in! 👟",
      body: message,
      icon: "/favicon.svg",
      url: redirectUrl,
    });

    if (alert.notify_email && alert.User) {
      await PendingNotification.create({
        user_id: alert.user_id,
        alert_id: alert.id,
        inventory_id: inventory.id,
        shoe_name: inventory.shoe_name,
        sku: inventory.sku,
        size: inventory.size,
        price: inventory.price,
        image_url: inventory.image_url || null,
        shopify_url: redirectUrl,
      });
    }

    console.log(
      `Notification processed for ${alert.User?.email} — ${inventory.shoe_name}`,
    );
    return true;
  } catch (error) {
    console.error("Send notification error:", error.message);
    return false;
  }
};

const sendPriceDropNotification = async ({ alert, inventory }) => {
  try {
    const recentlyQueuedOrSent = await PendingNotification.findOne({
      where: { user_id: alert.user_id, inventory_id: inventory.id },
    });
    if (recentlyQueuedOrSent) return false;

    const recentEmail = await NotificationLog.findOne({
      where: {
        user_id: alert.user_id,
        inventory_id: inventory.id,
        channel: "email",
        sent_at: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });
    if (recentEmail) return false;

    const redirectUrl = `${process.env.BACKEND_URL}/api/redirect?alert_id=${alert.id}&inventory_id=${inventory.id}`;
    const message = `Price drop! ${inventory.shoe_name} in size ${inventory.size} is now $${inventory.price} (was $${inventory.compare_at_price}) at The Laboratory DTX`;

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

    await sendPushNotification(alert.user_id, {
      title: "Price Drop! 🏷️",
      body: message,
      icon: "/favicon.svg",
      url: redirectUrl,
    });

    if (alert.notify_email && alert.User) {
      await PendingNotification.create({
        user_id: alert.user_id,
        alert_id: alert.id,
        inventory_id: inventory.id,
        shoe_name: inventory.shoe_name,
        sku: inventory.sku,
        size: inventory.size,
        price: inventory.price,
        image_url: inventory.image_url || null,
        shopify_url: redirectUrl,
      });
    }

    console.log(
      `Price drop notification processed for ${alert.User?.email} — ${inventory.shoe_name}`,
    );
    return true;
  } catch (error) {
    console.error("Send price drop notification error:", error.message);
    return false;
  }
};

module.exports = { sendNotification, sendPriceDropNotification };
