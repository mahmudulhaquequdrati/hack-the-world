import mongoose from 'mongoose';

export interface IUserEnrollment extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  status: 'active' | 'paused' | 'completed' | 'dropped';
  enrolledAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  progressPercentage: number;
  completedSections: number;
  totalSections: number;
  timeSpent: number; // in minutes
  certificateIssued: boolean;
  grade?: number;
  feedback?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userEnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Module ID is required"],
      ref: "Module",
    },
    status: {
      type: String,
      required: [true, "Enrollment status is required"],
      enum: {
        values: ["active", "paused", "completed", "dropped"],
        message: "Status must be one of: active, paused, completed, dropped",
      },
      default: "active",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: [0, "Progress percentage cannot be negative"],
      max: [100, "Progress percentage cannot exceed 100"],
    },
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
    timeSpent: {
      type: Number,
      default: 0,
      min: [0, "Time spent cannot be negative"],
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: Number,
      min: [0, "Grade cannot be negative"],
      max: [100, "Grade cannot exceed 100"],
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [1000, "Feedback cannot exceed 1000 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
userEnrollmentSchema.index({ userId: 1, moduleId: 1 }, { unique: true });
userEnrollmentSchema.index({ userId: 1, status: 1 });
userEnrollmentSchema.index({ moduleId: 1, status: 1 });
userEnrollmentSchema.index({ isActive: 1 });
userEnrollmentSchema.index({ status: 1, lastAccessedAt: -1 });

// Virtual to populate user information
userEnrollmentSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to populate module information
userEnrollmentSchema.virtual("module", {
  ref: "Module",
  localField: "moduleId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to check if enrollment is recent (within last 30 days)
userEnrollmentSchema.virtual('isRecentEnrollment').get(function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.enrolledAt > thirtyDaysAgo;
});

// Virtual to check if enrollment is stale (no access in last 14 days)
userEnrollmentSchema.virtual('isStale').get(function() {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  return this.lastAccessedAt < fourteenDaysAgo && this.status === 'active';
});

// Static methods
userEnrollmentSchema.statics.getByUser = function (userId: string, status?: string) {
  const query: Record<string, unknown> = { userId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('module')
    .sort({ enrolledAt: -1 });
};

userEnrollmentSchema.statics.getByModule = function (moduleId: string, status?: string) {
  const query: Record<string, unknown> = { moduleId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('user')
    .sort({ enrolledAt: -1 });
};

userEnrollmentSchema.statics.getActiveEnrollments = function (userId: string) {
  return this.find({ 
    userId, 
    status: { $in: ['active', 'paused'] },
    isActive: true 
  })
    .populate('module')
    .sort({ lastAccessedAt: -1 });
};

userEnrollmentSchema.statics.getCompletedEnrollments = function (userId: string) {
  return this.find({ 
    userId, 
    status: 'completed',
    isActive: true 
  })
    .populate('module')
    .sort({ completedAt: -1 });
};

userEnrollmentSchema.statics.getEnrollmentStats = function (moduleId: string) {
  return this.aggregate([
    { $match: { moduleId: new mongoose.Types.ObjectId(moduleId), isActive: true } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgProgress: { $avg: "$progressPercentage" },
        avgTimeSpent: { $avg: "$timeSpent" }
      }
    }
  ]);
};

// Instance methods
userEnrollmentSchema.methods.updateProgress = function (progressPercentage: number, completedSections?: number) {
  this.progressPercentage = Math.max(0, Math.min(100, progressPercentage));
  this.lastAccessedAt = new Date();
  
  if (completedSections !== undefined) {
    this.completedSections = completedSections;
  }
  
  // Auto-complete if progress reaches 100%
  if (this.progressPercentage >= 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = new Date();
  }
  
  return this.save();
};

userEnrollmentSchema.methods.pause = function () {
  if (this.status === 'active') {
    this.status = 'paused';
    return this.save();
  }
  return Promise.resolve(this);
};

userEnrollmentSchema.methods.resume = function () {
  if (this.status === 'paused') {
    this.status = 'active';
    this.lastAccessedAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

userEnrollmentSchema.methods.complete = function (grade?: number, feedback?: string) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.progressPercentage = 100;
  
  if (grade !== undefined) {
    this.grade = grade;
  }
  
  if (feedback) {
    this.feedback = feedback;
  }
  
  return this.save();
};

userEnrollmentSchema.methods.addTimeSpent = function (minutes: number) {
  this.timeSpent += minutes;
  this.lastAccessedAt = new Date();
  return this.save();
};

const UserEnrollment = mongoose.models.UserEnrollment || mongoose.model<IUserEnrollment>("UserEnrollment", userEnrollmentSchema);

export default UserEnrollment;