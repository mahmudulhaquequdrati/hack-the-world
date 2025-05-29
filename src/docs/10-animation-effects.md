# Animation Effects

## Overview

The platform features sophisticated animation effects that create an immersive cyberpunk experience, with Matrix-style digital rain, smooth transitions, and interactive elements that respond to user actions.

## Matrix Digital Rain Effect

### Implementation

```typescript
// Matrix Rain Component
export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const matrix =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    const letters = Array(256).join("1").split("");

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      letters.map((y_pos, index) => {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        const x_pos = index * 10;
        ctx.fillText(text, x_pos, y_pos);

        if (y_pos > 100 + Math.random() * 10000) {
          letters[index] = 0;
        } else {
          letters[index] = y_pos + 10;
        }
      });
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" />;
};
```

### Configuration Options

- **Density**: Adjustable character density (1-10)
- **Speed**: Animation speed control (0.5x - 3x)
- **Colors**: Customizable color schemes
- **Characters**: Different character sets (Katakana, Binary, Custom)

## Interactive Animations

### Hover Effects

```css
.cyber-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cyber-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 0, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.cyber-button:hover::before {
  left: 100%;
}

.cyber-button:hover {
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
}
```

### Page Transitions

```typescript
// Framer Motion page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};
```

## Terminal Animation Effects

### Typing Effect

```typescript
export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};
```

### Glitch Effects

```css
.glitch {
  position: relative;
  color: #00ff00;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
    0.025em 0.04em 0 #fffc00;
  animation: glitch 725ms infinite;
}

.glitch span {
  position: absolute;
  top: 0;
  left: 0;
}

.glitch span:first-child {
  animation: glitch 500ms infinite;
  color: #00fffc;
  z-index: -1;
}

.glitch span:last-child {
  animation: glitch 375ms infinite;
  color: #fc00ff;
  z-index: -2;
}

@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
      0.025em 0.04em 0 #fffc00;
  }
  15% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
      0.025em 0.04em 0 #fffc00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
      -0.05em -0.05em 0 #fffc00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
      -0.05em -0.05em 0 #fffc00;
  }
  50% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
      0 -0.04em 0 #fffc00;
  }
  99% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
      0 -0.04em 0 #fffc00;
  }
  100% {
    text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
      -0.04em -0.025em 0 #fffc00;
  }
}
```

## Loading Animations

### Circuit Board Loading

```typescript
const CircuitLoader: React.FC = () => {
  return (
    <div className="circuit-loader">
      <div className="circuit-line horizontal top" />
      <div className="circuit-line horizontal bottom" />
      <div className="circuit-line vertical left" />
      <div className="circuit-line vertical right" />
      <div className="circuit-node" />
      <div className="loading-text">INITIALIZING...</div>
    </div>
  );
};
```

### Progress Bars

```css
.cyber-progress {
  width: 100%;
  height: 6px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  position: relative;
  overflow: hidden;
}

.cyber-progress::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00ffff, #00ff00);
  animation: progress-glow 2s ease-in-out infinite;
}

@keyframes progress-glow {
  0%,
  100% {
    box-shadow: 0 0 5px #00ff00;
  }
  50% {
    box-shadow: 0 0 15px #00ff00, 0 0 25px #00ff00;
  }
}
```

## Performance Considerations

### Optimization Strategies

- **RAF-based animations**: Use requestAnimationFrame for smooth 60fps
- **CSS transforms**: Prefer transform/opacity for hardware acceleration
- **Will-change property**: Hint browser about animated elements
- **Intersection Observer**: Only animate visible elements

### Animation Controls

```typescript
// Respect user preferences
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
};
```

## Testing Animations

- **Visual regression testing**: Chromatic for animation states
- **Performance testing**: Monitor FPS and CPU usage
- **Accessibility testing**: Ensure animations don't cause issues
- **Cross-browser testing**: Verify animation consistency

## Future Enhancements

- **3D effects**: WebGL-based 3D animations
- **Particle systems**: Advanced particle effects
- **Sound integration**: Audio-reactive animations
- **AI-generated**: Dynamic animation patterns
