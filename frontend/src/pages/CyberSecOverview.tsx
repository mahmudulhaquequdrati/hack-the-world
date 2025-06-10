import { LoadingSkeleton } from "@/components/common";
import ApiDebug from "@/components/debug/ApiDebug";
import {
  ModuleTree,
  OverviewHeader,
  PhaseCard,
  PhaseCompletionCTA,
  PhaseNavigation,
} from "@/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  useEnrollInModuleMutation,
  useGetPhasesWithModulesQuery,
} from "@/features/api/apiSlice";
import { COMPLETED_MODULES } from "@/lib/constants";
import { getCoursePath, getEnrollPath } from "@/lib/pathUtils";
import { Module, Phase } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const getColorsForModule = (color: string) => {
  //   const colorOptions = {
  //     beginner: ["green", "blue", "purple"],
  //     intermediate: ["yellow", "pink"],
  //     advanced: ["orange", "red"],
  //     expert: ["indigo", "violet"],
  //   };

  //   const getRandomColor = (options: string[]) => {
  //     return options[Math.floor(Math.random() * options.length)];
  //   };

  //   const difficultyLevel = difficulty.toLowerCase();
  //   const options = colorOptions[
  //     difficultyLevel as keyof typeof colorOptions
  //   ] || ["green"];
  //   const selectedColor = getRandomColor(options);

  return {
    color: `text-${color}-400`,
    bgColor: `bg-${color}-500/10`,
    borderColor: `border-${color}-400/30`,
  };
};

const CyberSecOverview = () => {
  const navigate = useNavigate();
  const completedModules = [...COMPLETED_MODULES];

  // Single comprehensive RTK Query hook
  const {
    data: phasesWithModules = [],
    isLoading: dataLoading,
    error: dataError,
    refetch: refetchData,
  } = useGetPhasesWithModulesQuery();

  const [enrollInModule] = useEnrollInModuleMutation();

  // Set active phase to the first phase when data loads
  const [activePhase, setActivePhase] = useState("");

  // Data processing - use only API data
  const phasesData = useMemo(() => {
    // Use API data (should already be processed with modules, stats, and progress)
    return phasesWithModules
      .map((phase: Phase) => {
        // If API returns modules with the phase, use them directly
        const phaseModules = (phase.modules || [])
          .map((module: Module) => {
            const colors = getColorsForModule(module.color);

            return {
              ...module,
              color: colors.color,
              bgColor: colors.bgColor,
              borderColor: colors.borderColor,
              labs: module.content?.labs?.length || 0,
              games: module.content?.games?.length || 0,
              assets: module.content?.documents?.length || 0,
              enrolled: module.enrolled || false,
              completed: module.progress === 100 || module.completed || false,
              progress: module.progress || 0,
            };
          })
          .sort((a: Module, b: Module) => (a.order || 0) - (b.order || 0));

        return {
          ...phase,
          modules: phaseModules,
        };
      })
      .sort((a: Phase, b: Phase) => (a.order || 0) - (b.order || 0));
  }, [phasesWithModules]);

  // Set default active phase to the first phase when data loads
  useEffect(() => {
    if (phasesData.length > 0 && !activePhase) {
      setActivePhase(phasesData[0].id);
    }
  }, [phasesData, activePhase]);

  // Calculate overall progress from API data only
  const overallProgress = useMemo(() => {
    if (!phasesData.length) return 0;

    // Use API data for progress calculation
    const totalModules = phasesData.reduce(
      (total: number, phase: Phase) => total + (phase.modules?.length || 0),
      0
    );
    const completedModules = phasesData
      .flatMap((phase: Phase) => phase.modules || [])
      .filter(
        (module: Module) => module.progress === 100 || module.completed
      ).length;

    return totalModules > 0
      ? Math.round((completedModules / totalModules) * 100)
      : 0;
  }, [phasesData]);

  const loading = dataLoading;
  const error = dataError ? "Failed to load course data." : null;

  const handleModuleNavigation = (path: string) => {
    navigate(path);
  };

  const handleEnroll = async (path: string) => {
    const moduleId = path.split("/").pop();
    if (moduleId) {
      try {
        const result = await enrollInModule(moduleId).unwrap();
        if (result.success) {
          navigate(getEnrollPath(moduleId));
        }
      } catch (err) {
        console.error("Enrollment failed:", err);
      }
    }
  };

  const handleStartPhase = (phase: Phase) => {
    const firstIncomplete = phase.modules?.find((m: Module) => !m.enrolled);
    if (firstIncomplete) {
      navigate(getCoursePath(firstIncomplete.id));
    }
  };

  const handleViewAllCourses = () => {
    navigate("/courses");
  };

  const handleRetry = () => {
    refetchData();
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
      {/* Debug Component - Remove in production */}
      <ApiDebug />

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
            <PhaseNavigation
              phases={phasesData}
              onPhaseChange={setActivePhase}
            />

            {phasesData.map((phase) => (
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
            <span className="text-green-400">API Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberSecOverview;
