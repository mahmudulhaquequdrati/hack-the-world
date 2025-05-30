const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/**
 * User Schema
 * Represents users in the cybersecurity learning platform
 */
const userSchema = new mongoose.Schema(
  {
    // Basic user information
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9_-]+$/,
        "Username can only contain lowercase letters, numbers, underscores, and hyphens",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },

    // Profile information
    profile: {
      firstName: {
        type: String,
        trim: true,
        maxlength: [50, "First name cannot exceed 50 characters"],
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"],
      },
      displayName: {
        type: String,
        trim: true,
        maxlength: [100, "Display name cannot exceed 100 characters"],
      },
      avatar: {
        type: String,
        default: "",
      },
      bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
      },
      location: {
        type: String,
        trim: true,
        maxlength: [100, "Location cannot exceed 100 characters"],
      },
      website: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, "Website must be a valid URL"],
      },
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
    },

    // Account status
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "active",
    },

    // Role and permissions
    role: {
      type: String,
      enum: ["student", "instructor", "admin", "moderator"],
      default: "student",
    },

    // Cybersecurity experience level
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },

    // Learning preferences
    preferences: {
      learningPath: {
        type: String,
        enum: ["self-paced", "structured", "mixed"],
        default: "self-paced",
      },
      difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
      interests: [
        {
          type: String,
          enum: [
            "web-security",
            "network-security",
            "malware-analysis",
            "forensics",
            "penetration-testing",
            "cloud-security",
            "mobile-security",
            "social-engineering",
            "compliance",
            "governance",
          ],
        },
      ],
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        achievements: {
          type: Boolean,
          default: true,
        },
        courseUpdates: {
          type: Boolean,
          default: true,
        },
        weeklyDigest: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Learning statistics
    stats: {
      totalPoints: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      totalStudyTime: {
        type: Number,
        default: 0, // in minutes
      },
      coursesCompleted: {
        type: Number,
        default: 0,
      },
      coursesEnrolled: {
        type: Number,
        default: 0,
      },
      labsCompleted: {
        type: Number,
        default: 0,
      },
      gamesCompleted: {
        type: Number,
        default: 0,
      },
      achievementsEarned: {
        type: Number,
        default: 0,
      },
      rank: {
        type: Number,
        default: 0,
      },
      level: {
        type: Number,
        default: 1,
        min: 1,
        max: 100,
      },
      xp: {
        type: Number,
        default: 0,
      },
    },

    // Security settings
    security: {
      lastLogin: {
        type: Date,
      },
      loginAttempts: {
        type: Number,
        default: 0,
      },
      lockUntil: {
        type: Date,
      },
      passwordChangedAt: {
        type: Date,
        default: Date.now,
      },
      emailVerified: {
        type: Boolean,
        default: false,
      },
      emailVerificationToken: {
        type: String,
        select: false,
      },
      passwordResetToken: {
        type: String,
        select: false,
      },
      passwordResetExpires: {
        type: Date,
        select: false,
      },
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
      twoFactorSecret: {
        type: String,
        select: false,
      },
    },

    // Activity tracking
    activity: {
      lastActiveAt: {
        type: Date,
        default: Date.now,
      },
      dailyGoal: {
        type: Number,
        default: 30, // minutes
      },
      weeklyGoal: {
        type: Number,
        default: 210, // minutes (3.5 hours)
      },
      timezone: {
        type: String,
        default: "UTC",
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.security.emailVerificationToken;
        delete ret.security.passwordResetToken;
        delete ret.security.passwordResetExpires;
        delete ret.security.twoFactorSecret;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes
// userSchema.index({ username: 1 }); // Removed - already created by unique: true
// userSchema.index({ email: 1 }); // Removed - already created by unique: true
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ experienceLevel: 1 });
userSchema.index({ "stats.totalPoints": -1 });
userSchema.index({ "stats.rank": 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.profile.displayName || this.username;
});

// Virtual for account lock status
userSchema.virtual("isLocked").get(function () {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Virtual for progress completion rate
userSchema.virtual("overallProgress", {
  ref: "UserProgress",
  localField: "_id",
  foreignField: "userId",
});

// Virtual for enrollments
userSchema.virtual("enrollments", {
  ref: "UserEnrollment",
  localField: "_id",
  foreignField: "userId",
});

// Virtual for achievements
userSchema.virtual("achievements", {
  ref: "UserAchievement",
  localField: "_id",
  foreignField: "userId",
});

// Pre-save middleware
userSchema.pre("save", async function (next) {
  // Only hash password if it's modified
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Update password changed timestamp
    this.security.passwordChangedAt = new Date();

    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware for display name
userSchema.pre("save", function (next) {
  // Set display name if not provided
  if (!this.profile.displayName) {
    if (this.profile.firstName && this.profile.lastName) {
      this.profile.displayName = `${this.profile.firstName} ${this.profile.lastName}`;
    } else {
      this.profile.displayName = this.username;
    }
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.security.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.security.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

userSchema.methods.updateLastActive = function () {
  this.activity.lastActiveAt = new Date();
  return this.save({ validateBeforeSave: false });
};

userSchema.methods.updateStats = async function () {
  const UserProgress = mongoose.model("UserProgress");
  const UserEnrollment = mongoose.model("UserEnrollment");
  const UserLabProgress = mongoose.model("UserLabProgress");
  const UserGameProgress = mongoose.model("UserGameProgress");
  const UserAchievement = mongoose.model("UserAchievement");

  // Get user progress data
  const enrollments = await UserEnrollment.find({ userId: this._id });
  const completedCourses = await UserProgress.find({
    userId: this._id,
    completed: true,
  });
  const completedLabs = await UserLabProgress.find({
    userId: this._id,
    completed: true,
  });
  const completedGames = await UserGameProgress.find({
    userId: this._id,
    completed: true,
  });
  const achievements = await UserAchievement.find({
    userId: this._id,
    earned: true,
  });

  // Calculate total points from games
  const totalPoints = completedGames.reduce((sum, game) => sum + game.score, 0);

  // Update stats
  this.stats.coursesEnrolled = enrollments.length;
  this.stats.coursesCompleted = completedCourses.length;
  this.stats.labsCompleted = completedLabs.length;
  this.stats.gamesCompleted = completedGames.length;
  this.stats.achievementsEarned = achievements.length;
  this.stats.totalPoints = totalPoints;

  // Calculate level based on points (100 points per level)
  this.stats.level = Math.floor(totalPoints / 100) + 1;
  this.stats.xp = totalPoints % 100;

  await this.save({ validateBeforeSave: false });
};

userSchema.methods.incrementLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { "security.lockUntil": 1 },
      $set: { "security.loginAttempts": 1 },
    });
  }

  const updates = { $inc: { "security.loginAttempts": 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { "security.lockUntil": Date.now() + 2 * 60 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: {
      "security.loginAttempts": 1,
      "security.lockUntil": 1,
    },
  });
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    profile: this.profile,
    experienceLevel: this.experienceLevel,
    stats: this.stats,
    createdAt: this.createdAt,
  };
};

// Static methods
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username.toLowerCase() });
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.getLeaderboard = function (limit = 10) {
  return this.find({ status: "active" })
    .sort({ "stats.totalPoints": -1 })
    .limit(limit)
    .select("username profile stats");
};

userSchema.statics.updateUserRanks = async function () {
  const users = await this.find({ status: "active" })
    .sort({ "stats.totalPoints": -1 })
    .select("_id stats.totalPoints");

  const bulkOps = users.map((user, index) => ({
    updateOne: {
      filter: { _id: user._id },
      update: { "stats.rank": index + 1 },
    },
  }));

  if (bulkOps.length > 0) {
    await this.bulkWrite(bulkOps);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
