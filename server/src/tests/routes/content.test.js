const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../testApp");
const Content = require("../../models/Content");
const Module = require("../../models/Module");
const Phase = require("../../models/Phase");
const User = require("../../models/User");
const {
  createTestUserWithToken,
  createTestRegularUser,
} = require("../helpers/authHelper");

describe("Content API Endpoints", () => {
  let authToken;
  let adminToken;
  let testPhase;
  let testModule;
  let testContent;

  beforeEach(async () => {
    // Clear all collections
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

    // Create test content
    testContent = {
      moduleId: testModule.id,
      type: "video",
      title: "Test Video Content",
      description: "Test video description",
      section: "Getting Started",
      url: "https://example.com/video",
      duration: 15,
      metadata: { difficulty: "beginner" },
    };

    // Generate auth tokens using helper functions
    const adminUser = await createTestUserWithToken();
    adminToken = adminUser.token;

    const regularUser = await createTestRegularUser();
    authToken = regularUser.token;
  });

  afterEach(async () => {
    await Content.deleteMany({});
    await Module.deleteMany({});
    await Phase.deleteMany({});
    await User.deleteMany({});
  });

  describe("GET /api/content", () => {
    beforeEach(async () => {
      // Create test content
      await Content.create([
        { ...testContent, type: "video", title: "Video 1" },
        {
          ...testContent,
          type: "lab",
          title: "Lab 1",
          instructions: "Lab instructions",
          url: undefined,
        },
        {
          ...testContent,
          type: "game",
          title: "Game 1",
          instructions: "Game instructions",
          url: undefined,
        },
      ]);
    });

    it("should get all content for authenticated user", async () => {
      const response = await request(app)
        .get("/api/content")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(3);
    });

    it("should filter content by type", async () => {
      const response = await request(app)
        .get("/api/content?type=video")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].type).toBe("video");
    });

    it("should filter content by moduleId", async () => {
      const response = await request(app)
        .get(`/api/content?moduleId=${testModule.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      console.log(
        "DEBUG - Content moduleId structure:",
        JSON.stringify(response.body.data[0]?.moduleId, null, 2)
      );
      console.log(
        "DEBUG - Module ID type:",
        typeof response.body.data[0]?.moduleId
      );
      console.log("DEBUG - Expected module ID:", testModule.id.toString());

      expect(response.body.data).toHaveLength(3);
      response.body.data.forEach((content) => {
        // Check if moduleId is populated (object) or just the ID (string)
        if (typeof content.moduleId === "object" && content.moduleId !== null) {
          expect(content.moduleId.id).toBe(testModule.id.toString());
        } else {
          expect(content.moduleId).toBe(testModule.id.toString());
        }
      });
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/content?limit=2&page=1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.total).toBe(3);
      expect(response.body.pagination.pages).toBe(2);
    });

    it("should return 400 for invalid content type", async () => {
      await request(app)
        .get("/api/content?type=invalid")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });

    it("should return 400 for invalid moduleId format", async () => {
      await request(app)
        .get("/api/content?moduleId=invalid")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });

    it("should return 401 without authentication", async () => {
      await request(app).get("/api/content").expect(401);
    });
  });

  describe("POST /api/content", () => {
    it("should create video content with admin role", async () => {
      const response = await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(testContent)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(testContent.title);
      expect(response.body.data.type).toBe(testContent.type);

      // Check if moduleId is populated (object) or just the ID (string)
      if (
        typeof response.body.data.moduleId === "object" &&
        response.body.data.moduleId !== null
      ) {
        expect(response.body.data.moduleId.id).toBe(testModule.id.toString());
      } else {
        expect(response.body.data.moduleId).toBe(testModule.id.toString());
      }
    });

    it("should create lab content with instructions", async () => {
      const labContent = {
        ...testContent,
        type: "lab",
        instructions: "Complete this lab exercise",
        url: undefined,
      };

      const response = await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(labContent)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe("lab");
      expect(response.body.data.instructions).toBe(labContent.instructions);
    });

    it("should create game content with instructions", async () => {
      const gameContent = {
        ...testContent,
        type: "game",
        instructions: "Play this security game",
        url: undefined,
      };

      const response = await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(gameContent)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe("game");
      expect(response.body.data.instructions).toBe(gameContent.instructions);
    });

    it("should create document content", async () => {
      const documentContent = {
        ...testContent,
        type: "document",
        url: undefined,
        metadata: { format: "pdf", pages: 10 },
      };

      const response = await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(documentContent)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe("document");
      expect(response.body.data.metadata.format).toBe("pdf");
    });

    it("should return 400 for invalid video content (missing URL)", async () => {
      const invalidContent = {
        ...testContent,
        url: undefined,
      };

      await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidContent)
        .expect(400);
    });

    it("should return 400 for invalid lab content (missing instructions)", async () => {
      const invalidContent = {
        ...testContent,
        type: "lab",
        url: undefined,
      };

      await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidContent)
        .expect(400);
    });

    it("should return 404 for non-existent module", async () => {
      const invalidContent = {
        ...testContent,
        moduleId: new mongoose.Types.ObjectId(),
      };

      await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidContent)
        .expect(404);
    });

    it("should return 401 without authentication", async () => {
      await request(app).post("/api/content").send(testContent).expect(401);
    });
  });

  describe("GET /api/content/:id", () => {
    let createdContent;

    beforeEach(async () => {
      createdContent = await Content.create(testContent);
    });

    it("should get content by ID", async () => {
      const response = await request(app)
        .get(`/api/content/${createdContent.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdContent.id.toString());
      expect(response.body.data.title).toBe(testContent.title);
    });

    it("should return 400 for invalid ID format", async () => {
      await request(app)
        .get("/api/content/invalid-id")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });

    it("should return 404 for non-existent content", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/content/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });

    it("should return 401 without authentication", async () => {
      await request(app).get(`/api/content/${createdContent.id}`).expect(401);
    });
  });

  describe("PUT /api/content/:id", () => {
    let createdContent;

    beforeEach(async () => {
      createdContent = await Content.create(testContent);
    });

    it("should update content with admin role", async () => {
      const updateData = {
        title: "Updated Video Title",
        description: "Updated description",
      };

      const response = await request(app)
        .put(`/api/content/${createdContent.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
    });

    it("should return 403 for non-admin user", async () => {
      const updateData = { title: "Updated Title" };

      await request(app)
        .put(`/api/content/${createdContent.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(403);
    });

    it("should return 400 for invalid ID format", async () => {
      await request(app)
        .put("/api/content/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated" })
        .expect(400);
    });

    it("should return 404 for non-existent content", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/api/content/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated" })
        .expect(404);
    });

    it("should return 401 without authentication", async () => {
      await request(app)
        .put(`/api/content/${createdContent.id}`)
        .send({ title: "Updated" })
        .expect(401);
    });
  });

  describe("DELETE /api/content/:id", () => {
    let createdContent;

    beforeEach(async () => {
      createdContent = await Content.create(testContent);
    });

    it("should soft delete content with admin role", async () => {
      const response = await request(app)
        .delete(`/api/content/${createdContent.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify content is soft deleted
      const deletedContent = await Content.findById(createdContent.id);
      expect(deletedContent.isActive).toBe(false);
    });

    it("should return 403 for non-admin user", async () => {
      await request(app)
        .delete(`/api/content/${createdContent.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });

    it("should return 400 for invalid ID format", async () => {
      await request(app)
        .delete("/api/content/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });

    it("should return 404 for non-existent content", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/api/content/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should return 401 without authentication", async () => {
      await request(app)
        .delete(`/api/content/${createdContent.id}`)
        .expect(401);
    });
  });

  describe("DELETE /api/content/:id/permanent", () => {
    let createdContent;

    beforeEach(async () => {
      createdContent = await Content.create(testContent);
    });

    it("should permanently delete content with admin role", async () => {
      const response = await request(app)
        .delete(`/api/content/${createdContent.id}/permanent`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify content is permanently deleted
      const deletedContent = await Content.findById(createdContent.id);
      expect(deletedContent).toBeNull();
    });

    it("should return 403 for non-admin user", async () => {
      await request(app)
        .delete(`/api/content/${createdContent.id}/permanent`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });

    it("should return 401 without authentication", async () => {
      await request(app)
        .delete(`/api/content/${createdContent.id}/permanent`)
        .expect(401);
    });
  });

  describe("GET /api/content/module/:moduleId", () => {
    beforeEach(async () => {
      await Content.create([
        { ...testContent, title: "Content 1", section: "Section A" },
        { ...testContent, title: "Content 2", section: "Section B" },
        { ...testContent, title: "Content 3", section: "Section A" },
      ]);
    });

    it("should get content by module", async () => {
      const response = await request(app)
        .get(`/api/content/module/${testModule.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.count).toBe(3);
      response.body.data.forEach((content) => {
        // Check if moduleId is populated (object) or just the ID (string)
        if (typeof content.moduleId === "object" && content.moduleId !== null) {
          expect(content.moduleId.id).toBe(testModule.id.toString());
        } else {
          expect(content.moduleId).toBe(testModule.id.toString());
        }
      });
    });

    it("should return 400 for invalid module ID format", async () => {
      await request(app)
        .get("/api/content/module/invalid-id")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });

    it("should return 401 without authentication", async () => {
      await request(app)
        .get(`/api/content/module/${testModule.id}`)
        .expect(401);
    });
  });

  describe("GET /api/content/module/:moduleId/grouped", () => {
    beforeEach(async () => {
      await Content.create([
        { ...testContent, title: "Content 1", section: "Section A" },
        { ...testContent, title: "Content 2", section: "Section B" },
        { ...testContent, title: "Content 3", section: "Section A" },
      ]);
    });

    it("should get content grouped by sections", async () => {
      const response = await request(app)
        .get(`/api/content/module/${testModule.id}/grouped`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data["Section A"]).toHaveLength(2);
      expect(response.body.data["Section B"]).toHaveLength(1);
    });

    it("should return 400 for invalid module ID format", async () => {
      await request(app)
        .get("/api/content/module/invalid-id/grouped")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });

    it("should return 401 without authentication", async () => {
      await request(app)
        .get(`/api/content/module/${testModule.id}/grouped`)
        .expect(401);
    });
  });

  describe("GET /api/content/type/:type", () => {
    beforeEach(async () => {
      await Content.create([
        { ...testContent, type: "video", title: "Video 1" },
        {
          ...testContent,
          type: "lab",
          title: "Lab 1",
          instructions: "Lab instructions",
          url: undefined,
        },
        { ...testContent, type: "video", title: "Video 2" },
      ]);
    });

    it("should get content by type", async () => {
      const response = await request(app)
        .get("/api/content/type/video")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      response.body.data.forEach((content) => {
        expect(content.type).toBe("video");
      });
    });

    it("should filter by type and moduleId", async () => {
      const response = await request(app)
        .get(`/api/content/type/video?moduleId=${testModule.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((content) => {
        expect(content.type).toBe("video");
        // Check if moduleId is populated (object) or just the ID (string)
        if (typeof content.moduleId === "object" && content.moduleId !== null) {
          expect(content.moduleId.id).toBe(testModule.id.toString());
        } else {
          expect(content.moduleId).toBe(testModule.id.toString());
        }
      });
    });

    it("should return 400 for invalid content type", async () => {
      await request(app)
        .get("/api/content/type/invalid")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });

    it("should return 400 for invalid moduleId in query", async () => {
      await request(app)
        .get("/api/content/type/video?moduleId=invalid")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });

    it("should return 401 without authentication", async () => {
      await request(app).get("/api/content/type/video").expect(401);
    });
  });
});
