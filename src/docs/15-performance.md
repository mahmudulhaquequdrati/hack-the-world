# Performance Optimization

## Overview

The platform is engineered for optimal performance through advanced bundle optimization, intelligent loading strategies, and comprehensive performance monitoring to ensure fast, responsive user experiences across all devices.

## Bundle Optimization

### Webpack Configuration

```typescript
// webpack.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { splitVendorChunkPlugin } from "vite";

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
    }),
  ],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
          ],
          "utils-vendor": ["lodash-es", "date-fns"],
          "terminal-vendor": ["xterm", "xterm-addon-fit"],

          // Feature chunks
          games: ["src/components/games/index.ts"],
          labs: ["src/components/labs/index.ts"],
          analytics: ["src/lib/analytics/index.ts"],
          "ai-features": ["src/lib/ai/index.ts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log"],
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "lodash-es"],
    exclude: ["@vite/client", "@vite/env"],
  },
});
```

### Code Splitting Strategy

```typescript
// Dynamic imports for route-based code splitting
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load major routes
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Courses = lazy(() => import("@/pages/Courses"));
const Labs = lazy(() => import("@/pages/Labs"));
const Games = lazy(() => import("@/pages/Games"));
const Analytics = lazy(() => import("@/pages/Analytics"));

// Component-level splitting
const Terminal = lazy(() => import("@/components/terminal/Terminal"));
const AIPlayground = lazy(() => import("@/components/ai/AIPlayground"));

// Higher-order component for lazy loading
const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType
) => {
  return (props: P) => (
    <Suspense fallback={fallback ? <fallback /> : <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

// Feature-based splitting
const features = {
  terminal: () => import("@/features/terminal"),
  games: () => import("@/features/games"),
  labs: () => import("@/features/labs"),
  ai: () => import("@/features/ai"),
};

// Dynamic feature loading
export const loadFeature = async (featureName: keyof typeof features) => {
  const feature = await features[featureName]();
  return feature.default;
};
```

### Tree Shaking Optimization

```typescript
// Optimized imports to enable tree shaking
// ❌ Bad - imports entire library
import * as _ from "lodash";

// ✅ Good - imports only specific functions
import { debounce, throttle } from "lodash-es";

// ❌ Bad - imports entire icon library
import * as Icons from "lucide-react";

// ✅ Good - imports specific icons
import { Play, Pause, Settings } from "lucide-react";

// Utility for conditional imports
export const importOnDemand = async <T>(
  condition: boolean,
  importFn: () => Promise<{ default: T }>
): Promise<T | null> => {
  if (!condition) return null;
  const module = await importFn();
  return module.default;
};

// Example usage
const HeavyChart = await importOnDemand(
  showAdvancedCharts,
  () => import("@/components/charts/HeavyChart")
);
```

## Loading Strategies

### Progressive Loading

```typescript
interface LoadingPriority {
  critical: string[];
  important: string[];
  normal: string[];
  low: string[];
}

class ProgressiveLoader {
  private loadingQueue: Map<string, Promise<any>> = new Map();
  private loadedResources: Set<string> = new Set();

  async loadByPriority(resources: LoadingPriority): Promise<void> {
    // Load critical resources first (blocking)
    await this.loadResources(resources.critical, true);

    // Load important resources (non-blocking)
    this.loadResources(resources.important, false);

    // Schedule normal priority resources
    setTimeout(() => {
      this.loadResources(resources.normal, false);
    }, 100);

    // Schedule low priority resources when idle
    requestIdleCallback(() => {
      this.loadResources(resources.low, false);
    });
  }

  private async loadResources(
    resources: string[],
    blocking: boolean
  ): Promise<void> {
    const promises = resources.map((resource) => this.loadResource(resource));

    if (blocking) {
      await Promise.all(promises);
    } else {
      Promise.all(promises).catch(console.error);
    }
  }

  private async loadResource(resource: string): Promise<any> {
    if (this.loadedResources.has(resource)) {
      return Promise.resolve();
    }

    if (this.loadingQueue.has(resource)) {
      return this.loadingQueue.get(resource);
    }

    const promise = this.doLoadResource(resource);
    this.loadingQueue.set(resource, promise);

    try {
      const result = await promise;
      this.loadedResources.add(resource);
      return result;
    } finally {
      this.loadingQueue.delete(resource);
    }
  }

  private async doLoadResource(resource: string): Promise<any> {
    switch (this.getResourceType(resource)) {
      case "component":
        return import(resource);
      case "data":
        return fetch(resource).then((res) => res.json());
      case "image":
        return this.preloadImage(resource);
      default:
        return Promise.resolve();
    }
  }
}
```

