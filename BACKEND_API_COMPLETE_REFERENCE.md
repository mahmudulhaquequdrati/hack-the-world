# Backend API Complete Reference

## 🚀 API Overview

**Base URL**: `http://localhost:5001/api`  
**Authentication**: JWT Bearer Token  
**Documentation**: Swagger UI at `/api/docs`  
**Health Check**: `/api/health`  

## 🔐 Authentication & Security

### Security Middleware Stack
```javascript
// Rate Limiting: 10,000 requests per 15 minutes
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: { error: "Too many requests from this IP" }
}));

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
};

// Security Headers (Helmet.js)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

## 📋 Complete API Endpoints

### 1. Authentication API (`/api/auth`)

**Base Route**: `/api/auth`  
**Rate Limit**: 5 attempts per 15 minutes for login  
**File**: `/server/src/routes/auth.js`

#### POST `/api/auth/register`
**Purpose**: Register new user account  
**Access**: Public  
**Rate Limit**: Standard

**Request Body**:
```json
{
  "username": "string (3-30 chars, alphanumeric + underscore)",
  "email": "string (valid email format)",
  "password": "string (min 8 chars)",
  "firstName": "string (optional, max 50 chars)",
  "lastName": "string (optional, max 50 chars)",
  "role": "string (student|admin, default: student)"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "ObjectId",
      "username": "string",
      "email": "string",
      "role": "string",
      "profile": {
        "firstName": "string",
        "lastName": "string",
        "displayName": "string"
      },
      "stats": {
        "totalPoints": 0,
        "level": 1,
        "coursesCompleted": 0
      },
      "adminStatus": "pending|active|undefined",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    },
    "token": "JWT string"
  }
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

#### POST `/api/auth/login`
**Purpose**: User login  
**Access**: Public  
**Rate Limit**: 5 attempts per 15 minutes

**Request Body**:
```json
{
  "login": "string (username or email)",
  "password": "string"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "ObjectId",
      "username": "string",
      "email": "string",
      "role": "string",
      "profile": { /* full profile object */ },
      "stats": { /* user stats */ },
      "currentStreak": "number",
      "longestStreak": "number",
      "lastLogin": "ISO Date"
    },
    "token": "JWT string"
  }
}
```

#### GET `/api/auth/me`
**Purpose**: Get current user information  
**Access**: Protected (JWT required)

**Headers Required**:
```
Authorization: Bearer <jwt_token>
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      /* Complete user object with all fields except password */
    }
  }
}
```

#### POST `/api/auth/logout`
**Purpose**: User logout (client-side token removal)  
**Access**: Protected

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST `/api/auth/forgot-password`
**Purpose**: Initiate password reset  
**Access**: Public

**Request Body**:
```json
{
  "email": "string (valid email)"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Password reset instructions sent to email"
}
```

#### POST `/api/auth/reset-password`
**Purpose**: Reset password with token  
**Access**: Public

**Request Body**:
```json
{
  "token": "string (reset token)",
  "password": "string (new password)"
}
```

### 2. Profile API (`/api/profile`)

**Base Route**: `/api/profile`  
**Access**: Protected (all endpoints require authentication)  
**File**: `/server/src/routes/profile.js`

#### GET `/api/profile`
**Purpose**: Get current user's profile  
**Access**: Protected

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      /* Complete profile with stats and preferences */
    }
  }
}
```

#### PUT `/api/profile`
**Purpose**: Update user profile  
**Access**: Protected

**Request Body**:
```json
{
  "profile": {
    "firstName": "string (optional)",
    "lastName": "string (optional)",
    "displayName": "string (optional)",
    "bio": "string (optional, max 500 chars)",
    "location": "string (optional)",
    "website": "string (optional, valid URL)"
  },
  "experienceLevel": "string (beginner|intermediate|advanced|expert)",
  "preferences": {
    "emailNotifications": "boolean",
    "progressNotifications": "boolean",
    "achievementNotifications": "boolean",
    "theme": "string (dark|light|auto)",
    "language": "string"
  }
}
```

#### POST `/api/profile/avatar`
**Purpose**: Upload user avatar  
**Access**: Protected  
**Content-Type**: multipart/form-data

**Request Body**:
```
avatar: File (image file, max 5MB)
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "string (URL to uploaded avatar)"
  }
}
```

#### PUT `/api/profile/password`
**Purpose**: Change user password  
**Access**: Protected

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 8 chars)"
}
```

