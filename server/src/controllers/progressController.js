const UserProgress = require("../models/UserProgress");
const UserEnrollment = require("../models/UserEnrollment");
const Content = require("../models/Content");
const Module = require("../models/Module");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

/**
 * @desc    Get user's overall progress
 * @route   GET /api/progress/:userId
 * @access  Private
 */
const getUserProgress = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { contentType, status, moduleId } = req.query;

  // Validate userId is a valid ObjectId
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

  // Build query options
  const options = {
    populate: true,
  };

  if (contentType) {
    options.contentType = contentType;
  }

  if (status) {
    options.status = status;
  }

  // Get user progress
  let userProgress;

  if (moduleId) {
    // Validate moduleId if provided
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }

    userProgress = await UserProgress.getUserProgressByModule(userId, moduleId);
  } else {
    userProgress = await UserProgress.getUserProgress(userId, options);
  }

  // Calculate summary statistics
  const totalProgress = userProgress.length;
  const completedProgress = userProgress.filter(
    (p) => p.status === "completed"
  ).length;
  const inProgressCount = userProgress.filter(
    (p) => p.status === "in-progress"
  ).length;
  const notStartedCount = userProgress.filter(
    (p) => p.status === "not-started"
  ).length;
  const averageProgress =
    totalProgress > 0
      ? Math.round(
          userProgress.reduce((sum, p) => sum + p.progressPercentage, 0) /
            totalProgress
        )
      : 0;
  const totalTimeSpent = userProgress.reduce((sum, p) => sum + p.timeSpent, 0);

  res.status(200).json({
    success: true,
    message: "User progress retrieved successfully",
    data: {
      progress: userProgress,
      statistics: {
        total: totalProgress,
        completed: completedProgress,
        inProgress: inProgressCount,
        notStarted: notStartedCount,
        averageProgress,
        totalTimeSpent,
      },
    },
  });
});

/**
 * @desc    Get module-specific progress for a user
 * @route   GET /api/progress/:userId/:moduleId
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

  // Get user progress for this specific module
  const moduleProgress = await UserProgress.getUserProgressByModule(
    userId,
    moduleId
  );

  // Get enrollment status for this module
  const enrollment = await UserEnrollment.findByUserAndModule(userId, moduleId);

  // Get all content for this module to calculate completion percentage
  const moduleContent = await Content.find({ moduleId, isActive: true });
  const totalContent = moduleContent.length;
  const completedContent = moduleProgress.filter(
    (p) => p.status === "completed"
  ).length;
  const moduleCompletionPercentage =
    totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;

  // Calculate total time spent on this module
  const totalTimeSpent = moduleProgress.reduce(
    (sum, p) => sum + p.timeSpent,
    0
  );

  // Group progress by content type
  const progressByType = {
    video: moduleProgress.filter((p) => p.contentType === "video"),
    lab: moduleProgress.filter((p) => p.contentType === "lab"),
    game: moduleProgress.filter((p) => p.contentType === "game"),
    document: moduleProgress.filter((p) => p.contentType === "document"),
  };

  res.status(200).json({
    success: true,
    message: "Module progress retrieved successfully",
    data: {
      module: {
        id: module._id,
        title: module.title,
        description: module.description,
      },
      enrollment: enrollment || null,
      progress: moduleProgress,
      statistics: {
        totalContent,
        completedContent,
        completionPercentage: moduleCompletionPercentage,
        totalTimeSpent,
        progressByType: {
          video: progressByType.video.length,
          lab: progressByType.lab.length,
          game: progressByType.game.length,
          document: progressByType.document.length,
        },
      },
    },
  });
});

/**
 * @desc    Update content progress
 * @route   POST /api/progress
 * @access  Private
 */
