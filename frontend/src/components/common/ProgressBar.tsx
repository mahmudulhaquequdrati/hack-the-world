import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar = ({
  value,
  className = "",
  showPercentage = false,
}: ProgressBarProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <Progress value={value} className="h-2 bg-gray-800" />
      {showPercentage && (
        <div className="text-xs text-green-300/70 text-right">{value}%</div>
      )}
    </div>
  );
};

export default ProgressBar;
