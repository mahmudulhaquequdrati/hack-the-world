# Progress System API Documentation

## Overview

The Progress System is a comprehensive learning analytics component of the "Hack The World" cybersecurity platform that tracks user progression through educational content. It provides detailed insights into user engagement, completion rates, performance metrics, and learning statistics across all types of content (videos, labs, games, documents).

## Key Features

- **Real-time Progress Tracking**: Automatic tracking of user progress as they engage with content
- **Multi-dimensional Analytics**: Tracks completion status, time spent, scores, and progress percentages
- **Module-specific Insights**: Detailed progress analysis per cybersecurity module
- **Content Type Segmentation**: Separate tracking for videos, labs, games, and documents
- **Performance Metrics**: Score tracking with maximum score validation
- **Statistical Reporting**: Comprehensive statistics for users and administrators
- **Authorization Controls**: Role-based access to progress data

## Database Schema

### UserProgress Model

```javascript
{
  id: ObjectId,
  userId: ObjectId,              // User reference
  contentId: ObjectId,           // Content reference
  contentType: String,           // 'video', 'lab', 'game', 'document'
  status: String,                // 'not-started', 'in-progress', 'completed'
  progressPercentage: Number,    // 0-100
  startedAt: Date,              // When user first started content
  completedAt: Date,            // When user completed content (optional)
  timeSpent: Number,            // Total time in minutes
  score: Number,                // Score achieved (optional)
  maxScore: Number,             // Maximum possible score (optional)
  createdAt: Date,
  updatedAt: Date
}
```

### Key Indexes

- `{ userId: 1, contentId: 1 }` - Compound index for user-content lookups
- `{ userId: 1, status: 1 }` - User progress by status queries
- `{ contentId: 1, status: 1 }` - Content completion statistics
- `{ userId: 1, contentType: 1 }` - User progress by content type

## API Endpoints

### 1. Get User Overall Progress

**Endpoint**: `GET /api/progress/:userId`
**Authentication**: Required (Bearer Token)
**Authorization**: Users can access own progress, admins can access any

#### Purpose

Retrieves comprehensive progress data for a specific user across all enrolled modules and content types.

#### Parameters

- **Path Parameters**:

  - `userId` (required): User ID (MongoDB ObjectId)

- **Query Parameters**:
  - `contentType` (optional): Filter by content type ('video', 'lab', 'game', 'document')
  - `status` (optional): Filter by progress status ('not-started', 'in-progress', 'completed')
  - `moduleId` (optional): Filter by specific module ID

#### Response Structure

```json
{
  "success": true,
  "message": "User progress retrieved successfully",
  "data": {
    "progress": [
      {
        "id": "progress_id",
        "userId": "user_id",
        "contentId": "content_id",
        "contentType": "lab",
        "status": "completed",
        "progressPercentage": 100,
        "timeSpent": 45,
        "score": 85,
        "maxScore": 100,
        "startedAt": "2024-01-15T10:00:00Z",
        "completedAt": "2024-01-15T10:45:00Z",
        "content": {
          "title": "SQL Injection Lab",
          "description": "Learn SQL injection techniques",
          "module": "Web Security Fundamentals"
        }
      }
    ],
    "statistics": {
      "total": 25,
      "completed": 18,
      "inProgress": 5,
      "notStarted": 2,
      "averageProgress": 78,
      "totalTimeSpent": 1250
    }
  }
}
```

#### Database Operations

1. **User Validation**: `User.findById(userId)` - Verify user exists
2. **Authorization Check**: Compare `req.user.id` with `userId` (unless admin)
3. **Progress Query**: `UserProgress.getUserProgress(userId, options)` with population
4. **Statistics Calculation**: Aggregate progress data for summary metrics

#### Error Responses

- `400`: Invalid user ID format
- `401`: Authentication required
- `403`: Not authorized to access this progress
- `404`: User not found

---

### 2. Get Module-specific Progress

**Endpoint**: `GET /api/progress/:userId/:moduleId`
**Authentication**: Required (Bearer Token)
**Authorization**: Users can access own progress, admins can access any

