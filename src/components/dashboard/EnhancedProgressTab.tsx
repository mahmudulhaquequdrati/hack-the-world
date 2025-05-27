import { PHASES_DATA } from "@/lib/appData";
import { Module } from "@/lib/types";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { AvailableCourseCard } from "./AvailableCourseCard";
import { EmptyState } from "./EmptyState";
import { FilterTab } from "./FilterTab";
import { ModuleTimelineCard } from "./ModuleTimelineCard";
import { PhaseProgressCard } from "./PhaseProgressCard";

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
          {Object.entries(categorizedModules).map(([phase, modules]) => (
            <PhaseProgressCard
              key={phase}
              phase={phase}
              modules={modules}
              isActive={selectedPhase === phase}
              onClick={() => setSelectedPhase(phase)}
            />
          ))}
        </div>

        {/* Module Timeline */}
        {sortedModules.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="NO_MODULES_ENROLLED"
            description="Start your learning journey by enrolling in courses below"
          />
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
            <EmptyState
              icon={BookOpen}
              title="NO_COURSES_AVAILABLE"
              description="No courses available for the selected difficulty level"
              iconSize="w-12 h-12"
              titleSize="text-lg"
            />
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
