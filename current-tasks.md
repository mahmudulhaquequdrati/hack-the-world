# Current Tasks - API Optimization & Enrollment Flow

### ⚠️ **MANDATORY IMPLEMENTATION RULE**

**Before making any changes or updates:**

1. **Check existing APIs/functions** currently being used in the codebase
2. **Update/enhance existing code** rather than creating new implementations
3. **Avoid creating garbage code** by ensuring old functionality is properly updated or deprecated
4. **Document what is being replaced** and ensure backward compatibility where needed

## Overview

This document tracks the current tasks for optimizing API calls and improving the enrollment flow across multiple pages. Tasks are organized by priority and dependencies to ensure efficient development workflow.

## Task Status Legend

- 🟣 **Backlog** - Not started, waiting for dependencies
- 🟡 **Ready** - Ready to start, no blocking dependencies
- 🟠 **In Progress** - Currently being worked on
- 🟢 **Completed** - Task completed and tested
- 🔴 **Blocked** - Cannot proceed due to external dependency

## Priority Levels

- **P0 Critical** - Core functionality, blocking other work
- **P1 High** - Important features, impacts user experience
- **P2 Medium** - Standard improvements, quality of life
- **P3 Low** - Nice to have, future enhancements

---

## 📋 Task List

| ID   | Task                                                     | Priority    | Status       | Assignee | Dependencies | Due Date | Notes                                        |
| ---- | -------------------------------------------------------- | ----------- | ------------ | -------- | ------------ | -------- | -------------------------------------------- |
| T001 | **Server: Optimize with-phases API response**            | P0 Critical | 🟢 Completed | -        | -            | -        | Reduce module data fields in phases endpoint |
| T002 | **Server: Create optimized module overview API**         | P1 High     | 🟢 Completed | -        | T001         | -        | Endpoint already exists and working          |
| T003 | **Server: Implement content length in module API**       | P1 High     | 🟡 Ready     | -        | T001         | -        | Add content count to module responses        |
| T004 | **Server: Create first-content-only API endpoint**       | P1 High     | 🟣 Backlog   | -        | T003         | -        | Fetch only first content for initial load    |
| T005 | **Server: Optimize grouped content API response**        | P1 High     | 🟣 Backlog   | -        | T003         | -        | Minimal fields for content list              |
| T006 | **Server: Implement next/prev content ID logic**         | P1 High     | 🟣 Backlog   | -        | T005         | -        | Navigation between content items             |
| T007 | **Server: Add progress validation to content/start**     | P0 Critical | 🟣 Backlog   | -        | T006         | -        | Check existing progress before starting      |
| T008 | **Frontend: Update overview page API integration**       | P1 High     | 🟡 Ready     | -        | T001         | -        | Consume optimized with-phases endpoint       |
| T009 | **Frontend: Implement course details page optimization** | P1 High     | 🟣 Backlog   | -        | T002, T008   | -        | Module retrieval + enrollment fetch          |
| T010 | **Frontend: Add curriculum API integration**             | P2 Medium   | 🟣 Backlog   | -        | T002, T009   | -        | Click handlers for labs/games                |
| T011 | **Frontend: Optimize enroll page initial load**          | P1 High     | 🟣 Backlog   | -        | T004, T008   | -        | First content only on page load              |
| T012 | **Frontend: Implement lazy content list loading**        | P1 High     | 🟣 Backlog   | -        | T005, T011   | -        | Load full content list on demand             |
| T013 | **Frontend: Add next/prev navigation logic**             | P1 High     | 🟣 Backlog   | -        | T006, T012   | -        | Content navigation with validation           |
| T014 | **Frontend: Implement progress checking**                | P0 Critical | 🟣 Backlog   | -        | T007, T013   | -        | Validate before calling content/start        |
| T017 | **Frontend: Display content completion status on load**  | P0 Critical | 🟣 Backlog   | -        | T014         | -        | Check completion status and show in UI       |
| T015 | **Testing: API optimization validation**                 | P2 Medium   | 🟣 Backlog   | -        | T001-T007    | -        | Verify server-side optimizations             |
| T016 | **Testing: Frontend integration testing**                | P2 Medium   | 🟣 Backlog   | -        | T008-T014    | -        | End-to-end user flow testing                 |

---

## 🎯 Sprint Planning

### **Sprint 1: Server-Side Optimizations (Est. 5-7 days)**

**Focus**: Core API optimizations and new endpoints

**Ready to Start:**

- T001: Optimize with-phases API response

**Sequential Dependencies:**

1. T001 → T002, T003
2. T003 → T004, T005
3. T005 → T006
4. T006 → T007

### **Sprint 2: Frontend Integration (Est. 5-7 days)**

**Focus**: Frontend consuming optimized APIs

**Sequential Dependencies:**

1. T008 (depends on T001)
2. T009 (depends on T002, T008)
3. T010 (depends on T002, T009)
4. T011 (depends on T004, T008)
5. T012 (depends on T005, T011)
6. T013 (depends on T006, T012)
7. T014 (depends on T007, T013)
8. T017 (depends on T014)

### **Sprint 3: Testing & Validation (Est. 2-3 days)**

**Focus**: Comprehensive testing and bug fixes

1. T015 (depends on server tasks T001-T007)
2. T016 (depends on frontend tasks T008-T014, T017)

---

## 📊 Progress Tracking

### Completion Metrics

