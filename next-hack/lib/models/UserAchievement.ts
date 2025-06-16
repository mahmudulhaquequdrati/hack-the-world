import mongoose from 'mongoose';

export interface IUserAchievement extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  achievementId: mongoose.Types.ObjectId;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date;
  earnedRewards: {
    points: number;
    badge?: string;
    title?: string;
  };
  notificationSent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Achievement ID is required"],
      ref: "Achievement",
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    earnedRewards: {
      points: {
        type: Number,
        default: 0,
        min: [0, "Points cannot be negative"]
      },
      badge: {
        type: String,
        trim: true,
      },
      title: {
        type: String,
        trim: true,
      }
    },
    notificationSent: {
      type: Boolean,
      default: false,
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
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, isCompleted: 1 });
userAchievementSchema.index({ isCompleted: 1, completedAt: -1 });
userAchievementSchema.index({ isActive: 1 });

// Virtual to populate user information
userAchievementSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to populate achievement information
userAchievementSchema.virtual("achievement", {
  ref: "Achievement",
  localField: "achievementId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to check if achievement is in progress
userAchievementSchema.virtual('isInProgress').get(function() {
  return this.progress > 0 && !this.isCompleted;
});

// Virtual to check if achievement is recently completed (within last 7 days)
userAchievementSchema.virtual('isRecentlyCompleted').get(function() {
  if (!this.completedAt) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.completedAt > sevenDaysAgo;
});

// Static methods
userAchievementSchema.statics.getByUser = function (userId: string, completed?: boolean) {
  const query: Record<string, unknown> = { userId, isActive: true };
  if (completed !== undefined) query.isCompleted = completed;
  
  return this.find(query)
    .populate('achievement')
    .sort({ completedAt: -1, progress: -1 });
};

userAchievementSchema.statics.getCompletedByUser = function (userId: string) {
  return this.find({ 
    userId, 
    isCompleted: true,
    isActive: true 
  })
    .populate('achievement')
    .sort({ completedAt: -1 });
};

userAchievementSchema.statics.getInProgressByUser = function (userId: string) {
  return this.find({ 
    userId, 
    isCompleted: false,
    progress: { $gt: 0 },
    isActive: true 
  })
    .populate('achievement')
    .sort({ progress: -1 });
};

userAchievementSchema.statics.getUserStats = function (userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $lookup: {
        from: 'achievements',
        localField: 'achievementId',
        foreignField: '_id',
        as: 'achievement'
      }
    },
    { $unwind: '$achievement' },
    {
      $group: {
        _id: null,
        totalAchievements: { $sum: 1 },
        completedAchievements: { 
          $sum: { $cond: [{ $eq: ["$isCompleted", true] }, 1, 0] } 
        },
        inProgressAchievements: { 
          $sum: { $cond: [
            { $and: [{ $gt: ["$progress", 0] }, { $eq: ["$isCompleted", false] }] }, 
            1, 
            0
          ] } 
        },
        totalPoints: { $sum: "$earnedRewards.points" },
        avgProgress: { $avg: "$progress" },
        achievementsByDifficulty: {
          $push: {
            difficulty: "$achievement.difficulty",
            isCompleted: "$isCompleted"
          }
        }
      }
    }
  ]);
};

// Instance methods
userAchievementSchema.methods.updateProgress = function (newProgress: number) {
  this.progress = Math.max(0, Math.min(100, newProgress));
  
  // Auto-complete if progress reaches 100%
  if (this.progress >= 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
    // Note: earnedRewards should be set when the achievement is completed
  }
  
  return this.save();
};

userAchievementSchema.methods.complete = function (rewards?: { points: number; badge?: string; title?: string }) {
  this.isCompleted = true;
  this.completedAt = new Date();
  this.progress = 100;
  
  if (rewards) {
    this.earnedRewards = rewards;
  }
  
  return this.save();
};

userAchievementSchema.methods.markNotificationSent = function () {
  this.notificationSent = true;
  return this.save();
};

const UserAchievement = mongoose.models.UserAchievement || mongoose.model<IUserAchievement>("UserAchievement", userAchievementSchema);

export default UserAchievement;