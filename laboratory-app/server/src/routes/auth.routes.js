
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { register, login, googleAuth, getMe, logout } = require("../controllers/auth.controller")

// Public routes no token
// POST /api/auth/register - create a new account
router.post("/register", register);

// POST /api/auth/login - login with email and password
router.post("/login", login);

// POST /api/auth/google - register with Google Auth
router.post("/google", googleAuth);

// Protected - token required
// GET /api/auth/me - get the current logged in user
router.get("/me", authenticateToken, getMe);

// POST /api/auth/logout
router.post("/logout", authenticateToken, logout);

module.exports = router;