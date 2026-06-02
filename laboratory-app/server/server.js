// Load environment variable first
require("dotenv").config();
// Required
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Database connection
const sequelize = require("./src/config/database.js");

// Routes imports
const authRoutes = require("./src/routes/auth.routes.js");
const userRoutes = require("./src/routes/user.routes.js");
const alertRoutes = require("./src/routes/alert.routes.js");
const inventoryRoutes = require("./src/routes/inventory.routes.js");
const notificationRoutes = require("./src/routes/notification.routes.js");
const webhookRoutes = require("./src/routes/webhook.routes.js");
const redirectRoutes = require("./src/routes/redirect.routes.js");
const stockxRoutes = require("./src/routes/stockx.routes.js");
const adminRoutes = require("./src/routes/admin.routes.js");

// creates express application
const app = express();

// uses environment variable in production
const PORT = process.env.PORT || 5000;

// Adds secure HTTP headers for every response automatically
app.use(helmet());

// Allows the frontend to make requests to this backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// logs everything to the terminal
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/webhooks")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/api/webhooks", express.raw({ type: "application/json" }));

// any response starting with these URLs gets handed off to the matching route file
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/redirect", redirectRoutes);
app.use("/api/stockx", stockxRoutes);
app.use("/api/admin", adminRoutes);

// Confirmation that the server is running
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "The Laboratory API is running"
    })
})

// 404 handling
app.use((req, res) => {
    res.status(404).json({ error: "Route not found"});
});

// Global Error handler
app.use((err, req, res, next) => {
    console.error("Server error: ", err.message);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error"
    });
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to Supabase PostgreSQL");

        await sequelize.sync({ alter: false });
        console.log("Models synced");

        app.listen(PORT, () => {
            console.log(`Laboratory server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to database", err.message);
        process.exit(1);
    } 
}

startServer();

