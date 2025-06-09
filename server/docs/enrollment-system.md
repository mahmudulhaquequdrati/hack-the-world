# 🎓 Enrollment System Documentation

**Generated**: January 27, 2025
**System**: Hack The World Backend API
**Base URL**: `/api/enrollments`

---

## 🎯 Overview

The Enrollment System manages user enrollments in cybersecurity modules, tracking progress, status, and completion. It provides comprehensive enrollment lifecycle management from initial enrollment through completion, with detailed analytics for administrators.

### 🔑 Key Features

- **Module Enrollment** - Users can enroll in available modules
- **Progress Tracking** - Real-time progress monitoring with percentage completion
- **Status Management** - Active, completed, paused, and dropped states
- **Admin Analytics** - Comprehensive enrollment statistics and reporting
- **Validation** - Prevents duplicate enrollments and ensures data integrity
- **Performance Optimization** - Efficient queries with proper indexing

---

## 📋 Available Routes

### 1. **Enroll User in Module**

- **Route**: `POST /api/enrollments`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Any authenticated user

#### Request Format

```javascript
{
  "moduleId": "64a1b2c3d4e5f6789012346"  // Required: Valid MongoDB ObjectId
}
```

#### How It Works

1. **Validation**: Express-validator checks moduleId format
2. **Authentication**: Middleware extracts user from JWT token (`req.user.id`)
3. **Module Verification**: Checks if module exists in database
4. **Duplicate Check**: Prevents multiple enrollments in same module
5. **Content Count**: Calculates total sections by counting content items
6. **Enrollment Creation**: Creates new UserEnrollment document
7. **Population**: Enriches response with module details
8. **Response**: Returns enrollment with module information

#### Success Response (201)

```javascript
{
  "success": true,
  "message": "Successfully enrolled in module",
  "data": {
    "id": "64a1b2c3d4e5f6789012347",
    "userId": "64a1b2c3d4e5f6789012345",
    "moduleId": {
      "id": "64a1b2c3d4e5f6789012346",
      "title": "Cybersecurity Fundamentals",
      "description": "Learn the basics of cybersecurity",
      "difficulty": "beginner",
      "duration": "2 weeks"
    },
    "status": "active",
    "completedSections": 0,
    "totalSections": 8,
    "progressPercentage": 0,
    "enrolledAt": "2024-01-15T10:30:00.000Z",
    "lastAccessedAt": "2024-01-15T10:30:00.000Z",
    "estimatedCompletionDate": null
  }
}
```

#### Error Responses

- **400**: Invalid moduleId format, user already enrolled, validation errors
- **401**: Missing or invalid authentication token
- **404**: Module not found
- **500**: Server error during enrollment

#### Database Interactions

- **Queries**: Module.findById(), UserEnrollment.findByUserAndModule(), Content.countDocuments()
- **Creates**: New UserEnrollment document
- **Indexes Used**: moduleId (for module lookup), userId+moduleId compound (for duplicate check)

---

### 2. **Get User Enrollments**

- **Route**: `GET /api/enrollments`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Users can only see their own enrollments

#### Query Parameters

```javascript
{
  "status": "active",        // Optional: Filter by status (active|completed|paused|dropped)
  "populate": "true"         // Optional: Include module details in response
}
```

#### How It Works

