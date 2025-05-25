import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Module, Phase } from "@/lib/types";
import { AchievementsTab } from "./AchievementsTab";
import { DashboardOverviewTab } from "./OverviewTab";
import { ProgressTab } from "./ProgressTab";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  phases: Phase[];
  expandedPhases: string[];
  onTogglePhase: (phaseId: string) => void;
  onModuleClick: (module: Module) => void;
  getAllModules: () => Module[];
  getEnrolledModules: () => Module[];
  getCompletedModules: () => Module[];
  achievements: Array<{
    title: string;
    description: string;
    earned: boolean;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

export const DashboardTabs = ({
  activeTab,
  onTabChange,
  phases,
  expandedPhases,
  onTogglePhase,
  onModuleClick,
  getAllModules,
  getEnrolledModules,
  getCompletedModules,
  achievements,
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="bg-black/50 border border-green-400/30">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
        >
          {">> "}course_tree
        </TabsTrigger>
        <TabsTrigger
          value="progress"
          className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
        >
          {">> "}my_progress
        </TabsTrigger>
        <TabsTrigger
          value="achievements"
          className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
        >
          {">> "}achievements
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <DashboardOverviewTab
          phases={phases}
          expandedPhases={expandedPhases}
          onTogglePhase={onTogglePhase}
          onModuleClick={onModuleClick}
          getAllModules={getAllModules}
          getEnrolledModules={getEnrolledModules}
          getCompletedModules={getCompletedModules}
        />
      </TabsContent>

      <TabsContent value="progress" className="space-y-6">
        <ProgressTab enrolledModules={getEnrolledModules()} />
      </TabsContent>

      <TabsContent value="achievements" className="space-y-6">
        <AchievementsTab achievements={achievements} />
      </TabsContent>
    </Tabs>
  );
};
