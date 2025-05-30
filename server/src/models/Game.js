const mongoose = require("mongoose");

/**
 * Game Schema
 * Based on GAMES array from frontend appData.ts
 * Represents interactive cybersecurity games within modules
 */
const gameSchema = new mongoose.Schema(
  {
    // Unique identifier for the game
    id: {
      type: String,
      required: [true, "Game ID is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        "Game ID can only contain lowercase letters, numbers, and hyphens",
      ],
    },

    // Reference to parent module
    moduleId: {
      type: String,
      required: [true, "Module ID is required"],
      index: true,
    },

    // Game name
    name: {
      type: String,
      required: [true, "Game name is required"],
      trim: true,
      maxlength: [200, "Game name cannot exceed 200 characters"],
    },

    // Game description
    description: {
      type: String,
      required: [true, "Game description is required"],
      trim: true,
      maxlength: [1000, "Game description cannot exceed 1000 characters"],
    },

    // Game type
    type: {
      type: String,
      required: [true, "Game type is required"],
      enum: [
        "Strategy",
        "Puzzle",
        "Simulation",
        "Speed Challenge",
        "Adventure",
        "Analysis Game",
        "Investigation",
        "Security Challenge",
        "Defense",
        "Technical",
        "Comprehensive",
      ],
    },

    // Maximum points achievable
    maxPoints: {
      type: Number,
      required: [true, "Max points is required"],
      min: [1, "Max points must be at least 1"],
      max: [10000, "Max points cannot exceed 10000"],
    },

    // Time limit for the game
    timeLimit: {
      type: String,
      match: [
        /^\d+\s+(minutes?|hours?)$/,
        'Time limit must be in format "X minutes" or "Y hours"',
      ],
    },

    // Difficulty level
    difficulty: {
      type: String,
      required: [true, "Game difficulty is required"],
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },

    // Game category
    category: {
      type: String,
      required: [true, "Game category is required"],
      enum: [
        "policy",
        "risk-management",
        "fundamentals",
        "command-line",
        "file-system",
        "traffic-analysis",
        "protocol-analysis",
        "web-vulnerabilities",
        "web-defense",
        "reconnaissance",
        "exploitation",
        "sql-injection",
        "comprehensive",
      ],
    },

    // Display order within module
    order: {
      type: Number,
      required: [true, "Game order is required"],
      min: [1, "Order must be at least 1"],
    },

    // Game status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Game objectives with points
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
        points: {
          type: Number,
          required: [true, "Objective points is required"],
          min: [1, "Points must be at least 1"],
        },
        order: {
          type: Number,
          required: [true, "Objective order is required"],
          min: [1, "Order must be at least 1"],
        },
      },
    ],

    // Game configuration
    config: {
      allowMultipleAttempts: {
        type: Boolean,
        default: true,
      },
      maxAttempts: {
        type: Number,
        default: 3,
        min: [1, "Max attempts must be at least 1"],
        max: [10, "Max attempts cannot exceed 10"],
      },
      passingScore: {
        type: Number,
        default: 70,
        min: [0, "Passing score cannot be negative"],
        max: [100, "Passing score cannot exceed 100"],
      },
      showHints: {
        type: Boolean,
        default: true,
      },
      showSolutions: {
        type: Boolean,
        default: false,
      },
    },

    // Game content and resources
    resources: {
      instructions: {
        type: String,
        trim: true,
      },
      hints: [
        {
          text: String,
          unlockAfter: Number, // seconds
        },
      ],
      references: [
        {
          title: String,
          url: String,
          type: {
            type: String,
            enum: ["article", "video", "documentation", "tool"],
          },
        },
      ],
    },

    // Statistics
    stats: {
      totalPlays: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
      averageCompletionTime: {
        type: Number,
        default: 0, // in seconds
      },
      completionRate: {
        type: Number,
        default: 0, // percentage
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
gameSchema.index({ moduleId: 1, order: 1 });
// gameSchema.index({ id: 1 }); // Removed - already created by unique: true
gameSchema.index({ isActive: 1 });
gameSchema.index({ difficulty: 1 });
gameSchema.index({ category: 1 });
gameSchema.index({ type: 1 });
gameSchema.index({ tags: 1 });

// Virtual to get user progress for this game
gameSchema.virtual("userProgress", {
  ref: "UserGameProgress",
  localField: "id",
  foreignField: "gameId",
});

// Virtual to calculate total possible points
gameSchema.virtual("totalPossiblePoints").get(function () {
  return this.objectives.reduce((total, obj) => total + obj.points, 0);
});

// Pre-save middleware
gameSchema.pre("save", function (next) {
  // Validate that maxPoints matches total objective points
  const totalObjectivePoints = this.objectives.reduce(
    (total, obj) => total + obj.points,
    0
  );
  if (totalObjectivePoints > 0 && totalObjectivePoints !== this.maxPoints) {
    console.warn(
      `Game ${this.id}: maxPoints (${this.maxPoints}) doesn't match total objective points (${totalObjectivePoints})`
    );
  }

  // Sort objectives by order
  if (this.objectives && this.objectives.length > 0) {
    this.objectives.sort((a, b) => a.order - b.order);
  }

  next();
});

// Instance methods
gameSchema.methods.toClientFormat = function () {
  return {
    id: this.id,
    moduleId: this.moduleId,
    name: this.name,
    description: this.description,
    type: this.type,
    maxPoints: this.maxPoints,
    timeLimit: this.timeLimit,
    difficulty: this.difficulty,
    category: this.category,
    order: this.order,
    isActive: this.isActive,
    objectives: this.objectives.map(
      (obj) => `${obj.objective} (${obj.points} pts)`
    ),
    config: this.config,
    tags: this.tags,
  };
};

gameSchema.methods.getUserProgress = async function (userId) {
  const UserGameProgress = mongoose.model("UserGameProgress");
  return await UserGameProgress.findOne({
    userId,
    gameId: this.id,
  });
};

gameSchema.methods.calculateScore = function (completedObjectives = []) {
  return this.objectives
    .filter((obj) => completedObjectives.includes(obj.id))
    .reduce((total, obj) => total + obj.points, 0);
};

gameSchema.methods.isCompletedBy = async function (userId) {
  const progress = await this.getUserProgress(userId);
  return progress ? progress.completed : false;
};

gameSchema.methods.updateStats = async function () {
  const UserGameProgress = mongoose.model("UserGameProgress");
  const allProgress = await UserGameProgress.find({ gameId: this.id });

  if (allProgress.length === 0) return;

  this.stats.totalPlays = allProgress.length;
  this.stats.averageScore =
    allProgress.reduce((sum, p) => sum + p.score, 0) / allProgress.length;

  const completedPlays = allProgress.filter((p) => p.completed);
  this.stats.completionRate =
    (completedPlays.length / allProgress.length) * 100;

  if (completedPlays.length > 0) {
    const totalTime = completedPlays.reduce((sum, p) => {
      if (p.completedAt && p.startedAt) {
        return sum + (new Date(p.completedAt) - new Date(p.startedAt));
      }
      return sum;
    }, 0);
    this.stats.averageCompletionTime = totalTime / completedPlays.length / 1000; // in seconds
  }

  await this.save();
};

// Static methods
gameSchema.statics.getByModule = function (moduleId, options = {}) {
  const query = { moduleId, isActive: true };
  return this.find(query)
    .sort({ order: 1 })
    .populate(options.populate || "");
};

gameSchema.statics.getActiveGames = function () {
  return this.find({ isActive: true }).sort({ moduleId: 1, order: 1 });
};

gameSchema.statics.getByDifficulty = function (difficulty) {
  return this.find({ difficulty, isActive: true }).sort({
    moduleId: 1,
    order: 1,
  });
};

gameSchema.statics.getByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({
    moduleId: 1,
    order: 1,
  });
};

gameSchema.statics.search = function (searchTerm, filters = {}) {
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

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