1. **Authentication**: Extracts user ID from JWT token
2. **Query Building**: Builds options object based on query parameters
3. **Database Query**: Uses UserEnrollment.getUserEnrollments() static method
4. **Filtering**: Applies status filter if provided
5. **Population**: Includes module details if populate=true
6. **Sorting**: Returns enrollments sorted by enrollment date (newest first)
7. **Response**: Returns array of user's enrollments

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "User enrollments retrieved successfully",
  "count": 3,
  "data": [
    {
          "id": "64a1b2c3d4e5f6789012347",
    "userId": "64a1b2c3d4e5f6789012345",
    "moduleId": "64a1b2c3d4e5f6789012346",  // Or populated module object if populate=true
      "status": "active",
      "completedSections": 5,
      "totalSections": 8,
      "progressPercentage": 62,
      "enrolledAt": "2024-01-15T10:30:00.000Z",
      "lastAccessedAt": "2024-01-16T14:20:00.000Z"
    },
    // ... more enrollments
  ]
}
```

#### Database Interactions

- **Queries**: UserEnrollment.getUserEnrollments() with filtering and optional population
- **Indexes Used**: userId (for user enrollment lookup)

---

### 3. **Get Enrollment by Module** 🔍

- **Route**: `GET /api/enrollments/module/:moduleId`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Users can only see their own enrollment

> **This is the example function you specifically asked about!**

#### Route Parameters

```javascript
{
  "moduleId": "64a1b2c3d4e5f6789012346"  // Required: Valid MongoDB ObjectId
}
```

#### How getEnrollmentByModule() Works

**Step-by-Step Process:**

1. **Parameter Extraction**

   ```javascript
   const { moduleId } = req.params; // Gets moduleId from URL path
   const userId = req.user.id; // Gets user ID from JWT token (set by protect middleware)
   ```

2. **Database Query**

   ```javascript
   const enrollment = await UserEnrollment.findByUserAndModule(
     userId,
     moduleId
   ).populate("moduleId", "title description difficulty duration");
   ```

   - Uses static method `findByUserAndModule()` for efficient lookup
   - Populates module details (title, description, difficulty, duration)
   - Only returns enrollment for the authenticated user

3. **Validation Check**

   ```javascript
   if (!enrollment) {
     return next(new ErrorResponse("Enrollment not found", 404));
   }
   ```

   - Returns 404 if no enrollment exists for this user/module combination

4. **Success Response**
   ```javascript
   res.status(200).json({
     success: true,
     message: "Enrollment retrieved successfully",
     data: enrollment,
   });
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Enrollment retrieved successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012347",
    "userId": "64a1b2c3d4e5f6789012345",
    "moduleId": {
      "id": "64a1b2c3d4e5f6789012346",
      "title": "Network Security Fundamentals",
      "description": "Learn network security principles and practices",
      "difficulty": "intermediate",
      "duration": "3 weeks"
    },
    "status": "active",
    "completedSections": 3,
    "totalSections": 10,
    "progressPercentage": 30,
    "enrolledAt": "2024-01-10T09:15:00.000Z",
    "lastAccessedAt": "2024-01-16T14:30:00.000Z",
    "estimatedCompletionDate": "2024-02-01T00:00:00.000Z"
  }
}
```

#### Error Responses

- **400**: Invalid moduleId format (not a valid ObjectId)
- **401**: Missing or invalid authentication token
- **404**: Enrollment not found (user not enrolled in this module)
- **500**: Server error

#### Database Interactions

- **Query**: UserEnrollment.findByUserAndModule() with population
- **Indexes Used**: userId+moduleId compound index (highly efficient lookup)
- **Population**: Loads related module data in single query

#### Use Cases

1. **Frontend Module Page**: Check if user is enrolled before showing content
2. **Progress Display**: Show current progress and status
3. **Access Control**: Verify enrollment before allowing module access
4. **Progress Updates**: Get current state before updating progress

#### Security Features

- **User Isolation**: Users can only see their own enrollments
- **Input Validation**: ModuleId validated as proper ObjectId format
- **Authentication Required**: Must be logged in to access

---

### 4. **Update Enrollment Progress**

- **Route**: `PUT /api/enrollments/:enrollmentId/progress`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Users can only update their own enrollments

#### Request Format

```javascript
{
  "completedSections": 6  // Required: Number of completed sections (0 to totalSections)
}
```

#### How It Works

1. **Validation**: Checks completedSections is a valid number
2. **Authorization**: Verifies enrollment belongs to authenticated user
3. **Progress Update**: Uses enrollment.updateProgress() instance method
4. **Auto-calculation**: Progress percentage calculated automatically
5. **Response**: Returns updated enrollment with new progress

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012347",
    "userId": "64a1b2c3d4e5f6789012345",
    "moduleId": "64a1b2c3d4e5f6789012346",
    "status": "active",
    "completedSections": 6,
    "totalSections": 10,
    "progressPercentage": 60,
    "lastAccessedAt": "2024-01-16T15:45:00.000Z"
  }
}
```

#### Database Interactions

- **Queries**: UserEnrollment.findOne() with user authorization
- **Updates**: completedSections, progressPercentage (auto-calculated)
- **Methods**: Uses instance method updateProgress()

---

### 5. **Pause Enrollment**

- **Route**: `PUT /api/enrollments/:enrollmentId/pause`
- **Access**: Private
- **Authentication**: Bearer token required

#### How It Works

