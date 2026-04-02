import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const ok = await login(email, password, role);
    setLoading(false);
    if (ok) navigate(role === "client" ? "/client-dashboard" : "/freelancer-dashboard");
    else setError("Invalid credentials. Try client@demo.com or freelancer@demo.com");
  };

  const demoLogin = async (demoRole: UserRole) => {
    setLoading(true);
    const demoEmail = demoRole === "client" ? "client@demo.com" : "freelancer@demo.com";
    await login(demoEmail, "demo123", demoRole);
    setLoading(false);
    navigate(demoRole === "client" ? "/client-dashboard" : "/freelancer-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-white">Freelance<span className="text-violet-400">Hub</span></span>
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Welcome back! Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Role Toggle */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
            {(["client", "freelancer"] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${role === r ? "bg-white text-violet-700 shadow-md" : "text-white/70 hover:text-white"}`}
              >
                {r === "client" ? "👔 I'm Hiring" : "💼 I'm a Freelancer"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-xs">or try demo</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => demoLogin("client")} className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all">
              👔 Demo Client
            </button>
            <button onClick={() => demoLogin("freelancer")} className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all">
              💼 Demo Freelancer
            </button>
          </div>

          <p className="text-center text-white/50 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold">Create one free</Link>
          </p>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <Link to="/" className="hover:text-white/60 transition-colors">← Back to FreelanceHub</Link>
        </p>
      </div>
    </div>
  );
}
