import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, PlaygroundMode, TerminalMessage } from "@/lib/types";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Send,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AIPlaygroundProps {
  playgroundModes: PlaygroundMode[];
  activeMode: string;
  terminalHistory: TerminalMessage[];
  chatMessages: ChatMessage[];
  analysisResult: string;
  isAnalyzing: boolean;
  isMaximized?: boolean;
  onModeChange: (mode: string) => void;
  onTerminalCommand: (command: string) => void;
  onChatMessage: (message: string) => void;
  onAnalysis: (input: string) => void;
  onMaximize: () => void;
  onRestore?: () => void;
}

const AIPlayground = ({
  playgroundModes,
  activeMode,
  terminalHistory,
  chatMessages,
  analysisResult,
  isAnalyzing,
  isMaximized = false,
  onModeChange,
  onTerminalCommand,
  onChatMessage,
  onAnalysis,
  onMaximize,
  onRestore,
}: AIPlaygroundProps) => {
  const [terminalInput, setTerminalInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [analysisInput, setAnalysisInput] = useState("");
  const [terminalCursor, setTerminalCursor] = useState("");
  const [tabStartIndex, setTabStartIndex] = useState(0);
  const [maxVisibleTabs, setMaxVisibleTabs] = useState(4);
  const terminalRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Terminal cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalCursor((prev) => (prev === "_" ? "" : "_"));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal and chat
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Calculate max visible tabs based on container width
  useEffect(() => {
    const calculateMaxTabs = () => {
      if (tabsContainerRef.current) {
        const containerWidth = tabsContainerRef.current.offsetWidth;
        // More accurate calculation based on screen size
        let maxTabs;
        if (containerWidth < 400) {
          maxTabs = 2; // Mobile
        } else if (containerWidth < 600) {
          maxTabs = 3; // Small tablet
        } else if (containerWidth < 800) {
          maxTabs = 4; // Large tablet
        } else {
          maxTabs = 5; // Desktop
        }
        setMaxVisibleTabs(Math.min(maxTabs, playgroundModes.length));
      }
    };

    calculateMaxTabs();
    const resizeObserver = new ResizeObserver(calculateMaxTabs);
    if (tabsContainerRef.current) {
      resizeObserver.observe(tabsContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [playgroundModes.length]);

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

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && terminalInput.trim()) {
      onTerminalCommand(terminalInput.trim());
      setTerminalInput("");
    }
  };

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      onChatMessage(chatInput.trim());
      setChatInput("");
    }
  };

  const handleAnalysisSubmit = () => {
    if (analysisInput.trim()) {
      onAnalysis(analysisInput.trim());
    }
  };

  const canScrollLeft = tabStartIndex > 0;
  const canScrollRight =
    tabStartIndex + maxVisibleTabs < playgroundModes.length;
  const visibleTabs = playgroundModes.slice(
    tabStartIndex,
    tabStartIndex + maxVisibleTabs
  );

  const scrollTabsLeft = useCallback(() => {
    setTabStartIndex((prevIndex) => {
      if (prevIndex > 0) {
        return Math.max(0, prevIndex - 1);
      }
      return prevIndex;
    });
  }, []);

  const scrollTabsRight = useCallback(() => {
    setTabStartIndex((prevIndex) => {
      if (prevIndex + maxVisibleTabs < playgroundModes.length) {
        return Math.min(playgroundModes.length - maxVisibleTabs, prevIndex + 1);
      }
      return prevIndex;
    });
  }, [maxVisibleTabs, playgroundModes.length]);

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
          onValueChange={onModeChange}
          className="h-full"
        >
          {/* Custom Tab Navigation */}
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
                  onClick={() => onModeChange(mode.id)}
                  className={`flex items-center justify-center px-2 py-1.5 rounded text-xs sm:text-sm font-medium transition-all duration-200 flex-1 min-w-0 h-8 ${
                    activeMode === mode.id
                      ? "bg-green-400 text-black"
                      : "text-green-400 hover:bg-green-400/10"
                  }`}
                  title={mode.name} // Tooltip for truncated text
                >
                  <mode.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
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

          <TabsContent value="terminal" className="h-[calc(100%-60px)]">
            <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
              <div className="p-3 border-b border-green-400/30 bg-green-400/10">
                <div className="text-green-400 font-mono text-sm">
                  AI-Enhanced Terminal
                </div>
              </div>

              <div
                ref={terminalRef}
                className="flex-1 p-3 font-mono text-sm overflow-y-auto hide-scrollbar"
              >
                {terminalHistory.map((entry, index) => (
                  <div key={index} className="mb-1">
                    {entry.type === "command" && (
                      <div className="text-green-400">{entry.content}</div>
                    )}
                    {entry.type === "output" && (
                      <div className="text-green-300/80">{entry.content}</div>
                    )}
                    {entry.type === "ai" && (
                      <div className="text-blue-400 bg-blue-400/10 p-2 rounded my-2">
                        {entry.content}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex items-center text-green-400">
                  <span>user@cybersec:~$ </span>
                  <Input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalKeyDown}
                    className="bg-transparent border-none text-green-400 font-mono text-sm p-0 ml-1 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder=""
                  />
                  <span className="text-green-400">{terminalCursor}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="h-[calc(100%-60px)]">
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

          <TabsContent value="analysis" className="h-[calc(100%-60px)]">
            <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
              <div className="p-3 border-b border-green-400/30 bg-green-400/10">
                <div className="text-green-400 font-mono text-sm flex items-center">
                  <Terminal className="w-4 h-4 mr-2" />
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

                {analysisResult && (
                  <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-3">
                    <div className="text-blue-400 text-sm font-semibold mb-2">
                      AI Analysis Result:
                    </div>
                    <div className="text-green-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {analysisResult}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Generic TabsContent for dynamic modes */}
          {playgroundModes
            .filter(
              (mode) => !["terminal", "chat", "analysis"].includes(mode.id)
            )
            .map((mode) => (
              <TabsContent
                key={mode.id}
                value={mode.id}
                className="h-[calc(100%-60px)]"
              >
                <div className="bg-black border border-green-400/30 rounded-lg h-full flex flex-col">
                  <div className="p-3 border-b border-green-400/30 bg-green-400/10">
                    <div className="text-green-400 font-mono text-sm flex items-center">
                      <mode.icon className="w-4 h-4 mr-2" />
                      {mode.name}
                    </div>
                  </div>

                  <div className="flex-1 p-6 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <mode.icon className="w-16 h-16 text-green-400 mx-auto" />
                      <h3 className="text-green-400 text-xl font-semibold">
                        {mode.name}
                      </h3>
                      <p className="text-green-300/70 max-w-md">
                        {mode.description}
                      </p>
                      <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4 mt-6">
                        <p className="text-green-400 text-sm">
                          🚀 This tool is coming soon! It will provide
                          specialized functionality for{" "}
                          {mode.name.toLowerCase()}.
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

export default AIPlayground;
