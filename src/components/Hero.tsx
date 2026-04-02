import { useState, useEffect } from "react";
import { stats } from "../data/marketplace";

const rotatingWords = ["Developers", "Designers", "AI Engineers", "Marketers", "Writers", "Analysts"];

export default function Hero() {
  const [query,      setQuery]      = useState("");
  const [wordIdx,    setWordIdx]    = useState(0);
  const [displayed,  setDisplayed]  = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = rotatingWords[wordIdx];
    let timeout: number;
    if (!isDeleting) {
      if (displayed.length < current.length) {
        timeout = window.setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = window.setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = window.setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 40);
      } else {
        setIsDeleting(false);
        setWordIdx((i) => (i + 1) % rotatingWords.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIdx]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };

  const popularTags = ["React Developer", "UI Designer", "LLM Engineer", "SEO Expert", "Copywriter", "Data Scientist"];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-slate-950">
      {/* Animated BG */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950/40 to-slate-950" />
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-800/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full animate-pulse"
            style={{ left: `${(i * 17 + 5) % 95}%`, top: `${(i * 13 + 8) % 90}%`, animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      {/* Floating decorative cards */}
      <div className="absolute right-8 top-1/4 hidden xl:block animate-float z-10">
        <div className="glass rounded-2xl p-4 w-56 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">SC</div>
            <div>
              <div className="text-white text-xs font-bold">Sophia Chen</div>
              <div className="text-indigo-300 text-[10px]">Full-Stack Dev • $85/hr</div>
            </div>
            <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
            <span className="text-indigo-300 text-xs ml-1">4.9 (312)</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {["React","Node.js","AWS"].map(s => (
              <span key={s} className="text-[9px] bg-white/10 text-indigo-200 px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-8 bottom-1/3 hidden xl:block animate-float-delayed z-10">
        <div className="glass rounded-2xl p-4 w-52 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <div className="text-white text-xs font-bold">Scam Blocked</div>
              <div className="text-emerald-400 text-[10px]">AI detected & blocked</div>
            </div>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-emerald-400 text-[10px] font-medium">
            ✓ Your account is protected
          </div>
        </div>
      </div>

      <div className="absolute right-12 bottom-1/4 hidden xl:block animate-float-slow z-10">
        <div className="glass rounded-2xl p-4 w-48 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-white text-xs font-bold">Payment Released</div>
              <div className="text-emerald-400 text-[10px]">Milestone approved</div>
            </div>
          </div>
          <div className="text-white text-lg font-extrabold">$4,800 <span className="text-emerald-400 text-xs font-medium">✓ Sent</span></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 glass rounded-full px-5 py-2.5 text-sm">
            <span className="flex items-center gap-1.5 text-violet-300">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              <span className="font-semibold">120K+ Verified Freelancers</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-indigo-300 text-xs">🚀 New: AI Talent Matching v2.0</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-2">
            Hire Top Freelance
          </h1>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                {displayed}
              </span>
              <span className="inline-block w-[3px] h-[0.85em] bg-violet-400 ml-1 animate-pulse align-middle" />
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The AI-powered marketplace that solves what Fiverr & Upwork can't —
            <span className="text-violet-300 font-medium"> smart matching, zero scams, transparent fees</span>, and a built-in collaboration workspace.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3 glass rounded-2xl p-2 shadow-2xl shadow-violet-900/20">
            <div className="flex-1 flex items-center gap-3 px-4">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for React developer, logo designer, AI engineer..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm outline-none"
              />
            </div>
            <button className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/40 transition-all duration-200 hover:-translate-y-0.5">
              Search
            </button>
          </div>
          {/* Popular tags */}
          <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
            <span className="text-slate-500 text-xs">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs text-indigo-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-400/40 rounded-full px-3 py-1 transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => scrollTo("freelancers")}
            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-violet-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            <span>🎯</span> Find Top Talent
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => scrollTo("projects")}
            className="group flex items-center justify-center gap-2 glass text-white font-bold text-sm px-8 py-4 rounded-2xl hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 border border-white/20"
          >
            <span>📋</span> Post a Project Free
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold mb-6">Trusted by teams at</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {["Google","Microsoft","Stripe","Airbnb","Notion","Vercel"].map((co) => (
              <div key={co} className="text-slate-600 font-bold text-sm tracking-wide hover:text-slate-400 transition-colors">
                {co}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