#### GET `/api/profile/stats`
**Purpose**: Get user statistics and achievements  
**Access**: Protected

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalPoints": "number",
      "level": "number",
      "coursesCompleted": "number",
      "labsCompleted": "number",
      "gamesCompleted": "number",
      "totalStudyTime": "number (minutes)"
    },
    "streaks": {
      "current": "number",
      "longest": "number",
      "lastActivity": "ISO Date"
    },
    "achievements": {
      "total": "number",
      "recent": [
        {
          "_id": "ObjectId",
          "title": "string",
          "earnedAt": "ISO Date"
        }
      ]
    },
    "progress": {
      "enrolledModules": "number",
      "completedModules": "number",
      "inProgressModules": "number"
    }
  }
}
```

### 3. Phases API (`/api/phases`)

**Base Route**: `/api/phases`  
**File**: `/server/src/routes/phase.js`

#### GET `/api/phases`
**Purpose**: Get all phases  
**Access**: Public

**Query Parameters**:
- `difficulty`: Filter by difficulty (beginner|intermediate|advanced|expert)
- `isActive`: Filter by active status (true|false)
- `sort`: Sort field (order|title|createdAt)
- `limit`: Number of results (default: 50)
- `skip`: Number to skip for pagination

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "phases": [
      {
        "_id": "ObjectId",
        "title": "string",
        "description": "string",
        "shortDescription": "string",
        "order": "number",
        "difficulty": "string",
        "estimatedDuration": "number (hours)",
        "tags": ["string"],
        "objectives": ["string"],
        "prerequisites": ["ObjectId"],
        "image": "string (URL)",
        "icon": "string",
        "color": "string (hex)",
        "isActive": "boolean",
        "metadata": {
          "totalModules": "number",
          "totalContent": "number",
          "totalDuration": "number (minutes)"
        },
        "createdAt": "ISO Date",
        "updatedAt": "ISO Date"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "hasNext": "boolean"
    }
  }
}
```

#### GET `/api/phases/with-modules`
**Purpose**: Get phases populated with their modules  
**Access**: Public

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "phases": [
      {
        /* Phase object */
        "modules": [
          {
            "_id": "ObjectId",
            "title": "string",
            "description": "string",
            "order": "number",
            "difficulty": "string",
            "estimatedDuration": "number",
            "metadata": {
              "totalContent": "number",
              "totalDuration": "number"
            }
          }
        ]
      }
    ]
  }
}
```

#### GET `/api/phases/:id`
**Purpose**: Get phase by ID  
**Access**: Public

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "phase": {
      /* Complete phase object */
    }
  }
}
```

#### POST `/api/phases`
**Purpose**: Create new phase  
**Access**: Admin only

**Request Body**:
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "shortDescription": "string (optional)",
  "order": "number (required)",
  "difficulty": "string (required)",
  "estimatedDuration": "number (optional)",
  "tags": ["string"],
  "objectives": ["string"],
  "prerequisites": ["ObjectId"],
  "image": "string (URL)",
  "icon": "string",
  "color": "string (hex)"
}
```

#### PUT `/api/phases/:id`
**Purpose**: Update phase  
**Access**: Admin only

#### DELETE `/api/phases/:id`
**Purpose**: Delete phase  
**Access**: Admin only

### 4. Modules API (`/api/modules`)

**Base Route**: `/api/modules`  
**File**: `/server/src/routes/modules.js`

#### GET `/api/modules`
**Purpose**: Get all modules  
**Access**: Public

**Query Parameters**:
- `phase`: Filter by phase ID
- `difficulty`: Filter by difficulty
- `isActive`: Filter by active status
- `isFeatured`: Filter by featured status
- `tags`: Filter by tags (comma-separated)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "_id": "ObjectId",
        "title": "string",
        "description": "string",
        "shortDescription": "string",
        "phase": "ObjectId",
        "order": "number",
        "difficulty": "string",
        "estimatedDuration": "number (minutes)",
        "prerequisites": ["ObjectId"],
        "learningObjectives": ["string"],
        "skills": ["string"],
        "tags": ["string"],
        "image": "string",
        "icon": "string",
        "instructor": {
          "name": "string",
          "bio": "string",
          "avatar": "string"
        },
        "isActive": "boolean",
        "isFeatured": "boolean",
        "metadata": {
          "totalContent": "number",
          "totalDuration": "number",
          "videoCount": "number",
          "labCount": "number",
          "gameCount": "number",
          "documentCount": "number"
        },
        "settings": {
          "allowDownload": "boolean",
          "requireSequentialCompletion": "boolean",
          "certificateEligible": "boolean"
        }
      }
    ]
  }
}
```

