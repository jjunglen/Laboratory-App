const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const PushSubscription = sequelize.define("PushSubscription", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,

    },
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,

    }, 
    endpoint: {
        type: DataTypes.TEXT,
        allowNull: false,

    },
    p256dh: {
        type: DataTypes.TEXT,
        allowNull: false,

    },
    auth: {
        type: DataTypes.TEXT,
        allowNull: false,

    },

}, {
    tableName: "push_subscriptions",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,

});

module.exports = PushSubscription;
