const express = require("express");
const {
  getAllAchievements,
  getAchievementsByCategory,
  getUserAchievements,
  getUserAchievementStats,
  createDefaultAchievements,
} = require("../controllers/achievementController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllAchievements);
router.get("/category/:category", getAchievementsByCategory);
// Protected routes
router.use(protect);
router.get("/user", getUserAchievements);
router.get("/user/stats", getUserAchievementStats);

// Admin routes
router.post("/default", createDefaultAchievements);

module.exports = router;
