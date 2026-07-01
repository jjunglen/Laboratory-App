import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircle, IoArrowForward } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios.js"

const sizeOptions = [
    "3.5M/5W", "4M/5.5W", "4.5M/6W", "5M/6.5W", "5.5M/7W",
    "6M/7.5W", "6.5M/8W", "7M/8.5W", "7.5M/9W", "8M/9.5W",
    "8.5M/10W", "9M/10.5W", "9.5M/11W", "10M/11.5W", "10.5M/12W",
    "11M/12.5W", "11.5M/13W", "12M/13.5W", "12.5M/14W", "13M/14.5W",
    "13.5M/15W", "14M/15.5W", "14.5M/16W", "15M", "16M", "17M",
];

// Mock counts — once backend is connected this comes from
// GET /api/inventory?sizes=... returning a count
const mockCountsBySize = {
    "3.5M/5W": 1, "4M/5.5W": 1, "4.5M/6W": 2, "5M/6.5W": 2, "5.5M/7W": 2,
    "6M/7.5W": 3, "6.5M/8W": 3, "7M/8.5W": 4, "7.5M/9W": 5, "8M/9.5W": 4,
    "8.5M/10W": 6, "9M/10.5W": 9, "9.5M/11W": 7, "10M/11.5W": 14, "10.5M/12W": 11,
    "11M/12.5W": 8, "11.5M/13W": 5, "12M/13.5W": 3, "12.5M/14W": 2, "13M/14.5W": 2,
    "13.5M/15W": 1, "14M/15.5W": 1, "14.5M/16W": 1, "15M": 1, "16M": 0, "17M": 0,
};



export default function OnboardingSize() {
    const [ selected, setSelected ] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const { updateUser } = useAuth();

    const navigate = useNavigate();

    const toggleSize = (size) => {
        setSelected((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);

    }

    const totalCount = selected.reduce(
        (sum, size) => sum + (mockCountsBySize[size] || 0),
        0
    );

    const handleContinue = async () => {
        // PUT /api/users/me with { sizes: selected } goes here once connected
        setError("");
        setSaving(true);

        try {
            const response = await api.put("/users/profile", {sizes: selected });
            updateUser({ sizes: response.data.data.sizes });
            navigate("/dashboard");

        } catch(error) {
            console.error("Failed to save sizes", error);
            setError("Something went wrong saving your sizes. Please try again.");

        } finally {
            setSaving(false);

        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <p className="text-2xl md:text-4xl font-medium text-white mb-2 md:mb-4">What's your size?</p>
                    <p className="text-xs md:text-base text-zinc-500">We'll show you everything we have, always - pick as many fit you</p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                    {sizeOptions.map((size) => {
                        const isSelected = selected.includes(size);
                        return (
                            <button
                            key={size}
                                onClick={() => toggleSize(size)}
                                className={`relative border cursor-pointer rounded-xl py-4.5 text-sm md:text-lg font-medium transition-colors ${isSelected ? "border-blue-500 bg-blue-950 text-blue-300" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"} `}
                            >
                                {size}
                                {isSelected && (
                                    <IoCheckmarkCircle size={20} className="absolute top-0.5 right-0.5 text-blue-400"/>
                                )}
                            </button>
                        );
                    })}
                </div>
                
                {error && (
                    <div className="bg-red-950 border border-red-900 text-red-400 text-sm md:text-base rounded-lg px-3 py-2 mb-3">
                        {error}
                    </div>
                )}

                {selected.length > 0 ? (
                    <div className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mb-6">
                        <span className="text-sm md:text-lg text-zinc-400">
                            <span className="text-blue-500 font-medium">{totalCount} shoes</span> in stock across your selected sizes
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mb-6">
                        <span className="text-sm md:text-lg text-zinc-500">Select at least one size to continue</span>
                    </div>
                )}

                <button
                    onClick={handleContinue}
                    disabled={selected.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white text-base md:text-lg font-medium py-3.5 rounded-xl hover:bg-blue-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    {saving ? "Saving..." : "Continue"} {!saving && <IoArrowForward size={18} />}
                </button>
            </div>
        </div>
    )
}