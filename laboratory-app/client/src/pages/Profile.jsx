import { useState } from "react";
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
} from "react-icons/io5";

const sidebarItems = [
  { key: "profile", label: "Profile", icon: IoPersonOutline },
  { key: "prefs", label: "Preferences", icon: IoOptionsOutline },
  { key: "notifs", label: "Notifications", icon: IoNotificationsOutline },
  { key: "alerts", label: "My alerts", icon: IoAlertCircleOutline },
];

export default function Profile() {
    const [tab, setTab] = useState("profile");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(user?.full_name || "LM");
    const [email, setEmail ] = useState(user?.email || "you@email.com");
    const [emailNotif, setEmailNotif] = useState(true);
    const [inAppNotif, setInAppNotif] = useState(true);
    const [priceDrop, setPriceDrop] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");

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
            <div className="h-px bg-zinc-800 my-2"/>
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
            {/* Profile tab */}
            {tab === "profile" && (
              <>
                <div className="flex flex-col items-center md:items-start md:flex-row mt-5 md:mt-0 md:gap-4 mb-1">
                  <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-xl font-medium mb-3 md:mb-0">
                    {fullName?.[0]?.toUpperCase() || "J"}
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-base font-medium">{fullName}</p>
                    <p className="text-sm text-zinc-500">{email}</p>
                  </div>
                </div>

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
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <button className="bg-blue-500 cursor-pointer text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors">
                    Save changes
                  </button>
                </div>

                <button className="w-full border cursor-pointer border-red-500 text-red-500 text-sm py-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                  Delete account
                </button>
              </>
            )}

            {/* Preference tab */}
            {tab === "prefs" && (
              <div className="bg-zinc-900 border border-zinc-800 mt-5 md:mt-0 rounded-xl p-5">
                <p className="text-sm md:text-lg font-medium mb-1">
                  Your sizes
                </p>
                <p className="text-zinc-500 mb-4 text-sm md:text-base">
                  Used to filter "In stock" and your live inventory feed
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["10M/11.5W", "10.5M/12W"].map((size) => (
                    <span
                      key={size}
                      className="flex items-center gap-2 text-sm md:text-base bg-blue-950 text-blue-300 px-3 py-1 rounded-full"
                    >
                      {size}
                      <button className="cursor-pointer text-blue-400 hover:text-white">
                        x
                      </button>
                    </span>
                  ))}
                  <button className="text-sm md:text-base  cursor-pointer border border-dashed border-zinc-700 text-zinc-500 px-3 py-1.5 rounded-full hover:border-zinc-500 hover:text-zinc-300 transition-colors">
                    + Add size
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
                    value: emailNotif,
                    set: setEmailNotif,
                  },
                  {
                    label: "In-app alerts",
                    sub: "Notification bell",
                    value: inAppNotif,
                    set: setInAppNotif,
                  },
                  {
                    label: "Price drops",
                    sub: "Watched shoe price change",
                    value: priceDrop,
                    set: setPriceDrop,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3.5 border-b border-zinc-800 last:border-0"
                  >
                    <div>
                      <p className="text-sm md:text-base text-zinc-200">{item.label}</p>
                      <p className="text-xs md:text-sm text-zinc-500">{item.sub}</p>
                    </div>
                    <button
                      onClick={() => item.set(!item.value)}
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
              </div>
            )}

            {/* My alerts tab */}
            {tab === "alerts" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-5 md:mt-0">
                <p className="text-base md:text-xl font-medium mb-4">
                  Your tracked shoes
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      name: "Jordan 4 Travis Scott",
                      sub: "Waiting for 10M/11.5W",
                    },
                    {
                      name: "Yeezy 350 Bone",
                      sub: "Waiting for 10M/11.5W, 10.5M/12W",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col md:flex-row items-center gap-3 bg-zinc-800 rounded-lg p-3"
                    >
                      <div className="w-full h-32 md:w-18 md:h-18 bg-zinc-100 rounded-lg shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm mb-1 md:text-lg text-zinc-200">{item.name}</p>
                        <p className="text-xs md:text-sm text-zinc-500">{item.sub}</p>
                      </div>
                      <button className="text-xs md:text-base cursor-pointer text-red-500 hover:text-red-300 hover:border-red-300 border border-red-500 rounded-lg px-3.5 py-1">Remove</button>
                    </div>
                  ))}
                </div>
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