import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { IoMailOutline } from "react-icons/io5";
import api from "../api/axios.js";

export default function VerifyEmail() {
    const location = useLocation();
    const email = location.state?.email || "your email";
    const [resent, setResent] = useState(false);
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
    setResending(true);
    try {
    await api.post("/auth/resend-verification", { email });
    setResent(true);
    } catch (error) {
    console.error("Failed to resend:", error);
    } finally {
    setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-950 flex items-center justify-center mb-6">
            <IoMailOutline size={32} className="text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-2">
            We sent a verification link to
            </p>
            <p className="text-blue-400 font-medium mb-6">{email}</p>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            Click the link in your email to verify your account and continue to
            onboarding. You can close this tab.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full text-left mb-6">
            <p className="text-sm text-zinc-400 font-medium mb-2">
                Didn't get the email?
            </p>
            <ul className="text-xs text-zinc-500 space-y-1 mb-4">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the right email</li>
                <li>• Allow a few minutes for delivery</li>
            </ul>
            {resent ? (
                <p className="text-green-400 text-sm">
                Email resent! Check your inbox.
                </p>
            ) : (
                <button
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer disabled:text-zinc-600"
                >
                {resending ? "Resending..." : "Resend verification email →"}
                </button>
            )}
            </div>
        </div>
    </div>
  );
}
