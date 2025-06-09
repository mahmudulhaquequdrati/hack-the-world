# 🧩 Module System API Documentation

**Generated**: January 27, 2025
**System**: Hack The World Backend API
**Base URL**: `/api/modules`

---

## 🎯 Overview

The Module System manages cybersecurity learning modules within the platform's hierarchical structure. Modules are educational units that belong to phases and contain content like videos, labs, games, and documents. This system provides comprehensive CRUD operations, ordering management, and integration with the enrollment and progress tracking systems.

### 🔑 Key Features

- **Hierarchical Organization** - Modules belong to phases in a structured learning path
- **Content Management** - Modules contain various types of educational content
- **Order Management** - Sophisticated ordering system within phases
- **Phase Integration** - Full integration with the phase management system
- **Admin Controls** - Complete administrative functionality for module management
- **Public Access** - Read operations available for course discovery
- **Validation** - Comprehensive input validation and data integrity checks

---

## 📋 Available Routes

### 1. **Get All Modules**

- **Route**: `GET /api/modules`
- **Access**: Public
- **Authentication**: None required
- **Purpose**: Retrieve modules with flexible filtering and grouping options

#### Query Parameters

```javascript
{
  "phase": "64a1b2c3d4e5f6789012346",    // Optional: Filter by phase ObjectId
  "grouped": "true"                      // Optional: Return modules grouped by phase
}
```

#### How It Works

1. **Parameter Processing**: Extracts query parameters for filtering
2. **Conditional Logic**: Routes to different static methods based on parameters
3. **Data Retrieval**: Uses Module model static methods for optimized queries
4. **Response Formatting**: Returns structured data with counts

#### Success Response (200)

```javascript
// Standard list response
{
  "success": true,
  "message": "Modules retrieved successfully",
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012346",
      "title": "Cybersecurity Fundamentals",
      "description": "Learn the basics of cybersecurity principles",
      "phaseId": "64a1b2c3d4e5f6789012345",
      "difficulty": "beginner",
      "duration": "4 hours",
      "icon": "Shield",
      "color": "#3B82F6",
      "order": 1,
      "topics": ["Security Basics", "Threat Models"],
      "isActive": true,
      "phase": {
        "id": "64a1b2c3d4e5f6789012345",
        "title": "Foundation Phase",
        "description": "Basic cybersecurity concepts"
      }
    }
  ],
  "count": 1
}

// Grouped response (when grouped=true)
{
  "success": true,
  "message": "Modules retrieved successfully",
  "data": {
    "64a1b2c3d4e5f6789012345": {
      "phaseId": "64a1b2c3d4e5f6789012345",
      "phaseTitle": "Foundation Phase",
      "modules": [ /* module objects */ ]
    }
  },
  "count": 1
}
```

#### Database Operations

- **Conditional Queries**: Uses different static methods based on parameters
- **Population**: Automatically populates phase information
- **Sorting**: Returns modules sorted by phase and order
- **Indexes Used**: phaseId index for filtering, compound phaseId+order for sorting

#### Use Cases

- **Course Discovery**: Frontend displays all available modules
- **Phase Filtering**: Show modules for specific learning phases
- **Grouped Display**: Organize modules by phase for course overview pages

---

### 2. **Get Modules with Phases**

- **Route**: `GET /api/modules/with-phases`
- **Access**: Public
- **Authentication**: None required
- **Purpose**: Specialized endpoint for course pages requiring phase-module hierarchy

#### How It Works

