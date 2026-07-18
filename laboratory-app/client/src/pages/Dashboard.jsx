import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios.js";
import {
  IoAddOutline,
  IoSearchOutline,
  IoChevronDownOutline,
  IoBagCheckOutline,
  IoSparklesOutline,
  IoGridOutline,
} from "react-icons/io5";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function conditionLabel(condition) {
  if (condition === "brand_new") return "Brand New";
  if (condition === "pre_owned") return "Pre-Owned";
  if (condition === "either") return "Pre-Owned";
  return null;
}

const tabs = [
  { key: "instock", label: "In stock" },
  { key: "new", label: "New arrivals" },
  { key: "browse", label: "Browse inventory" },
  { key: "alerts", label: "Your alerts" },
];

const clothingAndOther = [
  "XS", "S", "M", "L", "XL", "XXL", "XXXL", "2XL", "3XL",
  "OS", "O/S", "4C", "4Y", "4.5Y", "5Y", "5.5Y", "6Y", "6.5Y",
  "7Y", "7.5Y", "8Y", "7 1/8", "7 1/4", "7 3/8", "7 1/2",
  "7 5/8", "7 3/4", "7 7/8", "8", "7", "Medium",
];

const sizeOrder = [
  "3.5M/5W", "4M/5.5W", "4.5M/6W", "5M/6.5W", "5.5M/7W",
  "6M/7.5W", "6.5M/8W", "7M/8.5W", "7.5M/9W", "8M/9.5W",
  "8.5M/10W", "9M/10.5W", "9.5M/11W", "10M/11.5W", "10.5M/12W",
  "11M/12.5W", "11.5M/13W", "12M/13.5W", "12.5M/14W", "13M/14.5W",
  "13.5M/15W", "14M/15.5W", "14.5M/16W", "15M", "16M", "17M",
];

const isShoeSize = (size) => !clothingAndOther.includes(size);

