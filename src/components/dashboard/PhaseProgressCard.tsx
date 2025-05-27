import { Module } from "@/lib/types";

interface PhaseProgressCardProps {
  phase: string;
  modules: Module[];
  isActive: boolean;
  onClick: () => void;
}

export const PhaseProgressCard = ({
  phase,
  modules,
  isActive,
  onClick,
}: PhaseProgressCardProps) => {
  const completedCount = modules.filter((m) => m.completed).length;
  const totalCount = modules.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      onClick={onClick}
      className={`bg-black/40 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
        isActive
          ? "border-2 border-green-400 shadow-lg shadow-green-400/20"
          : "border border-green-400/20 hover:border-green-400/40"
      }`}
    >
      <h4
        className={`text-sm font-bold font-mono capitalize mb-2 ${
          isActive ? "text-green-400" : "text-white"
        }`}
      >
        {phase} Phase
      </h4>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">
          {completedCount}/{totalCount} completed
        </span>
        <span
          className={`text-sm font-bold ${
            isActive ? "text-green-400" : "text-green-400"
          }`}
        >
          {progressPercentage}%
        </span>
      </div>
      <div className="w-full bg-black/50 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            isActive
              ? "bg-gradient-to-r from-green-400 to-blue-400"
              : "bg-gradient-to-r from-green-400 to-blue-400"
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {isActive && (
        <div className="mt-2 text-xs text-green-400 font-mono">
          ● Active Filter
        </div>
      )}
    </div>
  );
};
