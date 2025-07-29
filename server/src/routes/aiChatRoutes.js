const express = require("express");
const {
  startChatSession,
  sendChatMessage,
  executeTerminalCommand,
  getAvailableTools,
} = require("../controllers/aiChatController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// =============================================================================
// AI CHAT ROUTES WITH SWAGGER DOCUMENTATION
// =============================================================================

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatSession:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *           description: Unique session identifier
 *           example: "64a1b2c3d4e5f6789012345-1640995200000"
 *         context:
 *           type: object
 *           description: Learning context for the session
 *         initialResponse:
 *           type: string
 *           description: AI's initial greeting message
 *         availableCommands:
 *           type: array
 *           items:
 *             type: string
 *           description: Available terminal commands for this content
 *
 *     ChatMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: User's message
 *           example: "How do I use nmap?"
 *         response:
 *           type: string
 *           description: AI's response
 *         timestamp:
 *           type: string
 *           format: date-time
 *         suggestions:
 *           type: array
 *           items:
 *             type: string
 *           description: Suggested follow-up questions
 *
 *     TerminalCommand:
 *       type: object
 *       properties:
 *         command:
 *           type: string
 *           description: Terminal command to execute
 *           example: "nmap -sV localhost"
 *         output:
 *           type: string
 *           description: Command output
 *         aiExplanation:
 *           type: string
 *           description: AI explanation of the command
 *         suggestions:
 *           type: array
 *           items:
 *             type: string
 *           description: Suggested related commands
 *
 *     AvailableTools:
 *       type: object
 *       properties:
 *         tools:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *               description:
 *                 type: string
 *         contentType:
 *           type: string
 *         contentTitle:
 *           type: string
 */

/**
 * @swagger
 * /api/ai-chat/start:
 *   post:
 *     summary: 🤖 Start AI chat session with content context
 *     description: |
 *       Initialize an AI chat session with learning context based on current content/module.
 *       The AI will provide personalized assistance based on the content type and user progress.
 *
 *       **🎯 Context Features:**
 *       - Content-specific AI responses
 *       - Progress-aware suggestions
 *       - Available tools configuration
 *       - Module and phase context
 *
 *       **🚀 Session Benefits:**
 *       - Personalized learning assistance
 *       - Context-aware responses
 *       - Available command suggestions
 *       - Progress tracking integration
 *     tags: [🤖 AI Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *                 description: Content ID for context
 *                 example: "64a1b2c3d4e5f6789012345"
 *               moduleId:
 *                 type: string
 *                 description: Module ID for additional context
 *                 example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Chat session started successfully
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
 *                   example: "AI chat session started"
 *                 data:
 *                   $ref: '#/components/schemas/ChatSession'
 *       404:
 *         description: Content or module not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/start", protect, startChatSession);

/**
 * @swagger
 * /api/ai-chat/message:
 *   post:
 *     summary: 💬 Send message to AI chat
 *     description: |
 *       Send a message to the AI chat and receive a context-aware response.
 *       The AI will provide responses based on the current learning context.
 *
 *       **🧠 AI Capabilities:**
 *       - Context-aware responses
 *       - Learning progress consideration
 *       - Content-specific guidance
 *       - Interactive suggestions
 *
 *       **📚 Response Types:**
 *       - Concept explanations
 *       - Command guidance
 *       - Learning tips
 *       - Follow-up suggestions
 *     tags: [🤖 AI Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's message to the AI
 *                 example: "How do I scan for open ports?"
 *               sessionId:
 *                 type: string
 *                 description: Chat session ID
 *                 example: "64a1b2c3d4e5f6789012345-1640995200000"
 *               contentId:
 *                 type: string
 *                 description: Current content ID for context
 *                 example: "64a1b2c3d4e5f6789012345"
 *               moduleId:
 *                 type: string
 *                 description: Current module ID for context
 *                 example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Message processed successfully
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
 *                   example: "Message processed"
 *                 data:
 *                   $ref: '#/components/schemas/ChatMessage'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/message", protect, sendChatMessage);

/**
 * @swagger
 * /api/ai-chat/terminal:
 *   post:
 *     summary: 💻 Execute terminal command with AI assistance
 *     description: |
 *       Execute a terminal command with AI-powered assistance and explanations.
 *       Perfect for learning cybersecurity tools with guided explanations.
 *
 *       **⚡ Features:**
 *       - Command simulation
 *       - AI explanations
 *       - Security context
 *       - Related command suggestions
 *
 *       **🛠️ Command Types:**
 *       - Network scanning (nmap, netstat)
 *       - File operations (ls, cat, grep)
 *       - System commands (pwd, whoami)
 *       - Security tools (custom simulations)
 *     tags: [🤖 AI Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - command
 *             properties:
 *               command:
 *                 type: string
 *                 description: Terminal command to execute
 *                 example: "nmap -sV localhost"
 *               contentId:
 *                 type: string
 *                 description: Content ID for context-aware command processing
 *                 example: "64a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Command executed successfully
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
 *                   example: "Command executed"
 *                 data:
 *                   $ref: '#/components/schemas/TerminalCommand'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/terminal", protect, executeTerminalCommand);

/**
 * @swagger
 * /api/ai-chat/tools/{contentId}:
 *   get:
 *     summary: 🔧 Get available tools for content
 *     description: |
 *       Retrieve the list of available cybersecurity tools for specific content.
 *       Tools are configured per content to provide relevant learning experiences.
 *
 *       **🎯 Tool Categories:**
 *       - Terminal and command line
 *       - Network scanning tools
 *       - Vulnerability scanners
 *       - Digital forensics kits
 *       - Malware analysis tools
 *       - Web security tools
 *       - Cryptography tools
 *
 *       **🚀 Dynamic Loading:**
 *       - Content-specific tools
 *       - Learning phase appropriate
 *       - Progressive tool unlocking
 *       - Contextual tool recommendations
 *     tags: [🤖 AI Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: contentId
 *         in: path
 *         required: true
 *         description: Content ID to get available tools for
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Available tools retrieved successfully
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
 *                   example: "Available tools retrieved"
 *                 data:
 *                   $ref: '#/components/schemas/AvailableTools'
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/tools/:contentId", protect, getAvailableTools);

module.exports = router;
