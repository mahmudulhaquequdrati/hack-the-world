import { Module } from "@/lib/types";
import { Flame, Star, Terminal, Trophy, Zap } from "lucide-react";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";

interface LearningDashboardProps {
  enrolledModules: Module[];
}

// Circular Progress Component
const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "text-green-400",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${color}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-2xl font-bold font-mono ${color}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// Progress Stats Card Component
const ProgressStatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}) => (
  <div
    className={`relative overflow-hidden rounded-xl border ${color} bg-gradient-to-br from-black/80 to-black/40 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/20`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          {title}
        </p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div
        className={`p-3 rounded-full ${color
          .replace("border-", "bg-")
          .replace("/30", "/20")}`}
      >
        <Icon
          className={`w-6 h-6 ${color
            .replace("border-", "text-")
            .replace("/30", "")}`}
        />
      </div>
    </div>
    <div
      className={`absolute inset-0 bg-gradient-to-r ${color
        .replace("border-", "from-")
        .replace("/30", "/5")} to-transparent opacity-50`}
    />
  </div>
);

export const LearningDashboard = ({
  enrolledModules,
}: LearningDashboardProps) => {
  // Get current user data for real stats
  const { data: currentUser } = useGetCurrentUserQuery();
  
  const totalProgress =
    enrolledModules.length > 0
      ? Math.round(
          enrolledModules.reduce((sum, module) => sum + (module.progress || 0), 0) /
            enrolledModules.length
        )
      : 0;

  const completedModules = enrolledModules.filter(
    (module) => module.completed
  ).length;
  const inProgressModules = enrolledModules.filter(
    (module) => (module.progress || 0) > 0 && !module.completed
  ).length;

  // Use real user data instead of dummy values
  const currentStreak = 7; // TODO: Add streak tracking to backend API
  const totalXP = currentUser?.data?.user?.stats?.totalPoints || 0;
  const userLevel = currentUser?.data?.user?.stats?.level || 1;
  const nextMilestone = userLevel * 1000;

  return (
    <div className="space-y-8">
      {/* Header with Terminal Style */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Terminal className="w-6 h-6 text-green-400" />
          <h2 className="text-3xl font-bold text-green-400 font-mono uppercase tracking-wider">
            LEARNING_DASHBOARD
          </h2>
        </div>
        <div className="bg-black/60 border border-green-400/30 rounded-lg p-3 max-w-2xl mx-auto">
          <p className="text-green-400 font-mono text-sm">
            ~/dashboard$ track --learning-journey --detailed-analytics
          </p>
        </div>
      </div>

      {/* Main Progress Overview with Retro Styling */}
      <div className="bg-black/60 border border-green-400/30 rounded-xl p-8 relative overflow-hidden">
        {/* Retro Scanlines Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-green-400/20 to-transparent bg-[length:100%_4px] animate-pulse"></div>
        </div>

        {/* Terminal Header */}
        <div className="flex items-center space-x-2 mb-8">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">~/dashboard/overview/</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Circular Progress with Retro Style */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-green-400/30 rounded-xl p-8 text-center relative overflow-hidden">
              {/* Glitch Border Animation */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              <h3 className="text-xl font-bold text-green-400 mb-6 font-mono uppercase tracking-wider relative z-10">
                MISSION_PROGRESS
              </h3>
              <div className="relative z-10">
                <CircularProgress
                  percentage={totalProgress}
                  size={160}
                  strokeWidth={12}
                  color="text-green-400"
                />
              </div>
              <div className="mt-6 space-y-3 relative z-10">
                <div className="bg-black/40 border border-green-400/20 rounded-lg p-3">
                  <p className="text-green-400 font-mono text-sm">
                    <span className="text-green-300">STATUS:</span> {completedModules}/{enrolledModules.length} MODULES
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 bg-orange-400/10 border border-orange-400/30 rounded-lg p-2">
                  <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span className="text-orange-400 font-mono text-sm font-bold">
                    {currentStreak}_DAY_STREAK
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid with Enhanced Retro Design */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Completed Modules */}
              <div className="relative overflow-hidden rounded-xl border-2 border-green-400/30 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 group hover:border-green-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-mono text-green-400/80 uppercase tracking-wider mb-1">COMPLETED</p>
                    <p className="text-3xl font-bold text-green-400 font-mono">{completedModules}</p>
                    <p className="text-xs text-green-300/60 font-mono mt-1">MODULES_FINISHED</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-400/20 border-2 border-green-400/40 flex items-center justify-center group-hover:animate-pulse">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="relative overflow-hidden rounded-xl border-2 border-yellow-400/30 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 group hover:border-yellow-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-mono text-yellow-400/80 uppercase tracking-wider mb-1">IN_PROGRESS</p>
                    <p className="text-3xl font-bold text-yellow-400 font-mono">{inProgressModules}</p>
                    <p className="text-xs text-yellow-300/60 font-mono mt-1">CURRENTLY_LEARNING</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-400/20 border-2 border-yellow-400/40 flex items-center justify-center group-hover:animate-spin">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Total XP */}
              <div className="relative overflow-hidden rounded-xl border-2 border-blue-400/30 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 group hover:border-blue-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-mono text-blue-400/80 uppercase tracking-wider mb-1">TOTAL_XP</p>
                    <p className="text-3xl font-bold text-blue-400 font-mono">{Math.round(totalXP)}</p>
                    <p className="text-xs text-blue-300/60 font-mono mt-1">{nextMilestone - Math.round(totalXP)}_TO_NEXT</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-400/20 border-2 border-blue-400/40 flex items-center justify-center group-hover:animate-bounce">
                    <Star className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Learning Streak */}
              <div className="relative overflow-hidden rounded-xl border-2 border-orange-400/30 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 group hover:border-orange-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-mono text-orange-400/80 uppercase tracking-wider mb-1">STREAK</p>
                    <p className="text-3xl font-bold text-orange-400 font-mono">{currentStreak}</p>
                    <p className="text-xs text-orange-300/60 font-mono mt-1">DAYS_ACTIVE</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-400/20 border-2 border-orange-400/40 flex items-center justify-center group-hover:animate-pulse">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-8 pt-6 border-t border-green-400/30 relative z-10">
          <div className="flex items-center justify-between text-xs font-mono text-green-300/70">
            <span>{enrolledModules.length} modules enrolled, {completedModules} completed</span>
            <span>last_updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
