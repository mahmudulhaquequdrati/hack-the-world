# Progress Tracking System Documentation

## Overview

The progress tracking system manages user progress through educational content with automatic progress cascading from content level to module level to overall progress. The system supports different completion methods for different content types and provides comprehensive progress analytics.

## Progress Hierarchy

```
Content Progress → Module Progress → Overall Progress
```

1. **Content Level**: Individual items (videos, labs, games, documents)
2. **Module Level**: Calculated as `(completed_content / total_content) * 100`
3. **Overall Level**: Average completion percentage across all enrolled modules

## Content Completion Methods

### Videos

- **Auto-completion**: Automatically marked as completed when 90% watched
- **Manual**: "Mark as Complete" button available

### Labs & Games

- **Score submission**: Complete with score when submitted
- **Manual**: "Mark as Complete" button available

### Documents

- **Manual only**: "Mark as Complete" button

### Auto-Start Behavior

- **All content types**: Automatically marked as "in-progress" when first accessed/loaded
- Triggered when fetching content data for display

## API Endpoints

### 1. Mark Content as Started

**POST** `/api/progress/content/start`

Automatically marks content as "in-progress" when accessed/loaded.

**Request Body:**

```json
{
  "contentId": "60d5f483f8d2e123456789ab"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Content started successfully",
  "data": {
    "id": "60d5f483f8d2e123456789cd",
    "userId": "60d5f483f8d2e123456789ef",
    "contentId": {
      "id": "60d5f483f8d2e123456789ab",
      "title": "Introduction to JavaScript",
      "type": "video",
      "section": "Basics"
    },
    "status": "in-progress",
    "progressPercentage": 1,
    "startedAt": "2023-06-15T10:30:00.000Z",
    "completedAt": null,
    "score": null,
    "maxScore": null
  }
}
```

### 2. Mark Content as Completed

**POST** `/api/progress/content/complete`

Manually mark content as completed or submit lab/game completion with scores.

**Request Body:**

```json
{
  "contentId": "60d5f483f8d2e123456789ab",
  "score": 85, // Optional: for labs/games
  "maxScore": 100 // Optional: for labs/games
}
```

**Response:**

```json
{
  "success": true,
  "message": "Content marked as completed successfully",
  "data": {
    "id": "60d5f483f8d2e123456789cd",
    "userId": "60d5f483f8d2e123456789ef",
    "contentId": {
      "id": "60d5f483f8d2e123456789ab",
      "title": "JavaScript Lab 1",
      "type": "lab",
      "section": "Basics"
    },
    "status": "completed",
    "progressPercentage": 100,
    "startedAt": "2023-06-15T10:30:00.000Z",
    "completedAt": "2023-06-15T11:45:00.000Z",
    "score": 85,
    "maxScore": 100
  }
}
```

### 3. Update Content Progress

**POST** `/api/progress/content/update`

Update progress percentage (primarily for videos - auto-completes at 90%).

**Request Body:**

```json
{
  "contentId": "60d5f483f8d2e123456789ab",
  "progressPercentage": 75
}
```

**Response:**

```json
{
  "success": true,
  "message": "Content progress updated successfully",
  "data": {
    "id": "60d5f483f8d2e123456789cd",
    "userId": "60d5f483f8d2e123456789ef",
    "contentId": {
      "id": "60d5f483f8d2e123456789ab",
      "title": "Advanced JavaScript Concepts",
      "type": "video",
      "section": "Advanced"
    },
    "status": "in-progress",
    "progressPercentage": 75,
    "startedAt": "2023-06-15T10:30:00.000Z",
    "completedAt": null,
    "score": null,
    "maxScore": null
  }
}
```

### 4. Get Overall Progress

**GET** `/api/progress/overview/:userId`

Get user's progress across all enrolled modules (for dashboard).

**Response:**

```json
{
  "success": true,
  "message": "User overall progress retrieved successfully",
  "data": {
    "overallStats": {
      "totalModules": 3,
      "completedModules": 1,
      "inProgressModules": 2,
      "overallCompletionPercentage": 67
    },
    "moduleProgress": [
      {
        "module": {
          "id": "60d5f483f8d2e123456789gh",
          "title": "JavaScript Fundamentals",
          "description": "Learn the basics of JavaScript",
          "difficulty": "beginner",
          "phase": "foundation"
        },
        "enrollment": {
          "status": "completed",
          "enrolledAt": "2023-06-01T00:00:00.000Z",
          "progressPercentage": 100
        },
        "content": {
          "total": 10,
          "completed": 10,
          "inProgress": 0,
          "notStarted": 0
        }
      }
    ],
    "contentStats": {
      "totalContent": 45,
      "completedContent": 23,
      "inProgressContent": 8,
      "contentByType": {
        "video": { "total": 20, "completed": 15 },
        "lab": { "total": 15, "completed": 5 },
        "game": { "total": 8, "completed": 3 },
        "document": { "total": 2, "completed": 0 }
      }
    }
  }
}
```

