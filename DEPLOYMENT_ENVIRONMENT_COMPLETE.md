# Deployment & Environment Complete Documentation

## 🚀 Deployment Overview

**Current Setup**: Separate deployments for Frontend, Admin Panel, and Backend  
**Recommended Migration**: Next.js unified deployment with API routes  
**Hosting Options**: Vercel (recommended), Netlify, Railway, or self-hosted  
**Database**: MongoDB Atlas (cloud) or self-hosted MongoDB  
**CDN**: Cloudinary for media assets  

## 🔧 Environment Configuration

### Current Environment Structure

#### Frontend Environment (`.env.local`)
```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
VITE_API_URL_PROD=https://your-backend-domain.com/api

# Application Settings
VITE_APP_NAME=Hack The World
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Cybersecurity Learning Platform

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=false
VITE_ENABLE_DEV_TOOLS=true

# External Services
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Development Settings
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false
```

#### Admin Panel Environment (`.env.local`)
```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
VITE_API_URL_PROD=https://your-backend-domain.com/api

# Admin Settings
VITE_ADMIN_PANEL_NAME=Hack The World Admin
VITE_ADMIN_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ADVANCED_ANALYTICS=true
VITE_ENABLE_BULK_OPERATIONS=true
VITE_ENABLE_SYSTEM_MONITORING=true

# External Services
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name

# Development Settings
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false
```

#### Backend Environment (`.env`)
```env
# Server Configuration
NODE_ENV=development
PORT=5001
SERVER_URL=http://localhost:5001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hack-the-world
MONGODB_URI_TEST=mongodb://localhost:27017/hack-the-world-test
DB_NAME=hack-the-world

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_ISSUER=hack-the-world
JWT_AUDIENCE=hack-the-world-users

# Security Configuration
BCRYPT_SALT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCK_TIME=1800000
PASSWORD_RESET_EXPIRES=600000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10000
AUTH_RATE_LIMIT_MAX=5
REGISTRATION_RATE_LIMIT_MAX=10

# CORS Configuration
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
ADDITIONAL_ORIGINS=http://localhost:3000,http://localhost:3001

# Session Configuration
SESSION_SECRET=your-session-secret-key
SESSION_MAX_AGE=604800000

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_FOLDER=hack-the-world

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=Hack The World <noreply@hacktheworld.com>

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Monitoring & Analytics
SENTRY_DSN=your-sentry-dsn
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
LOGGING_LEVEL=info

# External API Keys (Optional)
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable

# Development Settings
DEBUG_MODE=false
ENABLE_SWAGGER=true
ENABLE_MORGAN_LOGGING=true
ENABLE_CORS_LOGGING=false
```

### Next.js Environment Configuration

#### `.env.local` (Next.js Migration)
```env
# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-min-32-characters
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hack-the-world
DATABASE_URL=mongodb://localhost:27017/hack-the-world

# Application Settings
NEXT_PUBLIC_APP_NAME=Hack The World
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_SECRET_KEY=your-internal-api-secret

# Security Configuration
JWT_SECRET=your-jwt-secret-key
BCRYPT_SALT_ROUNDS=12
CSRF_SECRET=your-csrf-secret

# External Services
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Analytics & Monitoring
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id
SENTRY_DSN=your-sentry-dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=false

# Development Settings
NEXT_PUBLIC_DEV_MODE=true
ANALYZE=false
DISABLE_SOURCE_MAPS=false
```

#### `.env.example` (Template)
```env
# Copy this file to .env.local and fill in your values

# Database (Required)
MONGODB_URI=mongodb://localhost:27017/hack-the-world

# NextAuth.js (Required)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (Required for file uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=your-sentry-dsn

# Development (Optional)
NEXT_PUBLIC_DEV_MODE=true
ANALYZE=false
```

## 🌐 Production Deployment Configurations

### Vercel Deployment

#### `vercel.json`
```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    },
    "app/api/auth/**/*.ts": {
      "maxDuration": 15
    },
    "app/api/upload/**/*.ts": {
      "maxDuration": 60
    }
  },
  "regions": ["iad1"],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url",
    "JWT_SECRET": "@jwt-secret",
    "CLOUDINARY_API_KEY": "@cloudinary-api-key",
    "CLOUDINARY_API_SECRET": "@cloudinary-api-secret",
    "SMTP_PASSWORD": "@smtp-password",
    "SENTRY_DSN": "@sentry-dsn"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://hacktheworld.vercel.app",
      "NEXT_PUBLIC_API_URL": "https://hacktheworld.vercel.app/api"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://hacktheworld.vercel.app"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin/:path*",
      "destination": "/admin/dashboard",
      "permanent": false
    }
  ]
}
```

#### Vercel Environment Variables Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add MONGODB_URI production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add JWT_SECRET production
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production
vercel env add SMTP_PASSWORD production
vercel env add SENTRY_DSN production

# Deploy
vercel --prod
```

### Netlify Deployment

#### `netlify.toml`
```toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[context.production.environment]
  NEXT_PUBLIC_APP_URL = "https://hacktheworld.netlify.app"
  NEXT_PUBLIC_API_URL = "https://hacktheworld.netlify.app/api"

[context.deploy-preview.environment]
  NEXT_PUBLIC_APP_URL = "$DEPLOY_PRIME_URL"
  NEXT_PUBLIC_API_URL = "$DEPLOY_PRIME_URL/api"

