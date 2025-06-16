# Hack The World - Cybersecurity Learning Platform

## 📁 Project Documentation References

### Complete Technical Documentation

- **[SERVER_COMPLETE_REFERENCE.md](./docs/SERVER_COMPLETE_REFERENCE.md)** - Complete backend API documentation, models, controllers, security, and development patterns
- **[FRONTEND_COMPLETE_REFERENCE.md](./docs/FRONTEND_COMPLETE_REFERENCE.md)** - Complete frontend architecture, components, state management, and optimization patterns
- **[FEATURES_AND_WORKFLOWS.md](./docs/FEATURES_AND_WORKFLOWS.md)** - Detailed feature documentation, workflows, and implementation details
- **[FRONTEND_API_USAGE_COMPLETE_MAPPING.md](./docs/FRONTEND_API_USAGE_COMPLETE_MAPPING.md)** - Comprehensive API usage analysis with usage status and locations
- **[FRONTEND_API_USAGE_COMPLETE_ANALYSIS.md](./docs/FRONTEND_API_USAGE_COMPLETE_ANALYSIS.md)** - Deep API usage analysis with optimization recommendations and data flow patterns
- **[FRONTEND_API_OPTIMIZATION_SENIOR_ANALYSIS.md](./docs/FRONTEND_API_OPTIMIZATION_SENIOR_ANALYSIS.md)** - Senior engineering API optimization with 62% endpoint reduction and performance improvements
- **[DEVELOPMENT_QUICK_REFERENCE.md](./docs/DEVELOPMENT_QUICK_REFERENCE.md)** - Quick development commands, patterns, and debugging guide

----**MENDATORY STARTS** ----

**for every new feature, or change, or bug fix, or refactor, or any other change, update the CLAUDE.md**
**we will be doing all the things in next-hack in nextjs and we will be using the same architecture and same patterns and same codebase**

### 🔄 Documentation Update Protocol

**When making changes to the project:**

1. **Update relevant reference documentation** to reflect changes
2. **Create task logs** documenting decisions, changes, and rationale in the **docs/tasks** directory
3. **Update this CLAUDE.md** with new features or architectural changes
4. **Maintain cross-references** between documentation files
5. **Document breaking changes** and migration steps

### 📋 Development Task Management Protocol

**For every development session:**

1. **Create detailed task list** with clear objectives
2. **Document decision rationale** for technical choices
3. **Track feature additions/changes** with before/after states
4. **Log implementation approaches** and alternatives considered
5. **Update reference docs** to reflect new patterns/APIs
6. **Maintain change history** for future reference

----**MENDATORY ENDS** ----

## Project Overview

**Hack The World** is a comprehensive cybersecurity learning website that combines educational content with hands-on practice through interactive terminals, AI tools, and practical exercises. The platform provides structured learning paths for cybersecurity education with progress tracking and enrollment management.

## Architecture

### Technology Stack

- **Frontend**: React + TypeScript + Vite + RTK Query + TailwindCSS
- **Admin Panel**: React + JavaScript + Vite + Axios
- **Backend**: Node.js + Express.js + MongoDB + Mongoose
- **Authentication**: JWT-based with 7-day expiry
- **Security**: Helmet, CORS, Rate limiting, bcrypt password hashing

### Directory Structure

```
hack-the-world/
├── frontend/           # Main student portal (React + TypeScript)
├── admin/             # Admin management panel (React + JavaScript)
├── server/            # Backend API server (Node.js + Express)
├── docs/tasks/        # Project task documentation
└── docs/              # Project documentation
```

## Database Schema

### Core Models

1. **User**: Student/admin accounts with profiles, stats, security settings
2. **Phase**: High-level learning phases (e.g., "Fundamentals", "Advanced")
3. **Module**: Individual courses within phases with prerequisites and content
4. **Content**: Learning materials (videos, labs, games, documents)
5. **UserEnrollment**: Module enrollment tracking with progress percentages
6. **UserProgress**: Individual content item completion tracking

### Key Relationships

- Phases contain multiple Modules (1:M)
- Modules contain multiple Content items (1:M)
- Users can enroll in Modules (M:M via UserEnrollment)
- Users track progress on Content (M:M via UserProgress)

## API Architecture

### Authentication System