### 5. Get Module Progress

**GET** `/api/progress/module/:userId/:moduleId`

Get detailed progress for a specific module.

**Response:**

```json
{
  "success": true,
  "message": "Module progress retrieved successfully",
  "data": {
    "module": {
      "id": "60d5f483f8d2e123456789gh",
      "title": "JavaScript Fundamentals",
      "description": "Learn the basics of JavaScript",
      "difficulty": "beginner",
      "phase": "foundation"
    },
    "enrollment": {
      "status": "active",
      "enrolledAt": "2023-06-01T00:00:00.000Z",
      "progressPercentage": 45
    },
    "content": [
      {
        "id": "60d5f483f8d2e123456789ij",
        "title": "Variables and Data Types",
        "type": "video",
        "section": "Basics",
        "duration": 15,
        "progress": {
          "status": "completed",
          "progressPercentage": 100,
          "score": null,
          "maxScore": null,
          "startedAt": "2023-06-15T10:00:00.000Z",
          "completedAt": "2023-06-15T10:15:00.000Z"
        }
      }
    ],
    "statistics": {
      "totalContent": 10,
      "completedContent": 4,
      "inProgressContent": 2,
      "notStartedContent": 4,
      "completionPercentage": 45,
      "contentByType": {
        "video": { "total": 4, "completed": 3 },
        "lab": { "total": 4, "completed": 1 },
        "game": { "total": 2, "completed": 0 },
        "document": { "total": 0, "completed": 0 }
      }
    }
  }
}
```

### 6. Get Content Type Progress

**GET** `/api/progress/content/:userId/:contentType`

Get progress for specific content type (labs, games, videos, documents).

**Query Parameters:**

- `moduleId` (optional): Filter by specific module
- `status` (optional): Filter by status (not-started, in-progress, completed)

**Response:**

```json
{
  "success": true,
  "message": "User lab progress retrieved successfully",
  "data": {
    "content": [
      {
        "id": "60d5f483f8d2e123456789kl",
        "title": "JavaScript Variables Lab",
        "description": "Practice working with variables",
        "section": "Basics",
        "duration": 30,
        "module": {
          "id": "60d5f483f8d2e123456789gh",
          "title": "JavaScript Fundamentals",
          "difficulty": "beginner",
          "phase": "foundation"
        },
        "progress": {
          "id": "60d5f483f8d2e123456789mn",
          "status": "completed",
          "progressPercentage": 100,
          "startedAt": "2023-06-15T11:00:00.000Z",
          "completedAt": "2023-06-15T11:30:00.000Z",
          "score": 92,
          "maxScore": 100
        }
      }
    ],
    "statistics": {
      "total": 8,
      "completed": 3,
      "inProgress": 2,
      "notStarted": 3,
      "averageProgress": 45
    },
    "modules": [
      {
        "module": {
          "id": "60d5f483f8d2e123456789gh",
          "title": "JavaScript Fundamentals"
        },
        "enrollment": {
          "status": "active",
          "enrolledAt": "2023-06-01T00:00:00.000Z"
        },
        "content": [],
        "statistics": {
          "total": 4,
          "completed": 2,
          "inProgress": 1,
          "notStarted": 1
        }
      }
    ]
  }
}
```

## Frontend Integration

### Auto-Start Content

Call this whenever content is first loaded/accessed:

```javascript
// When loading any content (video player, lab, game, document)
const startContent = async (contentId) => {
  try {
    const response = await fetch("/api/progress/content/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contentId }),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Content started:", result.data);
      // Update UI to show "in-progress" status
    }
  } catch (error) {
    console.error("Failed to start content:", error);
  }
};

// Example: Video player component
useEffect(() => {
  if (contentId) {
    startContent(contentId);
  }
}, [contentId]);
```

### Video Progress Tracking

```javascript
// Update progress every 10% or on specific events
const updateVideoProgress = async (contentId, progressPercentage) => {
  try {
    const response = await fetch("/api/progress/content/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contentId,
        progressPercentage,
      }),
    });

    const result = await response.json();
    if (result.success) {
      // Auto-completed at 90% for videos
      if (result.data.status === "completed") {
        showCompletionNotification();
        updateModuleProgress();
      }
    }
  } catch (error) {
    console.error("Failed to update progress:", error);
  }
};

// Video player event handlers
const handleTimeUpdate = (currentTime, duration) => {
  const progressPercentage = Math.floor((currentTime / duration) * 100);

  // Update every 10% milestone
  if (progressPercentage % 10 === 0 && progressPercentage !== lastReported) {
    updateVideoProgress(contentId, progressPercentage);
    lastReported = progressPercentage;
  }
};
```