[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/admin"
  to = "/admin/dashboard"
  status = 302
```

### Railway Deployment

#### `railway.toml`
```toml
[build]
  builder = "nixpacks"
  buildCommand = "npm run build"

[deploy]
  startCommand = "npm start"
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 10

[environments.production.variables]
  NODE_ENV = "production"
  PORT = "3000"

[environments.production.services.web]
  tcpProxyApplicationPort = 3000
```

### Docker Deployment

#### `Dockerfile`
```dockerfile
# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### `docker-compose.yml`
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/hack-the-world
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - mongo
    networks:
      - app-network

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    networks:
      - app-network

volumes:
  mongo_data:

networks:
  app-network:
    driver: bridge
```

## 🔒 Production Security Configuration

### Security Headers

#### `next.config.js` Security Configuration
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-analytics.com",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Disable powered by header
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Enable SWC minification
  swcMinify: true,

  // Production optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@heroicons/react',
      'lucide-react',
    ],
  },

  // Image optimization
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Output configuration for Docker
  output: 'standalone',
};

module.exports = nextConfig;
```

### Environment Validation

#### `src/lib/env.ts`
```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().url(),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  
  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  
  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASSWORD: z.string().optional(),
  
  // Analytics (optional)
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  NEXT_PUBLIC_DEV_MODE: z.coerce.boolean().default(false),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
```

## 📊 Monitoring & Analytics Setup

### Vercel Analytics

#### `src/app/layout.tsx`
```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Google Analytics

#### `src/lib/analytics.ts`
```typescript
import { env } from '@/lib/env';

export const GA_TRACKING_ID = env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) return;

  // Google tag (gtag.js)
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `;
  document.head.appendChild(script2);
};

// Track page views
export const trackPageView = (url: string) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
  });
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### Sentry Error Monitoring

#### `sentry.client.config.ts`
```typescript
import * as Sentry from '@sentry/nextjs';
import { env } from '@/lib/env';

Sentry.init({
  dsn: env.SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: 0.1,
  
  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: env.NODE_ENV,
  
  // Disable Sentry in development
  enabled: env.NODE_ENV === 'production',
  
  beforeSend(event) {
    // Filter out common development errors
    if (env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
```

#### `sentry.server.config.ts`
```typescript
import * as Sentry from '@sentry/nextjs';
import { env } from '@/lib/env';

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: env.NODE_ENV,
  enabled: env.NODE_ENV === 'production',
});
```

## 🚦 Health Checks & Monitoring

### Health Check API

#### `src/app/api/health/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import mongoose from 'mongoose';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      database: 'unknown',
      memory: 'unknown',
      uptime: process.uptime(),
    },
  };

  try {
    // Database check
    await connectDB();
    checks.checks.database = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
    
    // Memory check
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };
    
    checks.checks.memory = memoryUsageMB.heapUsed < 512 ? 'healthy' : 'warning';
    
    // Overall status
    const isHealthy = checks.checks.database === 'healthy' && 
                     checks.checks.memory !== 'critical';
    
    checks.status = isHealthy ? 'healthy' : 'unhealthy';
    
    return NextResponse.json(checks, {
      status: isHealthy ? 200 : 503,
    });
  } catch (error) {
    checks.status = 'unhealthy';
    checks.checks.database = 'unhealthy';
    
    return NextResponse.json(checks, { status: 503 });
  }
}
```

### Database Backup Scripts

#### `scripts/backup.ts`
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import { env } from '../src/lib/env';

const execAsync = promisify(exec);

async function backupDatabase() {
  const timestamp = new Date().toISOString().split('T')[0];
  const backupName = `hack-the-world-backup-${timestamp}`;
  const outputPath = `./backups/${backupName}`;

  try {
    console.log('Starting database backup...');
    
    const { stdout, stderr } = await execAsync(
      `mongodump --uri="${env.MONGODB_URI}" --out=${outputPath}`
    );
    
    if (stderr) {
      console.error('Backup warnings:', stderr);
    }
    
    console.log('Backup completed successfully:', stdout);
    console.log(`Backup saved to: ${outputPath}`);
    
    // Compress backup
    await execAsync(`tar -czf ${outputPath}.tar.gz ${outputPath}`);
    console.log(`Backup compressed: ${outputPath}.tar.gz`);
    
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

// Run backup
backupDatabase();
```

## 📱 CDN & Asset Optimization

### Cloudinary Configuration

#### `src/lib/cloudinary.ts`
```typescript
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (file: Buffer, folder: string = 'hack-the-world') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1920, height: 1080, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file);
  });
};

export const deleteImage = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
```

### Static Asset Optimization

#### `public/robots.txt`
```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /auth/

Sitemap: https://hacktheworld.vercel.app/sitemap.xml
```

#### `src/app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
```

## 🔧 CI/CD Pipeline

### GitHub Actions

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: npm run test
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI_TEST }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

  deploy-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: https://hacktheworld.vercel.app
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "build:analyze": "ANALYZE=true npm run build",
    "db:seed": "tsx scripts/seed.ts",
    "db:backup": "tsx scripts/backup.ts",
    "db:restore": "tsx scripts/restore.ts",
    "generate:types": "tsx scripts/generate-types.ts",
    "check:env": "tsx scripts/check-env.ts",
    "security:audit": "npm audit && npm audit signatures",
    "deps:update": "npx npm-check-updates -u",
    "clean": "rm -rf .next out dist coverage",
    "postinstall": "prisma generate || true"
  }
}
```

This comprehensive deployment and environment documentation provides everything needed to successfully deploy and maintain the Hack The World platform in production environments, ensuring scalability, security, and reliability.