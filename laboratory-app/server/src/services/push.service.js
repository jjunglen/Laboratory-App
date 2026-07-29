const webpush = require("web-push");
const { PushSubscription } = require("../models/index.js");

webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
)

const sendPushNotification = async (userId, payload) => {
    try {
        const subscriptions = await PushSubscription.findAll({
            where: { user_id: userId},

        });

        const results = await Promise.allSettled(
            subscriptions.map((sub) => webpush.sendNotification(
                {
                    endpoint: sub.endpoint,
                    keys: { p256dh: sub.p256dh, auth: sub.auth },

                },
                JSON.stringify(payload)

                )
            )
        );

        // Removing expired subscriptions
        for (let i = 0; i < results.length; i++ ) {
            if (results[i].status === "rejected") {
                const status = results[i].reason?.statusCode;
                if (status === 410 || status === 404) {
                    await subscriptions[i].destroy();
                    console.log("Removed expired push notification");

                }
            }
        }

        return true;

    } catch(error) {
        console.error("Send push notification error:", error.message);
        return false;

    }
}

module.exports = { sendPushNotification };
