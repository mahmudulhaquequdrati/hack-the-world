const Content = require("../models/Content");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

/**
 * @desc    Get all content with optional filtering
 * @route   GET /api/content
 * @access  Private
 * @query   ?type=video&moduleId=basic-cybersec&limit=10&page=1
 */
const getAllContent = asyncHandler(async (req, res, next) => {
  const { type, moduleId, limit = 10, page = 1 } = req.query;

  // Build query object
  let query = { isActive: true };

  if (type) {
    // Validate content type
    if (!["video", "lab", "game", "document"].includes(type)) {
      return next(new ErrorResponse("Invalid content type", 400));
    }
    query.type = type;
  }

  if (moduleId) {
    // Validate moduleId ObjectId format
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }
    query.moduleId = moduleId;
  }

  const content = await Content.find(query)
    .populate("module", "title")
    .sort({ moduleId: 1, section: 1, order: 1, createdAt: 1 });

  const total = await Content.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Content retrieved successfully",
    data: content,
  });
});

/**
 * @desc    Get content by ID
 * @route   GET /api/content/:id
 * @access  Private
 */
const getContentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  const content = await Content.findById(id)
    .where({ isActive: true })
    .populate("module", "title");

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content retrieved successfully",
    data: content,
  });
});

/**
 * @desc    Get content by module
 * @route   GET /api/content/module/:moduleId
 * @access  Private
 */
const getContentByModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  const content = await Content.getByModule(moduleId);

  res.status(200).json({
    success: true,
    message: `Content for module retrieved successfully`,
    data: content,
    count: content.length,
  });
});

const getModuleOverview = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  const content = await Content.getByModuleForOverview(moduleId);

  res.status(200).json({
    success: true,
    message: "Module overview retrieved successfully",
    data: content,
  });
});

/**
 * @desc    Get content by module grouped by sections
 * @route   GET /api/content/module/:moduleId/grouped
 * @access  Private
 */
const getContentByModuleGrouped = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  const groupedContent = await Content.getByModuleGrouped(moduleId);

  res.status(200).json({
    success: true,
    message: `Grouped content for module retrieved successfully`,
    data: groupedContent,
  });
});

/**
 * @desc    Get first content by module (T004)
 * @route   GET /api/content/module/:moduleId/first
 * @access  Private
 */
const getFirstContentByModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  const firstContent = await Content.getFirstContentByModule(moduleId);

  if (!firstContent) {
    return next(new ErrorResponse("No content found for this module", 404));
  }

  res.status(200).json({
    success: true,
    message: "First content for module retrieved successfully",
    data: firstContent,
  });
});

/**
 * @desc    Get content by module grouped by sections with optimized fields (T005)
 * @route   GET /api/content/module/:moduleId/grouped-optimized
 * @access  Private
 */
const getContentByModuleGroupedOptimized = asyncHandler(
  async (req, res, next) => {
    const { moduleId } = req.params;

    // Validate moduleId ObjectId format
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }

    const groupedContent = await Content.getByModuleGroupedOptimized(
      moduleId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Optimized grouped content for module retrieved successfully",
      data: groupedContent,
    });
  }
);

/**
 * @desc    Get content with navigation context (T006)
 * @route   GET /api/content/:id/with-navigation
 * @access  Private
 */
const getContentWithNavigation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  const contentWithNavigation = await Content.getContentWithNavigation(id);

  if (!contentWithNavigation) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content with navigation retrieved successfully",
    data: contentWithNavigation,
  });
});

/**
 * @desc    Get content by type
 * @route   GET /api/content/type/:type
 * @access  Private
 */
const getContentByType = asyncHandler(async (req, res, next) => {
  const { type } = req.params;
  const { moduleId } = req.query;

  // Validate content type
  if (!["video", "lab", "game", "document"].includes(type)) {
    return next(new ErrorResponse("Invalid content type", 400));
  }

  let validatedModuleId = null;
  if (moduleId) {
    // Validate moduleId ObjectId format
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }
    validatedModuleId = moduleId;
  }

  const content = await Content.getByType(type, validatedModuleId);

  res.status(200).json({
    success: true,
    message: `${type} content retrieved successfully`,
    data: content,
    count: content.length,
  });
});