1. **Phase Retrieval**: Gets all phases ordered by sequence
2. **Module Grouping**: Uses Module.getGroupedByPhase() static method
3. **Data Combination**: Merges phases with their associated modules
4. **Hierarchical Structure**: Returns nested phase-module structure

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Phases with modules retrieved successfully",
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012345",
      "title": "Foundation Phase",
      "description": "Basic cybersecurity concepts",
      "icon": "Lightbulb",
      "color": "#10B981",
      "order": 1,
      "modules": [
        {
          "id": "64a1b2c3d4e5f6789012346",
          "title": "Cybersecurity Fundamentals",
          "description": "Learn the basics",
          "difficulty": "beginner",
          "duration": "4 hours",
          "order": 1
        }
      ]
    }
  ]
}
```

#### Database Operations

- **Two-Stage Query**: Phases query followed by grouped modules query
- **Efficient Aggregation**: Uses optimized static methods
- **Memory Optimization**: Combines results in application layer

#### Use Cases

- **Course Overview Pages**: Display complete learning path structure
- **Navigation Menus**: Generate hierarchical course navigation
- **Progress Visualization**: Show user progress across phases and modules

---

### 3. **Get Single Module**

- **Route**: `GET /api/modules/:id`
- **Access**: Public
- **Authentication**: None required
- **Purpose**: Retrieve detailed information for a specific module

#### Parameters

- **Path Parameters**: `id` (required) - MongoDB ObjectId of the module

#### How It Works

1. **Input Validation**: Validates ObjectId format using mongoose.Types.ObjectId.isValid()
2. **Database Query**: Module.findById() with phase population
3. **Existence Check**: Returns 404 if module not found
4. **Response**: Returns complete module with phase details

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Module retrieved successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012346",
    "title": "Network Security Fundamentals",
    "description": "Comprehensive network security training",
    "phaseId": "64a1b2c3d4e5f6789012345",
    "difficulty": "intermediate",
    "duration": "6 hours",
    "icon": "Network",
    "color": "#8B5CF6",
    "order": 2,
    "topics": [
      "Network Protocols",
      "Firewalls",
      "VPNs",
      "Network Monitoring"
    ],
    "prerequisites": ["64a1b2c3d4e5f6789012346"],
    "learningOutcomes": [
      "Understand network security principles",
      "Configure basic firewall rules",
      "Implement network monitoring"
    ],
    "isActive": true,
    "phase": {
      "id": "64a1b2c3d4e5f6789012345",
      "title": "Intermediate Phase",
      "description": "Advanced cybersecurity concepts"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:20:00.000Z"
  }
}
```

#### Error Responses

- **400**: Invalid ObjectId format
- **404**: Module not found
- **500**: Server error

#### Database Operations

- **Query**: Module.findById() with population
- **Population**: Loads related phase data
- **Index Used**: Primary key (id) index

#### Use Cases

- **Module Detail Pages**: Display comprehensive module information
- **Enrollment Checks**: Verify module exists before enrollment
- **Content Loading**: Get module context for content display

---

### 4. **Create New Module**

- **Route**: `POST /api/modules`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Request Format

```javascript
{
  "phaseId": "64a1b2c3d4e5f6789012345",           // Required: Valid phase ObjectId
  "title": "Advanced Penetration Testing",         // Required: Max 100 chars
  "description": "Learn advanced pen testing...",  // Required: Max 500 chars
  "icon": "Target",                                // Required: Max 50 chars
  "duration": "8 hours",                          // Required: Max 50 chars
  "difficulty": "advanced",                       // Required: beginner|intermediate|advanced|expert
  "color": "#EF4444",                            // Required: Hex color
  "order": 1,                                    // Required: Positive integer
  "topics": [                                    // Optional: Array of strings
    "Advanced Exploitation",
    "Post-Exploitation",
    "Report Writing"
  ],
  "prerequisites": [                             // Optional: Array of module ObjectIds
    "64a1b2c3d4e5f6789012346"
  ],
  "learningOutcomes": [                          // Optional: Array of strings
    "Perform advanced penetration testing",
    "Write professional security reports"
  ],
  "content": {                                   // Optional: Content organization
    "videos": [],
    "labs": [],
    "games": [],
    "documents": []
  }
}
```

#### How It Works

1. **Input Validation**: Express-validator middleware checks all required fields
2. **Phase Verification**: Checks if specified phase exists
3. **Order Uniqueness**: Prevents duplicate order values within same phase
4. **Module Creation**: Creates new Module document with all provided data
5. **Population**: Enriches response with phase information
6. **Response**: Returns created module with complete details

