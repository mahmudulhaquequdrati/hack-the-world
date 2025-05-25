import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface ChallengeCardProps {
  title?: string;
  challenge: string;
  command: string;
  question: string;
  onRevealAnswer: () => void;
  className?: string;
}

const ChallengeCard = ({
  title = "Cachey Challenge",
  challenge,
  command,
  question,
  onRevealAnswer,
  className = "",
}: ChallengeCardProps) => {
  return (
    <Card
      className={`bg-black/80 border-green-400/40 flex-1 flex flex-col justify-between animate-fade-in ${className}`}
    >
      <CardHeader>
        <CardTitle className="text-green-400 text-sm flex items-center">
          <Target className="w-4 h-4 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-green-300/90 text-base mb-3">
          <span className="font-semibold">Challenge:</span> {challenge}
        </div>
        <div className="bg-black/60 border border-green-400/20 rounded p-3 font-mono text-xs text-green-200 mb-2">
          <span className="text-green-400">$</span> <span>{command}</span>
        </div>
        <div className="text-xs text-green-300/70 mb-2">{question}</div>
        <Button
          variant="outline"
          className="border-green-400/60 text-green-300 hover:bg-green-400/10 w-full"
          onClick={onRevealAnswer}
        >
          Reveal Answer
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
