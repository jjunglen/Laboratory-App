const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware.js");
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/user.controller.js");

// ALl user routes are protected

// GET /api/users/profile - get the logged in user's profile
router.get("/profile", authenticateToken, getProfile);

// PUT /api/users/profile - update the logged in user's profile
router.put("/profile", authenticateToken, updateProfile);

// DELETE /api/users/profile - delete the logged in user's account
router.delete("/profile", authenticateToken, deleteAccount);

module.exports = router;
