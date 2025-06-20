# Hack The World - Cybersecurity Learning Platform

## 📁 Documentation References
- **[SERVER_COMPLETE_REFERENCE.md](./docs/SERVER_COMPLETE_REFERENCE.md)** - Backend API, models, security
- **[FRONTEND_COMPLETE_REFERENCE.md](./docs/FRONTEND_COMPLETE_REFERENCE.md)** - Frontend architecture, components
- **[DEVELOPMENT_QUICK_REFERENCE.md](./docs/DEVELOPMENT_QUICK_REFERENCE.md)** - Development commands and patterns

## 🔄 Update Protocol
**For every change:** Update CLAUDE.md + create task logs in docs/tasks/ + update reference docs

## Project Overview
Cybersecurity learning platform with interactive terminals, AI tools, and structured learning paths.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + RTK Query + TailwindCSS
- **Admin**: React + JavaScript + Vite + Axios  
- **Backend**: Node.js + Express.js + MongoDB + Mongoose
- **Auth**: JWT-based with 7-day expiry

## Core Models
1. **User**: Student/admin accounts
2. **Phase**: Learning phases (Fundamentals, Advanced)
3. **Module**: Courses within phases  
4. **Content**: Videos, labs, games, documents
5. **UserEnrollment**: Module enrollment tracking
6. **UserProgress**: Content completion tracking

## Current Status - 100% Complete ✅

### ✅ Completed Features
- Full authentication system with security
- Complete content management with hierarchical organization
- Admin panel with comprehensive management tools
- Progress tracking with multi-level synchronization
- Learning streak system with automatic tracking
- Authentication-aware UI components

### Recent Updates (2025-06-20)
- **Enhanced Module Design**: Professional phase-style layout with difficulty badges
- **Tree View Auto-Expansion**: All phases/modules expand by default for better UX
- **Content Order System**: Drag-and-drop reordering with section boundaries
- **Filter Enhancement**: Active/Inactive content filtering with proper data flow

## Migration Status - 100% Complete ✅

### Express.js to Next.js Migration (2025-06-16)
- **API Endpoints**: 69 endpoints (100% coverage vs 60+ in Express.js)
- **Database Models**: 8 models (100% identical schemas)
- **Feature Coverage**: 100% complete parity + enhancements
- **TypeScript Integration**: 100% type-safe vs JavaScript original

**Status**: Production ready with complete feature coverage

## Development Guidelines

### When Adding Features:
1. Create task list with TodoWrite
2. Document architectural decisions
3. Update reference documentation
4. Update CLAUDE.md with new capabilities

### When Modifying APIs:
1. Follow CyberSecOverview gold standard pattern
2. Use comprehensive endpoints vs multiple calls
3. Apply authentication-aware loading patterns
4. Update both frontend and backend reference docs

### Development Session Protocol:
1. Read current CLAUDE.md status
2. Review TodoList for priorities
3. Document decisions and progress
4. Update reference docs after changes