import ErrorBoundary from "@/components/common/ErrorBoundary";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import ScrollToTop from "@/components/common/ScrollToTop";
import MatrixRain from "@/components/effects/MatrixRain";
import { Toaster } from "@/components/ui/sonner";
import CourseDetailPage from "@/pages/CourseDetailPage";
import CyberSecOverview from "@/pages/CyberSecOverview";
import Dashboard from "@/pages/Dashboard";
import EnrolledCoursePage from "@/pages/EnrolledCoursePage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import GamePage from "@/pages/GamePage";
import LabPage from "@/pages/LabPage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import PlatformDemo from "@/pages/PlatformDemo";
import PricingPage from "@/pages/PricingPage";
import SignupPage from "@/pages/SignupPage";
import SocialEngLab from "@/pages/SocialEngLab";
import TerminalLab from "@/pages/TerminalLab";
import WebSecLab from "@/pages/WebSecLab";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-background text-green-400 relative overflow-hidden">
          <MatrixRain />
          <div className="relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/demo" element={<PlatformDemo />} />
              <Route path="/overview" element={<CyberSecOverview />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/overview"
                element={
                  <ProtectedRoute>
                    <CyberSecOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:courseId"
                element={
                  <ProtectedRoute>
                    <CourseDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn/:courseId"
                element={
                  <ProtectedRoute>
                    <EnrolledCoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn/:courseId/lab/:labId"
                element={
                  <ProtectedRoute>
                    <LabPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn/:courseId/game/:gameId"
                element={
                  <ProtectedRoute>
                    <GamePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/terminal-lab"
                element={
                  <ProtectedRoute>
                    <TerminalLab />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/websec-lab"
                element={
                  <ProtectedRoute>
                    <WebSecLab />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social-eng-lab"
                element={
                  <ProtectedRoute>
                    <SocialEngLab />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
