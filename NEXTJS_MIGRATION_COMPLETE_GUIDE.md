# Next.js Migration Complete Guide

## 🚀 Migration Overview

**Target Framework**: Next.js 15 with App Router  
**State Management**: TanStack Query + Zustand  
**Styling**: Tailwind CSS v4 (unchanged)  
**Database**: MongoDB with Mongoose (unchanged)  
**Authentication**: NextAuth.js with JWT  
**Deployment**: Vercel (recommended) or self-hosted  

## 📋 Migration Plan

### Phase 1: Project Setup & Configuration
1. Initialize Next.js project with App Router
2. Configure TypeScript and Tailwind CSS
3. Set up project structure and file organization
4. Configure environment variables and secrets

### Phase 2: Backend Integration
1. Migrate API routes to Next.js API routes
2. Set up middleware for authentication and security
3. Configure database connections and models
4. Implement API route handlers

### Phase 3: Frontend Migration
1. Convert React components to Next.js components
2. Replace React Router with Next.js routing
3. Migrate Redux to TanStack Query + Zustand
4. Update authentication system

### Phase 4: Admin Panel Integration
1. Create admin layout and routing
2. Migrate admin components and pages
3. Integrate admin authentication
4. Update admin API calls

### Phase 5: Testing & Optimization
1. Implement testing strategies
2. Performance optimization
3. SEO and accessibility improvements
4. Deployment configuration

## 🛠️ Project Setup

### 1. Initialize Next.js Project

```bash
# Create new Next.js project
npx create-next-app@latest hack-the-world-nextjs --typescript --tailwind --eslint --app --src-dir

cd hack-the-world-nextjs

# Install additional dependencies
npm install @tanstack/react-query @tanstack/react-query-devtools zustand next-themes
npm install @radix-ui/react-* # Install all Radix components
npm install @heroicons/react lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install js-cookie @types/js-cookie
npm install date-fns class-variance-authority clsx tailwind-merge

# Install Next.js specific packages
npm install next-auth
npm install @auth/mongodb-adapter
npm install @vercel/analytics @vercel/speed-insights

# Development dependencies
npm install -D @types/node
npm install -D eslint-config-next
npm install -D @next/bundle-analyzer
```

### 2. Project Structure

```
hack-the-world-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Dashboard route group
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── progress/
│   │   │   └── profile/
│   │   ├── admin/             # Admin routes
│   │   │   ├── dashboard/
│   │   │   ├── phases/
│   │   │   ├── modules/
│   │   │   ├── content/
│   │   │   └── users/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── phases/
│   │   │   ├── modules/
│   │   │   ├── content/
│   │   │   ├── enrollments/
│   │   │   ├── progress/
│   │   │   └── achievements/
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── loading.tsx        # Global loading UI
│   │
│   ├── components/            # Shared components
│   │   ├── ui/               # Radix UI components
│   │   ├── layout/           # Layout components
│   │   ├── forms/            # Form components
│   │   ├── content/          # Content-specific components
│   │   └── admin/            # Admin-specific components
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── api/              # API client configuration
│   │   ├── auth/             # Authentication utilities
│   │   ├── db/               # Database utilities
│   │   ├── utils/            # General utilities
│   │   └── validations/      # Zod schemas
│   │
│   ├── stores/               # Zustand stores
│   │   ├── authStore.ts      # Authentication store
│   │   ├── uiStore.ts        # UI state store
│   │   └── settingsStore.ts  # User settings store
│   │
│   ├── types/                # TypeScript types
│   │   ├── api.ts            # API types
│   │   ├── auth.ts           # Authentication types
│   │   ├── course.ts         # Course types
│   │   └── user.ts           # User types
│   │
│   └── middleware.ts         # Next.js middleware
│
├── public/                   # Static assets
├── docs/                     # Documentation
├── .env.local               # Environment variables
├── .env.example             # Environment template
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

### 3. Configuration Files

#### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'matrix-rain': 'matrix-rain linear infinite',
        'cursor-blink': 'cursor-blink 1s infinite',
        'glitch': 'glitch 0.3s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🔐 Authentication Migration

### 1. NextAuth.js Configuration

#### `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { User } from '@/lib/db/models/User';
import { connectDB } from '@/lib/db/connection';

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          return null;
        }

        await connectDB();

        // Find user by email or username
        const user = await User.findOne({
          $or: [
            { email: credentials.login.toLowerCase() },
            { username: credentials.login.toLowerCase() },
          ],
        }).select('+password +security');

        if (!user) {
          return null;
        }

        // Check if account is locked
        if (user.security.lockUntil && user.security.lockUntil > Date.now()) {
          throw new Error('Account temporarily locked');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          // Increment login attempts
          await incrementLoginAttempts(user);
          return null;
        }

        // Check admin status for admin users
        if (user.role === 'admin' && user.adminStatus !== 'active') {
          throw new Error('Admin account not activated');
        }

        // Reset login attempts on successful login
        if (user.security.loginAttempts > 0) {
          await User.findByIdAndUpdate(user._id, {
            $unset: {
              'security.loginAttempts': 1,
              'security.lockUntil': 1,
            },
          });
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, {
          'security.lastLogin': new Date(),
        });

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
          adminStatus: user.adminStatus,
          profile: user.profile,
          stats: user.stats,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.adminStatus = user.adminStatus;
        token.profile = user.profile;
        token.stats = user.stats;
        token.currentStreak = user.currentStreak;
        token.longestStreak = user.longestStreak;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.adminStatus = token.adminStatus;
        session.user.profile = token.profile;
        session.user.stats = token.stats;
        session.user.currentStreak = token.currentStreak;
        session.user.longestStreak = token.longestStreak;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Helper function for login attempts
