const mongoose = require("mongoose");

/**
 * Phase Schema
 * Based on PHASES array from frontend appData.ts
 * Represents learning phases (Beginner, Intermediate, Advanced)
 * Uses MongoDB ObjectId as primary identifier
 */
const phaseSchema = new mongoose.Schema(
  {
    // MongoDB ObjectId will be used as the primary identifier
    // Remove custom phaseId field - use _id instead

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
      trim: true,
      maxlength: [50, "Icon name cannot exceed 50 characters"],
    },

    // Color scheme for frontend (supports Tailwind color classes and hex codes)
    color: {
      type: String,
      required: [true, "Phase color is required"],
      trim: true,
      maxlength: [50, "Color class cannot exceed 50 characters"],
    },

    // Display order
    order: {
      type: Number,
      required: [true, "Phase order is required"],
      unique: true,
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

// Index for order (unique constraint automatically creates index)
// No additional indexes needed - order already has unique constraint

// Pre-save middleware to prevent _id modification
phaseSchema.pre("save", function (next) {
  // Prevent modification of _id after document creation
  if (!this.isNew && this.isModified("_id")) {
    return next(new Error("Phase ID cannot be modified after creation"));
  }
  next();
});

module.exports = mongoose.model("Phase", phaseSchema);
