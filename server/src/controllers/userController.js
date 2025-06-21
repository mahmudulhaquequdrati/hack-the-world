const User = require("../models/User");
const UserEnrollment = require("../models/UserEnrollment");
const UserProgress = require("../models/UserProgress");
const UserAchievement = require("../models/UserAchievement");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

// @desc    Get all users with pagination and filtering
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skipIndex = (page - 1) * limit;

  // Build filter object
  const filter = {};
  
  // Filter by role
  if (req.query.role) {
    filter.role = req.query.role;
  }
  
  // Filter by experience level
  if (req.query.experienceLevel) {
    filter.experienceLevel = req.query.experienceLevel;
  }
  
  // Filter by admin status
  if (req.query.adminStatus) {
    filter.adminStatus = req.query.adminStatus;
  }
  
  // Search by username or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { username: searchRegex },
      { email: searchRegex },
      { 'profile.displayName': searchRegex },
      { 'profile.firstName': searchRegex },
      { 'profile.lastName': searchRegex }
    ];
  }

  // Build sort object
  let sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    const field = parts[0];
    const order = parts[1] === 'desc' ? -1 : 1;
    
    // Map frontend sort fields to database fields
    const sortFieldMap = {
      'name': 'profile.displayName',
      'email': 'email',
      'role': 'role',
      'experienceLevel': 'experienceLevel',
      'totalPoints': 'stats.totalPoints',
      'level': 'stats.level',
      'createdAt': 'createdAt',
      'lastLogin': 'security.lastLogin'
    };
    
    const dbField = sortFieldMap[field] || field;
    sort[dbField] = order;
  } else {
    sort = { createdAt: -1 }; // Default sort by newest first
  }

  try {
    // Get total count for pagination
    const total = await User.countDocuments(filter);
    
    // Get users with pagination
    const users = await User.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skipIndex)
      .select('-password -security.passwordResetToken -security.passwordResetExpires');

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        limit,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage
      },
      filters: {
        role: req.query.role || null,
        experienceLevel: req.query.experienceLevel || null,
        adminStatus: req.query.adminStatus || null,
        search: req.query.search || null
      }
    });
  } catch (error) {
    return next(new ErrorResponse('Error retrieving users', 500));
  }
});

// @desc    Get single user with complete information
// @route   GET /api/users/:id/complete
// @access  Private/Admin
const getUserComplete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse(`Invalid user ID format`, 400));
  }

  try {
    // Get user basic information
    const user = await User.findById(id)
      .select('-password -security.passwordResetToken -security.passwordResetExpires');

    if (!user) {
      return next(new ErrorResponse(`User with ID ${id} not found`, 404));
    }

    // Get user enrollments with populated module and phase data
    const enrollments = await UserEnrollment.find({ userId: id })
      .populate({
        path: 'moduleId',
        select: 'title description difficulty estimatedDuration phaseId',
        populate: {
          path: 'phaseId',
          select: 'title description color icon'
        }
      })
      .sort({ enrolledAt: -1 });

    // Get user progress with populated content data
    const progress = await UserProgress.find({ userId: id })
      .populate({
        path: 'contentId',
        select: 'title type moduleId',
        populate: {
          path: 'moduleId',
          select: 'title phaseId',
          populate: {
            path: 'phaseId',
            select: 'title'
          }
        }
      })
      .sort({ updatedAt: -1 })
      .limit(50); // Limit to recent 50 progress entries

    // Get user achievements
    const achievements = await UserAchievement.find({ userId: id })
      .populate({
        path: 'achievementId',
        select: 'title description icon category pointsAwarded'
      })
      .sort({ earnedAt: -1 });

    // Calculate comprehensive statistics
    const stats = {
      overview: {
        totalEnrollments: enrollments.length,
        activeEnrollments: enrollments.filter(e => e.status === 'active').length,
        completedEnrollments: enrollments.filter(e => e.status === 'completed').length,
        totalProgress: progress.length,
        completedContent: progress.filter(p => p.status === 'completed').length,
        totalAchievements: achievements.filter(a => a.isEarned).length
      },
      progress: {
        byContentType: {
          video: progress.filter(p => p.contentType === 'video').length,
          lab: progress.filter(p => p.contentType === 'lab').length,
          game: progress.filter(p => p.contentType === 'game').length,
          document: progress.filter(p => p.contentType === 'document').length
        },
        byStatus: {
          completed: progress.filter(p => p.status === 'completed').length,
          in_progress: progress.filter(p => p.status === 'in_progress').length,
          not_started: progress.filter(p => p.status === 'not_started').length
        }
      },
      enrollments: {
        byStatus: {
          active: enrollments.filter(e => e.status === 'active').length,
          completed: enrollments.filter(e => e.status === 'completed').length,
          paused: enrollments.filter(e => e.status === 'paused').length,
          dropped: enrollments.filter(e => e.status === 'dropped').length
        }
      },
      achievements: {
        earned: achievements.filter(a => a.isEarned).length,
        inProgress: achievements.filter(a => !a.isEarned && a.progress.current > 0).length,
        totalPointsFromAchievements: achievements
          .filter(a => a.isEarned)
          .reduce((sum, a) => sum + (a.achievementId?.pointsAwarded || 0), 0)
      }
    };

    // Get streak information
    const streakInfo = user.getStreakStatus();

    // Recent activity (last 10 progress updates)
    const recentActivity = progress
      .slice(0, 10)
      .map(p => ({
        _id: p._id,
        contentTitle: p.contentId?.title || 'Unknown Content',
        contentType: p.contentType,
        status: p.status,
        progress: p.progress,
        moduleTitle: p.contentId?.moduleId?.title || 'Unknown Module',
        phaseTitle: p.contentId?.moduleId?.phaseId?.title || 'Unknown Phase',
        updatedAt: p.updatedAt
      }));

    res.status(200).json({
      success: true,
      message: "User complete information retrieved successfully",
      data: {
        user: user.toPublicJSON(),
        enrollments,
        progress,
        achievements,
        stats,
        streakInfo,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error in getUserComplete:', error);
    return next(new ErrorResponse('Error retrieving user information', 500));
  }
});

module.exports = {
  getAllUsers,
  getUserComplete
};