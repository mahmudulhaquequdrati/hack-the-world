# Admin Panel Complete Documentation

## 🏗️ Admin Panel Architecture Overview

**Framework**: React 19 + JavaScript + Vite  
**HTTP Client**: Axios with interceptors  
**Styling**: Tailwind CSS v4  
**Routing**: React Router v7  
**Icons**: Heroicons v2  
**State Management**: React Context API  

## 📦 Project Structure

```
admin/
├── src/
│   ├── components/             # Admin-specific components
│   │   ├── Layout.jsx         # Main layout with sidebar navigation
│   │   ├── Header.jsx         # Top header component
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   ├── Breadcrumb.jsx     # Breadcrumb navigation
│   │   ├── DataTable.jsx      # Reusable data table
│   │   ├── Modal.jsx          # Modal component
│   │   ├── Form.jsx           # Form components
│   │   └── Charts.jsx         # Chart components
│   │
│   ├── pages/                 # Admin page components
│   │   ├── Dashboard.jsx      # Analytics dashboard
│   │   ├── phases/            # Phase management pages
│   │   │   ├── PhasesList.jsx
│   │   │   ├── PhaseDetail.jsx
│   │   │   └── PhaseForm.jsx
│   │   ├── modules/           # Module management pages
│   │   │   ├── ModulesList.jsx
│   │   │   ├── ModuleDetail.jsx
│   │   │   └── ModuleForm.jsx
│   │   ├── content/           # Content management pages
│   │   │   ├── ContentList.jsx
│   │   │   ├── ContentDetail.jsx
│   │   │   └── ContentForm.jsx
│   │   ├── enrollments/       # Enrollment management
│   │   │   ├── EnrollmentsList.jsx
│   │   │   └── EnrollmentDetail.jsx
│   │   └── users/             # User management
│   │       ├── UsersList.jsx
│   │       └── UserDetail.jsx
│   │
│   ├── context/               # React context providers
│   │   ├── AuthContext.jsx    # Authentication context
│   │   ├── ThemeContext.jsx   # Theme management
│   │   └── NotificationContext.jsx # Notifications
│   │
│   ├── services/              # API service functions
│   │   ├── api.js             # Axios configuration
│   │   ├── authService.js     # Authentication services
│   │   ├── phaseService.js    # Phase CRUD operations
│   │   ├── moduleService.js   # Module CRUD operations
│   │   ├── contentService.js  # Content CRUD operations
│   │   └── userService.js     # User management services
│   │
│   ├── utils/                 # Admin utility functions
│   │   ├── helpers.js         # General helper functions
│   │   ├── validation.js      # Form validation
│   │   ├── formatters.js      # Data formatting
│   │   └── constants.js       # Application constants
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Authentication hook
│   │   ├── useApi.js          # API call hook
│   │   ├── usePagination.js   # Pagination logic
│   │   └── useNotification.js # Notification system
│   │
│   ├── App.jsx                # Main App component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
│
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
└── vite.config.js             # Vite configuration
```

## 🔐 Authentication System

### Auth Context (`/src/context/AuthContext.jsx`)

