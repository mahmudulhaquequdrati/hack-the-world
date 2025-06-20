const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");
const User = require("../models/User");
const UserEnrollment = require("../models/UserEnrollment");
const UserProgress = require("../models/UserProgress");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Get all available achievements
 */
exports.getAllAchievements = catchAsync(async (req, res, next) => {
  const achievements = await Achievement.findActive();

  res.status(200).json({
    success: true,
    data: achievements,
    total: achievements.length,
  });
});

/**
 * Get achievements by category
 */
exports.getAchievementsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  
  const validCategories = ["module", "lab", "game", "xp", "general"];
  if (!validCategories.includes(category)) {
    return next(new AppError("Invalid achievement category", 400));
  }

  const achievements = await Achievement.findByCategory(category);

  res.status(200).json({
    success: true,
    data: achievements,
    category,
    total: achievements.length,
  });
});

/**
 * Get user's achievement progress
 */
exports.getUserAchievements = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { completed } = req.query;

  const options = {
    populate: true,
  };

  if (completed !== undefined) {
    options.completed = completed === 'true';
  }

  const userAchievements = await UserAchievement.findUserAchievements(userId, options);

  // Get all achievements to show unstarted ones
  const allAchievements = await Achievement.findActive();
  const userAchievementMap = new Map(
    userAchievements.map(ua => [ua.achievementId._id.toString(), ua])
  );

  // Combine with user progress
  const achievementsWithProgress = allAchievements.map(achievement => {
    const userProgress = userAchievementMap.get(achievement._id.toString());
    
    return {
      ...achievement.toObject(),
      userProgress: userProgress ? {
        progress: userProgress.progress.current,
        target: userProgress.progress.target,
        progressPercentage: userProgress.progressPercentage,
        isCompleted: userProgress.isCompleted,
        completedAt: userProgress.completedAt,
        earnedRewards: userProgress.earnedRewards,
      } : {
        progress: 0,
        target: achievement.requirements.target || 1,
        progressPercentage: 0,
        isCompleted: false,
        completedAt: null,
        earnedRewards: { xp: 0 },
      },
    };
  });

  // Calculate stats
  const completedCount = userAchievements.filter(ua => ua.isCompleted).length;
  const totalXP = userAchievements
    .filter(ua => ua.isCompleted)
    .reduce((sum, ua) => sum + ua.earnedRewards.xp, 0);

  res.status(200).json({
    success: true,
    data: achievementsWithProgress,
    stats: {
      total: allAchievements.length,
      completed: completedCount,
      percentage: Math.round((completedCount / allAchievements.length) * 100),
      totalXP,
    },
  });
});

/**
 * Get user's achievement statistics
 */
exports.getUserAchievementStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const [
    completedAchievements,
    totalAchievements,
    user,
    enrollmentCount,
    progressCount,
  ] = await Promise.all([
    UserAchievement.countDocuments({ userId, isCompleted: true }),
    Achievement.countDocuments({ isActive: true }),
    User.findById(userId),
    UserEnrollment.countDocuments({ userId, isActive: true }),
    UserProgress.countDocuments({ userId, completed: true }),
  ]);

  const totalXP = await UserAchievement.aggregate([
    { $match: { userId: user._id, isCompleted: true } },
    { $group: { _id: null, totalXP: { $sum: "$earnedRewards.xp" } } },
  ]);

  const earnedXP = totalXP.length > 0 ? totalXP[0].totalXP : 0;
  const level = Math.floor(earnedXP / 500) + 1;
  const nextLevelXP = level * 500;
  const xpToNext = Math.max(0, nextLevelXP - earnedXP);

  res.status(200).json({
    success: true,
    data: {
      achievements: {
        total: totalAchievements,
        completed: completedAchievements,
        percentage: Math.round((completedAchievements / totalAchievements) * 100),
      },
      xp: {
        current: earnedXP,
        level,
        nextLevelXP,
        xpToNext,
      },
      progress: {
        enrollments: enrollmentCount,
        completedContent: progressCount,
        modulesCompleted: user.stats.coursesCompleted,
        labsCompleted: user.stats.labsCompleted,
        gamesCompleted: user.stats.gamesCompleted,
      },
    },
  });
});

/**
 * Update achievement progress (internal function)
 */
exports.updateAchievementProgress = async (userId, achievementSlug, increment = 1) => {
  try {
    const userAchievement = await UserAchievement.updateProgress(userId, achievementSlug, increment);
    return userAchievement;
  } catch (error) {
    console.error(`Error updating achievement progress for ${achievementSlug}:`, error);
    return null;
  }
};

/**
 * Check and update multiple achievements based on user stats
 */
