const { User, Alert, NotificationLog, Inventory, AlertClick, Purchase } = require("../models/index.js");
const { success, notFound, serverError, badRequest } = require("../utils/response.js");
const { Op, where } = require("sequelize");
const { getAllShopifyProducts } = require("../services/shopify.service.js");
const { parseVarientTitle } = require("../utils/parseVariantTitle.js");



//  GET ALL USERS
// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {exclude: ["password"] },
            order: [["created_at", "DESC"]],

        });

        return success(res, users);

    } catch(error) {
        console.error("Get all users error:", error.message);
        return serverError(res);

    }
}

// GET USER BY ID
// GET /api/admin/uisers/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
            include: [{ model: Alert }],
        });

        if (!user) {
            return notFound(res, "User not found");

        }

        return success(res, user);

    } catch(error) {
        console.error("Get user by id error:", error.message);
        return serverError(res);

    }
}

// DELETE USER
// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return notFound(res, "User not found");

        }

        // Prevent admin from deleting their own account
        if (user.id === req.user.id) {
            return serverError(res, "You cannot delete your own admin account");

        }
        
        // Cascade to alerts, preferences, notifications, and clicks
        await user.destroy();

        return success(res, null, "User deleted successfully");

    } catch(error) {
        console.error("Delete user error:", error.message);
        return serverError(res);

    }
};

// GET ALL ALERTS
// GET /api/admin/alerts
const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.findAll({
            include: [{
                model: User,
                attributes: ["id", "email", "full_name"],
            }],
            order: [["created_at", "DESC"]],
        });
        
        return success(res, alerts);

    } catch(error) {
        console.error("Get all alerts error:", error.message);
        return serverError(res);

    }
};

// GET STATS
// GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const [ totalUsers, totalAlerts, activeAlerts, totalNotifications, totalClicks, totalPurchases, totalInventory, purchasesViaApp ] = await Promise.all([
            User.count(),
            Alert.count(),
            Alert.count({ where: {active: true } }),
            NotificationLog.count(),
            AlertClick.count(),
            Purchase.count(),
            Inventory.count({ where: {available: {[Op.gt]: 0}}}),
            Purchase.count({ where: {alert_id: {[Op.ne]: null } } }),
        ]);

        return success(res, {
            totalUsers,
            totalAlerts,
            activeAlerts,
            totalNotifications,
            totalClicks,
            totalPurchases,
            totalInventory,
            purchasesViaApp,

        });

    } catch(error) {
        console.error("Get stats error:", error.message);
        return serverError(res);

    }
}

// MANUAL INVENTORY SYNC
// POST /api/admin/inventory/sync
const manualInventorySync = async (req, res) => {
    try {
        const products = await getAllShopifyProducts();

        if (!products.length) {
            return badRequest(res, "No products found in Shopify store");

        }

        await Inventory.update({ available: 0 }, {where: {}});

        for (const product of products) {
            for (const variant of product.variants) {
                const { size, condition, boxCondition } = parseVarientTitle(variant.title);

                await Inventory.upsert({
                    shopify_product_id: String(product.id),
                    shopify_variant_id: String(variant.id),
                    shoe_name: product.title,
                    sku: variant.sku || null,
                    size: size,
                    condition: condition,
                    box_status: boxCondition,
                    price: parseFloat(variant.price) || null,
                    available: variant.inventory_quantity || 0,
                    shopify_url: `https://thelabdtx.com/products/${product.handle}`,
                    image_url: product.images?.[0]?.src || null,
                    last_synced_at: new Date(),
                })
            }
        }

        return success(res, null, `Synced ${products.length} products from Shopify successfully`);

    } catch(error) {
        console.error("Manual inventory sync error:", error.message);
        return serverError(res);

    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    getAllAlerts,
    getStats,
    manualInventorySync,

};
