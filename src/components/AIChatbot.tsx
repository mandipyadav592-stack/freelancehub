import { useState, useRef, useEffect, useCallback } from "react";
import { aiResponses } from "../data/marketplace";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
  time: string;
  status?: "sending" | "delivered";
};
type Tab = "chat" | "actions" | "history";

const suggestedPrompts = [
  { icon: "🎯", text: "Find me a React developer under $90/hr" },
  { icon: "💰", text: "What are the pricing and fees?" },
  { icon: "🛡️", text: "How does the Scam Shield work?" },
  { icon: "📋", text: "How do I post a project?" },
  { icon: "⚖️", text: "How is FreelanceHub different from Upwork?" },
  { icon: "🤖", text: "What AI features does the platform have?" },
];

const quickActions = [
  { icon: "🔍", label: "Browse Freelancers", color: "from-violet-500 to-indigo-600",  section: "freelancers" },
  { icon: "📋", label: "Post a Project",     color: "from-emerald-500 to-teal-600",   section: "projects"    },
  { icon: "💰", label: "View Pricing",        color: "from-amber-500 to-orange-500",   section: "features"    },
  { icon: "🛡️", label: "Trust & Safety",     color: "from-blue-500 to-indigo-600",    section: "features"    },
  { icon: "⚙️", label: "How It Works",        color: "from-cyan-500 to-blue-600",      section: "how-it-works"},
  { icon: "⭐", label: "Testimonials",        color: "from-pink-500 to-rose-600",      section: "testimonials"},
];

