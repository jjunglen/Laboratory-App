const { AlertClick, Inventory, NotificationLog } = require("../models/index.js");
const { badRequest, serverError } = require("../utils/response.js");

// TRACK REDIRECT
// GET /api/redirect?alert_id=123&inventory_id=456&notification_id=789
// Logs the click then redirects the user to the Shopify product page
const trackRedirect = async (req, res) => {
    try {
        const { alert_id, inventory_id, notification_id } = req.query;

        // inventory is required
        if (!inventory_id) {
            return badRequest(res, "Missing inventory_id");

        }

        // Find the inventory item to get the shopify URL
        const item = await Inventory.findByPk(inventory_id);

        if (!item) {
            return badRequest(res, "Inventory item not found");

        }

        // Log the click - the user is always logged in here
        if (req.user?.id) {
                await AlertClick.create({
                user_id: req.user?.id,
                alert_id: alert_id !== "null" ? alert_id: null,
                notification_id: notification_id || null,
                shoe_name: item.shoe_name,
                sku: item.sku || null,
                size: item.size || null,
                clicked_at: new Date(),

            })
         }

        // Mark the notification as read when the user clicks the link
        if (notification_id) {
            await NotificationLog.update(
                { read: true },
                { where: { id: notification_id } },
            );
        }

        // redirect the user to the shopify product page
        return res.redirect(item.shopify_url);
        
    } catch(error) {
        console.error("Track redirect error:", error.message);
        return serverError(res);

    }
}

module.exports = { trackRedirect };
