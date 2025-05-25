import { Module } from "@/lib/types";
import { Terminal } from "lucide-react";
import { ModuleProgressCard } from "./ModuleProgressCard";

interface ProgressTabProps {
  enrolledModules: Module[];
}

export const ProgressTab = ({ enrolledModules }: ProgressTabProps) => {
  return (
    <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Terminal className="w-5 h-5 text-green-400" />
        <span className="text-green-400 font-mono text-sm">
          ~/enrolled_courses$ ls -la --progress
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledModules.map((module) => (
          <ModuleProgressCard key={module.id} module={module} />
        ))}
      </div>

      {enrolledModules.length === 0 && (
        <div className="text-center py-12">
          <Terminal className="w-12 h-12 text-green-400/50 mx-auto mb-4" />
          <p className="text-green-300/70 font-mono">
            $ ls: no enrolled modules found
          </p>
          <p className="text-green-300/50 text-sm font-mono mt-2">
            hint: try enrolling in some modules from the course tree
          </p>
        </div>
      )}
    </div>
  );
};
