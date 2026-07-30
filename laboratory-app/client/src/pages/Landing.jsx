import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar"
import BottomNav from "../components/layout/BottomNav";
import api from "../api/axios.js"
import { BeamsBackground } from "../components/ui/BeamsBackground.jsx";
import { CyberneticBentoGrid } from "../components/ui/CyberneticBentoGrid.jsx";

const clothingAndOther = [
        "XS", "S", "M", "L", "XL", "XXL", "XXXL", "2XL", "3XL",
        "OS", "O/S", "4C", "4Y", "4.5Y", "5Y", "5.5Y", "6Y", "6.5Y",
        "7Y", "7.5Y", "8Y", "7 1/8", "7 1/4", "7 3/8", "7 1/2",
        "7 5/8", "7 3/4", "7 7/8", "8", "7", "Medium",
    ];

const isShoeSize = (size) => !clothingAndOther.includes(size);

export default function Landing() {
    const navigate = useNavigate();
    const [ inventory, setInventory] = useState([]);
    const tickerRef = useRef(null);
    const animFrameRef = useRef(null);
    const posRef = useRef(0);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await api.get("/inventory");
                setInventory(response.data.data || []);

            } catch (error) {
                console.error("Failed to fetch inventory:", error);

            }
        };
        fetchInventory();

    }, []);

    const shoeInventory = inventory.filter((item) => item.available > 0 && isShoeSize(item.size) && item.image_url);

    const tickerItems = shoeInventory.length > 0 ? [...shoeInventory, ...shoeInventory] : [];

    const recentDrops = [...shoeInventory].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);

    useEffect(() => {
        if (!tickerRef.current || tickerItems.length === 0) return
        
        const el = tickerRef.current;
        const speed = 1;

        const tick = () => {
            posRef.current -= speed;
            // Reset when we've scrolled half the width (seamless loop)
            if (Math.abs(posRef.current) >= el.scrollWidth / 2) {
                posRef.current = 0;

            }
            el.style.transform = `translateX(${posRef.current}px)`;
            animFrameRef.current = requestAnimationFrame(tick)

        };

        animFrameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animFrameRef.current);

    }, [tickerItems]);


    return (
      <div className="min-h-screen bg-zinc-950 text-white pb-20 md:pb-0">
        <Navbar />

        {/* Hero */}
        <div className="relative text-center px-12 py-40 overflow-hidden">
            {/* Shader background */}
            <BeamsBackground intensity="medium"/>

            {/* Dark overlay so text is readable */}
            <div className="absolute inset-0 bg-zinc-950/80" />

            {/* Hero content — must be above shader */}
            <div className="relative z-10">
                <p className="text-sm md:text-base text-blue-500 font-bold tracking-widest mb-4 md:mb-6">
                REAL-TIME SNEAKER ALERTS
                </p>
                <h1 className="text-2xl md:text-4xl font-bold leading-tight md:mb-6 mb-5">
                Get notified when your{" "}
                <span className="text-blue-500">next pair</span> drops in store
                </h1>
                <p className="text-zinc-400 text-xs font-medium md:text-lg max-w-md mx-auto mb-10">
                Set your size, pick your shoe, and we'll alert you the moment it
                hits our inventory
                </p>
                <div className="flex gap-3 justify-center">
                <button
                    onClick={() => navigate("/auth")}
                    className="bg-blue-500 text-white font-medium cursor-pointer px-5 py-2.5 text-xs md:text-lg tracking-wider md:tracking-normal rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-500"
                >
                    Create your alerts
                </button>
                <button
                    className="border border-blue-500 text-blue-500 cursor-pointer text-xs md:text-lg tracking-wider md:tracking-normal px-5 py-2.5 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                    onClick={() => navigate("/auth")}
                >
                    Browse inventory
                </button>
                </div>
            </div>
        </div>

        {/* Scroll ticker */}
        <div className="bg-zinc-900 border-t border-b border-zinc-700 py-6 overflow-hidden">
          <p className="text-center text-xs md:text-lg text-zinc-500 tracking-widest mb-3">
            LIVE INVENTORY
          </p>
          {tickerItems.length > 0 ? (
            <div
              ref={tickerRef}
              className="flex gap-3 will-change-transform"
              style={{ width: "max-content" }}
            >
              {tickerItems.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  onClick={() => navigate("/auth")}
                  className="shrink-0 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={
                      item.image_url.includes("?")
                        ? `${item.image_url}&width=200`
                        : `${item.image_url}?width=200`
                    }
                    alt={item.shoe_name}
                    className="w-full h-42 object-contain bg-white"
                  />
                  <div className="p-3 flex flex-col h-25 justify-between">
                    <p className="text-sm md:text-base mb-1 text-zinc-400 w-48 line-clamp-2 leading-tight">
                      {item.shoe_name}
                    </p>
                    <p className="text-base md:text-lg font-bold text-blue-600">
                      ${parseFloat(item.price).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-3" style={{ width: "max-content" }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden"
                >
                  <div className="w-48 h-36 bg-zinc-700 animate-pulse" />
                  <div className="p-3" style={{ height: "80px" }}>
                    <div className="h-3 w-32 bg-zinc-700 rounded animate-pulse mb-2" />
                    <div className="h-3 w-16 bg-zinc-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="px-6 py-14">
          <p className="text-xs md:text-sm text-blue-500 font-bold tracking-wide mb-2">
            HOW IT WORKS
          </p>
          <h2 className="text-xl md:text-2xl font-medium mb-5 md:mb-8">
            Everything you need to never miss a drop
          </h2>
          <CyberneticBentoGrid />
        </div>

        {/* Recent Drops */}
        <div className="bg-zinc-900 px-6 py-14">
          <p className="text-xs md:text-sm text-blue-500 font-bold tracking-wide mb-2">
            RECENT DROPS
          </p>
          <h2 className="text-xl md:text-2xl font-medium mb-5 md:mb-8">
            What's in The Lab right now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDrops.length > 0
              ? recentDrops.map((shoe) => (
                  <div
                    key={shoe.id}
                    onClick={() => navigate("/auth")}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden"
                  >
                    <img
                      src={
                        shoe.image_url.includes("?")
                          ? `${shoe.image_url}&width=400`
                          : `${shoe.image_url}?width=400`
                      }
                      alt={shoe.shoe_name}
                      className="h-48 w-full object-contain bg-white"
                    />
                    <div
                      className="p-4 flex flex-col justify-between"
                      style={{ height: "160px" }}
                    >
                      <p className="text-sm md:text-lg line-clamp-2 leading-tight font-medium text-zinc-200 mb-1">
                        {shoe.shoe_name}
                      </p>
                      <p className="text-xs md:text-sm text-zinc-500 mb-4">
                        {shoe.sku}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base font-medium  text-blue-500">
                          ${parseFloat(shoe.price).toFixed(0)}
                        </span>
                        <button
                          className="text-xs md:text-base cursor-pointer font-bold bg-blue-800 text-blue-200 px-3 py-1.5 rounded-lg"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate("/auth");
                          }}
                        >
                          Notify me
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden"
                  >
                    <div className="h-48 bg-zinc-700 animate-pulse" />
                    <div className="p-4">
                      <div className="h-4 w-40 bg-zinc-700 rounded animate-pulse mb-2" />
                      <div className="h-3 w-24 bg-zinc-700 rounded animate-pulse mb-4" />
                      <div className="flex justify-between">
                        <div className="h-4 w-16 bg-zinc-700 rounded animate-pulse" />
                        <div className="h-8 w-20 bg-zinc-700 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 py-14 text-center bg-zinc-950 border-t border-zinc-800">
          <h2 className="text-lg md:text-xl font-medium mb-5">
            Read to stop missing drops?
          </h2>
          <p className="text-xs md:text-base text-zinc-500 mb-6">
            Join The Laboratory and never miss your size again.
          </p>
          <button
            onClick={() => navigate("auth")}
            className="bg-blue-500 text-white cursor-pointer text-sm md:text-base font-medium px-6 py-3 rounded-lg hover:bg-blue-600 active:bg-blue-500 transition-colors "
          >
            Get started free
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-between">
          <span className="text-sm md:text-base text-zinc-600">
            The Laboratory DTX - Dallas, TX
          </span>
          <span className="text-sm md:text-base text-zinc-600">© 2026</span>
        </div>

        <BottomNav />
      </div>
    );
}