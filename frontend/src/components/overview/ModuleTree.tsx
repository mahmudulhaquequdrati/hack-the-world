import { Phase } from "@/lib/types";
import { Terminal } from "lucide-react";
import ModuleCard from "./ModuleCard";

interface ModuleTreeProps {
  phase: Phase;
  onNavigate: (path: string) => void;
  onEnroll: (path: string) => void;
}

const ModuleTree = ({ phase, onNavigate, onEnroll }: ModuleTreeProps) => {
  // Handle case where modules might not be loaded yet
  const modules = phase.modules || [];

  if (modules.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-6">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">
            ~/{phase.id}_phase/
          </span>
        </div>

        <div className="bg-black/60 border border-green-400/30 rounded-lg p-6 font-mono">
          <div className="text-center text-green-300/70 py-8">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No modules available for this phase</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Terminal className="w-5 h-5 text-green-400" />
        <span className="text-green-400 font-mono text-sm">
          ~/{phase.id}_phase/
        </span>
      </div>

      <div className="bg-black/60 border border-green-400/30 rounded-lg py-6 px-3 lg:p-6 font-mono ">
        <div className="space-y-0">
          {modules.map((module, index) => {
            const isLast = index === modules.length - 1;

            return (
              <ModuleCard
                key={module.id}
                module={module}
                index={index}
                totalModules={modules.length}
                isLast={isLast}
                isCompleted={module.completed || false}
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
              {modules.filter((m) => m.enrolled).length} enrolled,{" "}
              {modules.filter((m) => m.completed).length} completed
            </span>
            <span>
              total:{" "}
              {modules.reduce(
                (sum, m) => sum + (m.labs || 0) + (m.games || 0),
                0
              )}{" "}
              activities
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleTree;
