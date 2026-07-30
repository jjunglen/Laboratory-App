import React, { useEffect, useRef } from "react";
import {
  BellRing,
  Search,
  ShieldCheck,
  TrendingUp,
  Smartphone,
} from "lucide-react";

const BentoItem = ({ className = "", children }) => {
  const itemRef = useRef(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;
    const handleMouseMove = (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);
    };
    item.addEventListener("mousemove", handleMouseMove);
    return () => item.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative rounded-xl border border-zinc-800 bg-zinc-900 p-5 overflow-hidden transition-colors hover:border-zinc-600 ${className}`}
      style={{
        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.06) 0%, transparent 60%), #18181b`,
      }}
    >
      {children}
    </div>
  );
};

export function CyberneticBentoGrid() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Large card — full on mobile, 2 cols + 2 rows on desktop */}
        <BentoItem className="md:col-span-2 md:row-span-2">
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center mb-4">
                <BellRing className="text-blue-400" size={20} />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-white mb-2">
                Instant alerts when your shoe drops
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                The moment a shoe hits The Laboratory DTX inventory in your
                size, you get notified instantly via email, in-app, and push
                notification — before anyone else has a chance to buy.
              </p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-zinc-400">Live notification</span>
              </div>
              <p className="text-sm text-zinc-200 font-medium">
                Jordan 4 Retro Bred Reimagined
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Size 10M/11.5W • $215 • Brand New
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-950 text-blue-300 px-2 py-1 rounded-full">
                  Email sent
                </span>
                <span className="text-xs bg-blue-950 text-blue-300 px-2 py-1 rounded-full">
                  Push sent
                </span>
                <span className="text-xs bg-blue-950 text-blue-300 px-2 py-1 rounded-full">
                  In-app
                </span>
              </div>
            </div>
          </div>
        </BentoItem>

        {/* Search card */}
        <BentoItem>
          <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center mb-3">
            <Search className="text-blue-400" size={18} />
          </div>
          <h2 className="text-base font-bold text-white mb-1">
            Search any shoe
          </h2>
          <p className="text-zinc-400 text-sm">
            Search by name or SKU from the full StockX catalog.
          </p>
        </BentoItem>

        {/* Price drop card */}
        <BentoItem>
          <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center mb-3">
            <ShieldCheck className="text-blue-400" size={18} />
          </div>
          <h2 className="text-base font-bold text-white mb-1">
            Price drop alerts
          </h2>
          <p className="text-zinc-400 text-sm">
            Get notified when a shoe you're tracking drops in price.
          </p>
        </BentoItem>

        {/* Size alerts — wide on desktop */}
        <BentoItem className="md:col-span-2 col-span-1">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="text-blue-400" size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white mb-1">
                Size alerts for anything in stock
              </h2>
              <p className="text-zinc-400 text-sm">
                Turn on size alerts and get notified whenever any shoe in your
                size hits The Lab — not just the ones you're tracking.
              </p>
            </div>
          </div>
        </BentoItem>

        {/* Mobile card */}
        <BentoItem>
          <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center mb-3">
            <Smartphone className="text-blue-400" size={18} />
          </div>
          <h2 className="text-base font-bold text-white mb-1">
            Works on mobile
          </h2>
          <p className="text-zinc-400 text-sm">
            Install as an app. Get push notifications on your phone.
          </p>
        </BentoItem>
      </div>
    </div>
  );
}
