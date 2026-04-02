import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // ─── Basic Info ─────────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [10, "Title must be at least 10 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ─── Category & Skills ──────────────────────────────────────────────────
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Development & IT",
        "Design & Creative",
        "AI & Machine Learning",
        "Marketing & SEO",
        "Writing & Translation",
        "Video & Animation",
        "Finance & Accounting",
        "Cybersecurity",
        "Other",
      ],
    },
    skillsRequired: [{ type: String }],
    tags: [{ type: String }],

    // ─── Budget ─────────────────────────────────────────────────────────────
    budgetType: {
      type: String,
      enum: ["fixed", "hourly"],
      default: "fixed",
    },
    budget: {
      min: { type: Number, required: true, min: 5 },
      max: { type: Number, required: true },
    },
    hourlyRate: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },

    // ─── Timeline ───────────────────────────────────────────────────────────
    duration: {
      type: String,
      enum: ["< 1 week", "1-2 weeks", "2-4 weeks", "1-3 months", "3-6 months", "6+ months"],
      required: true,
    },
    deadline: { type: Date },
    startDate: { type: Date },

    // ─── Status ─────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["draft", "open", "in-progress", "completed", "cancelled", "disputed"],
      default: "open",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // ─── Proposals / Bids ───────────────────────────────────────────────────
    proposals: [
      {
        freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        coverLetter: { type: String, maxlength: 2000 },
        bidAmount: { type: Number, required: true },
        deliveryTime: { type: String },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected", "withdrawn"],
          default: "pending",
        },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    totalProposals: { type: Number, default: 0 },

    // ─── Milestones (AI-Generated) ──────────────────────────────────────────
    milestones: [
      {
        title: { type: String, required: true },
        description: { type: String },
        amount: { type: Number, required: true },
        dueDate: { type: Date },
        status: {
          type: String,
          enum: ["pending", "in-progress", "submitted", "approved", "paid"],
          default: "pending",
        },
        submittedFiles: [{ url: String, name: String, size: Number }],
        approvedAt: { type: Date },
        paidAt: { type: Date },
      },
    ],

    // ─── AI Features ────────────────────────────────────────────────────────
    aiBriefGenerated: { type: Boolean, default: false },
    aiMatchScore: { type: Number, default: 0 },
    aiSuggestedFreelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    aiScamScore: { type: Number, default: 0, min: 0, max: 100 }, // 0=safe, 100=scam

    // ─── Files & Attachments ────────────────────────────────────────────────
    attachments: [
      {
        url: String,
        name: String,
        size: Number,
        type: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ─── Reviews ────────────────────────────────────────────────────────────
    clientReview: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date },
    },
    freelancerReview: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date },
    },

    // ─── Payment ────────────────────────────────────────────────────────────
    totalPaid: { type: Number, default: 0 },
    escrowAmount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "in-escrow", "partially-paid", "fully-paid", "refunded"],
      default: "unpaid",
    },

    // ─── Visibility ─────────────────────────────────────────────────────────
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: Days Until Deadline ──────────────────────────────────────────
projectSchema.virtual("daysLeft").get(function () {
  if (!this.deadline) return null;
  const diff = new Date(this.deadline) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// ─── Auto update proposal count ────────────────────────────────────────────
projectSchema.pre("save", function (next) {
  this.totalProposals = this.proposals.length;
  next();
});

// ─── Indexes ───────────────────────────────────────────────────────────────
projectSchema.index({ status: 1, isPublic: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ skillsRequired: 1 });
projectSchema.index({ "budget.min": 1, "budget.max": 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ title: "text", description: "text", tags: "text" });

const Project = mongoose.model("Project", projectSchema);
export default Project;
