const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware.js");
const { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = require("../controllers/notification.controller.js");

// All notifications routes are protected - token required

// GET /api/notifications - get all notifications for the logged in user
router.get("/", authenticateToken, getNotifications);

// PUT /api/notifications/:id/read - mark a single notification as read
router.put("/:id/read", authenticateToken, markAsRead);

//  PUT /api/notifications/read-all - mark all notifications as read
router.put("/read-all", authenticateToken, markAllAsRead);

// DELETE /api/notifications/:id - delete a single notification
router.delete("/:id", authenticateToken, deleteNotification);

// DELETE /api/notifications - delete all notifications
router.delete("/", authenticateToken, deleteAllNotifications);



module.exports = router;