function bold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="font-bold text-slate-900">{p.slice(2,-2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  const map: [string, string][] = [
    ["hello","hello"],["hi ","hi"],[" hi","hi"],["hey","hi"],
    ["freelancer","freelancer"],["developer","developer"],["designer","designer"],
    ["pricing","pricing"],["price","pricing"],["fee","fees"],["fees","fees"],["cost","pricing"],
    ["payment","payment"],["pay ","payment"],["withdraw","payment"],
    ["scam","scam"],["fraud","scam"],["safe","scam"],["security","scam"],["protect","scam"],
    ["project","project"],["post","project"],["hire","project"],
    ["contract","contract"],["milestone","contract"],["dispute","contract"],
    ["reputation","reputation"],["passport","reputation"],["import","reputation"],
    ["compare","compare"],["upwork","compare"],["fiverr","compare"],["vs ","compare"],["better","compare"],
    ["ai ","ai"],["artificial","ai"],["machine","ai"],["chatbot","ai"],
    ["workspace","workspace"],["collaborate","workspace"],["slack","workspace"],
    ["help","help"],["support","help"],["assist","help"],
  ];
  for (const [kw, key] of map) {
    if (lower.includes(kw) && aiResponses[key]) return aiResponses[key];
  }
  return aiResponses.default;
}

let globalId = 0;
const newId = () => ++globalId;

const WELCOME: Message = {
  id: newId(),
  role: "ai",
  text: "👋 Hi! I'm **Nova**, FreelanceHub's AI assistant.\n\nI can help you **find freelancers**, explain **pricing**, tell you about **safety features**, or help you **post a project**.\n\nWhat would you like to know?",
  time: getTime(),
};

export default function AIChatbot() {
  const [open,      setOpen]      = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [tab,       setTab]       = useState<Tab>("chat");
  const [input,     setInput]     = useState("");
  const [messages,  setMessages]  = useState<Message[]>([WELCOME]);
  const [typing,    setTyping]    = useState(false);
  const [history,   setHistory]   = useState<string[]>([]);
  const [unread,    setUnread]    = useState(1);
  const [bubble,    setBubble]    = useState(true);
  const [notification, setNotification] = useState(true);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);

  // Auto scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, minimized]);

  // Auto promo bubble
  useEffect(() => {
    const t = setTimeout(() => setBubble(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setBubble(false);
    setUnread(0);
    setNotification(false);
  };

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: newId(), role: "user", text: text.trim(), time: getTime(), status: "delivered" };
    setMessages((prev) => [...prev, userMsg]);
    setHistory((prev) => [text.trim(), ...prev.slice(0, 9)]);
    setInput("");
    setTyping(true);

    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      const aiMsg: Message = { id: newId(), role: "ai", text: getAIResponse(text), time: getTime() };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, delay);
  }, []);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setOpen(false);
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setHistory([]);
  };

  return (
    <>
      {/* ── Promo bubble ─────────────────────────────────────── */}
      {bubble && !open && (
        <div className="fixed bottom-28 right-6 z-50 animate-slide-up">
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-100 p-4 w-64">
            <button
              onClick={() => setBubble(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Nova</div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-medium">Online now</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              👋 Hi! Need help finding the perfect freelancer? I can match you in <strong>under 2 minutes</strong>!
            </p>
            <button
              onClick={handleOpen}
              className="w-full text-xs font-bold py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg transition-all"
            >
              Chat with Nova →
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45" />
        </div>
      )}

      {/* ── Floating Button ───────────────────────────────────── */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 group"
          Nova-label="Open AI Chat"
        >
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-2xl animate-pulse-ring opacity-60" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 opacity-20 scale-110 animate-pulse" />

          <div className="relative flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:-translate-y-1 transition-all duration-300">
            {/* AI avatar icon */}
            <div className="relative">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.319 2.498l-2.738-.617m-9.29 0l-2.738.617c-1.35.3-2.32-1.498-1.32-2.498L5 14.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {notification && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white">
                  {unread}
                </div>
              )}
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold leading-none">Ask Nova</div>
              <div className="text-[10px] text-indigo-200 leading-none mt-0.5">AI Assistant</div>
            </div>
          </div>
        </button>
      )}

      {/* ── Chat Window ───────────────────────────────────────── */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[380px] bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-100 flex flex-col overflow-hidden animate-chat-open transition-all duration-300 ${
            minimized ? "h-16" : "h-[620px]"
          }`}
          style={{ maxHeight: "calc(100vh - 100px)" }}
        >
          {/* ── Header ── */}
          <div className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.319 2.498l-2.738-.617m-9.29 0l-2.738.617c-1.35.3-2.32-1.498-1.32-2.498L5 14.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-white text-sm leading-tight">Nova</div>
              <div className="text-violet-200 text-[10px]">FreelanceHub AI • Always Online</div>
            </div>
            <div className="flex items-center gap-1">
              {/* Clear */}
              <button
                onClick={clearChat}
                title="Clear chat"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {/* Minimize */}
              <button
                onClick={() => setMinimized(!minimized)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d={minimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-500/80 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* ── Tabs ── */}
              <div className="shrink-0 flex border-b border-slate-100 bg-slate-50">
                {([["chat","💬 Chat"],["actions","⚡ Actions"],["history","🕐 History"]] as [Tab, string][]).map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 text-[11px] font-bold py-2.5 transition-all ${
                      tab === t
                        ? "text-violet-700 border-b-2 border-violet-600 bg-white"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Chat Tab ── */}
              {tab === "chat" && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-2.5 animate-slide-up ${msg.role === "ai" ? "items-start" : "items-end justify-end"}`}>
                        {msg.role === "ai" && (
                          <div className="shrink-0 w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-300/30 mt-0.5 text-white text-xs font-bold">
                            A
                          </div>
                        )}
                        <div className={`max-w-[82%] ${msg.role === "user" ? "order-first" : ""}`}>
                          <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "ai"
                              ? "bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm"
                              : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm shadow-lg shadow-indigo-200/50"
                          }`}>
                            {msg.role === "ai"
                              ? msg.text.split("\n").map((line, i) => (
                                  <p key={i} className={i > 0 ? "mt-1.5" : ""}>{bold(line)}</p>
                                ))
                              : msg.text}
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${msg.role === "ai" ? "pl-1" : "justify-end pr-1"}`}>
                            <span className="text-[10px] text-slate-400">{msg.time}</span>
                            {msg.role === "user" && (
                              <svg className="w-3 h-3 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {typing && (
                      <div className="flex gap-2.5 items-start animate-fade-in">
                        <div className="shrink-0 w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">A</div>
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 bg-violet-400 rounded-full typing-dot" />
                          <span className="w-2 h-2 bg-violet-400 rounded-full typing-dot" />
                          <span className="w-2 h-2 bg-violet-400 rounded-full typing-dot" />
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Suggested prompts (only when few messages) */}
                  {messages.length <= 2 && (
                    <div className="shrink-0 px-4 pb-2">
                      <p className="text-[10px] text-slate-400 font-semibold mb-2 uppercase tracking-widest">Quick questions</p>
                      <div className="flex flex-col gap-1.5">
                        {suggestedPrompts.slice(0, 3).map((p) => (
                          <button
                            key={p.text}
                            onClick={() => sendMessage(p.text)}
                            className="flex items-center gap-2 text-left text-xs text-slate-600 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-xl px-3 py-2 transition-all group"
                          >
                            <span>{p.icon}</span>
                            <span className="group-hover:text-violet-700 transition-colors">{p.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="shrink-0 p-3 border-t border-slate-100 bg-white">
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={inputRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value.slice(0, 300))}
                        onKeyDown={handleKey}
                        placeholder="Ask Nova anything..."
                        className="flex-1 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-violet-400 focus:bg-white resize-none transition-all leading-relaxed scrollbar-thin"
                        style={{ minHeight: "44px", maxHeight: "100px" }}
                      />
                      <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || typing}
                        className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                          input.trim() && !typing
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-300/40 hover:-translate-y-0.5"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }`}
                      >
                        {typing ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1.5 px-1">
                      <span className="text-[10px] text-slate-400">Press Enter to send · Shift+Enter for newline</span>
                      <span className={`text-[10px] font-medium ${input.length > 270 ? "text-red-400" : "text-slate-300"}`}>
                        {input.length}/300
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ── Actions Tab ── */}
              {tab === "actions" && (
                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-xs text-slate-500 mb-4 font-medium">Jump to any section or start a quick action:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((a) => (
                      <button
                        key={a.label}
                        onClick={() => scrollToSection(a.section)}
                        className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-white rounded-2xl border-2 border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all duration-200 group"
                      >
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                          {a.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-center leading-tight">{a.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    <p className="text-xs text-slate-500 mb-3 font-medium">More quick questions:</p>
                    <div className="flex flex-col gap-2">
                      {suggestedPrompts.map((p) => (
                        <button
                          key={p.text}
                          onClick={() => { sendMessage(p.text); setTab("chat"); }}
                          className="flex items-center gap-2 text-left text-xs text-slate-600 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-xl px-3 py-2.5 transition-all group"
                        >
                          <span className="text-base">{p.icon}</span>
                          <span className="group-hover:text-violet-700 transition-colors">{p.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── History Tab ── */}
              {tab === "history" && (
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <span className="text-4xl mb-3">🕐</span>
                      <p className="text-sm font-bold text-slate-700 mb-1">No history yet</p>
                      <p className="text-xs text-slate-400">Your past questions will appear here</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500 mb-4 font-medium">Your recent questions — click to re-ask:</p>
                      <div className="flex flex-col gap-2">
                        {history.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => { sendMessage(q); setTab("chat"); }}
                            className="flex items-start gap-3 text-left p-3 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-2xl transition-all group"
                          >
                            <svg className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
                            </svg>
                            <span className="text-xs text-slate-600 group-hover:text-violet-700 transition-colors line-clamp-2">{q}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── Powered by footer ── */}
              <div className="shrink-0 px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Powered by FreelanceHub AI</span>
                <span className="text-[10px] text-emerald-500 font-semibold ml-1">● Online</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
