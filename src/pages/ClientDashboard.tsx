import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orders, messages, freelancers, projects } from "../data/appData";
import AIChatbot from "../components/AIChatbot";

const tabs = ["Overview", "My Projects", "Orders", "Messages", "Browse Talent", "Find Gigs"];

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postProjectOpen, setPostProjectOpen] = useState(false);
  const [appliedGigs, setAppliedGigs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => { logout(); navigate("/"); };

  const stats = [
    { label: "Active Projects", value: "3", icon: "📋", color: "from-violet-500 to-indigo-600", change: "+1 this week" },
    { label: "Total Spent", value: "$7,700", icon: "💰", color: "from-emerald-500 to-teal-600", change: "+$2,000 this month" },
    { label: "Freelancers Hired", value: "8", icon: "👥", color: "from-orange-500 to-amber-500", change: "+2 this month" },
    { label: "Avg. Rating Given", value: "4.8", icon: "⭐", color: "from-pink-500 to-rose-500", change: "Excellent" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
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

          {/* User Info */}
          <div className="p-4 mx-3 mt-4 bg-white/10 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user?.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                {user?.avatar}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user?.name}</p>
                <p className="text-white/50 text-xs">Client Account</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 mt-2">
            {tabs.map((tab) => {
              const icons: Record<string, string> = { "Overview": "📊", "My Projects": "📋", "Orders": "🛒", "Messages": "💬", "Browse Talent": "👥", "Find Gigs": "🛍️" };
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                >
                  <span>{icons[tab]}</span> {tab}
                  {tab === "Messages" && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/10 space-y-1">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm transition-all">
              <span>⚙️</span> Settings
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm transition-all">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100">
            <div className="w-5 h-0.5 bg-slate-700 mb-1" /><div className="w-5 h-0.5 bg-slate-700 mb-1" /><div className="w-5 h-0.5 bg-slate-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{activeTab}</h1>
            <p className="text-slate-500 text-xs">Welcome back, {user?.name?.split(" ")[0]}! 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPostProjectOpen(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md shadow-violet-200">
              + Post Project
            </button>
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user?.avatarColor} flex items-center justify-center text-white font-bold text-sm cursor-pointer`}>
                {user?.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">

          {/* ── OVERVIEW ── */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              {/* Stats */}
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

              {/* Active Orders */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900">Active Orders</h2>
                  <button onClick={() => setActiveTab("Orders")} className="text-violet-600 text-sm font-medium hover:underline">View all</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <div key={order.id} className="px-6 py-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${order.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {order.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{order.title}</p>
                        <p className="text-slate-500 text-xs">with {order.freelancer}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all`} style={{ width: `${order.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{order.progress}%</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-slate-900 text-sm">${order.budget.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === "completed" ? "bg-emerald-100 text-emerald-700" : order.status === "review" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                          {order.status === "in_progress" ? "In Progress" : order.status === "review" ? "In Review" : "Completed"}
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

          {/* ── MY PROJECTS ── */}
          {activeTab === "My Projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-sm">Showing {projects.length} projects</p>
                <button onClick={() => setPostProjectOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md">
                  + Post New Project
                </button>
              </div>
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div>
                        {project.urgency === "urgent" && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg mb-2">🔥 Urgent</span>}
                        <h3 className="font-bold text-slate-900">{project.title}</h3>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.skills.map((s) => <span key={s} className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-lg">{s}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>💰 {project.budget}</span>
                        <span>⏰ {project.deadline}</span>
                        <span>📨 {project.bids} bids</span>
                        <span>🕐 {project.postedAgo}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-violet-50 text-violet-700 text-sm font-semibold rounded-xl hover:bg-violet-100 transition-colors">View Bids</button>
                        <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">Edit</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "Orders" && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${order.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {order.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-400 font-mono">{order.id}</p>
                          <h3 className="font-bold text-slate-900 mt-0.5">{order.title}</h3>
                          <p className="text-slate-500 text-sm">Freelancer: <span className="font-medium text-slate-700">{order.freelancer}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-extrabold text-slate-900">${order.budget.toLocaleString()}</p>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${order.status === "completed" ? "bg-emerald-100 text-emerald-700" : order.status === "review" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                            {order.status === "in_progress" ? "⚙️ In Progress" : order.status === "review" ? "👀 In Review" : "✅ Completed"}
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                          <span>Progress</span><span className="font-semibold text-slate-700">{order.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full" style={{ width: `${order.progress}%` }} />
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {order.milestones.map((m, i) => (
                          <div key={i} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${m.done ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            <span>{m.done ? "✓" : "○"}</span> {m.name}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button className="px-4 py-2 bg-violet-50 text-violet-700 text-sm font-semibold rounded-xl hover:bg-violet-100 transition-colors">💬 Message</button>
                        {order.status === "review" && <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors">✅ Approve & Release</button>}
                        <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">View Details</button>
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
                {/* Message list */}
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
                {/* Chat area */}
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

          {/* ── BROWSE TALENT ── */}
          {activeTab === "Browse Talent" && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search freelancers by skill, name, or category..."
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-sm"
                />
                <button className="px-5 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Search</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {freelancers.filter((f) => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))).map((f) => (
                  <div key={f.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.avatarColor} flex items-center justify-center text-white font-bold`}>{f.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{f.name}</h3>
                          {f.verified && <span className="text-blue-500 text-xs">✓</span>}
                        </div>
                        <p className="text-slate-500 text-xs">{f.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-xs font-semibold text-slate-700">{f.rating}</span>
                          <span className="text-xs text-slate-400">({f.reviews})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-slate-900 text-sm">${f.hourlyRate}<span className="text-slate-400 font-normal">/hr</span></p>
                        <span className={`text-xs ${f.available ? "text-emerald-600" : "text-slate-400"}`}>{f.available ? "● Available" : "○ Busy"}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-3 line-clamp-2">{f.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {f.skills.slice(0, 3).map((s) => <span key={s} className="px-2 py-0.5 bg-violet-50 text-violet-700 text-xs rounded-lg">{s}</span>)}
                    </div>
                    <div className="mt-4 grid grid-cols-3 text-center text-xs divide-x divide-slate-100 bg-slate-50 rounded-xl overflow-hidden">
                      <div className="py-2"><p className="font-bold text-slate-900">{f.completedJobs}</p><p className="text-slate-500">Jobs</p></div>
                      <div className="py-2"><p className="font-bold text-slate-900">{f.successRate}%</p><p className="text-slate-500">Success</p></div>
                      <div className="py-2"><p className="font-bold text-slate-900">{f.responseTime}</p><p className="text-slate-500">Response</p></div>
                    </div>
                    <button className="mt-3 w-full py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
                      Hire Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FIND GIGS ── */}
          {activeTab === "Find Gigs" && (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">Browse ready-made services from top freelancers</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 1, title: "I will build a full-stack React + Node.js web application", freelancer: "Sophia Chen", avatar: "SC", avatarColor: "from-violet-500 to-indigo-600", rating: 4.9, reviews: 312, price: 299, deliveryDays: 7, image: "💻", badge: "Best Seller" },
                  { id: 2, title: "I will design a stunning UI/UX for your mobile app", freelancer: "Marcus Williams", avatar: "MW", avatarColor: "from-pink-500 to-rose-600", rating: 4.8, reviews: 278, price: 199, deliveryDays: 5, image: "🎨", badge: "Top Rated" },
                  { id: 3, title: "I will build an AI chatbot using GPT-4 for your business", freelancer: "Priya Sharma", avatar: "PS", avatarColor: "from-emerald-500 to-teal-600", rating: 5.0, reviews: 143, price: 399, deliveryDays: 10, image: "🤖", badge: "New" },
                  { id: 4, title: "I will create a complete SEO strategy for your website", freelancer: "James Rodriguez", avatar: "JR", avatarColor: "from-orange-500 to-amber-500", rating: 4.7, reviews: 421, price: 149, deliveryDays: 14, image: "📣", badge: "Best Seller" },
                  { id: 5, title: "I will write SEO-optimized blog posts and web content", freelancer: "Emma Thompson", avatar: "ET", avatarColor: "from-cyan-500 to-blue-600", rating: 4.9, reviews: 567, price: 79, deliveryDays: 3, image: "✍️", badge: "Best Seller" },
                  { id: 6, title: "I will develop your React Native app for iOS & Android", freelancer: "David Park", avatar: "DP", avatarColor: "from-red-500 to-pink-600", rating: 4.8, reviews: 198, price: 499, deliveryDays: 21, image: "📱", badge: "Top Rated" },
                ].map((gig) => (
                  <div key={gig.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="h-36 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-6xl">{gig.image}</div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${gig.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>{gig.avatar}</div>
                        <span className="text-xs text-slate-600 font-medium">{gig.freelancer}</span>
                        {gig.badge === "Best Seller" && <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">🏆 {gig.badge}</span>}
                        {gig.badge === "Top Rated" && <span className="ml-auto text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">⭐ {gig.badge}</span>}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[2.5rem]">{gig.title}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs font-bold text-slate-800">{gig.rating}</span>
                        <span className="text-xs text-slate-400">({gig.reviews})</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">⏱ {gig.deliveryDays} day delivery</span>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Starting at</p>
                          <p className="font-extrabold text-slate-900">${gig.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAppliedGigs((prev) => prev.includes(gig.id) ? prev : [...prev, gig.id])}
                        className={`mt-3 w-full py-2.5 text-sm font-semibold rounded-xl transition-all ${appliedGigs.includes(gig.id) ? "bg-emerald-100 text-emerald-700" : "bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:opacity-90"}`}
                      >
                        {appliedGigs.includes(gig.id) ? "✓ Ordered" : "Order Now"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Post Project Modal */}
      {postProjectOpen && <PostProjectModal onClose={() => setPostProjectOpen(false)} />}
      <AIChatbot />
    </div>
  );
}

function PostProjectModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!title || !desc || !category || !budget) return;
    setSubmitted(true);
    setTimeout(onClose, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Post a New Project</h2>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">✕</button>
          </div>
          <div className="flex gap-2 mt-4">
            {[1, 2].map((s) => <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? "bg-white" : "bg-white/30"}`} />)}
          </div>
        </div>
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-slate-900">Project Posted!</h3>
              <p className="text-slate-500 mt-2">Freelancers will start bidding soon. We'll notify you!</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Build a React E-commerce Website" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
                  <option value="">Select a category</option>
                  {["Development & IT", "Design & Creative", "AI & Machine Learning", "Marketing & SEO", "Writing & Translation", "Video & Animation"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Description *</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Describe your project in detail..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none" />
              </div>
              <button onClick={() => setStep(2)} disabled={!title || !desc || !category} className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-40">
                Next: Budget & Timeline →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Budget *</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
                  <option value="">Select budget range</option>
                  {["$100 - $500", "$500 - $1,000", "$1,000 - $3,000", "$3,000 - $5,000", "$5,000 - $10,000", "$10,000+"].map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deadline</label>
                <select value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
                  <option value="">Select timeline</option>
                  {["Less than 1 week", "1-2 weeks", "2-4 weeks", "1-3 months", "3+ months", "Ongoing"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="bg-violet-50 rounded-xl p-4">
                <p className="text-violet-800 text-sm font-semibold mb-1">🤖 AI Tip</p>
                <p className="text-violet-700 text-xs">Based on similar projects, we recommend a budget of $1,500-$3,000 and a 3-4 week timeline for the best results.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">← Back</button>
                <button onClick={handleSubmit} disabled={!budget} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-40">
                  🚀 Post Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
