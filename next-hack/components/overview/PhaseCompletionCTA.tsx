"use client";

import { Phase } from "@/lib/types/course";
import { cn } from "@/lib/utils";
import { BookOpen, ArrowRight, Target, Trophy } from "lucide-react";

interface PhaseCompletionCTAProps {
  phase: Phase;
  isAuthenticated: boolean;
  onGetStarted: () => void;
}

export default function PhaseCompletionCTA({ 
  phase, 
  isAuthenticated, 
  onGetStarted 
}: PhaseCompletionCTAProps) {
  
  const getPhaseColorClasses = (color: string) => {
    const colorMap = {
      green: {
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-400/30",
        buttonBg: "bg-green-400",
        buttonHover: "hover:bg-green-300"
      },
      blue: {
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-400/30",
        buttonBg: "bg-blue-400",
        buttonHover: "hover:bg-blue-300"
      },
      purple: {
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-400/30",
        buttonBg: "bg-purple-400",
        buttonHover: "hover:bg-purple-300"
      },
      red: {
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-400/30",
        buttonBg: "bg-red-400",
        buttonHover: "hover:bg-red-300"
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  const colors = getPhaseColorClasses(phase.color);

  return (
    <div className="mt-12">
      {/* Call to Action for Unauthenticated Users */}
      {!isAuthenticated && (
        <div className={cn(
          "rounded-lg border p-8 text-center",
          "bg-gray-900/50 backdrop-blur-sm",
          colors.borderColor,
          colors.bgColor
        )}>
          <BookOpen className={cn("w-16 h-16 mx-auto mb-4", colors.color)} />
          <h3 className={cn("text-2xl font-bold mb-2", colors.color)}>
            Ready to Start Your Cybersecurity Journey?
          </h3>
          <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
            Join thousands of security professionals who have mastered {phase.title.toLowerCase()}. 
            Sign up to track your progress, earn achievements, and unlock interactive labs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onGetStarted}
              className={cn(
                "px-8 py-3 rounded-lg font-medium transition-all duration-200",
                "flex items-center justify-center gap-2",
                colors.buttonBg,
                colors.buttonHover,
                "text-black hover:scale-105"
              )}
            >
              <Target className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Progress Tracking</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Interactive Labs</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <BookOpen className="w-4 h-4 text-green-400" />
              <span>Achievement System</span>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action for Authenticated Users */}
      {isAuthenticated && (
        <div className={cn(
          "rounded-lg border p-8 text-center",
          "bg-gray-900/50 backdrop-blur-sm",
          "border-blue-400/30 bg-blue-500/10"
        )}>
          <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-blue-400 mb-4">
            Ready for Hands-On Practice?
          </h3>
          <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
            Continue your {phase.title.toLowerCase()} journey in your personalized dashboard. 
            Track your progress and access all your enrolled courses.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-400 text-black hover:bg-blue-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            <Target className="w-5 h-5" />
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}