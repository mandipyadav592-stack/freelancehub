import Review from "../models/Review.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";

// ─── @POST /api/reviews ─────────────────────────────────────────────────────
export const createReview = async (req, res, next) => {
  try {
    const {
      projectId, revieweeId, overallRating,
      communication, quality, timeliness, expertise,
      title, comment,
    } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can only review after a project is completed.",
      });
    }

    // Determine reviewer role
    const isClient = project.client.toString() === req.user._id.toString();
    const isFreelancer =
      project.assignedFreelancer?.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to review this project.",
      });
    }

    // Check already reviewed
    const existingReview = await Review.findOne({
      project: projectId,
      reviewer: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this project.",
      });
    }

    const review = await Review.create({
      project: projectId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      reviewerRole: isClient ? "client" : "freelancer",
      overallRating,
      communication,
      quality,
      timeliness,
      expertise,
      title,
      comment,
    });

    await review.populate([
      { path: "reviewer", select: "name avatar title" },
      { path: "project", select: "title" },
    ]);

    // Notify reviewee
    await Notification.create({
      recipient: revieweeId,
      sender: req.user._id,
      type: "review_received",
      title: "⭐ You received a new review!",
      message: `${req.user.name} left you a ${overallRating}-star review on "${project.title}"`,
      relatedProject: projectId,
      relatedUser: req.user._id,
      link: `/profile/${revieweeId}#reviews`,
      icon: "star",
      color: "yellow",
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/reviews/:userId ──────────────────────────────────────────────
export const getUserReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = { reviewee: req.params.userId };
    if (rating) query.overallRating = Number(rating);

    const [reviews, total, avgStats] = await Promise.all([
      Review.find(query)
        .populate("reviewer", "name avatar title")
        .populate("project", "title category")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(query),
      Review.aggregate([
        { $match: { reviewee: mongoose.Types.ObjectId(req.params.userId) } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$overallRating" },
            avgCommunication: { $avg: "$communication" },
            avgQuality: { $avg: "$quality" },
            avgTimeliness: { $avg: "$timeliness" },
            avgExpertise: { $avg: "$expertise" },
            total: { $sum: 1 },
            fiveStar: { $sum: { $cond: [{ $eq: ["$overallRating", 5] }, 1, 0] } },
            fourStar: { $sum: { $cond: [{ $eq: ["$overallRating", 4] }, 1, 0] } },
            threeStar: { $sum: { $cond: [{ $eq: ["$overallRating", 3] }, 1, 0] } },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      stats: avgStats[0] || {},
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @PUT /api/reviews/:id/response ─────────────────────────────────────────
export const respondToReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    if (review.reviewee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only respond to reviews about yourself.",
      });
    }

    if (review.response?.text) {
      return res.status(400).json({
        success: false,
        message: "You have already responded to this review.",
      });
    }

    review.response = {
      text: req.body.response,
      createdAt: new Date(),
    };
    await review.save();

    res.status(200).json({
      success: true,
      message: "Response added successfully!",
      review,
    });
  } catch (error) {
    next(error);
  }
};
