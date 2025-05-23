import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/components/pages/LandingPage';
import LoginPage from '@/components/pages/LoginPage';
import SignupPage from '@/components/pages/SignupPage';
import Dashboard from '@/components/pages/Dashboard';
import CoursesPage from '@/components/pages/CoursesPage';
import CourseDetailPage from '@/components/pages/CourseDetailPage';
import EnrolledCoursePage from '@/components/pages/EnrolledCoursePage';
import TerminalLab from '@/components/pages/TerminalLab';
import WebSecLab from '@/components/pages/WebSecLab';
import SocialEngLab from '@/components/pages/SocialEngLab';
import MatrixRain from '@/components/effects/MatrixRain';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Router>
        <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
          <MatrixRain />
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course/:courseId" element={<CourseDetailPage />} />
              <Route path="/learn/:courseId" element={<EnrolledCoursePage />} />
              <Route path="/terminal-lab" element={<TerminalLab />} />
              <Route path="/websec-lab" element={<WebSecLab />} />
              <Route path="/social-eng-lab" element={<SocialEngLab />} />
            </Routes>
          </div>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
