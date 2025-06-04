const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../testApp");
const User = require("../../models/User");
const Module = require("../../models/Module");
const Phase = require("../../models/Phase");
const UserEnrollment = require("../../models/UserEnrollment");

describe("Enrollment Routes", () => {
  let studentUser, adminUser, studentToken, adminToken;
  let testPhase, testModule1, testModule2;

  beforeEach(async () => {
    // Create test users
    studentUser = await User.create({
      username: "student",
      email: "student@example.com",
      password: "password123",
      role: "student",
    });

    adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      adminStatus: "active",
    });

    // Get auth tokens
    const studentLogin = await request(app).post("/api/auth/login").send({
      login: "student@example.com",
      password: "password123",
    });

    studentToken = studentLogin.body.data.token;

    const adminLogin = await request(app).post("/api/auth/login").send({
      login: "admin@example.com",
      password: "password123",
    });

    adminToken = adminLogin.body.data.token;

    // Create test phase
    testPhase = await Phase.create({
      title: "Test Phase",
      description: "Test phase description",
      order: 1,
      color: "#00ff00",
      icon: "Shield",
    });

    // Create test modules
    testModule1 = await Module.create({
      title: "Test Module 1",
      description: "First test module",
      difficulty: "Beginner",
      duration: "2 weeks",
      phaseId: testPhase._id,
      order: 1,
      color: "#00ff00",
      icon: "Shield",
    });

    testModule2 = await Module.create({
      title: "Test Module 2",
      description: "Second test module",
      difficulty: "Intermediate",
      duration: "3 weeks",
      phaseId: testPhase._id,
      order: 2,
      color: "#00ff00",
      icon: "Shield",
    });

    // Create test enrollments
    await UserEnrollment.create({
      userId: studentUser._id,
      moduleId: testModule1._id,
      totalSections: 10,
      completedSections: 3,
      status: "active",
    });

    await UserEnrollment.create({
      userId: studentUser._id,
      moduleId: testModule2._id,
      totalSections: 8,
      completedSections: 8,
      status: "completed",
    });
  });

  describe("GET /api/enrollments/user/me", () => {
    it("should get current user enrollments successfully", async () => {
      const response = await request(app)
        .get("/api/enrollments/user/me")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Current user enrollments retrieved successfully"
      );
      expect(response.body.count).toBe(2);
      expect(response.body.total).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    it("should filter enrollments by status", async () => {
      const response = await request(app)
        .get("/api/enrollments/user/me?status=active")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe("active");
    });

    it("should paginate results correctly", async () => {
      const response = await request(app)
        .get("/api/enrollments/user/me?page=1&limit=1")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.total).toBe(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.pages).toBe(2);
    });

    it("should populate module details when requested", async () => {
      const response = await request(app)
        .get("/api/enrollments/user/me?populate=true")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].moduleId.title).toBeDefined();
    });

    it("should require authentication", async () => {
      await request(app).get("/api/enrollments/user/me").expect(401);
    });

    it("should return empty array for user with no enrollments", async () => {
      const response = await request(app)
        .get("/api/enrollments/user/me")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe("GET /api/enrollments/user/:userId", () => {
    it("should get user enrollments successfully (admin)", async () => {
      const response = await request(app)
        .get(`/api/enrollments/user/${studentUser._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "User enrollments retrieved successfully"
      );
      expect(response.body.count).toBe(2);
      expect(response.body.total).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    it("should require admin role", async () => {
      await request(app)
        .get(`/api/enrollments/user/${studentUser._id}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(403);
    });

    it("should require authentication", async () => {
      await request(app)
        .get(`/api/enrollments/user/${studentUser._id}`)
        .expect(401);
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/enrollments/user/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should return 400 for invalid user ID", async () => {
      await request(app)
        .get("/api/enrollments/user/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });

    it("should filter by status (admin)", async () => {
      const response = await request(app)
        .get(`/api/enrollments/user/${studentUser._id}?status=completed`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe("completed");
    });

    it("should paginate results (admin)", async () => {
      const response = await request(app)
        .get(`/api/enrollments/user/${studentUser._id}?page=1&limit=1`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.total).toBe(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.pages).toBe(2);
    });

    it("should populate module details when requested (admin)", async () => {
      const response = await request(app)
        .get(`/api/enrollments/user/${studentUser._id}?populate=true`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].moduleId.title).toBeDefined();
    });

    it("should return empty array for user with no enrollments (admin)", async () => {
      const response = await request(app)
        .get(`/api/enrollments/user/${adminUser._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe("Existing Enrollment Endpoints", () => {
    it("should still work - GET /api/enrollments (current user)", async () => {
      const response = await request(app)
        .get("/api/enrollments")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
    });

    it("should still work - POST /api/enrollments (enroll user)", async () => {
      // Create another module for testing enrollment
      const newModule = await Module.create({
        title: "New Test Module",
        description: "Module for enrollment test",
        difficulty: "Beginner",
        duration: "1 week",
        phaseId: testPhase._id,
        order: 3,
        color: "#00ff00",
        icon: "Shield",
      });

      const response = await request(app)
        .post("/api/enrollments")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          moduleId: newModule._id,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Successfully enrolled in module");
    });
  });
});
