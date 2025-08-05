import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AIChatService } from "@/services/aiChatService";
import AIResponseFormatter from "./AIResponseFormatter";
import {
  AlertTriangle,
  Brain,
  Bug,
  Calculator,
  Eye,
  Globe,
  Key,
  Lock,
  Maximize2,
  MessageCircle,
  Minimize2,
  Search,
  Shield,
  Terminal,
  Users,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TerminalConfig {
  availableCommands?: string[];
}

interface SimpleTerminalPlaygroundProps {
  contentId?: string;
  moduleId?: string;
  availableTools?: string[];
  terminalConfig?: TerminalConfig;
  isMaximized?: boolean;
  onMaximize: () => void;
  onRestore?: () => void;
}

// Icon mapping for tools
const iconMap = {
  Terminal,
  MessageCircle,
  Search,
  Calculator,
  Shield,
  Wifi,
  AlertTriangle,
  Eye,
  Bug,
  Users,
  Key,
  Globe,
  Lock,
};

const SimpleTerminalPlayground = ({
  contentId,
  availableTools = ["terminal", "chat", "analysis"],
  terminalConfig,
  isMaximized = false,
  onMaximize,
  onRestore,
}: SimpleTerminalPlaygroundProps) => {
  // State management
  const [activeMode, setActiveMode] = useState("terminal");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "ai"; content: string; timestamp: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simple terminal state
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  // Refs
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // API hooks (keeping for future integration)
  // const [startChatSession] = useStartChatSessionMutation();
  // const [sendChatMessage] = useSendChatMessageMutation();
  // const [executeTerminalCommand] = useExecuteTerminalCommandMutation();

  // Get dynamic playground modes based on available tools
  const playgroundModes = AIChatService.getAvailableToolsForContent(
    contentId || "",
    availableTools
  );

  // Ensure activeMode is valid for current tools
  useEffect(() => {
    if (playgroundModes.length > 0) {
      const validModes = playgroundModes.map((mode) => mode.id);
      if (!validModes.includes(activeMode)) {
        setActiveMode(validModes[0]);
      }
    }
  }, [playgroundModes, activeMode]);

  // Initialize simple terminal with empty state
  useEffect(() => {
    setTerminalLines([]);
  }, []);

  // Handle terminal input
  const handleTerminalInput = async (command: string) => {
    const prompt = "$";

    // Add command to terminal
    setTerminalLines((prev) => [...prev, `${prompt} ${command}`]);

    // Get available commands from config or use defaults
    const availableCommands = terminalConfig?.availableCommands || [
      "ls",
      "pwd",
      "whoami",
      "help",
      "clear",
      "cat",
      "grep",
      "find",
      "ps",
      "netstat",
    ];

    // Simulate command execution
    try {
      let response = "";

      switch (command.toLowerCase().trim()) {
        case "help":
          response = `Available commands: ${availableCommands.join(
            ", "
          )}\nType any command for AI assistance!`;
          break;
        case "ls":
          response =
            "drwxr-xr-x 2 student student 4096 Dec 20 10:30 Documents\ndrwxr-xr-x 2 student student 4096 Dec 20 10:30 Downloads\n-rw-r--r-- 1 student student  156 Dec 20 10:30 README.txt";
          break;
        case "pwd":
          response = "/home/student";
          break;
        case "whoami":
          response = "student";
          break;
        case "clear":
          setTerminalLines([]);
          setCurrentInput("");
          return;
        case "cat":
          response = "Usage: cat <filename>";
          break;
        case "grep":
          response = "Usage: grep <pattern> <file>";
          break;
        case "find":
          response = "Usage: find <path> -name <filename>";
          break;
        case "ps":
          response =
            "PID TTY          TIME CMD\n1234 pts/0    00:00:01 bash\n5678 pts/0    00:00:00 ps";
          break;
        case "netstat":
          response =
            "Active Internet connections\nProto Recv-Q Send-Q Local Address           Foreign Address         State";
          break;
        default:
          if (availableCommands.includes(command.toLowerCase().trim())) {
            response = `AI: The command '${command}' is available. This is a simulated terminal for learning cybersecurity concepts.`;
          } else {
            response = `Command '${command}' not found. Type 'help' for available commands.`;
          }
      }

      setTerminalLines((prev) => [...prev, response, ""]);
    } catch (error) {
      setTerminalLines((prev) => [...prev, `Error: ${error}`, ""]);
    }

    setCurrentInput("");
  };

  // Focus terminal when clicked
  const focusTerminal = () => {
    inputRef.current?.focus();
  };

  // Handle chat
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setIsLoading(true);

    // Add user message
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      console.log("🚀 Sending AI chat request:", {
        contentId,
        message: userMessage,
      });

      const token = localStorage.getItem("hackToken");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Call the real AI API
      const response = await fetch(
        "http://localhost:5001/api/ai-chat/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId: `chat-${contentId}`,
            message: userMessage,
            contentId: contentId,
          }),
        }
      );

      console.log("📡 AI API response status:", response.status);

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          // Clear invalid token
          localStorage.removeItem("hackToken");
          throw new Error(
            "Your session has expired. Please refresh the page and log in again."
          );
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ AI response received:", data);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            data.data?.response ||
            "I'm here to help with your cybersecurity questions!",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      // Auto-scroll chat
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("❌ Chat error:", error);

      let errorMessage =
        "I'm having trouble connecting right now. Please try again or use the terminal for hands-on learning!";

      const errorMsg = error instanceof Error ? error.message : String(error);
      if (
        errorMsg.includes("session has expired") ||
        errorMsg.includes("Authentication")
      ) {
        errorMessage =
          "🔐 Your session has expired. Please refresh the page and log in again.";
      } else if (errorMsg.includes("Not authenticated")) {
        errorMessage = "🔐 Please log in to access the AI chat feature.";
      }

      // Fallback message with specific error info
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: errorMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render icon for tool
  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? (
      <IconComponent className="w-4 h-4" />
    ) : (
      <Terminal className="w-4 h-4" />
    );
  };

  if (playgroundModes.length === 0) {
    return null;
  }

  return (
    <div className="h-[600px] max-h-[600px] bg-gradient-to-b from-green-900/20 to-black border border-green-400/30 rounded-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-green-400/30 bg-green-400/10 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
          <span className="text-green-400 font-mono text-sm ml-4">
            AI Learning Assistant
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isMaximized && onRestore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestore}
              className="text-green-400 hover:bg-green-400/10 p-1"
              title="Restore playground"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
          {!isMaximized && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMaximize}
              className="text-green-400 hover:bg-green-400/10 p-1"
              title="Maximize playground"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-3 min-h-0">
        <Tabs
          value={activeMode}
          onValueChange={setActiveMode}
          className="h-full flex flex-col"
        >
          {/* Tab Navigation */}
          <div className="flex items-center bg-black/60 border border-green-400/30 rounded-lg mb-3 p-1 gap-1 flex-shrink-0">
            {playgroundModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center justify-center px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 flex-1 ${
                  activeMode === mode.id
                    ? "bg-green-400 text-black"
                    : "text-green-400 hover:bg-green-400/10"
                }`}
                title={mode.description}
              >
                {renderIcon(mode.icon)}
                <span className="ml-1">{mode.name}</span>
              </button>
            ))}
          </div>

          {/* Terminal Tab */}
          <TabsContent value="terminal" className="flex-1 min-h-0">
            <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
              <div className="p-2 border-b border-green-400/30 bg-green-400/10 flex-shrink-0">
                <div className="text-green-400 font-mono text-xs flex items-center">
                  <Terminal className="w-3 h-3 mr-1" />
                  AI-Enhanced Terminal
                </div>
              </div>

              {/* Simple Terminal Implementation */}
              <div
                className="flex-1 p-3 overflow-y-auto font-mono text-xs text-green-400 cursor-text min-h-0"
                onClick={focusTerminal}
              >
                {/* Terminal Output */}
                <div className="space-y-1">
                  {terminalLines.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}

                  {/* Current Input Line */}
                  <div className="flex items-center">
                    <span className="text-green-400">$ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && currentInput.trim()) {
                          handleTerminalInput(currentInput.trim());
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-xs"
                      placeholder="Type a command..."
                      autoFocus
                    />
                    <span className="text-green-400 animate-pulse">█</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 min-h-0">
            <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
              <div className="p-2 border-b border-green-400/30 bg-green-400/10 flex-shrink-0">
                <div className="text-green-400 font-mono text-xs flex items-center">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Learning Chat
                </div>
              </div>

              <div
                ref={chatRef}
                className="flex-1 p-2 overflow-y-auto hide-scrollbar space-y-3 min-h-0"
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`${message.role === "user" ? "ml-4" : "mr-4"}`}
                  >
                    {message.role === "user" ? (
                      // User message (existing simple format)
                      <div className="bg-green-400/20 p-3 rounded-lg border border-green-400/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-green-300">
                            You
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-green-400 font-mono text-xs leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      // AI message with enhanced formatter
                      <div className="bg-gray-900/60 p-3 rounded-lg border border-blue-400/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono text-blue-300">
                              AI Assistant
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            {message.timestamp}
                          </span>
                        </div>
                        <AIResponseFormatter
                          content={message.content}
                          isTyping={
                            index === chatMessages.length - 1 &&
                            message.content.length > 0
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading state */}
                {isLoading && (
                  <div className="mr-4">
                    <div className="bg-gray-900/60 p-3 rounded-lg border border-blue-400/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-mono text-blue-300">
                            AI Assistant
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-blue-300/70 font-mono">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-green-400/30 flex-shrink-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && chatInput.trim() && !isLoading) {
                        handleChatSubmit();
                      }
                    }}
                    placeholder={
                      isLoading
                        ? "AI is thinking..."
                        : "Ask me anything about cybersecurity..."
                    }
                    disabled={isLoading}
                    className="flex-1 px-2 py-1.5 bg-gray-800/50 border border-green-400/30 rounded text-green-400 font-mono text-xs focus:ring-1 focus:ring-green-400/50 focus:border-green-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim() || isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-mono text-xs px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "..." : "Send"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="flex-1 min-h-0">
            <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
              <div className="p-2 border-b border-green-400/30 bg-green-400/10 flex-shrink-0">
                <div className="text-green-400 font-mono text-xs flex items-center">
                  <Search className="w-3 h-3 mr-1" />
                  AI Analysis Tools
                </div>
              </div>
              <div className="flex-1 p-3 flex items-center justify-center min-h-0">
                <div className="text-center text-green-400 font-mono">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Analysis tools coming soon...</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimpleTerminalPlayground;
