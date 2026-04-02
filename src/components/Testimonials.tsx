import { useState } from "react";
import { testimonials } from "../data/marketplace";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
            <span className="text-amber-500">⭐</span>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Real Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Why Freelancers & Clients{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Love Us</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Real people, real results. See how FreelanceHub solved the problems that Fiverr and Upwork couldn't.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`text-left p-6 rounded-3xl border-2 transition-all duration-300 ${
                active === i
                  ? "border-violet-400 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-xl shadow-violet-100 -translate-y-1"
                  : "border-slate-100 bg-white hover:border-violet-200 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                  <div className="text-xs text-violet-600 font-semibold">{t.company}</div>
                </div>
              </div>
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, s) => (
                  <span key={s} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              {/* Quote preview */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">"{t.text}"</p>
              {/* Result pill */}
              <div className="mt-3 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                <span className="text-emerald-500 text-[10px]">✓</span>
                <span className="text-[10px] font-bold text-emerald-700">{t.result}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Active testimonial expanded */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex items-center gap-4 shrink-0">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${testimonials[active].avatarColor} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {testimonials[active].avatar}
              </div>
              <div>
                <div className="text-white font-extrabold text-lg">{testimonials[active].name}</div>
                <div className="text-slate-400 text-sm">{testimonials[active].role}</div>
                <div className="text-violet-400 text-xs font-semibold">{testimonials[active].company}</div>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(testimonials[active].rating)].map((_, s) => (
                    <span key={s} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <svg className="w-8 h-8 text-violet-400/40 mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-white text-base sm:text-lg leading-relaxed mb-6 font-medium">
                "{testimonials[active].text}"
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2">
                  <span className="text-emerald-400 text-sm">✓</span>
                  <span className="text-emerald-300 text-xs font-bold">{testimonials[active].result}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <span className="text-slate-400 text-xs">{testimonials[active].platform}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Navigation dots */}
          <div className="relative z-10 flex gap-2 mt-8 justify-center md:justify-start">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  active === i ? "w-8 h-2 bg-violet-400" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Summary stats row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "4.9/5", label: "Average Rating", icon: "⭐" },
            { value: "98.2%", label: "Satisfaction Rate", icon: "💚" },
            { value: "120K+", label: "Happy Freelancers", icon: "🎉" },
            { value: "$2.4B", label: "Paid Out", icon: "💸" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
