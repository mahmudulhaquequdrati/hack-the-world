const User = require("../models/User");
const { APIError } = require("../middleware/errorHandler");

// Achievement data (from appData.ts ACHIEVEMENTS array)
const ACHIEVEMENTS_DATA = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first module",
    icon: "Lightbulb",
    category: "milestone",
    requirements: ["complete_first_module"],
    points: 50,
    rarity: "common",
  },
  {
    id: "terminal-master",
    title: "Terminal Master",
    description: "Complete all Linux fundamental modules",
    icon: "Terminal",
    category: "skill",
    requirements: ["complete_linux_basics"],
    points: 100,
    rarity: "uncommon",
  },
  {
    id: "web-warrior",
    title: "Web Warrior",
    description: "Find 10 web vulnerabilities",
    icon: "Shield",
    category: "challenge",
    requirements: ["find_10_vulnerabilities"],
    points: 200,
    rarity: "rare",
  },
  {
    id: "network-ninja",
    title: "Network Ninja",
    description: "Complete advanced network modules",
    icon: "Network",
    category: "skill",
    requirements: ["complete_advanced_networking"],
    points: 150,
    rarity: "uncommon",
  },
  {
    id: "penetration-pro",
    title: "Penetration Pro",
    description: "Complete advanced penetration testing",
    icon: "Activity",
    category: "skill",
    requirements: ["complete_penetration_testing"],
    points: 300,
    rarity: "rare",
  },
  {
    id: "forensics-expert",
    title: "Forensics Expert",
    description: "Master digital forensics techniques",
    icon: "Eye",
    category: "skill",
    requirements: ["complete_forensics_modules"],
    points: 250,
    rarity: "rare",
  },
  {
    id: "cloud-guardian",
    title: "Cloud Guardian",
    description: "Complete cloud security specialization",
    icon: "Cloud",
    category: "specialization",
    requirements: ["complete_cloud_security"],
    points: 400,
    rarity: "epic",
  },
  {
    id: "mobile-defender",
    title: "Mobile Defender",
    description: "Master mobile application security",
    icon: "Smartphone",
    category: "specialization",
    requirements: ["complete_mobile_security"],
    points: 350,
    rarity: "epic",
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Complete 5 games in under 3 minutes each",
    icon: "Zap",
    category: "challenge",
    requirements: ["complete_5_games_fast"],
    points: 175,
    rarity: "uncommon",
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Score 100% on 3 different games",
    icon: "Trophy",
    category: "challenge",
    requirements: ["perfect_score_3_games"],
    points: 225,
    rarity: "rare",
  },
];

/**
 * @desc    Get all achievements
 * @route   GET /api/achievements
 * @access  Public
 */
