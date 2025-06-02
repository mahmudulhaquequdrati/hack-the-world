const mongoose = require("mongoose");
const UserEnrollment = require("../../models/UserEnrollment");
const User = require("../../models/User");
const Module = require("../../models/Module");
const Phase = require("../../models/Phase");

describe("UserEnrollment Model", () => {
  let testUser;
  let testModule;
  let testPhase;

  beforeEach(async () => {
    // Create test phase first
    testPhase = new Phase({
      title: "Test Phase",
      description: "Test phase description",
      order: 1,
      color: "#00ff00",
      icon: "Shield",
    });
    await testPhase.save();

    // Create test user
    testUser = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "student",
    });
    await testUser.save();

    // Create test module
    testModule = new Module({
      title: "Test Module",
      description: "Test module description",
      difficulty: "Beginner",
      duration: "4 weeks",
      phaseId: testPhase._id,
      order: 1,
      color: "#00ff00",
      icon: "Shield",
    });
    await testModule.save();
  });

  describe("Model Validation", () => {
    it("should create enrollment with valid data", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        totalSections: 10,
      });

      const savedEnrollment = await enrollment.save();
      expect(savedEnrollment._id).toBeDefined();
      expect(savedEnrollment.userId.toString()).toBe(testUser._id.toString());
      expect(savedEnrollment.moduleId.toString()).toBe(
        testModule._id.toString()
      );
      expect(savedEnrollment.status).toBe("active");
      expect(savedEnrollment.completedSections).toBe(0);
      expect(savedEnrollment.progressPercentage).toBe(0);
      expect(savedEnrollment.enrolledAt).toBeDefined();
      expect(savedEnrollment.lastAccessedAt).toBeDefined();
    });

    it("should not create enrollment without userId", async () => {
      const enrollment = new UserEnrollment({
        moduleId: testModule._id,
      });

      await expect(enrollment.save()).rejects.toThrow("User ID is required");
    });

    it("should not create enrollment without moduleId", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
      });

      await expect(enrollment.save()).rejects.toThrow("Module ID is required");
    });

    it("should validate status enum values", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        status: "invalid_status",
      });

      await expect(enrollment.save()).rejects.toThrow(
        "Status must be one of: active, completed, paused, dropped"
      );
    });

    it("should not allow negative completedSections", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        completedSections: -1,
      });

      await expect(enrollment.save()).rejects.toThrow(
        "Completed sections cannot be negative"
      );
    });

    it("should not allow negative totalSections", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        totalSections: -1,
      });

      await expect(enrollment.save()).rejects.toThrow(
        "Total sections cannot be negative"
      );
    });

    it("should not allow progressPercentage over 100", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        progressPercentage: 150,
      });

      await expect(enrollment.save()).rejects.toThrow(
        "Progress percentage cannot exceed 100"
      );
    });

    it("should enforce unique compound index (userId + moduleId)", async () => {
      // Create first enrollment
      const enrollment1 = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
      });
      await enrollment1.save();

      // Try to create duplicate enrollment
      const enrollment2 = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
      });

      await expect(enrollment2.save()).rejects.toThrow();
    });
  });

  describe("Progress Calculation", () => {
    it("should calculate progress percentage automatically", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        totalSections: 10,
        completedSections: 3,
      });

      const savedEnrollment = await enrollment.save();
      expect(savedEnrollment.progressPercentage).toBe(30);
    });

    it("should auto-complete when progress reaches 100%", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        totalSections: 10,
        completedSections: 10,
        status: "active",
      });

      const savedEnrollment = await enrollment.save();
      expect(savedEnrollment.progressPercentage).toBe(100);
      expect(savedEnrollment.status).toBe("completed");
    });

    it("should not change status if already completed", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        totalSections: 10,
        completedSections: 8,
        status: "completed",
      });

      const savedEnrollment = await enrollment.save();
      expect(savedEnrollment.progressPercentage).toBe(80);
      expect(savedEnrollment.status).toBe("completed");
    });

    it("should handle zero totalSections gracefully", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        totalSections: 0,
        completedSections: 0,
      });

      const savedEnrollment = await enrollment.save();
      expect(savedEnrollment.progressPercentage).toBe(0);
    });
  });

  describe("Virtual Properties", () => {
    it("should return correct isCompleted virtual", async () => {
      const enrollment1 = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        status: "completed",
      });
      expect(enrollment1.isCompleted).toBe(true);

      const enrollment2 = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        progressPercentage: 100,
      });
      expect(enrollment2.isCompleted).toBe(true);

      const enrollment3 = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        status: "active",
        progressPercentage: 50,
      });
      expect(enrollment3.isCompleted).toBe(false);
    });

    it("should return correct isActive virtual", async () => {
      const activeEnrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        status: "active",
      });
      expect(activeEnrollment.isActive).toBe(true);

      const pausedEnrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        status: "paused",
      });
      expect(pausedEnrollment.isActive).toBe(false);
    });
  });

  describe("Static Methods", () => {
    beforeEach(async () => {
      // Create test enrollments
      await UserEnrollment.create([
        {
          userId: testUser._id,
          moduleId: testModule._id,
          status: "active",
          completedSections: 3,
          totalSections: 10,
        },
      ]);
    });

    it("should find enrollment by user and module", async () => {
      const enrollment = await UserEnrollment.findByUserAndModule(
        testUser._id,
        testModule._id
      );

      expect(enrollment).toBeTruthy();
      expect(enrollment.userId.toString()).toBe(testUser._id.toString());
      expect(enrollment.moduleId.toString()).toBe(testModule._id.toString());
    });

    it("should get user enrollments", async () => {
      const enrollments = await UserEnrollment.getUserEnrollments(testUser._id);

      expect(enrollments).toHaveLength(1);
      expect(enrollments[0].userId.toString()).toBe(testUser._id.toString());
    });

    it("should get user enrollments with status filter", async () => {
      const activeEnrollments = await UserEnrollment.getUserEnrollments(
        testUser._id,
        { status: "active" }
      );

      expect(activeEnrollments).toHaveLength(1);
      expect(activeEnrollments[0].status).toBe("active");

      const completedEnrollments = await UserEnrollment.getUserEnrollments(
        testUser._id,
        { status: "completed" }
      );

      expect(completedEnrollments).toHaveLength(0);
    });

    it("should get module enrollments", async () => {
      const enrollments = await UserEnrollment.getModuleEnrollments(
        testModule._id
      );

      expect(enrollments).toHaveLength(1);
      expect(enrollments[0].moduleId.toString()).toBe(
        testModule._id.toString()
      );
    });
  });

  describe("Instance Methods", () => {
    let enrollment;

    beforeEach(async () => {
      enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
        totalSections: 10,
        completedSections: 3,
      });
      await enrollment.save();
    });

    it("should update progress correctly", async () => {
      await enrollment.updateProgress(7);

      expect(enrollment.completedSections).toBe(7);
      expect(enrollment.progressPercentage).toBe(70);
    });

    it("should not allow negative progress in updateProgress", async () => {
      await enrollment.updateProgress(-5);

      expect(enrollment.completedSections).toBe(0);
      expect(enrollment.progressPercentage).toBe(0);
    });

    it("should mark as completed", async () => {
      await enrollment.markCompleted();

      expect(enrollment.status).toBe("completed");
      expect(enrollment.progressPercentage).toBe(100);
    });

    it("should pause enrollment", async () => {
      await enrollment.pause();

      expect(enrollment.status).toBe("paused");
    });

    it("should resume enrollment", async () => {
      enrollment.status = "paused";
      await enrollment.save();

      await enrollment.resume();

      expect(enrollment.status).toBe("active");
    });
  });

  describe("Timestamps and Access Tracking", () => {
    it("should update lastAccessedAt on save", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
      });

      const originalTime = new Date("2023-01-01");
      enrollment.lastAccessedAt = originalTime;

      await enrollment.save();

      expect(enrollment.lastAccessedAt.getTime()).toBeGreaterThan(
        originalTime.getTime()
      );
    });

    it("should have createdAt and updatedAt timestamps", async () => {
      const enrollment = new UserEnrollment({
        userId: testUser._id,
        moduleId: testModule._id,
      });

      const savedEnrollment = await enrollment.save();

      expect(savedEnrollment.createdAt).toBeDefined();
      expect(savedEnrollment.updatedAt).toBeDefined();
    });
  });
});
