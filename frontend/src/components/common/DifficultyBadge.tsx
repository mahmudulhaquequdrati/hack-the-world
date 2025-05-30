import { Badge } from "@/components/ui/badge";
import { getDifficultyColor } from "@/lib/helpers";

interface DifficultyBadgeProps {
  difficulty: string;
  className?: string;
}

const DifficultyBadge = ({
  difficulty,
  className = "",
}: DifficultyBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={`${getDifficultyColor(
        difficulty
      )} border-current ${className}`}
    >
      {difficulty}
    </Badge>
  );
};

export default DifficultyBadge;