/**
 * @desc    Get distinct sections by module
 * @route   GET /api/content/sections/by-module/:moduleId
 * @access  Private
 */
const getSectionsByModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  // Check if module exists
  const Module = require("../models/Module");
  const module = await Module.findById(moduleId);
  if (!module) {
    return next(new ErrorResponse("Module not found", 404));
  }

  const sections = await Content.getSectionsByModule(moduleId);

  res.status(200).json({
    success: true,
    message: `Sections for module retrieved successfully`,
    data: sections,
    count: sections.length,
  });
});

/**
 * @desc    Create new content
 * @route   POST /api/content
 * @access  Private (Admin)
 */
const createContent = asyncHandler(async (req, res, next) => {
  const contentData = req.body;

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(contentData.moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  // Check if module exists
  const Module = require("../models/Module");
  const module = await Module.findById(contentData.moduleId);
  if (!module) {
    return next(new ErrorResponse("Module not found", 404));
  }

  // Validate resources structure if provided
  if (contentData.resources && Array.isArray(contentData.resources)) {
    const invalidResources = contentData.resources.filter(
      (resource) =>
        !resource.name ||
        !resource.type ||
        ![
          "url",
          "file",
          "document",
          "tool",
          "reference",
          "video",
          "download",
        ].includes(resource.type)
    );
    if (invalidResources.length > 0) {
      return next(
        new ErrorResponse(
          "Each resource must have a valid name and type (url, file, document, tool, reference, video, download)",
          400
        )
      );
    }
  }

  // Validate outcomes for labs and games
  if (
    (contentData.type === "lab" || contentData.type === "game") &&
    (!contentData.outcomes ||
      !Array.isArray(contentData.outcomes) ||
      contentData.outcomes.length === 0)
  ) {
    return next(
      new ErrorResponse(
        "Labs and games must have at least one learning outcome",
        400
      )
    );
  }

  // Validate outcomes structure if provided
  if (contentData.outcomes && Array.isArray(contentData.outcomes)) {
    const invalidOutcomes = contentData.outcomes.filter(
      (outcome) =>
        !outcome.title || !outcome.description || !Array.isArray(outcome.skills)
    );
    if (invalidOutcomes.length > 0) {
      return next(
        new ErrorResponse(
          "Each outcome must have a title, description, and skills array",
          400
        )
      );
    }
  }

  // Auto-assign order if not provided
  if (!contentData.order && contentData.section) {
    // Find the highest order number in this module and section
    const highestOrderContent = await Content.findOne({
      moduleId: contentData.moduleId,
      section: contentData.section,
      isActive: true,
    })
      .sort({ order: -1 })
      .select("order");

    // Assign next order number (default to 1 if no content exists)
    contentData.order = highestOrderContent?.order
      ? highestOrderContent.order + 1
      : 1;
  }

  const content = await Content.create(contentData);

  // Populate module information
  await content.populate("module", "title");

  res.status(201).json({
    success: true,
    message: "Content created successfully",
    data: content,
  });
});

/**
 * @desc    Update content
 * @route   PUT /api/content/:id
 * @access  Private (Admin)
 */
const updateContent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate content ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  // If updating moduleId, validate it
  if (updateData.moduleId) {
    if (!mongoose.Types.ObjectId.isValid(updateData.moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }

    // Check if module exists
    const Module = require("../models/Module");
    const module = await Module.findById(updateData.moduleId);
    if (!module) {
      return next(new ErrorResponse("Module not found", 404));
    }
  }

  // Validate resources structure if provided
  if (updateData.resources && Array.isArray(updateData.resources)) {
    const invalidResources = updateData.resources.filter(
      (resource) =>
        !resource.name ||
        !resource.type ||
        ![
          "url",
          "file",
          "document",
          "tool",
          "reference",
          "video",
          "download",
        ].includes(resource.type)
    );
    if (invalidResources.length > 0) {
      return next(
        new ErrorResponse(
          "Each resource must have a valid name and type (url, file, document, tool, reference, video, download)",
          400
        )
      );
    }
  }

  // Validate outcomes structure if provided
  if (updateData.outcomes && Array.isArray(updateData.outcomes)) {
    const invalidOutcomes = updateData.outcomes.filter(
      (outcome) =>
        !outcome.title || !outcome.description || !Array.isArray(outcome.skills)
    );
    if (invalidOutcomes.length > 0) {
      return next(
        new ErrorResponse(
          "Each outcome must have a title, description, and skills array",
          400
        )
      );
    }
  }

  // If updating content type to lab or game, ensure outcomes exist
  if (
    updateData.type &&
    (updateData.type === "lab" || updateData.type === "game")
  ) {
    // Get current content to check existing outcomes
    const currentContent = await Content.findById(id);
    if (!currentContent) {
      return next(new ErrorResponse("Content not found", 404));
    }

    const finalOutcomes = updateData.outcomes || currentContent.outcomes;
    if (
      !finalOutcomes ||
      !Array.isArray(finalOutcomes) ||
      finalOutcomes.length === 0
    ) {
      return next(
        new ErrorResponse(
          "Labs and games must have at least one learning outcome",
          400
        )
      );
    }
  }

  const content = await Content.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("module", "title");

  await Content.updateModuleStats(content.moduleId);

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content updated successfully",
    data: content,
  });
});

