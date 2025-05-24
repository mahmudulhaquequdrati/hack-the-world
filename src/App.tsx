import MatrixRain from "@/components/effects/MatrixRain";
import CourseDetailPage from "@/components/pages/CourseDetailPage";
import CyberSecOverview from "@/components/pages/CyberSecOverview";
import Dashboard from "@/components/pages/Dashboard";
import EnrolledCoursePage from "@/components/pages/EnrolledCoursePage";
import GamePage from "@/components/pages/GamePage";
import LabPage from "@/components/pages/LabPage";
import LandingPage from "@/components/pages/LandingPage";
import LoginPage from "@/components/pages/LoginPage";
import PlatformDemo from "@/components/pages/PlatformDemo";
import PricingPage from "@/components/pages/PricingPage";
import SignupPage from "@/components/pages/SignupPage";
import SocialEngLab from "@/components/pages/SocialEngLab";
import TerminalLab from "@/components/pages/TerminalLab";
import WebSecLab from "@/components/pages/WebSecLab";
import { Toaster } from "@/components/ui/sonner";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
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
