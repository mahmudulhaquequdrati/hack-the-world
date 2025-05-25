import { Phase } from "@/lib/types";
import { Terminal } from "lucide-react";
import ModuleCard from "./ModuleCard";

interface ModuleTreeProps {
  phase: Phase;
  completedModules: string[];
  onNavigate: (path: string) => void;
  onEnroll: (path: string) => void;
}

const ModuleTree = ({
  phase,
  completedModules,
  onNavigate,
  onEnroll,
}: ModuleTreeProps) => {
  const getModuleStatus = (moduleId: string) => {
    return completedModules.includes(moduleId) ? "completed" : "in-progress";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Terminal className="w-5 h-5 text-green-400" />
        <span className="text-green-400 font-mono text-sm">
          ~/{phase.id}_phase/
        </span>
      </div>

      <div className="bg-black/60 border border-green-400/30 rounded-lg p-6 font-mono">
        <div className="space-y-0">
          {phase.modules.map((module, index) => {
            const status = getModuleStatus(module.id);
            const isCompleted = status === "completed";
            const isLast = index === phase.modules.length - 1;

            return (
              <ModuleCard
                key={module.id}
                module={module}
                index={index}
                totalModules={phase.modules.length}
                isLast={isLast}
                isCompleted={isCompleted}
                onNavigate={onNavigate}
                onEnroll={onEnroll}
              />
            );
          })}
        </div>

        {/* Terminal Footer */}
        <div className="mt-4 pt-4 border-t border-green-400/30">
          <div className="flex items-center justify-between text-xs font-mono text-green-300/70">
            <span>
              {phase.modules.filter((m) => m.enrolled).length} enrolled,{" "}
              {phase.modules.filter((m) => m.completed).length} completed
            </span>
            <span>
              total:{" "}
              {phase.modules.reduce((sum, m) => sum + m.labs + m.games, 0)}{" "}
              activities
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleTree;
