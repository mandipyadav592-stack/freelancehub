import { useState } from "react";

const footerLinks = {
  "For Clients": ["Post a Project", "Find Freelancers", "AI Matching", "Enterprise", "How It Works", "Pricing"],
  "For Freelancers": ["Create Profile", "Find Work", "Reputation Passport", "Skill Tests", "Payments", "Community"],
  "Platform": ["About Us", "Blog", "Press Kit", "Careers", "Affiliate Program", "API Access"],
  "Support": ["Help Center", "Contact Us", "Trust & Safety", "Dispute Resolution", "System Status", "Terms of Service"],
};

const socials = [
  { icon: "𝕏", label: "Twitter / X",  href: "#" },
  { icon: "in", label: "LinkedIn",     href: "#" },
  { icon: "f",  label: "Facebook",     href: "#" },
  { icon: "▶",  label: "YouTube",      href: "#" },
  { icon: "📷", label: "Instagram",    href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top CTA banner */}
        <div className="border-b border-white/5 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Ready to build something{" "}
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">amazing?</span>
              </h2>
              <p className="text-slate-400 text-sm max-w-md">
                Join 120,000+ freelancers and 40,000+ clients who are building the future — together.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button className="text-sm font-bold px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all">
                Post a Project Free
              </button>
              <button className="text-sm font-bold px-7 py-3.5 rounded-2xl border border-white/20 text-white hover:bg-white/10 transition-all">
                Join as Freelancer
              </button>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
          {/* Brand col */}
          <div className="col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-extrabold tracking-tight">
                  Freelance<span className="text-violet-400">Hub</span>
                </div>
                <div className="text-[9px] text-slate-500 font-semibold tracking-[0.15em] uppercase">AI-Powered Platform</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              The AI-powered freelance marketplace solving what Fiverr & Upwork can't — smart matching, zero scams, transparent fees.
            </p>

            {/* Newsletter */}
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 transition-colors"
                />
                <button type="submit" className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg transition-all shrink-0">
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                <span className="text-emerald-400 text-lg">✓</span>
                <span className="text-emerald-300 text-sm font-medium">Subscribed! Thank you 🎉</span>
              </div>
            )}

            {/* Socials */}
            <div className="flex gap-2 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  Nova-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links cols */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block transition-transform">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © 2025 FreelanceHub Technologies, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map((l) => (
              <a key={l} href="#" className="text-slate-500 text-xs hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
