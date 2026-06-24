import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import { IoAddOutline, IoSearchOutline, IoChevronDownOutline, IoBagCheckOutline, IoSparklesOutline, IoGridOutline } from "react-icons/io5";

const tabs = [
  { key: "alerts", label: "Your alerts" },
  { key: "instock", label: "In stock" },
  { key: "new", label: "New arrivals" },
  { key: "browse", label: "Browse inventory" },
];

const mySizes = ["10M/11.5W", "10.5M/12W"];

const myAlerts = [
  { name: "Jordan 4 Travis Scott", sub: "Waiting for size 10M/11.5W" },
  { name: "Yeezy 350 Bone", sub: "Waiting for 10M/11.5W, 10.5M/12W" },
];

const inStock = [
  { name: "Dunk Low Panda", sku: "DD1391-100", size: "10M/11.5W", price: "$140" },
  { name: "New Balance 550 White", sku: "BB550WT1", size: "10.5M/12W", price: "$120" },
  { name: "Air Force 1 White", sku: "CW2288-111", size: "10M/11.5W", price: "$95" },
];

const newArrivals = [
  { name: "Jordan 1 Chicago Lost & Found", sku: "DZ5485-612", price: "$310", time: "2h ago" },
  { name: "Dunk Low Panda", sku: "DD1391-100", price: "$140", time: "5h ago" },
  { name: "Yeezy Slide Onyx", sku: "FW6948", price: "$70", time: "1d ago" },
];

const allInventory = [
  { name: "Jordan 1 Chicago Lost & Found", sku: "DZ5485-612", size: "9.5M/11W", price: "$310", mine: false },
  { name: "Dunk Low Panda", sku: "DD1391-100", size: "10M/11.5W", price: "$140", mine: true },
  { name: "Yeezy 350 Bone", sku: "HQ2061", size: "11M/12.5W", price: "$230", mine: false },
  { name: "New Balance 550 White", sku: "BB550WT1", size: "10.5M/12W", price: "$120", mine: true },
  { name: "Air Force 1 White", sku: "CW2288-111", size: "10M/11.5W", price: "$95", mine: true },
  { name: "Jordan 4 Black Cat", sku: "CU1110-010", size: "9M/10.5W", price: "$280", mine: false },
  { name: "Travis Scott Fragment", sku: "DM7866-200", size: "10M/11.5W", price: "$650", mine: true },
  { name: "Vans Old Skool Black", sku: "VN000D3HY28", size: "11.5M/13W", price: "$65", mine: false },
];

