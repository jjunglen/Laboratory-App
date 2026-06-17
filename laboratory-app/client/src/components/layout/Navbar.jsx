import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoBellOutline } from "react-icons/io5";

// Atomic logo SVG component
function AtomLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="2.5" fill="#3b82f6"/>
      <ellipse cx="11" cy="11" rx="9" ry="4" stroke="#3b82f6" strokeWidth="1.2" fill="none"/>
      <ellipse cx="11" cy="11" rx="9" ry="4" stroke="#3b82f6" strokeWidth="1.2" fill="none" transform="rotate(60 11 11)"/>
      <ellipse cx="11" cy="11" rx="9" ry="4" stroke="#3b82f6" strokeWidth="1.2" fill="none" transform="rotate(120 11 11)"/>
    </svg>
  );
}


export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");

    }

    const navLinks = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Search", path: "/search" },
    ];

    return (
        <nav className="flex justify-between items-center px-6 py-3 border-b border-zinc-900 sticky top-0 z-40 ">
            {/* Logo */}
            <div className="flex ">

            </div>
        </nav>
    )
}