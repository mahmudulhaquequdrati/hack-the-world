# Accessibility

## Overview

The platform is designed with accessibility as a core principle, ensuring compliance with WCAG 2.1 AA standards and providing an inclusive learning experience for users with diverse abilities and needs.

## WCAG 2.1 Compliance

### Four Principles of Accessibility

#### 1. Perceivable

```typescript
// Color contrast implementation
const colorContrastRatios = {
  normalText: 4.5, // WCAG AA standard
  largeText: 3.0, // 18pt+ or 14pt+ bold
  enhanced: 7.0, // WCAG AAA standard
};

const checkColorContrast = (
  foreground: string,
  background: string
): boolean => {
  const contrast = calculateContrastRatio(foreground, background);
  return contrast >= colorContrastRatios.normalText;
};

// Semantic HTML structure
const AccessibleHeading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}> = ({ level, children }) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={`heading-${level}`}
      role="heading"
      aria-level={level}
    >
      {children}
    </HeadingTag>
  );
};

// Alternative text for images
const AccessibleImage: React.FC<{
  src: string;
  alt: string;
  decorative?: boolean;
}> = ({ src, alt, decorative = false }) => {
  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      role={decorative ? "presentation" : undefined}
      aria-hidden={decorative}
    />
  );
};
```

#### 2. Operable

```typescript
// Keyboard navigation support
const KeyboardNavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip links functionality
      if (
        event.key === "Tab" &&
        !event.shiftKey &&
        event.target === document.body
      ) {
        const skipLink = document.getElementById("skip-to-main");
        skipLink?.focus();
      }

      // Escape key to close modals
      if (event.key === "Escape") {
        const openModal = document.querySelector(
          '[role="dialog"][aria-hidden="false"]'
        );
        if (openModal) {
          closeModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <>{children}</>;
};

// Focus management for dynamic content
const useFocusManagement = () => {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    element?.focus();
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => container.removeEventListener("keydown", handleTabKey);
  };

  return { focusElement, trapFocus };
};
```

#### 3. Understandable

