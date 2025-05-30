import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OverviewHeaderProps {
  overallProgress: number;
}

const OverviewHeader = ({ overallProgress }: OverviewHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <Badge className="bg-green-400/20 text-green-400 border-green-400 mb-4">
        Complete Cybersecurity Mastery Path
      </Badge>
      <h1 className="text-5xl font-bold mb-4 text-green-400">
        Your Cybersecurity Journey
      </h1>
      <p className="text-xl text-green-300/80 max-w-4xl mx-auto mb-8">
        Master cybersecurity through our structured learning path. Progress
        through beginner fundamentals, intermediate practical skills, and
        advanced specialized expertise.
      </p>

      {/* Overall Progress */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-green-300">Overall Progress</span>
          <span className="text-sm text-green-400 font-bold">
            {overallProgress}%
          </span>
        </div>
        <Progress
          value={overallProgress}
          className="h-3 bg-black border border-green-400/30"
        />
      </div>
    </div>
  );
};

export default OverviewHeader;
