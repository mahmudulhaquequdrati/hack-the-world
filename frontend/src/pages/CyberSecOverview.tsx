import { LoadingSkeleton } from "@/components/common";
import {
  ModuleTree,
  OverviewHeader,
  PhaseCard,
  PhaseCompletionCTA,
  PhaseNavigation,
} from "@/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  enrollInNormalizedModule,
  getNormalizedModuleById,
  getNormalizedOverallProgress,
  getNormalizedPhases,
} from "@/lib/appData";
import { COMPLETED_MODULES } from "@/lib/constants";
import { Phase } from "@/lib/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CyberSecOverview = () => {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState("beginner");
  const [loading, setLoading] = useState(true);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [enrollingModules, setEnrollingModules] = useState<Set<string>>(
    new Set()
  );
  const completedModules = [...COMPLETED_MODULES];

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      // Simulate initial data loading with 1 second delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Load normalized phases and overall progress
      const normalizedPhases = getNormalizedPhases();
      const progress = getNormalizedOverallProgress();

      setPhases(normalizedPhases);
      setOverallProgress(progress);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const handleModuleNavigation = (path: string) => {
    // Navigation logic is handled within ModuleCard component
    navigate(path);
  };

  const handleEnroll = async (path: string) => {
    // Extract module ID from path (assuming path format like "/course/moduleId")
    const moduleId = path.split("/").pop();
    if (!moduleId) return;

    setEnrollingModules((prev) => new Set(prev).add(moduleId));

    try {
      // Simulate enrollment API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Enroll in the module
      enrollInNormalizedModule(moduleId);

      // Update phases with new enrollment data
      const updatedPhases = getNormalizedPhases();
      setPhases(updatedPhases);

      // Update overall progress
      const updatedProgress = getNormalizedOverallProgress();
      setOverallProgress(updatedProgress);

      // Navigate to the enrolled course
      const enrolledModule = getNormalizedModuleById(moduleId);
      if (enrolledModule) {
        navigate(enrolledModule.enrollPath);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setEnrollingModules((prev) => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
    }
  };

  const handleStartPhase = (phase: Phase) => {
    const firstIncomplete = phase.modules.find((m) => !m.enrolled);
    if (firstIncomplete) {
      navigate(firstIncomplete.path);
    }
  };

  const handleViewAllCourses = () => {
    navigate("/courses");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative">
        <div className="pt-20 px-6">
          <div className="mx-auto max-w-6xl">
            {/* Loading Header */}
            <LoadingSkeleton type="header" className="mb-12" />

            {/* Loading Phase Navigation */}
            <div className="mb-8">
              <div className="flex justify-center space-x-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gradient-to-r from-green-400/30 to-transparent rounded w-32 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Loading Content */}
            <div className="space-y-8">
              <LoadingSkeleton
                type="stats"
                count={4}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              />
              <LoadingSkeleton type="card" count={6} className="space-y-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <div className="pt-20 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <OverviewHeader overallProgress={overallProgress} />

          {/* Phase Navigation */}
          <Tabs
            value={activePhase}
            onValueChange={setActivePhase}
            className="space-y-8"
          >
            <PhaseNavigation phases={phases} onPhaseChange={setActivePhase} />

            {phases.map((phase) => (
              <TabsContent
                key={phase.id}
                value={phase.id}
                className="space-y-8"
              >
                {/* Phase Header */}
                <PhaseCard phase={phase} />

                {/* Modules Tree Structure */}
                <ModuleTree
                  phase={phase}
                  completedModules={completedModules}
                  onNavigate={handleModuleNavigation}
                  onEnroll={handleEnroll}
                  enrollingModules={enrollingModules}
                />

                {/* Phase Completion CTA */}
                <PhaseCompletionCTA
                  phase={phase}
                  onStartPhase={() => handleStartPhase(phase)}
                  onViewAllCourses={handleViewAllCourses}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CyberSecOverview;
