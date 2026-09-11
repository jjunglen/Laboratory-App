import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !token) {
      const redirectTarget = location.pathname + location.search;
      navigate(`/auth?redirect=${encodeURIComponent(redirectTarget)}`);
    }
  }, [token, loading, navigate, location]);

  if (loading) return null;
  if (!token) return null;

  return children;
}
