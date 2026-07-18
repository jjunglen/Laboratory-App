const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

// Stores a specific shoe alert a user has set
const Alert = sequelize.define("Alert", {
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
        onDelete: "CASCADE"
    },
    stockx_product_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Stockx catalog product id",
    },
    shoe_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: true,

    },
    stockx_url_key: {
        type: DataTypes.STRING,
        allowNull: true,
        
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    condition_preference: {
        type: DataTypes.ENUM("brand_new", "pre_owned", "either"),
        defaultValue: "either",
    },
    box_preference: {
        type: DataTypes.ENUM("original_good", "any", "no_preference"),
        defaultValue: "no_preference",
    },
    max_price: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true,
        comment: "User's maximum price -- null means no limit"
    },
    notify_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    notify_inapp: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: "Users can pause or delete alerts"
    }
}, {
    tableName: "alerts",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});


module.exports = Alert;
