import { Module, Phase } from "@/lib/types";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Code,
  GamepadIcon,
  Play,
  Target,
} from "lucide-react";
import { useState } from "react";

interface EnhancedProgressTabProps {
  enrolledModules: Module[];
  phases: Phase[];
  getModulesByPhase: (phaseId: string, enrolledOnly?: boolean) => Module[];
}

// Module Timeline Card Component
const ModuleTimelineCard = ({
  module,
  isLast,
}: {
  module: Module;
  isLast: boolean;
}) => {
  const getStatusColor = () => {
    if (module.completed)
      return "text-green-400 bg-green-400/20 border-green-400/30";
    if (module.progress > 0)
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
    return "text-gray-400 bg-gray-400/20 border-gray-400/30";
  };

  const getStatusIcon = () => {
    if (module.completed) return CheckCircle2;
    if (module.progress > 0) return Play;
    return Clock;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="relative flex items-start space-x-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-green-400/50 to-transparent" />
      )}

      {/* Status Icon */}
      <div
        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor()}`}
      >
        <StatusIcon className="w-5 h-5" />
      </div>

      {/* Module Card */}
      <div
        className={`flex-1 rounded-xl border ${module.borderColor} ${module.bgColor} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-400/10`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <module.icon className={`w-6 h-6 ${module.color}`} />
            <div>
              <h3 className="text-lg font-semibold text-white font-mono">
                {module.title}
              </h3>
              <p className="text-sm text-gray-400">{module.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400 font-mono">
              {module.progress}%
            </div>
            <div className="text-xs text-gray-500">
              {module.completed
                ? "Completed"
                : module.progress > 0
                ? "In Progress"
                : "Not Started"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-black/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                module.completed
                  ? "bg-gradient-to-r from-green-400 to-blue-400"
                  : module.progress > 0
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                  : "bg-gray-600"
              }`}
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>

        {/* Module Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{module.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Target className="w-4 h-4" />
            <span>{module.difficulty}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Code className="w-4 h-4" />
            <span>{module.labs} Labs</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <GamepadIcon className="w-4 h-4" />
            <span>{module.games} Games</span>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2">
          {module.topics.slice(0, 4).map((topic, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-medium bg-green-400/10 text-green-400 rounded-full border border-green-400/20"
            >
              {topic}
            </span>
          ))}
          {module.topics.length > 4 && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-400/10 text-gray-400 rounded-full border border-gray-400/20">
              +{module.topics.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const EnhancedProgressTab = ({
  enrolledModules,
  phases,
  getModulesByPhase,
}: EnhancedProgressTabProps) => {
  const [selectedPhase, setSelectedPhase] = useState<string>("all");

  // Filter modules based on selected phase
  const filteredModules =
    selectedPhase === "all"
      ? enrolledModules
      : getModulesByPhase(selectedPhase, true);

  // Sort modules by progress (completed first, then in progress, then not started)
  const sortedModules = [...filteredModules].sort((a, b) => {
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    if (a.progress !== b.progress) return b.progress - a.progress;
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Phase Filter */}
      <div className="bg-black/60 border border-green-400/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white font-mono">
            LEARNING_TIMELINE
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 font-mono">
              Filter by phase:
            </span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="bg-black/50 border border-green-400/30 rounded-lg px-3 py-2 text-green-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50"
            >
              <option value="all">All Phases</option>
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Module Timeline */}
        {sortedModules.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-400 mb-2 font-mono">
              NO_MODULES_ENROLLED
            </h4>
            <p className="text-gray-500 font-mono">
              Start your learning journey by enrolling in courses
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedModules.map((module, index) => (
              <ModuleTimelineCard
                key={module.id}
                module={module}
                isLast={index === sortedModules.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
