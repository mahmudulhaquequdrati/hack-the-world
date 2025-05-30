/**
 * @swagger
 * tags:
 *   name: 🧪 Security Labs
 *   description: Hands-on cybersecurity laboratories for practical skill development
 */

const express = require("express");
const { body } = require("express-validator");
const labsController = require("../controllers/labsController");

const router = express.Router();

// ========================================
// STATIC ROUTES FIRST (these must come before /:id)
// ========================================

/**
 * @swagger
 * /labs/categories:
 *   get:
 *     summary: 🏷️ Get lab categories
 *     description: Retrieve all available cybersecurity lab categories
 *     tags: [🧪 Security Labs]
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ['cryptography', 'network-analysis', 'malware-analysis', 'digital-forensics']
 *                     count:
 *                       type: number
 *                       example: 4
 * @route   GET /api/labs/categories
 * @desc    Get all available lab categories
 * @access  Public
 */
router.get("/categories", labsController.getLabCategories);

// ========================================
// NESTED ROUTES (with parameters)
// ========================================

/**
 * @swagger
 * /labs/module/{moduleId}:
 *   get:
 *     summary: 📚 Get labs by module
 *     description: Retrieve all hands-on labs for a specific cybersecurity module
 *     tags: [🧪 Security Labs]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         example: 'cryptography-basics'
 *         description: Module identifier
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved module labs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     labs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Lab'
 *                     count:
 *                       type: number
 *                       example: 5
 *                     moduleId:
 *                       type: string
 *                       example: 'cryptography-basics'
 * @route   GET /api/labs/module/:moduleId
 * @desc    Get all labs for a specific module
 * @access  Public
 */
router.get("/module/:moduleId", labsController.getLabsByModule);

// ========================================
// GENERAL ROUTES
// ========================================

/**
 * @swagger
 * /labs:
 *   get:
 *     summary: 🧪 Get all security labs
 *     description: |
 *       Retrieve cybersecurity laboratories with optional filtering. Labs provide hands-on experience with real security tools and scenarios.
 *
 *       **🛠️ Lab Features:**
 *       - **Step-by-step guidance**: Detailed instructions for each task
 *       - **Real tools**: Practice with actual cybersecurity tools
 *       - **Terminal access**: Command-line interface for practical work
 *       - **Validation**: Automatic checking of lab completion
 *     tags: [🧪 Security Labs]
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         example: 'network-security'
 *         description: Filter by module
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         example: 'intermediate'
 *         description: Filter by difficulty level
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: 'network-analysis'
 *         description: Filter by lab category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: 'wireshark'
 *         description: Search labs by name or description
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved labs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     labs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Lab'
 *                     count:
 *                       type: number
 *                       example: 12
 * @route   GET /api/labs
 * @desc    Get all labs or filter by module/difficulty/category
 * @access  Public
 */
router.get("/", labsController.getAllLabs);

/**
 * @route   POST /api/labs
 * @desc    Create a new lab (admin only)
 * @access  Private (Admin)
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Lab name is required"),
    body("description").notEmpty().withMessage("Lab description is required"),
    body("category").notEmpty().withMessage("Lab category is required"),
    body("difficulty")
      .isIn(["beginner", "intermediate", "advanced", "expert"])
      .withMessage("Invalid difficulty level"),
    body("moduleId").notEmpty().withMessage("Module ID is required"),
    body("estimatedTime")
      .isInt({ min: 1 })
      .withMessage("Estimated time must be a positive integer"),
  ],
  labsController.createLab
);

// ========================================
// PARAMETERIZED ROUTES LAST (specific paths first)
// ========================================

/**
 * @swagger
 * /labs/{id}/steps:
 *   get:
 *     summary: 📋 Get lab steps
 *     description: Retrieve detailed step-by-step instructions for a specific cybersecurity lab
 *     tags: [🧪 Security Labs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 'lab-caesar-cipher'
 *         description: Lab identifier
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved lab steps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     steps:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: 'Analyze the encrypted message'
 *                           description:
 *                             type: string
 *                             example: 'Examine the Caesar cipher text to identify patterns'
 *                           order:
 *                             type: number
 *                             example: 1
 *                           instructions:
 *                             type: string
 *                             example: 'Use the terminal to decode the message using frequency analysis'
 *                           expectedOutput:
 *                             type: string
 *                             example: 'HELLO WORLD'
 *                           hints:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ['Look for the most common letter', 'Try shifting by 3 positions']
 *                     count:
 *                       type: number
 *                       example: 5
 *                     labId:
 *                       type: string
 *                       example: 'lab-caesar-cipher'
 *       404:
 *         description: ❌ Lab not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * @route   GET /api/labs/:id/steps
 * @desc    Get all steps for a specific lab
 * @access  Public
 */
