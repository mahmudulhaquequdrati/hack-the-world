/**
 * @swagger
 * tags:
 *   name: 🔐 Authentication
 *   description: User authentication and account management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: '64a1b2c3d4e5f6789012345'
 *           description: 'Unique user identifier'
 *         username:
 *           type: string
 *           example: 'cyberhacker2024'
 *           description: 'Unique username'
 *         email:
 *           type: string
 *           format: email
 *           example: 'hacker@cybersec.com'
 *           description: 'User email address'
 *         profile:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: 'John'
 *             lastName:
 *               type: string
 *               example: 'Doe'
 *             displayName:
 *               type: string
 *               example: 'John Doe'
 *             avatar:
 *               type: string
 *               example: 'https://avatar.url'
 *         experienceLevel:
 *           type: string
 *           enum: ['beginner', 'intermediate', 'advanced', 'expert']
 *           example: 'beginner'
 *         stats:
 *           type: object
 *           properties:
 *             totalPoints:
 *               type: number
 *               example: 1250
 *             level:
 *               type: number
 *               example: 5
 *             coursesCompleted:
 *               type: number
 *               example: 3
 *             labsCompleted:
 *               type: number
 *               example: 12
 *             gamesCompleted:
 *               type: number
 *               example: 8
 *             achievementsEarned:
 *               type: number
 *               example: 15
 *         role:
 *           type: string
 *           enum: ['user', 'admin']
 *           example: 'user'
 *         status:
 *           type: string
 *           enum: ['active', 'inactive', 'suspended']
 *           example: 'active'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2024-01-15T10:30:00.000Z'
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           pattern: '^[a-z0-9_-]+$'
 *           example: 'cyberhacker2024'
 *           description: 'Username (lowercase letters, numbers, underscore, hyphen only)'
 *         email:
 *           type: string
 *           format: email
 *           example: 'hacker@cybersec.com'
 *           description: 'Valid email address'
 *         password:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *           example: 'SecurePass123!'
 *           description: 'Password with uppercase, lowercase, number, and special character'
 *         firstName:
 *           type: string
 *           maxLength: 50
 *           example: 'John'
 *           description: 'First name (optional)'
 *         lastName:
 *           type: string
 *           maxLength: 50
 *           example: 'Doe'
 *           description: 'Last name (optional)'
 *         experienceLevel:
 *           type: string
 *           enum: ['beginner', 'intermediate', 'advanced']
 *           example: 'beginner'
 *           description: 'Cybersecurity experience level'
 *     LoginRequest:
 *       type: object
 *       required:
 *         - login
 *         - password
 *       properties:
 *         login:
 *           type: string
 *           example: 'cyberhacker2024'
 *           description: 'Username or email address'
 *         password:
 *           type: string
 *           example: 'SecurePass123!'
 *           description: 'User password'
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: 'Authentication successful'
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *               description: 'JWT authentication token'
 *             expiresIn:
 *               type: string
 *               example: '7d'
 *               description: 'Token expiration time'
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: 'hacker@cybersec.com'
 *           description: 'Email address to send reset instructions'
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           example: 'a1b2c3d4e5f6789012345678901234567890abcdef'
 *           description: 'Password reset token from email'
 *         password:
 *           type: string
 *           minLength: 8
 *           pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]'
 *           example: 'NewSecurePass123!'
 *           description: 'New password with complexity requirements'
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: 'Operation completed successfully'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: 'An error occurred'
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: 'email'
 *               msg:
 *                 type: string
 *                 example: 'Please provide a valid email'
 *               value:
 *                 type: string
 *                 example: 'invalid-email'
 */

const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to sensitive endpoints (disabled for tests)
if (process.env.NODE_ENV !== "test") {
  router.use("/login", authLimiter);
  router.use("/register", authLimiter);
  router.use("/forgot-password", authLimiter);
  router.use("/reset-password", authLimiter);
}

// Validation middleware
const registerValidation = [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-z0-9_-]+$/)
    .withMessage(
      "Username can only contain lowercase letters, numbers, underscores, and hyphens"
    ),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  body("firstName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),
];

