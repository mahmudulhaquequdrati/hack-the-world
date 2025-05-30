const mongoose = require("mongoose");

/**
 * Phase Schema
 * Based on PHASES array from frontend appData.ts
 * Represents learning phases (Beginner, Intermediate, Advanced)
 */
const phaseSchema = new mongoose.Schema(
  {
    // Unique identifier for the phase
    id: {
      type: String,
      required: [true, "Phase ID is required"],
      unique: true,
      trim: true,
      lowercase: true,
      enum: ["beginner", "intermediate", "advanced"],
    },

    // Phase title
    title: {
      type: String,
      required: [true, "Phase title is required"],
      trim: true,
      maxlength: [100, "Phase title cannot exceed 100 characters"],
    },

    // Phase description
    description: {
      type: String,
      required: [true, "Phase description is required"],
      trim: true,
      maxlength: [500, "Phase description cannot exceed 500 characters"],
    },

    // Icon name (for frontend icon mapping)
    icon: {
      type: String,
      required: [true, "Phase icon is required"],
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

    // Color scheme for frontend
    color: {
      type: String,
      required: [true, "Phase color is required"],
      match: [
        /^text-\w+-\d+$/,
        "Color must be in Tailwind format (e.g., text-green-400)",
      ],
    },

    // Display order
    order: {
      type: Number,
      required: [true, "Phase order is required"],
      min: [1, "Order must be at least 1"],
      unique: true,
    },

    // Phase status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Prerequisites for this phase
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],

    // Estimated completion time
    estimatedDuration: {
      type: String,
      default: "4-6 weeks",
    },

    // Difficulty level
    difficultyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: function () {
        switch (this.id) {
          case "beginner":
            return 1;
          case "intermediate":
            return 3;
          case "advanced":
            return 5;
          default:
            return 1;
        }
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to get modules in this phase
phaseSchema.virtual("modules", {
  ref: "Module",
  localField: "id",
  foreignField: "phaseId",
});

// Virtual to get module count
phaseSchema.virtual("moduleCount", {
  ref: "Module",
  localField: "id",
  foreignField: "phaseId",
  count: true,
});

// Index for efficient queries
// phaseSchema.index({ id: 1 }); // Removed - already created by unique: true
// phaseSchema.index({ order: 1 }); // Removed - already created by unique: true
phaseSchema.index({ isActive: 1 });

// Pre-save middleware
phaseSchema.pre("save", function (next) {
  // Ensure id matches expected format
  if (
    this.isNew &&
    !["beginner", "intermediate", "advanced"].includes(this.id)
  ) {
    return next(new Error("Invalid phase ID"));
  }
  next();
});

// Instance methods
phaseSchema.methods.getModulesCount = async function () {
  const Module = mongoose.model("Module");
  return await Module.countDocuments({ phaseId: this.id });
};

phaseSchema.methods.toClientFormat = function () {
  return {
    id: this.id,
    title: this.title,
    description: this.description,
    icon: this.icon,
    color: this.color,
    order: this.order,
    isActive: this.isActive,
    estimatedDuration: this.estimatedDuration,
    difficultyLevel: this.difficultyLevel,
    prerequisites: this.prerequisites,
  };
};

// Static methods
phaseSchema.statics.getByOrder = function () {
  return this.find({ isActive: true }).sort({ order: 1 });
};

phaseSchema.statics.getActivePhases = function () {
  return this.find({ isActive: true }).sort({ order: 1 });
};

const Phase = mongoose.model("Phase", phaseSchema);

module.exports = Phase;
