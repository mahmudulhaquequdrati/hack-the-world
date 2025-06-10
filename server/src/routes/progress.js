const express = require("express");
const {
  markContentStarted,
  markContentComplete,
  updateContentProgress,
  getUserOverallProgress,
  getUserModuleProgress,
  getUserContentTypeProgress,
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
 * /progress/content/start:
 *   post:
 *     summary: Mark content as started (when content is loaded/accessed)
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
 *             properties:
 *               contentId:
 *                 type: string
 *                 description: Content ID to mark as started
 *     responses:
 *       200:
 *         description: Content started successfully
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
 *       403:
 *         description: User not enrolled in module
 *       404:
 *         description: Content not found
 */
router.post("/content/start", protect, markContentStarted);

/**
 * @swagger
 * /progress/content/complete:
 *   post:
 *     summary: Mark content as completed (manual or from labs/games)
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
 *             properties:
 *               contentId:
 *                 type: string
 *                 description: Content ID to mark as completed
 *               score:
 *                 type: number
 *                 description: Score achieved (for labs/games)
 *               maxScore:
 *                 type: number
 *                 description: Maximum possible score
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
 *         description: Invalid input data
 *       403:
 *         description: User not enrolled in module
 *       404:
 *         description: Content not found
 */
router.post("/content/complete", protect, markContentComplete);

/**
 * @swagger
 * /progress/content/update:
 *   post:
 *     summary: Update content progress (for videos - auto-complete at 90%)
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
 *     responses:
 *       200:
 *         description: Content progress updated successfully
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
 *       403:
 *         description: User not enrolled in module
 *       404:
 *         description: Content not found
 */
router.post("/content/update", protect, updateContentProgress);

/**
 * @swagger
 * /progress/overview/{userId}:
 *   get:
 *     summary: Get user's overall progress across all modules
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
 *     responses:
 *       200:
 *         description: User overall progress retrieved successfully
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
 *                     overallStats:
 *                       type: object
 *                       properties:
 *                         totalModules:
 *                           type: number
 *                         completedModules:
 *                           type: number
 *                         inProgressModules:
 *                           type: number
 *                         overallCompletionPercentage:
 *                           type: number
 *                     moduleProgress:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           module:
 *                             type: object
 *                           enrollment:
 *                             type: object
 *                           content:
 *                             type: object
 *                     contentStats:
 *                       type: object
 *                       properties:
 *                         totalContent:
 *                           type: number
 *                         completedContent:
 *                           type: number
 *                         inProgressContent:
 *                           type: number
 *                         contentByType:
 *                           type: object
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to access this progress
 *       404:
 *         description: User not found
 */
router.get("/overview/:userId", protect, getUserOverallProgress);

/**
 * @swagger
 * /progress/module/{userId}/{moduleId}:
 *   get:
 *     summary: Get user's progress for a specific module
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
 *                         difficulty:
 *                           type: string
 *                         phase:
 *                           type: string
 *                     enrollment:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                         enrolledAt:
 *                           type: string
 *                           format: date-time
 *                         progressPercentage:
 *                           type: number
 *                     content:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           type:
 *                             type: string
 *                           section:
 *                             type: string
 *                           duration:
 *                             type: number
 *                           progress:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                               progressPercentage:
 *                                 type: number
 *                               score:
 *                                 type: number
 *                               maxScore:
 *                                 type: number
 *                               startedAt:
 *                                 type: string
 *                                 format: date-time
 *                               completedAt:
 *                                 type: string
 *                                 format: date-time
 *                     statistics:
 *                       type: object
 *       400:
 *         description: Invalid user ID or module ID format
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to access this progress
 *       404:
 *         description: User not found, module not found, or user not enrolled
 */
router.get("/module/:userId/:moduleId", protect, getUserModuleProgress);

/**
 * @swagger
 * /progress/content/{userId}/{contentType}:
 *   get:
 *     summary: Get user's progress for specific content type (labs, games, videos, documents)
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
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [video, lab, game, document]
 *         description: Content type to filter by
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Filter by specific module ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [not-started, in-progress, completed]
 *         description: Filter by progress status
 *     responses:
 *       200:
 *         description: User content type progress retrieved successfully
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
 *                     content:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           section:
 *                             type: string
 *                           duration:
 *                             type: number
 *                           module:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               difficulty:
 *                                 type: string
 *                               phase:
 *                                 type: string
 *                           progress:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                               progressPercentage:
 *                                 type: number
 *                               score:
 *                                 type: number
 *                               maxScore:
 *                                 type: number
 *                               startedAt:
 *                                 type: string
 *                                 format: date-time
 *                               completedAt:
 *                                 type: string
 *                                 format: date-time
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
 *                     modules:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Invalid user ID format or invalid content type
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to access this progress
 *       404:
 *         description: User not found
 */
router.get(
  "/content/:userId/:contentType",
  protect,
  getUserContentTypeProgress
);

module.exports = router;