- **JWT-based authentication** with automatic token refresh
- **Role-based access**: `student` and `admin` roles
- **Account security**: Login attempt limits, password complexity requirements
- **Admin approval system** for admin accounts

### Core API Modules

#### 🔐 Authentication (`/api/auth`)

- User registration, login, password reset
- Profile management and avatar updates
- Secure token generation and validation

#### 📚 Content Management (`/api/phases`, `/api/modules`, `/api/content`)

- Hierarchical content organization (Phase → Module → Content)
- Automatic content synchronization and duration calculation
- Support for videos, labs, games, and documents
- Advanced content navigation and grouping

#### 📋 Enrollment System (`/api/enrollments`)

- Module enrollment with prerequisite checking
- Progress tracking at module and content levels
- Enrollment status management (active, paused, completed)
- Admin oversight with enrollment statistics

#### 📊 Progress Tracking (`/api/progress`)

- Granular progress tracking for all content types
- Automatic completion detection (90% for videos, manual for interactive content)
- Comprehensive progress analytics and reporting
- Real-time progress synchronization

#### 🔥 Streak System (`/api/streak`)

- Daily learning streak tracking and maintenance
- Streak status monitoring (active, at_risk, broken, start)
- Leaderboard functionality for competitive learning
- Automatic streak updates on content completion
- Historical streak data (current vs. longest streak)

## Frontend Architecture

### Main Frontend (Student Portal)

- **RTK Query** for API management with automatic caching
- **TypeScript** for type safety and better development experience
- **Modular component architecture** with clear separation of concerns
- **Progressive Web App** features with offline capability planning

### Key Features

- **Learning Dashboard**: Overview of enrolled courses and progress
- **Interactive Content Player**: Video player with progress tracking
- **Lab Environment**: Integrated terminal and AI playground
- **Game System**: Interactive cybersecurity challenges
- **Profile Management**: User settings and progress statistics

### Admin Panel

- **Axios-based API client** with interceptors
- **Comprehensive CRUD operations** for all content types
- **Real-time analytics** and enrollment monitoring
- **Content management workflows** with bulk operations

## Security Implementation

### Authentication Security

- **bcrypt password hashing** with salt rounds
- **JWT token management** with automatic invalidation on password change
- **Account lockout protection** after failed login attempts
- **Password reset tokens** with 10-minute expiry

### API Security

- **Helmet.js** for security headers
- **CORS configuration** for cross-origin protection
- **Rate limiting** (10,000 requests per 15 minutes)
- **Input validation** using express-validator
- **Admin-only endpoints** with role verification

## Progress Tracking System

### Multi-Level Progress Tracking

1. **Content Level**: Individual videos, labs, games, documents
2. **Module Level**: Overall completion percentage within a course
3. **Phase Level**: Progress across related modules
4. **User Level**: Platform-wide statistics and achievements

### Automatic Synchronization

- Content progress automatically updates module enrollment progress
- Module completion triggers phase-level progress updates
- Real-time progress reflection across all frontend interfaces

## Key Features

### Learning Experience

- **Structured Learning Paths**: Phase-based curriculum with clear progression
- **Interactive Labs**: Hands-on cybersecurity practice environments
- **Gamification**: Points, levels, and achievement system
- **AI Integration**: AI-powered learning assistance and explanations
- **Terminal Access**: Live terminal environments for practical exercises

### Content Management

- **Dynamic Content Organization**: Flexible grouping by sections and types
- **Automatic Duration Calculation**: Content duration aggregation at module level
- **Content Navigation**: Previous/next navigation with progress context
- **Multi-format Support**: Videos, documents, interactive labs, games

### Administration

- **Comprehensive Admin Panel**: Full CRUD operations for all content
- **User Management**: Enrollment oversight and progress monitoring
- **Analytics Dashboard**: Detailed statistics and performance metrics
- **Content Workflow**: Structured content creation and management processes

## API Usage Analysis

### Frontend API Efficiency (Updated Analysis)

- **Main Frontend**: 18 of 32 API calls actively used (56% utilization)
- **Admin Frontend**: 45 API calls, 100% utilization rate
- **Backend Coverage**: 80 total endpoints, all serve at least one frontend
- **Smart Architecture**: Unused APIs are mostly optimized replacements or future features

### API Categories

