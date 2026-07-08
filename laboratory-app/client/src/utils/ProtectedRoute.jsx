import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly= false }) {
    const { token, user } = useAuth();

    // if (!token) {
    //     return <Navigate to="/auth" replace />;
    // }

    if (adminOnly && user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}