import { Module } from "@/lib/types";
import { BookOpen } from "lucide-react";
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

  // Filter modules based on selected phase
  const filteredModules =
    selectedPhase === "all"
      ? enrolledModules
      : categorizedModules[selectedPhase as keyof typeof categorizedModules] ||
        [];

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


    </div>
  );
};
