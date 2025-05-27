import { Module, Phase } from "@/lib/types";
import {
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Target,
  Terminal,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface EnhancedProgressTabProps {
  enrolledModules: Module[];
  phases: Phase[];
  getModulesByPhase: (phaseId: string, enrolledOnly?: boolean) => Module[];
}

export const EnhancedProgressTab = ({
  enrolledModules,
  phases,
  getModulesByPhase,
}: EnhancedProgressTabProps) => {
  const [expandedPhases, setExpandedPhases] = useState<string[]>(
    phases.map((phase) => phase.id)
  );

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const totalProgress =
    enrolledModules.length > 0
      ? Math.round(
          enrolledModules.reduce((sum, module) => sum + module.progress, 0) /
            enrolledModules.length
        )
      : 0;

  const completedModules = enrolledModules.filter(
    (module) => module.completed
  ).length;
  const inProgressModules = enrolledModules.filter(
    (module) => module.progress > 0 && !module.completed
  ).length;
  const notStartedModules = enrolledModules.filter(
    (module) => module.progress === 0
  ).length;

  // Calculate phase-specific progress
  const getPhaseProgress = (phaseId: string) => {
    const phaseModules = getModulesByPhase(phaseId, true);
    if (phaseModules.length === 0) return 0;

    return Math.round(
      phaseModules.reduce((sum, module) => sum + module.progress, 0) /
        phaseModules.length
    );
  };

  const getPhaseColor = (phaseId: string) => {
    switch (phaseId) {
      case "beginner":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "advanced":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      default:
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">
            ~/progress$ analyze --detailed --enrolled --by-phase
          </span>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
            LEARNING_PROGRESS
          </h3>
          <p className="text-green-300/70 font-mono text-sm">
            Organized by learning phases • {enrolledModules.length} enrolled
            modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400/70 text-xs font-mono">OVERALL</p>
                <p className="text-2xl font-bold text-green-400 font-mono">
                  {totalProgress}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400/70 text-xs font-mono">COMPLETED</p>
                <p className="text-2xl font-bold text-blue-400 font-mono">
                  {completedModules}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400/70 text-xs font-mono">
                  IN PROGRESS
                </p>
                <p className="text-2xl font-bold text-yellow-400 font-mono">
                  {inProgressModules}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400/70 text-xs font-mono">NOT STARTED</p>
                <p className="text-2xl font-bold text-red-400 font-mono">
                  {notStartedModules}
                </p>
              </div>
              <Circle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400 font-mono text-sm">
              Overall Progress
            </span>
            <span className="text-green-400 font-mono text-sm">
              {totalProgress}%
            </span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Phase-based Progress */}
      <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">
            ~/progress$ ls -la --modules --detailed --group-by-phase
          </span>
        </div>

        {enrolledModules.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
            <h4 className="text-green-400 font-mono text-lg mb-2">
              NO_PROGRESS_DATA
            </h4>
            <p className="text-green-300/60 font-mono text-sm">
              Enroll in courses to track your learning progress
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {phases.map((phase) => {
              const phaseModules = getModulesByPhase(phase.id, true);
              const isExpanded = expandedPhases.includes(phase.id);
              const phaseProgress = getPhaseProgress(phase.id);

              if (phaseModules.length === 0) return null;

              return (
                <div key={phase.id} className="space-y-4">
                  {/* Phase Header */}
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-opacity-60 ${getPhaseColor(
                      phase.id
                    )}`}
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <phase.icon className={`w-6 h-6 ${phase.color}`} />
                        <div>
                          <h3 className="text-lg font-bold font-mono">
                            {phase.title.toUpperCase()}
                          </h3>
                          <p className="text-sm opacity-70">
                            {phaseModules.length} modules • {phaseProgress}%
                            average progress
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-lg font-bold font-mono">
                            {phaseProgress}%
                          </div>
                          <div className="text-xs opacity-60">
                            {phaseModules.filter((m) => m.completed).length}{" "}
                            completed
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    {/* Phase Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-black/50 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            phaseProgress === 100
                              ? "bg-blue-400"
                              : phaseProgress > 0
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${phaseProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Phase Modules */}
                  {isExpanded && (
                    <div className="space-y-3 ml-4">
                      {phaseModules.map((module) => (
                        <div
                          key={module.id}
                          className={`
                            ${module.bgColor} ${module.borderColor}
                            border rounded-lg p-4 transition-all duration-300
                          `}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <module.icon
                                className={`w-5 h-5 ${module.color}`}
                              />
                              <div>
                                <h4 className="text-green-300 font-semibold font-mono text-sm">
                                  {module.title}
                                </h4>
                                <p className="text-green-400/70 text-xs">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {module.completed ? (
                                <CheckCircle className="w-4 h-4 text-blue-400" />
                              ) : module.progress > 0 ? (
                                <TrendingUp className="w-4 h-4 text-yellow-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-green-400 font-mono text-sm">
                                {module.progress}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {/* Progress Bar */}
                            <div className="w-full bg-black/50 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  module.completed
                                    ? "bg-blue-400"
                                    : module.progress > 0
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                                }`}
                                style={{ width: `${module.progress}%` }}
                              ></div>
                            </div>

                            {/* Module Stats */}
                            <div className="flex items-center justify-between text-xs text-green-400/70">
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {module.duration}
                                </span>
                                <span className="font-mono">
                                  {module.difficulty}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span>Labs: {module.labs}</span>
                                <span>Games: {module.games}</span>
                                <span>Assets: {module.assets}</span>
                              </div>
                            </div>

                            {/* Topics */}
                            <div className="flex flex-wrap gap-1">
                              {module.topics.slice(0, 3).map((topic, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-green-400/10 text-green-400 px-2 py-0.5 rounded font-mono"
                                >
                                  {topic}
                                </span>
                              ))}
                              {module.topics.length > 3 && (
                                <span className="text-xs bg-green-400/10 text-green-400 px-2 py-0.5 rounded font-mono">
                                  +{module.topics.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
