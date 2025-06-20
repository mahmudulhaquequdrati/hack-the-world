const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../testApp");
const UserProgress = require("../../models/UserProgress");
const UserEnrollment = require("../../models/UserEnrollment");
const Content = require("../../models/Content");
const Module = require("../../models/Module");
const Phase = require("../../models/Phase");
const User = require("../../models/User");
const {
  createTestUserWithToken,
  createTestRegularUser,
} = require("../helpers/authHelper");

describe("Enrollment-Progress Integration API Endpoints", () => {
  let adminToken, studentToken, testUser, testModule1, testModule2, testPhase;

  beforeEach(async () => {
    // Clear all collections
    await UserProgress.deleteMany({});
    await UserEnrollment.deleteMany({});
    await Content.deleteMany({});
    await Module.deleteMany({});
    await Phase.deleteMany({});
    await User.deleteMany({});

    // Create test phase
    testPhase = await Phase.create({
      title: "Test Phase",
      description: "Test phase description",
      order: 1,
      color: "#FF5733",
      icon: "shield",
    });

    // Create test modules
    testModule1 = await Module.create({
      phaseId: testPhase._id,
      title: "Module 1 - Security Basics",
      description: "Basic security concepts",
      icon: "lock",
      duration: "2 hours",
      difficulty: "Beginner",
      color: "#FF5733",
      order: 1,
      topics: ["encryption", "authentication"],
      prerequisites: [],
      learningOutcomes: ["understand encryption", "implement auth"],
      content: {
        videos: [],
        labs: [],
        games: [],
        documents: [],
        estimatedHours: 2,
      },
    });

    testModule2 = await Module.create({
      phaseId: testPhase._id,
      title: "Module 2 - Advanced Security",
      description: "Advanced security topics",
      icon: "shield",
      duration: "4 hours",
      difficulty: "Advanced",
      color: "#33FF57",
      order: 2,
      topics: ["penetration testing", "incident response"],
      prerequisites: [],
      learningOutcomes: ["perform pen tests", "handle incidents"],
      content: {
        videos: [],
        labs: [],
        games: [],
        documents: [],
        estimatedHours: 4,
      },
    });

    // Generate auth tokens
    const adminUser = await createTestUserWithToken();
    adminToken = adminUser.token;
    testUser = adminUser.user;

    const regularUser = await createTestRegularUser();
    studentToken = regularUser.token;
  });

  afterEach(async () => {
    await UserProgress.deleteMany({});
    await UserEnrollment.deleteMany({});
    await Content.deleteMany({});
    await Module.deleteMany({});
    await Phase.deleteMany({});
    await User.deleteMany({});
  });

  describe("GET /api/progress/:userId/labs - Enrollment Integration", () => {
    beforeEach(async () => {
      // Create enrollments
      await UserEnrollment.create({
        userId: testUser._id,
        moduleId: testModule1._id,
        status: "active",
        enrolledAt: new Date("2024-01-15"),
        progress: 50,
        completedSections: 2,
        totalSections: 4,
      });

      await UserEnrollment.create({
        userId: testUser._id,
        moduleId: testModule2._id,
        status: "completed",
        enrolledAt: new Date("2024-01-10"),
        completedAt: new Date("2024-01-20"),
        progress: 100,
        completedSections: 6,
        totalSections: 6,
      });

      // Create lab content for both modules
      const lab1 = await Content.create({
        moduleId: testModule1._id,
        type: "lab",
        title: "Basic Encryption Lab",
        description: "Learn encryption fundamentals",
        section: "Encryption Basics",
        instructions: "Complete encryption exercises",
        duration: 60,
        metadata: {
          difficulty: "beginner",
          tools: ["openssl", "gpg"],
        },
      });

      const lab2 = await Content.create({
        moduleId: testModule1._id,
        type: "lab",
        title: "Authentication Lab",
        description: "Implement authentication systems",
        section: "Authentication",
        instructions: "Build auth system",
        duration: 90,
        metadata: {
          difficulty: "intermediate",
          tools: ["nodejs", "passport"],
        },
      });

      const lab3 = await Content.create({
        moduleId: testModule2._id,
        type: "lab",
        title: "Penetration Testing Lab",
        description: "Advanced pen testing techniques",
        section: "Pen Testing",
        instructions: "Perform security audit",
        duration: 120,
        metadata: {
          difficulty: "advanced",
          tools: ["metasploit", "nmap"],
        },
      });

      // Create progress records
      await UserProgress.create({
        userId: testUser._id,
        contentId: lab1._id,
        contentType: "lab",
        status: "completed",
        progressPercentage: 100,
        timeSpent: 55,
        score: 95,
        maxScore: 100,
        completedAt: new Date("2024-01-16"),
      });

      await UserProgress.create({
        userId: testUser._id,
        contentId: lab2._id,
        contentType: "lab",
        status: "in-progress",
        progressPercentage: 75,
        timeSpent: 65,
        score: 80,
        maxScore: 100,
      });

      await UserProgress.create({
        userId: testUser._id,
        contentId: lab3._id,
        contentType: "lab",
        status: "completed",
        progressPercentage: 100,
        timeSpent: 110,
        score: 98,
        maxScore: 100,
        completedAt: new Date("2024-01-19"),
      });
    });

    it("should return labs progress with enrollment context", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.labs).toHaveLength(3);
      expect(response.body.data.modules).toHaveLength(2);

      // Check module-level statistics
      const module1Data = response.body.data.modules.find(
        (m) => m.module.title === "Module 1 - Security Basics"
      );
      const module2Data = response.body.data.modules.find(
        (m) => m.module.title === "Module 2 - Advanced Security"
      );

      expect(module1Data.statistics.total).toBe(2);
      expect(module1Data.statistics.completed).toBe(1);
      expect(module1Data.statistics.inProgress).toBe(1);

      expect(module2Data.statistics.total).toBe(1);
      expect(module2Data.statistics.completed).toBe(1);
      expect(module2Data.statistics.inProgress).toBe(0);
    });

    it("should include enrollment metadata in response", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const module1Data = response.body.data.modules.find(
        (m) => m.module.title === "Module 1 - Security Basics"
      );

      expect(module1Data.enrollment).toBeDefined();
      expect(module1Data.enrollment.status).toBe("active");
      expect(module1Data.enrollment.progress).toBe(50);
      expect(module1Data.enrollment.completedSections).toBe(2);
      expect(module1Data.enrollment.totalSections).toBe(4);
    });

    it("should filter labs by module enrollment status", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs?moduleId=${testModule1._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.labs).toHaveLength(2);
      expect(response.body.data.modules).toHaveLength(1);
      expect(response.body.data.modules[0].module.title).toBe(
        "Module 1 - Security Basics"
      );
    });

    it("should calculate accurate time spent across enrollments", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.statistics.totalTimeSpent).toBe(230); // 55 + 65 + 110
      expect(response.body.data.statistics.averageTimeSpent).toBeCloseTo(
        76.67,
        1
      );
    });

    it("should handle users with no enrollments", async () => {
      await UserEnrollment.deleteMany({ userId: testUser._id });

      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.labs).toHaveLength(0);
      expect(response.body.data.modules).toHaveLength(0);
      expect(response.body.data.statistics.total).toBe(0);
    });
  });

  describe("GET /api/progress/:userId/games - Enrollment Integration", () => {
    beforeEach(async () => {
      // Create enrollments
      await UserEnrollment.create({
        userId: testUser._id,
        moduleId: testModule1._id,
        status: "active",
        enrolledAt: new Date("2024-01-15"),
        progress: 75,
        completedSections: 3,
        totalSections: 4,
      });

      // Create game content
      const game1 = await Content.create({
        moduleId: testModule1._id,
        type: "game",
        title: "Crypto Challenge",
        description: "Cryptography puzzle game",
        section: "Interactive Learning",
        instructions: "Solve crypto puzzles",
        duration: 45,
        metadata: {
          difficulty: "beginner",
          gameType: "puzzle",
          levels: 3,
          scoring: {
            correct: 10,
            incorrect: -2,
            bonus: 5,
          },
        },
      });

      const game2 = await Content.create({
        moduleId: testModule1._id,
        type: "game",
        title: "Security Trivia",
        description: "Test your security knowledge",
        section: "Knowledge Check",
        instructions: "Answer security questions",
        duration: 30,
        metadata: {
          difficulty: "intermediate",
          gameType: "trivia",
          levels: 5,
          scoring: {
            correct: 15,
            incorrect: -3,
            bonus: 10,
          },
        },
      });

      // Create progress records
      await UserProgress.create({
        userId: testUser._id,
        contentId: game1._id,
        contentType: "game",
        status: "completed",
        progressPercentage: 100,
        timeSpent: 40,
        score: 85,
        maxScore: 90,
        completedAt: new Date("2024-01-17"),
      });

      await UserProgress.create({
        userId: testUser._id,
        contentId: game2._id,
        contentType: "game",
        status: "in-progress",
        progressPercentage: 60,
        timeSpent: 20,
        score: 45,
        maxScore: 75,
      });
    });

    it("should return games progress with enrollment context", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.games).toHaveLength(2);
      expect(response.body.data.modules).toHaveLength(1);

      const moduleData = response.body.data.modules[0];
      expect(moduleData.module.title).toBe("Module 1 - Security Basics");
      expect(moduleData.statistics.total).toBe(2);
      expect(moduleData.statistics.completed).toBe(1);
      expect(moduleData.statistics.inProgress).toBe(1);
    });

    it("should include game-specific scoring in statistics", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.statistics.totalPoints).toBe(130); // 85 + 45
      expect(response.body.data.statistics.averageScore).toBe(65); // (85 + 45) / 2
      expect(response.body.data.statistics.totalTimeSpent).toBe(60); // 40 + 20
    });

    it("should show enrollment status in module data", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const moduleData = response.body.data.modules[0];
      expect(moduleData.enrollment.status).toBe("active");
      expect(moduleData.enrollment.progress).toBe(75);
      expect(moduleData.enrollment.completedSections).toBe(3);
    });

    it("should handle completed module enrollments", async () => {
      // Update enrollment to completed
      await UserEnrollment.findOneAndUpdate(
        { userId: testUser._id, moduleId: testModule1._id },
        {
          status: "completed",
          progress: 100,
          completedSections: 4,
          completedAt: new Date("2024-01-20"),
        }
      );

      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const moduleData = response.body.data.modules[0];
      expect(moduleData.enrollment.status).toBe("completed");
      expect(moduleData.enrollment.progress).toBe(100);
      expect(moduleData.enrollment.completedAt).toBeDefined();
    });
  });

  describe("Cross-Module Progress Analysis", () => {
    beforeEach(async () => {
      // Create enrollments for multiple modules
      await UserEnrollment.create({
        userId: testUser._id,
        moduleId: testModule1._id,
        status: "completed",
        enrolledAt: new Date("2024-01-10"),
        completedAt: new Date("2024-01-20"),
        progress: 100,
        completedSections: 4,
        totalSections: 4,
      });

      await UserEnrollment.create({
        userId: testUser._id,
        moduleId: testModule2._id,
        status: "active",
        enrolledAt: new Date("2024-01-21"),
        progress: 25,
        completedSections: 1,
        totalSections: 6,
      });

      // Create mixed content across modules
      const content1 = await Content.create({
        moduleId: testModule1._id,
        type: "lab",
        title: "Module 1 Lab",
        description: "Basic lab",
        section: "Practice",
        duration: 60,
      });

      const content2 = await Content.create({
        moduleId: testModule2._id,
        type: "game",
        title: "Module 2 Game",
        description: "Advanced game",
        section: "Challenge",
        duration: 45,
        metadata: {
          gameType: "simulation",
          levels: 10,
        },
      });

      await UserProgress.create({
        userId: testUser._id,
        contentId: content1._id,
        contentType: "lab",
        status: "completed",
        progressPercentage: 100,
        timeSpent: 58,
        score: 92,
        maxScore: 100,
      });

      await UserProgress.create({
        userId: testUser._id,
        contentId: content2._id,
        contentType: "game",
        status: "in-progress",
        progressPercentage: 30,
        timeSpent: 15,
        score: 25,
        maxScore: 100,
      });
    });

    it("should aggregate progress across all enrolled modules (labs)", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.labs).toHaveLength(1);
      expect(response.body.data.modules).toHaveLength(1); // Only module with labs

      const moduleData = response.body.data.modules[0];
      expect(moduleData.module.title).toBe("Module 1 - Security Basics");
      expect(moduleData.enrollment.status).toBe("completed");
    });

    it("should aggregate progress across all enrolled modules (games)", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.games).toHaveLength(1);
      expect(response.body.data.modules).toHaveLength(1); // Only module with games

      const moduleData = response.body.data.modules[0];
      expect(moduleData.module.title).toBe("Module 2 - Advanced Security");
      expect(moduleData.enrollment.status).toBe("active");
    });

    it("should handle mixed enrollment statuses correctly", async () => {
      // Test labs endpoint
      const labsResponse = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(labsResponse.body.data.statistics.total).toBe(1);
      expect(labsResponse.body.data.statistics.completed).toBe(1);

      // Test games endpoint
      const gamesResponse = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(gamesResponse.body.data.statistics.total).toBe(1);
      expect(gamesResponse.body.data.statistics.inProgress).toBe(1);
    });
  });

  describe("Authentication and Authorization", () => {
    it("should require authentication for labs progress", async () => {
      await request(app).get(`/api/progress/${testUser._id}/labs`).expect(401);
    });

    it("should require authentication for games progress", async () => {
      await request(app).get(`/api/progress/${testUser._id}/games`).expect(401);
    });

    it("should allow admin to access any user's progress", async () => {
      const labsResponse = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(labsResponse.body.success).toBe(true);

      const gamesResponse = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(gamesResponse.body.success).toBe(true);
    });

    it("should not allow students to access other users' progress", async () => {
      await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(403);

      await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(403);
    });
  });
});