1. **Student APIs**: Authentication, content consumption, progress tracking
2. **Admin APIs**: Content management, user administration, analytics
3. **Shared APIs**: Authentication, basic content retrieval

### API Optimization Patterns

- **Combined Queries**: Using `useGetContentWithModuleAndProgressQuery` instead of multiple separate calls
- **Optimized Endpoints**: `grouped-optimized` versions for better performance
- **Cache-First Architecture**: RTK Query with intelligent invalidation strategies

## Development Workflow

### Code Quality

- **TypeScript** in main frontend for type safety
- **ESLint configuration** for code consistency
- **Component testing** with comprehensive test suites
- **API validation** with express-validator middleware

### Performance Optimization

- **RTK Query caching** for efficient data fetching
- **Optimized content queries** with lean MongoDB operations
- **Pagination support** for large datasets
- **Lazy loading** for content-heavy pages

## Deployment Architecture

### Environment Configuration

- **Environment variables** for API URLs and secrets
- **CORS configuration** for development and production
- **Database connection** with MongoDB Atlas support
- **Static file serving** with Express for production builds

### Monitoring and Logging

- **Morgan logging** for request tracking
- **Error handling middleware** with environment-specific responses
- **Health check endpoints** for monitoring
- **Swagger documentation** for API reference

## Current Status

### Completed Features

- ✅ Full authentication system with security features
- ✅ Complete content management with hierarchical organization
- ✅ Enrollment system with progress tracking
- ✅ Admin panel with comprehensive management tools
- ✅ Progress tracking with multi-level synchronization
- ✅ Interactive content player with navigation
- ✅ Learning streak system with automatic tracking
- ✅ Authentication-aware UI components
- ✅ Comprehensive lab and game detail pages

### Architecture Strengths

- **Clean separation** between student and admin functionality
- **Smart API optimization** with combined queries and intelligent caching
- **Robust security implementation** with multiple protection layers
- **Scalable database design** with proper relationships and indexes
- **Type-safe frontend** with RTK Query for reliable data management
- **Zero dead code** - All backend endpoints serve at least one frontend

### Recent Updates (2025-06-14)

#### 🔥 Learning Streak System

- **Backend**: Added streak tracking fields to User model (currentStreak, longestStreak, lastActivityDate)
- **API**: New `/api/streak` endpoints for status, updates, and leaderboard
- **Frontend**: in dashboard with real-time streak display
- **Integration**: Automatic streak updates when content is completed
- **UI**: Streak status indicators (active, at_risk, broken, start)

#### 🔐 Authentication-Aware UI

- **Overview Page**: Conditional display of progress section for authenticated users
- **API Optimization**: Enrollment queries skip when user not logged in
- **Progressive Enhancement**: Core content accessible to all, features for authenticated users

#### 📚 Enhanced Content Pages

- **Lab Pages**: Full-featured lab environment with step tracking and progress
- **Game Pages**: Interactive gaming interface with scoring and timer
- **Error Handling**: Improved empty state and not-found content messaging
- **Performance**: Optimized API queries and caching strategies

#### 📊 API Usage Analysis (2025-06-14)

**Comprehensive frontend API analysis completed** - detailed in [FRONTEND_API_USAGE_COMPLETE_ANALYSIS.md](./docs/FRONTEND_API_USAGE_COMPLETE_ANALYSIS.md)

**Key Metrics:**

- **Total APIs Available**: 42 endpoints (33 apiSlice + 9 authApi)
- **APIs Actually Used**: 18 endpoints (43% utilization rate)
- **High-Traffic Components**: Dashboard (4 calls), CyberSecOverview (3 calls), CourseDetailPage (3-4 calls)

**Architecture Strengths Identified:**

- ✅ **Smart Authentication-Aware API Calls** - Uses `{ skip: !user }` pattern to prevent unnecessary calls
- ✅ **Optimized Endpoint Usage** - Prefers consolidated endpoints like `useGetPhasesWithModulesQuery`
- ✅ **Conditional Loading** - Only loads data when UI needs it (e.g., tab-based loading)
- ✅ **Excellent Cache Management** - RTK Query with proper invalidation strategies
- ✅ **Centralized Authentication** - Clean separation via `useAuthRTK` hook

**Major Optimization Opportunities:**

