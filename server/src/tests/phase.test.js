const request = require("supertest");
const app = require("./testApp");
const Phase = require("../models/Phase");
const mongoose = require("mongoose");

// Default test phases without custom phaseId
const defaultPhases = [
  {
    title: "Beginner Phase",
    description: "Foundation courses for cybersecurity beginners",
    icon: "Lightbulb",
    color: "#10B981",
    order: 1,
  },
  {
    title: "Intermediate Phase",
    description: "Advanced security concepts and practical skills",
    icon: "Target",
    color: "#F59E0B",
    order: 2,
  },
  {
    title: "Advanced Phase",
    description: "Expert-level security specializations",
    icon: "Brain",
    color: "#EF4444",
    order: 3,
  },
];

describe("Phase API Endpoints", () => {
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
      expect(response.body.data[0].title).toBe("Beginner Phase");
      expect(response.body.data[1].title).toBe("Intermediate Phase");
      expect(response.body.data[2].title).toBe("Advanced Phase");

      // Should have id field (MongoDB ObjectId)
      expect(response.body.data[0].id).toBeDefined();
      expect(mongoose.Types.ObjectId.isValid(response.body.data[0].id)).toBe(
        true
      );
    });
  });

  describe("GET /api/phases/:id", () => {
    let phaseId;

    beforeEach(async () => {
      const phase = await Phase.create(defaultPhases[0]); // Create beginner phase
      phaseId = phase._id.toString();
    });

    it("should return specific phase by id", async () => {
      const response = await request(app)
        .get(`/api/phases/${phaseId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phase retrieved successfully");
      expect(response.body.data.id).toBe(phaseId);
      expect(response.body.data.title).toBe("Beginner Phase");
    });

    it("should return 404 for non-existent phase", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/phases/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        `Phase with ID ${nonExistentId} not found`
      );
    });

    it("should return 400 for invalid ObjectId format", async () => {
      const response = await request(app)
        .get("/api/phases/invalid-id")
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /api/phases", () => {
    it("should create a new phase with valid data", async () => {
      const newPhase = {
        title: "Expert Phase",
        description: "Advanced cybersecurity specializations",
        icon: "Crown",
        color: "#8B5CF6",
        order: 4,
      };

      const response = await request(app)
        .post("/api/phases")
        .send(newPhase)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phase created successfully");
      expect(response.body.data.title).toBe(newPhase.title);
      expect(response.body.data.id).toBeDefined();
      expect(mongoose.Types.ObjectId.isValid(response.body.data.id)).toBe(true);

      // Verify phase was created in database
      const createdPhase = await Phase.findById(response.body.data.id);
      expect(createdPhase).toBeTruthy();
      expect(createdPhase.title).toBe(newPhase.title);
    });

    it("should return 400 when required fields are missing", async () => {
      const invalidPhase = {
        title: "Incomplete Phase",
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

    it("should return 400 for invalid color format", async () => {
      const invalidPhase = {
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

    it("should return 400 when duplicate order exists", async () => {
      // Create first phase
      await Phase.create(defaultPhases[0]);

      // Try to create phase with same order
      const duplicateOrderPhase = {
        title: "Duplicate Order Phase",
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

  describe("PUT /api/phases/:id", () => {
    let phaseId;

    beforeEach(async () => {
      const phase = await Phase.create(defaultPhases[0]);
      phaseId = phase._id.toString();
    });

    it("should update phase with valid data", async () => {
      const updateData = {
        title: "Updated Beginner Phase",
        description: "Updated description",
        color: "#059669",
      };

      const response = await request(app)
        .put(`/api/phases/${phaseId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phase updated successfully");
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.color).toBe(updateData.color);

      // Verify update in database
      const updatedPhase = await Phase.findById(phaseId);
      expect(updatedPhase.title).toBe(updateData.title);
    });

    it("should return 404 for non-existent phase", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/phases/${nonExistentId}`)
        .send({ title: "Updated Title" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });

    it("should return 400 for invalid ObjectId format", async () => {
      const response = await request(app)
        .put("/api/phases/invalid-id")
        .send({ title: "Updated Title" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });

    it("should return 400 when updating to duplicate order", async () => {
      // Create second phase
      const secondPhase = await Phase.create(defaultPhases[1]);

      // Try to update first phase to have same order as second
      const response = await request(app)
        .put(`/api/phases/${phaseId}`)
        .send({ order: 2 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("order 2 already exists");
    });
  });

  describe("DELETE /api/phases/:id", () => {
    let phaseId;

    beforeEach(async () => {
      const phase = await Phase.create(defaultPhases[0]);
      phaseId = phase._id.toString();
    });

    it("should delete existing phase", async () => {
      const response = await request(app)
        .delete(`/api/phases/${phaseId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Phase deleted successfully");

      // Verify deletion in database
      const deletedPhase = await Phase.findById(phaseId);
      expect(deletedPhase).toBeNull();
    });

    it("should return 404 for non-existent phase", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/phases/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });

    it("should return 400 for invalid ObjectId format", async () => {
      const response = await request(app)
        .delete("/api/phases/invalid-id")
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });
  });

  describe("Phase Model Validation", () => {
    it("should prevent _id modification after creation", async () => {
      const phase = await Phase.create(defaultPhases[0]);
      const originalId = phase._id;

      // Try to modify _id
      phase._id = new mongoose.Types.ObjectId();

      await expect(phase.save()).rejects.toThrow(
        "Phase ID cannot be modified after creation"
      );

      // Verify _id wasn't changed in database
      const unchangedPhase = await Phase.findById(originalId);
      expect(unchangedPhase).toBeTruthy();
    });

    it("should enforce unique order constraint", async () => {
      await Phase.create(defaultPhases[0]);

      const duplicateOrderPhase = new Phase({
        title: "Duplicate Order Phase",
        description: "Test description",
        icon: "Test",
        color: "#FF0000",
        order: 1, // Same order as existing phase
      });

      await expect(duplicateOrderPhase.save()).rejects.toThrow();
    });

    it("should validate color format", async () => {
      const invalidPhase = new Phase({
        title: "Invalid Color Phase",
        description: "Test description",
        icon: "Test",
        color: "invalid-color",
        order: 1,
      });

      await expect(invalidPhase.save()).rejects.toThrow();
    });

    it("should enforce minimum order value", async () => {
      const invalidPhase = new Phase({
        title: "Invalid Order Phase",
        description: "Test description",
        icon: "Test",
        color: "#FF0000",
        order: 0, // Invalid: less than 1
      });

      await expect(invalidPhase.save()).rejects.toThrow();
    });

    it("should include id in JSON transformation", async () => {
      const phase = await Phase.create(defaultPhases[0]);
      const phaseJson = phase.toJSON();

      expect(phaseJson.id).toBeDefined();
      expect(phaseJson.id).toBe(phase._id.toString());
      expect(phaseJson._id).toBeUndefined();
      expect(phaseJson.__v).toBeUndefined();
    });
  });
});

describe("Phase Seed Data", () => {
  it("should have valid default phases data", () => {
    expect(defaultPhases).toHaveLength(3);

    // Check beginner phase
    expect(defaultPhases[0].title).toBe("Beginner Phase");
    expect(defaultPhases[0].order).toBe(1);
    expect(defaultPhases[0].color).toMatch(/^#[A-Fa-f0-9]{6}$/);

    // Check intermediate phase
    expect(defaultPhases[1].title).toBe("Intermediate Phase");
    expect(defaultPhases[1].order).toBe(2);
    expect(defaultPhases[1].color).toMatch(/^#[A-Fa-f0-9]{6}$/);

    // Check advanced phase
    expect(defaultPhases[2].title).toBe("Advanced Phase");
    expect(defaultPhases[2].order).toBe(3);
    expect(defaultPhases[2].color).toMatch(/^#[A-Fa-f0-9]{6}$/);

    // Check all have required fields
    defaultPhases.forEach((phase) => {
      expect(phase.title).toBeDefined();
      expect(phase.description).toBeDefined();
      expect(phase.icon).toBeDefined();
      expect(phase.color).toBeDefined();
      expect(phase.order).toBeDefined();
    });
  });
});
