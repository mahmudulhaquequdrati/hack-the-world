# Frontend Architecture Complete Documentation

## 🏗️ Frontend Architecture Overview

**Framework**: React 18 + TypeScript + Vite  
**State Management**: Redux Toolkit + RTK Query  
**Styling**: Tailwind CSS v4 + Radix UI  
**Routing**: React Router v6  
**Testing**: Vitest + Testing Library  

## 📦 Project Structure

```
frontend/
├── src/
│   ├── app/                     # Redux store configuration
│   │   ├── store.ts            # Store setup with RTK Query
│   │   └── hooks.ts            # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Radix UI styled components
│   │   ├── layout/             # Layout components
│   │   ├── common/             # Shared components
│   │   └── forms/              # Form components
│   │
│   ├── features/               # Feature-based modules
│   │   ├── api/                # RTK Query API slices
│   │   │   ├── apiSlice.ts     # Main API configuration
│   │   │   └── authApi.ts      # Authentication API
│   │   ├── auth/               # Authentication features
│   │   │   ├── components/     # Auth-specific components
│   │   │   ├── hooks/          # Auth hooks
│   │   │   └── authSlice.ts    # Auth state slice
│   │   └── courses/            # Course-related features
│   │
│   ├── pages/                  # Page components
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── courses/            # Course pages
│   │   └── profile/            # Profile pages
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useProgress.ts      # Progress tracking hook
│   │   └── useStreak.ts        # Streak management hook
│   │
│   ├── utils/                  # Utility functions
│   │   ├── api.ts              # API utility functions
│   │   ├── auth.ts             # Auth utility functions
│   │   ├── format.ts           # Formatting utilities
│   │   └── validation.ts       # Validation schemas
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── api.ts              # API response types
│   │   ├── auth.ts             # Authentication types
│   │   ├── course.ts           # Course-related types
│   │   └── user.ts             # User types
│   │
│   ├── assets/                 # Static assets
│   │   ├── images/             # Image files
│   │   └── icons/              # Icon files
│   │
│   ├── styles/                 # Global styles and themes
│   │   └── globals.css         # Global CSS with Tailwind
│   │
│   ├── App.tsx                 # Main App component
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts           # Vite type definitions
│
├── public/                     # Static public assets
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.ts              # Vite configuration
└── vitest.config.ts            # Vitest test configuration
```

## 🛠️ State Management Architecture

