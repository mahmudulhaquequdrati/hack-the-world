import { Badge } from "@/components/ui/badge";
import { ContentProgressStatus } from "@/hooks/useProgressTracking";
import { CheckCircle, Clock, PlayCircle } from "lucide-react";
import { useMemo } from "react";

interface ContentCompletionStatusProps {
  progressStatus: ContentProgressStatus | null;
  className?: string;
  showDetails?: boolean;
}

/**
 * T017: Content Completion Status Component
 *
 * Displays accurate content completion status when content is loaded.
 * Integrates with T014 progress checking to show real-time completion state.
 *
 * Features:
 * - Visual completion indicators (not-started, in-progress, completed)
 * - Progress percentage display
 * - Completion timestamp for completed content
 * - Score display for scored content (labs/games)
 * - Prevents unnecessary API calls for completed content
 */
export const ContentCompletionStatus = ({
  progressStatus,
  className = "",
  showDetails = true,
}: ContentCompletionStatusProps) => {
  // T017: Compute status information from T014 progress data
  const statusInfo = useMemo(() => {
    if (!progressStatus) {
      return {
        status: "not-started" as const,
        label: "Not Started",
        icon: PlayCircle,
        color: "bg-gray-500/20 text-gray-400 border-gray-400/30",
        description: "Content not yet accessed",
      };
    }

    switch (progressStatus.status) {
      case "completed":
        return {
          status: "completed" as const,
          label: "Completed",
          icon: CheckCircle,
          color: "bg-green-500/20 text-green-400 border-green-400/30",
          description: "Content completed",
        };
      case "in-progress":
        return {
          status: "in-progress" as const,
          label: "In Progress",
          icon: Clock,
          color: "bg-blue-500/20 text-blue-400 border-blue-400/30",
          description: `${progressStatus.progressPercentage}% complete`,
        };
      default:
        return {
          status: "not-started" as const,
          label: "Not Started",
          icon: PlayCircle,
          color: "bg-gray-500/20 text-gray-400 border-gray-400/30",
          description: "Ready to start",
        };
    }
  }, [progressStatus]);

  // T017: Handle score display for labs and games
  const scoreInfo = useMemo(() => {
    if (
      progressStatus?.status === "completed" &&
      progressStatus.score !== undefined &&
      progressStatus.score !== null &&
      progressStatus.maxScore !== undefined &&
      progressStatus.maxScore !== null
    ) {
      const percentage = Math.round(
        (progressStatus.score / progressStatus.maxScore) * 100
      );
      return {
        score: progressStatus.score,
        maxScore: progressStatus.maxScore,
        percentage,
        isHighScore: percentage >= 80,
      };
    }
    return null;
  }, [progressStatus]);

  const StatusIcon = statusInfo.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* T017: Status Badge with Icon */}
      <Badge
        variant="outline"
        className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono ${statusInfo.color}`}
      >
        <StatusIcon className="w-3 h-3" />
        <span>{statusInfo.label}</span>
        {progressStatus?.status === "in-progress" && (
          <span className="ml-1">({progressStatus.progressPercentage}%)</span>
        )}
      </Badge>

      {/* T017: Score Display for Completed Content */}
      {scoreInfo && (
        <Badge
          variant="outline"
          className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono ${
            scoreInfo.isHighScore
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
              : "bg-gray-500/20 text-gray-400 border-gray-400/30"
          }`}
        >
          <span>
            {scoreInfo.score}/{scoreInfo.maxScore} ({scoreInfo.percentage}%)
          </span>
        </Badge>
      )}

      {/* T017: Detailed Status Information */}
      {showDetails && (
        <span className="text-xs text-gray-400 font-mono">
          {statusInfo.description}
        </span>
      )}
    </div>
  );
};

/**
 * T017: Compact Content Status Indicator
 *
 * Simplified version for use in content lists and navigation
 */
interface ContentStatusIndicatorProps {
  progressStatus: ContentProgressStatus | null;
  size?: "sm" | "md" | "lg";
}

export const ContentStatusIndicator = ({
  progressStatus,
  size = "md",
}: ContentStatusIndicatorProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (!progressStatus) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-600 border border-gray-500`}
        title="Not started"
      />
    );
  }

  switch (progressStatus.status) {
    case "completed":
      return (
        <div title="Completed">
          <CheckCircle className={`${sizeClasses[size]} text-green-400`} />
        </div>
      );
    case "in-progress":
      return (
        <div title={`In progress (${progressStatus.progressPercentage}%)`}>
          <Clock className={`${sizeClasses[size]} text-blue-400`} />
        </div>
      );
    default:
      return (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-600 border border-gray-500`}
          title="Not started"
        />
      );
  }
};

export default ContentCompletionStatus;