1. **Authorization**: Verifies enrollment belongs to user
2. **Status Update**: Changes status from 'active' to 'paused'
3. **Database Save**: Persists status change
4. **Response**: Returns updated enrollment

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Enrollment paused successfully",
  "data": {
    // Updated enrollment with status: "paused"
  }
}
```

---

### 6. **Resume Enrollment**

- **Route**: `PUT /api/enrollments/:enrollmentId/resume`
- **Access**: Private
- **Authentication**: Bearer token required

#### How It Works

1. **Authorization**: Verifies enrollment belongs to user
2. **Status Update**: Changes status from 'paused' to 'active'
3. **Database Save**: Persists status change
4. **Response**: Returns updated enrollment

---

### 7. **Complete Enrollment**

- **Route**: `PUT /api/enrollments/:enrollmentId/complete`
- **Access**: Private
- **Authentication**: Bearer token required

#### How It Works

1. **Authorization**: Verifies enrollment belongs to user
2. **Status Update**: Changes status to 'completed'
3. **Progress Update**: Sets progressPercentage to 100
4. **Sections Update**: Sets completedSections to totalSections
5. **Response**: Returns completed enrollment

---

### 8. **Unenroll from Module**

- **Route**: `DELETE /api/enrollments/:enrollmentId`
- **Access**: Private
- **Authentication**: Bearer token required

#### How It Works

1. **Authorization**: Verifies enrollment belongs to user
2. **Deletion**: Permanently removes enrollment from database
3. **Response**: Confirms successful unenrollment

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Successfully unenrolled from module"
}
```

---

## 🔧 Admin-Only Routes

### 9. **Get All Enrollments (Admin)**

- **Route**: `GET /api/enrollments/admin/all`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Query Parameters

```javascript
{
  "status": "active",       // Optional: Filter by status
  "moduleId": "64a...",     // Optional: Filter by module
  "page": 1,                // Optional: Page number (default: 1)
  "limit": 20               // Optional: Items per page (default: 20)
}
```

#### How It Works

1. **Admin Authorization**: Middleware verifies admin role
2. **Query Building**: Builds filter object from parameters
3. **Pagination**: Implements page-based pagination
4. **Population**: Includes user and module details
5. **Sorting**: Orders by enrollment date (newest first)
6. **Statistics**: Calculates total count and pagination info

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "All enrollments retrieved successfully",
  "count": 20,
  "total": 150,
  "pagination": {
    "page": 1,
    "limit": 20,
    "pages": 8
  },
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012347",
      "userId": {
        "id": "64a1b2c3d4e5f6789012345",
        "username": "cyberhacker2024",
        "email": "hacker@example.com"
      },
      "moduleId": {
        "id": "64a1b2c3d4e5f6789012346",
        "title": "Network Security",
        "description": "Learn network security",
        "difficulty": "intermediate"
      },
      "status": "active",
      "progressPercentage": 65,
      "enrolledAt": "2024-01-15T10:30:00.000Z"
    }
    // ... more enrollments
  ]
}
```

---

### 10. **Get Module Enrollment Statistics (Admin)**

- **Route**: `GET /api/enrollments/admin/stats/:moduleId`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### How It Works

1. **Module Validation**: Verifies module exists
2. **Data Aggregation**: Collects all enrollments for module
3. **Statistics Calculation**: Computes comprehensive statistics
4. **Response**: Returns detailed analytics

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Module enrollment statistics retrieved successfully",
  "data": {
    "module": {
      "id": "64a1b2c3d4e5f6789012346",
      "title": "Network Security Fundamentals"
    },
    "stats": {
      "totalEnrollments": 45,
      "activeEnrollments": 28,
      "completedEnrollments": 12,
      "pausedEnrollments": 3,
      "droppedEnrollments": 2,
      "averageProgress": 67,
      "completionRate": 27
    }
  }
}
```

---

## 🗄️ Database Schema Integration

### UserEnrollment Model

```javascript
{
  userId: ObjectId,                    // Reference to User
  moduleId: ObjectId,                  // Reference to Module
  enrolledAt: Date,                    // Enrollment timestamp
  status: String,                      // active|completed|paused|dropped
  completedSections: Number,           // Sections completed (0 to totalSections)
  totalSections: Number,               // Total sections in module
  progressPercentage: Number,          // Calculated progress (0-100)
  lastAccessedAt: Date,                // Last activity timestamp
  estimatedCompletionDate: Date        // Projected completion
}
```

### Key Indexes

```javascript
// Compound unique index - prevents duplicate enrollments
{ userId: 1, moduleId: 1 } (unique: true)

// Individual indexes for queries
{ userId: 1 }      // User enrollment lookups
{ moduleId: 1 }    // Module enrollment statistics
{ status: 1 }      // Status filtering
{ enrolledAt: 1 }  // Date sorting
```

### Static Methods Used

