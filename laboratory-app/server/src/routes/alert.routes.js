const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
} = require("../controllers/alert.controller.js");

// All alerts are protected - token required

// GET /api/alerts - get all alerts for the logged in user
router.get("/", authenticateToken, getAlerts);

// GET /api/alerts/:id - get a single alert by id
router.get("/:id", authenticateToken, getAlert);

// POST /api/alerts - create an alert
router.post("/", authenticateToken, createAlert);

// PUT /api/alerts/:id - update an existing alert
router.put("/:id", authenticateToken, updateAlert);

// DELETE /api/alerts/:id - delete an alert
router.delete("/:id", authenticateToken, deleteAlert);

module.exports = router;
