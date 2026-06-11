const { searchStockX } = require("../services/stockx.service.js");
const { success, badRequest, serverError } = require("../utils/response.js");

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

    } catch(error) {
        console.error("Stockx search error:", error.message);
        return serverError(res);

    }
};

module.exports = { searchCatalog };