async function incrementLoginAttempts(user: any) {
  const maxAttempts = 5;
  const lockTime = 30 * 60 * 1000; // 30 minutes

  const updates: any = { $inc: { 'security.loginAttempts': 1 } };

  if (user.security.lockUntil && user.security.lockUntil < Date.now()) {
    updates.$set = { 'security.loginAttempts': 1 };
    updates.$unset = { 'security.lockUntil': 1 };
  } else if (user.security.loginAttempts + 1 >= maxAttempts && !user.security.lockUntil) {
    updates.$set = { 'security.lockUntil': Date.now() + lockTime };
  }

  return User.findByIdAndUpdate(user._id, updates);
}
```

### 2. Authentication Store (Zustand)

#### `src/stores/authStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  lastLoginAttempt: number | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: true,
      loginAttempts: 0,
      lastLoginAttempt: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      
      incrementLoginAttempts: () => {
        const currentAttempts = get().loginAttempts;
        set({
          loginAttempts: currentAttempts + 1,
          lastLoginAttempt: Date.now(),
        });
      },
      
      resetLoginAttempts: () => set({
        loginAttempts: 0,
        lastLoginAttempt: null,
      }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        loginAttempts: 0,
        lastLoginAttempt: null,
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        loginAttempts: state.loginAttempts,
        lastLoginAttempt: state.lastLoginAttempt,
      }),
    }
  )
);
```

### 3. Authentication Provider

#### `src/components/providers/AuthProvider.tsx`
```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { setUser, setAuthenticated, setLoading } = useAuthStore();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
      
      if (session?.user) {
        setUser(session.user as any);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    }
  }, [session, status, setUser, setAuthenticated, setLoading]);

  return <>{children}</>;
}
```

### 4. Middleware for Route Protection

#### `src/middleware.ts`
```typescript
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/register');
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
    const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin');

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirect unauthenticated users to login
    if (!isAuthPage && !isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Check admin access
    if ((isAdminPage || isApiAdminRoute) && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Check admin status
    if ((isAdminPage || isApiAdminRoute) && 
        token?.role === 'admin' && 
        token?.adminStatus !== 'active') {
      return NextResponse.redirect(new URL('/admin/pending', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Let middleware handle authorization
    },
  }
);

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api/auth (NextAuth API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 🗄️ Database Integration

### 1. Database Connection

#### `src/lib/db/connection.ts`
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global variable to store the connection
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
```

### 2. User Model Migration

#### `src/lib/db/models/User.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  stats: {
    totalPoints: number;
    level: number;
    coursesCompleted: number;
    labsCompleted: number;
    gamesCompleted: number;
    totalStudyTime: number;
  };
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  adminStatus?: 'pending' | 'active' | 'suspended';
  security: {
    passwordChangedAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date;
    twoFactorEnabled: boolean;
  };
  preferences: {
    emailNotifications: boolean;
    progressNotifications: boolean;
    achievementNotifications: boolean;
    theme: 'dark' | 'light' | 'auto';
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  profile: {
    firstName: String,
    lastName: String,
    displayName: String,
    avatar: String,
    bio: { type: String, maxlength: 500 },
    location: String,
    website: String,
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner',
  },
  stats: {
    totalPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    coursesCompleted: { type: Number, default: 0 },
    labsCompleted: { type: Number, default: 0 },
    gamesCompleted: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 },
  },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: Date,
  adminStatus: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: function(this: IUser) {
      return this.role === 'admin' ? 'pending' : undefined;
    },
  },
  security: {
    passwordChangedAt: { type: Date, default: Date.now },
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    twoFactorEnabled: { type: Boolean, default: false },
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    progressNotifications: { type: Boolean, default: true },
    achievementNotifications: { type: Boolean, default: true },
    theme: {
      type: String,
      enum: ['dark', 'light', 'auto'],
      default: 'dark',
    },
    language: { type: String, default: 'en' },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual fields
userSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.profile.firstName} ${this.profile.lastName}`.trim();
});

userSchema.virtual('isAccountLocked').get(function(this: IUser) {
  return !!(this.security.lockUntil && this.security.lockUntil > new Date());
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'stats.totalPoints': -1 });
userSchema.index({ currentStreak: -1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
```

## 🔌 API Route Migration

### 1. API Route Structure

#### `src/app/api/phases/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connection';
import { Phase } from '@/lib/db/models/Phase';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const isActive = searchParams.get('isActive');
    const sort = searchParams.get('sort') || 'order';
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build filter
    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== null) filter.isActive = isActive === 'true';

    // Execute query
    const phases = await Phase.find(filter)
      .sort({ [sort]: 1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Phase.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        phases,
        pagination: {
          total,
          page: Math.floor(skip / limit) + 1,
          limit,
          hasNext: skip + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Get phases error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch phases',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const phase = new Phase(body);
    await phase.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Phase created successfully',
        data: { phase },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create phase error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create phase',
      },
      { status: 500 }
    );
  }
}
```

### 2. Dynamic API Routes

#### `src/app/api/phases/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/connection';
import { Phase } from '@/lib/db/models/Phase';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    
    const phase = await Phase.findById(params.id).lean();
    
    if (!phase) {
      return NextResponse.json(
        { success: false, message: 'Phase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { phase },
    });
  } catch (error) {
    console.error('Get phase error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch phase',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const phase = await Phase.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!phase) {
      return NextResponse.json(
        { success: false, message: 'Phase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Phase updated successfully',
      data: { phase },
    });
  } catch (error) {
    console.error('Update phase error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update phase',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const phase = await Phase.findByIdAndDelete(params.id);

    if (!phase) {
      return NextResponse.json(
        { success: false, message: 'Phase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Phase deleted successfully',
    });
  } catch (error) {
    console.error('Delete phase error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete phase',
      },
      { status: 500 }
    );
  }
}
```

## 📊 State Management Migration

### 1. TanStack Query Setup

#### `src/lib/api/queryClient.ts`
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
```

#### `src/components/providers/QueryProvider.tsx`
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { queryClient } from '@/lib/api/queryClient';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 2. API Client Configuration

#### `src/lib/api/client.ts`
```typescript
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthHeaders() {
    const session = await getSession();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    const headers = await this.getAuthHeaders();
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### 3. Query Hooks

#### `src/lib/api/hooks/usePhases.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Phase, PhasesResponse, PhaseResponse } from '@/types/api';

