import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { proposals, messages, projects, orders } from "../data/appData";
import AIChatbot from "../components/AIChatbot";

const tabs = ["Overview", "Find Projects", "My Proposals", "Active Orders", "Messages", "My Gigs", "Earnings"];

export default function FreelancerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bidOpen, setBidOpen] = useState<number | null>(null);
  const [appliedProjects, setAppliedProjects] = useState<number[]>([3]);
  const [searchQuery, setSearchQuery] = useState("");
  const [createGigOpen, setCreateGigOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const stats = [
    { label: "Active Proposals", value: "3", icon: "📨", color: "from-violet-500 to-indigo-600", change: "+2 this week" },
    { label: "Total Earned", value: "$12,400", icon: "💰", color: "from-emerald-500 to-teal-600", change: "+$2,400 this month" },
    { label: "Jobs Completed", value: "248", icon: "✅", color: "from-orange-500 to-amber-500", change: "+12 this month" },
    { label: "Profile Rating", value: "4.9★", icon: "⭐", color: "from-pink-500 to-rose-500", change: "Top 3% freelancer" },
  ];

  const earnings = [
    { month: "Oct", amount: 1800 }, { month: "Nov", amount: 2400 }, { month: "Dec", amount: 1950 },
    { month: "Jan", amount: 3100 }, { month: "Feb", amount: 2750 }, { month: "Mar", amount: 2400 },
  ];
  const maxEarning = Math.max(...earnings.map((e) => e.amount));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-white">Freelance<span className="text-violet-400">Hub</span></span>
            </Link>
          </div>

          <div className="p-4 mx-3 mt-4 bg-gradient-to-br from-violet-600/30 to-indigo-600/20 rounded-2xl border border-violet-500/20">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user?.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>{user?.avatar}</div>
              <div>
                <p className="text-white font-semibold text-sm">{user?.name}</p>
                <p className="text-violet-300 text-xs">{user?.title || "Freelancer"}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-white/60">Profile Views</span>
              <span className="text-white font-bold">1,234</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full" />
            </div>
            <p className="text-white/40 text-xs mt-1">Profile 75% complete</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 mt-2">
            {tabs.map((tab) => {
              const icons: Record<string, string> = { "Overview": "📊", "Find Projects": "🔍", "My Proposals": "📨", "Active Orders": "⚙️", "Messages": "💬", "My Gigs": "🛍️", "Earnings": "💰" };
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                >
                  <span>{icons[tab]}</span> {tab}
                  {tab === "Messages" && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>}
                  {tab === "My Proposals" && <span className="ml-auto bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-1">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm transition-all">
              <span>⚙️</span> Settings & Profile
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm transition-all">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100">
            <div className="w-5 h-0.5 bg-slate-700 mb-1" /><div className="w-5 h-0.5 bg-slate-700 mb-1" /><div className="w-5 h-0.5 bg-slate-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{activeTab}</h1>
            <p className="text-slate-500 text-xs">Hello {user?.name?.split(" ")[0]}! You have 3 new proposals waiting 🚀</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCreateGigOpen(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md shadow-emerald-200">
              + Create Gig
            </button>
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user?.avatarColor} flex items-center justify-center text-white font-bold text-sm cursor-pointer`}>{user?.avatar}</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">

          {/* ── OVERVIEW ── */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
                    <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                    <p className="text-emerald-500 text-xs mt-1 font-medium">{s.change}</p>
                  </div>
                ))}
              </div>

              {/* AI Profile Boost */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2"><span className="text-2xl">🤖</span><span className="font-bold text-lg">AI Profile Booster</span></div>
                    <p className="text-violet-200 text-sm mb-4">Your profile is missing a portfolio link and skills assessment. Complete it to get 3x more visibility!</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-white text-violet-700 font-bold text-sm rounded-xl hover:bg-violet-50 transition-colors">Complete Profile</button>
                      <button className="px-4 py-2 bg-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/30 transition-colors">Take Skills Test</button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-4xl font-black">75%</div>
                    <p className="text-violet-300 text-xs">Profile Complete</p>
                  </div>
                </div>
              </div>

              {/* Recent Proposals */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900">Recent Proposals</h2>
                  <button onClick={() => setActiveTab("My Proposals")} className="text-violet-600 text-sm font-medium hover:underline">View all</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {proposals.map((p) => (
                    <div key={p.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-sm">{p.projectTitle}</h3>
                        <p className="text-slate-500 text-xs mt-0.5">{p.client} • {p.submittedAgo}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 text-sm">{p.budget}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "accepted" ? "bg-emerald-100 text-emerald-700" : p.status === "shortlisted" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                          {p.status === "accepted" ? "✅ Accepted" : p.status === "shortlisted" ? "⭐ Shortlisted" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900">Recent Messages</h2>
                  <button onClick={() => setActiveTab("Messages")} className="text-violet-600 text-sm font-medium hover:underline">View all</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${msg.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>{msg.avatar}</div>
                        {msg.unread && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-violet-500 rounded-full border-2 border-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${msg.unread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>{msg.from}</p>
                          <span className="text-xs text-slate-400">{msg.time}</span>
                        </div>
                        <p className="text-slate-500 text-xs truncate mt-0.5">{msg.preview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── FIND PROJECTS ── */}
          {activeTab === "Find Projects" && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects by skill, keyword, or category..." className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-sm" />
                <button className="px-5 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Search</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["All", "Development", "Design", "AI/ML", "Marketing", "Writing"].map((cat) => (
                  <button key={cat} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-colors shadow-sm">
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid gap-4">
                {projects.filter((p) => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))).map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {project.urgency === "urgent" && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg">🔥 Urgent</span>}
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-lg">{project.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mt-2">{project.title}</h3>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.skills.map((s) => <span key={s} className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-lg">{s}</span>)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-extrabold text-slate-900">{project.budget}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{project.budgetType}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>🏢 {project.client}</span>
                        <span>⭐ {project.clientRating}</span>
                        <span>📨 {project.bids} bids</span>
                        <span>⏰ {project.deadline}</span>
                        <span>🕐 {project.postedAgo}</span>
                      </div>
                      <button
                        onClick={() => appliedProjects.includes(project.id) ? null : setBidOpen(project.id)}
                        className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${appliedProjects.includes(project.id) ? "bg-emerald-100 text-emerald-700 cursor-default" : "bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:opacity-90"}`}
                      >
                        {appliedProjects.includes(project.id) ? "✓ Bid Submitted" : "Submit Proposal"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MY PROPOSALS ── */}
          {activeTab === "My Proposals" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                {[{ label: "Total Sent", value: "3", color: "text-violet-600" }, { label: "Shortlisted", value: "1", color: "text-blue-600" }, { label: "Accepted", value: "1", color: "text-emerald-600" }].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              {proposals.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{p.projectTitle}</h3>
                      <p className="text-slate-500 text-sm mt-0.5">Client: <span className="font-medium">{p.client}</span></p>
                      <p className="text-slate-500 text-sm mt-0.5">Your Bid: <span className="font-bold text-slate-900">{p.budget}</span> • Delivery: {p.deliveryTime}</p>
                      <div className="mt-3 bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 font-medium mb-1">Your Cover Letter:</p>
                        <p className="text-slate-700 text-sm">{p.coverLetter}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${p.status === "accepted" ? "bg-emerald-100 text-emerald-700" : p.status === "shortlisted" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                        {p.status === "accepted" ? "✅ Accepted" : p.status === "shortlisted" ? "⭐ Shortlisted" : "⏳ Pending"}
                      </span>
                      <p className="text-slate-400 text-xs mt-2">{p.submittedAgo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── ACTIVE ORDERS ── */}
          {activeTab === "Active Orders" && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${order.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>{order.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-400 font-mono">{order.id}</p>
                          <h3 className="font-bold text-slate-900">{order.title}</h3>
                          <p className="text-slate-500 text-sm">Client: <span className="font-medium text-slate-700">{order.freelancer}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-extrabold text-slate-900">${order.budget.toLocaleString()}</p>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${order.status === "completed" ? "bg-emerald-100 text-emerald-700" : order.status === "review" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                            {order.status === "in_progress" ? "⚙️ In Progress" : order.status === "review" ? "👀 In Review" : "✅ Completed"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                          <span>Progress</span><span className="font-semibold text-slate-700">{order.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" style={{ width: `${order.progress}%` }} />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {order.milestones.map((m, i) => (
                          <div key={i} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${m.done ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            <span>{m.done ? "✓" : "○"}</span> {m.name}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="px-4 py-2 bg-violet-50 text-violet-700 text-sm font-semibold rounded-xl hover:bg-violet-100 transition-colors">💬 Message Client</button>
                        {order.status === "in_progress" && <button className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors">📤 Submit for Review</button>}
                        <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">📁 Upload Files</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── MESSAGES ── */}
          {activeTab === "Messages" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-[calc(100vh-180px)]">
              <div className="flex h-full">
                <div className="w-72 border-r border-slate-100 flex flex-col">
                  <div className="p-4 border-b border-slate-100">
                    <input className="w-full px-3 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="Search messages..." />
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {messages.map((msg) => (
                      <div key={msg.id} className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${msg.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>{msg.avatar}</div>
                            {msg.unread && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-violet-500 rounded-full" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm ${msg.unread ? "font-bold" : "font-medium"} text-slate-900 truncate`}>{msg.from}</p>
                              <span className="text-xs text-slate-400 flex-shrink-0 ml-1">{msg.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{msg.preview}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-4">💬</div>
                    <h3 className="text-lg font-bold text-slate-700">Select a conversation</h3>
                    <p className="text-slate-400 text-sm mt-1">Choose a message from the left to start chatting</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── MY GIGS ── */}
          {activeTab === "My Gigs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-sm">Manage your services and offerings</p>
                <button onClick={() => setCreateGigOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md">
                  + Create New Gig
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Full-Stack React + Node.js Web App", price: 299, orders: 48, rating: 4.9, delivery: 7, status: "active", views: 1234, impressions: 4567 },
                  { title: "Custom API Integration & Backend Setup", price: 199, orders: 32, rating: 4.8, delivery: 5, status: "active", views: 876, impressions: 2341 },
                  { title: "Bug Fixing & Code Review", price: 99, orders: 67, rating: 5.0, delivery: 2, status: "paused", views: 543, impressions: 1209 },
                ].map((gig, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-bold text-slate-900 text-sm">{gig.title}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${gig.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {gig.status === "active" ? "● Active" : "⏸ Paused"}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[{ label: "Orders", value: gig.orders }, { label: "Rating", value: `${gig.rating}★` }, { label: "Views", value: gig.views }, { label: "Impressions", value: gig.impressions }].map((s) => (
                        <div key={s.label} className="bg-slate-50 rounded-xl py-2">
                          <p className="font-bold text-slate-900">{s.value}</p>
                          <p className="text-slate-500">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-extrabold text-slate-900">Starting at ${gig.price} <span className="text-slate-400 font-normal text-xs">• {gig.delivery}d delivery</span></p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-xl hover:bg-violet-100 transition-colors">Edit</button>
                        <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors">{gig.status === "active" ? "Pause" : "Activate"}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EARNINGS ── */}
          {activeTab === "Earnings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[{ label: "Available Balance", value: "$2,400", icon: "💳", color: "from-violet-500 to-indigo-600" }, { label: "Pending Clearance", value: "$850", icon: "⏳", color: "from-amber-500 to-orange-500" }, { label: "Total Lifetime", value: "$12,400", icon: "🏆", color: "from-emerald-500 to-teal-600" }].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                    <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                    <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-6">Earnings Over Time</h2>
                <div className="flex items-end gap-3 h-40">
                  {earnings.map((e) => (
                    <div key={e.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">${(e.amount / 1000).toFixed(1)}k</span>
                      <div className="w-full rounded-t-xl bg-gradient-to-t from-violet-500 to-indigo-400 transition-all" style={{ height: `${(e.amount / maxEarning) * 120}px` }} />
                      <span className="text-xs text-slate-500">{e.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Withdraw */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-4">Withdraw Funds</h2>
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  {[{ method: "💳 Bank Transfer", time: "2-3 business days", fee: "Free" }, { method: "💸 PayPal", time: "Instant", fee: "2%" }, { method: "₿ Crypto", time: "~30 min", fee: "1%" }].map((m) => (
                    <div key={m.method} className="border-2 border-slate-200 hover:border-violet-400 rounded-xl p-4 cursor-pointer transition-colors">
                      <p className="font-semibold text-slate-900 text-sm">{m.method}</p>
                      <p className="text-slate-500 text-xs mt-1">{m.time}</p>
                      <p className="text-emerald-600 text-xs font-medium">Fee: {m.fee}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input type="number" placeholder="Enter amount ($)" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                  <button className="px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-all">Withdraw</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bid Modal */}
      {bidOpen !== null && (
        <BidModal
          project={projects.find((p) => p.id === bidOpen)!}
          onClose={() => setBidOpen(null)}
          onSubmit={() => { setAppliedProjects((prev) => [...prev, bidOpen!]); setBidOpen(null); }}
        />
      )}
      {createGigOpen && <CreateGigModal onClose={() => setCreateGigOpen(false)} />}
      <AIChatbot />
    </div>
  );
}

function BidModal({ project, onClose, onSubmit }: { project: any; onClose: () => void; onSubmit: () => void }) {
  const [bid, setBid] = useState("");
  const [delivery, setDelivery] = useState("");
  const [cover, setCover] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!bid || !delivery || !cover) return;
    setSubmitted(true);
    setTimeout(onSubmit, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Submit Proposal</h2>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">✕</button>
          </div>
          <p className="text-violet-200 text-sm mt-1 line-clamp-1">{project?.title}</p>
        </div>
        <div className="p-6 space-y-4">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-slate-900">Proposal Submitted!</h3>
              <p className="text-slate-500 mt-2">The client will review your proposal soon.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Bid Amount *</label>
                  <input value={bid} onChange={(e) => setBid(e.target.value)} placeholder="e.g., $2,500" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Delivery Time *</label>
                  <input value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="e.g., 14 days" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cover Letter *</label>
                <textarea value={cover} onChange={(e) => setCover(e.target.value)} rows={5} placeholder="Introduce yourself and explain why you're the best fit for this project..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none" />
                <p className="text-slate-400 text-xs mt-1">{cover.length}/500 characters</p>
              </div>
              <div className="bg-violet-50 rounded-xl p-4">
                <p className="text-violet-800 text-sm font-semibold">🤖 AI Tip</p>
                <p className="text-violet-700 text-xs mt-1">Personalize your proposal with the client's name and mention specific details from their project description. Proposals with 150-300 words get 40% more responses!</p>
              </div>
              <button onClick={handleSubmit} disabled={!bid || !delivery || !cover} className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-40">
                🚀 Submit Proposal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateGigModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [delivery, setDelivery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Create New Gig</h2>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-slate-900">Gig Created!</h3>
              <p className="text-slate-500 mt-2">Your gig is now live and visible to clients.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gig Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="I will..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Describe what you offer, what's included, and why clients should choose you..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Starting Price ($) *</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="99" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Delivery Days *</label>
                  <input type="number" value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="7" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
              </div>
              <button onClick={() => { if (title && desc && price && delivery) { setSubmitted(true); setTimeout(onClose, 2000); } }} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-all">
                🚀 Publish Gig
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
