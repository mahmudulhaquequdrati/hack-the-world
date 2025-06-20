const mongoose = require("mongoose");
const Content = require("../../models/Content");
const Module = require("../../models/Module");
const Phase = require("../../models/Phase");

describe("Content Model", () => {
  let testPhase;
  let testModule;

  beforeEach(async () => {
    // Clean up before each test
    await Content.deleteMany({});
    await Module.deleteMany({});
    await Phase.deleteMany({});

    // Create test phase
    testPhase = await Phase.create({
      title: "Test Phase",
      description: "Test phase description",
      icon: "TestIcon",
      color: "#000000",
      order: 1,
    });

    // Create test module
    testModule = await Module.create({
      phaseId: testPhase._id,
      title: "Test Module",
      description: "Test module description",
      icon: "TestIcon",
      duration: "1 week",
      difficulty: "Beginner",
      color: "text-blue-400",
      order: 1,
      content: {
        videos: 0,
        labs: 0,
        games: 0,
        documents: 0,
        estimatedHours: 0,
      },
    });
  });

  afterEach(async () => {
    await Content.deleteMany({});
    await Module.deleteMany({});
    await Phase.deleteMany({});
  });

  describe("Content Creation", () => {
    it("should create a valid video content", async () => {
      const videoData = {
        moduleId: testModule._id,
        type: "video",
        title: "Test Video",
        description: "Test video description",
        url: "https://example.com/video",
        section: "Introduction",
        duration: 15,
      };

      const content = new Content(videoData);
      const savedContent = await content.save();

      expect(savedContent.id).toBeDefined();
      expect(savedContent.type).toBe("video");
      expect(savedContent.url).toBe(videoData.url);
      expect(savedContent.isActive).toBe(true);
    });

    it("should create a valid lab content", async () => {
      const labData = {
        moduleId: testModule._id,
        type: "lab",
        title: "Test Lab",
        description: "Test lab description",
        instructions:
          "Complete the following tasks: 1. Setup environment 2. Run tests",
        section: "Hands-on Practice",
        duration: 45,
      };

      const content = new Content(labData);
      const savedContent = await content.save();

      expect(savedContent.id).toBeDefined();
      expect(savedContent.type).toBe("lab");
      expect(savedContent.instructions).toBe(labData.instructions);
      expect(savedContent.url).toBeUndefined();
    });

    it("should create a valid game content", async () => {
      const gameData = {
        moduleId: testModule._id,
        type: "game",
        title: "Test Game",
        description: "Test game description",
        instructions: "Play the game and score points by completing challenges",
        section: "Interactive Learning",
        duration: 30,
        metadata: {
          difficulty: "beginner",
          scoring: { correct: 10, incorrect: -5 },
        },
      };

      const content = new Content(gameData);
      const savedContent = await content.save();

      expect(savedContent.id).toBeDefined();
      expect(savedContent.type).toBe("game");
      expect(savedContent.metadata.scoring.correct).toBe(10);
    });

    it("should create a valid document content", async () => {
      const documentData = {
        moduleId: testModule._id,
        type: "document",
        title: "Test Document",
        description: "Test document description",
        section: "Reference Materials",
        duration: 10,
        metadata: {
          format: "pdf",
          pages: 25,
        },
      };

      const content = new Content(documentData);
      const savedContent = await content.save();

      expect(savedContent.id).toBeDefined();
      expect(savedContent.type).toBe("document");
      expect(savedContent.metadata.format).toBe("pdf");
    });
  });

  describe("Content Validation", () => {
    it("should require URL for video content", async () => {
      const videoData = {
        moduleId: testModule._id,
        type: "video",
        title: "Test Video",
        description: "Test video description",
        section: "Introduction",
        duration: 15,
        // URL missing
      };

      const content = new Content(videoData);
      await expect(content.save()).rejects.toThrow();
    });

    it("should require instructions for lab content", async () => {
      const labData = {
        moduleId: testModule._id,
        type: "lab",
        title: "Test Lab",
        description: "Test lab description",
        section: "Hands-on Practice",
        duration: 45,
        // Instructions missing
      };

      const content = new Content(labData);
      await expect(content.save()).rejects.toThrow();
    });

    it("should require instructions for game content", async () => {
      const gameData = {
        moduleId: testModule._id,
        type: "game",
        title: "Test Game",
        description: "Test game description",
        section: "Interactive Learning",
        duration: 30,
        // Instructions missing
      };

      const content = new Content(gameData);
      await expect(content.save()).rejects.toThrow();
    });

    it("should validate URL format for videos", async () => {
      const videoData = {
        moduleId: testModule._id,
        type: "video",
        title: "Test Video",
        description: "Test video description",
        url: "invalid-url",
        section: "Introduction",
        duration: 15,
      };

      const content = new Content(videoData);
      await expect(content.save()).rejects.toThrow();
    });
  });

  describe("Content Static Methods", () => {
    beforeEach(async () => {
      // Create test content
      const contentItems = [
        {
          moduleId: testModule._id,
          type: "video",
          title: "Video 1",
          description: "First video",
          url: "https://example.com/video1",
          section: "Introduction",
          duration: 15,
        },
        {
          moduleId: testModule._id,
          type: "lab",
          title: "Lab 1",
          description: "First lab",
          instructions: "Complete the lab tasks",
          section: "Practice",
          duration: 45,
        },
        {
          moduleId: testModule._id,
          type: "video",
          title: "Video 2",
          description: "Second video",
          url: "https://example.com/video2",
          section: "Introduction",
          duration: 20,
        },
      ];

      await Content.insertMany(contentItems);
    });

    it("should get content by module", async () => {
      const content = await Content.getByModule(testModule._id);

      expect(content).toHaveLength(3);
      expect(content[0].section).toBe("Introduction");
    });

    it("should get content by type", async () => {
      const videos = await Content.getByType("video");
      const labs = await Content.getByType("lab");

      expect(videos).toHaveLength(2);
      expect(labs).toHaveLength(1);
    });

    it("should get content by type and module", async () => {
      const moduleVideos = await Content.getByType("video", testModule._id);

      expect(moduleVideos).toHaveLength(2);
      moduleVideos.forEach((video) => {
        expect(video.type).toBe("video");
        const moduleIdValue =
          typeof video.moduleId === "object" && video.moduleId._id
            ? video.moduleId._id.toString()
            : video.moduleId.toString();
        expect(moduleIdValue).toBe(testModule._id.toString());
      });
    });

    it("should get content grouped by sections", async () => {
      const sections = await Content.getByModuleGrouped(testModule._id);

      expect(sections).toHaveProperty("Introduction");
      expect(sections).toHaveProperty("Practice");
      expect(sections["Introduction"]).toHaveLength(2);
      expect(sections["Practice"]).toHaveLength(1);
    });
  });

  describe("Module Synchronization", () => {
    it("should automatically update module content counts when content is added", async () => {
      // Add video content
      const videoData = {
        moduleId: testModule._id,
        type: "video",
        title: "Test Video",
        description: "Test video description",
        url: "https://example.com/video",
        section: "Introduction",
        duration: 30,
      };

      await new Content(videoData).save();

      // Check if module was updated
      const updatedModule = await Module.findById(testModule._id);
      expect(updatedModule.content.videos.length).toBe(1);
      expect(updatedModule.content.estimatedHours).toBe(1); // 30 minutes = 1 hour (rounded up)

      // Add lab content
      const labData = {
        moduleId: testModule._id,
        type: "lab",
        title: "Test Lab",
        description: "Test lab description",
        instructions: "Complete the lab tasks",
        section: "Practice",
        duration: 90,
      };

      await new Content(labData).save();

      // Check if module was updated again
      const updatedModule2 = await Module.findById(testModule._id);
      expect(updatedModule2.content.videos.length).toBe(1);
      expect(updatedModule2.content.labs.length).toBe(1);
      expect(updatedModule2.content.estimatedHours).toBe(2); // 120 minutes = 2 hours
    });

    it("should automatically update module content counts when content is deleted", async () => {
      // Create content first
      const content1 = await new Content({
        moduleId: testModule._id,
        type: "video",
        title: "Test Video 1",
        description: "Test video description",
        url: "https://example.com/video1",
        section: "Introduction",
        duration: 30,
      }).save();

      const content2 = await new Content({
        moduleId: testModule._id,
        type: "video",
        title: "Test Video 2",
        description: "Test video description",
        url: "https://example.com/video2",
        section: "Introduction",
        duration: 45,
      }).save();

      // Verify module was updated
      let updatedModule = await Module.findById(testModule._id);
      expect(updatedModule.content.videos.length).toBe(2);
      expect(updatedModule.content.estimatedHours).toBe(2); // 75 minutes = 2 hours (rounded up)

      // Delete one content
      await Content.findByIdAndDelete(content1._id);

      // Check if module was updated
      updatedModule = await Module.findById(testModule._id);
      expect(updatedModule.content.videos.length).toBe(1);
      expect(updatedModule.content.estimatedHours).toBe(1); // 45 minutes = 1 hour (rounded up)
    });

    it("should handle multiple content types correctly", async () => {
      // Add different types of content
      const contentItems = [
        {
          moduleId: testModule._id,
          type: "video",
          title: "Video",
          description: "Video description",
          url: "https://example.com/video",
          section: "Introduction",
          duration: 20,
        },
        {
          moduleId: testModule._id,
          type: "lab",
          title: "Lab",
          description: "Lab description",
          instructions: "Complete tasks",
          section: "Practice",
          duration: 60,
        },
        {
          moduleId: testModule._id,
          type: "game",
          title: "Game",
          description: "Game description",
          instructions: "Play the game",
          section: "Interactive",
          duration: 30,
        },
        {
          moduleId: testModule._id,
          type: "document",
          title: "Document",
          description: "Document description",
          section: "Reference",
          duration: 15,
        },
      ];

      await Content.insertMany(contentItems);

      // Check final module state
      const updatedModule = await Module.findById(testModule._id);
      expect(updatedModule.content.videos.length).toBe(1);
      expect(updatedModule.content.labs.length).toBe(1);
      expect(updatedModule.content.games.length).toBe(1);
      expect(updatedModule.content.documents.length).toBe(1);
      expect(updatedModule.content.estimatedHours).toBe(3); // 125 minutes = 3 hours (rounded up)
    });
  });
});
