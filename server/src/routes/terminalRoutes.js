const express = require("express");
const {
  executeCommand,
  getTerminalConfig,
  updateTerminalConfig,
} = require("../controllers/terminalController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All terminal routes require authentication
router.use(protect);

// Execute terminal command for specific content
router.post("/:contentId/execute", executeCommand);

// Get terminal configuration for content
router.get("/:contentId/config", getTerminalConfig);

// Update terminal configuration for content (admin only)
router.put("/:contentId/config", authorize("admin"), updateTerminalConfig);

module.exports = router;
