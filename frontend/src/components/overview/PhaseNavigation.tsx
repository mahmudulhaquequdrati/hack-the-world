import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIconFromName } from "@/lib/iconUtils";
import { Phase } from "@/lib/types";

interface PhaseNavigationProps {
  phases: Phase[];
  onPhaseChange: (phaseId: string) => void;
}

const PhaseNavigation = ({ phases, onPhaseChange }: PhaseNavigationProps) => {
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl overflow-x-auto">
        <TabsList className="bg-black/50 border border-green-400/30 p-1 flex w-max min-w-full sm:w-auto">
          {phases.map((phase) => {
            const PhaseIcon = getIconFromName(phase.icon);
            return (
              <TabsTrigger
                key={phase.id}
                value={phase.id}
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black flex items-center space-x-2 whitespace-nowrap px-3 py-2 text-sm flex-shrink-0 min-w-0"
                onClick={() => onPhaseChange(phase.id)}
              >
                <PhaseIcon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{phase.title}</span>
                <span className="sm:hidden">{phase.title.split(" ")[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </div>
  );
};

export default PhaseNavigation;
