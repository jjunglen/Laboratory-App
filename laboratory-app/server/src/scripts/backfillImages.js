require("dotenv").config({ path: "../../.env" });
const { sequelize } = require("../config/database.js");
const { Inventory } = require("../models/index.js");

const STORE_URL = "https://thelabdtx.com";

async function fetchAllProducts() {
  let allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${STORE_URL}/products.json?limit=250&page=${page}`;
    console.log(`Fetching page ${page}...`);

    const res = await fetch(url);
    const data = await res.json();

    if (!data.products || data.products.length === 0) {
      hasMore = false;
    } else {
      allProducts = [...allProducts, ...data.products];
      page++;
      if (data.products.length < 250) hasMore = false;
    }
  }

  return allProducts;
}

async function backfillImages() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");

    const products = await fetchAllProducts();
    console.log(`Fetched ${products.length} products from Shopify`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      const imageUrl = product.images?.[0]?.src || null;
      if (!imageUrl) {
        skipped++;
        continue;
      }

      const shopify_product_id = String(product.id);

      const rows = await Inventory.findAll({
        where: { shopify_product_id },
      });

      if (rows.length === 0) {
        skipped++;
        continue;
      }

      for (const row of rows) {
        await row.update({ image_url: imageUrl });
        updated++;
      }
    }

    console.log(`Done — updated ${updated} rows, skipped ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("Backfill error:", err.message);
    process.exit(1);
  }
}

backfillImages();
