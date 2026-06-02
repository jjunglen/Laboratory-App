const express = require("express");
const router = express.Router();

// Placeholder — routes coming soon
router.get("/", (req, res) => {
  res.status(200).json({ message: "Route is connected" });
});

module.exports = router;
