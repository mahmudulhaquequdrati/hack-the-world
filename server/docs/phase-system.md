# 🎯 Phase System API Documentation

**Generated**: January 27, 2025
**System**: Hack The World Backend API
**Base URL**: `/api/phases`

---

## 🎯 Overview

The Phase System manages the high-level organizational structure of the cybersecurity learning platform. Phases represent major learning stages that contain related modules, providing a clear progression path for learners from beginner to expert levels.

### 🔑 Key Features

- **Learning Progression** - Structured phases guide learners through skill development
- **Visual Organization** - Color-coded phases with icons for easy identification
- **Order Management** - Sequential ordering system for learning path structure
- **Module Container** - Each phase contains multiple related modules
- **Admin Management** - Complete CRUD operations for administrators
- **Public Access** - Phase information available for course discovery

---

## 📋 Available Routes

### 1. **Get All Phases**

- **Route**: `GET /api/phases`
- **Access**: Public
- **Authentication**: None required
- **Purpose**: Retrieve all learning phases in sequential order

#### How getPhases() Works

**Step-by-Step Process:**

1. **Database Query**

   ```javascript
   const phases = await Phase.find({}).sort({ order: 1 });
   ```

   - Retrieves all phases from database
   - Sorts by order field (ascending) for proper sequence
   - No filtering applied - returns all phases

2. **Response Formatting**
   ```javascript
   res.status(200).json({
     success: true,
     message: "Phases retrieved successfully",
     count: phases.length,
     data: phases,
   });
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Phases retrieved successfully",
  "count": 4,
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012345",
      "title": "Foundation Phase",
      "description": "Basic cybersecurity concepts and fundamentals",
      "icon": "Lightbulb",
      "color": "#10B981",
      "order": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "64a1b2c3d4e5f6789012346",
      "title": "Intermediate Phase",
      "description": "Advanced security practices and methodologies",
      "icon": "Shield",
      "color": "#3B82F6",
      "order": 2,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

#### Database Operations

- **Query**: `Phase.find({})` - Simple query for all phases
- **Sorting**: `.sort({ order: 1 })` - Orders by sequence
- **Index Used**: order index for efficient sorting
- **No Joins**: Simple phase data only, no population needed

#### Use Cases

- **Course Overview**: Display complete learning path structure
- **Navigation**: Generate phase-based navigation menus
- **Progress Tracking**: Show user progression across phases

---

### 2. **Get Single Phase**

- **Route**: `GET /api/phases/:id`
- **Access**: Public
- **Authentication**: None required
- **Purpose**: Retrieve detailed information for a specific phase

#### Parameters

- **Path Parameters**: `id` (required) - MongoDB ObjectId of the phase

#### How getPhase() Works

**Step-by-Step Process:**

1. **Input Validation**

   ```javascript
   if (!mongoose.Types.ObjectId.isValid(id)) {
     return next(new ErrorResponse(`Invalid phase ID format`, 400));
   }
   ```

   - Validates ObjectId format before database query
   - Returns 400 error for invalid format

2. **Database Query**

   ```javascript
   const phase = await Phase.findById(id);
   ```

   - Direct lookup by primary key (id)
   - Most efficient query type

3. **Existence Check**
   ```javascript
   if (!phase) {
     return next(new ErrorResponse(`Phase with ID ${id} not found`, 404));
   }
   ```
   - Returns 404 if phase doesn't exist

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Phase retrieved successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012345",
    "title": "Foundation Phase",
    "description": "Introduction to cybersecurity fundamentals including basic concepts, terminology, and core security principles",
    "icon": "Lightbulb",
    "color": "#10B981",
    "order": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses

- **400**: Invalid ObjectId format
- **404**: Phase not found
- **500**: Server error

#### Database Operations

- **Query**: `Phase.findById(id)` - Primary key lookup
- **Index Used**: Primary key (id) index
- **Performance**: O(1) lookup time

---

### 3. **Create New Phase**

- **Route**: `POST /api/phases`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Request Format

```javascript
{
  "title": "Expert Phase",                    // Required: Max 100 chars
  "description": "Advanced cybersecurity...", // Required: Max 500 chars
  "icon": "Trophy",                          // Required: Max 50 chars
  "color": "#EF4444",                        // Required: Hex color format
  "order": 4                                 // Required: Positive integer
}
```

#### How createPhase() Works

**Step-by-Step Process:**

1. **Authentication Check**: Middleware verifies JWT token and admin role

2. **Input Validation**: Express-validator middleware validates all fields

3. **Order Uniqueness Check**

   ```javascript
   const existingOrder = await Phase.findOne({ order });
   if (existingOrder) {
     return next(
       new ErrorResponse(`Phase with order ${order} already exists`, 400)
     );
   }
   ```

   - Prevents duplicate order values
   - Maintains sequential integrity

4. **Phase Creation**
   ```javascript
   const phase = await Phase.create({
     title,
     description,
     icon,
     color,
     order,
   });
   ```
   - Creates new phase with validated data
   - MongoDB generates id and timestamps

#### Success Response (201)

```javascript
{
  "success": true,
  "message": "Phase created successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012349",
    "title": "Expert Phase",
    "description": "Advanced cybersecurity methodologies and expert-level practices",
    "icon": "Trophy",
    "color": "#EF4444",
    "order": 4,
    "createdAt": "2024-01-27T10:30:00.000Z",
    "updatedAt": "2024-01-27T10:30:00.000Z"
  }
}
```

#### Error Responses

- **400**: Validation errors, duplicate order
- **401**: Missing or invalid authentication
- **403**: Insufficient permissions (non-admin)
- **500**: Server error

#### Database Operations

- **Uniqueness Check**: `Phase.findOne({ order })` for order validation
- **Creation**: `Phase.create()` with full validation
- **Index Used**: order index for uniqueness check

---

### 4. **Update Phase**

- **Route**: `PUT /api/phases/:id`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Parameters

- **Path Parameters**: `id` (required) - MongoDB ObjectId of phase to update

#### Request Format (All fields optional)

```javascript
{
  "title": "Updated Foundation Phase",
  "description": "Updated description with new content",
  "icon": "Book",
  "color": "#8B5CF6",
  "order": 2
}
```

#### How updatePhase() Works

**Step-by-Step Process:**

1. **Validation**: Validates phase ObjectId format

2. **Existence Check**

   ```javascript
   let phase = await Phase.findById(id);
   if (!phase) {
     return next(new ErrorResponse(`Phase with ID ${id} not found`, 404));
   }
   ```

3. **Order Conflict Check**

   ```javascript
   if (order && order !== phase.order) {
     const existingOrder = await Phase.findOne({
       order,
       _id: { $ne: id },
     });
     if (existingOrder) {
       return next(
         new ErrorResponse(`Phase with order ${order} already exists`, 400)
       );
     }
   }
   ```

   - Only checks if order is being changed
   - Excludes current phase from duplicate check

4. **Update Execution**
   ```javascript
   phase = await Phase.findByIdAndUpdate(
     id,
     { title, description, icon, color, order },
     { new: true, runValidators: true }
   );
   ```
   - Updates only provided fields
   - Runs schema validation
   - Returns updated document

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Phase updated successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012345",
    "title": "Updated Foundation Phase",
    "description": "Updated description with new learning objectives",
    "icon": "Book",
    "color": "#8B5CF6",
    "order": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-27T11:45:00.000Z"
  }
}
```

