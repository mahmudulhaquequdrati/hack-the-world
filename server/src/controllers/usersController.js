const { validationResult } = require("express-validator");
const User = require("../models/User");
const { APIError } = require("../middleware/errorHandler");

/**
 * @desc    Get user leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const topUsers = await User.getLeaderboard(parseInt(limit));

    res.json({
      success: true,
      data: {
        leaderboard: topUsers.map((user) => ({
          id: user._id,
          username: user.username,
          displayName: user.profile.displayName,
          avatar: user.profile.avatar,
          totalPoints: user.stats.totalPoints,
          level: user.stats.level,
          rank: user.stats.rank,
          coursesCompleted: user.stats.coursesCompleted,
        })),
        count: topUsers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "profile.displayName": { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .select(
        "-password -security.emailVerificationToken -security.passwordResetToken"
      )
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users: users.map((user) => user.toPublicJSON()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select(
        "-password -security.emailVerificationToken -security.passwordResetToken"
      )
      .populate("enrollments")
      .populate("achievements");

    if (!user) {
      throw new APIError("User not found", 404);
    }

    res.json({
      success: true,
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
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

    const user = await User.findById(id);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Update profile fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        user.profile[key] = updateData[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user learning preferences
 * @route   PUT /api/users/:id/preferences
 * @access  Private
 */
const updatePreferences = async (req, res, next) => {
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
    const { preferredDifficulty, notifications, theme, language } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Update preferences
    if (preferredDifficulty !== undefined) {
      user.preferences.learningSettings.preferredDifficulty =
        preferredDifficulty;
    }
    if (notifications !== undefined) {
      Object.assign(user.preferences.notifications, notifications);
    }
    if (theme !== undefined) {
      user.preferences.display.theme = theme;
    }
    if (language !== undefined) {
      user.preferences.display.language = language;
    }

    await user.save();

    res.json({
      success: true,
      message: "Preferences updated successfully",
      data: {
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user progress summary
 * @route   GET /api/users/:id/progress
 * @access  Private
 */
const getUserProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("enrollments");

    if (!user) {
      throw new APIError("User not found", 404);
    }

    const progressSummary = await user.calculateProgressSummary();

    res.json({
      success: true,
      data: {
        progress: progressSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user achievements
 * @route   GET /api/users/:id/achievements
 * @access  Private
 */
const getUserAchievements = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("achievements");

    if (!user) {
      throw new APIError("User not found", 404);
    }

    res.json({
      success: true,
      data: {
        achievements: user.achievements,
        stats: {
          total: user.achievements.length,
          unlockedThisMonth: user.achievements.filter(
            (achievement) =>
              new Date(achievement.unlockedAt) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/:id
 * @access  Private (Admin or Self)
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Soft delete - mark as inactive instead of removing
    user.status = "inactive";
    user.deletedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role (admin only)
 * @route   PUT /api/users/:id/role
 * @access  Private (Admin)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "moderator"].includes(role)) {
      throw new APIError("Invalid role specified", 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully",
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user activity history
 * @route   GET /api/users/:id/activity
 * @access  Private
 */
const getUserActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 20 } = req.query;

    const user = await User.findById(id);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Get recent activity from user's activity log
    const activities = user.activity.sessionHistory
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        activities,
        lastActiveAt: user.activity.lastActiveAt,
        totalSessions: user.activity.sessionHistory.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard,
  getAllUsers,
  getUserById,
  updateProfile,
  updatePreferences,
  getUserProgress,
  getUserAchievements,
  deleteUser,
  updateUserRole,
  getUserActivity,
};
