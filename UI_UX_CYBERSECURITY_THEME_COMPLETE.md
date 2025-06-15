# UI/UX Cybersecurity Theme Complete Documentation

## 🎨 Theme Architecture Overview

**Design System**: Cybersecurity-focused dark theme with matrix aesthetics  
**Primary Color**: Matrix Green (#00ff41) with OKLCH color space  
**Typography**: Monospace fonts (JetBrains Mono) for terminal feel  
**Framework**: Tailwind CSS v4 with custom theme configuration  
**Component Library**: Radix UI with custom cybersecurity styling  

## 🌈 Color System

### OKLCH Color Palette

```css
/* Primary Color System */
:root {
  /* Core Matrix Green Variations */
  --primary: oklch(0.7 0.2 150);           /* Main matrix green */
  --primary-foreground: oklch(0.05 0 0);   /* Near black for contrast */
  
  /* Background Colors */
  --background: oklch(0.05 0 0);           /* Deep black background */
  --foreground: oklch(0.8 0.15 150);       /* Light green text */
  
  /* Card & Surface Colors */
  --card: oklch(0.08 0 0);                 /* Slightly lighter black */
  --card-foreground: oklch(0.8 0.15 150);  /* Light green text */
  
  /* Muted Colors */
  --muted: oklch(0.12 0 0);                /* Dark gray backgrounds */
  --muted-foreground: oklch(0.5 0.1 150);  /* Dim green text */
  
  /* Accent Colors */
  --accent: oklch(0.15 0 0);               /* Subtle accent background */
  --accent-foreground: oklch(0.8 0.15 150); /* Green accent text */
  
  /* Secondary Colors */
  --secondary: oklch(0.15 0 0);            /* Dark secondary */
  --secondary-foreground: oklch(0.8 0.15 150); /* Light secondary text */
  
  /* Border & Input Colors */
  --border: oklch(0.8 0.15 150);           /* Green borders */
  --input: oklch(0.12 0 0);                /* Input backgrounds */
  --ring: oklch(0.7 0.2 150);              /* Focus ring color */
  
  /* Destructive/Error Colors */
  --destructive: oklch(0.6 0.2 0);         /* Red for errors */
  
  /* Chart Colors (for analytics) */
  --chart-1: oklch(0.7 0.2 150);          /* Primary green */
  --chart-2: oklch(0.6 0.2 200);          /* Cyan variant */
  --chart-3: oklch(0.5 0.2 250);          /* Blue variant */
  --chart-4: oklch(0.8 0.2 100);          /* Yellow variant */
  --chart-5: oklch(0.65 0.2 300);         /* Magenta variant */
  
  /* Sidebar Colors */
  --sidebar: oklch(0.08 0 0);              /* Sidebar background */
  --sidebar-foreground: oklch(0.8 0.15 150); /* Sidebar text */
  --sidebar-primary: oklch(0.7 0.2 150);   /* Sidebar active items */
  --sidebar-primary-foreground: oklch(0.05 0 0); /* Sidebar active text */
  --sidebar-accent: oklch(0.15 0 0);       /* Sidebar hover */
  --sidebar-accent-foreground: oklch(0.8 0.15 150); /* Sidebar hover text */
  --sidebar-border: oklch(0.2 0.05 150);   /* Sidebar borders */
  --sidebar-ring: oklch(0.7 0.2 150);      /* Sidebar focus */
}
```

### Color Usage Guidelines

```css
/* Text Hierarchy */
.text-primary {
  color: oklch(0.8 0.15 150);     /* Main body text */
}

.text-secondary {
  color: oklch(0.5 0.1 150);      /* Secondary text */
}

.text-accent {
  color: oklch(0.7 0.2 150);      /* Accent/link text */
}

.text-muted {
  color: oklch(0.4 0.1 150);      /* Muted/disabled text */
}

/* Background Variations */
.bg-surface-1 {
  background: oklch(0.05 0 0);    /* Main background */
}

.bg-surface-2 {
  background: oklch(0.08 0 0);    /* Card backgrounds */
}

.bg-surface-3 {
  background: oklch(0.12 0 0);    /* Input/muted backgrounds */
}

.bg-surface-4 {
  background: oklch(0.15 0 0);    /* Hover/accent backgrounds */
}
```

## 🔤 Typography System

### Font Configuration

```css
/* Font Family Hierarchy */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Courier New', monospace;
}

.font-display {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* Font Size Scale */
.text-xs {
  font-size: 0.75rem;    /* 12px */
  line-height: 1rem;     /* 16px */
}

.text-sm {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.25rem;  /* 20px */
}

.text-base {
  font-size: 1rem;       /* 16px */
  line-height: 1.5rem;   /* 24px */
}

.text-lg {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.75rem;  /* 28px */
}

.text-xl {
  font-size: 1.25rem;    /* 20px */
  line-height: 1.75rem;  /* 28px */
}

.text-2xl {
  font-size: 1.5rem;     /* 24px */
  line-height: 2rem;     /* 32px */
}

.text-3xl {
  font-size: 1.875rem;   /* 30px */
  line-height: 2.25rem;  /* 36px */
}
```

### Typography Components

```css
/* Headings */
.heading-1 {
  font-size: 2.25rem;    /* 36px */
  font-weight: 700;
  line-height: 2.5rem;   /* 40px */
  letter-spacing: -0.025em;
  color: oklch(0.9 0.15 150);
}

.heading-2 {
  font-size: 1.875rem;   /* 30px */
  font-weight: 600;
  line-height: 2.25rem;  /* 36px */
  letter-spacing: -0.025em;
  color: oklch(0.85 0.15 150);
}

.heading-3 {
  font-size: 1.5rem;     /* 24px */
  font-weight: 600;
  line-height: 2rem;     /* 32px */
  color: oklch(0.8 0.15 150);
}

/* Terminal Text */
.terminal-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: oklch(0.7 0.2 150);
  background: oklch(0.05 0 0);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid oklch(0.2 0.1 150);
}

/* Code Text */
.code-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  background: oklch(0.08 0 0);
  color: oklch(0.7 0.2 150);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  border: 1px solid oklch(0.15 0.05 150);
}
```

## 🎭 Animation System

### Matrix Rain Effect

```css
/* Matrix Rain Animation */
@keyframes matrix-rain {
  0% {
    transform: translateY(-100vh);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

.matrix-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.matrix-column {
  position: absolute;
  top: -100vh;
  color: oklch(0.7 0.2 150);
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.2;
  animation: matrix-rain linear infinite;
  opacity: 0.3;
}

/* Matrix Column Variations */
.matrix-column:nth-child(odd) {
  animation-duration: 3s;
  opacity: 0.2;
}

.matrix-column:nth-child(even) {
  animation-duration: 5s;
  opacity: 0.4;
}

.matrix-column:nth-child(3n) {
  animation-duration: 4s;
  opacity: 0.3;
  color: oklch(0.6 0.2 150);
}
```

### Terminal Cursor Animation

```css
/* Terminal Cursor Blink */
@keyframes cursor-blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.terminal-cursor {
  animation: cursor-blink 1s infinite;
  color: oklch(0.7 0.2 150);
  font-weight: bold;
}

.terminal-cursor::after {
  content: '█';
  animation: cursor-blink 1s infinite;
}
```

### Glitch Effects

```css
/* Glitch Animation */
@keyframes glitch {
  0% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  20% {
    transform: translate(-2px, 2px);
    filter: hue-rotate(90deg);
  }
  40% {
    transform: translate(-2px, -2px);
    filter: hue-rotate(180deg);
  }
  60% {
    transform: translate(2px, 2px);
    filter: hue-rotate(270deg);
  }
  80% {
    transform: translate(2px, -2px);
    filter: hue-rotate(360deg);
  }
  100% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
}

.glitch {
  animation: glitch 0.3s infinite;
}

.glitch-hover:hover {
  animation: glitch 0.3s infinite;
}

/* Text Glitch Effect */
.text-glitch {
  position: relative;
  color: oklch(0.8 0.15 150);
}

.text-glitch::before,
.text-glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.text-glitch::before {
  animation: glitch-1 0.5s infinite;
  color: oklch(0.7 0.2 200);
  z-index: -1;
}

.text-glitch::after {
  animation: glitch-2 0.5s infinite;
  color: oklch(0.6 0.2 300);
  z-index: -2;
}

@keyframes glitch-1 {
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
}

@keyframes glitch-2 {
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(2px, -2px);
  }
  40% {
    transform: translate(2px, 2px);
  }
  60% {
    transform: translate(-2px, -2px);
  }
  80% {
    transform: translate(-2px, 2px);
  }
}
```

### Scanlines Effect

```css
/* Scanlines Overlay */
.scanlines {
  position: relative;
}

.scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    transparent 50%,
    rgba(0, 255, 65, 0.03) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1;
}

/* Animated Scanlines */
@keyframes scanlines-move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 4px;
  }
}

.scanlines-animated::before {
  animation: scanlines-move 0.1s linear infinite;
}
```

## 🧩 Component Styling System

### Button Components

```css
/* Base Button Styles */
.btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
}

.btn-base:focus-visible {
  outline: none;
  ring: 2px solid oklch(0.7 0.2 150);
  ring-offset: 2px;
  ring-offset-color: oklch(0.05 0 0);
}

.btn-base:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Primary Button (Hacker Style) */
.btn-primary {
  background: linear-gradient(
    45deg,
    transparent,
    oklch(0.7 0.2 150 / 0.1),
    transparent
  );
  border: 1px solid oklch(0.7 0.2 150);
  color: oklch(0.7 0.2 150);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    oklch(0.7 0.2 150 / 0.4),
    transparent
  );
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  box-shadow: 0 0 20px oklch(0.7 0.2 150 / 0.5);
  text-shadow: 0 0 10px oklch(0.7 0.2 150);
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: oklch(0.08 0 0);
  border: 1px solid oklch(0.2 0.1 150);
  color: oklch(0.8 0.15 150);
}

.btn-secondary:hover {
  background: oklch(0.12 0 0);
  border-color: oklch(0.7 0.2 150);
  color: oklch(0.7 0.2 150);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  border: 1px solid transparent;
  color: oklch(0.6 0.1 150);
}

.btn-ghost:hover {
  background: oklch(0.08 0 0);
  color: oklch(0.8 0.15 150);
}

/* Destructive Button */
.btn-destructive {
  background: oklch(0.6 0.2 0);
  border: 1px solid oklch(0.6 0.2 0);
  color: oklch(1 0 0);
}

.btn-destructive:hover {
  background: oklch(0.7 0.2 0);
  box-shadow: 0 0 15px oklch(0.6 0.2 0 / 0.5);
}

/* Button Sizes */
.btn-sm {
  height: 2rem;
  padding: 0 0.75rem;
  font-size: 0.75rem;
}

.btn-md {
  height: 2.5rem;
  padding: 0 1rem;
  font-size: 0.875rem;
}

.btn-lg {
  height: 3rem;
  padding: 0 1.5rem;
  font-size: 1rem;
}

.btn-icon {
  height: 2.5rem;
  width: 2.5rem;
  padding: 0;
}
```

### Input Components

```css
/* Base Input Styles */
.input-base {
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid oklch(0.2 0.1 150);
  background: oklch(0.08 0 0);
  padding: 0 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: oklch(0.8 0.15 150);
  transition: all 0.2s ease;
}

.input-base::placeholder {
  color: oklch(0.5 0.1 150);
}

.input-base:focus {
  outline: none;
  border-color: oklch(0.7 0.2 150);
  ring: 2px solid oklch(0.7 0.2 150 / 0.2);
  background: oklch(0.05 0 0);
}

.input-base:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input with Icon */
.input-with-icon {
  position: relative;
}

.input-with-icon .input-base {
  padding-left: 2.5rem;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: oklch(0.5 0.1 150);
  width: 1rem;
  height: 1rem;
}

/* Error State */
.input-error {
  border-color: oklch(0.6 0.2 0);
  ring: 2px solid oklch(0.6 0.2 0 / 0.2);
}

.input-error:focus {
  border-color: oklch(0.6 0.2 0);
  ring: 2px solid oklch(0.6 0.2 0 / 0.2);
}

/* Success State */
.input-success {
  border-color: oklch(0.7 0.2 150);
  ring: 2px solid oklch(0.7 0.2 150 / 0.2);
}
```

### Card Components

```css
/* Base Card */
.card {
  background: oklch(0.08 0 0);
  border: 1px solid oklch(0.15 0.05 150);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 
    0 1px 3px oklch(0 0 0 / 0.12),
    0 1px 2px oklch(0 0 0 / 0.24);
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    oklch(0.7 0.2 150 / 0.5),
    transparent
  );
}

/* Interactive Card */
.card-interactive {
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-interactive:hover {
  border-color: oklch(0.7 0.2 150);
  box-shadow: 
    0 4px 12px oklch(0 0 0 / 0.15),
    0 2px 4px oklch(0 0 0 / 0.12),
    0 0 0 1px oklch(0.7 0.2 150 / 0.1);
  transform: translateY(-2px);
}

/* Terminal Card */
.card-terminal {
  background: linear-gradient(135deg, oklch(0.05 0 0) 0%, oklch(0.08 0 0) 100%);
  border: 1px solid oklch(0.7 0.2 150);
  box-shadow: 
    0 0 20px oklch(0.7 0.2 150 / 0.3),
    inset 0 0 20px oklch(0.7 0.2 150 / 0.1);
  font-family: 'JetBrains Mono', monospace;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid oklch(0.15 0.05 150);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: oklch(0.8 0.15 150);
  margin: 0;
}

.card-description {
  color: oklch(0.6 0.1 150);
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}
```

### Progress Components

```css
/* Progress Bar */
.progress-container {
  position: relative;
  overflow: hidden;
  background: oklch(0.12 0 0);
  border-radius: 0.375rem;
  height: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, oklch(0.7 0.2 150), oklch(0.6 0.2 150));
  box-shadow: 0 0 10px oklch(0.7 0.2 150 / 0.5);
  border-radius: 0.375rem;
  transition: width 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(
    to right,
    transparent,
    oklch(0.9 0.15 150 / 0.3)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(20px);
  }
}

/* Circular Progress */
.progress-circle {
  transform: rotate(-90deg);
}

.progress-circle-bg {
  fill: none;
  stroke: oklch(0.12 0 0);
  stroke-width: 8;
}

.progress-circle-fg {
  fill: none;
  stroke: oklch(0.7 0.2 150);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease;
}
```

### Status Indicators

```css
/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
}

.status-active {
  background: oklch(0.7 0.2 150 / 0.1);
  color: oklch(0.7 0.2 150);
  border: 1px solid oklch(0.7 0.2 150 / 0.2);
}

.status-completed {
  background: oklch(0.6 0.2 200 / 0.1);
  color: oklch(0.6 0.2 200);
  border: 1px solid oklch(0.6 0.2 200 / 0.2);
}

.status-paused {
  background: oklch(0.65 0.2 80 / 0.1);
  color: oklch(0.65 0.2 80);
  border: 1px solid oklch(0.65 0.2 80 / 0.2);
}

.status-error {
  background: oklch(0.6 0.2 0 / 0.1);
  color: oklch(0.6 0.2 0);
  border: 1px solid oklch(0.6 0.2 0 / 0.2);
}

/* Status Indicator Dots */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.status-dot.active {
  background-color: oklch(0.7 0.2 150);
}

.status-dot.completed {
  background-color: oklch(0.6 0.2 200);
}

.status-dot.paused {
  background-color: oklch(0.65 0.2 80);
}

.status-dot.error {
  background-color: oklch(0.6 0.2 0);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
```

## 🎬 Interactive Elements

### Hover Effects

```css
/* Glow Hover Effect */
.hover-glow {
  transition: all 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 
    0 0 20px oklch(0.7 0.2 150 / 0.4),
    0 0 40px oklch(0.7 0.2 150 / 0.2),
    0 0 60px oklch(0.7 0.2 150 / 0.1);
  transform: translateY(-2px);
}

/* Scale Hover Effect */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Lift Hover Effect */
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 8px 25px oklch(0 0 0 / 0.15),
    0 4px 10px oklch(0 0 0 / 0.1);
}

/* Border Glow Effect */
.border-glow {
  position: relative;
  border: 1px solid oklch(0.2 0.1 150);
  transition: all 0.3s ease;
}

.border-glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(
    45deg,
    oklch(0.7 0.2 150),
    oklch(0.6 0.2 200),
    oklch(0.7 0.2 150)
  );
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.border-glow:hover::before {
  opacity: 1;
}
```

### Loading States

```css
/* Spinner Loading */
.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid oklch(0.2 0.1 150);
  border-top: 2px solid oklch(0.7 0.2 150);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    oklch(0.08 0 0) 0%,
    oklch(0.12 0 0) 50%,
    oklch(0.08 0 0) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.25rem;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Pulse Loading */
.pulse {
  animation: pulse-loading 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-loading {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Tailwind CSS Breakpoints */
.responsive-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Small screens (sm: 640px and up) */
@media (min-width: 640px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Medium screens (md: 768px and up) */
@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* Large screens (lg: 1024px and up) */
@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

/* Extra large screens (xl: 1280px and up) */
@media (min-width: 1280px) {
  .responsive-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
```

### Mobile Optimizations

```css
/* Mobile-First Typography */
.mobile-heading {
  font-size: 1.5rem;
  line-height: 2rem;
}

@media (min-width: 768px) {
  .mobile-heading {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
}

/* Touch-Friendly Interactions */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: oklch(0.08 0 0);
  border-top: 1px solid oklch(0.15 0.05 150);
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

@media (min-width: 1024px) {
  .mobile-nav {
    display: none;
  }
}
```

## 🎯 Accessibility Features

### Focus Management

```css
/* Focus Visible Styles */
.focus-visible {
  outline: none;
}

.focus-visible:focus-visible {
  outline: 2px solid oklch(0.7 0.2 150);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: oklch(0.05 0 0);
  color: oklch(0.7 0.2 150);
  padding: 8px;
  text-decoration: none;
  border-radius: 0.25rem;
  border: 1px solid oklch(0.7 0.2 150);
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### High Contrast Mode Support

```css
/* High Contrast Media Query */
@media (prefers-contrast: high) {
  :root {
    --primary: oklch(0.9 0.3 150);
    --background: oklch(0 0 0);
    --foreground: oklch(1 0 0);
    --border: oklch(0.9 0.3 150);
  }
  
  .card {
    border-width: 2px;
  }
  
  .btn-primary {
    border-width: 2px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .matrix-rain {
    display: none;
  }
}
```

## 🎨 Custom Scrollbar

```css
/* Webkit Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: oklch(0.08 0 0);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: oklch(0.7 0.2 150);
  border-radius: 4px;
  border: 1px solid oklch(0.05 0 0);
}

::-webkit-scrollbar-thumb:hover {
  background: oklch(0.6 0.2 150);
}

::-webkit-scrollbar-corner {
  background: oklch(0.08 0 0);
}

/* Firefox Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: oklch(0.7 0.2 150) oklch(0.08 0 0);
}
```

This comprehensive UI/UX documentation provides the complete foundation for recreating the cybersecurity-themed design system in the Next.js version of the platform, ensuring consistent visual identity and user experience across all components.