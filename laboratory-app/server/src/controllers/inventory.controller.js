const { Op } = require("sequelize");
const { Inventory } = require("../models/index.js");
const { success, notFound,  serverError } = require("../utils/response.js");

// GET INVENTORY
// GET /api/inventory
// Return all available inventory items
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findAll({
            where: {available: {[Op.gt]: 0}},
            order: [["created_at", "DESC"]],
        });

        return success(res, inventory);

    } catch (error) {
        console.error("Inventoryt retrieval error:", error.message);
        serverError(res);

    }
};

// GET INVENTORY ITEM
// GET /api/inventory/:id
// Returns a single inventory item by id
const getInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findByPk(req.params.id);

        if (!item ) {
            return notFound(res, "Inventory item not found");

        }

        return success(res, item);

    } catch(error) {
        console.error("Get inventory item error:", error.message);
        return serverError(res);

    }
};

// SEARCH INVENTORY
// GET /api/inventory/search?q=jordan&size=10M/11.5W&max_price=300
// Searches inventory by name, sku, or size with optional filters
const searchInventory = async (req, res) => {
    try {
        const {q, size, min_price, max_price } = req.query;

        // build search dynamically
        const where = { available: {[Op.gt]: 0} };

        // Search by name or sku if query is provided
        if (q) {
            where[Op.or] = [
                {shoe_name: { [Op.iLike]: `%${q}%` } },
                {sku: { [Op.iLike]: `%${q}%` } },
            ];
        }

        // Filter by size 
        if (size) {
            where.size = size;
        }

        // filter by price range if provided
        if (min_price) {
            where.price = {...where.price, [Op.gte]: min_price};

        }

        if (max_price) {
            where.price = {...where.price, [Op.lte]: max_price};

        }

        const results = await Inventory.findAll({
            where,
            order: [["created_at", "DESC"]],

        });

        return success(res, results);

    } catch(error) {
        console.error("Search inventory error:", error.message);
        return serverError(res);

    }
};

module.exports = { getInventory, getInventoryItem, searchInventory };