### Manual Completion

```javascript
// Mark as Complete button
const markAsComplete = async (contentId, score = null, maxScore = null) => {
  try {
    const response = await fetch("/api/progress/content/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contentId,
        ...(score !== null && { score }),
        ...(maxScore !== null && { maxScore }),
      }),
    });

    const result = await response.json();
    if (result.success) {
      showCompletionNotification();
      updateModuleProgress();
      // Update UI to show completed status
    }
  } catch (error) {
    console.error("Failed to mark as complete:", error);
  }
};

// Lab/Game submission
const submitLabResult = async (contentId, score, maxScore) => {
  // First submit the lab result to lab system
  // Then mark as complete with score
  await markAsComplete(contentId, score, maxScore);
};
```

### Dashboard Progress Display

```javascript
// Fetch overall progress for dashboard
const fetchOverallProgress = async (userId) => {
  try {
    const response = await fetch(`/api/progress/overview/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      displayDashboardStats(result.data);
    }
  } catch (error) {
    console.error("Failed to fetch progress:", error);
  }
};

const displayDashboardStats = (data) => {
  const { overallStats, moduleProgress, contentStats } = data;

  // Display overall completion percentage
  document.getElementById("overall-progress").textContent =
    `${overallStats.overallCompletionPercentage}% Complete`;

  // Display module progress cards
  moduleProgress.forEach((module) => {
    renderModuleCard(module);
  });

  // Display content type progress
  Object.entries(contentStats.contentByType).forEach(([type, stats]) => {
    renderContentTypeStats(type, stats);
  });
};
```

### Module View Progress

```javascript
// Fetch module-specific progress
const fetchModuleProgress = async (userId, moduleId) => {
  try {
    const response = await fetch(`/api/progress/module/${userId}/${moduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      displayModuleProgress(result.data);
    }
  } catch (error) {
    console.error("Failed to fetch module progress:", error);
  }
};

const displayModuleProgress = (data) => {
  const { module, enrollment, content, statistics } = data;

  // Display module completion percentage
  document.getElementById("module-progress").textContent =
    `${enrollment.progressPercentage}% Complete`;

  // Display content list with progress indicators
  content.forEach((item) => {
    renderContentItem(item);
  });
};
```

### Labs/Games Progress View

```javascript
// Fetch labs or games progress
const fetchContentTypeProgress = async (userId, contentType, filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(
      `/api/progress/content/${userId}/${contentType}?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (result.success) {
      displayContentTypeProgress(result.data, contentType);
    }
  } catch (error) {
    console.error(`Failed to fetch ${contentType} progress:`, error);
  }
};

// Filter labs by status
const filterLabs = (status) => {
  fetchContentTypeProgress(userId, "lab", { status });
};

// Filter by module
const filterByModule = (moduleId) => {
  fetchContentTypeProgress(userId, "lab", { moduleId });
};
```

## Progress Status Flow

```
not-started → in-progress → completed
     ↑            ↑             ↑
   Initial    Auto on first   Manual or
   state      access/load    Auto at 90%
```

## Best Practices

1. **Auto-start on Load**: Always call the start endpoint when content is first accessed
2. **Batch Updates**: For videos, update progress at reasonable intervals (every 10%)
3. **Error Handling**: Always handle API errors gracefully
4. **UI Feedback**: Provide immediate visual feedback for user actions
5. **Progress Persistence**: Progress is automatically saved and persists across sessions
6. **Module Completion**: Modules auto-complete when all content is finished

## Common Use Cases

### Video Watching Flow

1. User clicks on video → Auto-start endpoint called
2. Video plays → Progress updates every 10%
3. Video reaches 90% → Auto-completion triggered
4. Module progress updated automatically

### Lab Completion Flow

1. User starts lab → Auto-start endpoint called
2. User works on lab (progress stays "in-progress")
3. User submits lab → Mark complete with score
4. Module progress updated automatically

### Manual Completion Flow

1. User views content → Auto-start endpoint called
2. User reads/completes content
3. User clicks "Mark as Complete" → Complete endpoint called
4. Module progress updated automatically

This system provides comprehensive progress tracking with automatic cascading updates and supports multiple completion methods for different content types.
