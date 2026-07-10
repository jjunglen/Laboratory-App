import { useState, useEffect } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import { useAuth } from "../context/AuthContext";
import {
  IoPersonOutline,
  IoOptionsOutline,
  IoNotificationsOutline,
  IoAlertCircleOutline,
  IoLogOutOutline,
  IoTrashOutline,
} from "react-icons/io5";

const sizeOptions = [
  "3.5M/5W",
  "4M/5.5W",
  "4.5M/6W",
  "5M/6.5W",
  "5.5M/7W",
  "6M/7.5W",
  "6.5M/8W",
  "7M/8.5W",
  "7.5M/9W",
  "8M/9.5W",
  "8.5M/10W",
  "9M/10.5W",
  "9.5M/11W",
  "10M/11.5W",
  "10.5M/12W",
  "11M/12.5W",
  "11.5M/13W",
  "12M/13.5W",
  "12.5M/14W",
  "13M/14.5W",
  "13.5M/15W",
  "14M/15.5W",
  "14.5M/16W",
  "15M",
  "16M",
  "17M",
];

const sidebarItems = [
  { key: "profile", label: "Profile", icon: IoPersonOutline },
  { key: "prefs", label: "Preferences", icon: IoOptionsOutline },
  { key: "notifs", label: "Notifications", icon: IoNotificationsOutline },
  { key: "alerts", label: "My alerts", icon: IoAlertCircleOutline },
];

