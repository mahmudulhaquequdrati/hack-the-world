import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIconFromName } from "@/lib/iconUtils";
import { Phase } from "@/lib/types";

interface PhaseNavigationProps {
  phases: Phase[];
  onPhaseChange: (phaseId: string) => void;
}

const PhaseNavigation = ({ phases, onPhaseChange }: PhaseNavigationProps) => {
  return (
    <div className="flex justify-center">
      <TabsList className="bg-black/50 border border-green-400/30 p-1">
        {phases.map((phase) => {
          const PhaseIcon = getIconFromName(phase.icon);
          return (
            <TabsTrigger
              key={phase.id}
              value={phase.id}
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black flex items-center space-x-2"
              onClick={() => onPhaseChange(phase.id)}
            >
              <PhaseIcon className="w-4 h-4" />
              <span>{phase.title}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export default PhaseNavigation;
