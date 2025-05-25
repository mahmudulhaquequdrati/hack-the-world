import {
  ChallengeCard,
  HackerChallenges,
  ThreatIntelligence,
} from "@/components/landing";
import { LiveTerminal } from "@/components/terminal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

interface ThreatStat {
  label: string;
  value: string;
  trend: string;
  color: string;
}

interface InteractiveDemoSectionProps {
  liveStats: ThreatStat[];
  gameScore: number;
  onScoreUpdate: (points: number) => void;
  onNavigateToOverview: () => void;
  onEnterCyberRange: () => void;
}

const InteractiveDemoSection = ({
  liveStats,
  gameScore,
  onScoreUpdate,
  onNavigateToOverview,
  onEnterCyberRange,
}: InteractiveDemoSectionProps) => {
  const handleRevealAnswer = () => {
    alert("Correct! This is a classic SQL Injection attempt.");
  };

  return (
    <section className="pt-20 pb-10 px-6 bg-gradient-to-b from-black to-green-900/10 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-green-400/20 text-green-400 border-green-400 mb-4">
            Live Cyber Range
          </Badge>
          <h2 className="text-4xl font-bold text-green-400 mb-4">
            Real-Time Hacking Simulation
          </h2>
          <p className="text-green-300/80 text-lg">
            Experience live penetration testing, solve security challenges, and
            monitor cyber threats in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Terminal */}
          <div className="lg:col-span-2 space-y-4">
            <LiveTerminal title="Live Penetration Testing" className="h-96" />

            {/* Challenge Card */}
            <ChallengeCard
              challenge="Can you spot the vulnerability?"
              command="curl http://vulnerable.site/login?user=admin'--"
              question="What type of attack is being attempted here?"
              onRevealAnswer={handleRevealAnswer}
            />
          </div>

          {/* Stats & Games Panel */}
          <div className="space-y-3">
            {/* Threat Intelligence */}
            <ThreatIntelligence stats={liveStats} />

            {/* Hacker Challenges */}
            <HackerChallenges
              gameScore={gameScore}
              onScoreUpdate={onScoreUpdate}
              onNavigateToLive={onNavigateToOverview}
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            size="lg"
            className="bg-green-400 text-black hover:bg-green-300 font-medium"
            onClick={onEnterCyberRange}
          >
            <Target className="w-5 h-5 mr-2" />
            Enter Cyber Range
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemoSection;
