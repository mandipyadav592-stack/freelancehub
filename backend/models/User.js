import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ─── Basic Info ─────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never return password in queries
    },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      default: "client",
    },
    avatar: {
      type: String,
      default: "",
    },

    // ─── Profile ────────────────────────────────────────────────────────────
    title: { type: String, default: "" },
    bio: { type: String, maxlength: [500, "Bio cannot exceed 500 characters"], default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    phone: { type: String, default: "" },
    languages: [{ type: String }],

    // ─── Freelancer-Specific ────────────────────────────────────────────────
    skills: [{ type: String }],
    hourlyRate: { type: Number, default: 0, min: 0 },
    category: { type: String, default: "" },
    experience: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      default: "intermediate",
    },
    portfolio: [
      {
        title: String,
        description: String,
        imageUrl: String,
        projectUrl: String,
        tags: [String],
      },
    ],

    // ─── Stats ──────────────────────────────────────────────────────────────
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    successRate: { type: Number, default: 100, min: 0, max: 100 },
    totalEarned: { type: Number, default: 0 },
    responseTime: { type: String, default: "1 hr" },

    // ─── Verification & Trust ───────────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isIdentityVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpiry: { type: Date, select: false },
    twoFactorEnabled: { type: Boolean, default: false },

    // ─── Badges ─────────────────────────────────────────────────────────────
    badges: [
      {
        type: String,
        enum: ["Top Rated", "Expert", "Rising Star", "Pro", "Verified", "Elite"],
      },
    ],

    // ─── Availability ───────────────────────────────────────────────────────
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    availableHoursPerWeek: { type: Number, default: 40 },

    // ─── Reputation Passport (Unique Feature) ───────────────────────────────
    reputationPassport: {
      importedFrom: [{ platform: String, rating: Number, reviews: Number, url: String }],
      verified: { type: Boolean, default: false },
    },

    // ─── Social Links ───────────────────────────────────────────────────────
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      dribbble: { type: String, default: "" },
    },

    // ─── Wallet / Payments ──────────────────────────────────────────────────
    wallet: {
      balance: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    stripeCustomerId: { type: String, default: "" },
    stripeAccountId: { type: String, default: "" },

    // ─── Account Status ─────────────────────────────────────────────────────
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
    lastSeen: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },

    // ─── Password Reset ─────────────────────────────────────────────────────
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },

    // ─── Notifications ──────────────────────────────────────────────────────
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      newMessage: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: true },
    },

    // ─── Saved / Bookmarks ──────────────────────────────────────────────────
    savedFreelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: Full Profile URL ─────────────────────────────────────────────
userSchema.virtual("profileUrl").get(function () {
  return `/freelancers/${this._id}`;
});

// ─── Pre-save Hook: Hash Password ──────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Method: Compare Password ──────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── Method: Update Last Seen ──────────────────────────────────────────────
userSchema.methods.updateLastSeen = async function () {
  this.lastSeen = new Date();
  this.isOnline = true;
  await this.save({ validateBeforeSave: false });
};

// ─── Index for fast queries ────────────────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ rating: -1 });
userSchema.index({ hourlyRate: 1 });
userSchema.index({ location: "text", name: "text", title: "text", skills: "text" });

const User = mongoose.model("User", userSchema);
export default User;
