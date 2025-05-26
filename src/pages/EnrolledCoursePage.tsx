import { Header } from "@/components/common/Header";
import {
  AIPlayground,
  ContentSidebar,
  CourseHeader,
  CourseTabs,
  SplitView,
  VideoPlayer,
} from "@/components/enrolled";
import { Button } from "@/components/ui/button";
import { getCourseById } from "@/lib/coursesData";
import {
  convertCourseToEnrolledCourse,
  getDefaultCompletedLessons,
} from "@/lib/courseUtils";
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
  ExternalLink,
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

  // Minimize states
  const [videoMinimized, setVideoMinimized] = useState(false);
  const [playgroundMinimized, setPlaygroundMinimized] = useState(false);

  // Lab and Game states
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Load course data dynamically
  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      if (courseData) {
        const enrolledCourse = convertCourseToEnrolledCourse(courseData);
        setCourse(enrolledCourse);
        setCompletedLessons(getDefaultCompletedLessons(enrolledCourse));
      }
      setLoading(false);
    }
  }, [courseId]);

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

    // Default additional modes if no specific matches
    if (additionalModes.length === 0) {
      additionalModes.push(
        {
          id: "analysis",
          name: "Code Analysis",
          icon: Code,
          description: "AI-powered code and command analysis",
        },
        {
          id: "vulnerability",
          name: "Vuln Scanner",
          icon: Bug,
          description: "Vulnerability detection and analysis",
        }
      );
    }

    return [...baseModes, ...additionalModes];
  }, [currentVideo]);

  const playgroundModes: PlaygroundMode[] = getDynamicPlaygroundModes;

  const needsPlayground = () => {
    const currentLesson = getCurrentLesson();
    return currentLesson?.type === "video";
  };

  const needsFullScreenContent = () => {
    const currentLesson = getCurrentLesson();
    return (
      currentLesson?.type === "text" ||
      currentLesson?.type === "lab" ||
      currentLesson?.type === "game"
    );
  };

  // Event handlers
  const handleTerminalCommand = (command: string) => {
    setTerminalHistory((prev) => [
      ...prev,
      { type: "command", content: `user@cybersec:~$ ${command}` },
    ]);

    // Simulate command execution with AI assistance
    setTimeout(() => {
      let output = "";
      let aiTip = "";

      switch (command.toLowerCase()) {
        case "help":
          output =
            "Available commands: ls, pwd, whoami, ps, netstat, nmap, ping, cat, grep, find";
          aiTip =
            "💡 AI Tip: Try 'ls -la' to see detailed file listings with permissions!";
          break;
        case "ls":
          output =
            "Desktop  Documents  Downloads  Pictures  Videos  logs  scripts";
          aiTip =
            "💡 AI Tip: Great! You're listing directory contents. Try 'ls -la' for detailed view.";
          break;
        default:
          output = `bash: ${command}: command not found`;
          aiTip =
            "💡 AI Tip: Try 'help' to see available commands, or ask me for guidance!";
      }

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", content: output },
        { type: "ai", content: aiTip },
      ]);
    }, 300);
  };

  const handleAiChat = (message: string) => {
    setAiChatMessages((prev) => [...prev, { role: "user", content: message }]);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "";
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("sql injection")) {
        aiResponse =
          "SQL injection is a code injection technique where malicious SQL statements are inserted into application entry points. Key prevention methods include: 1) Parameterized queries, 2) Input validation, 3) Least privilege principles.";
      } else {
        aiResponse = `That's a great question about ${message}! I'd be happy to help you understand this concept better.`;
      }

      setAiChatMessages((prev) => [
        ...prev,
        { role: "ai", content: aiResponse },
      ]);
    }, 1000);
  };

  const handleAnalysis = async (input: string) => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResult(
        `Analysis of "${input}":\n\nThis appears to be a cybersecurity-related command/code. Here are some insights:\n\n1. Security implications\n2. Best practices\n3. Potential vulnerabilities\n\nWould you like me to explain any specific aspect?`
      );
      setIsAnalyzing(false);
    }, 2000);
  };

  const nextLesson = () => {
    const allLessons = getAllLessons();
    if (currentVideo < allLessons.length - 1) {
      setCurrentVideo(currentVideo + 1);
    }
  };

  const previousLesson = () => {
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
    }
  };

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  // Custom handlers for lab and game selection
  const handleLabSelect = (labId: string) => {
    setActiveLab(labId);
    setActiveGame(null); // Clear any active game
  };

  const handleGameSelect = (gameId: string) => {
    setActiveGame(gameId);
    setActiveLab(null); // Clear any active lab
  };

  // Helper functions to open in new tab
  const openLabInNewTab = (labId: string) => {
    window.open(`/learn/${courseId}/lab/${labId}`, "_blank");
  };

  const openGameInNewTab = (gameId: string) => {
    window.open(`/learn/${courseId}/game/${gameId}`, "_blank");
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
    return (
      <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="font-mono">LOADING_COURSE_DATA...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-mono mb-4">
            COURSE_NOT_FOUND
          </h1>
          <p className="font-mono mb-6">
            The requested course could not be found.
          </p>
          <Button
            onClick={() => navigate("/overview")}
            className="bg-green-400 text-black hover:bg-green-300 font-mono"
          >
            BACK_TO_OVERVIEW
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="py-5 px-6">
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
            // Lab Content
            <div className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-green-400/30 bg-green-400/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-green-400 font-semibold text-lg">
                    {course.labs.find((lab) => lab.id === activeLab)?.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openLabInNewTab(activeLab)}
                      className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeLab}
                      className="text-green-400 hover:bg-green-400/10"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-8 text-center">
                  <h4 className="text-green-400 text-xl mb-4">
                    Lab Environment Loading...
                  </h4>
                  <p className="text-green-300/70 mb-6">
                    {
                      course.labs.find((lab) => lab.id === activeLab)
                        ?.description
                    }
                  </p>
                  <div className="animate-pulse">
                    <div className="h-4 bg-green-400/20 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-green-400/20 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeGame ? (
            // Game Content
            <div className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-green-400/30 bg-green-400/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-green-400 font-semibold text-lg">
                    {course.games.find((game) => game.id === activeGame)?.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openGameInNewTab(activeGame)}
                      className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeGame}
                      className="text-green-400 hover:bg-green-400/10"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-8 text-center">
                  <h4 className="text-green-400 text-xl mb-4">
                    Game Loading...
                  </h4>
                  <p className="text-green-300/70 mb-6">
                    {
                      course.games.find((game) => game.id === activeGame)
                        ?.description
                    }
                  </p>
                  <div className="animate-pulse">
                    <div className="h-4 bg-green-400/20 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-green-400/20 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : needsFullScreenContent() ? (
            // Text/Lab/Game Content - Full Screen like Lab
            <div className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-green-400/30 bg-green-400/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-green-400 font-semibold text-lg">
                    {getCurrentLesson()?.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {(getCurrentLesson()?.type === "lab" ||
                      getCurrentLesson()?.type === "game") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentLesson = getCurrentLesson();
                          if (currentLesson?.type === "lab") {
                            openLabInNewTab(currentLesson.id);
                          } else if (currentLesson?.type === "game") {
                            openGameInNewTab(currentLesson.id);
                          }
                        }}
                        className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                    )}
                    <div className="px-3 py-1 bg-green-400/20 border border-green-400/40 rounded text-green-400 text-xs font-mono font-bold">
                      {getCurrentLesson()?.type.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-8">
                  {getCurrentLesson()?.type === "text" ? (
                    <div className="prose prose-green max-w-none">
                      <div className="text-green-400 text-xl mb-4 font-mono">
                        Reading Material
                      </div>
                      <div className="text-green-300/90 leading-relaxed font-mono text-sm">
                        {getCurrentLesson()?.content ||
                          getCurrentLesson()?.description}
                      </div>
                    </div>
                  ) : getCurrentLesson()?.type === "lab" ? (
                    <div className="text-center">
                      <h4 className="text-green-400 text-xl mb-4 font-mono">
                        Lab Environment Loading...
                      </h4>
                      <p className="text-green-300/70 mb-6 font-mono">
                        {getCurrentLesson()?.description}
                      </p>
                      <div className="animate-pulse">
                        <div className="h-4 bg-green-400/20 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-4 bg-green-400/20 rounded w-1/2 mx-auto"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h4 className="text-green-400 text-xl mb-4 font-mono">
                        Game Loading...
                      </h4>
                      <p className="text-green-300/70 mb-6 font-mono">
                        {getCurrentLesson()?.description}
                      </p>
                      <div className="animate-pulse">
                        <div className="h-4 bg-green-400/20 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-4 bg-green-400/20 rounded w-1/2 mx-auto"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Controls for all content types */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-400/30">
                  <Button
                    variant="outline"
                    onClick={previousLesson}
                    disabled={currentVideo === 0}
                    className="border-green-400/30 text-green-400 hover:bg-green-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </Button>

                  <div className="flex items-center space-x-4">
                    <span className="text-green-400/70 text-sm font-mono">
                      {currentVideo + 1} / {getAllLessons().length}
                    </span>
                    <Button
                      onClick={() =>
                        markLessonComplete(getCurrentLesson()?.id || "")
                      }
                      disabled={completedLessons.includes(
                        getCurrentLesson()?.id || ""
                      )}
                      className="bg-green-400 text-black hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {completedLessons.includes(getCurrentLesson()?.id || "")
                        ? "✓ Completed"
                        : "Mark Complete"}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={nextLesson}
                    disabled={currentVideo >= getAllLessons().length - 1}
                    className="border-green-400/30 text-green-400 hover:bg-green-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </div>
          ) : needsPlayground() ? (
            // Video + Playground Content
            <SplitView
              leftPane={
                <VideoPlayer
                  lesson={getCurrentLesson()}
                  isPlaying={isPlaying}
                  currentVideo={currentVideo}
                  totalLessons={getAllLessons().length}
                  completedLessons={completedLessons}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onPrevious={previousLesson}
                  onNext={nextLesson}
                  onMarkComplete={markLessonComplete}
                  onMinimize={() => setVideoMinimized(true)}
                />
              }
              rightPane={
                <AIPlayground
                  playgroundModes={playgroundModes}
                  activeMode={playgroundMode}
                  terminalHistory={terminalHistory}
                  chatMessages={aiChatMessages}
                  analysisResult={analysisResult}
                  isAnalyzing={isAnalyzing}
                  onModeChange={setPlaygroundMode}
                  onTerminalCommand={handleTerminalCommand}
                  onChatMessage={handleAiChat}
                  onAnalysis={handleAnalysis}
                  onMinimize={() => setPlaygroundMinimized(true)}
                />
              }
              leftPaneWidth={leftPaneWidth}
              videoMinimized={videoMinimized}
              playgroundMinimized={playgroundMinimized}
              isResizing={isResizing}
              onLeftPaneWidthChange={setLeftPaneWidth}
              onResizeStart={() => setIsResizing(true)}
              onResizeEnd={() => setIsResizing(false)}
              onShowBoth={() => {
                setVideoMinimized(false);
                setPlaygroundMinimized(false);
              }}
              onRestoreVideo={() => setVideoMinimized(false)}
              onRestorePlayground={() => setPlaygroundMinimized(false)}
            />
          ) : (
            // Default Content
            <div className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden mb-6">
              <div className="p-6">
                <div className="text-center text-green-400 font-mono">
                  Content type not supported yet.
                </div>
              </div>
            </div>
          )}

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

      <ContentSidebar
        course={course}
        currentVideo={currentVideo}
        completedLessons={completedLessons}
        isOpen={contentSidebarOpen}
        onClose={() => setContentSidebarOpen(false)}
        onLessonSelect={(lessonIndex) => {
          setCurrentVideo(lessonIndex);
          // Reset playground to the first available mode for the new lesson
          const newPlaygroundModes = playgroundModes;
          if (newPlaygroundModes.length > 0) {
            setPlaygroundMode(newPlaygroundModes[0].id);
          }
        }}
      />
    </div>
  );
};

export default EnrolledCoursePage;