exports.checkAchievements = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const [enrollmentCount, progressCount] = await Promise.all([
      UserEnrollment.countDocuments({ userId, isActive: true }),
      UserProgress.countDocuments({ userId, completed: true }),
    ]);

    const modulesCompleted = user.stats.coursesCompleted;
    const totalXP = user.stats.totalPoints;

    // Define achievement checks
    const checks = [
      // Module achievements
      { slug: "first-steps", current: modulesCompleted, target: 1 },
      { slug: "learning-streak", current: modulesCompleted, target: 3 },
      { slug: "knowledge-seeker", current: modulesCompleted, target: 5 },
      { slug: "module-master", current: modulesCompleted, target: 10 },
      
      // XP achievements
      { slug: "xp-collector", current: totalXP, target: 100 },
      { slug: "xp-hunter", current: totalXP, target: 500 },
      { slug: "xp-legend", current: totalXP, target: 1000 },
      
      // General achievements
      { slug: "explorer", current: enrollmentCount, target: 1 },
    ];

    // Update achievements
    for (const check of checks) {
      if (check.current >= check.target) {
        await exports.updateAchievementProgress(userId, check.slug, check.target);
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
};

/**
 * Create default achievements (admin only)
 */
exports.createDefaultAchievements = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admins can create default achievements', 403));
  }

  const defaultAchievements = [
    // Module achievements
    {
      slug: "first-steps",
      title: "First Steps",
      description: "Complete your first module",
      category: "module",
      requirements: {
        type: "count",
        target: 1,
        resource: "modules_completed",
      },
      rewards: { xp: 50 },
      icon: "BookOpen",
      difficulty: "easy",
      order: 1,
    },
    {
      slug: "learning-streak",
      title: "Learning Streak",
      description: "Complete 3 modules",
      category: "module",
      requirements: {
        type: "count",
        target: 3,
        resource: "modules_completed",
      },
      rewards: { xp: 150 },
      icon: "Award",
      difficulty: "medium",
      order: 2,
    },
    {
      slug: "knowledge-seeker",
      title: "Knowledge Seeker",
      description: "Complete 5 modules",
      category: "module",
      requirements: {
        type: "count",
        target: 5,
        resource: "modules_completed",
      },
      rewards: { xp: 300 },
      icon: "Star",
      difficulty: "medium",
      order: 3,
    },
    {
      slug: "module-master",
      title: "Module Master",
      description: "Complete 10 modules",
      category: "module",
      requirements: {
        type: "count",
        target: 10,
        resource: "modules_completed",
      },
      rewards: { xp: 500 },
      icon: "Trophy",
      difficulty: "hard",
      order: 4,
    },

    // Lab achievements
    {
      slug: "lab-rookie",
      title: "Lab Rookie",
      description: "Access your first lab",
      category: "lab",
      requirements: {
        type: "count",
        target: 1,
        resource: "labs_completed",
      },
      rewards: { xp: 25 },
      icon: "Target",
      difficulty: "easy",
      order: 1,
    },
    {
      slug: "hands-on-learner",
      title: "Hands-On Learner",
      description: "Access 5 labs",
      category: "lab",
      requirements: {
        type: "count",
        target: 5,
        resource: "labs_completed",
      },
      rewards: { xp: 100 },
      icon: "Zap",
      difficulty: "medium",
      order: 2,
    },
    {
      slug: "lab-expert",
      title: "Lab Expert",
      description: "Access 15 labs",
      category: "lab",
      requirements: {
        type: "count",
        target: 15,
        resource: "labs_completed",
      },
      rewards: { xp: 250 },
      icon: "Award",
      difficulty: "hard",
      order: 3,
    },

    // Game achievements
    {
      slug: "game-on",
      title: "Game On",
      description: "Play your first game",
      category: "game",
      requirements: {
        type: "count",
        target: 1,
        resource: "games_completed",
      },
      rewards: { xp: 25 },
      icon: "Gamepad2",
      difficulty: "easy",
      order: 1,
    },
    {
      slug: "gaming-enthusiast",
      title: "Gaming Enthusiast",
      description: "Play 5 games",
      category: "game",
      requirements: {
        type: "count",
        target: 5,
        resource: "games_completed",
      },
      rewards: { xp: 100 },
      icon: "Star",
      difficulty: "medium",
      order: 2,
    },
    {
      slug: "game-master",
      title: "Game Master",
      description: "Play 10 games",
      category: "game",
      requirements: {
        type: "count",
        target: 10,
        resource: "games_completed",
      },
      rewards: { xp: 200 },
      icon: "Trophy",
      difficulty: "hard",
      order: 3,
    },

    // XP achievements
    {
      slug: "xp-collector",
      title: "XP Collector",
      description: "Earn 100 XP",
      category: "xp",
      requirements: {
        type: "count",
        target: 100,
        resource: "xp_earned",
      },
      rewards: { xp: 50 },
      icon: "Star",
      difficulty: "easy",
      order: 1,
    },
    {
      slug: "xp-hunter",
      title: "XP Hunter",
      description: "Earn 500 XP",
      category: "xp",
      requirements: {
        type: "count",
        target: 500,
        resource: "xp_earned",
      },
      rewards: { xp: 100 },
      icon: "Award",
      difficulty: "medium",
      order: 2,
    },
    {
      slug: "xp-legend",
      title: "XP Legend",
      description: "Earn 1000 XP",
      category: "xp",
      requirements: {
        type: "count",
        target: 1000,
        resource: "xp_earned",
      },
      rewards: { xp: 200 },
      icon: "Trophy",
      difficulty: "hard",
      order: 3,
    },

    // General achievements
    {
      slug: "welcome-aboard",
      title: "Welcome Aboard",
      description: "Join the platform",
      category: "general",
      requirements: {
        type: "action",
        target: 1,
        resource: "account_created",
      },
      rewards: { xp: 10 },
      icon: "Users",
      difficulty: "easy",
      order: 1,
    },
    {
      slug: "explorer",
      title: "Explorer",
      description: "Enroll in your first course",
      category: "general",
      requirements: {
        type: "count",
        target: 1,
        resource: "enrollments_created",
      },
      rewards: { xp: 25 },
      icon: "BookOpen",
      difficulty: "easy",
      order: 2,
    },
  ];

  // Create achievements
  const createdAchievements = [];
  for (const achievementData of defaultAchievements) {
    const existing = await Achievement.findBySlug(achievementData.slug);
    if (!existing) {
      const achievement = await Achievement.create(achievementData);
      createdAchievements.push(achievement);
    }
  }

  res.status(201).json({
    success: true,
    message: `Created ${createdAchievements.length} default achievements`,
    data: createdAchievements,
  });
});