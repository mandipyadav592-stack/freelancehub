import { howItWorksSteps } from "../data/marketplace";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            From Idea to Hired in{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">4 Simple Steps</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            No more sifting through hundreds of bids. Our AI does the hard work so you can focus on building.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {howItWorksSteps.map((step, i) => (
            <div key={step.step} className="relative group">
              {/* Connector line */}
              {i < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-100 z-0 -translate-y-px" style={{ width: "calc(100% - 2.5rem)" }} />
              )}

              <div className="relative z-10 bg-white rounded-3xl p-7 border-2 border-slate-100 hover:border-violet-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <span className={`text-3xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-30`}>
                    {step.step}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Video / demo placeholder */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl shadow-violet-500/30 hover:scale-105 transition-transform cursor-pointer">
              ▶
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">See Nova in Action</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
              Watch how our AI matches a client with the perfect freelancer in under 2 minutes — start to finish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="text-sm font-bold px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all">
                Watch Demo →
              </button>
              <button className="text-sm font-bold px-7 py-3.5 rounded-2xl border border-white/20 text-white hover:bg-white/10 transition-all">
                Try It Now — Free
              </button>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "🔒", title: "Escrow Protected", desc: "Funds held safely until you approve work" },
            { icon: "⚡", title: "Fast Onboarding", desc: "Start hiring in under 5 minutes" },
            { icon: "🌍", title: "Global Talent", desc: "120K+ freelancers in 90+ countries" },
            { icon: "🤖", title: "AI-Powered", desc: "Smart matching, auto contracts & scam detection" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-5 border border-slate-100 text-center hover:border-violet-200 hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="text-xs font-extrabold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
