const mongoose = require("mongoose");

/**
 * Phase Schema
 * Based on PHASES array from frontend appData.ts
 * Represents learning phases (Beginner, Intermediate, Advanced)
 */
const phaseSchema = new mongoose.Schema(
  {
    // Unique identifier for the phase
    phaseId: {
      type: String,
      required: [true, "Phase ID is required"],
      unique: true,
      trim: true,
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: "Phase ID must be one of: beginner, intermediate, advanced",
      },
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
      trim: true,
      maxlength: [50, "Icon name cannot exceed 50 characters"],
    },

    // Color scheme for frontend
    color: {
      type: String,
      required: [true, "Phase color is required"],
      trim: true,
      match: [
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Please provide a valid hex color code",
      ],
    },

    // Display order
    order: {
      type: Number,
      required: [true, "Phase order is required"],
      min: [1, "Order must be at least 1"],
      unique: true,
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

// Indexes for performance
phaseSchema.index({ phaseId: 1 });
phaseSchema.index({ order: 1 });

// Pre-save middleware for validation
phaseSchema.pre("save", function (next) {
  // Ensure phaseId is lowercase
  if (this.phaseId) {
    this.phaseId = this.phaseId.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("Phase", phaseSchema);