1. **Dashboard Consolidation** - Reduce 4 API calls to 1 consolidated endpoint (75% reduction)
2. **Profile Features** - Implement avatar upload and statistics (using existing backend APIs)
3. **Enrollment Management** - Add unenrollment functionality (backend ready)
4. **Streak System** - Activate leaderboard and manual streak features
5. **Achievement Statistics** - Implement detailed achievement tracking UI

**Performance Impact:**

- Current average: 2.2 API calls per page (down from 2.8)
- **COMPLETED**: 62% API endpoint reduction (42 → 16 endpoints)
- **COMPLETED**: CyberSecOverview efficient pattern applied to Dashboard
- **COMPLETED**: Smart conditional loading implemented
- Smart patterns ready for scaling with new features

#### 🛠️ Senior Engineering API Optimization (2025-06-14)

**Major Performance Optimization Completed** - detailed in [FRONTEND_API_OPTIMIZATION_SENIOR_ANALYSIS.md](./docs/FRONTEND_API_OPTIMIZATION_SENIOR_ANALYSIS.md)

**Optimization Results:**

- **API Endpoint Reduction**: 42 → 16 endpoints (62% reduction)
- **Dashboard Optimization**: Applied CyberSecOverview efficient pattern with enrollment mapping
- **CourseDetailPage Enhancement**: Smart conditional loading based on UI state
- **EnrolledCoursePage Validation**: Confirmed already optimal with 2-call pattern

**CyberSecOverview Gold Standard Pattern:**

- ✅ **Comprehensive Backend Queries**: Single call returns all related data
- ✅ **O(1) Lookup Maps**: Efficient client-side enrollment mapping
- ✅ **Authentication-Aware Loading**: Skip unnecessary calls for unauthenticated users
- ✅ **Smart Data Processing**: Client-side transformations for instant UI updates

**Removed Inefficient Endpoints:**

- Basic endpoints replaced by optimized versions (phases, modules, content)
- Unused feature endpoints (unenroll, avatar upload, streak leaderboard)
- Alternative implementations replaced by comprehensive endpoints

**Future Consolidation Opportunities:**

- Dashboard consolidation endpoint: 4 → 1 API calls (75% reduction potential)
- Course detail complete endpoint: 3 → 1 API calls (67% reduction potential)
- Ready for backend consolidation implementation

### Outstanding Issues

- **Profile Statistics Endpoint**: Frontend expects `/api/profile/stats` but backend doesn't implement it
- **Avatar Upload UI**: Backend supports avatar updates but frontend UI not implemented
- **Unenrollment Feature**: Backend supports unenrollment but frontend UI missing

### Development Guidelines for Future Work

#### When Adding New Features:

1. **Create task list** in TodoWrite with specific objectives
2. **Document architectural decisions** and alternatives considered
3. **Update reference documentation** to reflect new patterns
4. **Test API changes** against both frontend and admin panels
5. **Update this CLAUDE.md** with new capabilities

#### When Modifying APIs:

1. **Check FRONTEND_API_OPTIMIZATION_SENIOR_ANALYSIS.md** for current optimized patterns and consolidation opportunities
2. **Follow CyberSecOverview gold standard pattern** for new API designs
3. **Use comprehensive endpoints** instead of multiple basic calls
4. **Apply authentication-aware loading** with `{ skip: !user }` patterns
5. **Implement O(1) lookup maps** for efficient client-side data processing
6. **Update both frontend and backend reference docs**
7. **Test all affected components** and validate performance improvements

#### When Changing UI Components:

1. **Update FRONTEND_COMPLETE_REFERENCE.md** component descriptions
2. **Document new patterns** in DEVELOPMENT_QUICK_REFERENCE.md
3. **Update component usage examples** and best practices

This platform provides a solid foundation for cybersecurity education with professional-grade architecture, comprehensive feature set, and security-first design principles.

---

## 🚀 NEXT.JS 15+ MIGRATION PROJECT (2025-06-16)

### Migration Status: PLANNING COMPLETE - AWAITING APPROVAL

**Last Updated**: 2025-06-16
**Current Phase**: Pre-Development Planning
**Next Action**: User approval required to proceed with development

### 📋 Current Task Status

#### Completed Tasks ✅