const updateProgress = asyncHandler(async (req, res, next) => {
  const { contentId, progressPercentage, timeSpent, score, maxScore } =
    req.body;
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

  // Find existing progress or create new one
  let progress = await UserProgress.findByUserAndContent(userId, contentId);

  if (progress) {
    // Update existing progress
    progress.progressPercentage = progressPercentage;

    if (timeSpent && timeSpent > 0) {
      progress.timeSpent += timeSpent;
    }

    if (score !== undefined && score !== null) {
      progress.score = score;
    }

    if (maxScore !== undefined && maxScore !== null) {
      progress.maxScore = maxScore;
    }
  } else {
    // Create new progress record
    progress = new UserProgress({
      userId,
      contentId,
      contentType: content.type,
      progressPercentage,
      timeSpent: timeSpent || 0,
      score: score !== undefined ? score : null,
      maxScore: maxScore !== undefined ? maxScore : null,
    });
  }

  await progress.save();

  // Update enrollment progress if user is enrolled in the module
  const enrollment = await UserEnrollment.findByUserAndModule(
    userId,
    content.moduleId
  );
  if (enrollment) {
    // Recalculate module completion
    const allModuleProgress = await UserProgress.getUserProgressByModule(
      userId,
      content.moduleId
    );
    const completedCount = allModuleProgress.filter(
      (p) => p.status === "completed"
    ).length;
    const moduleContent = await Content.find({
      moduleId: content.moduleId,
      isActive: true,
    });

    if (moduleContent.length > 0) {
      const newCompletionPercentage = Math.round(
        (completedCount / moduleContent.length) * 100
      );
      enrollment.progressPercentage = newCompletionPercentage;
      enrollment.completedSections = completedCount;
      enrollment.totalSections = moduleContent.length;
      await enrollment.save();
    }
  }

  // Populate content information for response
  await progress.populate("contentId", "title type section moduleId");

  res.status(201).json({
    success: true,
    message: "Progress updated successfully",
    data: progress,
  });
});

/**
 * @desc    Mark content as completed
 * @route   PUT /api/progress/:id/complete
 * @access  Private
 */
const markContentCompleted = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { score } = req.body;
  const userId = req.user.id;

  // Validate progress ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid progress ID format", 400));
  }

  // Find progress record
  const progress = await UserProgress.findById(id).populate("contentId");
  if (!progress) {
    return next(new ErrorResponse("Progress record not found", 404));
  }

  // Authorization: Users can only update their own progress
  if (progress.userId.toString() !== userId) {
    return next(
      new ErrorResponse("Not authorized to update this progress", 403)
    );
  }

  // Mark as completed
  await progress.markCompleted(score);

  // Update enrollment progress
  const enrollment = await UserEnrollment.findByUserAndModule(
    userId,
    progress.contentId.moduleId
  );
  if (enrollment) {
    const allModuleProgress = await UserProgress.getUserProgressByModule(
      userId,
      progress.contentId.moduleId
    );
    const completedCount = allModuleProgress.filter(
      (p) => p.status === "completed"
    ).length;
    const moduleContent = await Content.find({
      moduleId: progress.contentId.moduleId,
      isActive: true,
    });

    if (moduleContent.length > 0) {
      const newCompletionPercentage = Math.round(
        (completedCount / moduleContent.length) * 100
      );
      enrollment.progressPercentage = newCompletionPercentage;
      enrollment.completedSections = completedCount;
      enrollment.totalSections = moduleContent.length;
      await enrollment.save();
    }
  }

  res.status(200).json({
    success: true,
    message: "Content marked as completed successfully",
    data: progress,
  });
});

/**
 * @desc    Get module progress statistics
 * @route   GET /api/progress/stats/:moduleId
 * @access  Private (Admin/Instructor)
 */
