const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const mongoose = require("mongoose");

/**
 * Create a test user with admin privileges
 */
const createTestUser = async (userData = {}) => {
  const defaultUserData = {
    username: "testadmin",
    email: "testadmin@test.com",
    password: "TestPassword123!",
    role: "admin",
    adminStatus: "active",
    status: "active",
    profile: {
      firstName: "Test",
      lastName: "Admin",
      displayName: "Test Admin",
    },
    experienceLevel: "expert",
    stats: {
      totalPoints: 0,
      level: 1,
      coursesCompleted: 0,
      labsCompleted: 0,
      gamesCompleted: 0,
      achievementsEarned: 0,
    },
    security: {
      loginAttempts: 0,
      lockUntil: null,
      passwordChangedAt: null,
      twoFactorEnabled: false,
    },
  };

  const user = await User.create({ ...defaultUserData, ...userData });
  return user;
};

/**
 * Generate a JWT token for testing
 */
const generateTestToken = (userId, role = "admin") => {
  const payload = {
    userId: userId,
    role: role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Create a test user and return both user and token
 */
const createTestUserWithToken = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateTestToken(user._id, user.role);

  return {
    user,
    token,
    authHeader: `Bearer ${token}`,
  };
};

/**
 * Create a regular user (non-admin) for testing
 */
const createTestRegularUser = async (userData = {}) => {
  const defaultUserData = {
    username: "testuser",
    email: "testuser@test.com",
    password: "TestPassword123!",
    role: "user",
    status: "active",
    profile: {
      firstName: "Test",
      lastName: "User",
      displayName: "Test User",
    },
    experienceLevel: "beginner",
    stats: {
      totalPoints: 0,
      level: 1,
      coursesCompleted: 0,
      labsCompleted: 0,
      gamesCompleted: 0,
      achievementsEarned: 0,
    },
    security: {
      loginAttempts: 0,
      lockUntil: null,
      passwordChangedAt: null,
      twoFactorEnabled: false,
    },
  };

  const user = await User.create({ ...defaultUserData, ...userData });
  const token = generateTestToken(user._id, user.role);

  return {
    user,
    token,
    authHeader: `Bearer ${token}`,
  };
};

/**
 * Clean up test users
 */
const cleanupTestUsers = async () => {
  await User.deleteMany({
    email: { $in: ["testadmin@test.com", "testuser@test.com"] },
  });
};

module.exports = {
  createTestUser,
  generateTestToken,
  createTestUserWithToken,
  createTestRegularUser,
  cleanupTestUsers,
};
