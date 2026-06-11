require("dotenv").config();
const { registerShopifyWebhooks } = require("../services/shopify.service");

const run = async () => {
    console.log("Registering Shopify webhooks...");

    const success = await registerShopifyWebhooks("https://laboratory-backend.up.railway.app");

    if (success) {
        console.log("Webhooks registered successfully!");
    } else {
        console.log("Failed to register webhooks — check your Shopify API key");
    }

  process.exit(0);
};

run();
