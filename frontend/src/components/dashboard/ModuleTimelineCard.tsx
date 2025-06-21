import { cn } from "@/lib";
import { getIconFromName } from "@/lib/iconUtils";
import { Module } from "@/lib/types";
import { CheckCircle, Clock, Play, Star, UserCheck, Zap } from "lucide-react";
import { Button } from "../ui/button";

interface ModuleTimelineCardProps {
  module: Module;
  isLast: boolean;
  onModuleClick: (module: Module) => void;
}

export const ModuleTimelineCard = ({
  module,
  onModuleClick,
}: ModuleTimelineCardProps) => {
  // Extract color from module.color (e.g., "text-blue-400" -> "blue")
  const getColorName = (colorClass: string) => {
    const match = colorClass.match(/text-(\w+)-\d+/);
    return match ? match[1] : "green";
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

  const colorName = getColorName(module.color || "text-green-400");
  const ModuleIcon = getIconFromName(module.icon);
  const isCompleted = module.completed;
  const isEnrolled = module.enrolled;

  // Calculate stats from module data
  const stats = {
    videos: module.content?.videos?.length || 0,
    labs: module.labs || 0,
    games: module.games || 0,
  };

  return (
    <div className="relative">
      {/* Retro Module Card */}
      <div
        className={cn(
          "relative flex-1 ml-0 md:ml-2 mb-4 group cursor-pointer",
          "transform transition-all duration-300 hover:scale-[1.02]"
        )}
        // onClick={() => onModuleClick(module)}
      >
        {/* Main Card Container with Retro Design */}
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border-2",
            "bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95",
            module.borderColor || "border-green-400/30",
            "shadow-lg hover:shadow-2xl transition-all duration-300"
          )}
        >
          {/* Retro Scanlines Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] animate-pulse"></div>
          </div>

          {/* Card Header */}
          <div className="p-4 sm:p-6 pb-4 mt-2 md:mt-0">
            <div className="flex items-start space-x-3 sm:space-x-4">
              {/* Module Icon with Retro Styling */}
              <div
                className={cn(
                  "relative w-8 h-8 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0",
                  "bg-gradient-to-br from-gray-800/50 to-black/50",
                  "border-2 shadow-lg",
                  module.borderColor || "border-green-400/30",
                  `shadow-${colorName}-400/30`,
                  "group-hover:animate-pulse"
                )}
              >
                {/* Icon Glow Effect */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-xl blur-sm opacity-50",
                    module.bgColor || "bg-green-500/10"
                  )}
                ></div>
                <ModuleIcon
                  className={cn(
                    "w-5 h-5 md:w-8 md:h-8 relative z-10",
                    module.color || "text-green-400"
                  )}
                />
              </div>

              {/* Title and Description */}
              <div className="flex flex-col">
                <div className="flex items-start space-x-2 sm:space-x-3 mb-2">
                  <h3
                    className={cn(
                      "text-base sm:text-xl font-bold font-mono uppercase tracking-wider",
                      "text-white transition-colors",
                      module.color?.includes("green")
                        ? "group-hover:text-green-400"
                        : module.color?.includes("blue")
                        ? "group-hover:text-blue-400"
                        : module.color?.includes("yellow")
                        ? "group-hover:text-yellow-400"
                        : module.color?.includes("red")
                        ? "group-hover:text-red-400"
                        : module.color?.includes("purple")
                        ? "group-hover:text-purple-400"
                        : "group-hover:text-green-400"
                    )}
                  >
                    {module.title}
                  </h3>

                  {/* Retro Difficulty Badge */}
                  <div
                    className={cn(
                      "px-2 sm:px-3 py-1 rounded-full border-2 text-xs font-mono uppercase flex-shrink-0",
                      "bg-black/50 backdrop-blur-sm hidden md:block",
                      getDifficultyColor(module.difficulty),
                      "animate-pulse"
                    )}
                  >
                    {module.difficulty}
                  </div>
                </div>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-mono line-clamp-2 sm:line-clamp-none">
                  {module.description}
                </p>
              </div>
            </div>
          </div>

          {/* Retro Stats Grid */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
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
                    {module.content?.estimatedHours || "2h"}
                  </div>
                  <div className="text-green-400/60 text-xs font-mono uppercase">
                    HOURS
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

          {/* Progress Section */}
          {isEnrolled && (
            <div className="px-4 sm:px-6 pb-4">
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
                      module.color || "text-green-400"
                    )}
                  >
                    {module.progress || 0}%
                  </span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-800/80 border border-gray-700/50 rounded-full shadow-inner overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        isCompleted
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : (module.progress || 0) > 0
                          ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                          : "bg-gray-600"
                      )}
                      style={{ width: `${module.progress || 0}%` }}
                    />
                  </div>
                  {/* Retro Progress Glow */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 h-3 rounded-full",
                      "bg-gradient-to-r opacity-50 blur-sm",
                      `from-${colorName}-400 to-${colorName}-600`
                    )}
                    style={{
                      width: `${module.progress || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Topics Tags */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {module.topics?.slice(0, 3).map((topic, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "text-xs font-mono border-2 rounded-full px-3 py-1",
                    "bg-gradient-to-r from-gray-900/80 to-black/80",
                    "border-green-600/50 text-green-400",
                    "transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20"
                  )}
                >
                  {topic.toUpperCase()}
                </div>
              )) || []}
              {module.topics && module.topics.length > 3 && (
                <div
                  className={cn(
                    "text-xs font-mono border-2 rounded-full px-3 py-1",
                    "bg-gradient-to-r from-gray-900/80 to-black/80",
                    "border-gray-600/50 text-gray-400",
                    "hover:border-gray-400/50",
                    "transition-all duration-300"
                  )}
                >
                  +{module.topics.length - 3} MORE
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Main Continue Button */}
              <Button
                onClick={() => onModuleClick(module)}
                variant={"default"}
                className={cn(
                  "flex-1 h-10 sm:h-12 font-mono uppercase tracking-wider text-xs sm:text-sm font-bold",
                  "border-2 border-green-400",
                  "text-black",
                  "hover:bg-green-500 hover:to-green-400",
                  "transition-all duration-300",
                  "relative overflow-hidden rounded-lg cursor-pointer"
                )}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{"CONTINUE"}</span>
                </span>
              </Button>

              {/* Status Corner Badge */}
              <div className=" z-10">
                {isCompleted && (
                  <Button
                    variant={"outline"}
                    className="h-10 sm:h-12 text-green-400 w-full"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>COMPLETED</span>
                    </span>
                  </Button>
                )}
                {isEnrolled && !isCompleted && (
                  <Button
                    variant={"outline"}
                    className="h-10 sm:h-12 text-green-400 w-full"
                  >
                    <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>ENROLLED</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Retro Status Indicators */}
          <div className="absolute top-2 left-2 flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
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
  );
};
