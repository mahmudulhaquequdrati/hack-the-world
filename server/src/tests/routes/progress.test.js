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

describe("Progress API Endpoints", () => {
  let authToken, adminToken, testUser, testModule, testPhase;

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

    // Create test module
    testModule = await Module.create({
      phaseId: testPhase.id,
      title: "Test Module",
      description: "Test module description",
      icon: "lock",
      duration: "2 hours",
      difficulty: "Beginner",
      color: "#FF5733",
      order: 1,
      topics: ["topic1", "topic2"],
      prerequisites: [],
      learningOutcomes: ["outcome1", "outcome2"],
      content: {
        videos: [],
        labs: [],
        games: [],
        documents: [],
        estimatedHours: 2,
      },
    });

    // Generate auth tokens using helper functions
    const adminUser = await createTestUserWithToken();
    adminToken = adminUser.token;
    testUser = adminUser.user;

    const regularUser = await createTestRegularUser();
    authToken = regularUser.token;
  });

  afterEach(async () => {
    await UserProgress.deleteMany({});
    await UserEnrollment.deleteMany({});
    await Content.deleteMany({});
    await Module.deleteMany({});
    await Phase.deleteMany({});
    await User.deleteMany({});
  });

  describe("GET /api/progress/:userId/labs", () => {
    let testLabContent, testProgress, testEnrollment;

    beforeEach(async () => {
      // Create enrollment
      testEnrollment = await UserEnrollment.create({
        userId: testUser._id,
        moduleId: testModule._id,
        status: "active",
      });

      // Create lab content
      testLabContent = await Content.create({
        moduleId: testModule._id,
        type: "lab",
        title: "Test Lab",
        description: "Test lab description",
        section: "Practice",
        instructions: "Complete the lab exercise",
        duration: 60,
        metadata: {
          difficulty: "beginner",
          tools: ["lab-tool-1", "lab-tool-2"],
        },
      });

      // Create progress
      testProgress = await UserProgress.create({
        userId: testUser._id,
        contentId: testLabContent._id,
        contentType: "lab",
        status: "in-progress",
        progressPercentage: 75,
        timeSpent: 45,
        score: 85,
        maxScore: 100,
      });
    });

    it("should get user labs progress successfully", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "User labs progress retrieved successfully"
      );
      expect(response.body.data.labs).toHaveLength(1);
      expect(response.body.data.labs[0].title).toBe("Test Lab");
      expect(response.body.data.labs[0].progress.status).toBe("in-progress");
      expect(response.body.data.labs[0].progress.progressPercentage).toBe(75);
      expect(response.body.data.labs[0].progress.score).toBe(85);
      expect(response.body.data.statistics.total).toBe(1);
      expect(response.body.data.statistics.inProgress).toBe(1);
      expect(response.body.data.statistics.averageScore).toBe(85);
    });

    it("should filter labs by status", async () => {
      // Create completed lab
      const completedLab = await Content.create({
        moduleId: testModule._id,
        type: "lab",
        title: "Completed Lab",
        description: "Completed lab description",
        section: "Advanced",
        instructions: "Advanced lab exercise",
        duration: 90,
      });

      await UserProgress.create({
        userId: testUser._id,
        contentId: completedLab._id,
        contentType: "lab",
        status: "completed",
        progressPercentage: 100,
        timeSpent: 90,
        score: 95,
        maxScore: 100,
      });

      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs?status=completed`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.labs).toHaveLength(1);
      expect(response.body.data.labs[0].title).toBe("Completed Lab");
      expect(response.body.data.labs[0].progress.status).toBe("completed");
    });

    it("should filter labs by module", async () => {
      // Create another module
      const anotherModule = await Module.create({
        phaseId: testPhase._id,
        title: "Another Module",
        description: "Another module for testing",
        difficulty: "Intermediate",
        icon: "lock",
        color: "#FF5733",
        order: 2,
      });

      // Create enrollment for another module
      await UserEnrollment.create({
        userId: testUser._id,
        moduleId: anotherModule._id,
        status: "active",
      });

      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs?moduleId=${testModule._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.labs).toHaveLength(1);
      expect(response.body.data.labs[0].module.id).toBe(
        testModule._id.toString()
      );
    });

    it("should return empty array for user with no lab enrollments", async () => {
      // Delete the enrollment
      await UserEnrollment.deleteMany({});

      const response = await request(app)
        .get(`/api/progress/${testUser._id}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.labs).toHaveLength(0);
      expect(response.body.data.statistics.total).toBe(0);
      expect(response.body.data.modules).toHaveLength(0);
    });

    it("should require authentication", async () => {
      await request(app).get(`/api/progress/${testUser._id}/labs`).expect(401);
    });

    it("should return 400 for invalid user ID", async () => {
      await request(app)
        .get("/api/progress/invalid-id/labs")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      await request(app)
        .get(`/api/progress/${nonExistentUserId}/labs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should not allow users to access other users' lab progress", async () => {
      const anotherUser = await User.create({
        username: "anotherUser",
        email: "another@example.com",
        password: "password123",
        role: "student",
      });

      await request(app)
        .get(`/api/progress/${anotherUser._id}/labs`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });
  });

  describe("GET /api/progress/:userId/games", () => {
    let testGameContent, testProgress, testEnrollment;

    beforeEach(async () => {
      // Create enrollment
      testEnrollment = await UserEnrollment.create({
        userId: testUser._id,
        moduleId: testModule._id,
        status: "active",
      });

      // Create game content
      testGameContent = await Content.create({
        moduleId: testModule._id,
        type: "game",
        title: "Cybersecurity Challenge",
        description: "Interactive cybersecurity game",
        section: "Security Games",
        instructions: "Complete all levels to earn points",
        duration: 30,
        metadata: {
          difficulty: "intermediate",
          gameType: "challenge",
          levels: 5,
          scoring: {
            correct: 10,
            incorrect: -2,
            bonus: 15,
          },
        },
      });

      // Create progress
      testProgress = await UserProgress.create({
        userId: testUser._id,
        contentId: testGameContent._id,
        contentType: "game",
        status: "completed",
        progressPercentage: 100,
        timeSpent: 30,
        score: 120,
        maxScore: 150,
      });
    });

    it("should get user games progress successfully", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "User games progress retrieved successfully"
      );
      expect(response.body.data.games).toHaveLength(1);
      expect(response.body.data.games[0].title).toBe("Cybersecurity Challenge");
      expect(response.body.data.games[0].progress.status).toBe("completed");
      expect(response.body.data.games[0].progress.score).toBe(120);
      expect(response.body.data.games[0].progress.pointsEarned).toBe(120);
      expect(response.body.data.games[0].metadata.gameType).toBe("challenge");
      expect(response.body.data.games[0].metadata.levels).toBe(5);
      expect(response.body.data.statistics.total).toBe(1);
      expect(response.body.data.statistics.completed).toBe(1);
      expect(response.body.data.statistics.totalPoints).toBe(120);
    });

    it("should include game-specific metadata", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const game = response.body.data.games[0];
      expect(game.metadata.difficulty).toBe("intermediate");
      expect(game.metadata.gameType).toBe("challenge");
      expect(game.metadata.levels).toBe(5);
      expect(game.metadata.scoring).toEqual({
        correct: 10,
        incorrect: -2,
        bonus: 15,
      });
    });

    it("should filter games by status", async () => {
      // Create in-progress game
      const inProgressGame = await Content.create({
        moduleId: testModule._id,
        type: "game",
        title: "In Progress Game",
        description: "Game in progress",
        section: "Challenges",
        instructions: "Work in progress",
        duration: 45,
        metadata: {
          difficulty: "beginner",
          gameType: "puzzle",
          levels: 3,
        },
      });

      await UserProgress.create({
        userId: testUser._id,
        contentId: inProgressGame._id,
        contentType: "game",
        status: "in-progress",
        progressPercentage: 60,
        timeSpent: 20,
        score: 45,
        maxScore: 100,
      });

      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games?status=in-progress`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.games).toHaveLength(1);
      expect(response.body.data.games[0].title).toBe("In Progress Game");
      expect(response.body.data.games[0].progress.status).toBe("in-progress");
    });

    it("should calculate points correctly for games", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.statistics.totalPoints).toBe(120);
      expect(response.body.data.statistics.averageScore).toBe(120);
      expect(response.body.data.modules[0].statistics.totalPoints).toBe(120);
    });

    it("should handle games with no progress (not started)", async () => {
      // Create game with no progress
      await Content.create({
        moduleId: testModule._id,
        type: "game",
        title: "Not Started Game",
        description: "Game not yet started",
        section: "New Games",
        instructions: "Get started!",
        duration: 20,
      });

      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.games).toHaveLength(2);
      const notStartedGameData = response.body.data.games.find(
        (game) => game.title === "Not Started Game"
      );
      expect(notStartedGameData.progress.status).toBe("not-started");
      expect(notStartedGameData.progress.progressPercentage).toBe(0);
      expect(notStartedGameData.progress.pointsEarned).toBe(0);
    });

    it("should require authentication", async () => {
      await request(app).get(`/api/progress/${testUser._id}/games`).expect(401);
    });

    it("should return 400 for invalid user ID", async () => {
      await request(app)
        .get("/api/progress/invalid-id/games")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      await request(app)
        .get(`/api/progress/${nonExistentUserId}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should not allow users to access other users' game progress", async () => {
      const anotherUser = await User.create({
        username: "anotherGameUser",
        email: "anothergame@example.com",
        password: "password123",
        role: "student",
      });

      await request(app)
        .get(`/api/progress/${anotherUser._id}/games`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });

    it("should allow admin to access any user's game progress", async () => {
      const response = await request(app)
        .get(`/api/progress/${testUser._id}/games`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.games).toHaveLength(1);
    });
  });
});