```typescript
// Form validation with clear error messages
interface FormError {
  field: string;
  message: string;
  type: "required" | "format" | "length" | "custom";
}

const AccessibleForm: React.FC<{
  onSubmit: (data: FormData) => void;
  errors: FormError[];
}> = ({ onSubmit, errors }) => {
  const getFieldError = (fieldName: string) =>
    errors.find((error) => error.field === fieldName);

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset>
        <legend>User Registration</legend>

        <div className="form-group">
          <label htmlFor="email" className="required">
            Email Address
            <span aria-label="required" className="required-indicator">
              *
            </span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            aria-required="true"
            aria-invalid={getFieldError("email") ? "true" : "false"}
            aria-describedby={
              getFieldError("email") ? "email-error" : undefined
            }
          />
          {getFieldError("email") && (
            <div
              id="email-error"
              role="alert"
              aria-live="polite"
              className="error-message"
            >
              {getFieldError("email")?.message}
            </div>
          )}
        </div>
      </fieldset>
    </form>
  );
};

// Language support
const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getTextDirection(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

#### 4. Robust

```typescript
// ARIA implementation for custom components
const AccessibleDropdown: React.FC<{
  label: string;
  options: Option[];
  onSelect: (option: Option) => void;
}> = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (selectedIndex >= 0) {
          onSelect(options[selectedIndex]);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        <span id="dropdown-label">{label}</span>
        <span aria-hidden="true">▼</span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby="dropdown-label"
          className="dropdown-list"
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={index === selectedIndex}
              className={index === selectedIndex ? "selected" : ""}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## Screen Reader Support

### ARIA Live Regions

```typescript
// Announcements for dynamic content updates
const LiveRegion: React.FC<{
  message: string;
  priority: "polite" | "assertive";
  clearAfter?: number;
}> = ({ message, priority, clearAfter = 5000 }) => {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);

    if (clearAfter) {
      const timer = setTimeout(() => setCurrentMessage(""), clearAfter);
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div aria-live={priority} aria-atomic="true" className="sr-only">
      {currentMessage}
    </div>
  );
};

// Progress announcements
const ProgressAnnouncer: React.FC<{
  currentStep: number;
  totalSteps: number;
  stepName: string;
}> = ({ currentStep, totalSteps, stepName }) => {
  const message = `Step ${currentStep} of ${totalSteps}: ${stepName}`;

  return <LiveRegion message={message} priority="polite" />;
};

// Error announcements
const ErrorAnnouncer: React.FC<{ errors: string[] }> = ({ errors }) => {
  const errorMessage =
    errors.length > 0
      ? `${errors.length} error${
          errors.length > 1 ? "s" : ""
        } found. ${errors.join(". ")}`
      : "";

  return <LiveRegion message={errorMessage} priority="assertive" />;
};
```

### Screen Reader Optimizations

```typescript
// Content structure for screen readers
const SkipLinks: React.FC = () => {
  return (
    <nav className="skip-links" aria-label="Skip navigation links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
      <a href="#search" className="skip-link">
        Skip to search
      </a>
    </nav>
  );
};

// Descriptive headings and landmarks
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SkipLinks />
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          {/* Navigation content */}
        </nav>
      </header>

      <main id="main-content" role="main">
        {children}
      </main>

      <aside role="complementary" aria-label="Related links">
        {/* Sidebar content */}
      </aside>

      <footer role="contentinfo">{/* Footer content */}</footer>
    </>
  );
};

// Table accessibility
const AccessibleTable: React.FC<{
  data: TableData[];
  columns: TableColumn[];
  caption: string;
}> = ({ data, columns, caption }) => {
  return (
    <table role="table">
      <caption>{caption}</caption>
      <thead>
        <tr role="row">
          {columns.map((column, index) => (
            <th
              key={column.key}
              role="columnheader"
              scope="col"
              aria-sort={column.sortable ? "none" : undefined}
              tabIndex={column.sortable ? 0 : -1}
            >
              {column.title}
              {column.required && (
                <span aria-label="required" className="required-indicator">
                  *
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} role="row">
            {columns.map((column, colIndex) => (
              <td
                key={`${rowIndex}-${colIndex}`}
                role={colIndex === 0 ? "rowheader" : "gridcell"}
                scope={colIndex === 0 ? "row" : undefined}
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Motor Accessibility

### Touch and Click Targets

```css
/* Minimum touch target sizes */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Larger targets for better accessibility */
.touch-target-large {
  min-width: 60px;
  min-height: 60px;
}

/* Spacing between interactive elements */
.interactive-group > * + * {
  margin-left: 8px;
}

@media (hover: none) and (pointer: coarse) {
  /* Touch device optimizations */
  .touch-target {
    min-width: 48px;
    min-height: 48px;
  }
}
```

### Keyboard Shortcuts

```typescript
const KeyboardShortcuts: React.FC = () => {
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Only trigger if not in input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Alt key combinations
      if (event.altKey) {
        switch (event.key) {
          case "h":
            event.preventDefault();
            navigateToHome();
            break;
          case "d":
            event.preventDefault();
            navigateToDashboard();
            break;
          case "s":
            event.preventDefault();
            focusSearchInput();
            break;
          case "m":
            event.preventDefault();
            toggleMainMenu();
            break;
        }
      }

      // Global shortcuts
      switch (event.key) {
        case "/":
          event.preventDefault();
          focusSearchInput();
          break;
        case "?":
          event.preventDefault();
          showKeyboardShortcuts();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyboardShortcuts);
    return () =>
      document.removeEventListener("keydown", handleKeyboardShortcuts);
  }, []);

  return null;
};

