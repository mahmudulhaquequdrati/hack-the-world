import { Header } from "@/components/common/header";
import {
  AIPlayground,
  ContentSidebar,
  CourseHeader,
  CourseTabs,
  SplitView,
  VideoPlayer,
} from "@/components/enrolled";
import { Button } from "@/components/ui/button";
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
  Shield,
  Target,
  Terminal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EnrolledCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    "intro-1",
    "intro-2",
    "intro-3",
  ]);

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

  // Course data
  const course: EnrolledCourse = {
    title: "Cybersecurity Foundations",
    description: "Essential concepts, terminology, and security principles",
    icon: Shield,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    totalLessons: 15,
    completedLessons: 8,
    progress: 53,
    sections: [
      {
        id: "intro",
        title: "Introduction to Cybersecurity",
        lessons: [
          {
            id: "intro-1",
            title: "What is Cybersecurity",
            duration: "15:30",
            type: "video",
            completed: true,
            description:
              "Overview of cybersecurity fundamentals and core concepts",
            videoUrl: "https://example.com/video1.mp4",
          },
          {
            id: "intro-2",
            title: "Threat Landscape",
            duration: "12:45",
            type: "video",
            completed: true,
            description: "Understanding modern cybersecurity threats",
            videoUrl: "https://example.com/video2.mp4",
          },
          {
            id: "intro-3",
            title: "Security Principles",
            duration: "18:20",
            type: "video",
            completed: true,
            description:
              "Core security principles every professional should know",
            videoUrl: "https://example.com/video3.mp4",
          },
          {
            id: "intro-4",
            title: "CIA Triad",
            duration: "14:15",
            type: "text",
            completed: false,
            description:
              "Confidentiality, Integrity, and Availability explained",
            content:
              "The CIA Triad forms the foundation of information security...",
          },
        ],
      },
    ],
    labs: [
      {
        id: "lab-1",
        name: "Risk Assessment Simulation",
        description: "Hands-on risk assessment of a fictional company",
        difficulty: "Beginner",
        duration: "45 min",
        completed: false,
        available: true,
      },
    ],
    playground: {
      title: "Security Assessment Playground",
      description:
        "Interactive environment to practice risk assessment and policy development",
      tools: ["Risk Calculator", "Policy Builder", "Compliance Checker"],
      available: true,
    },
    resources: [
      { name: "CIA Triad Reference Guide", type: "PDF", size: "2.1 MB" },
      { name: "Risk Assessment Template", type: "Excel", size: "1.5 MB" },
    ],
    games: [
      {
        id: "threat-hunter",
        name: "Threat Hunter",
        description: "Hunt for threats in network traffic",
        difficulty: "Beginner",
        duration: "20 min",
        points: 100,
        available: true,
      },
    ],
  };

  // Helper functions
  const getAllLessons = () => {
    return course.sections.flatMap((section) => section.lessons);
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
    return currentLesson?.type === "video" || currentLesson?.type === "text";
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
            // Video Only Content
            <div className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden mb-6">
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
            </div>
          )}

          <CourseTabs
            course={course}
            activeTab={activeTab}
            activeLab={activeLab}
            activeGame={activeGame}
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