#### Error Responses

- **400**: Invalid ObjectId, duplicate order, validation errors
- **401**: Missing authentication
- **403**: Insufficient permissions
- **404**: Phase not found
- **500**: Server error

#### Database Operations

- **Existence Check**: `Phase.findById(id)`
- **Conflict Check**: `Phase.findOne({ order, _id: { $ne: id } })`
- **Update**: `Phase.findByIdAndUpdate()` with validation
- **Index Used**: Primary key and order indexes

---

### 5. **Delete Phase**

- **Route**: `DELETE /api/phases/:id`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Parameters

- **Path Parameters**: `id` (required) - MongoDB ObjectId of phase to delete

#### How deletePhase() Works

**Step-by-Step Process:**

1. **Validation**: Validates ObjectId format

2. **Existence Check**

   ```javascript
   const phase = await Phase.findById(id);
   if (!phase) {
     return next(new ErrorResponse(`Phase with ID ${id} not found`, 404));
   }
   ```

3. **Hard Delete**
   ```javascript
   await Phase.findByIdAndDelete(id);
   ```
   - Permanently removes phase from database
   - No soft delete implementation

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Phase deleted successfully",
  "data": {}
}
```

#### Error Responses

- **400**: Invalid ObjectId format
- **401**: Missing authentication
- **403**: Insufficient permissions
- **404**: Phase not found
- **500**: Server error

#### Database Operations

- **Existence Check**: `Phase.findById(id)`
- **Deletion**: `Phase.findByIdAndDelete(id)`
- **Cascading Effects**: May affect related modules (handled at application level)

#### Important Considerations

- **Dependency Check**: Should verify no modules exist in this phase before deletion
- **Data Integrity**: Deletion may orphan related modules
- **Backup Recommended**: Permanent operation, consider backup strategies

---

## 🗄️ Database Schema Integration

### Phase Model Fields

```javascript
{
  title: String,                    // Phase title (max 100 chars)
  description: String,              // Phase description (max 500 chars)
  icon: String,                     // Icon name for frontend (max 50 chars)
  color: String,                    // Hex color code (#RGB or #RRGGBB)
  order: Number,                    // Sequential order (min: 1, unique)
  createdAt: Date,                  // Auto-generated creation timestamp
  updatedAt: Date                   // Auto-generated update timestamp
}
```

### Key Indexes

```javascript
// Unique index for order field
{ order: 1 } (unique: true)

// Index for title searches
{ title: 1 }

// Primary key index (automatic)
{ id: 1 }
```

### Schema Validation

```javascript
// Title validation
title: {
  type: String,
  required: true,
  maxlength: 100,
  trim: true
}

