# 📚 Content System API Documentation

**Generated**: January 27, 2025
**System**: Hack The World Backend API
**Base URL**: `/api/content`

---

## 🎯 Overview

The Content System manages the core educational materials within the cybersecurity learning platform. Content items are the actual learning resources (videos, labs, games, documents) that belong to modules and provide hands-on learning experiences for users.

### 🔑 Key Features

- **Multi-Type Content** - Supports videos, labs, games, and documents
- **Module Integration** - Content belongs to specific learning modules
- **Flexible Filtering** - Filter by type, module, or custom criteria
- **Admin Management** - Complete CRUD operations for content management
- **User Access** - Content delivery for enrolled users
- **Metadata Support** - Rich metadata for enhanced learning experiences

---

## 📋 Available Routes

### 1. **Get All Content**

- **Route**: `GET /api/content`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Retrieve content with filtering and pagination options

#### Query Parameters

```javascript
{
  "type": "video",                           // Optional: Filter by content type
  "moduleId": "64a1b2c3d4e5f6789012346",     // Optional: Filter by module ObjectId
  "limit": 10,                               // Optional: Items per page (default: 10)
  "page": 1                                  // Optional: Page number (default: 1)
}
```

#### How getAllContent() Works

**Step-by-Step Process:**

1. **Parameter Extraction**

   ```javascript
   const { type, moduleId, limit = 10, page = 1 } = req.query;
   ```

2. **Query Building**

   ```javascript
   let query = { isActive: true };

   if (type) {
     // Validate content type
     if (!["video", "lab", "game", "document"].includes(type)) {
       return next(new ErrorResponse("Invalid content type", 400));
     }
     query.type = type;
   }

   if (moduleId) {
     if (!mongoose.Types.ObjectId.isValid(moduleId)) {
       return next(new ErrorResponse("Invalid module ID format", 400));
     }
     query.moduleId = moduleId;
   }
   ```

3. **Database Query**
   ```javascript
   const content = await Content.find(query)
     .populate("module", "title")
     .sort({ moduleId: 1, section: 1, createdAt: 1 });
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Content retrieved successfully",
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012347",
      "moduleId": "64a1b2c3d4e5f6789012346",
      "type": "video",
      "title": "Introduction to Cybersecurity",
      "description": "Learn the fundamentals of cybersecurity principles",
      "url": "https://example.com/videos/intro-cybersec.mp4",
      "order": 1,
      "duration": 15,
      "metadata": {
        "difficulty": "beginner",
        "tags": ["intro", "fundamentals"],
        "transcript": "Available"
      },
      "isActive": true,
      "module": {
        "id": "64a1b2c3d4e5f6789012346",
        "title": "Cybersecurity Fundamentals"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Database Operations

- **Filtering**: Builds dynamic query based on parameters
- **Population**: Loads related module data
- **Sorting**: Orders by module, section, and creation date
- **Index Used**: isActive, type, moduleId indexes

---

### 2. **Get Content by ID**

- **Route**: `GET /api/content/:id`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Retrieve detailed information for specific content

#### Parameters

- **Path Parameters**: `id` (required) - MongoDB ObjectId of the content

#### How getContentById() Works

**Step-by-Step Process:**

1. **Input Validation**

   ```javascript
   if (!mongoose.Types.ObjectId.isValid(id)) {
     return next(new ErrorResponse("Invalid content ID format", 400));
   }
   ```

2. **Database Query**

   ```javascript
   const content = await Content.findById(id)
     .where({ isActive: true })
     .populate("module", "title");
   ```

3. **Existence Check**
   ```javascript
   if (!content) {
     return next(new ErrorResponse("Content not found", 404));
   }
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Content retrieved successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012347",
    "moduleId": "64a1b2c3d4e5f6789012346",
    "type": "lab",
    "title": "SQL Injection Laboratory",
    "description": "Hands-on lab for learning SQL injection techniques",
    "instructions": "Complete the following SQL injection challenges and document your findings...",
    "order": 3,
    "duration": 45,
    "metadata": {
      "difficulty": "intermediate",
      "tools": ["sqlmap", "burp suite"],
      "objectives": [
        "Identify SQL injection vulnerabilities",
        "Exploit SQL injection to extract data",
        "Learn prevention techniques"
      ],
      "environment": "Isolated lab environment",
      "prerequisites": ["basic-sql-knowledge"]
    },
    "isActive": true,
    "module": {
      "id": "64a1b2c3d4e5f6789012346",
      "title": "Web Application Security"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:20:00.000Z"
  }
}
```

---

### 3. **Get Content by Module**

- **Route**: `GET /api/content/module/:moduleId`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Retrieve all content for a specific module

#### Parameters

- **Path Parameters**: `moduleId` (required) - MongoDB ObjectId of the module

#### How getContentByModule() Works

**Step-by-Step Process:**

1. **Module ID Validation**

   ```javascript
   if (!mongoose.Types.ObjectId.isValid(moduleId)) {
     return next(new ErrorResponse("Invalid module ID format", 400));
   }
   ```

2. **Content Query**
   ```javascript
   const content = await Content.getByModule(moduleId);
   ```
   - Uses static method for optimized query
   - Returns content sorted by order within module

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Content for module retrieved successfully",
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012347",
      "type": "video",
      "title": "Introduction Video",
      "order": 1,
      "duration": 15
    },
    {
      "id": "64a1b2c3d4e5f6789012348",
      "type": "lab",
      "title": "Hands-on Lab",
      "order": 2,
      "duration": 45
    },
    {
      "id": "64a1b2c3d4e5f6789012349",
      "type": "game",
      "title": "Security Challenge",
      "order": 3,
      "duration": 30
    }
  ],
  "count": 3
}
```

