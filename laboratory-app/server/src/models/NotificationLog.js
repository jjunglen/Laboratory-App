const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database.js");

// Stores every notificiation sent to a user
const NotificationLog = sequelize.define("NotificationLog", {
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
        onDelete: "SET NULL",
    },
    inventory_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'inventory',
            key: "id"
        },
        onDelete: "SET NULL"
    },
    channel: {
        type: DataTypes.ENUM("email", "in_app"),
        allowNull: false,
        comment: "How the notification was sent",
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Whether the user has read the notification",
    },
    opened: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Whether the user opened the email"
    },
    sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,

    },
}, {
    tableName: "notification_logs",
    underscored: true,
    timestamps: false,
});

module.exports = NotificationLog;

4