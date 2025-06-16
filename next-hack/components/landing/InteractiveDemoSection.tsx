import TerminalWindow from "@/components/terminal/TerminalWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  onEnterCyberRange: () => void;
}

const InteractiveDemoSection = ({
  liveStats,
  gameScore,
  onScoreUpdate,
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
            <TerminalWindow title="Live Penetration Testing" className="h-96">
              <div className="space-y-2">
                <div className="text-green-400">$ sqlmap -u &quot;http://vulnerable.site/search?q=test&quot;</div>
                <div className="text-green-300">Analyzing target...</div>
                <div className="text-green-300">Testing SQL injection payloads...</div>
                <div className="text-red-400">VULNERABLE: Union-based SQL injection detected!</div>
                <div className="text-green-300">Dumping database schema...</div>
                <div className="text-green-400">$ <span className="terminal-cursor">|</span></div>
              </div>
            </TerminalWindow>

            {/* Challenge Card */}
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Security Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-300/80 mb-4">Can you spot the vulnerability?</p>
                <div className="bg-black p-3 rounded border border-green-400/30 font-mono text-sm text-green-300">
                  curl http://vulnerable.site/login?user=admin&apos;--
                </div>
                <p className="text-green-300/60 mt-2 mb-4">What type of attack is being attempted here?</p>
                <Button 
                  variant="outline" 
                  className="border-green-400 text-green-400 hover:bg-green-400/10"
                  onClick={handleRevealAnswer}
                >
                  Reveal Answer
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Games Panel */}
          <div className="space-y-3">
            {/* Threat Intelligence */}
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Live Threats</CardTitle>
              </CardHeader>
              <CardContent>
                {liveStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span className="text-green-300/80 text-sm">{stat.label}</span>
                    <div className="text-right">
                      <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                      <span className="text-xs text-green-300/60 ml-1">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Game Score */}
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Hacker Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{gameScore}</div>
                  <div className="text-sm text-green-300/60">Points Earned</div>
                  <Button 
                    className="mt-3 w-full bg-green-400/20 text-green-400 border border-green-400/50 hover:bg-green-400/30"
                    onClick={() => onScoreUpdate(10)}
                  >
                    +10 Points
                  </Button>
                </div>
              </CardContent>
            </Card>
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