router.get("/:id/steps", labsController.getLabSteps);

/**
 * @route   POST /api/labs/:id/start
 * @desc    Start a lab session
 * @access  Private
 */
router.post(
  "/:id/start",
  [body("userId").notEmpty().withMessage("User ID is required")],
  labsController.startLabSession
);

/**
 * @route   POST /api/labs/:id/submit
 * @desc    Submit lab step completion
 * @access  Private
 */
router.post(
  "/:id/submit",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("sessionId").notEmpty().withMessage("Session ID is required"),
    body("stepId").notEmpty().withMessage("Step ID is required"),
    body("answer").notEmpty().withMessage("Answer is required"),
  ],
  labsController.submitLabStep
);

/**
 * @route   POST /api/labs/:id/hint
 * @desc    Get lab hint
 * @access  Private
 */
router.post(
  "/:id/hint",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("sessionId").notEmpty().withMessage("Session ID is required"),
    body("stepId").notEmpty().withMessage("Step ID is required"),
  ],
  labsController.getLabHint
);

/**
 * @route   POST /api/labs/:id/reset
 * @desc    Reset lab environment
 * @access  Private
 */
router.post(
  "/:id/reset",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("sessionId").notEmpty().withMessage("Session ID is required"),
  ],
  labsController.resetLabEnvironment
);

/**
 * @route   GET /api/labs/:id/progress/:userId
 * @desc    Get user's lab progress
 * @access  Private
 */
router.get("/:id/progress/:userId", labsController.getLabProgress);

/**
 * @swagger
 * /labs/{id}:
 *   get:
 *     summary: 🔬 Get specific security lab
 *     description: Retrieve comprehensive details about a specific cybersecurity lab including objectives, steps, and resources
 *     tags: [🧪 Security Labs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 'lab-network-forensics'
 *         description: Lab identifier
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved lab
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     lab:
 *                       $ref: '#/components/schemas/Lab'
 *                     objectives:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ['Analyze network traffic', 'Identify suspicious connections', 'Extract IOCs from pcap files']
 *                     steps:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: 'Detailed step-by-step instructions'
 *                     totalSteps:
 *                       type: number
 *                       example: 8
 *                     config:
 *                       type: object
 *                       description: 'Lab configuration settings'
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ['wireshark-sample.pcap', 'network-diagram.png', 'reference-guide.pdf']
 *       404:
 *         description: ❌ Lab not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * @route   GET /api/labs/:id
 * @desc    Get single lab by ID
 * @access  Public
 */
router.get("/:id", labsController.getLabById);

/**
 * @route   PUT /api/labs/:id
 * @desc    Update lab (admin only)
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Lab name cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Lab description cannot be empty"),
    body("difficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced", "expert"])
      .withMessage("Invalid difficulty level"),
    body("estimatedTime")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Estimated time must be a positive integer"),
  ],
  labsController.updateLab
);

/**
 * @route   DELETE /api/labs/:id
 * @desc    Delete lab (admin only)
 * @access  Private (Admin)
 */
router.delete("/:id", labsController.deleteLab);

module.exports = router;
