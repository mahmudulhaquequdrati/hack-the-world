const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../index");
const Phase = require("../models/Phase");
const { defaultPhases } = require("../utils/seedPhases");

describe("Phase API Endpoints", () => {
  let mongoServer;

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
    // Clear the phases collection before each test
    await Phase.deleteMany({});
  });

  describe("GET /api/phases", () => {
    it("should return empty array when no phases exist", async () => {
      const response = await request(app).get("/api/phases").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phases retrieved successfully");
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    it("should return all phases ordered by order field", async () => {
      // Create test phases in reverse order
      await Phase.create([
        { ...defaultPhases[2] }, // advanced (order: 3)
        { ...defaultPhases[0] }, // beginner (order: 1)
        { ...defaultPhases[1] }, // intermediate (order: 2)
      ]);

      const response = await request(app).get("/api/phases").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);

      // Should be ordered by order field (1, 2, 3)
      expect(response.body.data[0].phaseId).toBe("beginner");
      expect(response.body.data[1].phaseId).toBe("intermediate");
      expect(response.body.data[2].phaseId).toBe("advanced");

      // Should not have _id field
      expect(response.body.data[0]._id).toBeUndefined();
    });
  });

  describe("GET /api/phases/:phaseId", () => {
    beforeEach(async () => {
      await Phase.create(defaultPhases[0]); // Create beginner phase
    });

    it("should return specific phase by phaseId", async () => {
      const response = await request(app)
        .get("/api/phases/beginner")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phase retrieved successfully");
      expect(response.body.data.phaseId).toBe("beginner");
      expect(response.body.data.title).toBe("Beginner Phase");
      expect(response.body.data._id).toBeUndefined();
    });

    it("should return 404 for non-existent phase", async () => {
      const response = await request(app).get("/api/phases/expert").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Phase with ID expert not found");
    });

    it("should return 400 for invalid phaseId", async () => {
      const response = await request(app)
        .get("/api/phases/invalid-phase")
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /api/phases", () => {
    it("should create a new phase with valid data", async () => {
      const newPhase = {
        phaseId: "beginner",
        title: "Beginner Phase",
        description: "Foundation courses for cybersecurity beginners",
        icon: "Lightbulb",
        color: "#10B981",
        order: 1,
      };

      const response = await request(app)
        .post("/api/phases")
        .send(newPhase)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phase created successfully");
      expect(response.body.data.phaseId).toBe(newPhase.phaseId);
      expect(response.body.data.title).toBe(newPhase.title);
      expect(response.body.data._id).toBeUndefined();

      // Verify phase was created in database
      const createdPhase = await Phase.findOne({ phaseId: "beginner" });
      expect(createdPhase).toBeTruthy();
      expect(createdPhase.title).toBe(newPhase.title);
    });

    it("should return 400 when required fields are missing", async () => {
      const invalidPhase = {
        phaseId: "beginner",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/phases")
        .send(invalidPhase)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it("should return 400 for invalid phaseId", async () => {
      const invalidPhase = {
        phaseId: "invalid-id",
        title: "Test Phase",
        description: "Test description",
        icon: "Test",
        color: "#FF0000",
        order: 1,
      };

      const response = await request(app)
        .post("/api/phases")
        .send(invalidPhase)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 for invalid color format", async () => {
      const invalidPhase = {
        phaseId: "beginner",
        title: "Test Phase",
        description: "Test description",
        icon: "Test",
        color: "not-a-hex-color",
        order: 1,
      };

      const response = await request(app)
        .post("/api/phases")
        .send(invalidPhase)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 when duplicate phaseId exists", async () => {
      // Create first phase
      await Phase.create(defaultPhases[0]);

      // Try to create duplicate
      const response = await request(app)
        .post("/api/phases")
        .send(defaultPhases[0])
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    it("should return 400 when duplicate order exists", async () => {
      // Create first phase
      await Phase.create(defaultPhases[0]);

      // Try to create phase with same order
      const duplicateOrderPhase = {
        phaseId: "intermediate",
        title: "Intermediate Phase",
        description: "Test description",
        icon: "Target",
        color: "#F59E0B",
        order: 1, // Same order as beginner phase
      };

      const response = await request(app)
        .post("/api/phases")
        .send(duplicateOrderPhase)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("order 1 already exists");
    });
  });

  describe("PUT /api/phases/:phaseId", () => {
    beforeEach(async () => {
      await Phase.create(defaultPhases[0]); // Create beginner phase
    });

    it("should update phase with valid data", async () => {
      const updateData = {
        title: "Updated Beginner Phase",
        description: "Updated description",
        color: "#22C55E",
      };

      const response = await request(app)
        .put("/api/phases/beginner")
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phase updated successfully");
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.color).toBe(updateData.color);

      // Verify update in database
      const updatedPhase = await Phase.findOne({ phaseId: "beginner" });
      expect(updatedPhase.title).toBe(updateData.title);
    });

    it("should return 404 for non-existent phase", async () => {
      const updateData = { title: "Updated Title" };

      const response = await request(app)
        .put("/api/phases/nonexistent")
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });

    it("should return 400 for invalid color format", async () => {
      const updateData = { color: "invalid-color" };

      const response = await request(app)
        .put("/api/phases/beginner")
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 when updating to duplicate order", async () => {
      // Create second phase
      await Phase.create(defaultPhases[1]);

      const updateData = { order: 2 }; // Order of intermediate phase

      const response = await request(app)
        .put("/api/phases/beginner")
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("order 2 already exists");
    });
  });

  describe("DELETE /api/phases/:phaseId", () => {
    beforeEach(async () => {
      await Phase.create(defaultPhases[0]); // Create beginner phase
    });

    it("should delete existing phase", async () => {
      const response = await request(app)
        .delete("/api/phases/beginner")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phase deleted successfully");

      // Verify deletion in database
      const deletedPhase = await Phase.findOne({ phaseId: "beginner" });
      expect(deletedPhase).toBeNull();
    });

    it("should return 404 for non-existent phase", async () => {
      const response = await request(app)
        .delete("/api/phases/nonexistent")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });

    it("should return 400 for invalid phaseId", async () => {
      const response = await request(app)
        .delete("/api/phases/invalid-phase-id")
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });
  });

  describe("Phase Model Validation", () => {
    it("should automatically lowercase phaseId", async () => {
      const phase = new Phase({
        phaseId: "BEGINNER",
        title: "Test Phase",
        description: "Test description",
        icon: "Test",
        color: "#FF0000",
        order: 1,
      });

      await phase.save();
      expect(phase.phaseId).toBe("beginner");
    });

    it("should enforce unique phaseId constraint", async () => {
      await Phase.create(defaultPhases[0]);

      const duplicatePhase = new Phase(defaultPhases[0]);

      await expect(duplicatePhase.save()).rejects.toThrow();
    });

    it("should enforce unique order constraint", async () => {
      await Phase.create(defaultPhases[0]);

      const duplicateOrderPhase = new Phase({
        phaseId: "intermediate",
        title: "Test Phase",
        description: "Test description",
        icon: "Test",
        color: "#FF0000",
        order: 1, // Same order as existing phase
      });

      await expect(duplicateOrderPhase.save()).rejects.toThrow();
    });

    it("should validate color format", async () => {
      const invalidPhase = new Phase({
        phaseId: "beginner",
        title: "Test Phase",
        description: "Test description",
        icon: "Test",
        color: "invalid-color",
        order: 1,
      });

      await expect(invalidPhase.save()).rejects.toThrow();
    });

    it("should enforce minimum order value", async () => {
      const invalidPhase = new Phase({
        phaseId: "beginner",
        title: "Test Phase",
        description: "Test description",
        icon: "Test",
        color: "#FF0000",
        order: 0, // Invalid: less than 1
      });

      await expect(invalidPhase.save()).rejects.toThrow();
    });
  });
});

describe("Phase Seed Data", () => {
  it("should have valid default phases data", () => {
    expect(defaultPhases).toHaveLength(3);

    // Check beginner phase
    expect(defaultPhases[0].phaseId).toBe("beginner");
    expect(defaultPhases[0].order).toBe(1);
    expect(defaultPhases[0].color).toMatch(/^#[A-Fa-f0-9]{6}$/);

    // Check intermediate phase
    expect(defaultPhases[1].phaseId).toBe("intermediate");
    expect(defaultPhases[1].order).toBe(2);
    expect(defaultPhases[1].color).toMatch(/^#[A-Fa-f0-9]{6}$/);

    // Check advanced phase
    expect(defaultPhases[2].phaseId).toBe("advanced");
    expect(defaultPhases[2].order).toBe(3);
    expect(defaultPhases[2].color).toMatch(/^#[A-Fa-f0-9]{6}$/);

    // Check all have required fields
    defaultPhases.forEach((phase) => {
      expect(phase.phaseId).toBeDefined();
      expect(phase.title).toBeDefined();
      expect(phase.description).toBeDefined();
      expect(phase.icon).toBeDefined();
      expect(phase.color).toBeDefined();
      expect(phase.order).toBeDefined();
    });
  });
});
