# Component Structure

This directory contains all reusable React components organized by functionality.

## Directory Structure

```
src/components/
├── common/           # Shared UI components
├── effects/          # Animation and effect components
├── games/           # Game-related components
├── landing/         # Landing page specific components
├── terminal/        # Terminal simulation components
├── ui/             # Base UI components (shadcn/ui)
└── index.ts        # Main export file
```

## Component Categories

### Common Components (`/common`)

- **DifficultyBadge**: Displays difficulty levels with appropriate colors
- **ProgressBar**: Reusable progress indicator with optional percentage
- **StatCard**: Card component for displaying statistics with icons

### Effects Components (`/effects`)

- **TypewriterText**: Animated typewriter text effect

### Game Components (`/games`)

- **CipherGame**: Caesar cipher decoding challenge
- **HashCrackGame**: MD5 hash cracking challenge
- **PortScanGame**: Port scanning simulation
- **GameSelector**: Container component that manages game selection

### Landing Page Components (`/landing`)

- **HeroSection**: Main hero area with typewriter text and terminal demo
- **FeaturesSection**: Training modules showcase
- **StatDisplay**: Statistics display for hero section
- **FeatureCard**: Individual feature cards
- **InteractiveDemoSection**: Live cyber range demonstration
- **ThreatIntelligence**: Real-time threat statistics
- **ChallengeCard**: Interactive security challenges
- **HackerChallenges**: Game challenges container
- **CTASection**: Call-to-action section
- **Footer**: Site footer

### Terminal Components (`/terminal`)

- **TerminalWindow**: Base terminal window with macOS-style controls
- **LiveTerminal**: Animated terminal with live command execution

## Usage Examples

### Importing Components

```tsx
// Import specific components
import { DifficultyBadge, ProgressBar } from '@/components/common';
import { TypewriterText } from '@/components/effects';
import { GameSelector } from '@/components/games';

// Import all from a category
import { HeroSection, FeaturesSection } from '@/components/landing';

// Import everything
import * from '@/components';
```

### Component Props

All components are fully typed with TypeScript interfaces. Check individual component files for detailed prop definitions.

### Styling

Components use Tailwind CSS classes and follow the cybersecurity theme with green color schemes. All components are responsive and follow consistent design patterns.

## Best Practices

1. **Reusability**: Components are designed to be reusable across different pages
2. **Type Safety**: All components have proper TypeScript interfaces
3. **Consistent Styling**: Follow the established color scheme and spacing
4. **Performance**: Components are optimized for performance with proper React patterns
5. **Accessibility**: Components follow accessibility best practices

## Adding New Components

1. Create the component in the appropriate category directory
2. Add proper TypeScript interfaces
3. Export the component in the category's `index.ts` file
4. Update this README if adding a new category
5. Follow the established naming conventions and patterns
