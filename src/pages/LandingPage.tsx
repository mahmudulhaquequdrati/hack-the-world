import { Header } from "@/components/header.tsx";
import {
  CTASection,
  FeaturesSection,
  Footer,
  HeroSection,
  InteractiveDemoSection,
} from "@/components/landing";
import { Eye, Shield, Terminal, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [gameScore, setGameScore] = useState(0);

  const stats = [
    { label: "Active Hackers", value: "10,247" },
    { label: "Vulnerabilities Found", value: "50,892" },
    { label: "Skills Mastered", value: "1,337" },
    { label: "Success Rate", value: "94.7%" },
  ];

  const features = [
    {
      icon: Terminal,
      title: "Linux Terminal Mastery",
      description:
        "Master command-line operations with our interactive terminal simulator",
      color: "text-green-400",
    },
    {
      icon: Shield,
      title: "Web Security Testing",
      description: "Practice ethical hacking on vulnerable web applications",
      color: "text-blue-400",
    },
    {
      icon: Users,
      title: "Social Engineering",
      description: "Learn psychological manipulation techniques and defenses",
      color: "text-red-400",
    },
    {
      icon: Eye,
      title: "OSINT Gathering",
      description: "Open source intelligence collection and analysis",
      color: "text-purple-400",
    },
  ];

  const liveStats = [
    {
      label: "Active Sessions",
      value: "1,247",
      trend: "+12%",
      color: "text-green-400",
    },
    {
      label: "Threats Detected",
      value: "89",
      trend: "+5%",
      color: "text-red-400",
    },
    {
      label: "Systems Scanned",
      value: "15,432",
      trend: "+8%",
      color: "text-blue-400",
    },
    {
      label: "Vulnerabilities",
      value: "23",
      trend: "-2%",
      color: "text-yellow-400",
    },
  ];

  const handleScoreUpdate = (points: number) => {
    setGameScore((prev) => prev + points);
  };

  const handleStartJourney = () => {
    navigate("/overview");
  };

  const handleViewDemo = () => {
    navigate("/demo");
  };

  const handleViewPricing = () => {
    navigate("/pricing");
  };

  const handleEnterCyberRange = () => {
    navigate("/overview");
  };

  return (
    <div className="min-h-screen bg-background text-green-400 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <Header navigate={navigate} />

        {/* Hero Content */}
        <HeroSection
          onStartJourney={handleStartJourney}
          onViewDemo={handleViewDemo}
          stats={stats}
        />
      </div>

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Interactive Demo Section */}
      <InteractiveDemoSection
        liveStats={liveStats}
        gameScore={gameScore}
        onScoreUpdate={handleScoreUpdate}
        onNavigateToOverview={handleStartJourney}
        onEnterCyberRange={handleEnterCyberRange}
      />

      {/* CTA Section */}
      <CTASection
        onStartJourney={handleStartJourney}
        onViewPricing={handleViewPricing}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
