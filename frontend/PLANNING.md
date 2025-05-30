# PLANNING.md - Hack The World Cybersecurity Learning Platform

## 🎯 Project Vision

**Mission**: Create an immersive, interactive cybersecurity learning platform that combines hands-on labs, gamification, and real-world simulations in a terminal-styled interface.

**Target Audience**:

- Cybersecurity beginners to advanced practitioners
- Students and professionals seeking hands-on security training
- Organizations requiring cybersecurity training programs

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend**: React 18 + TypeScript (Functional components only)
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS + shadcn/ui component library
- **Routing**: React Router DOM for client-side navigation
- **State Management**: React hooks + Context API (no external state libs)
- **Package Manager**: pnpm (required for all operations)
- **Terminal**: xterm.js for realistic terminal emulation
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation

### Design Philosophy

- **Cybersecurity Aesthetic**: Matrix-inspired green terminal theme
- **Mobile-First**: Responsive design optimized for all devices
- **Performance-First**: Optimized bundle size and loading times
- **Type Safety**: 100% TypeScript coverage, no `any` types
- **Component Reusability**: Modular architecture with 50+ reusable components

## 📂 Project Structure

### File Organization Strategy

```
src/
├── components/        # 50+ reusable components organized by feature
│   ├── common/       # Shared UI components (DifficultyBadge, ProgressBar, StatCard)
│   ├── course/       # Course detail and enrollment components
│   ├── enrolled/     # Learning interface components
│   ├── dashboard/    # User dashboard and progress tracking
│   ├── landing/      # Marketing and landing page components
│   ├── overview/     # Course navigation and structure
│   ├── games/        # Interactive security games
│   ├── terminal/     # Terminal emulation components
│   ├── effects/      # Animation and visual effects
│   └── ui/          # shadcn/ui base components
├── pages/            # Route-level page components
├── lib/              # Core utilities and data management
│   ├── appData.ts    # **SINGLE SOURCE OF TRUTH** for all data
│   ├── types.ts      # TypeScript interfaces
│   ├── constants.ts  # Application constants
│   ├── helpers.ts    # Utility functions
│   └── utils.ts      # General utilities
├── hooks/            # Custom React hooks
└── assets/           # Static assets
```

### Data Management Strategy

- **Centralized Data**: All data flows through `src/lib/appData.ts`
- **No Data Duplication**: Components receive data via props only
- **Type-Safe APIs**: All data operations use typed utility functions
- **Consistent State**: Single source of truth prevents sync issues

## 🎮 Core Features

### Learning Paths

1. **Foundation Phase**: Network Security, Web Security, System Admin, Cryptography
2. **Intermediate Phase**: Penetration Testing, Digital Forensics, Incident Response
3. **Advanced Phase**: APTs, Red Team Operations, Security Architecture

### Interactive Elements

- **Video Lessons**: Progress tracking and completion states
- **Hands-on Labs**: Real-world security scenarios
- **Security Games**: Cipher, Hash Cracking, Port Scanning, CTF challenges
- **AI Playground**: Terminal, chat, and analysis modes
- **Terminal Labs**: Command-line security tools practice

### Gamification System

- Point-based progression system
- Achievement badges and certificates
- Difficulty levels: Beginner → Intermediate → Advanced → Expert
- Leaderboards and progress tracking

## 🎨 Design System

### Color Palette

```css
/* Primary Cybersecurity Theme */
--cyber-green: #00ff00; /* Primary terminal green */
--cyber-green-dark: #00cc00; /* Darker variant */
--cyber-green-light: #33ff33; /* Lighter variant */
--terminal-bg: #0a0a0a; /* Terminal background */
--terminal-border: #333333; /* Terminal borders */

/* Difficulty Color System */
--beginner: #4ade80; /* Green */
--intermediate: #fbbf24; /* Yellow */
--advanced: #f87171; /* Red */
--expert: #a855f7; /* Purple */
```

### Typography System

- **Primary**: JetBrains Mono (monospace) for terminal authenticity
- **Secondary**: Inter (sans-serif) for readable content
- **Terminal Text**: Always monospace with green color variants

### Component Patterns

- **Terminal Windows**: Consistent styling with macOS-style controls
- **Hacker Buttons**: Special CSS classes for cybersecurity-themed interactions
- **Matrix Effects**: Background animations and visual flair
- **Progress Indicators**: Terminal-styled progress bars and status displays

## 🚦 Development Guidelines

### Code Quality Standards

