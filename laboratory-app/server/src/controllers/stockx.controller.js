const { searchStockX } = require("../services/stockx.service.js");
const { success, badRequest, serverError } = require("../utils/response.js");
const fetch = require("node-fetch");

// GET AUTH URL
// GET /api/stockx/auth
// Redirects to Stockx login page
const getAuthUrl = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.STOCKX_CLIENT_ID,
    redirect_uri: `${process.env.BACKEND_URL}/api/stockx/callback`,
    response_type: "code",
    scope: "offline_access",
    audience: "gateway.stockx.com",
  });

  console.log(
    "redirect_uri:",
    `${process.env.BACKEND_URL}/api/stockx/callback`,
  );
  res.redirect(`https://accounts.stockx.com/authorize?${params.toString()}`);
};

// HANDLE OAUTH CALLBACK
// GET /api/stockx/callback
// StockX redirects here after loginwith an auth code
const handleOAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("<h2>Error - missing code from StockX</h2>");
  }

  try {
    const response = await fetch("https://accounts.stockx.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: process.env.STOCKX_CLIENT_ID,
        client_secret: process.env.STOCKX_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.BACKEND_URL}/api/stockx/callback`,
      }),
    });

    const data = await response.json();
    console.log("StockX OAuth response:", data);

    if (data.refresh_token) {
      res.send(`
            <html>
            <body style="font-family: monospace; padding: 40px; background: #0a0a0a; color: white;">
                <h2 style="color: #3b82f6;">StockX OAuth Success</h2>
                <p>Copy this refresh token and add it to your Railway environment variables as <strong>STOCKX_REFRESH_TOKEN</strong>:</p>
                <div style="background: #111; border: 1px solid #27272a; padding: 16px; border-radius: 8px; margin: 16px 0; word-break: break-all;">
                ${data.refresh_token}
                </div>
                <p style="color: #71717a;">Also add the access token as <strong>STOCKX_ACCESS_TOKEN</strong> for immediate use:</p>
                <div style="background: #111; border: 1px solid #27272a; padding: 16px; border-radius: 8px; word-break: break-all;">
                ${data.access_token}
                </div>
            </body>
            </html>
            `);
    } else {
      res.send(`
            <html>
            <body style="font-family: monospace; padding: 40px; background: #0a0a0a; color: white;">
                <h2 style="color: #ef4444;">StockX OAuth Failed</h2>
                <pre style="background: #111; padding: 16px; border-radius: 8px;">${JSON.stringify(data, null, 2)}</pre>
            </body>
            </html>
            `);
    }
  } catch (error) {
    console.error("StockX OAuth callback error:", error.message);
    res.status(500).send(`<h2>Server error: ${error.message}`);
  }
};

// SEARCH Catalog
// GET api/stockx/search?q=jordan+4+union
// Searches stockx catalog and returns matching shoes
const searchCatalog = async (req, res) => {
  try {
    const { q } = req.query;

    // Search query is required
    if (!q) {
      return badRequest(res, "Missing search query");
    }

    const results = await searchStockX(q);

    return success(res, results);
  } catch (error) {
    console.error("Stockx search error:", error.message);
    return serverError(res);
  }
};

module.exports = {
  searchCatalog,
  handleOAuthCallback,
  getAuthUrl,
};
