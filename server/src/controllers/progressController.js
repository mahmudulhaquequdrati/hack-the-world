const UserProgress = require("../models/UserProgress");
const UserEnrollment = require("../models/UserEnrollment");
const Content = require("../models/Content");
const Module = require("../models/Module");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

/**
 * @desc    Mark content as started (when content is loaded/accessed)
 * @route   POST /api/progress/content/start
 * @access  Private
 */
const markContentStarted = asyncHandler(async (req, res, next) => {
  const { contentId } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!contentId) {
    return next(new ErrorResponse("Content ID is required", 400));
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  // Check if content exists
  const content = await Content.findById(contentId);
  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  // Check if user is enrolled in the module
  const enrollment = await UserEnrollment.findByUserAndModule(
    userId,
    content.moduleId
  );
  if (!enrollment) {
    return next(new ErrorResponse("User is not enrolled in this module", 403));
  }

  // Find or create progress record
  let progress = await UserProgress.findByUserAndContent(userId, contentId);

  if (progress) {
    // Mark as started if not already started
    if (progress.status === "not-started") {
      await progress.markStarted();
    }
  } else {
    // Create new progress record in "in-progress" state
    progress = new UserProgress({
      userId,
      contentId,
      contentType: content.type,
      status: "in-progress",
      progressPercentage: 1,
      startedAt: new Date(),
    });
    await progress.save();
  }

  // Populate content information for response
  await progress.populate("contentId", "title type section moduleId");

  res.status(200).json({
    success: true,
    message: "Content started successfully",
    data: progress,
  });
});

/**
 * @desc    Mark content as completed (manual or automatic)
 * @route   POST /api/progress/content/complete
 * @access  Private
 */
const markContentComplete = asyncHandler(async (req, res, next) => {
  const { contentId, score, maxScore } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!contentId) {
    return next(new ErrorResponse("Content ID is required", 400));
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  // Check if content exists
  const content = await Content.findById(contentId);
  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  // Check if user is enrolled in the module
  const enrollment = await UserEnrollment.findByUserAndModule(
    userId,
    content.moduleId
  );
  if (!enrollment) {
    return next(new ErrorResponse("User is not enrolled in this module", 403));
  }

  // Find or create progress record
  let progress = await UserProgress.findByUserAndContent(userId, contentId);

  if (progress) {
    // Update existing progress to completed
    progress.status = "completed";
    progress.progressPercentage = 100;
    progress.completedAt = new Date();

    if (score !== undefined && score !== null) {
      progress.score = score;
    }

    if (maxScore !== undefined && maxScore !== null) {
      progress.maxScore = maxScore;
    }
  } else {
    // Create new completed progress record
    progress = new UserProgress({
      userId,
      contentId,
      contentType: content.type,
      status: "completed",
      progressPercentage: 100,
      startedAt: new Date(),
      completedAt: new Date(),
      score: score !== undefined ? score : null,
      maxScore: maxScore !== undefined ? maxScore : null,
    });
  }

  await progress.save();

  // Update module progress
  await updateModuleProgress(userId, content.moduleId);

  // Populate content information for response
  await progress.populate("contentId", "title type section moduleId");

  res.status(200).json({
    success: true,
    message: "Content marked as completed successfully",
    data: progress,
  });
});

/**
 * @desc    Update content progress (for videos - when 90% watched)
 * @route   POST /api/progress/content/update
 * @access  Private
 */
