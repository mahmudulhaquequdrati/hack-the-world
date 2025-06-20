import { useGetOverallProgressQuery } from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import ProgressService from "@/lib/progressService";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Code,
  Gamepad2,
  PlayCircle,
} from "lucide-react";

export const ProgressOverview = () => {
  const { user } = useAuthRTK();

  const {
    data: progressData,
    isLoading,
    error,
  } = useGetOverallProgressQuery(user?._id || "", {
    skip: !user?._id,
  });

  if (isLoading) {
    return (
      <div className="bg-black/50 border border-green-400/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">
          PROGRESS_OVERVIEW
        </h2>
        <div className="animate-pulse text-green-400/60">
          Loading progress...
        </div>
      </div>
    );
  }

  if (error || !progressData?.success) {
    return (
      <div className="bg-black/50 border border-green-400/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">
          PROGRESS_OVERVIEW
        </h2>
        <div className="text-red-400">Failed to load progress data</div>
      </div>
    );
  }

  const stats = progressData.data.overallStats;
  const contentStats = progressData.data.contentStats;

  return (
    <div className="bg-black/50 border border-green-400/30 rounded-lg p-6">
      <h2 className="text-xl font-bold text-green-400 mb-6 font-mono">
        PROGRESS_OVERVIEW
      </h2>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-400">MODULES</span>
          </div>
          <div className="text-lg font-bold text-green-300 font-mono">
            {stats.completedModules}/{stats.totalModules}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
            <div
              className="bg-green-400 h-1 rounded-full transition-all duration-500"
              style={{
                width: `${ProgressService.calculateCompletionPercentage(
                  stats.completedModules,
                  stats.totalModules
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-gray-900/50 border border-cyan-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <PlayCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400">VIDEOS</span>
          </div>
          <div className="text-lg font-bold text-cyan-300 font-mono">
            {contentStats.contentByType.video.completed}/
            {contentStats.contentByType.video.total}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
            <div
              className="bg-cyan-400 h-1 rounded-full transition-all duration-500"
              style={{
                width: `${ProgressService.calculateCompletionPercentage(
                  contentStats.contentByType.video.completed,
                  contentStats.contentByType.video.total
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-gray-900/50 border border-blue-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono text-blue-400">LABS</span>
          </div>
          <div className="text-lg font-bold text-blue-300 font-mono">
            {contentStats.contentByType.lab.completed}/
            {contentStats.contentByType.lab.total}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
            <div
              className="bg-blue-400 h-1 rounded-full transition-all duration-500"
              style={{
                width: `${ProgressService.calculateCompletionPercentage(
                  contentStats.contentByType.lab.completed,
                  contentStats.contentByType.lab.total
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-gray-900/50 border border-purple-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono text-purple-400">GAMES</span>
          </div>
          <div className="text-lg font-bold text-purple-300 font-mono">
            {contentStats.contentByType.game.completed}/
            {contentStats.contentByType.game.total}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
            <div
              className="bg-purple-400 h-1 rounded-full transition-all duration-500"
              style={{
                width: `${ProgressService.calculateCompletionPercentage(
                  contentStats.contentByType.game.completed,
                  contentStats.contentByType.game.total
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-mono text-green-400">
            OVERALL_COMPLETION
          </span>
          <span className="text-sm font-mono text-green-300">
            {stats.overallCompletionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${stats.overallCompletionPercentage}%` }}
          />
        </div>
      </div>

      {/* Content Status Summary */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="text-green-400 font-mono">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            {contentStats.completedContent}
          </div>
          <div className="text-green-400/60 text-xs">COMPLETED</div>
        </div>
        <div>
          <div className="text-yellow-400 font-mono">
            <Clock className="w-4 h-4 inline mr-1" />
            {contentStats.inProgressContent}
          </div>
          <div className="text-yellow-400/60 text-xs">IN_PROGRESS</div>
        </div>
        <div>
          <div className="text-gray-400 font-mono">
            {contentStats.totalContent -
              contentStats.completedContent -
              contentStats.inProgressContent}
          </div>
          <div className="text-gray-400/60 text-xs">NOT_STARTED</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;
