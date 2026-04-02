import { useState } from "react";
import { uniqueFeatures } from "../data/marketplace";

const comparisonRows = [
  { feature: "Service Fee",        us: "8% flat",      upwork: "5–20%",       fiverr: "20%"       },
  { feature: "Fraud Detection",    us: "AI (99.3%)",   upwork: "Basic",       fiverr: "Limited"   },
  { feature: "Dispute Resolution", us: "< 24 hours",   upwork: "2–3 weeks",   fiverr: "3–5 days"  },
  { feature: "Built-in Workspace", us: "✅ Full suite", upwork: "❌ None",     fiverr: "❌ None"   },
  { feature: "AI Matching",        us: "✅ Top 5 fit",  upwork: "❌ 200 bids", fiverr: "❌ Search" },
  { feature: "Reputation Import",  us: "✅ 6+ sources", upwork: "❌ None",     fiverr: "❌ None"   },
];

export default function UniqueFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
            <span className="text-xs font-bold text-violet-700 uppercase tracking-widest">Why FreelanceHub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            We Solve What Others{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Can't</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Every feature was built to fix a real, painful problem freelancers and clients face on existing platforms.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {uniqueFeatures.map((feat, i) => (
            <button
              key={feat.title}
              onClick={() => setActiveFeature(i)}
              className={`text-left p-6 rounded-3xl border-2 transition-all duration-300 group ${
                activeFeature === i
                  ? `${feat.border} ${feat.bg} shadow-xl -translate-y-1`
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {feat.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-extrabold text-slate-900 mb-2">{feat.title}</h3>

              {/* Problem */}
              <div className="flex items-start gap-1.5 mb-2">
                <span className="text-red-400 text-xs mt-0.5 shrink-0">✗</span>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.problem}</p>
              </div>

              {/* Solution */}
              <div className="flex items-start gap-1.5 mb-4">
                <span className="text-emerald-500 text-xs mt-0.5 shrink-0">✓</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{feat.solution}</p>
              </div>

              {/* Stat badge */}
              <div className={`inline-flex items-center gap-1.5 ${feat.bg} ${feat.border} border rounded-full px-3 py-1.5`}>
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${feat.color}`} />
                <span className="text-[10px] font-bold text-slate-700">{feat.stat}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Platform Comparison</h3>
            <p className="text-slate-500 text-sm">See exactly how we stack up against the competition.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-8 py-4 text-sm font-bold text-slate-600">Feature</th>
                  <th className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-xl px-4 py-2">
                      ⚡ FreelanceHub
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-400">Upwork</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-400">Fiverr</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-8 py-4 text-sm font-semibold text-slate-700">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-violet-50 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-violet-200">
                        {row.us}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500">{row.upwork}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500">{row.fiverr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-center">
            <p className="text-white font-bold text-lg mb-2">Ready to experience the difference?</p>
            <p className="text-indigo-200 text-sm mb-5">Free to join. No subscription. No hidden fees.</p>
            <button className="bg-white text-violet-700 font-bold text-sm px-8 py-3.5 rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Get Started Free →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
