const User = require("../models/User");
const { checkAchievements } = require("../controllers/achievementController");

/**
 * XP Rewards Configuration
 */
const XP_REWARDS = {
  // Content completion
  VIDEO_COMPLETE: 10,
  LAB_COMPLETE: 25,
  GAME_COMPLETE: 20,
  DOCUMENT_READ: 5,
  
  // Module milestones
  MODULE_ENROLL: 5,
  MODULE_COMPLETE: 100,
  MODULE_PERFECT: 150, // 100% completion
  
  // General actions
  PROFILE_COMPLETE: 15,
  FIRST_LOGIN: 10,
  DAILY_LOGIN: 5,
  
  // Special achievements
  STREAK_3_DAYS: 50,
  STREAK_7_DAYS: 100,
  PERFECT_SCORE: 75,
};

/**
 * Award XP to a user
 * @param {string} userId - User ID
 * @param {number} amount - XP amount to award
 * @param {string} reason - Reason for XP award
 * @returns {Promise<Object>} Updated user stats
 */
async function awardXP(userId, amount, reason = "General activity") {
  try {
    // Update user's total points
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { "stats.totalPoints": amount },
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Calculate new level (500 XP per level)
    const newLevel = Math.floor(user.stats.totalPoints / 500) + 1;
    
    // Update level if changed
    if (newLevel !== user.stats.level) {
      user.stats.level = newLevel;
      await user.save();
    }

    // Check for new achievements
    await checkAchievements(userId);

    console.log(`✨ Awarded ${amount} XP to user ${userId} for: ${reason}`);

    return {
      xpAwarded: amount,
      totalXP: user.stats.totalPoints,
      currentLevel: newLevel,
      nextLevelXP: newLevel * 500,
      xpToNextLevel: Math.max(0, (newLevel * 500) - user.stats.totalPoints),
      reason,
    };
  } catch (error) {
    console.error("Error awarding XP:", error);
    return null;
  }
}

/**
 * Award XP for content completion
 * @param {string} userId - User ID
 * @param {string} contentType - Type of content (video, lab, game, document)
 * @param {Object} metadata - Additional metadata (difficulty, duration, etc.)
 * @returns {Promise<Object>} XP award result
 */
async function awardContentXP(userId, contentType, metadata = {}) {
  let baseXP = 0;
  let reason = "";

  switch (contentType.toLowerCase()) {
    case "video":
    case "videos":
      baseXP = XP_REWARDS.VIDEO_COMPLETE;
      reason = "Video completed";
      break;
    case "lab":
    case "labs":
      baseXP = XP_REWARDS.LAB_COMPLETE;
      reason = "Lab completed";
      break;
    case "game":
    case "games":
      baseXP = XP_REWARDS.GAME_COMPLETE;
      reason = "Game completed";
      break;
    case "document":
    case "documents":
      baseXP = XP_REWARDS.DOCUMENT_READ;
      reason = "Document read";
      break;
    default:
      baseXP = 5; // Default XP for unknown content types
      reason = "Content completed";
  }

  // Apply difficulty multiplier
  if (metadata.difficulty) {
    switch (metadata.difficulty.toLowerCase()) {
      case "intermediate":
        baseXP *= 1.2;
        break;
      case "advanced":
        baseXP *= 1.5;
        break;
      case "expert":
        baseXP *= 2.0;
        break;
    }
  }

  // Apply duration bonus for longer content
  if (metadata.duration && metadata.duration > 30) {
    baseXP *= 1.1; // 10% bonus for content over 30 minutes
  }

  const finalXP = Math.round(baseXP);
  return awardXP(userId, finalXP, reason);
}

/**
 * Award XP for module completion
 * @param {string} userId - User ID
 * @param {Object} moduleData - Module information
 * @param {number} completionPercentage - Completion percentage (0-100)
 * @returns {Promise<Object>} XP award result
 */
async function awardModuleXP(userId, moduleData, completionPercentage = 100) {
  let baseXP = XP_REWARDS.MODULE_COMPLETE;
  let reason = "Module completed";

  // Perfect completion bonus
  if (completionPercentage >= 100) {
    baseXP = XP_REWARDS.MODULE_PERFECT;
    reason = "Module completed perfectly";
  }

  // Apply difficulty multiplier
  if (moduleData.difficulty) {
    switch (moduleData.difficulty.toLowerCase()) {
      case "intermediate":
        baseXP *= 1.3;
        break;
      case "advanced":
        baseXP *= 1.6;
        break;
      case "expert":
        baseXP *= 2.2;
        break;
    }
  }

  const finalXP = Math.round(baseXP);
  return awardXP(userId, finalXP, reason);
}

/**
 * Award XP for enrollment
 * @param {string} userId - User ID
 * @param {Object} moduleData - Module information
 * @returns {Promise<Object>} XP award result
 */
async function awardEnrollmentXP(userId, moduleData) {
  const xp = XP_REWARDS.MODULE_ENROLL;
  return awardXP(userId, xp, `Enrolled in ${moduleData.title}`);
}

/**
 * Get user's XP statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} XP statistics
 */
async function getUserXPStats(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const totalXP = user.stats.totalPoints;
    const currentLevel = user.stats.level;
    const nextLevelXP = currentLevel * 500;
    const xpToNextLevel = Math.max(0, nextLevelXP - totalXP);
    const progressToNext = Math.min(100, ((totalXP % 500) / 500) * 100);

    return {
      totalXP,
      currentLevel,
      nextLevelXP,
      xpToNextLevel,
      progressToNext: Math.round(progressToNext),
      xpThisLevel: totalXP % 500,
    };
  } catch (error) {
    console.error("Error getting XP stats:", error);
    return null;
  }
}

/**
 * Calculate XP breakdown for a module
 * @param {Object} moduleData - Module with content information
 * @returns {Object} XP breakdown
 */
function calculateModuleXPBreakdown(moduleData) {
  const breakdown = {
    enrollment: XP_REWARDS.MODULE_ENROLL,
    videos: (moduleData.content?.videos?.length || 0) * XP_REWARDS.VIDEO_COMPLETE,
    labs: (moduleData.content?.labs?.length || 0) * XP_REWARDS.LAB_COMPLETE,
    games: (moduleData.content?.games?.length || 0) * XP_REWARDS.GAME_COMPLETE,
    documents: (moduleData.content?.documents?.length || 0) * XP_REWARDS.DOCUMENT_READ,
    completion: XP_REWARDS.MODULE_COMPLETE,
  };

  breakdown.total = Object.values(breakdown).reduce((sum, xp) => sum + xp, 0);

  return breakdown;
}

module.exports = {
  XP_REWARDS,
  awardXP,
  awardContentXP,
  awardModuleXP,
  awardEnrollmentXP,
  getUserXPStats,
  calculateModuleXPBreakdown,
};