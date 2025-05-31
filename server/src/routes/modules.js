const express = require("express");
const {
  getModules,
  getModulesWithPhases,
  getModule,
  createModule,
  updateModule,
  deleteModule,
  getModulesByPhase,
  reorderModules,
} = require("../controllers/moduleController");

// Import validation middleware (we'll create this)
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required:
 *         - moduleId
 *         - phaseId
 *         - title
 *         - description
 *         - icon
 *         - duration
 *         - difficulty
 *         - color
 *         - order
 *       properties:
 *         moduleId:
 *           type: string
 *           description: Unique module identifier
 *           example: "foundations"
 *         phaseId:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Reference to parent phase
 *           example: "beginner"
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Module title
 *           example: "Cybersecurity Foundations"
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Module description
 *           example: "Introduction to core cybersecurity concepts"
 *         icon:
 *           type: string
 *           maxLength: 50
 *           description: Icon name for frontend
 *           example: "Shield"
 *         duration:
 *           type: string
 *           maxLength: 50
 *           description: Estimated duration
 *           example: "4 hours"
 *         difficulty:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced, Expert]
 *           description: Difficulty level
 *           example: "Beginner"
 *         color:
 *           type: string
 *           maxLength: 50
 *           description: Color class for frontend
 *           example: "#3B82F6"
 *         path:
 *           type: string
 *           maxLength: 100
 *           description: Course detail page path
 *           example: "/course/foundations"
 *         enrollPath:
 *           type: string
 *           maxLength: 100
 *           description: Enrollment path
 *           example: "/learn/foundations"
 *         order:
 *           type: number
 *           minimum: 1
 *           description: Display order within phase
 *           example: 1
 *         topics:
 *           type: array
 *           items:
 *             type: string
 *             maxLength: 100
 *           description: Learning topics covered
 *           example: ["Security Basics", "Threat Models", "Risk Assessment"]
 *         isActive:
 *           type: boolean
 *           description: Module status
 *           default: true
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *           description: Prerequisites for this module
 *         learningOutcomes:
 *           type: array
 *           items:
 *             type: string
 *           description: Expected learning outcomes
 */

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Get all modules
 *     tags: [Modules]
 *     parameters:
 *       - in: query
 *         name: phase
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter modules by phase
 *       - in: query
 *         name: grouped
 *         schema:
 *           type: boolean
 *         description: Return modules grouped by phase
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
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
 *                   oneOf:
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Module'
 *                     - type: object
 *                 count:
 *                   type: number
 */
router.get("/", getModules);

/**
 * @swagger
 * /modules/with-phases:
 *   get:
 *     summary: Get modules with phases for course page
 *     tags: [Modules]
 *     responses:
 *       200:
 *         description: Phases with modules retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       phaseId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       modules:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Module'
 */
router.get("/with-phases", getModulesWithPhases);

/**
 * @swagger
 * /modules/phase/{phaseId}:
 *   get:
 *     summary: Get modules by phase
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: phaseId
 *         required: true
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Phase ID to get modules for
 *     responses:
 *       200:
 *         description: Modules for phase retrieved successfully
 *       404:
 *         description: Phase not found
 */
router.get("/phase/:phaseId", getModulesByPhase);

/**
 * @swagger
 * /modules/{moduleId}:
 *   get:
 *     summary: Get single module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module retrieved successfully
 *       404:
 *         description: Module not found
 */
router.get("/:moduleId", getModule);

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create new module
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Module'
 *     responses:
 *       201:
 *         description: Module created successfully
 *       400:
 *         description: Validation error or duplicate module
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Phase not found
 */
router.post("/", validateRequest("createModule"), createModule);

/**
 * @swagger
 * /modules/{moduleId}:
 *   put:
 *     summary: Update module
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Module'
 *     responses:
 *       200:
 *         description: Module updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Module or phase not found
 */
router.put("/:moduleId", validateRequest("updateModule"), updateModule);

/**
 * @swagger
 * /modules/{moduleId}:
 *   delete:
 *     summary: Delete module (soft delete)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID to delete
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Module not found
 */
router.delete("/:moduleId", deleteModule);

/**
 * @swagger
 * /modules/phase/{phaseId}/reorder:
 *   put:
 *     summary: Reorder modules within a phase
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phaseId
 *         required: true
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Phase ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moduleOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     moduleId:
 *                       type: string
 *                     order:
 *                       type: number
 *             example:
 *               moduleOrders:
 *                 - moduleId: "foundations"
 *                   order: 1
 *                 - moduleId: "linux-basics"
 *                   order: 2
 *     responses:
 *       200:
 *         description: Module order updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Phase or modules not found
 */
router.put(
  "/phase/:phaseId/reorder",
  validateRequest("reorderModules"),
  reorderModules
);

module.exports = router;