export default function Profile() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [priceDrop, setPriceDrop] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Sizes
  const [sizes, setSizes] = useState([]);

  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInapp, setNotifyInapp] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        const data = response.data.data;
        console.log("Sizes from API:", data.sizes);

        setProfile(data);
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setNotifyEmail(data.notify_email ?? true);
        setNotifyInapp(data.notify_inapp ?? true);
        setSizes(data.sizes || []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get("/alerts");
        setAlerts(response.data.data.alerts || []);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };
    fetchAlerts();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");
    try {
      const response = await api.put("/users/profile", {
        full_name: fullName,
      });
      updateUser({ full_name: fullName, email });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error.response?.data?.error || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (field, value) => {
    try {
      await api.put("/users/profile", { [field]: value });
      updateUser({ [field]: value });
    } catch (error) {
      console.error("Failed to update notification setting:", error);
    }
  };

  const handleSaveSizes = async () => {
    setSaving(true);
    setSaveError("");

    try {
      const res = await api.put("/users/profile", { sizes });
      updateUser({ sizes: res.data.data.sizes });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.error || "Failed to save sizes.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSizes = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleRemoveAlert = async (alertId) => {
    try {
      await api.delete(`/alerts/${alertId}`);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (error) {
      console.error("Failed to remove alert:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone",
      )
    )
      return;
    try {
      await api.delete("/users/profile");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center ">
        <p className="text-zinc-500 text-sm md:text-base">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24 md:pb-0">
      <NavBar />

      <div className="px-6 md:px-10 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-950 flex justify-center items-center w-10 h-10 md:w-13 md:h-13 rounded-full shrink-0 ">
            <IoPersonOutline className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-sm md:text-lg font-medium text-white">
              Account settings
            </p>
            <p className="text-xs md:text-base text-zinc-500">
              Manage your profile, sizes, and notifications
            </p>
          </div>
        </div>
      </div>

      {/* Mobile tab - horizontal scroll */}
      <div className="flex border-b border-zinc-800 px-2 md:hidden overflow-x-auto">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`shrink-0 text-xs md:text-base py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${tab === item.key ? "text-blue-500 border-blue-500 font-medium" : "text-zinc-500 border-transparent"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex max-w-5xl mx-auto px-6 md:px-6 gap-8">
        {/* Sidebar - desktop only */}
        <div className="hidden md:flex flex-col gap-2 w-52 shrink-0">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex items-center gap-2.5 cursor-pointer text-left text-lg px-3 py-2.5 rounded-lg transition-colors ${
                  tab === item.key
                    ? "bg-blue-950 text-blue-300"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
          <div className="h-px bg-zinc-800 my-2" />
          <button
            onClick={handleLogout}
            className="flex items-center my-2 gap-2.5 cursor-pointer text-left text-lg px-3 w-52 py-2.5 rounded-lg text-red-500 hover:bg-red-950/30 transition-colors"
          >
            <IoLogOutOutline size={20} />
            Log out
          </button>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Save succes / error banners */}
          {saveSuccess && (
            <div className="bg-green-950 border border-green-900 text-green-400 mt-2 text-sm md:text-base rounded-xl px-4 py-3">
              Changes saved successfully
            </div>
          )}

          {saveError && (
            <div className="bg-red-950 border border-red-900 text-red-400 mt-2 text-sm md:text-base rounded-xl px-4 py-3">
              {saveError}
            </div>
          )}

          {/* Profile tab */}
          {tab === "profile" && (
            <>
              <div className="flex flex-col items-center md:items-start md:flex-row mt-5 md:mt-0 md:gap-4 mb-1">
                <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-xl font-medium mb-3 md:mb-0">
                  {fullName?.[0]?.toUpperCase() || "?"}
                </div>

                <div className="text-center md:text-left">
                  <p className="text-base font-medium mb-1">{fullName}</p>
                  <p className="text-sm text-zinc-500 mb-1">{email}</p>
                  <span className="text-xs md:text-sm bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                    {profile?.role || "user"}
                  </span>
                </div>
              </div>

              {/* Account info */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-base font-medium mb-4">Account info</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-zinc-500 block mb-1.5">
                      Full name
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-500 block mb-1.5">
                      Email address
                    </label>
                    <div className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm md:text-base text-zinc-500 cursor-not-allowed">
                      {email}
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-zinc-600">
                    Email cannot be changed
                  </p>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-blue-500 cursor-pointer text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>

              <button
                className="w-full flex items-center justify-center gap-1 border cursor-pointer border-red-500 text-red-500 text-sm py-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                onClick={handleDeleteAccount}
              >
                <IoTrashOutline size={16} /> Delete account
              </button>
            </>
          )}

          {/* Preference tab */}
          {tab === "prefs" && (
            <div className="bg-zinc-900 border border-zinc-800 mt-5 md:mt-0 rounded-xl p-5">
              <p className="text-sm md:text-lg font-medium mb-1">Your sizes</p>
              <p className="text-zinc-500 mb-4 text-sm md:text-base">
                Used to filter "In stock" and your live inventory feed
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {sizeOptions.map((size) => {
                  const isSelected = sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSizes(size)}
                      className={`text-xs md:text-sm py-2.5 px-3 rounded-xl border font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-950 text-blue-300"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Save sizes */}
              <div className="flex items-center justify-between">
                <p className="text-sm md:text-base text-zinc-500">
                  {sizes.length} size{sizes.length !== 1 ? "s" : ""} selected
                </p>
                <button
                  onClick={handleSaveSizes}
                  disabled={saving || sizes.length === 0}
                  className="bg-blue-500 text-white text-sm md:text-base font-medium cursor-pointer px-5 py-2.5  rounded-lg hover:bg-blue-600 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? "Saving..." : "Save sizes"}
                </button>
              </div>
            </div>
          )}

          {/* Notification Tab */}
          {tab === "notifs" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-5 md:mt-0">
              <p className="text-base md:text-lg font-medium mb-4">
                Notification settings
              </p>
              {[
                {
                  label: "Email alerts",
                  sub: "When your shoe hits stock",
                  field: "notify_email",
                  value: notifyEmail,
                  set: setNotifyEmail,
                },
                {
                  label: "In-app alerts",
                  sub: "Notification bell",
                  field: "notify_inapp",
                  value: notifyInapp,
                  set: setNotifyInapp,
                },
                {
                  label: "Price drops",
                  sub: "Watched shoe price change",
                  field: "notify_price_drop",
                  value: priceDrop,
                  set: setPriceDrop,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3.5 border-b border-zinc-800 last:border-0"
                >
                  <div>
                    <p className="text-sm md:text-base text-zinc-200">
                      {item.label}
                    </p>
                    <p className="text-xs md:text-sm text-zinc-500">
                      {item.sub}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newValue = !item.value;
                      item.set(newValue);
                      if (item.field !== "notify_price_drop") {
                        handleSaveNotifications(item.field, newValue);
                      }
                    }}
                    className={`w-10 h-5.5 rounded-full relative shrink-0 transition-colors ${item.value ? "bg-blue-500" : "bg-zinc-700"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all ${
                        item.value ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
              <p className="text-sm md:text-base text-zinc-600 mt-3">
                Price drop notification coming soon!
              </p>
            </div>
          )}

          {/* My alerts tab */}
          {tab === "alerts" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm md:text-base">Your tracked shoes</p>
                <span className="text-xs md:text-sm text-zinc-500">
                  {alerts.length} alerts
                </span>
              </div>
              {alerts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-zinc-500 text-sm md:text-base mb-3">
                    No alerts yet
                  </p>
                  <button
                    onClick={() => navigate("/search")}
                    className="bg-blue-500 text-white text-sm md:text-base font-medium px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Track your first shoe
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex flex-col md:flex-row justify-center md:justify-start gap-3 bg-zinc-800 rounded-lg p-3"
                    >
                      <div className="w-full h-32 md:w-24 md:h-24 bg-zinc-100 rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base mb-1 font-medium text-zinc-200 truncate">
                          {alert.shoe_name}
                        </p>
                        <p className="text-sm md:text-base mb-1 text-zinc-500">
                          {alert.size}
                        </p>
                        {alert.max_price && (
                          <p className="text-sm text-zinc-600">
                            Max ${parseFloat(alert.max_price).toFixed(0)}
                          </p>
                        )}
                        <span className="inline-block text-sm md:text-base bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full">
                          {alert.active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveAlert(alert.id)}
                        className="text-sm md:text-base text-red-400 hover:text-red-300 transition-colors shrink-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mobile only logout */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 md:hidden w-full  border border-red-500/30 text-red-500 text-sm py-3 rounded-xl"
          >
            <IoLogOutOutline size={18} />
            Logout
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