const updateContentProgress = asyncHandler(async (req, res, next) => {
  const { contentId, progressPercentage } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!contentId) {
    return next(new ErrorResponse("Content ID is required", 400));
  }

  if (progressPercentage === undefined || progressPercentage === null) {
    return next(new ErrorResponse("Progress percentage is required", 400));
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  // Validate progress percentage
  if (progressPercentage < 0 || progressPercentage > 100) {
    return next(
      new ErrorResponse("Progress percentage must be between 0 and 100", 400)
    );
  }

  // Check if content exists
  const content = await Content.findById(contentId);
  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  // Check if user is enrolled in the module
  const enrollment = await UserEnrollment.findByUserAndModule(
    userId,
    content.moduleId
  );
  if (!enrollment) {
    return next(new ErrorResponse("User is not enrolled in this module", 403));
  }

  // Find or create progress record
  let progress = await UserProgress.findByUserAndContent(userId, contentId);

  if (progress) {
    // Update existing progress
    progress.progressPercentage = progressPercentage;

    // Auto-complete if 90% or more for videos
    if (content.type === "video" && progressPercentage >= 90) {
      progress.status = "completed";
      progress.progressPercentage = 100;
      progress.completedAt = new Date();
    }
  } else {
    // Create new progress record
    const status =
      content.type === "video" && progressPercentage >= 90
        ? "completed"
        : progressPercentage > 0
          ? "in-progress"
          : "not-started";

    progress = new UserProgress({
      userId,
      contentId,
      contentType: content.type,
      status,
      progressPercentage:
        content.type === "video" && progressPercentage >= 90
          ? 100
          : progressPercentage,
      startedAt: progressPercentage > 0 ? new Date() : null,
      completedAt: status === "completed" ? new Date() : null,
    });
  }

  await progress.save();

  // Update module progress if content is completed
  if (progress.status === "completed") {
    await updateModuleProgress(userId, content.moduleId);
  }

  // Populate content information for response
  await progress.populate("contentId", "title type section moduleId");

  res.status(200).json({
    success: true,
    message: "Content progress updated successfully",
    data: progress,
  });
});

/**
 * @desc    Get user's overall progress across all modules
 * @route   GET /api/progress/overview/:userId
 * @access  Private
 */
const getUserOverallProgress = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ErrorResponse("Invalid user ID format", 400));
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Authorization: Users can only access their own progress, admins can access any
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return next(
      new ErrorResponse("Not authorized to access this progress", 403)
    );
  }

  // Get user's enrollments
  const enrollments = await UserEnrollment.find({
    userId,
    status: { $in: ["active", "completed"] },
  }).populate("moduleId", "title description difficulty phase");

  if (enrollments.length === 0) {
    return res.status(200).json({
      success: true,
      message: "User overall progress retrieved successfully",
      data: {
        overallStats: {
          totalModules: 0,
          completedModules: 0,
          inProgressModules: 0,
          overallCompletionPercentage: 0,
        },
        moduleProgress: [],
        contentStats: {
          totalContent: 0,
          completedContent: 0,
          inProgressContent: 0,
          contentByType: {
            video: { total: 0, completed: 0 },
            lab: { total: 0, completed: 0 },
            game: { total: 0, completed: 0 },
            document: { total: 0, completed: 0 },
          },
        },
      },
    });
  }

  // Get module progress summary
  const moduleProgressPromises = enrollments.map(async (enrollment) => {
    const moduleContent = await Content.find({
      moduleId: enrollment.moduleId.id,
      isActive: true,
    });

    const moduleProgress = await UserProgress.find({
      userId,
      contentId: { $in: moduleContent.map((c) => c.id) },
    });

    const completedContent = moduleProgress.filter(
      (p) => p.status === "completed"
    ).length;
    const inProgressContent = moduleProgress.filter(
      (p) => p.status === "in-progress"
    ).length;

    const completionPercentage =
      moduleContent.length > 0
        ? Math.round((completedContent / moduleContent.length) * 100)
        : 0;

    return {
      module: enrollment.moduleId,
      enrollment: {
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        progressPercentage: completionPercentage,
      },
      content: {
        total: moduleContent.length,
        completed: completedContent,
        inProgress: inProgressContent,
        notStarted: moduleContent.length - completedContent - inProgressContent,
      },
    };
  });

  const moduleProgress = await Promise.all(moduleProgressPromises);

  // Calculate overall statistics
  const totalModules = enrollments.length;
  const completedModules = moduleProgress.filter(
    (mp) => mp.enrollment.progressPercentage === 100
  ).length;
  const inProgressModules = totalModules - completedModules;
  const overallCompletionPercentage =
    totalModules > 0
      ? Math.round(
          moduleProgress.reduce(
            (sum, mp) => sum + mp.enrollment.progressPercentage,
            0
          ) / totalModules
        )
      : 0;

  // Calculate content statistics
  const totalContent = moduleProgress.reduce(
    (sum, mp) => sum + mp.content.total,
    0
  );
  const completedContent = moduleProgress.reduce(
    (sum, mp) => sum + mp.content.completed,
    0
  );
  const inProgressContent = moduleProgress.reduce(
    (sum, mp) => sum + mp.content.inProgress,
    0
  );

  // Get content by type statistics
  const allContent = await Content.find({
    moduleId: { $in: enrollments.map((e) => e.moduleId.id) },
    isActive: true,
  });

  const allProgress = await UserProgress.find({
    userId,
    contentId: { $in: allContent.map((c) => c.id) },
  });

  const contentByType = {
    video: {
      total: allContent.filter((c) => c.type === "video").length,
      completed: allProgress.filter(
        (p) => p.contentType === "video" && p.status === "completed"
      ).length,
    },
    lab: {
      total: allContent.filter((c) => c.type === "lab").length,
      completed: allProgress.filter(
        (p) => p.contentType === "lab" && p.status === "completed"
      ).length,
    },
    game: {
      total: allContent.filter((c) => c.type === "game").length,
      completed: allProgress.filter(
        (p) => p.contentType === "game" && p.status === "completed"
      ).length,
    },
    document: {
      total: allContent.filter((c) => c.type === "document").length,
      completed: allProgress.filter(
        (p) => p.contentType === "document" && p.status === "completed"
      ).length,
    },
  };

  res.status(200).json({
    success: true,
    message: "User overall progress retrieved successfully",
    data: {
      overallStats: {
        totalModules,
        completedModules,
        inProgressModules,
        overallCompletionPercentage,
      },
      moduleProgress,
      contentStats: {
        totalContent,
        completedContent,
        inProgressContent,
        contentByType,
      },
    },
  });
});

