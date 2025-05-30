import { Button } from "@/components/ui/button";
import { EnrolledLesson } from "@/lib/types";
import { CheckCircle, Maximize2, Pause, Play, Video } from "lucide-react";

interface VideoPlayerProps {
  lesson: EnrolledLesson;
  isPlaying: boolean;
  currentVideo: number;
  totalLessons: number;
  completedLessons: string[];
  isMaximized?: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: (lessonId: string) => void;
  onMaximize: () => void;
  onRestore?: () => void;
}

const VideoPlayer = ({
  lesson,
  isPlaying,
  currentVideo,
  totalLessons,
  completedLessons,
  isMaximized = false,
  onPlayPause,
  onPrevious,
  onNext,
  onMarkComplete,
  onMaximize,
  onRestore,
}: VideoPlayerProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-green-400/30 flex items-center justify-between">
        <h3 className="text-green-400 font-semibold flex items-center">
          <Video className="w-4 h-4 mr-2" />
          {lesson?.title}
        </h3>
        <div className="flex items-center space-x-2">
          {isMaximized && onRestore ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestore}
              className="text-green-400 hover:bg-green-400/10"
              title="Restore to split view"
            >
              <Maximize2 className="w-4 h-4 rotate-180" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMaximize}
              className="text-green-400 hover:bg-green-400/10"
              title="Maximize video"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="aspect-video bg-black border border-green-400/30 rounded-lg flex items-center justify-center mb-4 flex-shrink-0 relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-green-400" />
              ) : (
                <Play className="w-6 h-6 text-green-400" />
              )}
            </div>
            <Button
              onClick={onPlayPause}
              className="bg-green-400 text-black hover:bg-green-300"
            >
              {isPlaying ? "Pause" : "Play"} Video
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentVideo === 0}
              className="border-green-400/30 text-green-400 hover:bg-green-400/10"
              size="sm"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={onNext}
              disabled={currentVideo === totalLessons - 1}
              className="border-green-400/30 text-green-400 hover:bg-green-400/10"
              size="sm"
            >
              Next
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {!completedLessons.includes(lesson?.id || "") && (
              <Button
                onClick={() => lesson && onMarkComplete(lesson.id)}
                className="bg-green-400 text-black hover:bg-green-300"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}
            {completedLessons.includes(lesson?.id || "") && (
              <div className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
