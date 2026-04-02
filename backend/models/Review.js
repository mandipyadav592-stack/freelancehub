import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewerRole: {
      type: String,
      enum: ["client", "freelancer"],
      required: true,
    },

    // ─── Ratings ────────────────────────────────────────────────────────────
    overallRating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    // Detailed ratings (for freelancers)
    communication: { type: Number, min: 1, max: 5 },
    quality: { type: Number, min: 1, max: 5 },
    timeliness: { type: Number, min: 1, max: 5 },
    expertise: { type: Number, min: 1, max: 5 },

    // ─── Review Content ─────────────────────────────────────────────────────
    title: {
      type: String,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      minlength: [20, "Review must be at least 20 characters"],
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },

    // ─── Response ───────────────────────────────────────────────────────────
    response: {
      text: { type: String, maxlength: 500 },
      createdAt: { type: Date },
    },

    // ─── Moderation ─────────────────────────────────────────────────────────
    isVerified: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, default: "" },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Update user rating after review ───────────────────────────────────────
reviewSchema.post("save", async function () {
  const Review = this.constructor;
  const User = mongoose.model("User");

  const stats = await Review.aggregate([
    { $match: { reviewee: this.reviewee } },
    {
      $group: {
        _id: "$reviewee",
        avgRating: { $avg: "$overallRating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(this.reviewee, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  }
});

reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ project: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
