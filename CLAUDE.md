# Hack The World - Cybersecurity Learning Platform

## 📁 Project Documentation References

### Complete Technical Documentation

- **[SERVER_COMPLETE_REFERENCE.md](./docs/SERVER_COMPLETE_REFERENCE.md)** - Complete backend API documentation, models, controllers, security, and development patterns
- **[FRONTEND_COMPLETE_REFERENCE.md](./docs/FRONTEND_COMPLETE_REFERENCE.md)** - Complete frontend architecture, components, state management, and optimization patterns
- **[FEATURES_AND_WORKFLOWS.md](./docs/FEATURES_AND_WORKFLOWS.md)** - Detailed feature documentation, workflows, and implementation details
- **[FRONTEND_API_USAGE_COMPLETE_MAPPING.md](./docs/FRONTEND_API_USAGE_COMPLETE_MAPPING.md)** - Comprehensive API usage analysis with usage status and locations
- **[DEVELOPMENT_QUICK_REFERENCE.md](./docs/DEVELOPMENT_QUICK_REFERENCE.md)** - Quick development commands, patterns, and debugging guide

----**MENDATORY STARTS** ----

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

### Architecture Strengths

- **Clean separation** between student and admin functionality
- **Smart API optimization** with combined queries and intelligent caching
- **Robust security implementation** with multiple protection layers
- **Scalable database design** with proper relationships and indexes
- **Type-safe frontend** with RTK Query for reliable data management
- **Zero dead code** - All backend endpoints serve at least one frontend

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

1. **Check FRONTEND_API_USAGE_COMPLETE_MAPPING.md** for impact analysis
2. **Update both frontend and backend reference docs**
3. **Document breaking changes** and migration paths
4. **Test all affected components** listed in usage mapping

#### When Changing UI Components:

1. **Update FRONTEND_COMPLETE_REFERENCE.md** component descriptions
2. **Document new patterns** in DEVELOPMENT_QUICK_REFERENCE.md
3. **Update component usage examples** and best practices

This platform provides a solid foundation for cybersecurity education with professional-grade architecture, comprehensive feature set, and security-first design principles.
