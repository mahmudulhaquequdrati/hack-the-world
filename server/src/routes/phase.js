const express = require("express");
const {
  getPhases,
  getPhase,
  createPhase,
  updatePhase,
  deletePhase,
  batchUpdatePhaseOrder,
} = require("../controllers/phaseController");

const {
  createPhaseValidation,
  updatePhaseValidation,
  objectIdValidation,
} = require("../middleware/validation/phaseValidation");

const { protect, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Phase:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - icon
 *         - color
 *         - order
 *       properties:
 *         id:
 *           type: string
 *           format: objectId
 *           description: MongoDB ObjectId for the phase
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Display title for the phase
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Detailed description of the phase
 *         icon:
 *           type: string
 *           maxLength: 50
 *           description: Icon name for UI display
 *         color:
 *           type: string
 *           pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
 *           description: Hex color code for theming
 *         order:
 *           type: integer
 *           minimum: 1
 *           description: Display order for phases
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Phase creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Phase last update timestamp
 *       example:
 *         id: "60d5ecf8c72b3c001f8e4d23"
 *         title: "Beginner Phase"
 *         description: "Foundation courses for cybersecurity beginners"
 *         icon: "Lightbulb"
 *         color: "#10B981"
 *         order: 1
 */

/**
 * @swagger
 * /phases:
 *   get:
 *     summary: Get all phases
 *     tags: [Phases]
 *     responses:
 *       200:
 *         description: Phases retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Phase'
 *   post:
 *     summary: Create a new phase
 *     tags: [Phases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - icon
 *               - color
 *               - order
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               icon:
 *                 type: string
 *                 maxLength: 50
 *               color:
 *                 type: string
 *                 pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
 *               order:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Phase created successfully
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
 *                   $ref: '#/components/schemas/Phase'
 *       400:
 *         description: Validation error or phase already exists
 */
router.get("/", getPhases);

router.post("/", protect, requireAdmin, createPhaseValidation, createPhase);

// Batch update phase orders
router.put("/batch-order", protect, requireAdmin, batchUpdatePhaseOrder);

/**
 * @swagger
 * /phases/{id}:
 *   get:
 *     summary: Get a specific phase
 *     tags: [Phases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: MongoDB ObjectId of the phase
 *     responses:
 *       200:
 *         description: Phase retrieved successfully
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
 *                   $ref: '#/components/schemas/Phase'
 *       400:
 *         description: Invalid ObjectId format
 *       404:
 *         description: Phase not found
 *   put:
 *     summary: Update a specific phase
 *     tags: [Phases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: MongoDB ObjectId of the phase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               icon:
 *                 type: string
 *                 maxLength: 50
 *               color:
 *                 type: string
 *                 pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
 *               order:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Phase updated successfully
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
 *                   $ref: '#/components/schemas/Phase'
 *       400:
 *         description: Invalid ObjectId format or validation error
 *       404:
 *         description: Phase not found
 *   delete:
 *     summary: Delete a specific phase
 *     tags: [Phases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: MongoDB ObjectId of the phase
 *     responses:
 *       200:
 *         description: Phase deleted successfully
 *       400:
 *         description: Invalid ObjectId format
 *       404:
 *         description: Phase not found
 */
router
  .route("/:id")
  .get(objectIdValidation, getPhase)
  .put(
    protect,
    requireAdmin,
    objectIdValidation,
    updatePhaseValidation,
    updatePhase
  )
  .delete(protect, requireAdmin, objectIdValidation, deletePhase);

module.exports = router;
