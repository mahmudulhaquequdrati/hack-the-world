// Terminal-related static data
export const DEFAULT_TERMINAL_COMMANDS = [
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
] as const;

// Matrix rain characters
export const MATRIX_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";

// Terminal line color utility
export const getTerminalLineColor = (line: string): string => {
  if (line.startsWith("$")) return "text-green-400";
  if (line.includes("CRITICAL") || line.includes("SUCCESS"))
    return "text-red-400";
  if (line.includes("open") || line.includes("up")) return "text-green-300";
  if (line.includes("msf6")) return "text-purple-400";
  return "text-green-300/80";
};