#### Purpose

Provides detailed progress analysis for a specific user within a particular cybersecurity module, including completion statistics and content type breakdown.

#### Parameters

- **Path Parameters**:
  - `userId` (required): User ID (MongoDB ObjectId)
  - `moduleId` (required): Module ID (MongoDB ObjectId)

#### Response Structure

```json
{
  "success": true,
  "message": "Module progress retrieved successfully",
  "data": {
    "module": {
      "id": "module_id",
      "title": "Web Security Fundamentals",
      "description": "Comprehensive web security training"
    },
    "enrollment": {
      "enrolledAt": "2024-01-10T09:00:00Z",
      "progressPercentage": 75,
      "status": "active"
    },
    "progress": [...],
    "statistics": {
      "totalContent": 20,
      "completedContent": 15,
      "completionPercentage": 75,
      "totalTimeSpent": 680,
      "progressByType": {
        "video": 8,
        "lab": 4,
        "game": 2,
        "document": 6
      }
    }
  }
}
```

#### Database Operations

1. **Validation**: Verify both `userId` and `moduleId` are valid ObjectIds
2. **Existence Check**: `Promise.all([User.findById(), Module.findById()])`
3. **Authorization**: Role-based access control check
4. **Progress Query**: `UserProgress.getUserProgressByModule(userId, moduleId)`
5. **Enrollment Check**: `UserEnrollment.findByUserAndModule(userId, moduleId)`
6. **Content Analysis**: `Content.find({ moduleId, isActive: true })` for completion percentage
7. **Statistics Calculation**: Aggregate data by content type and completion status

#### Business Logic

- **Completion Percentage**: `(completedContent / totalContent) * 100`
- **Progress Segmentation**: Groups progress by content type for detailed analysis
- **Time Tracking**: Accumulates total time spent across all module content
- **Enrollment Integration**: Links progress data with enrollment status

---

### 3. Get User Labs Progress

**Endpoint**: `GET /api/progress/:userId/labs`
**Authentication**: Required (Bearer Token)
**Authorization**: Users can access own progress, admins can access any

#### Purpose

Specialized endpoint for retrieving user progress specifically for laboratory exercises across all enrolled modules, with detailed scoring and performance metrics.

#### Parameters

- **Path Parameters**:

  - `userId` (required): User ID (MongoDB ObjectId)

- **Query Parameters**:
  - `moduleId` (optional): Filter labs by specific module
  - `status` (optional): Filter by progress status

#### Response Structure

```json
{
  "success": true,
  "message": "User labs progress retrieved successfully",
  "data": {
    "labs": [
      {
        "id": "lab_id",
        "title": "SQL Injection Lab",
        "description": "Hands-on SQL injection testing",
        "section": "Database Security",
        "duration": 60,
        "instructions": "Follow the lab guide...",
        "metadata": {
          "difficulty": "intermediate",
          "tools": ["sqlmap", "burp"],
          "objectives": ["Identify SQL injection", "Exploit vulnerabilities"]
        },
        "module": {
          "id": "module_id",
          "title": "Web Security Fundamentals",
          "difficulty": "intermediate"
        },
        "progress": {
          "status": "completed",
          "progressPercentage": 100,
          "timeSpent": 65,
          "score": 88,
          "maxScore": 100
        }
      }
    ],
    "statistics": {
      "total": 12,
      "completed": 8,
      "inProgress": 3,
      "notStarted": 1,
      "averageProgress": 82,
      "totalTimeSpent": 740,
      "averageScore": 84
    },
    "modules": [
      {
        "id": "module_id",
        "title": "Web Security Fundamentals",
        "labsCount": 5,
        "completedLabs": 4
      }
    ]
  }
}
```

#### Database Operations

1. **User Validation**: Check user existence and authorization
2. **Content Query**: `Content.find({ contentType: 'lab' })` with module population
3. **Progress Join**: Link content with user progress records
4. **Enrollment Filter**: Only include labs from enrolled modules
5. **Statistics Aggregation**: Calculate completion rates and performance metrics
6. **Module Grouping**: Organize lab statistics by module

