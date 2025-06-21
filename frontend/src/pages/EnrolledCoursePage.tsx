import {
  AIPlayground,
  ContentSidebar,
  CourseHeader,
  CourseTabs,
  ErrorState,
  FullScreenContent,
  GameContent,
  LabContent,
  LoadingSpinner,
  SplitView,
  VideoPlayer,
} from "@/components/enrolled";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import {
  useCompleteContentMutation,
  useGetContentWithModuleAndProgressQuery,
  useGetModuleContentGroupedOptimizedQuery,
} from "@/features/api/apiSlice";
import { EnrolledCourse } from "@/lib/types";
import { Brain, Calculator, Target, Terminal } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

interface ContentItem {
  contentId: string;
  contentTitle: string;
  contentType: "video" | "lab" | "game" | "document";
  sectionTitle: string;
  duration?: number;
  isCompleted?: boolean;
}

interface ContentItemWithCompletion extends ContentItem {
  isCompleted: boolean;
}

interface GroupedContentResponse {
  success: boolean;
  message: string;
  data: {
    [key: string]: ContentItem[];
  };
}

const EnrolledCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Core states
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get("tab") || "details"
  );
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const [course, setCourse] = useState<EnrolledCourse | null>(null);

  // UI States
  const [contentSidebarOpen, setContentSidebarOpen] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(60);
  const [isResizing, setIsResizing] = useState(false);
  const [videoMaximized, setVideoMaximized] = useState(false);
  const [playgroundMaximized, setPlaygroundMaximized] = useState(false);
  const [playgroundMode, setPlaygroundMode] = useState("chat");
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Loading states
  const [isNavigating, setIsNavigating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const [isContentRendering, setIsContentRendering] = useState(false);

  // Track when completion was initiated to monitor related refetches
  const [completionInitiated, setCompletionInitiated] = useState(false);
  const [minimumLoadingTimer, setMinimumLoadingTimer] =
    useState<NodeJS.Timeout | null>(null);
  // Video progress tracking
  const [hasAutoCompleted, setHasAutoCompleted] = useState(false);

  // Video and playground states
  const [terminalHistory, setTerminalHistory] = useState([
    {
      type: "output",
      content: "Welcome to AI-Enhanced Cybersecurity Terminal",
    },
  ]);

  const {
    data: groupedContentData,
    isLoading: groupedContentLoading,
    isFetching: groupedContentFetching,
    error: groupedContentError,
  } = useGetModuleContentGroupedOptimizedQuery(courseId || "", {
    skip: !courseId,
  }) as {
    data: GroupedContentResponse | undefined;
    isLoading: boolean;
    isFetching: boolean;
    error: unknown;
  };

  const {
    data: currentContentData,
    isLoading: currentContentLoading,
    isFetching: currentContentFetching,
    error: currentContentError,
    refetch: refetchCurrentContent,
  } = useGetContentWithModuleAndProgressQuery(currentContentId || "", {
    skip: !currentContentId,
  });

  const [completeContent, { isLoading: isCompletingMutation }] =
    useCompleteContentMutation();

  // Create flat array of content items for navigation
  const allContentItems = useMemo<ContentItemWithCompletion[]>(() => {
    if (!groupedContentData?.success) return [];
    return Object.values(groupedContentData.data).flatMap((sectionItems) =>
      sectionItems.map((item) => ({
        ...item,
        isCompleted: item.isCompleted || false,
      }))
    );
  }, [groupedContentData]);

  // Navigation state
  const currentContentIndex = useMemo(() => {
    if (!currentContentId || !allContentItems.length) return 0;
    const index = allContentItems.findIndex(
      (item) => item.contentId === currentContentId
    );
    return index === -1 ? 0 : index;
  }, [currentContentId, allContentItems]);

  const navigationState = useMemo(() => {
    const hasPrevious = currentContentIndex > 0;
    const hasNext = currentContentIndex < allContentItems.length - 1;
    const previousContent = hasPrevious
      ? allContentItems[currentContentIndex - 1]
      : null;
    const nextContent = hasNext
      ? allContentItems[currentContentIndex + 1]
      : null;

    return {
      hasPrevious,
      hasNext,
      previousContent,
      nextContent,
      currentPosition: currentContentIndex + 1,
      totalContent: allContentItems.length,
    };
  }, [currentContentIndex, allContentItems]);

  // Build course data from APIs - optimize to prevent unnecessary updates
  const courseData = useMemo(() => {
    if (!groupedContentData?.success || !currentContentData?.success)
      return null;

    const moduleData = currentContentData.data.module;
    const sections = Object.entries(groupedContentData.data).map(
      ([sectionTitle, items], index) => ({
        _id: `section-${index}`,
        title: sectionTitle,
        lessons: items.map((item, itemIndex) => ({
          _id: `lesson-${index}-${itemIndex}`,
          contentId: item.contentId,
          title: item.contentTitle,
          duration: item.duration ? `${item.duration}:00` : "15:00",
          type:
            item.contentType === "document"
              ? ("text" as const)
              : (item.contentType as "video" | "lab" | "game" | "quiz"),
          completed: item.isCompleted || false,
          description: `Learn about ${item.contentTitle}`,
          videoUrl: undefined,
          content: undefined,
        })),
      })
    );

    return {
      title: moduleData.title,
      description: moduleData.description,
      icon: moduleData.icon || "🔒",
      color: `text-${moduleData.color || "green"}-400`,
      bgColor: `bg-${moduleData.color || "green"}-400/10`,
      borderColor: `border-${moduleData.color || "green"}-400/30`,
      totalLessons: allContentItems.length,
      completedLessons: allContentItems.filter((item) => item.isCompleted)
        .length,
      progress: Math.round(
        (allContentItems.filter((item) => item.isCompleted).length /
          allContentItems.length) *
          100
      ),
      sections,
      labs: [],
      games: [],
      resources: [],
      playground: {
        title: "AI Playground",
        description: "Interactive learning environment",
        tools: [],
        available: true,
      },
    } as EnrolledCourse;
  }, [groupedContentData, currentContentData, allContentItems]);

  // Unified loading state management - ONLY ONE loading state at a time
  const isInitialLoading = groupedContentLoading && !groupedContentData;
  const isContentLoading = currentContentLoading && !currentContentData;
  const isUserAction = isNavigating || isCompleting || isAutoCompleting;

  // Single loading priority: Initial > User Action > Content > Rendering
  const currentLoadingState = isInitialLoading
    ? "initial"
    : isUserAction
    ? "navigation"
    : isContentLoading
    ? "content"
    : isContentRendering
    ? "rendering"
    : "none";

  const showMainLoading = currentLoadingState === "initial";
  const showActionLoading = currentLoadingState === "navigation";
  const isAnyLoading = currentLoadingState !== "none";

  // Empty state management - check if we have successful response but no content
  const hasNoContent =
    groupedContentData?.success && allContentItems.length === 0;
  const hasContentError =
    groupedContentError || (groupedContentData && !groupedContentData.success);
  const showEmptyState = hasNoContent && !isAnyLoading;
  const showErrorState = hasContentError && !isAnyLoading;

  // Enhanced loading state management with minimum duration and proper tracking
  useEffect(() => {
    // Don't clear loading if we're still rendering content
    if (isContentRendering) return;

    // For completion operations: ensure loading persists long enough and all operations complete
    if ((isCompleting || isAutoCompleting) && completionInitiated) {
      // Keep loading active while:
      // 1. The mutation is still running OR
      // 2. Related queries are fetching OR
      // 3. Minimum loading time hasn't elapsed
      if (
        isCompletingMutation ||
        groupedContentFetching ||
        currentContentFetching ||
        minimumLoadingTimer
      ) {
        return;
      }

      // All operations complete - clear completion loading
      const timeoutId = setTimeout(() => {
        setIsCompleting(false);
        setIsAutoCompleting(false);
        setCompletionInitiated(false);
      }, 100);
      return () => clearTimeout(timeoutId);
    }

    // For navigation: wait for content to load and be ready
    if (isNavigating && !currentContentLoading && courseData) {
      const timeoutId = setTimeout(() => {
        setIsNavigating(false);
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [
    currentContentLoading,
    currentContentFetching,
    groupedContentFetching,
    isCompletingMutation,
    courseData,
    isContentRendering,
    isNavigating,
    isCompleting,
    isAutoCompleting,
    completionInitiated,
    minimumLoadingTimer,
  ]);

  // Update course state only when courseData changes
  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
    }
  }, [courseData]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (minimumLoadingTimer) {
        clearTimeout(minimumLoadingTimer);
      }
    };
  }, [minimumLoadingTimer]);

  // Track content rendering state - only when content actually changes and not during navigation
  useEffect(() => {
    if (
      currentContentData?.success &&
      courseData &&
      !isNavigating &&
      !isCompleting
    ) {
      // Small delay to prevent flickering during rapid navigation
      const timeoutId = setTimeout(() => {
        setIsContentRendering(true);

        // Quick render cycle
        const frameId = requestAnimationFrame(() => {
          setIsContentRendering(false);
        });

        return () => cancelAnimationFrame(frameId);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [
    currentContentData?.data?.content?._id,
    courseData,
    isNavigating,
    isCompleting,
    currentContentData?.success,
  ]);

  // Initialize current content ID from URL only on mount
  useEffect(() => {
    const contentIdFromUrl = searchParams.get("contentId");
    const contentIndexFromUrl = searchParams.get("content");

    if (!currentContentId && allContentItems.length > 0) {
      if (contentIdFromUrl) {
        setCurrentContentId(contentIdFromUrl);
      } else if (contentIndexFromUrl) {
        const index = parseInt(contentIndexFromUrl, 10);
        if (!isNaN(index) && index >= 0 && index < allContentItems.length) {
          setCurrentContentId(allContentItems[index].contentId);
        } else {
          setCurrentContentId(allContentItems[0].contentId);
        }
      } else {
        setCurrentContentId(allContentItems[0].contentId);
      }
    }
  }, [searchParams, allContentItems, currentContentId]);

  // Navigation handlers
  const nextLesson = useCallback(() => {
    if (!allContentItems.length || isNavigating || isContentRendering) return;
    const targetIndex = currentContentIndex + 1;
    if (targetIndex < allContentItems.length) {
      setIsNavigating(true);
      // Don't set isContentRendering here - let the useEffect handle it
      const nextContentId = allContentItems[targetIndex].contentId;
      setCurrentContentId(nextContentId);
      const params = new URLSearchParams(searchParams);
      params.set("contentId", nextContentId);
      params.set("content", targetIndex.toString());
      setSearchParams(params, { replace: true });
    }
  }, [
    allContentItems,
    currentContentIndex,
    isNavigating,
    isContentRendering,
    searchParams,
    setSearchParams,
  ]);

  const prevLesson = useCallback(() => {
    if (!allContentItems.length || isNavigating || isContentRendering) return;
    const targetIndex = currentContentIndex - 1;
    if (targetIndex >= 0) {
      setIsNavigating(true);
      // Don't set isContentRendering here - let the useEffect handle it
      const prevContentId = allContentItems[targetIndex].contentId;
      setCurrentContentId(prevContentId);
      const params = new URLSearchParams(searchParams);
      params.set("contentId", prevContentId);
      if (targetIndex > 0) {
        params.set("content", targetIndex.toString());
      }
      setSearchParams(params, { replace: true });
    }
  }, [
    allContentItems,
    currentContentIndex,
    isNavigating,
    isContentRendering,
    searchParams,
    setSearchParams,
  ]);

  const navigateToContentById = useCallback(
    (contentId: string) => {
      if (
        !allContentItems.length ||
        contentId === currentContentId ||
        isNavigating ||
        isContentRendering
      )
        return;
      const targetIndex = allContentItems.findIndex(
        (item) => item.contentId === contentId
      );
      if (targetIndex === -1) return;

      setIsNavigating(true);
      // Don't set isContentRendering here - let the useEffect handle it
      setCurrentContentId(contentId);
      const params = new URLSearchParams(searchParams);
      params.set("contentId", contentId);
      if (targetIndex > 0) {
        params.set("content", targetIndex.toString());
      }
      setSearchParams(params, { replace: true });
    },
    [
      allContentItems,
      currentContentId,
      isNavigating,
      isContentRendering,
      searchParams,
      setSearchParams,
    ]
  );

  const handleLessonSelect = useCallback(
    (lessonIndex: number) => {
      if (!allContentItems.length) return;
      if (lessonIndex >= 0 && lessonIndex < allContentItems.length) {
        navigateToContentById(allContentItems[lessonIndex].contentId);
        setContentSidebarOpen(false);
      }
    },
    [allContentItems, navigateToContentById]
  );

  // Video progress and completion
  const handleVideoProgress = useCallback(
    async (progressPercentage: number) => {
      if (
        currentContentData?.success &&
        currentContentData.data.content.type === "video" &&
        progressPercentage >= 90 &&
        !hasAutoCompleted &&
        !isAutoCompleting &&
        currentContentData.data.progress.status !== "completed"
      ) {
        setIsAutoCompleting(true);
        setCompletionInitiated(true);
        setHasAutoCompleted(true);

        // Set minimum loading duration for auto-completion too
        const timer = setTimeout(() => {
          setMinimumLoadingTimer(null);
        }, 1000);
        setMinimumLoadingTimer(timer);

        try {
          await completeContent({ contentId: currentContentId! }).unwrap();
          await refetchCurrentContent();
        } catch (error) {
          console.error("Auto-completion failed:", error);
          setHasAutoCompleted(false);
          if (timer) clearTimeout(timer);
          setMinimumLoadingTimer(null);
          setIsAutoCompleting(false);
          setCompletionInitiated(false);
        }
        // Note: Don't clear isAutoCompleting here - let the useEffect handle it after all operations complete
      }
    },
    [
      currentContentData,
      hasAutoCompleted,
      isAutoCompleting,
      completeContent,
      currentContentId,
      refetchCurrentContent,
    ]
  );

  const markLessonComplete = useCallback(async () => {
    if (!currentContentId || isCompleting || isContentRendering) return;
    setIsCompleting(true);
    setCompletionInitiated(true);

    // Set minimum loading duration (1.5 seconds) to ensure user sees the feedback
    const timer = setTimeout(() => {
      setMinimumLoadingTimer(null);
    }, 1500);
    setMinimumLoadingTimer(timer);

    try {
      // Complete content - this will trigger cache invalidation and automatic refetches

      await completeContent({ contentId: currentContentId }).unwrap();

      // Manual refetch is still needed to ensure immediate update
      await refetchCurrentContent();
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
      // On error, clear loading states immediately
      if (timer) clearTimeout(timer);
      setMinimumLoadingTimer(null);
      setIsCompleting(false);
      setCompletionInitiated(false);
    }
    // Note: Don't clear isCompleting here - let the useEffect handle it after all operations complete
  }, [
    currentContentId,
    completeContent,
    refetchCurrentContent,
    isCompleting,
    isContentRendering,
  ]);

  // Get current lesson
  const getCurrentLesson = useCallback(() => {
    if (!currentContentData?.success || !course) return undefined;
    const contentData = currentContentData.data.content;
    for (const section of course.sections) {
      const lesson = section.lessons.find(
        (l) => l.contentId === currentContentId
      );
      if (lesson) {
        return {
          ...lesson,
          title: contentData.title,
          description: contentData.description || "",
          type:
            contentData.type === "document"
              ? ("text" as const)
              : (contentData.type as "video" | "lab" | "game" | "quiz"),
          videoUrl: contentData.url,
          content: contentData.instructions,
          completed: currentContentData.data.progress.status === "completed",
          resources: contentData.resources || [],
        };
      }
    }
    return undefined;
  }, [currentContentData, course, currentContentId]);

  // Video security
  useEffect(() => {
    if (isPlaying) {
      document.body.classList.add("video-security-active");
      const style = document.createElement("style");
      style.id = "video-security-styles";
      style.textContent = `
        .video-security-active {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          user-select: none !important;
        }
        .video-security-active video {
          -webkit-user-drag: none !important;
          pointer-events: none !important;
        }
        @media print {
          .video-security-active { display: none !important; }
        }
      `;
      if (!document.getElementById("video-security-styles")) {
        document.head.appendChild(style);
      }
    } else {
      document.body.classList.remove("video-security-active");
      const existingStyle = document.getElementById("video-security-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    }
    return () => {
      document.body.classList.remove("video-security-active");
      const existingStyle = document.getElementById("video-security-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isPlaying]);

  // Reset states on content change
  useEffect(() => {
    if (currentContentId) {
      setHasAutoCompleted(false);
      setIsPlaying(false);
      setVideoMaximized(false);
      setPlaygroundMaximized(false);
      // Content rendering state will be managed by the content tracking useEffect
    }
  }, [currentContentId]);

  // Handle video maximize/minimize
  const handleVideoMaximize = useCallback(() => {
    setVideoMaximized(true);
    setPlaygroundMaximized(false);
  }, []);

  const handleVideoRestore = useCallback(() => {
    setVideoMaximized(false);
    setPlaygroundMaximized(false);
  }, []);

  // Handle playground maximize/minimize
  const handlePlaygroundMaximize = useCallback(() => {
    setPlaygroundMaximized(true);
    setVideoMaximized(false);
  }, []);

  const handlePlaygroundRestore = useCallback(() => {
    setPlaygroundMaximized(false);
    setVideoMaximized(false);
  }, []);

  // Handle video play/pause
  const handleVideoPlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handle terminal command
  const handleTerminalCommand = useCallback((command: string) => {
    setTerminalHistory((prev) => [
      ...prev,
      { type: "command", content: `user@terminal:~$ ${command}` },
    ]);

    setTimeout(() => {
      let response = "";
      const cmd = command.toLowerCase();

      if (cmd.includes("help")) {
        response =
          "Available commands: nmap, wireshark, metasploit, john, hashcat";
      } else if (cmd.includes("nmap")) {
        response = "Starting Nmap scan...\nHost is up (0.001s latency)";
      } else {
        response = `Command '${command}' executed in simulated environment.`;
      }

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", content: response },
      ]);
    }, 1000);
  }, []);

  // Get playground modes based on content
  const getPlaygroundModes = useCallback(() => {
    const currentLesson = getCurrentLesson();
    const lessonTitle = currentLesson?.title?.toLowerCase() || "";

    const modes = [
      {
        _id: "terminal",
        name: "Terminal",
        icon: Terminal,
        description: "AI-enhanced terminal for cybersecurity commands",
      },
      {
        _id: "chat",
        name: "AI Assistant",
        icon: Brain,
        description: "Chat with AI learning assistant",
      },
    ];

    if (lessonTitle.includes("threat")) {
      modes.push({
        _id: "threat-intel",
        name: "Threat Intel",
        icon: Target,
        description: "Threat intelligence analysis",
      });
    }

    if (lessonTitle.includes("cia") || lessonTitle.includes("triad")) {
      modes.push({
        _id: "risk-calc",
        name: "Risk Calculator",
        icon: Calculator,
        description: "Risk assessment tools",
      });
    }

    return modes;
  }, [getCurrentLesson]);

  // This check is now handled by the hierarchical loading states above

  // Empty state - show when content is successfully loaded but empty
  if (showEmptyState) {
    return (
      <ErrorState
        title="No Content Available"
        message="This module doesn't have any content yet. Please check back later or contact your instructor."
        buttonText="Back to Overview"
        onButtonClick={() => navigate("/overview")}
      />
    );
  }

  // Error state - show for actual API errors or failed responses
  if (showErrorState || currentContentError) {
    return (
      <ErrorState
        title="Course Not Found"
        message="The requested course could not be found or failed to load."
        buttonText="Back to Overview"
        onButtonClick={() => navigate("/overview")}
      />
    );
  }

  // Show ONLY ONE loading state at a time
  if (showMainLoading) {
    return <LoadingSpinner message="Loading course content..." />;
  }

  // Don't render course content until we have basic data
  if (!course && !showEmptyState && !showErrorState) {
    return <LoadingSpinner message="Preparing course..." />;
  }

  // If we reach here but still don't have course data, something is wrong
  if (!course) {
    return (
      <ErrorState
        title="Course Data Missing"
        message="Unable to load course information."
        buttonText="Back to Overview"
        onButtonClick={() => navigate("/overview")}
      />
    );
  }

  const currentLesson = getCurrentLesson();

  const needsPlayground =
    currentLesson?.type === "video" || currentLesson?.type === "text";
  const needsFullScreen =
    currentLesson?.type === "text" ||
    currentLesson?.type === "lab" ||
    currentLesson?.type === "game";

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <div className="pb-5 pt-3 px-2 sm:px-4 lg:px-6">
        <div className="w-full px-1 sm:px-2 mx-auto">
          <CourseHeader
            course={course}
            currentVideo={currentContentIndex}
            totalLessons={course.totalLessons}
            onNavigateBack={() => navigate(`/course/${courseId}`)}
            onOpenContentSidebar={() => setContentSidebarOpen(true)}
          />

          {/* Main Content Area */}
          {activeLab ? (
            <LabContent
              course={course}
              activeLab={activeLab}
              onOpenInNewTab={(labId) => {
                console.log("labId", labId);
                return window.open(
                  `/learn/${courseId}/lab/${labId
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                  "_blank"
                );
              }}
              onClose={() => setActiveLab(null)}
            />
          ) : activeGame ? (
            <GameContent
              course={course}
              activeGame={activeGame}
              onOpenInNewTab={(gameId) => {
                console.log("gameId", gameId);
                return window.open(
                  `/learn/${courseId}/game/${gameId
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                  "_blank"
                );
              }}
              onClose={() => setActiveGame(null)}
            />
          ) : needsFullScreen && currentLesson ? (
            <FullScreenContent
              lesson={currentLesson}
              currentIndex={currentContentIndex}
              totalCount={course.totalLessons}
              isCompleted={
                currentContentData?.data.progress.status === "completed"
              }
              onPrevious={prevLesson}
              onNext={nextLesson}
              onMarkComplete={() => markLessonComplete()}
              onOpenInNewTab={
                currentLesson.type === "lab"
                  ? () =>
                      window.open(
                        `/learn/${courseId}/lab/${currentLesson.contentId}`,
                        "_blank"
                      )
                  : currentLesson.type === "game"
                  ? () =>
                      window.open(
                        `/learn/${courseId}/game/${currentLesson.contentId}`,
                        "_blank"
                      )
                  : undefined
              }
              canGoBack={navigationState.hasPrevious}
              canGoForward={navigationState.hasNext}
              isNavigatingNext={isNavigating}
              isNavigatingPrev={isNavigating}
              isCompleting={isCompleting}
            />
          ) : needsPlayground && currentLesson ? (
            <SplitView
              leftPaneWidth={leftPaneWidth}
              onLeftPaneWidthChange={setLeftPaneWidth}
              isResizing={isResizing}
              onResizeStart={() => setIsResizing(true)}
              onResizeEnd={() => setIsResizing(false)}
              videoMaximized={videoMaximized}
              playgroundMaximized={playgroundMaximized}
              leftPane={
                <VideoPlayer
                  key={`video-${currentContentId}-${currentContentIndex}`}
                  lesson={currentLesson}
                  isPlaying={isPlaying}
                  currentVideo={currentContentIndex}
                  totalLessons={course.totalLessons}
                  isCompleted={
                    currentContentData?.data.progress.status === "completed"
                  }
                  onPlayPause={handleVideoPlayPause}
                  onPrevious={prevLesson}
                  onNext={nextLesson}
                  onMarkComplete={markLessonComplete}
                  onMaximize={handleVideoMaximize}
                  onRestore={handleVideoRestore}
                  onVideoProgress={handleVideoProgress}
                  isNavigatingNext={isNavigating}
                  isNavigatingPrev={isNavigating}
                  isMaximized={videoMaximized}
                  isCompleting={isCompleting}
                />
              }
              rightPane={
                <AIPlayground
                  playgroundModes={getPlaygroundModes()}
                  activeMode={playgroundMode}
                  terminalHistory={terminalHistory}
                  chatMessages={[
                    {
                      role: "ai",
                      content: "Hello! I'm your AI learning assistant.",
                    },
                  ]}
                  analysisResult=""
                  isAnalyzing={false}
                  isMaximized={playgroundMaximized}
                  onModeChange={setPlaygroundMode}
                  onTerminalCommand={handleTerminalCommand}
                  onChatMessage={(msg) => {
                    console.log("Chat message:", msg);
                  }}
                  onAnalysis={(input) => {
                    console.log("Analysis input:", input);
                  }}
                  onMaximize={handlePlaygroundMaximize}
                  onRestore={handlePlaygroundRestore}
                />
              }
            />
          ) : (
            <div className="text-center text-green-400 font-mono p-4 sm:p-8">
              <div className="mb-4 text-sm sm:text-base">
                No content available
              </div>
              <div className="text-xs sm:text-sm text-green-400/60">
                This lesson type is not yet supported.
              </div>
            </div>
          )}

          {/* Course Tabs */}
          <CourseTabs
            course={course}
            activeTab={activeTab}
            activeLab={activeLab}
            activeGame={activeGame}
            currentLesson={currentLesson}
            onTabChange={setActiveTab}
            onLabSelect={setActiveLab}
            onGameSelect={setActiveGame}
          />
        </div>
      </div>

      {/* Content Sidebar */}
      <ContentSidebar
        course={{
          title: currentContentData?.data.module.title || "",
          description: currentContentData?.data.module.description || "",
          icon: currentContentData?.data.module.icon || "🔒",
          color: `text-${currentContentData?.data.module.color || "green"}-400`,
          bgColor: `bg-${
            currentContentData?.data.module.color || "green"
          }-400/10`,
          borderColor: `border-${
            currentContentData?.data.module.color || "green"
          }-400/30`,
          totalLessons: allContentItems.length,
          completedLessons: allContentItems.filter((item) => item.isCompleted)
            .length,
          progress: Math.round(
            (allContentItems.filter((item) => item.isCompleted).length /
              allContentItems.length) *
              100
          ),
          sections: Object.entries(groupedContentData?.data || {}).map(
            ([sectionTitle, items], index) => ({
              _id: `section-${index}`,
              title: sectionTitle,
              lessons: items.map((item) => ({
                _id: item.contentId,
                contentId: item.contentId,
                title: item.contentTitle,
                duration: item.duration ? `${item.duration}:00` : "15:00",
                type:
                  item.contentType === "document" ? "text" : item.contentType,
                completed: item.isCompleted || false,
                description: `Learn about ${item.contentTitle}`,
                videoUrl: undefined,
                content: undefined,
              })),
            })
          ),
          labs: [],
          games: [],
          resources: [],
          playground: {
            title: "AI Playground",
            description: "Interactive learning environment",
            tools: [],
            available: true,
          },
        }}
        currentVideo={currentContentIndex}
        isOpen={contentSidebarOpen}
        onClose={() => setContentSidebarOpen(false)}
        onLessonSelect={handleLessonSelect}
      />

      {/* Single loading overlay - only show for navigation actions */}
      <LoadingOverlay
        isLoading={showActionLoading}
        message="Loading content..."
      />
    </div>
  );
};

export default EnrolledCoursePage;
