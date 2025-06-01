const express = require("express");
const {
  getProfile,
  changePassword,
  updateBasicProfile,
  updateAvatar,
} = require("../controllers/profileController");
const { protect } = require("../middleware/auth");
const {
  changePasswordValidation,
  updateBasicProfileValidation,
  updateAvatarValidation,
} = require("../middleware/validation/profileValidation");

const router = express.Router();

// All profile routes require authentication
router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           maxLength: 50
 *           example: "John"
 *         lastName:
 *           type: string
 *           maxLength: 50
 *           example: "Doe"
 *         displayName:
 *           type: string
 *           maxLength: 100
 *           example: "John Doe"
 *         avatar:
 *           type: string
 *           format: uri
 *           example: "https://example.com/avatar.jpg"
 *         bio:
 *           type: string
 *           maxLength: 500
 *           example: "Cybersecurity enthusiast and ethical hacker"
 *         location:
 *           type: string
 *           maxLength: 100
 *           example: "San Francisco, CA"
 *         website:
 *           type: string
 *           format: uri
 *           example: "https://johndoe.com"
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         username:
 *           type: string
 *           example: "johndoe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         profile:
 *           $ref: '#/components/schemas/UserProfile'
 *         experienceLevel:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *           example: "intermediate"
 *         stats:
 *           type: object
 *           properties:
 *             totalPoints:
 *               type: integer
 *               example: 1250
 *             level:
 *               type: integer
 *               example: 5
 *             coursesCompleted:
 *               type: integer
 *               example: 3
 *             labsCompleted:
 *               type: integer
 *               example: 12
 *             gamesCompleted:
 *               type: integer
 *               example: 8
 *             achievementsEarned:
 *               type: integer
 *               example: 15
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           minLength: 1
 *           example: "currentPassword123!"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>])"
 *           example: "newPassword456!"
 *           description: "Must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
 *
 *     UpdateBasicProfileRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           maxLength: 50
 *           example: "John"
 *         lastName:
 *           type: string
 *           maxLength: 50
 *           example: "Doe"
 *         displayName:
 *           type: string
 *           maxLength: 100
 *           example: "John Doe"
 *         bio:
 *           type: string
 *           maxLength: 500
 *           example: "Cybersecurity enthusiast and ethical hacker"
 *         location:
 *           type: string
 *           maxLength: 100
 *           example: "San Francisco, CA"
 *         website:
 *           type: string
 *           format: uri
 *           example: "https://johndoe.com"
 *
 *     UpdateAvatarRequest:
 *       type: object
 *       required:
 *         - avatar
 *       properties:
 *         avatar:
 *           type: string
 *           format: uri
 *           example: "https://example.com/new-avatar.jpg"
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error occurred"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "email"
 *               msg:
 *                 type: string
 *                 example: "Invalid email format"
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the authenticated user's complete profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/").get(getProfile);

/**
 * @swagger
 * /profile/change-password:
 *   put:
 *     summary: Change user password
 *     description: Update the authenticated user's password with security validations
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or invalid current password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/change-password").put(changePasswordValidation, changePassword);

/**
 * @swagger
 * /profile/basic:
 *   put:
 *     summary: Update basic profile information
 *     description: Update the authenticated user's basic profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBasicProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/basic").put(updateBasicProfileValidation, updateBasicProfile);

/**
 * @swagger
 * /profile/avatar:
 *   put:
 *     summary: Update user avatar
 *     description: Update the authenticated user's avatar image URL
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAvatarRequest'
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/avatar").put(updateAvatarValidation, updateAvatar);

module.exports = router;
