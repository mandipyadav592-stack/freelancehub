import User from "../models/User.js";
import Project from "../models/Project.js";
import Review from "../models/Review.js";

// ─── @GET /api/users/freelancers ────────────────────────────────────────────
// Get all freelancers with filters & pagination
export const getFreelancers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      skills,
      minRate,
      maxRate,
      minRating,
      availability,
      search,
      sort = "-rating",
      badge,
      location,
    } = req.query;

    // Build query
    const query = { role: "freelancer", isActive: true, isBanned: false };

    if (category) query.category = category;
    if (availability) query.availability = availability;
    if (badge) query.badges = { $in: [badge] };
    if (location) query.location = new RegExp(location, "i");

    // Skills filter (comma separated)
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query.skills = { $in: skillsArray };
    }

    // Rate filter
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    // Rating filter
    if (minRating) query.rating = { $gte: Number(minRating) };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [freelancers, total] = await Promise.all([
      User.find(query)
        .select("-password -resetPasswordToken -verificationToken -wallet")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: freelancers.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      freelancers,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/users/freelancers/:id ───────────────────────────────────────
// Get single freelancer profile
export const getFreelancerById = async (req, res, next) => {
  try {
    const freelancer = await User.findOne({
      _id: req.params.id,
      role: "freelancer",
      isActive: true,
    }).select("-password -resetPasswordToken -verificationToken -wallet.balance");

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found.",
      });
    }

    // Get freelancer's reviews
    const reviews = await Review.find({ reviewee: freelancer._id })
      .populate("reviewer", "name avatar title")
      .populate("project", "title")
      .sort("-createdAt")
      .limit(10);

    // Get completed projects count
    const completedProjects = await Project.countDocuments({
      assignedFreelancer: freelancer._id,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      freelancer,
      reviews,
      completedProjects,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @PUT /api/users/profile ────────────────────────────────────────────────
// Update logged-in user's profile
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name", "title", "bio", "location", "website", "phone",
      "languages", "skills", "hourlyRate", "category", "experience",
      "portfolio", "availability", "availableHoursPerWeek",
      "socialLinks", "notificationPreferences",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/users/dashboard ─────────────────────────────────────────────
// Get dashboard stats for current user
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let stats = {};

    if (role === "client") {
      const [totalProjects, activeProjects, completedProjects, totalSpent] = await Promise.all([
        Project.countDocuments({ client: userId }),
        Project.countDocuments({ client: userId, status: "in-progress" }),
        Project.countDocuments({ client: userId, status: "completed" }),
        Project.aggregate([
          { $match: { client: userId, status: "completed" } },
          { $group: { _id: null, total: { $sum: "$totalPaid" } } },
        ]),
      ]);

      stats = {
        totalProjects,
        activeProjects,
        completedProjects,
        totalSpent: totalSpent[0]?.total || 0,
      };
    } else if (role === "freelancer") {
      const [activeProposals, activeProjects, completedProjects, totalEarned] = await Promise.all([
        Project.countDocuments({
          "proposals.freelancer": userId,
          "proposals.status": "pending",
        }),
        Project.countDocuments({ assignedFreelancer: userId, status: "in-progress" }),
        Project.countDocuments({ assignedFreelancer: userId, status: "completed" }),
        User.findById(userId).select("totalEarned wallet"),
      ]);

      stats = {
        activeProposals,
        activeProjects,
        completedProjects,
        totalEarned: totalEarned?.totalEarned || 0,
        walletBalance: totalEarned?.wallet?.balance || 0,
        pendingBalance: totalEarned?.wallet?.pending || 0,
      };
    }

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/users/save-freelancer/:id ──────────────────────────────────
export const saveFreelancer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const freelancerId = req.params.id;

    const isSaved = user.savedFreelancers.includes(freelancerId);

    if (isSaved) {
      user.savedFreelancers = user.savedFreelancers.filter(
        (id) => id.toString() !== freelancerId
      );
    } else {
      user.savedFreelancers.push(freelancerId);
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: isSaved ? "Freelancer removed from saved list." : "Freelancer saved!",
      saved: !isSaved,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/users/search ─────────────────────────────────────────────────
// AI-powered talent search
export const searchFreelancers = async (req, res, next) => {
  try {
    const { q, category, budget, timeline } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    // Extract keywords from query
    const keywords = q.toLowerCase().split(" ").filter((w) => w.length > 2);

    const freelancers = await User.find({
      role: "freelancer",
      isActive: true,
      $or: [
        { skills: { $in: keywords.map((k) => new RegExp(k, "i")) } },
        { title: new RegExp(keywords.join("|"), "i") },
        { bio: new RegExp(keywords.join("|"), "i") },
        { category: new RegExp(q, "i") },
      ],
      ...(budget && { hourlyRate: { $lte: Number(budget) } }),
    })
      .select("name title avatar rating reviews hourlyRate skills availability badges location")
      .sort("-rating -completedJobs")
      .limit(10);

    // AI Match Score simulation
    const enriched = freelancers.map((f) => {
      const matchScore = Math.min(
        100,
        Math.floor(
          (f.skills.filter((s) =>
            keywords.some((k) => s.toLowerCase().includes(k))
          ).length /
            Math.max(keywords.length, 1)) *
            100 +
            f.rating * 5
        )
      );
      return { ...f.toObject(), aiMatchScore: matchScore };
    });

    // Sort by AI match score
    enriched.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

    res.status(200).json({
      success: true,
      count: enriched.length,
      query: q,
      freelancers: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @DELETE /api/users/profile ────────────────────────────────────────────
export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      isActive: false,
      email: `deleted_${Date.now()}_${req.user.email}`,
    });

    res.status(200).json({
      success: true,
      message: "Your account has been deactivated. We're sorry to see you go.",
    });
  } catch (error) {
    next(error);
  }
};
