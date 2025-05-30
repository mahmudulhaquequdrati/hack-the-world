const mongoose = require("mongoose");

/**
 * Lab Schema
 * Based on LABS array from frontend appData.ts
 * Represents hands-on laboratory exercises within modules
 */
const labSchema = new mongoose.Schema(
  {
    // Unique identifier for the lab
    id: {
      type: String,
      required: [true, "Lab ID is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        "Lab ID can only contain lowercase letters, numbers, and hyphens",
      ],
    },

    // Reference to parent module
    moduleId: {
      type: String,
      required: [true, "Module ID is required"],
      index: true,
    },

    // Lab name
    name: {
      type: String,
      required: [true, "Lab name is required"],
      trim: true,
      maxlength: [200, "Lab name cannot exceed 200 characters"],
    },

    // Lab description
    description: {
      type: String,
      required: [true, "Lab description is required"],
      trim: true,
      maxlength: [1000, "Lab description cannot exceed 1000 characters"],
    },

    // Difficulty level
    difficulty: {
      type: String,
      required: [true, "Lab difficulty is required"],
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },

    // Estimated duration
    duration: {
      type: String,
      required: [true, "Lab duration is required"],
      match: [
        /^\d+\s+(min|hour|hours)$/,
        'Duration must be in format "X min" or "Y hours"',
      ],
    },

    // Lab category
    category: {
      type: String,
      required: [true, "Lab category is required"],
      enum: [
        "risk-management",
        "fundamentals",
        "file-system",
        "command-line",
        "traffic-analysis",
        "network-security",
        "web-security",
        "forensics",
        "penetration-testing",
        "malware-analysis",
        "cloud-security",
        "mobile-security",
      ],
    },

    // Display order within module
    order: {
      type: Number,
      required: [true, "Lab order is required"],
      min: [1, "Order must be at least 1"],
    },

    // Lab status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Lab objectives
    objectives: [
      {
        id: {
          type: String,
          required: true,
        },
        objective: {
          type: String,
          required: [true, "Objective description is required"],
          trim: true,
          maxlength: [500, "Objective cannot exceed 500 characters"],
        },
        order: {
          type: Number,
          required: [true, "Objective order is required"],
          min: [1, "Order must be at least 1"],
        },
      },
    ],

    // Lab steps with detailed instructions
    steps: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: [true, "Step title is required"],
          trim: true,
          maxlength: [200, "Step title cannot exceed 200 characters"],
        },
        description: {
          type: String,
          required: [true, "Step description is required"],
          trim: true,
          maxlength: [2000, "Step description cannot exceed 2000 characters"],
        },
        order: {
          type: Number,
          required: [true, "Step order is required"],
          min: [1, "Order must be at least 1"],
        },
        instructions: {
          type: String,
          trim: true,
        },
        expectedOutput: {
          type: String,
          trim: true,
        },
        hints: [
          {
            text: String,
            showAfter: Number, // seconds
          },
        ],
        validation: {
          type: {
            type: String,
            enum: ["command", "file", "output", "manual"],
            default: "manual",
          },
          criteria: String,
          autoCheck: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],

    // Lab configuration
    config: {
      environment: {
        type: String,
        enum: ["virtual", "sandbox", "cloud", "local"],
        default: "virtual",
      },
      prerequisites: [
        {
          type: String,
          trim: true,
        },
      ],
      tools: [
        {
          name: String,
          version: String,
          required: Boolean,
          downloadUrl: String,
        },
      ],
      estimatedTime: {
        type: Number, // in minutes
        min: [5, "Estimated time must be at least 5 minutes"],
        max: [480, "Estimated time cannot exceed 8 hours"],
      },
      difficulty: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
      },
    },

    // Lab resources and materials
    resources: {
      instructions: {
        type: String,
        trim: true,
      },
      downloadableFiles: [
        {
          name: String,
          description: String,
          url: String,
          size: String,
          type: {
            type: String,
            enum: ["vm", "dataset", "tool", "script", "documentation"],
          },
        },
      ],
      references: [
        {
          title: String,
          url: String,
          type: {
            type: String,
            enum: ["article", "video", "documentation", "tool", "book"],
          },
        },
      ],
      setupGuide: {
        type: String,
        trim: true,
      },
    },

    // Assessment and grading
    assessment: {
      type: {
        type: String,
        enum: ["manual", "automated", "peer-review", "self-assessment"],
        default: "manual",
      },
      passingCriteria: {
        type: String,
        trim: true,
      },
      rubric: [
        {
          criteria: String,
          maxPoints: Number,
          description: String,
        },
      ],
      submissionFormat: {
        type: String,
        enum: ["report", "screenshots", "code", "presentation", "video"],
        default: "report",
      },
    },

    // Statistics
    stats: {
      totalAttempts: {
        type: Number,
        default: 0,
      },
      completionRate: {
        type: Number,
        default: 0, // percentage
      },
      averageCompletionTime: {
        type: Number,
        default: 0, // in minutes
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
    },

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

// Compound indexes for performance
labSchema.index({ moduleId: 1, order: 1 });
// labSchema.index({ id: 1 }); // Removed - already created by unique: true
labSchema.index({ isActive: 1 });
labSchema.index({ difficulty: 1 });
labSchema.index({ category: 1 });
labSchema.index({ tags: 1 });

// Virtual to get user progress for this lab
labSchema.virtual("userProgress", {
  ref: "UserLabProgress",
  localField: "id",
  foreignField: "labId",
});

// Virtual to calculate total steps
labSchema.virtual("totalSteps").get(function () {
  return this.steps.length;
});

// Pre-save middleware
labSchema.pre("save", function (next) {
  // Sort objectives and steps by order
  if (this.objectives && this.objectives.length > 0) {
    this.objectives.sort((a, b) => a.order - b.order);
  }

  if (this.steps && this.steps.length > 0) {
    this.steps.sort((a, b) => a.order - b.order);
  }

  // Set estimated time from duration if not provided
  if (!this.config.estimatedTime && this.duration) {
    const match = this.duration.match(/^(\d+)\s+(min|hour|hours)$/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      this.config.estimatedTime = unit === "min" ? value : value * 60;
    }
  }

  next();
});

// Instance methods
labSchema.methods.toClientFormat = function () {
  return {
    id: this.id,
    moduleId: this.moduleId,
    name: this.name,
    description: this.description,
    difficulty: this.difficulty,
    duration: this.duration,
    category: this.category,
    order: this.order,
    isActive: this.isActive,
    objectives: this.objectives.map((obj) => obj.objective),
    steps: this.steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      completed: false, // Will be updated based on user progress
    })),
    config: this.config,
    tags: this.tags,
  };
};

