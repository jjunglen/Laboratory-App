const { Alert, Inventory } = require("../models/index.js");
const { isValidSize, isValidPrice, requireFields } = require("../utils/validate.js");
const { success, created, badRequest, notFound, forbidden, serverError } = require("../utils/response.js");
const { getUserAlertStats } = require("../services/alert.service.js");

// GET ALERTS
// GET /api/alerts
// Returns all alerts for the logged in user
const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.findAll({
            where: {user_id: req.user.id},
            order: [["created_at", "DESC"]],
        });

        const stats = await getUserAlertStats(req.user.id);

        return success(res, {alerts, stats});

    } catch(error) {
        console.error("Get alerts error:", error.message);
        return serverError(res);
    }
}

// GET ALERT
// GET /api/alerts/:id
// Returns a single alert by id
const getAlert = async (req, res) => {
    try {
        const alert = await Alert.findByPk(req.params.id);

        if (!alert) {
            return notFound(res, "Alert not found");
        }

        // Make sure the alert belongs to the logged in user
        if (alert.user_id !== req.user.id) {
            return forbidden(res, "Access denied");

        }

        return success(res, alert);


    } catch (error) {
        console.error("Get alert error:", error.message);
        return serverError(res)
    }
};

// CREATE Alert
// POST /api/alerts
// Create a new alert for the logged in user
const createAlert = async (req, res) => {
    try {

        const { shoe_name, sku, size, max_price, notify_email, notify_inapp, stockx_product_id, stockx_url_key } = req.body;

        // Check required fields
        const missing = requireFields(req.body, ["shoe_name", "size"]);
        if (missing.length > 0) {
            return badRequest(res, "Invalid shoe preference");

        }

        // Validate price if applicable
        if (max_price && !isValidPrice(max_price)) {
            return badRequest(res, "Invalid price");

        }

        // Checks if user has an active alert for this shoe and size
        const existingAlert = await Alert.findOne({
            where: {
                user_id: req.user.id,
                shoe_name,
                size,
                active: true,

            },
        });

        if (existingAlert) {
            return badRequest(res, "You already have an active alert for this shoe and size")
        }

        // Create an alert
        const alert = await Alert.create({
            user_id: req.user.id,
            shoe_name,
            size,
            sku: sku || null,
            max_price: max_price || null,
            notify_email: notify_email ?? true,
            notify_inapp: notify_inapp ?? true,
            stockx_product_id: stockx_product_id || null,
            stockx_url_key: stockx_url_key || null,

        });

        return created(res, alert, "Alert created successfully");


    } catch(error) {
        console.error("Create alert error:", error.message);
        return serverError(res);
    }
};

// UPDATE ALERT
// PUT /api/alert/:id
// Update an existing alert
const updateAlert = async (req, res) => {
    try {
        const alert = await Alert.findByPk(req.params.id);

        if (!alert) {
            return notFound(res, "Alert not found");

        }

        // validate its the correct user
        if (alert.user_id !== req.user.id) {
            return forbidden(res, "Accessed denied");

        }

        const { size, max_price, notify_email, notify_inapp, active } = req.body;

        // Validate size if being changed
        if (size && !isValidSize(size)) {
            return badRequest(res, "Invalid shoe size");

        }

        // validate price if being changed
        if (max_price && !isValidPrice(max_price)) {
            return badRequest(res, "Invalid price");

        }

        // update the alert
        await alert.update({
            size: size ?? alert.size,
            max_price: max_price ?? alert.max_price,
            notify_email: notify_email ?? alert.notify_email,
            notify_inapp: notify_inapp ?? alert.notify_inapp,
            active: active ?? alert.active,
        });

        return success(res, alert, "Alert updated successfully");

    } catch(error) {
        console.error("Update alert error:", error.message);
        return serverError(res);
    }
};

// DELETE ALERT
// DELETE /api/alerts/:id
// Delete an alert
const deleteAlert = async (req, res) => {
    try {
        const alert = await Alert.findByPk(req.params.id);

        if (!alert) {
            return notFound(res, "Alert not found");
        }

        // Validate the alert belongs to the logged in user
        if (alert.user_id !== req.user.id) {
            return forbidden(res, "Access denied");

        }

        await alert.destroy();

        return success(res, null, "Alert deleted successfully");       

    } catch (error) {
        console.error("Delete alert error:", error.message);
        return serverError(res);
    }
};

module.exports = { getAlert, getAlerts, createAlert, updateAlert, deleteAlert };
