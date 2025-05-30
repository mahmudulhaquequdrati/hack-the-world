# Deployment Guide - Hack The World

## 📋 Overview

This document provides comprehensive guidance for building, deploying, and maintaining the Hack The World cybersecurity learning platform in production environments.

## 🏗️ Build Configuration

### Vite Production Build

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: true,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react", "framer-motion"],
          router: ["react-router-dom"],
          utils: ["clsx", "tailwind-merge"],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
```

### Build Scripts

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "build:analyze": "npm run build && npx vite-bundle-analyzer",
    "build:prod": "NODE_ENV=production npm run build",
    "build:staging": "NODE_ENV=staging npm run build",
    "preview": "vite preview",
    "preview:network": "vite preview --host",
    "clean": "rm -rf dist node_modules/.vite",
    "prebuild": "npm run clean && npm run type-check && npm run lint"
  }
}
```

## 🌍 Environment Configuration

### Environment Variables

```bash
# .env.production
VITE_APP_NAME=Hack The World
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# API Configuration
VITE_API_BASE_URL=https://api.hacktheworld.com
VITE_API_VERSION=v1
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_MATRIX_EFFECTS=true

# Security
VITE_SECURITY_HEADERS=true
VITE_CSP_ENABLED=true
VITE_HTTPS_ONLY=true

# Performance
VITE_LAZY_LOADING=true
VITE_PREFETCH_COURSES=true
VITE_CACHE_STRATEGY=aggressive

# Third-party Services
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=SENTRY_DSN_URL
VITE_CDN_BASE_URL=https://cdn.hacktheworld.com
```

### Environment-specific Configurations

```typescript
// src/config/environment.ts
interface EnvironmentConfig {
  app: {
    name: string;
    version: string;
    environment: "development" | "staging" | "production";
  };
  api: {
    baseUrl: string;
    version: string;
    timeout: number;
  };
  features: {
    analytics: boolean;
    errorReporting: boolean;
    performanceMonitoring: boolean;
    matrixEffects: boolean;
  };
  security: {
    headers: boolean;
    csp: boolean;
    httpsOnly: boolean;
  };
  performance: {
    lazyLoading: boolean;
    prefetchCourses: boolean;
    cacheStrategy: "none" | "normal" | "aggressive";
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => ({
  app: {
    name: import.meta.env.VITE_APP_NAME || "Hack The World",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    environment: import.meta.env.VITE_APP_ENVIRONMENT || "development",
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
    version: import.meta.env.VITE_API_VERSION || "v1",
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000,
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === "true",
    performanceMonitoring:
      import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === "true",
    matrixEffects: import.meta.env.VITE_ENABLE_MATRIX_EFFECTS === "true",
  },
  security: {
    headers: import.meta.env.VITE_SECURITY_HEADERS === "true",
    csp: import.meta.env.VITE_CSP_ENABLED === "true",
    httpsOnly: import.meta.env.VITE_HTTPS_ONLY === "true",
  },
  performance: {
    lazyLoading: import.meta.env.VITE_LAZY_LOADING === "true",
    prefetchCourses: import.meta.env.VITE_PREFETCH_COURSES === "true",
    cacheStrategy: import.meta.env.VITE_CACHE_STRATEGY || "normal",
  },
});

export const config = getEnvironmentConfig();
```

## 🚀 Deployment Strategies

### Static Site Deployment (Vercel)

```typescript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.hacktheworld.com; media-src 'self' https://cdn.hacktheworld.com;"
        }
      ]
    }
  ],
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "VITE_APP_ENVIRONMENT": "production"
  }
}
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy security headers
COPY --from=builder /app/docker/security-headers.conf /etc/nginx/conf.d/security-headers.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    include /etc/nginx/conf.d/security-headers.conf;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Cache fonts
    location ~* \.(woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Security
    location ~ /\. {
        deny all;
    }
}
```

### AWS S3 + CloudFront Deployment

