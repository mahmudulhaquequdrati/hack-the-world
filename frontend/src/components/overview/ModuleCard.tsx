import { LoadingSkeleton } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DataService } from "@/lib/dataService";
import { getCoursePath, getEnrollPath } from "@/lib/pathUtils";
import { Module } from "@/lib/types";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ModuleCardProps {
  module: Module;
  index: number;
  totalModules: number;
  isLast: boolean;
  isCompleted: boolean;
  onNavigate: (path: string) => void;
  onEnroll: (path: string) => void;
  isEnrolling?: boolean;
}

interface ModuleStatsType {
  videos: number;
  labs: number;
  games: number;
}

const ModuleCard = ({
  module: initialModule,
  index,
  isLast,
  isCompleted,
  onNavigate,
  onEnroll,
  isEnrolling,
}: ModuleCardProps) => {
  const [stats, setStats] = useState<ModuleStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModuleStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate staggered loading for better UX
        await new Promise((resolve) => setTimeout(resolve, 100 + index * 50));

        // Get dynamic stats from DataService
        const [labsData, gamesData] = await Promise.all([
          DataService.getLabsByModule(initialModule.id),
          DataService.getGamesByModule(initialModule.id),
        ]);

        // For videos, we'll use a placeholder count since it's not in the current API
        // In a real implementation, this would come from the API
        const videosCount = Math.floor(Math.random() * 8) + 3; // 3-10 videos

        setStats({
          videos: videosCount,
          labs: Object.keys(labsData).length,
          games: Object.keys(gamesData).length,
        });
      } catch (err) {
        console.error("Failed to load module stats:", err);
        setError("Failed to load module data");
        // Set fallback stats
        setStats({
          videos: 5,
          labs: 3,
          games: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    loadModuleStats();
  }, [initialModule.id, index]);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Call parent handler immediately - this will trigger the loading state
    onEnroll(getCoursePath(initialModule.id));
  };

  const handleNavigate = () => {
    // If enrolled, go to learning page; otherwise, go to course overview
    if (initialModule.enrolled) {
      onNavigate(getEnrollPath(initialModule.id));
    } else {
      onNavigate(getCoursePath(initialModule.id));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 border-green-400";
      case "intermediate":
        return "text-yellow-400 border-yellow-400";
      case "advanced":
        return "text-red-400 border-red-400";
      case "expert":
        return "text-purple-400 border-purple-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const treeChar = isLast ? "└──" : "├──";

  if (loading || !stats) {
    return (
      <div className="relative">
        <div className="flex items-start space-x-1">
          <div className="flex flex-col items-center">
            <span className="text-green-400/70 text-sm leading-none">
              {treeChar}
            </span>
            {!isLast && <div className="w-px h-12 bg-green-400/30 mt-1"></div>}
          </div>
          <div className="flex-1 ml-2 mb-4">
            <LoadingSkeleton type="card" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Tree Structure */}
      <div className="flex items-start space-x-1">
        <div className="flex flex-col items-center">
          <span className="text-green-400/70 text-sm leading-none">
            {treeChar}
          </span>
          {!isLast && <div className="w-px h-12 bg-green-400/30 mt-1"></div>}
        </div>

        {/* Module Card */}
        <Card
          className={`
            flex-1 ${initialModule.bgColor} ${initialModule.borderColor} border-2
            hover:scale-[1.01] cursor-pointer transition-all duration-300
            relative ml-2 mb-4
          `}
          onClick={handleNavigate}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Status Indicator */}
                <div className="flex items-center space-x-2">
                  <div
                    className={`
                      w-8 h-8 rounded border-2 flex items-center justify-center
                      ${
                        isCompleted
                          ? "bg-green-400 text-black border-green-400"
                          : initialModule.enrolled
                          ? `${initialModule.bgColor} ${initialModule.borderColor} ${initialModule.color}`
                          : "bg-gray-600/20 border-gray-600/50 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <initialModule.icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* File-like name */}
                  <div className="font-mono">
                    <span className="text-green-400/70">📁</span>
                    <CardTitle
                      className={`${initialModule.color} text-base inline ml-1`}
                    >
                      {initialModule.title.toLowerCase().replace(/\s+/g, "_")}
                    </CardTitle>
                  </div>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex items-center space-x-2">
                {initialModule.enrolled && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-400/10 border-green-400/50 text-green-400"
                  >
                    ENROLLED
                  </Badge>
                )}
                {isCompleted && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-400/20 border-green-400 text-green-400"
                  >
                    COMPLETED
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs ${getDifficultyColor(
                    initialModule.difficulty
                  )} border-current`}
                >
                  {initialModule.difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Description */}
            <p className="text-green-300/80 text-sm mb-4 font-mono">
              {initialModule.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-green-400 font-mono text-lg font-bold">
                  {stats.videos}
                </div>
                <div className="text-green-400/70 text-xs font-mono">
                  VIDEOS
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-mono text-lg font-bold">
                  {stats.labs}
                </div>
                <div className="text-green-400/70 text-xs font-mono">LABS</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-mono text-lg font-bold">
                  {stats.games}
                </div>
                <div className="text-green-400/70 text-xs font-mono">GAMES</div>
              </div>
            </div>

            {/* Progress Bar (if enrolled) */}
            {initialModule.enrolled && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400/70 text-xs font-mono">
                    PROGRESS
                  </span>
                  <span className="text-green-400 text-xs font-mono">
                    {initialModule.progress}%
                  </span>
                </div>
                <Progress
                  value={initialModule.progress}
                  className="h-2 bg-gray-800"
                />
              </div>
            )}

            {/* Duration and Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-400/70">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-mono">
                  {initialModule.duration}
                </span>
              </div>

              {/* Action Button */}
              {!initialModule.enrolled ? (
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  size="sm"
                  className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono text-xs"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ENROLLING...
                    </>
                  ) : (
                    "ENROLL"
                  )}
                </Button>
              ) : isCompleted ? (
                <Button
                  size="sm"
                  className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono text-xs"
                >
                  REVIEW
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono text-xs"
                >
                  CONTINUE
                </Button>
              )}
            </div>

            {/* Error indicator */}
            {error && (
              <div className="mt-2 text-red-400 text-xs font-mono">
                ⚠️ {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleCard;