const getModuleProgressStats = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  // Validate moduleId
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  // Check if module exists
  const module = await Module.findById(moduleId);
  if (!module) {
    return next(new ErrorResponse("Module not found", 404));
  }

  // Authorization: Only admins and instructors can view analytics
  if (req.user.role !== "admin" && req.user.role !== "instructor") {
    return next(
      new ErrorResponse("Not authorized to view progress statistics", 403)
    );
  }

  // Get all content for this module
  const moduleContent = await Content.find({ moduleId, isActive: true });
  const contentIds = moduleContent.map((content) => content._id);

  // Get all progress for this module's content
  const allProgress = await UserProgress.find({
    contentId: { $in: contentIds },
  })
    .populate("userId", "username email")
    .populate("contentId", "title type section");

  // Get enrollments for this module
  const enrollments = await UserEnrollment.find({ moduleId }).populate(
    "userId",
    "username email"
  );

  // Calculate statistics
  const totalUsers = enrollments.length;
  const totalContent = moduleContent.length;

  // Progress by status
  const progressByStatus = {
    completed: allProgress.filter((p) => p.status === "completed").length,
    inProgress: allProgress.filter((p) => p.status === "in-progress").length,
    notStarted: allProgress.filter((p) => p.status === "not-started").length,
  };

  // Progress by content type
  const progressByContentType = {
    video: allProgress.filter((p) => p.contentType === "video"),
    lab: allProgress.filter((p) => p.contentType === "lab"),
    game: allProgress.filter((p) => p.contentType === "game"),
    document: allProgress.filter((p) => p.contentType === "document"),
  };

  // Average completion rates by content type
  const completionRates = {
    video:
      progressByContentType.video.length > 0
        ? Math.round(
            (progressByContentType.video.filter((p) => p.status === "completed")
              .length /
              progressByContentType.video.length) *
              100
          )
        : 0,
    lab:
      progressByContentType.lab.length > 0
        ? Math.round(
            (progressByContentType.lab.filter((p) => p.status === "completed")
              .length /
              progressByContentType.lab.length) *
              100
          )
        : 0,
    game:
      progressByContentType.game.length > 0
        ? Math.round(
            (progressByContentType.game.filter((p) => p.status === "completed")
              .length /
              progressByContentType.game.length) *
              100
          )
        : 0,
    document:
      progressByContentType.document.length > 0
        ? Math.round(
            (progressByContentType.document.filter(
              (p) => p.status === "completed"
            ).length /
              progressByContentType.document.length) *
              100
          )
        : 0,
  };

  // Average time spent by content type
  const averageTimeSpent = {
    video:
      progressByContentType.video.length > 0
        ? Math.round(
            progressByContentType.video.reduce(
              (sum, p) => sum + p.timeSpent,
              0
            ) / progressByContentType.video.length
          )
        : 0,
    lab:
      progressByContentType.lab.length > 0
        ? Math.round(
            progressByContentType.lab.reduce((sum, p) => sum + p.timeSpent, 0) /
              progressByContentType.lab.length
          )
        : 0,
    game:
      progressByContentType.game.length > 0
        ? Math.round(
            progressByContentType.game.reduce(
              (sum, p) => sum + p.timeSpent,
              0
            ) / progressByContentType.game.length
          )
        : 0,
    document:
      progressByContentType.document.length > 0
        ? Math.round(
            progressByContentType.document.reduce(
              (sum, p) => sum + p.timeSpent,
              0
            ) / progressByContentType.document.length
          )
        : 0,
  };

  // Top performing users (by completion percentage)
  const userProgressSummary = enrollments.map((enrollment) => {
    const userProgress = allProgress.filter(
      (p) => p.userId._id.toString() === enrollment.userId._id.toString()
    );
    const completedCount = userProgress.filter(
      (p) => p.status === "completed"
    ).length;
    const totalTimeSpent = userProgress.reduce(
      (sum, p) => sum + p.timeSpent,
      0
    );

    return {
      user: enrollment.userId,
      completionPercentage: enrollment.progressPercentage,
      completedContent: completedCount,
      totalTimeSpent,
      enrollment: {
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
      },
    };
  });

  // Sort by completion percentage
  userProgressSummary.sort(
    (a, b) => b.completionPercentage - a.completionPercentage
  );

  res.status(200).json({
    success: true,
    message: "Module progress statistics retrieved successfully",
    data: {
      module: {
        id: module._id,
        title: module.title,
        description: module.description,
      },
      overview: {
        totalUsers,
        totalContent,
        totalProgress: allProgress.length,
      },
      progressByStatus,
      completionRates,
      averageTimeSpent,
      userProgressSummary,
      enrollments: enrollments.length,
    },
  });
});

/**
 * @desc    Get user's labs progress across all enrolled modules
 * @route   GET /api/progress/:userId/labs
 * @access  Private
 */