#### Success Response (201)

```javascript
{
  "success": true,
  "message": "Module created successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012347",
    "phaseId": "64a1b2c3d4e5f6789012345",
    "title": "Advanced Penetration Testing",
    "description": "Learn advanced pen testing techniques",
    "icon": "Target",
    "duration": "8 hours",
    "difficulty": "advanced",
    "color": "#EF4444",
    "order": 1,
    "topics": ["Advanced Exploitation", "Post-Exploitation"],
    "prerequisites": ["64a1b2c3d4e5f6789012346"],
    "learningOutcomes": ["Perform advanced testing"],
    "isActive": true,
    "phase": {
      "id": "64a1b2c3d4e5f6789012345",
      "title": "Advanced Phase",
      "description": "Expert-level cybersecurity"
    },
    "createdAt": "2024-01-27T10:30:00.000Z",
    "updatedAt": "2024-01-27T10:30:00.000Z"
  }
}
```

#### Error Responses

- **400**: Invalid phaseId, duplicate order, validation errors
- **401**: Missing or invalid authentication token
- **403**: Insufficient permissions (non-admin)
- **500**: Server error during creation

#### Database Operations

- **Validation Queries**: Phase.findById() to verify phase exists
- **Uniqueness Check**: Module.findOne() to check order uniqueness
- **Creation**: Module.create() with full validation
- **Population**: Automatic phase data loading

#### Security Features

- **Admin Only**: Requires admin role for module creation
- **Input Validation**: Comprehensive field validation
- **Data Integrity**: Ensures phase exists and order is unique

---

### 5. **Update Module**

- **Route**: `PUT /api/modules/:id`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Parameters

- **Path Parameters**: `id` (required) - MongoDB ObjectId of module to update

#### Request Format (All fields optional)

```javascript
{
  "title": "Updated Module Title",
  "description": "Updated description",
  "phaseId": "64a1b2c3d4e5f6789012348",  // New phase assignment
  "difficulty": "expert",
  "duration": "10 hours",
  "icon": "Shield",
  "color": "#10B981",
  "order": 3,                           // New order within phase
  "topics": ["Updated Topic 1", "Updated Topic 2"],
  "prerequisites": ["64a1b2c3d4e5f6789012349"],
  "learningOutcomes": ["Updated outcome"],
  "isActive": false
}
```

#### How It Works

1. **Validation**: Validates module ObjectId format
2. **Existence Check**: Ensures module exists
3. **Phase Validation**: If phaseId updated, validates new phase exists
4. **Order Management**: Auto-assigns order if moving to new phase
5. **Uniqueness Check**: Prevents duplicate orders within phases
6. **Update Application**: Applies all provided updates to module
7. **Save & Populate**: Saves changes and loads phase information

#### Advanced Order Management

```javascript
// If changing phaseId without order, auto-assigns next available order
if (updates.phaseId && updates.phaseId !== module.phaseId.toString()) {
  if (!updates.order) {
    const maxOrderInTargetPhase = await Module.findOne({
      phaseId: updates.phaseId,
    }).sort({ order: -1 });

    updates.order = maxOrderInTargetPhase ? maxOrderInTargetPhase.order + 1 : 1;
  }
}

// Validates order uniqueness within target phase
if (updates.order && updates.order !== module.order) {
  const phaseId = updates.phaseId || module.phaseId;
  const orderExists = await Module.findOne({
    phaseId,
    order: updates.order,
    _id: { $ne: id },
  });
  if (orderExists) {
    throw new Error(`Order ${updates.order} already taken`);
  }
}
```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Module updated successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012347",
    "title": "Updated Module Title",
    "description": "Updated description",
    "phaseId": "64a1b2c3d4e5f6789012348",
    "difficulty": "expert",
    "duration": "10 hours",
    "order": 3,
    "phase": {
      "id": "64a1b2c3d4e5f6789012348",
      "title": "Expert Phase"
    },
    "updatedAt": "2024-01-27T11:45:00.000Z"
  }
}
```

#### Error Responses

- **400**: Invalid ObjectId, duplicate order, phase not found
- **401**: Missing authentication
- **403**: Insufficient permissions
- **404**: Module not found
- **500**: Server error

#### Database Operations

- **Complex Logic**: Multiple validation queries before update
- **Conditional Updates**: Only updates provided fields
- **Order Management**: Sophisticated order assignment logic
- **Transaction-like Behavior**: Ensures data consistency

---

### 6. **Delete Module**

- **Route**: `DELETE /api/modules/:id`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Parameters

- **Path Parameters**: `id` (required) - MongoDB ObjectId of module to delete

#### How It Works

1. **Validation**: Validates ObjectId format
2. **Existence Check**: Ensures module exists
3. **Hard Delete**: Permanently removes module from database
4. **Response**: Confirms successful deletion

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Module deleted successfully",
  "data": {}
}
```

