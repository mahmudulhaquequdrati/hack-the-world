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
 * @desc    Get enrollments for a specific user (Admin only) with enhanced progress data
 * @route   GET /api/enrollments/user/:userId
 * @access  Private/Admin
 */
const getUserEnrollmentsByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { status, populate, page = 1, limit = 20, enhancedProgress = false } = req.query;

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

  // Get enrollments with enhanced population including phase data
  let enrollmentsQuery = UserEnrollment.find({ userId });
  
  if (status) {
    enrollmentsQuery = enrollmentsQuery.where("status", status);
  }
  
  // Enhanced population to include phase information
  enrollmentsQuery = enrollmentsQuery
    .populate("userId", "username email profile")
    .populate({
      path: "moduleId",
      select: "title description difficulty duration estimatedDuration phaseId",
      populate: {
        path: "phaseId",
        select: "title description color"
      }
    })
    .sort({ lastAccessedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const [enrollments, total] = await Promise.all([
    enrollmentsQuery,
    UserEnrollment.countDocuments({
      userId,
      ...(status && { status }),
    }),
  ]);

  // Enhanced progress data if requested
  let enhancedEnrollments = enrollments;
  if (enhancedProgress === "true") {
    const ProgressSyncService = require("../utils/progressSyncService");
    enhancedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        try {
          const progressStats = await ProgressSyncService.calculateModuleProgress(
            enrollment.userId._id || enrollment.userId,
            enrollment.moduleId._id || enrollment.moduleId
          );
          return {
            ...enrollment.toObject(),
            enhancedProgress: progressStats
          };
        } catch (error) {
          console.error(`Failed to get enhanced progress for enrollment ${enrollment.id}:`, error);
          return enrollment.toObject();
        }
      })
    );
  }

  res.status(200).json({
    success: true,
    message: "User enrollments retrieved successfully",
    count: enhancedEnrollments.length,
    total,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
    data: enhancedEnrollments,
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
      .populate("userId", "username email profile")
      .populate({
        path: "moduleId",
        select: "title description difficulty phaseId",
        populate: {
          path: "phaseId",
          select: "title description color"
        }
      })
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

/**
 * @desc    Get batch module enrollment statistics (Admin only)
 * @route   POST /api/enrollments/admin/stats/batch
 * @access  Private/Admin
 */
const getBatchModuleEnrollmentStats = asyncHandler(async (req, res, next) => {
  const { moduleIds } = req.body;

  // Validate input
  if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
    return next(new ErrorResponse("Module IDs array is required", 400));
  }

  // Validate that all moduleIds are valid MongoDB ObjectIds
  const invalidIds = moduleIds.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));
  if (invalidIds.length > 0) {
    return next(new ErrorResponse(`Invalid module IDs: ${invalidIds.join(', ')}`, 400));
  }

  try {
    // Get all modules in one query
    const modules = await Module.find({ _id: { $in: moduleIds } }).select('_id title');
    const foundModuleIds = modules.map(m => m._id.toString());
    
    // Check for missing modules
    const missingModuleIds = moduleIds.filter(id => !foundModuleIds.includes(id));
    if (missingModuleIds.length > 0) {
      return next(new ErrorResponse(`Modules not found: ${missingModuleIds.join(', ')}`, 404));
    }

    // Get all enrollments for all modules in one aggregation query
    const enrollmentData = await UserEnrollment.aggregate([
      { $match: { moduleId: { $in: moduleIds.map(id => id) } } },
      {
        $group: {
          _id: '$moduleId',
          enrollments: { $push: '$$ROOT' }
        }
      }
    ]);

    // Create a map for quick lookup
    const enrollmentMap = new Map();
    enrollmentData.forEach(item => {
      enrollmentMap.set(item._id.toString(), item.enrollments);
    });

    // Build response data
    const batchStats = {};
    
    modules.forEach(module => {
      const moduleId = module._id.toString();
      const enrollments = enrollmentMap.get(moduleId) || [];
      
      const stats = {
        totalEnrollments: enrollments.length,
        activeEnrollments: enrollments.filter((e) => e.status === "active").length,
        completedEnrollments: enrollments.filter((e) => e.status === "completed").length,
        pausedEnrollments: enrollments.filter((e) => e.status === "paused").length,
        droppedEnrollments: enrollments.filter((e) => e.status === "dropped").length,
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

      batchStats[moduleId] = {
        module: {
          id: module._id,
          title: module.title,
        },
        stats,
      };
    });

    res.status(200).json({
      success: true,
      message: "Batch module enrollment statistics retrieved successfully",
      data: batchStats,
    });
  } catch (error) {
    console.error('Error in getBatchModuleEnrollmentStats:', error);
    return next(new ErrorResponse("Error retrieving batch enrollment statistics", 500));
  }
});