/**
 * @desc    Get user's progress for a specific module
 * @route   GET /api/progress/module/:userId/:moduleId
 * @access  Private
 */
const getUserModuleProgress = asyncHandler(async (req, res, next) => {
  const { userId, moduleId } = req.params;

  // Validate ObjectIds
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ErrorResponse("Invalid user ID format", 400));
  }
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  // Check if user and module exist
  const [user, module] = await Promise.all([
    User.findById(userId),
    Module.findById(moduleId),
  ]);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  if (!module) {
    return next(new ErrorResponse("Module not found", 404));
  }

  // Authorization: Users can only access their own progress, admins can access any
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return next(
      new ErrorResponse("Not authorized to access this progress", 403)
    );
  }

  // Check enrollment
  const enrollment = await UserEnrollment.findByUserAndModule(userId, moduleId);
  if (!enrollment) {
    return next(new ErrorResponse("User is not enrolled in this module", 404));
  }

  // Get all content for this module
  const moduleContent = await Content.find({ moduleId, isActive: true });

  // Get user progress for this module
  const moduleProgress = await UserProgress.find({
    userId,
    contentId: { $in: moduleContent.map((c) => c.id) },
  }).populate("contentId", "title type section duration");

  // Create progress map for efficient lookup
  const progressMap = new Map();
  moduleProgress.forEach((p) => {
    progressMap.set(p.contentId.id.toString(), p);
  });

  // Build content with progress data
  const contentWithProgress = moduleContent.map((content) => {
    const progress = progressMap.get(content.id.toString());

    return {
      id: content.id,
      title: content.title,
      type: content.type,
      section: content.section,
      duration: content.duration,
      progress: progress
        ? {
            status: progress.status,
            progressPercentage: progress.progressPercentage,
            score: progress.score,
            maxScore: progress.maxScore,
            startedAt: progress.startedAt,
            completedAt: progress.completedAt,
          }
        : {
            status: "not-started",
            progressPercentage: 0,
            score: null,
            maxScore: null,
            startedAt: null,
            completedAt: null,
          },
    };
  });

  // Calculate statistics
  const totalContent = moduleContent.length;
  const completedContent = moduleProgress.filter(
    (p) => p.status === "completed"
  ).length;
  const inProgressContent = moduleProgress.filter(
    (p) => p.status === "in-progress"
  ).length;
  const notStartedContent = totalContent - completedContent - inProgressContent;
  const moduleCompletionPercentage =
    totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;

  // Group content by type
  const contentByType = {
    video: contentWithProgress.filter((c) => c.type === "video"),
    lab: contentWithProgress.filter((c) => c.type === "lab"),
    game: contentWithProgress.filter((c) => c.type === "game"),
    document: contentWithProgress.filter((c) => c.type === "document"),
  };

  res.status(200).json({
    success: true,
    message: "Module progress retrieved successfully",
    data: {
      module: {
        id: module.id,
        title: module.title,
        description: module.description,
        difficulty: module.difficulty,
        phase: module.phase,
      },
      enrollment: {
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        progressPercentage: moduleCompletionPercentage,
      },
      content: contentWithProgress,
      statistics: {
        totalContent,
        completedContent,
        inProgressContent,
        notStartedContent,
        completionPercentage: moduleCompletionPercentage,
        contentByType: {
          video: {
            total: contentByType.video.length,
            completed: contentByType.video.filter(
              (c) => c.progress.status === "completed"
            ).length,
          },
          lab: {
            total: contentByType.lab.length,
            completed: contentByType.lab.filter(
              (c) => c.progress.status === "completed"
            ).length,
          },
          game: {
            total: contentByType.game.length,
            completed: contentByType.game.filter(
              (c) => c.progress.status === "completed"
            ).length,
          },
          document: {
            total: contentByType.document.length,
            completed: contentByType.document.filter(
              (c) => c.progress.status === "completed"
            ).length,
          },
        },
      },
    },
  });
});

