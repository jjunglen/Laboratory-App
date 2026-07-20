const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware.js");
const { getInventory, getInventoryItem, searchInventory } = require("../controllers/inventory.controller.js");

// Public routes = no token required
// Users can browse inventory without loggin in
// They only need a token when setting an alert

// GET /api/inventory = get all available inventory
router.get("/",authenticateToken, getInventory);

// GET /api/inventory/search - search inventory by name, brand, or sku
router.get("/search", authenticateToken, searchInventory);

// GET /api/inventory/:id - get a signle inventory item
router.get("/:id", authenticateToken, getInventoryItem);

module.exports = router;