labSchema.methods.getUserProgress = async function (userId) {
  const UserLabProgress = mongoose.model("UserLabProgress");
  return await UserLabProgress.findOne({
    userId,
    labId: this.id,
  });
};

labSchema.methods.getCompletedSteps = async function (userId) {
  const progress = await this.getUserProgress(userId);
  return progress ? progress.completedSteps : [];
};

labSchema.methods.isCompletedBy = async function (userId) {
  const progress = await this.getUserProgress(userId);
  return progress ? progress.completed : false;
};

labSchema.methods.getProgressPercentage = async function (userId) {
  const completedSteps = await this.getCompletedSteps(userId);
  if (this.steps.length === 0) return 0;
  return Math.round((completedSteps.length / this.steps.length) * 100);
};

labSchema.methods.updateStats = async function () {
  const UserLabProgress = mongoose.model("UserLabProgress");
  const allProgress = await UserLabProgress.find({ labId: this.id });

  if (allProgress.length === 0) return;

  this.stats.totalAttempts = allProgress.length;

  const completedLabs = allProgress.filter((p) => p.completed);
  this.stats.completionRate = (completedLabs.length / allProgress.length) * 100;

  if (completedLabs.length > 0) {
    const totalTime = completedLabs.reduce((sum, p) => {
      if (p.completedAt && p.startedAt) {
        return sum + (new Date(p.completedAt) - new Date(p.startedAt));
      }
      return sum;
    }, 0);
    this.stats.averageCompletionTime =
      totalTime / completedLabs.length / (1000 * 60); // in minutes
  }

  await this.save();
};

// Static methods
labSchema.statics.getByModule = function (moduleId, options = {}) {
  const query = { moduleId, isActive: true };
  return this.find(query)
    .sort({ order: 1 })
    .populate(options.populate || "");
};

labSchema.statics.getActiveLabs = function () {
  return this.find({ isActive: true }).sort({ moduleId: 1, order: 1 });
};

labSchema.statics.getByDifficulty = function (difficulty) {
  return this.find({ difficulty, isActive: true }).sort({
    moduleId: 1,
    order: 1,
  });
};

labSchema.statics.getByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({
    moduleId: 1,
    order: 1,
  });
};

labSchema.statics.search = function (searchTerm, filters = {}) {
  const query = {
    isActive: true,
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { tags: { $in: [searchTerm.toLowerCase()] } },
    ],
    ...filters,
  };

  return this.find(query).sort({ moduleId: 1, order: 1 });
};

const Lab = mongoose.model("Lab", labSchema);

module.exports = Lab;
