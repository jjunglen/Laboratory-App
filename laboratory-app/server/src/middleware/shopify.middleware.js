const crypto = require("crypto");
const { unauthorized } = require("../utils/response.js");

// Verify if the incoming webhook is from shopify
const verifyShopifyWebhook = (req, res, next) => {
    try {
        // Get the shopify HMAC signature
        const shopifySig = req.headers["x-shopify-hmac-sha256"];

        // validation
        if (!shopifySig) {
            return unauthorized(res, "Missing Shopify signature");

        }

        // Create own signature using the raw body and our webhook secret
        const generateSig = crypto.createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET).update(req.body).digest("base64");

        // Compare the two signatures safely
        const shopifyBuffer = Buffer.from(shopifySig, "base64");
        const generatedBuffer = Buffer.from(generateSig, "base64");

        if (shopifyBuffer.length !== generatedBuffer.length || !crypto.timingSafeEqual(shopifyBuffer, generatedBuffer)) {
            return unauthorized(res, "Invalid Shopify signature")
        }

        next();
    } catch(error) {
        return unauthorized(res, "Webhook verification failed");
    }
};

module.exports = { verifyShopifyWebhook };