import { useState } from "react";
import { recentProjects } from "../data/marketplace";

const categoryColors: Record<string, string> = {
  Development: "bg-blue-50 text-blue-700 border-blue-200",
  Design:      "bg-pink-50 text-pink-700 border-pink-200",
  "AI/ML":     "bg-violet-50 text-violet-700 border-violet-200",
  Marketing:   "bg-orange-50 text-orange-700 border-orange-200",
};

export default function RecentProjects() {
  const [applied, setApplied] = useState<number[]>([]);
  const [saved,   setSaved]   = useState<number[]>([]);

  const toggleApply = (id: number) =>
    setApplied((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleSave = (id: number) =>
    setSaved((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  return (
    <section className="py-24 bg-slate-50" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Live Projects</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Open Projects
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Waiting for You</span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md">
              Real projects posted by verified clients. Apply directly — no middleman, no bidding wars.
            </p>
          </div>
          <a href="#" className="shrink-0 flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-700 group transition">
            Browse all 4,200+ projects
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* Project Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {recentProjects.map((project) => {
            const isApplied = applied.includes(project.id);
            const isSaved   = saved.includes(project.id);
            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Subtle BG glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Urgency */}
                    {project.urgency === "Urgent" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                        🔥 Urgent
                      </span>
                    )}
                    {/* Category */}
                    <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full ${categoryColors[project.category] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {project.category}
                    </span>
                    {/* Budget type */}
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                      {project.budgetType}
                    </span>
                  </div>
                  {/* Save button */}
                  <button
                    onClick={() => toggleSave(project.id)}
                    className={`shrink-0 w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                      isSaved ? "bg-violet-50 border-violet-300 text-violet-600" : "border-slate-200 text-slate-400 hover:border-violet-300 hover:text-violet-500"
                    }`}
                  >
                    <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-violet-700 transition-colors">
                  {project.title}
                </h3>
                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.skills.map((skill) => (
                    <span key={skill} className="text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-4 mb-5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-extrabold text-slate-900">{project.budget}</span>
                  </div>
                  <span className="text-slate-200">|</span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
                    </svg>
                    {project.deadline}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" />
                    </svg>
                    {project.bids} bids
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
                    </svg>
                    {project.postedAt}
                  </div>
                </div>

                {/* Client info + Apply */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-[9px] font-bold">
                      CL
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-700">Verified Client</span>
                        {project.verified && (
                          <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-[10px]">★</span>
                        <span className="text-[10px] text-slate-500">{project.clientRating} • {project.clientJobs} jobs posted</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleApply(project.id)}
                    className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 ${
                      isApplied
                        ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-300"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-300/40 hover:-translate-y-0.5"
                    }`}
                  >
                    {isApplied ? "✓ Applied" : "Apply Now →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex-1 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-white mb-2">Have a project in mind? 💡</h3>
            <p className="text-slate-400 text-sm">Post for free and get matched with top talent in minutes. No subscription required.</p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <button className="text-sm font-bold px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all">
              Post a Project Free →
            </button>
            <button className="text-sm font-semibold px-6 py-3.5 rounded-2xl border border-white/20 text-white hover:bg-white/10 transition-all">
              Browse All Projects
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
