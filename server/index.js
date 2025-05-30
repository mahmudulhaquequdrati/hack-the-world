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
const phaseRoutes = require("./src/routes/phases");
const moduleRoutes = require("./src/routes/modules");
const gameRoutes = require("./src/routes/games");
const labRoutes = require("./src/routes/labs");
const userRoutes = require("./src/routes/users");
const achievementRoutes = require("./src/routes/achievements");

/**
 * Hack The World - Cybersecurity Learning Platform API
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
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
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
  origin: process.env.CLIENT_URL || "http://localhost:5173",
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
app.get("/health", (req, res) => {
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
app.use("/api/phases", phaseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/users", userRoutes);
app.use("/api/achievements", achievementRoutes);

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
      phases: "/api/phases",
      modules: "/api/modules",
      games: "/api/games",
      labs: "/api/labs",
      users: "/api/users",
      achievements: "/api/achievements",
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
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
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