#### Error Responses

- **400**: Invalid ObjectId format
- **401**: Missing authentication
- **403**: Insufficient permissions
- **404**: Module not found
- **500**: Server error

#### Database Operations

- **Query**: Module.findById() for existence check
- **Deletion**: Module.findByIdAndDelete() for permanent removal
- **Cascading Effects**: May affect enrollments and progress (handled by application logic)

#### Security Considerations

- **Admin Only**: Requires admin privileges
- **Permanent Action**: No soft delete, data is permanently removed
- **Impact Assessment**: Should check for active enrollments before deletion

---

### 7. **Get Modules by Phase**

- **Route**: `GET /api/modules/phase/:phaseId`
- **Access**: Public
- **Authentication**: None required
- **Purpose**: Retrieve all modules for a specific phase

#### Parameters

- **Path Parameters**: `phaseId` (required) - MongoDB ObjectId of the phase

#### How It Works

1. **Validation**: Validates phaseId ObjectId format
2. **Phase Verification**: Ensures phase exists
3. **Module Query**: Uses Module.getByPhase() static method
4. **Sorting**: Returns modules ordered by their order field
5. **Response**: Returns modules array with count

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Modules for phase '64a1b2c3d4e5f6789012345' retrieved successfully",
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012346",
      "title": "Cybersecurity Fundamentals",
      "description": "Learn the basics",
      "difficulty": "beginner",
      "duration": "4 hours",
      "order": 1,
      "isActive": true
    },
    {
      "id": "64a1b2c3d4e5f6789012347",
      "title": "Network Security",
      "description": "Network protection",
      "difficulty": "intermediate",
      "duration": "6 hours",
      "order": 2,
      "isActive": true
    }
  ],
  "count": 2
}
```

#### Error Responses

- **400**: Invalid phaseId format
- **404**: Phase not found
- **500**: Server error

#### Database Operations

- **Phase Check**: Phase.findById() to verify existence
- **Module Query**: Module.find({ phaseId }).sort({ order: 1 })
- **Indexes Used**: phaseId index for filtering, order for sorting

#### Use Cases

- **Phase Detail Pages**: Show all modules in a specific learning phase
- **Course Navigation**: Generate phase-specific module lists
- **Progress Tracking**: Display user progress within a phase

---

### 8. **Reorder Modules within Phase**

- **Route**: `PUT /api/modules/phase/:phaseId/reorder`
- **Access**: Private
- **Authentication**: Bearer token required
- **Authorization**: Admin role required

#### Parameters

- **Path Parameters**: `phaseId` (required) - MongoDB ObjectId of the phase

#### Request Format

```javascript
{
  "moduleOrders": [
    { "moduleId": "64a1b2c3d4e5f6789012346", "order": 1 },
    { "moduleId": "64a1b2c3d4e5f6789012347", "order": 2 },
    { "moduleId": "64a1b2c3d4e5f6789012348", "order": 3 }
  ]
}
```

#### How It Works

1. **Phase Validation**: Validates phaseId and ensures phase exists
2. **Module Validation**: Validates all moduleIds in the request
3. **Ownership Verification**: Ensures all modules belong to the specified phase
4. **Batch Update**: Updates all module orders in parallel using Promise.all()
5. **Response**: Returns all updated modules with new orders

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Module order updated successfully",
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012346",
      "title": "Cybersecurity Fundamentals",
      "order": 1,
      "phaseId": "64a1b2c3d4e5f6789012345"
    },
    {
      "id": "64a1b2c3d4e5f6789012347",
      "title": "Network Security",
      "order": 2,
      "phaseId": "64a1b2c3d4e5f6789012345"
    }
  ]
}
```

