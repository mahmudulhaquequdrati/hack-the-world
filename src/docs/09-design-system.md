# Design System - Hack The World

## 📋 Overview

This document outlines the comprehensive design system for the Hack The World cybersecurity learning platform, including the cybersecurity theme, visual guidelines, color schemes, typography, and component styling patterns.

## 🎨 Design Philosophy

### Core Principles

- **Cybersecurity Authenticity**: Visual design reflects real-world cybersecurity environments
- **Terminal Aesthetics**: Inspired by command-line interfaces and hacker culture
- **Educational Focus**: Design supports learning without distraction
- **Accessibility First**: Inclusive design for all users
- **Performance Conscious**: Efficient animations and resource usage

### Visual Identity

- **Professional yet Engaging**: Serious cybersecurity training with gamified elements
- **Dark Theme Dominant**: Reduces eye strain during long learning sessions
- **Matrix-inspired Effects**: Subtle cyberpunk aesthetics without overwhelming content
- **Clean Information Hierarchy**: Clear content organization and navigation

## 🌈 Color System

### Primary Color Palette

```css
/* Primary Colors */
:root {
  /* Matrix Green - Primary brand color */
  --color-primary: #00ff41;
  --color-primary-foreground: #000000;

  /* Cyber Blue - Secondary accent */
  --color-secondary: #00d4ff;
  --color-secondary-foreground: #000000;

  /* Warning Orange - Alerts and notifications */
  --color-warning: #ff6b35;
  --color-warning-foreground: #000000;

  /* Danger Red - Errors and critical alerts */
  --color-destructive: #ff073a;
  --color-destructive-foreground: #ffffff;
}
```

### Semantic Color Roles

```css
/* Semantic Colors */
:root {
  /* Background colors - Dark theme base */
  --color-background: #0a0a0a;
  --color-background-secondary: #111111;
  --color-background-tertiary: #1a1a1a;

  /* Foreground colors */
  --color-foreground: #ffffff;
  --color-foreground-muted: #a3a3a3;
  --color-foreground-subtle: #666666;

  /* Border colors */
  --color-border: #262626;
  --color-border-hover: #404040;
  --color-border-focus: #00ff41;

  /* Terminal colors */
  --color-terminal-bg: #000000;
  --color-terminal-text: #00ff41;
  --color-terminal-cursor: #00ff41;
  --color-terminal-selection: rgba(0, 255, 65, 0.3);
}
```

### Phase-specific Colors

```css
/* Learning Phase Colors */
:root {
  /* Beginner Phase - Green tones */
  --color-phase-beginner: #4ade80;
  --color-phase-beginner-bg: rgba(74, 222, 128, 0.1);
  --color-phase-beginner-border: rgba(74, 222, 128, 0.3);

  /* Intermediate Phase - Orange tones */
  --color-phase-intermediate: #fb923c;
  --color-phase-intermediate-bg: rgba(251, 146, 60, 0.1);
  --color-phase-intermediate-border: rgba(251, 146, 60, 0.3);

  /* Advanced Phase - Red tones */
  --color-phase-advanced: #f87171;
  --color-phase-advanced-bg: rgba(248, 113, 113, 0.1);
  --color-phase-advanced-border: rgba(248, 113, 113, 0.3);
}
```

### Achievement Rarity Colors

```css
/* Achievement Colors */
:root {
  --color-achievement-common: #6b7280;
  --color-achievement-rare: #3b82f6;
  --color-achievement-epic: #8b5cf6;
  --color-achievement-legendary: #f59e0b;
}
```

## 🔤 Typography

### Font System

