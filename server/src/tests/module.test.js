const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const Module = require("../models/Module");
const Phase = require("../models/Phase");

// Import middleware and routes
const errorHandler = require("../middleware/errorHandler");
const moduleRoutes = require("../routes/modules");

// Import test app with auth bypass
const app = require("./testApp");

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

  beforeAll(async () => {
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

    // Create test phase first
    testPhase = await Phase.create({
      title: "Beginner Phase",
      description: "Foundation courses for cybersecurity beginners",
      icon: "Lightbulb",
      color: "#22c55e",
      order: 1,
    });

    // Create test module using the phase's ObjectId
    testModule = await Module.create({
      phaseId: testPhase.id, // Use ObjectId instead of string
      title: "Test Cybersecurity Foundations",
      description: "Essential concepts and terminology for testing",
      icon: "Shield",
      duration: "2-3 weeks",
      difficulty: "Beginner",
      color: "text-blue-400",
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

      // Check that id is properly returned
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0]._id).toBeUndefined();
    });

    it("should get modules by phase", async () => {
      const response = await request(app)
        .get(`/api/modules?phase=${testPhase.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].phaseId).toBe(testPhase.id.toString());
    });

    it("should get modules grouped by phase", async () => {
      const response = await request(app)
        .get("/api/modules?grouped=true")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(typeof response.body.data).toBe("object");
      // Check using ObjectId as key
      const phaseKey = testPhase.id.toString();
      expect(response.body.data[phaseKey]).toBeDefined();
      expect(response.body.data[phaseKey].modules.length).toBe(1);
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
      expect(phaseWithModules.id).toBe(testPhase.id.toString());
      expect(phaseWithModules.title).toBe("Beginner Phase");
      expect(Array.isArray(phaseWithModules.modules)).toBe(true);
      expect(phaseWithModules.modules.length).toBe(1);
      expect(phaseWithModules.modules[0].id).toBe(testModule.id.toString());
    });
  });

  describe("GET /api/modules/:id", () => {
    it("should get single module by id", async () => {
      const response = await request(app)
        .get(`/api/modules/${testModule.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Module retrieved successfully");
      expect(response.body.data.id).toBe(testModule.id.toString());
      expect(response.body.data.title).toBe("Test Cybersecurity Foundations");
      expect(response.body.data.phaseId).toBe(testPhase.id.toString());
      expect(response.body.data.topics).toEqual([
        "Security Basics",
        "Threat Models",
        "Risk Assessment",
      ]);
    });

    it("should return 404 for non-existent module", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/modules/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });
  });

  describe("POST /api/modules", () => {
    const getValidModuleData = () => ({
      phaseId: testPhase.id.toString(), // Use testPhase ObjectId
      title: "New Test Module",
      description: "A new module for testing",
      icon: "Code",
      duration: "1-2 weeks",
      difficulty: "Beginner",
      color: "text-green-400",
      order: 2,
      topics: ["New Topic 1", "New Topic 2"],
    });

    it("should create new module with valid data", async () => {
      const validModuleData = getValidModuleData();
      const response = await request(app)
        .post("/api/modules")
        .send(validModuleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Module created successfully");
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe("New Test Module");
      expect(response.body.data.phaseId).toBe(testPhase.id.toString());
    });

    it("should not create module with non-existent phase", async () => {
      const nonExistentPhaseId = new mongoose.Types.ObjectId();
      const invalidData = {
        ...getValidModuleData(),
        phaseId: nonExistentPhaseId.toString(),
      };

      const response = await request(app)
        .post("/api/modules")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("does not exist");
    });

    it("should not create module with duplicate order in same phase", async () => {
      const duplicateOrderData = {
        ...getValidModuleData(),
        order: 1, // Same as existing module
      };

      const response = await request(app)
        .post("/api/modules")
        .send(duplicateOrderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("duplicate key error");
    });

    it("should validate required fields", async () => {
      const invalidData = {
        title: "Incomplete Module",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/modules")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/modules/:id", () => {
    it("should update module with valid data", async () => {
      const updateData = {
        title: "Updated Test Module",
        description: "Updated description for testing",
        difficulty: "Intermediate",
      };

      const response = await request(app)
        .put(`/api/modules/${testModule.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Module updated successfully");
      expect(response.body.data.title).toBe("Updated Test Module");
      expect(response.body.data.difficulty).toBe("Intermediate");
    });

    it("should validate phase exists when updating phaseId", async () => {
      const nonExistentPhaseId = new mongoose.Types.ObjectId();
      const updateData = {
        phaseId: nonExistentPhaseId.toString(),
      };

      const response = await request(app)
        .put(`/api/modules/${testModule.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("does not exist");
    });

    it("should return 404 for non-existent module", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = { title: "Updated Title" };

      const response = await request(app)
        .put(`/api/modules/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });
  });

  describe("DELETE /api/modules/:id", () => {
    it("should delete module", async () => {
      const response = await request(app)
        .delete(`/api/modules/${testModule.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Module deleted successfully");

      // Verify module is actually deleted
      const deletedModule = await Module.findById(testModule.id);
      expect(deletedModule).toBeNull();
    });

    it("should return 404 for non-existent module", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/modules/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });
  });

  describe("GET /api/modules/phase/:phaseId", () => {
    it("should get modules by phase", async () => {
      const response = await request(app)
        .get(`/api/modules/phase/${testPhase.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].phaseId).toBe(testPhase.id.toString());
    });

    it("should return empty array for phase with no modules", async () => {
      // Create another phase with no modules
      const emptyPhase = await Phase.create({
        title: "Empty Phase",
        description: "A phase with no modules",
        icon: "Empty",
        color: "#ff0000",
        order: 2,
      });

      const response = await request(app)
        .get(`/api/modules/phase/${emptyPhase.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe("Module Model Validation", () => {
    it("should auto-generate content arrays if not provided", async () => {
      const moduleData = {
        phaseId: testPhase.id,
        title: "Content Test Module",
        description: "Testing content arrays",
        icon: "Test",
        difficulty: "Beginner",
        color: "text-red-400",
        order: 3,
      };

      const module = await Module.create(moduleData);

      expect(module.content.videos).toEqual([]);
      expect(module.content.labs).toEqual([]);
      expect(module.content.games).toEqual([]);
      expect(module.content.documents).toEqual([]);
    });

    it("should validate difficulty enum", async () => {
      const invalidData = {
        phaseId: testPhase.id,
        title: "Invalid Difficulty Module",
        description: "Testing invalid difficulty",
        icon: "Test",
        difficulty: "Invalid",
        color: "text-red-400",
        order: 4,
      };

      await expect(Module.create(invalidData)).rejects.toThrow();
    });

    it("should validate topics array", async () => {
      const moduleWithTopics = await Module.create({
        phaseId: testPhase.id,
        title: "Topics Test Module",
        description: "Testing topics validation",
        icon: "Test",
        difficulty: "Beginner",
        color: "text-blue-400",
        order: 5,
        topics: ["Valid Topic", "Another Topic"],
      });

      expect(moduleWithTopics.topics).toEqual(["Valid Topic", "Another Topic"]);
    });
  });

  describe("Module Static Methods", () => {
    it("should get modules by phase using static method", async () => {
      const modules = await Module.getByPhase(testPhase.id);
      expect(modules.length).toBe(1);
      expect(modules[0].phaseId.toString()).toBe(testPhase.id.toString());
    });

    it("should get all modules with phases", async () => {
      const modules = await Module.getAllWithPhases();
      expect(modules.length).toBe(1);
      expect(modules[0].phase).toBeDefined();
      expect(modules[0].phase.title).toBe("Beginner Phase");
    });

    it("should get modules grouped by phase", async () => {
      const grouped = await Module.getGroupedByPhase();
      const phaseKey = testPhase.id.toString();
      expect(grouped[phaseKey]).toBeDefined();
      expect(grouped[phaseKey].modules.length).toBe(1);
      expect(grouped[phaseKey].phase.title).toBe("Beginner Phase");
    });
  });

  describe("Module-Phase Integration", () => {
    it("should populate phase information in module", async () => {
      const module = await Module.findById(testModule.id).populate("phase");
      expect(module.phase).toBeDefined();
      expect(module.phase.title).toBe("Beginner Phase");
      expect(module.phase.id).toBe(testPhase.id.toString());
    });

    it("should prevent creating module with non-existent phase", async () => {
      const nonExistentPhaseId = new mongoose.Types.ObjectId();
      const invalidData = {
        phaseId: nonExistentPhaseId,
        title: "Invalid Phase Module",
        description: "Should fail validation",
        icon: "Error",
        difficulty: "Beginner",
        color: "text-red-400",
        order: 6,
      };

      await expect(Module.create(invalidData)).rejects.toThrow(
        "does not exist"
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle database connection errors gracefully", async () => {
      // This test ensures our error handling works
      const invalidId = "invalid-object-id";
      const response = await request(app)
        .get(`/api/modules/${invalidId}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should validate required fields on creation", async () => {
      const incompleteData = {
        title: "Incomplete Module",
        // Missing required fields like phaseId, description, etc.
      };

      await expect(Module.create(incompleteData)).rejects.toThrow();
    });
  });

  describe("📚 Content Tracking Features", () => {
    describe("Content Fields in Module Creation", () => {
      it("should create module with content arrays", async () => {
        const moduleData = {
          phaseId: testPhase.id,
          title: "Content Test Module",
          description: "Module with initial content",
          icon: "Content",
          difficulty: "Intermediate",
          color: "text-green-400",
          order: 7,
          content: {
            videos: ["video-1", "video-2"],
            labs: ["lab-1"],
            games: [],
            documents: ["doc-1"],
            estimatedHours: 4,
          },
        };

        const module = await Module.create(moduleData);

        expect(module.content.videos).toEqual(["video-1", "video-2"]);
        expect(module.content.labs).toEqual(["lab-1"]);
        expect(module.content.games).toEqual([]);
        expect(module.content.documents).toEqual(["doc-1"]);
        expect(module.content.estimatedHours).toBe(4);
      });

      it("should create module with empty content arrays by default", async () => {
        const moduleData = {
          phaseId: testPhase.id,
          title: "Empty Content Module",
          description: "Module with default empty content",
          icon: "Empty",
          difficulty: "Beginner",
          color: "text-gray-400",
          order: 8,
        };

        const module = await Module.create(moduleData);

        expect(module.content.videos).toEqual([]);
        expect(module.content.labs).toEqual([]);
        expect(module.content.games).toEqual([]);
        expect(module.content.documents).toEqual([]);
      });
    });

    describe("Content Validation", () => {
      it("should validate content array elements", async () => {
        const moduleData = {
          phaseId: testPhase.id,
          title: "Validation Test Module",
          description: "Testing content validation",
          icon: "Validate",
          difficulty: "Advanced",
          color: "text-orange-400",
          order: 9,
          content: {
            videos: ["valid-video-id"],
            labs: [""], // Invalid: empty string
          },
        };

        await expect(Module.create(moduleData)).rejects.toThrow();
      });

      it("should handle very long content IDs", async () => {
        const longId = "a".repeat(150); // Too long (>100 characters)
        const moduleData = {
          phaseId: testPhase.id,
          title: "Long ID Test Module",
          description: "Testing very long content IDs",
          icon: "Long",
          difficulty: "Expert",
          color: "text-red-400",
          order: 10,
          content: {
            videos: [longId],
          },
        };

        await expect(Module.create(moduleData)).rejects.toThrow();
      });
    });

    describe("Content Statistics Update", () => {
      it("should update content statistics when content is modified", async () => {
        const module = await Module.create({
          phaseId: testPhase.id,
          title: "Dynamic Content Module",
          description: "Module for testing dynamic content updates",
          icon: "Dynamic",
          difficulty: "Intermediate",
          color: "text-teal-400",
          order: 11,
        });

        // Add some content
        module.content.videos.push("new-video-1", "new-video-2");
        module.content.labs.push("new-lab-1");
        await module.save();

        const updatedModule = await Module.findById(module.id);
        expect(updatedModule.content.videos.length).toBe(2);
        expect(updatedModule.content.labs.length).toBe(1);
      });
    });

    describe("Static Methods for Content Management", () => {
      it("should add content to module using static method", async () => {
        const result = await Module.addContentToModule(
          testModule.id,
          "videos",
          "new-video-content"
        );

        expect(result.content.videos).toContain("new-video-content");
      });

      it("should not add duplicate content", async () => {
        // Add content first time
        await Module.addContentToModule(testModule.id, "labs", "duplicate-lab");

        // Try to add same content again
        const result = await Module.addContentToModule(
          testModule.id,
          "labs",
          "duplicate-lab"
        );

        // Should only appear once
        const labCount = result.content.labs.filter(
          (lab) => lab === "duplicate-lab"
        ).length;
        expect(labCount).toBe(1);
      });

      it("should remove content from module using static method", async () => {
        // First add some content
        await Module.addContentToModule(
          testModule.id,
          "games",
          "removable-game"
        );

        // Then remove it
        const result = await Module.removeContentFromModule(
          testModule.id,
          "games",
          "removable-game"
        );

        expect(result.content.games).not.toContain("removable-game");
      });

      it("should handle removing non-existent content gracefully", async () => {
        const result = await Module.removeContentFromModule(
          testModule.id,
          "documents",
          "non-existent-doc"
        );

        // Should not throw error, just return module unchanged
        expect(result).toBeDefined();
        expect(result.content.documents).not.toContain("non-existent-doc");
      });

      it("should validate content type in static methods", async () => {
        await expect(
          Module.addContentToModule(testModule.id, "invalid-type", "content-1")
        ).rejects.toThrow("Invalid content type");

        await expect(
          Module.removeContentFromModule(
            testModule.id,
            "invalid-type",
            "content-1"
          )
        ).rejects.toThrow("Invalid content type");
      });

      it("should handle non-existent module in static methods", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        await expect(
          Module.addContentToModule(nonExistentId, "videos", "video-1")
        ).rejects.toThrow("not found");

        await expect(
          Module.removeContentFromModule(nonExistentId, "videos", "video-1")
        ).rejects.toThrow("not found");
      });
    });

    describe("Content in API Responses", () => {
      it("should include content in module list API", async () => {
        // Add some content to test module
        testModule.content.videos.push("api-test-video");
        testModule.content.labs.push("api-test-lab");
        await testModule.save();

        const response = await request(app).get("/api/modules").expect(200);

        expect(response.body.data[0].content).toBeDefined();
        expect(response.body.data[0].content.videos).toContain(
          "api-test-video"
        );
        expect(response.body.data[0].content.labs).toContain("api-test-lab");
      });

      it("should include content in single module API", async () => {
        // Add content for testing
        testModule.content.games.push("single-api-game");
        await testModule.save();

        const response = await request(app)
          .get(`/api/modules/${testModule.id}`)
          .expect(200);

        expect(response.body.data.content).toBeDefined();
        expect(response.body.data.content.games).toContain("single-api-game");
      });

      it("should include content in phases with modules API", async () => {
        // Add content for testing
        testModule.content.documents.push("phases-api-doc");
        await testModule.save();

        const response = await request(app)
          .get("/api/modules/with-phases")
          .expect(200);

        const moduleData = response.body.data[0].modules[0];
        expect(moduleData.content).toBeDefined();
        expect(moduleData.content.documents).toContain("phases-api-doc");
      });
    });
  });
});
