/**
 * @swagger
 * tags:
 *   name: 🎯 Learning Phases
 *   description: Cybersecurity learning phases management - Your journey from beginner to expert
 */

const express = require("express");
const { body } = require("express-validator");
const phasesController = require("../controllers/phasesController");

const router = express.Router();

/**
 * @swagger
 * /phases:
 *   get:
 *     summary: 🚀 Get all learning phases
 *     description: |
 *       Retrieve all available cybersecurity learning phases. The platform offers a structured 3-phase learning system designed to take you from beginner to expert.
 *
 *       **📚 Learning Phases:**
 *       - **🟢 Beginner Phase**: Foundation building with 5 core modules (cryptography, network security, web security, etc.)
 *       - **🟡 Intermediate Phase**: Advanced techniques with 5 specialized modules (penetration testing, incident response, etc.)
 *       - **🔴 Advanced Phase**: Expert-level challenges with 5 mastery modules (advanced persistent threats, malware analysis, etc.)
 *
 *       **🎮 What Each Phase Includes:**
 *       - Interactive labs with hands-on practice
 *       - Security games and challenges
 *       - Terminal emulation with real tools
 *       - Progress tracking and achievements
 *       - Realistic cybersecurity scenarios
 *     tags: [🎯 Learning Phases]
 *     responses:
 *       200:
 *         description: ✅ Successfully retrieved all phases
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
 *                     phases:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Phase'
 *                     count:
 *                       type: number
 *                       example: 3
 *             example:
 *               success: true
 *               data:
 *                 phases:
 *                   - _id: 'beginner'
 *                     name: 'Beginner Phase'
 *                     description: 'Foundation building with core cybersecurity concepts'
 *                     difficulty: 'beginner'
 *                     modules:
 *                       - _id: 'cryptography-basics'
 *                         name: 'Cryptography Basics'
 *                         description: 'Learn the fundamentals of encryption and decryption'
 *                         difficulty: 'beginner'
 *                         estimatedTime: '2-3 hours'
 *                         phase: 'beginner'
 *                       - _id: 'network-security-intro'
 *                         name: 'Network Security Introduction'
 *                         description: 'Understanding network protocols and basic security concepts'
 *                         difficulty: 'beginner'
 *                         estimatedTime: '3-4 hours'
 *                         phase: 'beginner'
 *                     requirements: []
 *                   - _id: 'intermediate'
 *                     name: 'Intermediate Phase'
 *                     description: 'Advanced techniques with specialized modules'
 *                     difficulty: 'intermediate'
 *                     modules:
 *                       - _id: 'penetration-testing'
 *                         name: 'Penetration Testing'
 *                         description: 'Learn ethical hacking and vulnerability assessment'
 *                         difficulty: 'intermediate'
 *                         estimatedTime: '4-5 hours'
 *                         phase: 'intermediate'
 *                     requirements: ['beginner']
 *                   - _id: 'advanced'
 *                     name: 'Advanced Phase'
 *                     description: 'Expert-level challenges and mastery modules'
 *                     difficulty: 'advanced'
 *                     modules:
 *                       - _id: 'malware-analysis'
 *                         name: 'Malware Analysis'
 *                         description: 'Advanced threat detection and reverse engineering'
 *                         difficulty: 'advanced'
 *                         estimatedTime: '6-8 hours'
 *                         phase: 'advanced'
 *                     requirements: ['beginner', 'intermediate']
 *                 count: 3
 *       500:
 *         description: 💥 Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * @route   GET /api/phases
 * @desc    Get all phases
 * @access  Public
 */
router.get("/", phasesController.getAllPhases);

/**
 * @route   POST /api/phases
 * @desc    Create a new phase (admin only)
 * @access  Private (Admin)
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Phase name is required"),
    body("description").notEmpty().withMessage("Phase description is required"),
    body("difficulty")
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid difficulty level"),
  ],
  phasesController.createPhase
);

/**
 * @route   GET /api/phases/:id
 * @desc    Get phase by ID
 * @access  Public
 */
router.get("/:id", phasesController.getPhaseById);

/**
 * @route   PUT /api/phases/:id
 * @desc    Update phase (admin only)
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Phase name cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Phase description cannot be empty"),
    body("difficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid difficulty level"),
  ],
  phasesController.updatePhase
);

/**
 * @route   DELETE /api/phases/:id
 * @desc    Delete phase (admin only)
 * @access  Private (Admin)
 */
router.delete("/:id", phasesController.deletePhase);

/**
 * @route   GET /api/phases/:id/stats
 * @desc    Get phase statistics
 * @access  Public
 */
router.get("/:id/stats", phasesController.getPhaseStats);

module.exports = router;