interface PhaseFilters {
  difficulty?: string;
  isActive?: boolean;
  sort?: string;
  limit?: number;
  skip?: number;
}

export function usePhases(filters?: PhaseFilters) {
  return useQuery({
    queryKey: ['phases', filters],
    queryFn: () => apiClient.get<PhasesResponse>('/phases', filters),
    select: (data) => data.data,
  });
}

export function usePhase(id: string) {
  return useQuery({
    queryKey: ['phases', id],
    queryFn: () => apiClient.get<PhaseResponse>(`/phases/${id}`),
    select: (data) => data.data.phase,
    enabled: !!id,
  });
}

export function useCreatePhase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Phase>) => 
      apiClient.post<PhaseResponse>('/phases', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
    },
  });
}

export function useUpdatePhase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Phase> }) =>
      apiClient.put<PhaseResponse>(`/phases/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
      queryClient.invalidateQueries({ queryKey: ['phases', id] });
    },
  });
}

export function useDeletePhase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/phases/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
    },
  });
}
```

## 🎨 Component Migration

### 1. Layout Components

#### `src/app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Hack The World - Cybersecurity Learning Platform',
  description: 'Learn cybersecurity through hands-on practice with interactive terminals, AI tools, and practical exercises.',
  keywords: 'cybersecurity, hacking, learning, education, security, terminal, labs',
  authors: [{ name: 'Hack The World Team' }],
  openGraph: {
    title: 'Hack The World - Cybersecurity Learning Platform',
    description: 'Learn cybersecurity through hands-on practice',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-mono antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

#### `src/components/providers/Providers.tsx`
```typescript
'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
```

### 2. Page Components

#### `src/app/(dashboard)/dashboard/page.tsx`
```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useEnrollments } from '@/lib/api/hooks/useEnrollments';
import { useStreakStatus } from '@/lib/api/hooks/useStreak';
import { StreakDisplay } from '@/components/streak/StreakDisplay';
import { EnrolledCourses } from '@/components/courses/EnrolledCourses';
import { ProgressOverview } from '@/components/progress/ProgressOverview';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments({});
  const { data: streakData, isLoading: streakLoading } = useStreakStatus();

  if (enrollmentsLoading || streakLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {session?.user?.profile?.displayName || session?.user?.username}!
        </h1>
        <p className="text-muted-foreground">
          Continue your cybersecurity learning journey
        </p>
      </div>

      {/* Streak Display */}
      {streakData?.streak && (
        <StreakDisplay streak={streakData.streak} />
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrolled Courses */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Courses</h2>
          {enrollments?.enrollments ? (
            <EnrolledCourses enrollments={enrollments.enrollments} />
          ) : (
            <div className="card text-center py-8">
              <p className="text-muted-foreground">No enrolled courses yet</p>
              <a href="/courses" className="text-primary hover:text-primary/80 mt-2 inline-block">
                Browse available courses
              </a>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Progress Overview</h2>
          <ProgressOverview />
        </div>
      </div>
    </div>
  );
}
```

### 3. Route Groups for Organization

#### `src/app/(auth)/layout.tsx`
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto p-6">
        {children}
      </div>
    </div>
  );
}
```

#### `src/app/(dashboard)/layout.tsx`
```typescript
import { Navigation } from '@/components/layout/Navigation';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <Navigation />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

