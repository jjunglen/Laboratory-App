const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { searchCatalog, handleOAuthCallback, getAuthUrl, cacheImage } = require("../controllers/stockx.controller.js");

// All stockx routes are protected - token required

// GET /api/stockx/search?q=jordan+4+union
// Searches the stockx catalog and returns matching shoes
router.get("/search", authenticateToken, searchCatalog);

// OAuth flow - no auth token needed for these
// GET /api/stockx/auth - redirects to stockx login
router.get("/auth", getAuthUrl);

// GET /api/stockx/callback - StockX redirects here after login
router.get("/callback", handleOAuthCallback);

// POST /api/stockx/image-cache - save a confirmed working image URL
router.post("/image-cache", authenticateToken, cacheImage);



module.exports = router;