---

### 4. Get User Games Progress

**Endpoint**: `GET /api/progress/:userId/games`
**Authentication**: Required (Bearer Token)
**Authorization**: Users can access own progress, admins can access any

#### Purpose

Retrieves progress data for gamified cybersecurity challenges, including scoring, points earned, and gameplay statistics.

#### Parameters

- **Path Parameters**:

  - `userId` (required): User ID (MongoDB ObjectId)

- **Query Parameters**:
  - `moduleId` (optional): Filter games by specific module
  - `status` (optional): Filter by progress status

#### Response Structure

```json
{
  "success": true,
  "message": "User games progress retrieved successfully",
  "data": {
    "games": [
      {
        "id": "game_id",
        "title": "Cipher Challenge",
        "description": "Decrypt encrypted messages",
        "section": "Cryptography",
        "duration": 30,
        "instructions": "Use various decryption techniques...",
        "metadata": {
          "difficulty": "beginner",
          "gameType": "puzzle",
          "levels": 5,
          "scoring": {
            "timeBonus": true,
            "accuracyWeight": 0.7,
            "speedWeight": 0.3
          }
        },
        "module": {
          "id": "module_id",
          "title": "Cryptography Fundamentals",
          "difficulty": "beginner"
        },
        "progress": {
          "status": "completed",
          "progressPercentage": 100,
          "timeSpent": 28,
          "score": 92,
          "maxScore": 100,
          "pointsEarned": 150
        }
      }
    ],
    "statistics": {
      "total": 8,
      "completed": 6,
      "inProgress": 2,
      "notStarted": 0,
      "averageProgress": 91,
      "totalTimeSpent": 245,
      "averageScore": 87,
      "totalPoints": 1250
    }
  }
}
```

#### Database Operations

1. **Authorization Check**: Verify user access permissions
2. **Games Query**: `Content.find({ contentType: 'game' })` with filtering
3. **Progress Integration**: Join game content with user progress records
4. **Points Calculation**: Sum total points earned across all games
5. **Performance Analytics**: Calculate average scores and completion rates

---

### 5. Get Module Progress Statistics

**Endpoint**: `GET /api/progress/stats/:moduleId`
**Authentication**: Required (Bearer Token)
**Authorization**: Admin access required for detailed statistics

#### Purpose

Provides comprehensive analytics for a specific module, including user engagement metrics, completion rates by content type, and performance statistics.

#### Parameters

- **Path Parameters**:
  - `moduleId` (required): Module ID (MongoDB ObjectId)

#### Response Structure

```json
{
  "success": true,
  "message": "Module progress statistics retrieved successfully",
  "data": {
    "module": {
      "id": "module_id",
      "title": "Web Security Fundamentals",
      "description": "Comprehensive web security training"
    },
    "overview": {
      "totalUsers": 45,
      "totalContent": 20,
      "totalProgress": 900
    },
    "progressByStatus": {
      "completed": 650,
      "inProgress": 180,
      "notStarted": 70
    },
    "completionRates": {
      "video": 85.5,
      "lab": 72.3,
      "game": 91.2,
      "document": 88.7
    },
    "averageTimeSpent": {
      "video": 12.5,
      "lab": 45.8,
      "game": 25.3,
      "document": 8.2
    },
    "userProgressSummary": [
      {
        "user": {
          "id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "completionPercentage": 85,
        "completedContent": 17,
        "totalTimeSpent": 520,
        "enrollment": {
          "enrolledAt": "2024-01-10T09:00:00Z",
          "status": "active"
        }
      }
    ]
  }
}
```

#### Database Operations

1. **Module Validation**: Verify module exists
2. **Enrollment Query**: `UserEnrollment.find({ moduleId })` to get enrolled users
3. **Content Analysis**: `Content.find({ moduleId, isActive: true })` for content breakdown
4. **Progress Aggregation**: Complex aggregation pipeline for statistics
5. **Performance Calculation**: Average completion rates by content type
6. **User Summary**: Individual user progress within the module

