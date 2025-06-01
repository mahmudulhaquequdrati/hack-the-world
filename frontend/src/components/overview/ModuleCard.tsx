import { LoadingSkeleton } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getNormalizedGamesByModule,
  getNormalizedLabsByModule,
  getVideosCountForModule,
} from "@/lib/appData";
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
  totalModules,
  isLast,
  isCompleted,
  onNavigate,
  onEnroll,
  isEnrolling,
}: ModuleCardProps) => {
  const [stats, setStats] = useState<ModuleStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModuleStats = async () => {
      setLoading(true);

      // Simulate API call with slight delay for staggered loading
      await new Promise((resolve) => setTimeout(resolve, 500 + index * 200));

      // Get dynamic stats
      const videosCount = getVideosCountForModule(initialModule.id);
      const labsData = getNormalizedLabsByModule(initialModule.id);
      const gamesData = getNormalizedGamesByModule(initialModule.id);

      setStats({
        videos: videosCount,
        labs: Object.keys(labsData).length,
        games: Object.keys(gamesData).length,
      });
      setLoading(false);
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
            <p className="text-green-300/70 text-sm mb-3 font-sans">
              {initialModule.description}
            </p>

            {/* Progress Terminal Line */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-green-400">$</span>
                <span className="text-green-300/70">progress</span>
                <span className="text-green-400">--check</span>
                <span className="text-yellow-400">
                  {initialModule.progress}%
                </span>
              </div>
              <Progress
                value={initialModule.progress}
                className="h-1 bg-black/50 border border-green-400/20 mt-1"
              />
            </div>

            {/* Stats in terminal format */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-mono">
              <div className="text-center">
                <span className="text-green-300/50">videos:</span>
                <span className={`ml-1 font-bold text-cyan-400`}>
                  {stats.videos}
                </span>
              </div>
              <div className="text-center">
                <span className="text-green-300/50">labs:</span>
                <span className={`ml-1 font-bold text-yellow-400`}>
                  {stats.labs}
                </span>
              </div>
              <div className="text-center">
                <span className="text-green-300/50">games:</span>
                <span className={`ml-1 font-bold text-red-400`}>
                  {stats.games}
                </span>
              </div>
            </div>

            {/* Duration and Topics */}
            <div className="flex items-center space-x-4 mb-3 text-xs">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-green-300/70" />
                <span className="text-green-300/70">
                  {initialModule.duration}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-1">
                  {initialModule.topics.slice(0, 2).map((topic, topicIndex) => (
                    <Badge
                      key={topicIndex}
                      variant="outline"
                      className="text-xs px-1 py-0 border-green-400/30 text-green-400 font-mono"
                    >
                      #{topic.toLowerCase().replace(/\s+/g, "_")}
                    </Badge>
                  ))}
                  {initialModule.topics.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1 py-0 border-green-400/30 text-green-400 font-mono"
                    >
                      +{initialModule.topics.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-green-400/20">
              {initialModule.enrolled ? (
                <Button
                  size="sm"
                  className="bg-green-400 text-black hover:bg-green-300 font-mono text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(getEnrollPath(initialModule.id));
                  }}
                >
                  {">> continue"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className={`
                    border-green-400/50 text-green-400 font-mono text-xs
                    hover:bg-green-400/10 transition-all duration-200
                    ${isEnrolling ? "opacity-80 cursor-not-allowed" : ""}
                  `}
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>enrolling...</span>
                    </div>
                  ) : (
                    ">> enroll"
                  )}
                </Button>
              )}

              <div className="text-xs font-mono text-green-300/50">
                {String(index + 1).padStart(2, "0")}/
                {String(totalModules).padStart(2, "0")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleCard;
