import Project from "../models/Project.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// ─── @GET /api/projects ─────────────────────────────────────────────────────
export const getProjects = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = "open",
      budgetMin,
      budgetMax,
      duration,
      skills,
      search,
      sort = "-createdAt",
      urgency,
      budgetType,
    } = req.query;

    const query = { isPublic: true };

    if (status) query.status = status;
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (budgetType) query.budgetType = budgetType;
    if (duration) query.duration = duration;

    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query.skillsRequired = { $in: skillsArray };
    }

    if (budgetMin || budgetMax) {
      query["budget.min"] = {};
      if (budgetMin) query["budget.min"].$gte = Number(budgetMin);
      if (budgetMax) query["budget.max"] = { $lte: Number(budgetMax) };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate("client", "name avatar rating isVerified location")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select("-proposals"),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/projects ─────────────────────────────────────────────────────
export const createProject = async (req, res, next) => {
  try {
    const {
      title, description, category, skillsRequired,
      budgetType, budget, duration, deadline, urgency, tags,
    } = req.body;

    // AI Scam Detection (simple rule-based for demo)
    const scamKeywords = ["bitcoin", "crypto payment", "western union", "gift card", "wire transfer"];
    const scamScore = scamKeywords.some((kw) =>
      description.toLowerCase().includes(kw) || title.toLowerCase().includes(kw)
    ) ? 85 : Math.floor(Math.random() * 15);

    const project = await Project.create({
      title,
      description,
      category,
      skillsRequired: skillsRequired || [],
      budgetType: budgetType || "fixed",
      budget,
      duration,
      deadline: deadline ? new Date(deadline) : undefined,
      urgency: urgency || "medium",
      tags: tags || [],
      client: req.user._id,
      aiScamScore: scamScore,
    });

    // Auto-generate milestones (AI feature)
    if (budget && project.budgetType === "fixed") {
      const totalAmount = budget.max;
      const milestones = [
        {
          title: "Project Kickoff & Requirements",
          description: "Initial setup, planning, and requirements gathering",
          amount: Math.floor(totalAmount * 0.25),
          status: "pending",
        },
        {
          title: "Core Development",
          description: "Main development phase with core features",
          amount: Math.floor(totalAmount * 0.50),
          status: "pending",
        },
        {
          title: "Testing, Revision & Delivery",
          description: "Quality testing, revisions, and final delivery",
          amount: Math.floor(totalAmount * 0.25),
          status: "pending",
        },
      ];
      project.milestones = milestones;
      project.aiBriefGenerated = true;
      await project.save();
    }

    await project.populate("client", "name avatar rating location");

    res.status(201).json({
      success: true,
      message: "Project posted successfully! AI has generated milestones for you.",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/projects/:id ──────────────────────────────────────────────────
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name avatar rating isVerified location totalReviews")
      .populate("assignedFreelancer", "name avatar rating title skills hourlyRate")
      .populate("proposals.freelancer", "name avatar rating title skills completedJobs badges");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Increment view count
    project.views += 1;
    await project.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/projects/:id/proposals ──────────────────────────────────────
export const submitProposal = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This project is no longer accepting proposals.",
      });
    }

    // Check if already applied
    const alreadyApplied = project.proposals.some(
      (p) => p.freelancer.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a proposal for this project.",
      });
    }

    // Check client isn't applying to their own project
    if (project.client.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own project.",
      });
    }

    const { coverLetter, bidAmount, deliveryTime } = req.body;

    project.proposals.push({
      freelancer: req.user._id,
      coverLetter,
      bidAmount,
      deliveryTime,
      status: "pending",
    });

    await project.save();

    // Send notification to client
    await Notification.create({
      recipient: project.client,
      sender: req.user._id,
      type: "new_proposal",
      title: "New Proposal Received!",
      message: `${req.user.name} submitted a proposal for "${project.title}"`,
      relatedProject: project._id,
      relatedUser: req.user._id,
      link: `/projects/${project._id}/proposals`,
      icon: "briefcase",
      color: "violet",
    });

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully!",
      totalProposals: project.proposals.length,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @PUT /api/projects/:id/proposals/:proposalId/accept ────────────────────
export const acceptProposal = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the project client can accept proposals.",
      });
    }

    const proposal = project.proposals.id(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found." });
    }

    // Accept this proposal, reject others
    project.proposals.forEach((p) => {
      p.status = p._id.toString() === req.params.proposalId ? "accepted" : "rejected";
    });

    project.assignedFreelancer = proposal.freelancer;
    project.status = "in-progress";
    project.startDate = new Date();

    await project.save();

    // Notify freelancer
    await Notification.create({
      recipient: proposal.freelancer,
      sender: req.user._id,
      type: "proposal_accepted",
      title: "🎉 Your Proposal Was Accepted!",
      message: `Congratulations! Your proposal for "${project.title}" has been accepted.`,
      relatedProject: project._id,
      link: `/projects/${project._id}`,
      icon: "check-circle",
      color: "green",
    });

    res.status(200).json({
      success: true,
      message: "Proposal accepted! Project is now in progress.",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @PUT /api/projects/:id ──────────────────────────────────────────────────
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.client.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this project.",
      });
    }

    const allowedUpdates = [
      "title", "description", "skillsRequired", "budget",
      "duration", "deadline", "urgency", "tags", "status",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @DELETE /api/projects/:id ───────────────────────────────────────────────
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.client.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project.",
      });
    }

    if (project.status === "in-progress") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an in-progress project. Cancel it first.",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/projects/my-projects ─────────────────────────────────────────
export const getMyProjects = async (req, res, next) => {
  try {
    const query =
      req.user.role === "client"
        ? { client: req.user._id }
        : { assignedFreelancer: req.user._id };

    const projects = await Project.find(query)
      .populate("client", "name avatar")
      .populate("assignedFreelancer", "name avatar")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};
