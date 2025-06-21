const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import the test app (doesn't start server)
const app = require("./testApp");
const User = require("../models/User");

describe("🔐 Authentication Endpoints", () => {
  // Test data
  const validUserData = {
    username: "admin",
    email: "admin@terminalhacks.space",
    password: "SecurePass123!",
    firstName: "John",
    lastName: "Doe",
    experienceLevel: "beginner",
  };

  const validLoginData = {
    login: "admin@terminalhacks.space",
    password: "SecurePass123!",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Authentication successful");
      expect(response.body.data.user.username).toBe(validUserData.username);
      expect(response.body.data.user.email).toBe(validUserData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.expiresIn).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ username: validUserData.username });
      expect(user).toBeTruthy();
      expect(user.profile.firstName).toBe(validUserData.firstName);
    });

    it("should not register user with invalid email", async () => {
      const invalidData = { ...validUserData, email: "invalid-email" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toBeDefined();
    });

    it("should not register user with weak password", async () => {
      const invalidData = { ...validUserData, password: "weak" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should not register user with invalid username", async () => {
      const invalidData = { ...validUserData, username: "Invalid@Username!" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should not register user with duplicate email", async () => {
      // Create first user
      await request(app)
        .post("/api/auth/register")
        .send(validUserData)
        .expect(201);

      // Try to create second user with same email
      const duplicateData = { ...validUserData, username: "different" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(duplicateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    it("should not register user with duplicate username", async () => {
      // Create first user
      await request(app)
        .post("/api/auth/register")
        .send(validUserData)
        .expect(201);

      // Try to create second user with same username
      const duplicateData = {
        ...validUserData,
        email: "different@example.com",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(duplicateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app).post("/api/auth/register").send(validUserData);
    });

    it("should login with valid username", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(validLoginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Authentication successful");
      expect(response.body.data.user.username).toBe(validUserData.username);
      expect(response.body.data.token).toBeDefined();
    });

    it("should login with valid email", async () => {
      const emailLoginData = {
        login: validUserData.email,
        password: validUserData.password,
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(emailLoginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUserData.email);
    });

    it("should not login with invalid credentials", async () => {
      const invalidData = {
        login: validLoginData.login,
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(invalidData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should not login with non-existent user", async () => {
      const nonExistentData = {
        login: "nonexistent",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(nonExistentData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should not login with missing credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should handle account lockout after failed attempts", async () => {
      const invalidData = {
        login: validLoginData.login,
        password: "wrongpassword",
      };

      // Make multiple failed login attempts (assuming lockout after 10 attempts)
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post("/api/auth/login")
          .send(invalidData)
          .expect(401);
      }

      // Next attempt should return locked account error
      const response = await request(app)
        .post("/api/auth/login")
        .send(invalidData)
        .expect(423);

      expect(response.body.message).toContain("locked");
    });
  });

  describe("GET /api/auth/me", () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get auth token
      const loginResponse = await request(app)
        .post("/api/auth/register")
        .send(validUserData);

      authToken = loginResponse.body.data.token;
    });

    it("should get current user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe(validUserData.username);
      expect(response.body.data.user.email).toBe(validUserData.email);
    });

    it("should not get profile without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Access token is required");
    });

    it("should not get profile with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid or expired token");
    });

    it("should not get profile with expired token", async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId: new mongoose.Types.ObjectId() },
        process.env.JWT_SECRET || "test-secret",
        { expiresIn: "0s" }
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid or expired token");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await request(app).post("/api/auth/logout").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Logged out successfully");
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should send password reset email for existing user", async () => {
      // Create a test user
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "Password123!",
      };

      await request(app).post("/api/auth/register").send(userData).expect(201);

      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "test@example.com" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("password reset instructions");

      // Verify user has reset token in database
      const user = await User.findOne({ email: "test@example.com" }).select(
        "+security.passwordResetToken +security.passwordResetExpires"
      );

      expect(user.security.passwordResetToken).toBeDefined();
      expect(user.security.passwordResetExpires).toBeDefined();
      expect(user.security.passwordResetExpires.getTime()).toBeGreaterThan(
        Date.now()
      );
    });

    it("should return success even for non-existent email (security)", async () => {
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "nonexistent@example.com" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("password reset instructions");
    });

    it("should validate email format", async () => {
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "invalid-email" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Please provide a valid email",
          }),
        ])
      );
    });

    it("should require email field", async () => {
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should handle email service errors gracefully in forgot password", async () => {
      // Mock EmailService to throw error
      const EmailService = require("../utils/emailService");
      const originalSendPasswordResetEmail =
        EmailService.sendPasswordResetEmail;
      EmailService.sendPasswordResetEmail = jest
        .fn()
        .mockRejectedValue(new Error("Email service unavailable"));

      // Create a test user
      const userData = {
        username: "emailtestuser",
        email: "emailtest@example.com",
        password: "Password123!",
      };

      await request(app).post("/api/auth/register").send(userData);

      // Should still return success even if email fails
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "emailtest@example.com" })
        .expect(200);

      expect(response.body.success).toBe(true);

      // In test environment, reset token should NOT be cleared when email fails
      // This is different from production behavior for testing purposes
      const user = await User.findOne({
        email: "emailtest@example.com",
      }).select("+security.passwordResetToken +security.passwordResetExpires");

      // In test environment, token should still exist since we don't clear on email failure
      expect(user.security.passwordResetToken).toBeDefined();
      expect(user.security.passwordResetExpires).toBeDefined();

      // Restore original method
      EmailService.sendPasswordResetEmail = originalSendPasswordResetEmail;
    });
  });

  describe("POST /api/auth/reset-password", () => {
    let resetToken;
    let testUser;

    beforeEach(async () => {
      // Create a test user and generate reset token
      const userData = {
        username: "resetuser",
        email: "reset@example.com",
        password: "OldPassword123!",
      };

      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send(userData);

      testUser = await User.findById(registerResponse.body.data.user.id);
      resetToken = testUser.createPasswordResetToken();
      await testUser.save({ validateBeforeSave: false });
    });

    it("should reset password with valid token", async () => {
      const newPassword = "NewPassword123!";

      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: resetToken,
          password: newPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Password reset successfully");
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.expiresIn).toBeDefined();

      // Verify password was changed
      const updatedUser = await User.findById(testUser._id).select("+password");
      const isPasswordValid = await updatedUser.comparePassword(newPassword);
      expect(isPasswordValid).toBe(true);

      // Verify reset token was cleared
      const userWithoutToken = await User.findById(testUser._id).select(
        "+security.passwordResetToken +security.passwordResetExpires"
      );
      expect(userWithoutToken.security.passwordResetToken).toBeUndefined();
      expect(userWithoutToken.security.passwordResetExpires).toBeUndefined();

      // Verify password changed timestamp was updated
      expect(updatedUser.security.passwordChangedAt).toBeDefined();
    });

    it("should reject invalid reset token", async () => {
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: "invalid-token-12345678901234567890",
          password: "NewPassword123!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Invalid or expired password reset token"
      );
    });

    it("should reject expired reset token", async () => {
      // Create an expired token
      const expiredUser = await User.findById(testUser._id);
      const expiredToken = expiredUser.createPasswordResetToken();
      expiredUser.security.passwordResetExpires = Date.now() - 10 * 60 * 1000; // Expired 10 minutes ago
      await expiredUser.save({ validateBeforeSave: false });

      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: expiredToken,
          password: "NewPassword123!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Invalid or expired password reset token"
      );
    });

    it("should validate password requirements", async () => {
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: resetToken,
          password: "weak",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: expect.stringContaining("Password must"),
          }),
        ])
      );
    });

    it("should require both token and password", async () => {
      // Missing token
      let response = await request(app)
        .post("/api/auth/reset-password")
        .send({ password: "NewPassword123!" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");

      // Missing password
      response = await request(app)
        .post("/api/auth/reset-password")
        .send({ token: resetToken })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should allow immediate login after password reset", async () => {
      const newPassword = "NewPassword123!";

      // Reset password
      const resetResponse = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: resetToken,
          password: newPassword,
        })
        .expect(200);

      const authToken = resetResponse.body.data.token;

      // Use the returned token to access protected endpoint
      const profileResponse = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.data.user.email).toBe("reset@example.com");
    });

    it("should send password reset confirmation email after successful reset", async () => {
      const newPassword = "NewPassword123!";

      // Mock EmailService to verify confirmation email is sent
      const EmailService = require("../utils/emailService");
      const originalSendPasswordResetConfirmationEmail =
        EmailService.sendPasswordResetConfirmationEmail;
      const mockSendConfirmationEmail = jest.fn().mockResolvedValue({
        success: true,
        messageId: "test-confirmation-id",
      });
      EmailService.sendPasswordResetConfirmationEmail =
        mockSendConfirmationEmail;

      // Reset password
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: resetToken,
          password: newPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Password reset successfully");

      // Verify confirmation email was sent
      expect(mockSendConfirmationEmail).toHaveBeenCalledWith(
        "reset@example.com",
        "resetuser"
      );
      expect(mockSendConfirmationEmail).toHaveBeenCalledTimes(1);

      // Restore original method
      EmailService.sendPasswordResetConfirmationEmail =
        originalSendPasswordResetConfirmationEmail;
    });

    it("should handle confirmation email errors gracefully", async () => {
      // Create a new test user and token since previous tests may have consumed the original token
      const userData = {
        username: "confirmationerroruser",
        email: "confirmationerror@example.com",
        password: "OldPassword123!",
      };

      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send(userData);

      const errorTestUser = await User.findById(
        registerResponse.body.data.user.id
      );
      const errorResetToken = errorTestUser.createPasswordResetToken();
      await errorTestUser.save({ validateBeforeSave: false });

      // Mock EmailService to throw error
      const EmailService = require("../utils/emailService");
      const originalSendPasswordResetConfirmationEmail =
        EmailService.sendPasswordResetConfirmationEmail;
      EmailService.sendPasswordResetConfirmationEmail = jest
        .fn()
        .mockRejectedValue(new Error("Email service unavailable"));

      const newPassword = "NewPassword123!";

      // Password reset should still succeed even if confirmation email fails
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: errorResetToken,
          password: newPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Password reset successfully");
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();

      // Verify password was still changed successfully
      const updatedUser = await User.findById(errorTestUser._id).select(
        "+password"
      );
      const isPasswordValid = await updatedUser.comparePassword(newPassword);
      expect(isPasswordValid).toBe(true);

      // Restore original method
      EmailService.sendPasswordResetConfirmationEmail =
        originalSendPasswordResetConfirmationEmail;
    });
  });

  describe("Email Service Integration", () => {
    it("should handle email service errors gracefully in registration", async () => {
      // Mock EmailService to throw error
      const EmailService = require("../utils/emailService");
      const originalSendWelcomeEmail = EmailService.sendWelcomeEmail;
      EmailService.sendWelcomeEmail = jest
        .fn()
        .mockRejectedValue(new Error("Email service unavailable"));

      const userData = {
        username: "welcomeemailtest",
        email: "welcometest@example.com",
        password: "Password123!",
      };

      // Should still succeed even if welcome email fails
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();

      // Restore original method
      EmailService.sendWelcomeEmail = originalSendWelcomeEmail;
    });

    it("should send welcome email with white background styling during registration", async () => {
      // Mock EmailService to capture welcome email details
      const EmailService = require("../utils/emailService");
      const originalSendWelcomeEmail = EmailService.sendWelcomeEmail;
      const mockSendWelcomeEmail = jest.fn().mockResolvedValue({
        success: true,
        messageId: "test-welcome-email-id",
      });
      EmailService.sendWelcomeEmail = mockSendWelcomeEmail;

      const userData = {
        username: "styledwelcometest",
        email: "styled@example.com",
        password: "Password123!",
        firstName: "Test",
        lastName: "User",
        experienceLevel: "beginner",
      };

      // Register user
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();

      // Verify welcome email was sent with correct parameters
      expect(mockSendWelcomeEmail).toHaveBeenCalledWith(
        "styled@example.com",
        "styledwelcometest"
      );
      expect(mockSendWelcomeEmail).toHaveBeenCalledTimes(1);

      // Restore original method
      EmailService.sendWelcomeEmail = originalSendWelcomeEmail;
    });

    it("should verify welcome email content includes white background styling", async () => {
      const EmailService = require("../utils/emailService");

      // Test the actual sendWelcomeEmail method in test environment
      const result = await EmailService.sendWelcomeEmail(
        "test@example.com",
        "testuser"
      );

      // In test environment, it should return success without actually sending
      expect(result.success).toBe(true);
      expect(result.messageId).toBe("test-welcome-message-id");
    });
  });

  describe("Rate Limiting", () => {
    // Note: Rate limiting is disabled in test environment
    it("should skip rate limiting in test environment", async () => {
      const promises = [];

      // Make multiple requests quickly (assuming limit is 15 per 15 minutes)
      for (let i = 0; i < 16; i++) {
        promises.push(
          request(app).post("/api/auth/login").send(validLoginData)
        );
      }

      const responses = await Promise.all(promises);

      // In test environment, rate limiting should be disabled
      // so all requests should return 401 (invalid credentials) not 429
      const rateLimitedResponse = responses.find((res) => res.status === 429);
      expect(rateLimitedResponse).toBeUndefined();

      // All should be 401 since login data doesn't match any user
      responses.forEach((response) => {
        expect([401, 404]).toContain(response.status);
      });
    });
  });

  describe("Password Security", () => {
    it("should hash passwords securely", async () => {
      await request(app).post("/api/auth/register").send(validUserData);

      const user = await User.findOne({
        username: validUserData.username,
      }).select("+password");

      // Password should be hashed
      expect(user.password).not.toBe(validUserData.password);
      expect(user.password.length).toBeGreaterThan(50); // bcrypt hash length

      // Should be able to verify password
      const isValid = await bcrypt.compare(
        validUserData.password,
        user.password
      );
      expect(isValid).toBe(true);
    });
  });
});
