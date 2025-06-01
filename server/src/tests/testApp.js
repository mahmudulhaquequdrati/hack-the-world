require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Import configurations and utilities
const errorHandler = require("../middleware/errorHandler");

// Import routes
const authRoutes = require("../routes/auth");
const profileRoutes = require("../routes/profile");
const phaseRoutes = require("../routes/phase");
const moduleRoutes = require("../routes/modules");
// TODO: Add these routes when they are created
// const gameRoutes = require("../routes/games");
// const labRoutes = require("../routes/labs");
// const userRoutes = require("../routes/users");
// const achievementRoutes = require("../routes/achievements");

/**
 * Test App - Express app without server startup for testing
 */
const app = express();

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

// Rate limiting (disabled for tests)
if (process.env.NODE_ENV !== "test") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", limiter);
}

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

// Logging (minimal for tests)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// =============================================================================
// ROUTES
// =============================================================================

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// For testing purposes, create bypass middleware that simulates an admin user
const testAuthBypass = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    // Simulate an authenticated admin user for testing
    req.user = {
      id: "test-admin-id",
      username: "testadmin",
      email: "testadmin@test.com",
      role: "admin",
      adminStatus: "active",
    };
  }
  next();
};

// Apply test auth bypass to API routes when in test mode
if (process.env.NODE_ENV === "test") {
  app.use("/api", testAuthBypass);
}

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/phases", phaseRoutes);
app.use("/api/modules", moduleRoutes);

// API documentation route
app.get("/api", (req, res) => {
  res.json({
    message: "Hack The World API - Test Mode",
    version: "1.0.0",
    environment: "test",
    endpoints: {
      auth: "/api/auth",
      profile: "/api/profile",
      phases: "/api/phases",
      modules: "/api/modules",
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

module.exports = app;
