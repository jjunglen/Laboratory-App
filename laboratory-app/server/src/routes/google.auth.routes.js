const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const { googleCallback } = require("../controllers/google.auth.controller.js");

// GET /api/auth/google - redirect to Google login
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    }),
);

// GET /api/auth/google/callback - Google redirects here
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/auth?error=google_failed",
    }),
    googleCallback,
);

module.exports = router;
