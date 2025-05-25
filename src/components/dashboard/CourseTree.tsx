import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
        return "text-green-400 bg-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20";
      case "advanced":
        return "text-red-400 bg-red-400/20";
      case "expert":
        return "text-purple-400 bg-purple-400/20";
      case "master":
        return "text-orange-400 bg-orange-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const renderModuleTreeItem = (
    module: Module,
    phaseIndex: number,
    moduleIndex: number,
    isLast: boolean
  ) => {
    return (
      <div key={module.id} className="relative">
        {/* Tree lines */}
        <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col items-center">
          {/* Vertical line from parent */}
          {!isLast && (
            <div className="w-px bg-green-400/30 flex-1 absolute top-0" />
          )}
          {/* Horizontal line to module */}
          <div className="w-3 h-px bg-green-400/30 absolute top-6 left-0" />
          {/* Corner piece */}
          <div className="w-px h-6 bg-green-400/30 absolute top-0 left-0" />
        </div>

        {/* Module content */}
        <div className="ml-6 mb-4">
          <div
            className={`group p-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-[1.02] ${
              module.enrolled
                ? `${module.bgColor} ${module.borderColor} hover:border-opacity-100`
                : "bg-gray-900/50 border-gray-600/30 hover:border-gray-500/50"
            }`}
            onClick={() => onModuleClick(module)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div
                  className={`p-2 rounded-lg ${
                    module.enrolled ? module.bgColor : "bg-gray-700/50"
                  }`}
                >
                  <module.icon
                    className={`w-5 h-5 ${
                      module.enrolled ? module.color : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3
                      className={`font-semibold ${
                        module.enrolled ? module.color : "text-gray-400"
                      }`}
                    >
                      {module.title}
                    </h3>
                    {module.completed && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {!module.enrolled && (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <p
                    className={`text-sm mb-3 ${
                      module.enrolled ? "text-green-300/70" : "text-gray-500"
                    }`}
                  >
                    {module.description}
                  </p>

                  {/* Module stats */}
                  <div className="flex items-center space-x-4 text-xs mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{module.duration}</span>
                    </div>
                    <Badge
                      className={`text-xs px-2 py-0.5 ${getDifficultyColor(
                        module.difficulty
                      )}`}
                    >
                      {module.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>{module.labs}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>{module.games}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{module.assets}</span>
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {module.topics.slice(0, 4).map((topic, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded ${
                          module.enrolled
                            ? "bg-green-400/10 text-green-300"
                            : "bg-gray-700/50 text-gray-400"
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                    {module.topics.length > 4 && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          module.enrolled
                            ? "bg-green-400/10 text-green-300"
                            : "bg-gray-700/50 text-gray-400"
                        }`}
                      >
                        +{module.topics.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Progress bar for enrolled modules */}
                  {module.enrolled && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-300/70">Progress</span>
                        <span className={module.color}>{module.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-green-400 h-1.5 rounded-full transition-all"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action button */}
              <div className="ml-4">
                {module.enrolled ? (
                  <Button
                    size="sm"
                    className="bg-green-400 text-black hover:bg-green-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onModuleClick(module);
                    }}
                  >
                    {module.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Review
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-400/30 text-green-400 hover:bg-green-400/10"
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
    const isLast = phaseIndex === phases.length - 1;

    return (
      <div key={phase.id} className="relative">
        {/* Tree structure */}
        <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col items-center">
          {/* Vertical line */}
          {!isLast && (
            <div className="w-px bg-green-400/30 flex-1 absolute top-8" />
          )}
          {/* Phase indicator */}
          <div className="w-3 h-3 bg-green-400 rounded-full absolute top-6 left-1.5 z-10" />
        </div>

        {/* Phase header */}
        <Collapsible
          open={isExpanded}
          onOpenChange={() => onTogglePhase(phase.id)}
        >
          <CollapsibleTrigger className="w-full">
            <div className="ml-6 mb-4 p-4 bg-green-400/10 border border-green-400/30 rounded-lg hover:bg-green-400/20 transition-all">
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
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-300/70">
                    {phase.modules.length} modules
                  </span>
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
            <div className="ml-6">
              {phase.modules.map((module, moduleIndex) =>
                renderModuleTreeItem(
                  module,
                  phaseIndex,
                  moduleIndex,
                  moduleIndex === phase.modules.length - 1 && isLast
                )
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Terminal className="w-5 h-5 text-green-400" />
        <span className="text-green-400 font-mono text-sm">
          ~/cybersecurity_mastery_path$ tree -L 3
        </span>
      </div>

      <div className="space-y-0">
        {phases.map((phase, phaseIndex) => renderPhaseTree(phase, phaseIndex))}
      </div>

      <div className="mt-6 pt-6 border-t border-green-400/30 text-center">
        <div className="flex items-center justify-center space-x-2 text-green-400 font-mono text-sm">
          <span>{getAllModules().length} total modules</span>
          <span>•</span>
          <span>{getEnrolledModules().length} enrolled</span>
          <span>•</span>
          <span>{getCompletedModules().length} completed</span>
        </div>
      </div>
    </div>
  );
};

export default CourseTree;