// Shortcut help modal
const KeyboardShortcutsHelp: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="shortcuts-title"
      aria-modal="true"
      className="modal"
    >
      <div className="modal-content">
        <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
        <dl className="shortcuts-list">
          <dt>Alt + H</dt>
          <dd>Go to Home</dd>
          <dt>Alt + D</dt>
          <dd>Go to Dashboard</dd>
          <dt>Alt + S</dt>
          <dd>Focus Search</dd>
          <dt>/</dt>
          <dd>Quick Search</dd>
          <dt>?</dt>
          <dd>Show this help</dd>
          <dt>Escape</dt>
          <dd>Close dialogs</dd>
        </dl>
        <button onClick={onClose} autoFocus>
          Close
        </button>
      </div>
    </div>
  );
};
```

## Visual Accessibility

### High Contrast Mode

```css
/* High contrast theme */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --text-secondary: #000000;
    --background-primary: #ffffff;
    --background-secondary: #f0f0f0;
    --border-color: #000000;
    --link-color: #0000ee;
    --link-visited: #551a8b;
    --button-bg: #000000;
    --button-text: #ffffff;
    --focus-ring: #ff0000;
  }
}

/* Windows High Contrast Mode detection */
@media (-ms-high-contrast: active) {
  .cyber-button {
    border: 2px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
  }

  .cyber-button:focus {
    outline: 2px solid Highlight;
  }
}

/* Forced colors mode */
@media (forced-colors: active) {
  .custom-styled-element {
    forced-color-adjust: none;
    border: 1px solid CanvasText;
    background: Canvas;
    color: CanvasText;
  }
}
```

### Dark Mode Support

```typescript
const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      if (theme === "auto") {
        document.documentElement.setAttribute(
          "data-theme",
          mediaQuery.matches ? "dark" : "light"
        );
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
    };

    updateTheme();
    mediaQuery.addListener(updateTheme);

    return () => mediaQuery.removeListener(updateTheme);
  }, [theme]);

  return { theme, setTheme };
};

// Theme-aware components
const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="theme-toggle"
    >
      <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
};
```

### Reduced Motion Support

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Disable parallax effects */
  .parallax {
    transform: none !important;
  }

  /* Simplify complex animations */
  .matrix-rain {
    display: none;
  }

  .loading-spinner {
    border: 2px solid #ccc;
    border-top: 2px solid #007bff;
    /* Remove rotation animation */
  }
}

/* Provide static alternatives */
@media (prefers-reduced-motion: reduce) {
  .animated-background {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .hover-effect:hover {
    transform: none;
    transition: background-color 0.2s ease;
  }
}
```

## Cognitive Accessibility

### Content Structure and Navigation

