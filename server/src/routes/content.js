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
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "64a1b2c3d4e5f6789012345"
 *         id:
 *           type: string
 *           description: Unique content identifier
 *           example: "basic-cybersec-intro-video"
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

module.exports = router;