#### GET `/api/modules/with-content`
**Purpose**: Get modules with their content  
**Access**: Public

#### GET `/api/modules/grouped-optimized`
**Purpose**: Get modules grouped by phase with optimized data  
**Access**: Public

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "phases": [
      {
        "_id": "ObjectId",
        "title": "string",
        "description": "string",
        "order": "number",
        "modules": [
          {
            /* Module objects with content count */
          }
        ]
      }
    ]
  }
}
```

#### GET `/api/modules/:id`
**Purpose**: Get module by ID  
**Access**: Public

#### GET `/api/modules/:id/with-content`
**Purpose**: Get module with all its content  
**Access**: Public

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "module": {
      /* Complete module object */
      "content": [
        {
          "_id": "ObjectId",
          "title": "string",
          "description": "string",
          "type": "string (video|lab|game|document)",
          "order": "number",
          "duration": "number",
          "section": "string",
          "difficulty": "string",
          "isActive": "boolean"
        }
      ]
    }
  }
}
```

#### POST `/api/modules`
**Purpose**: Create new module  
**Access**: Admin only

#### PUT `/api/modules/:id`
**Purpose**: Update module  
**Access**: Admin only

#### DELETE `/api/modules/:id`
**Purpose**: Delete module  
**Access**: Admin only

### 5. Content API (`/api/content`)

**Base Route**: `/api/content`  
**File**: `/server/src/routes/content.js`

#### GET `/api/content`
**Purpose**: Get all content  
**Access**: Public

**Query Parameters**:
- `module`: Filter by module ID
- `type`: Filter by content type
- `section`: Filter by section
- `difficulty`: Filter by difficulty
- `isActive`: Filter by active status

#### GET `/api/content/:id`
**Purpose**: Get content by ID  
**Access**: Public

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "content": {
      "_id": "ObjectId",
      "title": "string",
      "description": "string",
      "module": "ObjectId",
      "type": "string",
      "order": "number",
      "duration": "number",
      "content": {
        /* Content-specific data based on type */
        "videoUrl": "string (for videos)",
        "labInstructions": "string (for labs)",
        "gameData": "object (for games)",
        "documentUrl": "string (for documents)"
      },
      "section": "string",
      "subsection": "string",
      "tags": ["string"],
      "difficulty": "string",
      "completionCriteria": {
        "type": "string",
        "requiredPercentage": "number",
        "requiredInteractions": "number"
      },
      "settings": {
        "allowSkip": "boolean",
        "allowDownload": "boolean",
        "allowSpeedControl": "boolean"
      }
    }
  }
}
```

#### GET `/api/content/:id/with-progress`
**Purpose**: Get content with user progress (if authenticated)  
**Access**: Public (enhanced for authenticated users)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "content": {
      /* Content object */
    },
    "progress": {
      "_id": "ObjectId",
      "progress": {
        "percentage": "number",
        "currentPosition": "number",
        "isCompleted": "boolean",
        "completedAt": "ISO Date"
      },
      "timeSpent": {
        "total": "number (seconds)"
      },
      "interactions": {
        "views": "number",
        "pauses": "number"
      }
    }
  }
}
```

#### POST `/api/content`
**Purpose**: Create new content  
**Access**: Admin only

#### PUT `/api/content/:id`
**Purpose**: Update content  
**Access**: Admin only

#### DELETE `/api/content/:id`
**Purpose**: Delete content  
**Access**: Admin only

### 6. Enrollments API (`/api/enrollments`)

**Base Route**: `/api/enrollments`  
**Access**: Protected (all endpoints require authentication)  
**File**: `/server/src/routes/enrollment.js`

#### GET `/api/enrollments`
**Purpose**: Get user's enrollments  
**Access**: Protected

