import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, unreadCount, setUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}