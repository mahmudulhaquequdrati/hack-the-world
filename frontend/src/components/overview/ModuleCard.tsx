import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib";
import { getVideosCountForModule } from "@/lib/appData";
import { getIconFromName } from "@/lib/iconUtils";
import { getCoursePath, getEnrollPath } from "@/lib/pathUtils";
import { Module } from "@/lib/types";
import { CheckCircle, Clock, Loader2, Play, Star, Zap } from "lucide-react";
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
        return "text-green-400 border-green-400 shadow-green-400/50";
      case "intermediate":
        return "text-yellow-400 border-yellow-400 shadow-yellow-400/50";
      case "advanced":
        return "text-red-400 border-red-400 shadow-red-400/50";
      case "expert":
        return "text-purple-400 border-purple-400 shadow-purple-400/50";
      default:
        return "text-gray-400 border-gray-400 shadow-gray-400/50";
    }
  };

  // Extract color from module.color (e.g., "text-blue-400" -> "blue")
  const getColorName = (colorClass: string) => {
    const match = colorClass.match(/text-(\w+)-\d+/);
    return match ? match[1] : "green";
  };

  const colorName = getColorName(initialModule.color);
  const treeChar = isLast ? "└──" : "├──";
  const ModuleIcon = getIconFromName(initialModule.icon);

  console.log(initialModule);

  return (
    <div className="relative">
      {/* Tree Structure */}
      <div className="flex items-start space-x-1">
        <div className="flex flex-col items-center">
          <span className="text-green-400/70 text-sm leading-none font-mono">
            {treeChar}
          </span>
          {!isLast && <div className="w-px h-20 bg-green-400/30 mt-1"></div>}
        </div>

        {/* Retro Module Card */}
        <div
          className={cn(
            "relative flex-1 ml-2 mb-4 group cursor-pointer",
            "transform transition-all duration-300 hover:scale-[1.02]"
          )}
          onClick={handleNavigate}
        >
          {/* Main Card Container with Retro Design */}
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border-2",
              "bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95",
              initialModule.borderColor,
              "shadow-lg hover:shadow-2xl transition-all duration-300",
              `hover:shadow-${colorName}-400/20`
            )}
          >
            {/* Retro Scanlines Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="h-full w-full bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] animate-pulse"></div>
            </div>

            {/* Glitch Border Animation */}
            <div
              className={cn(
                "absolute inset-0 rounded-lg",
                "bg-gradient-to-r",
                `from-${colorName}-400/0 via-${colorName}-400/20 to-${colorName}-400/0`,
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )}
            ></div>

            {/* Status Corner Badge */}
            <div className="absolute top-3 right-3 z-10">
              {isCompleted && (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "bg-green-400 text-black shadow-lg shadow-green-400/50",
                    "animate-pulse"
                  )}
                >
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
              {initialModule.enrolled && !isCompleted && (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    `bg-${colorName}-400/20 border-2 border-${colorName}-400`,
                    `text-${colorName}-400 shadow-lg shadow-${colorName}-400/30`
                  )}
                >
                  <Play className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start space-x-4">
                {/* Module Icon with Retro Styling */}
                <div
                  className={cn(
                    "relative w-16 h-16 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br from-gray-800/50 to-black/50",
                    "border-2 shadow-lg",
                    initialModule.borderColor,
                    `shadow-${colorName}-400/30`,
                    "group-hover:animate-pulse"
                  )}
                >
                  {/* Icon Glow Effect */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-xl blur-sm opacity-50",
                      initialModule.bgColor
                    )}
                  ></div>
                  <ModuleIcon
                    className={cn("w-8 h-8 relative z-10", initialModule.color)}
                  />
                </div>

                {/* Title and Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3
                      className={cn(
                        "text-xl font-bold font-mono uppercase tracking-wider",
                        `text-white transition-colors`,
                        "truncate",
                        initialModule.color?.includes("green")
                          ? "group-hover:text-green-400"
                          : initialModule.color?.includes("blue")
                          ? "group-hover:text-blue-400"
                          : initialModule.color?.includes("yellow")
                          ? "group-hover:text-yellow-400"
                          : initialModule.color?.includes("red")
                          ? "group-hover:text-red-400"
                          : initialModule.color?.includes("purple")
                          ? "group-hover:text-purple-400"
                          : "group-hover:text-green-400"
                      )}
                    >
                      {initialModule.title}
                    </h3>

                    {/* Retro Difficulty Badge */}
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full border-2 text-xs font-mono uppercase",
                        "bg-black/50 backdrop-blur-sm",
                        getDifficultyColor(initialModule.difficulty),
                        " animate-pulse"
                      )}
                    >
                      {initialModule.difficulty}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed font-mono">
                    {initialModule.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Retro Stats Grid */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-4 gap-3">
                {/* Duration */}
                <div
                  className={cn(
                    "relative p-3 rounded-lg border",
                    "bg-gradient-to-br from-gray-900/80 to-black/80",
                    "border-gray-700/50 hover:border-green-400/50",
                    "transition-all duration-300 group/stat"
                  )}
                >
                  <div className="text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-green-400 group-hover/stat:animate-spin" />
                    <div className="text-green-400 font-mono text-sm font-bold">
                      {initialModule.duration}
                    </div>
                    <div className="text-green-400/60 text-xs font-mono uppercase">
                      Time
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-green-400/5 rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                </div>

                {/* Videos */}
                <div
                  className={cn(
                    "relative p-3 rounded-lg border",
                    "bg-gradient-to-br from-gray-900/80 to-black/80",
                    "border-gray-700/50 hover:border-blue-400/50",
                    "transition-all duration-300 group/stat"
                  )}
                >
                  <div className="text-center">
                    <Play className="w-4 h-4 mx-auto mb-1 text-blue-400 group-hover/stat:animate-bounce" />
                    <div className="text-blue-400 font-mono text-sm font-bold">
                      {stats.videos}
                    </div>
                    <div className="text-blue-400/60 text-xs font-mono uppercase">
                      Videos
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-blue-400/5 rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                </div>

                {/* Labs */}
                <div
                  className={cn(
                    "relative p-3 rounded-lg border",
                    "bg-gradient-to-br from-gray-900/80 to-black/80",
                    "border-gray-700/50 hover:border-yellow-400/50",
                    "transition-all duration-300 group/stat"
                  )}
                >
                  <div className="text-center">
                    <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-400 group-hover/stat:animate-pulse" />
                    <div className="text-yellow-400 font-mono text-sm font-bold">
                      {stats.labs}
                    </div>
                    <div className="text-yellow-400/60 text-xs font-mono uppercase">
                      Labs
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-yellow-400/5 rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                </div>

                {/* Games */}
                <div
                  className={cn(
                    "relative p-3 rounded-lg border",
                    "bg-gradient-to-br from-gray-900/80 to-black/80",
                    "border-gray-700/50 hover:border-red-400/50",
                    "transition-all duration-300 group/stat"
                  )}
                >
                  <div className="text-center">
                    <Star className="w-4 h-4 mx-auto mb-1 text-red-400 group-hover/stat:animate-spin" />
                    <div className="text-red-400 font-mono text-sm font-bold">
                      {stats.games}
                    </div>
                    <div className="text-red-400/60 text-xs font-mono uppercase">
                      Games
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-red-400/5 rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Progress Section (if enrolled) */}
            {initialModule.enrolled && (
              <div className="px-6 pb-4">
                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    "bg-gradient-to-r from-gray-900/60 to-black/60",
                    "border-gray-700/50"
                  )}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-green-400/80 text-xs font-mono uppercase tracking-wider">
                      Mission Progress
                    </span>
                    <span
                      className={cn(
                        "text-sm font-mono font-bold px-2 py-1 rounded",
                        "bg-green-400/10 border border-green-400/30",
                        initialModule.color
                      )}
                    >
                      {initialModule.progress}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={initialModule.progress}
                      className={cn(
                        "h-3 bg-gray-800/80 border border-gray-700/50",
                        "shadow-inner"
                      )}
                    />
                    {/* Retro Progress Glow */}
                    <div
                      className={cn(
                        "absolute top-0 left-0 h-3 rounded-full",
                        "bg-gradient-to-r opacity-50 blur-sm",
                        `from-${colorName}-400 to-${colorName}-600`
                      )}
                      style={{ width: `${initialModule.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Topics Tags */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {initialModule.topics.slice(0, 3).map((topic, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className={cn(
                      "text-xs font-mono border-2 rounded-full px-3 py-1",
                      "bg-gradient-to-r from-gray-900/80 to-black/80",
                      "border-green-600/50 text-green-400",

                      "transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20"
                    )}
                  >
                    {topic.toUpperCase()}
                  </Badge>
                ))}
                {initialModule.topics.length > 3 && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-mono border-2 rounded-full px-3 py-1",
                      "bg-gradient-to-r from-gray-900/80 to-black/80",
                      "border-gray-600/50 text-gray-400",
                      "hover:border-gray-400/50",
                      "transition-all duration-300"
                    )}
                  >
                    +{initialModule.topics.length - 3} MORE
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="px-6 pb-6">
              {!initialModule.enrolled ? (
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className={cn(
                    "w-full h-12 font-mono uppercase tracking-wider text-sm font-bold",
                    "bg-gradient-to-r from-green-600 to-green-500",
                    "border-2 border-green-400",
                    "text-black ",
                    "hover:from-green-500 hover:to-green-400",

                    "transition-all duration-300",
                    "relative overflow-hidden",
                    isEnrolling && "animate-pulse"
                  )}
                >
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 blur-sm"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isEnrolling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>INITIALIZING...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>ENROLL NOW</span>
                      </>
                    )}
                  </span>
                </Button>
              ) : (
                <Button
                  className={cn(
                    "w-full h-12 font-mono uppercase tracking-wider text-sm font-bold",
                    "bg-gradient-to-r border-2 shadow-lg",
                    `from-${colorName}-600 to-${colorName}-500`,
                    `border-${colorName}-400 shadow-${colorName}-400/50`,
                    "text-black",
                    `hover:from-${colorName}-500 hover:to-${colorName}-400`,
                    `hover:shadow-xl hover:shadow-${colorName}-400/60`,
                    "transition-all duration-300",
                    "relative overflow-hidden"
                  )}
                >
                  {/* Button Glow Effect */}
                  <div
                    className={cn(
                      "absolute inset-0 blur-sm",
                      `bg-gradient-to-r from-${colorName}-400/20 to-${colorName}-600/20`
                    )}
                  ></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>REVIEW MISSION</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>CONTINUE MISSION</span>
                      </>
                    )}
                  </span>
                </Button>
              )}
            </div>

            {/* Retro Status Indicators */}
            <div className="absolute top-2 left-2 flex space-x-1">
              {initialModule.enrolled && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              )}
              <div
                className={cn(
                  "w-2 h-2 rounded-full animate-pulse shadow-lg",
                  `bg-${colorName}-400 shadow-${colorName}-400/50`
                )}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
