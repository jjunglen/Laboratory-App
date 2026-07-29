self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    const title = data.title || "Lab Sync";
    const options = {
        body: data.body || "YOu have a new notification",
        icon: data.icon || "/favicon.svg",
        badge: "/favicon.svg",
        data: { url: data.url },

    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "dashboard";
    event.waitUntil(
        clients.matchAll({ type: "window"}).then((clientList) => {
            for (const client of clientList) {
                if (client.url === url && "focus" in client) return client.focus();

            }
            if (clients.openWindow) return clients.openWindow(url);

        })
    )
})