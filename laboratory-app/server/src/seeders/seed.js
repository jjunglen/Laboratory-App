require("dotenv").config();
const { sequelize, User, Preference, Alert, Inventory } = require("../models/index.js");
const bcrypt = require("bcrypt");

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database...");

    await sequelize.sync({ force: false });
    console.log("Models synced...");

    // =============================================
    // USERS
    // =============================================
    const hashedPassword = await bcrypt.hash("Password1!", 10);

    const users = await User.bulkCreate([
      {
        email:        "jp@thelabdtx.com",
        password:     hashedPassword,
        full_name:    "JP",
        role:         "admin",
        notify_email: true,
        notify_inapp: true,
      },
      {
        email:        "jordan@test.com",
        password:     hashedPassword,
        full_name:    "Jordan Smith",
        role:         "user",
        notify_email: true,
        notify_inapp: true,
      },
      {
        email:        "mike@test.com",
        password:     hashedPassword,
        full_name:    "Mike Johnson",
        role:         "user",
        notify_email: true,
        notify_inapp: false,
      },
      {
        email:        "sarah@test.com",
        password:     hashedPassword,
        full_name:    "Sarah Williams",
        role:         "user",
        notify_email: false,
        notify_inapp: true,
      },
    ], { returning: true });

    console.log(`Seeded ${users.length} users...`);

    // =============================================
    // PREFERENCES
    // =============================================
    await Preference.bulkCreate([
      {
        user_id:   users[0].id,
        brands:    ["Nike", "Jordan"],
        sizes:     ["10M/11.5W", "10.5M/12W"],
        min_price: 0,
        max_price: 500,
      },
      {
        user_id:   users[1].id,
        brands:    ["Nike", "Jordan", "New Balance"],
        sizes:     ["9M/10.5W", "9.5M/11W"],
        min_price: 0,
        max_price: 300,
      },
      {
        user_id:   users[2].id,
        brands:    ["Adidas", "Nike"],
        sizes:     ["8M/9.5W", "8.5M/10W"],
        min_price: 0,
        max_price: 250,
      },
      {
        user_id:   users[3].id,
        brands:    ["Jordan", "Yeezy"],
        sizes:     ["7M/8.5W", "7.5M/9W"],
        min_price: 100,
        max_price: 600,
      },
    ]);

    console.log("Seeded preferences...");

    // =============================================
    // ALERTS
    // =============================================
    await Alert.bulkCreate([
      {
        user_id:              users[1].id,
        shoe_name:            "Air Jordan 4 Retro Bred Reimagined",
        sku:                  "FV5029-006",
        size:                 "10M/11.5W",
        max_price:            350,
        condition_preference: "either",
        box_preference:       "no_preference",
        notify_email:         true,
        notify_inapp:         true,
        active:               true,
      },
      {
        user_id:              users[1].id,
        shoe_name:            "Nike Dunk Low Retro Panda",
        sku:                  "DD1391-100",
        size:                 "9.5M/11W",
        max_price:            200,
        condition_preference: "brand_new",
        box_preference:       "original_good",
        notify_email:         true,
        notify_inapp:         true,
        active:               true,
      },
      {
        user_id:              users[2].id,
        shoe_name:            "New Balance 550 White Green",
        sku:                  "BB550WT1",
        size:                 "8M/9.5W",
        max_price:            150,
        condition_preference: "either",
        box_preference:       "no_preference",
        notify_email:         true,
        notify_inapp:         false,
        active:               true,
      },
      {
        user_id:              users[3].id,
        shoe_name:            "Air Jordan 1 Retro High OG Chicago Lost and Found",
        sku:                  "DZ5485-612",
        size:                 "7M/8.5W",
        max_price:            500,
        condition_preference: "pre_owned",
        box_preference:       "original_good",
        notify_email:         false,
        notify_inapp:         true,
        active:               true,
      },
    ]);

    console.log("Seeded alerts...");

    // =============================================
    // INVENTORY
    // =============================================
    await Inventory.bulkCreate([
      {
        shopify_product_id: "shopify_001",
        shopify_variant_id: "variant_001",
        shoe_name:          "Air Jordan 4 Retro Bred Reimagined",
        sku:                "FV5029-006",
        size:               "10M/11.5W",
        condition:          "brand_new",
        box_status:         "Original Box (Good)",
        price:              310.00,
        available:          1,
        shopify_url:        "https://thelabdtx.com/products/air-jordan-4-retro-bred-reimagined",
        image_url:          "https://images.stockx.com/images/Air-Jordan-4-Retro-Bred-Reimagined.jpg",
      },
      {
        shopify_product_id: "shopify_002",
        shopify_variant_id: "variant_002",
        shoe_name:          "Nike Dunk Low Retro Panda",
        sku:                "DD1391-100",
        size:               "9M/10.5W",
        condition:          "pre_owned",
        box_status:         "Original Box (Good)",
        price:              140.00,
        available:          1,
        shopify_url:        "https://thelabdtx.com/products/nike-dunk-low-retro-panda",
        image_url:          "https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021.jpg",
      },
      {
        shopify_product_id: "shopify_003",
        shopify_variant_id: "variant_003",
        shoe_name:          "New Balance 550 White Green",
        sku:                "BB550WT1",
        size:               "8M/9.5W",
        condition:          "brand_new",
        box_status:         "Replacement Box",
        price:              120.00,
        available:          1,
        shopify_url:        "https://thelabdtx.com/products/new-balance-550-white-green",
        image_url:          "https://images.stockx.com/images/New-Balance-550-White-Green.jpg",
      },
    ]);

    console.log("Seeded inventory...");
    console.log("Seed complete!");
    process.exit(0);

  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();