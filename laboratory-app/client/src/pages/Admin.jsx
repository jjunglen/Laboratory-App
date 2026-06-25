import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import {
    IoStatsChartOutline,
    IoPeopleOutline,
    IoAlertCircleOutline,
    IoRefreshOutline,
    IoTrashOutline,
    IoSearchOutline,
} from "react-icons/io5";

const stats = [
  { label: "Total users", value: "47", icon: IoPeopleOutline },
  { label: "Active alerts", value: "124" },
  { label: "Notifications sent", value: "891" },
  { label: "Purchases via app", value: "18", green: true },
];

const recentUsers = [
  { name: "JP", email: "jp@thelabdtx.com", role: "admin" },
  { name: "Jordan Smith", email: "jordan@test.com", role: "user" },
  { name: "Mike Johnson", email: "mike@test.com", role: "user" },
  { name: "Sarah Williams", email: "sarah@test.com", role: "user" },
];

const recentAlerts = [
    { shoe: "Jordan 4 Retro Bred Reimagined", meta: "10M/11.5W · Max $350", user: "jordan@test.com" },
    { shoe: "Nike Dunk Low Retro Panda", meta: "9.5M/11W · Max $200", user: "jordan@test.com" },
    { shoe: "New Balance 550 White Green", meta: "8M/9.5W · No max", user: "mike@test.com" },
    { shoe: "Jordan 1 Chicago Lost and Found", meta: "7M/8.5W · Max $500", user: "sarah@test.com" },
];

export default function Admin() {
    const [tab, setTab] = useState("overview");

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            <div className="px-6 md:px-10 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 md:h-13 md:w-13 bg-blue-950 flex items-center justify-center rounded-full shrink-0">
                        <IoStatsChartOutline className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <p className="text-base md:text-lg font-medium text-white">Admin dashboard</p>
                        <p className="text-xs md:text-sm text-zinc-500">Manage users, alerts, and inventory</p>
                    </div>
                </div>
            </div>

            <div className="px-6 md:px-10 pb-10 max-w-6xl mx-auto">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                            <p className="text-xs md:text-base text-zinc-500 mb-1 md:mb-2">{stat.label}</p>
                            <p className={`text-2xl md:text-3xl font-medium ${stat.green ? "text-green-400" : "text-white"}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* User + Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                    {/* Recent users */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <IoPeopleOutline className="text-zinc-400 text-xl md:text-2xl" />
                                <p className="text-base md:text-lg font-medium">Recent users</p>
                            </div>
                            <button className="text-xs md:text-lg cursor-pointer bg-zinc-800 px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors">View all</button>
                        </div>
                        <div className="flex flex-col">
                            {recentUsers.map((user) => (
                                <div key={user.email} className="flex items-center gap-3 py-3 border-b border-zinc-800 last:border-0">
                                    <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-blue-700 text-xs md:text-base font-medium shrink-0">
                                        {user.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm md:text-lg font-medium text-zinc-200 truncate">{user.name}</p>
                                        <p className="text-xs md:text-base text-zinc-500 truncate">{user.email}</p>
                                    </div>
                                    <span className={`text-xs md:text-base px-2.5 py-1 rounded-full shrink-0 ${user.role === "admin" ? "bg-blue-950 text-blue-300" : "bg-zinc-800 text-zinc-400"}`}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent alerts */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <IoAlertCircleOutline className="text-zinc-400 text-xl md:text-2xl" />
                                <p className="text-base font-medium">Recent alerts</p>
                            </div>
                            <button className="text-xs cursor-pointer md:text-lg bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors">
                                View all
                            </button>
                        </div>
                        <div className="flex flex-col">
                            {recentAlerts.map((alert, i) => (
                                <div key={i} className="flex items-start justify-between gap-3 py-3 border-b border-zinc-800 last:border-0">
                                    <div className="min-w-0">
                                        <p className="text-sm md:text-lg  mb-1 font-medium text-zinc-200 truncate">{alert.shoe}</p>
                                        <p className="text-xs md:text-sm mb-1 text-zinc-500">{alert.meta}</p>
                                        <p className="text-xs md:text-base text-blue-400">{alert.user}</p>
                                    </div>
                                    <span className="text-xs md:text-base bg-blue-950 text-blue-300 px-2.5 py-1 rounded-full shrink-0">
                                        Active
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Inventory management */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-base md:text-xl font-medium mb-2">Inventory management</p>
                    <p className="text-sm md:text-base text-zinc-500 mb-4 leading-relaxed">Manually reset inventory or trigger a resync from Shopify. Webhooks will repopulate automatically after a reset.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button className="cursor-pointer w-full flex items-center gap-2 text-sm md:text-base bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors">
                            <IoSearchOutline size={16} /> View inventory
                        </button>
                        <button className="cursor-pointer w-full flex items-center gap-2 text-sm md:text-base bg-zinc-800 text-zinc-300 px-4 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors">
                            <IoRefreshOutline size={16} /> Reset inventory
                        </button>
                        <button className="cursor-pointer w-full flex items-center gap-2 text-sm md:text-base bg-red-950 text-red-400 px-4 py-2.5 rounded-lg hover:bg-red-900 transition-colors">
                            <IoTrashOutline size={16} /> Clear all alerts
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}