- **Total Tasks**: 17
- **Completed**: 2 (11.76%)
- **In Progress**: 0 (0%)
- **Ready**: 2 (11.76%)
- **Blocked/Backlog**: 13 (76.47%)

### Risk Assessment

- **High Risk**: T007 (Progress validation logic complexity)
- **Medium Risk**: T006 (Next/prev navigation edge cases)
- **Low Risk**: All other tasks

---

## 🔧 Technical Implementation Details

### ⚠️ **MANDATORY IMPLEMENTATION RULE**

**Before making any changes or updates:**

1. **Check existing APIs/functions** currently being used in the codebase
2. **Update/enhance existing code** rather than creating new implementations
3. **Avoid creating garbage code** by ensuring old functionality is properly updated or deprecated
4. **Document what is being replaced** and ensure backward compatibility where needed

### **T001: Optimize with-phases API response** ✅ COMPLETED

**Current**: Returns full module data
**Target**: Return only `color, content, description, difficulty, icon, id, phaseId, title, topics`
**Impact**: Reduces payload size for overview page

**✅ Implementation Completed:**

- Modified `getModulesWithPhases` function in `/server/src/controllers/moduleController.js`
- Added `.select()` clause to fetch only optimized fields: `'color content description difficulty icon phaseId title topics order'`
- Replaced `Module.getGroupedByPhase()` with direct query and manual grouping for better control
- All existing tests pass, confirming backward compatibility
- API response now returns only the specified minimal fields, reducing payload size significantly

### **T002: Create optimized module overview API** ✅ COMPLETED

**✅ Implementation Already Exists:**

- **Endpoint**: `GET /api/content/module-overview/{moduleId}` - ✅ Already implemented
- **Controller**: `getModuleOverview` function in `contentController.js` - ✅ Already implemented
- **Route**: Set up in `content.js` routes - ✅ Already implemented
- **Model Method**: `Content.getByModuleForOverview()` - ✅ Already implemented

**Current Implementation Analysis:**

- The API endpoint `/api/content/module-overview/{moduleId}` already exists and works
- Returns content grouped by sections with minimal fields: `title, description, type, section`
- Used for curriculum/labs/games clicks on course details pages
- Route is correctly set up without authentication requirement for public access

**What Was Already Done:**

1. ✅ Created `getModuleOverview` function in contentController.js
2. ✅ Set up route `/module-overview/:moduleId` in content routes
3. ✅ Implemented `Content.getByModuleForOverview()` method
4. ✅ API returns content grouped by sections for module overview

**Current Usage Pattern:**

- Call `/modules/{moduleId}` for module details (title, description, etc.)
- Call `/api/content/module-overview/{moduleId}` for curriculum/labs/games content sections

### **T003: Implement content length in module API**

**Enhancement**: Add `contentLength` field from content object
**Usage**: Enroll page module retrieval
**Fields**: `title, description, id, contentLength`

### **T004: Create first-content-only API endpoint**

**Purpose**: Initial enroll page load optimization
**Behavior**: Fetch only first content item
**Performance**: Reduces initial load time

### **T005: Optimize grouped content API response**

**Current**: Returns all content details
**Target**: Return only `sectionTitle, contentType, contentTitle, duration`
**Trigger**: Content list expansion

### **T006: Implement next/prev content ID logic**

**Features**:

- Next content ID in response
- Previous content ID in response
- Navigation validation
- Disabled state management

### **T007: Add progress validation to content/start**

**Logic**: Check if content is `in progress` or `completed`
**Behavior**: Skip API call if already started
**Optimization**: Reduces unnecessary API calls

### **T017: Display content completion status on load**

**Purpose**: Show accurate content status when loading any content
**Logic**:

- Check content progress status when content is loaded
- Display "completed" state in UI if content is already completed
- Prevent calling `/progress/content/start` for completed content
  **UI Impact**: Visual indication of completion status
  **Optimization**: Avoid unnecessary API calls for completed content

---

## 🚀 Getting Started

### Prerequisites

- Server and frontend development environments set up
- Access to API documentation
- Test data for module `6847f8bad749cc077fbdbd2a`

### Quick Start

**✅ T001 Completed** - Server-side with-phases optimization done!

**✅ T002 DISCOVERED COMPLETED - Next Ready Tasks:**

1. **✅ T002 Completed**: Module overview API endpoint already exists and working
2. **Pick up T003**: Implement content length in module API
3. **Pick up T008**: Update frontend overview page to consume optimized API

**Updated Sequence:**

- **T003** (NEXT): Add content length to module API responses
- **T008**: Update frontend to use optimized with-phases endpoint
- This will unlock T004, T005, T009 for the next iteration

**Key Discovery:**
The `/api/content/module-overview/{moduleId}` endpoint already exists and is fully functional. This saves development time and allows us to proceed directly to T003.

---

## 📝 Notes & Considerations

- **Testing URLs**:

  - Overview: `/overview`
  - Course Details: `/course/6847f8bad749cc077fbdbd2a`
  - Enroll: `/learn/6847f8bad749cc077fbdbd2a`

- **Key APIs**:

  - `GET /api/modules/with-phases` ✅ Optimized
  - `GET /api/modules/{id}`
  - `GET /api/content/module-overview/{id}`
  - `GET /api/content/module/{id}/grouped`
  - `POST /api/progress/content/start`

- **Performance Goals**:
  - Reduce initial page load time by 40%
  - Minimize unnecessary API calls
  - Improve content navigation responsiveness

---

_Last Updated: 2024-12-19_
_Next Review: After Sprint 1 completion_
