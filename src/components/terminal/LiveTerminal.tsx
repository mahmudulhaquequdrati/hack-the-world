import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import TerminalWindow from "./TerminalWindow";

interface LiveTerminalProps {
  commands?: string[];
  title?: string;
  className?: string;
}

const defaultCommands = [
  "$ nmap -sS 192.168.1.0/24",
  "Scanning 256 hosts...",
  "Host 192.168.1.1 is up (0.001s latency)",
  "Host 192.168.1.15 is up (0.002s latency)",
  "22/tcp open ssh",
  "80/tcp open http",
  "443/tcp open https",
  "$ sqlmap -u 'http://target.com/login'",
  "Testing parameter 'username'...",
  "[CRITICAL] SQL injection vulnerability found!",
  "$ hydra -l admin -P passwords.txt ssh://target",
  "Attempting password brute force...",
  "[SUCCESS] Password found: admin123",
  "$ msfconsole",
  "Starting Metasploit Framework...",
  "msf6 > use exploit/multi/handler",
  "msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp",
  "msf6 exploit(multi/handler) > exploit",
  "[*] Meterpreter session 1 opened",
  "$ clear",
];

const LiveTerminal = ({
  commands = defaultCommands,
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

  const getLineColor = (line: string) => {
    if (line.startsWith("$")) return "text-green-400";
    if (line.includes("CRITICAL") || line.includes("SUCCESS"))
      return "text-red-400";
    if (line.includes("open") || line.includes("up")) return "text-green-300";
    if (line.includes("msf6")) return "text-purple-400";
    return "text-green-300/80";
  };

  return (
    <TerminalWindow title={title} className={className}>
      <div className="space-y-1">
        <div className="flex items-center text-green-400 text-sm mb-2">
          <Activity className="w-4 h-4 mr-2" />
          {title}
        </div>
        {terminalLines.map((line, index) => (
          <div key={index} className={getLineColor(line)}>
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