const loginValidation = [
  body("login").notEmpty().withMessage("Username or email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
];

const resetPasswordValidation = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 32 })
    .withMessage("Invalid reset token format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
];

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 🚀 Register a new hacker account
 *     description: |
 *       Create a new account to start your cybersecurity journey. This endpoint creates a new user with secure password hashing and JWT token generation.
 *
 *       **🔒 Security Features:**
 *       - Password strength validation (8+ chars, uppercase, lowercase, number, special char)
 *       - Username uniqueness validation
 *       - Email format validation and normalization
 *       - Rate limiting: 5 attempts per 15 minutes per IP
 *       - Secure password hashing with bcrypt (12 rounds)
 *       - Immediate JWT token generation for seamless login
 *
 *       **🎯 Experience Levels:**
 *       - `beginner` - New to cybersecurity (default)
 *       - `intermediate` - Some security knowledge
 *       - `advanced` - Experienced security professional
 *
 *       **📧 Additional Features:**
 *       - Welcome email sent automatically
 *       - User profile initialization with stats
 *       - Activity tracking setup
 *     tags: [🔐 Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             beginner:
 *               summary: Beginner user registration
 *               value:
 *                 username: 'cybernewbie2024'
 *                 email: 'newbie@cybersec.com'
 *                 password: 'SecurePass123!'
 *                 firstName: 'Alice'
 *                 lastName: 'Johnson'
 *                 experienceLevel: 'beginner'
 *             advanced:
 *               summary: Advanced user registration
 *               value:
 *                 username: 'cyberexpert2024'
 *                 email: 'expert@cybersec.com'
 *                 password: 'AdvancedPass456!'
 *                 firstName: 'Bob'
 *                 lastName: 'Smith'
 *                 experienceLevel: 'advanced'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation errors or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   success: false
 *                   message: 'Validation failed'
 *                   errors:
 *                     - field: 'password'
 *                       msg: 'Password must contain at least one uppercase letter'
 *                       value: 'weakpass'
 *               duplicate_user:
 *                 summary: User already exists
 *                 value:
 *                   success: false
 *                   message: 'User with this email already exists'
 *       429:
 *         description: Too many registration attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", registerValidation, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 🔑 Login to your hacker account
 *     description: |
 *       Authenticate with your credentials to access the cybersecurity learning platform. Returns a JWT token for subsequent API calls.
 *
 *       **🔒 Security Features:**
 *       - Account lockout after 5 failed attempts
 *       - Rate limiting: 5 attempts per 15 minutes per IP
 *       - Secure password comparison with bcrypt
 *       - JWT token generation with configurable expiration (7d default)
 *       - Login attempt tracking and monitoring
 *       - Last login timestamp update
 *
 *       **💡 Pro Tips:**
 *       - Use either username or email as login
 *       - Token expires in 7 days by default
 *       - Include token in Authorization header: `Bearer <token>`
 *       - Account locks for 2 hours after 5 failed attempts
 *     tags: [🔐 Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             username_login:
 *               summary: Login with username
 *               value:
 *                 login: 'cyberhacker2024'
 *                 password: 'SecurePass123!'
 *             email_login:
 *               summary: Login with email
 *               value:
 *                 login: 'hacker@cybersec.com'
 *                 password: 'SecurePass123!'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Invalid credentials'
 *       403:
 *         description: Account not active
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Account is not active'
 *       423:
 *         description: Account locked due to failed attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Account locked due to too many failed login attempts'
 *       429:
 *         description: Too many login attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", loginValidation, authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 👤 Get current user profile
 *     description: |
 *       Retrieve the current authenticated user's profile information. Requires a valid JWT token in the Authorization header.
 *
 *       **🔒 Security Features:**
 *       - JWT token validation
 *       - User account status verification
 *       - Last active timestamp update
 *       - Sensitive information filtering
 *
 *       **📊 Profile Information:**
 *       - User basic info (username, email, profile details)
 *       - Learning statistics and progress
 *       - Achievement counts and levels
 *       - Account status and role information
 *
 *       **⚡ Performance:**
 *       - Cached user data for optimal response times
 *       - Automatic activity tracking
 *       - Efficient database queries
 *     tags: [🔐 Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               data:
 *                 user:
 *                   id: '64a1b2c3d4e5f6789012345'
 *                   username: 'cyberhacker2024'
 *                   email: 'hacker@cybersec.com'
 *                   profile:
 *                     firstName: 'John'
 *                     lastName: 'Doe'
 *                     displayName: 'John Doe'
 *                   experienceLevel: 'intermediate'
 *                   stats:
 *                     totalPoints: 1250
 *                     level: 5
 *                     coursesCompleted: 3
 *                     labsCompleted: 12
 *                     gamesCompleted: 8
 *                     achievementsEarned: 15
 *                   role: 'user'
 *                   status: 'active'
 *                   createdAt: '2024-01-15T10:30:00.000Z'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_token:
 *                 summary: No token provided
 *                 value:
 *                   success: false
 *                   message: 'Access token is required'
 *               invalid_token:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   message: 'Invalid or expired token'
 *       404:
 *         description: User not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me", authController.getCurrentUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 🚪 Logout from your account
 *     description: |
 *       Logout the current user. This is primarily a client-side operation as JWT tokens are stateless, but this endpoint provides a consistent logout experience.
 *
 *       **🔒 Security Notes:**
 *       - JWT tokens are stateless, so server-side logout is acknowledgment only
 *       - Client should remove token from storage after successful logout
 *       - Session data is cleared on client side
 *       - User activity is logged for security monitoring
 *
 *       **📱 Client Implementation:**
 *       ```javascript
 *       // After successful logout response:
 *       localStorage.removeItem('hackToken');
 *       // Redirect to login page
 *       window.location.href = '/login';
 *       ```
 *
 *       **⚡ Best Practices:**
 *       - Always call this endpoint before clearing client storage
 *       - Implement proper error handling
 *       - Redirect to public pages after logout
 *     tags: [🔐 Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: 'Logged out successfully'
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: 📧 Send password reset email
 *     description: |
 *       Send a password reset email to the user. For security reasons, this endpoint always returns success, regardless of whether the email exists in the system.
 *
 *       **🔒 Security Features:**
 *       - Rate limiting: 5 attempts per 15 minutes per IP
 *       - Email existence obfuscation (always returns success)
 *       - 10-minute token expiration for security
 *       - Secure token generation using crypto.randomBytes
 *       - SHA-256 token hashing for database storage
 *
 *       **📧 Email Features:**
 *       - Cybersecurity-themed HTML email template
 *       - White background with professional green accents
 *       - Clear security warnings and instructions
 *       - Branded design with terminal aesthetic
 *       - Mobile-responsive email layout
 *
 *       **⚡ Implementation Details:**
 *       - Token expires in exactly 10 minutes
 *       - Email sent via Resend service
 *       - Graceful error handling (email failures don't expose user existence)
 *       - Comprehensive logging for security monitoring
 *     tags: [🔐 Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           example:
 *             email: 'hacker@cybersec.com'
 *     responses:
 *       200:
 *         description: Reset instructions sent (always returned for security)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: 'If an account with that email exists, we have sent password reset instructions'
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Validation failed'
 *               errors:
 *                 - field: 'email'
 *                   msg: 'Please provide a valid email'
 *                   value: 'invalid-email'
 *       429:
 *         description: Too many reset attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  authController.forgotPassword
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: 🔄 Reset password with token
 *     description: |
 *       Reset the user's password using a valid reset token. The token is sent via email and expires in 10 minutes for security.
 *
 *       **🔒 Security Features:**
 *       - Rate limiting: 5 attempts per 15 minutes per IP
 *       - Token expiration validation (10 minutes)
 *       - Secure token verification with SHA-256 hashing
 *       - Password strength validation (same as registration)
 *       - Automatic login after successful reset
 *       - Password change timestamp update
 *
 *       **🚀 User Experience:**
 *       - Immediate JWT token generation for seamless login
 *       - Password reset confirmation email sent automatically
 *       - Activity tracking and login statistics update
 *       - No need for separate login after reset
 *
 *       **📧 Confirmation Email:**
 *       - Professional confirmation email sent after successful reset
 *       - Security best practices included in email
 *       - Contact information for suspicious activity reporting
 *       - Links to dashboard and login page for convenience
 *     tags: [🔐 Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *           example:
 *             token: 'a1b2c3d4e5f6789012345678901234567890abcdef'
 *             password: 'NewSecurePass123!'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid or expired token, or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_token:
 *                 summary: Invalid or expired token
 *                 value:
 *                   success: false
 *                   message: 'Invalid or expired password reset token'
 *               validation_error:
 *                 summary: Password validation error
 *                 value:
 *                   success: false
 *                   message: 'Validation failed'
 *                   errors:
 *                     - field: 'password'
 *                       msg: 'Password must contain at least one uppercase letter'
 *                       value: 'weakpass'
 *       429:
 *         description: Too many reset attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/reset-password",
  resetPasswordValidation,
  authController.resetPassword
);

module.exports = router;
