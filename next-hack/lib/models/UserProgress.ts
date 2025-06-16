import mongoose from 'mongoose';

export interface IUserProgress extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  contentType: 'video' | 'lab' | 'game' | 'document';
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  timeSpent: number; // in seconds
  score?: number;
  maxScore?: number;
  attempts: number;
  lastPosition?: number; // for videos: timestamp, for documents: page/scroll position
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  start(): Promise<IUserProgress>;
  updateProgress(progressPercentage: number, timeSpent?: number, lastPosition?: number): Promise<IUserProgress>;
  complete(score?: number, notes?: string): Promise<IUserProgress>;
  retry(): Promise<IUserProgress>;
}

export interface IUserProgressModel extends mongoose.Model<IUserProgress> {
  getByUser(userId: string, status?: string): Promise<IUserProgress[]>;
  getByContent(contentId: string): Promise<IUserProgress[]>;
  getByModule(userId: string, moduleId: string): Promise<IUserProgress[]>;
  getByContentType(userId: string, contentType: string): Promise<IUserProgress[]>;
  getUserOverallProgress(userId: string): Promise<unknown[]>;
  getModuleProgressSummary(userId: string, moduleId: string): Promise<unknown[]>;
  findByUserAndContent(userId: string, contentId: string): Promise<IUserProgress | null>;
}

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Content ID is required"],
      ref: "Content",
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Module ID is required"],
      ref: "Module",
    },
    contentType: {
      type: String,
      required: [true, "Content type is required"],
      enum: {
        values: ["video", "lab", "game", "document"],
        message: "Content type must be one of: video, lab, game, document",
      },
    },
    status: {
      type: String,
      required: [true, "Progress status is required"],
      enum: {
        values: ["not_started", "in_progress", "completed"],
        message: "Status must be one of: not_started, in_progress, completed",
      },
      default: "not_started",
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: [0, "Progress percentage cannot be negative"],
      max: [100, "Progress percentage cannot exceed 100"],
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: [0, "Time spent cannot be negative"],
    },
    score: {
      type: Number,
      min: [0, "Score cannot be negative"],
      max: [100, "Score cannot exceed 100"],
    },
    maxScore: {
      type: Number,
      min: [0, "Max score cannot be negative"],
    },
    attempts: {
      type: Number,
      default: 0,
      min: [0, "Attempts cannot be negative"],
    },
    lastPosition: {
      type: Number,
      min: [0, "Last position cannot be negative"],
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
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
userProgressSchema.index({ userId: 1, contentId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, moduleId: 1 });
userProgressSchema.index({ userId: 1, status: 1 });
userProgressSchema.index({ contentId: 1, status: 1 });
userProgressSchema.index({ moduleId: 1, status: 1 });
userProgressSchema.index({ contentType: 1, status: 1 });
userProgressSchema.index({ isActive: 1 });
userProgressSchema.index({ lastAccessedAt: -1 });

// Virtual to populate user information
userProgressSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to populate content information
userProgressSchema.virtual("content", {
  ref: "Content",
  localField: "contentId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to populate module information
userProgressSchema.virtual("module", {
  ref: "Module",
  localField: "moduleId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to check if progress is recent (within last 7 days)
userProgressSchema.virtual('isRecentProgress').get(function() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.lastAccessedAt > sevenDaysAgo;
});

// Virtual to calculate completion time duration
userProgressSchema.virtual('completionDuration').get(function() {
  if (this.startedAt && this.completedAt) {
    return this.completedAt.getTime() - this.startedAt.getTime(); // in milliseconds
  }
  return null;
});

// Static methods
userProgressSchema.statics.getByUser = function (userId: string, status?: string) {
  const query: Record<string, unknown> = { userId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('content')
    .populate('module')
    .sort({ lastAccessedAt: -1 });
};

userProgressSchema.statics.getByContent = function (contentId: string) {
  return this.find({ contentId, isActive: true })
    .populate('user')
    .sort({ lastAccessedAt: -1 });
};

userProgressSchema.statics.getByModule = function (userId: string, moduleId: string) {
  return this.find({ userId, moduleId, isActive: true })
    .populate('content')
    .sort({ 'content.order': 1 });
};

userProgressSchema.statics.getByContentType = function (userId: string, contentType: string) {
  return this.find({ userId, contentType, isActive: true })
    .populate('content')
    .populate('module')
    .sort({ lastAccessedAt: -1 });
};

userProgressSchema.statics.findByUserAndContent = function (userId: string, contentId: string) {
  return this.findOne({ userId, contentId, isActive: true });
};

userProgressSchema.statics.getUserOverallProgress = function (userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalTimeSpent: { $sum: "$timeSpent" },
        avgScore: { $avg: "$score" },
        avgProgress: { $avg: "$progressPercentage" }
      }
    }
  ]);
};

userProgressSchema.statics.getModuleProgressSummary = function (userId: string, moduleId: string) {
  return this.aggregate([
    { 
      $match: { 
        userId: new mongoose.Types.ObjectId(userId), 
        moduleId: new mongoose.Types.ObjectId(moduleId),
        isActive: true 
      } 
    },
    {
      $group: {
        _id: "$contentType",
        total: { $sum: 1 },
        completed: { 
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } 
        },
        inProgress: { 
          $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } 
        },
        avgProgress: { $avg: "$progressPercentage" },
        totalTimeSpent: { $sum: "$timeSpent" },
        avgScore: { $avg: "$score" }
      }
    }
  ]);
};

// Instance methods
userProgressSchema.methods.start = function () {
  if (this.status === 'not_started') {
    this.status = 'in_progress';
    this.startedAt = new Date();
    this.lastAccessedAt = new Date();
    this.attempts += 1;
  }
  return this.save();
};

userProgressSchema.methods.updateProgress = function (progressPercentage: number, timeSpent?: number, lastPosition?: number) {
  this.progressPercentage = Math.max(0, Math.min(100, progressPercentage));
  this.lastAccessedAt = new Date();
  
  if (timeSpent !== undefined) {
    this.timeSpent += timeSpent;
  }
  
  if (lastPosition !== undefined) {
    this.lastPosition = lastPosition;
  }
  
  // Update status based on progress
  if (this.status === 'not_started' && progressPercentage > 0) {
    this.status = 'in_progress';
    this.startedAt = new Date();
    this.attempts += 1;
  }
  
  // Auto-complete based on content type
  if (this.progressPercentage >= 90 && this.status !== 'completed') {
    // For videos, 90% watching is considered complete
    // For other content types, they need to be manually marked as complete
    if (this.contentType === 'video') {
      this.status = 'completed';
      this.completedAt = new Date();
    }
  }
  
  return this.save();
};

userProgressSchema.methods.complete = function (score?: number, notes?: string) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.lastAccessedAt = new Date();
  this.progressPercentage = 100;
  
  if (score !== undefined) {
    this.score = score;
  }
  
  if (notes) {
    this.notes = notes;
  }
  
  return this.save();
};

userProgressSchema.methods.retry = function () {
  this.attempts += 1;
  this.lastAccessedAt = new Date();
  
  // Reset certain fields for retry
  if (this.contentType === 'game' || this.contentType === 'lab') {
    this.progressPercentage = 0;
    this.status = 'in_progress';
    this.score = undefined;
  }
  
  return this.save();
};

const UserProgress = 
  (mongoose.models.UserProgress as IUserProgressModel) ||
  mongoose.model<IUserProgress, IUserProgressModel>("UserProgress", userProgressSchema);

export default UserProgress;