### Intelligent Prefetching

```typescript
class IntelligentPrefetcher {
  private prefetchQueue: Set<string> = new Set();
  private userBehavior: UserBehaviorTracker;
  private networkInfo: NetworkInformation;

  constructor() {
    this.userBehavior = new UserBehaviorTracker();
    this.networkInfo = (navigator as any).connection;
  }

  async prefetchBasedOnBehavior(): Promise<void> {
    const predictions = await this.userBehavior.predictNextActions();

    for (const prediction of predictions) {
      if (this.shouldPrefetch(prediction)) {
        this.prefetchResource(prediction.resource);
      }
    }
  }

  private shouldPrefetch(prediction: Prediction): boolean {
    // Don't prefetch on slow connections
    if (
      this.networkInfo?.effectiveType === "2g" ||
      this.networkInfo?.effectiveType === "3g"
    ) {
      return false;
    }

    // Don't prefetch if user has data saver enabled
    if (this.networkInfo?.saveData) {
      return false;
    }

    // Only prefetch high-probability predictions
    return prediction.probability > 0.7;
  }

  async prefetchResource(resource: string): Promise<void> {
    if (this.prefetchQueue.has(resource)) return;

    this.prefetchQueue.add(resource);

    try {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = resource;
      document.head.appendChild(link);
    } catch (error) {
      console.warn("Prefetch failed:", resource, error);
    }
  }

  // Route-based prefetching
  prefetchRouteResources(currentRoute: string): void {
    const likelyNextRoutes = this.getLikelyNextRoutes(currentRoute);

    likelyNextRoutes.forEach((route) => {
      const routeBundle = this.getRouteBundlePath(route);
      this.prefetchResource(routeBundle);
    });
  }
}
```

### Virtual Scrolling

```typescript
interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  renderItem,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## Image Optimization

### Responsive Images

```typescript
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  quality = 80,
  placeholder = "blur",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>();

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Generate responsive image URLs
        const webpSrc = await generateWebPVersion(src, quality);
        const fallbackSrc = await generateFallback(src, quality);

        // Use WebP if supported, otherwise fallback
        const supportsWebP = await checkWebPSupport();
        setImageSrc(supportsWebP ? webpSrc : fallbackSrc);
      } catch (error) {
        setImageSrc(src); // Fallback to original
      }
    };

    if (priority) {
      loadImage();
    } else {
      // Lazy load non-priority images
      const timer = setTimeout(loadImage, 100);
      return () => clearTimeout(timer);
    }
  }, [src, priority, quality]);

  return (
    <picture>
      <source
        srcSet={generateSrcSet(src, "webp")}
        sizes={sizes}
        type="image/webp"
      />
      <source
        srcSet={generateSrcSet(src, "jpg")}
        sizes={sizes}
        type="image/jpeg"
      />
      <img
        src={imageSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </picture>
  );
};

// Image optimization utilities
const generateSrcSet = (src: string, format: string): string => {
  const sizes = [320, 640, 960, 1280, 1920];
  return sizes
    .map((size) => `${getOptimizedImageUrl(src, size, format)} ${size}w`)
    .join(", ");
};

const getOptimizedImageUrl = (
  src: string,
  width: number,
  format: string
): string => {
  // Integrate with image optimization service (e.g., Cloudinary, ImageKit)
  return `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},f_${format},q_auto/${encodeURIComponent(
    src
  )}`;
};
```

### Image Lazy Loading

```typescript
const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(imgRef);
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div ref={imgRef} className="lazy-image-container">
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setHasLoaded(true)}
          style={{
            opacity: hasLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      )}
      {!hasLoaded && <div className="image-placeholder" />}
    </div>
  );
};
```

## Caching Strategies

### Service Worker Implementation

```typescript
// sw.js - Service Worker
const CACHE_NAME = "cyber-platform-v1.2.0";
const STATIC_CACHE = "static-assets-v1";
const DYNAMIC_CACHE = "dynamic-content-v1";
const API_CACHE = "api-responses-v1";

const STATIC_ASSETS = [
  "/",
  "/static/js/main.js",
  "/static/css/main.css",
  "/manifest.json",
];

