const UserEnrollment = require("../models/UserEnrollment");
const Module = require("../models/Module");
const Content = require("../models/Content");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { validationResult } = require("express-validator");
const { awardEnrollmentXP } = require("../utils/xpUtils");
const { updateAchievementProgress } = require("./achievementController");

/**
 * @desc    Enroll user in a module
 * @route   POST /api/enrollments
 * @access  Private
 */
const enrollUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse("Validation failed", 400, errors.array()));
  }

  const { moduleId } = req.body;
  const userId = req.user.id;

  // Check if module exists
  const module = await Module.findById(moduleId);
  if (!module) {
    return next(new ErrorResponse("Module not found", 404));
  }

  // Check if user is already enrolled
  const existingEnrollment = await UserEnrollment.findByUserAndModule(
    userId,
    moduleId
  );
  if (existingEnrollment) {
    return next(
      new ErrorResponse("User is already enrolled in this module", 400)
    );
  }

  // Get total sections for the module (count content items)
  const contentCount = await Content.countDocuments({ moduleId });

  // Create enrollment
  const enrollment = await UserEnrollment.create({
    userId,
    moduleId,
    totalSections: contentCount,
  });

  // Populate the enrollment with module details
  await enrollment.populate(
    "moduleId",
    "title description difficulty duration"
  );

  // Award XP for enrollment
  const xpResult = await awardEnrollmentXP(userId, module);

  // Update achievement progress
  await updateAchievementProgress(userId, "explorer", 1);
  await updateAchievementProgress(userId, "welcome-aboard", 1);

  res.status(201).json({
    success: true,
    message: "Successfully enrolled in module",
    data: enrollment,
    xpAwarded: xpResult,
  });
});

/**
 * @desc    Get user enrollments
 * @route   GET /api/enrollments
 * @access  Private
 */
const getUserEnrollments = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { status, populate } = req.query;

  const options = {};
  if (status) options.status = status;
  if (populate === "true") options.populate = true;

  const enrollments = await UserEnrollment.getUserEnrollments(userId, options);

  res.status(200).json({
    success: true,
    message: "User enrollments retrieved successfully",
    count: enrollments.length,
    data: enrollments,
  });
});

/**
 * @desc    Get specific enrollment by module
 * @route   GET /api/enrollments/module/:moduleId
 * @access  Private
 */
const getEnrollmentByModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  const userId = req.user.id;

  const enrollment = await UserEnrollment.findByUserAndModule(
    userId,
    moduleId
  ).populate("moduleId", "title description difficulty duration");

  if (!enrollment) {
    return next(new ErrorResponse("Enrollment not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Enrollment retrieved successfully",
    data: enrollment,
  });
});

/**
 * @desc    Update enrollment progress
 * @route   PUT /api/enrollments/:enrollmentId/progress
 * @access  Private
 */
const updateEnrollmentProgress = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse("Validation failed", 400, errors.array()));
  }

  const { enrollmentId } = req.params;
  const { completedSections } = req.body;
  const userId = req.user.id;

  const enrollment = await UserEnrollment.findOne({
    _id: enrollmentId,
    userId,
  });

  if (!enrollment) {
    return next(new ErrorResponse("Enrollment not found", 404));
  }

  // Update progress
  await enrollment.updateProgress(completedSections);

  res.status(200).json({
    success: true,
    message: "Progress updated successfully",
    data: enrollment,
  });
});

/**
 * @desc    Pause enrollment
 * @route   PUT /api/enrollments/:enrollmentId/pause
 * @access  Private
 */
const pauseEnrollment = asyncHandler(async (req, res, next) => {
  const { enrollmentId } = req.params;
  const userId = req.user.id;

  const enrollment = await UserEnrollment.findOne({
    _id: enrollmentId,
    userId,
  });

  if (!enrollment) {
    return next(new ErrorResponse("Enrollment not found", 404));
  }

  await enrollment.pause();

  res.status(200).json({
    success: true,
    message: "Enrollment paused successfully",
    data: enrollment,
  });
});

/**
 * @desc    Resume enrollment
 * @route   PUT /api/enrollments/:enrollmentId/resume
 * @access  Private
 */
const resumeEnrollment = asyncHandler(async (req, res, next) => {
  const { enrollmentId } = req.params;
  const userId = req.user.id;

  const enrollment = await UserEnrollment.findOne({
    _id: enrollmentId,
    userId,
  });

  if (!enrollment) {
    return next(new ErrorResponse("Enrollment not found", 404));
  }

  await enrollment.resume();

  res.status(200).json({
    success: true,
    message: "Enrollment resumed successfully",
    data: enrollment,
  });
});

/**
 * @desc    Complete enrollment
 * @route   PUT /api/enrollments/:enrollmentId/complete
 * @access  Private
 */