export default function Dashboard() {
    const [tab, setTab] = useState("alerts");
    const navigate = useNavigate();

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
                                    <p className="text-base md:text-lg font-medium text-white"><span className="text-blue-500 text-xl">{myAlerts.length}</span> shoes tracked</p>
                                    <p className="text-xs md:text-sm text-zinc-500">We'll notify you the second they drop</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/search")}
                                className="flex items-center gap-2 mb-3 sm:mb-0 bg-blue-950 text-blue-300 text-sm md:text-base px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors"
                            >
                                <IoAddOutline size={18} /> Track a new shoe
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {myAlerts.map((alert) => (
                                <div key={alert.name} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg bg-zinc-100 shrink-0"/>
                                        <div>
                                            <p className="text-sm md:text-base font-medium text-zinc-200 mb-1">{alert.name}</p>
                                            <p className="text-xs md:text-sm text-zinc-500">{alert.sub}</p>
                                        </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* In stock tab */}
                {tab === "instock" && (
                    <>
                        <div className="flex items-center justify-between flex-wrap mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-13 h-13 rounded-full bg-blue-800">
                                    <IoGridOutline size={25} className="text-blue-300"/>
                                </div>
                                <div>
                                    <p className="text-base md:text-lg font-medium text-white">In stock in your sizes</p>
                                    <div className="flex gap-2 mt-1">
                                        {mySizes.map((size) => (
                                            <span key={size} className="text-xs md:text-sm bg-zinc-900 border border-zinc-800 text-zinc-400 py-1 px-3 rounded-full">
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/search")}
                                className="flex items-center gap-2 mb-3 sm:mb-0 bg-blue-950 text-blue-300 text-sm md:text-base px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors"
                            >
                                <IoAddOutline size={18}/> Track a new shoe
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {inStock.map((shoe) => (
                                <div key={shoe.sku} className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4">
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg bg-zinc-100 mb-1"/>
                                    <div className="flex-1">
                                        <p className="text-sm md:text-base font-medium text-zinc-300 ml-1 mb-1">{shoe.name}</p>
                                        <span className="text-xs md:text-sm bg-blue-950 text-zinc-200 px-2.5 py-1 rounded-full">{shoe.size}</span>
                                    </div>
                                    <span className="text-base bg-white rounded-full px-2.5 py-1 text-blue-700 font-black tracking-wide">{shoe.price}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* New arrivals tab */}
                {tab === "new" && (
                    <>
                        <div className="flex items-center justify-between flex-wrap mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-13 h-13 rounded-full bg-blue-800">
                                    <IoSparklesOutline size={25} className="text-blue-300"/>
                                </div>
                                <div>
                                    <p className="text-base md:text-lg font-medium text-white">New arrivals</p>
                                    <p className="text-xs md:text-sm text-zinc-500">Newest listings across all sizes </p>                                
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/search")}
                                className="flex items-center gap-2 mb-3 sm:mb-0 bg-blue-950 text-blue-300 text-sm md:text-base px-4 py-2.5 rounded-lg hover:bg-blue-900 transition-colors"
                            >
                                <IoAddOutline size={18}/> Track a new shoe
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {newArrivals.map((shoe) => (
                                <div key={shoe.sku} className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl">
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg bg-zinc-200 shrink-0"/>
                                    <div className="flex-1">
                                        <p className="text-sm md:text-base font-medium text-zinc-200 mb-2">{shoe.name}</p>
                                        <span className="text-xs md:text-sm bg-green-950 text-green-200 px-3 py-1 rounded-full">{shoe.time}</span>
                                    </div>
                                    <span className="text-base bg-white rounded-full px-2.5 py-1 text-blue-700 font-black tracking-wide">{shoe.price}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Browse Inventory Tab */}
                {tab === "browse" && (
                    <>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-blue-800 shrink-0">
                                <IoSearchOutline className="text-blue-300" size={25}/>
                            </div>
                            <div>
                                <p className="text-sm md:text-base font-medium text-white">Browse inventory</p>
                                <p className="text-xs md:text-sm text-zinc-500 ">{allInventory.length} shoes in stock right now</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6 mt-5 flex-wrap">
                            <div className="relative flex-1 min-w-[220px]">
                                <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search the full inventory"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-xs md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <button className="flex items-center gap-2 text-xs md:text-base border border-zinc-800 bg-zinc-900 text-zinc-400 px-4 py-3 rounded-lg hover:border-zinc-700 transition-colors">
                                All sizes <IoChevronDownOutline size={16} />
                            </button>
                            <span className="text-xs md:text-base border border-zinc-800 bg-zinc-900 text-zinc-400 px-4 py-2.5 rounded-full cursor-pointer hover:border-zinc-700 transition-colors">Jordan</span>
                            <span className="text-xs md:text-base border border-zinc-800 bg-zinc-900 text-zinc-400 px-4 py-2.5 rounded-full cursor-pointer hover:border-zinc-700 transition-colors">Under $200</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allInventory.map((shoe) => (
                                <div key={shoe.sku} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 ">
                                    <div className="w-full md:h-40 h-32 rounded-lg bg-zinc-100 mb-4 overflow-hidden"/>
                                    <p className="text-sm md:text-base font-medium text-zinc-200 mb-1 leading-tight">{shoe.name}</p>
                                    <p className="text-xs md:text-sm text-zinc-500 mb-3">{shoe.sku}</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                                        <span className="text-base md:text-xl font-bold tracking-widerBlue bg-blue-800 text-blue-100 rounded-full px-3 py-1">{shoe.price}</span>
                                        <span className="text-sm md:text-base px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">{shoe.size}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    )
}