/**
 * @desc    Delete content (soft delete)
 * @route   DELETE /api/content/:id
 * @access  Private (Admin)
 */
const deleteContent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate content ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  const content = await Content.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content deleted successfully",
  });
});

/**
 * @desc    Permanently delete content
 * @route   DELETE /api/content/:id/permanent
 * @access  Private (Admin)
 */
const permanentDeleteContent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate content ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  const content = await Content.findByIdAndDelete(id);

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content permanently deleted successfully",
  });
});

/**
 * @desc    Get content with module and progress in one API call (T032)
 * @route   GET /api/content/:id/with-module-and-progress
 * @access  Private
 */
const getContentWithModuleAndProgress = asyncHandler(async (req, res, next) => {
  const { id: contentId } = req.params;
  const userId = req.user._id;

  // Validate content ObjectId format
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  // Get content with module populated
  const content = await Content.findById(contentId)
    .populate("moduleId", "_id title description icon color difficulty ")
    .lean();

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  // Check if user is enrolled in the module
  const UserEnrollment = require("../models/UserEnrollment");
  const enrollment = await UserEnrollment.findByUserAndModule(
    userId,
    content.moduleId._id
  );
  if (!enrollment) {
    return next(new ErrorResponse("User is not enrolled in this module", 403));
  }

  // Get or create progress for this content (implements startContent logic)
  const UserProgress = require("../models/UserProgress");
  let progress = await UserProgress.findByUserAndContent(userId, contentId);
  let wasStarted = false;

  if (!progress) {
    // Create new progress record in "in-progress" state (startContent logic)
    progress = new UserProgress({
      userId,
      contentId,
      contentType: content.type,
      status: "in-progress",
      progressPercentage: 1,
      startedAt: new Date(),
    });
    await progress.save();
    wasStarted = true;
  } else if (progress.status === "not-started") {
    // Mark as started if not already started (startContent logic)
    await progress.markStarted();
    wasStarted = true;
  }

  // Format the response
  const response = {
    content: {
      _id: content._id.toString(),
      title: content.title,
      description: content.description,
      type: content.type,
      url: content.url,
      instructions: content.instructions,
      duration: content.duration,
      section: content.section,
      resources: content.resources,
      // AI-specific fields
      aiContent: content.aiContent,
      aiDescription: content.aiDescription,
      availableTools: content.availableTools,
      terminalConfig: content.terminalConfig,
    },
    module: {
      _id: content.moduleId._id.toString(),
      title: content.moduleId.title,
      description: content.moduleId.description,
      icon: content.moduleId.icon,
      color: content.moduleId.color,
      difficulty: content.moduleId.difficulty,
    },
    progress: {
      _id: progress._id,
      status: progress.status,
      progressPercentage: progress.progressPercentage,
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
      score: progress.score,
      maxScore: progress.maxScore,
      wasStarted: wasStarted, // Indicates if startContent logic was executed
    },
  };

  res.status(200).json({
    success: true,
    message: "Content with module and progress retrieved successfully",
    data: response,
  });
});

