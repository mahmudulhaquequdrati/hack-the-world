const mongoose = require("mongoose");

/**
 * UserProgress Model
 * Tracks detailed user progress on specific content sections
 * Simplified structure focused on essential progress tracking
 */
const UserProgressSchema = new mongoose.Schema(
  {
    // User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    // Content reference (using Content model _id)
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: [true, "Content ID is required"],
    },

    // Content type for quick filtering
    contentType: {
      type: String,
      required: [true, "Content type is required"],
      enum: {
        values: ["video", "lab", "game", "document"],
        message: "Content type must be one of: video, lab, game, document",
      },
      lowercase: true,
    },

    // Simple progress tracking
    status: {
      type: String,
      required: true,
      enum: {
        values: ["not-started", "in-progress", "completed"],
        message: "Status must be one of: not-started, in-progress, completed",
      },
      default: "not-started",
    },

    // Progress percentage (0-100)
    progressPercentage: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Progress percentage cannot be negative"],
      max: [100, "Progress percentage cannot exceed 100"],
    },

    // Simple timing
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: [0, "Time spent cannot be negative"],
      // Time spent in minutes for consistency
    },

    // Simple scoring (for labs/games)
    score: {
      type: Number,
      default: null,
      min: [0, "Score cannot be negative"],
    },
    maxScore: {
      type: Number,
      default: null,
      min: [0, "Max score cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for performance - user can only have one progress per content
UserProgressSchema.index({ userId: 1, contentId: 1 }, { unique: true });

// Individual indexes for queries
UserProgressSchema.index({ userId: 1 });
UserProgressSchema.index({ contentId: 1 });
UserProgressSchema.index({ status: 1 });
UserProgressSchema.index({ contentType: 1 });
UserProgressSchema.index({ completedAt: -1 });

// Virtual for isCompleted
UserProgressSchema.virtual("isCompleted").get(function () {
  return this.status === "completed" || this.progressPercentage === 100;
});

// Virtual for isInProgress
UserProgressSchema.virtual("isInProgress").get(function () {
  return (
    this.status === "in-progress" &&
    this.progressPercentage > 0 &&
    this.progressPercentage < 100
  );
});

// Virtual for scorePercentage (if scoring is used)
UserProgressSchema.virtual("scorePercentage").get(function () {
  if (this.score !== null && this.maxScore !== null && this.maxScore > 0) {
    return Math.round((this.score / this.maxScore) * 100);
  }
  return null;
});

// Pre-save middleware to handle status transitions
UserProgressSchema.pre("save", function (next) {
  // Auto-complete if progress reaches 100%
  if (this.progressPercentage === 100 && this.status !== "completed") {
    this.status = "completed";
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }

  // Auto-start if progress > 0 and status is not-started
  if (this.progressPercentage > 0 && this.status === "not-started") {
    this.status = "in-progress";
    if (!this.startedAt) {
      this.startedAt = new Date();
    }
  }

  // Set startedAt when moving to in-progress
  if (this.status === "in-progress" && !this.startedAt) {
    this.startedAt = new Date();
  }

  // Validate score/maxScore consistency
  if (
    this.score !== null &&
    this.maxScore !== null &&
    this.score > this.maxScore
  ) {
    return next(new Error("Score cannot exceed max score"));
  }

  next();
});

// Static method to find progress by user and content
UserProgressSchema.statics.findByUserAndContent = function (userId, contentId) {
  return this.findOne({ userId, contentId });
};

// Static method to get user's progress for all content
UserProgressSchema.statics.getUserProgress = function (userId, options = {}) {
  const query = this.find({ userId });

  if (options.status) {
    query.where("status", options.status);
  }

  if (options.contentType) {
    query.where("contentType", options.contentType);
  }

  if (options.populate) {
    query.populate("contentId", "title type section moduleId");
  }

  return query.sort({ updatedAt: -1 });
};

// Static method to get content progress (all users)
UserProgressSchema.statics.getContentProgress = function (
  contentId,
  options = {}
) {
  const query = this.find({ contentId });

  if (options.status) {
    query.where("status", options.status);
  }

  if (options.populate) {
    query.populate("userId", "username email");
  }

  return query.sort({ updatedAt: -1 });
};

// Static method to get user progress by module
UserProgressSchema.statics.getUserProgressByModule = async function (
  userId,
  moduleId
) {
  const Content = mongoose.model("Content");

  // Get all content for the module
  const moduleContent = await Content.find({ moduleId, isActive: true }).select(
    "_id"
  );
  const contentIds = moduleContent.map((content) => content._id);

  return this.find({
    userId,
    contentId: { $in: contentIds },
  }).populate("contentId", "title type section");
};

// Instance method to update progress
UserProgressSchema.methods.updateProgress = function (
  percentage,
  timeSpent = 0
) {
  this.progressPercentage = Math.max(0, Math.min(100, percentage));
  this.timeSpent += timeSpent;
  return this.save();
};

// Instance method to mark as completed
UserProgressSchema.methods.markCompleted = function (finalScore = null) {
  this.status = "completed";
  this.progressPercentage = 100;
  this.completedAt = new Date();

  if (finalScore !== null) {
    this.score = finalScore;
  }

  return this.save();
};

// Instance method to mark as started
UserProgressSchema.methods.markStarted = function () {
  if (this.status === "not-started") {
    this.status = "in-progress";
    this.startedAt = new Date();
    this.progressPercentage = Math.max(1, this.progressPercentage);
  }
  return this.save();
};

// Instance method to add time spent
UserProgressSchema.methods.addTimeSpent = function (minutes) {
  this.timeSpent += Math.max(0, minutes);
  return this.save();
};

// Instance method to set score
UserProgressSchema.methods.setScore = function (score, maxScore = null) {
  this.score = Math.max(0, score);
  if (maxScore !== null) {
    this.maxScore = Math.max(0, maxScore);
  }
  return this.save();
};

module.exports = mongoose.model("UserProgress", UserProgressSchema);
