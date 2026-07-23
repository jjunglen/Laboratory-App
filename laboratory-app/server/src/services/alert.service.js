const { Alert, Inventory, User } = require("../models/index.js");
const { sendNotification } = require("./notification.service.js");
const { parseVariantTitle } = require("../utils/parseVariantTitle.js");

// IS ALERT MATCH
// Single source of truth for all alert matching
const isAlertMatch = (alert, inventory) => {
  const skuMatch =
    alert.sku &&
    inventory.sku &&
    alert.sku.toLowerCase() === inventory.sku.toLowerCase();

  if (!skuMatch) {
    const alertWords = alert.shoe_name.toLowerCase().split(" ");
    const inventoryName = inventory.shoe_name.toLowerCase();
    const allWordsMatch = alertWords.every((word) =>
      inventoryName.includes(word),
    );

    if (!allWordsMatch) return false;

  }

  if (alert.size !== inventory.size) return false;

  if (
    alert.condition_preference !== "either" &&
    inventory.condition &&
    alert.condition_preference !== inventory.condition
  )
    return false;

  if (
    alert.box_preference !== "no_preference" &&
    inventory.box_status &&
    alert.box_preference === "original_good" &&
    inventory.box_status !== "original_good"
  )
    return false;

  if (alert.max_price && inventory.price > parseFloat(alert.max_price)) {
    return false;
  }

  return true;
};

// CHECK ALERTS FOR INVENTORY ITEM
// Takes an inventory item and checks all active
// alerts to see if any match
const checkAlertsForInventory = async (inventoryItem, notifiedUsers = new Set()) => {
  try {
    const activeAlerts = await Alert.findAll({
      where: { active: true },
      include: [{ model: User }],
    });

    let matchCount = 0;

    for (const alert of activeAlerts) {
      const matched = isAlertMatch(alert, inventoryItem);
      if (!matched) continue;
      if (notifiedUsers.has(alert.user_id)) continue;

      await sendNotification({ alert, inventory: inventoryItem });
      notifiedUsers.add(alert.user_id);
      matchCount++;
    }

    // After checking specific alerts, also check size alerts users
    const sizeAlertsUsers = await User.findAll({
      where: {
        notify_size_alerts: true,
      },
    });

    for (const user of sizeAlertsUsers) {
      if (notifiedUsers.has(user.id)) continue;
      const userSizes = user.sizes || [];
      if (!userSizes.includes(inventoryItem.size)) continue;

      // double notify if they already have a specific alerts for this shoe
      // edge case
      const alreadyNotified = activeAlerts.some(
        (a) => a.user_id === user.id && isAlertMatch(a, inventoryItem),
      );
      if (alreadyNotified) continue;

      // create a virtual alert for notification purposes
      await sendNotification({
        alert: {
          id: null,
          user_id: user.id,
          shoe_name: inventoryItem.shoe_name,
          size: inventoryItem.size,
          notify_email: user.notify_email,
          notify_inapp: user.notify_inapp,
          User: user,
        },
        inventory: inventoryItem,
      });
      notifiedUsers.add(user.id)
      matchCount++;
    }

    console.log(
      `Alert check complete — ${matchCount} matches found for ${inventoryItem.shoe_name}`,
    );
    return matchCount;
  } catch (error) {
    console.error("Check alerts for inventory error:", error.message);
    return 0;
  }
};


// GET USER ALERT STATS
const getUserAlertStats = async (userId) => {
  try {
    const totalAlerts = await Alert.count({ where: { user_id: userId } });
    const activeAlerts = await Alert.count({
      where: { user_id: userId, active: true },
    });
    const pausedAlerts = await Alert.count({
      where: { user_id: userId, active: false },
    });

    return { totalAlerts, activeAlerts, pausedAlerts };
  } catch (error) {
    console.error("Get user alert stats error:", error.message);
    return { totalAlerts: 0, activeAlerts: 0, pausedAlerts: 0 };
  }
};

module.exports = { checkAlertsForInventory, isAlertMatch, getUserAlertStats };
