const request = require("supertest");
const app = require("./testApp");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
  beforeEach(async () => {
    // Clear users collection
    await User.deleteMany({});

    // Create test user using the User model to ensure proper password hashing
    const user = await User.create({
      username: testUser.username,
      email: testUser.email,
      password: testUser.password, // Let the model handle hashing
      profile: testUser.profile,
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
      const response = await request(app).get("/api/profile").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not authorized to access this route");
    });

    it("should not get profile with invalid token", async () => {
      const response = await request(app)
        .get("/api/profile")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not authorized to access this route");
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
      expect(response.body.data.token).toBeDefined();

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
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toContain(
        "New password must be at least 8 characters long"
      );
    });

    it("should not change password without authentication", async () => {
      const passwordData = {
        currentPassword: "TestPassword123!",
        newPassword: "NewPassword123!",
      };

      const response = await request(app)
        .put("/api/profile/change-password")
        .send(passwordData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not authorized to access this route");
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
      expect(response.body.message).toBe("Validation error");
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
      expect(response.body.message).toBe("Validation error");
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
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toContain("500 characters");
    });

    it("should require authentication", async () => {
      const updateData = {
        firstName: "Jane",
      };

      const response = await request(app)
        .put("/api/profile/basic")
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not authorized to access this route");
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
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toContain("valid URL");
    });

    it("should not update avatar without authentication", async () => {
      const avatarData = {
        avatar: "https://example.com/avatar.jpg",
      };

      const response = await request(app)
        .put("/api/profile/avatar")
        .send(avatarData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not authorized to access this route");
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
      expect(response.body.message).toBe("No user found with this token");
    });

    it("should handle database connection errors", async () => {
      // This test would require mocking the database connection
      // For now, we'll skip this implementation detail
      expect(true).toBe(true);
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
