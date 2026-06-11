const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { searchCatalog } = require("../controllers/stockx.controller.js");

// All stockx routes are protected - token required

// GET /api/stockx/search?q=jordan+4+union
// Searches the stockx catalog and returns matching shoes
router.get("/search", authenticateToken, searchCatalog);

module.exports = router;
