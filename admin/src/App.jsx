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
import ContentProgressDetailView from "./pages/ContentProgressDetailView";
import Dashboard from "./pages/Dashboard";
import EnrollmentTrackingPage from "./pages/EnrollmentTrackingPage";
import Login from "./pages/Login";
import ModuleDetailView from "./pages/ModuleDetailView";
import ModuleProgressDetailView from "./pages/ModuleProgressDetailView";
import ModulesManagerEnhanced from "./pages/ModulesManagerEnhanced";
import PhaseDetailView from "./pages/PhaseDetailView";
import PhasesManager from "./pages/PhasesManager";
import Register from "./pages/Register";
import UserBasedEnrollmentView from "./pages/UserBasedEnrollmentView";

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
            <Route path="modules" element={<ModulesManagerEnhanced />} />
            <Route path="modules/:moduleId" element={<ModuleDetailView />} />
            <Route
              path="modules/:moduleId/progress"
              element={<ModuleProgressDetailView />}
            />
            <Route path="content" element={<ContentManager />} />
            <Route path="content/:contentId" element={<ContentDetailView />} />
            <Route
              path="content/:contentId/progress"
              element={<ContentProgressDetailView />}
            />
            <Route path="enrollments" element={<EnrollmentTrackingPage />} />
            <Route
              path="enrollments/users"
              element={<UserBasedEnrollmentView />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
