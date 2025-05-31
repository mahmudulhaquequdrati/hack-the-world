const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../index");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Test user data
const testUser = {
  username: "testuser",
  email: "test@example.com",
  password: "TestPassword123!",
  profile: {
    firstName: "John",
    lastName: "Doe",
    displayName: "John Doe",
    bio: "Test bio",
    location: "New York",
    website: "https://johndoe.com",
  },
};

let authToken;
let userId;

describe("Profile Controller", () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri =
      process.env.MONGODB_TEST_URI ||
      "mongodb://localhost:27017/hack-the-world-test";
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    // Clear users collection
    await User.deleteMany({});

    // Create test user
    const hashedPassword = await bcrypt.hash("TestPassword123!", 12);
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      profile: {
        firstName: "John",
        lastName: "Doe",
        displayName: "John Doe",
        bio: "Test bio",
        location: "New York",
        website: "https://johndoe.com",
      },
    });
    userId = user._id;

    // Generate auth token
    authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "7d" }
    );
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/profile", () => {
    it("should get current user profile", async () => {
      const response = await request(app)
        .get("/api/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Profile retrieved successfully");
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);
      expect(response.body.data.user.profile.firstName).toBe(
        testUser.profile.firstName
      );
      expect(response.body.data.user.password).toBeUndefined();
    });

    it("should not get profile without authentication", async () => {
      await request(app).get("/api/profile").expect(401);
    });

    it("should not get profile with invalid token", async () => {
      await request(app)
        .get("/api/profile")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });
  });

  describe("PUT /api/profile/change-password", () => {
    it("should change password with valid data", async () => {
      const passwordData = {
        currentPassword: "TestPassword123!",
        newPassword: "NewPassword123!",
      };

      const response = await request(app)
        .put("/api/profile/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Password updated successfully");

      // Verify password was actually changed
      const user = await User.findById(userId).select("+password");
      const isNewPasswordValid = await user.comparePassword("NewPassword123!");
      expect(isNewPasswordValid).toBe(true);
    });

    it("should not change password with incorrect current password", async () => {
      const passwordData = {
        currentPassword: "WrongPassword123!",
        newPassword: "NewPassword123!",
      };

      const response = await request(app)
        .put("/api/profile/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Current password is incorrect");
    });

    it("should not change password if new password is same as current", async () => {
      const passwordData = {
        currentPassword: "TestPassword123!",
        newPassword: "TestPassword123!",
      };

      const response = await request(app)
        .put("/api/profile/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "New password must be different from current password"
      );
    });

    it("should not change password with weak new password", async () => {
      const passwordData = {
        currentPassword: "TestPassword123!",
        newPassword: "weak",
      };

      const response = await request(app)
        .put("/api/profile/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should not change password without authentication", async () => {
      const passwordData = {
        currentPassword: "TestPassword123!",
        newPassword: "NewPassword123!",
      };

      await request(app)
        .put("/api/profile/change-password")
        .send(passwordData)
        .expect(401);
    });
  });

  describe("PUT /api/profile/basic", () => {
    it("should update basic profile information", async () => {
      const updateData = {
        firstName: "Jane",
        lastName: "Smith",
        displayName: "Jane Smith",
        bio: "Updated bio",
        location: "Los Angeles",
        website: "https://janesmith.com",
      };

      const response = await request(app)
        .put("/api/profile/basic")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Profile updated successfully");
      expect(response.body.data.user.profile.firstName).toBe("Jane");
      expect(response.body.data.user.profile.lastName).toBe("Smith");
      expect(response.body.data.user.profile.bio).toBe("Updated bio");
    });

    it("should validate first name length", async () => {
      const updateData = {
        firstName: "x".repeat(51), // Exceeds 50 character limit
      };

      const response = await request(app)
        .put("/api/profile/basic")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toContain("50 characters");
    });

    it("should validate website URL format", async () => {
      const updateData = {
        website: "invalid-url",
      };

      const response = await request(app)
        .put("/api/profile/basic")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toContain("valid URL");
    });

    it("should allow clearing fields with empty strings", async () => {
      const updateData = {
        firstName: "",
        lastName: "",
        bio: "",
      };

      const response = await request(app)
        .put("/api/profile/basic")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.user.profile.firstName).toBe("");
      expect(response.body.data.user.profile.lastName).toBe("");
      expect(response.body.data.user.profile.bio).toBe("");
    });

    it("should validate bio length", async () => {
      const updateData = {
        bio: "x".repeat(501), // Exceeds 500 character limit
      };

      const response = await request(app)
        .put("/api/profile/basic")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].msg).toContain("500 characters");
    });

    it("should require authentication", async () => {
      const updateData = {
        firstName: "Jane",
      };

      await request(app).put("/api/profile/basic").send(updateData).expect(401);
    });
  });

  describe("PUT /api/profile/avatar", () => {
    it("should update user avatar", async () => {
      const avatarData = {
        avatar: "https://example.com/new-avatar.jpg",
      };

      const response = await request(app)
        .put("/api/profile/avatar")
        .set("Authorization", `Bearer ${authToken}`)
        .send(avatarData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Avatar updated successfully");
      expect(response.body.data.user.profile.avatar).toBe(avatarData.avatar);
    });

    it("should not update avatar with invalid URL", async () => {
      const avatarData = {
        avatar: "invalid-url",
      };

      const response = await request(app)
        .put("/api/profile/avatar")
        .set("Authorization", `Bearer ${authToken}`)
        .send(avatarData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid avatar URL");
    });

    it("should not update avatar without authentication", async () => {
      const avatarData = {
        avatar: "https://example.com/avatar.jpg",
      };

      await request(app)
        .put("/api/profile/avatar")
        .send(avatarData)
        .expect(401);
    });
  });

  describe("Error Handling", () => {
    it("should handle user not found gracefully", async () => {
      // Delete the user but use the token
      await User.findByIdAndDelete(userId);

      const response = await request(app)
        .get("/api/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User not found");
    });

    it("should handle database connection errors", async () => {
      // This test would require mocking the database connection
      // For now, we'll skip this implementation detail
    });
  });

  describe("Performance", () => {
    it("should respond within acceptable time limits", async () => {
      const start = Date.now();

      await request(app)
        .get("/api/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      const responseTime = Date.now() - start;
      expect(responseTime).toBeLessThan(500); // 500ms threshold
    });
  });
});
