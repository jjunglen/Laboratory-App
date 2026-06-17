import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = (data, authToken) => {
        setUser(data);
        setToken(authToken);
        localStorage.setItem("token", authToken);

    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");

    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);

}