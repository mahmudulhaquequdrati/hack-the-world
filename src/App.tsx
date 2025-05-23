import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/components/pages/LandingPage';
import Dashboard from '@/components/pages/Dashboard';
import TerminalLab from '@/components/pages/TerminalLab';
import WebSecLab from '@/components/pages/WebSecLab';
import SocialEngLab from '@/components/pages/SocialEngLab';
import CoursePage from '@/components/pages/CoursePage';
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/terminal-lab" element={<TerminalLab />} />
              <Route path="/websec-lab" element={<WebSecLab />} />
              <Route path="/social-eng-lab" element={<SocialEngLab />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
            </Routes>
          </div>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
