import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EnrolledCourse } from "@/lib/types";
import {
  Award,
  BookOpen,
  CheckCircle,
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
  onContinueLearning: () => void;
  enableDetailedProgress?: boolean;
}

// T037: Simplified ProgressTracker for 2-API system - no longer uses deprecated APIs
const ProgressTracker = ({
  course,
  completedLessons,
  currentLessonIndex,
  onContinueLearning,
  enableDetailedProgress = false,
}: ProgressTrackerProps) => {
  // Calculate progress statistics from local data (no deprecated API calls)
  const progressStats = useMemo(() => {
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
      completedLessons.includes(l._id)
    ).length;
    const completedLabs = labLessons.filter((l) =>
      completedLessons.includes(l._id)
    ).length;
    const completedGames = gameLessons.filter((l) =>
      completedLessons.includes(l._id)
    ).length;
    const completedTexts = textLessons.filter((l) =>
      completedLessons.includes(l._id)
    ).length;

    // Calculate estimated time remaining
    const remainingLessons = allLessons.filter(
      (l) => !completedLessons.includes(l._id)
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
  }, [course.sections, completedLessons, currentLessonIndex]);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-blue-400";
    if (percentage >= 40) return "text-yellow-400";
    return "text-orange-400";
  };

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
                : "MISSION COMPLETE"}
            </span>
            <span>COMPLETED</span>
          </div>
        </div>

        {/* Content Type Progress */}
        {enableDetailedProgress && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Videos */}
            <div className="bg-gray-900/50 p-4 rounded-lg border border-green-400/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-mono text-blue-400">
                    VIDEOS
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {progressStats.videoProgress.completed}/
                  {progressStats.videoProgress.total}
                </span>
              </div>
              <Progress
                value={
                  progressStats.videoProgress.total > 0
                    ? (progressStats.videoProgress.completed /
                        progressStats.videoProgress.total) *
                      100
                    : 0
                }
                className="h-2 bg-gray-800"
              />
            </div>

            {/* Labs */}
            <div className="bg-gray-900/50 p-4 rounded-lg border border-green-400/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-mono text-orange-400">
                    LABS
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {progressStats.labProgress.completed}/
                  {progressStats.labProgress.total}
                </span>
              </div>
              <Progress
                value={
                  progressStats.labProgress.total > 0
                    ? (progressStats.labProgress.completed /
                        progressStats.labProgress.total) *
                      100
                    : 0
                }
                className="h-2 bg-gray-800"
              />
            </div>

            {/* Games */}
            <div className="bg-gray-900/50 p-4 rounded-lg border border-green-400/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-mono text-purple-400">
                    GAMES
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {progressStats.gameProgress.completed}/
                  {progressStats.gameProgress.total}
                </span>
              </div>
              <Progress
                value={
                  progressStats.gameProgress.total > 0
                    ? (progressStats.gameProgress.completed /
                        progressStats.gameProgress.total) *
                      100
                    : 0
                }
                className="h-2 bg-gray-800"
              />
            </div>

            {/* Reading */}
            <div className="bg-gray-900/50 p-4 rounded-lg border border-green-400/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-mono text-yellow-400">
                    READING
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {progressStats.textProgress.completed}/
                  {progressStats.textProgress.total}
                </span>
              </div>
              <Progress
                value={
                  progressStats.textProgress.total > 0
                    ? (progressStats.textProgress.completed /
                        progressStats.textProgress.total) *
                      100
                    : 0
                }
                className="h-2 bg-gray-800"
              />
            </div>
          </div>
        )}

        {/* Current Lesson */}
        {progressStats.currentLesson && (
          <div className="mb-6 p-4 bg-green-400/10 rounded-lg border border-green-400/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-green-400">
                CURRENT_MISSION
              </span>
              <Badge
                variant="outline"
                className="text-green-400 border-green-400/50"
              >
                {progressStats.currentLesson.type.toUpperCase()}
              </Badge>
            </div>
            <h4 className="text-white font-mono font-semibold mb-1">
              {progressStats.currentLesson.title}
            </h4>
            <p className="text-green-300/70 text-sm">
              {progressStats.currentLesson.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={onContinueLearning}
            className="flex-1 bg-green-400 hover:bg-green-500 text-black font-mono"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            CONTINUE_MISSION
          </Button>

          {progressStats.progressPercentage >= 80 && (
            <Button
              variant="outline"
              className="border-green-400/50 text-green-400 hover:bg-green-400/10 font-mono"
            >
              <Award className="w-4 h-4 mr-2" />
              ACHIEVEMENTS
            </Button>
          )}
        </div>

        {/* Achievement Badge */}
        {progressStats.progressPercentage === 100 && (
          <div className="mt-4 p-3 bg-green-400/20 rounded-lg border border-green-400 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Star className="w-5 h-5" />
              <span className="font-mono font-semibold">
                MISSION ACCOMPLISHED!
              </span>
              <Star className="w-5 h-5" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