/**
 * @desc    Get user's progress for specific content type (labs, games, etc.)
 * @route   GET /api/progress/content/:userId/:contentType
 * @access  Private
 */
const getUserContentTypeProgress = asyncHandler(async (req, res, next) => {
  const { userId, contentType } = req.params;
  const { moduleId, status } = req.query;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ErrorResponse("Invalid user ID format", 400));
  }

  // Validate content type
  const validContentTypes = ["video", "lab", "game", "document"];
  if (!validContentTypes.includes(contentType)) {
    return next(
      new ErrorResponse(
        `Invalid content type. Must be one of: ${validContentTypes.join(", ")}`,
        400
      )
    );
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Authorization
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return next(
      new ErrorResponse("Not authorized to access this progress", 403)
    );
  }

  // Get user's enrollments
  const enrollments = await UserEnrollment.find({
    userId,
    status: { $in: ["active", "completed"] },
  }).populate("moduleId", "title description difficulty phase");

  if (enrollments.length === 0) {
    return res.status(200).json({
      success: true,
      message: `User ${contentType} progress retrieved successfully`,
      data: {
        content: [],
        statistics: {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          averageProgress: 0,
        },
        modules: [],
      },
    });
  }

  const enrolledModuleIds = enrollments.map((e) => e.moduleId.id);

  // Build content query
  let contentQuery = {
    moduleId: { $in: enrolledModuleIds },
    type: contentType,
    isActive: true,
  };

  if (moduleId) {
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }
    contentQuery.moduleId = moduleId;
  }

  // Get content
  const content = await Content.find(contentQuery)
    .populate("moduleId", "title description difficulty phase")
    .sort({ moduleId: 1, createdAt: 1 });

  if (content.length === 0) {
    return res.status(200).json({
      success: true,
      message: `User ${contentType} progress retrieved successfully`,
      data: {
        content: [],
        statistics: {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          averageProgress: 0,
        },
        modules: enrollments.map((e) => e.moduleId),
      },
    });
  }

  const contentIds = content.map((c) => c.id);

  // Get progress for this content type
  let progressQuery = {
    userId,
    contentId: { $in: contentIds },
    contentType,
  };

  if (status) {
    progressQuery.status = status;
  }

  const progress = await UserProgress.find(progressQuery).populate(
    "contentId",
    "title description section duration"
  );

  // Create progress map
  const progressMap = new Map();
  progress.forEach((p) => {
    progressMap.set(p.contentId.id.toString(), p);
  });

  // Build content with progress
  const contentWithProgress = content.map((item) => {
    const itemProgress = progressMap.get(item.id.toString());

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      section: item.section,
      duration: item.duration,
      module: {
        id: item.moduleId.id,
        title: item.moduleId.title,
        description: item.moduleId.description,
        difficulty: item.moduleId.difficulty,
        phase: item.moduleId.phase,
      },
      progress: itemProgress
        ? {
            id: itemProgress.id,
            status: itemProgress.status,
            progressPercentage: itemProgress.progressPercentage,
            startedAt: itemProgress.startedAt,
            completedAt: itemProgress.completedAt,
            score: itemProgress.score,
            maxScore: itemProgress.maxScore,
          }
        : {
            status: "not-started",
            progressPercentage: 0,
            startedAt: null,
            completedAt: null,
            score: null,
            maxScore: null,
          },
    };
  });

  // Filter by status if specified
  let filteredContent = contentWithProgress;
  if (status) {
    filteredContent = contentWithProgress.filter(
      (item) => item.progress.status === status
    );
  }

  // Calculate statistics
  const totalItems = contentWithProgress.length;
  const completedItems = contentWithProgress.filter(
    (item) => item.progress.status === "completed"
  ).length;
  const inProgressItems = contentWithProgress.filter(
    (item) => item.progress.status === "in-progress"
  ).length;
  const notStartedItems = totalItems - completedItems - inProgressItems;

  const averageProgress =
    totalItems > 0
      ? Math.round(
          contentWithProgress.reduce(
            (sum, item) => sum + item.progress.progressPercentage,
            0
          ) / totalItems
        )
      : 0;

  // Group by module
  const moduleGroups = enrollments.map((enrollment) => {
    const moduleContent = filteredContent.filter(
      (item) => item.module.id.toString() === enrollment.moduleId.id.toString()
    );

    return {
      module: enrollment.moduleId,
      enrollment: {
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
      },
      content: moduleContent,
      statistics: {
        total: moduleContent.length,
        completed: moduleContent.filter(
          (item) => item.progress.status === "completed"
        ).length,
        inProgress: moduleContent.filter(
          (item) => item.progress.status === "in-progress"
        ).length,
        notStarted: moduleContent.filter(
          (item) => item.progress.status === "not-started"
        ).length,
      },
    };
  });

  res.status(200).json({
    success: true,
    message: `User ${contentType} progress retrieved successfully`,
    data: {
      content: filteredContent,
      statistics: {
        total: totalItems,
        completed: completedItems,
        inProgress: inProgressItems,
        notStarted: notStartedItems,
        averageProgress,
      },
      modules: moduleGroups,
    },
  });
});

/**
 * Helper function to update module progress
 */
const updateModuleProgress = async (userId, moduleId) => {
  // Get all content for the module
  const moduleContent = await Content.find({ moduleId, isActive: true });

  if (moduleContent.length === 0) {
    return;
  }

  // Get user progress for this module
  const moduleProgress = await UserProgress.find({
    userId,
    contentId: { $in: moduleContent.map((c) => c.id) },
  });

  // Count completed content
  const completedCount = moduleProgress.filter(
    (p) => p.status === "completed"
  ).length;

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (completedCount / moduleContent.length) * 100
  );

  // Update enrollment
  const enrollment = await UserEnrollment.findByUserAndModule(userId, moduleId);
  if (enrollment) {
    enrollment.completedSections = completedCount;
    enrollment.totalSections = moduleContent.length;
    enrollment.progressPercentage = completionPercentage;

    // Auto-complete module if 100%
    if (completionPercentage === 100 && enrollment.status === "active") {
      enrollment.status = "completed";
    }

    await enrollment.save();
  }

  return enrollment;
};

module.exports = {
  markContentStarted,
  markContentComplete,
  updateContentProgress,
  getUserOverallProgress,
  getUserModuleProgress,
  getUserContentTypeProgress,
};
