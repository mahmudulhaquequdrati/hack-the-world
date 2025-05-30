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

// Apply rate limiting to sensitive endpoints
router.use("/login", authLimiter);
router.use("/register", authLimiter);
router.use("/forgot-password", authLimiter);

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
 *       - Secure password hashing with bcrypt
 *
 *       **🎯 Experience Levels:**
 *       - `beginner` - New to cybersecurity (default)
 *       - `intermediate` - Some security knowledge
 *       - `advanced` - Experienced security professional
 *     tags: [🔐 Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
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
 *       - Account lockout after failed attempts
 *       - Rate limiting: 5 attempts per 15 minutes per IP
 *       - Secure password comparison with bcrypt
 *       - JWT token generation with configurable expiration
 *       - Login attempt tracking and monitoring
 *
 *       **💡 Pro Tips:**
 *       - Use either username or email as login
 *       - Token expires in 7 days by default
 *       - Include token in Authorization header: `Bearer <token>`
 *     tags: [🔐 Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginValidation, authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post("/refresh", authController.refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", authController.getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post("/logout", authController.logout);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
  ],
  authController.forgotPassword
);

/**
 * @route   GET /api/auth/validate-token
 * @desc    Validate JWT token
 * @access  Public
 */
router.get("/validate-token", authController.validateToken);

module.exports = router;
