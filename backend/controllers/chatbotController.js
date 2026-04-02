import User from "../models/User.js";
import Project from "../models/Project.js";

// ─── AI Chatbot Response Engine ─────────────────────────────────────────────
// This uses rule-based AI + can be upgraded to OpenAI GPT

const knowledgeBase = {
  greetings: {
    patterns: ["hello", "hi", "hey", "good morning", "good evening", "howdy", "sup"],
    responses: [
      "👋 Hello! I'm **Nova**, your FreelanceHub AI assistant. How can I help you today?",
      "Hi there! Welcome to FreelanceHub. I'm Nova — ready to help you find talent, post projects, or answer any questions!",
    ],
  },
  fees: {
    patterns: ["fee", "commission", "charge", "cost", "pricing", "percent", "how much", "price"],
    responses: [
      "💰 FreelanceHub charges a **flat 8% platform fee** — that's it!\n\n" +
        "Compare that to:\n• Upwork: **5–20%** sliding scale\n• Fiverr: **20%** flat\n• Freelancer.com: **10%**\n\n" +
        "We believe in transparent, fair pricing. No hidden fees ever! 🎉",
    ],
  },
  scam: {
    patterns: ["scam", "fraud", "fake", "safe", "trust", "security", "protect", "cheat", "spam"],
    responses: [
      "🛡️ Great question! FreelanceHub has **AI Scam Shield** technology:\n\n" +
        "• 🤖 **ML fraud detection** on all job posts\n" +
        "• 🔍 **Identity verification** for all users\n" +
        "• 💰 **Escrow payments** — money held safely until work is approved\n" +
        "• 🚩 **Real-time scam scoring** on suspicious posts\n" +
        "• 📞 **24/7 dispute resolution** team\n\n" +
        "Your money and data are always protected! ✅",
    ],
  },
  payment: {
    patterns: ["pay", "payment", "escrow", "wallet", "withdraw", "money", "bank", "transfer", "stripe"],
    responses: [
      "💳 Here's how payments work on FreelanceHub:\n\n" +
        "1️⃣ **Client pays** into secure escrow\n" +
        "2️⃣ **Freelancer works** — money is held safely\n" +
        "3️⃣ **Milestone approved** → money released instantly\n" +
        "4️⃣ **Auto-release** after 14 days if no dispute\n\n" +
        "Withdrawal methods: Bank transfer, PayPal, Crypto. Processed in **1-3 business days**! 🏦",
    ],
  },
  post: {
    patterns: ["post project", "hire", "find freelancer", "need developer", "looking for", "post a job", "create project"],
    responses: [
      "🚀 Posting a project is super easy!\n\n" +
        "1. Click **\"Post a Project\"** button\n" +
        "2. Describe your project (our AI helps write the brief!)\n" +
        "3. Set your budget and timeline\n" +
        "4. Our **AI matches** you with top 5 freelancers\n" +
        "5. Review proposals and hire! ✅\n\n" +
        "Most clients get their first proposal within **2 hours**! ⚡",
    ],
  },
  find: {
    patterns: ["find work", "get job", "find project", "apply", "freelancer", "earn money", "work"],
    responses: [
      "🎯 Finding work on FreelanceHub is different from other platforms:\n\n" +
        "• 🤖 **AI matches** your profile to relevant projects\n" +
        "• 📝 **Smart proposals** — AI suggests talking points\n" +
        "• 🏆 **Reputation Passport** — import your history from Upwork/Fiverr\n" +
        "• 📊 **Profile analytics** — see who viewed you\n\n" +
        "Complete your profile to get the best matches! Want tips? 💡",
    ],
  },
  contract: {
    patterns: ["contract", "agreement", "milestone", "terms", "legal", "protect", "dispute"],
    responses: [
      "📄 FreelanceHub uses **AI-generated Smart Contracts**!\n\n" +
        "• ✅ Auto-generated from your project description\n" +
        "• 🎯 Milestone-based with clear deliverables\n" +
        "• ⚖️ Legally binding terms included\n" +
        "• 🔄 Dispute resolution built-in\n" +
        "• 💰 Escrow protection on every milestone\n\n" +
        "No lawyers needed — our AI handles it all! 🤖",
    ],
  },
  compare: {
    patterns: ["vs", "compare", "better than", "upwork", "fiverr", "freelancer.com", "toptal", "difference"],
    responses: [
      "📊 Here's how we compare:\n\n" +
        "| Feature | FreelanceHub | Upwork | Fiverr |\n" +
        "|---------|-------------|--------|--------|\n" +
        "| Fee | **8% flat** | 5-20% | 20% |\n" +
        "| AI Matching | ✅ Top 5 | ❌ | ❌ |\n" +
        "| Scam Shield | ✅ AI | ⚠️ Basic | ⚠️ Basic |\n" +
        "| Smart Contracts | ✅ Auto | ❌ Manual | ❌ |\n" +
        "| Real-time Workspace | ✅ Built-in | ❌ | ❌ |\n\n" +
        "We're built to solve every pain point! 🚀",
    ],
  },
  skills: {
    patterns: ["skill", "developer", "designer", "writer", "marketer", "ai engineer", "category", "what can"],
    responses: [
      "🎯 FreelanceHub has experts in 8 categories:\n\n" +
        "💻 **Development & IT** (3,480+ freelancers)\n" +
        "🎨 **Design & Creative** (1,240+)\n" +
        "🤖 **AI & Machine Learning** (890+)\n" +
        "📣 **Marketing & SEO** (920+)\n" +
        "✍️ **Writing & Translation** (670+)\n" +
        "🎬 **Video & Animation** (540+)\n" +
        "📊 **Finance & Accounting** (310+)\n" +
        "🔐 **Cybersecurity** (420+)\n\n" +
        "Which category interests you? 🔍",
    ],
  },
  support: {
    patterns: ["support", "help", "contact", "problem", "issue", "bug", "report"],
    responses: [
      "🆘 Need help? Here are your options:\n\n" +
        "💬 **Live Chat** — Available 24/7 (you're already here!)\n" +
        "📧 **Email** — support@freelancehub.com\n" +
        "📞 **Phone** — +1 (800) 123-4567 (Mon-Fri, 9AM-6PM EST)\n" +
        "📖 **Help Center** — docs.freelancehub.com\n\n" +
        "Average response time: **< 2 hours** ⚡",
    ],
  },
  account: {
    patterns: ["register", "sign up", "create account", "login", "account", "profile", "verification"],
    responses: [
      "👤 Creating your FreelanceHub account is free!\n\n" +
        "**For Clients:**\n" +
        "• Sign up → Post project → Get proposals in 2hrs ✅\n\n" +
        "**For Freelancers:**\n" +
        "• Sign up → Complete profile → Get AI-matched to jobs ✅\n\n" +
        "**Verification Levels:**\n" +
        "🔵 Email verified → ✅ ID verified → 🏆 Top Rated\n\n" +
        "Go to /register to get started! 🚀",
    ],
  },
  workspace: {
    patterns: ["workspace", "collaborate", "tool", "communicate", "video call", "file share", "track"],
    responses: [
      "🖥️ FreelanceHub has a **built-in Real-time Workspace** — no need for:\n\n" +
        "❌ Slack (we have real-time chat)\n" +
        "❌ Zoom (we have video calls)\n" +
        "❌ Notion (we have project boards)\n" +
        "❌ Dropbox (we have file sharing)\n" +
        "❌ Clockify (we have time tracking)\n\n" +
        "Everything is in **one place**, all free! 🎉",
    ],
  },
  default: {
    responses: [
      "🤔 I'm not sure I understood that completely. Could you rephrase?\n\nOr choose a quick option:\n• 💰 Platform fees\n• 🛡️ Safety & security\n• 🔍 Finding freelancers\n• 📝 Posting a project\n• 💳 How payments work",
      "Hmm, let me think... I'm still learning! Try asking about:\n\n• **Fees & pricing**\n• **How escrow works**\n• **AI features**\n• **Finding talent**\n• **Posting projects**",
    ],
  },
};

