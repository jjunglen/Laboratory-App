const { PushSubscription } = require("../models/index.js");
const { success, serverError } = require("../utils/response.js");

// Subscripe
// POST /api/push/subscribe
const subscribe = async (req, res) => {
    try {
        const { endpoint, keys } = req.body;
        const { p256dh, auth } = keys;

        await PushSubscription.upsert({
            user_id: req.user.id,
            endpoint,
            p256dh,
            auth,

        });
        return success(res, null, "Subscribed to push notifications");

    } catch(error) {
        console.error("Subscribe error: ", error.message);
        return serverError(res);

    }
};

// Unsubscribe
// DELETE /api/push/subscribe
const unsubscribe  = async (req, res) => {
    try {
        const { endpoint } = req.body;
        await PushSubscription.destroy({
            where: { user_id: req.user.id, endpoint },

        });
        return success(res, null, "Unsubscribe from push notifications");

    } catch (error ) {
        console.error("Unsubscribe error: ", error.message);
        return serverError(res);

    }
};

module.exports = { subscribe, unsubscribe };