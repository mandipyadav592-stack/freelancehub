import { useState } from "react";
import { featuredFreelancers } from "../data/marketplace";
import FreelancerCard from "./FreelancerCard";

const filters = ["All", "Available Now", "Top Rated", "Expert", "Rising Star"];
const sortOptions = ["Best Match", "Highest Rated", "Lowest Rate", "Most Reviews"];

export default function FeaturedFreelancers() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy,       setSortBy]       = useState("Best Match");

  const filtered = featuredFreelancers.filter((f) => {
    if (activeFilter === "All")          return true;
    if (activeFilter === "Available Now") return f.available;
    return f.badge === activeFilter;
  });

  return (
    <section className="py-24 bg-white" id="freelancers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Top Talent</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Featured Freelancers
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-lg">
              Hand-picked, verified experts ready to start. Every profile includes skill tests, verified reviews & background checks.
            </p>
          </div>
          <a href="#" className="shrink-0 flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-700 group transition">
            View all 120K+ freelancers
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-medium text-slate-700 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-violet-300 bg-white cursor-pointer"
            >
              {sortOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((f) => <FreelancerCard key={f.id} f={f} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500 text-sm">Try a different filter or browse all freelancers.</p>
          </div>
        )}

        {/* AI Match Banner */}
        <div className="mt-12 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-violet-500/30 shrink-0">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Let Nova Find Your Perfect Match</h3>
              <p className="text-slate-400 text-sm">
                Describe your project in plain English and our AI will surface the top 5 matching freelancers — ranked by skill fit, availability, and budget.
              </p>
            </div>
          </div>
          <button className="relative z-10 shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm px-7 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all">
            Try AI Matching →
          </button>
        </div>
      </div>
    </section>
  );
}
