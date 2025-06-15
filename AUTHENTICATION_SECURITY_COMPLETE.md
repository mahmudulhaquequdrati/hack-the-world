# Authentication & Security Complete Documentation

## 🔐 Security Architecture Overview

**Authentication Method**: JWT (JSON Web Tokens)  
**Password Hashing**: bcrypt with 12 salt rounds  
**Token Expiry**: 7 days  
**Session Management**: Stateless JWT with refresh strategy  
**Role-Based Access**: Student and Admin roles with granular permissions  

## 🛡️ Security Stack

### Backend Security Layers
1. **Rate Limiting**: 10,000 requests per 15 minutes per IP
2. **CORS Protection**: Strict origin validation
3. **Security Headers**: Helmet.js with CSP
4. **Input Validation**: express-validator middleware
5. **SQL Injection Protection**: Mongoose ODM with validation
6. **XSS Protection**: Content Security Policy
7. **Account Security**: Login attempt limits, account lockout

### Frontend Security Measures
1. **Token Storage**: localStorage with secure practices
2. **Automatic Token Refresh**: Seamless authentication renewal
3. **Route Protection**: Authentication guards for protected routes
4. **Input Sanitization**: Client-side validation and sanitization
5. **Error Handling**: Secure error messages without data leakage

## 🔑 Authentication Implementation

### JWT Token Structure

```javascript
// Token Payload
{
  "id": "user_mongodb_id",
  "username": "string",
  "email": "string", 
  "role": "student|admin",
  "iat": 1643723400, // Issued at
  "exp": 1644328200  // Expires at (7 days)
}

// Token Header
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Backend Authentication Flow

#### User Registration (`/server/src/controllers/authController.js`)

```javascript
const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      role = 'student'
    } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // 2. Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // 3. Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create user with profile
    const userData = {
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      profile: {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        displayName: `${firstName} ${lastName}`.trim() || username
      },
      stats: {
        totalPoints: 0,
        level: 1,
        coursesCompleted: 0,
        labsCompleted: 0,
        gamesCompleted: 0,
        totalStudyTime: 0
      },
      currentStreak: 0,
      longestStreak: 0,
      security: {
        passwordChangedAt: new Date(),
        loginAttempts: 0
      }
    };

    // 5. Set admin status for admin accounts
    if (role === 'admin') {
      userData.adminStatus = 'pending'; // Requires approval
    }

    const user = new User(userData);
    await user.save();

    // 6. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'hack-the-world',
        audience: 'hack-the-world-users'
      }
    );

    // 7. Return user data (excluding password)
    const userResponse = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