```javascript
// Find enrollment by user and module
UserEnrollment.findByUserAndModule(userId, moduleId);

// Get user's enrollments with options
UserEnrollment.getUserEnrollments(userId, options);

// Get module's enrollments
UserEnrollment.getModuleEnrollments(moduleId, options);
```

### Instance Methods Used

```javascript
// Update progress
enrollment.updateProgress(completedSections);

// Mark as completed
enrollment.markCompleted();

// Pause enrollment
enrollment.pause();

// Resume enrollment
enrollment.resume();
```

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Required**: All routes require valid authentication token
- **User Isolation**: Users can only access their own enrollments
- **Admin Protection**: Admin routes protected by role-based middleware
- **Input Validation**: All inputs validated for type and format

### Data Validation

```javascript
// Module ID validation
body("moduleId").isMongoId().withMessage("Valid module ID is required");

// Parameter validation
param("moduleId").isMongoId().withMessage("Valid module ID is required");
param("enrollmentId")
  .isMongoId()
  .withMessage("Valid enrollment ID is required");

// Progress validation
body("completedSections")
  .isInt({ min: 0 })
  .withMessage("Must be non-negative integer");
```

### Duplicate Prevention

- **Compound Index**: Prevents duplicate enrollments
- **Application Logic**: Checks existing enrollment before creation
- **Error Handling**: Clear error messages for duplicate attempts

---

## 📊 Model Interactions & Side Effects

### When Creating Enrollment

1. **Module Validation**: Ensures module exists and is active
2. **Content Count**: Queries Content model to set totalSections
3. **User Stats**: May trigger user achievement updates (future enhancement)
4. **Module Stats**: Affects module enrollment statistics

### When Updating Progress

1. **Progress Calculation**: Auto-calculates percentage based on sections
2. **Status Changes**: May auto-complete if all sections finished
3. **Activity Tracking**: Updates lastAccessedAt timestamp
4. **Analytics Impact**: Affects module and user statistics

### When Completing Enrollment

1. **User Stats Update**: May update user.stats.coursesCompleted
2. **Achievement Triggers**: May unlock new achievements
3. **Recommendation Engine**: May affect course recommendations

---

## 🎯 Common Use Cases

### Frontend Learning Platform

```javascript
// Check enrollment status before showing module content
const checkEnrollment = async (moduleId) => {
  try {
    const response = await fetch(`/api/enrollments/module/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 404) {
      // User not enrolled - show enrollment button
      return null;
    }

    const result = await response.json();
    return result.data; // Return enrollment with progress
  } catch (error) {
    console.error("Error checking enrollment:", error);
  }
};
```

### Admin Dashboard Analytics

```javascript
// Get module statistics for admin dashboard
const getModuleStats = async (moduleId) => {
  const response = await fetch(`/api/enrollments/admin/stats/${moduleId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const result = await response.json();
  return result.data.stats;
};
```

### Progress Tracking

```javascript
// Update user progress when completing content
const updateProgress = async (enrollmentId, completedCount) => {
  const response = await fetch(`/api/enrollments/${enrollmentId}/progress`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ completedSections: completedCount }),
  });

  return response.json();
};
```

---

## 📈 Performance Considerations

### Database Optimization

- **Compound Indexes**: Efficient user+module lookups
- **Pagination**: Prevents large result sets
- **Population Strategy**: Only populates needed fields
- **Query Optimization**: Uses static methods for complex queries

### Caching Opportunities

- **Module Data**: Module details rarely change, good for caching
- **User Enrollments**: Cache user's enrollment list for quick access
- **Statistics**: Cache module statistics with TTL

### Scalability Features

- **Pagination**: Built-in pagination for large datasets
- **Filtering**: Reduces data transfer with status/module filters
- **Selective Population**: Only loads needed related data

---

## 🧪 Testing Scenarios

### Unit Tests

1. **Enrollment Creation**: Valid/invalid module IDs, duplicate prevention
2. **Progress Updates**: Valid ranges, authorization checks
3. **Status Changes**: State transitions, validation
4. **Admin Analytics**: Calculation accuracy, data aggregation

### Integration Tests

1. **Full Enrollment Flow**: Enroll → Progress → Complete
2. **Authorization**: User isolation, admin access
3. **Database Consistency**: Referential integrity, cascading updates
4. **Performance**: Large dataset handling, query efficiency

---

This enrollment system provides comprehensive lifecycle management for user course enrollments, with robust security, detailed analytics, and efficient performance optimizations suitable for a cybersecurity learning platform.