- **nextjs-migration-research**: Research and plan complete migration from React+Vite to Next.js 15+ ✅
- **document-current-architecture**: Document current frontend and admin panel architecture for migration reference ✅
- **create-migration-plan**: Create detailed migration plan with phases and timelines ✅
- **setup-project-tracking**: Setup project tracking system for development and project management ✅
- **update-memory-documentation**: Update memory and documentation system for automatic task list updates ✅

#### Pending Tasks 🔄

- **present-migration-plan**: Present complete migration plan to user for approval before starting development (HIGH PRIORITY)

### 🎯 Migration Overview

**Objective**: Migrate entire Hack The World platform from React+Vite to Next.js 15+ while preserving 100% of design, functionality, and user experience.

**Migration Scope**:

- **Frontend** (Student Portal): React 18 + TypeScript + Vite + RTK Query → Next.js 15+ App Router
- **Admin Panel**: React 19 + JavaScript + Vite + Axios → Next.js 15+ App Router
- **Backend**: Keep existing Express.js server unchanged
- **Shared Components**: Create monorepo with shared UI library

**Timeline**: 6-8 weeks across 4 main phases
**Architecture**: Monorepo structure with pnpm workspaces

### 🏗️ Planned Architecture

```
hack-the-world-nextjs/
├── apps/
│   ├── web/                    # Main student portal (Next.js 15+)
│   │   ├── app/               # App Router (Next.js 13+ routing)
│   │   ├── components/        # Migrated components
│   │   ├── lib/              # Utilities and types
│   │   └── public/           # Static assets
│   ├── admin/                 # Admin panel (Next.js 15+)
│   │   ├── app/              # Admin-specific App Router
│   │   ├── components/       # Admin components
│   │   └── lib/              # Admin utilities
│   └── server/               # Existing Express.js (unchanged)
├── packages/                  # Shared packages
│   ├── ui/                   # Shared UI components
│   ├── types/                # Shared TypeScript types
│   ├── api-client/           # Shared API client
│   └── config/               # Shared configurations
├── docs/                     # Updated documentation
└── tools/                    # Development tools and scripts
```

### 📅 Migration Phases

#### Phase 1: Infrastructure Setup (Week 1-2)

**Goal**: Establish Next.js 15+ monorepo with shared packages

- ✅ Create pnpm workspace configuration
- ✅ Initialize Next.js 15+ apps (web + admin)
- ✅ Setup shared packages (ui, types, api-client, config)
- ✅ Configure TypeScript project references
- ✅ Migrate build system from Vite to Next.js

#### Phase 2: Core System Migration (Week 2-4)

**Goal**: Migrate authentication, routing, and core infrastructure

- ✅ Implement Next.js middleware for JWT validation
- ✅ Migrate localStorage token handling to cookies/server-side
- ✅ Map React Router routes to Next.js App Router
- ✅ Create shared API client package
- ✅ Migrate RTK Query to work with SSR

#### Phase 3: Component Migration (Week 4-6)

**Goal**: Migrate all components maintaining exact functionality and design

- ✅ Migrate Shadcn/ui components to shared package
- ✅ Migrate all 100+ frontend components
- ✅ Migrate all 20+ admin components
- ✅ Preserve all interactive features (games, terminal, progress tracking)

#### Phase 4: Testing & Optimization (Week 6-8)

**Goal**: Ensure quality, performance, and complete feature parity

- ✅ Migrate test suites to Next.js environment
- ✅ Implement SSR/SSG optimizations
- ✅ Performance optimization and benchmarking
- ✅ Complete feature parity validation

### 🔧 Technical Migration Strategy

#### Current Tech Stack Analysis

**Frontend (Student Portal)**:

- React 18 + TypeScript + Vite + RTK Query + TailwindCSS 4.1.4
- 100+ components across 8 feature areas
- RTK Query with sophisticated caching
- localStorage JWT authentication
- React Router DOM with protected routes

**Admin Panel**:

- React 19 + JavaScript + Vite + Axios + TailwindCSS 4.1.8
- 20+ admin-specific components
- Context API state management
- Axios interceptors with token handling

#### Migration Approach

1. **Monorepo Structure**: Use pnpm workspaces for better code sharing
2. **App Router Migration**: Leverage Next.js App Router for better SSR/SSG
3. **State Management**: Adapt RTK Query for SSR compatibility
4. **Authentication**: Implement Next.js middleware for JWT handling
5. **Component Strategy**: 1:1 migration with minimal changes
6. **API Strategy**: Keep existing Express backend unchanged