```typescript
// Breadcrumb navigation
const Breadcrumbs: React.FC<{ path: BreadcrumbItem[] }> = ({ path }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {path.map((item, index) => (
          <li key={item.id} className="breadcrumb-item">
            {index < path.length - 1 ? (
              <a href={item.url}>{item.label}</a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < path.length - 1 && (
              <span aria-hidden="true" className="breadcrumb-separator">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Progress indicators
const ProgressIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  steps: ProgressStep[];
}> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
      className="progress-indicator"
    >
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`progress-step ${
              index + 1 === currentStep
                ? "current"
                : index + 1 < currentStep
                ? "completed"
                : "upcoming"
            }`}
            aria-label={`Step ${index + 1}: ${step.title}${
              index + 1 === currentStep
                ? " (current)"
                : index + 1 < currentStep
                ? " (completed)"
                : ""
            }`}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Clear Instructions and Feedback

```typescript
// Instructional content with clear hierarchy
const InstructionalContent: React.FC<{
  title: string;
  objective: string;
  instructions: string[];
  tips?: string[];
}> = ({ title, objective, instructions, tips }) => {
  return (
    <section className="instructional-content">
      <header>
        <h2>{title}</h2>
        <div className="objective">
          <h3>Learning Objective</h3>
          <p>{objective}</p>
        </div>
      </header>

      <div className="instructions">
        <h3>Instructions</h3>
        <ol>
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>

      {tips && (
        <aside className="tips" aria-labelledby="tips-heading">
          <h4 id="tips-heading">Helpful Tips</h4>
          <ul>
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
};

// Clear error messaging
const ErrorMessage: React.FC<{
  error: string;
  suggestions?: string[];
  onRetry?: () => void;
}> = ({ error, suggestions, onRetry }) => {
  return (
    <div role="alert" className="error-container" aria-live="assertive">
      <div className="error-content">
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-message">{error}</p>

        {suggestions && (
          <div className="error-suggestions">
            <h4>Try these solutions:</h4>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {onRetry && (
          <button type="button" onClick={onRetry} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
```

## Testing and Validation

### Automated Accessibility Testing

```typescript
// Integration with axe-core for automated testing
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("Accessibility Tests", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should handle keyboard navigation", () => {
    const { getByRole } = render(<NavigationMenu />);
    const menuButton = getByRole("button", { name: /menu/i });

    // Test keyboard interaction
    fireEvent.keyDown(menuButton, { key: "Enter" });
    expect(getByRole("menu")).toBeVisible();

    fireEvent.keyDown(menuButton, { key: "Escape" });
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should announce dynamic content changes", async () => {
    const { getByRole } = render(<SearchResults />);
    const searchInput = getByRole("searchbox");

    fireEvent.change(searchInput, { target: { value: "cybersecurity" } });

    await waitFor(() => {
      expect(getByRole("status")).toHaveTextContent(/5 results found/i);
    });
  });
});

// Custom accessibility test utilities
const testKeyboardNavigation = (component: ReactWrapper) => {
  const focusableElements = component.find(
    "[tabindex], button, a, input, select, textarea"
  );

  focusableElements.forEach((element, index) => {
    element.simulate("focus");
    expect(element.getDOMNode()).toHaveFocus();

    // Test tab navigation
    if (index < focusableElements.length - 1) {
      element.simulate("keydown", { key: "Tab" });
    }
  });
};

const testScreenReaderContent = (component: ReactWrapper) => {
  // Check for proper heading structure
  const headings = component.find("h1, h2, h3, h4, h5, h6");
  let currentLevel = 0;

  headings.forEach((heading) => {
    const level = parseInt(heading.name().charAt(1));
    expect(level).toBeLessThanOrEqual(currentLevel + 1);
    currentLevel = level;
  });

  // Check for alt text on images
  const images = component.find("img");
  images.forEach((img) => {
    const hasAlt = img.prop("alt") !== undefined;
    const isDecorative =
      img.prop("role") === "presentation" || img.prop("aria-hidden");
    expect(hasAlt || isDecorative).toBe(true);
  });
};
```

### Manual Testing Checklist

```markdown
## Accessibility Manual Testing Checklist

### Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are clearly visible
- [ ] Escape key closes modals and dropdowns
- [ ] Arrow keys work in menus and lists
- [ ] Enter/Space activate buttons and links

### Screen Reader Testing

- [ ] Content is properly structured with headings
- [ ] Form labels are properly associated
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Images have appropriate alt text
- [ ] Tables have proper headers and captions

### Visual Testing

- [ ] Text has sufficient color contrast (4.5:1 minimum)
- [ ] Content is readable at 200% zoom
- [ ] Layout works in portrait and landscape
- [ ] High contrast mode is supported
- [ ] Dark mode is available and functional

### Motor Accessibility

- [ ] Touch targets are at least 44px
- [ ] Hover states have keyboard equivalents
- [ ] Drag and drop has alternatives
- [ ] Time limits can be extended
- [ ] Auto-playing content can be paused

### Cognitive Accessibility

- [ ] Instructions are clear and simple
- [ ] Error messages are helpful
- [ ] Progress indicators show current status
- [ ] Complex interactions have help text
- [ ] Content structure is predictable
```

## Future Accessibility Enhancements

- **Voice navigation**: Integration with voice control systems
- **Eye tracking**: Support for eye-tracking navigation devices
- **Cognitive load reduction**: AI-powered content simplification
- **Personalization**: Adaptive interfaces based on user preferences
- **Real-time captions**: Live captioning for video content
