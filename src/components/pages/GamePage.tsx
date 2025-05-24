import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Network,
  Play,
  Shield,
  Target,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface GameData {
  name: string;
  description: string;
  type: string;
  maxPoints: number;
  timeLimit?: string;
  objectives: string[];
}

const GamePage = () => {
  const navigate = useNavigate();
  const { courseId, gameId } = useParams();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  // Mock game data - in real app this would come from API
  const getGameData = (): GameData => {
    const games: { [key: string]: GameData } = {
      "xss-hunter": {
        name: "XSS Hunter Challenge",
        description: "Find and exploit Cross-Site Scripting vulnerabilities",
        type: "Security Challenge",
        maxPoints: 300,
        timeLimit: "10 minutes",
        objectives: [
          "Find 5 XSS vulnerabilities (20 pts each)",
          "Bypass 3 input filters (30 pts each)",
          "Execute DOM-based XSS (50 pts)",
          "Steal session cookies (100 pts)",
        ],
      },
      "command-master": {
        name: "Command Line Master",
        description: "Speed challenge for Linux command mastery",
        type: "Speed Challenge",
        maxPoints: 500,
        timeLimit: "5 minutes",
        objectives: [
          "Complete 10 basic commands (10 pts each)",
          "Speed bonus for fast completion (5 pts each)",
          "Perfect syntax bonus (3 pts each)",
          "Combo multiplier after 5 correct (x2)",
        ],
      },
      "packet-sniffer": {
        name: "Packet Sniffer Challenge",
        description: "Analyze network traffic to find threats",
        type: "Analysis Game",
        maxPoints: 400,
        timeLimit: "8 minutes",
        objectives: [
          "Identify suspicious packets (25 pts each)",
          "Classify threat types (30 pts each)",
          "Find hidden payloads (50 pts each)",
          "Complete threat analysis (100 pts)",
        ],
      },
    };

    return (
      games[gameId || ""] || {
        name: "Cybersecurity Game",
        description: "Interactive cybersecurity challenge",
        type: "Challenge",
        maxPoints: 200,
        objectives: ["Complete game objectives"],
      }
    );
  };

  const game = getGameData();

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "security challenge":
        return "text-red-400 bg-red-400/20";
      case "speed challenge":
        return "text-green-400 bg-green-400/20";
      case "analysis game":
        return "text-purple-400 bg-purple-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startGame = () => {
    setGameStarted(true);
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pt-5 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Terminal-style Header */}
          <div className="bg-black border-2 border-green-400/50 rounded-lg mb-6 overflow-hidden">
            <div className="bg-green-400/10 border-b border-green-400/30 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-green-400/60 text-xs font-mono">
                  game-arena/{courseId}/{gameId}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-green-400 font-mono text-sm">
                    <span className="text-green-400/60">🎮</span>
                    <span className="text-green-400/60">games</span>
                    <span className="text-green-400/60">/</span>
                    <span className="text-green-400">{courseId}</span>
                    <span className="text-green-400/60">/</span>
                    <span className="text-green-400 animate-pulse">
                      {gameId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/learn/${courseId}`)}
                    className="text-green-400 hover:bg-green-400/10 border border-green-400/30 font-mono text-xs"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    BACK_TO_COURSE
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Game Header */}
          <div className="bg-black/50 border border-green-400/30 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-2 font-mono">
                  {game.name}
                </h1>
                <p className="text-green-300/80 mb-4">{game.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge className={getTypeColor(game.type)}>{game.type}</Badge>
                  {game.timeLimit && (
                    <div className="flex items-center space-x-1 text-green-300/70">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-mono">
                        {game.timeLimit}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-green-400 font-mono">
                  {score} / {game.maxPoints}
                </div>
                <div className="text-sm text-green-300/70">Points</div>
                {gameStarted && game.timeLimit && (
                  <div className="mt-2">
                    <div className="text-lg font-bold text-yellow-400 font-mono">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-xs text-green-300/70">Time Left</div>
                  </div>
                )}
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="bg-black border border-green-400/30 rounded h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400/60 to-yellow-400/60 transition-all duration-500"
                style={{ width: `${(score / game.maxPoints) * 100}%` }}
              />
            </div>
          </div>

          {/* Game Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Game Area */}
            <div className="lg:col-span-2">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Game Arena
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!gameStarted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-green-400 font-semibold mb-2">
                        Ready to Start?
                      </h3>
                      <p className="text-green-300/70 text-sm mb-6">
                        Click the button below to begin the challenge
                      </p>
                      <Button
                        onClick={startGame}
                        className="bg-green-400 text-black hover:bg-green-300"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        START GAME
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Dynamic game content based on gameId */}
                      {gameId === "xss-hunter" && (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg p-4">
                            <h3 className="text-red-400 font-semibold mb-3 flex items-center">
                              <Target className="w-5 h-5 mr-2" />
                              XSS Hunter Challenge - Score: {score} points
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
                              <Button
                                className="bg-red-400 text-white hover:bg-red-300"
                                onClick={() => setScore((prev) => prev + 20)}
                              >
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
                        </div>
                      )}

                      {gameId === "command-master" && (
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
                                    ⏱️ {formatTime(timeRemaining)}
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
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        setScore((prev) => prev + 10);
                                      }
                                    }}
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
                        </div>
                      )}

                      {gameId === "packet-sniffer" && (
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
                              <div
                                className="text-red-400 cursor-pointer hover:bg-red-400/10 p-1 rounded"
                                onClick={() => setScore((prev) => prev + 25)}
                              >
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
                          </div>
                        </div>
                      )}

                      {/* Default game content */}
                      {![
                        "xss-hunter",
                        "command-master",
                        "packet-sniffer",
                      ].includes(gameId || "") && (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-green-400 font-semibold mb-2">
                            Game Environment Ready
                          </h3>
                          <p className="text-green-300/70 text-sm">
                            Interactive cybersecurity game
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Objectives and Leaderboard */}
            <div className="space-y-6">
              {/* Objectives */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {game.objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Trophy className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-green-300/80 text-sm">
                          {objective}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-green-400/5 rounded">
                      <span className="text-green-300/80 text-sm">
                        Current Score
                      </span>
                      <span className="text-green-400 font-bold">{score}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-400/5 rounded">
                      <span className="text-green-300/80 text-sm">
                        Max Possible
                      </span>
                      <span className="text-yellow-400 font-bold">
                        {game.maxPoints}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-400/5 rounded">
                      <span className="text-green-300/80 text-sm">
                        Progress
                      </span>
                      <span className="text-blue-400 font-bold">
                        {Math.round((score / game.maxPoints) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
