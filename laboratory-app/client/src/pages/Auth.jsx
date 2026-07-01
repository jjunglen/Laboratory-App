import { useState } from "react";
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


    const { login, register } = useAuth();
    const navigate = useNavigate();

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

        if (!hasSize) {
            navigate("/onboarding/size");

        }  else {
            navigate("/dashboard");

        }



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
                        <button className="w-full flex justify-center items-center cursor-pointer gap-2 border border-zinc-800 bg-zinc-900 text-zinc-200 text-sm md:text-lg py-2.5 rounded-lg hover:bg-zinc-700 hover:text-white hover:border-zinc-300 active:bg-zinc-900 active:border-zinc-800 transition-colors">
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