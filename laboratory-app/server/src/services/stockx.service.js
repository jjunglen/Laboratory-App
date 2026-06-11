require("dotenv").config();
const fetch = require("node-fetch");

// Stockx api base URL
const STOCKX_BASE_URL = "https://api.stockx.com/v2";

// Stores the OAuth token in memory
// Token expires every hour so track when it was issued
let cachedToken = null;
let tokenExpiresAt = null;

// Stockx uses OAuth to generate a Bearer token
const getAccessToken = async () => {
    if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
        return cachedToken;

    }

    // request a new token from Stockx
    const response = await fetch("https://accounts.stockx.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            client_id: process.env.STOCKX_CLIENT_ID,
            client_secret: process.env.STOCKX_CLIENT_SECRET,
            audience: "gateway.stockx.com",
            grant_type: "client_credentials",
        }),
    });

    const data = await response.json();

    if (!data.access_token) {
        throw new Error("Failed to get Stockx access token");

    }

    // Cache the token and set expiry to 55 minutes from now
    // Stockx token lasts 1 hour but make it refresh at 55 minutes
    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + 55 * 60 * 1000;

    return cachedToken;

};

// Search catalog

// searches the stockx catalog by name or sku
// returns an array of matching product with name, image, colorway, sku, and product id
const searchStockX = async (query, pageSize = 10) => {
    // Get a valid access token
    const token = await getAccessToken();

    // Hit the stockx catalog search endpoint
    const response = await fetch(`${STOCKX_BASE_URL}/catalog/search?query=${encodeURIComponent(query)}&pageNumber=1&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "x-api-key": process.env.STOCKX_API_KEY,
            "Content-Type": "application/json",

        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Stockx search failed");

    }

    return data.products || [];

};

module.exports = { searchStockX };

