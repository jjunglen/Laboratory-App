const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

// user table stores all registered accounts
const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    auth_id: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        comment: "Supa auth user id - set on Google OAuth login",
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    sizes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Hashed with bcrypt - null if using Google OAuth",
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
    },
    notify_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    notify_inapp: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: "users",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    validate: {
        mustHaveAuth() {
            if (!this.password && !this.auth_id) {
                throw new Error ("User must have either a password or a Google auth id")
            }
        }
    }
});

module.exports = User;
