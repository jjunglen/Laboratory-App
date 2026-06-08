const { NotificationLog } = require("../models/index.js");
const { success, notFound, forbidden, serverError } = require("../utils/response.js");

// GET NOTIFICATIONS
// GET /api/notifications
// Returns all notifications for logged in user
const getNotifications = async (req, res) => {
    try {
        const notifications = await NotificationLog.findAll({
            where: {user_id: req.user.id},
            order: [["sent_at", "DESC"]],
        });

        return success(res, notifications);


    } catch (error) {
        console.error("Get notifications error:", error.message);
        return serverError(res);
    
    }
};

// MARKS single notification as READ
// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        const notification = await NotificationLog.findByPk(req.params.id);

        if (!notification) {
            return notFound(res, "Notification not found");

        }

        // Makes sure the notification belongs to the logged user
        if (notification.user_id !== req.user.id) {
            return forbidden(res, "Access denied");

        }

        await notification.update({ read: true });

        return success(res, notification, "Notification marked as read");

    } catch(error) {
        console.error("Mark as read error:", error.message);
        return serverError(res);

    }
};

// MARK ALL AS READ
// PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
    try {
        await NotificationLog.update(
            { read: true},
            { where: {user_id: req.user.id, read: false}},
        );

        return success(res, null, "All notifications marked as read");

    } catch (error) {
        console.error("Mark all as read error", error.message);
        return serverError(res);

    }
};

// DELETE NOTIFICATION
// DELETE /api/noptifications/:id
// Deletes a single notification
const deleteNotification = async (req, res) => {
    try {
        const notification = await NotificationLog.findByPk(req.params.id);

        if (!notification) {
            return notFound(res, "Notification not found");

        }

        // Make sure the notification belongs to the logged in user
        if (notification.user_id !== req.user.id) {
            return forbidden(res, "Access denied");

        }

        await notification.destroy();

        return success(res, null, "Notification deleted successfully");

    } catch(error) {
        console.error("Delete notification error:", error.message);
        return serverError(res);

    }
}

// Destroy ALL NOTIFICATIONS
// DELETE /api/notifications
const deleteAllNotifications = async (req, res) => {
    try {
        await NotificationLog.destroy({
            where: {user_id: req.user.id},

        })

        return success(res, null, "All notifications deleted successfully");

    } catch(error) {
        console.error("Delete all notifications error:", error.message);
        return serverError(res);

    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,

};