---

### 4. **Get Content by Module (Grouped)**

- **Route**: `GET /api/content/module/:moduleId/grouped`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Retrieve module content grouped by sections

#### How getContentByModuleGrouped() Works

**Step-by-Step Process:**

1. **Validation**: Validates moduleId format
2. **Grouped Query**: Uses Content.getByModuleGrouped() static method
3. **Section Organization**: Returns content organized by section names

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Grouped content for module retrieved successfully",
  "data": {
    "Introduction": [
      {
        "id": "64a1b2c3d4e5f6789012347",
        "type": "video",
        "title": "Welcome to Cybersecurity",
        "duration": 10
      }
    ],
    "Fundamentals": [
      {
        "id": "64a1b2c3d4e5f6789012348",
        "type": "video",
        "title": "Security Principles",
        "duration": 20
      },
      {
        "id": "64a1b2c3d4e5f6789012349",
        "type": "lab",
        "title": "Basic Security Lab",
        "duration": 30
      }
    ],
    "Advanced Topics": [
      {
        "id": "64a1b2c3d4e5f6789012350",
        "type": "game",
        "title": "Security Challenge",
        "duration": 25
      }
    ]
  }
}
```

---

### 5. **Get Content by Type**

- **Route**: `GET /api/content/type/:type`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Retrieve all content of a specific type

#### Parameters

- **Path Parameters**: `type` (required) - Content type (video|lab|game|document)
- **Query Parameters**: `moduleId` (optional) - Filter by module

#### How getContentByType() Works

**Step-by-Step Process:**

1. **Type Validation**

   ```javascript
   if (!["video", "lab", "game", "document"].includes(type)) {
     return next(new ErrorResponse("Invalid content type", 400));
   }
   ```

2. **Module ID Validation** (if provided)

   ```javascript
   let validatedModuleId = null;
   if (moduleId) {
     if (!mongoose.Types.ObjectId.isValid(moduleId)) {
       return next(new ErrorResponse("Invalid module ID format", 400));
     }
     validatedModuleId = moduleId;
   }
   ```

3. **Content Query**
   ```javascript
   const content = await Content.getByType(type, validatedModuleId);
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "video content retrieved successfully",
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012347",
      "title": "Cybersecurity Fundamentals",
      "type": "video",
      "url": "https://example.com/video1.mp4",
      "duration": 15,
      "moduleId": "64a1b2c3d4e5f6789012346"
    },
    {
      "id": "64a1b2c3d4e5f6789012348",
      "title": "Network Security Basics",
      "type": "video",
      "url": "https://example.com/video2.mp4",
      "duration": 20,
      "moduleId": "64a1b2c3d4e5f6789012346"
    }
  ],
  "count": 2
}
```

---

### 6. **Get Sections by Module**

- **Route**: `GET /api/content/sections/by-module/:moduleId`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Retrieve distinct section names for a module

#### How getSectionsByModule() Works

**Step-by-Step Process:**

1. **Module Validation**

   ```javascript
   if (!mongoose.Types.ObjectId.isValid(moduleId)) {
     return next(new ErrorResponse("Invalid module ID format", 400));
   }

   const Module = require("../models/Module");
   const module = await Module.findById(moduleId);
   if (!module) {
     return next(new ErrorResponse("Module not found", 404));
   }
   ```

2. **Sections Query**
   ```javascript
   const sections = await Content.getSectionsByModule(moduleId);
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Sections for module retrieved successfully",
  "data": [
    "Introduction",
    "Fundamentals",
    "Hands-on Practice",
    "Advanced Topics",
    "Assessment"
  ],
  "count": 5
}
```

---

### 7. **Create New Content** (Admin Only)

- **Route**: `POST /api/content`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Request Format

```javascript
{
  "id": "advanced-phishing-lab",                    // Required: Unique identifier
  "moduleId": "64a1b2c3d4e5f6789012346",           // Required: Module ObjectId
  "type": "lab",                                   // Required: video|lab|game|document
  "title": "Advanced Phishing Techniques",         // Required: Max 100 chars
  "description": "Learn advanced phishing...",     // Required: Max 500 chars
  "instructions": "Complete the following...",     // Optional: For labs/games
  "url": "https://lab-environment.com/phishing",  // Optional: For videos/external content
  "order": 4,                                     // Required: Order within module
  "duration": 60,                                 // Required: Duration in minutes
  "metadata": {                                   // Optional: Additional data
    "difficulty": "advanced",
    "tools": ["gophish", "social-engineer toolkit"],
    "objectives": [
      "Create convincing phishing emails",
      "Set up phishing infrastructure",
      "Analyze phishing campaign results"
    ],
    "prerequisites": ["basic-phishing-knowledge"],
    "tags": ["phishing", "social engineering", "red team"]
  }
}
```

#### How createContent() Works

**Step-by-Step Process:**

1. **Input Validation**: Express-validator middleware validates all fields

2. **Module Verification**

   ```javascript
   if (!mongoose.Types.ObjectId.isValid(contentData.moduleId)) {
     return next(new ErrorResponse("Invalid module ID format", 400));
   }

   const Module = require("../models/Module");
   const module = await Module.findById(contentData.moduleId);
   if (!module) {
     return next(new ErrorResponse("Module not found", 404));
   }
   ```

3. **Content Creation**

   ```javascript
   const content = await Content.create(contentData);
   ```

4. **Module Update**: May trigger module statistics recalculation

#### Success Response (201)

```javascript
{
  "success": true,
  "message": "Content created successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012351",
    "moduleId": "64a1b2c3d4e5f6789012346",
    "type": "lab",
    "title": "Advanced Phishing Techniques",
    "description": "Learn advanced phishing methodologies",
    "instructions": "Complete the following phishing scenarios...",
    "order": 4,
    "duration": 60,
    "metadata": {
      "difficulty": "advanced",
      "tools": ["gophish", "social-engineer toolkit"]
    },
    "isActive": true,
    "createdAt": "2024-01-27T11:30:00.000Z",
    "updatedAt": "2024-01-27T11:30:00.000Z"
  }
}
```

---

## 🗄️ Database Schema Integration

### Content Model Fields

```javascript
{
  id: ObjectId,                     // MongoDB ObjectId
  id: String,                       // Unique content identifier
  moduleId: ObjectId,               // Reference to Module
  type: String,                     // video|lab|game|document
  title: String,                    // Content title (max 100 chars)
  description: String,              // Content description (max 500 chars)
  url: String,                      // URL for videos/external content
  instructions: String,             // Instructions for labs/games (max 2000 chars)
  order: Number,                    // Order within module (min: 1)
  duration: Number,                 // Duration in minutes (1-300)
  metadata: Object,                 // Additional content-specific data
  isActive: Boolean,                // Content status (default: true)
  createdAt: Date,                  // Auto-generated creation timestamp
  updatedAt: Date                   // Auto-generated update timestamp
}
```

### Key Indexes

```javascript
// Compound index for module-based queries
{ moduleId: 1, order: 1 }

