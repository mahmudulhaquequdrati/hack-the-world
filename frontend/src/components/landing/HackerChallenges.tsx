import { GameSelector } from "@/components/games";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Target } from "lucide-react";

interface HackerChallengesProps {
  gameScore: number;
  onScoreUpdate: (points: number) => void;
  onNavigateToLive: () => void;
  className?: string;
}

const HackerChallenges = ({
  gameScore,
  onScoreUpdate,
  onNavigateToLive,
  className = "",
}: HackerChallengesProps) => {
  return (
    <Card className={`bg-black/50 border-green-400/30 ${className}`}>
      <CardHeader>
        <CardTitle className="text-green-400 text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Hacker Challenges
          </div>
          <div className="text-green-400 font-mono">Score: {gameScore}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GameSelector gameScore={gameScore} onScoreUpdate={onScoreUpdate} />
        <Button
          size="sm"
          className="w-full bg-red-400 text-black hover:bg-red-300 font-medium mt-4"
          onClick={onNavigateToLive}
        >
          <Activity className="w-4 h-4 mr-2" />
          Live Penetration Testing
        </Button>
      </CardContent>
    </Card>
  );
};

export default HackerChallenges;
