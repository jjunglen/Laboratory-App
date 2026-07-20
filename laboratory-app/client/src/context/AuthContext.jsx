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

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);

}