// Individual indexes for filtering
{ type: 1 }              // Content type filtering
{ isActive: 1 }          // Active content filtering
{ moduleId: 1 }          // Module-based queries

// Text index for search functionality
{ title: "text", description: "text" }
```

### Static Methods Used

```javascript
// Get content by module (ordered)
Content.getByModule(moduleId);

// Get content grouped by sections
Content.getByModuleGrouped(moduleId);

// Get content by type with optional module filter
Content.getByType(type, moduleId);

// Get distinct sections for module
Content.getSectionsByModule(moduleId);
```

---

## 🔒 Security Features

### Authentication & Authorization

- **Private Access**: All content operations require authentication
- **User Isolation**: Users can only access content from enrolled modules
- **Admin Controls**: Only admins can create, update, delete content
- **Module Verification**: Ensures content belongs to valid modules

### Input Validation

```javascript
// Content creation validation
body("id").isLength({ min: 1, max: 100 }).withMessage("ID required");
body("moduleId").isMongoId().withMessage("Valid module ID required");
body("type")
  .isIn(["video", "lab", "game", "document"])
  .withMessage("Invalid type");
body("title").isLength({ min: 1, max: 100 }).withMessage("Title required");
body("duration")
  .isInt({ min: 1, max: 300 })
  .withMessage("Duration 1-300 minutes");
