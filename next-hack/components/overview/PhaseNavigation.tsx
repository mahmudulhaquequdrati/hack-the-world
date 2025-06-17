"use client";

import { Phase } from "@/lib/types/course";
import { cn } from "@/lib/utils";

interface PhaseNavigationProps {
  phases: Phase[];
  activePhaseIndex: number;
  onPhaseChange: (index: number) => void;
}

export default function PhaseNavigation({ 
  phases, 
  activePhaseIndex, 
  onPhaseChange 
}: PhaseNavigationProps) {
  return (
    <div className="mt-8">
      {/* Terminal-style directory header */}
      <div className="text-green-400 font-mono text-sm mb-4">
        <span className="text-gray-500">~/cybersec_courses/</span>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {phases.map((phase, index) => (
          <button
            key={phase.id}
            onClick={() => onPhaseChange(index)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200",
              "border border-gray-700 hover:border-green-400/50",
              "bg-gray-900/50 hover:bg-gray-800/70",
              activePhaseIndex === index
                ? "border-green-400 bg-green-400/10 text-green-400 shadow-lg shadow-green-400/20"
                : "text-gray-300 hover:text-green-400"
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                activePhaseIndex === index ? "bg-green-400" : "bg-gray-500"
              )} />
              <span className="text-sm">{phase.title}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Current phase path indicator */}
      <div className="text-green-400 font-mono text-xs mb-4 opacity-70">
        <span className="text-gray-500">current:</span> {phases[activePhaseIndex]?.title.toLowerCase().replace(/\s+/g, '_')}
      </div>
    </div>
  );
}