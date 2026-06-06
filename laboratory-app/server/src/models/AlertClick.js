const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

// Stores every time a user clicks a notification link
const AlertClick = sequelize.define("AlertClick", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    alert_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: "alerts",
            key: "id",
        },
        onDelete: 'SET NULL',
    },
    notification_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: "notification_logs",
            key: "id"
        },
        onDelete: "SET NULL"
    },
    shoe_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    clicked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "alert_clicks",
    underscored: true,
    timestamps: false
});

module.exports = AlertClick;