/**
 * @desc    Get all users with enrollment summary (Admin only) - Enhanced with real-time progress
 * @route   GET /api/enrollments/admin/users-summary
 * @access  Private/Admin
 */
const getUsersWithEnrollmentSummary = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, search = "", syncProgress = false } = req.query;

  try {
    // If syncProgress is requested, recalculate progress for recent users first
    if (syncProgress === "true") {
      console.log("Syncing recent user progress...");
      const ProgressSyncService = require("../utils/progressSyncService");
      
      // Get recently active users to sync (last 7 days)
      const recentlyActiveUsers = await UserEnrollment.find({
        lastAccessedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).distinct('userId');
      
      // Sync progress for recent users (async, don't wait)
      recentlyActiveUsers.slice(0, 50).forEach(userId => { // Limit to 50 to avoid overload
        ProgressSyncService.syncUserEnrollments(userId.toString())
          .catch(error => console.error(`Failed to sync user ${userId}:`, error));
      });
    }

    // Build aggregation pipeline
    const pipeline = [
      // Match users with enrollments and optional search
      {
        $lookup: {
          from: "userenrollments",
          localField: "_id",
          foreignField: "userId",
          as: "enrollments"
        }
      },
      {
        $match: {
          enrollments: { $ne: [] }, // Only users with enrollments
          ...(search && {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { "profile.firstName": { $regex: search, $options: "i" } },
              { "profile.lastName": { $regex: search, $options: "i" } }
            ]
          })
        }
      },
      // Add enrollment statistics
      {
        $addFields: {
          enrollmentSummary: {
            total: { $size: "$enrollments" },
            active: {
              $size: {
                $filter: {
                  input: "$enrollments",
                  cond: { $eq: ["$$this.status", "active"] }
                }
              }
            },
            completed: {
              $size: {
                $filter: {
                  input: "$enrollments",
                  cond: { $eq: ["$$this.status", "completed"] }
                }
              }
            },
            paused: {
              $size: {
                $filter: {
                  input: "$enrollments",
                  cond: { $eq: ["$$this.status", "paused"] }
                }
              }
            },
            dropped: {
              $size: {
                $filter: {
                  input: "$enrollments",
                  cond: { $eq: ["$$this.status", "dropped"] }
                }
              }
            },
            averageProgress: {
              $avg: "$enrollments.progressPercentage"
            },
            totalTimeSpent: {
              $sum: "$enrollments.timeSpent"
            },
            lastActivity: {
              $max: "$enrollments.lastAccessedAt"
            }
          }
        }
      },
      // Project only needed fields
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          profile: {
            firstName: 1,
            lastName: 1,
            displayName: 1,
            avatar: 1
          },
          enrollmentSummary: 1,
          // Keep recent enrollments for preview
          recentEnrollments: {
            $slice: [
              {
                $sortArray: {
                  input: "$enrollments",
                  sortBy: { lastAccessedAt: -1 }
                }
              },
              3
            ]
          }
        }
      },
      // Sort by last activity
      {
        $sort: { "enrollmentSummary.lastActivity": -1 }
      }
    ];

    // Add pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: Number(limit) });

    // Execute aggregation
    const User = require("../models/User");
    const [users, totalCount] = await Promise.all([
      User.aggregate(pipeline),
      User.aggregate([
        ...pipeline.slice(0, -2), // Remove skip and limit for count
        { $count: "total" }
      ])
    ]);

    const total = totalCount[0]?.total || 0;

    res.status(200).json({
      success: true,
      message: "Users with enrollment summary retrieved successfully",
      count: users.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: users,
      syncedProgress: syncProgress === "true"
    });
  } catch (error) {
    console.error("Error in getUsersWithEnrollmentSummary:", error);
    return next(new ErrorResponse("Error retrieving users enrollment summary", 500));
  }
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
  getBatchModuleEnrollmentStats,
  getUserEnrollmentsByUserId,
  getCurrentUserEnrollments,
  getUsersWithEnrollmentSummary,
};