const getUserLabsProgress = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { moduleId, status } = req.query;

  // Validate userId is a valid ObjectId
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

  // Get user's enrollments to filter only enrolled modules
  const enrollments = await UserEnrollment.find({
    userId,
    status: { $in: ["active", "completed"] },
  }).populate("moduleId", "title description difficulty phase");

  if (enrollments.length === 0) {
    return res.status(200).json({
      success: true,
      message: "User labs progress retrieved successfully",
      data: {
        labs: [],
        statistics: {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          averageProgress: 0,
          totalTimeSpent: 0,
          averageScore: 0,
        },
        modules: [],
      },
    });
  }

  const enrolledModuleIds = enrollments.map((e) => e.moduleId._id);

  // Build query for labs content
  let contentQuery = {
    moduleId: { $in: enrolledModuleIds },
    type: "lab",
    isActive: true,
  };

  if (moduleId) {
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }
    contentQuery.moduleId = moduleId;
  }

  // Get all lab content from enrolled modules
  const labContent = await Content.find(contentQuery)
    .populate("moduleId", "title description difficulty phase")
    .sort({ moduleId: 1, createdAt: 1 });

  if (labContent.length === 0) {
    return res.status(200).json({
      success: true,
      message: "User labs progress retrieved successfully",
      data: {
        labs: [],
        statistics: {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          averageProgress: 0,
          totalTimeSpent: 0,
          averageScore: 0,
        },
        modules: enrollments.map((e) => e.moduleId),
      },
    });
  }

  const labContentIds = labContent.map((content) => content._id);

  // Get user progress for these labs
  let progressQuery = {
    userId,
    contentId: { $in: labContentIds },
    contentType: "lab",
  };

  if (status) {
    progressQuery.status = status;
  }

  const labProgress = await UserProgress.find(progressQuery)
    .populate(
      "contentId",
      "title description section duration instructions metadata"
    )
    .sort({ updatedAt: -1 });

  // Create a map of progress by content ID for efficient lookup
  const progressMap = new Map();
  labProgress.forEach((p) => {
    progressMap.set(p.contentId._id.toString(), p);
  });

  // Build complete labs data with progress information
  const labsWithProgress = labContent.map((lab) => {
    const progress = progressMap.get(lab._id.toString());

    return {
      id: lab._id,
      title: lab.title,
      description: lab.description,
      section: lab.section,
      duration: lab.duration,
      instructions: lab.instructions,
      metadata: lab.metadata,
      module: {
        id: lab.moduleId._id,
        title: lab.moduleId.title,
        description: lab.moduleId.description,
        difficulty: lab.moduleId.difficulty,
        phase: lab.moduleId.phase,
      },
      progress: progress
        ? {
            id: progress._id,
            status: progress.status,
            progressPercentage: progress.progressPercentage,
            startedAt: progress.startedAt,
            completedAt: progress.completedAt,
            timeSpent: progress.timeSpent,
            score: progress.score,
            maxScore: progress.maxScore,
            updatedAt: progress.updatedAt,
          }
        : {
            status: "not-started",
            progressPercentage: 0,
            startedAt: null,
            completedAt: null,
            timeSpent: 0,
            score: null,
            maxScore: null,
          },
    };
  });

  // Filter by status if specified
  let filteredLabs = labsWithProgress;
  if (status) {
    filteredLabs = labsWithProgress.filter(
      (lab) => lab.progress.status === status
    );
  }

  // Calculate statistics
  const totalLabs = labsWithProgress.length;
  const completedLabs = labsWithProgress.filter(
    (lab) => lab.progress.status === "completed"
  ).length;
  const inProgressLabs = labsWithProgress.filter(
    (lab) => lab.progress.status === "in-progress"
  ).length;
  const notStartedLabs = labsWithProgress.filter(
    (lab) => lab.progress.status === "not-started"
  ).length;

  const averageProgress =
    totalLabs > 0
      ? Math.round(
          labsWithProgress.reduce(
            (sum, lab) => sum + lab.progress.progressPercentage,
            0
          ) / totalLabs
        )
      : 0;

  const totalTimeSpent = labsWithProgress.reduce(
    (sum, lab) => sum + lab.progress.timeSpent,
    0
  );

  const labsWithScores = labsWithProgress.filter(
    (lab) => lab.progress.score !== null
  );
  const averageScore =
    labsWithScores.length > 0
      ? Math.round(
          labsWithScores.reduce((sum, lab) => sum + lab.progress.score, 0) /
            labsWithScores.length
        )
      : 0;

  // Group labs by module for better organization
  const labsByModule = enrollments.map((enrollment) => {
    const moduleLabs = filteredLabs.filter(
      (lab) => lab.module.id.toString() === enrollment.moduleId._id.toString()
    );

    return {
      module: enrollment.moduleId,
      enrollment: {
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        progressPercentage: enrollment.progressPercentage,
      },
      labs: moduleLabs,
      statistics: {
        total: moduleLabs.length,
        completed: moduleLabs.filter(
          (lab) => lab.progress.status === "completed"
        ).length,
        inProgress: moduleLabs.filter(
          (lab) => lab.progress.status === "in-progress"
        ).length,
        notStarted: moduleLabs.filter(
          (lab) => lab.progress.status === "not-started"
        ).length,
      },
    };
  });

  res.status(200).json({
    success: true,
    message: "User labs progress retrieved successfully",
    data: {
      labs: filteredLabs,
      statistics: {
        total: totalLabs,
        completed: completedLabs,
        inProgress: inProgressLabs,
        notStarted: notStartedLabs,
        averageProgress,
        totalTimeSpent,
        averageScore,
      },
      modules: labsByModule,
    },
  });
});

