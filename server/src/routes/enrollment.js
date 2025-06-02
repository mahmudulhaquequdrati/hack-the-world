const express = require("express");
const { body, param } = require("express-validator");
const {
  enrollUser,
  getUserEnrollments,
  getEnrollmentByModule,
  updateEnrollmentProgress,
  pauseEnrollment,
  resumeEnrollment,
  completeEnrollment,
  unenrollUser,
  getAllEnrollments,
  getModuleEnrollmentStats,
} = require("../controllers/enrollmentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Enrollment ID
 *         userId:
 *           type: string
 *           description: User ID
 *         moduleId:
 *           type: string
 *           description: Module ID
 *         status:
 *           type: string
 *           enum: [active, completed, paused, dropped]
 *           description: Enrollment status
 *         completedSections:
 *           type: number
 *           description: Number of completed sections
 *         totalSections:
 *           type: number
 *           description: Total sections in module
 *         progressPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Progress percentage
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *           description: Enrollment date
 *         lastAccessedAt:
 *           type: string
 *           format: date-time
 *           description: Last access date
 *         estimatedCompletionDate:
 *           type: string
 *           format: date-time
 *           description: Estimated completion date
 *       required:
 *         - userId
 *         - moduleId
 *         - status
 */

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll user in a module
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *             properties:
 *               moduleId:
 *                 type: string
 *                 description: Module ID to enroll in
 *     responses:
 *       201:
 *         description: Successfully enrolled
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
 *                   example: Successfully enrolled in module
 *                 data:
 *                   $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: User already enrolled or validation error
 *       404:
 *         description: Module not found
 */
router.post(
  "/",
  [body("moduleId").isMongoId().withMessage("Valid module ID is required")],
  enrollUser
);

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Get user enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, paused, dropped]
 *         description: Filter by enrollment status
 *       - in: query
 *         name: populate
 *         schema:
 *           type: boolean
 *         description: Whether to populate module details
 *     responses:
 *       200:
 *         description: User enrollments retrieved successfully
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
 *                   example: User enrollments retrieved successfully
 *                 count:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Enrollment'
 */
router.get("/", getUserEnrollments);

/**
 * @swagger
 * /api/enrollments/module/{moduleId}:
 *   get:
 *     summary: Get specific enrollment by module
 *     tags: [Enrollments]
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
 *         description: Enrollment retrieved successfully
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
 *                   example: Enrollment retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 */
router.get(
  "/module/:moduleId",
  [param("moduleId").isMongoId().withMessage("Valid module ID is required")],
  getEnrollmentByModule
);

/**
 * @swagger
 * /api/enrollments/{enrollmentId}/progress:
 *   put:
 *     summary: Update enrollment progress
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - completedSections
 *             properties:
 *               completedSections:
 *                 type: number
 *                 minimum: 0
 *                 description: Number of completed sections
 *     responses:
 *       200:
 *         description: Progress updated successfully
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
 *                   example: Progress updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 */
router.put(
  "/:enrollmentId/progress",
  [
    param("enrollmentId")
      .isMongoId()
      .withMessage("Valid enrollment ID is required"),
    body("completedSections")
      .isInt({ min: 0 })
      .withMessage("Completed sections must be a non-negative integer"),
  ],
  updateEnrollmentProgress
);

/**
 * @swagger
 * /api/enrollments/{enrollmentId}/pause:
 *   put:
 *     summary: Pause enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment paused successfully
 */
router.put(
  "/:enrollmentId/pause",
  [
    param("enrollmentId")
      .isMongoId()
      .withMessage("Valid enrollment ID is required"),
  ],
  pauseEnrollment
);

/**
 * @swagger
 * /api/enrollments/{enrollmentId}/resume:
 *   put:
 *     summary: Resume enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment resumed successfully
 */
router.put(
  "/:enrollmentId/resume",
  [
    param("enrollmentId")
      .isMongoId()
      .withMessage("Valid enrollment ID is required"),
  ],
  resumeEnrollment
);

/**
 * @swagger
 * /api/enrollments/{enrollmentId}/complete:
 *   put:
 *     summary: Complete enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment completed successfully
 */
router.put(
  "/:enrollmentId/complete",
  [
    param("enrollmentId")
      .isMongoId()
      .withMessage("Valid enrollment ID is required"),
  ],
  completeEnrollment
);

/**
 * @swagger
 * /api/enrollments/{enrollmentId}:
 *   delete:
 *     summary: Unenroll from module
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Successfully unenrolled from module
 *       404:
 *         description: Enrollment not found
 */
router.delete(
  "/:enrollmentId",
  [
    param("enrollmentId")
      .isMongoId()
      .withMessage("Valid enrollment ID is required"),
  ],
  unenrollUser
);

// Admin routes
/**
 * @swagger
 * /api/enrollments/admin/all:
 *   get:
 *     summary: Get all enrollments (Admin only)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, paused, dropped]
 *         description: Filter by enrollment status
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Filter by module ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: All enrollments retrieved successfully
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
 *                   example: All enrollments retrieved successfully
 *                 count:
 *                   type: number
 *                   example: 20
 *                 total:
 *                   type: number
 *                   example: 150
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 20
 *                     pages:
 *                       type: number
 *                       example: 8
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Enrollment'
 */
router.get("/admin/all", authorize("admin"), getAllEnrollments);

/**
 * @swagger
 * /api/enrollments/admin/stats/{moduleId}:
 *   get:
 *     summary: Get module enrollment statistics (Admin only)
 *     tags: [Enrollments]
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
 *         description: Module enrollment statistics retrieved successfully
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
 *                   example: Module enrollment statistics retrieved successfully
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
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalEnrollments:
 *                           type: number
 *                         activeEnrollments:
 *                           type: number
 *                         completedEnrollments:
 *                           type: number
 *                         pausedEnrollments:
 *                           type: number
 *                         droppedEnrollments:
 *                           type: number
 *                         averageProgress:
 *                           type: number
 *                         completionRate:
 *                           type: number
 *       404:
 *         description: Module not found
 */
router.get(
  "/admin/stats/:moduleId",
  [param("moduleId").isMongoId().withMessage("Valid module ID is required")],
  authorize("admin"),
  getModuleEnrollmentStats
);

module.exports = router;
