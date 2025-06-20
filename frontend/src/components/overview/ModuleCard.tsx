import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiSlice } from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { cn } from "@/lib";
import { getIconFromName } from "@/lib/iconUtils";
import { getCoursePath, getEnrollPath } from "@/lib/pathUtils";
import { Module } from "@/lib/types";
import {
  CheckCircle,
  Clock,
  Loader2,
  Play,
  Send,
  Star,
  UserCheck,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

// Type for handling modules that might have partial content data
type ModuleWithOptionalContent = Module & {
  labs?: number;
  games?: number;
};

interface ModuleCardProps {
  module: Module;
  index: number;
  totalModules: number;
  isLast: boolean;
  isCompleted: boolean;
  onNavigate: (path: string) => void;
  onEnroll: (path: string) => void;
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
}: ModuleCardProps) => {
  const { isAuthenticated } = useAuthRTK();
  const [localEnrolling, setLocalEnrolling] = useState(false);

  // Cast to module type with optional content for content access
  const moduleWithContent = initialModule as ModuleWithOptionalContent;

  // Use enrollment mutation
  const [enrollInModule] = apiSlice.useEnrollInModuleMutation();

  // Get enrollment data from module props (already processed in overview)
  const isEnrolled = initialModule.enrolled || false;
  const enrollmentInfo =
    (
      initialModule as ModuleWithOptionalContent & {
        enrollmentInfo?: { progressPercentage: number };
      }
    ).enrollmentInfo || null;

  // Calculate stats from module data (API provides content arrays with counts)
  const stats: ModuleStatsType = useMemo(() => {
    return {
      videos: moduleWithContent.content?.videos?.length || 0,
      labs:
        moduleWithContent.content?.labs?.length || moduleWithContent.labs || 0,
      games:
        moduleWithContent.content?.games?.length ||
        moduleWithContent.games ||
        0,
    };
  }, [moduleWithContent]);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onEnroll(getCoursePath(initialModule._id));
      return;
    }

    setLocalEnrolling(true);
    try {
      await enrollInModule(initialModule._id).unwrap();
      // After successful enrollment, the query will be invalidated and refetched
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setLocalEnrolling(false);
    }
  };

  const handleNavigate = () => {
    if (isEnrolled) {
      onNavigate(getEnrollPath(initialModule._id));
    } else {
      onNavigate(getCoursePath(initialModule._id));
    }
  };

  const handleViewDetails = () => {
    onNavigate(getCoursePath(initialModule._id));
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

  return (
    <div className="relative">
      {/* Tree Structure */}
      <div className="flex items-start space-x-1">
        <div className="md:flex flex-col items-center hidden">
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
          //   onClick={handleNavigate}
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
            {/* Card Header */}
            <div className="p-4 sm:p-6 pb-4 mt-2 md:mt-0">
              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Module Icon with Retro Styling */}
                <div
                  className={cn(
                    "relative w-8 h-8  md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0",
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
                    className={cn(
                      "w-5 h-5 md:w-8 md:h-8 relative z-10",
                      initialModule.color
                    )}
                  />
                </div>

                {/* Title and Description */}
                <div className="flex flex-col">
                  <div className="flex items-start space-x-2 sm:space-x-3 mb-2">
                    <h3
                      className={cn(
                        "text-base sm:text-xl font-bold font-mono uppercase tracking-wider",
                        `text-white transition-colors`,
                        "",
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
                        "px-2 sm:px-3 py-1 rounded-full border-2 text-xs font-mono uppercase flex-shrink-0",
                        "bg-black/50 backdrop-blur-sm hidden md:block ",
                        getDifficultyColor(initialModule.difficulty),
                        " animate-pulse"
                      )}
                    >
                      {initialModule.difficulty}
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-mono line-clamp-2 sm:line-clamp-none">
                    {initialModule.description}
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
                      {initialModule.content?.estimatedHours}
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

            {/* Progress Section (if enrolled) */}
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
                        initialModule.color
                      )}
                    >
                      {enrollmentInfo?.progressPercentage}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={enrollmentInfo?.progressPercentage}
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
                      style={{
                        width: `${enrollmentInfo?.progressPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Topics Tags */}
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex flex-wrap gap-1 sm:gap-2">
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

            {/* Action Buttons */}
            <div className="px-4 sm:px-6 pb-6">
              {!isEnrolled ? (
                // Not enrolled: Show View Details button + small Enroll button
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Main View Details Button */}
                  <Button
                    onClick={handleViewDetails}
                    variant="outline"
                    className={cn(
                      "flex-1 h-10 sm:h-12 font-mono uppercase tracking-wider text-xs sm:text-sm font-bold bg-gradient-to-r border shadow-lg relative overflow-hidden transition-all duration-300"
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>VIEW DETAILS</span>
                    </span>
                  </Button>

                  {/* Small Enroll Button */}
                  <Button
                    onClick={handleEnroll}
                    disabled={localEnrolling}
                    className={cn(
                      "h-10 sm:h-12 px-3 sm:px-4 font-mono uppercase tracking-wider text-xs font-bold",
                      "bg-gradient-to-r from-green-600 to-green-500",
                      "border-2 border-green-400",
                      "text-black",
                      "hover:from-green-500 hover:to-green-400",
                      "transition-all duration-300",
                      "relative overflow-hidden",
                      localEnrolling && "animate-pulse"
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-1">
                      {localEnrolling ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <UserCheck className="w-3 h-3" />
                          <span>ENROLL</span>
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              ) : (
                // Enrolled: Show View Details button + Enrolled status
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Main View Details Button */}
                  <Button
                    onClick={handleViewDetails}
                    variant="outline"
                    className={cn(
                      "flex-1 h-10 sm:h-12 font-mono uppercase tracking-wider text-xs sm:text-sm font-bold bg-gradient-to-r border shadow-lg relative overflow-hidden transition-all duration-300"
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>VIEW DETAILS</span>
                    </span>
                  </Button>

                  {/* Status Corner Badge */}
                  <div className=" z-10">
                    {isCompleted && (
                      <Button
                        // onClick={handleNavigate}
                        className={cn(
                          "h-10 sm:h-12 px-3 sm:px-4 font-mono uppercase tracking-wider text-xs font-bold",
                          "bg-gradient-to-r from-green-600 to-green-500",
                          "border-2 border-green-400",
                          "text-black",
                          "hover:from-green-500 hover:to-green-400",
                          "transition-all duration-300",
                          "relative overflow-hidden",
                          "animate-pulse"
                        )}
                      >
                        <span className="relative z-10 flex items-center justify-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>COMPLETED</span>
                        </span>
                      </Button>
                    )}
                    {isEnrolled && !isCompleted && (
                      <Button
                        onClick={handleNavigate}
                        className={cn(
                          "h-10 sm:h-12 px-3 sm:px-4 font-mono uppercase tracking-wider text-xs font-bold",
                          "bg-gradient-to-r from-green-600 to-green-500",
                          "border-2 border-green-400",
                          "text-black",
                          "hover:from-green-500 hover:to-green-400",
                          "transition-all duration-300",
                          "relative overflow-hidden",
                          "animate-pulse"
                        )}
                      >
                        <span className="relative z-10 flex items-center justify-center space-x-1">
                          <Play className="w-3 h-3" />
                          <span>CONTINUE</span>
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Retro Status Indicators */}
            <div className="absolute top-2 left-2 flex space-x-1">
              {isEnrolled && (
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
