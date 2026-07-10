import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { IoSearchOutline, IoCheckmarkCircle, IoCloseCircleOutline } from "react-icons/io5";

const sizeOptions = [
    "3.5M/5W", "4M/5.5W", "4.5M/6W", "5M/6.5W", "5.5M/7W",
    "6M/7.5W", "6.5M/8W", "7M/8.5W", "7.5M/9W", "8M/9.5W",
    "8.5M/10W", "9M/10.5W", "9.5M/11W", "10M/11.5W", "10.5M/12W",
    "11M/12.5W", "11.5M/13W", "12M/13.5W", "12.5M/14W", "13M/14.5W",
    "13.5M/15W", "14M/15.5W", "14.5M/16W", "15M", "16M", "17M",
];

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedShoe, setSelectedShoe] = useState(null);
    const [searching, setSearching] = useState(false);
    const [size, setSize] = useState("");
    const [condition, setCondition ] = useState("either");
    const [boxPref, setBoxPref] = useState("no_preference");
    const [maxPrice, setMaxPrice] = useState("");
    const [emailNotif, setEmailNotif] = useState(true);
    const [inAppNotif, setInAppNotif] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [ success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!query.trim()) {
        setResults([]);
        return;
        }

        const timeout = setTimeout(async () => {
        setSearching(true);
        try {
            const res = await api.get(
            `/inventory/search?q=${encodeURIComponent(query)}`,
            );
            const seen = new Set();
            const unique = (res.data.data || []).filter((item) => {
            if (seen.has(item.shoe_name)) return false;
            seen.add(item.shoe_name);
            return true;
            });
            setResults(unique);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setSearching(false);
        }
        }, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    const handleSubmit = async () => {
        if (!selectedShoe || !size) return;
        setSubmitting(true);
        setError("");
        setSuccess(false);
        
        try {
            await api.post("/alerts", {
                shoe_name: selectedShoe.shoe_name,
                sku: selectedShoe.sku,
                size,
                condition_preference: condition,
                box_preference: boxPref,
                max_price: maxPrice ? parseFloat(maxPrice) : null,
                notify_email: emailNotif,
                notify_inapp: inAppNotif,

            });

            setSuccess(true);
            setSelectedShoe(null);
            setQuery("");
            setSize("");
            setMaxPrice("");
            setCondition("either");
            setBoxPref("no_preference");
            setResults([]);

        } catch(error) {
            setError(err.response?.data?.error || "Failed to create alert. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
      <div className="min-h-screen bg-zinc-950 text-white pb-24 md:pb-0">
        <Navbar />

        <div className="px-6 md:px-10 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-13 md:h-13 bg-blue-950 flex items-center justify-center rounded-full shrink-0">
              <IoSearchOutline className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm md:text-lg font-medium text-white">
                Track a new shoe
              </p>
              <p className="text-xs md:text-sm text-zinc-500">
                We'll notify you the moment it hits our store
              </p>
            </div>
          </div>
        </div>

        {/* Success banner */}
        {success && (
          <div className="mx-6 md:mx-10 mb-4 bg-green-950 border border-green-900 text-green-400 text-sm md:text-base rounded-xl px-4 py-3 flex items-center justify-between">
            <span>Alert created! We'll notify you when it drops!</span>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-green-300 underline text-xs md:text-sm ml-4"
            >
              View alerts
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mx-6 md:mx-10 mb-4 bg-red-950 border border-red-900 text-red-400 text-sm md:text-base rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-0 max-w-6xl mx-auto px-6 md:px-10 pb-10">
          {/* LEFT — search + results */}
          <div className="w-full md:w-1/2 md:pr-8 md:border-r border-zinc-800">
            <div className="relative mb-2">
              <IoSearchOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={18}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedShoe(null);
                  setSuccess(false);
                  setError("");
                }}
                placeholder="Search by name or SKU..."
                className="w-full bg-zinc-900 border border-blue-500 rounded-xl pl-11 pr-10 py-3.5 text-base text-zinc-200 outline-none"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedShoe(null);
                    setResults([]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <IoCloseCircleOutline size={18} />
                </button>
              )}
            </div>

            {query && !searching && (
              <p className="text-sm md:text-base text-zinc-600 mb-4">
                Tap a shoe to set an alert
              </p>
            )}

            {searching && (
              <p className="text-zinc-500 text-xs md:text-sm py-4">
                Searching...
              </p>
            )}

            {!searching && results.length > 0 && (
              <div className="flex flex-col gap-2">
                {results.map((shoe) => (
                  <div
                    key={shoe.id}
                    onClick={() => {
                      setSelectedShoe(shoe);
                      setSuccess(false);
                      setError("");
                      if (user?.sizes?.length > 0 && !size) {
                        setSize(user.size[0]);
                      }
                    }}
                    className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedShoe?.sku === shoe.sku
                        ? "border-blue-500 bg-zinc-900"
                        : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                    }`}
                  >
                    {shoe.image_url ? (
                      <img
                        src={
                          shoe.image_url.includes("?")
                            ? `${shoe.image_url}&width=200`
                            : `${shoe.image_url}?width=200`
                        }
                        alt={shoe.shoe_name}
                        className="w-17 h-17 rounded-lg object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-17 h-17 rounded-lg bg-white shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">
                            {shoe.shoe_name}
                        </p>
                        <p className="text-xs text-zinc-500">{shoe.sku}</p>
                    </div>
                    {selectedShoe?.id === shoe.id && (
                        <IoCheckmarkCircle
                            className="text-blue-500 shrink-0"
                            size={22}
                        />
                    )}
                  </div>
                ))}
              </div>
            )}

            {!searching && query && results.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <p className="text-zinc-600 text-sm md:text-base">No results for "{query}"</p>
                    <p className="text-zinc-600 text-xs md:text-sm mt-2">Try a different name or SKU</p>
                </div>
            )}

            {!query && (
                <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-sm">Searching a shoe to set up an alert for when it hits our store</p>
                </div>
            )}
          </div>

          {/* Right - alert form */}
          <div className="w-full border-t border-t-zinc-800 md:border-t-0 md:w-1/2 md:pl-8 mt-8 md:mt-0">
            {selectedShoe ? (
              <>
                <div className="bg-zinc-900 mt-6 md:mt-0 border border-zinc-800 rounded-xl mb-6">
                    {selectedShoe.image_url ? (
                        <img 
                            src={selectedShoe.image_url.includes("?") ? `${selectedShoe.image_url}&width=400`
                            : `${selectedShoe.image_url}?width=400`}
                            alt={selectedShoe.shoe_name} 
                            className="w-full h-40 md:48 object-contain bg-white rounded-t-lg"
                        /> ) : (
                            <div className="h-40 md:h-48 rounded-t-xl bg-zinc-100" />
                        )
                    }
                    <div className="p-4">
                        <p className="text-base md:text-xl mb-1 md:mb-2 font-medium text-zinc-200">
                        {selectedShoe.shoe_name}
                        </p>
                        <p className="text-sm md:text-base text-zinc-500">
                        {selectedShoe.sku}
                        </p>
                    </div>
                </div>

                <p className="md:text-base text-sm font-medium text-white mb-4">
                  Set your alert preferences
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm md:text-base text-zinc-500 block mb-1.5">
                      Size
                    </label>
                    <select
                      value={size}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                      onChange={(event) => setSize(event.target.value)}
                    >
                      <option value="">Select your size</option>
                      {sizeOptions.map((size) => (
                        <option value={size} key={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm md:text-base text-zinc-500 block mb-1.5">
                      Max price (optional)
                    </label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="e.g. 350"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm md:text-base text-zinc-500 block mb-1.5">
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(event) => setCondition(event.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                    >
                      <option>Either</option>
                      <option>Brand New</option>
                      <option>Pre-Owned</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm md:text-base text-zinc-500 block mb-1.5">
                      Box Preference
                    </label>
                    <select
                      value={boxPref}
                      onChange={(event) => setBoxPref(event.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                    >
                      <option>No preference</option>
                      <option>Original box only</option>
                    </select>
                  </div>

                  <div className="flex gap-6 mb-4">
                    <label className="flex items-center gap-2 md:gap-3  text-xs md:text-base text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotif}
                        onChange={(event) =>
                          setEmailNotif(event.target.checked)
                        }
                        className="accent-blue-500 w-3 h-3 md:w-5 md:h-5"
                      />
                      Email Notification
                    </label>
                    <label className="flex items-center gap-2 md:gap-3  text-xs md:text-base text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inAppNotif}
                        onChange={(event) =>
                          setInAppNotif(event.target.checked)
                        }
                        className="accent-blue-500 w-3 h-3 md:w-5 md:h-5"
                      />
                      In-app Notification
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!size || submitting}
                  className="w-full bg-blue-500 text-white text-sm md:text-base font-medium py-2.5 rounded-xl hover:bg-blue-600 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Creating alert..." : "Set alert →"}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
                <p className="text-zinc-600 text-sm md:text-base">
                  Select a shoe from the results to set an alert
                </p>
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    );
}