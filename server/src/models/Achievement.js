const mongoose = require("mongoose");

/**
 * Achievement Schema - Defines achievements that users can earn
 */
const achievementSchema = new mongoose.Schema(
  {
    // Achievement identification
    slug: {
      type: String,
      required: [true, "Achievement slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Slug must be at least 3 characters"],
      maxlength: [50, "Slug cannot exceed 50 characters"],
      match: [
        /^[a-z0-9_-]+$/,
        "Slug can only contain lowercase letters, numbers, underscores, and hyphens",
      ],
    },

    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Achievement description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // Achievement categorization
    category: {
      type: String,
      required: [true, "Achievement category is required"],
      enum: ["module", "lab", "game", "xp", "general"],
    },

    // Achievement requirements
    requirements: {
      type: {
        type: String,
        required: [true, "Requirement type is required"],
        enum: ["count", "progress", "action", "special"],
      },
      target: {
        type: Number,
        required: function () {
          return (
            this.requirements.type === "count" ||
            this.requirements.type === "progress"
          );
        },
        min: [1, "Target must be at least 1"],
      },
      resource: {
        type: String,
        required: function () {
          return (
            this.requirements.type === "count" ||
            this.requirements.type === "progress"
          );
        },
        enum: [
          "modules_completed",
          "labs_completed",
          "games_completed",
          "xp_earned",
          "enrollments_created",
        ],
      },
      conditions: [
        {
          field: String,
          operator: {
            type: String,
            enum: [">=", "<=", "==", "!=", ">", "<"],
          },
          value: mongoose.Schema.Types.Mixed,
        },
      ],
    },

    // Rewards
    rewards: {
      xp: {
        type: Number,
        required: [true, "XP reward is required"],
        min: [0, "XP reward cannot be negative"],
        max: [10000, "XP reward cannot exceed 10000"],
      },
      badge: {
        type: String,
        trim: true,
        maxlength: [100, "Badge name cannot exceed 100 characters"],
      },
      title: {
        type: String,
        trim: true,
        maxlength: [100, "Title reward cannot exceed 100 characters"],
      },
    },

    // Achievement properties
    icon: {
      type: String,
      default: "Trophy",
      maxlength: [50, "Icon name cannot exceed 50 characters"],
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "legendary"],
      default: "easy",
    },

    // Achievement status
    isActive: {
      type: Boolean,
      default: true,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },

    // Ordering
    order: {
      type: Number,
      default: 0,
    },

    // Statistics
    earnedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    id: false, // Disable virtual id field
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
achievementSchema.index({ category: 1, isActive: 1 });
achievementSchema.index({ isActive: 1, isHidden: 1 });
achievementSchema.index({ category: 1, order: 1 });
achievementSchema.index({ difficulty: 1 });

// Static methods
achievementSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({
    order: 1,
    createdAt: 1,
  });
};

achievementSchema.statics.findActive = function () {
  return this.find({ isActive: true, isHidden: false }).sort({
    category: 1,
    order: 1,
  });
};

achievementSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isActive: true });
};

// Instance methods
achievementSchema.methods.incrementEarnedCount = async function () {
  this.earnedCount += 1;
  return this.save();
};

const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