#### Error Responses

- **400**: Invalid ObjectIds, modules don't belong to phase
- **401**: Missing authentication
- **403**: Insufficient permissions
- **404**: Phase or modules not found
- **500**: Server error

#### Database Operations

- **Multiple Validations**: Phase existence and module ownership checks
- **Batch Updates**: Parallel updates using Promise.all()
- **Atomic Operations**: Each module update is atomic
- **Index Usage**: Compound phaseId+moduleId queries

#### Use Cases

- **Admin Interface**: Drag-and-drop module reordering
- **Course Management**: Adjust learning sequence
- **Content Organization**: Optimize learning flow

---

## 🗄️ Database Schema Integration

### Module Model Fields

```javascript
{
  phaseId: ObjectId,                   // Reference to Phase
  title: String,                       // Module title (max 100 chars)
  description: String,                 // Module description (max 500 chars)
  icon: String,                        // Icon name for frontend
  duration: String,                    // Auto-calculated duration
  difficulty: String,                  // beginner|intermediate|advanced|expert
  color: String,                       // Hex color for frontend
  path: String,                        // Auto-generated course path
  enrollPath: String,                  // Auto-generated enrollment path
  order: Number,                       // Order within phase (min: 1)
  topics: [String],                    // Learning topics covered
  prerequisites: [ObjectId],           // Required prior modules
  learningOutcomes: [String],          // Expected learning outcomes
  content: Object,                     // Content arrays and stats
  contentStats: Object,                // Auto-calculated statistics
  isActive: Boolean                    // Module status (default: true)
}
```

### Key Indexes

```javascript
// Compound unique index - prevents duplicate orders within phases
{ phaseId: 1, order: 1 } (unique: true)

// Individual indexes for queries
{ phaseId: 1 }        // Phase-based module queries
{ difficulty: 1 }     // Difficulty filtering
{ isActive: 1 }       // Active module filtering
{ order: 1 }          // Ordering queries
```

### Static Methods Used

```javascript
// Get all modules with phase population
Module.getAllWithPhases();

// Get modules grouped by phase
Module.getGroupedByPhase();

// Get modules for specific phase
Module.getByPhase(phaseId);
```

---

## 🔒 Security Features

### Authentication & Authorization

- **Public Read Access**: Module information available for course discovery
- **Admin Write Access**: Only admins can create, update, delete modules
- **JWT Validation**: All write operations require valid authentication
- **Role Verification**: Admin role checked via middleware

### Data Validation

```javascript
// ObjectId validation
param("id").isMongoId().withMessage("Valid module ID required");

// Phase existence validation
const phase = await Phase.findById(phaseId);
if (!phase) throw new ErrorResponse("Phase not found", 404);

// Order uniqueness validation
const existingOrder = await Module.findOne({ phaseId, order });
if (existingOrder) throw new ErrorResponse("Order already taken", 400);
```

### Input Sanitization

- **Field Length Limits**: All string fields have maximum length validation
- **Enum Validation**: Difficulty field restricted to valid values
- **Color Format**: Hex color validation for frontend consistency
- **Array Validation**: Prerequisites validated as ObjectId arrays

---

## 📊 Model Interactions & Side Effects

### When Creating Module