```css
/* Typography Scale */
:root {
  /* Font Families */
  --font-family-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-family-mono: "JetBrains Mono", "Fira Code", "Monaco", monospace;
  --font-family-display: "Inter", system-ui, -apple-system, sans-serif;

  /* Font Sizes */
  --font-size-xs: 0.75rem; /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
  --font-size-base: 1rem; /* 16px */
  --font-size-lg: 1.125rem; /* 18px */
  --font-size-xl: 1.25rem; /* 20px */
  --font-size-2xl: 1.5rem; /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem; /* 36px */
  --font-size-5xl: 3rem; /* 48px */

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Typography Usage

```typescript
// Typography component examples
const TypographyExamples = () => (
  <>
    {/* Headings */}
    <h1 className="text-4xl font-bold text-foreground">Main Page Title</h1>

    <h2 className="text-3xl font-semibold text-foreground">Section Heading</h2>

    <h3 className="text-2xl font-medium text-foreground">Subsection Heading</h3>

    {/* Body Text */}
    <p className="text-base text-foreground leading-relaxed">
      Regular body text content
    </p>

    <p className="text-sm text-muted-foreground">Secondary or helper text</p>

    {/* Terminal/Code Text */}
    <code className="font-mono text-primary bg-terminal-bg px-2 py-1 rounded">
      terminal command
    </code>

    {/* Labels and Captions */}
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      Category Label
    </span>
  </>
);
```

## 🎯 Component Design Patterns

### Button Variants

```tsx
// Button design system
const ButtonVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  outline: "border border-border text-foreground hover:bg-background-secondary",
  ghost: "text-foreground hover:bg-background-secondary",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  terminal:
    "bg-terminal-bg border border-primary text-primary hover:bg-primary hover:text-black font-mono",
};

const ButtonSizes = {
  sm: "h-8 px-3 text-sm",
  default: "h-10 px-4 py-2",
  lg: "h-12 px-8 text-lg",
  icon: "h-10 w-10",
};
```

### Card Components

```tsx
// Card design patterns
const CardVariants = {
  default: "bg-background-secondary border border-border rounded-lg",
  terminal: "bg-terminal-bg border border-primary rounded-lg font-mono",
  course:
    "bg-background-secondary border border-border rounded-lg hover:border-primary transition-colors",
  achievement:
    "bg-gradient-to-br from-background-secondary to-background-tertiary border rounded-lg",
};
```

### Input Components

```tsx
// Input field styling
const InputVariants = {
  default:
    "bg-background border border-border text-foreground placeholder:text-muted-foreground",
  terminal:
    "bg-terminal-bg border border-primary text-primary placeholder:text-primary/50 font-mono",
  search:
    "bg-background-secondary border-0 text-foreground placeholder:text-muted-foreground",
};
```

## ✨ Animation System

### Transition Presets

```css
/* Animation Variables */
:root {
  /* Duration */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* Easing */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Matrix Rain Effect

```css
/* Matrix Rain Animation */
@keyframes matrix-rain {
  0% {
    transform: translateY(-100vh);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

.matrix-char {
  animation: matrix-rain linear infinite;
  color: var(--color-primary);
  font-family: var(--font-family-mono);
  text-shadow: 0 0 8px var(--color-primary);
}
```

### Hover Effects

```css
/* Interactive Hover Effects */
.hover-glow {
  transition: box-shadow var(--duration-normal) var(--ease-out);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
}

.hover-lift {
  transition: transform var(--duration-normal) var(--ease-out);
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.terminal-flicker {
  animation: flicker 2s infinite;
}

@keyframes flicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
```

## 📐 Spacing System

### Spacing Scale

```css
/* Spacing Scale */
:root {
  --space-0: 0px;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-20: 5rem; /* 80px */
  --space-24: 6rem; /* 96px */
}
```

### Layout Patterns

```tsx
// Common spacing patterns
const SpacingPatterns = {
  // Component internal spacing
  tight: "p-2 space-y-1",
  normal: "p-4 space-y-3",
  loose: "p-6 space-y-4",

  // Section spacing
  sectionGap: "space-y-8",
  pageGap: "space-y-12",

  // Grid spacing
  gridGap: "gap-4",
  cardGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
};
```

## 🎨 Visual Effects

### Terminal Effects

```css
/* Terminal-specific effects */
.terminal-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: var(--color-primary);
  animation: cursor-blink 1s infinite;
}

@keyframes cursor-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.terminal-scanlines {
  position: relative;
  overflow: hidden;
}

.terminal-scanlines::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    transparent 50%,
    rgba(0, 255, 65, 0.02) 50%,
    rgba(0, 255, 65, 0.02) 52%,
    transparent 52%
  );
  background-size: 100% 4px;
  pointer-events: none;
}
```

### Glow Effects

```css
/* Cyberpunk glow effects */
.neon-glow {
  text-shadow: 0 0 5px var(--color-primary), 0 0 10px var(--color-primary),
    0 0 15px var(--color-primary);
}

.border-glow {
  border: 1px solid var(--color-primary);
  box-shadow: 0 0 5px rgba(0, 255, 65, 0.3), inset 0 0 5px rgba(0, 255, 65, 0.1);
}

.achievement-glow {
  position: relative;
  overflow: hidden;
}

.achievement-glow::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    var(--color-primary),
    transparent
  );
  animation: rotate 3s linear infinite;
  opacity: 0.1;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Responsive Breakpoints */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Mobile Adaptations

```tsx
// Mobile-specific design patterns
const MobilePatterns = {
  // Touch-friendly button sizes
  mobileButton: "min-h-[44px] min-w-[44px]",

  // Terminal adjustments for mobile
  mobileTerminal: "text-sm leading-tight p-3",

  // Simplified navigation
  mobileNav: "fixed bottom-0 left-0 right-0 bg-background border-t",

  // Stack cards on mobile
  mobileStack: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
};
```

## 🎮 Game and Interactive Elements

### Progress Indicators

```css
/* Progress bar styling */
.progress-bar {
  background: var(--color-background-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-secondary)
  );
  height: 100%;
  transition: width var(--duration-normal) var(--ease-out);
  position: relative;
}

