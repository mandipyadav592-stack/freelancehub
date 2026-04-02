import { useState } from "react";
import { categories } from "../data/marketplace";

export default function Categories() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-20 bg-slate-50" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
              <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Browse Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Every skill you need,
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">all in one place</span>
            </h2>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-700 group transition">
            All categories
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative bg-white rounded-3xl p-6 text-left border-2 transition-all duration-300 overflow-hidden ${
                hovered === cat.id
                  ? "border-violet-300 shadow-2xl shadow-violet-100 -translate-y-2"
                  : "border-slate-100 hover:border-violet-200 shadow-sm hover:shadow-xl hover:shadow-violet-50 hover:-translate-y-1"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${cat.color}`} />
              {cat.trending && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                  <span className="text-[8px] font-bold text-amber-600 uppercase">🔥 Hot</span>
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                {cat.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2 leading-snug">{cat.label}</h3>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">{cat.count.toLocaleString()} experts</p>
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100`}>
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          />
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-1">Can't find what you need?</h3>
            <p className="text-indigo-200 text-sm">Post your project and let Nova match you with the perfect freelancer in minutes.</p>
          </div>
          <button className="relative z-10 shrink-0 bg-white text-violet-700 font-bold text-sm px-7 py-3.5 rounded-2xl hover:shadow-2xl hover:shadow-violet-800/30 hover:-translate-y-0.5 transition-all duration-200">
            Post a Project Free →
          </button>
        </div>
      </div>
    </section>
  );
}
