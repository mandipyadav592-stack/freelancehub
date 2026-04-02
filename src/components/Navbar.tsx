import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Find Talent", id: "freelancers" },
  { label: "Browse Work", id: "projects" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Why Us", id: "features" },
  { label: "Testimonials", id: "testimonials" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (!isHomePage) return;
      const ids = navLinks.map((l) => l.id);
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  const scrollTo = (id: string) => {
    if (!isHomePage) { navigate("/"); setTimeout(() => { const el = document.getElementById(id); if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top, behavior: "smooth" }); } }, 100); }
    else { const el = document.getElementById(id); if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top, behavior: "smooth" }); } }
    setMenuOpen(false);
  };

  const handleLogout = () => { logout(); navigate("/"); setProfileOpen(false); };
  const dashboardLink = user?.role === "client" ? "/client-dashboard" : "/freelancer-dashboard";

  const isDark = isHomePage && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHomePage ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-300/40 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <span className={`text-xl font-extrabold tracking-tight transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                Freelance<span className="text-violet-500">Hub</span>
              </span>
              <div className={`text-[9px] font-semibold tracking-[0.15em] uppercase transition-colors ${isDark ? "text-indigo-300" : "text-slate-400"}`}>
                AI-Powered Platform
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-violet-100 text-violet-700"
                    : isDark
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={dashboardLink}
                  className="px-4 py-2 bg-violet-50 text-violet-700 text-sm font-semibold rounded-xl hover:bg-violet-100 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:shadow-md transition-all shadow-sm"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                      {user.avatar}
                    </div>
                    <span className="text-slate-700 text-sm font-medium max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                        <p className="text-slate-500 text-xs capitalize">{user.role} Account</p>
                      </div>
                      <div className="p-2">
                        <Link to={dashboardLink} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl transition-colors">📊 Dashboard</Link>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl transition-colors">👤 My Profile</Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors">🚪 Sign Out</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
                >
                  Get Started Free →
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 rounded-xl transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"}`}>
            <div className={`w-5 h-0.5 transition-all duration-300 mb-1 ${isDark ? "bg-white" : "bg-slate-700"} ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 transition-all duration-300 mb-1 ${isDark ? "bg-white" : "bg-slate-700"} ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 transition-all duration-300 ${isDark ? "bg-white" : "bg-slate-700"} ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl border border-slate-100 mx-2 mb-4 overflow-hidden">
            <div className="p-4 space-y-1">
              {navLinks.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="w-full text-left px-4 py-3 text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl text-sm font-medium transition-colors">
                  {item.label}
                </button>
              ))}
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <Link to={dashboardLink} onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-violet-50 text-violet-700 rounded-xl text-sm font-semibold text-center">📊 Dashboard</Link>
                    <button onClick={handleLogout} className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold text-center">Sign In</Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold text-center">Get Started Free →</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
