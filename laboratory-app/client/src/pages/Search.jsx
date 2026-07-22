import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  IoSearchOutline,
  IoCheckmarkCircle,
  IoCloseCircleOutline,
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

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [searching, setSearching] = useState(false);
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("either");
  const [boxPref, setBoxPref] = useState("no_preference");
  const [maxPrice, setMaxPrice] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
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
          `/stockx/search?q=${encodeURIComponent(query)}`,
        );
        setResults(res.data.data || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setSearching(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = async () => {
    if (!selectedShoe || !size) return;
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/alerts", {
        shoe_name: selectedShoe.title,
        sku: selectedShoe.styleId,
        size,
        condition_preference: condition,
        box_preference: boxPref,
        max_price: maxPrice ? parseFloat(maxPrice) : null,
        notify_email: emailNotif,
        notify_inapp: inAppNotif,
        stockx_product_id: selectedShoe.productId,
        stockx_url_key: selectedShoe.urlKey,
      });

      setSuccess(true);
      setSelectedShoe(null);
      setQuery("");
      setSize("");
      setMaxPrice("");
      setCondition("either");
      setBoxPref("no_preference");
      setResults([]);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Failed to create alert. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="mx-6 md:mx-10 mb-4 bg-green-950 border border-green-900 text-green-400 text-xs md:text-sm rounded-xl px-2 py-4 flex items-center justify-between">
          <span>Alert created! We'll notify you when it drops!</span>
          <button
            onClick={() => navigate("/dashboard?tab=alerts")}
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
                  key={shoe.productId}
                  onClick={() => {
                    setSelectedShoe(shoe);
                    setSuccess(false);
                    setError("");
                    if (user?.sizes?.length > 0 && !size) {
                      setSize(user.sizes[0]);
                    }
                  }}
                  className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedShoe?.productId === shoe.productId
                      ? "border-blue-500 bg-zinc-900"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  {shoe.image_url ? (
                    <img
                      src={shoe.image_url}
                      alt={shoe.title}
                      className="w-20 h-20 opacity-0 transition-opacity rounded-lg object-contain bg-white shrink-0"
                      onLoad={(event) =>
                        event.target.classList.replace(
                          "opacity-0",
                          "opacity-100",
                        )
                      }
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-20 h-20 rounded-lg bg-zinc-800 shrink-0 items-center justify-center"
                    style={{ display: shoe.image_url ? "none" : "flex" }}
                  >
                    <span className="text-zinc-600 text-xs md:text-base text-center px-1">
                      {shoe.brand}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 h-20 md:h-auto flex flex-col justify-center">
                    <p className="text-sm md:text-base mb-1 font-medium text-zinc-200 line-clamp-2 leading-tight">
                      {shoe.title}
                    </p>
                    <p className="text-xs md:text-sm mb-2 text-zinc-500">
                      {shoe.styleId}
                    </p>
                    {shoe.productAttributes?.colorway && (
                      <p className="text-xs text-zinc-600 truncate">
                        {shoe.productAttributes.colorway}
                      </p>
                    )}
                  </div>
                  {selectedShoe?.productId === shoe.productId && (
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
              <p className="text-zinc-600 text-sm md:text-base">
                No results for "{query}"
              </p>
              <p className="text-zinc-600 text-xs md:text-sm mt-2">
                Try a different name or SKU
              </p>
            </div>
          )}

          {!query && (
            <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-sm">
                Searching a shoe to set up an alert for when it hits our store
              </p>
            </div>
          )}
        </div>

        {/* Right - alert form */}
        <div className="w-full border-t border-t-zinc-800 md:border-t-0 md:w-1/2 md:pl-8 mt-8 md:mt-0">
          {selectedShoe ? (
            <>
              <div className="bg-zinc-900 mt-6 md:mt-0 border border-zinc-800 rounded-xl overflow-hidden mb-6">
                {selectedShoe.image_url ? (
                  <img
                    src={selectedShoe.image_url}
                    alt={selectedShoe.title}
                    className="w-full h-44 md:h-52 object-contain opacity-0 transition-opacity bg-white"
                    onError={(event) => {
                      event.target.style.display = "none";
                      event.target.nextSibling.style.display = "flex";
                    }}
                    onLoad={(event) =>
                      event.target.classList.replace("opacity-0", "opacity-100")
                    }
                  />
                ) : null}
                <div
                  className="w-full h-44 md:h-52 bg-zinc-800 items-center justify-center"
                  style={{
                    display: selectedShoe.image_url ? "none" : "flex",
                  }}
                >
                  <span className="text-zinc-500 text-sm">
                    {selectedShoe.brand}
                  </span>
                </div>
                {/* Info always shows below image */}
                <div className="p-4">
                  <p className="text-sm md:text-base mb-1 font-medium text-zinc-200">
                    {selectedShoe.title}
                  </p>
                  <p className="text-xs md:text-sm mb-2 text-zinc-500">
                    {selectedShoe.styleId}
                  </p>
                  {selectedShoe.productAttributes?.colorway && (
                    <p className="text-xs text-zinc-600">
                      {selectedShoe.productAttributes.colorway}
                    </p>
                  )}
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
                      <option value={size} key={size}>
                        {size}
                      </option>
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
                    <option value="either">Either</option>
                    <option value="brand_new">Brand New</option>
                    <option value="pre_owned">Pre-Owned</option>
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
                    <option value="no_preference">No preference</option>
                    <option value="original_box">Original box only</option>
                    <option value="no_box">No box is fine</option>
                  </select>
                </div>

                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2 md:gap-3  text-xs md:text-base text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotif}
                      onChange={(event) => setEmailNotif(event.target.checked)}
                      className="accent-blue-500 w-3 h-3 md:w-5 md:h-5"
                    />
                    Email Notification
                  </label>
                  <label className="flex items-center gap-2 md:gap-3  text-xs md:text-base text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inAppNotif}
                      onChange={(event) => setInAppNotif(event.target.checked)}
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
