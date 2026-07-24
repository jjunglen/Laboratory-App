import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoHomeOutline, IoSearchOutline, IoNotificationsOutline, IoPersonOutline, IoShieldOutline } from "react-icons/io5";

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, user } = useAuth();

    const items = [
        { label: "Home", path: "/dashboard", icon: IoHomeOutline },
        { label: "Search", path: "/search", icon: IoSearchOutline },
        {
            label: "Alerts",
            path: "/dashboard?tab=alerts",
            icon: IoNotificationsOutline,
        },
        { label: "Profile", path: "/profile", icon: IoPersonOutline },
        // Only show admin for admin users
        ...(user?.role === "admin"
            ? [{ label: "Admin", path: "/admin", icon: IoShieldOutline }]
            : []),
    ];

    // Only show on Mobile when logged in
    // if (!token) return null;

    return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden flex justify-around py-3 border-t border-zinc-800 bg-zinc-950 z-50">
        {items.map((item) => {
            const Icon = item.icon;
            const active = `${location.pathname}${location.search}` === item.path ||
            (item.path === "/dashboard" && location.pathname === "/dashboard" && !location.search);
            return (
            <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                active ? "text-blue-500" : "text-zinc-500"
                }`}
            >
                <Icon size={22} />
                {item.label}
            </button>
            );
        })}
    </div>
  );
}