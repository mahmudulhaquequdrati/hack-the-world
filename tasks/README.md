# 📁 Tasks Folder Organization

This folder contains detailed specifications for all project tasks, organized by **SERVER** and **FRONTEND** categories.

## 📋 Folder Structure

```
tasks/
├── README.md              # This file - organization guide
├── _template.md           # Template for creating new tasks
├── completed-tasks.md     # Archive of completed task details
│
## 🛠️ CURRENT: SERVER TASKS (16 tasks)
├── SRV-001.md            # Fix Server Testing Environment
├── SRV-002.md            # Setup Seed Scripts & Utils
│
├── CNT-001.md            # Create ContentSection Model
├── CNT-002.md            # Create Video Model
├── CNT-003.md            # Create Lab Model
├── CNT-004.md            # Create Game Model
├── CNT-005.md            # Create Document Model
├── CNT-006.md            # Create ContentAssets Model
│
├── API-001.md            # Create Video API Endpoints
├── API-002.md            # Create Lab API Endpoints
├── API-003.md            # Create Game API Endpoints
├── API-004.md            # Create Document API Endpoints
│
├── TRK-001.md            # Create UserEnrollment Model
├── TRK-002.md            # Create UserProgress Model
├── TRK-003.md            # Create Enrollment API Endpoints
└── TRK-004.md            # Create Progress Tracking API
│
## 🚧 FUTURE: FRONTEND TASKS (To be created)
└── (Frontend task files will be added here)
```

## 🏷️ Task Naming Convention

### 🛠️ SERVER Tasks (Current)

| Prefix | Type                  | Examples                    |
| ------ | --------------------- | --------------------------- |
| SRV    | Server Infrastructure | Testing, seeding, utilities |
| CNT    | Content Models        | Video, Lab, Game, Document  |
| API    | API Endpoints         | CRUD operations, validation |
| TRK    | Tracking Models/APIs  | Progress, enrollment        |

### 🎨 FRONTEND Tasks (Future)

| Prefix  | Type                 | Examples                       |
| ------- | -------------------- | ------------------------------ |
| FE-CMP  | Frontend Components  | Video player, lab interface    |
| FE-PAGE | Frontend Pages       | Course detail, dashboard       |
| FE-FEAT | Frontend Features    | Terminal, games, AI playground |
| FE-INT  | Frontend Integration | API connections, auth flow     |
| FE-TEST | Frontend Testing     | Component tests, E2E tests     |

## 📊 Task Properties

Each task file includes:

- **Type & Complexity**: Categorization and effort estimation
- **Priority & Status**: Current state and importance
- **Dependencies**: What must be completed first
- **Purpose**: Clear explanation of what and why
- **Requirements**: Specific technical requirements
- **Acceptance Criteria**: Definition of done
- **Testing Requirements**: How to verify completion
- **Implementation Notes**: Technical details and considerations
- **Related Files**: Files that will be created or modified

## 🔄 Task Workflow

### 🛠️ SERVER Task Workflow (Current)

1. **Plan**: Review dependencies and requirements
2. **Implement**: Follow requirements and acceptance criteria
3. **Test**: Complete all testing requirements
4. **Review**: Ensure acceptance criteria are met
5. **Complete**: Update status and move to completed-tasks.md

### 🎨 FRONTEND Task Workflow (Future)

1. **Plan**: Review server API dependencies
2. **Design**: Create component/page designs
3. **Implement**: Build React components with TypeScript
4. **Test**: Component and integration testing
5. **Review**: Ensure UI/UX standards are met
6. **Complete**: Update status and integrate

## 🎯 Using This System

### To Start a SERVER Task:

1. Check dependencies are completed (especially SRV-001, SRV-002)
2. Read the full task specification
3. Update status to "🔄 In Progress"
4. Follow implementation notes and requirements
5. Ensure all server tests pass

### To Create a FRONTEND Task (Future):

1. Ensure required SERVER APIs are completed
2. Copy `_template.md` with FE- prefix
3. Define component/page requirements
4. Specify server API dependencies
5. Add to main task.md frontend tasks table

### To Complete Any Task:

1. Verify all acceptance criteria are met
2. Ensure all tests pass (server or frontend)
3. Update status to "✅ Complete"
4. Move detailed spec to completed-tasks.md
5. Update main task.md table

## 🔗 Main Files

- **[../task.md](../task.md)**: Main task overview and active tasks table
- **[completed-tasks.md](completed-tasks.md)**: Archive of completed tasks
- **[\_template.md](_template.md)**: Template for new tasks

---

**Last Updated**: January 16, 2025
