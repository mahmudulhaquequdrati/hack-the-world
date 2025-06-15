# Hack The World - Complete Project Overview

## 📋 Project Overview

**Hack The World** is a comprehensive cybersecurity learning platform that combines educational content with hands-on practice through interactive terminals, AI tools, and practical exercises. The platform provides structured learning paths for cybersecurity education with progress tracking and enrollment management.

## 🏗️ Architecture Overview

### Technology Stack Summary

**Frontend (Student Portal)**
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS v4 + Radix UI components
- **Routing**: React Router v6
- **Testing**: Vitest + Testing Library
- **Theme**: Custom cybersecurity theme with matrix animations

**Admin Panel**
- **Framework**: React 19 + JavaScript + Vite
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS v4 
- **Routing**: React Router v7
- **Icons**: Heroicons v2

**Backend API Server**
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT with 7-day expiry
- **Security**: Helmet, CORS, Rate limiting, bcrypt
- **Documentation**: Swagger/OpenAPI
- **Logging**: Morgan + custom error handling

### Directory Structure

```
hack-the-world/
├── frontend/                    # Main student portal (React + TypeScript)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── features/          # Feature-based modules
│   │   │   ├── api/           # RTK Query API slices
│   │   │   ├── auth/          # Authentication features
│   │   │   └── courses/       # Course-related features
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── app/               # Redux store configuration
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
│
├── admin/                      # Admin management panel (React + JavaScript)
│   ├── src/
│   │   ├── components/        # Admin-specific components
│   │   ├── pages/             # Admin page components
│   │   ├── context/           # React context providers
│   │   ├── services/          # API service functions
│   │   └── utils/             # Admin utility functions
│   └── package.json           # Admin panel dependencies
│
├── server/                     # Backend API server (Node.js + Express)
│   ├── src/
│   │   ├── models/            # Mongoose database models
│   │   ├── routes/            # Express route handlers
│   │   ├── controllers/       # Business logic controllers
│   │   ├── middleware/        # Custom middleware functions
│   │   ├── config/            # Configuration files
│   │   ├── utils/             # Server utility functions
│   │   └── validators/        # Input validation schemas
│   ├── index.js               # Server entry point
│   └── package.json           # Backend dependencies
│
├── docs/                       # Project documentation
│   ├── tasks/                 # Development task logs
│   └── *.md                   # Reference documentation
│
└── CLAUDE.md                  # Project instructions and guidelines
```

## 🎯 Core Features

### Learning Management System
- **Hierarchical Content Structure**: Phase → Module → Content organization
- **Progress Tracking**: Multi-level progress at content, module, and phase levels
- **Enrollment System**: Module enrollment with prerequisite checking
- **Learning Streaks**: Daily learning streak tracking with leaderboards
- **Achievement System**: Gamified learning with points and achievements

### Interactive Learning Environment
- **Video Player**: Custom video player with progress tracking and auto-completion
- **Laboratory Environment**: Integrated terminal for hands-on cybersecurity practice
- **Game System**: Interactive cybersecurity challenges and scenarios
- **AI Playground**: AI-powered learning assistance and explanations
- **Document Viewer**: Structured document reading with progress tracking

### User Management
- **Authentication System**: JWT-based with role-based access (student/admin)
- **Profile Management**: User profiles with avatars, stats, and preferences
- **Security Features**: Account lockout, password reset, login attempt tracking
- **Admin Approval**: Admin account approval system for enhanced security

### Content Management (Admin)
- **CRUD Operations**: Complete content management for phases, modules, and content
- **User Oversight**: Enrollment management and progress monitoring
- **Analytics Dashboard**: Detailed statistics and performance metrics
- **Bulk Operations**: Efficient content creation and management workflows

## 🔐 Security Implementation

### Authentication & Authorization
- **JWT Tokens**: 7-day expiry with automatic refresh
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Role-Based Access**: Student and admin roles with protected routes
- **Account Security**: Login attempt limits, account lockout protection

### API Security
- **Rate Limiting**: 10,000 requests per 15 minutes per IP
- **CORS Configuration**: Strict origin validation for frontend and admin
- **Security Headers**: Helmet.js for comprehensive security headers
- **Input Validation**: express-validator for all API endpoints
- **Error Handling**: Secure error responses without sensitive data exposure

### Data Protection
- **Password Requirements**: Minimum 8 characters with complexity rules
- **Token Invalidation**: Automatic token invalidation on password change
- **Secure Storage**: Sensitive data excluded from API responses
- **Admin Verification**: Multi-step admin account approval process

## 📊 Database Architecture

### Core Models (8 Total)

1. **User**: Student/admin accounts with profiles, stats, security settings
2. **Phase**: High-level learning phases (e.g., "Fundamentals", "Advanced")
3. **Module**: Individual courses within phases with prerequisites
4. **Content**: Learning materials (videos, labs, games, documents)
5. **UserEnrollment**: Module enrollment tracking with progress
6. **UserProgress**: Individual content completion tracking
7. **Achievement**: Available achievements with criteria
8. **UserAchievement**: User's earned achievements with timestamps

