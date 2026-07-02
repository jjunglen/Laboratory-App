import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { IoAddOutline, IoSearchOutline, IoChevronDownOutline, IoBagCheckOutline, IoSparklesOutline, IoGridOutline } from "react-icons/io5";

// Helper
function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;

}

// format condition label
function conditionLabel(condition) {
    if (condition === "brand_new") return "Brand New";
    if (condition === "pre_owned") return "Pre-Owned";
    return "Either";

}

const tabs = [
  { key: "alerts", label: "Your alerts" },
  { key: "instock", label: "In stock" },
  { key: "new", label: "New arrivals" },
  { key: "browse", label: "Browse inventory" },
];

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

    // Fetch alerts
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await api.get("/alerts");
                setAlerts(response.data.data.alerts || []);

            } catch(error) {
                console.error("Failed to fetch alerts:", error);

            } finally {
                setLoadingAlerts(false);

            }
        }
        fetchAlerts();

    }, []);

    // Fetch inventory
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await api.get("/inventory");
                setInventory(response.data.data || []);

            } catch(error) {
                console.error("Failed to fetch inventory:", error);

            } finally {
                setLoadingInventory(false);

            }
        }
        fetchInventory();
    }, []);

    // Derived size
    const mySizes = user?.sizes || [];

    const inStockItems = inventory.filter((item) => item.available > 0 && mySizes.includes(item.size));

    const newArrivals = [...inventory]
        .filter((item) => item.available > 0)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 20);

    const browseFiltered = inventory
        .filter((item) => item.available > 0)
        .filter((item) =>
            browseQuery
            ? item.shoe_name.toLowerCase().includes(browseQuery.toLowerCase()) ||
                item.sku?.toLowerCase().includes(browseQuery.toLowerCase())
            : true,
        ).filter((item) => selectedSize !== "All sizes" ? item.size === selectedSize : true);

    // Unique sizes from inventory for filtered dropdown
    const availableSizes = [
        "All sizes",
        ...new Set(inventory.map((i) => i.size).filter(Boolean)),
    ].sort();

    return (
      <div className="min-h-screen bg-zinc-950 text-white pb-24 md:pb-0">
        <Navbar />

        {/* Tabs */}
        <div className="flex justify-center md:justify-start border-b border-zinc-800 px-5 md:px-10 mx-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-xs md:text-base py-4 md:py-5 mr-5 border-b-2 whitespace-nowrap transition-colors ${tab === t.key ? "text-blue-500 border-blue-500 font-medium" : "text-zinc-500 border-transparent"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
          {/* Your alerts tab */}
          {tab === "alerts" && (
            <>
              <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-13 h-13 rounded-full bg-blue-800">
                    <IoBagCheckOutline className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-medium text-white">
                      <span className="text-blue-500 text-xl">
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
                  className="flex items-center gap-2 mb-3 sm:mb-0 bg-blue-950 text-blue-300 text-sm md:text-base px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                >
                  <IoAddOutline size={18} /> Track a new shoe
                </button>
              </div>

              {loadingAlerts ? (
                <p className="text-zinc-500 text-sm md:text-base">
                  Loading your alerts...
                </p>
              ) : alerts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-zinc-500 text-base md:text-lg mb-4">
                    No alerts yet
                  </p>
                  <button
                    onClick={() => navigate("/search")}
                    className="bg-blue-500 text-white text-sm md:text-base font-medium px-5 py-2.5 hover:bg-blue-600 rounded-lg cursor-pointer "
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
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg bg-zinc-100 shrink-0" />
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
                        <span className="inline-block mt-1 text-xs sm:text-sm bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full">
                          {alert.active ? "Active" : "Paused"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {/* In stock tab */}
          {tab === "instock" && (
            <>
              <div className="flex items-center justify-between flex-wrap mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-800">
                    <IoGridOutline size={24} className="text-blue-300" />
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-medium text-white">
                      In stock in your sizes
                    </p>
                    <div className="flex gap-2 mt-1">
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
                        <span className="text-sm md:text-base text-zinc-500">
                          No sizes yet set
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/search")}
                  className="flex items-center gap-2 mb-3 sm:mb-0 bg-blue-950 text-blue-300 text-sm md:text-base px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                >
                  <IoAddOutline size={18} /> Track a new shoe
                </button>
              </div>
              {loadingInventory ? (
                <p className="text-zinc-500 text-sm md:text-base">
                  Loading inventory...
                </p>
              ) : inStockItems.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-zinc-500 text-base md:text-lg mb-2">
                    Nothing in stock in your size right now.. Please check
                    later.
                  </p>
                  <p className="text-zinc-600 text-sm md:text-base">
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
                      className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors"
                    >
                      {shoe.image_url ? (
                        <img
                          src={shoe.image_url}
                          alt={shoe.shoe_name}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-contain bg-zinc-100 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-zinc-100 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium text-zinc-200 mb-1 truncate">
                          {shoe.shoe_name}
                        </p>
                        <span className="text-xs md:text-sm bg-blue-950 text-blue-300 px-2.5 py-1 rounded-full">
                          {shoe.size}
                        </span>
                      </div>
                      <span className="text-base font-semibold text-white shrink-0">
                        ${parseFloat(shoe.price).toFixed(0)}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
          {/* New arrivals tab */}
          {tab === "new" && (
            <>
                <div className="flex items-center justify-between flex-wrap mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-13 h-13 rounded-full bg-blue-800">
                            <IoSparklesOutline size={25} className="text-blue-300" />
                        </div>
                        <div>
                            <p className="text-base md:text-lg font-medium text-white">
                            New arrivals
                            </p>
                            <p className="text-xs md:text-sm text-zinc-500">
                            Newest listings across all sizes{" "}
                            </p>
                        </div>
                    </div>
                    <button
                    onClick={() => navigate("/search")}
                    className="flex items-center gap-2 mb-3 sm:mb-0 bg-blue-950 text-blue-300 text-sm md:text-base px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                    >
                    <IoAddOutline size={18} /> Track a new shoe
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
                                rel="noopener noreferre"
                                className="flex items-center cursor-pointer gap-4 bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition-colorshover:bg-zinc-800 transition-colors"
                            >
                                {shoe.image_url ? (
                                    <img src={shoe.image_url} alt={shoe.shoe_name} className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-contain bg-zinc-100 shrink-0" />
                                ) : (
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-zinc-100 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm md:text-base font-medium text-zinc-200 mb-2 truncate">{shoe.shoe_name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs md:text-sm bg-green-950 text-green-300 px-3 py-1 rounded-full">{timeAgo(shoe.created_at)}</span>
                                        <span className="text-xs md:text-sm text-zinc-500">{shoe.size}</span>
                                    </div>
                                </div>
                                <span className="text-base font-semibold text-white shrink-0">${parseFloat(shoe.price).toFixed(0)}</span>
                            </a>
                        ))}
                    </div>
                )}
            </>
          )}
          {/* Browse Inventory Tab */}
          {tab === "browse" && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-blue-800 shrink-0">
                  <IoSearchOutline className="text-blue-300" size={25} />
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-white">
                    Browse inventory
                  </p>
                  <p className="text-xs md:text-sm text-zinc-500 ">
                    {inventory.filter(i => i.available > 0).length} items in stock right now
                  </p>
                </div>
              </div>

                <div className="flex items-center gap-3 mb-6 mt-5 flex-wrap">
                    <div className="relative flex-1 min-w-[220px]">
                        <IoSearchOutline
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                            size={18}
                        />
                        <input
                            type="text"
                            value={browseQuery}
                            onChange={(event) => setBrowseQuery(event.target.value)}
                            placeholder="Search the full inventory"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-xs md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="appearance-none flex items-center gap-2 text-xs md:text-base border border-zinc-800 bg-zinc-900 text-zinc-400 pl-4 pr-10 py-3 rounded-lg focus:border-blue-500 outline-none transition-colors cursor-pointer"
                        >
                        {availableSizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                        </select>
                        <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                    </div>
                </div>
                <p className="text-xs md:text-base text-zinc-500 mb-4">{browseFiltered.length} results</p>
                {loadingInventory ? (
              <p className="text-zinc-500 text-sm md:text-base">Loading inventory...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {browseFiltered.map((shoe) => (
                    <a
                        key={shoe.id}
                        href={shoe.shopify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800 transition-colors"
                    >
                        {shoe.image_url ? (
                        <img src={shoe.image_url} alt={shoe.shoe_name} className="w-full h-28 rounded-lg object-contain bg-zinc-100 mb-3" />
                        ) : (
                        <div className="w-full h-28 rounded-lg bg-zinc-100 mb-3" />
                        )}
                        <p className="text-xs md:text-sm font-medium text-zinc-200 mb-1 leading-tight line-clamp-2">{shoe.shoe_name}</p>
                        <p className="text-xs md:text-sm text-zinc-500 mb-3">{shoe.sku}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                        <span className="text-sm md:text-base font-medium text-white">${parseFloat(shoe.price).toFixed(0)}</span>
                        <span className={`text-xs md:text-sm px-2 py-0.5 rounded-full ${
                            mySizes.includes(shoe.size)
                            ? "bg-blue-950 text-blue-300"
                            : "bg-zinc-800 text-zinc-400"
                        }`}>
                            {shoe.size}
                        </span>
                        </div>
                    </a>
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