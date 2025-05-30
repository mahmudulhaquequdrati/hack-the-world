const mongoose = require("mongoose");

/**
 * Module Schema
 * Based on MODULES array from frontend appData.ts
 * Represents individual learning modules within phases
 */
const moduleSchema = new mongoose.Schema(
  {
    // Unique identifier for the module
    id: {
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
      enum: ["beginner", "intermediate", "advanced"],
      index: true,
    },

    // Module title
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
      maxlength: [200, "Module title cannot exceed 200 characters"],
    },

    // Module description
    description: {
      type: String,
      required: [true, "Module description is required"],
      trim: true,
      maxlength: [1000, "Module description cannot exceed 1000 characters"],
    },

    // Icon name (for frontend icon mapping)
    icon: {
      type: String,
      required: [true, "Module icon is required"],
      enum: [
        "Lightbulb",
        "Target",
        "Brain",
        "Shield",
        "Terminal",
        "Network",
        "Eye",
        "Users",
        "Wifi",
        "Code",
        "Cloud",
        "Smartphone",
        "Activity",
      ],
      default: "Shield",
    },

    // Estimated duration
    duration: {
      type: String,
      required: [true, "Module duration is required"],
      match: [
        /^\d+-\d+\s+(weeks?|days?|months?)$/,
        'Duration must be in format "X-Y weeks/days/months"',
      ],
    },

    // Difficulty level
    difficulty: {
      type: String,
      required: [true, "Module difficulty is required"],
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },

    // Color scheme for frontend
    color: {
      type: String,
      required: [true, "Module color is required"],
      match: [
        /^text-\w+-\d+$/,
        "Color must be in Tailwind format (e.g., text-blue-400)",
      ],
    },

    // Background color for frontend
    bgColor: {
      type: String,
      required: [true, "Module background color is required"],
      match: [
        /^bg-\w+-\d+\/\d+$/,
        "Background color must be in Tailwind format (e.g., bg-blue-400/10)",
      ],
    },

    // Border color for frontend
    borderColor: {
      type: String,
      required: [true, "Module border color is required"],
      match: [
        /^border-\w+-\d+\/\d+$/,
        "Border color must be in Tailwind format (e.g., border-blue-400/30)",
      ],
    },

    // Frontend paths
    path: {
      type: String,
      required: [true, "Module path is required"],
      match: [
        /^\/course\/[a-z0-9-]+$/,
        "Path must be in format /course/module-id",
      ],
    },

    enrollPath: {
      type: String,
      required: [true, "Module enroll path is required"],
      match: [
        /^\/learn\/[a-z0-9-]+$/,
        "Enroll path must be in format /learn/module-id",
      ],
    },

    // Display order within phase
    order: {
      type: Number,
      required: [true, "Module order is required"],
      min: [1, "Order must be at least 1"],
    },

    // Module status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Module content metadata
    content: {
      estimatedHours: {
        type: Number,
        default: 40,
        min: [1, "Estimated hours must be at least 1"],
        max: [200, "Estimated hours cannot exceed 200"],
      },
      lessonsCount: {
        type: Number,
        default: 0,
        min: [0, "Lessons count cannot be negative"],
      },
      labsCount: {
        type: Number,
        default: 0,
        min: [0, "Labs count cannot be negative"],
      },
      gamesCount: {
        type: Number,
        default: 0,
        min: [0, "Games count cannot be negative"],
      },
      assetsCount: {
        type: Number,
        default: 0,
        min: [0, "Assets count cannot be negative"],
      },
    },

    // Course details
    courseDetails: {
      price: {
        type: String,
        default: "Free",
      },
      certification: {
        type: Boolean,
        default: true,
      },
      prerequisites: {
        type: String,
        default: "None - Perfect for beginners",
      },
      rating: {
        type: Number,
        default: 4.8,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot exceed 5"],
      },
      studentsEnrolled: {
        type: Number,
        default: 0,
        min: [0, "Students enrolled cannot be negative"],
      },
    },

    // Module topics (referenced separately)
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],

    // Tags for search and filtering
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for phase and order
moduleSchema.index({ phaseId: 1, order: 1 });
moduleSchema.index({ isActive: 1 });
moduleSchema.index({ difficulty: 1 });
moduleSchema.index({ tags: 1 });

// Virtual to get games for this module
moduleSchema.virtual("games", {
  ref: "Game",
  localField: "id",
  foreignField: "moduleId",
});

// Virtual to get labs for this module
moduleSchema.virtual("labs", {
  ref: "Lab",
  localField: "id",
  foreignField: "moduleId",
});

// Virtual to get user enrollments
moduleSchema.virtual("enrollments", {
  ref: "UserEnrollment",
  localField: "id",
  foreignField: "moduleId",
});

// Pre-save middleware
moduleSchema.pre("save", function (next) {
  // Auto-generate paths if not provided
  if (!this.path) {
    this.path = `/course/${this.id}`;
  }
  if (!this.enrollPath) {
    this.enrollPath = `/learn/${this.id}`;
  }

  // Auto-set difficulty based on phase
  if (this.isNew && !this.difficulty) {
    switch (this.phaseId) {
      case "beginner":
        this.difficulty = "Beginner";
        break;
      case "intermediate":
        this.difficulty = "Intermediate";
        break;
      case "advanced":
        this.difficulty = "Advanced";
        break;
    }
  }

  next();
});

// Instance methods
moduleSchema.methods.toClientFormat = function () {
  return {
    id: this.id,
    phaseId: this.phaseId,
    title: this.title,
    description: this.description,
    icon: this.icon,
    duration: this.duration,
    difficulty: this.difficulty,
    color: this.color,
    bgColor: this.bgColor,
    borderColor: this.borderColor,
    path: this.path,
    enrollPath: this.enrollPath,
    order: this.order,
    isActive: this.isActive,
    content: this.content,
    courseDetails: this.courseDetails,
    tags: this.tags,
  };
};

moduleSchema.methods.getProgress = async function (userId) {
  const UserProgress = mongoose.model("UserProgress");
  const progress = await UserProgress.findOne({
    userId,
    moduleId: this.id,
  });
  return progress ? progress.progress : 0;
};

moduleSchema.methods.isEnrolledBy = async function (userId) {
  const UserEnrollment = mongoose.model("UserEnrollment");
  const enrollment = await UserEnrollment.findOne({
    userId,
    moduleId: this.id,
    status: { $in: ["active", "completed"] },
  });
  return Boolean(enrollment);
};

// Static methods
moduleSchema.statics.getByPhase = function (phaseId, options = {}) {
  const query = { phaseId, isActive: true };
  return this.find(query)
    .sort({ order: 1 })
    .populate(options.populate || "");
};

moduleSchema.statics.getActiveModules = function () {
  return this.find({ isActive: true }).sort({ phaseId: 1, order: 1 });
};

moduleSchema.statics.search = function (searchTerm, filters = {}) {
  const query = {
    isActive: true,
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { tags: { $in: [searchTerm.toLowerCase()] } },
    ],
    ...filters,
  };

  return this.find(query).sort({ phaseId: 1, order: 1 });
};

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
