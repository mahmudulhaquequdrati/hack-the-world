import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Achievement {
  title: string;
  description: string;
  earned: boolean;
  icon: React.ComponentType<{ className?: string }>;
  category: 'module' | 'lab' | 'game' | 'xp' | 'general';
  progress?: number;
  target?: number;
  xp?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'module': return 'blue';
      case 'lab': return 'yellow';
      case 'game': return 'red';
      case 'xp': return 'purple';
      case 'general': return 'cyan';
      default: return 'green';
    }
  };

  const categoryColor = getCategoryColor(achievement.category);
  const progressPercentage = achievement.target ? Math.min(100, ((achievement.progress || 0) / achievement.target) * 100) : 100;

  return (
    <Card
      className={`bg-black/50 border-2 transition-all duration-300 hover:scale-[1.02] ${
        achievement.earned
          ? `border-${categoryColor}-400/50 bg-${categoryColor}-400/5 shadow-lg shadow-${categoryColor}-400/20`
          : "border-gray-600/30 hover:border-gray-500/50"
      }`}
    >
      <CardContent className="p-4">
        {/* Achievement Header */}
        <div className="flex items-start space-x-3 mb-3">
          <div
            className={`p-3 rounded-xl border-2 ${
              achievement.earned
                ? `bg-${categoryColor}-400/20 text-${categoryColor}-400 border-${categoryColor}-400/40 shadow-lg shadow-${categoryColor}-400/30`
                : "bg-gray-600/20 text-gray-400 border-gray-600/40"
            }`}
          >
            <achievement.icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold font-mono text-sm mb-1 uppercase tracking-wider ${
                achievement.earned ? `text-${categoryColor}-400` : "text-gray-400"
              }`}
            >
              {achievement.title.toLowerCase().replace(/\s+/g, "_")}
            </h3>
            <p
              className={`text-xs leading-relaxed ${
                achievement.earned ? "text-green-300/80" : "text-gray-500"
              }`}
            >
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Progress Bar (if applicable) */}
        {achievement.target && achievement.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono text-green-400/70">
                PROGRESS
              </span>
              <span className="text-xs font-mono font-bold text-green-400">
                {achievement.progress}/{achievement.target}
              </span>
            </div>
            <div className="h-2 bg-gray-800/80 border border-gray-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-${categoryColor}-400 to-${categoryColor}-500 transition-all duration-500 ease-out`}
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="h-full bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          <div className="flex items-center space-x-2">
            {achievement.earned ? (
              <Badge
                variant="outline"
                className={`text-xs font-mono font-bold border-2 px-2 py-1 bg-${categoryColor}-400/10 text-${categoryColor}-400 border-${categoryColor}-400/50`}
              >
                ✓ UNLOCKED
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs font-mono font-bold border-2 px-2 py-1 bg-gray-600/10 text-gray-500 border-gray-600/50"
              >
                ⚬ LOCKED
              </Badge>
            )}
          </div>
          
          {/* XP Reward */}
          {achievement.xp && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${achievement.earned ? `bg-yellow-400/10 border-yellow-400/30 text-yellow-400` : 'bg-gray-600/10 border-gray-600/30 text-gray-500'}`}>
              <span className="text-xs font-mono font-bold">
                +{achievement.xp} XP
              </span>
            </div>
          )}
        </div>

        {/* Category Indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-2 h-2 rounded-full bg-${categoryColor}-400 animate-pulse shadow-lg shadow-${categoryColor}-400/50`}></div>
        </div>
      </CardContent>
    </Card>
  );
};