1. **Phase Validation**: Ensures parent phase exists and is valid
2. **Order Assignment**: Validates order uniqueness within phase
3. **Path Generation**: Auto-generates course and enrollment paths
4. **Content Initialization**: Sets up empty content arrays and statistics
5. **Audit Logging**: Records module creation for admin tracking

### When Updating Module

1. **Phase Migration**: If phaseId changes, auto-assigns order in new phase
2. **Order Management**: Prevents duplicate orders within phases
3. **Path Updates**: Regenerates paths if title or phase changes
4. **Content Recalculation**: Updates content statistics if content modified
5. **Enrollment Impact**: May affect user enrollments and progress

### When Deleting Module

1. **Dependency Check**: Should verify no active enrollments exist
2. **Content Cleanup**: Related content items may need handling
3. **Progress Records**: User progress data may need cleanup
4. **Order Adjustment**: May leave gaps in phase ordering

---

## 🎯 Common Use Cases

### Frontend Course Discovery

```javascript
// Get all modules grouped by phase for course overview
const response = await fetch("/api/modules?grouped=true");
const { data } = await response.json();

// Display hierarchical course structure
Object.values(data).forEach((phase) => {
  console.log(`Phase: ${phase.phaseTitle}`);
  phase.modules.forEach((module) => {
    console.log(`  Module: ${module.title} (${module.difficulty})`);
  });
});
```

### Admin Module Management

```javascript
// Create new module
const newModule = await fetch("/api/modules", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    phaseId: "phase-id",
    title: "Advanced Cryptography",
    description: "Learn advanced encryption techniques",
    difficulty: "expert",
    order: 1,
  }),
});

// Reorder modules within phase
const reorderResponse = await fetch("/api/modules/phase/phase-id/reorder", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    moduleOrders: [
      { moduleId: "module-1", order: 2 },
      { moduleId: "module-2", order: 1 },
    ],
  }),
});
```

### Course Navigation

```javascript
// Get modules for specific phase
const getPhaseModules = async (phaseId) => {
  const response = await fetch(`/api/modules/phase/${phaseId}`);
  const { data } = await response.json();

  return data.map((module) => ({
    id: module.id,
    title: module.title,
    difficulty: module.difficulty,
    duration: module.duration,
    path: `/course/${module.id}`,
  }));
};
```

---

## 📈 Performance Considerations

### Database Optimization

- **Compound Indexes**: Efficient phaseId+order queries for ordering
- **Population Strategy**: Selective field population to minimize data transfer
- **Query Optimization**: Static methods use optimized aggregation pipelines
- **Caching Opportunities**: Module data rarely changes, suitable for caching

### Scalability Features

- **Pagination Ready**: Structure supports pagination implementation
- **Efficient Grouping**: Uses database aggregation for grouping operations
- **Minimal Joins**: Limited population to essential fields only
- **Index Coverage**: All common queries covered by appropriate indexes

### Memory Management

- **Selective Loading**: Only loads required fields in responses
- **Batch Operations**: Reordering uses Promise.all() for parallelization
- **Lean Queries**: Uses lean() for read-only operations where possible

---

## 🧪 Testing Scenarios

### Unit Tests

1. **CRUD Operations**: Create, read, update, delete functionality
2. **Validation Logic**: Input validation and error handling
3. **Order Management**: Unique ordering within phases
4. **Authentication**: Access control and authorization
5. **Error Cases**: Invalid inputs and edge cases

### Integration Tests

1. **Phase Integration**: Module-phase relationship integrity
2. **Enrollment Impact**: Module changes affecting enrollments
3. **Content Relationships**: Module-content associations
4. **Order Consistency**: Phase-wide ordering consistency

### Performance Tests

1. **Large Dataset Queries**: Performance with many modules
2. **Concurrent Updates**: Multiple admin operations
3. **Complex Filtering**: Multi-parameter queries
4. **Batch Operations**: Reordering many modules simultaneously

---

This module system provides a robust foundation for organizing cybersecurity learning content with sophisticated ordering, comprehensive validation, and efficient querying capabilities suitable for a scalable learning platform.
