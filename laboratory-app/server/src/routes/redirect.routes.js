const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware.js");
const { trackRedirect } = require("../controllers/redirect.controller.js");

// GET /api/redirect - logs the click then redirectrs to shopify
router.get("/", trackRedirect);

// Placeholder — routes coming soon

module.exports = router;
