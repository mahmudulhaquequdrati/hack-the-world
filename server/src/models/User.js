const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/**
 * User Schema - Simplified version for cybersecurity learning platform
 * Contains only fields that are currently used in the frontend
 */
const userSchema = new mongoose.Schema(
  {
    // Core authentication fields
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
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },

    // Profile information - used in ProfileInfo, EditProfileForm, UserAvatar
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
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/.+/.test(v);
          },
          message:
            "Website must be a valid URL starting with http:// or https://",
        },
      },
    },

    // Experience level - displayed in UI
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },

    // User role - for access control
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // Admin status - for admin account approval
    adminStatus: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: function () {
        return this.role === "admin" ? "pending" : "active";
      },
    },

    // Learning statistics - displayed in UserAvatar and dashboard
    stats: {
      totalPoints: {
        type: Number,
        default: 0,
      },
      level: {
        type: Number,
        default: 1,
        min: 1,
        max: 100,
      },
      coursesCompleted: {
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
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastActivityDate: {
        type: Date,
      },
    },

    // Essential security fields
    security: {
      passwordChangedAt: {
        type: Date,
        default: Date.now,
      },
      passwordResetToken: {
        type: String,
        select: false,
      },
      passwordResetExpires: {
        type: Date,
        select: false,
      },
      lastLogin: {
        type: Date,
      },
      loginAttempts: {
        type: Number,
        default: 0,
      },
      lockUntil: {
        type: Date,
        select: false,
      },
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
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Indexes for performance
userSchema.index({ experienceLevel: 1 });
userSchema.index({ role: 1 });
userSchema.index({ adminStatus: 1 });
userSchema.index({ role: 1, adminStatus: 1 }); // Compound index for admin queries
userSchema.index({ "stats.totalPoints": -1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.profile.displayName || this.username;
});

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  // Only hash password if it's modified
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Update password changed timestamp only if it hasn't been manually set
    if (!this.isModified("security.passwordChangedAt")) {
      this.security.passwordChangedAt = new Date();
    }

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

// Essential instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateLastActive = function () {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    id: this._id, // Include id for backwards compatibility
    username: this.username,
    email: this.email,
    profile: this.profile,
    experienceLevel: this.experienceLevel,
    role: this.role,
    adminStatus: this.adminStatus,
    stats: this.stats,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Store the hashed version in the database
  this.security.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.security.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Return the plain token for the email
  return resetToken;
};

// Account lockout methods
userSchema.methods.incrementLoginAttempts = async function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { "security.lockUntil": 1 },
      $set: { "security.loginAttempts": 1 },
    });
  }

  const updates = { $inc: { "security.loginAttempts": 1 } };

  // If we're hitting 11 attempts, lock for 1 hour (lock AFTER 10 attempts, on the 11th)
  if (this.security.loginAttempts + 1 >= 11 && !this.security.lockUntil) {
    updates.$set = { "security.lockUntil": Date.now() + 1 * 60 * 60 * 1000 }; // 1 hour
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $unset: {
      "security.loginAttempts": 1,
      "security.lockUntil": 1,
    },
  });
};

// Streak management methods
userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of day
  
  const lastActivity = this.stats.lastActivityDate;
  
  if (!lastActivity) {
    // First activity ever
    this.stats.currentStreak = 1;
    this.stats.longestStreak = Math.max(this.stats.longestStreak, 1);
    this.stats.lastActivityDate = today;
  } else {
    const lastActivityDate = new Date(lastActivity);
    lastActivityDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastActivityDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day - no change to streak
      return;
    } else if (daysDiff === 1) {
      // Consecutive day - increment streak
      this.stats.currentStreak += 1;
      this.stats.longestStreak = Math.max(this.stats.longestStreak, this.stats.currentStreak);
      this.stats.lastActivityDate = today;
    } else {
      // Streak broken - reset to 1
      this.stats.currentStreak = 1;
      this.stats.lastActivityDate = today;
    }
  }
  
  return this.save({ validateBeforeSave: false });
};

userSchema.methods.getStreakStatus = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = this.stats.lastActivityDate;
  
  if (!lastActivity) {
    return {
      currentStreak: 0,
      longestStreak: this.stats.longestStreak,
      streakStatus: 'start', // Ready to start streak
      daysSinceLastActivity: null
    };
  }
  
  const lastActivityDate = new Date(lastActivity);
  lastActivityDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - lastActivityDate) / (1000 * 60 * 60 * 24));
  
  let streakStatus;
  if (daysDiff === 0) {
    streakStatus = 'active'; // Activity today
  } else if (daysDiff === 1) {
    streakStatus = 'at_risk'; // No activity today, but can continue
  } else {
    streakStatus = 'broken'; // Streak is broken
  }
  
  return {
    currentStreak: this.stats.currentStreak,
    longestStreak: this.stats.longestStreak,
    streakStatus,
    daysSinceLastActivity: daysDiff,
    lastActivityDate: lastActivity
  };
};

// Static methods for common queries
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username.toLowerCase() });
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
