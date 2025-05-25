import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDifficultyColor } from "@/lib/helpers";
import { Module } from "@/lib/types";
import { CheckCircle, Clock } from "lucide-react";

interface ModuleCardProps {
  module: Module;
  index: number;
  totalModules: number;
  isLast: boolean;
  isCompleted: boolean;
  onNavigate: (path: string) => void;
  onEnroll: (path: string) => void;
}

const ModuleCard = ({
  module,
  index,
  totalModules,
  isLast,
  isCompleted,
  onNavigate,
  onEnroll,
}: ModuleCardProps) => {
  const treeChar = isLast ? "└──" : "├──";

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
            flex-1 ${module.bgColor} ${module.borderColor} border-2
            hover:scale-[1.01] cursor-pointer transition-all duration-300
            relative ml-2 mb-4
          `}
          onClick={() => onNavigate(module.path)}
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
                          : module.enrolled
                          ? `${module.bgColor} ${module.borderColor} ${module.color}`
                          : "bg-gray-600/20 border-gray-600/50 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <module.icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* File-like name */}
                  <div className="font-mono">
                    <span className="text-green-400/70">📁</span>
                    <CardTitle
                      className={`${module.color} text-base inline ml-1`}
                    >
                      {module.title.toLowerCase().replace(/\s+/g, "_")}
                    </CardTitle>
                  </div>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex items-center space-x-2">
                {module.enrolled && (
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
                    module.difficulty
                  )} border-current`}
                >
                  {module.difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Description */}
            <p className="text-green-300/70 text-sm mb-3 font-sans">
              {module.description}
            </p>

            {/* Progress Terminal Line */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-green-400">$</span>
                <span className="text-green-300/70">progress</span>
                <span className="text-green-400">--check</span>
                <span className="text-yellow-400">{module.progress}%</span>
              </div>
              <Progress
                value={module.progress}
                className="h-1 bg-black/50 border border-green-400/20 mt-1"
              />
            </div>

            {/* Stats in terminal format */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-mono">
              <div className="text-center">
                <span className="text-green-300/50">labs:</span>
                <span className={`ml-1 font-bold ${module.color}`}>
                  {module.labs}
                </span>
              </div>
              <div className="text-center">
                <span className="text-green-300/50">games:</span>
                <span className={`ml-1 font-bold ${module.color}`}>
                  {module.games}
                </span>
              </div>
              <div className="text-center">
                <span className="text-green-300/50">assets:</span>
                <span className={`ml-1 font-bold ${module.color}`}>
                  {module.assets}
                </span>
              </div>
            </div>

            {/* Duration and Topics */}
            <div className="flex items-center space-x-4 mb-3 text-xs">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-green-300/70" />
                <span className="text-green-300/70">{module.duration}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-1">
                  {module.topics.slice(0, 2).map((topic, topicIndex) => (
                    <Badge
                      key={topicIndex}
                      variant="outline"
                      className="text-xs px-1 py-0 border-green-400/30 text-green-400 font-mono"
                    >
                      #{topic.toLowerCase().replace(/\s+/g, "_")}
                    </Badge>
                  ))}
                  {module.topics.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1 py-0 border-green-400/30 text-green-400 font-mono"
                    >
                      +{module.topics.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-green-400/20">
              {module.enrolled ? (
                <Button
                  size="sm"
                  className="bg-green-400 text-black hover:bg-green-300 font-mono text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(module.enrollPath);
                  }}
                >
                  {">> continue"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-400/50 text-green-400 font-mono text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnroll(module.path);
                  }}
                >
                  {">> enroll"}
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
