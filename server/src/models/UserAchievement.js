const mongoose = require("mongoose");

/**
 * UserAchievement Schema - Tracks user achievement progress and completions
 */
const userAchievementSchema = new mongoose.Schema(
  {
    // References
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
      required: [true, "Achievement ID is required"],
    },

    // Progress tracking
    progress: {
      current: {
        type: Number,
        default: 0,
        min: 0,
      },
      target: {
        type: Number,
        required: [true, "Target is required"],
        min: 1,
      },
    },

    // Completion status
    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },

    // Earned rewards
    earnedRewards: {
      xp: {
        type: Number,
        default: 0,
        min: 0,
      },
      badge: {
        type: String,
      },
      title: {
        type: String,
      },
    },

    // Metadata
    metadata: {
      lastProgressUpdate: {
        type: Date,
        default: Date.now,
      },
      progressHistory: [{
        value: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        reason: String,
      }],
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

// Compound indexes for performance
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, isCompleted: 1 });
userAchievementSchema.index({ userId: 1, completedAt: -1 });
userAchievementSchema.index({ achievementId: 1, isCompleted: 1 });
userAchievementSchema.index({ userId: 1, "progress.current": 1 });

// Virtual for progress percentage
userAchievementSchema.virtual("progressPercentage").get(function () {
  if (this.progress.target === 0) return 100;
  return Math.min(100, Math.round((this.progress.current / this.progress.target) * 100));
});

// Pre-save middleware to handle completion
userAchievementSchema.pre("save", async function (next) {
  // Check if achievement should be completed
  if (!this.isCompleted && this.progress.current >= this.progress.target) {
    this.isCompleted = true;
    this.completedAt = new Date();
    
    // Populate achievement to get rewards
    await this.populate('achievementId');
    
    if (this.achievementId) {
      this.earnedRewards.xp = this.achievementId.rewards.xp;
      this.earnedRewards.badge = this.achievementId.rewards.badge;
      this.earnedRewards.title = this.achievementId.rewards.title;
    }
  }

  // Update last progress update
  if (this.isModified('progress.current')) {
    this.metadata.lastProgressUpdate = new Date();
    
    // Add to progress history
    this.metadata.progressHistory.push({
      value: this.progress.current,
      timestamp: new Date(),
      reason: 'Progress updated',
    });
    
    // Keep only last 10 entries in history
    if (this.metadata.progressHistory.length > 10) {
      this.metadata.progressHistory = this.metadata.progressHistory.slice(-10);
    }
  }

  next();
});

// Post-save middleware to update user stats
userAchievementSchema.post("save", async function (doc) {
  if (doc.isCompleted && doc.isModified('isCompleted')) {
    const User = mongoose.model('User');
    
    // Update user's achievement count and XP
    await User.findByIdAndUpdate(
      doc.userId,
      {
        $inc: {
          'stats.achievementsEarned': 1,
          'stats.totalPoints': doc.earnedRewards.xp,
        },
      }
    );
    
    // Update achievement's earned count
    const Achievement = mongoose.model('Achievement');
    await Achievement.findByIdAndUpdate(
      doc.achievementId,
      {
        $inc: { earnedCount: 1 },
      }
    );
  }
});

// Static methods
userAchievementSchema.statics.findUserAchievements = function (userId, options = {}) {
  const query = this.find({ userId });
  
  if (options.completed !== undefined) {
    query.where({ isCompleted: options.completed });
  }
  
  if (options.populate) {
    query.populate('achievementId');
  }
  
  return query.sort({ completedAt: -1, createdAt: -1 });
};

userAchievementSchema.statics.findUserProgress = function (userId, achievementId) {
  return this.findOne({ userId, achievementId });
};

userAchievementSchema.statics.updateProgress = async function (userId, achievementSlug, increment = 1) {
  const Achievement = mongoose.model('Achievement');
  const achievement = await Achievement.findBySlug(achievementSlug);
  
  if (!achievement) {
    throw new Error(`Achievement with slug '${achievementSlug}' not found`);
  }
  
  const userAchievement = await this.findOneAndUpdate(
    { userId, achievementId: achievement._id },
    {
      $inc: { 'progress.current': increment },
      $setOnInsert: {
        userId,
        achievementId: achievement._id,
        'progress.target': achievement.requirements.target || 1,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );
  
  return userAchievement;
};

// Instance methods
userAchievementSchema.methods.updateProgress = async function (increment = 1) {
  this.progress.current = Math.max(0, this.progress.current + increment);
  return this.save();
};

userAchievementSchema.methods.complete = async function () {
  this.progress.current = this.progress.target;
  return this.save();
};

const UserAchievement = mongoose.model("UserAchievement", userAchievementSchema);

module.exports = UserAchievement;