/**
 * @desc    Get user's games progress across all enrolled modules
 * @route   GET /api/progress/:userId/games
 * @access  Private
 */
const getUserGamesProgress = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { moduleId, status } = req.query;

  // Validate userId is a valid ObjectId
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

  // Get user's enrollments to filter only enrolled modules
  const enrollments = await UserEnrollment.find({
    userId,
    status: { $in: ["active", "completed"] },
  }).populate("moduleId", "title description difficulty phase");

  if (enrollments.length === 0) {
    return res.status(200).json({
      success: true,
      message: "User games progress retrieved successfully",
      data: {
        games: [],
        statistics: {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          averageProgress: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          totalPoints: 0,
        },
        modules: [],
      },
    });
  }

  const enrolledModuleIds = enrollments.map((e) => e.moduleId._id);

  // Build query for games content
  let contentQuery = {
    moduleId: { $in: enrolledModuleIds },
    type: "game",
    isActive: true,
  };

  if (moduleId) {
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }
    contentQuery.moduleId = moduleId;
  }

  // Get all game content from enrolled modules
  const gameContent = await Content.find(contentQuery)
    .populate("moduleId", "title description difficulty phase")
    .sort({ moduleId: 1, createdAt: 1 });

  if (gameContent.length === 0) {
    return res.status(200).json({
      success: true,
      message: "User games progress retrieved successfully",
      data: {
        games: [],
        statistics: {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          averageProgress: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          totalPoints: 0,
        },
        modules: enrollments.map((e) => e.moduleId),
      },
    });
  }

  const gameContentIds = gameContent.map((content) => content._id);

  // Get user progress for these games
  let progressQuery = {
    userId,
    contentId: { $in: gameContentIds },
    contentType: "game",
  };

  if (status) {
    progressQuery.status = status;
  }

  const gameProgress = await UserProgress.find(progressQuery)
    .populate(
      "contentId",
      "title description section duration instructions metadata"
    )
    .sort({ updatedAt: -1 });

  // Create a map of progress by content ID for efficient lookup
  const progressMap = new Map();
  gameProgress.forEach((p) => {
    progressMap.set(p.contentId._id.toString(), p);
  });

  // Build complete games data with progress information
  const gamesWithProgress = gameContent.map((game) => {
    const progress = progressMap.get(game._id.toString());

    // Extract game-specific metadata
    const gameMetadata = game.metadata || {};
    const scoring = gameMetadata.scoring || {};
    const pointsEarned = progress?.score || 0;

    return {
      id: game._id,
      title: game.title,
      description: game.description,
      section: game.section,
      duration: game.duration,
      instructions: game.instructions,
      metadata: {
        ...gameMetadata,
        difficulty: gameMetadata.difficulty || "beginner",
        gameType: gameMetadata.gameType || "challenge",
        levels: gameMetadata.levels || 1,
        scoring: scoring,
      },
      module: {
        id: game.moduleId._id,
        title: game.moduleId.title,
        description: game.moduleId.description,
        difficulty: game.moduleId.difficulty,
        phase: game.moduleId.phase,
      },
      progress: progress
        ? {
            id: progress._id,
            status: progress.status,
            progressPercentage: progress.progressPercentage,
            startedAt: progress.startedAt,
            completedAt: progress.completedAt,
            timeSpent: progress.timeSpent,
            score: progress.score,
            maxScore: progress.maxScore,
            pointsEarned: pointsEarned,
            updatedAt: progress.updatedAt,
          }
        : {
            status: "not-started",
            progressPercentage: 0,
            startedAt: null,
            completedAt: null,
            timeSpent: 0,
            score: null,
            maxScore: null,
            pointsEarned: 0,
          },
    };
  });

  // Filter by status if specified
  let filteredGames = gamesWithProgress;
  if (status) {
    filteredGames = gamesWithProgress.filter(
      (game) => game.progress.status === status
    );
  }

  // Calculate statistics
  const totalGames = gamesWithProgress.length;
  const completedGames = gamesWithProgress.filter(
    (game) => game.progress.status === "completed"
  ).length;
  const inProgressGames = gamesWithProgress.filter(
    (game) => game.progress.status === "in-progress"
  ).length;
  const notStartedGames = gamesWithProgress.filter(
    (game) => game.progress.status === "not-started"
  ).length;

  const averageProgress =
    totalGames > 0
      ? Math.round(
          gamesWithProgress.reduce(
            (sum, game) => sum + game.progress.progressPercentage,
            0
          ) / totalGames
        )
      : 0;

  const totalTimeSpent = gamesWithProgress.reduce(
    (sum, game) => sum + game.progress.timeSpent,
    0
  );

  const gamesWithScores = gamesWithProgress.filter(
    (game) => game.progress.score !== null
  );
  const averageScore =
    gamesWithScores.length > 0
      ? Math.round(
          gamesWithScores.reduce((sum, game) => sum + game.progress.score, 0) /
            gamesWithScores.length
        )
      : 0;

  const totalPoints = gamesWithProgress.reduce(
    (sum, game) => sum + game.progress.pointsEarned,
    0
  );

  // Group games by module for better organization
  const gamesByModule = enrollments.map((enrollment) => {
    const moduleGames = filteredGames.filter(
      (game) => game.module.id.toString() === enrollment.moduleId._id.toString()
    );

    return {
      module: enrollment.moduleId,
      enrollment: {
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        progressPercentage: enrollment.progressPercentage,
      },
      games: moduleGames,
      statistics: {
        total: moduleGames.length,
        completed: moduleGames.filter(
          (game) => game.progress.status === "completed"
        ).length,
        inProgress: moduleGames.filter(
          (game) => game.progress.status === "in-progress"
        ).length,
        notStarted: moduleGames.filter(
          (game) => game.progress.status === "not-started"
        ).length,
        totalPoints: moduleGames.reduce(
          (sum, game) => sum + game.progress.pointsEarned,
          0
        ),
      },
    };
  });

  res.status(200).json({
    success: true,
    message: "User games progress retrieved successfully",
    data: {
      games: filteredGames,
      statistics: {
        total: totalGames,
        completed: completedGames,
        inProgress: inProgressGames,
        notStarted: notStartedGames,
        averageProgress,
        totalTimeSpent,
        averageScore,
        totalPoints,
      },
      modules: gamesByModule,
    },
  });
});

module.exports = {
  getUserProgress,
  getUserModuleProgress,
  updateProgress,
  markContentCompleted,
  getModuleProgressStats,
  getUserLabsProgress,
  getUserGamesProgress,
};
