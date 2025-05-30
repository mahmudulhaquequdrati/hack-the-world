import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface CourseTabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

const CourseTabsContainer = ({
  activeTab,
  onTabChange,
  children,
}: CourseTabsContainerProps) => {
  return (
    <div className="bg-black border-2 border-green-400/50 rounded-lg overflow-hidden">
      {/* Terminal-style tab header */}
      <div className="bg-green-400/10 border-b border-green-400/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-green-400 font-mono text-lg font-bold">
            COURSE.MODULES
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="text-green-400/60 text-xs font-mono">
              INTERACTIVE
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="bg-black/60 border-b border-green-400/20 px-6 py-2">
          <TabsList className="grid w-full grid-cols-4 bg-transparent border-0 gap-2">
            <TabsTrigger
              value="overview"
              className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
            >
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger
              value="curriculum"
              className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
            >
              CURRICULUM
            </TabsTrigger>
            <TabsTrigger
              value="labs"
              className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
            >
              LABS
            </TabsTrigger>
            <TabsTrigger
              value="games"
              className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
            >
              GAMES
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">{children}</div>
      </Tabs>
    </div>
  );
};

export default CourseTabsContainer;
