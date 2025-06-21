import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ContentDetailView from "./pages/ContentDetailView";
import ContentManager from "./pages/ContentManager";
import Dashboard from "./pages/Dashboard";
import EnrollmentManager from "./pages/EnrollmentManager";
import Login from "./pages/Login";
import ModuleDetailView from "./pages/ModuleDetailView";
import ModulesManager from "./pages/ModulesManager";
import PhaseDetailView from "./pages/PhaseDetailView";
import PhasesManager from "./pages/PhasesManager";
import Register from "./pages/Register";
import UserDetailView from "./pages/UserDetailView";
import UsersManager from "./pages/UsersManager";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-green">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-green">Loading...</div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="phases" element={<PhasesManager />} />
            <Route path="phases/:phaseId" element={<PhaseDetailView />} />
            <Route path="modules" element={<ModulesManager />} />
            <Route path="modules/:moduleId" element={<ModuleDetailView />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="content/:contentId" element={<ContentDetailView />} />
            <Route path="enrollments" element={<EnrollmentManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="users/:userId" element={<UserDetailView />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