// Cache strategies
const cacheStrategies = {
  "cache-first": ["images", "fonts", "static-assets"],
  "network-first": ["api", "user-data"],
  "stale-while-revalidate": ["courses", "challenges"],
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Determine cache strategy
  const strategy = getCacheStrategy(url);

  switch (strategy) {
    case "cache-first":
      event.respondWith(cacheFirst(request));
      break;
    case "network-first":
      event.respondWith(networkFirst(request));
      break;
    case "stale-while-revalidate":
      event.respondWith(staleWhileRevalidate(request));
      break;
    default:
      event.respondWith(fetch(request));
  }
});

// Cache-first strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  return (
    cached ||
    fetch(request).then((response) => {
      if (response.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    })
  );
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return caches.match(request);
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}
```

### Memory Management

```typescript
class MemoryManager {
  private cache: Map<string, any> = new Map();
  private maxSize: number = 100; // Maximum cache entries
  private ttl: number = 5 * 60 * 1000; // 5 minutes TTL

  set(key: string, value: any, customTTL?: number): void {
    // Evict expired entries
    this.evictExpired();

    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: customTTL || this.ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  private evictExpired(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// React hook for memory-efficient data fetching
const useMemoryEfficientData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttl?: number; enabled?: boolean }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const memoryManager = useRef(new MemoryManager());

  useEffect(() => {
    if (options?.enabled === false) return;

    const cachedData = memoryManager.current.get(key);

    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);

    fetcher()
      .then((result) => {
        setData(result);
        memoryManager.current.set(key, result, options?.ttl);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [key, options?.enabled, options?.ttl]);

  return { data, loading, error };
};
```

## Performance Monitoring

### Core Web Vitals

```typescript
class PerformanceMonitor {
  private observer: PerformanceObserver;
  private metrics: Map<string, number> = new Map();

  constructor() {
    this.setupObservers();
    this.measureCustomMetrics();
  }

  private setupObservers(): void {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric("LCP", lastEntry.startTime);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric(
          "FID",
          (entry as any).processingStart - entry.startTime
        );
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      this.recordMetric("CLS", clsValue);
    }).observe({ entryTypes: ["layout-shift"] });
  }

  private measureCustomMetrics(): void {
    // Time to Interactive (TTI)
    this.measureTTI();

    // Custom learning platform metrics
    this.measureTerminalLoadTime();
    this.measureCourseRenderTime();
    this.measureInteractionLatency();
  }

  private async measureTTI(): Promise<void> {
    // Implementation of TTI measurement
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const tti = await this.calculateTTI(navigationEntry);
    this.recordMetric("TTI", tti);
  }

  private measureTerminalLoadTime(): void {
    performance.mark("terminal-start");

    // Measure when terminal is fully interactive
    const checkTerminalReady = () => {
      const terminal = document.querySelector(".terminal");
      if (terminal && terminal.classList.contains("ready")) {
        performance.mark("terminal-end");
        performance.measure("terminal-load", "terminal-start", "terminal-end");

        const measure = performance.getEntriesByName("terminal-load")[0];
        this.recordMetric("terminal-load-time", measure.duration);
      } else {
        requestAnimationFrame(checkTerminalReady);
      }
    };

    checkTerminalReady();
  }

  recordMetric(name: string, value: number): void {
    this.metrics.set(name, value);

    // Send to analytics service
    this.sendToAnalytics(name, value);

    // Check against thresholds
    this.checkPerformanceThresholds(name, value);
  }

  private sendToAnalytics(metric: string, value: number): void {
    // Send to your analytics service
    if (typeof gtag !== "undefined") {
      gtag("event", "performance_metric", {
        metric_name: metric,
        metric_value: Math.round(value),
        custom_parameter: value,
      });
    }
  }

  private checkPerformanceThresholds(metric: string, value: number): void {
    const thresholds = {
      LCP: 2500, // 2.5 seconds
      FID: 100, // 100 milliseconds
      CLS: 0.1, // 0.1
      TTI: 3800, // 3.8 seconds
    };

    const threshold = thresholds[metric];
    if (threshold && value > threshold) {
      console.warn(
        `Performance threshold exceeded for ${metric}: ${value} > ${threshold}`
      );

      // Trigger performance alert
      this.triggerPerformanceAlert(metric, value, threshold);
    }
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const monitor = useRef<PerformanceMonitor>();

  useEffect(() => {
    monitor.current = new PerformanceMonitor();

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(monitor.current!.getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};
```

### Real User Monitoring (RUM)

```typescript
class RealUserMonitoring {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Page load timing
    window.addEventListener("load", () => {
      this.trackPageLoad();
    });

    // User interactions
    document.addEventListener(
      "click",
      (event) => {
        this.trackInteraction("click", event);
      },
      { passive: true }
    );

    // Network issues
    window.addEventListener("online", () => {
      this.trackNetworkEvent("online");
    });

    window.addEventListener("offline", () => {
      this.trackNetworkEvent("offline");
    });

    // Errors
    window.addEventListener("error", (event) => {
      this.trackError("javascript", event.error);
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.trackError("promise", event.reason);
    });
  }

  trackPageLoad(): void {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    const timing = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      connection: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      domLoading:
        navigation.domContentLoadedEventStart - navigation.responseEnd,
      domComplete:
        navigation.loadEventStart - navigation.domContentLoadedEventStart,
    };

    this.sendMetric("page_load_timing", timing);
  }

  trackInteraction(type: string, event: Event): void {
    const target = event.target as HTMLElement;
    const selector = this.getElementSelector(target);

    performance.mark(`interaction-${type}-start`);

    // Measure interaction latency
    requestIdleCallback(() => {
      performance.mark(`interaction-${type}-end`);
      performance.measure(
        `interaction-${type}`,
        `interaction-${type}-start`,
        `interaction-${type}-end`
      );

      const measure = performance.getEntriesByName(`interaction-${type}`)[0];

      this.sendMetric("user_interaction", {
        type,
        selector,
        latency: measure.duration,
        timestamp: Date.now(),
      });
    });
  }

  trackFeatureUsage(feature: string, metadata?: Record<string, any>): void {
    this.sendMetric("feature_usage", {
      feature,
      metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    });
  }

  private sendMetric(type: string, data: any): void {
    // Batch metrics to reduce network requests
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/rum",
        JSON.stringify({
          type,
          data,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: Date.now(),
          sessionId: this.sessionId,
        })
      );
    }
  }
}
```

## Database Optimization

### Query Optimization

```typescript
// Optimized data fetching with proper indexing and caching
class DataAccessLayer {
  private cache: Map<string, any> = new Map();

