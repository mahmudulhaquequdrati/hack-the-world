import { getIconFromName } from "@/lib/iconUtils";
import { Module } from "@/lib/types";
import { BookOpen, Clock, Play, Star, UserCheck, Zap } from "lucide-react";
import { useState } from "react";
import { ModuleTimelineCard } from "./ModuleTimelineCard";

interface EnhancedProgressTabProps {
  enrolledModules: Module[];
  onModuleClick: (module: Module) => void;
  getAllModules: () => Module[];
}

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
  const availableModules = allModules.filter(
    (module) => !enrolledModules.some((m) => m._id === module._id)
  );

  // Categorize enrolled modules by phase using API data
  const categorizedModules = {
    beginner: enrolledModules.filter(
      (module) =>
        module.phaseId === "beginner" || module.difficulty === "Beginner"
    ),
    intermediate: enrolledModules.filter(
      (module) =>
        module.phaseId === "intermediate" ||
        module.difficulty === "Intermediate"
    ),
    advanced: enrolledModules.filter(
      (module) =>
        module.phaseId === "advanced" || module.difficulty === "Advanced"
    ),
  };

  // Categorize available modules by difficulty for discovery section
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
    const aProgress = a.progress || 0;
    const bProgress = b.progress || 0;
    if (aProgress !== bProgress) return bProgress - aProgress;
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Progress Section with Retro Styling */}
      <div className="bg-black/60 border border-green-400/30 rounded-xl p-4 md:p-8 relative overflow-hidden">
        {/* Retro Scanlines Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-green-400/20 to-transparent bg-[length:100%_4px] animate-pulse"></div>
        </div>

        {/* Terminal Header */}
        <div className="flex items-center space-x-2 mb-6 relative z-10">
          <BookOpen className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">
            ~/dashboard/progress/
          </span>
        </div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-2xl font-bold text-green-400 font-mono uppercase tracking-wider">
            MY_LEARNING_PROGRESS
          </h3>
          <div className="bg-green-400/10 border border-green-400/30 rounded-lg px-4 py-2">
            <span className="text-green-400 font-mono text-sm font-bold">
              {enrolledModules.length} ENROLLED
            </span>
          </div>
        </div>

        {/* Enhanced Progress Summary by Phase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          {Object.entries(categorizedModules).map(([phase, modules]) => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className={`bg-gradient-to-br from-gray-900/80 to-black/80 border-2 rounded-xl p-6 transition-all duration-300 group ${
                selectedPhase === phase
                  ? phase === "beginner"
                    ? "border-green-400 shadow-lg shadow-green-400/30"
                    : phase === "intermediate"
                    ? "border-yellow-400 shadow-lg shadow-yellow-400/30"
                    : "border-red-400 shadow-lg shadow-red-400/30"
                  : "border-gray-600/30 hover:border-gray-400/50"
              }`}
            >
              {/* Glitch Border Animation */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  phase === "beginner"
                    ? "from-green-400/0 via-green-400/20 to-green-400/0"
                    : phase === "intermediate"
                    ? "from-yellow-400/0 via-yellow-400/20 to-yellow-400/0"
                    : "from-red-400/0 via-red-400/20 to-red-400/0"
                }`}
              ></div>

              <div className="relative z-10">
                <h4
                  className={`font-mono text-lg font-bold uppercase tracking-wider mb-2 ${
                    phase === "beginner"
                      ? "text-green-400"
                      : phase === "intermediate"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {phase}_PHASE
                </h4>
                <div className="text-3xl font-bold text-white font-mono mb-2">
                  {modules.length}
                </div>
                <div
                  className={`text-sm font-mono ${
                    phase === "beginner"
                      ? "text-green-300/70"
                      : phase === "intermediate"
                      ? "text-yellow-300/70"
                      : "text-red-300/70"
                  }`}
                >
                  {modules.filter((m) => m.completed).length} COMPLETED
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Module Timeline with Tree Structure */}
        {sortedModules.length === 0 ? (
          <div className="text-center py-12 relative z-10">
            <div className="bg-black/60 border border-orange-400/30 rounded-xl p-8">
              <BookOpen className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
              <h4 className="text-orange-400 font-mono text-lg mb-2 uppercase tracking-wider">
                NO_MODULES_ENROLLED
              </h4>
              <p className="text-orange-300/60 font-mono text-sm">
                Start your learning journey by enrolling in courses below
              </p>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            {/* Tree Structure Header */}
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-green-400 font-mono text-sm">
                ~/enrolled_modules/
              </span>
            </div>

            <div className="bg-black/40   md:border border-green-400/20 rounded-xl p-0 md:p-6">
              <div className="space-y-0">
                {sortedModules.map((module, index) => {
                  const isLast = index === sortedModules.length - 1;
                  const treeChar = isLast ? "└──" : "├──";

                  return (
                    <div key={module._id} className="relative">
                      <div className="flex items-start space-x-1">
                        <div className="md:flex flex-col items-center hidden">
                          <span className="text-green-400/70 text-sm leading-none font-mono">
                            {treeChar}
                          </span>
                          {!isLast && (
                            <div className="w-px h-20 bg-green-400/30 mt-1"></div>
                          )}
                        </div>

                        <div className="flex-1 ml-0 md:ml-2 mb-4">
                          <ModuleTimelineCard
                            module={module}
                            isLast={isLast}
                            onModuleClick={onModuleClick}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Terminal Footer */}
              <div className="mt-6 pt-4 border-t border-green-400/30">
                <div className="flex items-center justify-between text-xs font-mono text-green-300/70">
                  <span>
                    {sortedModules.filter((m) => m.completed).length} completed,{" "}
                    {
                      sortedModules.filter(
                        (m) => (m.progress || 0) > 0 && !m.completed
                      ).length
                    }{" "}
                    in progress
                  </span>
                  <span>total_modules: {sortedModules.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Enroll More Courses Section with Retro Styling */}
      {availableModules.length > 0 && (
        <div className="bg-black/60 border border-green-400/30 rounded-xl px-3 py-5 md:p-8 relative overflow-hidden">
          {/* Retro Scanlines Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent bg-[length:100%_4px] animate-pulse"></div>
          </div>

          {/* Terminal Header */}
          <div className="flex items-center space-x-2 mb-6 relative z-10">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-sm">
              ~/dashboard/discover/
            </span>
          </div>

          <div className="flex items-center flex-col md:flex-row justify-between mb-8 relative z-10">
            <h3 className="text-xl md:text-2xl font-bold text-cyan-400 font-mono uppercase tracking-wider">
              DISCOVER_NEW_COURSES
            </h3>
            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg px-4 py-2">
              <span className="text-cyan-400 font-mono text-sm font-bold">
                {filteredAvailableModules.length} COURSES_AVAILABLE
              </span>
            </div>
          </div>

          {/* Enhanced Filter Tabs with Retro Styling */}
          <div className="flex flex-wrap gap-3 mb-8 relative z-10">
            <button
              onClick={() => setSelectedEnrollmentFilter("all")}
              className={`px-4 py-2 rounded-lg border-2 font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedEnrollmentFilter === "all"
                  ? "bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/30"
                  : "bg-black/40 text-cyan-400 border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/10"
              }`}
            >
              ALL_LEVELS ({availableModules.length})
            </button>
            <button
              onClick={() => setSelectedEnrollmentFilter("beginner")}
              className={`px-4 py-2 rounded-lg border-2 font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedEnrollmentFilter === "beginner"
                  ? "bg-green-400 text-black border-green-400 shadow-lg shadow-green-400/30"
                  : "bg-black/40 text-green-400 border-green-400/30 hover:border-green-400/50 hover:bg-green-400/10"
              }`}
            >
              BEGINNER ({categorizedAvailableModules.beginner.length})
            </button>
            <button
              onClick={() => setSelectedEnrollmentFilter("intermediate")}
              className={`px-4 py-2 rounded-lg border-2 font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedEnrollmentFilter === "intermediate"
                  ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/30"
                  : "bg-black/40 text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10"
              }`}
            >
              INTERMEDIATE ({categorizedAvailableModules.intermediate.length})
            </button>
            <button
              onClick={() => setSelectedEnrollmentFilter("advanced")}
              className={`px-4 py-2 rounded-lg border-2 font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedEnrollmentFilter === "advanced"
                  ? "bg-red-400 text-black border-red-400 shadow-lg shadow-red-400/30"
                  : "bg-black/40 text-red-400 border-red-400/30 hover:border-red-400/50 hover:bg-red-400/10"
              }`}
            >
              ADVANCED ({categorizedAvailableModules.advanced.length})
            </button>
          </div>

          {filteredAvailableModules.length === 0 ? (
            <div className="text-center py-12 relative z-10">
              <div className="bg-black/60 border border-red-400/30 rounded-xl p-8">
                <BookOpen className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
                <h4 className="text-red-400 font-mono text-lg mb-2 uppercase tracking-wider">
                  NO_COURSES_AVAILABLE
                </h4>
                <p className="text-red-300/60 font-mono text-sm">
                  No courses available for the selected difficulty level
                </p>
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              {/* Enhanced Course Grid with ModuleCard styling */}
              <div className="grid grid-cols-1  gap-6 mb-8">
                {filteredAvailableModules.map((module) => {
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

                  const getColorName = (colorClass: string) => {
                    const match = colorClass?.match(/text-(\w+)-\d+/);
                    return match ? match[1] : "cyan";
                  };

                  // Get module-specific color from module.color property
                  const moduleColorName = getColorName(
                    module.color || "text-cyan-400"
                  );

                  const ModuleIcon = getIconFromName(module.icon);

                  // Calculate stats from module data
                  const stats = {
                    videos: module.content?.videos?.length || 0,
                    labs: module.labs || 0,
                    games: module.games || 0,
                  };

                  return (
                    <div
                      key={module._id}
                      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => onModuleClick(module)}
                    >
                      {/* Main Card Container with Retro Design */}
                      <div
                        className={`relative overflow-hidden rounded-lg border-2 bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95 ${
                          module.borderColor || "border-cyan-400/30"
                        } shadow-lg transition-all duration-300`}
                      >
                        {/* Retro Scanlines Effect */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                          <div className="h-full w-full bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] animate-pulse"></div>
                        </div>

                        {/* Glitch Border Animation */}
                        <div
                          className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${moduleColorName}-400/0 via-${moduleColorName}-400/20 to-${moduleColorName}-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        ></div>

                        {/* Card Header */}
                        <div className="p-4 md:p-6 pt-5 md:pt-6">
                          <div className="flex items-start space-x-4">
                            {/* Module Icon with Retro Styling */}
                            <div
                              className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-black/50 border-2 ${
                                module.borderColor || "border-cyan-400/30"
                              }  shadow-${moduleColorName}-400/30 group-hover:animate-pulse`}
                            >
                              {/* Icon Glow Effect */}
                              <div
                                className={`absolute inset-0 rounded-xl blur-sm opacity-50 ${
                                  module.bgColor || "bg-cyan-500/10"
                                }`}
                              ></div>
                              <ModuleIcon
                                className={`w-6 h-6 md:w-8 md:h-8 relative z-10 ${
                                  module.color || "text-cyan-400"
                                }`}
                              />
                            </div>

                            {/* Title and Description */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3
                                  className={`text-xl font-bold font-mono uppercase tracking-wider text-white transition-colors truncate group-hover:${
                                    module.color || "text-cyan-400"
                                  }`}
                                >
                                  {module.title}
                                </h3>

                                {/* Retro Difficulty Badge */}
                                <div
                                  className={`px-3 py-1 rounded-full border-2 text-xs font-mono uppercase bg-black/50 backdrop-blur-sm animate-pulse ${getDifficultyColor(
                                    module.difficulty
                                  )}`}
                                >
                                  {module.difficulty}
                                </div>
                              </div>

                              <p className="text-gray-300 text-sm leading-relaxed font-mono line-clamp-2">
                                {module.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Retro Stats Grid */}
                        <div className="px-6 pb-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Duration */}
                            <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-green-400/50 transition-all duration-300 group/stat">
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
                            <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-blue-400/50 transition-all duration-300 group/stat">
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
                            <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 group/stat">
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
                            <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-red-400/50 transition-all duration-300 group/stat">
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

                        {/* Topics Tags */}
                        <div className="px-6 pb-4">
                          <div className="flex flex-wrap gap-2">
                            {module.topics?.slice(0, 3).map((topic, idx) => (
                              <div
                                key={idx}
                                className="text-xs font-mono border-2 rounded-full px-3 py-1 bg-gradient-to-r from-gray-900/80 to-black/80 border-cyan-600/50 text-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                              >
                                {topic.toUpperCase()}
                              </div>
                            )) || []}
                            {module.topics && module.topics.length > 3 && (
                              <div className="text-xs font-mono border-2 rounded-full px-3 py-1 bg-gradient-to-r from-gray-900/80 to-black/80 border-gray-600/50 text-gray-400 hover:border-gray-400/50 transition-all duration-300">
                                +{module.topics.length - 3} MORE
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 pb-6">
                          <div className="flex space-x-3">
                            {/* Main View Details Button */}
                            <button className="flex-1 h-12 font-mono uppercase tracking-wider text-sm font-bold bg-gradient-to-r border shadow-lg relative overflow-hidden transition-all duration-300 border-cyan-400/50 bg-gray-800/50 text-cyan-400 hover:bg-cyan-400/10 rounded-lg">
                              <span className="relative z-10 flex items-center justify-center space-x-2">
                                <Play className="w-4 h-4" />
                                <span>VIEW DETAILS</span>
                              </span>
                            </button>

                            {/* Small Enroll Button */}
                            <button className="h-12 px-4 font-mono uppercase tracking-wider text-xs font-bold bg-gradient-to-r from-cyan-600 to-cyan-500 border-2 border-cyan-400 text-black hover:from-cyan-500 hover:to-cyan-400 transition-all duration-300 relative overflow-hidden rounded-lg">
                              <span className="relative z-10 flex items-center justify-center space-x-1">
                                <UserCheck className="w-3 h-3" />
                                <span>ENROLL</span>
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Retro Status Indicators */}
                        <div className="absolute top-2 left-2 flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse shadow-lg shadow-gray-400/50"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Terminal Footer */}
          <div className="mt-8 pt-6 border-t border-cyan-400/30 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300/70">
              <span>showing courses not yet enrolled</span>
              <span>total_available: {availableModules.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
