"use client";

import { Phase } from "@/lib/types/course";
import { Activity, BookOpen, LucideIcon, Video, Zap, Shield, Terminal, Users } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface EnrollmentInfo {
  enrollmentId: string;
  status: string;
  progressPercentage: number;
  isCompleted: boolean;
  enrolledAt: string;
  completedAt?: string;
}

interface PhaseCardProps {
  phase: Phase;
  showProgress?: boolean;
  enrollmentMap?: Map<string, EnrollmentInfo>;
  className?: string;
}

interface PhaseStatsType {
  courses: number;
  videos: number;
  labs: number;
  games: number;
}

const PhaseCard = ({ phase, showProgress = false, enrollmentMap, className = "" }: PhaseCardProps) => {
  // Calculate stats directly from the phase data
  const stats: PhaseStatsType = useMemo(() => {
    if (!phase.modules || phase.modules.length === 0) {
      return {
        courses: 0,
        videos: 0,
        labs: 0,
        games: 0,
      };
    }

    // Calculate stats from the modules data
    const coursesCount = phase.modules.length;

    // Sum up the stats from all modules in the phase
    const totalStats = phase.modules.reduce(
      (acc, module) => {
        // Use the stats from module data if available
        acc.labs += module.labs || 0;
        acc.games += module.games || 0;
        // For videos, we might need to check content.videos.length or use a default
        acc.videos += module.content?.videos?.length || 3; // Default assumption
        return acc;
      },
      {
        courses: coursesCount,
        videos: 0,
        labs: 0,
        games: 0,
      }
    );

    return totalStats;
  }, [phase.modules]);

  // Calculate enrollment progress if available
  const enrollmentProgress = useMemo(() => {
    if (!showProgress || !enrollmentMap || !phase.modules) {
      return { enrolled: 0, completed: 0, totalProgress: 0 };
    }
    
    let enrolled = 0;
    let completed = 0;
    let totalProgress = 0;
    
    phase.modules.forEach(module => {
      const enrollment = enrollmentMap.get(module.id);
      if (enrollment) {
        enrolled++;
        totalProgress += enrollment.progressPercentage || 0;
        if (enrollment.isCompleted) {
          completed++;
        }
      }
    });
    
    return {
      enrolled,
      completed,
      totalProgress: enrolled > 0 ? Math.round(totalProgress / enrolled) : 0
    };
  }, [showProgress, enrollmentMap, phase.modules]);

  // Get dynamic colors based on phase color
  const getColorsForPhase = (color: string) => {
    const colorMap = {
      green: {
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-400/30",
        hoverBorder: "hover:border-green-400",
        shadow: "shadow-green-400/20"
      },
      blue: {
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-400/30",
        hoverBorder: "hover:border-blue-400",
        shadow: "shadow-blue-400/20"
      },
      purple: {
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-400/30",
        hoverBorder: "hover:border-purple-400",
        shadow: "shadow-purple-400/20"
      },
      red: {
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-400/30",
        hoverBorder: "hover:border-red-400",
        shadow: "shadow-red-400/20"
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  const colors = getColorsForPhase(phase.color);

  // Get icon component
  const getIconComponent = (icon: LucideIcon | string) => {
    const iconMap = {
      'shield': Shield,
      'terminal': Terminal,
      'users': Users,
      'activity': Activity,
      'zap': Zap
    };
    
    if (typeof icon === "string") {
      return iconMap[icon as keyof typeof iconMap] || Shield;
    }
    return icon;
  };

  const IconComponent = getIconComponent(phase.icon);

  return (
    <div
      className={cn(
        "rounded-lg border p-6 transition-all duration-300",
        "bg-gray-900/50 backdrop-blur-sm",
        colors.borderColor,
        colors.hoverBorder,
        `hover:shadow-lg ${colors.shadow}`,
        className
      )}
    >
      {/* Phase Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className={cn(
          "p-3 rounded-lg border",
          colors.bgColor,
          colors.borderColor
        )}>
          <IconComponent className={cn("w-8 h-8", colors.color)} />
        </div>
        <div className="flex-1">
          <h2 className={cn("text-2xl font-bold mb-2", colors.color)}>
            {phase.title}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {phase.description}
          </p>
          
          {/* Difficulty Badge */}
          <div className="mt-3">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              phase.difficulty === "beginner" && "bg-green-400/20 text-green-400",
              phase.difficulty === "intermediate" && "bg-yellow-400/20 text-yellow-400",
              phase.difficulty === "advanced" && "bg-red-400/20 text-red-400",
              phase.difficulty === "expert" && "bg-purple-400/20 text-purple-400"
            )}>
              {phase.difficulty.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Section (if authenticated and enrolled) */}
      {showProgress && enrollmentProgress.enrolled > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Your Progress</span>
            <span className={cn("text-sm font-medium", colors.color)}>
              {enrollmentProgress.totalProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className={cn("h-2 rounded-full transition-all duration-300", colors.color.replace('text-', 'bg-'))}
              style={{ width: `${enrollmentProgress.totalProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{enrollmentProgress.enrolled} enrolled</span>
            <span>{enrollmentProgress.completed} completed</span>
          </div>
        </div>
      )}

      {/* Phase Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-3 rounded-lg bg-gray-800/30">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className={cn("w-5 h-5", colors.color)} />
          </div>
          <div className="text-white font-bold text-xl">{stats.courses}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wide">Courses</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-gray-800/30">
          <div className="flex items-center justify-center mb-2">
            <Video className={cn("w-5 h-5", colors.color)} />
          </div>
          <div className="text-white font-bold text-xl">{stats.videos}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wide">Videos</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-gray-800/30">
          <div className="flex items-center justify-center mb-2">
            <Activity className={cn("w-5 h-5", colors.color)} />
          </div>
          <div className="text-white font-bold text-xl">{stats.labs}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wide">Labs</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-gray-800/30">
          <div className="flex items-center justify-center mb-2">
            <Zap className={cn("w-5 h-5", colors.color)} />
          </div>
          <div className="text-white font-bold text-xl">{stats.games}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wide">Games</div>
        </div>
      </div>
    </div>
  );
};

export default PhaseCard;