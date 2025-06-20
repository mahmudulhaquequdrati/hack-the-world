import { Button } from "@/components/ui/button";
import { apiSlice } from "@/features/api/apiSlice";
import { EnrolledLesson } from "@/lib/types";
import {
  CheckCircle,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Shield,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  lesson: EnrolledLesson;
  isPlaying: boolean;
  currentVideo: number;
  totalLessons: number;
  isCompleted: boolean;
  isMaximized?: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: (lessonId: string) => void;
  onMaximize: () => void;
  onRestore?: () => void;
  // T022: Loading states for navigation buttons
  isNavigatingNext?: boolean;
  isNavigatingPrev?: boolean;
  // T035: Video progress tracking for auto-completion
  onVideoProgress?: (progressPercentage: number) => void;
}

const VideoPlayer = ({
  lesson,
  isPlaying,
  currentVideo,
  totalLessons,
  isCompleted,
  isMaximized = false,
  onPlayPause,
  onPrevious,
  onNext,
  onMarkComplete,
  onMaximize,
  onRestore,
  // T022: Loading states for navigation buttons
  isNavigatingNext,
  isNavigatingPrev,
  // T035: Video progress tracking for auto-completion
  onVideoProgress,
}: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [securityWarning, setSecurityWarning] = useState("");
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Get actual MongoDB content ID directly from lesson
  const contentId = lesson?.contentId || "";

  // Reset player ready state when content changes
  useEffect(() => {
    setIsPlayerReady(false);
    setHasStarted(false);
    setProgress(0);
    setPlayed(0);
    // Add a small delay before setting player ready to true
    const timeoutId = setTimeout(() => {
      setIsPlayerReady(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [contentId]);

  // Lazy loading for video URL if missing (T012 fix)
  const needsVideoUrl =
    lesson?.type === "video" && !lesson?.videoUrl && contentId;

  const { data: contentData, isLoading: contentLoading } =
    apiSlice.endpoints.getCourseById.useQuery(contentId, {
      skip: !needsVideoUrl,
    });

  // Enhanced lesson with lazy-loaded video URL
  const enhancedLesson = useMemo(() => {
    if (needsVideoUrl && contentData) {
      return {
        ...lesson,
        videoUrl: contentData.title, // Using title as placeholder since Course doesn't have url
        description: contentData.description || lesson.description,
        instructions: contentData.description || lesson.content,
      };
    }
    return lesson;
  }, [needsVideoUrl, contentData, lesson]);

  // Check if we have a valid video URL
  const hasVideoUrl = useMemo(() => {
    const url = enhancedLesson?.videoUrl;
    return (
      url &&
      url.trim() !== "" &&
      (url.startsWith("http") || url.startsWith("blob"))
    );
  }, [enhancedLesson?.videoUrl]);

  // Log video loading state for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Video loading state:", {
        contentId,
        videoUrl: enhancedLesson?.videoUrl,
        hasVideoUrl,
        isPlayerReady,
        needsVideoUrl,
        contentLoading,
      });
    }
  }, [
    contentId,
    enhancedLesson?.videoUrl,
    hasVideoUrl,
    isPlayerReady,
    needsVideoUrl,
    contentLoading,
  ]);

  // Security: Prevent tab switching and visibility change during video
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        // Pause video when tab is not visible
        onPlayPause();
        setSecurityWarning(
          "Video paused for security. Please keep this tab active while watching."
        );
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue =
          "Video is currently playing. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isPlaying, onPlayPause]);

  // Security: Disable developer tools and inspection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common developer tool shortcuts
      if (
        // F12
        e.keyCode === 123 ||
        // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
        // Ctrl+Shift+C
        (e.ctrlKey && e.shiftKey && e.keyCode === 67) ||
        // Ctrl+Shift+J
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
        // Ctrl+U (view source)
        (e.ctrlKey && e.keyCode === 85) ||
        // Ctrl+S (save page)
        (e.ctrlKey && e.keyCode === 83) ||
        // Ctrl+P (print)
        (e.ctrlKey && e.keyCode === 80) ||
        // F5/Ctrl+R (refresh)
        e.keyCode === 116 ||
        (e.ctrlKey && e.keyCode === 82)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setSecurityWarning("This action is not allowed during video playback.");
        return false;
      }
    };

    // Only apply security when video is playing
    if (isPlaying) {
      document.addEventListener("keydown", handleKeyDown, true);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isPlaying]);

  // Security: Disable right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSecurityWarning("Right-click is disabled for security purposes.");
    return false;
  };

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleProgress = useCallback(
    async (state: {
      played: number;
      playedSeconds: number;
      loadedSeconds: number;
    }) => {
      setPlayed(state.played);
      setProgress(state.playedSeconds);

      // T035: Call parent progress handler for auto-completion tracking
      if (onVideoProgress) {
        onVideoProgress(state.played * 100); // Convert to percentage
      }

      // Simple progress tracking - let parent handle API calls
      // We just track local video progress for UI purposes
    },
    [onVideoProgress]
  );

  const handleDuration = useCallback((duration: number) => {
    setDuration(duration);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(!muted);
  }, [muted]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVideoEnd = async () => {
    // Auto-mark as complete when video ends
    if (enhancedLesson && !isCompleted) {
      onMarkComplete(enhancedLesson._id);
    }

    // Auto-advance to next lesson if available
    if (currentVideo < totalLessons - 1) {
      setTimeout(() => {
        onNext();
      }, 2000);
    }
  };

  const handleVideoReady = () => {
    // Video is ready for playback
    setIsPlayerReady(true); // Mark player as ready
  };

  const handlePlay = () => {
    setHasStarted(true);
    onPlayPause();
    setSecurityWarning(""); // Clear any warnings when starting video
  };

  const handleVideoStart = () => {
    setHasStarted(true);
  };

  const handleVideoClick = () => {
    if (hasStarted) {
      onPlayPause();
    } else {
      handlePlay();
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Hide controls after a delay when playing
    if (isPlaying) {
      setTimeout(() => {
        if (!isHovering) {
          setShowControls(false);
        }
      }, 2000);
    } else {
      setShowControls(false);
    }
  };

  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await videoContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const skipBackward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = Math.max(0, currentTime - 5);
      playerRef.current.seekTo(newTime);
      setProgress(newTime);
      setPlayed(newTime / duration);
    }
  }, [duration]);

  const skipForward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = Math.min(duration, currentTime + 5);
      playerRef.current.seekTo(newTime);
      setProgress(newTime);
      setPlayed(newTime / duration);
    }
  }, [duration]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newProgress = clickPosition * duration;
    setProgress(newProgress);
    setPlayed(clickPosition);
    if (playerRef.current) {
      playerRef.current.seekTo(clickPosition);
    }
  };

  // Add keyboard shortcuts (only for allowed actions)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Don't trigger if typing in input

      switch (e.key) {
        case " ":
          e.preventDefault();
          onPlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    if (hasStarted) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [hasStarted, onPlayPause, duration, skipBackward, skipForward, toggleMute]);

  // Determine if we should show the center play button
  const showCenterPlayButton =
    !hasStarted || (!isPlaying && (isHovering || !hasStarted));

  return (
    <div className="h-full flex flex-col">
      {/* Security Warning Banner */}
      {securityWarning && (
        <div className="bg-red-900/80 border border-red-400 text-red-200 px-4 py-2 text-sm flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          {securityWarning}
          <button
            onClick={() => setSecurityWarning("")}
            className="ml-auto text-red-300 hover:text-red-100"
          >
            ×
          </button>
        </div>
      )}

      {/* Header - hide in fullscreen */}
      {!isFullscreen && (
        <div className="p-4 border-b border-green-400/30 flex items-center justify-between">
          <h3 className="text-green-400 font-semibold flex items-center">
            <Video className="w-4 h-4 mr-2" />
            {enhancedLesson?.title || `Lesson ${currentVideo + 1}`}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs text-green-400/70">
              <Shield className="w-3 h-3 mr-1" />
              Protected Content
            </div>
            {isMaximized && onRestore ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRestore}
                className="text-green-400 hover:bg-green-400/10"
                title="Restore to split view"
              >
                <Minimize2 className="w-4 h-4" />
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
      )}

      <div className={`flex-1 flex flex-col ${!isFullscreen ? "p-4" : ""}`}>
        <div
          ref={videoContainerRef}
          className={`${
            isFullscreen
              ? "fixed inset-0 z-50 bg-black"
              : "aspect-video border border-green-400/30 rounded-lg mb-4 flex-shrink-0"
          } bg-black overflow-hidden relative group cursor-pointer select-none`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleVideoClick}
          onContextMenu={handleContextMenu}
          style={
            {
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              WebkitTouchCallout: "none",
              KhtmlUserSelect: "none",
              pointerEvents: "auto",
            } as React.CSSProperties
          }
        >
          {hasVideoUrl ? (
            <>
              <ReactPlayer
                key={`${contentId}-${enhancedLesson.videoUrl}`} // Force reinitialize when content changes
                ref={playerRef}
                url={enhancedLesson.videoUrl}
                width="100%"
                height="100%"
                playing={isPlaying && isPlayerReady}
                volume={volume}
                muted={muted}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={handleVideoEnd}
                onReady={handleVideoReady}
                onStart={handleVideoStart}
                controls={false}
                disablePictureInPicture={true}
                config={{
                  file: {
                    attributes: {
                      crossOrigin: "anonymous",
                      controlsList: "nodownload noremoteplayback",
                      disablePictureInPicture: true,
                      preload: "none",
                      "data-setup": '{"fluid": true}',
                      onContextMenu: (e: Event) => e.preventDefault(),
                    },
                    forceVideo: true,
                  },
                  youtube: {
                    playerVars: {
                      showinfo: 0,
                      controls: 0,
                      modestbranding: 1,
                      rel: 0,
                      disablekb: 1,
                      fs: 0,
                    },
                  },
                  vimeo: {
                    playerOptions: {
                      byline: false,
                      portrait: false,
                      title: false,
                      pip: false,
                      download: false,
                    },
                  },
                }}
              />

              {/* Security Overlay - Invisible overlay to prevent direct video interaction */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "transparent",
                  zIndex: 1,
                }}
              />

              {/* Center Play/Pause Button */}
              {showCenterPlayButton && (
                <div
                  className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                  style={{ zIndex: 2 }}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick();
                    }}
                    size="lg"
                    className="bg-green-400 text-black hover:bg-green-300 w-20 h-20 rounded-full p-0 shadow-2xl transform hover:scale-110 transition-all duration-300"
                  >
                    {!hasStarted || !isPlaying ? (
                      <Play className="w-8 h-8 ml-1" />
                    ) : (
                      <Pause className="w-8 h-8" />
                    )}
                  </Button>
                  {!hasStarted && !isFullscreen && (
                    <div className="absolute top-full mt-4 text-center">
                      <p className="text-green-400 font-semibold text-lg">
                        Click to start video
                      </p>
                      <p className="text-green-400/70 text-sm mt-1">
                        {enhancedLesson?.duration || "Duration unknown"}
                      </p>
                      <p className="text-green-400/50 text-xs mt-2 flex items-center justify-center">
                        <Shield className="w-3 h-3 mr-1" />
                        This content is protected
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Controls Overlay */}
              {hasStarted && (
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2 transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ zIndex: 2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={onPlayPause}
                        size="sm"
                        className="bg-green-400 text-black hover:bg-green-300"
                        title="Play/Pause (Space)"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>

                      <div className="">
                        <Button
                          onClick={skipBackward}
                          variant="ghost"
                          className="text-green-400 hover:bg-green-400/20 !p-2"
                          title="Skip back 5 seconds (←)"
                        >
                          <ChevronsLeft className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={skipForward}
                          variant="ghost"
                          className="text-green-400 hover:bg-green-400/20 !p-2"
                          title="Skip forward 5 seconds (→)"
                        >
                          <ChevronsRight className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Show lesson title in fullscreen */}
                      {isFullscreen && (
                        <div className="text-green-400 font-semibold ml-4 flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          {enhancedLesson?.title ||
                            `Lesson ${currentVideo + 1}`}
                        </div>
                      )}
                    </div>

                    {/* Right side controls: Volume and Fullscreen */}
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={toggleMute}
                        variant="ghost"
                        size="sm"
                        className="text-green-400 hover:bg-green-400/20"
                      >
                        {muted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>

                      <div className="flex items-center space-x-2 w-20">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={volume}
                          onChange={(e) =>
                            setVolume(parseFloat(e.target.value))
                          }
                          className="w-full h-1 bg-green-400/30 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen();
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-green-400 hover:bg-green-400/20"
                        title={
                          isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                        }
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-2">
                    <div
                      className="relative group cursor-pointer py-2"
                      onClick={handleProgressClick}
                    >
                      <div className="h-1 bg-black/50 rounded-full relative overflow-hidden">
                        <div
                          className="h-full bg-green-400 rounded-full transition-all duration-150"
                          style={{ width: `${played * 100}%` }}
                        />
                        {/* Hover indicator */}
                        <div className="absolute inset-0 bg-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full" />
                      </div>
                      {/* Larger click area */}
                      <div className="absolute inset-0 -my-2" />
                    </div>
                    <div className="flex justify-between text-xs text-green-400 mt-1">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // No video URL available
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="w-8 h-8 text-green-400/60" />
                </div>
                <p className="text-green-400 font-semibold">
                  No video available
                </p>
                <p className="text-green-400/70 text-sm mt-1">
                  This lesson doesn't have a video yet
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation and Completion Controls - hide in fullscreen */}
        {!isFullscreen && (
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentVideo === 0 || isNavigatingPrev}
                className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                size="sm"
              >
                {isNavigatingPrev ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Previous"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onNext}
                disabled={currentVideo === totalLessons - 1 || isNavigatingNext}
                className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                size="sm"
              >
                {isNavigatingNext ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {/* Simplified completion button */}
              {isCompleted ? (
                <Button
                  disabled
                  className="bg-green-500/20 text-green-400 border-green-400/30 cursor-not-allowed"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (enhancedLesson) {
                      onMarkComplete(enhancedLesson._id);
                    }
                  }}
                  className="bg-green-400 text-black hover:bg-green-300"
                  size="sm"
                  disabled={!enhancedLesson}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