#### Business Logic

- **Completion Rate Calculation**: `(completed / total) * 100` per content type
- **Average Time Calculation**: Mean time spent per content type
- **User Ranking**: Sort users by completion percentage
- **Engagement Metrics**: Track user interaction patterns

---

### 6. Update Content Progress

**Endpoint**: `POST /api/progress`
**Authentication**: Required (Bearer Token)
**Validation**: Input validation middleware

#### Purpose

Updates or creates progress records as users interact with content, tracking incremental progress, time spent, and performance scores.

#### Request Body

```json
{
  "contentId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "progressPercentage": 75,
  "timeSpent": 15,
  "score": 85,
  "maxScore": 100
}
```

#### Validation Rules

- `contentId`: Required, valid MongoDB ObjectId
- `progressPercentage`: Required, number between 0-100
- `timeSpent`: Optional, positive number (minutes)
- `score`: Optional, positive number
- `maxScore`: Optional, positive number (must be >= score)

#### Response Structure

```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "id": "progress_id",
    "userId": "user_id",
    "contentId": "content_id",
    "contentType": "lab",
    "status": "in-progress",
    "progressPercentage": 75,
    "timeSpent": 15,
    "score": 85,
    "maxScore": 100,
    "startedAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:15:00Z"
  }
}
```

#### Database Operations

1. **Content Validation**: `Content.findById(contentId)` to verify content exists
2. **Enrollment Check**: Verify user is enrolled in content's module
3. **Progress Upsert**: `UserProgress.findOneAndUpdate()` with upsert option
4. **Status Calculation**: Auto-set status based on progress percentage
5. **Timestamp Management**: Update `startedAt` on first interaction
6. **Enrollment Update**: Update module-level progress percentage

#### Business Logic

- **Status Auto-Assignment**:
  - `progressPercentage === 0`: 'not-started'
  - `progressPercentage > 0 && < 100`: 'in-progress'
  - `progressPercentage === 100`: 'completed'
- **Time Accumulation**: Add new `timeSpent` to existing total
- **Score Tracking**: Maintain highest score achieved
- **Module Progress**: Recalculate overall module completion percentage

---

### 7. Mark Content as Completed

**Endpoint**: `PUT /api/progress/:id/complete`
**Authentication**: Required (Bearer Token)
**Authorization**: Users can only update their own progress

#### Purpose

Explicitly marks content as completed, setting progress to 100%, recording completion timestamp, and optionally updating final scores.

#### Parameters

- **Path Parameters**:
  - `id` (required): Progress record ID (MongoDB ObjectId)

#### Request Body (Optional)

```json
{
  "score": 95
}
```

#### Response Structure

```json
{
  "success": true,
  "message": "Content marked as completed successfully",
  "data": {
    "id": "progress_id",
    "userId": "user_id",
    "contentId": "content_id",
    "status": "completed",
    "progressPercentage": 100,
    "completedAt": "2024-01-15T11:00:00Z",
    "score": 95,
    "timeSpent": 60
  }
}
```

#### Database Operations

1. **Progress Lookup**: `UserProgress.findById(id)` with ownership verification
2. **Authorization Check**: Ensure progress belongs to authenticated user
3. **Completion Update**: Set status, progressPercentage, completedAt, and optional score
4. **Module Progress Update**: Recalculate module-level completion
5. **Achievement Check**: Trigger achievement unlocking if applicable

#### Business Logic

- **Completion Validation**: Only allow completion if content was started
- **Timestamp Recording**: Set `completedAt` to current time
- **Score Finalization**: Update final score if provided
- **Module Impact**: Update overall module progress percentage
- **Achievement Triggers**: Check for completion-based achievements

## Advanced Features

### Progress Analytics

The system provides sophisticated analytics capabilities:

1. **Time-based Analysis**: Track learning velocity and engagement patterns
2. **Performance Metrics**: Score distributions and improvement tracking
3. **Content Effectiveness**: Identify difficult content based on completion rates
4. **User Segmentation**: Group users by progress patterns and performance
5. **Predictive Insights**: Identify users at risk of not completing modules

