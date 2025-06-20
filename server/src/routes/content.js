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
  getSectionsByModule,
  getModuleOverview,
  getFirstContentByModule,
  getContentByModuleGroupedOptimized,
  getContentWithNavigation,
  getContentWithModuleAndProgress,
  reorderContentInSection,
} = require("../controllers/contentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// =============================================================================
// CONTENT ROUTES WITH SWAGGER DOCUMENTATION
// =============================================================================

/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       required:
 *         - id
 *         - moduleId
 *         - type
 *         - title
 *         - description
 *         - order
 *       properties:
 *         id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "64a1b2c3d4e5f6789012345"
 *         moduleId:
 *           type: string
 *           description: Reference to parent module ObjectId
 *           example: "64a1b2c3d4e5f6789012346"
 *         type:
 *           type: string
 *           enum: [video, lab, game, document]
 *           description: Type of content
 *           example: "video"
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Content title
 *           example: "Introduction to Cybersecurity"
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Content description
 *           example: "Learn the fundamentals of cybersecurity principles and best practices"
 *         url:
 *           type: string
 *           description: URL for video content (required for videos)
 *           example: "https://example.com/videos/intro-cybersec.mp4"
 *         instructions:
 *           type: string
 *           maxLength: 2000
 *           description: Instructions for labs and games
 *           example: "Complete the following security assessment tasks and identify vulnerabilities"
 *         order:
 *           type: number
 *           minimum: 1
 *           description: Order within module
 *           example: 1
 *         duration:
 *           type: number
 *           minimum: 1
 *           maximum: 300
 *           description: Duration in minutes
 *           example: 15
 *         metadata:
 *           type: object
 *           description: Additional content-specific data
 *           example: { "difficulty": "beginner", "tags": ["intro", "fundamentals"], "prerequisites": [] }
 *         isActive:
 *           type: boolean
 *           description: Whether content is active
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
 *     ContentGrouped:
 *       type: object
 *       properties:
 *         videos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Content'
 *         labs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Content'
 *         games:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Content'
 *         documents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Content'
 *
 *     CreateContentRequest:
 *       type: object
 *       required:
 *         - id
 *         - moduleId
 *         - type
 *         - title
 *         - description
 *         - order
 *       properties:
 *         id:
 *           type: string
 *           description: Unique content identifier
 *           example: "basic-cybersec-intro-video"
 *         moduleId:
 *           type: string
 *           description: Module ObjectId this content belongs to
 *           example: "64a1b2c3d4e5f6789012346"
 *         type:
 *           type: string
 *           enum: [video, lab, game, document]
 *           description: Type of content
 *           example: "video"
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Content title
 *           example: "Introduction to Cybersecurity"
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Content description
 *           example: "Learn the fundamentals of cybersecurity"
 *         url:
 *           type: string
 *           description: URL for video content (required for videos)
 *           example: "https://example.com/videos/intro.mp4"
 *         instructions:
 *           type: string
 *           maxLength: 2000
 *           description: Instructions for labs and games
 *           example: "Complete the security assessment"
 *         order:
 *           type: number
 *           minimum: 1
 *           description: Order within module
 *           example: 1
 *         duration:
 *           type: number
 *           minimum: 1
 *           maximum: 300
 *           description: Duration in minutes
 *           example: 15
 *         metadata:
 *           type: object
 *           description: Additional content-specific data
 *           example: { "difficulty": "beginner", "tags": ["intro"] }
 */

/**
 * @swagger
 * /content:
 *   get:
 *     summary: 📚 Get all content with filtering and pagination
 *     description: |
 *       Retrieve content with advanced filtering options and pagination support. Perfect for displaying content lists in the learning interface.
 *
 *       **🔍 Filtering Options:**
 *       - Filter by content type (video, lab, game, document)
 *       - Filter by module ID
 *       - Combine multiple filters for precise results
 *       - Only returns active content by default
 *
 *       **📄 Pagination Features:**
 *       - Configurable page size (default: 10 items)
 *       - Page-based navigation
 *       - Total count and pages calculation
 *       - Efficient database querying
 *
 *       **📋 Sorting:**
 *       - Sorted by moduleId first, then by order
 *       - Consistent ordering for learning paths
 *       - Maintains content sequence integrity
 *
 *       **🔒 Security:**
 *       - Requires valid JWT authentication
 *       - User-specific content access control
 *       - Rate limiting applied
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [video, lab, game, document]
 *         description: Filter by content type
 *         example: video
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Filter by module ObjectId
 *         example: "64a1b2c3d4e5f6789012346"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *     responses:
 *       200:
 *         description: Content retrieved successfully
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
 *                   example: "Content retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
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
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Invalid content type'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Access token is required'
 */
router.get("/", protect, getAllContent);

/**
 * @swagger
 * /content:
 *   post:
 *     summary: ➕ Create new content (Admin only)
 *     description: |
 *       Create new learning content for modules. Supports all content types with type-specific validation and automatic module synchronization.
 *
 *       **📝 Content Types:**
 *       - **Videos**: Require URL field for video source
 *       - **Labs**: Require instructions for hands-on activities
 *       - **Games**: Require instructions for interactive challenges
 *       - **Documents**: General content with flexible structure
 *
 *       **🔧 Auto-Sync Features:**
 *       - Automatically updates parent module's content arrays
 *       - Recalculates module duration based on content
 *       - Maintains content ordering within modules
 *       - Validates module existence before creation
 *
 *       **✅ Validation Rules:**
 *       - Unique content ID across all content
 *       - Valid module ObjectId reference
 *       - Type-specific field requirements
 *       - Order uniqueness within module
 *       - Content length and format validation
 *
 *       **🔒 Security:**
 *       - Admin role required
 *       - Input sanitization and validation
 *       - Rate limiting for content creation
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContentRequest'
 *           examples:
 *             video_content:
 *               summary: Video Content Example
 *               value:
 *                 id: "basic-cybersec-intro-video"
 *                 moduleId: "64a1b2c3d4e5f6789012346"
 *                 type: "video"
 *                 title: "Introduction to Cybersecurity"
 *                 description: "Learn the fundamentals of cybersecurity principles and best practices"
 *                 url: "https://example.com/videos/intro-cybersec.mp4"
 *                 order: 1
 *                 duration: 15
 *                 metadata:
 *                   difficulty: "beginner"
 *                   tags: ["intro", "fundamentals"]
 *             lab_content:
 *               summary: Lab Content Example
 *               value:
 *                 id: "basic-cybersec-vulnerability-lab"
 *                 moduleId: "64a1b2c3d4e5f6789012346"
 *                 type: "lab"
 *                 title: "Vulnerability Assessment Lab"
 *                 description: "Hands-on lab to identify and assess security vulnerabilities"
 *                 instructions: "Use the provided tools to scan for vulnerabilities and document your findings"
 *                 order: 2
 *                 duration: 45
 *                 metadata:
 *                   difficulty: "intermediate"
 *                   tools: ["nmap", "nessus"]
 *             game_content:
 *               summary: Game Content Example
 *               value:
 *                 id: "basic-cybersec-security-game"
 *                 moduleId: "64a1b2c3d4e5f6789012346"
 *                 type: "game"
 *                 title: "Security Awareness Challenge"
 *                 description: "Interactive game to test cybersecurity knowledge"
 *                 instructions: "Complete the security scenarios and make the right choices"
 *                 order: 3
 *                 duration: 30
 *                 metadata:
 *                   difficulty: "beginner"
 *                   points: 100
 *     responses:
 *       201:
 *         description: Content created successfully
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
 *                   example: "Content created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Validation error or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_url:
 *                 summary: Video missing URL
 *                 value:
 *                   success: false
 *                   message: 'URL is required for video content'
 *               duplicate_id:
 *                 summary: Duplicate content ID
 *                 value:
 *                   success: false
 *                   message: 'Content with this ID already exists'
 *               invalid_module:
 *                 summary: Invalid module reference
 *                 value:
 *                   success: false
 *                   message: 'Invalid module ID format'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Access denied. Admin role required'
 *       404:
 *         description: Module not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Module not found'
 */
router.post("/", protect, authorize("admin"), createContent);

/**
 * @swagger
 * /content/module/{moduleId}:
 *   get:
 *     summary: 📂 Get content by module ID
 *     description: |
 *       Retrieve all content for a specific module, sorted by order. Essential for displaying module content in learning interfaces.
 *
 *       **📋 Content Organization:**
 *       - Returns content sorted by order field
 *       - Maintains learning path sequence
 *       - Only returns active content
 *       - Includes all content types for the module
 *
 *       **🔍 Use Cases:**
 *       - Module detail pages
 *       - Learning progress tracking
 *       - Content navigation
 *       - Course completion calculations
 *
 *       **⚡ Performance:**
 *       - Optimized database queries
 *       - Minimal data transfer
 *       - Cached results where appropriate
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ObjectId
 *         example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Module content retrieved successfully
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
 *                   example: "Content for module basic-cybersec retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       400:
 *         description: Invalid module ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Invalid module ID format'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/module/:moduleId", protect, getContentByModule);

/**
 * @swagger
 * /content/module-overview/{moduleId}:
 *   get:
 *     summary: 📊 Get module overview
 *     description: |
 *       Retrieve module overview with sections and content.
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ObjectId
 *         example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Module overview retrieved successfully
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
 *                   example: "Module overview retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sections:
 *                       type: array
 *                       items:
 *                         type: string
 *                     content:
 *                       type: object
 *                       properties:
 *                         type: string
 */

router.get("/module-overview/:moduleId", getModuleOverview);

/**
 * @swagger
 * /content/module/{moduleId}/grouped:
 *   get:
 *     summary: 📊 Get content by module ID grouped by type
 *     description: |
 *       Retrieve module content organized by content type (videos, labs, games, documents). Perfect for displaying structured learning sections.
 *
 *       **📂 Grouped Structure:**
 *       - Videos: All video content for the module
 *       - Labs: All hands-on lab exercises
 *       - Games: All interactive games and challenges
 *       - Documents: All reading materials and resources
 *
 *       **🎯 Benefits:**
 *       - Easy UI organization by content type
 *       - Quick access to specific learning activities
 *       - Better user experience in learning interfaces
 *       - Simplified progress tracking by type
 *
 *       **📋 Sorting:**
 *       - Each group sorted by order field
 *       - Maintains learning sequence within types
 *       - Consistent content organization
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ObjectId
 *         example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Grouped module content retrieved successfully
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
 *                   example: "Grouped content for module retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ContentGrouped'
 *       400:
 *         description: Invalid module ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/module/:moduleId/grouped", protect, getContentByModuleGrouped);

/**
 * @swagger
 * /content/module/{moduleId}/first:
 *   get:
 *     summary: 🚀 Get first content by module (T004)
 *     description: |
 *       Retrieve only the first content item for a module. Optimized for initial enroll page load.
 *
 *       **⚡ Performance Features:**
 *       - Returns only first content item
 *       - Minimal data transfer
 *       - Optimized for initial page load
 *       - Reduces initial loading time
 *
 *       **🎯 Use Cases:**
 *       - Initial enroll page content
 *       - First lesson preview
 *       - Quick module entry point
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ObjectId
 *         example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: First content retrieved successfully
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
 *                   example: "First content for module retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Invalid module ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No content found for this module
 */
router.get("/module/:moduleId/first", protect, getFirstContentByModule);

/**
 * @swagger
 * /content/module/{moduleId}/grouped-optimized:
 *   get:
 *     summary: ⚡ Get optimized grouped content (T005)
 *     description: |
 *       Retrieve content grouped by sections with minimal fields for performance optimization.
 *
 *       **🎯 Optimized Fields:**
 *       - sectionTitle: Section name
 *       - contentType: Type of content (video, lab, game, document)
 *       - contentTitle: Content title
 *       - duration: Duration in minutes
 *
 *       **⚡ Performance Benefits:**
 *       - Reduced payload size
 *       - Faster content list loading
 *       - Optimized for content expansion trigger
 *       - Minimal data transfer
 *
 *       **🎯 Use Cases:**
 *       - Content list expansion
 *       - Navigation menus
 *       - Quick content overview
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ObjectId
 *         example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Optimized grouped content retrieved successfully
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
 *                   example: "Optimized grouped content for module retrieved successfully"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         contentId:
 *                           type: string
 *                           description: MongoDB ObjectId of the content
 *                           example: "64a1b2c3d4e5f6789012345"
 *                         sectionTitle:
 *                           type: string
 *                           example: "Fundamentals"
 *                         contentType:
 *                           type: string
 *                           enum: [video, lab, game, document]
 *                           example: "video"
 *                         contentTitle:
 *                           type: string
 *                           example: "Introduction to Cybersecurity"
 *                         duration:
 *                           type: number
 *                           example: 15
 *       400:
 *         description: Invalid module ID format
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/module/:moduleId/grouped-optimized",
  protect,
  getContentByModuleGroupedOptimized
);

/**
 * @swagger
 * /content/type/{type}:
 *   get:
 *     summary: 🎯 Get content by type
 *     description: |
 *       Retrieve content filtered by type (video, lab, game, document). Useful for type-specific interfaces and analytics.
 *
 *       **🔍 Type Filtering:**
 *       - Videos: Educational videos and tutorials
 *       - Labs: Hands-on practical exercises
 *       - Games: Interactive learning games
 *       - Documents: Reading materials and resources
 *
 *       **📊 Optional Module Filtering:**
 *       - Combine type filter with specific module
 *       - Get all videos in a module
 *       - Find all labs across modules
 *       - Type-specific progress tracking
 *
 *       **📈 Use Cases:**
 *       - Content type analytics
 *       - Specialized learning interfaces
 *       - Progress tracking by content type
 *       - Content management and organization
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [video, lab, game, document]
 *         description: Content type
 *         example: video
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Optional module ObjectId filter
 *         example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Content by type retrieved successfully
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
 *                   example: "video content retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       400:
 *         description: Invalid content type or module ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_type:
 *                 summary: Invalid content type
 *                 value:
 *                   success: false
 *                   message: 'Invalid content type'
 *               invalid_module:
 *                 summary: Invalid module ID format
 *                 value:
 *                   success: false
 *                   message: 'Invalid module ID format'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/type/:type", protect, getContentByType);

/**
 * @swagger
 * /content/sections/by-module/{moduleId}:
 *   get:
 *     summary: 🏷️ Get distinct sections by module
 *     description: |
 *       Retrieve all unique section titles for a specific module. Essential for content creation interface with section auto-complete functionality.
 *
 *       **🔍 Section Discovery:**
 *       - Returns distinct section names only
 *       - Alphabetically sorted results
 *       - Only includes active content sections
 *       - Empty array if no sections found
 *
 *       **🎯 Use Cases:**
 *       - Section auto-complete in admin panel
 *       - Content organization insights
 *       - Module structure overview
 *       - Section-based navigation
 *
 *       **⚡ Performance:**
 *       - Optimized distinct queries
 *       - Minimal data transfer
 *       - Fast section enumeration
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ObjectId
 *         example: "64a1b2c3d4e5f6789012346"
 *     responses:
 *       200:
 *         description: Sections retrieved successfully
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
 *                   example: "Sections for module retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Fundamentals", "Practical Labs", "Advanced Topics"]
 *                 count:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Invalid module ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Invalid module ID format'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Module not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Module not found'
 */
router.get("/sections/by-module/:moduleId", protect, getSectionsByModule);

/**
 * @swagger
 * /content/{id}:
 *   get:
 *     summary: 📄 Get content by ID
 *     description: |
 *       Retrieve specific content by its unique identifier. Essential for displaying individual content items and learning activities.
 *
 *       **🔍 Content Access:**
 *       - Returns complete content details
 *       - Includes all metadata and fields
 *       - Only returns active content
 *       - Optimized for single content display
 *
 *       **🎯 Use Cases:**
 *       - Content detail pages
 *       - Learning activity display
 *       - Content editing interfaces
 *       - Direct content linking
 *
 *       **⚡ Performance:**
 *       - Fast single-document queries
 *       - Minimal database load
 *       - Efficient content retrieval
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content unique identifier
 *         example: "basic-cybersec-intro-video"
 *     responses:
 *       200:
 *         description: Content retrieved successfully
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
 *                   example: "Content retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Invalid content ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Invalid content ID format'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Content not found'
 */
router.get("/:id", protect, getContentById);

/**
 * @swagger
 * /content/{id}/with-navigation:
 *   get:
 *     summary: 🧭 Get content with navigation context (T006)
 *     description: |
 *       Retrieve content with navigation information including previous and next content IDs for seamless learning flow.
 *
 *       **🧭 Navigation Features:**
 *       - Previous content ID and title
 *       - Next content ID and title
 *       - Current position in module
 *       - Total content count in module
 *       - Navigation validation
 *       - Disabled state management
 *
 *       **📍 Position Information:**
 *       - Current content position (1-based index)
 *       - Total number of content items in module
 *       - Navigation boundaries (first/last content)
 *       - Section-aware ordering
 *
 *       **🔄 Ordering Logic:**
 *       - Content sorted by section first, then by creation date
 *       - Consistent navigation order across module
 *       - Handles missing or null content gracefully
 *       - Only includes active content in navigation
 *
 *       **⚡ Performance Optimized:**
 *       - Single database query for navigation data
 *       - Lean queries for navigation metadata
 *       - Minimal data transfer for position info
 *       - Efficient indexing on moduleId and section
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content MongoDB ObjectId
 *         example: "64a1b2c3d4e5f6789012347"
 *     responses:
 *       200:
 *         description: Content with navigation retrieved successfully
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
 *                   example: "Content with navigation retrieved successfully"
 *                 data:
 *                   type: object
 *                   allOf:
 *                     - $ref: '#/components/schemas/Content'
 *                     - type: object
 *                       properties:
 *                         navigation:
 *                           type: object
 *                           properties:
 *                             previousContentId:
 *                               type: string
 *                               nullable: true
 *                               description: Previous content ID (null if first)
 *                               example: "64a1b2c3d4e5f6789012346"
 *                             nextContentId:
 *                               type: string
 *                               nullable: true
 *                               description: Next content ID (null if last)
 *                               example: "64a1b2c3d4e5f6789012348"
 *                             currentPosition:
 *                               type: number
 *                               description: Current position (1-based)
 *                               example: 2
 *                             totalCount:
 *                               type: number
 *                               description: Total content count in module
 *                               example: 5
 *                             previousTitle:
 *                               type: string
 *                               nullable: true
 *                               description: Previous content title
 *                               example: "Introduction to Cybersecurity"
 *                             nextTitle:
 *                               type: string
 *                               nullable: true
 *                               description: Next content title
 *                               example: "Advanced Security Concepts"
 *             example:
 *               success: true
 *               message: "Content with navigation retrieved successfully"
 *               data:
 *                 id: "64a1b2c3d4e5f6789012347"
 *                 moduleId: "64a1b2c3d4e5f6789012346"
 *                 type: "video"
 *                 title: "Network Security Fundamentals"
 *                 description: "Learn the basics of network security"
 *                 url: "https://example.com/videos/network-security.mp4"
 *                 section: "Fundamentals"
 *                 duration: 25
 *                 isActive: true
 *                 module:
 *                   id: "64a1b2c3d4e5f6789012346"
 *                   title: "Cybersecurity Basics"
 *                 navigation:
 *                   previousContentId: "64a1b2c3d4e5f6789012346"
 *                   nextContentId: "64a1b2c3d4e5f6789012348"
 *                   currentPosition: 2
 *                   totalCount: 5
 *                   previousTitle: "Introduction to Cybersecurity"
 *                   nextTitle: "Advanced Security Concepts"
 *       400:
 *         description: Invalid content ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Invalid content ID format'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Content not found'
 */
router.get("/:id/with-navigation", protect, getContentWithNavigation);

/**
 * @swagger
 * /content/{id}:
 *   put:
 *     summary: ✏️ Update content (Admin only)
 *     description: |
 *       Update existing content with new information. Maintains data integrity and automatically synchronizes with parent modules.
 *
 *       **🔧 Update Features:**
 *       - Partial updates supported
 *       - Type-specific validation maintained
 *       - Automatic module synchronization
 *       - Order conflict resolution
 *       - Content history preservation
 *
 *       **✅ Validation:**
 *       - Content type consistency
 *       - Required field validation
 *       - Module reference integrity
 *       - Order uniqueness within module
 *       - Data format and length validation
 *
 *       **🔄 Auto-Sync:**
 *       - Updates module content arrays
 *       - Recalculates module duration
 *       - Maintains content ordering
 *       - Triggers module cache refresh
 *
 *       **🔒 Security:**
 *       - Admin role required
 *       - Input sanitization
 *       - Change logging and auditing
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content unique identifier
 *         example: "basic-cybersec-intro-video"
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
 *                 example: "Updated Introduction to Cybersecurity"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Enhanced content covering advanced cybersecurity concepts"
 *               url:
 *                 type: string
 *                 example: "https://example.com/videos/enhanced-intro.mp4"
 *               instructions:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "Updated lab instructions with new scenarios"
 *               duration:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 300
 *                 example: 20
 *               metadata:
 *                 type: object
 *                 example: { "difficulty": "intermediate", "tags": ["intro", "advanced"] }
 *           example:
 *             title: "Advanced Introduction to Cybersecurity"
 *             description: "Enhanced cybersecurity fundamentals with practical examples"
 *             duration: 20
 *             metadata:
 *               difficulty: "intermediate"
 *               tags: ["intro", "advanced", "practical"]
 *     responses:
 *       200:
 *         description: Content updated successfully
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
 *                   example: "Content updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Validation error: Invalid field format'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Content not found'
 */
router.put("/:id", protect, authorize("admin"), updateContent);

/**
 * @swagger
 * /content/{id}:
 *   delete:
 *     summary: 🗑️ Soft delete content (Admin only)
 *     description: |
 *       Soft delete content by setting isActive to false. Preserves data integrity while removing content from active use.
 *
 *       **🔄 Soft Delete Benefits:**
 *       - Preserves content for recovery
 *       - Maintains referential integrity
 *       - Allows content restoration
 *       - Keeps audit trail intact
 *       - Prevents cascading deletions
 *
 *       **🔧 Auto-Sync:**
 *       - Updates module content arrays
 *       - Recalculates module duration
 *       - Maintains content ordering
 *       - Triggers cache refresh
 *
 *       **⚠️ Safety Features:**
 *       - Content remains in database
 *       - Can be reactivated if needed
 *       - Progress tracking preserved
 *       - No data loss
 *
 *       **🔒 Security:**
 *       - Admin role required
 *       - Action logging for auditing
 *       - Confirmation required for safety
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content unique identifier
 *         example: "basic-cybersec-intro-video"
 *     responses:
 *       200:
 *         description: Content soft deleted successfully
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
 *                   example: "Content deleted successfully"
 *       400:
 *         description: Invalid content ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Content not found'
 */
router.delete("/:id", protect, authorize("admin"), deleteContent);

/**
 * @swagger
 * /content/{id}/permanent:
 *   delete:
 *     summary: ⚠️ Permanently delete content (Admin only)
 *     description: |
 *       Permanently remove content from the database. This action is irreversible and should be used with extreme caution.
 *
 *       **⚠️ DANGER ZONE:**
 *       - Completely removes content from database
 *       - Cannot be undone or recovered
 *       - May break learning progress tracking
 *       - Should only be used for cleanup
 *
 *       **🔧 Cascade Effects:**
 *       - Updates module content arrays
 *       - Recalculates module duration
 *       - May affect user progress records
 *       - Triggers full module sync
 *
 *       **🚨 Use Cases:**
 *       - Remove duplicate content
 *       - Clean up test data
 *       - Fix data corruption issues
 *       - Comply with data retention policies
 *
 *       **🔒 Security:**
 *       - Admin role required
 *       - Action logging for auditing
 *       - Multiple confirmations recommended
 *       - Database backup recommended before use
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content unique identifier
 *         example: "test-content-to-delete"
 *     responses:
 *       200:
 *         description: Content permanently deleted
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
 *                   example: "Content permanently deleted"
 *       400:
 *         description: Invalid content ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Content not found'
 */
router.delete(
  "/:id/permanent",
  protect,
  authorize("admin"),
  permanentDeleteContent
);

/**
 * @swagger
 * /content/{id}/with-module-and-progress:
 *   get:
 *     summary: 🚀 Get content with module and progress in one API call (T032)
 *     description: |
 *       Retrieve content with module information and user progress in a single optimized API call.
 *       This endpoint combines content, module data, and progress tracking to reduce API calls for enrolled course pages.
 *
 *       **⚡ Performance Features:**
 *       - Single API call for all content-related data
 *       - Module information populated in response
 *       - Progress tracking with auto-start logic
 *       - Combines functionality of multiple endpoints
 *
 *       **🎯 StartContent Integration:**
 *       - Automatically starts content if not already started
 *       - Creates progress record if none exists
 *       - Updates existing "not-started" progress to "in-progress"
 *       - Returns wasStarted flag to indicate if start logic was executed
 *
 *       **📊 Progress Tracking:**
 *       - Current progress status and percentage
 *       - Start and completion timestamps
 *       - Score tracking for assessments
 *       - Enrollment validation
 *
 *       **🎯 Use Cases:**
 *       - Enrolled course page content display
 *       - Single-call content loading with progress
 *       - Navigation with module context
 *       - Progress tracking integration
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ObjectId
 *         example: "64a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Content with module and progress retrieved successfully
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
 *                   example: "Content with module and progress retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "64a1b2c3d4e5f6789012345"
 *                         title:
 *                           type: string
 *                           example: "Introduction to Cybersecurity"
 *                         description:
 *                           type: string
 *                           example: "Learn the fundamentals of cybersecurity"
 *                         type:
 *                           type: string
 *                           enum: [video, lab, game, document]
 *                           example: "video"
 *                         url:
 *                           type: string
 *                           example: "https://example.com/videos/intro.mp4"
 *                         instructions:
 *                           type: string
 *                           example: "Complete the lab exercises"
 *                         duration:
 *                           type: number
 *                           example: 15
 *                         section:
 *                           type: string
 *                           example: "Fundamentals"
 *                     module:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "64a1b2c3d4e5f6789012346"
 *                         title:
 *                           type: string
 *                           example: "Cybersecurity Fundamentals"
 *                         description:
 *                           type: string
 *                           example: "Master the basic concepts of cybersecurity"
 *                         icon:
 *                           type: string
 *                           example: "🔒"
 *                         color:
 *                           type: string
 *                           example: "text-blue-400"
 *                         difficulty:
 *                           type: string
 *                           example: "beginner"
 *                     progress:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "64a1b2c3d4e5f6789012347"
 *                         status:
 *                           type: string
 *                           enum: [not-started, in-progress, completed]
 *                           example: "in-progress"
 *                         progressPercentage:
 *                           type: number
 *                           example: 1
 *                         startedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2023-06-15T10:30:00.000Z"
 *                         completedAt:
 *                           type: string
 *                           format: date-time
 *                           example: null
 *                         score:
 *                           type: number
 *                           example: null
 *                         maxScore:
 *                           type: number
 *                           example: null
 *                         wasStarted:
 *                           type: boolean
 *                           description: Indicates if startContent logic was executed
 *                           example: true
 *       400:
 *         description: Invalid content ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: User not enrolled in module
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id/with-module-and-progress",
  protect,
  getContentWithModuleAndProgress
);

/**
 * @swagger
 * /content/module/{moduleId}/section/{section}/reorder:
 *   put:
 *     summary: 🔄 Reorder content within a section (Admin only)
 *     description: |
 *       Reorder content items within a specific section of a module. This endpoint allows admins to change the order of content items for better learning flow.
 *
 *       **🎯 Reordering Logic:**
 *       - Only affects content within the specified module and section
 *       - Uses transaction-based updates for data consistency
 *       - Handles order conflicts with temporary negative numbers
 *       - Maintains section boundaries during reordering
 *
 *       **✅ Validation:**
 *       - All content IDs must exist and belong to the specified module and section
 *       - Order values must be positive integers
 *       - All content must be active
 *
 *       **🔒 Security:**
 *       - Admin role required
 *       - Input validation and sanitization
 *       - Transaction rollback on errors
 *     tags: [📚 Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ObjectId
 *         example: "64a1b2c3d4e5f6789012346"
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *         description: Section name
 *         example: "Fundamentals"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentOrders
 *             properties:
 *               contentOrders:
 *                 type: array
 *                 description: Array of content items with their new order
 *                 items:
 *                   type: object
 *                   required:
 *                     - contentId
 *                     - order
 *                   properties:
 *                     contentId:
 *                       type: string
 *                       description: Content ObjectId
 *                       example: "64a1b2c3d4e5f6789012345"
 *                     order:
 *                       type: number
 *                       minimum: 1
 *                       description: New order position
 *                       example: 1
 *           example:
 *             contentOrders:
 *               - contentId: "64a1b2c3d4e5f6789012345"
 *                 order: 1
 *               - contentId: "64a1b2c3d4e5f6789012346"
 *                 order: 2
 *               - contentId: "64a1b2c3d4e5f6789012347"
 *                 order: 3
 *     responses:
 *       200:
 *         description: Content order updated successfully
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
 *                   example: "Content order updated successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_module:
 *                 summary: Invalid module ID
 *                 value:
 *                   success: false
 *                   message: 'Invalid module ID format'
 *               missing_content:
 *                 summary: Content not found
 *                 value:
 *                   success: false
 *                   message: 'Some content not found or doesn\'t belong to this module and section'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during reordering
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Failed to update content order'
 */
router.put(
  "/module/:moduleId/section/:section/reorder",
  protect,
  authorize("admin"),
  reorderContentInSection
);

module.exports = router;