### 📊 Project Tracking System

#### Epic-Based Development Board

- **Epic 1**: Infrastructure Setup (7 tasks)
- **Epic 2**: Authentication & Routing (8 tasks)
- **Epic 3**: Component Migration - Student Portal (7 tasks)
- **Epic 4**: Component Migration - Admin Panel (5 tasks)
- **Epic 5**: Feature Integration (6 tasks)
- **Epic 6**: Testing & Quality Assurance (8 tasks)

#### Milestone Gates

- **Week 2**: Infrastructure complete, development environment ready
- **Week 4**: Authentication and routing working, API clients functional
- **Week 6**: All components migrated, features working
- **Week 8**: Testing complete, production ready

### 🔄 Automatic Documentation System

#### Auto-Update Triggers

1. **Task Completion**: Update progress and create completion logs
2. **Component Migration**: Update component reference docs
3. **API Changes**: Update API usage documentation
4. **Architecture Changes**: Update technical specifications
5. **Feature Implementation**: Update feature documentation

#### Documentation Files to Update

- **CLAUDE.md**: Main project memory and context
- **FRONTEND_COMPLETE_REFERENCE.md**: Component architecture
- **SERVER_COMPLETE_REFERENCE.md**: Backend API reference
- **docs/tasks/**: Detailed task logs with decisions and rationale

### ⚠️ Critical Success Factors

1. **Zero Functional Changes**: Maintain 100% feature parity
2. **Design Preservation**: Keep exact UI/UX during migration
3. **Backend Stability**: No changes to existing Express.js APIs
4. **Gradual Migration**: Phase-by-phase reduces risk
5. **Comprehensive Testing**: Validate each migration phase
6. **Performance Improvement**: Leverage Next.js for better performance

### 💡 Expected Benefits

1. **Performance**: SSR/SSG capabilities, better SEO, faster initial loads
2. **Developer Experience**: Shared components, unified build system
3. **Modern Architecture**: Latest Next.js features, App Router benefits
4. **Code Reusability**: Monorepo enables sharing between apps
5. **Future-Proof**: Built on latest React and Next.js patterns

### 🚨 Risk Mitigation

**High Risk Areas**:

- RTK Query SSR migration complexity
- Authentication state management in SSR
- Component migration testing

**Mitigation Strategies**:

- Phase-by-phase migration approach
- Comprehensive testing at each phase
- Backup and rollback procedures
- Feature parity validation gates

### 📋 Pre-Development Checklist

- ✅ Complete migration plan documented
- ✅ Current architecture fully analyzed
- ✅ Project tracking system established
- ✅ Automatic documentation system designed
- ✅ Risk assessment completed
- ⏳ **PENDING**: User approval for development start
- ⏳ **PENDING**: Development environment setup
- ⏳ **PENDING**: Backup current codebase

### 🎯 Next Steps

1. **Immediate**: Present migration plan for user approval
2. **Upon Approval**: Begin Phase 1 infrastructure setup
3. **Continuous**: Update CLAUDE.md with progress and decisions
4. **Weekly**: Review milestone progress and adjust timeline

---

### 🔄 Development Session Protocol (Updated 2025-06-16)

**Before Starting Any Work**:

1. **Read Current CLAUDE.md**: Check project status, migration progress, pending tasks
2. **Review TodoList**: Understand current task priorities and status
3. **Check Migration Phase**: Confirm current phase and deliverables
4. **Update Documentation**: Add decisions, changes, and progress to CLAUDE.md
5. **Log Task Progress**: Use TodoWrite to track completion status

**During Development**:

1. **Follow Migration Plan**: Stick to defined phases and milestones
2. **Preserve Functionality**: Maintain 100% feature parity
3. **Document Decisions**: Record technical choices and alternatives
4. **Test Incrementally**: Validate each component/feature migration
5. **Update References**: Keep all documentation files synchronized

**After Each Session**:

1. **Update CLAUDE.md**: Record progress, issues, and next steps
2. **Complete TodoWrite**: Mark tasks as completed or update status
3. **Create Task Logs**: Document detailed implementation notes
4. **Update Reference Docs**: Reflect any architectural changes

This ensures continuous project memory and seamless development handoffs.
