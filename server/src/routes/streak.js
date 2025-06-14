const express = require("express");
const { 
  getStreakStatus, 
  updateStreak, 
  getStreakLeaderboard 
} = require("../controllers/streakController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /api/streak/status:
 *   get:
 *     summary: Get user's current streak status
 *     tags: [Streak]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentStreak:
 *                       type: number
 *                     longestStreak:
 *                       type: number
 *                     streakStatus:
 *                       type: string
 *                       enum: [start, active, at_risk, broken]
 *                     daysSinceLastActivity:
 *                       type: number
 *                     lastActivityDate:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/status", getStreakStatus);

/**
 * @swagger
 * /api/streak/update:
 *   post:
 *     summary: Update user's streak after completing an activity
 *     tags: [Streak]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentStreak:
 *                       type: number
 *                     longestStreak:
 *                       type: number
 *                     streakStatus:
 *                       type: string
 *                       enum: [start, active, at_risk, broken]
 *                     daysSinceLastActivity:
 *                       type: number
 *                     lastActivityDate:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post("/update", updateStreak);

/**
 * @swagger
 * /api/streak/leaderboard:
 *   get:
 *     summary: Get streak leaderboard
 *     tags: [Streak]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users to return
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [current, longest]
 *           default: current
 *         description: Type of streak to rank by
 *     responses:
 *       200:
 *         description: Streak leaderboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     leaderboard:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           displayName:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           currentStreak:
 *                             type: number
 *                           longestStreak:
 *                             type: number
 *                           lastActivityDate:
 *                             type: string
 *                             format: date-time
 *                           streakStatus:
 *                             type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/leaderboard", getStreakLeaderboard);

module.exports = router;