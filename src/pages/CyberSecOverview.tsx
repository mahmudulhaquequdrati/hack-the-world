import { Header } from "@/components/common/Header";
import {
  ModuleTree,
  OverviewHeader,
  PhaseCard,
  PhaseCompletionCTA,
  PhaseNavigation,
} from "@/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getOverallProgress, PHASES_DATA } from "@/lib/appData";
import { COMPLETED_MODULES } from "@/lib/constants";
import { Phase } from "@/lib/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CyberSecOverview = () => {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState("beginner");
  const completedModules = [...COMPLETED_MODULES];

  const phases = PHASES_DATA;

  // Use centralized function for overall progress

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleEnroll = (path: string) => {
    navigate(path);
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

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pt-20 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <OverviewHeader overallProgress={getOverallProgress()} />

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
                  onNavigate={handleNavigate}
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
        </div>
      </div>
    </div>
  );
};

export default CyberSecOverview;