/**
 * @desc    Get dashboard labs and games data for enrolled modules
 * @route   GET /api/content/dashboard/labs-games
 * @access  Private
 */
const getDashboardLabsAndGames = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  try {
    // Get user's enrolled modules
    const UserEnrollment = require("../models/UserEnrollment");
    const enrollments = await UserEnrollment.find({
      userId,
      status: { $in: ["active", "completed"] },
    })
      .select("moduleId")
      .lean();

    if (enrollments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No enrolled modules found",
        data: {
          labs: [],
          games: [],
        },
      });
    }

    const enrolledModuleIds = enrollments.map((e) => e.moduleId);

    // Get all lab and game content from enrolled modules
    const [labContent, gameContent] = await Promise.all([
      Content.find({
        moduleId: { $in: enrolledModuleIds },
        type: "lab",
        isActive: true,
      })
        .populate("moduleId", "title difficulty phaseId")
        .lean(),

      Content.find({
        moduleId: { $in: enrolledModuleIds },
        type: "game",
        isActive: true,
      })
        .populate("moduleId", "title difficulty phaseId")
        .lean(),
    ]);

    // Get all content IDs to fetch progress data
    const allContentIds = [...labContent, ...gameContent].map((c) => c._id);

    // Get user progress for all this content
    const UserProgress = require("../models/UserProgress");
    const progressData = await UserProgress.find({
      userId,
      contentId: { $in: allContentIds },
    }).lean();

    // Create progress map for quick lookup
    const progressMap = new Map();
    progressData.forEach((progress) => {
      progressMap.set(progress.contentId.toString(), progress);
    });

    // Get phase data for enriching response
    const Phase = require("../models/Phase");
    const phaseIds = [
      ...new Set(
        [...labContent, ...gameContent]
          .map((c) => c.moduleId?.phaseId)
          .filter(Boolean)
      ),
    ];
    const phases = await Phase.find({ _id: { $in: phaseIds } })
      .select("title")
      .lean();
    const phaseMap = new Map();
    phases.forEach((phase) => {
      phaseMap.set(phase._id.toString(), phase);
    });

    // Format lab data
    const formattedLabs = labContent.map((lab) => {
      const progress = progressMap.get(lab._id.toString());
      const phase = phaseMap.get(lab.moduleId?.phaseId?.toString());

      return {
        _id: lab._id.toString(),
        title: lab.title,
        description: lab.description,
        difficulty: lab.moduleId?.difficulty || "Beginner",
        duration: `${lab.duration || 45} min`,
        skills: lab.metadata?.skills || ["Cybersecurity", "Hands-on Practice"],
        moduleTitle: lab.moduleId?.title || "Unknown Module",
        moduleColor: "green",
        moduleBgColor: "black",
        completed: progress?.status === "completed" || false,
        available: true,
        phaseId: lab.moduleId?.phaseId?.toString() || "",
        phaseTitle: phase?.title || "Unknown Phase",
        moduleId: lab.moduleId?._id?.toString(),
        type: "lab",
        progressPercentage: progress?.progressPercentage || 0,
        score: progress?.score || null,
        maxScore: progress?.maxScore || null,
        instructions: lab.instructions,
      };
    });

    // Format game data
    const formattedGames = gameContent.map((game) => {
      const progress = progressMap.get(game._id.toString());
      const phase = phaseMap.get(game.moduleId?.phaseId?.toString());

      return {
        _id: game._id.toString(),
        title: game.title,
        description: game.description,
        type: "game",
        points: game.metadata?.points || 100,
        difficulty: game.moduleId?.difficulty || "Beginner",
        moduleTitle: game.moduleId?.title || "Unknown Module",
        moduleColor: "#00ff41",
        moduleBgColor: "#001100",
        completed: progress?.status === "completed" || false,
        available: true,
        score: progress?.score || null,
        phaseId: game.moduleId?.phaseId?.toString() || "",
        phaseTitle: phase?.title || "Unknown Phase",
        moduleId: game.moduleId?._id?.toString(),
        progressPercentage: progress?.progressPercentage || 0,
        maxScore: progress?.maxScore || null,
        instructions: game.instructions,
      };
    });

    res.status(200).json({
      success: true,
      message: "Dashboard labs and games data retrieved successfully",
      data: {
        labs: formattedLabs,
        games: formattedGames,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardLabsAndGames:", error);
    return next(
      new ErrorResponse("Failed to retrieve dashboard labs and games data", 500)
    );
  }
});

