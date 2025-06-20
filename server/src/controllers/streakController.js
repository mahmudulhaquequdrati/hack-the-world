const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Get user's current streak status
 * GET /api/streak/status
 */
const getStreakStatus = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const streakStatus = user.getStreakStatus();

  res.status(200).json({
    success: true,
    message: "Streak status retrieved successfully",
    data: streakStatus
  });
});

/**
 * Update user's streak (called when user completes an activity)
 * POST /api/streak/update
 */
const updateStreak = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  await user.updateStreak();
  const updatedStreakStatus = user.getStreakStatus();

  res.status(200).json({
    success: true,
    message: "Streak updated successfully",
    data: updatedStreakStatus
  });
});

/**
 * Get streak statistics for leaderboard
 * GET /api/streak/leaderboard
 */
const getStreakLeaderboard = catchAsync(async (req, res) => {
  const { limit = 10, type = 'current' } = req.query;
  
  const sortField = type === 'longest' ? 'stats.longestStreak' : 'stats.currentStreak';
  
  const users = await User.find(
    { role: 'student' },
    {
      username: 1,
      'profile.displayName': 1,
      'profile.avatar': 1,
      'stats.currentStreak': 1,
      'stats.longestStreak': 1,
      'stats.lastActivityDate': 1
    }
  )
  .sort({ [sortField]: -1 })
  .limit(parseInt(limit));

  const leaderboard = users.map(user => ({
    _id: user._id,
    username: user.username,
    displayName: user.profile.displayName,
    avatar: user.profile.avatar,
    currentStreak: user.stats.currentStreak,
    longestStreak: user.stats.longestStreak,
    lastActivityDate: user.stats.lastActivityDate,
    streakStatus: user.getStreakStatus().streakStatus
  }));

  res.status(200).json({
    success: true,
    message: "Streak leaderboard retrieved successfully",
    data: {
      type,
      leaderboard
    }
  });
});

module.exports = {
  getStreakStatus,
  updateStreak,
  getStreakLeaderboard
};