const getAllAchievements = async (req, res, next) => {
  try {
    const { category, rarity } = req.query;

    let filteredAchievements = ACHIEVEMENTS_DATA;

    if (category) {
      filteredAchievements = filteredAchievements.filter(
        (a) => a.category === category
      );
    }

    if (rarity) {
      filteredAchievements = filteredAchievements.filter(
        (a) => a.rarity === rarity
      );
    }

    res.json({
      success: true,
      data: {
        achievements: filteredAchievements,
        count: filteredAchievements.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get achievement categories
 * @route   GET /api/achievements/categories
 * @access  Public
 */
const getAchievementCategories = async (req, res, next) => {
  try {
    const categories = [...new Set(ACHIEVEMENTS_DATA.map((a) => a.category))];

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
 * @desc    Get achievements leaderboard
 * @route   GET /api/achievements/leaderboard
 * @access  Public
 */
const getAchievementsLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    // Get users with their achievement counts and points
    const leaderboard = await User.aggregate([
      {
        $match: {
          status: "active",
          achievements: { $exists: true, $not: { $size: 0 } },
        },
      },
      {
        $addFields: {
          achievementsCount: { $size: "$achievements" },
          achievementPoints: {
            $sum: {
              $map: {
                input: "$achievements",
                as: "achievement",
                in: {
                  $let: {
                    vars: {
                      achievementData: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: ACHIEVEMENTS_DATA,
                              cond: {
                                $eq: [
                                  "$$this.id",
                                  "$$achievement.achievementId",
                                ],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$achievementData.points", 0] },
                  },
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          achievementPoints: -1,
          achievementsCount: -1,
          username: 1,
        },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          username: 1,
          "profile.displayName": 1,
          "profile.avatar": 1,
          achievementsCount: 1,
          achievementPoints: 1,
        },
      },
    ]);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json({
      success: true,
      data: {
        leaderboard: rankedLeaderboard,
        count: rankedLeaderboard.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's earned achievements
 * @route   GET /api/achievements/user/:userId
 * @access  Private
 */
const getUserAchievements = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Enrich user achievements with achievement data
    const enrichedAchievements = user.achievements
      .map((userAchievement) => {
        const achievementData = ACHIEVEMENTS_DATA.find(
          (a) => a.id === userAchievement.achievementId
        );
        return {
          ...achievementData,
          earnedAt: userAchievement.earnedAt,
          progress: userAchievement.progress || 100,
        };
      })
      .filter(Boolean); // Remove any achievements that don't have data

    // Calculate achievement statistics
    const totalPossible = ACHIEVEMENTS_DATA.length;
    const totalEarned = enrichedAchievements.length;
    const totalPoints = enrichedAchievements.reduce(
      (sum, achievement) => sum + (achievement.points || 0),
      0
    );

    const categoryStats = {};
    ACHIEVEMENTS_DATA.forEach((achievement) => {
      if (!categoryStats[achievement.category]) {
        categoryStats[achievement.category] = { total: 0, earned: 0 };
      }
      categoryStats[achievement.category].total++;
    });

    enrichedAchievements.forEach((achievement) => {
      if (categoryStats[achievement.category]) {
        categoryStats[achievement.category].earned++;
      }
    });

    res.json({
      success: true,
      data: {
        achievements: enrichedAchievements,
        statistics: {
          totalEarned,
          totalPossible,
          completionPercentage: Math.round((totalEarned / totalPossible) * 100),
          totalPoints,
          categoryStats,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get achievement by ID
 * @route   GET /api/achievements/:id
 * @access  Public
 */
const getAchievementById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const achievement = ACHIEVEMENTS_DATA.find((a) => a.id === id);

    if (!achievement) {
      throw new APIError("Achievement not found", 404);
    }

    res.json({
      success: true,
      data: {
        achievement,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Award achievement to user
 * @route   POST /api/achievements/:id/award
 * @access  Private (Admin)
 */
const awardAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const achievement = ACHIEVEMENTS_DATA.find((a) => a.id === id);
    if (!achievement) {
      throw new APIError("Achievement not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Check if user already has this achievement
    const existingAchievement = user.achievements.find(
      (a) => a.achievementId === id
    );

    if (existingAchievement) {
      throw new APIError("User already has this achievement", 400);
    }

    // Award the achievement
    user.achievements.push({
      achievementId: id,
      earnedAt: new Date(),
      progress: 100,
    });

    // Award points
    if (achievement.points) {
      await user.addExperience(achievement.points);
    }

    await user.save();

    res.json({
      success: true,
      message: "Achievement awarded successfully",
      data: {
        achievement,
        earnedAt: new Date(),
        pointsAwarded: achievement.points || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check and award achievements based on user progress
 * @route   POST /api/achievements/check/:userId
 * @access  Private
 */
const checkUserAchievements = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("enrollments");
    if (!user) {
      throw new APIError("User not found", 404);
    }

    const newAchievements = [];
    const currentAchievementIds = user.achievements.map((a) => a.achievementId);

    // Check each achievement against user's progress
    for (const achievement of ACHIEVEMENTS_DATA) {
      // Skip if already earned
      if (currentAchievementIds.includes(achievement.id)) {
        continue;
      }

      let eligible = false;

      // Check achievement requirements based on type
      switch (achievement.id) {
        case "first-steps":
          eligible = user.progress.completedModules.length >= 1;
          break;
        case "terminal-master":
          // Check if completed Linux basics modules
          eligible = user.progress.completedModules.some(
            (moduleId) =>
              moduleId.toString().includes("linux") ||
              moduleId.toString().includes("terminal")
          );
          break;
        case "web-warrior":
          // Check lab completions for web security
          eligible =
            user.labHistory.filter(
              (lab) =>
                lab.status === "completed" && lab.category === "web-security"
            ).length >= 5;
          break;
        case "speed-demon":
          // Check for fast game completions
          const fastGames = user.gameHistory.filter(
            (game) => game.status === "completed" && game.timeSpent < 180 // 3 minutes
          );
          eligible = fastGames.length >= 5;
          break;
        case "perfectionist":
          // Check for perfect scores
          const perfectGames = user.gameHistory.filter(
            (game) => game.status === "completed" && game.score >= 100
          );
          eligible = perfectGames.length >= 3;
          break;
        // Add more achievement checks as needed
      }

      if (eligible) {
        // Award the achievement
        user.achievements.push({
          achievementId: achievement.id,
          earnedAt: new Date(),
          progress: 100,
        });

        // Award points
        if (achievement.points) {
          await user.addExperience(achievement.points);
        }

        newAchievements.push(achievement);
      }
    }

    if (newAchievements.length > 0) {
      await user.save();
    }

    res.json({
      success: true,
      data: {
        newAchievements,
        totalNewAchievements: newAchievements.length,
        totalPointsAwarded: newAchievements.reduce(
          (sum, a) => sum + (a.points || 0),
          0
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get achievement progress for user
 * @route   GET /api/achievements/progress/:userId
 * @access  Private
 */
const getAchievementProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    const currentAchievementIds = user.achievements.map((a) => a.achievementId);
    const progressData = [];

    // Calculate progress for each achievement
    for (const achievement of ACHIEVEMENTS_DATA) {
      if (currentAchievementIds.includes(achievement.id)) {
        // Already earned
        progressData.push({
          ...achievement,
          progress: 100,
          earned: true,
          earnedAt: user.achievements.find(
            (a) => a.achievementId === achievement.id
          ).earnedAt,
        });
      } else {
        // Calculate current progress
        let progress = 0;

        switch (achievement.id) {
          case "first-steps":
            progress = Math.min(
              100,
              (user.progress.completedModules.length / 1) * 100
            );
            break;
          case "web-warrior":
            const webVulns = user.labHistory.filter(
              (lab) =>
                lab.status === "completed" && lab.category === "web-security"
            ).length;
            progress = Math.min(100, (webVulns / 10) * 100);
            break;
          case "speed-demon":
            const fastGames = user.gameHistory.filter(
              (game) => game.status === "completed" && game.timeSpent < 180
            ).length;
            progress = Math.min(100, (fastGames / 5) * 100);
            break;
          case "perfectionist":
            const perfectGames = user.gameHistory.filter(
              (game) => game.status === "completed" && game.score >= 100
            ).length;
            progress = Math.min(100, (perfectGames / 3) * 100);
            break;
          // Add more progress calculations as needed
        }

        progressData.push({
          ...achievement,
          progress: Math.round(progress),
          earned: false,
          earnedAt: null,
        });
      }
    }

    res.json({
      success: true,
      data: {
        achievements: progressData,
        summary: {
          totalEarned: currentAchievementIds.length,
          totalAvailable: ACHIEVEMENTS_DATA.length,
          completionPercentage: Math.round(
            (currentAchievementIds.length / ACHIEVEMENTS_DATA.length) * 100
          ),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAchievements,
  getAchievementCategories,
  getAchievementsLeaderboard,
  getUserAchievements,
  getAchievementById,
  awardAchievement,
  checkUserAchievements,
  getAchievementProgress,
};