/**
 * @desc    Reorder content within a section
 * @route   PUT /api/content/module/:moduleId/section/:section/reorder
 * @access  Private (Admin only)
 */
const reorderContentInSection = asyncHandler(async (req, res, next) => {
  const { moduleId, section } = req.params;
  const { contentOrders } = req.body; // Array of { contentId, order }

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse(`Invalid module ID format`, 400));
  }

  // Validate that contentOrders is provided and is an array
  if (
    !contentOrders ||
    !Array.isArray(contentOrders) ||
    contentOrders.length === 0
  ) {
    return next(new ErrorResponse("Content orders array is required", 400));
  }

  // Validate that all content IDs are valid ObjectIds
  const contentIds = contentOrders.map((item) => item.contentId);
  for (const contentId of contentIds) {
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(
        new ErrorResponse(`Invalid content ID format: ${contentId}`, 400)
      );
    }
  }

  // Validate that all content exists, belongs to this module and section
  const content = await Content.find({
    _id: { $in: contentIds },
    moduleId,
    section,
    isActive: true,
  });

  if (content.length !== contentIds.length) {
    return next(
      new ErrorResponse(
        "Some content not found or doesn't belong to this module and section",
        400
      )
    );
  }

  // Use transaction to ensure atomicity and handle unique constraint conflicts
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // First, set all content to temporary negative orders to avoid conflicts
      const tempUpdatePromises = contentOrders.map(({ contentId }, index) =>
        Content.findOneAndUpdate(
          { _id: contentId, moduleId, section },
          { order: -(index + 1) }, // Use negative numbers temporarily
          { session }
        )
      );
      await Promise.all(tempUpdatePromises);

      // Then update with the actual orders
      const finalUpdatePromises = contentOrders.map(({ contentId, order }) =>
        Content.findOneAndUpdate(
          { _id: contentId, moduleId, section },
          { order },
          { new: true, runValidators: true, session }
        )
      );
      await Promise.all(finalUpdatePromises);
    });

    await session.endSession();

    // Fetch updated content for this section
    const updatedContent = await Content.find({
      moduleId,
      section,
      isActive: true,
    }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      message: "Content order updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    await session.endSession();
    console.error("Reorder transaction failed:", error);
    return next(new ErrorResponse("Failed to update content order", 500));
  }
});

module.exports = {
  getAllContent,
  getContentById,
  getContentByModule,
  getContentByModuleGrouped,
  getContentByType,
  getSectionsByModule,
  createContent,
  updateContent,
  deleteContent,
  permanentDeleteContent,
  getModuleOverview,
  getFirstContentByModule,
  getContentByModuleGroupedOptimized,
  getContentWithNavigation,
  getContentWithModuleAndProgress,
  getDashboardLabsAndGames,
  reorderContentInSection,
};
