import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoNotificationsOutline, IoPersonOutline, IoSearchOutline, IoGridOutline } from "react-icons/io5";

function AtomLogo({ className = "w-6 h-6" }) {
  return (
    <svg 
      viewBox="0 0 22 22" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
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
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: IoGridOutline },
    { label: "Search", path: "/search", icon: IoSearchOutline },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-40">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(token ? "/dashboard" : "/")}
      >
        <AtomLogo className="w-8 h-8 md:w-12 md:h-12 shrink-0" />
        {/* Mobile: short name */}
        <span className="text-sm font-medium md:hidden inline">
          The <span className="text-blue-500">Lab</span>
        </span>
        {/* Desktop: full name */}
        <span className="text-sm md:text-xl font-medium hidden md:inline">
          The <span className="text-blue-500">Laboratory</span>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {token ? (
          <>
            {/* Desktop only nav links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`hidden md:flex items-center gap-1.5 text-xs transition-colors ${
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

            {/* Desktop only bell */}
            <button
              onClick={() => navigate("/dashboard")}
              className="relative hidden md:block text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <IoNotificationsOutline size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Desktop only avatar */}
            <div
              onClick={() => navigate("/profile")}
              className="hidden md:flex w-8 h-8 rounded-full bg-blue-700 items-center justify-center text-xs font-medium cursor-pointer hover:bg-blue-600 transition-colors"
            >
              {user?.full_name?.[0]?.toUpperCase() || "HI"}
            </div>
          </>
        ) : (
          <>
            {/* Logged out — show on both mobile and desktop */}
            <button
              onClick={() => navigate("/auth")}
              className="text-sm sm:text-xl border border-blue-500 text-blue-500 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="hidden md:block text-sm sm:text-xl bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Sign up free
            </button>
          </>
        )}
      </div>
    </nav>
  );
}