export default function Dashboard() {
  const [tab, setTab] = useState("alerts");
  const [alerts, setAlerts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [browseQuery, setBrowseQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState("All sizes");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/alerts");
        console.log("alerts response:", res.data);
        setAlerts(res.data.data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      } finally {
        setLoadingAlerts(false);
      }
    };
    fetchAlerts();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get("/inventory");
        setInventory(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoadingInventory(false);
      }
    };
    fetchInventory();
  }, []);

  const mySizes = user?.sizes || [];

  const shoeInventory = inventory.filter(
    (item) => item.available > 0 && isShoeSize(item.size)
  );

  const inStockItems = shoeInventory.filter(
    (item) => mySizes.includes(item.size)
  );

  const newArrivals = [...shoeInventory]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20);

  const browseFiltered = shoeInventory
    .filter((item) =>
      browseQuery
        ? item.shoe_name.toLowerCase().includes(browseQuery.toLowerCase()) ||
          item.sku?.toLowerCase().includes(browseQuery.toLowerCase())
        : true
    )
    .filter((item) =>
      selectedSize !== "All sizes" ? item.size === selectedSize : true
    );

  const availableSizes = [
    "All sizes",
    ...new Set(shoeInventory.map((i) => i.size).filter(Boolean)),
  ].sort((a, b) => {
    const aIdx = sizeOrder.indexOf(a);
    const bIdx = sizeOrder.indexOf(b);
    if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24 md:pb-0">
      <Navbar />

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 px-5 md:px-10 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-xs md:text-sm py-4 md:py-5 mr-5 border-b-2 whitespace-nowrap transition-colors ${
              tab === t.key
                ? "text-blue-500 border-blue-500 font-medium"
                : "text-zinc-500 border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        {/* IN STOCK TAB */}
        {tab === "instock" && (
          <>
            <div className="flex items-center justify-between flex-wrap mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-800">
                  <IoGridOutline size={22} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-base md:text-lg font-medium text-white">
                    In stock in your sizes
                  </p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {mySizes.length > 0 ? (
                      mySizes.map((size) => (
                        <span
                          key={size}
                          className="text-xs md:text-sm bg-zinc-900 border border-zinc-800 text-zinc-400 py-1 px-3 rounded-full"
                        >
                          {size}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs md:text-sm text-zinc-500">
                        No sizes set
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/search")}
                className="flex items-center gap-2 bg-blue-950 text-blue-300 text-xs md:text-sm px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
              >
                <IoAddOutline size={16} /> Track a new shoe
              </button>
            </div>

            {loadingInventory ? (
              <p className="text-zinc-500 text-sm md:text-base">
                Loading inventory...
              </p>
            ) : inStockItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-sm md:text-base mb-2">
                  Nothing in stock in your sizes right now
                </p>
                <p className="text-zinc-600 text-xs md:text-sm">
                  Track a specific shoe to get notified when it drops
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {inStockItems.map((shoe) => (
                  <a
                    key={shoe.id}
                    href={shoe.shopify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
                  >
                    <div className="relative w-full h-44 md:h-52 bg-white">
                      {shoe.image_url ? (
                        <img
                          src={
                            shoe.image_url.includes("?")
                              ? `${shoe.image_url}&width=400`
                              : `${shoe.image_url}?width=400`
                          }
                          alt={shoe.shoe_name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-200" />
                      )}
                      {conditionLabel(shoe.condition) && (
                        <span
                          className={`absolute top-2 left-2 text-[10px] text-xs md:text-sm font-medium px-2 py-0.5 rounded-full ${
                            shoe.condition === "brand_new"
                              ? "bg-green-500 text-white"
                              : "bg-zinc-700 text-zinc-200"
                          }`}
                        >
                          {conditionLabel(shoe.condition)}
                        </span>
                      )}
                      <span className="absolute top-2 right-2 text-[10px] text-xs md:text-sm px-2 py-0.5 rounded-full font-medium bg-blue-500 text-white">
                        {shoe.size}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs md:text-base font-medium text-zinc-200 leading-tight line-clamp-2 h-10 mb-3">
                        {shoe.shoe_name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-xl font-semibold text-white">
                          ${parseFloat(shoe.price).toFixed(0)}
                        </span>
                        <span className="text-xs md:text-sm font-medium bg-blue-950 text-blue-300 px-3 py-1.5 rounded-lg">
                          Buy now →
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* NEW ARRIVALS TAB */}
        {tab === "new" && (
          <>
            <div className="flex items-center justify-between flex-wrap mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-800">
                  <IoSparklesOutline size={22} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-base md:text-lg font-medium text-white">
                    New arrivals
                  </p>
                  <p className="text-xs md:text-sm text-zinc-500">
                    Newest listings across all sizes
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/search")}
                className="flex items-center gap-2 bg-blue-950 text-blue-300 text-xs md:text-sm px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
              >
                <IoAddOutline size={16} /> Track a new shoe
              </button>
            </div>

            {loadingInventory ? (
              <p className="text-zinc-500 text-sm md:text-base">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {newArrivals.map((shoe) => (
                  <a
                    key={shoe.id}
                    href={shoe.shopify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
                  >
                    <div className="relative w-full h-44 md:h-52 bg-white">
                      {shoe.image_url ? (
                        <img
                          src={
                            shoe.image_url.includes("?")
                              ? `${shoe.image_url}&width=400`
                              : `${shoe.image_url}?width=400`
                          }
                          alt={shoe.shoe_name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-200" />
                      )}
                      <span className="absolute top-2 left-2 text-xs md:text-sm font-medium px-2 py-0.5 rounded-full bg-green-900 text-green-300">
                        {timeAgo(shoe.created_at)}
                      </span>
                      <span className="absolute top-2 right-2 text-xs md:text-sm px-2 py-0.5 rounded-full font-medium bg-black/50 text-white">
                        {shoe.size}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm md:text-lg font-medium text-zinc-200 leading-tight line-clamp-2 h-10 mb-3">
                        {shoe.shoe_name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-xl font-semibold text-white">
                          ${parseFloat(shoe.price).toFixed(0)}
                        </span>
                        <span className="text-xs md:text-sm font-medium bg-blue-950 text-blue-300 px-3 py-1.5 rounded-lg">
                          Buy now →
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* BROWSE INVENTORY TAB */}
        {tab === "browse" && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-zinc-800 shrink-0">
                <IoSearchOutline className="text-zinc-400" size={22} />
              </div>
              <div>
                <p className="text-sm md:text-base font-medium text-white">
                  Browse inventory
                </p>
                <p className="text-xs md:text-sm text-zinc-500">
                  {shoeInventory.length} shoes in stock right now
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <IoSearchOutline
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  type="text"
                  value={browseQuery}
                  onChange={(e) => setBrowseQuery(e.target.value)}
                  placeholder="Search the full inventory"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-xs md:text-sm text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="appearance-none text-xs md:text-sm border border-zinc-800 bg-zinc-900 text-zinc-400 pl-4 pr-10 py-3 rounded-lg focus:border-blue-500 outline-none transition-colors cursor-pointer"
                >
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <IoChevronDownOutline
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <p className="text-xs md:text-sm text-zinc-500 mb-4">
              {browseFiltered.length} results
            </p>

            {loadingInventory ? (
              <p className="text-zinc-500 text-sm md:text-base">
                Loading inventory...
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {browseFiltered.map((shoe) => (
                  <a
                    key={shoe.id}
                    href={shoe.shopify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
                  >
                    <div className="relative w-full h-44 md:h-52 bg-white">
                      {shoe.image_url ? (
                        <img
                          src={
                            shoe.image_url.includes("?")
                              ? `${shoe.image_url}&width=400`
                              : `${shoe.image_url}?width=400`
                          }
                          alt={shoe.shoe_name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-200" />
                      )}
                      {conditionLabel(shoe.condition) && (
                        <span
                          className={`absolute top-2 left-2 text-xs md:text-sm font-medium px-2 py-0.5 rounded-full ${
                            shoe.condition === "brand_new"
                              ? "bg-green-500 text-white"
                              : "bg-zinc-700 text-zinc-200"
                          }`}
                        >
                          {conditionLabel(shoe.condition)}
                        </span>
                      )}
                      <span
                        className={`absolute top-2 right-2 text-xs md:text-sm px-2 py-0.5 rounded-full font-medium ${
                          mySizes.includes(shoe.size)
                            ? "bg-blue-500 text-white"
                            : "bg-black/50 text-white"
                        }`}
                      >
                        {shoe.size}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm md:text-base font-medium text-zinc-200 leading-tight line-clamp-2 h-10 mb-3">
                        {shoe.shoe_name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-xl font-semibold text-white">
                          ${parseFloat(shoe.price).toFixed(0)}
                        </span>
                        <span className="text-xs md:text-sm font-medium bg-blue-950 text-blue-300 px-3 py-1.5 rounded-lg">
                          Buy now →
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* YOUR ALERTS TAB */}
        {tab === "alerts" && (
          <>
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-800">
                  <IoBagCheckOutline className="text-blue-300" size={22} />
                </div>
                <div>
                  <p className="text-base md:text-lg font-medium text-white">
                    <span className="text-blue-500 text-xl md:text-2xl">
                      {alerts.length}
                    </span>{" "}
                    shoes tracked
                  </p>
                  <p className="text-xs md:text-sm text-zinc-500">
                    We'll notify you the second they drop
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/search")}
                className="flex items-center gap-2 bg-blue-950 text-blue-300 text-xs md:text-sm px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
              >
                <IoAddOutline size={16} /> Track a new shoe
              </button>
            </div>

            {loadingAlerts ? (
              <p className="text-zinc-500 text-sm md:text-base">
                Loading your alerts...
              </p>
            ) : alerts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-sm md:text-base mb-4">
                  No alerts yet
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="bg-blue-500 text-white text-xs md:text-sm font-medium px-5 py-2.5 rounded-lg cursor-pointer"
                >
                  Track your first shoe
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-zinc-100 shrink-0" />
                    <div>
                      <p className="text-sm md:text-base font-medium text-zinc-200 mb-1">
                        {alert.shoe_name}
                      </p>
                      <p className="text-xs md:text-sm text-zinc-500">
                        {alert.size}
                      </p>
                      {alert.max_price && (
                        <p className="text-xs md:text-sm text-zinc-600">
                          Max ${parseFloat(alert.max_price).toFixed(0)}
                        </p>
                      )}
                      <span className="inline-block mt-1 text-xs md:text-sm bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full">
                        {alert.active ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}