- **File Size Limit**: Maximum 500 lines per component file
- **Component Pattern**: Functional components with TypeScript interfaces
- **Export Strategy**: Default exports for main components, named for utilities
- **Testing Requirements**: Unit tests for all new features (3 test types minimum)
- **Documentation**: JSDoc comments for complex logic

### Component Development Rules

1. **Props Interface**: Always define TypeScript interfaces for props
2. **Styling**: Use Tailwind CSS with `cn()` utility for conditional classes
3. **Reusability**: Create modular components that can be used across features
4. **Error Handling**: Implement proper error boundaries and fallback states
5. **Accessibility**: Ensure keyboard navigation and screen reader support

### Data Flow Patterns

```
appData.ts → Pages → Feature Components → Common Components
```

- No direct data imports in leaf components
- All state changes flow through defined utility functions
- Props-based data passing for component communication

## 🧪 Testing Strategy

### Testing Requirements

- **Coverage**: Unit tests for all new features and utilities
- **Test Types**: Expected use, edge cases, and failure scenarios
- **Tools**: Vitest + React Testing Library + Jest DOM
- **Automation**: Tests run on every build and deployment
- **Performance**: No tests should significantly impact build times

### Testing Patterns

- Mock data that mirrors production structure
- Component testing with React Router integration
- Interactive element testing for games and labs
- Data utility function testing for accuracy

## 🔐 Security Considerations

### Code Security

- Input validation with Zod schemas
- XSS prevention in terminal output
- Safe localStorage access patterns
- Proper error handling without data leakage

### Educational Security

- Realistic but safe security scenarios
- No actual vulnerabilities in teaching materials
- Proper sanitization of user-generated content
- Clear boundaries between simulation and reality

## 📱 Responsive Design Strategy

### Breakpoint Strategy

- **Mobile First**: Base styles for mobile devices
- **Tablet**: `md:` prefix for tablet-specific adaptations
- **Desktop**: `lg:` prefix for desktop enhancements
- **Terminal Adaptation**: Ensure terminal theme works on all screen sizes

### Performance Targets

- **Bundle Size**: Keep under 1MB total
- **Loading Time**: Under 3 seconds on 3G
- **Animation Performance**: 60fps on mid-range devices
- **Memory Usage**: Efficient component re-rendering

## 🔄 Development Workflow

### Version Control Strategy

- **Main Branch**: Always deployable
- **Feature Branches**: One feature per branch
- **Component Branches**: Large component refactors
- **Documentation Updates**: Concurrent with code changes

### Build and Deployment

- **Development**: `pnpm dev` for local development
- **Testing**: `pnpm test` for test execution
- **Building**: `pnpm build` for production builds
- **Preview**: `pnpm preview` for production preview

### Code Review Process

- TypeScript compilation must pass
- All tests must pass
- Component documentation must be updated
- Performance impact must be considered

## 🎯 Success Metrics

### Technical Metrics

- **Bundle Size**: <1MB total
- **Load Time**: <3s on 3G
- **Test Coverage**: >90%
- **TypeScript Coverage**: 100%
- **Component Reusability**: >80% of components used in multiple places

### User Experience Metrics

- **Accessibility Score**: >95% WCAG compliance
- **Mobile Usability**: Smooth operation on all screen sizes
- **Terminal Authenticity**: Realistic cybersecurity environment feel
- **Learning Effectiveness**: Measurable skill progression

## 🔮 Future Considerations

### Scalability Plans

- **State Management**: Consider Redux/Zustand for complex state needs
- **API Integration**: Prepare for backend integration
- **Real-time Features**: WebSocket support for live collaboration
- **Internationalization**: Multi-language support framework

### Feature Expansion

- **Advanced Labs**: More complex security scenarios
- **Team Features**: Collaborative learning environments
- **Certification**: Formal certification programs
- **Enterprise**: Corporate training modules

## 📋 Current Constraints

### Technical Constraints

- **No Backend**: Currently frontend-only with static data
- **No Authentication**: Simulated user states
- **No Persistence**: LocalStorage-based state management
- **Limited Real-time**: No actual network security tools

### Design Constraints

- **Terminal Theme**: Must maintain cybersecurity aesthetic
- **Performance**: Must work well on lower-end devices
- **Accessibility**: Must support screen readers and keyboard navigation
- **Mobile**: Full feature parity across screen sizes

---

**Last Updated**: [Current Date]
**Next Review**: [Quarterly Review Date]
