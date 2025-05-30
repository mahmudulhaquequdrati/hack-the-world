/**
 * @swagger
 * tags:
 *   name: 📚 Learning Modules
 *   description: Cybersecurity learning modules and course content management
 *
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - phase
 *         - difficulty
 *         - category
 *         - estimatedTime
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique module identifier
 *           example: "64f8b1a2c9e4f123456789ab"
 *         name:
 *           type: string
 *           description: Module name
 *           example: "Network Security Fundamentals"
 *         description:
 *           type: string
 *           description: Detailed module description
 *           example: "Learn the fundamentals of network security including firewalls, intrusion detection, and secure protocols"
 *         phase:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Learning phase
 *           example: "beginner"
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *           description: Difficulty level
 *           example: "intermediate"
 *         category:
 *           type: string
 *           description: Module category
 *           example: "Network Security"
 *         estimatedTime:
 *           type: integer
 *           minimum: 1
 *           description: Estimated completion time in hours
 *           example: 8
 *         points:
 *           type: integer
 *           description: Points awarded upon completion
 *           example: 100
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *           description: Required prerequisite module IDs
 *           example: ["64f8b1a2c9e4f123456789ac"]
 *         content:
 *           type: object
 *           properties:
 *             lessons:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   duration:
 *                     type: integer
 *             labs:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   difficulty:
 *                     type: string
 *             games:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   points:
 *                     type: integer
 *         isActive:
 *           type: boolean
 *           description: Whether the module is active
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *
 *     ModuleProgress:
 *       type: object
 *       properties:
 *         moduleId:
 *           type: string
 *           description: Module ID
 *           example: "64f8b1a2c9e4f123456789ab"
 *         userId:
 *           type: string
 *           description: User ID
 *           example: "64f8b1a2c9e4f123456789cd"
 *         enrollment:
 *           type: object
 *           properties:
 *             enrolledAt:
 *               type: string
 *               format: date-time
 *             status:
 *               type: string
 *               enum: [active, completed, paused]
 *             lastAccessed:
 *               type: string
 *               format: date-time
 *         progress:
 *           type: object
 *           properties:
 *             lessonsCompleted:
 *               type: integer
 *               example: 5
 *             labsCompleted:
 *               type: integer
 *               example: 2
 *             gamesCompleted:
 *               type: integer
 *               example: 1
 *             overallProgress:
 *               type: integer
 *               minimum: 0
 *               maximum: 100
 *               example: 65
 *             timeSpent:
 *               type: integer
 *               description: Time spent in minutes
 *               example: 480
 *
 *     ModuleStats:
 *       type: object
 *       properties:
 *         moduleId:
 *           type: string
 *           example: "64f8b1a2c9e4f123456789ab"
 *         moduleName:
 *           type: string
 *           example: "Network Security Fundamentals"
 *         enrolledUsers:
 *           type: integer
 *           example: 150
 *         completedUsers:
 *           type: integer
 *           example: 89
 *         completionRate:
 *           type: number
 *           format: float
 *           example: 59.33
 *         averageRating:
 *           type: number
 *           format: float
 *           example: 4.2
 *         totalRatings:
 *           type: integer
 *           example: 76
 *
 *     ModuleRating:
 *       type: object
 *       required:
 *         - userId
 *         - rating
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID submitting the rating
 *           example: "64f8b1a2c9e4f123456789cd"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *           example: 4
 *         review:
 *           type: string
 *           maxLength: 1000
 *           description: Optional review text
 *           example: "Great module! Clear explanations and practical examples."
 *
 *     CreateModuleRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - phase
 *         - difficulty
 *         - category
 *         - estimatedTime
 *       properties:
 *         name:
 *           type: string
 *           example: "Advanced Penetration Testing"
 *         description:
 *           type: string
 *           example: "Master advanced penetration testing techniques and methodologies"
 *         phase:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: "advanced"
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *           example: "expert"
 *         category:
 *           type: string
 *           example: "Penetration Testing"
 *         estimatedTime:
 *           type: integer
 *           minimum: 1
 *           example: 12
 *         points:
 *           type: integer
 *           example: 200
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *           example: ["64f8b1a2c9e4f123456789ac", "64f8b1a2c9e4f123456789ad"]
 *
 *     UpdateProgressRequest:
 *       type: object
 *       properties:
 *         lessonId:
 *           type: string
 *           description: ID of completed lesson
 *           example: "lesson_1"
 *         labId:
 *           type: string
 *           description: ID of completed lab
 *           example: "lab_1"
 *         gameId:
 *           type: string
 *           description: ID of completed game
 *           example: "game_1"
 *         completed:
 *           type: boolean
 *           description: Whether the content was completed
 *           example: true
 *         timeSpent:
 *           type: integer
 *           minimum: 0
 *           description: Time spent in minutes
 *           example: 45
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           description: Response data
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *           description: Validation errors if any
 *
 *     PaginatedResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 modules:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Module'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     pages:
 *                       type: integer
 *                       example: 3
 */