const completeEnrollment = asyncHandler(async (req, res, next) => {
  const { enrollmentId } = req.params;
  const userId = req.user.id;

  const enrollment = await UserEnrollment.findOne({
    _id: enrollmentId,
    userId,
  });

  if (!enrollment) {
    return next(new ErrorResponse("Enrollment not found", 404));
  }

  await enrollment.markCompleted();

  res.status(200).json({
    success: true,
    message: "Enrollment completed successfully",
    data: enrollment,
  });
});

/**
 * @desc    Unenroll from module
 * @route   DELETE /api/enrollments/:enrollmentId
 * @access  Private
 */
const unenrollUser = asyncHandler(async (req, res, next) => {
  const { enrollmentId } = req.params;
  const userId = req.user.id;

  const enrollment = await UserEnrollment.findOne({
    _id: enrollmentId,
    userId,
  });

  if (!enrollment) {
    return next(new ErrorResponse("Enrollment not found", 404));
  }

  await UserEnrollment.findByIdAndDelete(enrollmentId);

  res.status(200).json({
    success: true,
    message: "Successfully unenrolled from module",
  });
});

// Admin-only endpoints

/**
 * @desc    Get enrollments for a specific user (Admin only)
 * @route   GET /api/enrollments/user/:userId
 * @access  Private/Admin
 */
const getUserEnrollmentsByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { status, populate, page = 1, limit = 20 } = req.query;

  // Check if user exists (basic validation)
  const User = require("../models/User");
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Build query options
  const options = {};
  if (status) options.status = status;
  if (populate === "true") options.populate = true;

  // Add pagination
  const skip = (page - 1) * limit;
  options.skip = skip;
  options.limit = Number(limit);

  const [enrollments, total] = await Promise.all([
    UserEnrollment.getUserEnrollments(userId, options),
    UserEnrollment.countDocuments({
      userId,
      ...(status && { status }),
    }),
  ]);

  res.status(200).json({
    success: true,
    message: "User enrollments retrieved successfully",
    count: enrollments.length,
    total,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
    data: enrollments,
  });
});

/**
 * @desc    Get current user enrollments (alias endpoint)
 * @route   GET /api/enrollments/user/me
 * @access  Private
 */
const getCurrentUserEnrollments = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { status, populate } = req.query;

  // Build query options
  const options = {};
  if (status) options.status = status;
  if (populate === "true") options.populate = true;

  const [enrollments] = await Promise.all([
    UserEnrollment.getUserEnrollments(userId, options),
  ]);

  res.status(200).json({
    success: true,
    message: "Current user enrollments retrieved successfully",
    data: enrollments,
  });
});

/**
 * @desc    Get all enrollments (Admin only)
 * @route   GET /api/enrollments/admin/all
 * @access  Private/Admin
 */
const getAllEnrollments = asyncHandler(async (req, res, next) => {
  const { status, moduleId, page = 1, limit = 20 } = req.query;

  // Build query
  const query = {};
  if (status) query.status = status;
  if (moduleId) query.moduleId = moduleId;

  // Pagination
  const skip = (page - 1) * limit;

  const [enrollments, total] = await Promise.all([
    UserEnrollment.find(query)
      .populate("userId", "username email")
      .populate("moduleId", "title description difficulty")
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    UserEnrollment.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    message: "All enrollments retrieved successfully",
    count: enrollments.length,
    total,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
    data: enrollments,
  });
});

/**
 * @desc    Get module enrollment statistics (Admin only)
 * @route   GET /api/enrollments/admin/stats/:moduleId
 * @access  Private/Admin
 */
const getModuleEnrollmentStats = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  // Check if module exists
  const module = await Module.findById(moduleId);
  if (!module) {
    return next(new ErrorResponse("Module not found", 404));
  }

  const enrollments = await UserEnrollment.getModuleEnrollments(moduleId);

  const stats = {
    totalEnrollments: enrollments.length,
    activeEnrollments: enrollments.filter((e) => e.status === "active").length,
    completedEnrollments: enrollments.filter((e) => e.status === "completed")
      .length,
    pausedEnrollments: enrollments.filter((e) => e.status === "paused").length,
    droppedEnrollments: enrollments.filter((e) => e.status === "dropped")
      .length,
    averageProgress:
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) /
              enrollments.length
          )
        : 0,
    completionRate:
      enrollments.length > 0
        ? Math.round(
            (enrollments.filter((e) => e.status === "completed").length /
              enrollments.length) *
              100
          )
        : 0,
  };

  res.status(200).json({
    success: true,
    message: "Module enrollment statistics retrieved successfully",
    data: {
      module: {
        id: module.id,
        title: module.title,
      },
      stats,
    },
  });
});

module.exports = {
  enrollUser,
  getUserEnrollments,
  getEnrollmentByModule,
  updateEnrollmentProgress,
  pauseEnrollment,
  resumeEnrollment,
  completeEnrollment,
  unenrollUser,
  getAllEnrollments,
  getModuleEnrollmentStats,
  getUserEnrollmentsByUserId,
  getCurrentUserEnrollments,
};