### Integration Points

#### Enrollment System Integration

- Progress updates automatically sync with enrollment progress percentages
- Module completion triggers enrollment status updates
- Prerequisites validation based on progress records

#### Achievement System Integration

- Progress milestones trigger achievement unlocking
- Score thresholds activate performance-based achievements
- Completion streaks and consistency rewards

#### Email Notification Integration

- Progress milestone notifications
- Module completion congratulations
- Encouragement for stalled progress

### Performance Optimization

#### Database Optimizations

- Compound indexes for efficient user-content queries
- Aggregation pipelines for statistical calculations
- Read replicas for analytics queries
- Connection pooling for high concurrency

#### Caching Strategy

- Redis caching for frequently accessed progress data
- Module statistics caching with TTL
- User progress summaries cached after updates

#### Rate Limiting

- Progress update endpoints limited to prevent spam
- Analytics endpoints have higher limits for dashboards
- User-specific rate limiting for progress queries

## Security Considerations

### Authorization Model

- **User Isolation**: Users can only access their own progress data
- **Admin Access**: Administrators can view all progress for analytics
- **Module Instructors**: Can view progress for their assigned modules
- **Read-only Access**: Some endpoints provide read-only progress views

### Data Protection

- Progress data is considered sensitive educational records
- GDPR compliance for user data deletion
- Audit logging for progress modifications
- Input sanitization for all progress updates

### Privacy Controls

- Anonymous analytics options for research purposes
- Opt-out mechanisms for detailed tracking
- Data retention policies for inactive users
- Progress data export for user portability

## Error Handling

### Common Error Patterns

1. **Invalid ObjectId Format**: Return 400 with clear message
2. **Unauthorized Access**: Return 403 with specific permissions needed
3. **Content Not Found**: Return 404 for non-existent content
4. **Enrollment Required**: Return 403 when user not enrolled in module
5. **Validation Errors**: Return 400 with field-specific error messages

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description",
  "statusCode": 400,
  "details": {
    "field": "contentId",
    "message": "Content ID is required and must be a valid ObjectId"
  }
}
```

## Testing Strategy

### Unit Tests

- Controller function testing with mocked dependencies
- Database query testing with test database
- Validation logic testing with edge cases
- Authorization testing with different user roles

### Integration Tests

- End-to-end API testing with real database
- Cross-system integration with enrollment and achievements
- Performance testing under load
- Data consistency testing across updates

### Test Data

- Comprehensive test fixtures for different progress scenarios
- Mock users with varied progress patterns
- Test modules with different content types
- Performance benchmarking datasets

## Monitoring and Analytics

### Key Metrics

- **Progress Update Rate**: Number of progress updates per minute/hour
- **Completion Velocity**: Average time to complete different content types
- **User Engagement**: Daily/weekly active learners
- **Content Effectiveness**: Completion rates by content item
- **Performance Distribution**: Score distributions across user base

### Alerting

- Unusual progress patterns (potential cheating)
- High error rates on progress updates
- Database performance degradation
- User engagement drops below thresholds

## Future Enhancements

### Planned Features

1. **AI-Powered Insights**: Machine learning for personalized learning paths
2. **Advanced Analytics**: Predictive models for completion likelihood
3. **Social Features**: Progress sharing and peer comparisons
4. **Mobile Optimization**: Offline progress sync capabilities
5. **Gamification Extensions**: More sophisticated scoring and rewards

### Technical Improvements

1. **Real-time Updates**: WebSocket-based live progress updates
2. **Microservices Migration**: Separate progress service for scalability
3. **Event Sourcing**: Immutable progress event log
4. **Advanced Caching**: Multi-level caching strategy
5. **API Versioning**: Support for multiple API versions

The Progress System serves as the analytical backbone of the cybersecurity learning platform, providing detailed insights into user engagement, learning effectiveness, and educational outcomes while maintaining strict security and privacy controls.
