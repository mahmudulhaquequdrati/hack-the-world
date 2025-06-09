import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getVideosCountForModule } from "@/lib/appData";
import { getIconFromName } from "@/lib/iconUtils";
import { getCoursePath, getEnrollPath } from "@/lib/pathUtils";
import { Module } from "@/lib/types";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { useMemo } from "react";

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
  isLast,
  isCompleted,
  onNavigate,
  onEnroll,
  isEnrolling,
}: ModuleCardProps) => {
  // Calculate stats from module data (API provides content arrays with counts)
  const stats: ModuleStatsType = useMemo(() => {
    return {
      videos:
        (initialModule as any).content?.videos?.length ||
        getVideosCountForModule(initialModule.id),
      labs:
        (initialModule as any).content?.labs?.length ||
        (initialModule as any).labs ||
        0,
      games:
        (initialModule as any).content?.games?.length ||
        (initialModule as any).games ||
        0,
    };
  }, [initialModule]);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onEnroll(getCoursePath(initialModule.id));
  };

  const handleNavigate = () => {
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
  const ModuleIcon = getIconFromName(initialModule.icon);

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
                      <ModuleIcon className="w-4 h-4" />
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
                  )}`}
                >
                  {initialModule.difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Module Description */}
            <p className="text-green-300/80 text-sm mb-4 font-mono leading-relaxed">
              {initialModule.description}
            </p>

            {/* Content Stats */}
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-green-400/5 rounded p-2">
                  <div className="text-green-400 font-mono text-lg font-bold">
                    {stats.videos}
                  </div>
                  <div className="text-green-400/70 text-xs uppercase tracking-wide">
                    Videos
                  </div>
                </div>
                <div className="text-center bg-yellow-400/5 rounded p-2">
                  <div className="text-yellow-400 font-mono text-lg font-bold">
                    {stats.labs}
                  </div>
                  <div className="text-yellow-400/70 text-xs uppercase tracking-wide">
                    Labs
                  </div>
                </div>
                <div className="text-center bg-red-400/5 rounded p-2">
                  <div className="text-red-400 font-mono text-lg font-bold">
                    {stats.games}
                  </div>
                  <div className="text-red-400/70 text-xs uppercase tracking-wide">
                    Games
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar (if enrolled) */}
            {initialModule.enrolled && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400/70 text-xs font-mono uppercase">
                    Progress
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

            {/* Duration and Topics */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-green-400/70 text-xs">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{initialModule.duration}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {initialModule.topics.slice(0, 3).map((topic, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs bg-green-400/5 border-green-400/30 text-green-400/80"
                  >
                    {topic}
                  </Badge>
                ))}
                {initialModule.topics.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-400/5 border-green-400/30 text-green-400/80"
                  >
                    +{initialModule.topics.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              {!initialModule.enrolled ? (
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  size="sm"
                  className="bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-colors font-mono text-xs"
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
              ) : (
                <Button
                  size="sm"
                  className="bg-blue-500/20 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black transition-colors font-mono text-xs"
                >
                  {isCompleted ? "REVIEW" : "CONTINUE"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleCard;