.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 25%,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 50%,
    transparent 75%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 20px 20px;
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}
```

### Achievement Badges

```css
/* Achievement badge styling */
.achievement-badge {
  position: relative;
  background: var(--color-background-secondary);
  border: 2px solid;
  border-radius: 50%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-common {
  border-color: var(--color-achievement-common);
}
.achievement-rare {
  border-color: var(--color-achievement-rare);
}
.achievement-epic {
  border-color: var(--color-achievement-epic);
}
.achievement-legendary {
  border-color: var(--color-achievement-legendary);
  animation: legendary-pulse 2s ease-in-out infinite;
}

@keyframes legendary-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(245, 158, 11, 0);
  }
}
```

## 🛠️ Component Library Integration

### Design Token Usage

```tsx
// Example component using design tokens
const CourseCard: React.FC<CourseCardProps> = ({ course, phase }) => {
  const phaseColors = {
    1: "border-phase-beginner bg-phase-beginner-bg",
    2: "border-phase-intermediate bg-phase-intermediate-bg",
    3: "border-phase-advanced bg-phase-advanced-bg",
  };

  return (
    <div
      className={`
      bg-background-secondary
      border border-border
      rounded-lg
      hover:border-primary
      transition-all duration-normal
      ${phaseColors[phase]}
      hover-lift
    `}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">
            {course.title}
          </h3>
          <DifficultyBadge difficulty={course.difficulty} />
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-primary">
            {course.duration}
          </span>
          <Button variant="terminal" size="sm">
            Start Course
          </Button>
        </div>
      </div>
    </div>
  );
};
```

## 📋 Design System Guidelines

### Do's and Don'ts

#### ✅ Do's

- Use consistent spacing from the defined scale
- Apply semantic color roles appropriately
- Maintain adequate contrast ratios (4.5:1 minimum)
- Use terminal/monospace fonts for code and commands
- Apply hover states to interactive elements
- Keep animations subtle and purposeful
- Test designs on various screen sizes

#### ❌ Don'ts

- Don't use arbitrary color values
- Don't create inconsistent spacing patterns
- Don't over-animate or distract from content
- Don't ignore accessibility requirements
- Don't break the cybersecurity theme consistency
- Don't use light backgrounds without proper contrast

### Accessibility Considerations

```css
/* Accessibility-focused styles */
.focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.reduced-motion {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Dark Mode Considerations

```css
/* Enhanced dark mode support */
@media (prefers-color-scheme: light) {
  .force-dark {
    color-scheme: dark;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-border: #ffffff;
    --color-primary: #00ff00;
    --color-foreground: #ffffff;
  }
}
```

## 🔄 Maintenance and Updates

### Version Control

- Design tokens are centralized in CSS custom properties
- Component variants follow consistent naming conventions
- Changes require documentation updates
- New patterns should extend existing system

### Evolution Strategy

1. **Incremental Changes**: Small, tested improvements
2. **User Feedback**: Monitor usage and accessibility
3. **Performance**: Regular animation and rendering optimization
4. **Consistency**: Periodic design system audits

---

**Design System Version**: 1.0.0
**Last Updated**: December 2024
**Accessibility Standard**: WCAG 2.1 AA
**Browser Support**: Modern browsers with CSS custom properties
