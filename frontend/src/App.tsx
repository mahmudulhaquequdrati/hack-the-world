import ScrollToTop from "@/components/common/ScrollToTop";
import MatrixRain from "@/components/effects/MatrixRain";
import { Toaster } from "@/components/ui/sonner";
import CourseDetailPage from "@/pages/CourseDetailPage";
import CyberSecOverview from "@/pages/CyberSecOverview";
import Dashboard from "@/pages/Dashboard";
import EnrolledCoursePage from "@/pages/EnrolledCoursePage";
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-green-400 relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/overview" element={<CyberSecOverview />} />
            <Route path="/demo" element={<PlatformDemo />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/learn/:courseId" element={<EnrolledCoursePage />} />
            <Route path="/learn/:courseId/lab/:labId" element={<LabPage />} />
            <Route
              path="/learn/:courseId/game/:gameId"
              element={<GamePage />}
            />
            <Route path="/terminal-lab" element={<TerminalLab />} />
            <Route path="/websec-lab" element={<WebSecLab />} />
            <Route path="/social-eng-lab" element={<SocialEngLab />} />
          </Routes>
        </div>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
