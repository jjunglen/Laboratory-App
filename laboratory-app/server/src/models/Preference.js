const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

// Stores a user's general shoe perference
const Preference = sequelize.define("Preference", {
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
            key: "id"
        },
        onDelete: "CASCADE",
    },
    brands: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        comment: "e.g. ['Nike', 'Jordan', 'New Balance']"
    },
    sizes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        comment: "e.g. ['9M/10.5W', '10M/11.5W']"
    },
    min_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    
    },
    max_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
}, {
    tableName: 'preferences',
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Preference;
