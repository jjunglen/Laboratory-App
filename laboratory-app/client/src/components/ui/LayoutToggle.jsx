import { IoListOutline, IoGridOutline } from "react-icons/io5";

export function LayoutToggle({ layout, setLayout }) {
  const options = [
    { key: "list", label: "List view", icon: <IoListOutline size={14} /> },
    { key: "2col", label: "2 column", icon: null },
    { key: "4col", label: "4 column", icon: null },
  ];

  return (
    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
            key={opt.key}
            onClick={() => setLayout(opt.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                layout === opt.key
                ? "bg-blue-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
        } ${opt.key === "4col" ? "hidden md:flex" : "flex"}`}
        >
        {opt.icon}
        {opt.label}
        </button>
      ))}
    </div>
  );
}
