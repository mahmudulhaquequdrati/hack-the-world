import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Module, Phase } from "@/lib/types";
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
  getPhases: () => Phase[];
  achievements: Array<{
    title: string;
    description: string;
    earned: boolean;
    icon: React.ComponentType<{ className?: string }>;
    category: 'module' | 'lab' | 'game' | 'xp' | 'general';
  }>;
  labsData?: any;
  gamesData?: any;
  isLoadingData?: boolean;
}

export const DashboardTabs = ({
  activeTab,
  onTabChange,
  onModuleClick,
  getAllModules,
  getEnrolledModules,
  getPhases,
  achievements,
  labsData,
  gamesData,
  isLoadingData = false,
}: DashboardTabsProps) => {
  const phases = getPhases();
  console.log(getEnrolledModules(), "getEnrolledModules");

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="bg-black/50 border border-green-400/30 w-full flex justify-start overflow-x-auto h-min hide-scrollbar">
        <TabsTrigger
          value="progress"
          className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono "
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
          phases={phases}
          labsData={labsData}
          isLoading={isLoadingData}
        />
      </TabsContent>

      <TabsContent value="games" className="space-y-6">
        <DashboardGamesTab
          phases={phases}
          gamesData={gamesData}
          isLoading={isLoadingData}
        />
      </TabsContent>

      <TabsContent value="achievements" className="space-y-6">
        <AchievementsTab
          achievements={achievements}
          enrolledModules={getEnrolledModules()}
        />
      </TabsContent>
    </Tabs>
  );
};