**Query Parameters**:
- `status`: Filter by enrollment status
- `module`: Filter by module ID

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "_id": "ObjectId",
        "user": "ObjectId",
        "module": {
          "_id": "ObjectId",
          "title": "string",
          "description": "string",
          "phase": {
            "_id": "ObjectId",
            "title": "string"
          }
        },
        "enrolledAt": "ISO Date",
        "status": "string",
        "progress": {
          "percentage": "number",
          "completedContent": "number",
          "totalContent": "number",
          "lastContentCompleted": "ObjectId"
        },
        "timeSpent": {
          "total": "number (minutes)"
        },
        "completedAt": "ISO Date",
        "lastAccessedAt": "ISO Date"
      }
    ]
  }
}
```

#### POST `/api/enrollments`
**Purpose**: Enroll in a module  
**Access**: Protected

**Request Body**:
```json
{
  "moduleId": "ObjectId (required)"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Enrollment successful",
  "data": {
    "enrollment": {
      /* Complete enrollment object */
    }
  }
}
```

#### GET `/api/enrollments/:id`
**Purpose**: Get specific enrollment details  
**Access**: Protected (own enrollments only)

#### PUT `/api/enrollments/:id`
**Purpose**: Update enrollment status  
**Access**: Protected (own enrollments only)

**Request Body**:
```json
{
  "status": "string (active|paused|dropped)"
}
```

#### DELETE `/api/enrollments/:id`
**Purpose**: Unenroll from module  
**Access**: Protected (own enrollments only)

### 7. Progress API (`/api/progress`)

**Base Route**: `/api/progress`  
**Access**: Protected (all endpoints require authentication)  
**File**: `/server/src/routes/progress.js`

#### GET `/api/progress`
**Purpose**: Get user's progress across all content  
**Access**: Protected

**Query Parameters**:
- `module`: Filter by module ID
- `content`: Filter by content ID
- `completed`: Filter by completion status

#### POST `/api/progress`
**Purpose**: Update content progress  
**Access**: Protected

**Request Body**:
```json
{
  "contentId": "ObjectId (required)",
  "progress": {
    "percentage": "number (0-100)",
    "currentPosition": "number (optional)",
    "timeSpent": "number (seconds, optional)"
  },
  "interactions": {
    "pauses": "number (optional)",
    "seeks": "number (optional)"
  },
  "contentSpecific": {
    /* Content-type specific progress data */
  }
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Progress updated",
  "data": {
    "progress": {
      /* Updated progress object */
    },
    "enrollmentUpdated": "boolean",
    "achievementsEarned": [
      {
        "_id": "ObjectId",
        "title": "string"
      }
    ]
  }
}
```

#### GET `/api/progress/summary`
**Purpose**: Get user's progress summary  
**Access**: Protected

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalContent": "number",
      "completedContent": "number",
      "inProgressContent": "number",
      "totalTimeSpent": "number (minutes)",
      "averageScore": "number",
      "moduleProgress": [
        {
          "moduleId": "ObjectId",
          "title": "string",
          "progress": "number (percentage)",
          "timeSpent": "number"
        }
      ]
    }
  }
}
```

### 8. Achievements API (`/api/achievements`)

**Base Route**: `/api/achievements`  
**File**: `/server/src/routes/achievementRoutes.js`

#### GET `/api/achievements`
**Purpose**: Get all available achievements  
**Access**: Public

**Query Parameters**:
- `category`: Filter by category
- `type`: Filter by type
- `rarity`: Filter by rarity

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "_id": "ObjectId",
        "title": "string",
        "description": "string",
        "category": "string",
        "type": "string",
        "criteria": {
          "targetValue": "number",
          "targetType": "string"
        },
        "rewards": {
          "points": "number",
          "badge": "string",
          "title": "string"
        },
        "icon": "string",
        "color": "string",
        "rarity": "string",
        "isHidden": "boolean"
      }
    ]
  }
}
```

#### GET `/api/achievements/user`
**Purpose**: Get user's earned achievements  
**Access**: Protected

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "userAchievements": [
      {
        "_id": "ObjectId",
        "achievement": {
          /* Achievement object */
        },
        "earnedAt": "ISO Date",
        "earnedContext": {
          "triggerType": "string",
          "triggerValue": "mixed",
          "snapshot": {
            "userLevel": "number",
            "userPoints": "number"
          }
        },
        "isViewed": "boolean"
      }
    ]
  }
}
```