```

### Data Integrity

- **Module References**: Validates module existence before content creation
- **Type Consistency**: Ensures type field matches expected values
- **Order Management**: Maintains proper ordering within modules
- **Active Content**: Only returns active content to users

---

## 📊 Model Interactions & Side Effects

### When Creating Content

1. **Module Statistics**: Updates module content statistics and duration
2. **Order Assignment**: Ensures proper ordering within module
3. **Section Organization**: Content organized by section for grouping
4. **Progress Tracking**: New content affects user progress calculations

### When Updating Content

1. **Module Recalculation**: Duration changes affect module statistics
2. **Progress Impact**: Changes may affect user progress records
3. **Cache Invalidation**: Module content caches may need refreshing
4. **Section Reorganization**: Section changes affect grouping

### When Deleting Content

1. **Progress Cleanup**: User progress records may need handling
2. **Module Statistics**: Recalculates module content counts and duration
3. **Order Gaps**: May create gaps in content ordering
4. **Enrollment Impact**: Affects completion percentages for enrolled users

---

## 🎯 Common Use Cases

### Learning Interface

```javascript
// Get module content for learning interface
const getModuleContent = async (moduleId) => {
  const response = await fetch(`/api/content/module/${moduleId}/grouped`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { data } = await response.json();

  // Organize content by sections for UI
  return Object.entries(data).map(([section, content]) => ({
    section,
    items: content.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      duration: item.duration,
      url: item.url || item.instructions,
    })),
  }));
};
```

### Content Filtering

```javascript
// Get all videos across modules
const getAllVideos = async () => {
  const response = await fetch("/api/content/type/video", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
};

// Get labs for specific module
const getModuleLabs = async (moduleId) => {
  const response = await fetch(`/api/content/type/lab?moduleId=${moduleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
};
```

### Admin Content Management

```javascript
// Create new content
const createContent = async (contentData) => {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(contentData),
  });

  return response.json();
};

// Get module sections for organization
const getModuleSections = async (moduleId) => {
  const response = await fetch(`/api/content/sections/by-module/${moduleId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  return response.json();
};
```

---

## 📈 Performance Considerations

### Database Optimization

- **Compound Indexes**: Efficient moduleId+order queries for content ordering
- **Type Indexes**: Fast filtering by content type
- **Population Strategy**: Selective module field population
- **Query Optimization**: Static methods use optimized queries

### Caching Opportunities

- **Module Content**: Cache module content lists with moderate TTL
- **Section Organization**: Cache section-grouped content
- **Type Filtering**: Cache content by type for quick access
- **Search Results**: Cache text search results

### Scalability Features

- **Pagination Ready**: Structure supports pagination implementation
- **Efficient Grouping**: Uses aggregation for section grouping
- **Minimal Joins**: Limited population to essential fields
- **Index Coverage**: All common queries covered by indexes

---

This content system provides comprehensive management of educational materials with flexible organization, efficient querying, and robust security suitable for a scalable cybersecurity learning platform.
