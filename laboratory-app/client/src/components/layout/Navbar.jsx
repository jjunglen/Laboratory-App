import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios.js";
import {
  IoNotificationsOutline,
  IoMailOutline,
  IoSearchOutline,
  IoGridOutline,
  IoCloseOutline,
  IoCheckmarkDoneOutline,
  IoTrashOutline,
} from "react-icons/io5";

function AtomLogo({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="11" cy="11" r="2.5" fill="#3b82f6" />
      <ellipse cx="11" cy="11" rx="9" ry="4" stroke="#3b82f6" strokeWidth="1.2" fill="none" />
      <ellipse cx="11" cy="11" rx="9" ry="4" stroke="#3b82f6" strokeWidth="1.2" fill="none" transform="rotate(60 11 11)" />
      <ellipse cx="11" cy="11" rx="9" ry="4" stroke="#3b82f6" strokeWidth="1.2" fill="none" transform="rotate(120 11 11)" />
    </svg>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        const notifs = res.data.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read).length);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [token]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifs]);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleBellClick = () => {
    setShowNotifs((prev) => !prev);
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/notifications");
      setNotifications([]);
      setUnreadCount(0);

    } catch(error) {
      console.error("Failed to clear notificaitions:", error);

    }
  }

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: IoGridOutline },
    { label: "Search", path: "/search", icon: IoSearchOutline },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-40">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(token ? "/dashboard" : "/")}
        >
          <AtomLogo className="w-8 h-8 md:w-12 md:h-12 shrink-0" />
          <span className="text-sm font-medium md:hidden inline">
            Lab <span className="text-blue-500">Sync</span>
          </span>
          <span className="text-sm md:text-xl font-medium hidden md:inline">
            Lab <span className="text-blue-500">Sync</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {token ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`hidden md:flex cursor-pointer items-center gap-1.5 text-xl transition-colors ${
                      location.pathname === link.path
                        ? "text-blue-500"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Icon size={15} />
                    {link.label}
                  </button>
                );
              })}

              {/* Bell icon */}
              <button
                onClick={handleBellClick}
                className="relative text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors"
              >
                <IoMailOutline size={26} className="text-blue-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Avatar */}
              <div
                onClick={() => navigate("/profile")}
                className="hidden md:flex w-12 h-12 rounded-full bg-blue-700 items-center justify-center text-xs font-medium cursor-pointer hover:bg-blue-600 transition-colors"
              >
                {user?.full_name?.[0]?.toUpperCase() || "HI"}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="text-sm sm:text-xl border border-blue-500 text-blue-500 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="hidden md:block text-sm sm:text-xl bg-blue-500 text-white px-3 py-1.5 cursor-pointer rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Sign up free
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Notification Panel */}
      {showNotifs && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotifs(false)} />

          {/* Panel */}
          <div
            ref={panelRef}
            className="absolute top-0 right-0 h-full w-full max-w-sm bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <p className="text-base font-medium text-zinc-300">Notifications</p>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    <IoCheckmarkDoneOutline size={16} />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1 text-xs md:text-sm text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <IoTrashOutline size={16} />
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowNotifs(false)}
                  className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <IoCloseOutline size={22} />
                </button>
              </div>
            </div>

            {/* Notifications list */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <IoMailOutline size={40} className="text-blue-500 mb-3" />
                  <p className="text-zinc-500 text-sm">No notifications yet</p>
                  <p className="text-zinc-600 text-xs mt-1">We'll notify you when your shoe drops</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif, i) => (
                    <div
                      key={notif.id}
                      className={`px-5 py-4 border-b border-zinc-800 last:border-0 ${
                        !notif.read ? "bg-blue-950/20" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {notif.image_url ? (
                          <img src={notif.image_url.includes("?") ? `${notif.image_url}&width=60` : `${notif.image_url}?width=60`} alt="shoe" className="w-20 h-20 rounded-lg object-contain bg-white shrink-0" />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-zinc-800 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-200 leading-relaxed">{notif.message}</p>
                          <p className="text-xs text-zinc-500 mt-1">{timeAgo(notif.sent_at)}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}