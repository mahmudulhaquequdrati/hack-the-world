import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IconRenderer } from "@/lib/dataTransformers";
import { Module, Phase } from "@/lib/types";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Lock,
  Play,
  Plus,
  Target,
  Terminal,
  Zap,
} from "lucide-react";

interface CourseTreeProps {
  phases: Phase[];
  expandedPhases: string[];
  onTogglePhase: (phaseId: string) => void;
  onModuleClick: (module: Module) => void;
  getAllModules: () => Module[];
  getEnrolledModules: () => Module[];
  getCompletedModules: () => Module[];
}

const CourseTree = ({
  phases,
  expandedPhases,
  onTogglePhase,
  onModuleClick,
  getAllModules,
  getEnrolledModules,
  getCompletedModules,
}: CourseTreeProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "advanced":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "expert":
        return "text-purple-400 bg-purple-400/20 border-purple-400/30";
      case "master":
        return "text-orange-400 bg-orange-400/20 border-orange-400/30";
      default:
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
    }
  };

  const renderModuleTreeItem = (
    module: Module,
    moduleIndex: number,
    isLastModule: boolean,
    isLastPhase: boolean
  ) => {
    const isCompleted = module.completed;
    const isEnrolled = module.enrolled;

    return (
      <div key={module.id} className="relative group">
        {/* Tree structure lines */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center pointer-events-none">
          {/* Vertical line from parent phase */}
          {!isLastModule && !isLastPhase && (
            <div className="w-px bg-green-400/20 flex-1 absolute top-0 left-4" />
          )}

          {/* Branch connector */}
          <div className="absolute top-6 left-4 w-4 h-px bg-green-400/30" />
          <div className="absolute top-0 left-4 w-px h-6 bg-green-400/30" />

          {/* Module status indicator */}
          <div
            className={`absolute top-5 left-3 w-2 h-2 rounded-full z-10 ${
              isCompleted
                ? "bg-green-400"
                : isEnrolled
                ? "bg-yellow-400"
                : "bg-gray-600"
            }`}
          />
        </div>

        {/* Module content */}
        <div className="ml-8 mb-3">
          <div
            className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
              isEnrolled
                ? `${module.bgColor} ${module.borderColor} hover:border-opacity-100`
                : "bg-gray-900/30 border-gray-700/30 hover:border-gray-600/50"
            }`}
            onClick={() => onModuleClick(module)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* Module icon */}
                <div
                  className={`p-2 rounded-lg ${
                    isEnrolled ? module.bgColor : "bg-gray-800/50"
                  }`}
                >
                  <IconRenderer
                    icon={module.icon}
                    className={`w-5 h-5 ${
                      isEnrolled ? module.color : "text-gray-500"
                    }`}
                  />
                </div>

                {/* Module details */}
                <div className="flex-1 min-w-0">
                  {/* Title and status */}
                  <div className="flex items-center space-x-2 mb-1">
                    <h3
                      className={`font-semibold ${
                        isEnrolled ? module.color : "text-gray-400"
                      } truncate`}
                    >
                      {module.title}
                    </h3>

                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    )}
                    {!isEnrolled && (
                      <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm mb-3 ${
                      isEnrolled ? "text-green-300/70" : "text-gray-500"
                    }`}
                  >
                    {module.description}
                  </p>

                  {/* Module metadata */}
                  <div className="flex items-center flex-wrap gap-3 mb-3">
                    <div className="flex items-center space-x-1 text-xs">
                      <Clock className="w-3 h-3" />
                      <span
                        className={
                          isEnrolled ? "text-green-300/70" : "text-gray-500"
                        }
                      >
                        {module.duration}
                      </span>
                    </div>

                    <Badge
                      className={`text-xs px-2 py-0.5 border ${getDifficultyColor(
                        module.difficulty
                      )}`}
                    >
                      {module.difficulty}
                    </Badge>

                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span
                          className={
                            isEnrolled ? "text-green-300/70" : "text-gray-500"
                          }
                        >
                          {module.labs}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span
                          className={
                            isEnrolled ? "text-green-300/70" : "text-gray-500"
                          }
                        >
                          {module.games}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span
                          className={
                            isEnrolled ? "text-green-300/70" : "text-gray-500"
                          }
                        >
                          {module.assets}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Topics tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {module.topics.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded ${
                          isEnrolled
                            ? "bg-green-400/10 text-green-300"
                            : "bg-gray-800/50 text-gray-400"
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                    {module.topics.length > 3 && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isEnrolled
                            ? "bg-green-400/10 text-green-300"
                            : "bg-gray-800/50 text-gray-400"
                        }`}
                      >
                        +{module.topics.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Simple progress for enrolled modules */}
                  {isEnrolled && module.progress > 0 && (
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-green-300/70">Progress</span>
                      <span className={`${module.color} font-medium`}>
                        {module.progress}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action button */}
              <div className="ml-4 flex-shrink-0">
                {isEnrolled ? (
                  <Button
                    size="sm"
                    className="bg-green-400 text-black hover:bg-green-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onModuleClick(module);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-400/40 text-green-400 hover:bg-green-400/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onModuleClick(module);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Enroll
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhaseTree = (phase: Phase, phaseIndex: number) => {
    const isExpanded = expandedPhases.includes(phase.id);
    const isLastPhase = phaseIndex === phases.length - 1;
    const enrolledModules = phase.modules.filter((m) => m.enrolled);
    const completedModules = phase.modules.filter((m) => m.completed);

    return (
      <div key={phase.id} className="relative mb-4">
        {/* Main tree trunk */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center pointer-events-none">
          {/* Vertical trunk line */}
          {!isLastPhase && (
            <div className="w-px bg-green-400/30 flex-1 absolute top-8 left-4" />
          )}

          {/* Phase root node */}
          <div className="absolute top-6 left-3 w-2 h-2 bg-green-400 rounded-full z-10" />
        </div>

        {/* Phase container */}
        <Collapsible
          open={isExpanded}
          onOpenChange={() => onTogglePhase(phase.id)}
        >
          <CollapsibleTrigger className="w-full">
            <div className="ml-8 mb-4 p-4 bg-green-400/10 border border-green-400/30 rounded-lg hover:bg-green-400/15 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <phase.icon className={`w-6 h-6 ${phase.color}`} />
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-green-400">
                      {phase.title}
                    </h2>
                    <p className="text-green-300/70 text-sm">
                      {phase.description}
                    </p>

                    {/* Simple phase stats */}
                    <div className="flex items-center space-x-3 text-xs text-green-300/60 mt-1">
                      <span>{phase.modules.length} modules</span>
                      {enrolledModules.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{enrolledModules.length} enrolled</span>
                        </>
                      )}
                      {completedModules.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{completedModules.length} completed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-green-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-8 space-y-1">
              {phase.modules.map((module, moduleIndex) =>
                renderModuleTreeItem(
                  module,
                  moduleIndex,
                  moduleIndex === phase.modules.length - 1,
                  isLastPhase
                )
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const totalModules = getAllModules().length;
  const enrolledModules = getEnrolledModules().length;
  const completedModules = getCompletedModules().length;

  return (
    <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Terminal className="w-5 h-5 text-green-400" />
        <span className="text-green-400 font-mono text-sm">
          ~/cybersecurity_mastery_path$ tree
        </span>
      </div>

      {/* Tree structure */}
      <div className="space-y-0">
        {phases.map((phase, phaseIndex) => renderPhaseTree(phase, phaseIndex))}
      </div>

      {/* Simple footer stats */}
      <div className="mt-6 pt-4 border-t border-green-400/30 text-center">
        <div className="flex items-center justify-center space-x-4 text-green-400 font-mono text-sm">
          <span>{totalModules} total</span>
          <span>•</span>
          <span>{enrolledModules} enrolled</span>
          <span>•</span>
          <span>{completedModules} completed</span>
        </div>
      </div>
    </div>
  );
};

export default CourseTree;
