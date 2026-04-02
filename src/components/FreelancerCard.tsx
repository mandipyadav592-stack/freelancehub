import { useState } from "react";

type Freelancer = {
  id: number;
  name: string;
  title: string;
  avatar: string;
  avatarColor: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  skills: string[];
  location: string;
  badge: string;
  available: boolean;
  completedJobs: number;
  responseTime: string;
  successRate: number;
  verified: boolean;
  bio: string;
};

const badgeStyles: Record<string, string> = {
  "Top Rated":   "bg-amber-50 text-amber-700 border-amber-200",
  "Expert":      "bg-blue-50 text-blue-700 border-blue-200",
  "Rising Star": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function FreelancerCard({ f }: { f: Freelancer }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group bg-white rounded-3xl border-2 border-slate-100 p-6 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-50 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50/50 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        {/* Avatar */}
        <div className="relative">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.avatarColor} flex items-center justify-center text-white text-lg font-extrabold shadow-lg`}>
            {f.avatar}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${f.available ? "bg-emerald-400" : "bg-slate-300"}`} />
        </div>

        {/* Save + badge */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full ${badgeStyles[f.badge] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
            {f.badge}
          </span>
          <button
            onClick={() => setSaved(!saved)}
            className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
              saved ? "bg-violet-50 border-violet-300 text-violet-600" : "border-slate-200 text-slate-400 hover:border-violet-300 hover:text-violet-500"
            }`}
          >
            <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Name + title */}
      <div className="mb-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-extrabold text-slate-900">{f.name}</h3>
          {f.verified && (
            <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium">{f.title}</p>
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{f.bio}</p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < Math.round(f.rating) ? "text-amber-400" : "text-slate-200"}`}>★</span>
          ))}
        </div>
        <span className="text-xs font-bold text-slate-900">{f.rating}</span>
        <span className="text-xs text-slate-400">({f.reviews} reviews)</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {f.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 mb-5 bg-slate-50 rounded-2xl p-3">
        <div className="text-center">
          <div className="text-sm font-extrabold text-slate-900">{f.completedJobs}</div>
          <div className="text-[9px] text-slate-400 font-medium">Jobs Done</div>
        </div>
        <div className="text-center border-x border-slate-200">
          <div className="text-sm font-extrabold text-slate-900">{f.successRate}%</div>
          <div className="text-[9px] text-slate-400 font-medium">Success</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-extrabold text-slate-900">{f.responseTime}</div>
          <div className="text-[9px] text-slate-400 font-medium">Response</div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-extrabold text-slate-900">${f.hourlyRate}</span>
            <span className="text-xs text-slate-400">/hr</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <div className={`w-2 h-2 rounded-full ${f.available ? "bg-emerald-400" : "bg-slate-300"}`} />
            <span className={`text-[10px] font-semibold ${f.available ? "text-emerald-600" : "text-slate-400"}`}>
              {f.available ? "Available Now" : "Not Available"}
            </span>
          </div>
        </div>
        <button className="text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-300/40 hover:-translate-y-0.5 transition-all duration-200">
          View Profile
        </button>
      </div>
    </div>
  );
}
