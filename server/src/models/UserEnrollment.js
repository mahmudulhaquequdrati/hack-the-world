const mongoose = require("mongoose");

const UserEnrollmentSchema = new mongoose.Schema(
  {
    // User and Module references
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Module ID is required"],
    },

    // Enrollment tracking
    enrolledAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "completed", "paused", "dropped"],
        message: "Status must be one of: active, completed, paused, dropped",
      },
      default: "active",
      required: true,
    },

    // Basic progress tracking
    completedSections: {
      type: Number,
      default: 0,
      min: [0, "Completed sections cannot be negative"],
    },
    totalSections: {
      type: Number,
      default: 0,
      min: [0, "Total sections cannot be negative"],
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: [0, "Progress percentage cannot be negative"],
      max: [100, "Progress percentage cannot exceed 100"],
    },

    // Timing
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    estimatedCompletionDate: {
      type: Date,
      default: null,
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

// Compound index for performance - user can only be enrolled once per module
UserEnrollmentSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

// Individual indexes for queries
UserEnrollmentSchema.index({ userId: 1 });
UserEnrollmentSchema.index({ moduleId: 1 });
UserEnrollmentSchema.index({ status: 1 });
UserEnrollmentSchema.index({ enrolledAt: -1 });

// Virtual for isCompleted
UserEnrollmentSchema.virtual("isCompleted").get(function () {
  return this.status === "completed" || this.progressPercentage === 100;
});

// Virtual for isActive
UserEnrollmentSchema.virtual("isActive").get(function () {
  return this.status === "active";
});

// Pre-save middleware to calculate progress percentage and validate data
UserEnrollmentSchema.pre("save", function (next) {
  try {
    // Data validation and consistency checks
    if (this.completedSections < 0) {
      this.completedSections = 0;
      console.warn(`Corrected negative completedSections for enrollment ${this._id}`);
    }
    
    if (this.totalSections < 0) {
      this.totalSections = 0;
      console.warn(`Corrected negative totalSections for enrollment ${this._id}`);
    }
    
    // Ensure completedSections doesn't exceed totalSections
    if (this.completedSections > this.totalSections) {
      console.warn(`Corrected completedSections (${this.completedSections}) exceeding totalSections (${this.totalSections}) for enrollment ${this._id}`);
      this.completedSections = this.totalSections;
    }

    // Calculate progress percentage with validation
    if (this.totalSections > 0) {
      const calculatedPercentage = Math.round(
        (this.completedSections / this.totalSections) * 100
      );
      
      // Ensure percentage is within valid range
      this.progressPercentage = Math.max(0, Math.min(100, calculatedPercentage));

      // Auto-complete if all sections done and currently active
      if (this.progressPercentage === 100 && this.status === "active") {
        this.status = "completed";
      }
    } else {
      // No sections means 0% progress
      this.progressPercentage = 0;
    }

    // Validate progress percentage consistency
    if (this.progressPercentage > 100) {
      console.warn(`Corrected progress percentage exceeding 100% for enrollment ${this._id}`);
      this.progressPercentage = 100;
    }
    
    if (this.progressPercentage < 0) {
      console.warn(`Corrected negative progress percentage for enrollment ${this._id}`);
      this.progressPercentage = 0;
    }

    // Update lastAccessedAt on any save (indicating activity)
    this.lastAccessedAt = new Date();

    next();
  } catch (error) {
    console.error('Error in UserEnrollment pre-save validation:', error);
    next(error);
  }
});

// Static method to find enrollment by user and module
UserEnrollmentSchema.statics.findByUserAndModule = function (userId, moduleId) {
  return this.findOne({ userId, moduleId });
};

// Static method to get user's enrollments
UserEnrollmentSchema.statics.getUserEnrollments = function (
  userId,
  options = {}
) {
  const query = this.find({ userId });

  if (options.status) {
    query.where("status", options.status);
  }

  if (options.populate) {
    query.populate("moduleId");
  }

  // Add pagination support
  if (options.skip !== undefined) {
    query.skip(options.skip);
  }

  if (options.limit !== undefined) {
    query.limit(options.limit);
  }

  return query.sort({ enrolledAt: -1 });
};

// Static method to get module enrollments
UserEnrollmentSchema.statics.getModuleEnrollments = function (
  moduleId,
  options = {}
) {
  const query = this.find({ moduleId });

  if (options.status) {
    query.where("status", options.status);
  }

  if (options.populate) {
    query.populate("userId");
  }

  return query.sort({ enrolledAt: -1 });
};

// Instance method to update progress
UserEnrollmentSchema.methods.updateProgress = function (completedSections) {
  this.completedSections = Math.max(0, completedSections);
  return this.save();
};

// Instance method to mark as completed
UserEnrollmentSchema.methods.markCompleted = function () {
  this.status = "completed";
  this.progressPercentage = 100;
  this.completedSections = this.totalSections;
  return this.save();
};

// Instance method to pause enrollment
UserEnrollmentSchema.methods.pause = function () {
  this.status = "paused";
  return this.save();
};

// Instance method to resume enrollment
UserEnrollmentSchema.methods.resume = function () {
  this.status = "active";
  return this.save();
};

// Enhanced instance method to sync progress from UserProgress data
UserEnrollmentSchema.methods.syncProgressFromUserProgress = async function () {
  const ProgressSyncService = require("../utils/progressSyncService");
  return await ProgressSyncService.syncEnrollmentProgress(this.userId, this.moduleId);
};

// Enhanced instance method to get detailed progress breakdown
UserEnrollmentSchema.methods.getDetailedProgress = async function () {
  const ProgressSyncService = require("../utils/progressSyncService");
  return await ProgressSyncService.calculateModuleProgress(this.userId, this.moduleId);
};

// Static method to get enrollment with enhanced progress data
UserEnrollmentSchema.statics.findWithEnhancedProgress = async function (userId, moduleId) {
  const ProgressSyncService = require("../utils/progressSyncService");
  return await ProgressSyncService.getEnhancedEnrollmentData(userId, moduleId);
};

// Static method to sync all enrollments for a user
UserEnrollmentSchema.statics.syncUserEnrollments = async function (userId) {
  const ProgressSyncService = require("../utils/progressSyncService");
  return await ProgressSyncService.syncUserEnrollments(userId);
};

// Static method to sync all enrollments for a module
UserEnrollmentSchema.statics.syncModuleEnrollments = async function (moduleId) {
  const ProgressSyncService = require("../utils/progressSyncService");
  return await ProgressSyncService.syncModuleEnrollments(moduleId);
};

// Static method to update section counts when module content changes
UserEnrollmentSchema.statics.updateModuleSectionCounts = async function (moduleId) {
  const ProgressSyncService = require("../utils/progressSyncService");
  return await ProgressSyncService.updateModuleSectionCounts(moduleId);
};

module.exports = mongoose.model("UserEnrollment", UserEnrollmentSchema);
