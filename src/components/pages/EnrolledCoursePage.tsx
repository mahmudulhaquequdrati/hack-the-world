import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  ArrowLeft,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  GripVertical,
  List,
  Lock,
  Maximize2,
  Minimize2,
  Network,
  Pause,
  Play,
  Search,
  Send,
  Shield,
  Sparkles,
  Target,
  Terminal,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EnrolledCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    "intro-1",
    "intro-2",
    "intro-3",
  ]);

  // AI Playground State
  const [playgroundMode, setPlaygroundMode] = useState("terminal");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: "command" | "output" | "ai"; content: string }>
  >([
    {
      type: "output",
      content: "Last login: Mon Dec 16 14:32:01 on ttys000",
    },
    {
      type: "output",
      content: "Welcome to AI-Enhanced Cybersecurity Terminal",
    },
  ]);
  const [aiChatMessages, setAiChatMessages] = useState<
    Array<{ role: "user" | "ai"; content: string }>
  >([
    {
      role: "ai",
      content:
        "Hello! I'm your AI learning assistant. Ask me anything about cybersecurity concepts, or let me help you with practical exercises!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [analysisInput, setAnalysisInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(50); // Percentage
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [terminalCursor, setTerminalCursor] = useState("");

  // Minimize states
  const [videoMinimized, setVideoMinimized] = useState(false);
  const [playgroundMinimized, setPlaygroundMinimized] = useState(false);

  // Lab and Game states
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Details expanded states
  const [expandedDetails, setExpandedDetails] = useState<{
    [key: string]: boolean;
  }>({});

  // AI Playground Handlers
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
        case "ls -la":
          output =
            "total 24\ndrwxr-xr-x  7 user user 4096 Dec 16 10:30 .\ndrwxr-xr-x  3 root root 4096 Dec 10 09:15 ..\n-rw-r--r--  1 user user  220 Dec 10 09:15 .bash_logout\n-rw-r--r--  1 user user 3526 Dec 10 09:15 .bashrc\ndrwxr-xr-x  2 user user 4096 Dec 16 10:30 logs\ndrwxr-xr-x  2 user user 4096 Dec 16 10:30 scripts";
          aiTip =
            "💡 AI Tip: Excellent! You can see file permissions (drwxr-xr-x). The first character shows file type, then owner/group/other permissions.";
          break;
        case "pwd":
          output = "/home/user";
          aiTip = "💡 AI Tip: Good! pwd shows your current working directory.";
          break;
        case "whoami":
          output = "user";
          aiTip =
            "💡 AI Tip: This shows your current username. Important for privilege escalation exercises!";
          break;
        case "ps":
          output =
            "  PID TTY          TIME CMD\n 1234 pts/0    00:00:01 bash\n 5678 pts/0    00:00:00 ps";
          aiTip =
            "💡 AI Tip: ps shows running processes. Try 'ps aux' for more details.";
          break;
        case "netstat":
          output =
            "Active Internet connections:\nProto Recv-Q Send-Q Local Address           Foreign Address         State\ntcp        0      0 localhost:22            0.0.0.0:*               LISTEN";
          aiTip =
            "💡 AI Tip: netstat shows network connections. Useful for finding open ports!";
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

    setTerminalCursor("");
  };

  const handleAiChat = (message: string) => {
    setAiChatMessages((prev) => [...prev, { role: "user", content: message }]);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "";
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("sql injection")) {
        aiResponse =
          "SQL injection is a code injection technique where malicious SQL statements are inserted into application entry points. Key prevention methods include: 1) Parameterized queries, 2) Input validation, 3) Least privilege principles. Would you like me to show you some examples?";
      } else if (lowerMessage.includes("privilege escalation")) {
        aiResponse =
          "Privilege escalation involves gaining elevated access to resources. Common techniques include: 1) Exploiting SUID binaries, 2) Kernel exploits, 3) Misconfigured services. The 'sudo -l' command is often your first step in Linux privilege escalation.";
      } else if (
        lowerMessage.includes("help") ||
        lowerMessage.includes("guide")
      ) {
        aiResponse =
          "I can help you with: 🔐 Security concepts, 💻 Command explanations, 🛠️ Tool usage, 🎯 Lab guidance, 📊 Progress tracking. Just ask me anything specific!";
      } else {
        aiResponse = `That's a great question about ${message}! I'd be happy to help you understand this concept better. Could you be more specific about what aspect you'd like to explore?`;
      }

      setAiChatMessages((prev) => [
        ...prev,
        { role: "ai", content: aiResponse },
      ]);
    }, 1000);

    setChatInput("");
  };

  const handleAnalysis = async (input: string) => {
    setIsAnalyzing(true);
    setAnalysisResult("");

    // Simulate AI analysis
    setTimeout(() => {
      let result = "";

      if (
        courseId === "web-security-intro" ||
        courseId === "web-application-security"
      ) {
        result = `🔍 Web Security Analysis of: "${input.substring(0, 50)}${
          input.length > 50 ? "..." : ""
        }"\n\n• Detected potential XSS vectors: 2\n• SQL injection possibilities: 1\n• Missing security headers: 3\n• Recommendation: Implement input validation and CSP headers\n\n🤖 AI Insight: This code shows classic web vulnerabilities. Focus on sanitizing user inputs and implementing proper authentication.`;
      } else if (
        courseId === "networking-basics" ||
        courseId === "advanced-networking"
      ) {
        result = `🌐 Network Analysis of: "${input.substring(0, 50)}${
          input.length > 50 ? "..." : ""
        }"\n\n• Open ports detected: 22, 80, 443\n• SSL/TLS version: TLS 1.2\n• Firewall status: Active\n• Recommendation: Close unnecessary ports\n\n🤖 AI Insight: Your network configuration looks secure, but consider upgrading to TLS 1.3 for better security.`;
      } else if (courseId === "linux-basics") {
        result = `🐧 Linux System Analysis of: "${input.substring(0, 50)}${
          input.length > 50 ? "..." : ""
        }"\n\n• File permissions: Properly configured\n• SUID/SGID files: 3 found (review needed)\n• Log analysis: Normal activity patterns\n• Recommendation: Review SUID binaries\n\n🤖 AI Insight: Your Linux system shows good security practices. Monitor those SUID files for privilege escalation risks.`;
      } else if (courseId === "digital-forensics-basics") {
        result = `🔍 Digital Forensics Analysis of: "${input.substring(0, 50)}${
          input.length > 50 ? "..." : ""
        }"\n\n• Evidence integrity: Verified\n• File signatures: 45 files analyzed\n• Timeline events: 127 entries\n• Deleted files: 8 recoverable\n\n🤖 AI Insight: Strong chain of custody maintained. Evidence shows user activity between 2:30-4:15 PM on target date.`;
      } else if (courseId === "social-engineering-osint") {
        result = `🕵️ OSINT Investigation of: "${input.substring(0, 50)}${
          input.length > 50 ? "..." : ""
        }"\n\n• Social media profiles: 3 found\n• Email addresses: 2 discovered\n• Phone numbers: 1 identified\n• Associated accounts: 5 platforms\n\n🤖 AI Insight: Target has significant digital footprint. Focus on LinkedIn and Twitter for professional connections.`;
      } else if (courseId === "foundations") {
        result = `🛡️ Security Framework Analysis of: "${input.substring(
          0,
          50
        )}${
          input.length > 50 ? "..." : ""
        }"\n\n• Risk level: Medium (6/10)\n• Compliance gaps: 3 identified\n• Control effectiveness: 75%\n• Recommended actions: 5 priority items\n\n🤖 AI Insight: Good foundation with room for improvement. Focus on access controls and incident response procedures.`;
      } else {
        result = `🔍 Security Analysis of: "${input.substring(0, 50)}${
          input.length > 50 ? "..." : ""
        }"\n\n• Security score: 7/10\n• Areas for improvement: Input validation, access controls\n• Strengths: Good encryption implementation\n\n🤖 AI Insight: Overall solid foundation, focus on the identified areas for enhancement.`;
      }

      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Terminal typing simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalCursor((prev) => (prev === "█" ? "" : "█"));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle terminal key input
  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = terminalInput.trim();
      if (command) {
        handleTerminalCommand(command);
        setTerminalInput("");
      }
    }
  };

  // Fixed resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;

      const container = resizeRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftPaneWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  // Handle minimize/maximize
  const handleVideoMinimize = () => {
    setVideoMinimized(!videoMinimized);
    // Allow both panes to be visible - don't force playground to show
  };

  const handlePlaygroundMinimize = () => {
    setPlaygroundMinimized(!playgroundMinimized);
    // Allow both panes to be visible - don't force video to show
  };

  const handleShowBoth = () => {
    setVideoMinimized(false);
    setPlaygroundMinimized(false);
  };

  // Course data - simplified for enrolled experience - moved up to be available to helper functions
  const enrolledCourses = {
    foundations: {
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
            {
              id: "intro-5",
              title: "Security Quiz",
              duration: "10:00",
              type: "quiz",
              completed: false,
              description: "Test your understanding of basic security concepts",
              questions: [
                {
                  question: "What does CIA stand for in cybersecurity?",
                  options: [
                    "Central Intelligence Agency",
                    "Confidentiality, Integrity, Availability",
                    "Computer Information Access",
                  ],
                  correct: 1,
                },
              ],
            },
          ],
        },
        {
          id: "risk",
          title: "Risk Management",
          lessons: [
            {
              id: "risk-1",
              title: "Risk Assessment Fundamentals",
              duration: "20:30",
              type: "video",
              completed: false,
              description: "Learn how to conduct effective risk assessments",
              videoUrl: "https://example.com/video5.mp4",
            },
            {
              id: "risk-2",
              title: "Risk Analysis Techniques",
              duration: "16:45",
              type: "video",
              completed: false,
              description: "Quantitative and qualitative risk analysis methods",
              videoUrl: "https://example.com/video6.mp4",
            },
            {
              id: "risk-3",
              title: "Risk Mitigation Strategies",
              duration: "22:10",
              type: "video",
              completed: false,
              description: "Strategies to mitigate identified risks",
              videoUrl: "https://example.com/video7.mp4",
            },
          ],
        },
        {
          id: "frameworks",
          title: "Security Frameworks",
          lessons: [
            {
              id: "frameworks-1",
              title: "NIST Cybersecurity Framework",
              duration: "25:00",
              type: "video",
              completed: false,
              description: "Deep dive into the NIST framework",
              videoUrl: "https://example.com/video8.mp4",
            },
            {
              id: "frameworks-2",
              title: "ISO 27001 Standards",
              duration: "18:30",
              type: "video",
              completed: false,
              description: "Understanding ISO 27001 requirements",
              videoUrl: "https://example.com/video9.mp4",
            },
            {
              id: "frameworks-3",
              title: "COBIT Framework",
              duration: "21:45",
              type: "video",
              completed: false,
              description: "IT governance with COBIT",
              videoUrl: "https://example.com/video10.mp4",
            },
            {
              id: "frameworks-4",
              title: "SOX Compliance",
              duration: "19:20",
              type: "video",
              completed: false,
              description: "Sarbanes-Oxley compliance requirements",
              videoUrl: "https://example.com/video11.mp4",
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
        {
          id: "lab-2",
          name: "Policy Development Workshop",
          description: "Create security policies for different scenarios",
          difficulty: "Beginner",
          duration: "60 min",
          completed: false,
          available: true,
        },
        {
          id: "lab-3",
          name: "Framework Implementation",
          description: "Apply NIST Framework to a real scenario",
          difficulty: "Intermediate",
          duration: "90 min",
          completed: false,
          available: false,
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
        { name: "NIST Framework Checklist", type: "PDF", size: "850 KB" },
        { name: "Security Policy Templates", type: "Word", size: "3.2 MB" },
      ],
      games: [
        {
          id: "threat-hunter",
          name: "Threat Hunter",
          description: "Identify and classify different types of cyber threats",
          difficulty: "Beginner",
          duration: "15 min",
          icon: Target,
          available: true,
        },
        {
          id: "risk-calculator",
          name: "Risk Calculator Challenge",
          description: "Calculate risk scores for various security scenarios",
          difficulty: "Intermediate",
          duration: "20 min",
          icon: Brain,
          available: true,
        },
        {
          id: "policy-builder",
          name: "Policy Builder Simulator",
          description:
            "Create effective security policies for different organizations",
          difficulty: "Advanced",
          duration: "30 min",
          icon: Shield,
          available: false,
        },
      ],
    },
    "linux-basics": {
      title: "Linux Command Line Basics",
      description: "Master the terminal and basic command-line operations",
      icon: Terminal,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
      totalLessons: 20,
      completedLessons: 12,
      progress: 60,
      sections: [
        {
          id: "fundamentals",
          title: "Linux Fundamentals",
          lessons: [
            {
              id: "linux-1",
              title: "Linux History and Philosophy",
              duration: "18:30",
              type: "video",
              completed: true,
              description: "The origins and philosophy of Linux",
              videoUrl: "https://example.com/linux1.mp4",
            },
            {
              id: "linux-2",
              title: "Linux Distributions",
              duration: "22:15",
              type: "video",
              completed: true,
              description: "Popular Linux distributions and their use cases",
              videoUrl: "https://example.com/linux2.mp4",
            },
            {
              id: "linux-3",
              title: "File System Hierarchy",
              duration: "25:45",
              type: "video",
              completed: true,
              description: "Understanding the Linux file system structure",
              videoUrl: "https://example.com/linux3.mp4",
            },
            {
              id: "linux-4",
              title: "Basic Commands",
              duration: "30:20",
              type: "video",
              completed: false,
              description: "Essential Linux commands every user should know",
              videoUrl: "https://example.com/linux4.mp4",
            },
          ],
        },
        {
          id: "navigation",
          title: "File System Navigation",
          lessons: [
            {
              id: "nav-1",
              title: "Directory Navigation",
              duration: "20:15",
              type: "video",
              completed: false,
              description: "Navigate the file system efficiently",
              videoUrl: "https://example.com/nav1.mp4",
            },
            {
              id: "nav-2",
              title: "File Operations",
              duration: "25:30",
              type: "video",
              completed: false,
              description: "Create, copy, move, and delete files",
              videoUrl: "https://example.com/nav2.mp4",
            },
          ],
        },
      ],
      labs: [
        {
          id: "linux-lab-1",
          name: "Terminal Navigation Challenge",
          description: "Master file system navigation",
          difficulty: "Beginner",
          duration: "30 min",
          completed: true,
          available: true,
        },
        {
          id: "linux-lab-2",
          name: "Permission Puzzle",
          description: "Configure file permissions",
          difficulty: "Beginner",
          duration: "45 min",
          completed: false,
          available: true,
        },
        {
          id: "linux-lab-3",
          name: "Script Writing Workshop",
          description: "Write your first bash scripts",
          difficulty: "Intermediate",
          duration: "60 min",
          completed: false,
          available: true,
        },
      ],
      playground: {
        title: "Linux Terminal Playground",
        description: "Full Linux terminal environment for practice",
        tools: ["Terminal", "File Manager", "Text Editor", "Process Monitor"],
        available: true,
      },
      resources: [
        { name: "Linux Command Reference", type: "PDF", size: "1.8 MB" },
        { name: "Shell Scripting Guide", type: "PDF", size: "2.4 MB" },
        { name: "Vim Quick Reference", type: "PDF", size: "500 KB" },
        { name: "System Administration Basics", type: "PDF", size: "3.1 MB" },
      ],
      games: [
        {
          id: "command-master",
          name: "Command Line Master",
          description: "Speed typing game for Linux commands",
          difficulty: "Beginner",
          duration: "10 min",
          icon: Terminal,
          available: true,
        },
        {
          id: "permission-puzzler",
          name: "Permission Puzzler",
          description: "Solve file permission challenges",
          difficulty: "Intermediate",
          duration: "15 min",
          icon: Lock,
          available: true,
        },
        {
          id: "bash-warrior",
          name: "Bash Warrior",
          description: "Advanced shell scripting challenges",
          difficulty: "Advanced",
          duration: "25 min",
          icon: Code,
          available: false,
        },
      ],
    },
    "networking-basics": {
      title: "Networking Fundamentals",
      description: "Understanding network protocols and basic concepts",
      icon: Network,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30",
      totalLessons: 25,
      completedLessons: 15,
      progress: 60,
      sections: [
        {
          id: "fundamentals",
          title: "Network Fundamentals",
          lessons: [
            {
              id: "net-1",
              title: "OSI Model Deep Dive",
              duration: "28:30",
              type: "video",
              completed: true,
              description: "Understanding the seven layers of the OSI model",
              videoUrl: "https://example.com/net1.mp4",
            },
            {
              id: "net-2",
              title: "TCP/IP Protocol Suite",
              duration: "32:15",
              type: "video",
              completed: true,
              description: "Core protocols of the internet",
              videoUrl: "https://example.com/net2.mp4",
            },
            {
              id: "net-3",
              title: "DNS and DHCP",
              duration: "24:45",
              type: "video",
              completed: false,
              description: "Domain name resolution and IP assignment",
              videoUrl: "https://example.com/net3.mp4",
            },
          ],
        },
        {
          id: "protocols",
          title: "Network Protocols",
          lessons: [
            {
              id: "proto-1",
              title: "HTTP and HTTPS",
              duration: "26:20",
              type: "video",
              completed: false,
              description: "Web protocols and security",
              videoUrl: "https://example.com/proto1.mp4",
            },
            {
              id: "proto-2",
              title: "Email Protocols",
              duration: "22:10",
              type: "video",
              completed: false,
              description: "SMTP, POP3, and IMAP explained",
              videoUrl: "https://example.com/proto2.mp4",
            },
          ],
        },
      ],
      labs: [
        {
          id: "net-lab-1",
          name: "Network Discovery Lab",
          description: "Map network topology",
          difficulty: "Beginner",
          duration: "45 min",
          completed: false,
          available: true,
        },
        {
          id: "net-lab-2",
          name: "Protocol Analysis",
          description: "Analyze network protocols with Wireshark",
          difficulty: "Intermediate",
          duration: "60 min",
          completed: false,
          available: true,
        },
        {
          id: "net-lab-3",
          name: "Network Troubleshooting",
          description: "Diagnose and fix network issues",
          difficulty: "Intermediate",
          duration: "75 min",
          completed: false,
          available: true,
        },
      ],
      playground: {
        title: "Network Security Lab",
        description: "Virtual network environment for testing",
        tools: ["Wireshark", "Nmap", "Network Simulator", "Ping Tools"],
        available: true,
      },
      resources: [
        { name: "Network Protocol Reference", type: "PDF", size: "5.2 MB" },
        { name: "Wireshark Guide", type: "PDF", size: "3.4 MB" },
        { name: "TCP/IP Illustrated", type: "PDF", size: "8.7 MB" },
        { name: "Network Troubleshooting Guide", type: "PDF", size: "2.8 MB" },
      ],
      games: [
        {
          id: "packet-sniffer",
          name: "Packet Sniffer Challenge",
          description: "Analyze network packets to find threats",
          difficulty: "Intermediate",
          duration: "20 min",
          icon: Network,
          available: true,
        },
        {
          id: "port-scanner",
          name: "Port Scanner Simulator",
          description: "Discover open ports and services",
          difficulty: "Beginner",
          duration: "15 min",
          icon: Search,
          available: true,
        },
        {
          id: "network-defender",
          name: "Network Defender",
          description: "Defend against network attacks in real-time",
          difficulty: "Advanced",
          duration: "30 min",
          icon: Shield,
          available: true,
        },
      ],
    },
    "web-security-intro": {
      title: "Introduction to Web Security",
      description:
        "Basic web application security concepts and common vulnerabilities",
      icon: Globe,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/30",
      totalLessons: 18,
      completedLessons: 7,
      progress: 40,
      sections: [
        {
          id: "fundamentals",
          title: "Web Security Fundamentals",
          lessons: [
            {
              id: "web-1",
              title: "Web Architecture Security",
              duration: "25:15",
              type: "video",
              completed: true,
              description: "Security considerations in web architecture",
              videoUrl: "https://example.com/web1.mp4",
            },
            {
              id: "web-2",
              title: "HTTP Security Headers",
              duration: "18:30",
              type: "video",
              completed: true,
              description: "Important security headers for web applications",
              videoUrl: "https://example.com/web2.mp4",
            },
            {
              id: "web-3",
              title: "Basic XSS Understanding",
              duration: "22:45",
              type: "video",
              completed: false,
              description: "Introduction to Cross-Site Scripting",
              videoUrl: "https://example.com/web3.mp4",
            },
          ],
        },
        {
          id: "vulnerabilities",
          title: "Common Vulnerabilities",
          lessons: [
            {
              id: "vuln-1",
              title: "SQL Injection Basics",
              duration: "28:20",
              type: "video",
              completed: false,
              description: "Understanding SQL injection attacks",
              videoUrl: "https://example.com/vuln1.mp4",
            },
            {
              id: "vuln-2",
              title: "CSRF Protection",
              duration: "20:10",
              type: "video",
              completed: false,
              description: "Cross-Site Request Forgery prevention",
              videoUrl: "https://example.com/vuln2.mp4",
            },
          ],
        },
      ],
      labs: [
        {
          id: "web-intro-lab-1",
          name: "Basic XSS Lab",
          description: "Practice identifying XSS vulnerabilities",
          difficulty: "Beginner",
          duration: "30 min",
          completed: false,
          available: true,
        },
        {
          id: "web-intro-lab-2",
          name: "SQL Injection Discovery",
          description: "Find SQL injection vulnerabilities",
          difficulty: "Beginner",
          duration: "45 min",
          completed: false,
          available: true,
        },
        {
          id: "web-intro-lab-3",
          name: "Security Headers Lab",
          description: "Configure security headers",
          difficulty: "Beginner",
          duration: "35 min",
          completed: false,
          available: true,
        },
      ],
      playground: {
        title: "Web Security Testing Lab",
        description: "Safe environment for web security testing",
        tools: [
          "Burp Suite Community",
          "DVWA",
          "Basic Scanners",
          "Browser Tools",
        ],
        available: true,
      },
      resources: [
        { name: "OWASP Top 10 Basics", type: "PDF", size: "2.8 MB" },
        { name: "Web Security Checklist", type: "PDF", size: "1.2 MB" },
        { name: "HTTP Security Headers Guide", type: "PDF", size: "950 KB" },
        { name: "Basic XSS Prevention", type: "PDF", size: "1.5 MB" },
      ],
      games: [
        {
          id: "xss-hunter-basic",
          name: "XSS Hunter Basics",
          description: "Find basic XSS vulnerabilities",
          difficulty: "Beginner",
          duration: "15 min",
          icon: Code,
          available: true,
        },
        {
          id: "sql-detective",
          name: "SQL Detective",
          description: "Detect SQL injection vulnerabilities",
          difficulty: "Beginner",
          duration: "20 min",
          icon: Database,
          available: true,
        },
        {
          id: "security-headers",
          name: "Security Headers Challenge",
          description: "Configure proper security headers",
          difficulty: "Beginner",
          duration: "12 min",
          icon: Shield,
          available: true,
        },
      ],
    },
    "digital-forensics-basics": {
      title: "Digital Forensics Basics",
      description:
        "Introduction to digital evidence and investigation techniques",
      icon: Eye,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
      totalLessons: 16,
      completedLessons: 3,
      progress: 20,
      sections: [
        {
          id: "fundamentals",
          title: "Forensics Fundamentals",
          lessons: [
            {
              id: "forensics-1",
              title: "Evidence Handling",
              duration: "22:30",
              type: "video",
              completed: true,
              description: "Proper handling of digital evidence",
              videoUrl: "https://example.com/forensics1.mp4",
            },
            {
              id: "forensics-2",
              title: "Chain of Custody",
              duration: "18:45",
              type: "video",
              completed: true,
              description: "Maintaining evidence integrity",
              videoUrl: "https://example.com/forensics2.mp4",
            },
            {
              id: "forensics-3",
              title: "File System Analysis",
              duration: "28:15",
              type: "video",
              completed: false,
              description: "Understanding file systems for forensics",
              videoUrl: "https://example.com/forensics3.mp4",
            },
          ],
        },
        {
          id: "tools",
          title: "Forensics Tools",
          lessons: [
            {
              id: "tools-1",
              title: "Autopsy Introduction",
              duration: "35:20",
              type: "video",
              completed: false,
              description: "Getting started with Autopsy",
              videoUrl: "https://example.com/tools1.mp4",
            },
            {
              id: "tools-2",
              title: "Volatility Framework",
              duration: "32:10",
              type: "video",
              completed: false,
              description: "Memory analysis with Volatility",
              videoUrl: "https://example.com/tools2.mp4",
            },
          ],
        },
      ],
      labs: [
        {
          id: "forensics-lab-1",
          name: "Evidence Collection",
          description: "Practice proper evidence collection",
          difficulty: "Beginner",
          duration: "60 min",
          completed: false,
          available: true,
        },
        {
          id: "forensics-lab-2",
          name: "File Recovery Challenge",
          description: "Recover deleted files",
          difficulty: "Beginner",
          duration: "45 min",
          completed: false,
          available: true,
        },
        {
          id: "forensics-lab-3",
          name: "Timeline Analysis",
          description: "Create forensic timelines",
          difficulty: "Intermediate",
          duration: "75 min",
          completed: false,
          available: true,
        },
      ],
      playground: {
        title: "Digital Forensics Lab",
        description: "Forensics tools and evidence analysis environment",
        tools: ["Autopsy", "Volatility", "FTK Imager", "Hex Editors"],
        available: true,
      },
      resources: [
        { name: "Digital Forensics Handbook", type: "PDF", size: "6.2 MB" },
        { name: "Evidence Collection Guide", type: "PDF", size: "2.8 MB" },
        { name: "Autopsy User Manual", type: "PDF", size: "4.1 MB" },
        { name: "Memory Forensics Guide", type: "PDF", size: "3.5 MB" },
      ],
      games: [
        {
          id: "evidence-hunter",
          name: "Evidence Hunter",
          description: "Find hidden evidence in digital artifacts",
          difficulty: "Beginner",
          duration: "25 min",
          icon: Eye,
          available: true,
        },
        {
          id: "timeline-master",
          name: "Timeline Master",
          description: "Create accurate forensic timelines",
          difficulty: "Intermediate",
          duration: "30 min",
          icon: Clock,
          available: true,
        },
        {
          id: "recovery-expert",
          name: "Recovery Expert",
          description: "Recover deleted and hidden data",
          difficulty: "Intermediate",
          duration: "35 min",
          icon: Database,
          available: false,
        },
      ],
    },
    "advanced-networking": {
      title: "Advanced Network Security",
      description:
        "Network monitoring, intrusion detection, and security protocols",
      icon: Network,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30",
      totalLessons: 22,
      completedLessons: 7,
      progress: 30,
      sections: [
        {
          id: "ids-ips",
          title: "Intrusion Detection Systems",
          lessons: [
            {
              id: "ids-1",
              title: "IDS vs IPS Overview",
              duration: "24:30",
              type: "video",
              completed: true,
              description: "Understanding intrusion detection and prevention",
              videoUrl: "https://example.com/ids1.mp4",
            },
            {
              id: "ids-2",
              title: "Snort Configuration",
              duration: "32:15",
              type: "video",
              completed: true,
              description: "Setting up and configuring Snort IDS",
              videoUrl: "https://example.com/ids2.mp4",
            },
            {
              id: "ids-3",
              title: "Rule Writing",
              duration: "28:45",
              type: "video",
              completed: false,
              description: "Writing custom Snort rules",
              videoUrl: "https://example.com/ids3.mp4",
            },
          ],
        },
        {
          id: "monitoring",
          title: "Network Monitoring",
          lessons: [
            {
              id: "mon-1",
              title: "Traffic Analysis",
              duration: "30:20",
              type: "video",
              completed: false,
              description: "Analyzing network traffic patterns",
              videoUrl: "https://example.com/mon1.mp4",
            },
            {
              id: "mon-2",
              title: "SIEM Integration",
              duration: "26:10",
              type: "video",
              completed: false,
              description: "Integrating with SIEM systems",
              videoUrl: "https://example.com/mon2.mp4",
            },
          ],
        },
      ],
      labs: [
        {
          id: "adv-net-lab-1",
          name: "IDS Setup Lab",
          description: "Configure and deploy Snort IDS",
          difficulty: "Intermediate",
          duration: "90 min",
          completed: false,
          available: true,
        },
        {
          id: "adv-net-lab-2",
          name: "Traffic Analysis Challenge",
          description: "Analyze suspicious network traffic",
          difficulty: "Intermediate",
          duration: "75 min",
          completed: false,
          available: true,
        },
        {
          id: "adv-net-lab-3",
          name: "Network Forensics Lab",
          description: "Investigate network incidents",
          difficulty: "Advanced",
          duration: "120 min",
          completed: false,
          available: true,
        },
      ],
      playground: {
        title: "Advanced Network Security Lab",
        description: "Professional-grade network security tools",
        tools: [
          "Snort",
          "Suricata",
          "Security Onion",
          "ELK Stack",
          "Wireshark",
        ],
        available: true,
      },
      resources: [
        { name: "Advanced IDS Guide", type: "PDF", size: "7.8 MB" },
        { name: "Network Security Monitoring", type: "PDF", size: "9.2 MB" },
        { name: "Snort Cookbook", type: "PDF", size: "4.6 MB" },
        { name: "Traffic Analysis Handbook", type: "PDF", size: "5.8 MB" },
      ],
      games: [
        {
          id: "ids-master",
          name: "IDS Configuration Master",
          description: "Configure IDS systems to detect threats",
          difficulty: "Intermediate",
          duration: "30 min",
          icon: Shield,
          available: true,
        },
        {
          id: "traffic-detective",
          name: "Traffic Detective",
          description: "Analyze network traffic for anomalies",
          difficulty: "Intermediate",
          duration: "25 min",
          icon: Search,
          available: true,
        },
        {
          id: "network-sentinel",
          name: "Network Sentinel",
          description: "Monitor and defend enterprise networks",
          difficulty: "Advanced",
          duration: "45 min",
          icon: Eye,
          available: false,
        },
      ],
    },
    "web-application-security": {
      title: "Web Application Security",
      description: "Advanced web vulnerabilities and exploitation techniques",
      icon: Code,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/30",
      totalLessons: 28,
      completedLessons: 13,
      progress: 45,
      sections: [
        {
          id: "owasp",
          title: "OWASP Top 10",
          lessons: [
            {
              id: "owasp-1",
              title: "Injection Attacks",
              duration: "35:30",
              type: "video",
              completed: true,
              description: "SQL, NoSQL, and command injection techniques",
              videoUrl: "https://example.com/owasp1.mp4",
            },
            {
              id: "owasp-2",
              title: "Broken Authentication",
              duration: "28:15",
              type: "video",
              completed: true,
              description: "Authentication bypass techniques",
              videoUrl: "https://example.com/owasp2.mp4",
            },
            {
              id: "owasp-3",
              title: "Sensitive Data Exposure",
              duration: "24:45",
              type: "video",
              completed: false,
              description: "Finding and exploiting data exposure",
              videoUrl: "https://example.com/owasp3.mp4",
            },
          ],
        },
        {
          id: "advanced",
          title: "Advanced Techniques",
          lessons: [
            {
              id: "adv-1",
              title: "Advanced XSS",
              duration: "40:20",
              type: "video",
              completed: false,
              description: "DOM-based and stored XSS exploitation",
              videoUrl: "https://example.com/adv1.mp4",
            },
            {
              id: "adv-2",
              title: "Business Logic Flaws",
              duration: "32:10",
              type: "video",
              completed: false,
              description: "Identifying and exploiting logic flaws",
              videoUrl: "https://example.com/adv2.mp4",
            },
          ],
        },
      ],
      labs: [
        {
          id: "web-app-lab-1",
          name: "Advanced SQL Injection Lab",
          description: "Master complex SQL injection techniques",
          difficulty: "Intermediate",
          duration: "120 min",
          completed: false,
          available: true,
        },
        {
          id: "web-app-lab-2",
          name: "XSS Exploitation Workshop",
          description: "Advanced XSS attack vectors",
          difficulty: "Intermediate",
          duration: "90 min",
          completed: false,
          available: true,
        },
        {
          id: "web-app-lab-3",
          name: "Authentication Bypass Lab",
          description: "Bypass authentication mechanisms",
          difficulty: "Advanced",
          duration: "150 min",
          completed: false,
          available: true,
        },
      ],
      playground: {
        title: "Advanced Web Security Lab",
        description: "Professional web application testing environment",
        tools: ["Burp Suite Pro", "DVWA", "WebGoat", "SQLMap", "Custom Apps"],
        available: true,
      },
      resources: [
        { name: "OWASP Testing Guide", type: "PDF", size: "12.4 MB" },
        { name: "Advanced Web Attacks", type: "PDF", size: "8.7 MB" },
        { name: "Burp Suite Mastery", type: "PDF", size: "6.3 MB" },
        { name: "JavaScript Security", type: "PDF", size: "4.9 MB" },
      ],
      games: [
        {
          id: "xss-master",
          name: "XSS Master",
          description: "Advanced cross-site scripting challenges",
          difficulty: "Intermediate",
          duration: "35 min",
          icon: Code,
          available: true,
        },
        {
          id: "sql-ninja",
          name: "SQL Injection Ninja",
          description: "Master advanced SQL injection techniques",
          difficulty: "Advanced",
          duration: "45 min",
          icon: Database,
          available: true,
        },
        {
          id: "web-hacker",
          name: "Web Application Hacker",
          description: "Complete web application penetration testing",
          difficulty: "Expert",
          duration: "60 min",
          icon: Target,
          available: false,
        },
      ],
    },
    "social-engineering-osint": {
      title: "Social Engineering & OSINT",
      description: "Human psychology, information gathering, and awareness",
      icon: Users,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
      totalLessons: 20,
      completedLessons: 3,
      progress: 15,
      sections: [
        {
          id: "psychology",
          title: "Social Psychology",
          lessons: [
            {
              id: "psych-1",
              title: "Psychology of Persuasion",
              duration: "32:30",
              type: "video",
              completed: true,
              description: "Understanding human psychology in security",
              videoUrl: "https://example.com/psych1.mp4",
            },
            {
              id: "psych-2",
              title: "Cognitive Biases",
              duration: "26:15",
              type: "video",
              completed: true,
              description: "How cognitive biases affect security decisions",
              videoUrl: "https://example.com/psych2.mp4",
            },
            {
              id: "psych-3",
              title: "Trust and Authority",
              duration: "24:45",
              type: "video",
              completed: false,
              description: "Exploiting trust and authority in attacks",
              videoUrl: "https://example.com/psych3.mp4",
            },
          ],
        },
        {
          id: "osint",
          title: "OSINT Techniques",
          lessons: [
            {
              id: "osint-1",
              title: "Information Gathering Basics",
              duration: "30:20",
              type: "video",
              completed: false,
              description: "Fundamentals of open source intelligence",
              videoUrl: "https://example.com/osint1.mp4",
            },
            {
              id: "osint-2",
              title: "Social Media Intelligence",
              duration: "28:10",
              type: "video",
              completed: false,
              description: "Gathering intelligence from social platforms",
              videoUrl: "https://example.com/osint2.mp4",
            },
          ],
        },
      ],
      labs: [
        {
          id: "se-osint-lab-1",
          name: "OSINT Investigation Lab",
          description: "Conduct ethical intelligence gathering",
          difficulty: "Beginner",
          duration: "90 min",
          completed: false,
          available: true,
        },
        {
          id: "se-osint-lab-2",
          name: "Phishing Campaign Analysis",
          description: "Analyze real phishing campaigns",
          difficulty: "Intermediate",
          duration: "75 min",
          completed: false,
          available: true,
        },
        {
          id: "se-osint-lab-3",
          name: "Social Engineering Simulation",
          description: "Ethical social engineering exercise",
          difficulty: "Advanced",
          duration: "120 min",
          completed: false,
          available: true,
        },
      ],
      playground: {
        title: "OSINT Investigation Lab",
        description: "Safe environment for intelligence gathering practice",
        tools: [
          "OSINT Framework",
          "Social Media Tools",
          "Search Techniques",
          "Maltego",
        ],
        available: true,
      },
      resources: [
        { name: "OSINT Framework Guide", type: "PDF", size: "6.8 MB" },
        { name: "Social Engineering Tactics", type: "PDF", size: "4.3 MB" },
        { name: "Phishing Prevention Guide", type: "PDF", size: "3.2 MB" },
        { name: "Information Gathering Tools", type: "ZIP", size: "25.6 MB" },
      ],
      games: [
        {
          id: "phishing-simulator",
          name: "Phishing Email Simulator",
          description: "Create and analyze phishing emails",
          difficulty: "Intermediate",
          duration: "30 min",
          icon: Target,
          available: true,
        },
        {
          id: "osint-detective",
          name: "OSINT Detective",
          description: "Gather intelligence using open sources",
          difficulty: "Beginner",
          duration: "20 min",
          icon: Search,
          available: true,
        },
        {
          id: "social-hacker",
          name: "Social Engineering Master",
          description: "Master psychological manipulation techniques",
          difficulty: "Advanced",
          duration: "40 min",
          icon: Brain,
          available: true,
        },
      ],
    },
  };

  const course = enrolledCourses[courseId as keyof typeof enrolledCourses];

  // Helper functions - with null checks to prevent errors
  const getAllLessons = () => {
    if (!course || !course.sections) return [];
    return course.sections.flatMap((section) => section.lessons);
  };

  const getCurrentLesson = () => {
    const allLessons = getAllLessons();
    return allLessons[currentVideo] || allLessons[0];
  };

  const nextLesson = () => {
    const allLessons = getAllLessons();
    if (currentVideo < allLessons.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setVideoProgress(0);
      // Reset playground to the first available mode for the new lesson
      const newCurrentVideo = currentVideo + 1;
      const newLesson = allLessons[newCurrentVideo];
      if (newLesson) {
        const newPlaygroundModes = getPlaygroundModes();
        if (newPlaygroundModes.length > 0) {
          setPlaygroundMode(newPlaygroundModes[0].id);
        }
      }
    }
  };

  const previousLesson = () => {
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
      setVideoProgress(0);
      // Reset playground to the first available mode for the new lesson
      const newCurrentVideo = currentVideo - 1;
      const allLessons = getAllLessons();
      const newLesson = allLessons[newCurrentVideo];
      if (newLesson) {
        const newPlaygroundModes = getPlaygroundModes();
        if (newPlaygroundModes.length > 0) {
          setPlaygroundMode(newPlaygroundModes[0].id);
        }
      }
    }
  };

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  // Check if current lesson needs playground
  const needsPlayground = () => {
    const lesson = getCurrentLesson();
    return lesson?.type === "video" || lesson?.type === "text";
  };

  // Get playground modes based on course type
  const getPlaygroundModes = () => {
    switch (courseId) {
      case "web-security-intro":
      case "web-application-security":
        return [
          { id: "web-scanner", label: "Web Scanner" },
          { id: "sql-injection", label: "SQL Injection" },
          { id: "xss-lab", label: "XSS Lab" },
          { id: "ai-chat", label: "AI Chat" },
        ];
      case "social-engineering-osint":
        return [
          { id: "osint-tools", label: "OSINT Tools" },
          { id: "phishing-sim", label: "Phishing Sim" },
          { id: "social-analysis", label: "Social Analysis" },
          { id: "ai-chat", label: "AI Chat" },
        ];
      case "networking-basics":
      case "advanced-networking":
        return [
          { id: "network-scanner", label: "Network Scanner" },
          { id: "packet-analysis", label: "Packet Analysis" },
          { id: "port-scanner", label: "Port Scanner" },
          { id: "ai-chat", label: "AI Chat" },
        ];
      case "linux-basics":
        return [
          { id: "terminal", label: "Terminal" },
          { id: "file-analysis", label: "File Analysis" },
          { id: "log-analysis", label: "Log Analysis" },
          { id: "ai-chat", label: "AI Chat" },
        ];
      case "digital-forensics-basics":
        return [
          { id: "evidence-analysis", label: "Evidence Analysis" },
          { id: "file-recovery", label: "File Recovery" },
          { id: "timeline-analysis", label: "Timeline Analysis" },
          { id: "ai-chat", label: "AI Chat" },
        ];
      case "foundations":
        return [
          { id: "risk-calculator", label: "Risk Calculator" },
          { id: "policy-builder", label: "Policy Builder" },
          { id: "compliance-checker", label: "Compliance Checker" },
          { id: "ai-chat", label: "AI Chat" },
        ];
      default:
        return [
          { id: "terminal", label: "Terminal" },
          { id: "analysis", label: "Analysis" },
          { id: "ai-chat", label: "AI Chat" },
        ];
    }
  };

  // Update playground mode when video changes
  useEffect(() => {
    const modes = getPlaygroundModes();
    if (modes.length > 0) {
      setPlaygroundMode(modes[0].id);
    }
    // Reset terminal history for new lesson
    setTerminalHistory([
      {
        type: "output",
        content: "Last login: Mon Dec 16 14:32:01 on ttys000",
      },
      {
        type: "output",
        content: `Welcome to ${
          getCurrentLesson()?.title || "Cybersecurity"
        } Terminal`,
      },
    ]);
    setAnalysisResult("");
    setAnalysisInput("");
  }, [currentVideo, courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <p className="text-green-300/80 mb-4">
            The requested course "{courseId}" is not available or doesn't exist.
          </p>
          <p className="text-green-300/60 mb-8 text-sm">
            Available courses: {Object.keys(enrolledCourses).join(", ")}
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => navigate("/overview")}
              className="bg-green-400 text-black hover:bg-green-300 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
            <Button
              onClick={() => navigate("/learn/foundations")}
              variant="outline"
              className="border-green-400/30 text-green-400 hover:bg-green-400/10"
            >
              Try Foundations Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20";
      case "advanced":
        return "text-red-400 bg-red-400/20";
      case "expert":
        return "text-purple-400 bg-purple-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "zip":
        return <Download className="w-4 h-4" />;
      case "html":
        return <Globe className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const currentLesson = getCurrentLesson();
  const playgroundModes = getPlaygroundModes();

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pt-5 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Terminal-style Navigation Bar */}
          <div className="bg-black border-2 border-green-400/50 rounded-lg mb-6 overflow-hidden">
            {/* Terminal header */}
            <div className="bg-green-400/10 border-b border-green-400/30 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-green-400/60 text-xs font-mono">
                  cybersec-academy/course/{courseId}
                </div>
              </div>
            </div>

            {/* Navigation content */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* File explorer style breadcrumb */}
                  <div className="flex items-center space-x-2 text-green-400 font-mono text-sm">
                    <span className="text-green-400/60">📁</span>
                    <span className="text-green-400/60">courses</span>
                    <span className="text-green-400/60">/</span>
                    <span className="text-green-400">{courseId}</span>
                    <span className="text-green-400/60">/</span>
                    <span className="text-green-400 animate-pulse">
                      learning
                    </span>
                  </div>
                </div>

                {/* Back buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/course/${courseId}`)}
                    className="text-green-400 hover:bg-green-400/10 border border-green-400/30 font-mono text-xs"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    COURSE_DETAILS
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/overview")}
                    className="text-green-400 hover:bg-green-400/10 border border-green-400/30 font-mono text-xs"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    OVERVIEW
                  </Button>
                </div>
              </div>
            </div>

            {/* Scan line effect */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse"></div>
          </div>

          {/* Course Header with Compact Progress */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 ${course.bgColor} ${course.borderColor} border-2 rounded-full flex items-center justify-center`}
              >
                <course.icon className={`w-6 h-6 ${course.color}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-1">
                  {course.title}
                </h1>
                <p className="text-green-300/80">{course.description}</p>
              </div>
            </div>

            {/* Compact Progress Card */}
            <div className="bg-black/50 border border-green-400/30 rounded-lg p-3 min-w-[200px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-400 font-medium">
                  Progress
                </span>
                <span className="text-sm text-green-400 font-bold">
                  {course.progress}%
                </span>
              </div>
              <Progress
                value={course.progress}
                className="h-1.5 bg-black border border-green-400/30 mb-1"
              />
              <div className="text-xs text-green-300/70">
                {course.completedLessons}/{course.totalLessons} lessons
              </div>
            </div>
          </div>

          {/* Floating Learning Progress Button */}
          <Button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-1/2 right-4 z-50 bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30 rounded-full w-12 h-12 p-0"
          >
            <List className="w-5 h-5" />
          </Button>

          {/* Learning Progress Sidebar - Fixed opacity */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div
                className="absolute inset-0 bg-black/20"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="bg-black border-l border-green-400/30 w-96 h-full overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-green-400">
                      Learning Path
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(false)}
                      className="text-green-400 hover:bg-green-400/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {course.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="space-y-2">
                        <div className="font-medium text-green-400 text-sm">
                          {section.title}
                        </div>
                        <div className="space-y-1">
                          {section.lessons.map((lesson, lessonIndex) => {
                            const flatIndex =
                              course.sections
                                .slice(0, sectionIndex)
                                .reduce((acc, s) => acc + s.lessons.length, 0) +
                              lessonIndex;

                            return (
                              <div
                                key={lesson.id}
                                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                                  currentVideo === flatIndex
                                    ? "border-green-400 bg-green-400/10"
                                    : "border-green-400/30 hover:border-green-400/50"
                                }`}
                                onClick={() => {
                                  setCurrentVideo(flatIndex);
                                  setSidebarOpen(false);
                                  // Reset playground to the first available mode for the new lesson
                                  const allLessons = getAllLessons();
                                  const newLesson = allLessons[flatIndex];
                                  if (newLesson) {
                                    const newPlaygroundModes =
                                      getPlaygroundModes();
                                    if (newPlaygroundModes.length > 0) {
                                      setPlaygroundMode(
                                        newPlaygroundModes[0].id
                                      );
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  {completedLessons.includes(lesson.id) ? (
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                  ) : (
                                    <div className="w-3 h-3 border border-green-400/30 rounded-full" />
                                  )}
                                  <div className="text-xs text-green-400">
                                    {lesson.title}
                                  </div>
                                </div>
                                <div className="text-xs text-green-300/70">
                                  {lesson.duration}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {needsPlayground() ? (
            // Split view for video/text with playground
            <div
              className="flex gap-2 mb-6 relative"
              style={{ height: "600px" }}
            >
              {/* Show Both Button - when both are minimized */}
              {videoMinimized && playgroundMinimized && (
                <div className="w-full flex items-center justify-center">
                  <Button
                    onClick={handleShowBoth}
                    className="bg-green-400 text-black hover:bg-green-300"
                  >
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Show Both Panes
                  </Button>
                </div>
              )}

              {/* Floating restore buttons */}
              {videoMinimized && !playgroundMinimized && (
                <div className="absolute top-4 right-16 z-10">
                  <Button
                    onClick={() => setVideoMinimized(false)}
                    className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30 rounded-full w-10 h-10 p-0"
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {playgroundMinimized && !videoMinimized && (
                <div className="absolute top-4 left-16 z-10">
                  <Button
                    onClick={() => setPlaygroundMinimized(false)}
                    className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30 rounded-full w-10 h-10 p-0"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Left Pane - Content */}
              {!videoMinimized && (
                <div
                  className={`bg-black/50 border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300 ${
                    playgroundMinimized ? "w-full" : `w-[${leftPaneWidth}%]`
                  }`}
                  style={{
                    width: playgroundMinimized ? "100%" : `${leftPaneWidth}%`,
                    minWidth: "300px",
                  }}
                >
                  {currentLesson?.type === "video" ? (
                    // Video Content
                    <div className="h-full flex flex-col">
                      <div className="p-4 border-b border-green-400/30 flex items-center justify-between">
                        <h3 className="text-green-400 font-semibold flex items-center">
                          <Video className="w-4 h-4 mr-2" />
                          {currentLesson?.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleVideoMinimize}
                          className="text-green-400 hover:bg-green-400/10"
                        >
                          <Minimize2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1 p-4 flex flex-col overflow-y-auto">
                        <div className="aspect-video bg-black border border-green-400/30 rounded-lg flex items-center justify-center mb-4 flex-shrink-0 relative">
                          {/* Mac-style video player */}
                          <div className="absolute top-2 left-2 flex space-x-1">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                              {isPlaying ? (
                                <Pause className="w-6 h-6 text-green-400" />
                              ) : (
                                <Play className="w-6 h-6 text-green-400" />
                              )}
                            </div>
                            <Button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="bg-green-400 text-black hover:bg-green-300"
                            >
                              {isPlaying ? "Pause" : "Play"} Video
                            </Button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-green-300/70">
                              Progress
                            </span>
                            <span className="text-sm text-green-400">
                              {currentLesson?.duration}
                            </span>
                          </div>
                          <Progress
                            value={videoProgress}
                            className="h-2 bg-black border border-green-400/30"
                          />
                        </div>

                        <p className="text-green-300/80 text-sm flex-1">
                          {currentLesson?.description}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              onClick={previousLesson}
                              disabled={currentVideo === 0}
                              className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                              size="sm"
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              onClick={nextLesson}
                              disabled={
                                currentVideo === getAllLessons().length - 1
                              }
                              className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                              size="sm"
                            >
                              Next
                            </Button>
                          </div>
                          <Button
                            onClick={() =>
                              currentLesson &&
                              markLessonComplete(currentLesson.id)
                            }
                            disabled={
                              currentLesson
                                ? completedLessons.includes(currentLesson.id)
                                : true
                            }
                            className="bg-green-400 text-black hover:bg-green-300"
                            size="sm"
                          >
                            {currentLesson &&
                            completedLessons.includes(currentLesson.id) ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Completed
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Text Content
                    <div className="h-full flex flex-col">
                      <div className="p-4 border-b border-green-400/30 flex items-center justify-between">
                        <h3 className="text-green-400 font-semibold flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {currentLesson?.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleVideoMinimize}
                          className="text-green-400 hover:bg-green-400/10"
                        >
                          <Minimize2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1 p-6 overflow-y-auto">
                        <div className="prose prose-invert max-w-none">
                          <p className="text-green-300/80 leading-relaxed">
                            {currentLesson?.content ||
                              currentLesson?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resize Handle - Only show when both panes are visible */}
              {!videoMinimized && !playgroundMinimized && (
                <div
                  ref={resizeRef}
                  className="w-2 bg-green-400/20 hover:bg-green-400/40 cursor-col-resize flex items-center justify-center group relative"
                  onMouseDown={handleMouseDown}
                >
                  <GripVertical className="w-4 h-4 text-green-400/60 group-hover:text-green-400" />
                </div>
              )}

              {/* Right Pane - AI Playground */}
              {!playgroundMinimized && (
                <div
                  className={`bg-black/50 border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300 ${
                    videoMinimized
                      ? "w-full"
                      : `w-[${100 - leftPaneWidth - 1}%]`
                  }`}
                  style={{
                    width: videoMinimized
                      ? "100%"
                      : `${100 - leftPaneWidth - 1}%`,
                    minWidth: "300px",
                  }}
                >
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-green-400/30">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-green-400 font-semibold flex items-center">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Try Here!
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePlaygroundMinimize}
                          className="text-green-400 hover:bg-green-400/10"
                        >
                          <Minimize2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex space-x-1 overflow-x-auto">
                        {playgroundModes.map(
                          (mode: { id: string; label: string }) => (
                            <Button
                              key={mode.id}
                              onClick={() => setPlaygroundMode(mode.id)}
                              variant={
                                playgroundMode === mode.id ? "default" : "ghost"
                              }
                              className={
                                playgroundMode === mode.id
                                  ? "bg-green-400 text-black h-7 px-2 text-xs whitespace-nowrap"
                                  : "text-green-400 hover:bg-green-400/10 h-7 px-2 text-xs whitespace-nowrap"
                              }
                            >
                              {mode.label}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                      {/* Mac-style Terminal Mode */}
                      {playgroundMode === "terminal" && (
                        <div className="h-full flex flex-col">
                          <div
                            className="flex-1 bg-black border border-green-400/30 rounded-lg font-mono text-sm overflow-y-auto relative"
                            style={{
                              padding: "20px 12px 12px",
                              background:
                                "linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)",
                              fontFamily:
                                "SF Mono, Monaco, Inconsolata, Roboto Mono, monospace",
                              boxShadow: "inset 0 2px 4px rgba(0,255,65,0.1)",
                            }}
                          >
                            {/* Mac terminal header */}
                            <div className="absolute top-2 left-4 flex space-x-1.5">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="absolute top-2 right-4 text-xs text-green-400/60">
                              {getCurrentLesson()?.title || "Terminal"}
                            </div>

                            <div className="space-y-1 mt-4">
                              {terminalHistory.map((entry, index) => (
                                <div
                                  key={index}
                                  className={`${
                                    entry.type === "command"
                                      ? "text-green-400"
                                      : entry.type === "ai"
                                      ? "text-blue-400 text-xs italic"
                                      : "text-green-300"
                                  }`}
                                >
                                  {entry.content}
                                </div>
                              ))}
                              <div className="flex">
                                <span className="text-green-400">
                                  user@cybersec:~${" "}
                                </span>
                                <input
                                  value={terminalInput}
                                  onChange={(e) =>
                                    setTerminalInput(e.target.value)
                                  }
                                  onKeyDown={handleTerminalKeyDown}
                                  className="bg-transparent border-none outline-none text-green-400 flex-1"
                                  style={{ fontFamily: "inherit" }}
                                  autoFocus
                                />
                                <span className="text-green-400">
                                  {terminalCursor}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SQL Injection Mode */}
                      {playgroundMode === "sql-injection" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              SQL Query Test Environment:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="SELECT * FROM users WHERE username = 'admin' AND password = '...'"
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none font-mono"
                            />
                          </div>
                          <Button
                            onClick={() => handleAnalysis(analysisInput)}
                            disabled={isAnalyzing || !analysisInput}
                            className="bg-green-400 text-black hover:bg-green-300"
                          >
                            {isAnalyzing ? (
                              <>
                                <Database className="w-4 h-4 mr-2 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Database className="w-4 h-4 mr-2" />
                                Test SQL
                              </>
                            )}
                          </Button>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Web Scanner Mode */}
                      {playgroundMode === "web-scanner" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Target URL:
                            </label>
                            <Input
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="https://example.com"
                              className="bg-black border-green-400/30 text-green-400"
                            />
                          </div>
                          <Button
                            onClick={() => handleAnalysis(analysisInput)}
                            disabled={isAnalyzing || !analysisInput}
                            className="bg-green-400 text-black hover:bg-green-300"
                          >
                            {isAnalyzing ? (
                              <>
                                <Search className="w-4 h-4 mr-2 animate-spin" />
                                Scanning...
                              </>
                            ) : (
                              <>
                                <Search className="w-4 h-4 mr-2" />
                                Start Scan
                              </>
                            )}
                          </Button>
                          {analysisResult && (
                            <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Analysis Mode */}
                      {playgroundMode === "analysis" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              Enter code or data for AI analysis:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Paste your code, config, or data here..."
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none"
                            />
                          </div>
                          <Button
                            onClick={() => handleAnalysis(analysisInput)}
                            disabled={isAnalyzing || !analysisInput}
                            className="bg-green-400 text-black hover:bg-green-300"
                          >
                            {isAnalyzing ? (
                              <>
                                <Brain className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Search className="w-4 h-4 mr-2" />
                                Analyze
                              </>
                            )}
                          </Button>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 mt-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Chat Mode */}
                      {playgroundMode === "ai-chat" && (
                        <div className="h-full flex flex-col">
                          <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto mb-4">
                            {aiChatMessages.map((message, index) => (
                              <div
                                key={index}
                                className={`mb-3 ${
                                  message.role === "user"
                                    ? "text-green-400"
                                    : "text-blue-400"
                                }`}
                              >
                                <div className="font-semibold text-xs mb-1">
                                  {message.role === "user"
                                    ? "You"
                                    : "🤖 AI Assistant"}
                                </div>
                                <div className="text-sm">{message.content}</div>
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Input
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleAiChat(chatInput)
                              }
                              placeholder="Ask about cybersecurity..."
                              className="bg-black border-green-400/30 text-green-400"
                            />
                            <Button
                              onClick={() => handleAiChat(chatInput)}
                              disabled={!chatInput}
                              className="bg-green-400 text-black hover:bg-green-300"
                              size="sm"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* OSINT Tools Mode */}
                      {playgroundMode === "osint-tools" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Target for OSINT Investigation:
                            </label>
                            <Input
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Enter domain, email, or username"
                              className="bg-black border-green-400/30 text-green-400"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(`Domain: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Domain Lookup
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Email: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Email Search
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Social: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Social Media
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Metadata: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Metadata
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Network Scanner Mode */}
                      {playgroundMode === "network-scanner" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Target Network/IP:
                            </label>
                            <Input
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="192.168.1.0/24 or 10.0.0.1"
                              className="bg-black border-green-400/30 text-green-400"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(`Ping: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Ping Scan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Port: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Port Scan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Service: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Service Scan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`OS: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              OS Detection
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* XSS Lab Mode */}
                      {playgroundMode === "xss-lab" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              XSS Payload Testing:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="<script>alert('XSS')</script>"
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Reflected XSS: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Test Reflected
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Stored XSS: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Test Stored
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`DOM XSS: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Test DOM
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Filter Bypass: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Filter Bypass
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Phishing Simulator Mode */}
                      {playgroundMode === "phishing-sim" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Email Template:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Subject: Urgent Account Verification Required..."
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Phishing Analysis: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Analyze Email
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Threat Score: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Threat Score
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Social Engineering: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              SE Analysis
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Detection: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Detection
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* File Analysis Mode */}
                      {playgroundMode === "file-analysis" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              File Content or Path:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="/var/log/auth.log or paste file content..."
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(`File Type: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              File Type
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Permissions: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Permissions
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Security Scan: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Security Scan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Metadata: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Metadata
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Log Analysis Mode */}
                      {playgroundMode === "log-analysis" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              Log Data:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Dec 16 10:30:01 server sshd[1234]: Failed password for root from 192.168.1.100..."
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Threat Detection: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Threat Detection
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Pattern Analysis: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Pattern Analysis
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Anomaly Detection: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Anomaly Detection
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`IP Analysis: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              IP Analysis
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Packet Analysis Mode */}
                      {playgroundMode === "packet-analysis" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              Packet Data (PCAP):
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Upload PCAP file or enter packet hex data..."
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Protocol Analysis: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Protocol Analysis
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Traffic Flow: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Traffic Flow
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Malicious Activity: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Malicious Activity
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Data Extraction: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Data Extraction
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Port Scanner Mode */}
                      {playgroundMode === "port-scanner" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Target IP/Domain:
                            </label>
                            <Input
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="192.168.1.1 or example.com"
                              className="bg-black border-green-400/30 text-green-400"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(`Quick Scan: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Quick Scan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Full Scan: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Full Scan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`UDP Scan: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              UDP Scan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Stealth Scan: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Stealth Scan
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Social Analysis Mode */}
                      {playgroundMode === "social-analysis" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Social Media Profile/Content:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Enter social media profile URL or content..."
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Profile Analysis: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Profile Analysis
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Sentiment Analysis: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Sentiment Analysis
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Network Mapping: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Network Mapping
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Behavior Patterns: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Behavior Patterns
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Evidence Analysis Mode */}
                      {playgroundMode === "evidence-analysis" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              Evidence Data:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Upload evidence file or enter metadata..."
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Hash Analysis: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Hash Analysis
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Metadata Extraction: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Metadata
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `File Signature: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              File Signature
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Chain of Custody: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Chain of Custody
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* File Recovery Mode */}
                      {playgroundMode === "file-recovery" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Recovery Target:
                            </label>
                            <Input
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="/dev/sda1 or file pattern *.pdf"
                              className="bg-black border-green-400/30 text-green-400 font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Deleted Files: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Scan Deleted
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Deep Scan: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Deep Scan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Unallocated Space: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Unallocated
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`File Carving: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              File Carving
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Timeline Analysis Mode */}
                      {playgroundMode === "timeline-analysis" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              Evidence Sources:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="List evidence sources: system logs, file timestamps, registry..."
                              className="bg-black border-green-400/30 text-green-400 h-32 resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Timeline Creation: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Create Timeline
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Event Correlation: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Correlate Events
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Timestamp Analysis: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Analyze Timestamps
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Activity Reconstruction: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Reconstruct Activity
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Risk Calculator Mode */}
                      {playgroundMode === "risk-calculator" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Risk Scenario:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Describe the security risk scenario..."
                              className="bg-black border-green-400/30 text-green-400 h-24 resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-green-400 mb-1 block">
                                Likelihood (1-5):
                              </label>
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                placeholder="3"
                                className="bg-black border-green-400/30 text-green-400 h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-green-400 mb-1 block">
                                Impact (1-5):
                              </label>
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                placeholder="4"
                                className="bg-black border-green-400/30 text-green-400 h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-green-400 mb-1 block">
                                Current Controls:
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                placeholder="2"
                                className="bg-black border-green-400/30 text-green-400 h-8"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Risk Assessment: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Calculate Risk
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Mitigation Plan: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Mitigation Plan
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="flex-1 bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Policy Builder Mode */}
                      {playgroundMode === "policy-builder" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Policy Type:
                            </label>
                            <select className="w-full bg-black border border-green-400/30 text-green-400 p-2 rounded">
                              <option>Password Policy</option>
                              <option>Access Control Policy</option>
                              <option>Data Classification Policy</option>
                              <option>Incident Response Policy</option>
                              <option>Acceptable Use Policy</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              Policy Requirements:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="Enter policy requirements and objectives..."
                              className="bg-black border-green-400/30 text-green-400 h-24 resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Policy Template: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Generate Template
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Compliance Check: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Compliance Check
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Compliance Checker Mode */}
                      {playgroundMode === "compliance-checker" && (
                        <div className="h-full flex flex-col space-y-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Compliance Framework:
                            </label>
                            <select className="w-full bg-black border border-green-400/30 text-green-400 p-2 rounded">
                              <option>NIST Cybersecurity Framework</option>
                              <option>ISO 27001</option>
                              <option>GDPR</option>
                              <option>SOX</option>
                              <option>HIPAA</option>
                              <option>PCI DSS</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="text-sm text-green-400 mb-2 block">
                              Current Controls:
                            </label>
                            <Textarea
                              value={analysisInput}
                              onChange={(e) => setAnalysisInput(e.target.value)}
                              placeholder="List your current security controls and implementations..."
                              className="bg-black border-green-400/30 text-green-400 h-24 resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Compliance Gap: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Gap Analysis
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Compliance Score: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Compliance Score
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(
                                  `Remediation Plan: ${analysisInput}`
                                )
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Remediation Plan
                            </Button>
                            <Button
                              onClick={() =>
                                handleAnalysis(`Audit Report: ${analysisInput}`)
                              }
                              className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                              size="sm"
                            >
                              Audit Report
                            </Button>
                          </div>
                          {analysisResult && (
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 overflow-y-auto max-h-48">
                              <pre className="text-green-300 text-xs whitespace-pre-wrap">
                                {analysisResult}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Full width for non-video/text content
            <div className="mb-6">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 flex items-center">
                    {currentLesson?.type === "quiz" && (
                      <Brain className="w-5 h-5 mr-2" />
                    )}
                    {currentLesson?.type === "lab" && (
                      <Zap className="w-5 h-5 mr-2" />
                    )}
                    {currentLesson?.type === "game" && (
                      <Activity className="w-5 h-5 mr-2" />
                    )}
                    {currentLesson?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {currentLesson?.type === "quiz" && (
                    <div className="space-y-4">
                      <p className="text-green-300/80">
                        {currentLesson?.description}
                      </p>
                      {/* Quiz implementation would go here */}
                      <div className="bg-black/50 border border-green-400/30 rounded-lg p-4">
                        <p className="text-green-400 mb-2">
                          Quiz functionality coming soon!
                        </p>
                        <p className="text-green-300/60 text-sm">
                          This will be an interactive quiz based on the lesson
                          content.
                        </p>
                      </div>
                    </div>
                  )}
                  {(currentLesson?.type === "lab" ||
                    currentLesson?.type === "game") && (
                    <div className="space-y-4">
                      <p className="text-green-300/80">
                        {currentLesson?.description}
                      </p>
                      <div className="bg-black/50 border border-green-400/30 rounded-lg p-6 text-center">
                        <p className="text-green-400 mb-2">
                          {currentLesson?.type === "lab"
                            ? "Lab Environment"
                            : "Interactive Game"}
                        </p>
                        <p className="text-green-300/60 text-sm mb-4">
                          {currentLesson?.type === "lab"
                            ? "Hands-on practice environment"
                            : "Interactive cybersecurity game"}
                        </p>
                        <Button className="bg-green-400 text-black hover:bg-green-300">
                          <Play className="w-4 h-4 mr-2" />
                          {currentLesson?.type === "lab"
                            ? "Launch Lab"
                            : "Start Game"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Tabs - Reordered */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-black/50 border-green-400/30">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                <FileText className="w-4 h-4 mr-1" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="labs"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                <Zap className="w-4 h-4 mr-1" />
                Labs
              </TabsTrigger>
              <TabsTrigger
                value="games"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                <Activity className="w-4 h-4 mr-1" />
                Games
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                <Download className="w-4 h-4 mr-1" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-4">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-lg">
                    Lesson Details - {currentLesson?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Dynamic details based on lesson type */}
                    {(courseId === "web-security-intro" ||
                      courseId === "web-application-security") && (
                      <div className="space-y-6">
                        <details
                          open={expandedDetails["intro"]}
                          onToggle={(e) =>
                            setExpandedDetails((prev) => ({
                              ...prev,
                              intro: (e.target as HTMLDetailsElement).open,
                            }))
                          }
                        >
                          <summary className="cursor-pointer text-green-400 font-semibold mb-2 flex items-center">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            [00:00-02:30] Introduction to Web Security
                          </summary>
                          <div className="text-green-300/80 text-sm leading-relaxed ml-5 space-y-3">
                            <p>
                              Welcome to Web Application Security. In this
                              lesson, we'll explore the fundamental
                              vulnerabilities that plague modern web
                              applications.
                            </p>
                            <div className="bg-black/50 border border-green-400/30 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-green-400 text-xs font-mono">
                                  Example: Basic SQL Injection
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-green-400 hover:bg-green-400/10"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <pre className="text-green-300 text-xs font-mono overflow-x-auto">
                                {`// Vulnerable code
$query = "SELECT * FROM users WHERE username = '" . $_POST['username'] . "'";

// Secure code
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$_POST['username']]);`}
                              </pre>
                            </div>
                          </div>
                        </details>

                        <details
                          open={expandedDetails["owasp"]}
                          onToggle={(e) =>
                            setExpandedDetails((prev) => ({
                              ...prev,
                              owasp: (e.target as HTMLDetailsElement).open,
                            }))
                          }
                        >
                          <summary className="cursor-pointer text-green-400 font-semibold mb-2 flex items-center">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            [02:30-05:15] OWASP Top 10 Overview
                          </summary>
                          <div className="text-green-300/80 text-sm leading-relaxed ml-5 space-y-3">
                            <p>
                              The OWASP Top 10 represents the most critical
                              security risks to web applications:
                            </p>
                            <ol className="list-decimal list-inside space-y-1 text-xs">
                              <li>Injection (SQL, NoSQL, LDAP)</li>
                              <li>Broken Authentication</li>
                              <li>Sensitive Data Exposure</li>
                              <li>XML External Entities (XXE)</li>
                              <li>Broken Access Control</li>
                            </ol>
                          </div>
                        </details>

                        <details
                          open={expandedDetails["practical"]}
                          onToggle={(e) =>
                            setExpandedDetails((prev) => ({
                              ...prev,
                              practical: (e.target as HTMLDetailsElement).open,
                            }))
                          }
                        >
                          <summary className="cursor-pointer text-green-400 font-semibold mb-2 flex items-center">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            [05:15-08:00] Practical Testing Methods
                          </summary>
                          <div className="text-green-300/80 text-sm leading-relaxed ml-5">
                            <p>
                              Now let's look at how to test for these
                              vulnerabilities using tools like Burp Suite and
                              manual testing techniques.
                            </p>
                          </div>
                        </details>
                      </div>
                    )}

                    {courseId === "linux-basics" && (
                      <div className="space-y-6">
                        <details
                          open={expandedDetails["commands"]}
                          onToggle={(e) =>
                            setExpandedDetails((prev) => ({
                              ...prev,
                              commands: (e.target as HTMLDetailsElement).open,
                            }))
                          }
                        >
                          <summary className="cursor-pointer text-green-400 font-semibold mb-2 flex items-center">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            [00:00-03:00] Essential Linux Commands
                          </summary>
                          <div className="text-green-300/80 text-sm leading-relaxed ml-5 space-y-3">
                            <p>
                              Linux command line is the foundation of
                              cybersecurity. Let's start with essential
                              navigation commands.
                            </p>
                            <div className="bg-black/50 border border-green-400/30 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-green-400 text-xs font-mono">
                                  Common Commands
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-green-400 hover:bg-green-400/10"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <pre className="text-green-300 text-xs font-mono">
                                {`# Navigation
ls -la          # List files with details
cd /etc         # Change directory
pwd             # Print working directory

# File Operations
cat /etc/passwd # View file contents
grep "root" /etc/passwd # Search in files
find / -name "*.log" 2>/dev/null # Find files`}
                              </pre>
                            </div>
                          </div>
                        </details>

                        <details
                          open={expandedDetails["permissions"]}
                          onToggle={(e) =>
                            setExpandedDetails((prev) => ({
                              ...prev,
                              permissions: (e.target as HTMLDetailsElement)
                                .open,
                            }))
                          }
                        >
                          <summary className="cursor-pointer text-green-400 font-semibold mb-2 flex items-center">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            [03:00-06:30] File Permissions & Security
                          </summary>
                          <div className="text-green-300/80 text-sm leading-relaxed ml-5 space-y-3">
                            <p>
                              Understanding file permissions is crucial for
                              Linux security.
                            </p>
                            <div className="bg-black/50 border border-green-400/30 rounded p-3">
                              <pre className="text-green-300 text-xs font-mono">
                                {`# Permission format: rwxrwxrwx (user/group/other)
chmod 755 script.sh    # rwxr-xr-x
chmod u+s binary       # Set SUID bit (dangerous!)
chmod g+s directory    # Set SGID bit

# Find SUID/SGID files (privilege escalation)
find / -perm -4000 2>/dev/null  # SUID files
find / -perm -2000 2>/dev/null  # SGID files`}
                              </pre>
                            </div>
                          </div>
                        </details>
                      </div>
                    )}

                    {/* Default details for other courses */}
                    {![
                      "web-security-intro",
                      "web-application-security",
                      "linux-basics",
                    ].includes(courseId || "") && (
                      <div className="text-green-300/80 text-sm leading-relaxed">
                        <p className="mb-4">
                          <span className="text-green-400 font-semibold">
                            [00:00]
                          </span>{" "}
                          Welcome to this lesson on {currentLesson?.title}. In
                          this comprehensive guide, we'll explore the
                          fundamental concepts and practical applications.
                        </p>
                        <p className="mb-4">
                          <span className="text-green-400 font-semibold">
                            [01:30]
                          </span>{" "}
                          {currentLesson?.description}
                        </p>
                        <p className="mb-4">
                          <span className="text-green-400 font-semibold">
                            [03:15]
                          </span>{" "}
                          Let's start by understanding the key principles and
                          how they apply in real-world scenarios.
                        </p>
                        <p className="mb-4">
                          <span className="text-green-400 font-semibold">
                            [05:45]
                          </span>{" "}
                          It's important to note that these concepts form the
                          foundation for more advanced topics we'll cover later.
                        </p>
                        <p className="mb-4">
                          <span className="text-green-400 font-semibold">
                            [08:20]
                          </span>{" "}
                          Now, let's look at some practical examples and how to
                          implement these concepts in your own work.
                        </p>
                        <p className="mb-4">
                          <span className="text-green-400 font-semibold">
                            [12:00]
                          </span>{" "}
                          Remember to practice these techniques in a safe,
                          controlled environment before applying them
                          professionally.
                        </p>
                        <p>
                          <span className="text-green-400 font-semibold">
                            [{currentLesson?.duration}]
                          </span>{" "}
                          That concludes this lesson. Make sure to complete the
                          associated exercises and check out the additional
                          resources.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Labs Tab */}
            <TabsContent value="labs" className="mt-4">
              {activeLab ? (
                // Lab Detail View
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setActiveLab(null)}
                      className="text-green-400 hover:bg-green-400/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Labs
                    </Button>
                    <Button
                      onClick={() => {
                        window.open(
                          `/learn/${courseId}/lab/${activeLab}`,
                          "_blank"
                        );
                      }}
                      className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>

                  {/* Lab Environment */}
                  <Card className="bg-black/50 border-green-400/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-400 text-xl">
                        {course.labs.find((lab) => lab.id === activeLab)?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Dynamic lab content based on course and lab */}
                      {courseId === "web-security" &&
                        activeLab === "web-lab-1" && (
                          <div className="space-y-6">
                            <div className="bg-black/30 border border-green-400/30 rounded-lg p-4">
                              <h3 className="text-green-400 font-semibold mb-3">
                                SQL Injection Lab Environment
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm text-green-400 mb-2 block">
                                    Target URL:
                                  </label>
                                  <Input
                                    value="http://vulnerable-app.local/login.php"
                                    readOnly
                                    className="bg-black border-green-400/30 text-green-400 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-green-400 mb-2 block">
                                    Payload:
                                  </label>
                                  <Input
                                    placeholder="' OR 1=1 --"
                                    className="bg-black border-green-400/30 text-green-400 font-mono"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <Button className="bg-green-400 text-black hover:bg-green-300 mr-2">
                                  Test Injection
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                                >
                                  View Source
                                </Button>
                              </div>
                            </div>

                            <div className="bg-black/30 border border-yellow-400/30 rounded-lg p-4">
                              <h4 className="text-yellow-400 font-semibold mb-2">
                                Lab Instructions:
                              </h4>
                              <ol className="list-decimal list-inside space-y-2 text-green-300/80 text-sm">
                                <li>
                                  Identify the login form vulnerable to SQL
                                  injection
                                </li>
                                <li>Test various SQL injection payloads</li>
                                <li>Extract user data from the database</li>
                                <li>
                                  Document your findings and remediation steps
                                </li>
                              </ol>
                            </div>
                          </div>
                        )}

                      {courseId === "linux" && activeLab === "linux-lab-1" && (
                        <div className="space-y-6">
                          <div className="bg-black/30 border border-green-400/30 rounded-lg p-4">
                            <h3 className="text-green-400 font-semibold mb-3">
                              Terminal Navigation Challenge
                            </h3>
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 font-mono text-sm">
                              <div className="text-green-300 space-y-1">
                                <div>user@lab:~$ ls</div>
                                <div>
                                  Desktop Documents Downloads challenge_files
                                </div>
                                <div>user@lab:~$ cd challenge_files</div>
                                <div>user@lab:~/challenge_files$ ls -la</div>
                                <div>total 16</div>
                                <div>
                                  drwxr-xr-x 4 user user 4096 Dec 16 10:30 .
                                </div>
                                <div>
                                  drwxr-xr-x 3 user user 4096 Dec 16 10:29 ..
                                </div>
                                <div>
                                  -rw-r--r-- 1 user user 42 Dec 16 10:30
                                  .hidden_flag
                                </div>
                                <div>
                                  drwxr-xr-x 2 user user 4096 Dec 16 10:30
                                  secrets
                                </div>
                                <div className="flex">
                                  <span>user@lab:~/challenge_files$ </span>
                                  <input
                                    className="bg-transparent border-none outline-none text-green-400 flex-1"
                                    placeholder="Enter your command..."
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-black/30 border border-blue-400/30 rounded-lg p-4">
                            <h4 className="text-blue-400 font-semibold mb-2">
                              Challenge Objectives:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-green-300/80 text-sm">
                              <li>
                                Find the hidden flag in the current directory
                              </li>
                              <li>Navigate to the secrets directory</li>
                              <li>List all files including hidden ones</li>
                              <li>Read the contents of important files</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Default lab content */}
                      {(!activeLab ||
                        !["web-lab-1", "linux-lab-1"].includes(activeLab)) && (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-green-400 font-semibold mb-2">
                            Lab Environment Loading...
                          </h3>
                          <p className="text-green-300/70 text-sm">
                            Setting up your hands-on learning environment
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // Lab List View
                <div className="grid gap-4">
                  {course.labs.map((lab) => (
                    <Card
                      key={lab.id}
                      className="bg-black/50 border-green-400/30 hover:border-green-400 transition-colors"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-green-400 text-lg">
                            {lab.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={getDifficultyColor(lab.difficulty)}
                            >
                              {lab.difficulty}
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-green-300/70">
                              <Clock className="w-3 h-3" />
                              <span>{lab.duration}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-green-300/80 mb-4 text-sm">
                          {lab.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {lab.completed && (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                            <span className="text-sm text-green-300/70">
                              {lab.completed ? "Completed" : "Not started"}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            disabled={!lab.available}
                            className={
                              lab.available
                                ? "bg-green-400 text-black hover:bg-green-300"
                                : "bg-gray-600 text-gray-300 cursor-not-allowed"
                            }
                            onClick={() => {
                              if (lab.available) {
                                // Set active lab to show in-page view
                                setActiveLab(lab.id);
                              }
                            }}
                          >
                            {lab.available ? (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                {lab.completed ? "Retry Lab" : "Start Lab"}
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Locked
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Games Tab - Enhanced with Cybersecurity Games */}
            <TabsContent value="games" className="mt-4">
              {activeGame ? (
                // Game Detail View
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setActiveGame(null)}
                      className="text-green-400 hover:bg-green-400/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Games
                    </Button>
                    <Button
                      onClick={() => {
                        window.open(
                          `/learn/${courseId}/game/${activeGame}`,
                          "_blank"
                        );
                      }}
                      className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>

                  {/* Game Environment */}
                  <Card className="bg-black/50 border-green-400/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-400 text-xl">
                        {
                          course.games?.find((game) => game.id === activeGame)
                            ?.name
                        }
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Dynamic game content based on course and game */}
                      {activeGame === "xss-hunter" && (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg p-4">
                            <h3 className="text-red-400 font-semibold mb-3 flex items-center">
                              <Target className="w-5 h-5 mr-2" />
                              XSS Hunter Challenge - Score: 0 points
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-red-400 mb-2 block">
                                  Target Input Field:
                                </label>
                                <Input
                                  placeholder="Enter your search term..."
                                  className="bg-black border-red-400/30 text-red-400 font-mono"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-red-400 mb-2 block">
                                  XSS Payload:
                                </label>
                                <Input
                                  placeholder="<script>alert('XSS')</script>"
                                  className="bg-black border-red-400/30 text-red-400 font-mono"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex space-x-2">
                              <Button className="bg-red-400 text-white hover:bg-red-300">
                                <Zap className="w-4 h-4 mr-2" />
                                Execute Payload
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                Bypass Filter
                              </Button>
                            </div>
                          </div>

                          <div className="bg-black/30 border border-green-400/30 rounded-lg p-4">
                            <h4 className="text-green-400 font-semibold mb-2">
                              Game Objectives:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-green-300/80 text-sm">
                              <li>
                                Find and exploit 5 XSS vulnerabilities (20 pts
                                each)
                              </li>
                              <li>
                                Bypass 3 different input filters (30 pts each)
                              </li>
                              <li>
                                Execute a successful DOM-based XSS (50 pts)
                              </li>
                              <li>Steal session cookies using XSS (100 pts)</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeGame === "command-master" && (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-lg p-4">
                            <h3 className="text-green-400 font-semibold mb-3 flex items-center">
                              <Terminal className="w-5 h-5 mr-2" />
                              Command Line Master - Speed Challenge
                            </h3>
                            <div className="bg-black border border-green-400/30 rounded-lg p-4 font-mono text-sm">
                              <div className="text-green-300 space-y-2">
                                <div className="flex justify-between">
                                  <span>
                                    Challenge: List all files in /etc with
                                    permissions
                                  </span>
                                  <span className="text-yellow-400">
                                    ⏱️ 30s
                                  </span>
                                </div>
                                <div className="text-blue-400">
                                  Expected command: ls -la /etc
                                </div>
                                <div className="flex">
                                  <span className="text-green-400">
                                    user@game:~${" "}
                                  </span>
                                  <input
                                    className="bg-transparent border-none outline-none text-green-400 flex-1"
                                    placeholder="Type the command..."
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-green-400">
                                  Speed Bonus
                                </span>
                                <span className="text-sm text-green-400">
                                  Level 1/10
                                </span>
                              </div>
                              <Progress
                                value={30}
                                className="h-2 bg-black border border-green-400/30"
                              />
                            </div>
                          </div>

                          <div className="bg-black/30 border border-blue-400/30 rounded-lg p-4">
                            <h4 className="text-blue-400 font-semibold mb-2">
                              Scoring System:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-green-300/80 text-sm">
                              <li>Correct command: +10 points</li>
                              <li>Speed bonus: +5 points (under 10s)</li>
                              <li>Perfect syntax: +3 points</li>
                              <li>
                                Combo multiplier: x2 after 5 correct answers
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeGame === "packet-sniffer" && (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-4">
                            <h3 className="text-purple-400 font-semibold mb-3 flex items-center">
                              <Network className="w-5 h-5 mr-2" />
                              Packet Sniffer Challenge - Find the Threat
                            </h3>
                            <div className="bg-black border border-purple-400/30 rounded-lg p-4 font-mono text-xs space-y-1">
                              <div className="text-purple-300">
                                Capturing packets... 🔍
                              </div>
                              <div className="text-gray-400">
                                192.168.1.100:80 → 192.168.1.1:3345 [HTTP GET]
                              </div>
                              <div className="text-gray-400">
                                192.168.1.101:443 → 192.168.1.1:3346 [HTTPS]
                              </div>
                              <div className="text-red-400 cursor-pointer hover:bg-red-400/10 p-1 rounded">
                                192.168.1.102:1337 → 192.168.1.1:3347
                                [SUSPICIOUS] ⚠️
                              </div>
                              <div className="text-gray-400">
                                192.168.1.103:22 → 192.168.1.1:3348 [SSH]
                              </div>
                              <div className="text-gray-400">
                                192.168.1.104:80 → 192.168.1.1:3349 [HTTP GET]
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                              <Button
                                size="sm"
                                className="bg-purple-400/20 border border-purple-400 text-purple-400 hover:bg-purple-400/30"
                              >
                                <Search className="w-3 h-3 mr-1" />
                                Inspect
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-400/20 border border-red-400 text-red-400 hover:bg-red-400/30"
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                Block
                              </Button>
                              <Button
                                size="sm"
                                className="bg-yellow-400/20 border border-yellow-400 text-yellow-400 hover:bg-yellow-400/30"
                              >
                                <Target className="w-3 h-3 mr-1" />
                                Flag
                              </Button>
                            </div>
                          </div>

                          <div className="bg-black/30 border border-purple-400/30 rounded-lg p-4">
                            <h4 className="text-purple-400 font-semibold mb-2">
                              Mission Briefing:
                            </h4>
                            <p className="text-green-300/80 text-sm mb-2">
                              Analyze network traffic to identify malicious
                              activities. Look for suspicious ports, unusual
                              protocols, and attack patterns.
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-green-300/80 text-sm">
                              <li>Identify DDoS attacks (+50 pts)</li>
                              <li>Spot data exfiltration attempts (+75 pts)</li>
                              <li>Find backdoor communications (+100 pts)</li>
                              <li>
                                Block malicious IPs in time (+25 pts each)
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Default game content */}
                      {![
                        "xss-hunter",
                        "command-master",
                        "packet-sniffer",
                      ].includes(activeGame || "") && (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-green-400 font-semibold mb-2">
                            Game Loading...
                          </h3>
                          <p className="text-green-300/70 text-sm">
                            Preparing your interactive cybersecurity challenge
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // Game List View
                <div className="grid gap-4">
                  {course.games?.map((game) => (
                    <Card
                      key={game.id}
                      className="bg-black/50 border-green-400/30 hover:border-green-400 transition-colors cursor-pointer"
                      onClick={() => setActiveGame(game.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                              <game.icon className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                              <CardTitle className="text-green-400 text-lg">
                                {game.name}
                              </CardTitle>
                              <p className="text-green-300/70 text-sm">
                                {game.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={getDifficultyColor(game.difficulty)}
                            >
                              {game.difficulty}
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-green-300/70">
                              <Clock className="w-3 h-3" />
                              <span>{game.duration}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-green-300/70">
                            {game.available ? "Ready to play" : "Coming soon"}
                          </div>
                          <Button
                            size="sm"
                            disabled={!game.available}
                            className={
                              game.available
                                ? "bg-green-400 text-black hover:bg-green-300"
                                : "bg-gray-600 text-gray-300 cursor-not-allowed"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              if (game.available) {
                                setActiveGame(game.id);
                              }
                            }}
                          >
                            {game.available ? (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Play Game
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Locked
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="mt-4">
              <div className="grid gap-3">
                {course.resources.map((resource, index) => (
                  <Card
                    key={index}
                    className="bg-black/50 border-green-400/30 hover:border-green-400 transition-colors"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-green-400">
                            {getFileTypeIcon(resource.type)}
                          </div>
                          <div>
                            <div className="font-medium text-green-400 text-sm">
                              {resource.name}
                            </div>
                            <div className="text-xs text-green-300/70">
                              {resource.type.toUpperCase()} • {resource.size}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-400/10"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCoursePage;
