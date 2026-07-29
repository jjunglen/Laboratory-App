import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreUser = async () => {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) return 

            try {
                setLoading(true);
                const response = await api.get("/auth/me");
                setUser(response.data.data);
                await registerPush();

            } catch(error) {
                console.error("Failed to restore user:", error);
                localStorage.removeItem("token");
                setToken(null);

            } finally {
                setLoading(false);

            }
        };

        restoreUser();

    }, []);


    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            const {token: newToken, user: userData} = res.data.data;

            setUser(userData);
            setToken(newToken);

            localStorage.setItem("token", newToken);
            await registerPush();


            return { success: true, user: userData};

        } catch(error) {
            return {
                success: false,
                error: error.response?.data?.error || "Login failed"

            }
        } finally {
            setLoading(false);

        }
    }

    const register = async (email, password, fullName) => {
        setLoading(true);

        try {
        const res = await api.post("/auth/register", {
            email,
            password,
            full_name: fullName,
        });
        const { token: newToken, user: userData } = res.data.data;

        setUser(userData);
        setToken(newToken);
        localStorage.setItem("token", newToken);

        return { success: true, user: userData};

        } catch(error) {
            return {
                success: false,
                error: error.response?.data?.error || "Registration failed",
            };

        } finally {
            setLoading(false);

        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");

    };

    const updateUser = (updatedFields) => {
        setUser((prev) => ({ ...prev, ...updatedFields }));

    }

    const registerPush = async () => {
      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window))
            return;

        const registration = await navigator.serviceWorker.register("/sw.js");
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const existing = await registration.pushManager.getSubscription();
        if (existing) {
            await api.post("/push/subscribe", existing.toJSON());
            return;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });

        await api.post("/push/subscribe", subscription.toJSON());
        console.log("Push notifications enabled");
        } catch (error) {
            console.error("Push registration error:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);

}