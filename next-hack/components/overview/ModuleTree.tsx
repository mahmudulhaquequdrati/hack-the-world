"use client";

import { Phase, Module } from "@/lib/types/course";
import { cn } from "@/lib/utils";
import { Play, Lock, CheckCircle, BookOpen, Terminal, GamepadIcon, FileText } from "lucide-react";

interface ExtendedModule extends Module {
  enrolled?: boolean;
  completed?: boolean;
  progress?: number;
  enrollmentId?: string;
}

interface EnrollmentInfo {
  enrollmentId: string;
  status: string;
  progressPercentage: number;
  isCompleted: boolean;
  enrolledAt: string;
  completedAt?: string;
}

interface ModuleTreeProps {
  phase: Phase;
  modules: ExtendedModule[];
  onModuleClick: (moduleId: string) => void;
  onEnroll: (moduleId: string) => void;
  isAuthenticated: boolean;
  enrollmentMap: Map<string, EnrollmentInfo>;
}

export default function ModuleTree({ 
  phase, 
  modules, 
  onModuleClick, 
  onEnroll, 
  isAuthenticated,
  enrollmentMap 
}: ModuleTreeProps) {
  
  const getModuleColor = (index: number) => {
    const colors = ["blue", "yellow", "red", "purple", "cyan", "orange"];
    return colors[index % colors.length];
  };

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const baseClasses = {
      blue: isActive ? "border-blue-400 bg-blue-400/10 text-blue-400" : "border-blue-400/30 hover:border-blue-400/50 text-blue-300",
      yellow: isActive ? "border-yellow-400 bg-yellow-400/10 text-yellow-400" : "border-yellow-400/30 hover:border-yellow-400/50 text-yellow-300",
      red: isActive ? "border-red-400 bg-red-400/10 text-red-400" : "border-red-400/30 hover:border-red-400/50 text-red-300",
      purple: isActive ? "border-purple-400 bg-purple-400/10 text-purple-400" : "border-purple-400/30 hover:border-purple-400/50 text-purple-300",
      cyan: isActive ? "border-cyan-400 bg-cyan-400/10 text-cyan-400" : "border-cyan-400/30 hover:border-cyan-400/50 text-cyan-300",
      orange: isActive ? "border-orange-400 bg-orange-400/10 text-orange-400" : "border-orange-400/30 hover:border-orange-400/50 text-orange-300",
    };
    return baseClasses[color as keyof typeof baseClasses] || baseClasses.blue;
  };

  const getContentStats = (module: ExtendedModule) => {
    const videoCount = module.content?.videos?.length || 0;
    const labCount = module.labs || 0;
    const gameCount = module.games || 0;
    const docCount = module.content?.documents?.length || 0;
    
    return { videoCount, labCount, gameCount, docCount };
  };

  return (
    <div className="space-y-4">
      {/* Terminal-style tree header */}
      <div className="font-mono text-green-400 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-500">tree</span>
          <span className="text-green-400">{phase.title.toLowerCase().replace(/\s+/g, '_')}/</span>
        </div>
      </div>

      {/* Module Cards */}
      <div className="space-y-3">
        {modules.map((module, index) => {
          const color = getModuleColor(index);
          const enrollment = enrollmentMap.get(module.id);
          const isEnrolled = !!enrollment;
          const isCompleted = enrollment?.isCompleted || false;
          const progress = enrollment?.progressPercentage || 0;
          const stats = getContentStats(module);
          
          return (
            <div
              key={module.id}
              className={cn(
                "border rounded-lg p-4 transition-all duration-200 hover:scale-[1.02]",
                "bg-gray-900/50 backdrop-blur-sm",
                getColorClasses(color, isEnrolled)
              )}
            >
              {/* Terminal-style directory structure */}
              <div className="font-mono text-xs text-gray-500 mb-2">
                <span>├── </span>
                <span className="text-green-400">{module.title.toLowerCase().replace(/\s+/g, '_')}/</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                {/* Module Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Status Icon */}
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : isEnrolled ? (
                        <Play className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-500" />
                      )}
                      
                      <h3 className="text-lg font-semibold">{module.title}</h3>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      module.difficulty === "beginner" && "bg-green-400/20 text-green-400",
                      module.difficulty === "intermediate" && "bg-yellow-400/20 text-yellow-400",
                      module.difficulty === "advanced" && "bg-red-400/20 text-red-400",
                      module.difficulty === "expert" && "bg-purple-400/20 text-purple-400"
                    )}>
                      {module.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Content Statistics */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    {stats.videoCount > 0 && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{stats.videoCount} videos</span>
                      </div>
                    )}
                    {stats.labCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Terminal className="w-3 h-3" />
                        <span>{stats.labCount} labs</span>
                      </div>
                    )}
                    {stats.gameCount > 0 && (
                      <div className="flex items-center gap-1">
                        <GamepadIcon className="w-3 h-3" />
                        <span>{stats.gameCount} games</span>
                      </div>
                    )}
                    {stats.docCount > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{stats.docCount} docs</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {isEnrolled && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            `bg-${color}-400`
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onModuleClick(module.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      "border hover:scale-105",
                      getColorClasses(color, true)
                    )}
                  >
                    View Details
                  </button>
                  
                  {isAuthenticated && (
                    <>
                      {!isEnrolled ? (
                        <button
                          onClick={() => onEnroll(module.id)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-green-400 text-black hover:bg-green-300 hover:scale-105"
                        >
                          Enroll
                        </button>
                      ) : (
                        <button
                          onClick={() => onModuleClick(module.id)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                            "bg-blue-400 text-black hover:bg-blue-300 hover:scale-105"
                          )}
                        >
                          Continue
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}