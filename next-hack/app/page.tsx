"use client";

import {
  CTASection,
  FeaturesSection,
  HeroSection,
  InteractiveDemoSection,
} from "@/components/landing";
import Layout from "@/components/layout/Layout";
import { Eye, Shield, Terminal, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
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
    router.push("/overview");
  };

  const handleViewDemo = () => {
    router.push("/how-it-works");
  };

  const handleViewPricing = () => {
    router.push("/pricing");
  };

  const handleEnterCyberRange = () => {
    router.push("/overview");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background text-green-400 relative overflow-hidden">
        {/* Hero Section */}
        <div className="relative z-10 min-h-screen flex flex-col">
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
          onEnterCyberRange={handleEnterCyberRange}
        />

        {/* CTA Section */}
        <CTASection
          onStartJourney={handleStartJourney}
          onViewPricing={handleViewPricing}
        />
      </div>
    </Layout>
  );
}
