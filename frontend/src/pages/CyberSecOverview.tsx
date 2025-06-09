import { LoadingSkeleton } from "@/components/common";
import {
  ModuleTree,
  OverviewHeader,
  PhaseCard,
  PhaseCompletionCTA,
  PhaseNavigation,
} from "@/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { COMPLETED_MODULES } from "@/lib/constants";
import { DataService } from "@/lib/dataService";
import { getCoursePath, getEnrollPath } from "@/lib/pathUtils";
import { Phase } from "@/lib/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CyberSecOverview = () => {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState("beginner");
  const [phases, setPhases] = useState<Phase[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("Loading...");
  const completedModules = [...COMPLETED_MODULES];

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load phases from DataService (API or fallback to dummy data)
        const phasesData = await DataService.getPhases();

        // Calculate overall progress from user progress data
        const userProgress = await DataService.getUserProgress();
        const totalModules = phasesData.reduce(
          (total, phase) => total + phase.modules.length,
          0
        );
        const completedModules = userProgress.filter(
          (p) => p.progress === 100
        ).length;
        const calculatedProgress =
          totalModules > 0
            ? Math.round((completedModules / totalModules) * 100)
            : 0;

        setPhases(phasesData);
        setOverallProgress(calculatedProgress);
        setDataSource(DataService.getDataSource());
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleModuleNavigation = (path: string) => {
    // Navigation logic is handled within ModuleCard component
    navigate(path);
  };

  const handleEnroll = async (path: string) => {
    // Extract moduleId from path and navigate
    const moduleId = path.split("/").pop();
    if (moduleId) {
      try {
        const result = await DataService.enrollInModule(moduleId);
        if (result.success) {
          navigate(getEnrollPath(moduleId));
        } else {
          setError("Failed to enroll in module. Please try again.");
        }
      } catch (err) {
        console.error("Enrollment failed:", err);
        setError("Failed to enroll in module. Please try again.");
      }
    }
  };

  const handleStartPhase = (phase: Phase) => {
    const firstIncomplete = phase.modules.find((m) => !m.enrolled);
    if (firstIncomplete) {
      navigate(getCoursePath(firstIncomplete.id));
    }
  };

  const handleViewAllCourses = () => {
    navigate("/courses");
  };

  const handleRetry = () => {
    window.location.reload();
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

            {/* Data Source Indicator */}
            <div className="fixed bottom-4 right-4 bg-black/80 border border-green-500/30 rounded px-3 py-2 text-xs">
              <span className="text-green-400">Loading data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-xl font-mono">ERROR</div>
          <div className="text-green-300 max-w-md">{error}</div>
          <button
            onClick={handleRetry}
            className="bg-green-500/20 border border-green-500 text-green-400 px-6 py-2 rounded font-mono hover:bg-green-500/30 transition-colors"
          >
            RETRY
          </button>
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

          {/* Data Source Indicator */}
          <div className="fixed bottom-4 right-4 bg-black/80 border border-green-500/30 rounded px-3 py-2 text-xs">
            <span className="text-green-400">Data: {dataSource}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberSecOverview;