### Redux Store Configuration (`/src/app/store.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import { authApi } from '../features/api/authApi';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [apiSlice.endpoints],
      },
    })
      .concat(apiSlice.middleware)
      .concat(authApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Redux Hooks (`/src/app/hooks.ts`)

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 🔌 API Layer Architecture

### Main API Slice (`/src/features/api/apiSlice.ts`)

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token expired, clear auth state
    api.dispatch(logout());
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Phase',
    'Module',
    'Content',
    'Enrollment',
    'Progress',
    'Achievement',
    'Streak'
  ],
  endpoints: (builder) => ({
    // === PHASE ENDPOINTS ===
    getPhases: builder.query<PhasesResponse, void>({
      query: () => '/phases',
      providesTags: ['Phase'],
    }),
    
    getPhasesWithModules: builder.query<PhasesWithModulesResponse, void>({
      query: () => '/phases/with-modules',
      providesTags: ['Phase', 'Module'],
    }),
    
    getPhaseById: builder.query<PhaseResponse, string>({
      query: (id) => `/phases/${id}`,
      providesTags: (result, error, id) => [{ type: 'Phase', id }],
    }),

    // === MODULE ENDPOINTS ===
    getModules: builder.query<ModulesResponse, ModuleFilters>({
      query: (filters) => ({
        url: '/modules',
        params: filters,
      }),
      providesTags: ['Module'],
    }),
    
    getModuleById: builder.query<ModuleResponse, string>({
      query: (id) => `/modules/${id}`,
      providesTags: (result, error, id) => [{ type: 'Module', id }],
    }),
    
    getModuleWithContent: builder.query<ModuleWithContentResponse, string>({
      query: (id) => `/modules/${id}/with-content`,
      providesTags: (result, error, id) => [
        { type: 'Module', id },
        { type: 'Content', id: 'LIST' }
      ],
    }),

    // === CONTENT ENDPOINTS ===
    getContentById: builder.query<ContentResponse, string>({
      query: (id) => `/content/${id}`,
      providesTags: (result, error, id) => [{ type: 'Content', id }],
    }),
    
    getContentWithModuleAndProgress: builder.query<ContentWithProgressResponse, string>({
      query: (id) => `/content/${id}/with-progress`,
      providesTags: (result, error, id) => [
        { type: 'Content', id },
        { type: 'Progress', id }
      ],
    }),

    // === ENROLLMENT ENDPOINTS ===
    getEnrollments: builder.query<EnrollmentsResponse, EnrollmentFilters>({
      query: (filters) => ({
        url: '/enrollments',
        params: filters,
      }),
      providesTags: ['Enrollment'],
    }),
    
    enrollInModule: builder.mutation<EnrollmentResponse, { moduleId: string }>({
      query: ({ moduleId }) => ({
        url: '/enrollments',
        method: 'POST',
        body: { moduleId },
      }),
      invalidatesTags: ['Enrollment', 'Module'],
    }),
    
    updateEnrollmentStatus: builder.mutation<EnrollmentResponse, { 
      id: string; 
      status: EnrollmentStatus 
    }>({
      query: ({ id, status }) => ({
        url: `/enrollments/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Enrollment', id },
        'Enrollment'
      ],
    }),

    // === PROGRESS ENDPOINTS ===
    updateProgress: builder.mutation<ProgressUpdateResponse, ProgressUpdateRequest>({
      query: (data) => ({
        url: '/progress',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { contentId }) => [
        { type: 'Progress', id: contentId },
        'Progress',
        'Enrollment',
        'Streak'
      ],
    }),
    
    getProgressSummary: builder.query<ProgressSummaryResponse, void>({
      query: () => '/progress/summary',
      providesTags: ['Progress'],
    }),

    // === STREAK ENDPOINTS ===
    getStreakStatus: builder.query<StreakStatusResponse, void>({
      query: () => '/streak/status',
      providesTags: ['Streak'],
    }),
    
    updateStreak: builder.mutation<StreakUpdateResponse, void>({
      query: () => ({
        url: '/streak/update',
        method: 'POST',
      }),
      invalidatesTags: ['Streak', 'User'],
    }),

    // === ACHIEVEMENT ENDPOINTS ===
    getAchievements: builder.query<AchievementsResponse, AchievementFilters>({
      query: (filters) => ({
        url: '/achievements',
        params: filters,
      }),
      providesTags: ['Achievement'],
    }),
    
    getUserAchievements: builder.query<UserAchievementsResponse, void>({
      query: () => '/achievements/user',
      providesTags: ['Achievement'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPhasesQuery,
  useGetPhasesWithModulesQuery,
  useGetPhaseByIdQuery,
  useGetModulesQuery,
  useGetModuleByIdQuery,
  useGetModuleWithContentQuery,
  useGetContentByIdQuery,
  useGetContentWithModuleAndProgressQuery,
  useGetEnrollmentsQuery,
  useEnrollInModuleMutation,
  useUpdateEnrollmentStatusMutation,
  useUpdateProgressMutation,
  useGetProgressSummaryQuery,
  useGetStreakStatusQuery,
  useUpdateStreakMutation,
  useGetAchievementsQuery,
  useGetUserAchievementsQuery,
} = apiSlice;
```

### Authentication API (`/src/features/api/authApi.ts`)

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    
    forgotPassword: builder.mutation<MessageResponse, { email: string }>({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
```

## 🔐 Authentication State Management

### Auth Slice (`/src/features/auth/authSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem('token', token);
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('token');
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectToken = (state: RootState) => state.auth.token;
```

## 🎣 Custom Hooks

### Authentication Hook (`/src/hooks/useAuth.ts`)

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useGetCurrentUserQuery } from '../features/api/authApi';
import { setUser, logout, setLoading, selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(state => state.auth.token);
  
  const {
    data: currentUserData,
    error,
    isLoading,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (currentUserData?.success) {
      dispatch(setUser(currentUserData.data.user));
    } else if (error) {
      dispatch(logout());
    }
    dispatch(setLoading(isLoading));
  }, [currentUserData, error, isLoading, dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
  };
};
```

### Progress Tracking Hook (`/src/hooks/useProgress.ts`)

```typescript
import { useCallback } from 'react';
import { useUpdateProgressMutation } from '../features/api/apiSlice';
import { useAuth } from './useAuth';

export const useProgress = () => {
  const { isAuthenticated } = useAuth();
  const [updateProgress, { isLoading: isUpdating }] = useUpdateProgressMutation();

  const updateContentProgress = useCallback(async (
    contentId: string,
    progressData: {
      percentage: number;
      currentPosition?: number;
      timeSpent?: number;
      interactions?: {
        pauses?: number;
        seeks?: number;
      };
      contentSpecific?: any;
    }
  ) => {
    if (!isAuthenticated) return;

    try {
      const result = await updateProgress({
        contentId,
        progress: {
          percentage: progressData.percentage,
          currentPosition: progressData.currentPosition,
          timeSpent: progressData.timeSpent,
        },
        interactions: progressData.interactions,
        contentSpecific: progressData.contentSpecific,
      }).unwrap();

      return result;
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  }, [isAuthenticated, updateProgress]);

  return {
    updateContentProgress,
    isUpdating,
  };
};
```

### Streak Management Hook (`/src/hooks/useStreak.ts`)

```typescript
import { useCallback } from 'react';
import { useGetStreakStatusQuery, useUpdateStreakMutation } from '../features/api/apiSlice';
import { useAuth } from './useAuth';

export const useStreak = () => {
  const { isAuthenticated } = useAuth();
  const {
    data: streakData,
    isLoading,
    refetch,
  } = useGetStreakStatusQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  const [updateStreak, { isLoading: isUpdating }] = useUpdateStreakMutation();

  const updateStreakStatus = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const result = await updateStreak().unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update streak:', error);
      throw error;
    }
  }, [isAuthenticated, updateStreak]);

  return {
    streak: streakData?.data?.streak,
    isLoading,
    isUpdating,
    updateStreakStatus,
    refetch,
  };
};
```

## 🧩 Component Architecture

### Layout Components

#### Main Layout (`/src/components/layout/Layout.tsx`)

```typescript
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {isAuthenticated && <Navigation />}
        
        <main className={`flex-1 ${isAuthenticated ? 'lg:ml-64' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};
```

#### Navigation Component (`/src/components/layout/Navigation.tsx`)

```typescript
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserIcon,
  BeakerIcon,
  GameController2Icon,
} from '@heroicons/react/24/outline';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Courses', href: '/courses', icon: BookOpenIcon },
  { name: 'Progress', href: '/progress', icon: ChartBarIcon },
  { name: 'Labs', href: '/labs', icon: BeakerIcon },
  { name: 'Games', href: '/games', icon: GameController2Icon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border/50 overflow-y-auto">
      <div className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
```

### Form Components

#### Login Form (`/src/components/forms/LoginForm.tsx`)

```typescript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '../../features/api/authApi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

const loginSchema = z.object({
  login: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const result = await login(data).unwrap();
      
      if (result.success) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token,
        }));
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
          Login to Hack The World
        </h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('login')}
              type="text"
              placeholder="Email or Username"
              error={errors.login?.message}
            />
          </div>

          <div>
            <Input
              {...register('password')}
              type="password"
              placeholder="Password"
              error={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:text-primary/80"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-primary hover:text-primary/80"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
```

### Content Components

#### Video Player (`/src/components/content/VideoPlayer.tsx`)

```typescript
import React, { useRef, useEffect, useState } from 'react';
import { useProgress } from '../../hooks/useProgress';

interface VideoPlayerProps {
  contentId: string;
  videoUrl: string;
  initialProgress?: number;
  onProgressUpdate?: (progress: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  contentId,
  videoUrl,
  initialProgress = 0,
  onProgressUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);
  
  const { updateContentProgress, isUpdating } = useProgress();

  const updateProgress = async (progress: number, timeSpent: number) => {
    if (Math.abs(progress - lastProgressUpdate) >= 5) { // Update every 5%
      try {
        await updateContentProgress(contentId, {
          percentage: progress,
          currentPosition: currentTime,
          timeSpent,
          interactions: {
            pauses: 0, // Track separately
            seeks: 0,  // Track separately
          }
        });
        setLastProgressUpdate(progress);
        onProgressUpdate?.(progress);
      } catch (error) {
        console.error('Failed to update video progress:', error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      
      setCurrentTime(current);
      
      if (total > 0) {
        const progress = (current / total) * 100;
        updateProgress(progress, current);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      
      // Set initial position
      if (initialProgress > 0) {
        const startTime = (initialProgress / 100) * videoRef.current.duration;
        videoRef.current.currentTime = startTime;
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <div className="video-player bg-card rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
        />
        
        {isUpdating && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            Saving progress...
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Progress: {Math.round((currentTime / duration) * 100) || 0}%
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 📱 Page Components

### Dashboard Page (`/src/pages/dashboard/Dashboard.tsx`)

```typescript
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useGetEnrollmentsQuery, useGetStreakStatusQuery } from '../../features/api/apiSlice';
import { StreakDisplay } from '../../components/streak/StreakDisplay';
import { EnrolledCourses } from '../../components/courses/EnrolledCourses';
import { ProgressOverview } from '../../components/progress/ProgressOverview';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: enrollments, isLoading: enrollmentsLoading } = useGetEnrollmentsQuery({});
  const { data: streakData, isLoading: streakLoading } = useGetStreakStatusQuery();

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
          Welcome back, {user?.profile?.displayName || user?.username}!
        </h1>
        <p className="text-muted-foreground">
          Continue your cybersecurity learning journey
        </p>
      </div>

      {/* Streak Display */}
      {streakData?.data?.streak && (
        <StreakDisplay streak={streakData.data.streak} />
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrolled Courses */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Courses</h2>
          {enrollments?.data?.enrollments ? (
            <EnrolledCourses enrollments={enrollments.data.enrollments} />
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
};
```

## 🎨 UI Component System

### Button Component (`/src/components/ui/Button.tsx`)

```typescript
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from './LoadingSpinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
        {children}
      </button>
    );
  }
);
```

### Input Component (`/src/components/ui/Input.tsx`)

```typescript
import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
```

## 🚦 Routing Configuration

### App Router (`/src/App.tsx`)

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Page imports
import { Dashboard } from './pages/dashboard/Dashboard';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Courses } from './pages/courses/Courses';
import { CourseDetail } from './pages/courses/CourseDetail';
import { ContentPlayer } from './pages/content/ContentPlayer';
import { Profile } from './pages/profile/Profile';

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route 
          index 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/login" replace />
          } 
        />
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="courses/:id" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />
        <Route path="content/:id" element={
          <ProtectedRoute>
            <ContentPlayer />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}
```

## 🔧 TypeScript Types

### API Types (`/src/types/api.ts`)

```typescript
// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    details?: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: PaginationMeta;
}

// Phase Types
export interface Phase {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration?: number;
  tags: string[];
  objectives: string[];
  prerequisites: string[];
  image?: string;
  icon?: string;
  color: string;
  isActive: boolean;
  metadata: {
    totalModules: number;
    totalContent: number;
    totalDuration: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type PhasesResponse = ApiResponse<{ phases: Phase[] }>;
export type PhaseResponse = ApiResponse<{ phase: Phase }>;

// Module Types
export interface Module {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  phase: string | Phase;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration?: number;
  prerequisites: string[];
  learningObjectives: string[];
  skills: string[];
  tags: string[];
  image?: string;
  icon?: string;
  instructor?: {
    name: string;
    bio: string;
    avatar: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  metadata: {
    totalContent: number;
    totalDuration: number;
    videoCount: number;
    labCount: number;
    gameCount: number;
    documentCount: number;
  };
  settings: {
    allowDownload: boolean;
    requireSequentialCompletion: boolean;
    certificateEligible: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type ModulesResponse = ApiResponse<{ modules: Module[] }>;
export type ModuleResponse = ApiResponse<{ module: Module }>;

// Content Types
export interface Content {
  _id: string;
  title: string;
  description?: string;
  module: string | Module;
  type: 'video' | 'lab' | 'game' | 'document';
  order: number;
  duration?: number;
  content: {
    videoUrl?: string;
    videoId?: string;
    thumbnailUrl?: string;
    captions?: string;
    labInstructions?: string;
    labEnvironment?: string;
    labSolution?: string;
    labHints?: string[];
    gameType?: 'quiz' | 'simulation' | 'puzzle' | 'scenario';
    gameData?: any;
    gameInstructions?: string;
    gameObjectives?: string[];
    documentUrl?: string;
    documentContent?: string;
    documentFormat?: 'pdf' | 'html' | 'markdown' | 'text';
  };
  section?: string;
  subsection?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  completionCriteria: {
    type: 'time_based' | 'interaction_based' | 'manual';
    requiredPercentage: number;
    requiredInteractions?: number;
  };
  isActive: boolean;
  isFree: boolean;
  metadata: {
    fileSize?: number;
    resolution?: string;
    language: string;
    lastUpdated: string;
  };
  settings: {
    allowSkip: boolean;
    allowDownload: boolean;
    allowSpeedControl: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type ContentResponse = ApiResponse<{ content: Content }>;
```

This comprehensive frontend architecture documentation provides the complete foundation for understanding and recreating the React frontend application in the Next.js migration.