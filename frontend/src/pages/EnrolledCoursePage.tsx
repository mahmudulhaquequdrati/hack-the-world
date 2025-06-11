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
import {
  ChatMessage,
  EnrolledCourse,
  PlaygroundMode,
  TerminalMessage,
} from "@/lib/types";
import { Brain, Calculator, Target, Terminal } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const EnrolledCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  // const { user } = useAuthRTK(); // Not used in 2-API system

  // Simple state - only what we need for 2-API system
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "details";
  });
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);
  const [course, setCourse] = useState<EnrolledCourse | null>(null);

  // UI States
  const [contentSidebarOpen, setContentSidebarOpen] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(60);
  const [isResizing, setIsResizing] = useState(false);
  const [videoMaximized, setVideoMaximized] = useState(false);
  const [playgroundMaximized, setPlaygroundMaximized] = useState(false);
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // T036: Enhanced Loading states
  const [isNavigating, setIsNavigating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);

  // T035: Video progress tracking for auto-completion
  const [videoProgress, setVideoProgress] = useState(0);
  const [hasAutoCompleted, setHasAutoCompleted] = useState(false);

  // AI Playground State
  const [playgroundMode, setPlaygroundMode] =
    useState<PlaygroundMode["id"]>("terminal");
  const [terminalHistory, setTerminalHistory] = useState<TerminalMessage[]>([
    {
      type: "output",
      content: "Welcome to AI-Enhanced Cybersecurity Terminal",
    },
  ]);
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content: "Hello! I'm your AI learning assistant.",
    },
  ]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // API 1: Get grouped content structure (called once on page load)
  const {
    data: groupedContentData,
    isLoading: groupedContentLoading,
    error: groupedContentError,
  } = useGetModuleContentGroupedOptimizedQuery(courseId || "", {
    skip: !courseId,
  });

  // API 2: Get current content with module and progress (called when content changes)
  const {
    data: currentContentData,
    isLoading: currentContentLoading,
    error: currentContentError,
    refetch: refetchCurrentContent,
  } = useGetContentWithModuleAndProgressQuery(currentContentId || "", {
    skip: !currentContentId,
  });

  // Complete content mutation
  const [completeContent] = useCompleteContentMutation();

  // T034: Create flat array of all content items from grouped data for smart navigation
  const allContentItems = useMemo(() => {
    if (!groupedContentData?.success) return [];

    const items: Array<{
      contentId: string;
      contentTitle: string;
      contentType: "video" | "lab" | "game" | "document";
      sectionTitle: string;
      duration?: number;
    }> = [];

    Object.values(groupedContentData.data).forEach((sectionItems) => {
      items.push(...sectionItems);
    });

    return items;
  }, [groupedContentData]);

  // T034: Smart navigation - Get current content index and navigation state
  const currentContentIndex = useMemo(() => {
    if (!currentContentId || !allContentItems.length) return 0;
    const index = allContentItems.findIndex(
      (item) => item.contentId === currentContentId
    );
    // If content not found, return 0 (first item)
    return index === -1 ? 0 : index;
  }, [currentContentId, allContentItems]);

  // T034: Smart navigation helpers
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

  // Build course data from APIs
  useEffect(() => {
    if (groupedContentData?.success && currentContentData?.success) {
      const moduleData = currentContentData.data.module;

      // Transform grouped data into course sections
      const sections = Object.entries(groupedContentData.data).map(
        ([sectionTitle, items], index) => ({
          id: `section-${index}`,
          title: sectionTitle,
          lessons: items.map((item, itemIndex) => ({
            id: `lesson-${index}-${itemIndex}`,
            contentId: item.contentId,
            title: item.contentTitle,
            duration: item.duration ? `${item.duration}:00` : "15:00",
            type:
              item.contentType === "document"
                ? ("text" as const)
                : item.contentType,
            completed: false, // Will be determined from currentContentData
            description: `Learn about ${item.contentTitle}`,
            videoUrl: undefined,
            content: undefined,
          })),
        })
      );

      const totalLessons = allContentItems.length;

      const enrolledCourse: EnrolledCourse = {
        title: moduleData.title,
        description: moduleData.description,
        icon: moduleData.icon || "🔒",
        color: moduleData.color || "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/30",
        totalLessons,
        completedLessons: 0, // Will be calculated separately if needed
        progress: 0, // Will be calculated separately if needed
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
      };

      setCourse(enrolledCourse);
    }
  }, [groupedContentData, currentContentData, allContentItems]);

  // Initialize current content ID from URL or use first content
  useEffect(() => {
    const contentIdFromUrl = searchParams.get("contentId");
    const contentIndexFromUrl = searchParams.get("content");

    if (contentIdFromUrl) {
      setCurrentContentId(contentIdFromUrl);
    } else if (contentIndexFromUrl && allContentItems.length > 0) {
      const index = parseInt(contentIndexFromUrl, 10);
      if (!isNaN(index) && index >= 0 && index < allContentItems.length) {
        setCurrentContentId(allContentItems[index].contentId);
      } else {
        // Default to first content
        setCurrentContentId(allContentItems[0]?.contentId || null);
      }
    } else if (allContentItems.length > 0 && !currentContentId) {
      // Default to first content
      setCurrentContentId(allContentItems[0].contentId);
    }
  }, [searchParams, allContentItems, currentContentId]);

  // Update URL when content changes (debounced to prevent rapid updates)
  useEffect(() => {
    if (currentContentId && currentContentIndex >= 0) {
      const timeoutId = setTimeout(() => {
        const params = new URLSearchParams();

        if (currentContentIndex > 0) {
          params.set("content", currentContentIndex.toString());
        }
        params.set("contentId", currentContentId);
        if (activeTab !== "details") {
          params.set("tab", activeTab);
        }

        setSearchParams(params, { replace: true });
      }, 150); // 150ms debounce to prevent rapid URL updates

      return () => clearTimeout(timeoutId);
    }
  }, [currentContentId, currentContentIndex, activeTab, setSearchParams]);

  // Simple navigation with loading states
  const nextLesson = useCallback(() => {
    if (!allContentItems.length || isNavigating) return;

    const targetIndex = currentContentIndex + 1;
    if (targetIndex < allContentItems.length) {
      const targetContent = allContentItems[targetIndex];

      // Set loading state before navigation
      setIsNavigating(true);

      // Update URL params - this will trigger content refetch
      const params = new URLSearchParams();
      params.set("contentId", targetContent.contentId);
      if (targetIndex > 0) {
        params.set("content", targetIndex.toString());
      }
      if (activeTab !== "details") {
        params.set("tab", activeTab);
      }

      setSearchParams(params, { replace: true });
    }
  }, [
    allContentItems,
    currentContentIndex,
    setSearchParams,
    activeTab,
    isNavigating,
  ]);

  const prevLesson = useCallback(() => {
    if (!allContentItems.length || isNavigating) return;

    const targetIndex = currentContentIndex - 1;
    if (targetIndex >= 0) {
      const targetContent = allContentItems[targetIndex];

      // Set loading state before navigation
      setIsNavigating(true);

      // Update URL params - this will trigger content refetch
      const params = new URLSearchParams();
      params.set("contentId", targetContent.contentId);
      if (targetIndex > 0) {
        params.set("content", targetIndex.toString());
      }
      if (activeTab !== "details") {
        params.set("tab", activeTab);
      }

      setSearchParams(params, { replace: true });
    }
  }, [
    allContentItems,
    currentContentIndex,
    setSearchParams,
    activeTab,
    isNavigating,
  ]);

  // Navigate to specific content by ID - simple URL update
  const navigateToContentById = useCallback(
    (contentId: string) => {
      if (!allContentItems.length || contentId === currentContentId) return;

      const targetIndex = allContentItems.findIndex(
        (item) => item.contentId === contentId
      );
      if (targetIndex === -1) return;

      // Simply update URL params - this will trigger content refetch
      const params = new URLSearchParams();
      params.set("contentId", contentId);
      if (targetIndex > 0) {
        params.set("content", targetIndex.toString());
      }
      if (activeTab !== "details") {
        params.set("tab", activeTab);
      }

      setSearchParams(params, { replace: true });
    },
    [allContentItems, currentContentId, activeTab, setSearchParams]
  );

  // Handle lesson selection from sidebar - using smart navigation
  const handleLessonSelect = useCallback(
    (lessonIndex: number) => {
      if (!allContentItems.length) return;

      if (lessonIndex >= 0 && lessonIndex < allContentItems.length) {
        const selectedContent = allContentItems[lessonIndex];
        navigateToContentById(selectedContent.contentId);
        setContentSidebarOpen(false);
      }
    },
    [allContentItems, navigateToContentById]
  );

  // T035: Video progress handler for auto-completion
  const handleVideoProgress = useCallback(
    async (progressPercentage: number) => {
      setVideoProgress(progressPercentage);

      // Auto-complete video at 90% watched
      if (
        currentContentData?.success &&
        currentContentData.data.content.type === "video" &&
        progressPercentage >= 90 &&
        !hasAutoCompleted &&
        !isAutoCompleting &&
        currentContentData.data.progress.status !== "completed"
      ) {
        setIsAutoCompleting(true);
        setHasAutoCompleted(true);

        try {
          await completeContent({ contentId: currentContentId! }).unwrap();
          await refetchCurrentContent();
        } catch (error) {
          console.error("Auto-completion failed:", error);
          setHasAutoCompleted(false); // Allow retry
        } finally {
          setIsAutoCompleting(false);
        }
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

  // Mark lesson as completed
  const markLessonComplete = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_lessonId: string) => {
      if (!currentContentId || isCompleting) return;

      setIsCompleting(true);

      try {
        await completeContent({ contentId: currentContentId }).unwrap();
        // Refetch current content to get updated progress
        await refetchCurrentContent();
      } catch (error) {
        console.error("Failed to mark lesson complete:", error);
      } finally {
        setIsCompleting(false);
      }
    },
    [currentContentId, completeContent, refetchCurrentContent, isCompleting]
  );

  // Get current lesson from current content data
  const getCurrentLesson = useCallback(() => {
    if (!currentContentData?.success || !course) return undefined;

    const contentData = currentContentData.data.content;

    // Find the lesson in course sections that matches current content
    for (const section of course.sections) {
      const lesson = section.lessons.find(
        (l) => l.contentId === currentContentId
      );
      if (lesson) {
        return {
          ...lesson,
          // Update with real data from API
          title: contentData.title,
          description: contentData.description || "",
          type:
            contentData.type === "document"
              ? ("text" as const)
              : contentData.type,
          videoUrl: contentData.url,
          content: contentData.instructions,
        };
      }
    }

    return undefined;
  }, [currentContentData, course, currentContentId]);

  // Get completion status from current content data
  const isCurrentContentCompleted = useMemo(() => {
    return Boolean(
      currentContentData?.success &&
        currentContentData.data.progress.status === "completed"
    );
  }, [currentContentData]);

  // Dynamic playground modes
  const getDynamicPlaygroundModes = useCallback((): PlaygroundMode[] => {
    const currentLesson = getCurrentLesson();
    const lessonTitle = currentLesson?.title?.toLowerCase() || "";

    const baseModes: PlaygroundMode[] = [
      {
        id: "terminal",
        name: "Terminal",
        icon: Terminal,
        description: "AI-enhanced terminal for cybersecurity commands",
      },
      {
        id: "chat",
        name: "AI Assistant",
        icon: Brain,
        description: "Chat with AI learning assistant",
      },
    ];

    const additionalModes: PlaygroundMode[] = [];

    if (lessonTitle.includes("threat")) {
      additionalModes.push({
        id: "threat-intel",
        name: "Threat Intel",
        icon: Target,
        description: "Threat intelligence analysis",
      });
    }

    if (lessonTitle.includes("cia") || lessonTitle.includes("triad")) {
      additionalModes.push({
        id: "risk-calc",
        name: "Risk Calculator",
        icon: Calculator,
        description: "Risk assessment tools",
      });
    }

    return [...baseModes, ...additionalModes];
  }, [getCurrentLesson]);

  // AI playground handlers
  const handleTerminalCommand = (command: string) => {
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
  };

  const handleAiChat = (message: string) => {
    setAiChatMessages((prev) => [...prev, { role: "user", content: message }]);

    setTimeout(() => {
      setAiChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "That's a great question! Let me help you understand...",
        },
      ]);
    }, 1500);
  };

  const handleAnalysis = (input: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(`Analysis complete for: "${input}"\n\nKey findings...`);
      setIsAnalyzing(false);
    }, 2000);
  };

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

  // Handle browser navigation
  useEffect(() => {
    const contentParam = searchParams.get("content");
    const contentIdParam = searchParams.get("contentId");
    const tabParam = searchParams.get("tab");

    if (contentIdParam && contentIdParam !== currentContentId) {
      setCurrentContentId(contentIdParam);
    } else if (contentParam && allContentItems.length > 0) {
      const index = parseInt(contentParam, 10);
      if (!isNaN(index) && index >= 0 && index < allContentItems.length) {
        const targetContentId = allContentItems[index].contentId;
        if (targetContentId !== currentContentId) {
          setCurrentContentId(targetContentId);
        }
      }
    }

    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    } else if (!tabParam && activeTab !== "details") {
      setActiveTab("details");
    }
  }, [searchParams, allContentItems, currentContentId, activeTab]);

  // Create progress data for sidebar from current content (moved before early returns)
  const progressData = useMemo(() => {
    if (!currentContentData?.success) return {};

    return {
      [currentContentId!]: {
        status: currentContentData.data.progress.status,
        progressPercentage: currentContentData.data.progress.progressPercentage,
      },
    };
  }, [currentContentData, currentContentId]);

  // Create completed lessons array for sidebar (moved before early returns)
  const completedLessons = useMemo(() => {
    if (!isCurrentContentCompleted) return [];
    const currentLesson = getCurrentLesson();
    if (!currentLesson) return [];
    return [currentLesson.id];
  }, [isCurrentContentCompleted, getCurrentLesson]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 100);
  }, []);

  // Reset video progress when content changes
  useEffect(() => {
    if (currentContentId) {
      setVideoProgress(0);
      setHasAutoCompleted(false);
      setIsPlaying(false); // Reset playing state for new content
    }
  }, [currentContentId]);

  // Clear navigation loading state when content has loaded
  useEffect(() => {
    if (!currentContentLoading && isNavigating) {
      setIsNavigating(false);
    }
  }, [currentContentLoading, isNavigating]);

  // Loading state
  if (groupedContentLoading || (currentContentId && currentContentLoading)) {
    return <LoadingSpinner message="Loading course data..." />;
  }

  // Error state
  if (groupedContentError || currentContentError || !course) {
    return (
      <ErrorState
        title="Course Not Found"
        message="The requested course could not be found."
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
      <div className="pb-5 pt-3 px-6">
        <div className="w-full px-2 mx-auto">
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
              onOpenInNewTab={(labId) =>
                window.open(
                  `/learn/${courseId}/lab/${labId
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                  "_blank"
                )
              }
              onClose={() => setActiveLab(null)}
            />
          ) : activeGame ? (
            <GameContent
              course={course}
              activeGame={activeGame}
              onOpenInNewTab={(gameId) =>
                window.open(
                  `/learn/${courseId}/game/${gameId
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                  "_blank"
                )
              }
              onClose={() => setActiveGame(null)}
            />
          ) : needsFullScreen && currentLesson ? (
            <FullScreenContent
              lesson={currentLesson}
              currentIndex={currentContentIndex}
              totalCount={course.totalLessons}
              isCompleted={isCurrentContentCompleted}
              onPrevious={prevLesson}
              onNext={nextLesson}
              onMarkComplete={() => markLessonComplete(currentLesson.id)}
              onOpenInNewTab={
                currentLesson.type === "lab"
                  ? () =>
                      window.open(
                        `/learn/${courseId}/lab/${currentLesson.id}`,
                        "_blank"
                      )
                  : currentLesson.type === "game"
                  ? () =>
                      window.open(
                        `/learn/${courseId}/game/${currentLesson.id}`,
                        "_blank"
                      )
                  : undefined
              }
              // T034: Use smart navigation state
              canGoBack={navigationState.hasPrevious}
              canGoForward={navigationState.hasNext}
              // Navigation loading states
              isNavigatingNext={isNavigating}
              isNavigatingPrev={isNavigating}
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
                  key={`video-${currentContentId}-${currentContentIndex}`} // Force re-render on content change
                  lesson={currentLesson}
                  isPlaying={isPlaying}
                  currentVideo={currentContentIndex}
                  totalLessons={course.totalLessons}
                  completedLessons={completedLessons}
                  progressData={progressData}
                  isMaximized={videoMaximized}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onPrevious={prevLesson}
                  onNext={nextLesson}
                  onMarkComplete={() => markLessonComplete(currentLesson.id)}
                  onMaximize={() => {
                    setVideoMaximized(true);
                    setPlaygroundMaximized(false);
                  }}
                  onRestore={() => {
                    setVideoMaximized(false);
                    setPlaygroundMaximized(false);
                  }}
                  // T035: Pass video progress handler for auto-completion
                  onVideoProgress={handleVideoProgress}
                  // Navigation loading states
                  isNavigatingNext={isNavigating}
                  isNavigatingPrev={isNavigating}
                />
              }
              rightPane={
                <AIPlayground
                  playgroundModes={getDynamicPlaygroundModes()}
                  activeMode={playgroundMode}
                  terminalHistory={terminalHistory}
                  chatMessages={aiChatMessages}
                  analysisResult={analysisResult}
                  isAnalyzing={isAnalyzing}
                  isMaximized={playgroundMaximized}
                  onModeChange={setPlaygroundMode}
                  onTerminalCommand={handleTerminalCommand}
                  onChatMessage={handleAiChat}
                  onAnalysis={handleAnalysis}
                  onMaximize={() => {
                    setPlaygroundMaximized(true);
                    setVideoMaximized(false);
                  }}
                  onRestore={() => {
                    setVideoMaximized(false);
                    setPlaygroundMaximized(false);
                  }}
                />
              }
            />
          ) : (
            <div className="text-center text-green-400 font-mono p-8">
              <div className="mb-4">No content available</div>
              <div className="text-sm text-green-400/60">
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
        course={course}
        currentVideo={currentContentIndex}
        completedLessons={completedLessons}
        progressData={progressData}
        isOpen={contentSidebarOpen}
        onClose={() => setContentSidebarOpen(false)}
        onLessonSelect={handleLessonSelect}
      />

      {/* T036: Enhanced Loading overlay */}
      <LoadingOverlay
        isLoading={isNavigating || isCompleting || isAutoCompleting}
        message={
          isNavigating
            ? "Loading next content..."
            : isAutoCompleting
            ? `Auto-completing video (${Math.round(videoProgress)}% watched)...`
            : isCompleting
            ? "Marking as complete..."
            : ""
        }
      />
    </div>
  );
};

export default EnrolledCoursePage;