```javascript
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// Set up axios defaults
const API_BASE_URL = 'http://localhost:5001/api';
axios.defaults.baseURL = API_BASE_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored token on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token with backend
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response.data.success && response.data.data.user.role === 'admin') {
        setUser(response.data.data.user);
      } else {
        // User is not admin
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', {
        login: credentials.email, // Backend accepts email or username in 'login' field
        password: credentials.password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Check if user is admin with active status
        if (user.role !== 'admin') {
          throw new Error('Admin access required');
        }

        if (user.adminStatus !== 'active') {
          throw new Error(
            'Admin account not activated. Please contact an administrator.'
          );
        }

        // Store token and set headers
        localStorage.setItem('adminToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);

        return { success: true };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', {
        username: userData.name.toLowerCase().replace(/\s+/g, ''), // Generate username from name
        email: userData.email,
        password: userData.password,
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ').slice(1).join(' '),
        role: 'admin', // Register as admin
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store token and set headers
        localStorage.setItem('adminToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);

        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

## 🎨 Layout System

### Main Layout (`/src/components/Layout.jsx`)

```javascript
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  ChartBarIcon,
  ChevronRightIcon,
  CubeIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Phases', href: '/phases', icon: CubeIcon },
    { name: 'Modules', href: '/modules', icon: DocumentIcon },
    { name: 'Content', href: '/content', icon: FolderIcon },
    { name: 'Enrollments', href: '/enrollments', icon: UsersIcon },
  ];

  const isActive = (href) => location.pathname === href;

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    ];

    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;

      // Skip the dashboard segment as it's already in the breadcrumbs
      if (pathname === 'dashboard') return;

      const navItem = navigation.find((nav) => nav.href === currentPath);
      if (navItem) {
        breadcrumbs.push({
          name: navItem.name,
          href: currentPath,
          icon: navItem.icon,
        });
      } else {
        // Handle detail pages
        if (pathname.match(/^[a-f0-9]{24}$/)) {
          // MongoDB ObjectId pattern
          const detailType = pathnames[index - 1];
          if (detailType === 'phases') {
            breadcrumbs.push({
              name: 'Phase Details',
              href: currentPath,
              icon: CubeIcon,
            });
          } else if (detailType === 'modules') {
            breadcrumbs.push({
              name: 'Module Details',
              href: currentPath,
              icon: DocumentIcon,
            });
          } else if (detailType === 'content') {
            breadcrumbs.push({
              name: 'Content Details',
              href: currentPath,
              icon: FolderIcon,
            });
          }
        }
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 flex z-40">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card border-r border-border/50">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent
              navigation={navigation}
              isActive={isActive}
              user={user}
              logout={logout}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-card border-r border-border/50 fixed h-full backdrop-blur-sm">
          <SidebarContent
            navigation={navigation}
            isActive={isActive}
            user={user}
            logout={logout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <h1 className="text-primary text-lg font-bold tracking-wider">[ADMIN PANEL]</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        <div className="p-4 lg:p-8">
          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 1 && (
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3 bg-muted/30 px-3 py-2 rounded-lg backdrop-blur-sm">
                {breadcrumbs.map((crumb, index) => {
                  const Icon = crumb.icon;
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <li key={crumb.href} className="inline-flex items-center">
                      {index > 0 && (
                        <ChevronRightIcon className="w-4 h-4 text-muted-foreground mx-2" />
                      )}
                      {isLast ? (
                        <span className="inline-flex items-center text-sm font-medium text-primary">
                          <Icon className="w-4 h-4 mr-2" />
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          to={crumb.href}
                          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Sidebar content component
const SidebarContent = ({ navigation, isActive, user, logout, setSidebarOpen }) => (
  <div className="flex flex-col h-full">
    {/* Logo/Header */}
    <div className="flex items-center justify-center h-16 px-6 border-b border-border/50">
      <h1 className="text-primary text-xl font-bold tracking-wider">
        [ADMIN PANEL]
      </h1>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-6 space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setSidebarOpen?.(false)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] ${
              isActive(item.href)
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        );
      })}
    </nav>

    {/* User info and logout */}
    <div className="border-t border-border/50 p-4">
      <div className="flex items-center p-3 mb-3 bg-muted/50 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
          <UserIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.name || user?.email || 'Admin'}
          </p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
      >
        <ArrowLeftEndOnRectangleIcon className="w-4 h-4 mr-3" />
        Logout
      </button>
    </div>
  </div>
);

export default Layout;
```

## 📊 Dashboard Page

### Analytics Dashboard (`/src/pages/Dashboard.jsx`)

```javascript
import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  PlayIcon,
  TrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnrollments: 0,
    totalModules: 0,
    totalContent: 0,
    recentActivity: [],
    enrollmentTrends: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple endpoints for dashboard stats
      const [usersRes, enrollmentsRes, modulesRes, contentRes] = await Promise.all([
        axios.get('/users?limit=1'), // Just to get count
        axios.get('/enrollments'),
        axios.get('/modules'),
        axios.get('/content'),
      ]);

      setStats({
        totalUsers: usersRes.data.pagination?.total || 0,
        totalEnrollments: enrollmentsRes.data.data?.enrollments?.length || 0,
        totalModules: modulesRes.data.data?.modules?.length || 0,
        totalContent: contentRes.data.data?.content?.length || 0,
        recentActivity: enrollmentsRes.data.data?.enrollments?.slice(0, 5) || [],
        enrollmentTrends: generateMockTrends(), // You'd implement real trend analysis
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrends = () => {
    // Generate sample trend data - replace with real analytics
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      enrollments: Math.floor(Math.random() * 20) + 5,
    }));
  };

  const StatCard = ({ icon: Icon, title, value, trend, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor platform activity and manage content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={UsersIcon}
          title="Total Users"
          value={stats.totalUsers}
          trend="+12% this month"
          color="primary"
        />
        <StatCard
          icon={AcademicCapIcon}
          title="Active Enrollments"
          value={stats.totalEnrollments}
          trend="+8% this week"
          color="green"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Modules"
          value={stats.totalModules}
          color="blue"
        />
        <StatCard
          icon={PlayIcon}
          title="Content Items"
          value={stats.totalContent}
          color="purple"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrollment Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Enrollment Trends (Last 7 Days)
          </h3>
          <div className="space-y-3">
            {stats.enrollmentTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{trend.date}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-muted rounded-full h-2 mr-3">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(trend.enrollments / 25) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">
                    {trend.enrollments}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Enrollments
          </h3>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <AcademicCapIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      New enrollment in {activity.module?.title || 'Unknown Module'}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {new Date(activity.enrolledAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h4 className="text-lg font-semibold text-foreground mb-2">Create New Module</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add new learning content to the platform
          </p>
          <button className="btn-primary">
            Create Module
          </button>
        </div>

        <div className="card text-center">
          <h4 className="text-lg font-semibold text-foreground mb-2">Manage Users</h4>
          <p className="text-sm text-muted-foreground mb-4">
            View and manage user accounts and permissions
          </p>
          <button className="btn-secondary">
            View Users
          </button>
        </div>

        <div className="card text-center">
          <h4 className="text-lg font-semibold text-foreground mb-2">Analytics</h4>
          <p className="text-sm text-muted-foreground mb-4">
            View detailed platform analytics and reports
          </p>
          <button className="btn-secondary">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

## 📝 CRUD Operations

### Phase Management (`/src/pages/phases/PhasesList.jsx`)

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

const PhasesList = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  useEffect(() => {
    fetchPhases();
  }, [searchTerm, sortBy, filterDifficulty]);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      const params = {
        sort: sortBy,
        ...(filterDifficulty && { difficulty: filterDifficulty }),
      };
      
      const response = await axios.get('/phases', { params });
      
      if (response.data.success) {
        let phasesData = response.data.data.phases;
        
        // Apply client-side search if needed
        if (searchTerm) {
          phasesData = phasesData.filter(phase =>
            phase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phase.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setPhases(phasesData);
      }
    } catch (error) {
      console.error('Failed to fetch phases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (phaseId) => {
    if (window.confirm('Are you sure you want to delete this phase?')) {
      try {
        await axios.delete(`/phases/${phaseId}`);
        setPhases(phases.filter(phase => phase._id !== phaseId));
      } catch (error) {
        console.error('Failed to delete phase:', error);
        alert('Failed to delete phase');
      }
    }
  };

  const toggleActiveStatus = async (phaseId, currentStatus) => {
    try {
      await axios.put(`/phases/${phaseId}`, {
        isActive: !currentStatus
      });
      
      setPhases(phases.map(phase => 
        phase._id === phaseId 
          ? { ...phase, isActive: !currentStatus }
          : phase
      ));
    } catch (error) {
      console.error('Failed to update phase status:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Phases</h1>
          <p className="text-muted-foreground mt-2">
            Manage learning phases and their organization
          </p>
        </div>
        <Link
          to="/phases/new"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Phase
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Search
            </label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="Search phases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Difficulty
            </label>
            <select
              className="input-field w-full"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sort By
            </label>
            <select
              className="input-field w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="order">Order</option>
              <option value="title">Title</option>
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchPhases}
              className="btn-secondary flex items-center w-full"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Phases Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Phase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Modules
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {phases.map((phase) => (
                <tr key={phase._id} className="hover:bg-muted/25 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {phase.order}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: phase.color }}
                        >
                          {phase.title.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {phase.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {phase.shortDescription || phase.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(phase.difficulty)}`}>
                      {phase.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {phase.metadata?.totalModules || 0} modules
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActiveStatus(phase._id, phase.isActive)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        phase.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {phase.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/phases/${phase._id}`}
                        className="text-primary hover:text-primary/80"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/phases/${phase._id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(phase._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {phases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No phases found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhasesList;
```

## 🔧 API Services

### API Configuration (`/src/services/api.js`)

```javascript
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Phase Service (`/src/services/phaseService.js`)

```javascript
import api from './api';

export const phaseService = {
  // Get all phases
  getPhases: async (params = {}) => {
    const response = await api.get('/phases', { params });
    return response.data;
  },

  // Get phase by ID
  getPhaseById: async (id) => {
    const response = await api.get(`/phases/${id}`);
    return response.data;
  },

  // Create new phase
  createPhase: async (phaseData) => {
    const response = await api.post('/phases', phaseData);
    return response.data;
  },

  // Update phase
  updatePhase: async (id, phaseData) => {
    const response = await api.put(`/phases/${id}`, phaseData);
    return response.data;
  },

  // Delete phase
  deletePhase: async (id) => {
    const response = await api.delete(`/phases/${id}`);
    return response.data;
  },

  // Get phases with modules
  getPhasesWithModules: async () => {
    const response = await api.get('/phases/with-modules');
    return response.data;
  },
};
```

## 🎯 Reusable Components

### Data Table Component (`/src/components/DataTable.jsx`)

```javascript
import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';

const DataTable = ({
  data,
  columns,
  pagination = true,
  sortable = true,
  searchable = true,
  actions = [],
  onRowClick,
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = searchable && searchTerm
    ? data.filter(item =>
        columns.some(column =>
          String(item[column.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = sortable && sortConfig.key
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredData;

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = pagination
    ? sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : sortedData;

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key];
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Search */}
      {searchable && (
        <div className="p-4 border-b border-border">
          <input
            type="text"
            placeholder="Search..."
            className="input-field w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:bg-muted' : ''
                  }`}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {sortable && column.sortable !== false && (
                      <ChevronUpDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((item, index) => (
              <tr
                key={item.id || index}
                className={`hover:bg-muted/25 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {renderCell(item, column)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(item);
                          }}
                          className={`${action.className || 'text-primary hover:text-primary/80'}`}
                          title={action.title}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No data found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <select
              className="input-field w-20"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
```

## 📱 Key Features

### Content Management Features
- **Phase Management**: Create, edit, delete, and organize learning phases
- **Module Management**: Full CRUD operations for modules with rich metadata
- **Content Management**: Support for videos, labs, games, and documents
- **Bulk Operations**: Import/export content, bulk status changes
- **Rich Text Editor**: WYSIWYG editor for content descriptions

### User Management Features
- **User Overview**: View all registered users with filtering and search
- **Enrollment Management**: Monitor and manage user enrollments
- **Progress Tracking**: View individual user progress and statistics
- **Admin Approval**: Approve new admin accounts with proper verification
- **Role Management**: Assign and modify user roles and permissions

### Analytics & Reporting
- **Dashboard Metrics**: Real-time platform statistics and trends
- **Enrollment Analytics**: Track enrollment patterns and success rates
- **Content Performance**: Monitor content engagement and completion rates
- **User Activity**: Track user login patterns and activity levels
- **Export Reports**: Generate CSV/PDF reports for various metrics

### System Administration
- **Health Monitoring**: System health checks and performance metrics
- **Configuration Management**: Platform settings and feature toggles
- **Backup Management**: Database backup and restore operations
- **Security Monitoring**: Track login attempts and security events
- **Audit Logs**: Comprehensive logging of all admin actions

This comprehensive admin panel documentation provides the complete foundation for recreating the admin management interface in the Next.js version of the platform.