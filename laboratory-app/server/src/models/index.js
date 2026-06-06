const { sequelize } = require("../config/database.js");

// Import all models
const User = require("./User.js");
const Preference = require("./Preference.js");
const Alert = require("./Alert.js");
const Inventory = require("./Inventory.js");
const NotificationLog = require("./NotificationLog.js")
const AlertClick = require("./AlertClick.js");
const Purchase = require("./Purchase.js");

// Define the relationships between all models

// one to one
User.hasOne(Preference, { foreignKey: "user_id", onDelete: 'CASCADE'});
// ONE USER HAS MANY ALERTS
User.hasMany(Alert, { foreignKey: "user_id", onDelete: "CASCADE" });
// ONE USER HAS MANY NOTIFICATIONS LOGS
User.hasMany(NotificationLog, { foreignKey: "user_id", onDelete: "CASCADE" });
// one user has many alert clicks
User.hasMany(AlertClick, { foreignKey: "user_id", onDelete: "CASCADE" });
// ONE USAER HAS MANY PURCHASES
User.hasMany(Purchase, {foreignKey: "user_id", onDelete: "SET NULL" });

// BELONGS TO -- reverse associaitions
Preference.belongsTo(User, {foreignKey: "user_id" });
Alert.belongsTo(User, {foreignKey: "user_id" });
NotificationLog.belongsTo(User, {foreignKey: "user_id" });
AlertClick.belongsTo(User, {foreignKey: "user_id" });
Purchase.belongsTo(User, {foreignKey: "user_id" });

// Alert associations
// One alert has many notification logs
Alert.hasMany(NotificationLog, {foreignKey: "alert_id", onDelete: "SET NULL" })
// One alert has many alert clicks
Alert.hasMany(AlertClick, {foreignKey: "alert_id", onDelete: "SET NULL" })
// One alert has many purchases
Alert.hasMany(Purchase, {foreignKey: "alert_id", onDelete: "SET NULL" })

NotificationLog.belongsTo(Alert, { foreignKey: "alert_id" });
AlertClick.belongsTo(Alert, { foreignKey: "alert_id" });
Purchase.belongsTo(Alert, { foreignKey: "alert_id" });

// NotificationLog associations
// One notification log has many clicks
NotificationLog.hasMany(AlertClick, { foreignKey: "notification_id", onDelete: "SET NULL" });
AlertClick.belongsTo(NotificationLog, { foreignKey: "notification_id" });

// Inventory association
// One inventory item has many notification logs
Inventory.hasMany(NotificationLog, { foreignKey: "inventory_id", onDelete: "SET NULL"});
NotificationLog.belongsTo(Inventory, {foreignKey: "inventory_id" });

module.exports = {
    sequelize,
    User,
    Preference,
    Alert,
    Inventory,
    NotificationLog,
    AlertClick,
    Purchase,
};