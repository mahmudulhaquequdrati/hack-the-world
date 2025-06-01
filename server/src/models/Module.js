const mongoose = require("mongoose");
const {
  generateModuleId,
  calculateModuleDuration,
  DEFAULT_CONTENT_DURATIONS,
} = require("../utils/moduleHelpers");

/**
 * Module Schema
 * Based on MODULES array from frontend appData.ts
 * Represents learning modules within phases (courses/modules)
 * Connected to Phase model via phaseId reference
 */
const moduleSchema = new mongoose.Schema(
  {
    // Custom module identifier (auto-generated from title)
    moduleId: {
      type: String,
      required: [true, "Module ID is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        "Module ID can only contain lowercase letters, numbers, and hyphens",
      ],
    },

    // Reference to parent phase
    phaseId: {
      type: String,
      required: [true, "Phase ID is required"],
      ref: "Phase",
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: "Phase ID must be one of: beginner, intermediate, advanced",
      },
    },

    // Module title
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
      maxlength: [100, "Module title cannot exceed 100 characters"],
    },

    // Module description
    description: {
      type: String,
      required: [true, "Module description is required"],
      trim: true,
      maxlength: [500, "Module description cannot exceed 500 characters"],
    },

    // Icon name (for frontend icon mapping)
    icon: {
      type: String,
      required: [true, "Module icon is required"],
      trim: true,
      maxlength: [50, "Icon name cannot exceed 50 characters"],
    },

    // Estimated duration (auto-calculated from content)
    duration: {
      type: String,
      required: false, // Will be auto-calculated
      trim: true,
      default: "0 hours",
    },

    // Difficulty level
    difficulty: {
      type: String,
      required: [true, "Module difficulty is required"],
      enum: {
        values: ["Beginner", "Intermediate", "Advanced", "Expert"],
        message:
          "Difficulty must be one of: Beginner, Intermediate, Advanced, Expert",
      },
    },

    // Color scheme for frontend styling
    color: {
      type: String,
      required: [true, "Module color is required"],
      trim: true,
      maxlength: [50, "Color class cannot exceed 50 characters"],
    },

    // Course detail page path (auto-generated)
    path: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "Path cannot exceed 100 characters"],
    },

    // Enrollment/learning path (auto-generated)
    enrollPath: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "Enroll path cannot exceed 100 characters"],
    },

    // Display order within phase
    order: {
      type: Number,
      required: [true, "Module order is required"],
      min: [1, "Order must be at least 1"],
    },

    // Learning topics covered
    topics: {
      type: [String],
      default: [],
      validate: {
        validator: function (topics) {
          return topics.every(
            (topic) =>
              typeof topic === "string" &&
              topic.trim().length > 0 &&
              topic.length <= 100
          );
        },
        message:
          "Each topic must be a non-empty string with max 100 characters",
      },
    },

    // Module status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Prerequisites (optional - for future use)
    prerequisites: {
      type: [String],
      default: [],
    },

    // Learning outcomes (optional - for future use)
    learningOutcomes: {
      type: [String],
      default: [],
    },

    // Content tracking arrays for automatic module updates
    content: {
      // Video content IDs - automatically populated when videos are created
      videos: {
        type: [String],
        default: [],
        validate: {
          validator: function (videos) {
            // Allow empty arrays
            if (videos.length === 0) return true;

            return videos.every(
              (videoId) =>
                typeof videoId === "string" &&
                videoId.trim().length > 0 &&
                videoId.length <= 100
            );
          },
          message:
            "Each video ID must be a non-empty string with max 100 characters",
        },
      },

      // Lab content IDs - automatically populated when labs are created
      labs: {
        type: [String],
        default: [],
        validate: {
          validator: function (labs) {
            // Allow empty arrays
            if (labs.length === 0) return true;

            return labs.every(
              (labId) =>
                typeof labId === "string" &&
                labId.trim().length > 0 &&
                labId.length <= 100
            );
          },
          message:
            "Each lab ID must be a non-empty string with max 100 characters",
        },
      },

      // Game content IDs - automatically populated when games are created
      games: {
        type: [String],
        default: [],
        validate: {
          validator: function (games) {
            // Allow empty arrays
            if (games.length === 0) return true;

            return games.every(
              (gameId) =>
                typeof gameId === "string" &&
                gameId.trim().length > 0 &&
                gameId.length <= 100
            );
          },
          message:
            "Each game ID must be a non-empty string with max 100 characters",
        },
      },

      // Document content IDs - automatically populated when documents are created
      documents: {
        type: [String],
        default: [],
        validate: {
          validator: function (documents) {
            // Allow empty arrays
            if (documents.length === 0) return true;

            return documents.every(
              (document) =>
                typeof document === "string" &&
                document.trim().length > 0 &&
                document.length <= 100
            );
          },
          message:
            "Each document must be a non-empty string with max 100 characters",
        },
      },
    },

    // Content statistics (automatically calculated)
    contentStats: {
      totalVideos: {
        type: Number,
        default: 0,
      },
      totalLabs: {
        type: Number,
        default: 0,
      },
      totalGames: {
        type: Number,
        default: 0,
      },
      totalDocuments: {
        type: Number,
        default: 0,
      },
      totalContent: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Remove MongoDB's _id field from JSON output
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Compound indexes for performance
// moduleId already has unique constraint so no separate index needed
moduleSchema.index({ phaseId: 1, moduleId: 1 });
moduleSchema.index({ isActive: 1 });

// Ensure unique order within each phase (this covers phaseId + order compound index)
moduleSchema.index({ phaseId: 1, order: 1 }, { unique: true });

// Virtual to populate phase information
moduleSchema.virtual("phase", {
  ref: "Phase",
  localField: "phaseId",
  foreignField: "phaseId",
  justOne: true,
});

// Static method to get modules by phase
moduleSchema.statics.getByPhase = function (phaseId) {
  return this.find({ phaseId, isActive: true }).sort({ order: 1 });
};

// Static method to get all modules with phases
moduleSchema.statics.getAllWithPhases = function () {
  return this.find({ isActive: true })
    .populate("phase")
    .sort({ "phase.order": 1, order: 1 });
};

// Static method to get modules grouped by phase
moduleSchema.statics.getGroupedByPhase = async function () {
  const modules = await this.find({ isActive: true })
    .populate("phase")
    .sort({ "phase.order": 1, order: 1 });

  const grouped = {};
  modules.forEach((module) => {
    const phaseId = module.phaseId;
    if (!grouped[phaseId]) {
      grouped[phaseId] = {
        phase: module.phase,
        modules: [],
      };
    }
    grouped[phaseId].modules.push(module);
  });

  return grouped;
};

// Static method to add content to module - automatically updates content arrays
moduleSchema.statics.addContentToModule = async function (
  moduleId,
  contentType,
  contentId
) {
  const validTypes = ["videos", "labs", "games", "documents"];
  if (!validTypes.includes(contentType)) {
    throw new Error(
      `Invalid content type: ${contentType}. Must be one of: ${validTypes.join(", ")}`
    );
  }

  const module = await this.findOne({ moduleId });
  if (!module) {
    throw new Error(`Module with ID '${moduleId}' not found`);
  }

  // Add content ID if not already present
  if (!module.content[contentType].includes(contentId)) {
    module.content[contentType].push(contentId);
    await module.save(); // This will trigger content stats and duration update
  }

  return module;
};

// Static method to remove content from module
moduleSchema.statics.removeContentFromModule = async function (
  moduleId,
  contentType,
  contentId
) {
  const validTypes = ["videos", "labs", "games", "documents"];
  if (!validTypes.includes(contentType)) {
    throw new Error(
      `Invalid content type: ${contentType}. Must be one of: ${validTypes.join(", ")}`
    );
  }

  const module = await this.findOne({ moduleId });
  if (!module) {
    throw new Error(`Module with ID '${moduleId}' not found`);
  }

  // Remove content ID if present
  const index = module.content[contentType].indexOf(contentId);
  if (index > -1) {
    module.content[contentType].splice(index, 1);
    await module.save(); // This will trigger content stats and duration update
  }

  return module;
};

// Pre-save middleware to auto-generate moduleId from title
moduleSchema.pre("save", function (next) {
  // Auto-generate moduleId from title only if not provided (new docs without moduleId)
  if (this.isNew && !this.moduleId) {
    try {
      this.moduleId = generateModuleId(this.title);
    } catch (error) {
      return next(error);
    }
  }

  // Auto-generate paths if not provided
  if (!this.path && this.moduleId) {
    this.path = `/course/${this.moduleId}`;
  }
  if (!this.enrollPath && this.moduleId) {
    this.enrollPath = `/learn/${this.moduleId}`;
  }

  next();
});

// Pre-save middleware to update content statistics and duration
moduleSchema.pre("save", function (next) {
  // Update content statistics whenever content arrays change
  if (
    this.isModified("content.videos") ||
    this.isModified("content.labs") ||
    this.isModified("content.games") ||
    this.isModified("content.documents")
  ) {
    // Ensure content object exists
    if (!this.content) {
      this.content = {
        videos: [],
        labs: [],
        games: [],
        documents: [],
      };
    }

    // Ensure content arrays exist
    if (!this.content.videos) this.content.videos = [];
    if (!this.content.labs) this.content.labs = [];
    if (!this.content.games) this.content.games = [];
    if (!this.content.documents) this.content.documents = [];

    // Ensure contentStats object exists
    if (!this.contentStats) {
      this.contentStats = {
        totalVideos: 0,
        totalLabs: 0,
        totalGames: 0,
        totalDocuments: 0,
        totalContent: 0,
      };
    }

    // Update content statistics
    this.contentStats.totalVideos = this.content.videos.length;
    this.contentStats.totalLabs = this.content.labs.length;
    this.contentStats.totalGames = this.content.games.length;
    this.contentStats.totalDocuments = this.content.documents.length;
    this.contentStats.totalContent =
      this.content.videos.length +
      this.content.labs.length +
      this.content.games.length +
      this.content.documents.length;

    // Auto-calculate duration from content
    this.duration = calculateModuleDuration(
      this.content,
      DEFAULT_CONTENT_DURATIONS
    );
  }
  next();
});

// Pre-save middleware to validate phase exists
moduleSchema.pre("save", async function (next) {
  if (this.isModified("phaseId")) {
    const Phase = mongoose.model("Phase");
    const phase = await Phase.findOne({ phaseId: this.phaseId });
    if (!phase) {
      return next(new Error(`Phase with ID '${this.phaseId}' does not exist`));
    }
  }
  next();
});

module.exports = mongoose.model("Module", moduleSchema);
