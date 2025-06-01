const express = require("express");
const {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  permanentDeleteContent,
  getContentByModule,
  getContentByModuleGrouped,
  getContentByType,
} = require("../controllers/contentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// =============================================================================
// CONTENT ROUTES
// =============================================================================

// @desc    Get all content with filtering and pagination
// @route   GET /api/content
// @access  Private (authenticated users)
router.get("/", protect, getAllContent);

// @desc    Create new content
// @route   POST /api/content
// @access  Private (admin only)
router.post("/", protect, authorize("admin"), createContent);

// @desc    Get content by module ID
// @route   GET /api/content/module/:moduleId
// @access  Private (authenticated users)
router.get("/module/:moduleId", protect, getContentByModule);

// @desc    Get content by module ID grouped by sections
// @route   GET /api/content/module/:moduleId/grouped
// @access  Private (authenticated users)
router.get("/module/:moduleId/grouped", protect, getContentByModuleGrouped);

// @desc    Get content by type
// @route   GET /api/content/type/:type
// @access  Private (authenticated users)
router.get("/type/:type", protect, getContentByType);

// @desc    Get content by ID
// @route   GET /api/content/:id
// @access  Private (authenticated users)
router.get("/:id", protect, getContentById);

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (admin only)
router.put("/:id", protect, authorize("admin"), updateContent);

// @desc    Soft delete content
// @route   DELETE /api/content/:id
// @access  Private (admin only)
router.delete("/:id", protect, authorize("admin"), deleteContent);

// @desc    Permanently delete content
// @route   DELETE /api/content/:id/permanent
// @access  Private (admin only)
router.delete(
  "/:id/permanent",
  protect,
  authorize("admin"),
  permanentDeleteContent
);

module.exports = router;