const express = require("express");
const { body } = require("express-validator");
const modulesController = require("../controllers/modulesController");

const router = express.Router();

// ========================================
// STATIC ROUTES FIRST (these must come before /:id)
// ========================================

/**
 * @swagger
 * /api/modules/categories:
 *   get:
 *     summary: Get all module categories
 *     description: Retrieve a list of all available module categories for filtering and organization
 *     tags: [📚 Learning Modules]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         categories:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Network Security", "Web Security", "Cryptography", "Incident Response"]
 *                         count:
 *                           type: integer
 *                           example: 4
 *             example:
 *               success: true
 *               data:
 *                 categories: ["Network Security", "Web Security", "Cryptography", "Incident Response"]
 *                 count: 4
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */
router.get("/categories", modulesController.getModuleCategories);

/**
 * @swagger
 * /api/modules/phase/{phase}:
 *   get:
 *     summary: Get modules by learning phase
 *     description: Retrieve modules filtered by specific learning phase (beginner, intermediate, advanced)
 *     tags: [📚 Learning Modules]
 *     parameters:
 *       - in: path
 *         name: phase
 *         required: true
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Learning phase to filter by
 *         example: "beginner"
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         modules:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Module'
 *                         count:
 *                           type: integer
 *                           example: 8
 *                         phase:
 *                           type: string
 *                           example: "beginner"
 *       400:
 *         description: Invalid phase parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid learning phase"
 *       500:
 *         description: Internal server error
 */
router.get("/phase/:phase", modulesController.getModulesByPhase);

// ========================================
// GENERAL ROUTES
// ========================================

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Get all modules with filtering and pagination
 *     description: Retrieve all learning modules with optional filtering by phase, difficulty, category and pagination support
 *     tags: [📚 Learning Modules]
 *     parameters:
 *       - in: query
 *         name: phase
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by learning phase
 *         example: "beginner"
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *         description: Filter by difficulty level
 *         example: "intermediate"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *         example: "Network Security"
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filter by active status
 *         example: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of modules per page
 *         example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: "order"
 *         description: Field to sort by
 *         example: "name"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "asc"
 *         description: Sort order
 *         example: "asc"
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/", modulesController.getAllModules);

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Create a new learning module
 *     description: Create a new cybersecurity learning module (Admin access required)
 *     tags: [📚 Learning Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateModuleRequest'
 *           example:
 *             name: "Advanced Penetration Testing"
 *             description: "Master advanced penetration testing techniques and methodologies"
 *             phase: "advanced"
 *             difficulty: "expert"
 *             category: "Penetration Testing"
 *             estimatedTime: 12
 *             points: 200
 *             prerequisites: ["64f8b1a2c9e4f123456789ac"]
 *     responses:
 *       201:
 *         description: Module created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         module:
 *                           $ref: '#/components/schemas/Module'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Validation failed"
 *               errors: [{"field": "name", "message": "Module name is required"}]
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Module name is required"),
    body("description")
      .notEmpty()
      .withMessage("Module description is required"),
    body("phase")
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid phase"),
    body("difficulty")
      .isIn(["beginner", "intermediate", "advanced", "expert"])
      .withMessage("Invalid difficulty level"),
    body("category").notEmpty().withMessage("Module category is required"),
    body("estimatedTime")
      .isInt({ min: 1 })
      .withMessage("Estimated time must be a positive integer"),
  ],
  modulesController.createModule
);

