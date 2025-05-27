import { DEFAULT_TERMINAL_COMMANDS, getTerminalLineColor } from "@/lib";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import TerminalWindow from "./TerminalWindow";

interface LiveTerminalProps {
  commands?: string[];
  title?: string;
  className?: string;
}

const LiveTerminal = ({
  commands = [...DEFAULT_TERMINAL_COMMANDS],
  title = "Live Penetration Testing",
  className = "",
}: LiveTerminalProps) => {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentCommand < commands.length) {
        if (commands[currentCommand] === "$ clear") {
          setTerminalLines([]);
          setCurrentCommand(0);
        } else {
          setTerminalLines((prev) => [...prev, commands[currentCommand]]);
          setCurrentCommand((prev) => prev + 1);
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [currentCommand, commands]);

  return (
    <TerminalWindow title={title} className={className}>
      <div className="space-y-1">
        <div className="flex items-center text-green-400 text-sm mb-2">
          <Activity className="w-4 h-4 mr-2" />
          {title}
        </div>
        {terminalLines.map((line, index) => (
          <div key={index} className={getTerminalLineColor(line)}>
            {line}
          </div>
        ))}
        <div className="text-green-400">
          $ <span className="terminal-cursor">|</span>
        </div>
      </div>
    </TerminalWindow>
  );
};

export default LiveTerminal;
