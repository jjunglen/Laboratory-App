// client/src/utils/ProtectedRoute.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
        if (!loading && !token) {
        navigate("/auth");
        }
  }, [token, loading, navigate]);

  if (loading) return null;
  if (!token) return null;

  return children;
}