// ========================================
// PARAMETERIZED ROUTES LAST
// ========================================

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Get module by ID
 *     description: Retrieve detailed information about a specific learning module
 *     tags: [📚 Learning Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *         example: "64f8b1a2c9e4f123456789ab"
 *     responses:
 *       200:
 *         description: Module retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         module:
 *                           $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Module not found"
 *       500:
 *         description: Internal server error
 */
router.get("/:id", modulesController.getModuleById);

/**
 * @swagger
 * /api/modules/{id}:
 *   put:
 *     summary: Update a learning module
 *     description: Update an existing learning module (Admin access required)
 *     tags: [📚 Learning Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *         example: "64f8b1a2c9e4f123456789ab"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Module Name"
 *               description:
 *                 type: string
 *                 example: "Updated module description"
 *               phase:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: "intermediate"
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced, expert]
 *                 example: "advanced"
 *               estimatedTime:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *     responses:
 *       200:
 *         description: Module updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         module:
 *                           $ref: '#/components/schemas/Module'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Module name cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Module description cannot be empty"),
    body("phase")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid phase"),
    body("difficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced", "expert"])
      .withMessage("Invalid difficulty level"),
    body("estimatedTime")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Estimated time must be a positive integer"),
  ],
  modulesController.updateModule
);

/**
 * @swagger
 * /api/modules/{id}:
 *   delete:
 *     summary: Delete a learning module
 *     description: Soft delete a learning module by marking it as inactive (Admin access required)
 *     tags: [📚 Learning Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *         example: "64f8b1a2c9e4f123456789ab"
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Module deleted successfully"
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", modulesController.deleteModule);

/**
 * @swagger
 * /api/modules/{id}/stats:
 *   get:
 *     summary: Get module statistics
 *     description: Retrieve comprehensive statistics for a specific module including enrollment and completion rates
 *     tags: [📚 Learning Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *         example: "64f8b1a2c9e4f123456789ab"
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ModuleStats'
 *             example:
 *               success: true
 *               data:
 *                 moduleId: "64f8b1a2c9e4f123456789ab"
 *                 moduleName: "Network Security Fundamentals"
 *                 enrolledUsers: 150
 *                 completedUsers: 89
 *                 completionRate: 59.33
 *                 averageRating: 4.2
 *                 totalRatings: 76
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/stats", modulesController.getModuleStats);

/**
 * @swagger
 * /api/modules/{id}/enroll:
 *   post:
 *     summary: Enroll user in module
 *     description: Enroll a user in a specific learning module with prerequisite validation
 *     tags: [📚 Learning Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *         example: "64f8b1a2c9e4f123456789ab"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to enroll
 *                 example: "64f8b1a2c9e4f123456789cd"
 *           example:
 *             userId: "64f8b1a2c9e4f123456789cd"
 *     responses:
 *       200:
 *         description: User enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         moduleId:
 *                           type: string
 *                           example: "64f8b1a2c9e4f123456789ab"
 *                         moduleName:
 *                           type: string
 *                           example: "Network Security Fundamentals"
 *                         enrolledAt:
 *                           type: string
 *                           format: date-time
 *                         prerequisites:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Module'
 *       400:
 *         description: Validation error or prerequisites not met
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         missingPrerequisites:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               difficulty:
 *                                 type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Module or user not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/:id/enroll",
  [body("userId").notEmpty().withMessage("User ID is required")],
  modulesController.enrollInModule
);

/**
 * @swagger
 * /api/modules/{id}/progress/{userId}:
 *   get:
 *     summary: Get user's progress in module
 *     description: Retrieve detailed progress information for a user in a specific module
 *     tags: [📚 Learning Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *         example: "64f8b1a2c9e4f123456789ab"
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "64f8b1a2c9e4f123456789cd"
 *     responses:
 *       200:
 *         description: Progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ModuleProgress'
 *       400:
 *         description: User not enrolled in module
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Module, user, or enrollment not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/progress/:userId", modulesController.getModuleProgress);

/**
 * @swagger
 * /api/modules/{id}/progress/{userId}:
 *   put:
 *     summary: Update user progress in module
 *     description: Update a user's learning progress for lessons, labs, or games in a module
 *     tags: [📚 Learning Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *         example: "64f8b1a2c9e4f123456789ab"
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "64f8b1a2c9e4f123456789cd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProgressRequest'
 *           example:
 *             lessonId: "lesson_1"
 *             completed: true
 *             timeSpent: 45
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         enrollment:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                               example: "active"
 *                             progress:
 *                               type: object
 *                               properties:
 *                                 overallProgress:
 *                                   type: integer
 *                                   example: 75
 *                             completedAt:
 *                               type: string
 *                               format: date-time
 *                         moduleCompleted:
 *                           type: boolean
 *                           example: false
 *       400:
 *         description: Validation error or user not enrolled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Module or user not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id/progress/:userId",
  [
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean"),
    body("timeSpent")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Time spent must be a non-negative integer"),
  ],
  modulesController.updateModuleProgress
);

/**
 * @swagger
 * /api/modules/{id}/rate:
 *   post:
 *     summary: Rate and review a module
 *     description: Submit a rating and optional review for a completed module
 *     tags: [📚 Learning Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *         example: "64f8b1a2c9e4f123456789ab"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModuleRating'
 *           example:
 *             userId: "64f8b1a2c9e4f123456789cd"
 *             rating: 4
 *             review: "Great module! Clear explanations and practical examples."
 *     responses:
 *       200:
 *         description: Module rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         moduleId:
 *                           type: string
 *                           example: "64f8b1a2c9e4f123456789ab"
 *                         rating:
 *                           type: integer
 *                           example: 4
 *                         review:
 *                           type: string
 *                           example: "Great module! Clear explanations and practical examples."
 *                         ratedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error or module not completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "You must complete the module before rating it"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Module or user not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/:id/rate",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("review")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Review cannot exceed 1000 characters"),
  ],
  modulesController.rateModule
);

module.exports = router;
