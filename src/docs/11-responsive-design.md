# Responsive Design

## Overview

The platform employs a mobile-first responsive design approach, ensuring optimal user experience across all devices while maintaining the cyberpunk aesthetic and functionality.

## Mobile-First Approach

### Philosophy

Starting with the smallest screen size and progressively enhancing for larger screens ensures:

- **Better performance** on mobile devices
- **Simplified feature prioritization**
- **Future-proof design** for new device sizes
- **Accessibility-first** approach

### Base Mobile Design

```css
/* Mobile-first base styles (320px+) */
.container {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.cyber-card {
  width: 100%;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #00ff00;
  background: rgba(0, 0, 0, 0.8);
}

.cyber-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

## Breakpoint System

### Standard Breakpoints

```typescript
// Tailwind-compatible breakpoints
export const breakpoints = {
  xs: '320px',   // Extra small devices
  sm: '640px',   // Small devices (phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2X large devices
} as const;

// CSS Custom Properties
:root {
  --breakpoint-xs: 320px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Media Queries

```css
/* Mobile-first media queries */
@media (min-width: 640px) {
  .cyber-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .cyber-card {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .cyber-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
```

## React Hooks for Responsive Design

### useBreakpoint Hook

```typescript
import { useState, useEffect } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= 1536) setBreakpoint("2xl");
      else if (width >= 1280) setBreakpoint("xl");
      else if (width >= 1024) setBreakpoint("lg");
      else if (width >= 768) setBreakpoint("md");
      else if (width >= 640) setBreakpoint("sm");
      else setBreakpoint("xs");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};
```

### useMediaQuery Hook

```typescript
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

// Usage examples
const isMobile = useMediaQuery("(max-width: 768px)");
const isDesktop = useMediaQuery("(min-width: 1024px)");
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
```

## Responsive Components

### Adaptive Navigation

```typescript
const Navigation: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="cyber-nav">
      {isMobile ? (
        <>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
            <NavItems />
          </div>
        </>
      ) : (
        <div className="desktop-menu">
          <NavItems />
        </div>
      )}
    </nav>
  );
};
```

### Responsive Grid System

```typescript
interface GridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const ResponsiveGrid: React.FC<GridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
}) => {
  return (
    <div
      className={`grid
        grid-cols-${cols.xs || 1}
        sm:grid-cols-${cols.sm || 2}
        md:grid-cols-${cols.md || 3}
        lg:grid-cols-${cols.lg || 4}
        xl:grid-cols-${cols.xl || cols.lg || 4}
        gap-4
      `}
    >
      {children}
    </div>
  );
};
```

## Typography Responsiveness

### Fluid Typography

```css
/* Fluid font sizes using clamp() */
.title-hero {
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 1.2;
}

.title-section {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  line-height: 1.3;
}

.body-text {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  line-height: 1.6;
}

/* Responsive spacing */
.section-spacing {
  padding-block: clamp(2rem, 5vw, 4rem);
}
```

### Responsive Text Truncation

```typescript
const ResponsiveText: React.FC<{
  text: string;
  maxLength?: { mobile: number; desktop: number };
}> = ({ text, maxLength = { mobile: 50, desktop: 100 } }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const truncateLength = isMobile ? maxLength.mobile : maxLength.desktop;

  const displayText =
    text.length > truncateLength
      ? `${text.substring(0, truncateLength)}...`
      : text;

  return <span>{displayText}</span>;
};
```

## Terminal Responsiveness

### Adaptive Terminal

```typescript
const ResponsiveTerminal: React.FC = () => {
  const breakpoint = useBreakpoint();

  const terminalConfig = {
    xs: { rows: 8, cols: 30, fontSize: "12px" },
    sm: { rows: 12, cols: 40, fontSize: "14px" },
    md: { rows: 16, cols: 60, fontSize: "14px" },
    lg: { rows: 20, cols: 80, fontSize: "16px" },
    xl: { rows: 24, cols: 100, fontSize: "16px" },
  };

  const config = terminalConfig[breakpoint];

  return (
    <div
      className="terminal"
      style={{
        fontSize: config.fontSize,
        width: `${config.cols}ch`,
        height: `${config.rows * 1.5}rem`,
      }}
    >
      <Terminal {...config} />
    </div>
  );
};
```

## Images and Media

### Responsive Images

```typescript
const ResponsiveImage: React.FC<{
  src: string;
  alt: string;
  sizes?: string;
}> = ({ src, alt, sizes = "(max-width: 768px) 100vw, 50vw" }) => {
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      className="responsive-image"
      loading="lazy"
    />
  );
};
```

### Video Responsiveness

```css
.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## Performance Optimization

### Conditional Loading

```typescript
const ConditionalComponent: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      {isDesktop ? (
        <Suspense fallback={<LoadingSkeleton />}>
          <DesktopFeature />
        </Suspense>
      ) : (
        <MobileAlternative />
      )}
    </>
  );
};
```

### Image Optimization

```typescript
const OptimizedImage: React.FC<{
  src: string;
  mobileSize: string;
  desktopSize: string;
}> = ({ src, mobileSize, desktopSize }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const imageSrc = isMobile ? mobileSize : desktopSize;

  return <img src={imageSrc} loading="lazy" />;
};
```

## Testing Responsive Design

### Device Testing

```javascript
// Cypress responsive testing
describe("Responsive Design", () => {
  const viewports = [
    { width: 375, height: 667 }, // iPhone SE
    { width: 768, height: 1024 }, // iPad
    { width: 1920, height: 1080 }, // Desktop
  ];

  viewports.forEach((viewport) => {
    it(`should display correctly at ${viewport.width}x${viewport.height}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/");
      cy.matchImageSnapshot();
    });
  });
});
```

## Accessibility Considerations

### Focus Management

```css
/* Ensure focus indicators scale appropriately */
.cyber-button:focus {
  outline: 2px solid #00ff00;
  outline-offset: clamp(2px, 0.5vw, 4px);
}

/* Touch targets */
@media (hover: none) and (pointer: coarse) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### Screen Reader Support

```typescript
const ResponsiveContent: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <span className="sr-only">
        {isMobile ? "Mobile view active" : "Desktop view active"}
      </span>
      {/* Content */}
    </div>
  );
};
```

## Future Enhancements

- **Container queries**: When browser support improves
- **Dynamic viewport units**: Using dvh, svh, lvh
- **Foldable device support**: Screen spanning API
- **Variable fonts**: Responsive typography improvements
