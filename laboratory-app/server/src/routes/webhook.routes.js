const express = require("express");
const router = express.Router();
const { verifyShopifyWebhook } = require("../middleware/shopify.middleware.js");
const { handleProductCreate, handleProductDelete } = require("../controllers/webhook.controller.js");

// All webhooks are verified by Shopify HMAC signature

// POST //api/webhooks/shopify/products - fires when a new product is added
router.post("/shopify/products/create", verifyShopifyWebhook, handleProductCreate);

// POST /api/webhooks/shopify/inventory - fires when stock level
router.post("/shopify/products/delete", verifyShopifyWebhook, handleProductDelete);

module.exports = router;
