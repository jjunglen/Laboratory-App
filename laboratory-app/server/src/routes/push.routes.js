const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/admin.middleware");
const { subscribe, unsubscribe } = require("../controllers/push.controller");


router.post("/subscribe", authenticateToken, subscribe);
router.delete("/subscribe", authenticateToken, unsubscribe);

module.exports = router;
