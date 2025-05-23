import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Terminal, 
  Shield, 
  Users, 
  Eye, 
  Lock, 
  Zap, 
  Target, 
  Code,
  ChevronRight,
  Play,
  BookOpen,
  Award,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {Header} from "@/components/header.tsx"

const LandingPage = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [activeGame, setActiveGame] = useState('cipher');
  const fullText = "Welcome to CyberSec Academy";

  const commands = [
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
    "$ clear"
  ];

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentCommand < commands.length) {
        if (commands[currentCommand] === "$ clear") {
          setTerminalLines([]);
          setCurrentCommand(0);
        } else {
          setTerminalLines(prev => [...prev, commands[currentCommand]]);
          setCurrentCommand(prev => prev + 1);
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [currentCommand, commands]);

  const features = [
    {
      icon: Terminal,
      title: "Linux Terminal Mastery",
      description: "Master command-line operations with our interactive terminal simulator",
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Web Security Testing",
      description: "Practice ethical hacking on vulnerable web applications",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Social Engineering",
      description: "Learn psychological manipulation techniques and defenses",
      color: "text-red-400"
    },
    {
      icon: Eye,
      title: "OSINT Gathering",
      description: "Open source intelligence collection and analysis",
      color: "text-purple-400"
    }
  ];

  const stats = [
    { label: "Active Hackers", value: "10,247", icon: Users },
    { label: "Vulnerabilities Found", value: "50,892", icon: Target },
    { label: "Skills Mastered", value: "1,337", icon: Award },
    { label: "Success Rate", value: "94.7%", icon: TrendingUp }
  ];

  const liveStats = [
    { label: "Active Sessions", value: "1,247", trend: "+12%", color: "text-green-400" },
    { label: "Threats Detected", value: "89", trend: "+5%", color: "text-red-400" },
    { label: "Systems Scanned", value: "15,432", trend: "+8%", color: "text-blue-400" },
    { label: "Vulnerabilities", value: "23", trend: "-2%", color: "text-yellow-400" }
  ];

  const CipherGame = () => {
    const [cipher, setCipher] = useState("KHOOR ZRUOG");
    const [answer, setAnswer] = useState("");
    const [solved, setSolved] = useState(false);

    const checkAnswer = () => {
      if (answer.toLowerCase() === "hello world") {
        setSolved(true);
        setGameScore(prev => prev + 100);
      }
    };

    return (
      <div className="space-y-3">
        <div className="text-green-400 font-bold text-sm">CIPHER CHALLENGE</div>
        <div className="bg-black/80 p-3 rounded border border-green-400/30">
          <div className="text-green-300 font-mono text-sm mb-2">Decode this Caesar cipher (shift 3):</div>
          <div className="text-green-400 font-mono text-lg">{cipher}</div>
        </div>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter decoded message..."
          className="w-full bg-black border border-green-400/30 text-green-400 p-2 text-sm rounded"
          disabled={solved}
        />
        <Button 
          size="sm" 
          onClick={checkAnswer}
          disabled={solved}
          className="w-full bg-green-400 text-black hover:bg-green-300"
        >
          {solved ? "✓ SOLVED!" : "DECODE"}
        </Button>
      </div>
    );
  };

  const HashCrackGame = () => {
    const [hash] = useState("5d41402abc4b2a76b9719d911017c592");
    const [guess, setGuess] = useState("");
    const [cracked, setCracked] = useState(false);

    const checkHash = () => {
      if (guess.toLowerCase() === "hello") {
        setCracked(true);
        setGameScore(prev => prev + 150);
      }
    };

    return (
      <div className="space-y-3">
        <div className="text-red-400 font-bold text-sm">HASH CRACKER</div>
        <div className="bg-black/80 p-3 rounded border border-red-400/30">
          <div className="text-red-300 font-mono text-sm mb-2">Crack this MD5 hash:</div>
          <div className="text-red-400 font-mono text-xs break-all">{hash}</div>
        </div>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter original text..."
          className="w-full bg-black border border-red-400/30 text-red-400 p-2 text-sm rounded"
          disabled={cracked}
        />
        <Button 
          size="sm" 
          onClick={checkHash}
          disabled={cracked}
          className="w-full bg-red-400 text-black hover:bg-red-300"
        >
          {cracked ? "✓ CRACKED!" : "CRACK HASH"}
        </Button>
      </div>
    );
  };

  const PortScanGame = () => {
    const [ports] = useState([22, 80, 443, 3389, 21]);
    const [scannedPorts, setScannedPorts] = useState<number[]>([]);
    const [scanning, setScanning] = useState(false);

    const scanPort = (port: number) => {
      if (scannedPorts.includes(port)) return;
      
      setScanning(true);
      setTimeout(() => {
        setScannedPorts(prev => [...prev, port]);
        setGameScore(prev => prev + 25);
        setScanning(false);
      }, 1000);
    };

    return (
      <div className="space-y-3">
        <div className="text-blue-400 font-bold text-sm">PORT SCANNER</div>
        <div className="bg-black/80 p-3 rounded border border-blue-400/30">
          <div className="text-blue-300 font-mono text-sm mb-2">Scan target: 192.168.1.100</div>
          <div className="grid grid-cols-3 gap-2">
            {ports.map(port => (
              <button
                key={port}
                onClick={() => scanPort(port)}
                disabled={scanning || scannedPorts.includes(port)}
                className={`p-2 text-xs rounded border ${
                  scannedPorts.includes(port) 
                    ? 'bg-green-400/20 border-green-400 text-green-400' 
                    : 'border-blue-400/30 text-blue-400 hover:bg-blue-400/10'
                }`}
              >
                {scannedPorts.includes(port) ? `${port} OPEN` : `Port ${port}`}
              </button>
            ))}
          </div>
        </div>
        <div className="text-blue-300 text-xs">
          Found: {scannedPorts.length}/{ports.length} open ports
        </div>
      </div>
    );
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'cipher':
        return <CipherGame />;
      case 'hash':
        return <HashCrackGame />;
      case 'portscan':
        return <PortScanGame />;
      default:
        return <CipherGame />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
    		<Header navigate={navigate} />

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-green-400">
                  {typedText}
                  <span className="terminal-cursor">|</span>
                </h1>
                <p className="text-xl text-green-300/80 max-w-lg">
                  Master the art of ethical hacking with our immersive, hands-on cybersecurity training platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-400 text-black hover:bg-green-300 hacker-btn font-bold"
                  onClick={() => navigate('/dashboard')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Begin Training
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-green-400 text-green-400 hover:bg-green-400/10 hacker-btn"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  View Courses
                </Button>
              </div>

              <div className="flex items-center space-x-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-green-400">{stat.value}</div>
                    <div className="text-sm text-green-300/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Demo */}
            <div className="relative">
              <Card className="terminal-window bg-black/90 border-green-400">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-green-400 text-sm">Terminal</div>
                </CardHeader>
                <CardContent className="font-mono text-sm space-y-2">
                  <div className="text-green-400">$ nmap -sV --script vuln 10.10.10.10</div>
                  <div className="text-green-300">Starting Nmap scan...</div>
                  <div className="text-green-300">Scanning target...</div>
                  <div className="text-green-300">Discovered open port 22/tcp</div>
                  <div className="text-green-300">Discovered open port 80/tcp</div>
                  <div className="text-red-400">Discovered vulnerability: CVE-2021-44228</div>
                  <div className="text-green-400">$ <span className="terminal-cursor">|</span></div>
                </CardContent>
              </Card>

              {/* Floating Code Snippets */}
              <div className="absolute -top-4 -right-4 bg-black/80 border border-green-400/50 rounded p-2 text-xs">
                <div className="text-green-400">/* Exploit code */</div>
                <div className="text-green-300">function findVulnerability()  checkSystem();</div>
              
             
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-green-400">Training Modules</h2>
            <p className="text-green-300/80 text-lg">Master cybersecurity through hands-on practice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <feature.icon className={`w-12 h-12 ${feature.color} group-hover:scale-110 transition-transform`} />
                  <CardTitle className="text-green-400">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-300/70">{feature.description}</p>
                  <div className="mt-4 flex items-center text-green-400 group-hover:text-green-300">
                    <span className="text-sm">Start Training</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-green-900/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-green-400/20 text-green-400 border-green-400 mb-4">
              Live Cyber Range
            </Badge>
            <h2 className="text-4xl font-bold text-green-400 mb-4">Real-Time Hacking Simulation</h2>
            <p className="text-green-300/80 text-lg">
              Experience live penetration testing, solve security challenges, and monitor cyber threats in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Terminal */}
            <div className="lg:col-span-2">
              <Card className="bg-black/90 border-green-400 h-96">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-green-400 text-sm flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Live Penetration Testing
                  </div>
                </CardHeader>
                <CardContent className="font-mono text-sm h-full overflow-y-auto">
                  <div className="space-y-1">
                    {terminalLines.map((line, index) => (
                      <div 
                        key={index} 
                        className={`${
                          line.startsWith('$') ? 'text-green-400' :
                          line.includes('CRITICAL') || line.includes('SUCCESS') ? 'text-red-400' :
                          line.includes('open') || line.includes('up') ? 'text-green-300' :
                          line.includes('msf6') ? 'text-purple-400' :
                          'text-green-300/80'
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                    <div className="text-green-400">$ <span className="terminal-cursor">|</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats & Games Panel */}
            <div className="space-y-6">
              {/* Live Stats */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Threat Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {liveStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-green-300/70">{stat.label}</div>
                        <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                      </div>
                      <div className={`text-xs ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.trend}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Games */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 text-sm flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Hacker Challenges
                    </div>
                    <div className="text-green-400 font-mono">Score: {gameScore}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-1">
                    {['cipher', 'hash', 'portscan'].map((game) => (
                      <button
                        key={game}
                        onClick={() => setActiveGame(game)}
                        className={`px-2 py-1 text-xs rounded border ${
                          activeGame === game 
                            ? 'bg-green-400/20 border-green-400 text-green-400' 
                            : 'border-green-400/30 text-green-400/70 hover:text-green-400'
                        }`}
                      >
                        {game.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  {renderGame()}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 text-sm flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-300">Firewall</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-300">IDS/IPS</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-300">Honeypot</span>
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-300">VPN Tunnel</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-green-400 text-black hover:bg-green-300 hacker-btn"
              onClick={() => navigate('/dashboard')}
            >
              <Play className="w-5 h-5 mr-2" />
              Enter Cyber Range
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-green-400">Ready to become a cyber warrior?</h2>
          <p className="text-green-300/80 text-lg mb-8">
            Join thousands of ethical hackers who have mastered cybersecurity through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-400 text-black hover:bg-green-300 hacker-btn"
              onClick={() => navigate('/dashboard')}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-green-400 text-green-400 hover:bg-green-400/10 hacker-btn"
            >
              <Lock className="w-5 h-5 mr-2" />
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-400/20 py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Terminal className="w-6 h-6 text-green-400" />
            <span className="font-bold text-green-400">CyberSec Academy</span>
          </div>
          <div className="text-green-300/60 text-sm">
            © 2024 CyberSec Academy. All rights reserved. Hack responsibly.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
