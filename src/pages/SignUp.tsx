import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";

const clientPerks = ["Post unlimited projects", "AI-powered talent matching", "Secure milestone payments", "Dedicated support"];
const freelancerPerks = ["Showcase your portfolio", "Bid on 1000+ projects", "Get paid securely & fast", "Build your reputation"];

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleNext = () => {
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (!agreed) { setError("Please agree to the Terms of Service."); return; }
    setLoading(true);
    await signup(name, email, password, role);
    setLoading(false);
    navigate(role === "client" ? "/client-dashboard" : "/freelancer-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-white">Freelance<span className="text-violet-400">Hub</span></span>
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Join 50,000+ professionals today — it's free!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${s <= step ? "bg-violet-500" : "bg-white/20"}`} />
            ))}
          </div>

          {/* Role Toggle */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
            {(["client", "freelancer"] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${role === r ? "bg-white text-violet-700 shadow-md" : "text-white/70 hover:text-white"}`}
              >
                {r === "client" ? "👔 I'm Hiring" : "💼 I'm Freelancing"}
              </button>
            ))}
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-1.5 mb-6">
            {(role === "client" ? clientPerks : freelancerPerks).map((perk) => (
              <div key={perk} className="flex items-center gap-1.5 text-xs text-white/70">
                <span className="text-emerald-400">✓</span> {perk}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                />
              </div>
              {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-300 text-sm">⚠️ {error}</div>}
              <button onClick={handleNext} className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/30">
                Continue →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all pr-12"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded" />
                <span className="text-white/60 text-xs">I agree to the <span className="text-violet-400">Terms of Service</span> and <span className="text-violet-400">Privacy Policy</span></span>
              </label>
              {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-300 text-sm">⚠️ {error}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating...</> : "Create Account 🚀"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-violet-400 hover:text-violet-300 font-semibold">Sign in</Link>
          </p>
        </div>
        <p className="text-center text-white/30 text-xs mt-6">
          <Link to="/" className="hover:text-white/60 transition-colors">← Back to FreelanceHub</Link>
        </p>
      </div>
    </div>
  );
}
