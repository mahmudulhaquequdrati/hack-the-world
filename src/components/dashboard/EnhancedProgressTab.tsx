import { PHASES_DATA } from "@/lib/appData";
import { Module } from "@/lib/types";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Code,
  GamepadIcon,
  Play,
  Plus,
  Target,
} from "lucide-react";
import { useState } from "react";

interface EnhancedProgressTabProps {
  enrolledModules: Module[];
  onModuleClick: (module: Module) => void;
  getAllModules: () => Module[];
}

// Filter Tab Component
const FilterTab = ({
  label,
  isActive,
  onClick,
  count,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
        isActive
          ? "bg-green-400 text-black"
          : "bg-black/50 text-green-400 border border-green-400/30 hover:bg-green-400/10"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-2 ${isActive ? "text-black/70" : "text-gray-400"}`}
        >
          ({count})
        </span>
      )}
    </button>
  );
};

// Module Timeline Card Component
const ModuleTimelineCard = ({
  module,
  isLast,
  onModuleClick,
}: {
  module: Module;
  isLast: boolean;
  onModuleClick: (module: Module) => void;
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
        className={`flex-1 rounded-xl border ${module.borderColor} ${module.bgColor} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-400/10 cursor-pointer`}
        onClick={() => onModuleClick(module)}
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
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Click to continue indicator */}
        <div className="flex items-center justify-end text-sm text-green-400/70 hover:text-green-400 transition-colors">
          <span className="font-mono">Click to continue</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );
};

// Available Course Card Component
const AvailableCourseCard = ({
  module,
  onModuleClick,
}: {
  module: Module;
  onModuleClick: (module: Module) => void;
}) => {
  return (
    <div
      className={`rounded-xl border ${module.borderColor} ${module.bgColor} p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-400/10 cursor-pointer`}
      onClick={() => onModuleClick(module)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <module.icon className={`w-5 h-5 ${module.color}`} />
          <div>
            <h4 className="text-md font-semibold text-white font-mono">
              {module.title}
            </h4>
            <p className="text-xs text-gray-400">{module.description}</p>
          </div>
        </div>
        <Plus className="w-5 h-5 text-green-400" />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{module.difficulty}</span>
        <span>{module.duration}</span>
      </div>
    </div>
  );
};

export const EnhancedProgressTab = ({
  enrolledModules,
  onModuleClick,
  getAllModules,
}: EnhancedProgressTabProps) => {
  const [selectedPhase, setSelectedPhase] = useState<string>("beginner");
  const [selectedEnrollmentFilter, setSelectedEnrollmentFilter] =
    useState<string>("all");

  // Get all available modules for enrollment
  const allModules = getAllModules();
  const availableModules = allModules.filter((module) => !module.enrolled);

  // Categorize enrolled modules by phase
  const categorizedModules = {
    beginner: enrolledModules.filter((module) =>
      PHASES_DATA.find((phase) => phase.id === "beginner")?.modules.some(
        (m) => m.id === module.id
      )
    ),
    intermediate: enrolledModules.filter((module) =>
      PHASES_DATA.find((phase) => phase.id === "intermediate")?.modules.some(
        (m) => m.id === module.id
      )
    ),
    advanced: enrolledModules.filter((module) =>
      PHASES_DATA.find((phase) => phase.id === "advanced")?.modules.some(
        (m) => m.id === module.id
      )
    ),
  };

  // Categorize available modules by difficulty
  const categorizedAvailableModules = {
    beginner: availableModules.filter(
      (module) => module.difficulty === "Beginner"
    ),
    intermediate: availableModules.filter(
      (module) => module.difficulty === "Intermediate"
    ),
    advanced: availableModules.filter(
      (module) => module.difficulty === "Advanced"
    ),
  };

  // Filter modules based on selected phase
  const filteredModules =
    selectedPhase === "all"
      ? enrolledModules
      : categorizedModules[selectedPhase as keyof typeof categorizedModules] ||
        [];

  // Filter available modules based on selected enrollment filter
  const filteredAvailableModules =
    selectedEnrollmentFilter === "all"
      ? availableModules
      : categorizedAvailableModules[
          selectedEnrollmentFilter as keyof typeof categorizedAvailableModules
        ] || [];

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
            MY_LEARNING_PROGRESS
          </h3>
        </div>

        {/* Progress Summary by Phase - Now Clickable Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(categorizedModules).map(([phase, modules]) => {
            const completedCount = modules.filter((m) => m.completed).length;
            const totalCount = modules.length;
            const progressPercentage =
              totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0;
            const isActive = selectedPhase === phase;

            return (
              <div
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`bg-black/40 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  isActive
                    ? "border-2 border-green-400 shadow-lg shadow-green-400/20"
                    : "border border-green-400/20 hover:border-green-400/40"
                }`}
              >
                <h4
                  className={`text-sm font-bold font-mono capitalize mb-2 ${
                    isActive ? "text-green-400" : "text-white"
                  }`}
                >
                  {phase} Phase
                </h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">
                    {completedCount}/{totalCount} completed
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      isActive ? "text-green-400" : "text-green-400"
                    }`}
                  >
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      isActive
                        ? "bg-gradient-to-r from-green-400 to-blue-400"
                        : "bg-gradient-to-r from-green-400 to-blue-400"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {isActive && (
                  <div className="mt-2 text-xs text-green-400 font-mono">
                    ● Active Filter
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Module Timeline */}
        {sortedModules.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-400 mb-2 font-mono">
              NO_MODULES_ENROLLED
            </h4>
            <p className="text-gray-500 font-mono">
              Start your learning journey by enrolling in courses below
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedModules.map((module, index) => (
              <ModuleTimelineCard
                key={module.id}
                module={module}
                isLast={index === sortedModules.length - 1}
                onModuleClick={onModuleClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enroll More Courses Section */}
      {availableModules.length > 0 && (
        <div className="bg-black/60 border border-green-400/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white font-mono">
              ENROLL_MORE_COURSES
            </h3>
            <span className="text-sm text-gray-400 font-mono">
              {filteredAvailableModules.length} courses available
            </span>
          </div>

          {/* Filter Tabs for Available Courses */}
          <div className="flex flex-wrap gap-3 mb-6">
            <FilterTab
              label="All Levels"
              isActive={selectedEnrollmentFilter === "all"}
              onClick={() => setSelectedEnrollmentFilter("all")}
              count={availableModules.length}
            />
            <FilterTab
              label="Beginner"
              isActive={selectedEnrollmentFilter === "beginner"}
              onClick={() => setSelectedEnrollmentFilter("beginner")}
              count={categorizedAvailableModules.beginner.length}
            />
            <FilterTab
              label="Intermediate"
              isActive={selectedEnrollmentFilter === "intermediate"}
              onClick={() => setSelectedEnrollmentFilter("intermediate")}
              count={categorizedAvailableModules.intermediate.length}
            />
            <FilterTab
              label="Advanced"
              isActive={selectedEnrollmentFilter === "advanced"}
              onClick={() => setSelectedEnrollmentFilter("advanced")}
              count={categorizedAvailableModules.advanced.length}
            />
          </div>

          {filteredAvailableModules.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-gray-400 mb-2 font-mono">
                NO_COURSES_AVAILABLE
              </h4>
              <p className="text-gray-500 font-mono text-sm">
                No courses available for the selected difficulty level
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAvailableModules.slice(0, 6).map((module) => (
                  <AvailableCourseCard
                    key={module.id}
                    module={module}
                    onModuleClick={onModuleClick}
                  />
                ))}
              </div>

              {filteredAvailableModules.length > 6 && (
                <div className="text-center mt-6">
                  <button className="px-6 py-2 bg-green-400/10 border border-green-400/30 rounded-lg text-green-400 font-mono text-sm hover:bg-green-400/20 transition-colors">
                    View All Available Courses (
                    {filteredAvailableModules.length - 6} more)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
