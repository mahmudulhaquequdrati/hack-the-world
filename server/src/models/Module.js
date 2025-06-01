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
 * Uses MongoDB ObjectIds for both module and phase identification
 */
const moduleSchema = new mongoose.Schema(
  {
    // MongoDB ObjectId will be used as the primary identifier
    // Remove custom moduleId field - use _id instead

    // Reference to parent phase using ObjectId
    phaseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Phase ID is required"],
      ref: "Phase",
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
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Module",
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
              (docId) =>
                typeof docId === "string" &&
                docId.trim().length > 0 &&
                docId.length <= 100
            );
          },
          message:
            "Each document ID must be a non-empty string with max 100 characters",
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Include _id as id in JSON output for frontend compatibility
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Ensure unique order within each phase (this covers phaseId + order compound index)
moduleSchema.index({ phaseId: 1, order: 1 }, { unique: true });

// Virtual to populate phase information
moduleSchema.virtual("phase", {
  ref: "Phase",
  localField: "phaseId",
  foreignField: "_id",
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
    const phaseId = module.phaseId.toString();
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

  const module = await this.findById(moduleId);
  if (!module) {
    throw new Error(`Module with ID '${moduleId}' not found`);
  }

  // Add content ID if not already present
  if (!module.content[contentType].includes(contentId)) {
    module.content[contentType].push(contentId);
    await module.save();
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

  const module = await this.findById(moduleId);
  if (!module) {
    throw new Error(`Module with ID '${moduleId}' not found`);
  }

  // Remove content ID if present
  const index = module.content[contentType].indexOf(contentId);
  if (index > -1) {
    module.content[contentType].splice(index, 1);
    await module.save();
  }

  return module;
};

// Pre-save middleware to auto-generate paths and validate phase exists
moduleSchema.pre("save", async function (next) {
  // Prevent modification of _id after document creation
  if (!this.isNew && this.isModified("_id")) {
    return next(new Error("Module ID cannot be modified after creation"));
  }

  // Validate phase exists when phaseId is modified
  if (this.isModified("phaseId")) {
    const Phase = mongoose.model("Phase");
    const phase = await Phase.findById(this.phaseId);
    if (!phase) {
      return next(new Error(`Phase with ID '${this.phaseId}' does not exist`));
    }
  }

  // Calculate estimated hours using helper function
  try {
    this.duration = calculateModuleDuration(this.content);
  } catch (error) {
    // If calculation fails, use default values
    this.duration = "0 hours";
  }

  next();
});

module.exports = mongoose.model("Module", moduleSchema);