```yaml
# deploy-aws.yml (GitHub Actions)
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "pnpm"

      - run: pnpm install

      - run: pnpm run build
        env:
          VITE_APP_ENVIRONMENT: production
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Sync to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## 📊 Performance Optimization

### Bundle Analysis and Optimization

```typescript
// scripts/analyze-bundle.ts
import { build } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

async function analyzeBuild() {
  const result = await build({
    plugins: [
      visualizer({
        filename: "bundle-analysis.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "react-vendor";
              if (id.includes("lucide")) return "icons";
              if (id.includes("framer-motion")) return "animations";
              return "vendor";
            }
            if (id.includes("src/components/ui")) return "ui";
            if (id.includes("src/components/games")) return "games";
            if (id.includes("src/components/terminal")) return "terminal";
          },
        },
      },
    },
  });

  console.log("Bundle analysis complete!");
}

analyzeBuild().catch(console.error);
```

### Progressive Web App Configuration

```typescript
// public/sw.js - Service Worker
const CACHE_NAME = "hack-the-world-v1";
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  // Core CSS and JS will be added automatically
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match(request).then((response) => {
            return response || caches.match("/offline.html");
          });
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
```

```json
// public/manifest.json
{
  "name": "Hack The World - Cybersecurity Learning",
  "short_name": "Hack The World",
  "description": "Interactive cybersecurity learning platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#00ff41",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["education", "productivity"],
  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "375x667",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

## 🔧 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: 18
  PNPM_VERSION: 8

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm run type-check

      - name: Lint code
        run: pnpm run lint

      - name: Run tests
        run: pnpm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest

    strategy:
      matrix:
        environment: [staging, production]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build application
        run: pnpm run build
        env:
          VITE_APP_ENVIRONMENT: ${{ matrix.environment }}
          VITE_API_BASE_URL: ${{ secrets[format('API_BASE_URL_{0}', matrix.environment)] }}
          VITE_ANALYTICS_ID: ${{ secrets[format('ANALYTICS_ID_{0}', matrix.environment)] }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-${{ matrix.environment }}
          path: dist/
          retention-days: 30

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    needs: build
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-staging
          path: dist/

      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment..."
          # Add staging deployment commands here

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-production
          path: dist/

      - name: Deploy to production
        run: |
          echo "Deploying to production environment..."
          # Add production deployment commands here

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: "#deployments"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  e2e-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright
        run: npx playwright install

      - name: Run E2E tests
        run: pnpm run test:e2e
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📈 Monitoring and Analytics

### Error Tracking Setup

```typescript
// src/lib/monitoring.ts
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { config } from "@/config/environment";

// Initialize Sentry
if (
  config.features.errorReporting &&
  config.app.environment !== "development"
) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: config.app.environment,
    release: config.app.version,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ],
    tracesSampleRate: config.app.environment === "production" ? 0.1 : 1.0,
    beforeSend(event) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === "ChunkLoadError") {
          return null; // Ignore chunk load errors
        }
      }
      return event;
    },
  });
}

// Performance monitoring
export const trackPerformance = (metricName: string, value: number) => {
  if (config.features.performanceMonitoring) {
    // Send to analytics service
    gtag("event", "timing_complete", {
      name: metricName,
      value: Math.round(value),
    });
  }
};

// User journey tracking
export const trackUserAction = (
  action: string,
  properties?: Record<string, any>
) => {
  if (config.features.analytics) {
    gtag("event", action, properties);
  }
};
```

### Health Check Endpoint

```typescript
// src/utils/healthCheck.ts
interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: {
    [key: string]: {
      status: "pass" | "fail";
      responseTime?: number;
      error?: string;
    };
  };
}

export const performHealthCheck = async (): Promise<HealthStatus> => {
  const checks: HealthStatus["checks"] = {};
  let overallStatus: HealthStatus["status"] = "healthy";

  // Check local storage
  try {
    localStorage.setItem("health-check", "test");
    localStorage.removeItem("health-check");
    checks.localStorage = { status: "pass" };
  } catch (error) {
    checks.localStorage = {
      status: "fail",
      error: "Local storage unavailable",
    };
    overallStatus = "degraded";
  }

  // Check if essential resources are loaded
  try {
    const cssLoaded = document.querySelector('link[rel="stylesheet"]');
    checks.cssLoaded = {
      status: cssLoaded ? "pass" : "fail",
      error: cssLoaded ? undefined : "CSS not loaded",
    };
  } catch (error) {
    checks.cssLoaded = { status: "fail", error: "CSS check failed" };
    overallStatus = "degraded";
  }

  // Check API connectivity (if available)
  if (config.api.baseUrl) {
    try {
      const start = Date.now();
      const response = await fetch(`${config.api.baseUrl}/health`, {
        method: "GET",
        timeout: 5000,
      });
      const responseTime = Date.now() - start;

      checks.apiConnectivity = {
        status: response.ok ? "pass" : "fail",
        responseTime,
        error: response.ok ? undefined : `API returned ${response.status}`,
      };

      if (!response.ok && overallStatus === "healthy") {
        overallStatus = "degraded";
      }
    } catch (error) {
      checks.apiConnectivity = {
        status: "fail",
        error: "API unreachable",
      };
      overallStatus = "degraded";
    }
  }

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
  };
};
```

## 📋 Deployment Checklist

### Pre-deployment Checklist

- [ ] All tests pass (unit, integration, E2E)
- [ ] Code coverage meets threshold (>90%)
- [ ] TypeScript compilation successful
- [ ] ESLint passes with no errors
- [ ] Bundle size within limits (<1MB)
- [ ] Performance metrics meet targets
- [ ] Security headers configured
- [ ] Environment variables set
- [ ] Monitoring and analytics configured

### Post-deployment Checklist

- [ ] Health check endpoint responds
- [ ] Core user flows work correctly
- [ ] Performance metrics are acceptable
- [ ] Error tracking is active
- [ ] Analytics data is flowing
- [ ] CDN cache invalidated (if applicable)
- [ ] Monitoring alerts are active
- [ ] Backup and rollback plan verified

### Rollback Procedure

1. **Immediate Actions**

   - Stop new deployments
   - Assess impact and user reports
   - Check monitoring dashboards

2. **Rollback Steps**

   - Revert to previous stable version
   - Clear CDN caches
   - Verify health checks pass
   - Monitor error rates

3. **Post-rollback**
   - Investigate root cause
   - Create hotfix if necessary
   - Update deployment process
   - Document lessons learned

## 🔐 Security Considerations

### Content Security Policy

```typescript
// Security headers configuration
const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.hacktheworld.com",
    "media-src 'self' https://cdn.hacktheworld.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
```

### Environment Secrets Management

```yaml
# secrets.yml (for CI/CD)
secrets:
  production:
    API_BASE_URL: "https://api.hacktheworld.com"
    ANALYTICS_ID: "GA_MEASUREMENT_ID"
    SENTRY_DSN: "SENTRY_DSN_URL"
    S3_BUCKET: "hacktheworld-prod"
    CLOUDFRONT_DISTRIBUTION_ID: "DISTRIBUTION_ID"

  staging:
    API_BASE_URL: "https://staging-api.hacktheworld.com"
    ANALYTICS_ID: "GA_STAGING_ID"
    SENTRY_DSN: "SENTRY_STAGING_DSN"
    S3_BUCKET: "hacktheworld-staging"
    CLOUDFRONT_DISTRIBUTION_ID: "STAGING_DISTRIBUTION_ID"
```

---

**Deployment Strategy**: Multi-environment with automated CI/CD
**Performance Targets**: <3s load time, <1MB bundle, >90% uptime
**Security**: CSP enabled, HTTPS only, security headers
**Last Updated**: December 2024
