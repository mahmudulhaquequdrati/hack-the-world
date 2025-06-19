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
  batchUpdateModuleOrder,
} = require("../controllers/moduleController");

// Import validation middleware (we'll create this)
const { validateRequest } = require("../middleware/validation");
const { protect, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required:
 *         - phaseId
 *         - title
 *         - description
 *         - icon
 *         - difficulty
 *         - color
 *         - order
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: MongoDB ObjectId for the module
 *           example: "60d5ecf8c72b3c001f8e4d23"
 *         phaseId:
 *           type: string
 *           format: objectId
 *           description: Reference to parent phase ObjectId
 *           example: "60d5ecf8c72b3c001f8e4d22"
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
 *           description: Estimated duration (auto-calculated)
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
 *           description: Course detail page path (auto-generated)
 *           example: "/course/60d5ecf8c72b3c001f8e4d23"
 *         enrollPath:
 *           type: string
 *           maxLength: 100
 *           description: Enrollment path (auto-generated)
 *           example: "/learn/60d5ecf8c72b3c001f8e4d23"
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
 *             format: objectId
 *           description: Prerequisites module ObjectIds
 *         learningOutcomes:
 *           type: array
 *           items:
 *             type: string
 *           description: Expected learning outcomes
 *         content:
 *           type: object
 *           description: Content arrays and statistics
 *         contentStats:
 *           type: object
 *           description: Auto-calculated content statistics
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
 *           format: objectId
 *         description: Filter modules by phase ObjectId
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
 *                       id:
 *                         type: string
 *                         format: objectId
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
 * /modules/batch-order:
 *   put:
 *     summary: Batch update module orders
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleOrders
 *             properties:
 *               moduleOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - order
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: objectId
 *                       description: Module ObjectId
 *                     order:
 *                       type: number
 *                       minimum: 1
 *                       description: New order position
 *     responses:
 *       200:
 *         description: Module orders updated successfully
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
 *                     $ref: '#/components/schemas/Module'
 *       400:
 *         description: Invalid module IDs or validation error
 *       404:
 *         description: Some modules not found
 */
router.put("/batch-order", protect, requireAdmin, batchUpdateModuleOrder);

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
 *           format: objectId
 *         description: Phase ObjectId
 *     responses:
 *       200:
 *         description: Modules for phase retrieved successfully
 *       400:
 *         description: Invalid phase ObjectId format
 *       404:
 *         description: Phase not found
 */
router.get("/phase/:phaseId", getModulesByPhase);

/**
 * @swagger
 * /modules/{id}:
 *   get:
 *     summary: Get a specific module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Module ObjectId
 *     responses:
 *       200:
 *         description: Module retrieved successfully
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
 *                   $ref: '#/components/schemas/Module'
 *       400:
 *         description: Invalid module ObjectId format
 *       404:
 *         description: Module not found
 */
router.get("/:id", getModule);

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a new module
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phaseId
 *               - title
 *               - description
 *               - icon
 *               - difficulty
 *               - color
 *               - order
 *             properties:
 *               phaseId:
 *                 type: string
 *                 format: objectId
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               icon:
 *                 type: string
 *                 maxLength: 50
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced, Expert]
 *               color:
 *                 type: string
 *                 maxLength: 50
 *               order:
 *                 type: number
 *                 minimum: 1
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *               learningOutcomes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Module created successfully
 *       400:
 *         description: Validation error or duplicate order
 *       404:
 *         description: Phase not found
 */
router.post("/", protect, requireAdmin, createModule);

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Update a module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Module ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phaseId:
 *                 type: string
 *                 format: objectId
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               icon:
 *                 type: string
 *                 maxLength: 50
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced, Expert]
 *               color:
 *                 type: string
 *                 maxLength: 50
 *               order:
 *                 type: number
 *                 minimum: 1
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *               learningOutcomes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Module updated successfully
 *       400:
 *         description: Invalid ObjectId format or validation error
 *       404:
 *         description: Module or phase not found
 *   delete:
 *     summary: Delete a module (soft delete)
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Module ObjectId
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *       400:
 *         description: Invalid module ObjectId format
 *       404:
 *         description: Module not found
 */
router
  .route("/:id")
  .put(protect, requireAdmin, updateModule)
  .delete(protect, requireAdmin, deleteModule);

/**
 * @swagger
 * /modules/phase/{phaseId}/reorder:
 *   put:
 *     summary: Reorder modules within a phase
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: phaseId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Phase ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleOrders
 *             properties:
 *               moduleOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     moduleId:
 *                       type: string
 *                       format: objectId
 *                     order:
 *                       type: number
 *                       minimum: 1
 *     responses:
 *       200:
 *         description: Module order updated successfully
 *       400:
 *         description: Invalid ObjectId format or validation error
 *       404:
 *         description: Phase not found or modules don't belong to phase
 */
router.put("/phase/:phaseId/reorder", protect, requireAdmin, reorderModules);

module.exports = router;
