const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

// Stores confirmed purchases matched via shopify orders/create webhooks
const Purchase = sequelize.define("Purchase", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "SET NULL",
        comment: "Nullable is case customer email does not match a registered user",

    },
    alert_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: "alerts",
            key: "id",
        },
        onDelete: "SET NULL"
    },
    shopify_order_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "unique order id from shopify",
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
    price_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    customer_email: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "From shopify order payload -- used to match registered users",
    },
    purchased_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

}, {
    tableName: "purchases",
    underscored: true,
    timestamps: false,
});

module.exports = Purchase;