## 🚀 Deployment Configuration

### 1. Environment Variables

#### `.env.example`
```env
# Database
MONGODB_URI=mongodb://localhost:27017/hack-the-world

# NextAuth.js
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# External Services
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000/api
VERCEL_URL=your-vercel-domain.vercel.app
```

### 2. Vercel Deployment

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://your-domain.vercel.app/api"
    }
  }
}
```

### 3. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "build-analyze": "ANALYZE=true npm run build",
    "db:seed": "tsx scripts/seed.ts",
    "db:migrate": "tsx scripts/migrate.ts"
  }
}
```

## 🧪 Testing Migration

### 1. Jest Configuration

#### `jest.config.js`
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/not-found.tsx',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### 2. Testing Utilities

#### `src/__tests__/utils/test-utils.tsx`
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: any;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    session = null,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const testQueryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <QueryClientProvider client={testQueryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
```

## 📊 Performance Optimization

### 1. Bundle Analysis

```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

### 2. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

export function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      {...props}
    />
  );
}
```

### 3. Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/content/VideoPlayer'), {
  loading: () => <LoadingSkeleton />,
  ssr: false,
});

const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  loading: () => <AdminLoadingSkeleton />,
});
```

This comprehensive Next.js migration guide provides everything needed to successfully migrate the entire Hack The World platform from the current React + Express setup to a modern Next.js 15 application with App Router, maintaining all features and functionality while gaining the benefits of server-side rendering, improved performance, and better developer experience.