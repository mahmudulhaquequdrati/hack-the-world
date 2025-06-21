const express = require("express");
const {
  getAllUsers,
  getUserComplete
} = require("../controllers/userController");

const { protect, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         username:
 *           type: string
 *           description: Unique username
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         profile:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             displayName:
 *               type: string
 *             avatar:
 *               type: string
 *             bio:
 *               type: string
 *             location:
 *               type: string
 *             website:
 *               type: string
 *         experienceLevel:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *         role:
 *           type: string
 *           enum: [student, admin]
 *         adminStatus:
 *           type: string
 *           enum: [pending, active, suspended]
 *         stats:
 *           type: object
 *           properties:
 *             totalPoints:
 *               type: number
 *             level:
 *               type: number
 *             coursesCompleted:
 *               type: number
 *             labsCompleted:
 *               type: number
 *             gamesCompleted:
 *               type: number
 *             achievementsEarned:
 *               type: number
 *             currentStreak:
 *               type: number
 *             longestStreak:
 *               type: number
 * 
 *     UserComplete:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             enrollments:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserEnrollment'
 *             progress:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProgress'
 *             achievements:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserAchievement'
 *             stats:
 *               type: object
 *               description: Comprehensive user statistics
 *             streakInfo:
 *               type: object
 *               description: Current streak information
 *             recentActivity:
 *               type: array
 *               description: Recent learning activity
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination and filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of users per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, admin]
 *         description: Filter by user role
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *         description: Filter by experience level
 *       - in: query
 *         name: adminStatus
 *         schema:
 *           type: string
 *           enum: [pending, active, suspended]
 *         description: Filter by admin status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by username, email, or display name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name:asc, name:desc, email:asc, email:desc, role:asc, role:desc, experienceLevel:asc, experienceLevel:desc, totalPoints:asc, totalPoints:desc, level:asc, level:desc, createdAt:asc, createdAt:desc, lastLogin:asc, lastLogin:desc]
 *         description: Sort users by field and direction
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current:
 *                       type: number
 *                     pages:
 *                       type: number
 *                     total:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *                 filters:
 *                   type: object
 *                   description: Applied filters
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/", protect, requireAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/{id}/complete:
 *   get:
 *     summary: Get complete user information including enrollments, progress, and achievements
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: User complete information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User complete information retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     enrollments:
 *                       type: array
 *                       description: User enrollments with populated module/phase data
 *                     progress:
 *                       type: array
 *                       description: User progress with populated content data (last 50 entries)
 *                     achievements:
 *                       type: array
 *                       description: User achievements with populated achievement data
 *                     stats:
 *                       type: object
 *                       description: Comprehensive statistics about user activity
 *                       properties:
 *                         overview:
 *                           type: object
 *                           description: High-level overview statistics
 *                         progress:
 *                           type: object
 *                           description: Content progress breakdown
 *                         enrollments:
 *                           type: object
 *                           description: Enrollment status breakdown
 *                         achievements:
 *                           type: object
 *                           description: Achievement statistics
 *                     streakInfo:
 *                       type: object
 *                       description: Current learning streak information
 *                       properties:
 *                         currentStreak:
 *                           type: number
 *                         longestStreak:
 *                           type: number
 *                         streakStatus:
 *                           type: string
 *                           enum: [start, active, at_risk, broken]
 *                         daysSinceLastActivity:
 *                           type: number
 *                     recentActivity:
 *                       type: array
 *                       description: Recent 10 learning activities
 *       400:
 *         description: Bad request - Invalid user ID format
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:id/complete", protect, requireAdmin, getUserComplete);

module.exports = router;