// ─── Find best matching response ───────────────────────────────────────────
const findResponse = (message) => {
  const lowerMsg = message.toLowerCase().trim();

  for (const [category, data] of Object.entries(knowledgeBase)) {
    if (category === "default") continue;
    if (data.patterns.some((pattern) => lowerMsg.includes(pattern))) {
      const responses = data.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  const defaultResponses = knowledgeBase.default.responses;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// ─── @POST /api/chatbot/message ─────────────────────────────────────────────
export const chatbotMessage = async (req, res, next) => {
  try {
    const { message, context } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    // Simulate AI processing delay (50-200ms)
    const delay = Math.floor(Math.random() * 150) + 50;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const response = findResponse(message);

    // If user is logged in, personalize the response
    let personalizedResponse = response;
    if (req.user) {
      personalizedResponse = response.replace("Hello!", `Hello, ${req.user.name}!`);
    }

    // Generate follow-up suggestions
    const suggestions = getSuggestions(message);

    res.status(200).json({
      success: true,
      response: personalizedResponse,
      suggestions,
      timestamp: new Date().toISOString(),
      botName: "Nova",
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
    });
  } catch (error) {
    next(error);
  }
};

// ─── Generate context-aware suggestions ────────────────────────────────────
const getSuggestions = (message) => {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("fee") || lowerMsg.includes("price")) {
    return ["How does escrow work?", "Compare with Upwork", "Payment methods"];
  }
  if (lowerMsg.includes("find") || lowerMsg.includes("hire")) {
    return ["How AI matching works", "Top freelancers", "Post a project"];
  }
  if (lowerMsg.includes("safe") || lowerMsg.includes("scam")) {
    return ["How escrow protects me", "Identity verification", "Dispute resolution"];
  }
  return ["How much does it cost?", "Is it safe?", "How do I get started?", "Contact support"];
};

// ─── @GET /api/chatbot/suggestions ──────────────────────────────────────────
export const getChatbotSuggestions = async (req, res, next) => {
  try {
    // Get live stats to include in suggestions
    const [totalFreelancers, openProjects] = await Promise.all([
      User.countDocuments({ role: "freelancer", isActive: true }),
      Project.countDocuments({ status: "open" }),
    ]);

    const suggestions = [
      { id: 1, text: "💰 What are your fees?", category: "pricing" },
      { id: 2, text: "🛡️ How do you prevent scams?", category: "safety" },
      { id: 3, text: "🔍 How does AI talent matching work?", category: "features" },
      { id: 4, text: "💳 How does escrow payment work?", category: "payment" },
      { id: 5, text: "📝 How do I post a project?", category: "getting-started" },
      { id: 6, text: "🆚 How are you better than Upwork?", category: "compare" },
      {
        id: 7,
        text: `🎯 Find from ${totalFreelancers.toLocaleString()}+ freelancers`,
        category: "browse",
      },
      {
        id: 8,
        text: `📂 Browse ${openProjects.toLocaleString()}+ open projects`,
        category: "browse",
      },
    ];

    res.status(200).json({
      success: true,
      suggestions,
      stats: { totalFreelancers, openProjects },
    });
  } catch (error) {
    next(error);
  }
};
