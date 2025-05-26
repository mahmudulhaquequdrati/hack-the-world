# Hack The World - Cybersecurity Learning Platform

A comprehensive, interactive cybersecurity learning platform built with React, TypeScript, and Vite. This platform provides hands-on training through interactive labs, games, and real-world simulations in a terminal-styled interface.

## 🎯 What is Hack The World?

Hack The World is an immersive cybersecurity education platform that combines:

- **Interactive Learning**: Video lessons, hands-on labs, and practical exercises
- **Gamification**: Security challenges, CTF-style games, and point-based progression
- **Real-world Simulations**: Terminal environments, network scanning, and vulnerability assessment
- **Progressive Curriculum**: Structured learning paths from beginner to advanced levels
- **AI-Powered Assistance**: Integrated AI playground for learning support and analysis

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hack-the-world

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React hooks + Context
- **Terminal**: xterm.js for terminal emulation
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation

## 🎓 Learning Paths

The platform offers structured learning through different phases:

### 1. **Foundation Phase**

- Network Security Fundamentals
- Web Application Security
- System Administration
- Cryptography Basics

### 2. **Intermediate Phase**

- Penetration Testing
- Digital Forensics
- Incident Response
- Malware Analysis

### 3. **Advanced Phase**

- Advanced Persistent Threats
- Red Team Operations
- Security Architecture
- Threat Hunting

## 🎮 Key Features

### Interactive Learning

- **Video Lessons**: Comprehensive video tutorials with progress tracking
- **Hands-on Labs**: Real-world security scenarios and exercises
- **AI Playground**: AI-assisted learning with terminal, chat, and analysis modes
- **Progress Tracking**: Visual progress indicators and achievement system

### Gamification

- **Cipher Games**: Caesar cipher decoding challenges
- **Hash Cracking**: MD5 hash breaking exercises
- **Port Scanning**: Network reconnaissance simulations
- **CTF Challenges**: Capture-the-flag style security puzzles

### Real-world Simulations

- **Terminal Labs**: Command-line security tools practice
- **Web Security Labs**: Hands-on vulnerability testing
- **Social Engineering Labs**: Security awareness training
- **Network Analysis**: Traffic analysis and monitoring

## 🎨 Design Philosophy

The platform uses a cybersecurity-themed design with:

- **Matrix/Hacker Aesthetic**: Green terminal-style interfaces
- **Dark Theme**: Professional cybersecurity look and feel
- **Interactive Elements**: Smooth animations and hover effects
- **Responsive Design**: Optimized for all device sizes

## 📁 Project Structure

```
hack-the-world/
├── public/                 # Static assets
├── src/
│   ├── components/        # 50+ reusable React components
│   ├── pages/            # Main application pages
│   ├── lib/              # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   └── assets/           # Images, icons, and media files
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 📚 Documentation

### For Developers

- **[Architecture Guide](./ARCHITECTURE.md)** - Complete technical architecture, component relationships, and development patterns
- **[Refactoring Summary](./REFACTORING_SUMMARY.md)** - Recent improvements and code optimization history

### For Users

- **Getting Started**: Follow the Quick Start guide above
- **Learning Paths**: Explore the structured curriculum phases
- **Interactive Features**: Discover games, labs, and AI assistance

## 🔧 Development Guidelines

### Component Development

- Use functional components with TypeScript
- Follow established naming conventions
- Create reusable, well-documented components
- Implement proper error handling and accessibility

### Code Quality

- **Type Safety**: Comprehensive TypeScript coverage
- **Performance**: Optimized bundle size and loading times
- **Testing**: Component and integration testing
- **Documentation**: Keep code well-documented

### Styling

- Use Tailwind CSS utility classes
- Follow the cybersecurity theme color palette
- Implement responsive design patterns
- Maintain consistent spacing and typography

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Standards

- Follow TypeScript best practices
- Write clean, readable code
- Add proper documentation for new features
- Test components thoroughly
- Follow the established design patterns

## 📊 Project Stats

- **50+ Reusable Components**: Modular architecture for maintainability
- **83% Code Reduction**: Through component refactoring and optimization
- **Type-Safe**: Comprehensive TypeScript coverage
- **Performance Optimized**: Bundle size reduced by 12%

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions, issues, or contributions:

- Create an issue in the repository
- Follow the contributing guidelines
- Check existing documentation first

---

**Built with ❤️ for cybersecurity education and hands-on learning.**