### Key Relationships
- **One-to-Many**: Phase → Modules, Module → Content
- **Many-to-Many**: User ↔ Modules (via UserEnrollment), User ↔ Content (via UserProgress)
- **Achievement System**: Users earn achievements based on progress and activities

## 🚀 Performance Optimizations

### Frontend Optimizations
- **RTK Query Caching**: Intelligent caching with automatic invalidation
- **Authentication-Aware Queries**: Skip unnecessary API calls for unauthenticated users
- **Optimized Endpoints**: Consolidated queries reducing API calls by 62%
- **Component Lazy Loading**: Code splitting for better performance
- **Memoization**: React.memo and useMemo for expensive operations

### Backend Optimizations
- **MongoDB Indexing**: Optimized queries with proper indexes
- **Pagination Support**: Efficient handling of large datasets
- **Lean Queries**: Minimal data transfer with select field optimization
- **Aggregation Pipelines**: Complex queries with MongoDB aggregation

### Caching Strategy
- **Client-Side**: RTK Query with configurable cache times
- **API Response**: Optimized serialization and minimal data transfer
- **Static Assets**: Vite-optimized bundling and caching

## 🎨 UI/UX Design System

### Cybersecurity Theme
- **Color Palette**: Matrix green (#00ff41) primary with dark backgrounds
- **Typography**: Monospace fonts (JetBrains Mono) for terminal aesthetic
- **Animations**: Matrix rain effect, terminal cursor, glitch effects
- **Visual Effects**: Scanlines, progress bars with glow, status indicators

### Component System
- **Design Tokens**: CSS custom properties for consistent theming
- **Radix UI Integration**: Accessible, unstyled components with custom styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark Mode**: Comprehensive dark mode support (default theme)

### Accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Visible focus indicators and logical tab order

## 📱 Application Features

### Student Portal Features
- **Dashboard**: Learning progress overview with enrolled courses
- **Course Catalog**: Browse phases and modules with detailed information
- **Content Player**: Unified player for videos, labs, games, and documents
- **Progress Tracking**: Real-time progress updates and completion tracking
- **Profile Management**: User settings, statistics, and achievement display
- **Learning Streaks**: Daily streak tracking with motivation features

### Admin Panel Features
- **Content Management**: Full CRUD for phases, modules, and content
- **User Management**: View users, manage enrollments, track progress
- **Analytics Dashboard**: Comprehensive statistics and reporting
- **Bulk Operations**: Efficient content creation and management
- **System Monitoring**: Health checks and performance metrics

## 🔄 Data Flow Architecture

### Frontend Data Flow
1. **Authentication**: JWT token management with automatic refresh
2. **API Queries**: RTK Query with smart caching and invalidation
3. **State Management**: Redux for auth state, RTK Query for server state
4. **Component Updates**: Automatic re-renders on data changes

### Backend Data Flow
1. **Request Processing**: Middleware chain (auth, validation, rate limiting)
2. **Business Logic**: Controller functions with error handling
3. **Database Operations**: Mongoose ODM with optimized queries
4. **Response Formation**: Standardized JSON responses with success/error states

### Real-Time Updates
- **Progress Synchronization**: Automatic progress updates across components
- **Enrollment Changes**: Real-time enrollment status updates
- **Achievement Notifications**: Immediate achievement unlocks

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Component testing with Vitest and Testing Library
- **Integration Tests**: API integration testing with MSW
- **E2E Tests**: User workflow testing (planned)
- **Type Safety**: Comprehensive TypeScript coverage

### Backend Testing
- **API Testing**: Endpoint testing with proper mocking
- **Database Testing**: Model validation and relationship testing
- **Security Testing**: Authentication and authorization testing
- **Performance Testing**: Load testing for critical endpoints

## 📦 Deployment Architecture

### Environment Configuration
- **Development**: Local development with hot reload
- **Production**: Optimized builds with environment variables
- **Database**: MongoDB Atlas with connection pooling
- **Static Assets**: CDN-ready static file serving

### Monitoring & Logging
- **Request Logging**: Morgan middleware for HTTP request tracking
- **Error Tracking**: Comprehensive error handling and logging
- **Health Checks**: API health endpoints for monitoring
- **Performance Metrics**: Response time and resource usage tracking

## 🎯 Business Logic

### Learning Progression
- **Prerequisite System**: Modules must be completed in order
- **Automatic Progress**: Content completion triggers module progress updates
- **Achievement Unlocks**: Progress-based achievement system
- **Streak Maintenance**: Daily learning streaks with recovery mechanisms

### Content Organization
- **Hierarchical Structure**: Clear learning path organization
- **Content Types**: Support for multiple content formats
- **Duration Tracking**: Automatic content duration calculation
- **Navigation**: Previous/next content navigation with progress context

### User Experience
- **Onboarding**: Smooth user registration and initial setup
- **Personalization**: User profiles with customizable preferences
- **Motivation**: Gamification elements to encourage learning
- **Accessibility**: Inclusive design for all users

This documentation provides the complete foundation for understanding and recreating the Hack The World cybersecurity learning platform. Every technical detail, architectural decision, and implementation pattern has been captured to ensure nothing is missed in the Next.js migration.