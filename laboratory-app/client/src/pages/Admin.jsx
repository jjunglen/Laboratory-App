import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import {
  IoStatsChartOutline,
  IoPeopleOutline,
  IoAlertCircleOutline,
  IoRefreshOutline,
  IoTrashOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoTrendingUpOutline,
  IoBagCheckOutline,
} from "react-icons/io5";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [mostWanted, setMostWanted] = useState([]);
  const [syncMessage, setSyncMessage] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showAllPurchases, setShowAllPurchases] = useState(false);
  const [showAllMostWanted, setShowAllMostWanted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, alertsRes, mostWantedRes, purchasesRes] =
          await Promise.all([
            api.get("/admin/stats"),
            api.get("/admin/users"),
            api.get("/admin/alerts"),
            api.get("/admin/most-wanted"),
            api.get("/admin/purchases"),
          ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data || []);
        setAlerts(alertsRes.data.data || []);
        setMostWanted(mostWantedRes.data.data || []);
        setPurchases(purchasesRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleResetInventory = async () => {
    if (
      !window.confirm(
        "Reset all inventory to 0? Shopify webhooks will resync automatically",
      )
    )
      return;
    try {
      await api.post("/admin/inventory/sync");
      setSyncMessage(
        "Inventory reset - Shopify webhooks will resync automatically",
      );
      setTimeout(() => setSyncMessage(""), 5000);
    } catch (error) {
      console.error("Failed to reset inventory:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Delete this user and all their data? This cannot be undone.",
      )
    )
      return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500 text-sm md:text-base">
          Loading admin data...
        </p>
      </div>
    );
  }

  const statCards = [
    { label: "Total users", value: stats?.totalUsers ?? 0, blue: true },
    { label: "Total alerts", value: stats?.totalAlerts ?? 0 },
    { label: "Active alerts", value: stats?.activeAlerts ?? 0 },
    {
      label: "Inventory in stock",
      value: stats?.totalInventory ?? 0,
      green: true,
    },
    { label: "Notifications sent", value: stats?.totalNotifications ?? 0 },
    { label: "Alert clicks", value: stats?.totalClicks ?? 0 },
    { label: "Purchases", value: stats?.totalPurchases ?? 0 },
    {
      label: "Purchases via app",
      value: stats?.purchasesViaApp ?? 0,
      green: true,
    },
  ];

  const visibleUsers = users.slice(0, 10);
  const visibleAlerts = alerts.slice(0, 10);
  const visiblePurchases = purchases.slice(0, 10);
  const visibleMostWanted = mostWanted.slice(0, 10);

  const purchasesByMonth = purchases.reduce((acc, p) => {
    const key = new Date(p.purchased_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!acc[key]) acc[key] = { purchases: [], total: 0 };
    acc[key].purchases.push(p);
    acc[key].total += parseFloat(p.price_paid || 0);
    return acc;
  }, {});

  const UserRow = ({ user, i, total }) => (
    <div
      className={`flex items-center gap-3 py-3 ${i !== total - 1 ? "border-b border-zinc-800" : ""}`}
    >
      <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-blue-700 text-xs md:text-base font-medium shrink-0">
        {user.full_name?.[0]?.toUpperCase() || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm md:text-lg font-medium text-zinc-200 truncate">
          {user.full_name}
        </p>
        <p className="text-xs md:text-base text-zinc-500 truncate">
          {user.email}
        </p>
      </div>
      <span
        className={`text-xs md:text-base px-2.5 py-1 rounded-full shrink-0 ${user.role === "admin" ? "bg-blue-950 text-blue-300" : "bg-zinc-800 text-zinc-400"}`}
      >
        {user.role}
      </span>
      {user.role !== "admin" && (
        <button
          onClick={() => handleDeleteUser(user.id)}
          className="text-red-400 hover:text-red-300 transition-colors shrink-0 cursor-pointer"
        >
          <IoTrashOutline size={20} />
        </button>
      )}
    </div>
  );

  const AlertRow = ({ alert, i, total }) => (
    <div
      className={`flex items-center justify-between gap-3 py-3 ${i !== total - 1 ? "border-b border-zinc-800" : ""}`}
    >
      <div className="min-w-0">
        <p className="text-sm md:text-lg mb-1 font-medium text-zinc-200 truncate">
          {alert.shoe_name}
        </p>
        <p className="text-xs md:text-sm mb-1 text-zinc-500">{alert.size}</p>
        <p className="text-sm md:text-base text-blue-400">
          {alert.User?.email}
        </p>
      </div>
      <span
        className={`text-sm md:text-base px-2 py-0.5 rounded-full shrink-0 ${alert.active ? "bg-blue-950 text-blue-300" : "bg-zinc-800 text-zinc-400"}`}
      >
        {alert.active ? "Active" : "Paused"}
      </span>
    </div>
  );

const PurchaseRow = ({ purchase, i, total }) => (
  <div
    className={`flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3 py-3 ${
      i !== total - 1 ? "border-b border-zinc-800" : ""
    }`}
  >
    {/* Product Details */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between md:justify-start gap-2">
        <p className="text-sm font-medium text-zinc-200 truncate">
          {purchase.shoe_name}
        </p>
        {purchase.alert_id && (
          <span className="md:hidden text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-medium whitespace-nowrap">
            Alert
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-500 mt-0.5 truncate">
        Size {purchase.size} · {purchase.customer_email}
      </p>
    </div>

    {/* Price, Date & Tag */}
    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 text-xs md:text-sm">
      <span className="text-xs text-zinc-500">
        {new Date(purchase.purchased_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>

      <div className="flex items-center gap-2">
        <span className="font-semibold text-green-400 text-sm">
          ${parseFloat(purchase.price_paid || 0).toFixed(0)}
        </span>

        {purchase.alert_id && (
          <span className="hidden md:inline-block text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 whitespace-nowrap">
            Alert
          </span>
        )}
      </div>
    </div>
  </div>
);

  const MostWantedRow = ({ shoe, i, total }) => (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-2 py-3 ${i !== total - 1 ? "border-b border-zinc-800" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm md:text-base font-medium text-zinc-200 line-clamp-2 leading-tight">
          {shoe.shoe_name}
        </p>
        <p className="text-xs text-zinc-500">{shoe.sku}</p>
        <p className="text-xs text-zinc-600 mt-0.5">
          Sizes: {shoe.sizes_wanted?.filter(Boolean).join(", ")}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-center">
          <p className="text-base font-semibold text-blue-400">
            {shoe.alert_count}
          </p>
          <p className="text-xs text-zinc-500">alerts</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-zinc-300">
            {shoe.user_count}
          </p>
          <p className="text-xs text-zinc-500">users</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${shoe.in_stock ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}
        >
          {shoe.in_stock ? "In stock" : "Not in stock"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* View All Users Modal */}
      {showAllUsers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAllUsers(false)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col z-10">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <p className="text-base md:text-lg font-medium">
                All Users ({users.length})
              </p>
              <button
                onClick={() => setShowAllUsers(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5">
              {users.map((user, i) => (
                <UserRow key={user.id} user={user} i={i} total={users.length} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View All Alerts Modal */}
      {showAllAlerts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAllAlerts(false)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col z-10">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <p className="text-base md:text-lg font-medium">
                All Alerts ({alerts.length})
              </p>
              <button
                onClick={() => setShowAllAlerts(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5">
              {alerts.map((alert, i) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  i={i}
                  total={alerts.length}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View All Purchases Modal */}
      {showAllPurchases && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAllPurchases(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col z-10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-zinc-100">
                  All Purchases
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {purchases.length} total orders from Lab Sync users
                </p>
              </div>
              <button
                onClick={() => setShowAllPurchases(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <IoCloseOutline size={22} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-3 sm:p-5">
              {purchases.length === 0 ? (
                <p className="text-zinc-500 text-sm py-12 text-center">
                  No purchases recorded yet.
                </p>
              ) : (
                Object.entries(purchasesByMonth).map(([month, data]) => (
                  <div key={month} className="mb-5 sm:mb-6">
                    {/* Month Header */}
                    <div className="flex items-center justify-between mb-2.5 px-1">
                      <p className="text-xs sm:text-sm font-medium text-zinc-300">
                        {month}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-[11px] sm:text-xs text-zinc-500">
                          {data.purchases.length} orders
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-green-400">
                          ${data.total.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Month Purchases List */}
                    <div className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-800/80">
                      {data.purchases.map((purchase, i) => (
                        <div
                          key={purchase.id}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-4 py-3 ${
                            i !== data.purchases.length - 1
                              ? "border-b border-zinc-700/60"
                              : ""
                          }`}
                        >
                          {/* Item Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between sm:justify-start gap-2">
                              <p className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                                {purchase.shoe_name}
                              </p>
                              {/* Mobile-only alert badge */}
                              {purchase.alert_id && (
                                <span className="sm:hidden text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-medium whitespace-nowrap">
                                  Alert
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 truncate">
                              Size {purchase.size} · {purchase.customer_email}
                            </p>
                          </div>

                          {/* Meta Info (Price, Date, Desktop Tag) */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs pt-1 sm:pt-0 border-t sm:border-t-0 border-zinc-800/40">
                            <span className="text-[11px] sm:text-xs text-zinc-500">
                              {new Date(
                                purchase.purchased_at,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-green-400">
                                $
                                {parseFloat(purchase.price_paid || 0).toFixed(
                                  0,
                                )}
                              </span>

                              {/* Desktop alert badge */}
                              {purchase.alert_id && (
                                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 whitespace-nowrap">
                                  Alert
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* View All Most Wanted Modal */}
      {showAllMostWanted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAllMostWanted(false)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div>
                <p className="text-base md:text-lg font-medium">Most Wanted</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  shoes customers want that aren't in stock
                </p>
              </div>
              <button
                onClick={() => setShowAllMostWanted(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-2">
              {mostWanted.map((shoe, i) => (
                <MostWantedRow
                  key={i}
                  shoe={shoe}
                  i={i}
                  total={mostWanted.length}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-6 md:px-10 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 md:h-13 md:w-13 bg-blue-950 flex items-center justify-center rounded-full shrink-0">
            <IoStatsChartOutline className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-base md:text-lg font-medium text-white">
              Admin dashboard
            </p>
            <p className="text-xs md:text-sm text-zinc-500">
              Manage users, alerts, and inventory
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-10 max-w-6xl mx-auto">
        {syncMessage && (
          <div className="bg-green-950 border border-green-900 text-green-400 text-sm md:text-base rounded-xl px-4 py-3 mb-6 mt-3">
            {syncMessage}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <p className="text-xs md:text-base text-zinc-500 mb-1 md:mb-2">
                {stat.label}
              </p>
              <p
                className={`text-2xl md:text-3xl font-medium ${stat.blue ? "text-blue-500" : stat.green ? "text-green-400" : "text-white"}`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Users + Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <IoPeopleOutline className="text-zinc-400 text-xl md:text-2xl" />
                <p className="text-base md:text-lg font-medium">
                  Users ({users.length})
                </p>
              </div>
              {users.length >= 10 && (
                <button
                  onClick={() => setShowAllUsers(true)}
                  className="text-xs md:text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  View all
                </button>
              )}
            </div>
            <div className="flex flex-col">
              {visibleUsers.map((user, i) => (
                <UserRow
                  key={user.id}
                  user={user}
                  i={i}
                  total={visibleUsers.length}
                />
              ))}
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <IoAlertCircleOutline className="text-zinc-400 text-xl md:text-2xl" />
                <p className="text-base md:text-lg font-medium">
                  Alerts ({alerts.length})
                </p>
              </div>
              {alerts.length >= 10 && (
                <button
                  onClick={() => setShowAllAlerts(true)}
                  className="text-xs md:text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  View all
                </button>
              )}
            </div>
            <div className="flex flex-col">
              {visibleAlerts.map((alert, i) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  i={i}
                  total={visibleAlerts.length}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Inventory management */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <p className="text-base md:text-xl font-medium mb-2">
            Inventory management
          </p>
          <p className="text-sm md:text-base text-zinc-500 mb-4 leading-relaxed">
            Manually reset inventory or trigger a resync from Shopify. Webhooks
            will repopulate automatically after a reset.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              className="cursor-pointer w-full flex items-center gap-2 text-sm md:text-base bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/dashboard")}
            >
              <IoSearchOutline size={16} /> View inventory
            </button>
            <button
              className="cursor-pointer w-full flex items-center gap-2 text-sm md:text-base bg-zinc-800 text-zinc-300 px-4 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
              onClick={handleResetInventory}
            >
              <IoRefreshOutline size={16} /> Reset inventory
            </button>
            <button className="cursor-pointer w-full flex items-center gap-2 text-sm md:text-base bg-red-950 text-red-400 px-4 py-2.5 rounded-lg hover:bg-red-900 transition-colors">
              <IoTrashOutline size={16} /> Clear all alerts
            </button>
          </div>
        </div>

        {/* Purchases */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <IoBagCheckOutline className="text-zinc-400 text-xl" />
              <div>
                <p className="text-base md:text-lg font-medium">Purchases</p>
                <p className="text-xs text-zinc-500">
                  orders from Lab Sync users
                </p>
              </div>
            </div>
            {purchases.length > 0 && (
              <button
                onClick={() => setShowAllPurchases(true)}
                className="text-xs md:text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                View all
              </button>
            )}
          </div>
          {purchases.length === 0 ? (
            <p className="text-zinc-500 text-sm py-2">
              No purchases recorded yet — orders will appear here after the
              first Shopify order.
            </p>
          ) : (
            <div className="flex flex-col">
              {visiblePurchases.map((purchase, i) => (
                <PurchaseRow
                  key={purchase.id}
                  purchase={purchase}
                  i={i}
                  total={visiblePurchases.length}
                />
              ))}
              {purchases.length > 10 && (
                <button
                  onClick={() => setShowAllPurchases(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer mt-3 text-left"
                >
                  +{purchases.length - 10} more purchases →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Most Wanted */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <IoTrendingUpOutline className="text-zinc-400 text-xl" />
              <p className="text-base md:text-lg font-medium">Most Wanted</p>
              <span className="text-xs text-zinc-500 ml-1 hidden md:inline">
                shoes customers want that aren't in stock
              </span>
            </div>
            {mostWanted.length >= 10 && (
              <button
                onClick={() => setShowAllMostWanted(true)}
                className="text-xs md:text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                View all
              </button>
            )}
          </div>
          <div>
            {visibleMostWanted.map((shoe, i) => (
              <MostWantedRow
                key={i}
                shoe={shoe}
                i={i}
                total={visibleMostWanted.length}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
