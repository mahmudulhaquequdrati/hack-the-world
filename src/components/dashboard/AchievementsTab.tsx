import { Terminal } from "lucide-react";
import { AchievementCard } from "./AchievementCard";

interface Achievement {
  title: string;
  description: string;
  earned: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

interface AchievementsTabProps {
  achievements: Achievement[];
}

export const AchievementsTab = ({ achievements }: AchievementsTabProps) => {
  return (
    <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Terminal className="w-5 h-5 text-green-400" />
        <span className="text-green-400 font-mono text-sm">
          ~/achievements$ cat badges.log
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};
