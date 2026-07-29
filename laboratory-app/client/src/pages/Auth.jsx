import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";


export default function Auth() {
    const [tab, setTab] = useState("login");
    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");
    const [ fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [ submitting, setSubmitting] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const { login, register, setTokenFromGoogle } = useAuth();

    const navigate = useNavigate();

    // Handles token from Google 0Auth redirect
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const errorParam = params.get("error");

        if (errorParam) {
        setError("Google sign in failed. Please try again.");
        return;

        }

        if (token) {
        setTokenFromGoogle(token);
        // Clean URL
        window.history.replaceState({}, "", "/auth");

        }

    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        // validate password match on signup
        if (tab === 'signup' && password !== confirmPassword) {
            setError("Passwords do not match");
            return
        }

        setSubmitting(true);

        const result = tab === "login" ? await login(email, password) : await register(email, password, fullName);

        setSubmitting(false);

        if (!result.success) {
            setError(result.error);
            return

        }

        // route based on whether the user have set sizes yet
        const hasSize = result.user?.sizes && result.user.sizes.length > 0;

        navigate(hasSize ? "/dashboard" : "onboarding/size");
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;

    }

    return (
        <div className="min-h-screen text-white bg-zinc-950">
            <Navbar />
            <div className="flex justify-center items-center px-4 py-12">
                <div className="w-full max-w-5xl flex border border-zinc-800 rounded-xl overflow-hidden">
                    {/* Left panel - desktop only */}
                    <div className="hidden md:flex flex-col justify-between w-5/12 bg-zinc-900 p-8">
                        <div>
                            <h2 className="text-2xl mb-3">The{" "}<span className="text-blue-500">Laboratory</span></h2>
                            <p className="text-xl font-medium mb-3">Never miss your size again</p>
                            <p className="text-base font-medium leading-relaxed mb-6 text-zinc-500">Join hundreds of sneaker buyers getting real time alerts</p>
                            {[
                                "Instant email and in-app notifications",
                                "Search any shoe by name or SKU",
                                "Direct link to buy when it's in",
                            ].map((info) => (
                                <div key={info} className="flex items-center gap-3 mb-3">
                                    <div className="w-6 h-6 p-3 flex items-center justify-center border border-blue-200 bg-blue-900 rounded-full ">
                                        <span className="text-blue-200 text-lg">✓</span>
                                    </div>
                                    <span className="text-zinc-300">{info}</span>
                                </div>
                            ))}
                            
                        </div>
                        <p className="hidden md:block text-sm px-8 py-1 bg-zinc-900 w-11/12 text-zinc-600">The Laboratory DTX - Dallas, TX</p>
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 bg-zinc-950 p-8">
                        <div className="flex mb-6">
                            {["login", "signup"].map((index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setTab(index);
                                        setError("");
                                    }}
                                    className={`text-sm md:text-lg pb-2 mr-6 cursor-pointer border-b-2 transition-colors ${tab === index ? "text-blue-500 border-blue-500" : "text-zinc-500 border-transparent"}`}
                                >
                                    {index === "login" ? "Log in" : "Sign up"}
                                </button>
                            ))}
                        </div>
                        <button 
                            className="w-full flex justify-center items-center cursor-pointer gap-2 border border-zinc-800 bg-zinc-900 text-zinc-200 text-sm md:text-lg py-2.5 rounded-lg hover:bg-zinc-700 hover:text-white hover:border-zinc-300 active:bg-zinc-900 active:border-zinc-800 transition-colors"
                            onClick={handleGoogleLogin}
                        >   
                            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-3 mb-4 mt-2">
                            <div className="flex-1 h-px bg-zinc-800"/>
                            <span>or</span>
                            <div className="flex-1 h-px bg-zinc-800"/>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-950 border border-red-900 text-red-400 text-sm md:text-base rounded-lg px-3 py-2 mb-3">
                                    {error}
                                </div>
                            )}

                            {tab === "signup" && (
                                <div className="mb-3">
                                    <label className="text-xs md:text-base text-zinc-500 block mb-1 ml-1">Full Name</label>
                                    <input 
                                        type="text"
                                        placeholder="Your name" 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                                        value={fullName}
                                        onChange={(event) => setFullName(event.target.value)}
                                        required
                                        />
                                </div>
                            )}
                            
                            <div className="mb-3">
                                    <label className="text-xs md:text-base text-zinc-500 block mb-1 ml-1">Email address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                        placeholder="you@example.com" 
                                        className="w-full bg-zinc-900 border border-zinc-800 tracking-wide rounded-lg px-3 py-2 text-sm md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"/>
                                </div>

                                <div className="mb-4">
                                    <label className="text-xs md:text-base text-zinc-500 block mb-1 ml-1">Password</label>
                                    <input 
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-zinc-900 tracking-widest border border-zinc-800 rounded-lg px-3 py-2 text-sm md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"/>
                                </div>

                                { tab === "signup" && (
                                <div className="mb-4">
                                    <label className="text-xs md:text-base text-zinc-500 block mb-1 ml-1">Confirm password</label>
                                    <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-zinc-900 tracking-widest border border-zinc-800 rounded-lg px-3 py-2 text-sm md:text-base text-zinc-200 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                )}
                                

                                <button 
                                    className="w-full py-2.5 text-sm text-white cursor-pointer md:text-base font-medium bg-blue-500  rounded-lg hover:bg-blue-600 transition-colors"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? "Please wait..." : tab === "login" ? "Log In" : "Create account"}
                                </button>
                            </form>

                            <p className="text-xs md:text-sm text-zinc-600 text-center mt-4">
                                {tab === "login" ? "Don't have an account?" : "Already have an account?"} <span className="text-blue-500 cursor-pointer hover:text-blue-400 hover:underline" onClick={() => setTab(tab === "login" ? "signup" : "login")}>{tab === "login" ? "Sign up free" : "Log in"}</span>
                            </p>
                    </div>
                </div>
            </div>
        </div>
    );
}