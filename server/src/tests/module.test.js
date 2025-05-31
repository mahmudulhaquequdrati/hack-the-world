const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const Module = require("../models/Module");
const Phase = require("../models/Phase");

// Import middleware and routes
const errorHandler = require("../middleware/errorHandler");
const moduleRoutes = require("../routes/modules");

// Create test app without starting server
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/modules", moduleRoutes);
  app.use(errorHandler);
  return app;
};

describe("📚 Module System Tests", () => {
  let mongoServer;
  let testPhase;
  let testModule;
  let app;

  beforeAll(async () => {
    // Create test app
    app = createTestApp();

    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up and close connections
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear existing data
    await Module.deleteMany({});
    await Phase.deleteMany({});

    // Create test phase
    testPhase = await Phase.create({
      phaseId: "beginner",
      title: "Beginner Phase",
      description: "Foundation courses for cybersecurity beginners",
      icon: "Lightbulb",
      color: "#22c55e",
      order: 1,
    });

    // Create test module
    testModule = await Module.create({
      moduleId: "test-foundations",
      phaseId: "beginner",
      title: "Test Cybersecurity Foundations",
      description: "Essential concepts and terminology for testing",
      icon: "Shield",
      duration: "2-3 weeks",
      difficulty: "Beginner",
      color: "text-blue-400",
      path: "/course/test-foundations",
      enrollPath: "/learn/test-foundations",
      order: 1,
      topics: ["Security Basics", "Threat Models", "Risk Assessment"],
    });
  });

  afterEach(async () => {
    await Module.deleteMany({});
    await Phase.deleteMany({});
  });

  describe("GET /api/modules", () => {
    it("should get all modules", async () => {
      const response = await request(app).get("/api/modules").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Modules retrieved successfully");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.count).toBe(1);
    });

    it("should get modules by phase", async () => {
      const response = await request(app)
        .get("/api/modules?phase=beginner")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].phaseId).toBe("beginner");
    });

    it("should get modules grouped by phase", async () => {
      const response = await request(app)
        .get("/api/modules?grouped=true")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(typeof response.body.data).toBe("object");
      expect(response.body.data.beginner).toBeDefined();
      expect(response.body.data.beginner.modules.length).toBe(1);
    });
  });

  describe("GET /api/modules/with-phases", () => {
    it("should get phases with their modules for course page", async () => {
      const response = await request(app)
        .get("/api/modules/with-phases")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Phases with modules retrieved successfully"
      );
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);

      const phaseWithModules = response.body.data[0];
      expect(phaseWithModules.phaseId).toBe("beginner");
      expect(phaseWithModules.title).toBe("Beginner Phase");
      expect(Array.isArray(phaseWithModules.modules)).toBe(true);
      expect(phaseWithModules.modules.length).toBe(1);
      expect(phaseWithModules.modules[0].moduleId).toBe("test-foundations");
    });
  });

  describe("GET /api/modules/:moduleId", () => {
    it("should get single module by moduleId", async () => {
      const response = await request(app)
        .get("/api/modules/test-foundations")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Module retrieved successfully");
      expect(response.body.data.moduleId).toBe("test-foundations");
      expect(response.body.data.title).toBe("Test Cybersecurity Foundations");
      expect(response.body.data.phaseId).toBe("beginner");
      expect(response.body.data.topics).toEqual([
        "Security Basics",
        "Threat Models",
        "Risk Assessment",
      ]);
    });

    it("should return 404 for non-existent module", async () => {
      const response = await request(app)
        .get("/api/modules/non-existent")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });
  });

  describe("POST /api/modules", () => {
    const validModuleData = {
      moduleId: "new-module",
      phaseId: "beginner",
      title: "New Test Module",
      description: "A new module for testing",
      icon: "Code",
      duration: "1-2 weeks",
      difficulty: "Beginner",
      color: "text-green-400",
      order: 2,
      topics: ["New Topic 1", "New Topic 2"],
    };

    it("should create new module with valid data", async () => {
      const response = await request(app)
        .post("/api/modules")
        .send(validModuleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Module created successfully");
      expect(response.body.data.moduleId).toBe("new-module");
      expect(response.body.data.title).toBe("New Test Module");
      expect(response.body.data.path).toBe("/course/new-module");
      expect(response.body.data.enrollPath).toBe("/learn/new-module");
    });

    it("should not create module with duplicate moduleId", async () => {
      const duplicateData = {
        ...validModuleData,
        moduleId: "test-foundations", // Already exists
      };

      const response = await request(app)
        .post("/api/modules")
        .send(duplicateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    it("should not create module with non-existent phase", async () => {
      const invalidData = {
        ...validModuleData,
        phaseId: "non-existent-phase",
      };

      const response = await request(app)
        .post("/api/modules")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation error");
    });

    it("should not create module with duplicate order in same phase", async () => {
      const duplicateOrderData = {
        ...validModuleData,
        order: 1, // Same as existing module
      };

      const response = await request(app)
        .post("/api/modules")
        .send(duplicateOrderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Order 1 is already taken");
    });

    it("should validate required fields", async () => {
      const invalidData = {
        moduleId: "incomplete-module",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/modules")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/modules/:moduleId", () => {
    it("should update module with valid data", async () => {
      const updateData = {
        title: "Updated Test Module",
        description: "Updated description",
        duration: "3-4 weeks",
      };

      const response = await request(app)
        .put("/api/modules/test-foundations")
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Module updated successfully");
      expect(response.body.data.title).toBe("Updated Test Module");
      expect(response.body.data.description).toBe("Updated description");
      expect(response.body.data.duration).toBe("3-4 weeks");
    });

    it("should return 404 for non-existent module", async () => {
      const response = await request(app)
        .put("/api/modules/non-existent")
        .send({ title: "Updated Title" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });

    it("should validate phase exists when updating phaseId", async () => {
      const response = await request(app)
        .put("/api/modules/test-foundations")
        .send({ phaseId: "non-existent-phase" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation error");
    });
  });

  describe("DELETE /api/modules/:moduleId", () => {
    it("should delete module", async () => {
      const response = await request(app)
        .delete("/api/modules/test-foundations")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Module deleted successfully");

      // Verify module is soft deleted (still exists but isActive: false)
      const deletedModule = await Module.findOne({
        moduleId: "test-foundations",
      });
      expect(deletedModule).not.toBeNull();
      expect(deletedModule.isActive).toBe(false);
    });

    it("should return 404 for non-existent module", async () => {
      const response = await request(app)
        .delete("/api/modules/non-existent")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });
  });

  describe("GET /api/modules/phase/:phaseId", () => {
    it("should get modules by phase", async () => {
      const response = await request(app)
        .get("/api/modules/phase/beginner")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].phaseId).toBe("beginner");
    });

    it("should return empty array for phase with no modules", async () => {
      // Create another phase
      await Phase.create({
        phaseId: "intermediate",
        title: "Intermediate Phase",
        description: "Intermediate courses",
        icon: "Target",
        color: "#fbbf24",
        order: 2,
      });

      const response = await request(app)
        .get("/api/modules/phase/intermediate")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe("Module Model Validation", () => {
    it("should auto-generate paths if not provided", async () => {
      const moduleData = {
        moduleId: "auto-path-module",
        phaseId: "beginner",
        title: "Auto Path Module",
        description: "Testing auto path generation",
        icon: "Code",
        duration: "1 week",
        difficulty: "Beginner",
        color: "text-blue-400",
        order: 3,
        // No path or enrollPath provided
      };

      const module = await Module.create(moduleData);

      expect(module.path).toBe("/course/auto-path-module");
      expect(module.enrollPath).toBe("/learn/auto-path-module");
    });

    it("should validate moduleId format", async () => {
      const invalidModuleData = {
        moduleId: "Invalid Module ID!", // Contains invalid characters
        phaseId: "beginner",
        title: "Invalid Module",
        description: "Testing validation",
        icon: "Code",
        duration: "1 week",
        difficulty: "Beginner",
        color: "text-blue-400",
        order: 4,
      };

      await expect(Module.create(invalidModuleData)).rejects.toThrow();
    });

    it("should validate difficulty enum", async () => {
      const invalidDifficultyData = {
        moduleId: "invalid-difficulty",
        phaseId: "beginner",
        title: "Invalid Difficulty Module",
        description: "Testing difficulty validation",
        icon: "Code",
        duration: "1 week",
        difficulty: "InvalidDifficulty", // Not in enum
        color: "text-blue-400",
        order: 5,
      };

      await expect(Module.create(invalidDifficultyData)).rejects.toThrow();
    });

    it("should validate topics array", async () => {
      const validTopicsData = {
        moduleId: "valid-topics",
        phaseId: "beginner",
        title: "Valid Topics Module",
        description: "Testing topics validation",
        icon: "Code",
        duration: "1 week",
        difficulty: "Beginner",
        color: "text-blue-400",
        order: 6,
        topics: ["Valid Topic 1", "Valid Topic 2"],
      };

      const module = await Module.create(validTopicsData);
      expect(module.topics).toEqual(["Valid Topic 1", "Valid Topic 2"]);
    });
  });

  describe("Module Static Methods", () => {
    beforeEach(async () => {
      // Create additional test data
      await Module.create({
        moduleId: "second-module",
        phaseId: "beginner",
        title: "Second Module",
        description: "Second test module",
        icon: "Network",
        duration: "2 weeks",
        difficulty: "Beginner",
        color: "text-purple-400",
        order: 2,
      });
    });

    it("should get modules by phase using static method", async () => {
      const modules = await Module.getByPhase("beginner");
      expect(modules.length).toBe(2);
      expect(modules[0].order).toBeLessThan(modules[1].order); // Should be sorted by order
    });

    it("should get all modules with phases", async () => {
      const modules = await Module.getAllWithPhases();
      expect(modules.length).toBe(2);
      expect(modules[0].phase).toBeDefined();
      expect(modules[0].phase.phaseId).toBe("beginner");
    });

    it("should get modules grouped by phase", async () => {
      const grouped = await Module.getGroupedByPhase();
      expect(grouped.beginner).toBeDefined();
      expect(grouped.beginner.phase).toBeDefined();
      expect(grouped.beginner.modules.length).toBe(2);
    });
  });

  describe("Module-Phase Integration", () => {
    it("should populate phase information in module", async () => {
      const module = await Module.findOne({
        moduleId: "test-foundations",
      }).populate("phase");

      expect(module.phase).toBeDefined();
      expect(module.phase.phaseId).toBe("beginner");
      expect(module.phase.title).toBe("Beginner Phase");
    });

    it("should prevent creating module with non-existent phase", async () => {
      const invalidModuleData = {
        moduleId: "invalid-phase-module",
        phaseId: "non-existent",
        title: "Invalid Phase Module",
        description: "Testing phase validation",
        icon: "Code",
        duration: "1 week",
        difficulty: "Beginner",
        color: "text-blue-400",
        order: 7,
      };

      await expect(Module.create(invalidModuleData)).rejects.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should handle database connection errors gracefully", async () => {
      // This test would require mocking mongoose connection
      // For now, we'll test that the endpoints handle errors properly
      const response = await request(app)
        .get("/api/modules/invalid-id-format")
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should validate required fields on creation", async () => {
      const incompleteData = {
        moduleId: "incomplete",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/modules")
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("📚 Content Tracking Features", () => {
    describe("Content Fields in Module Creation", () => {
      it("should create module with content arrays", async () => {
        const moduleWithContent = {
          moduleId: "content-test-module",
          phaseId: "beginner",
          title: "Content Test Module",
          description: "Testing content tracking",
          icon: "Code",
          duration: "1 week",
          difficulty: "Beginner",
          color: "text-blue-400",
          order: 3,
          content: {
            videos: ["video-001", "video-002", "video-003"],
            labs: ["lab-001", "lab-002"],
            games: ["game-001"],
          },
        };

        const response = await request(app)
          .post("/api/modules")
          .send(moduleWithContent)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.content.videos).toEqual([
          "video-001",
          "video-002",
          "video-003",
        ]);
        expect(response.body.data.content.labs).toEqual(["lab-001", "lab-002"]);
        expect(response.body.data.content.games).toEqual(["game-001"]);

        // Check content statistics are automatically calculated
        expect(response.body.data.contentStats.totalVideos).toBe(3);
        expect(response.body.data.contentStats.totalLabs).toBe(2);
        expect(response.body.data.contentStats.totalGames).toBe(1);
        expect(response.body.data.contentStats.totalContent).toBe(6);
      });

      it("should create module with empty content arrays by default", async () => {
        const basicModule = {
          moduleId: "basic-content-module",
          phaseId: "beginner",
          title: "Basic Module",
          description: "Basic module without content",
          icon: "Shield",
          duration: "1 week",
          difficulty: "Beginner",
          color: "text-green-400",
          order: 4,
        };

        const response = await request(app)
          .post("/api/modules")
          .send(basicModule)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.content.videos).toEqual([]);
        expect(response.body.data.content.labs).toEqual([]);
        expect(response.body.data.content.games).toEqual([]);
        expect(response.body.data.contentStats.totalContent).toBe(0);
      });
    });

    describe("Content Validation", () => {
      it("should validate content array elements", async () => {
        const invalidContentModule = {
          moduleId: "invalid-content-module",
          phaseId: "beginner",
          title: "Invalid Content Module",
          description: "Testing content validation",
          icon: "Bug",
          duration: "1 week",
          difficulty: "Beginner",
          color: "text-red-400",
          order: 5,
          content: {
            videos: ["", "valid-video"], // Empty string should fail
            labs: ["valid-lab"],
            games: ["valid-game"],
          },
        };

        const response = await request(app)
          .post("/api/modules")
          .send(invalidContentModule)
          .expect(400);

        expect(response.body.success).toBe(false);
      });

      it("should handle very long content IDs", async () => {
        const longContentModule = {
          moduleId: "long-content-module",
          phaseId: "beginner",
          title: "Long Content Module",
          description: "Testing long content IDs",
          icon: "Target",
          duration: "1 week",
          difficulty: "Beginner",
          color: "text-yellow-400",
          order: 6,
          content: {
            videos: ["a".repeat(101)], // Exceeds 100 character limit
          },
        };

        const response = await request(app)
          .post("/api/modules")
          .send(longContentModule)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe("Content Statistics Update", () => {
      beforeEach(async () => {
        // Create a module with initial content for testing updates
        await Module.create({
          moduleId: "stats-test-module",
          phaseId: "beginner",
          title: "Stats Test Module",
          description: "Testing content statistics",
          icon: "BarChart",
          duration: "1 week",
          difficulty: "Beginner",
          color: "text-purple-400",
          order: 7,
          content: {
            videos: ["video-001"],
            labs: ["lab-001"],
            games: [],
          },
        });
      });

      it("should update content statistics when content is modified", async () => {
        const updateData = {
          content: {
            videos: ["video-001", "video-002", "video-003"],
            labs: ["lab-001", "lab-002"],
            games: ["game-001", "game-002"],
          },
        };

        const response = await request(app)
          .put("/api/modules/stats-test-module")
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.contentStats.totalVideos).toBe(3);
        expect(response.body.data.contentStats.totalLabs).toBe(2);
        expect(response.body.data.contentStats.totalGames).toBe(2);
        expect(response.body.data.contentStats.totalContent).toBe(7);
      });
    });

    describe("Static Methods for Content Management", () => {
      beforeEach(async () => {
        // Create a test module for content management
        await Module.create({
          moduleId: "content-management-test",
          phaseId: "beginner",
          title: "Content Management Test",
          description: "Testing content management methods",
          icon: "Settings",
          duration: "1 week",
          difficulty: "Beginner",
          color: "text-indigo-400",
          order: 8,
          content: {
            videos: ["existing-video"],
            labs: [],
            games: ["existing-game"],
          },
        });
      });

      it("should add content to module using static method", async () => {
        // Test addContentToModule static method
        const updatedModule = await Module.addContentToModule(
          "content-management-test",
          "videos",
          "new-video"
        );

        expect(updatedModule.content.videos).toContain("new-video");
        expect(updatedModule.content.videos).toContain("existing-video");
        expect(updatedModule.contentStats.totalVideos).toBe(2);
        expect(updatedModule.contentStats.totalContent).toBe(3); // 2 videos + 1 game
      });

      it("should not add duplicate content", async () => {
        // Try to add existing content
        const updatedModule = await Module.addContentToModule(
          "content-management-test",
          "videos",
          "existing-video"
        );

        expect(updatedModule.content.videos.length).toBe(1);
        expect(updatedModule.content.videos).toEqual(["existing-video"]);
      });

      it("should remove content from module using static method", async () => {
        // Test removeContentFromModule static method
        const updatedModule = await Module.removeContentFromModule(
          "content-management-test",
          "games",
          "existing-game"
        );

        expect(updatedModule.content.games).not.toContain("existing-game");
        expect(updatedModule.contentStats.totalGames).toBe(0);
        expect(updatedModule.contentStats.totalContent).toBe(1); // Only 1 video left
      });

      it("should handle removing non-existent content gracefully", async () => {
        // Try to remove non-existent content
        const updatedModule = await Module.removeContentFromModule(
          "content-management-test",
          "labs",
          "non-existent-lab"
        );

        expect(updatedModule.content.labs.length).toBe(0);
        expect(updatedModule.contentStats.totalLabs).toBe(0);
      });

      it("should validate content type in static methods", async () => {
        await expect(
          Module.addContentToModule(
            "content-management-test",
            "invalid-type",
            "content-id"
          )
        ).rejects.toThrow("Invalid content type");

        await expect(
          Module.removeContentFromModule(
            "content-management-test",
            "invalid-type",
            "content-id"
          )
        ).rejects.toThrow("Invalid content type");
      });

      it("should handle non-existent module in static methods", async () => {
        await expect(
          Module.addContentToModule("non-existent", "videos", "video-id")
        ).rejects.toThrow("Module with ID 'non-existent' not found");

        await expect(
          Module.removeContentFromModule("non-existent", "videos", "video-id")
        ).rejects.toThrow("Module with ID 'non-existent' not found");
      });
    });

    describe("Content in API Responses", () => {
      beforeEach(async () => {
        // Create modules with content for API testing
        await Module.create({
          moduleId: "api-content-test-1",
          phaseId: "beginner",
          title: "API Content Test 1",
          description: "Testing content in API responses",
          icon: "Globe",
          duration: "1 week",
          difficulty: "Beginner",
          color: "text-teal-400",
          order: 9,
          content: {
            videos: ["video-001", "video-002"],
            labs: ["lab-001"],
            games: ["game-001", "game-002", "game-003"],
          },
        });
      });

      it("should include content in module list API", async () => {
        const response = await request(app).get("/api/modules").expect(200);

        const module = response.body.data.find(
          (m) => m.moduleId === "api-content-test-1"
        );
        expect(module).toBeDefined();
        expect(module.content.videos).toEqual(["video-001", "video-002"]);
        expect(module.content.labs).toEqual(["lab-001"]);
        expect(module.content.games).toEqual([
          "game-001",
          "game-002",
          "game-003",
        ]);
        expect(module.contentStats.totalContent).toBe(6);
      });

      it("should include content in single module API", async () => {
        const response = await request(app)
          .get("/api/modules/api-content-test-1")
          .expect(200);

        expect(response.body.data.content.videos).toEqual([
          "video-001",
          "video-002",
        ]);
        expect(response.body.data.contentStats.totalVideos).toBe(2);
        expect(response.body.data.contentStats.totalLabs).toBe(1);
        expect(response.body.data.contentStats.totalGames).toBe(3);
      });

      it("should include content in phases with modules API", async () => {
        const response = await request(app)
          .get("/api/modules/with-phases")
          .expect(200);

        const beginnerPhase = response.body.data.find(
          (phase) => phase.phaseId === "beginner"
        );
        const module = beginnerPhase.modules.find(
          (m) => m.moduleId === "api-content-test-1"
        );

        expect(module).toBeDefined();
        expect(module.content).toBeDefined();
        expect(module.contentStats.totalContent).toBe(6);
      });
    });
  });
});
