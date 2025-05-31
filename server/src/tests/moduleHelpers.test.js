const {
  generateModuleId,
  calculateModuleDuration,
  addContentToModule,
  removeContentFromModule,
  DEFAULT_CONTENT_DURATIONS,
} = require("../utils/moduleHelpers");

describe("Module Helpers", () => {
  describe("generateModuleId", () => {
    it("should generate moduleId from title with first 2 words", () => {
      expect(generateModuleId("Cybersecurity Fundamentals")).toBe(
        "cybersecurity-fundamentals"
      );
      expect(generateModuleId("Password Security & Authentication")).toBe(
        "password-security"
      );
      expect(generateModuleId("Network Security Basics")).toBe(
        "network-security"
      );
      expect(generateModuleId("Social Engineering & Human Factors")).toBe(
        "social-engineering"
      );
    });

    it("should handle single word titles", () => {
      expect(generateModuleId("Cryptography")).toBe("cryptography");
      expect(generateModuleId("Malware")).toBe("malware");
    });

    it("should handle special characters and extra spaces", () => {
      expect(generateModuleId("Web Application Security!")).toBe(
        "web-application"
      );
      expect(generateModuleId("  Advanced   Penetration   Testing  ")).toBe(
        "advanced-penetration"
      );
      expect(generateModuleId("Cloud Security & DevOps")).toBe(
        "cloud-security"
      );
    });

    it("should throw error for invalid input", () => {
      expect(() => generateModuleId("")).toThrow(
        "Title is required and must be a string"
      );
      expect(() => generateModuleId(null)).toThrow(
        "Title is required and must be a string"
      );
      expect(() => generateModuleId(123)).toThrow(
        "Title is required and must be a string"
      );
    });
  });

  describe("calculateModuleDuration", () => {
    const mockContent = {
      videos: ["cybersec-intro-001", "cia-triad-explained"], // 25 + 15 = 40 minutes
      labs: ["basic-risk-assessment"], // 45 minutes
      games: ["cybersec-crossword"], // 20 minutes
      documents: ["cybersec-fundamentals-guide"], // 30 minutes
    };

    it("should calculate total duration from content", () => {
      const duration = calculateModuleDuration(
        mockContent,
        DEFAULT_CONTENT_DURATIONS
      );
      // Total: 40 + 45 + 20 + 30 = 135 minutes = 2.25 hours
      expect(duration).toBe("2.5 hours");
    });

    it("should handle empty content", () => {
      expect(calculateModuleDuration({})).toBe("0 hours");
      expect(calculateModuleDuration(null)).toBe("0 hours");
      expect(
        calculateModuleDuration({
          videos: [],
          labs: [],
          games: [],
          documents: [],
        })
      ).toBe("0 hours");
    });

    it("should handle missing content items", () => {
      const contentWithMissing = {
        videos: ["nonexistent-video"],
        labs: ["basic-risk-assessment"], // 45 minutes
        games: [],
        documents: [],
      };
      const duration = calculateModuleDuration(
        contentWithMissing,
        DEFAULT_CONTENT_DURATIONS
      );
      expect(duration).toBe("45 minutes");
    });

    it("should format durations correctly", () => {
      // Test minutes
      const shortContent = {
        videos: ["cia-triad-explained"], // 15 minutes
        labs: [],
        games: [],
        documents: [],
      };
      expect(
        calculateModuleDuration(shortContent, DEFAULT_CONTENT_DURATIONS)
      ).toBe("15 minutes");

      // Test 1 hour
      const oneHourContent = {
        videos: [],
        labs: ["network-packet-analysis"], // 1 hour
        games: [],
        documents: [],
      };
      expect(
        calculateModuleDuration(oneHourContent, DEFAULT_CONTENT_DURATIONS)
      ).toBe("1 hour");
    });
  });

  describe("addContentToModule", () => {
    let mockModule;

    beforeEach(() => {
      mockModule = {
        content: {
          videos: [],
          labs: [],
          games: [],
          documents: [],
        },
      };
    });

    it("should add content to module", () => {
      const result = addContentToModule(mockModule, "videos", "test-video-001");
      expect(result.content.videos).toContain("test-video-001");
      expect(result.duration).toBeDefined();
    });

    it("should not add duplicate content", () => {
      addContentToModule(mockModule, "videos", "test-video-001");
      addContentToModule(mockModule, "videos", "test-video-001");
      expect(mockModule.content.videos.length).toBe(1);
    });

    it("should initialize content structure if missing", () => {
      const moduleWithoutContent = {};
      const result = addContentToModule(
        moduleWithoutContent,
        "videos",
        "test-video-001"
      );
      expect(result.content).toBeDefined();
      expect(result.content.videos).toContain("test-video-001");
    });

    it("should throw error for invalid content type", () => {
      expect(() => {
        addContentToModule(mockModule, "invalid", "test-content");
      }).toThrow("Invalid content type: invalid");
    });
  });

  describe("removeContentFromModule", () => {
    let mockModule;

    beforeEach(() => {
      mockModule = {
        content: {
          videos: ["video-1", "video-2"],
          labs: ["lab-1"],
          games: [],
          documents: [],
        },
      };
    });

    it("should remove content from module", () => {
      const result = removeContentFromModule(mockModule, "videos", "video-1");
      expect(result.content.videos).not.toContain("video-1");
      expect(result.content.videos).toContain("video-2");
      expect(result.duration).toBeDefined();
    });

    it("should handle removing non-existent content", () => {
      const originalLength = mockModule.content.videos.length;
      removeContentFromModule(mockModule, "videos", "non-existent");
      expect(mockModule.content.videos.length).toBe(originalLength);
    });

    it("should handle missing content structure", () => {
      const moduleWithoutContent = {};
      const result = removeContentFromModule(
        moduleWithoutContent,
        "videos",
        "test-video"
      );
      expect(result).toBe(moduleWithoutContent);
    });

    it("should throw error for invalid content type", () => {
      expect(() => {
        removeContentFromModule(mockModule, "invalid", "test-content");
      }).toThrow("Invalid content type: invalid");
    });
  });
});
