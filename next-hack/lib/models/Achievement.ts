import mongoose from 'mongoose';

export interface IAchievement extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  category: string;
  requirements: {
    type: string;
    target: number;
    description: string;
  };
  rewards: {
    points: number;
    badge?: string;
    title?: string;
  };
  icon: string;
  difficulty: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Achievement slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [100, "Slug cannot exceed 100 characters"],
      match: [/^[a-z0-9-_]+$/, "Slug can only contain lowercase letters, numbers, hyphens, and underscores"]
    },
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Achievement description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Achievement category is required"],
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters"],
    },
    requirements: {
      type: {
        type: String,
        required: [true, "Requirement type is required"],
        enum: {
          values: ["content_completion", "streak", "score", "time_spent", "module_completion", "special"],
          message: "Requirement type must be one of: content_completion, streak, score, time_spent, module_completion, special"
        }
      },
      target: {
        type: Number,
        required: [true, "Requirement target is required"],
        min: [1, "Target must be at least 1"]
      },
      description: {
        type: String,
        required: [true, "Requirement description is required"],
        trim: true,
        maxlength: [200, "Requirement description cannot exceed 200 characters"]
      }
    },
    rewards: {
      points: {
        type: Number,
        required: [true, "Reward points are required"],
        min: [0, "Points cannot be negative"]
      },
      badge: {
        type: String,
        trim: true,
        maxlength: [100, "Badge name cannot exceed 100 characters"]
      },
      title: {
        type: String,
        trim: true,
        maxlength: [100, "Title reward cannot exceed 100 characters"]
      }
    },
    icon: {
      type: String,
      required: [true, "Achievement icon is required"],
      trim: true,
      maxlength: [100, "Icon name cannot exceed 100 characters"],
    },
    difficulty: {
      type: String,
      required: [true, "Achievement difficulty is required"],
      enum: {
        values: ["Bronze", "Silver", "Gold", "Platinum"],
        message: "Difficulty must be one of: Bronze, Silver, Gold, Platinum"
      }
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
achievementSchema.index({ slug: 1 }, { unique: true });
achievementSchema.index({ category: 1 });
achievementSchema.index({ difficulty: 1 });
achievementSchema.index({ isActive: 1 });
achievementSchema.index({ 'requirements.type': 1 });

// Static methods
achievementSchema.statics.getByCategory = function (category: string) {
  return this.find({ category, isActive: true }).sort({ difficulty: 1 });
};

achievementSchema.statics.getByDifficulty = function (difficulty: string) {
  return this.find({ difficulty, isActive: true }).sort({ createdAt: -1 });
};

achievementSchema.statics.getActive = function () {
  return this.find({ isActive: true }).sort({ category: 1, difficulty: 1 });
};

achievementSchema.statics.createDefaultAchievements = async function () {
  const defaultAchievements = [
    {
      slug: "first-steps",
      title: "First Steps",
      description: "Complete your first piece of content",
      category: "Getting Started",
      requirements: {
        type: "content_completion",
        target: 1,
        description: "Complete 1 piece of content"
      },
      rewards: {
        points: 10,
        badge: "🎯",
        title: "Beginner"
      },
      icon: "target",
      difficulty: "Bronze"
    },
    {
      slug: "streak-starter",
      title: "Streak Starter",
      description: "Maintain a 3-day learning streak",
      category: "Consistency",
      requirements: {
        type: "streak",
        target: 3,
        description: "Learn for 3 consecutive days"
      },
      rewards: {
        points: 25,
        badge: "🔥"
      },
      icon: "fire",
      difficulty: "Bronze"
    },
    {
      slug: "module-master",
      title: "Module Master",
      description: "Complete your first module",
      category: "Progress",
      requirements: {
        type: "module_completion",
        target: 1,
        description: "Complete 1 full module"
      },
      rewards: {
        points: 50,
        badge: "📚",
        title: "Scholar"
      },
      icon: "book",
      difficulty: "Silver"
    },
    {
      slug: "dedicated-learner",
      title: "Dedicated Learner",
      description: "Maintain a 7-day learning streak",
      category: "Consistency",
      requirements: {
        type: "streak",
        target: 7,
        description: "Learn for 7 consecutive days"
      },
      rewards: {
        points: 100,
        badge: "⭐"
      },
      icon: "star",
      difficulty: "Silver"
    },
    {
      slug: "content-crusher",
      title: "Content Crusher",
      description: "Complete 50 pieces of content",
      category: "Progress",
      requirements: {
        type: "content_completion",
        target: 50,
        description: "Complete 50 pieces of content"
      },
      rewards: {
        points: 200,
        badge: "💪"
      },
      icon: "muscle",
      difficulty: "Gold"
    },
    {
      slug: "marathon-learner",
      title: "Marathon Learner",
      description: "Maintain a 30-day learning streak",
      category: "Consistency",
      requirements: {
        type: "streak",
        target: 30,
        description: "Learn for 30 consecutive days"
      },
      rewards: {
        points: 500,
        badge: "🏆",
        title: "Marathon Master"
      },
      icon: "trophy",
      difficulty: "Platinum"
    }
  ];

  const existingCount = await this.countDocuments();
  if (existingCount === 0) {
    return await this.insertMany(defaultAchievements);
  }
  return [];
};

const Achievement = mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", achievementSchema);

export default Achievement;