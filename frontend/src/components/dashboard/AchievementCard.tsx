import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Achievement {
  title: string;
  description: string;
  earned: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  return (
    <Card
      className={`bg-black/50 border transition-all ${
        achievement.earned
          ? "border-green-400/50 bg-green-400/5"
          : "border-gray-600/30"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-full ${
              achievement.earned
                ? "bg-green-400/20 text-green-400"
                : "bg-gray-600/20 text-gray-400"
            }`}
          >
            <achievement.icon className="w-6 h-6" />
          </div>
          <div>
            <h3
              className={`font-semibold font-mono ${
                achievement.earned ? "text-green-400" : "text-gray-400"
              }`}
            >
              {achievement.title.toLowerCase().replace(/\s+/g, "_")}
            </h3>
            <p
              className={`text-sm ${
                achievement.earned ? "text-green-300/70" : "text-gray-500"
              }`}
            >
              {achievement.description}
            </p>
            {achievement.earned && (
              <Badge
                variant="outline"
                className="mt-1 text-xs text-green-400 border-green-400/50"
              >
                UNLOCKED
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
