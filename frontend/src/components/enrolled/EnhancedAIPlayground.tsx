import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AIChatService, {
  ChatSession,
  useExecuteTerminalCommandMutation,
  useSendChatMessageMutation,
  useStartChatSessionMutation,
} from "@/services/aiChatService";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import {
  AlertTriangle,
  Brain,
  Bug,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  Key,
  Lock,
  Maximize2,
  MessageCircle,
  Search,
  Send,
  Shield,
  Sparkles,
  Terminal,
  Users,
  Wifi,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Terminal config type (simplified to match server model) - REMOVED since not used

interface EnhancedAIPlaygroundProps {
  contentId?: string;
  moduleId?: string;
  availableTools?: string[];
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

const EnhancedAIPlayground = ({
  contentId,
  moduleId,
  availableTools = ["terminal", "chat", "analysis"],
  isMaximized = false,
  onMaximize,
  onRestore,
}: EnhancedAIPlaygroundProps) => {
  // State management
  const [activeMode, setActiveMode] = useState("terminal");
  const [chatInput, setChatInput] = useState("");
  const [analysisInput, setAnalysisInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "ai"; content: string; timestamp: string }>
  >([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [tabStartIndex, setTabStartIndex] = useState(0);
  const maxVisibleTabs = 4;

  // Refs
  const chatRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  // API hooks
  const [startChatSession] = useStartChatSessionMutation();
  const [sendChatMessage] = useSendChatMessageMutation();
  const [executeTerminalCommand] = useExecuteTerminalCommandMutation();

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

  // Initialize terminal
  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const terminal = new XTerm({
        theme: {
          background: "#000000",
          foreground: "#00ff00",
          cursor: "#00ff00",
          cursorAccent: "#000000",
        },
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        rows: 20,
        cols: 80,
        allowTransparency: true,
      });

      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      terminal.open(terminalRef.current);

      // Wait for terminal to be properly rendered before fitting, focusing, and writing content
      setTimeout(() => {
        if (terminalRef.current && fitAddon) {
          // First fit the terminal to proper size
          fitAddon.fit();

          // Then write welcome message
          terminal.writeln(
            "\x1b[1;32m╔══════════════════════════════════════════════════════════════════════════════╗\x1b[0m"
          );
          terminal.writeln(
            `\x1b[1;32m║${"Welcome to AI-Enhanced Terminal"
              .padStart((80 + "Welcome to AI-Enhanced Terminal".length) / 2)
              .padEnd(78)}║\x1b[0m`
          );
          terminal.writeln(
            "\x1b[1;32m║                   Type commands to interact with AI                         ║\x1b[0m"
          );
          terminal.writeln(
            "\x1b[1;32m╚══════════════════════════════════════════════════════════════════════════════╝\x1b[0m"
          );
          terminal.writeln("");

          // Focus the terminal after content is written
          terminal.focus();
        }
      }, 150);

      // Setup input handling and initial prompt after terminal is ready
      setTimeout(() => {
        if (terminalRef.current && terminal) {
          const prompt = `\x1b[1;32mstudent@hack-the-world:~$\x1b[0m `;

          // Show prompt immediately (no initial commands)
          terminal.write(prompt);
        }
      }, 250);

      let currentLine = "";
      const promptForInput = `\x1b[1;32mstudent@hack-the-world:~$\x1b[0m `;

      terminal.onData(async (data) => {
        const char = data;

        if (char === "\r") {
          // Enter key
          if (currentLine.trim()) {
            terminal.writeln("");
            await handleTerminalCommand(currentLine.trim(), terminal);
            currentLine = "";
          } else {
            terminal.writeln("");
            terminal.write(promptForInput);
          }
        } else if (char === "\u007F") {
          // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            terminal.write("\b \b");
          }
        } else if (char >= " ") {
          // Printable characters
          currentLine += char;
          terminal.write(char);
        }
      });

      xtermRef.current = terminal;
      fitAddonRef.current = fitAddon;

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        if (fitAddonRef.current && xtermRef.current) {
          fitAddonRef.current.fit();
        }
      });

      if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current);
      }

      return () => {
        resizeObserver.disconnect();
        terminal.dispose();
      };
    }
  }, []);

  // Handle terminal command execution
  const handleTerminalCommand = useCallback(
    async (command: string, terminal: XTerm) => {
      try {
        const result = await executeTerminalCommand({
          command,
          contentId: contentId || undefined,
        }).unwrap();

        // Display command output
        terminal.writeln(`\x1b[1;37m${result.data.output}\x1b[0m`);

        // Display AI explanation if available
        if (result.data.aiExplanation) {
          terminal.writeln("");
          terminal.writeln("\x1b[1;36m💡 AI Explanation:\x1b[0m");
          terminal.writeln(`\x1b[0;36m${result.data.aiExplanation}\x1b[0m`);
        }

        // Display suggestions if available
        if (result.data.suggestions && result.data.suggestions.length > 0) {
          terminal.writeln("");
          terminal.writeln("\x1b[1;33m💡 Suggested commands:\x1b[0m");
          result.data.suggestions.forEach((suggestion) => {
            terminal.writeln(`\x1b[0;33m  • ${suggestion}\x1b[0m`);
          });
        }

        terminal.writeln("");
      } catch {
        terminal.writeln(`\x1b[1;31mError: Command execution failed\x1b[0m`);
        terminal.writeln("");
      }

      // Show prompt for next command
      const prompt = "\x1b[1;32mstudent@hack-the-world:\x1b[1;34m~\x1b[0m$ ";
      terminal.write(prompt);
    },
    [executeTerminalCommand, contentId]
  );

  const initializeChatSession = useCallback(async () => {
    try {
      const result = await startChatSession({
        contentId: contentId || undefined,
        moduleId: moduleId || undefined,
      }).unwrap();

      setCurrentSession(result.data);
      AIChatService.setCurrentSession(result.data);
      setChatMessages([
        {
          role: "ai",
          content: result.data.initialResponse,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      console.error("Failed to start chat session");
    }
  }, [startChatSession, contentId, moduleId]);

  // Initialize chat session when component mounts or content changes
  useEffect(() => {
    if (contentId || moduleId) {
      initializeChatSession();
    }
  }, [contentId, moduleId, initializeChatSession]);

  // Handle chat message submission
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput("");

    // Add user message to chat
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const result = await sendChatMessage({
        message: userMessage,
        sessionId: currentSession?.sessionId,
        contentId: contentId || undefined,
        moduleId: moduleId || undefined,
      }).unwrap();

      // Add AI response to chat
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: result.data.response,
          timestamp: new Date().toISOString(),
        },
      ]);

      AIChatService.addChatMessage("user", userMessage);
      AIChatService.addChatMessage("ai", result.data.response);
    } catch (error) {
      console.error("Failed to send chat message:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  // Handle analysis submission
  const handleAnalysisSubmit = async () => {
    if (!analysisInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await sendChatMessage({
        message: `Please analyze this code/command: ${analysisInput}`,
        sessionId: currentSession?.sessionId,
        contentId: contentId || undefined,
        moduleId: moduleId || undefined,
      }).unwrap();

      // For now, just show the analysis in the chat
      // In a real implementation, you might want a separate analysis display
      setChatMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: `Analyze: ${analysisInput}`,
          timestamp: new Date().toISOString(),
        },
        {
          role: "ai",
          content: result.data.response,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Calculate tab navigation
  const canScrollLeft = tabStartIndex > 0;
  const canScrollRight =
    tabStartIndex + maxVisibleTabs < playgroundModes.length;
  const visibleTabs = playgroundModes.slice(
    tabStartIndex,
    tabStartIndex + maxVisibleTabs
  );

  const scrollTabsLeft = useCallback(() => {
    setTabStartIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const scrollTabsRight = useCallback(() => {
    setTabStartIndex((prev) =>
      Math.min(playgroundModes.length - maxVisibleTabs, prev + 1)
    );
  }, [maxVisibleTabs, playgroundModes.length]);

  // Ensure active tab is visible
  useEffect(() => {
    const activeIndex = playgroundModes.findIndex(
      (mode) => mode.id === activeMode
    );
    if (activeIndex !== -1) {
      setTabStartIndex((prevIndex) => {
        if (activeIndex < prevIndex) {
          return activeIndex;
        } else if (activeIndex >= prevIndex + maxVisibleTabs) {
          return activeIndex - maxVisibleTabs + 1;
        }
        return prevIndex;
      });
    }
  }, [activeMode, playgroundModes, maxVisibleTabs]);

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? (
      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
    ) : (
      <Terminal className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-green-400/30 flex items-center justify-between">
        <h3 className="text-green-400 font-semibold flex items-center">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Learning Assistant
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
              title="Maximize playground"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4">
        <Tabs
          value={activeMode}
          onValueChange={setActiveMode}
          className="h-full"
        >
          {/* Dynamic Tab Navigation */}
          <div
            ref={tabsContainerRef}
            className="flex items-center bg-black/60 border border-green-400/30 rounded-lg mb-4 p-1 gap-1"
          >
            {/* Left Navigation Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollTabsLeft}
              disabled={!canScrollLeft}
              className={`text-green-400 hover:bg-green-400/10 flex-shrink-0 px-2 h-8 ${
                !canScrollLeft ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Visible Tabs Container */}
            <div className="flex-1 flex gap-1 min-w-0">
              {visibleTabs.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center justify-center px-2 py-1.5 rounded text-xs sm:text-sm font-medium transition-all duration-200 flex-1 min-w-0 h-8 ${
                    activeMode === mode.id
                      ? "bg-green-400 text-black"
                      : "text-green-400 hover:bg-green-400/10"
                  }`}
                  title={mode.description}
                >
                  {renderIcon(mode.icon)}
                  <span className="ml-1 truncate hidden sm:inline">
                    {mode.name}
                  </span>
                  <span className="ml-1 truncate sm:hidden">
                    {mode.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Right Navigation Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollTabsRight}
              disabled={!canScrollRight}
              className={`text-green-400 hover:bg-green-400/10 flex-shrink-0 px-2 h-8 ${
                !canScrollRight ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Terminal Tab */}
          <TabsContent value="terminal" className="h-[calc(100%-80px)]">
            <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
              <div className="p-3 border-b border-green-400/30 bg-green-400/10">
                <div className="text-green-400 font-mono text-sm flex items-center">
                  <Terminal className="w-4 h-4 mr-2" />
                  AI-Enhanced Terminal
                </div>
              </div>

              {/* XTerm Terminal */}
              <div className="flex-1">
                <div ref={terminalRef} className="h-full w-full" />
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="h-[calc(100%-80px)]">
            <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
              <div className="p-3 border-b border-green-400/30 bg-green-400/10">
                <div className="text-green-400 font-mono text-sm flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Learning Chat
                </div>
              </div>

              <div
                ref={chatRef}
                className="flex-1 p-3 overflow-y-auto hide-scrollbar space-y-3"
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-green-400/10 border border-green-400/30 ml-8"
                        : "bg-blue-400/10 border border-blue-400/30 mr-8"
                    }`}
                  >
                    <div className="text-xs text-green-400/70 mb-1">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </div>
                    <div className="text-green-300 text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-green-400/30">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
                    placeholder="Ask me anything about cybersecurity..."
                    className="bg-black border-green-400/30 text-green-400"
                  />
                  <Button
                    onClick={handleChatSubmit}
                    className="bg-green-400 text-black hover:bg-green-300"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="h-[calc(100%-80px)]">
            <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
              <div className="p-3 border-b border-green-400/30 bg-green-400/10">
                <div className="text-green-400 font-mono text-sm flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Code Analysis
                </div>
              </div>

              <div className="flex-1 p-3 space-y-3">
                <div>
                  <label className="text-green-400 text-sm mb-2 block">
                    Enter code or command to analyze:
                  </label>
                  <Textarea
                    value={analysisInput}
                    onChange={(e) => setAnalysisInput(e.target.value)}
                    placeholder="Paste your code or command here..."
                    className="bg-black border-green-400/30 text-green-400 font-mono text-sm min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={handleAnalysisSubmit}
                  disabled={isAnalyzing || !analysisInput.trim()}
                  className="bg-green-400 text-black hover:bg-green-300"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Dynamic tool tabs */}
          {playgroundModes
            .filter(
              (mode) => !["terminal", "chat", "analysis"].includes(mode.id)
            )
            .map((mode) => (
              <TabsContent
                key={mode.id}
                value={mode.id}
                className="h-[calc(100%-80px)]"
              >
                <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
                  <div className="p-3 border-b border-green-400/30 bg-green-400/10">
                    <div className="text-green-400 font-mono text-sm flex items-center">
                      {renderIcon(mode.icon)}
                      <span className="ml-2">{mode.name}</span>
                    </div>
                  </div>

                  <div className="flex-1 p-6 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      {renderIcon(mode.icon)}
                      <h3 className="text-green-400 text-xl font-semibold">
                        {mode.name}
                      </h3>
                      <p className="text-green-300/70 max-w-md">
                        {mode.description}
                      </p>
                      <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4 mt-6">
                        <p className="text-green-400 text-sm">
                          🚀 This tool is now available for this content!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAIPlayground;
