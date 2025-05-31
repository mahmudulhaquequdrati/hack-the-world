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
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
userSchema.index({ experienceLevel: 1 });
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
    id: this._id,
    username: this.username,
    email: this.email,
    profile: this.profile,
    experienceLevel: this.experienceLevel,
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

// Static methods for common queries
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username.toLowerCase() });
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
