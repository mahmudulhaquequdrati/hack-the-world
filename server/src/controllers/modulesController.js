const { validationResult } = require("express-validator");
const Module = require("../models/Module");
const User = require("../models/User");
const { APIError } = require("../middleware/errorHandler");

/**
 * @desc    Get all modules
 * @route   GET /api/modules
 * @access  Public
 */
const getAllModules = async (req, res, next) => {
  try {
    const {
      phase,
      difficulty,
      category,
      isActive = true,
      page = 1,
      limit = 10,
      sort = "order",
      order = "asc",
    } = req.query;

    // Build query
    const query = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (phase) query.phase = phase;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    // Build sort
    const sortObj = {};
    sortObj[sort] = order === "desc" ? -1 : 1;

    const modules = await Module.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("prerequisites", "name id difficulty");

    const total = await Module.countDocuments(query);

    res.json({
      success: true,
      data: {
        modules: modules.map((module) => module.toClientFormat()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
        filters: {
          phase,
          difficulty,
          category,
          isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get module by ID
 * @route   GET /api/modules/:id
 * @access  Public
 */
const getModuleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const module = await Module.findById(id)
      .populate("prerequisites", "name id difficulty estimatedTime")
      .populate("relatedModules", "name id difficulty category");

    if (!module || !module.isActive) {
      throw new APIError("Module not found", 404);
    }

    res.json({
      success: true,
      data: {
        module: module.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get modules by phase
 * @route   GET /api/modules/phase/:phase
 * @access  Public
 */
const getModulesByPhase = async (req, res, next) => {
  try {
    const { phase } = req.params;
    const modules = await Module.getByPhase(phase);

    res.json({
      success: true,
      data: {
        modules: modules.map((module) => module.toClientFormat()),
        count: modules.length,
        phase,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get module categories
 * @route   GET /api/modules/categories
 * @access  Public
 */
const getModuleCategories = async (req, res, next) => {
  try {
    const categories = await Module.distinct("category", { isActive: true });

    res.json({
      success: true,
      data: {
        categories: categories.sort(),
        count: categories.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get module statistics
 * @route   GET /api/modules/:id/stats
 * @access  Public
 */
const getModuleStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const module = await Module.findById(id);

    if (!module || !module.isActive) {
      throw new APIError("Module not found", 404);
    }

    // Get enrollment statistics
    const enrolledUsers = await User.countDocuments({
      enrolledModules: id,
      status: "active",
    });

    const completedUsers = await User.countDocuments({
      "progress.completedModules": id,
      status: "active",
    });

    // Calculate completion rate
    const completionRate =
      enrolledUsers > 0 ? (completedUsers / enrolledUsers) * 100 : 0;

    // Get average ratings (if rating system exists)
    const ratings = await User.aggregate([
      { $match: { "moduleRatings.moduleId": module._id } },
      { $unwind: "$moduleRatings" },
      { $match: { "moduleRatings.moduleId": module._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$moduleRatings.rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const ratingData =
      ratings.length > 0 ? ratings[0] : { averageRating: 0, totalRatings: 0 };

    res.json({
      success: true,
      data: {
        moduleId: id,
        moduleName: module.name,
        enrolledUsers,
        completedUsers,
        completionRate: Math.round(completionRate * 100) / 100,
        averageRating: Math.round(ratingData.averageRating * 100) / 100,
        totalRatings: ratingData.totalRatings,
        difficulty: module.difficulty,
        estimatedTime: module.estimatedTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enroll user in module
 * @route   POST /api/modules/:id/enroll
 * @access  Private
 */
const enrollInModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const module = await Module.findById(id).populate("prerequisites");
    if (!module || !module.isActive) {
      throw new APIError("Module not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Check if already enrolled
    if (user.enrolledModules.includes(id)) {
      throw new APIError("User already enrolled in this module", 400);
    }

    // Check prerequisites
    if (module.prerequisites && module.prerequisites.length > 0) {
      const completedModules = user.progress.completedModules.map((m) =>
        m.toString()
      );
      const missingPrereqs = module.prerequisites.filter(
        (prereq) => !completedModules.includes(prereq._id.toString())
      );

      if (missingPrereqs.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Prerequisites not met",
          data: {
            missingPrerequisites: missingPrereqs.map((prereq) => ({
              id: prereq._id,
              name: prereq.name,
              difficulty: prereq.difficulty,
            })),
          },
        });
      }
    }

    // Enroll user
    user.enrolledModules.push(id);
    user.enrollments.push({
      moduleId: id,
      enrolledAt: new Date(),
      status: "active",
      progress: {
        lessonsCompleted: 0,
        labsCompleted: 0,
        gamesCompleted: 0,
        overallProgress: 0,
      },
    });

    await user.save();

    res.json({
      success: true,
      message: "Successfully enrolled in module",
      data: {
        moduleId: id,
        moduleName: module.name,
        enrolledAt: new Date(),
        prerequisites: module.prerequisites || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's progress in module
 * @route   GET /api/modules/:id/progress/:userId
 * @access  Private
 */
const getModuleProgress = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const module = await Module.findById(id);
    if (!module || !module.isActive) {
      throw new APIError("Module not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Check if user is enrolled
    if (!user.enrolledModules.includes(id)) {
      throw new APIError("User not enrolled in this module", 400);
    }

    // Find enrollment data
    const enrollment = user.enrollments.find(
      (e) => e.moduleId.toString() === id
    );

    if (!enrollment) {
      throw new APIError("Enrollment data not found", 404);
    }

    // Calculate detailed progress
    const progressDetails = await user.calculateModuleProgress(id);

    res.json({
      success: true,
      data: {
        moduleId: id,
        moduleName: module.name,
        enrollment: {
          enrolledAt: enrollment.enrolledAt,
          status: enrollment.status,
          lastAccessed: enrollment.lastAccessed,
        },
        progress: progressDetails,
        overallProgress: enrollment.progress.overallProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user progress in module
 * @route   PUT /api/modules/:id/progress/:userId
 * @access  Private
 */
const updateModuleProgress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id, userId } = req.params;
    const { lessonId, labId, gameId, completed, timeSpent } = req.body;

    const module = await Module.findById(id);
    if (!module || !module.isActive) {
      throw new APIError("Module not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Find enrollment
    const enrollment = user.enrollments.find(
      (e) => e.moduleId.toString() === id
    );

    if (!enrollment) {
      throw new APIError("User not enrolled in this module", 400);
    }

    // Update specific content progress
    if (lessonId && completed) {
      if (!enrollment.progress.completedLessons) {
        enrollment.progress.completedLessons = [];
      }
      if (!enrollment.progress.completedLessons.includes(lessonId)) {
        enrollment.progress.completedLessons.push(lessonId);
        enrollment.progress.lessonsCompleted =
          enrollment.progress.completedLessons.length;
      }
    }

    if (labId && completed) {
      if (!enrollment.progress.completedLabs) {
        enrollment.progress.completedLabs = [];
      }
      if (!enrollment.progress.completedLabs.includes(labId)) {
        enrollment.progress.completedLabs.push(labId);
        enrollment.progress.labsCompleted =
          enrollment.progress.completedLabs.length;
      }
    }

    if (gameId && completed) {
      if (!enrollment.progress.completedGames) {
        enrollment.progress.completedGames = [];
      }
      if (!enrollment.progress.completedGames.includes(gameId)) {
        enrollment.progress.completedGames.push(gameId);
        enrollment.progress.gamesCompleted =
          enrollment.progress.completedGames.length;
      }
    }

    // Update time spent
    if (timeSpent) {
      enrollment.progress.timeSpent =
        (enrollment.progress.timeSpent || 0) + timeSpent;
    }

    // Update last accessed
    enrollment.lastAccessed = new Date();

    // Recalculate overall progress
    const totalContent =
      module.content.lessons.length +
      module.content.labs.length +
      module.content.games.length;
    const completedContent =
      (enrollment.progress.lessonsCompleted || 0) +
      (enrollment.progress.labsCompleted || 0) +
      (enrollment.progress.gamesCompleted || 0);

    enrollment.progress.overallProgress =
      totalContent > 0
        ? Math.round((completedContent / totalContent) * 100)
        : 0;

    // Check if module is completed
    if (
      enrollment.progress.overallProgress >= 100 &&
      enrollment.status !== "completed"
    ) {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();

      // Add to completed modules if not already there
      if (!user.progress.completedModules.includes(id)) {
        user.progress.completedModules.push(id);
      }

      // Award completion bonus experience
      const bonus = module.points || 100;
      await user.addExperience(bonus);
    }

    await user.save();

    res.json({
      success: true,
      message: "Progress updated successfully",
      data: {
        enrollment: {
          status: enrollment.status,
          progress: enrollment.progress,
          completedAt: enrollment.completedAt,
        },
        moduleCompleted: enrollment.status === "completed",
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rate module
 * @route   POST /api/modules/:id/rate
 * @access  Private
 */
const rateModule = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { userId, rating, review } = req.body;

    if (rating < 1 || rating > 5) {
      throw new APIError("Rating must be between 1 and 5", 400);
    }

    const module = await Module.findById(id);
    if (!module || !module.isActive) {
      throw new APIError("Module not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Check if user has completed the module
    if (!user.progress.completedModules.includes(id)) {
      throw new APIError("You must complete the module before rating it", 400);
    }

    // Check if user already rated this module
    const existingRatingIndex = user.moduleRatings.findIndex(
      (r) => r.moduleId.toString() === id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      user.moduleRatings[existingRatingIndex].rating = rating;
      user.moduleRatings[existingRatingIndex].review = review;
      user.moduleRatings[existingRatingIndex].updatedAt = new Date();
    } else {
      // Add new rating
      user.moduleRatings.push({
        moduleId: id,
        rating,
        review,
        createdAt: new Date(),
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Module rated successfully",
      data: {
        moduleId: id,
        rating,
        review,
        ratedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new module (admin only)
 * @route   POST /api/modules
 * @access  Private (Admin)
 */
const createModule = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const moduleData = req.body;
    const module = new Module(moduleData);
    await module.save();

    res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: {
        module: module.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update module (admin only)
 * @route   PUT /api/modules/:id
 * @access  Private (Admin)
 */
const updateModule = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const module = await Module.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!module) {
      throw new APIError("Module not found", 404);
    }

    res.json({
      success: true,
      message: "Module updated successfully",
      data: {
        module: module.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete module (admin only)
 * @route   DELETE /api/modules/:id
 * @access  Private (Admin)
 */
const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const module = await Module.findById(id);
    if (!module) {
      throw new APIError("Module not found", 404);
    }

    // Soft delete - mark as inactive
    module.isActive = false;
    await module.save();

    res.json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllModules,
  getModuleById,
  getModulesByPhase,
  getModuleCategories,
  getModuleStats,
  enrollInModule,
  getModuleProgress,
  updateModuleProgress,
  rateModule,
  createModule,
  updateModule,
  deleteModule,
};
