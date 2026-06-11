const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");
const { getAllUsers, getUserById, deleteUser, getAllAlerts, getStats, manualInventorySync } = require("../controllers/admin.controller.js");

// All admin routes route require both a valid token and admin role

// Get /api/admin/users - get all registered users
router.get("/users", authenticateToken, requireAdmin, getAllUsers);

// GET /api/admin/users/:id - get a single user by id
router.get("/users/:id", authenticateToken, requireAdmin, getUserById);

// DELETE /api/admin/users/:id - delete a user
router.delete("/users/:id", authenticateToken, requireAdmin, deleteUser);

// GET /api/admin/alerts - get all alerts across all users
router.get("/alerts", authenticateToken, requireAdmin, getAllAlerts);

// GET /api/admin/stats - get app stats for the dashboard
router.get("/stats", authenticateToken, requireAdmin, getStats);

// POST /api/admin/inventory/sync - manually trigger an inventory sync
router.post("/inventory/sync", authenticateToken, requireAdmin, manualInventorySync);


module.exports = router;
