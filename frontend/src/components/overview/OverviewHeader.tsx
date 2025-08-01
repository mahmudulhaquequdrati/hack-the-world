import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OverviewHeaderProps {
  overallProgress: number;
  showProgress?: boolean;
}

const OverviewHeader = ({ overallProgress, showProgress = true }: OverviewHeaderProps) => {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <Badge className="bg-green-400/20 text-green-400 border-green-400 mb-4 mx-4 text-xs sm:text-sm">
        Complete Cybersecurity Mastery Path
      </Badge>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-green-400 px-4">
        Your Cybersecurity Journey
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-green-300/80 max-w-4xl mx-auto mb-8 px-4">
        Master cybersecurity through our structured learning path. Progress
        through beginner fundamentals, intermediate practical skills, and
        advanced specialized expertise.
      </p>

      {/* Overall Progress - Only show when authenticated */}
      {showProgress && (
        <div className="max-w-md mx-auto mb-8 px-4">
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
      )}
    </div>
  );
};

export default OverviewHeader;
