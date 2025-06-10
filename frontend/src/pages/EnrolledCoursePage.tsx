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
import { apiSlice } from "@/features/api/apiSlice";
import {
  ChatMessage,
  EnrolledCourse,
  PlaygroundMode,
  TerminalMessage,
} from "@/lib/types";
import {
  Activity,
  BookOpen,
  Brain,
  Bug,
  Calculator,
  Code,
  Eye,
  FileText,
  Lock,
  Network,
  Target,
  Terminal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EnrolledCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [course, setCourse] = useState<EnrolledCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // when someone comes to this page, move to top -1000
  useEffect(() => {
    // window.scrollTo(0, 100); // with beautiful animation
    window.scrollTo(0, 100);
  }, []);

  // AI Playground State
  const [playgroundMode, setPlaygroundMode] = useState("terminal");
  const [terminalHistory, setTerminalHistory] = useState<TerminalMessage[]>([
    {
      type: "output",
      content: "Last login: Mon Dec 16 14:32:01 on ttys000",
    },
    {
      type: "output",
      content: "Welcome to AI-Enhanced Cybersecurity Terminal",
    },
  ]);
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "Hello! I'm your AI learning assistant. Ask me anything about cybersecurity concepts, or let me help you with practical exercises!",
    },
  ]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // UI State
  const [contentSidebarOpen, setContentSidebarOpen] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(60); // Percentage
  const [isResizing, setIsResizing] = useState(false);

  // Maximize states
  const [videoMaximized, setVideoMaximized] = useState(false);
  const [playgroundMaximized, setPlaygroundMaximized] = useState(false);

  // Lab and Game states
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Security: Apply global security styles when video is playing
  useEffect(() => {
    const applySecurityStyles = () => {
      const style = document.createElement("style");
      style.id = "video-security-styles";
      style.textContent = `
        /* Disable screenshot/screen capture for video content */
        .video-security-active {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
          pointer-events: auto !important;
        }

        /* Disable print for video content */
        @media print {
          .video-security-active {
            display: none !important;
          }
        }

        /* Additional protection against content extraction */
        .video-security-active * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          -webkit-touch-callout: none !important;
        }

        /* Prevent image saving */
        .video-security-active img,
        .video-security-active video {
          -webkit-user-drag: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          pointer-events: none !important;
        }

        /* Block inspect element overlay */
        .video-security-active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
          pointer-events: none;
          background: transparent;
        }
      `;

      if (!document.getElementById("video-security-styles")) {
        document.head.appendChild(style);
      }
    };

    const removeSecurityStyles = () => {
      const existingStyle = document.getElementById("video-security-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    };

    if (isPlaying) {
      applySecurityStyles();
      document.body.classList.add("video-security-active");

      // Add meta tag to prevent screenshots (supported by some browsers)
      const meta = document.createElement("meta");
      meta.name = "format-detection";
      meta.content = "telephone=no";
      meta.id = "security-meta";
      if (!document.getElementById("security-meta")) {
        document.head.appendChild(meta);
      }
    } else {
      document.body.classList.remove("video-security-active");
      removeSecurityStyles();

      const securityMeta = document.getElementById("security-meta");
      if (securityMeta) {
        securityMeta.remove();
      }
    }

    return () => {
      document.body.classList.remove("video-security-active");
      removeSecurityStyles();

      const securityMeta = document.getElementById("security-meta");
      if (securityMeta) {
        securityMeta.remove();
      }
    };
  }, [isPlaying]);

  // Load course data from API
  const {
    data: moduleData,
    error: moduleError,
    isLoading: moduleLoading,
  } = apiSlice.endpoints.getModuleById.useQuery(courseId || "", {
    skip: !courseId,
  });

  const {
    data: contentData,
    error: contentError,
    isLoading: contentLoading,
  } = apiSlice.endpoints.getModuleContentGrouped.useQuery(courseId || "", {
    skip: !courseId,
  });

  // Transform API data to EnrolledCourse format when available
  useEffect(() => {
    if (moduleData && contentData && contentData.success) {
      // Create a simplified enrolled course structure
      const sections = Object.entries(contentData.data).map(
        ([sectionTitle, items], index) => ({
          id: `section-${index}`,
          title: sectionTitle,
          lessons: (
            items as Array<{
              id: string;
              title: string;
              description?: string;
              type: "video" | "lab" | "game" | "document";
              duration?: number;
              url?: string;
              instructions?: string;
            }>
          ).map((item, itemIndex: number) => ({
            id: `lesson-${index}-${itemIndex}`,
            contentId: item.id,
            title: item.title,
            duration: item.duration ? `${item.duration}:00` : "15:00",
            type: item.type === "document" ? ("text" as const) : item.type,
            completed: false,
            description: item.description || `Learn about ${item.title}`,
            videoUrl: item.type === "video" ? item.url : undefined,
            content: item.type === "document" ? item.instructions : undefined,
          })),
        })
      );

      const enrolledCourse: EnrolledCourse = {
        title: moduleData.title,
        description: moduleData.description,
        icon: moduleData.icon,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/30",
        totalLessons: sections.reduce(
          (acc, section) => acc + section.lessons.length,
          0
        ),
        completedLessons: 0,
        progress: 0,
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
      setCompletedLessons([]);
      setLoading(false);
    }
  }, [moduleData, contentData]);

  // Handle loading and error states
  useEffect(() => {
    if (moduleLoading || contentLoading) {
      setLoading(true);
    } else if (
      moduleError ||
      contentError ||
      (contentData && !contentData.success)
    ) {
      setLoading(false);
    }
  }, [moduleLoading, contentLoading, moduleError, contentError, contentData]);

  // Helper functions
  const getAllLessons = () => {
    return course?.sections.flatMap((section) => section.lessons) || [];
  };

  const getCurrentLesson = () => {
    const allLessons = getAllLessons();
    return allLessons[currentVideo];
  };

  // Generate dynamic playground modes based on current lesson
  const getDynamicPlaygroundModes = useMemo(() => {
    const currentLesson = getCurrentLesson();
    const lessonTitle = currentLesson?.title?.toLowerCase() || "";

    // Base modes that are always available
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

    // Add lesson-specific modes
    const additionalModes: PlaygroundMode[] = [];

    if (lessonTitle.includes("threat") || lessonTitle.includes("landscape")) {
      additionalModes.push(
        {
          id: "threat-intel",
          name: "Threat Intel",
          icon: Target,
          description: "Threat intelligence analysis and research",
        },
        {
          id: "network-scan",
          name: "Network Scanner",
          icon: Network,
          description: "Network reconnaissance and scanning tools",
        }
      );
    }

    if (lessonTitle.includes("cia") || lessonTitle.includes("triad")) {
      additionalModes.push(
        {
          id: "risk-calc",
          name: "Risk Calculator",
          icon: Calculator,
          description: "Risk assessment and calculation tools",
        },
        {
          id: "policy-builder",
          name: "Policy Builder",
          icon: FileText,
          description: "Security policy development assistant",
        }
      );
    }

    if (
      lessonTitle.includes("security") &&
      lessonTitle.includes("principles")
    ) {
      additionalModes.push(
        {
          id: "compliance",
          name: "Compliance Check",
          icon: Lock,
          description: "Security compliance verification tools",
        },
        {
          id: "audit-log",
          name: "Audit Logger",
          icon: Activity,
          description: "Security audit and logging analysis",
        }
      );
    }

    if (lessonTitle.includes("what") && lessonTitle.includes("cybersecurity")) {
      additionalModes.push(
        {
          id: "glossary",
          name: "Cyber Glossary",
          icon: BookOpen,
          description: "Interactive cybersecurity terminology guide",
        },
        {
          id: "scenario",
          name: "Scenarios",
          icon: Eye,
          description: "Real-world cybersecurity scenarios",
        }
      );
    }

    if (lessonTitle.includes("malware") || lessonTitle.includes("virus")) {
      additionalModes.push(
        {
          id: "malware-analysis",
          name: "Malware Analysis",
          icon: Bug,
          description: "Malware detection and analysis tools",
        },
        {
          id: "code-review",
          name: "Code Review",
          icon: Code,
          description: "Security code review and analysis",
        }
      );
    }

    return [...baseModes, ...additionalModes];
  }, [currentVideo, course]);

  // Check if current lesson needs playground
  const needsPlayground = () => {
    const currentLesson = getCurrentLesson();
    return currentLesson?.type === "video" || currentLesson?.type === "text";
  };

  const needsFullScreenContent = () => {
    const currentLesson = getCurrentLesson();
    return (
      currentLesson?.type === "text" ||
      currentLesson?.type === "lab" ||
      currentLesson?.type === "game"
    );
  };

  const handleTerminalCommand = (command: string) => {
    // Add user command to history
    setTerminalHistory((prev) => [
      ...prev,
      { type: "command", content: `user@terminal-hacks:~$ ${command}` },
    ]);

    // Simulate AI response based on command
    setTimeout(() => {
      let response = "";
      const cmd = command.toLowerCase();

      if (cmd.includes("help")) {
        response = `Available commands:
- nmap: Network scanning
- wireshark: Packet analysis
- metasploit: Penetration testing
- john: Password cracking
- hashcat: Hash cracking
- sqlmap: SQL injection testing
- burpsuite: Web application testing
- volatility: Memory analysis
- autopsy: Digital forensics
- yara: Malware detection`;
      } else if (cmd.includes("nmap")) {
        response = `Starting Nmap scan...
Host discovery disabled (-Pn). All addresses will be marked 'up'
Nmap scan report for target (192.168.1.1)
Host is up (0.0010s latency).
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https`;
      } else if (cmd.includes("ls")) {
        response = `total 24
drwxr-xr-x  2 user user 4096 Dec 16 14:32 Documents
drwxr-xr-x  2 user user 4096 Dec 16 14:32 Downloads
drwxr-xr-x  2 user user 4096 Dec 16 14:32 Tools
-rw-r--r--  1 user user  220 Dec 16 14:32 .bash_logout
-rw-r--r--  1 user user 3771 Dec 16 14:32 .bashrc`;
      } else {
        response = `Command '${command}' executed. This is a simulated environment for learning purposes.`;
      }

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", content: response },
      ]);
    }, 1000);
  };

  const handleAiChat = (message: string) => {
    // Add user message
    setAiChatMessages((prev) => [...prev, { role: "user", content: message }]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question about cybersecurity! Let me explain...",
        "Based on the current lesson, here's what you should know...",
        "This concept is fundamental to understanding cybersecurity...",
        "Let me break this down for you step by step...",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setAiChatMessages((prev) => [
        ...prev,
        { role: "ai", content: randomResponse },
      ]);
    }, 1500);
  };

  const handleAnalysis = async (input: string) => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResult(
        `Analysis complete for: "${input}"\n\nThis appears to be a cybersecurity-related query. Based on the current lesson context, here are the key findings...`
      );
      setIsAnalyzing(false);
    }, 2000);
  };

  const nextLesson = () => {
    const totalLessons = getAllLessons().length;
    if (currentVideo < totalLessons - 1) {
      setCurrentVideo(currentVideo + 1);
    }
  };

  const previousLesson = () => {
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
    }
  };

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => [...prev, lessonId]);
  };

  const handleLabSelect = (labId: string) => {
    setActiveLab(labId);
  };

  const handleGameSelect = (gameId: string) => {
    setActiveGame(gameId);
  };

  const openLabInNewTab = (labId: string) => {
    // Convert lab name to URL-friendly ID if needed
    const urlFriendlyLabId = labId
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    window.open(`/learn/${courseId}/lab/${urlFriendlyLabId}`, "_blank");
  };

  const openGameInNewTab = (gameId: string) => {
    // Convert game name to URL-friendly ID if needed
    const urlFriendlyGameId = gameId
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    window.open(`/learn/${courseId}/game/${urlFriendlyGameId}`, "_blank");
  };

  // Helper function to close lab/game and return to lesson
  const closeLab = () => {
    setActiveLab(null);
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  // Loading and error states
  if (loading) {
    return <LoadingSpinner message="LOADING_COURSE_DATA..." />;
  }

  if (!course) {
    return (
      <ErrorState
        title="COURSE_NOT_FOUND"
        message="The requested course could not be found."
        buttonText="BACK_TO_OVERVIEW"
        onButtonClick={() => navigate("/overview")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <div className="pb-5 pt-3 px-6">
        <div className="w-full px-2 mx-auto">
          <CourseHeader
            course={course}
            currentVideo={currentVideo}
            totalLessons={getAllLessons().length}
            onNavigateBack={() => navigate(`/course/${courseId}`)}
            onOpenContentSidebar={() => setContentSidebarOpen(true)}
          />

          {/* Main Content Area */}
          {activeLab ? (
            <LabContent
              course={course}
              activeLab={activeLab}
              onOpenInNewTab={openLabInNewTab}
              onClose={closeLab}
            />
          ) : activeGame ? (
            <GameContent
              course={course}
              activeGame={activeGame}
              onOpenInNewTab={openGameInNewTab}
              onClose={closeGame}
            />
          ) : needsFullScreenContent() ? (
            <FullScreenContent
              lesson={getCurrentLesson()!}
              currentIndex={currentVideo}
              totalCount={getAllLessons().length}
              isCompleted={completedLessons.includes(
                getCurrentLesson()?.id || ""
              )}
              onPrevious={previousLesson}
              onNext={nextLesson}
              onMarkComplete={() =>
                markLessonComplete(getCurrentLesson()?.id || "")
              }
              onOpenInNewTab={
                getCurrentLesson()?.type === "lab"
                  ? () => openLabInNewTab(getCurrentLesson()?.id || "")
                  : getCurrentLesson()?.type === "game"
                  ? () => openGameInNewTab(getCurrentLesson()?.id || "")
                  : undefined
              }
            />
          ) : needsPlayground() ? (
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
                  lesson={getCurrentLesson()}
                  isPlaying={isPlaying}
                  currentVideo={currentVideo}
                  totalLessons={getAllLessons().length}
                  completedLessons={completedLessons}
                  isMaximized={videoMaximized}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onPrevious={previousLesson}
                  onNext={nextLesson}
                  onMarkComplete={markLessonComplete}
                  onMaximize={() => {
                    setVideoMaximized(true);
                    setPlaygroundMaximized(false);
                  }}
                  onRestore={() => {
                    setVideoMaximized(false);
                    setPlaygroundMaximized(false);
                  }}
                />
              }
              rightPane={
                <AIPlayground
                  playgroundModes={getDynamicPlaygroundModes}
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
            <div className="text-center text-green-400 font-mono">
              Content type not supported yet.
            </div>
          )}

          {/* Course Tabs */}
          <CourseTabs
            course={course}
            activeTab={activeTab}
            activeLab={activeLab}
            activeGame={activeGame}
            currentLesson={getCurrentLesson()}
            onTabChange={setActiveTab}
            onLabSelect={handleLabSelect}
            onGameSelect={handleGameSelect}
          />
        </div>
      </div>

      {/* Content Sidebar */}
      <ContentSidebar
        course={course}
        currentVideo={currentVideo}
        completedLessons={completedLessons}
        isOpen={contentSidebarOpen}
        onClose={() => setContentSidebarOpen(false)}
        onLessonSelect={(lessonIndex) => {
          setCurrentVideo(lessonIndex);
          // Reset playground to the first available mode for the new lesson
          const newPlaygroundModes = getDynamicPlaygroundModes;
          if (newPlaygroundModes.length > 0) {
            setPlaygroundMode(newPlaygroundModes[0].id);
          }
        }}
      />
    </div>
  );
};

export default EnrolledCoursePage;
