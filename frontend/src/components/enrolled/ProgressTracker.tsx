import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetModuleProgressQuery } from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { EnrolledCourse } from "@/lib/types";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Gamepad2,
  Monitor,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

interface ProgressTrackerProps {
  course: EnrolledCourse;
  completedLessons: string[];
  currentLessonIndex: number;
  moduleId: string;
  onContinueLearning: () => void;
}

const ProgressTracker = ({
  course,
  completedLessons,
  currentLessonIndex,
  moduleId,
  onContinueLearning,
}: ProgressTrackerProps) => {
  const { user } = useAuthRTK();

  // Get progress data from API
  const { data: progressData, isLoading: progressLoading } =
    useGetModuleProgressQuery(
      { userId: user?.id || "", moduleId },
      { skip: !user?.id || !moduleId }
    );

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    // If we have API data, use it; otherwise fall back to local calculations
    if (progressData?.success) {
      const apiStats = progressData.data.statistics;
      const contentStats = progressData.data.statistics.contentByType;

      return {
        totalLessons: apiStats.totalContent,
        completedCount: apiStats.completedContent,
        progressPercentage: apiStats.completionPercentage,
        videoProgress: {
          completed: contentStats.video.completed,
          total: contentStats.video.total,
        },
        labProgress: {
          completed: contentStats.lab.completed,
          total: contentStats.lab.total,
        },
        gameProgress: {
          completed: contentStats.game.completed,
          total: contentStats.game.total,
        },
        textProgress: {
          completed: contentStats.document.completed,
          total: contentStats.document.total,
        },
        estimatedTimeRemaining: 0, // Would need to be calculated from content data
        currentLesson: course.sections.flatMap((s) => s.lessons)[
          currentLessonIndex
        ],
      };
    }

    // Fallback to local calculations
    const allLessons = course.sections.flatMap((section) => section.lessons);
    const totalLessons = allLessons.length;
    const completedCount = completedLessons.length;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Calculate content type progress
    const videoLessons = allLessons.filter((l) => l.type === "video");
    const labLessons = allLessons.filter((l) => l.type === "lab");
    const gameLessons = allLessons.filter((l) => l.type === "game");
    const textLessons = allLessons.filter((l) => l.type === "text");

    const completedVideos = videoLessons.filter((l) =>
      completedLessons.includes(l.id)
    ).length;
    const completedLabs = labLessons.filter((l) =>
      completedLessons.includes(l.id)
    ).length;
    const completedGames = gameLessons.filter((l) =>
      completedLessons.includes(l.id)
    ).length;
    const completedTexts = textLessons.filter((l) =>
      completedLessons.includes(l.id)
    ).length;

    // Calculate estimated time remaining
    const remainingLessons = allLessons.filter(
      (l) => !completedLessons.includes(l.id)
    );
    const estimatedTimeRemaining = remainingLessons.reduce((total, lesson) => {
      const duration = lesson.duration || "0:00";
      const [minutes] = duration.split(":").map(Number);
      return total + (minutes || 0);
    }, 0);

    return {
      totalLessons,
      completedCount,
      progressPercentage,
      videoProgress: { completed: completedVideos, total: videoLessons.length },
      labProgress: { completed: completedLabs, total: labLessons.length },
      gameProgress: { completed: completedGames, total: gameLessons.length },
      textProgress: { completed: completedTexts, total: textLessons.length },
      estimatedTimeRemaining,
      currentLesson: allLessons[currentLessonIndex],
    };
  }, [course.sections, completedLessons, currentLessonIndex, progressData]);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-blue-400";
    if (percentage >= 40) return "text-yellow-400";
    return "text-orange-400";
  };

  // Show loading state
  if (progressLoading) {
    return (
      <Card className="bg-black/50 border-2 border-green-400/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse text-green-400/60">
            Loading progress...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border-2 border-green-400/30 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-400/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 font-mono">
                MISSION_PROGRESS
              </h3>
              <p className="text-green-300/70 text-sm font-mono">
                {course.title}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`${getProgressColor(
              progressStats.progressPercentage
            )} bg-green-400/10 border border-green-400/30 font-mono`}
          >
            {progressStats.progressPercentage}% COMPLETE
          </Badge>
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-green-400">
              OVERALL_PROGRESS
            </span>
            <span className="text-sm font-mono text-green-300">
              {progressStats.completedCount}/{progressStats.totalLessons}{" "}
              LESSONS
            </span>
          </div>
          <Progress
            value={progressStats.progressPercentage}
            className="h-3 bg-gray-800"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-green-300/70 font-mono">
            <span>STARTED</span>
            <span>
              {progressStats.estimatedTimeRemaining > 0
                ? `~${Math.ceil(
                    progressStats.estimatedTimeRemaining / 60
                  )}h REMAINING`
                : "MISSION_COMPLETE"}
            </span>
          </div>
        </div>

        {/* Content Type Progress */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Videos */}
          <div className="bg-gray-900/50 border border-cyan-400/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">VIDEOS</span>
            </div>
            <div className="text-lg font-bold text-cyan-300 font-mono">
              {progressStats.videoProgress.completed}/
              {progressStats.videoProgress.total}
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
              <div
                className="bg-cyan-400 h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    progressStats.videoProgress.total > 0
                      ? (progressStats.videoProgress.completed /
                          progressStats.videoProgress.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Labs */}
          <div className="bg-gray-900/50 border border-yellow-400/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Monitor className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-mono text-yellow-400">LABS</span>
            </div>
            <div className="text-lg font-bold text-yellow-300 font-mono">
              {progressStats.labProgress.completed}/
              {progressStats.labProgress.total}
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
              <div
                className="bg-yellow-400 h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    progressStats.labProgress.total > 0
                      ? (progressStats.labProgress.completed /
                          progressStats.labProgress.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Games */}
          <div className="bg-gray-900/50 border border-purple-400/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono text-purple-400">GAMES</span>
            </div>
            <div className="text-lg font-bold text-purple-300 font-mono">
              {progressStats.gameProgress.completed}/
              {progressStats.gameProgress.total}
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
              <div
                className="bg-purple-400 h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    progressStats.gameProgress.total > 0
                      ? (progressStats.gameProgress.completed /
                          progressStats.gameProgress.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Reading */}
          <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-green-400" />
              <span className="text-xs font-mono text-green-400">READING</span>
            </div>
            <div className="text-lg font-bold text-green-300 font-mono">
              {progressStats.textProgress.completed}/
              {progressStats.textProgress.total}
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
              <div
                className="bg-green-400 h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    progressStats.textProgress.total > 0
                      ? (progressStats.textProgress.completed /
                          progressStats.textProgress.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Current Lesson */}
        {progressStats.currentLesson && (
          <div className="bg-green-400/5 border border-green-400/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-green-400">
                CURRENT_LESSON
              </span>
              <Badge
                variant="secondary"
                className="bg-green-400/20 text-green-300 font-mono text-xs capitalize"
              >
                {progressStats.currentLesson.type}
              </Badge>
            </div>
            <h4 className="text-green-300 font-mono font-semibold mb-1">
              {progressStats.currentLesson.title}
            </h4>
            <div className="flex items-center space-x-4 text-xs text-green-300/70">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="font-mono">
                  {progressStats.currentLesson.duration}
                </span>
              </div>
              {completedLessons.includes(progressStats.currentLesson.id) && (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  <span className="font-mono">COMPLETED</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={onContinueLearning}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-300 text-black hover:from-green-300 hover:to-green-200 font-mono font-bold"
          >
            <Target className="w-4 h-4 mr-2" />
            {progressStats.progressPercentage === 100
              ? "REVIEW_MISSION"
              : "CONTINUE_MISSION"}
          </Button>

          {progressStats.progressPercentage === 100 && (
            <Button
              variant="outline"
              className="text-green-400 border-green-400/30 hover:bg-green-400/10 font-mono"
            >
              <Award className="w-4 h-4 mr-2" />
              CLAIM_CERTIFICATE
            </Button>
          )}
        </div>

        {/* Achievement Indicator */}
        {progressStats.progressPercentage >= 25 &&
          progressStats.progressPercentage < 100 && (
            <div className="mt-4 p-3 bg-blue-400/5 border border-blue-400/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-mono text-sm">
                  {progressStats.progressPercentage >= 75
                    ? "MISSION_NEARLY_COMPLETE"
                    : progressStats.progressPercentage >= 50
                    ? "HALFWAY_MILESTONE_ACHIEVED"
                    : "PROGRESS_MILESTONE_UNLOCKED"}
                </span>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
