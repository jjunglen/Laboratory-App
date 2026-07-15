require("dotenv").config();
const fetch = require("node-fetch");
const { format } = require("sequelize/lib/utils");

const SHOPIFY_BASE_URL = `${process.env.SHOPIFY_STORE_URL}/admin/api/2026-04`;

// GET ALL PRODUCTS
const getAllShopifyProducts = async () => {
  try {
    const response = await fetch(
      `${SHOPIFY_BASE_URL}/products.json?limit=250`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors || "Failed to fetch Shopify products");
    }

    return data.products || [];
  } catch (error) {
    console.error("Get all shopify products products error:", error.message);
    return [];
  }
};

// GET SINGLE PRODUCT
// Fetch a single product by Shopify product id
const getShopifyProduct = async (productId) => {
  try {
    const response = await fetch(
      `${SHOPIFY_BASE_URL}/products/${productId}.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors || "Failed to getch Shopify product");
    }

    return data.product || null;
  } catch (error) {
    console.error("Get Shopify product error:", error.message);
    return null;
  }
};

// REGISTER WEBHOOKS
// Registers product/create and product/delte webhooks
const registerShopifyWebhooks = async (backendUrl) => {
  try {
    const webhooks = [
      {
        topic: "products/create",
        address: `${backendUrl}/api/webhooks/shopify/products/create`,
        format: "json",
      },
      {
        topic: "products/delete",
        address: `${backendUrl}/api/webhooks/shopify/products/delete`,
        format: "json",
      },
      {
        topic: "products/update",
        address: `${backendUrl}/api/webhooks/shopify/products/delete`,
        format: "json"
      },
    ];

    for (const webhook of webhooks) {
      const response = await fetch(`${SHOPIFY_BASE_URL}/webhooks.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhook }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          `Failed to register webhook ${webhook.topic}:`,
          data.errors,
        );
      } else {
        console.log(`Webhook registered: ${webhook.topic}`);
      }
    }

    return true;
  } catch (error) {
    console.error("Register Shopify webhooks error:", error.message);
    return false;
  }
};

module.exports = {
  getAllShopifyProducts,
  getShopifyProduct,
  registerShopifyWebhooks,
};
