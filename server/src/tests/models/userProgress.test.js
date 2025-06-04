const mongoose = require("mongoose");
const UserProgress = require("../../models/UserProgress");
const User = require("../../models/User");
const Content = require("../../models/Content");
const Module = require("../../models/Module");
const Phase = require("../../models/Phase");

describe("UserProgress Model", () => {
  let testUser;
  let testContent;
  let testModule;
  let testPhase;

  beforeEach(async () => {
    // Create test phase first
    testPhase = new Phase({
      title: "Test Phase",
      description: "Test phase description",
      order: 1,
      color: "#00ff00",
      icon: "Shield",
    });
    await testPhase.save();

    // Create test module
    testModule = new Module({
      title: "Test Module",
      description: "Test module description",
      difficulty: "Beginner",
      duration: "4 weeks",
      phaseId: testPhase._id,
      order: 1,
      color: "#00ff00",
      icon: "Shield",
    });
    await testModule.save();

    // Create test user
    testUser = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "student",
    });
    await testUser.save();

    // Create test content
    testContent = new Content({
      moduleId: testModule._id,
      type: "video",
      title: "Test Video",
      description: "Test video description",
      section: "Introduction",
      url: "https://example.com/video.mp4",
      duration: 30,
    });
    await testContent.save();
  });

  describe("Model Validation", () => {
    it("should create progress with valid data", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
      });

      const savedProgress = await progress.save();
      expect(savedProgress._id).toBeDefined();
      expect(savedProgress.userId.toString()).toBe(testUser._id.toString());
      expect(savedProgress.contentId.toString()).toBe(
        testContent._id.toString()
      );
      expect(savedProgress.contentType).toBe("video");
      expect(savedProgress.status).toBe("not-started");
      expect(savedProgress.progressPercentage).toBe(0);
      expect(savedProgress.timeSpent).toBe(0);
      expect(savedProgress.startedAt).toBeNull();
      expect(savedProgress.completedAt).toBeNull();
      expect(savedProgress.score).toBeNull();
      expect(savedProgress.maxScore).toBeNull();
    });

    it("should not create progress without userId", async () => {
      const progress = new UserProgress({
        contentId: testContent._id,
        contentType: "video",
      });

      await expect(progress.save()).rejects.toThrow("User ID is required");
    });

    it("should not create progress without contentId", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentType: "video",
      });

      await expect(progress.save()).rejects.toThrow("Content ID is required");
    });

    it("should not create progress without contentType", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
      });

      await expect(progress.save()).rejects.toThrow("Content type is required");
    });

    it("should validate status enum values", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        status: "invalid_status",
      });

      await expect(progress.save()).rejects.toThrow(
        "Status must be one of: not-started, in-progress, completed"
      );
    });

    it("should validate contentType enum values", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "invalid_type",
      });

      await expect(progress.save()).rejects.toThrow(
        "Content type must be one of: video, lab, game, document"
      );
    });

    it("should not allow negative progressPercentage", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        progressPercentage: -1,
      });

      await expect(progress.save()).rejects.toThrow(
        "Progress percentage cannot be negative"
      );
    });

    it("should not allow progressPercentage over 100", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        progressPercentage: 150,
      });

      await expect(progress.save()).rejects.toThrow(
        "Progress percentage cannot exceed 100"
      );
    });

    it("should not allow negative timeSpent", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        timeSpent: -1,
      });

      await expect(progress.save()).rejects.toThrow(
        "Time spent cannot be negative"
      );
    });

    it("should not allow negative score", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "lab",
        score: -1,
      });

      await expect(progress.save()).rejects.toThrow("Score cannot be negative");
    });

    it("should not allow negative maxScore", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "lab",
        maxScore: -1,
      });

      await expect(progress.save()).rejects.toThrow(
        "Max score cannot be negative"
      );
    });

    it("should enforce unique compound index (userId + contentId)", async () => {
      // Create first progress
      const progress1 = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
      });
      await progress1.save();

      // Try to create duplicate progress
      const progress2 = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
      });

      await expect(progress2.save()).rejects.toThrow();
    });
  });

  describe("Status Transitions", () => {
    it("should auto-start when progress > 0 and status is not-started", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        progressPercentage: 25,
      });

      const savedProgress = await progress.save();
      expect(savedProgress.status).toBe("in-progress");
      expect(savedProgress.startedAt).toBeDefined();
    });

    it("should auto-complete when progress reaches 100%", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        progressPercentage: 100,
      });

      const savedProgress = await progress.save();
      expect(savedProgress.status).toBe("completed");
      expect(savedProgress.completedAt).toBeDefined();
    });

    it("should set startedAt when moving to in-progress manually", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        status: "in-progress",
      });

      const savedProgress = await progress.save();
      expect(savedProgress.startedAt).toBeDefined();
    });

    it("should validate score does not exceed maxScore", async () => {
      const progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "lab",
        score: 150,
        maxScore: 100,
      });

      await expect(progress.save()).rejects.toThrow(
        "Score cannot exceed max score"
      );
    });
  });

  describe("Virtuals", () => {
    it("should return correct isCompleted virtual", async () => {
      const completedProgress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        status: "completed",
      });

      expect(completedProgress.isCompleted).toBe(true);

      const progress100 = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        progressPercentage: 100,
      });

      expect(progress100.isCompleted).toBe(true);

      const inProgressProgress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        status: "in-progress",
        progressPercentage: 50,
      });

      expect(inProgressProgress.isCompleted).toBe(false);
    });

    it("should return correct isInProgress virtual", async () => {
      const inProgressProgress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        status: "in-progress",
        progressPercentage: 50,
      });

      expect(inProgressProgress.isInProgress).toBe(true);

      const notStartedProgress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        status: "not-started",
      });

      expect(notStartedProgress.isInProgress).toBe(false);

      const completedProgress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        status: "completed",
        progressPercentage: 100,
      });

      expect(completedProgress.isInProgress).toBe(false);
    });

    it("should return correct scorePercentage virtual", async () => {
      const progressWithScore = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "lab",
        score: 85,
        maxScore: 100,
      });

      expect(progressWithScore.scorePercentage).toBe(85);

      const progressWithoutScore = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
      });

      expect(progressWithoutScore.scorePercentage).toBeNull();

      const progressWithZeroMaxScore = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "lab",
        score: 85,
        maxScore: 0,
      });

      expect(progressWithZeroMaxScore.scorePercentage).toBeNull();
    });
  });

  describe("Static Methods", () => {
    let progress1, progress2;

    beforeEach(async () => {
      progress1 = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
        status: "in-progress",
        progressPercentage: 50,
      });
      await progress1.save();

      // Create another content for additional test
      const content2 = new Content({
        moduleId: testModule._id,
        type: "lab",
        title: "Test Lab",
        description: "Test lab description",
        section: "Practice",
        instructions: "Complete the lab exercise",
        duration: 60,
      });
      await content2.save();

      progress2 = new UserProgress({
        userId: testUser._id,
        contentId: content2._id,
        contentType: "lab",
        status: "completed",
        progressPercentage: 100,
        score: 95,
        maxScore: 100,
      });
      await progress2.save();
    });

    it("should find progress by user and content", async () => {
      const foundProgress = await UserProgress.findByUserAndContent(
        testUser._id,
        testContent._id
      );

      expect(foundProgress).toBeTruthy();
      expect(foundProgress._id.toString()).toBe(progress1._id.toString());
    });

    it("should get user progress with filtering", async () => {
      const allProgress = await UserProgress.getUserProgress(testUser._id);
      expect(allProgress).toHaveLength(2);

      const completedProgress = await UserProgress.getUserProgress(
        testUser._id,
        {
          status: "completed",
        }
      );
      expect(completedProgress).toHaveLength(1);
      expect(completedProgress[0].status).toBe("completed");

      const labProgress = await UserProgress.getUserProgress(testUser._id, {
        contentType: "lab",
      });
      expect(labProgress).toHaveLength(1);
      expect(labProgress[0].contentType).toBe("lab");
    });

    it("should get content progress (all users)", async () => {
      const contentProgress = await UserProgress.getContentProgress(
        testContent._id
      );
      expect(contentProgress).toHaveLength(1);
      expect(contentProgress[0].contentId.toString()).toBe(
        testContent._id.toString()
      );
    });

    it("should get user progress by module", async () => {
      const moduleProgress = await UserProgress.getUserProgressByModule(
        testUser._id,
        testModule._id
      );
      expect(moduleProgress).toHaveLength(2);
    });
  });

  describe("Instance Methods", () => {
    let progress;

    beforeEach(async () => {
      progress = new UserProgress({
        userId: testUser._id,
        contentId: testContent._id,
        contentType: "video",
      });
      await progress.save();
    });

    it("should update progress correctly", async () => {
      await progress.updateProgress(75, 30);

      expect(progress.progressPercentage).toBe(75);
      expect(progress.timeSpent).toBe(30);
      expect(progress.status).toBe("in-progress");
    });

    it("should cap progress at 100%", async () => {
      await progress.updateProgress(150, 10);

      expect(progress.progressPercentage).toBe(100);
      expect(progress.status).toBe("completed");
    });

    it("should mark as completed correctly", async () => {
      await progress.markCompleted(95);

      expect(progress.status).toBe("completed");
      expect(progress.progressPercentage).toBe(100);
      expect(progress.completedAt).toBeDefined();
      expect(progress.score).toBe(95);
    });

    it("should mark as started correctly", async () => {
      await progress.markStarted();

      expect(progress.status).toBe("in-progress");
      expect(progress.startedAt).toBeDefined();
      expect(progress.progressPercentage).toBe(1);
    });

    it("should not change already started progress", async () => {
      progress.status = "in-progress";
      progress.progressPercentage = 50;
      const originalProgress = progress.progressPercentage;

      await progress.markStarted();

      expect(progress.progressPercentage).toBe(originalProgress);
    });

    it("should add time spent correctly", async () => {
      await progress.addTimeSpent(15);
      expect(progress.timeSpent).toBe(15);

      await progress.addTimeSpent(10);
      expect(progress.timeSpent).toBe(25);
    });

    it("should not add negative time", async () => {
      await progress.addTimeSpent(-5);
      expect(progress.timeSpent).toBe(0);
    });

    it("should set score correctly", async () => {
      await progress.setScore(85, 100);

      expect(progress.score).toBe(85);
      expect(progress.maxScore).toBe(100);
    });

    it("should update only score when maxScore not provided", async () => {
      progress.maxScore = 100;
      await progress.setScore(90);

      expect(progress.score).toBe(90);
      expect(progress.maxScore).toBe(100);
    });
  });
});
