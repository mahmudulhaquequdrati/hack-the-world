# 🛡️ Hack The World - Cybersecurity Learning Platform

> **Experience the matrix. Master cybersecurity. Hack the world.**

A comprehensive, interactive cybersecurity learning platform featuring gamified education, hands-on labs, and real-world simulations. Built with modern technologies to provide an authentic hacker experience while teaching essential cybersecurity skills.

![Cybersecurity Platform](https://img.shields.io/badge/Platform-Cybersecurity%20Learning-00ff00?style=for-the-badge&logo=terminal)
![Full Stack](https://img.shields.io/badge/Stack-MERN%20TypeScript-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** (recommended) or npm
- **MongoDB** v4.4 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hack-the-world

# Install dependencies for both frontend and backend
pnpm install --recursive

# Set up environment variables
cp server/env.example server/.env
# Edit server/.env with your configuration

# Start the development servers
pnpm dev:all
```

### Development Commands

```bash
# Frontend only
cd frontend && pnpm dev

# Backend only
cd server && pnpm dev

# Both frontend and backend
pnpm dev:all

# Build for production
pnpm build:all

# Run tests
pnpm test:all
```

## ✨ Platform Features

### 🎓 Three-Phase Learning System

**Beginner Phase** - Cybersecurity Fundamentals

- Network Security Basics
- Password Security & Authentication
- Social Engineering Awareness
- Basic Cryptography
- Security Tools Introduction

**Intermediate Phase** - Advanced Security Skills

- Penetration Testing Fundamentals
- Web Application Security
- Network Analysis & Monitoring
- Incident Response
- Digital Forensics Basics

**Advanced Phase** - Expert Specializations

- Advanced Penetration Testing
- Malware Analysis
- Reverse Engineering
- Cloud Security Architecture
- Security Research Methods

### 🎮 Interactive Learning Environment

- **📺 Split-Screen Interface**: Video lessons with AI-powered playground
- **💻 Real Terminal Emulation**: Authentic cybersecurity tools experience
- **🔬 Hands-on Labs**: Step-by-step practical exercises
- **🎯 Security Games**: Gamified challenges and CTF-style competitions
- **🏆 Achievement System**: Progress tracking with badges and leaderboards

### 🛡️ Cybersecurity-Themed Experience

- **🔢 Matrix-Style Interface**: Authentic hacker aesthetic with terminal theme
- **🤖 AI Assistant**: Context-aware learning support and guidance
- **📊 Progress Analytics**: Comprehensive tracking and learning recommendations
- **📱 Responsive Design**: Full functionality across all devices

## 🏗️ Architecture & Technology Stack

### Frontend Technologies

- **React 18** with TypeScript (100% functional components)
- **Vite** for fast development and optimized builds
- **Tailwind CSS** + shadcn/ui component library
- **React Router** for client-side navigation
- **xterm.js** for terminal emulation
- **Recharts** for data visualization

### Backend Technologies

- **Node.js** + Express.js with TypeScript
- **MongoDB** + Mongoose ODM
- **JWT** authentication
- **Helmet** + CORS security middleware
- **Express Validator** for input validation
- **Swagger** API documentation

### Development Tools

- **pnpm** package management
- **ESLint** + Prettier code formatting
- **Jest** + React Testing Library for testing
- **Docker** for containerization (planned)

## 📁 Project Structure

```
hack-the-world/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # 50+ reusable React components
│   │   │   ├── common/     # Shared UI components
│   │   │   ├── course/     # Course-related components
│   │   │   ├── dashboard/  # User dashboard
│   │   │   ├── enrolled/   # Learning interface
│   │   │   ├── games/      # Interactive games
│   │   │   ├── terminal/   # Terminal emulation
│   │   │   └── ui/         # shadcn/ui base components
│   │   ├── pages/          # Route-level components
│   │   ├── lib/            # Utilities and data management
│   │   ├── hooks/          # Custom React hooks
│   │   └── docs/           # Comprehensive documentation
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                  # Express.js API server
│   ├── src/
│   │   ├── controllers/    # API request handlers
│   │   ├── middleware/     # Security and validation
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── config/         # Database configuration
│   │   └── utils/          # Helper functions
│   └── package.json        # Backend dependencies
├── planning.md             # Project roadmap and architecture
├── task.md                 # Active tasks and sprint tracking
└── README.md               # This file
```

## 📚 Documentation

### Frontend Documentation

- **[Frontend README](frontend/README.md)** - Complete frontend documentation
- **[System Design](frontend/SYSTEM_DESIGN.md)** - Technical architecture details
- **[Development Guide](frontend/DEVELOPMENT_GUIDE.md)** - Setup and standards

### Core Documentation (frontend/src/docs/)

- **[Platform Overview](frontend/src/docs/01-platform-overview.md)** - Feature overview
- **[Architecture Guide](frontend/src/docs/02-architecture.md)** - Technical architecture
- **[User Experience](frontend/src/docs/03-user-experience.md)** - User journey flows
- **[Component Library](frontend/src/docs/04-component-library.md)** - Component docs

### Project Management

- **[Planning Document](planning.md)** - Project roadmap and strategy
- **[Task Tracking](task.md)** - Current tasks and sprint progress

## 🎯 Development Status

### ✅ Completed Features

- Complete three-phase learning system (15+ courses)
- Interactive video player with AI playground
- Terminal emulation with cybersecurity tools
- Comprehensive progress tracking system
- Games and labs with new-tab functionality
- Responsive design with mobile optimization
- Dashboard with analytics and recommendations

### 🚧 In Progress

- Backend API development
- User authentication system
- Database integration
- Testing infrastructure setup

### 📋 Planned Features

- Real-time collaboration features
- Advanced terminal simulations
- Certification system
- Mobile applications
- Instructor dashboard

## 🚀 Performance Achievements

- **83% Code Reduction** through component refactoring
- **50+ Reusable Components** with high reuse rates
- **100% TypeScript Coverage** with comprehensive type safety
- **Centralized Data Management** eliminating duplication
- **12% Bundle Size Reduction** through optimization

## 🧪 Testing Strategy

### Frontend Testing

- Component testing with React Testing Library
- Hook testing with custom test utilities
- End-to-end testing for user workflows
- Performance testing for optimization

### Backend Testing

- API endpoint testing with Supertest
- Model validation testing
- Security testing for vulnerabilities
- Integration testing with database

### Quality Standards

- **80%+ Test Coverage** requirement
- **Zero Critical Vulnerabilities**
- **Performance**: Page load < 2 seconds
- **Accessibility**: WCAG 2.1 AA compliance

## 🔐 Security Features

- JWT-based authentication
- Input validation and sanitization
- Rate limiting and CORS protection
- Security headers with Helmet
- NoSQL injection prevention
- XSS and CSRF protection

## 🤝 Contributing

1. **Read Documentation**: Start with [planning.md](planning.md) and [task.md](task.md)
2. **Follow Standards**: Check frontend and backend development rules
3. **Write Tests**: All features require comprehensive test coverage
4. **Security First**: Follow cybersecurity best practices
5. **Code Review**: All changes require peer review

### Development Workflow

1. Pick a task from [task.md](task.md)
2. Create feature branch
3. Implement with tests
4. Update documentation
5. Submit pull request

## 📊 Project Metrics

### Sprint Progress

- **Current Sprint**: Foundation Setup
- **Completed Tasks**: 6/13 (46%)
- **Development Velocity**: 6 tasks/week
- **Timeline**: On track

### Quality Metrics

- **Code Review Coverage**: 100%
- **Documentation Coverage**: 17 files planned
- **Component Reusability**: >80%
- **TypeScript Coverage**: 100%

## 🎨 Design System

### Cybersecurity Theme

- **Primary Colors**: Matrix green (#00ff00, #22c55e)
- **Background**: Dark themes (#0f172a, #1e293b)
- **Typography**: JetBrains Mono (terminal), Inter (content)
- **Effects**: Matrix rain, terminal glows, typewriter animations

### Component Standards

- Functional React components with TypeScript
- shadcn/ui base components
- Tailwind CSS for styling
- Accessibility-first design

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚀 Deployment

### Production Deployment

```bash
# Build both applications
pnpm build:all

# Production environment variables
cp server/env.example server/.env.production
# Configure production settings

# Deploy (specific commands depend on hosting platform)
```

### Docker Support (Planned)

```bash
# Build and run with Docker
docker-compose up --build
```

## 📞 Support & Contact

- **Documentation**: Check [frontend/src/docs/](frontend/src/docs/)
- **Issues**: Use GitHub Issues for bug reports
- **Features**: Submit feature requests via Issues
- **Questions**: Check existing documentation first

## 🌟 Acknowledgments

Built with modern web technologies to provide an authentic, educational cybersecurity experience. Special thanks to the open-source community for the amazing tools and libraries that make this platform possible.

---

**🎯 Mission**: Provide hands-on, practical cybersecurity education through interactive modules, games, and labs.

**🔮 Vision**: Create a comprehensive cybersecurity learning platform with gamified education system.

**💫 Experience the future of cybersecurity education. Master the skills. Hack the world.**
