import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Lightbulb,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const TerminalLab = () => {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Welcome to Terminal Hacks Lab",
    "Type commands to complete challenges",
    "$ ",
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [completedChallenges, setCompletedChallenges] = useState<boolean[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const challenges = [
    {
      id: 1,
      title: "Basic Navigation",
      description: "Learn to navigate the file system using basic commands",
      objective: "List the contents of the current directory",
      command: "ls",
      hint: 'Use the "ls" command to list directory contents',
      difficulty: "Beginner",
      points: 10,
    },
    {
      id: 2,
      title: "Directory Exploration",
      description:
        "Navigate to different directories and explore the file system",
      objective: "Change to the /home directory",
      command: "cd /home",
      hint: 'Use "cd" followed by the directory path',
      difficulty: "Beginner",
      points: 15,
    },
    {
      id: 3,
      title: "File Permissions",
      description: "Understanding and modifying file permissions",
      objective: "Check permissions of a file using ls -la",
      command: "ls -la",
      hint: 'Use "ls -la" to see detailed file information including permissions',
      difficulty: "Intermediate",
      points: 20,
    },
    {
      id: 4,
      title: "Process Management",
      description: "Learn to view and manage running processes",
      objective: "List all running processes",
      command: "ps aux",
      hint: 'Use "ps aux" to see all running processes',
      difficulty: "Intermediate",
      points: 25,
    },
    {
      id: 5,
      title: "Network Analysis",
      description: "Use network tools to analyze connections",
      objective: "Show network connections",
      command: "netstat -an",
      hint: 'Use "netstat -an" to display network connections',
      difficulty: "Advanced",
      points: 30,
    },
  ];

  useEffect(() => {
    setCompletedChallenges(new Array(challenges.length).fill(false));
  }, [challenges.length]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleCommand = (command: string) => {
    const newHistory = [...terminalHistory];
    newHistory.push(`$ ${command}`);

    // Simulate command execution
    const currentChallengeData = challenges[currentChallenge];

    if (
      command.toLowerCase().trim() ===
      currentChallengeData.command.toLowerCase()
    ) {
      newHistory.push("✓ Command executed successfully!");
      newHistory.push(
        `Challenge completed! +${currentChallengeData.points} points`
      );

      const newCompleted = [...completedChallenges];
      newCompleted[currentChallenge] = true;
      setCompletedChallenges(newCompleted);

      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallenge(currentChallenge + 1);
        }, 1500);
      }
    } else {
      // Simulate basic command responses
      switch (command.toLowerCase().trim()) {
        case "ls":
          newHistory.push("documents  downloads  .bashrc");
          break;
        case "pwd":
          newHistory.push("/home/user");
          break;
        case "whoami":
          newHistory.push("user");
          break;
        case "help":
          newHistory.push(
            "Available commands: ls, cd, pwd, whoami, ps, netstat, cat, grep"
          );
          break;
        case "clear":
          setTerminalHistory(["$ "]);
          return;
        default:
          newHistory.push(`Command not found: ${command}`);
          newHistory.push('Type "help" for available commands');
      }
    }

    newHistory.push("$ ");
    setTerminalHistory(newHistory);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
      setCurrentInput("");
    }
  };

  const progress =
    (completedChallenges.filter(Boolean).length / challenges.length) * 100;

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-green-400 hover:bg-green-400/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold neon-glow flex items-center">
                <Terminal className="w-6 h-6 mr-2" />
                Linux Terminal Lab
              </h1>
              <p className="text-green-300/70">
                Master command-line operations through hands-on practice
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-300/70">Progress</div>
            <div className="text-lg font-bold text-green-400">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-2 bg-green-900/30" />

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          {/* Learning Content */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Challenge {currentChallenge + 1} of {challenges.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">
                      {challenges[currentChallenge].title}
                    </h3>
                    <p className="text-green-300/80">
                      {challenges[currentChallenge].description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge
                      variant="outline"
                      className="border-green-400/50 text-green-400"
                    >
                      {challenges[currentChallenge].difficulty}
                    </Badge>
                    <div className="text-sm text-green-300/70">
                      Points: {challenges[currentChallenge].points}
                    </div>
                  </div>

                  <div className="bg-green-900/20 border border-green-400/30 rounded p-4">
                    <h4 className="font-bold text-green-400 mb-2">
                      Objective:
                    </h4>
                    <p className="text-green-300">
                      {challenges[currentChallenge].objective}
                    </p>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-400/30 rounded p-4">
                    <h4 className="font-bold text-blue-400 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Hint:
                    </h4>
                    <p className="text-blue-300">
                      {challenges[currentChallenge].hint}
                    </p>
                  </div>
                </div>

                {/* Challenge List */}
                <div className="space-y-2">
                  <h4 className="font-bold text-green-400">All Challenges:</h4>
                  {challenges.map((challenge, index) => (
                    <div
                      key={challenge.id}
                      className={`flex items-center space-x-3 p-2 rounded ${
                        index === currentChallenge
                          ? "bg-green-400/10 border border-green-400/30"
                          : ""
                      }`}
                    >
                      {completedChallenges[index] ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : index === currentChallenge ? (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-green-400/30" />
                      )}
                      <span
                        className={`text-sm ${
                          completedChallenges[index]
                            ? "text-green-400"
                            : index === currentChallenge
                            ? "text-green-300"
                            : "text-green-300/60"
                        }`}
                      >
                        {challenge.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Terminal */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <Card className="h-full terminal-window bg-black/90 border-green-400">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-green-400 text-sm ml-4">
                    Terminal - user@terminal-hacks-lab
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 h-full">
                <div
                  ref={terminalRef}
                  className="h-full overflow-y-auto font-mono text-sm space-y-1 bg-black rounded p-4"
                >
                  {terminalHistory.map((line, index) => (
                    <div key={index} className="text-green-400">
                      {line}
                    </div>
                  ))}
                  <div className="flex items-center">
                    <span className="text-green-400">$ </span>
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-transparent border-none outline-none text-green-400 ml-1 flex-1"
                      placeholder="Type your command here..."
                      autoFocus
                    />
                    <span className="terminal-cursor text-green-400">|</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default TerminalLab;
