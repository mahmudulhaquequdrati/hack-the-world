import { Module } from "@/lib/types";
import { Flame, Star, Terminal, Trophy, Zap } from "lucide-react";

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
  const totalProgress =
    enrolledModules.length > 0
      ? Math.round(
          enrolledModules.reduce((sum, module) => sum + module.progress, 0) /
            enrolledModules.length
        )
      : 0;

  const completedModules = enrolledModules.filter(
    (module) => module.completed
  ).length;
  const inProgressModules = enrolledModules.filter(
    (module) => module.progress > 0 && !module.completed
  ).length;

  // Calculate streak and achievements
  const currentStreak = 7; // Mock data
  const totalXP = enrolledModules.reduce(
    (sum, module) => sum + module.progress * 10,
    0
  );
  const nextMilestone = 1000;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Terminal className="w-6 h-6 text-green-400" />
          <h2 className="text-3xl font-bold text-green-400 font-mono">
            LEARNING_DASHBOARD
          </h2>
        </div>
        <p className="text-green-400 font-mono">
          ~/progress$ track --learning-journey --detailed-analytics
        </p>
      </div>

      {/* Main Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Circular Progress */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-black/80 to-black/40 border border-green-400/30 rounded-2xl p-8 text-center backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 font-mono">
              OVERALL PROGRESS
            </h3>
            <CircularProgress
              percentage={totalProgress}
              size={160}
              strokeWidth={12}
              color="text-green-400"
            />
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-400">
                {completedModules} of {enrolledModules.length} modules completed
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-mono text-sm">
                  {currentStreak} day streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressStatsCard
              title="Completed"
              value={completedModules}
              icon={Trophy}
              color="border-green-400/30"
              description="Modules finished"
            />
            <ProgressStatsCard
              title="In Progress"
              value={inProgressModules}
              icon={Zap}
              color="border-yellow-400/30"
              description="Currently learning"
            />
            <ProgressStatsCard
              title="Total XP"
              value={Math.round(totalXP)}
              icon={Star}
              color="border-blue-400/30"
              description={`${
                nextMilestone - Math.round(totalXP)
              } to next milestone`}
            />
            <ProgressStatsCard
              title="Learning Streak"
              value={`${currentStreak} days`}
              icon={Flame}
              color="border-orange-400/30"
              description="Keep it up!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