#### POST `/api/achievements`
**Purpose**: Create new achievement  
**Access**: Admin only

#### PUT `/api/achievements/:id`
**Purpose**: Update achievement  
**Access**: Admin only

### 9. Streak API (`/api/streak`)

**Base Route**: `/api/streak`  
**Access**: Protected (all endpoints require authentication)  
**File**: `/server/src/routes/streak.js`

#### GET `/api/streak/status`
**Purpose**: Get user's current streak status  
**Access**: Protected

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "streak": {
      "current": "number",
      "longest": "number",
      "lastActivity": "ISO Date",
      "status": "string (active|at_risk|broken|start)",
      "daysUntilRisk": "number",
      "canRecover": "boolean"
    }
  }
}
```

#### POST `/api/streak/update`
**Purpose**: Update streak (typically called on content completion)  
**Access**: Protected

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Streak updated",
  "data": {
    "streak": {
      "current": "number",
      "longest": "number",
      "isNewRecord": "boolean",
      "status": "string"
    },
    "achievementsEarned": ["ObjectId"]
  }
}
```

#### GET `/api/streak/leaderboard`
**Purpose**: Get streak leaderboard  
**Access**: Protected

**Query Parameters**:
- `limit`: Number of results (default: 10)
- `timeframe`: Timeframe for leaderboard (current|all_time)

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "user": {
          "_id": "ObjectId",
          "username": "string",
          "profile": {
            "displayName": "string",
            "avatar": "string"
          }
        },
        "currentStreak": "number",
        "longestStreak": "number",
        "rank": "number"
      }
    ],
    "userRank": "number"
  }
}
```

## 🛡️ Middleware Functions

### Authentication Middleware
```javascript
// /server/src/middleware/auth.js
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
```

### Admin Authorization Middleware
```javascript
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
```

### Validation Middleware
```javascript
// Using express-validator
const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
```

## 📊 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "string",
  "error": {
    "code": "string (optional)",
    "details": "string (development only)"
  },
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### HTTP Status Codes Used
- **200**: Success (GET, PUT operations)
- **201**: Created (POST operations)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate resource)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error (server errors)

## 🔧 Database Operations

### Common Query Patterns
```javascript
// Pagination
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const results = await Model.find(filter)
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });

// Population
const module = await Module.findById(id)
  .populate('phase', 'title description')
  .populate('content', 'title type duration order');

// Aggregation for statistics
const stats = await UserProgress.aggregate([
  { $match: { user: userId } },
  { $group: {
    _id: '$module',
    totalTime: { $sum: '$timeSpent.total' },
    completedCount: { $sum: { $cond: ['$progress.isCompleted', 1, 0] } }
  }}
]);
```

### Optimized Queries
```javascript
// Lean queries for read-only operations
const phases = await Phase.find({ isActive: true })
  .lean()
  .select('title description order difficulty');

// Efficient progress updates
await UserProgress.findOneAndUpdate(
  { user: userId, content: contentId },
  {
    $set: { 'progress.percentage': percentage },
    $inc: { 'timeSpent.total': timeSpent },
    $push: { 'timeSpent.sessions': sessionData }
  },
  { upsert: true, new: true }
);
```

## 📈 Performance Optimizations

### Response Optimization
- **Field Selection**: Only return necessary fields
- **Lean Queries**: Use `.lean()` for read-only operations
- **Population Limiting**: Selective population with field specification
- **Aggregation**: Use aggregation pipelines for complex queries

### Caching Strategies
- **In-Memory Caching**: Cache frequently accessed data
- **Query Result Caching**: Cache expensive query results
- **Static Data Caching**: Cache reference data (achievements, phases)

### Database Indexes
```javascript
// Compound indexes for common queries
userProgressSchema.index({ user: 1, content: 1 }, { unique: true });
userEnrollmentSchema.index({ user: 1, module: 1 }, { unique: true });

// Single field indexes for filters
moduleSchema.index({ phase: 1, order: 1 });
contentSchema.index({ module: 1, type: 1 });
```

This comprehensive API documentation provides everything needed to recreate the backend server for the Next.js migration, including all endpoints, request/response schemas, middleware, security patterns, and optimization strategies.