// Color validation (hex format)
color: {
  type: String,
  required: true,
  match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
}

// Order validation (unique positive integer)
order: {
  type: Number,
  required: true,
  min: 1,
  unique: true
}
```

---

## 🔒 Security Features

### Authentication & Authorization

- **Public Read Access**: Phase information available for course discovery
- **Admin Write Access**: Only admins can create, update, delete phases
- **JWT Validation**: All write operations require valid authentication token
- **Role Verification**: Admin role verified via `requireAdmin` middleware

### Input Validation

```javascript
// Phase creation validation
body("title")
  .isLength({ min: 1, max: 100 })
  .withMessage("Title must be 1-100 characters");

body("color")
  .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  .withMessage("Color must be valid hex format");

body("order").isInt({ min: 1 }).withMessage("Order must be positive integer");
```

### Data Integrity

- **Unique Ordering**: Prevents duplicate order values
- **Reference Validation**: ObjectId format validation
- **Constraint Enforcement**: Database-level unique constraints

---

## 📊 Model Interactions & Side Effects

### When Creating Phase

1. **Order Validation**: Ensures order uniqueness across all phases
2. **Audit Logging**: Records phase creation for administrative tracking
3. **Cache Invalidation**: May invalidate cached phase lists

### When Updating Phase

1. **Order Conflict Resolution**: Prevents duplicate ordering
2. **Module Impact**: Order changes may affect module organization
3. **Frontend Updates**: Color/icon changes affect UI presentation

### When Deleting Phase

1. **Module Dependency**: Should check for modules in this phase
2. **Enrollment Impact**: May affect user enrollments in phase modules
3. **Progress Records**: User progress in phase modules needs handling
4. **Order Gaps**: Creates gaps in phase ordering sequence

---

## 🎯 Common Use Cases

### Frontend Course Navigation

```javascript
// Get all phases for course overview
const getPhases = async () => {
  const response = await fetch("/api/phases");
  const { data } = await response.json();

  return data.map((phase) => ({
    id: phase.id,
    title: phase.title,
    description: phase.description,
    color: phase.color,
    icon: phase.icon,
    order: phase.order,
  }));
};

// Display phases in navigation
phases.forEach((phase) => {
  const phaseElement = createPhaseElement(phase);
  navigationContainer.appendChild(phaseElement);
});
```

### Admin Phase Management

```javascript
// Create new phase
const createPhase = async (phaseData) => {
  const response = await fetch("/api/phases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(phaseData),
  });

  return response.json();
};

// Update phase order
const updatePhaseOrder = async (phaseId, newOrder) => {
  const response = await fetch(`/api/phases/${phaseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ order: newOrder }),
  });

  return response.json();
};
```

### Progress Tracking Integration

```javascript
// Get phases with user progress
const getPhasesWithProgress = async (userId) => {
  const phases = await fetch("/api/phases").then((r) => r.json());

  // Add progress data for each phase
  const phasesWithProgress = await Promise.all(
    phases.data.map(async (phase) => {
      const modules = await fetch(`/api/modules/phase/${phase.id}`).then((r) =>
        r.json()
      );
      const progress = await calculatePhaseProgress(userId, phase.id);

      return {
        ...phase,
        modules: modules.data,
        progress: progress,
      };
    })
  );

  return phasesWithProgress;
};
```

---

## 📈 Performance Considerations

### Database Optimization

- **Simple Queries**: Most operations use primary key or indexed fields
- **No Complex Joins**: Phase data is self-contained
- **Efficient Sorting**: Order index enables fast sequential retrieval
- **Minimal Data Transfer**: Small documents with focused fields

### Caching Opportunities

- **Static Data**: Phase information changes infrequently
- **Redis Caching**: Cache phase lists with reasonable TTL
- **CDN Friendly**: Phase data suitable for edge caching
- **Client Caching**: Long cache headers for phase endpoints

### Scalability Features

- **Lightweight Operations**: Simple CRUD operations scale well
- **Index Coverage**: All common queries covered by indexes
- **Atomic Operations**: Single-document operations are naturally atomic
- **Read Optimization**: Read-heavy workload optimized for performance

---

## 🧪 Testing Scenarios

### Unit Tests

1. **CRUD Operations**: Create, read, update, delete functionality
2. **Validation Logic**: Input validation and error handling
3. **Order Management**: Unique ordering constraints
4. **Authentication**: Access control verification
5. **Error Cases**: Invalid inputs and edge cases

### Integration Tests

1. **Module Relationships**: Phase-module relationship integrity
2. **Order Consistency**: Sequential ordering across operations
3. **Concurrent Updates**: Multiple admin operations
4. **Cascade Effects**: Phase deletion impact on modules

### Performance Tests

1. **Load Testing**: Many concurrent phase requests
2. **Large Datasets**: Performance with many phases
3. **Cache Effectiveness**: Caching impact on response times
4. **Database Performance**: Query execution times

---

This phase system provides a solid foundation for organizing cybersecurity learning content into logical progressions with comprehensive administrative controls and efficient performance characteristics.
