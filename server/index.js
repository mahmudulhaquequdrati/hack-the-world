require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Import configurations and utilities
const database = require("./src/config/database");
const errorHandler = require("./src/middleware/errorHandler");
const { specs, swaggerUi, swaggerOptions } = require("./src/config/swagger");

// Import routes
const authRoutes = require("./src/routes/auth");
const profileRoutes = require("./src/routes/profile");
const phaseRoutes = require("./src/routes/phase");
const moduleRoutes = require("./src/routes/modules");
const contentRoutes = require("./src/routes/content");
const enrollmentRoutes = require("./src/routes/enrollment");
const progressRoutes = require("./src/routes/progress");

/**
 * Terminal Hacks - Terminal Hacks Learning Platform API
 * Express server with MongoDB and JWT authentication
 */
const app = express();
const PORT = process.env.PORT || 5001;

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Basic security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000,
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: Math.ceil(
      (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000
    ),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, desktop apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Define allowed origins
    const allowedOrigins = [
      process.env.CLIENT_URL || "http://localhost:5173", // Frontend app
      process.env.ADMIN_URL || "http://localhost:5174", // Admin panel
      "http://localhost:5001", // Same-origin requests
    ];

    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));

// =============================================================================
// GENERAL MIDDLEWARE
// =============================================================================

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// =============================================================================
// ROUTES
// =============================================================================

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: database.getConnectionStatus() ? "Connected" : "Disconnected",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/phases", phaseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);

// Swagger API Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// API documentation route
app.get("/api", (req, res) => {
  res.json({
    message: "Hack The World API",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      auth: "/api/auth",
      profile: "/api/profile",
      phases: "/api/phases",
      modules: "/api/modules",
      content: "/api/content",
      enrollments: "/api/enrollments",
      progress: "/api/progress",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

app.use(errorHandler);

// =============================================================================
// SERVER STARTUP
// =============================================================================

/**
 * Start the server
 */
async function startServer() {
  try {
    // Connect to database
    await database.connect();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
