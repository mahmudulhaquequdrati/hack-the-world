import AuthLoader from "@/components/common/AuthLoader";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import ScrollToTop from "@/components/common/ScrollToTop";
import Layout from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";
import AboutPage from "@/pages/AboutPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import CyberSecOverview from "@/pages/CyberSecOverview";
import Dashboard from "@/pages/Dashboard";
import EnrolledCoursePage from "@/pages/EnrolledCoursePage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import GamePage from "@/pages/GamePage";
import LabPage from "@/pages/LabPage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import PlatformDemo from "@/pages/PlatformDemo";
import PricingPage from "@/pages/PricingPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import SignupPage from "@/pages/SignupPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AuthLoader />
        <div className="min-h-screen bg-background text-green-400">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <LandingPage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout showHeader={false} showFooter={false}>
                  <LoginPage />
                </Layout>
              }
            />
            <Route
              path="/signup"
              element={
                <Layout showHeader={false} showFooter={false}>
                  <SignupPage />
                </Layout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Layout showHeader={false} showFooter={false}>
                  <ForgotPasswordPage />
                </Layout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <Layout showHeader={false} showFooter={false}>
                  <ResetPasswordPage />
                </Layout>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <Layout>
                  <PlatformDemo />
                </Layout>
              }
            />
            <Route
              path="/pricing"
              element={
                <Layout>
                  <PricingPage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />
            <Route
              path="/demo"
              element={
                <Layout>
                  <PlatformDemo />
                </Layout>
              }
            />
            <Route
              path="/overview"
              element={
                <Layout>
                  <CyberSecOverview />
                </Layout>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <Layout>
                  <CourseDetailPage />
                </Layout>
              }
            />
            <Route
              path="/learn/:courseId"
              element={
                <Layout>
                  <ProtectedRoute>
                    <EnrolledCoursePage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/learn/:courseId/lab/:labId"
              element={
                <Layout showHeader={false} showFooter={false}>
                  <ProtectedRoute>
                    <LabPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/learn/:courseId/game/:gameId"
              element={
                <Layout>
                  <ProtectedRoute>
                    <GamePage />
                  </ProtectedRoute>
                </Layout>
              }
            />

            {/* 404 Not Found Route */}
            <Route
              path="*"
              element={
                <Layout showHeader={false} showFooter={false}>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
