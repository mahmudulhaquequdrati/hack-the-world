const express = require("express");
const {
  getUserProgress,
  getUserModuleProgress,
  updateProgress,
  markContentCompleted,
  getModuleProgressStats,
} = require("../controllers/progressController");
const { protect } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProgress:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Progress record ID
 *         userId:
 *           type: string
 *           description: User ID
 *         contentId:
 *           type: string
 *           description: Content ID
 *         contentType:
 *           type: string
 *           enum: [video, lab, game, document]
 *           description: Type of content
 *         status:
 *           type: string
 *           enum: [not-started, in-progress, completed]
 *           description: Progress status
 *         progressPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Progress percentage (0-100)
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: When user started this content
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: When user completed this content
 *         timeSpent:
 *           type: number
 *           description: Total time spent in minutes
 *         score:
 *           type: number
 *           description: Score achieved (optional)
 *         maxScore:
 *           type: number
 *           description: Maximum score possible (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /progress/{userId}:
 *   get:
 *     summary: Get user's overall progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *           enum: [video, lab, game, document]
 *         description: Filter by content type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [not-started, in-progress, completed]
 *         description: Filter by progress status
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Filter by module ID
 *     responses:
 *       200:
 *         description: User progress retrieved successfully
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
 *                     progress:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserProgress'
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         completed:
 *                           type: number
 *                         inProgress:
 *                           type: number
 *                         notStarted:
 *                           type: number
 *                         averageProgress:
 *                           type: number
 *                         totalTimeSpent:
 *                           type: number
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to access this progress
 *       404:
 *         description: User not found
 */
router.get("/:userId", protect, getUserProgress);

/**
 * @swagger
 * /progress/{userId}/{moduleId}:
 *   get:
 *     summary: Get module-specific progress for a user
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module progress retrieved successfully
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
 *                     module:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                     enrollment:
 *                       type: object
 *                       description: User's enrollment in this module
 *                     progress:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserProgress'
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalContent:
 *                           type: number
 *                         completedContent:
 *                           type: number
 *                         completionPercentage:
 *                           type: number
 *                         totalTimeSpent:
 *                           type: number
 *                         progressByType:
 *                           type: object
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to access this progress
 *       404:
 *         description: User or module not found
 */
router.get("/:userId/:moduleId", protect, getUserModuleProgress);

/**
 * @swagger
 * /progress:
 *   post:
 *     summary: Update content progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentId
 *               - progressPercentage
 *             properties:
 *               contentId:
 *                 type: string
 *                 description: Content ID
 *               progressPercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Progress percentage (0-100)
 *               timeSpent:
 *                 type: number
 *                 minimum: 0
 *                 description: Additional time spent in minutes
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 description: Score achieved (optional)
 *               maxScore:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum score possible (optional)
 *           example:
 *             contentId: "60f7b3b3b3b3b3b3b3b3b3b3"
 *             progressPercentage: 75
 *             timeSpent: 15
 *             score: 85
 *             maxScore: 100
 *     responses:
 *       201:
 *         description: Progress updated successfully
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
 *                   $ref: '#/components/schemas/UserProgress'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Content not found
 */
router.post("/", protect, validateRequest("updateProgress"), updateProgress);

/**
 * @swagger
 * /progress/{id}/complete:
 *   put:
 *     summary: Mark content as completed
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Progress record ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 description: Final score achieved (optional)
 *           example:
 *             score: 95
 *     responses:
 *       200:
 *         description: Content marked as completed successfully
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
 *                   $ref: '#/components/schemas/UserProgress'
 *       400:
 *         description: Invalid progress ID format
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to update this progress
 *       404:
 *         description: Progress record not found
 */
router.put("/:id/complete", protect, markContentCompleted);

/**
 * @swagger
 * /progress/stats/{moduleId}:
 *   get:
 *     summary: Get module progress statistics
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module progress statistics retrieved successfully
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
 *                     module:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalUsers:
 *                           type: number
 *                         totalContent:
 *                           type: number
 *                         totalProgress:
 *                           type: number
 *                     progressByStatus:
 *                       type: object
 *                       properties:
 *                         completed:
 *                           type: number
 *                         inProgress:
 *                           type: number
 *                         notStarted:
 *                           type: number
 *                     completionRates:
 *                       type: object
 *                       properties:
 *                         video:
 *                           type: number
 *                         lab:
 *                           type: number
 *                         game:
 *                           type: number
 *                         document:
 *                           type: number
 *                     averageTimeSpent:
 *                       type: object
 *                       properties:
 *                         video:
 *                           type: number
 *                         lab:
 *                           type: number
 *                         game:
 *                           type: number
 *                         document:
 *                           type: number
 *                     userProgressSummary:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                           completionPercentage:
 *                             type: number
 *                           completedContent:
 *                             type: number
 *                           totalTimeSpent:
 *                             type: number
 *                           enrollment:
 *                             type: object
 *       400:
 *         description: Invalid module ID format
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to view progress statistics
 *       404:
 *         description: Module not found
 */
router.get("/stats/:moduleId", protect, getModuleProgressStats);

module.exports = router;