  async getUserProgress(userId: string): Promise<UserProgress> {
    const cacheKey = `user_progress_${userId}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Optimized query with proper indexes
    const query = `
      SELECT
        up.*,
        c.title as course_title,
        c.total_lessons,
        COUNT(ucl.lesson_id) as completed_lessons
      FROM user_progress up
      LEFT JOIN courses c ON up.course_id = c.id
      LEFT JOIN user_completed_lessons ucl ON up.user_id = ucl.user_id
        AND up.course_id = ucl.course_id
      WHERE up.user_id = $1
      GROUP BY up.id, c.id
      ORDER BY up.last_accessed DESC
    `;

    const result = await this.executeQuery(query, [userId]);

    // Cache for 5 minutes
    this.cache.set(cacheKey, result);
    setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);

    return result;
  }

  async getCourseAnalytics(courseId: string): Promise<CourseAnalytics> {
    // Use materialized view for complex analytics
    const query = `
      SELECT * FROM course_analytics_mv
      WHERE course_id = $1
    `;

    return this.executeQuery(query, [courseId]);
  }

  // Batch operations for better performance
  async updateMultipleProgress(updates: ProgressUpdate[]): Promise<void> {
    const values = updates
      .map(
        (update, index) =>
          `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
            index * 4 + 4
          })`
      )
      .join(", ");

    const query = `
      INSERT INTO user_progress (user_id, course_id, lesson_id, progress)
      VALUES ${values}
      ON CONFLICT (user_id, course_id, lesson_id)
      DO UPDATE SET
        progress = EXCLUDED.progress,
        updated_at = NOW()
    `;

    const params = updates.flatMap((u) => [
      u.userId,
      u.courseId,
      u.lessonId,
      u.progress,
    ]);
    await this.executeQuery(query, params);
  }
}
```

## Future Performance Enhancements

- **HTTP/3 support**: Leverage QUIC protocol for faster connections
- **WebAssembly integration**: Computationally intensive tasks in WASM
- **Edge computing**: Distribute content closer to users
- **Progressive Web App**: Advanced caching and offline capabilities
- **Resource hints**: DNS prefetch, preconnect, and modulepreload
