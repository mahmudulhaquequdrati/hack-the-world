import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEnrolledPhases, getModulesByPhase } from "@/lib/appData";
import { Module } from "@/lib/types";
import { AchievementsTab } from "./AchievementsTab";
import { DashboardGamesTab } from "./DashboardGamesTab";
import { DashboardLabsTab } from "./DashboardLabsTab";
import { EnhancedProgressTab } from "./EnhancedProgressTab";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onModuleClick: (module: Module) => void;
  getAllModules: () => Module[];
  getEnrolledModules: () => Module[];
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
  onModuleClick,
  getAllModules,
  getEnrolledModules,
  achievements,
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="bg-black/50 border border-green-400/30">
        <TabsTrigger
          value="progress"
          className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
        >
          {">> "}my_progress
        </TabsTrigger>
        <TabsTrigger
          value="labs"
          className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
        >
          {">> "}my_labs
        </TabsTrigger>
        <TabsTrigger
          value="games"
          className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
        >
          {">> "}my_games
        </TabsTrigger>
        <TabsTrigger
          value="achievements"
          className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
        >
          {">> "}achievements
        </TabsTrigger>
      </TabsList>

      <TabsContent value="progress" className="space-y-6">
        <EnhancedProgressTab
          enrolledModules={getEnrolledModules()}
          onModuleClick={onModuleClick}
          getAllModules={getAllModules}
        />
      </TabsContent>

      <TabsContent value="labs" className="space-y-6">
        <DashboardLabsTab
          phases={getEnrolledPhases()}
          getModulesByPhase={getModulesByPhase}
        />
      </TabsContent>

      <TabsContent value="games" className="space-y-6">
        <DashboardGamesTab
          phases={getEnrolledPhases()}
          getModulesByPhase={getModulesByPhase}
        />
      </TabsContent>

      <TabsContent value="achievements" className="space-y-6">
        <AchievementsTab achievements={achievements} />
      </TabsContent>
    </Tabs>
  );
};