```

#### User Login with Security Features

```javascript
const login = async (req, res) => {
  try {
    const { login, password } = req.body; // login can be username or email
    const clientIP = req.ip || req.connection.remoteAddress;

    // 1. Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: login.toLowerCase() },
        { email: login.toLowerCase() }
      ]
    }).select('+password +security');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 2. Check if account is locked
    if (user.security.lockUntil && user.security.lockUntil > Date.now()) {
      const lockTimeRemaining = Math.ceil((user.security.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${lockTimeRemaining} minutes.`
      });
    }

    // 3. Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Increment login attempts
      await incrementLoginAttempts(user);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 4. Check admin status for admin users
    if (user.role === 'admin' && user.adminStatus !== 'active') {
      return res.status(403).json({
        success: false,
        message: user.adminStatus === 'pending' 
          ? 'Admin account pending approval'
          : 'Admin account suspended'
      });
    }

    // 5. Reset login attempts on successful login
    if (user.security.loginAttempts > 0) {
      await User.findByIdAndUpdate(user._id, {
        $unset: {
          'security.loginAttempts': 1,
          'security.lockUntil': 1
        }
      });
    }

    // 6. Update last login
    await User.findByIdAndUpdate(user._id, {
      'security.lastLogin': new Date()
    });

    // 7. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'hack-the-world',
        audience: 'hack-the-world-users'
      }
    );

    // 8. Return user data (excluding password and security details)
    const userResponse = await User.findById(user._id)
      .select('-password -security.passwordResetToken -security.passwordResetExpires');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to handle login attempts
const incrementLoginAttempts = async (user) => {
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
  const lockTime = parseInt(process.env.ACCOUNT_LOCK_TIME) || 30 * 60 * 1000; // 30 minutes

  const updates = { $inc: { 'security.loginAttempts': 1 } };

  // If we have a previous lock that has expired, restart at 1
  if (user.security.lockUntil && user.security.lockUntil < Date.now()) {
    updates.$set = {
      'security.loginAttempts': 1,
    };
    updates.$unset = { 'security.lockUntil': 1 };
  }
  // If we're incrementing past max attempts, lock the account
  else if (user.security.loginAttempts + 1 >= maxAttempts && !user.security.lockUntil) {
    updates.$set = { 'security.lockUntil': Date.now() + lockTime };
  }

  return User.findByIdAndUpdate(user._id, updates);
};
```

### Frontend Authentication Integration

#### Auth Context (`/frontend/src/features/auth/authSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  lastLoginAttempt: number | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  loginAttempts: 0,
  lastLoginAttempt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
      
      // Store token securely
      localStorage.setItem('token', token);
      
      // Set token expiry tracking
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = tokenPayload.exp * 1000;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
      
      // Clear stored tokens
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('refreshToken');
    },
    
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
      state.lastLoginAttempt = Date.now();
      
      // Store attempts in localStorage for persistence
      localStorage.setItem('loginAttempts', state.loginAttempts.toString());
      localStorage.setItem('lastLoginAttempt', state.lastLoginAttempt.toString());
    },
    
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
      
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lastLoginAttempt');
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { 
  setCredentials, 
  setUser, 
  logout, 
  incrementLoginAttempts,
  resetLoginAttempts,
  setLoading 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectToken = (state: RootState) => state.auth.token;
export const selectLoginAttempts = (state: RootState) => state.auth.loginAttempts;
```

#### Protected Route Component

```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin';
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/auth/login',
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ requiredRole, userRole: user.role }} 
        replace 
      />
    );
  }

  // Check admin status for admin users
  if (user.role === 'admin' && user.adminStatus !== 'active') {
    return (
      <Navigate 
        to="/admin/pending" 
        state={{ adminStatus: user.adminStatus }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};
```

#### Token Refresh Implementation

```typescript
// /frontend/src/utils/tokenManager.ts
export class TokenManager {
  private static instance: TokenManager;
  private refreshTimer: NodeJS.Timeout | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Check if token is expired or near expiry
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      // Consider token expired if it expires within 5 minutes
      return currentTime >= (expiryTime - 5 * 60 * 1000);
    } catch {
      return true;
    }
  }

  // Get time until token expires
  getTimeUntilExpiry(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      return Math.max(0, expiryTime - Date.now());
    } catch {
      return 0;
    }
  }

  // Schedule automatic token refresh
  scheduleTokenRefresh(token: string, refreshCallback: () => Promise<void>): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    const refreshTime = Math.max(0, timeUntilExpiry - 10 * 60 * 1000); // Refresh 10 minutes before expiry

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          await refreshCallback();
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Handle refresh failure (logout user)
        }
      }, refreshTime);
    }
  }

  // Clear refresh timer
  clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
```

## 🔒 Password Security

### Password Hashing (Backend)

```javascript
// /server/src/utils/passwordUtils.js
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class PasswordUtils {
  // Hash password with secure salt rounds
  static async hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password against hash
  static async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Generate secure password reset token
  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate password strength
  static validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a stronger password');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check if password was changed after JWT issued
  static isPasswordChangedAfterJWT(passwordChangedAt, jwtIssuedAt) {
    if (!passwordChangedAt) return false;
    
    const passwordTimestamp = Math.floor(passwordChangedAt.getTime() / 1000);
    return passwordTimestamp > jwtIssuedAt;
  }
}

module.exports = PasswordUtils;
```

### Password Reset Flow

```javascript
// Password reset request
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: 'If that email exists, password reset instructions have been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token to user (expires in 10 minutes)
    user.security.passwordResetToken = hashedToken;
    user.security.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email with reset link
    const resetURL = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
    
    // TODO: Implement email sending
    console.log(`Password reset URL: ${resetURL}`);

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to email'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      'security.passwordResetToken': hashedToken,
      'security.passwordResetExpires': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Validate new password
    const passwordValidation = PasswordUtils.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors
      });
    }

    // Hash new password
    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.security.passwordChangedAt = new Date();
    user.security.passwordResetToken = undefined;
    user.security.passwordResetExpires = undefined;
    user.security.loginAttempts = 0;
    user.security.lockUntil = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};
```

## 🛡️ Security Middleware

### Authentication Middleware

```javascript
// /server/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordUtils = require('../utils/passwordUtils');

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('+security.passwordChangedAt');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // Check if password was changed after token was issued
    if (PasswordUtils.isPasswordChangedAfterJWT(user.security.passwordChangedAt, decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: 'Password recently changed. Please log in again.'
      });
    }

    // Check if admin account is still active
    if (user.role === 'admin' && user.adminStatus !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Admin account no longer active'
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Optional authentication (for public endpoints that enhance with auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user && !PasswordUtils.isPasswordChangedAfterJWT(user.security.passwordChangedAt, decoded.iat)) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Fail silently for optional auth
    next();
  }
};

// Admin authorization
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  if (req.user.adminStatus !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Admin account not activated'
    });
  }

  next();
};

// Role-based authorization
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireRole
};
```

### Rate Limiting Configuration

```javascript
// /server/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// Create Redis client for rate limiting storage
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
    retryAfter: 15 * 60
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

// Password reset rate limiting
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.',
    retryAfter: 60 * 60
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

// Registration rate limiting
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 registration attempts per hour
  message: {
    success: false,
    message: 'Too many registration attempts, please try again later.',
    retryAfter: 60 * 60
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  registrationLimiter
};
```

## 🔐 Input Validation & Sanitization

### Validation Schemas

```javascript
// /server/src/validators/authValidators.js
const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .normalizeEmail(),
    
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters'),
    
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-']+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-']+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
    
  body('role')
    .optional()
    .isIn(['student', 'admin'])
    .withMessage('Role must be either student or admin')
];

const loginValidation = [
  body('login')
    .notEmpty()
    .withMessage('Username or email is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Login cannot exceed 100 characters'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password cannot exceed 128 characters')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters')
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 64, max: 64 })
    .withMessage('Invalid reset token format')
    .matches(/^[a-f0-9]+$/)
    .withMessage('Invalid reset token format'),
    
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  handleValidationErrors
};
```

## 🛡️ Security Headers & CORS

### Security Headers Configuration

```javascript
// /server/index.js - Security Headers Setup
const helmet = require('helmet');

app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: [
          "'self'",
          process.env.CLIENT_URL || "http://localhost:5173",
          process.env.ADMIN_URL || "http://localhost:5174"
        ],
        mediaSrc: ["'self'", "blob:", "data:"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
      },
    },
    
    // Cross-Origin Embedder Policy
    crossOriginEmbedderPolicy: false,
    
    // X-Frame-Options
    frameguard: { action: 'deny' },
    
    // Hide X-Powered-By header
    hidePoweredBy: true,
    
    // HSTS (HTTP Strict Transport Security)
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    
    // X-Content-Type-Options
    noSniff: true,
    
    // Referrer Policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    
    // X-XSS-Protection
    xssFilter: true
  })
);
```

### CORS Configuration

```javascript
// /server/index.js - CORS Setup
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, desktop apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Define allowed origins
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173', // Frontend app
      process.env.ADMIN_URL || 'http://localhost:5174',  // Admin panel
      'http://localhost:5175', // Development tools
      'http://localhost:5001', // Same-origin requests
    ];

    // Additional origins from environment variable
    if (process.env.ADDITIONAL_ORIGINS) {
      const additionalOrigins = process.env.ADDITIONAL_ORIGINS.split(',');
      allowedOrigins.push(...additionalOrigins);
    }

    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: true, // Allow cookies and auth headers
  optionsSuccessStatus: 200, // Support legacy browsers
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page'
  ],
  
  maxAge: 86400 // 24 hours - how long to cache preflight requests
};

app.use(cors(corsOptions));
```

## 🔒 Session Security

### Session Configuration

```javascript
// /server/src/config/session.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = {
  name: 'hackTheWorld.sid', // Don't use default session name
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  
  resave: false,
  saveUninitialized: false,
  
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Require HTTPS in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'strict' // CSRF protection
  },
  
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600, // Lazy session update
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60 // 7 days
  })
};

module.exports = sessionConfig;
```

This comprehensive authentication and security documentation provides the complete foundation for implementing secure authentication and authorization in the Next.js migration of the platform.