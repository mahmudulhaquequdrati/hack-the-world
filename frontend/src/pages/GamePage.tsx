import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import useProgressTracking from "@/hooks/useProgressTracking";
import { useGetContentWithModuleAndProgressQuery } from "@/features/api/apiSlice";
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
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GamePage = () => {
  const navigate = useNavigate();
  const { courseId, gameId } = useParams();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  // Progress tracking
  const progressTracking = useProgressTracking();

  // Fetch real game data from API using the content ID
  const { data: gameData, isLoading: gameLoading, error: gameError } = useGetContentWithModuleAndProgressQuery(
    gameId || "",
    {
      skip: !gameId
    }
  );

  // Transform API data to match expected format
  const game = gameData?.success ? {
    name: gameData.data.content.title,
    description: gameData.data.content.description || "Interactive cybersecurity challenge",
    type: "Challenge", // Default type, could be enhanced with content metadata
    maxPoints: gameData.data.progress.maxScore || 200,
    objectives: ["Complete the cybersecurity challenge", "Achieve high score", "Learn security concepts"],
    timeLimit: gameData.data.content.duration ? `${Math.ceil(gameData.data.content.duration / 60)} min` : undefined
  } : {
    name: "Cybersecurity Game",
    description: "Interactive cybersecurity challenge",
    type: "Challenge",
    maxPoints: 200,
    objectives: ["Complete game objectives"],
  };

  // Use the gameId from URL as the MongoDB content ID (it's already the real content ID now)
  const contentId = gameId || "";
  
  // Get current score from API data
  const currentScore = gameData?.data?.progress?.score || 0;
  const progressPercentage = gameData?.data?.progress?.progressPercentage || 0;

  // Initialize score from API data and timer based on game's timeLimit
  useEffect(() => {
    if (gameData?.data?.progress?.score) {
      setScore(gameData.data.progress.score);
    }
    if (game.timeLimit) {
      const minutes = parseInt(game.timeLimit.split(" ")[0]);
      setTimeRemaining(minutes * 60);
    }
  }, [game.timeLimit, gameData]);

  const getGameTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "challenge":
        return "text-red-400 bg-red-400/20 border-red-400/40";
      case "simulation":
        return "text-blue-400 bg-blue-400/20 border-blue-400/40";
      case "quiz":
        return "text-green-400 bg-green-400/20 border-green-400/40";
      case "puzzle":
        return "text-purple-400 bg-purple-400/20 border-purple-400/40";
      default:
        return "text-cyan-400 bg-cyan-400/20 border-cyan-400/40";
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
          // Auto-complete game when time runs out
          handleGameComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGameComplete = async () => {
    if (contentId) {
      await progressTracking.handleCompleteContent(contentId, score, game.maxPoints);
    }
    // Additional game completion logic here
  };

  // Loading state
  if (gameLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-cyan-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-cyan-400 font-mono text-xl mb-2">
            Loading game...
          </div>
          <div className="text-cyan-400/60 font-mono text-sm">
            Initializing game environment
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (gameError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black text-red-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-mono text-xl mb-2">
            Error loading game
          </div>
          <div className="text-red-400/60 font-mono text-sm mb-4">
            {gameError.toString()}
          </div>
          <Button 
            onClick={() => navigate(`/learn/${courseId}`)}
            className="bg-red-400 text-black hover:bg-red-300"
          >
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-cyan-400 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwRkZGRiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPgo=')] opacity-30 animate-pulse"></div>
      
      <div className="relative z-10 pt-3 px-3 sm:pt-5 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Retro Game Header */}
          <div className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 border-2 border-cyan-400/50 rounded-lg mb-4 sm:mb-6 overflow-hidden shadow-lg shadow-cyan-400/20">
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-b border-cyan-400/30 px-2 py-2 sm:px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="text-cyan-400/80 text-xs font-mono hidden sm:block">
                  ARCADE://game-arena/{courseId}/{gameId}
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/learn/${courseId}`)}
                    className="text-cyan-400 hover:bg-cyan-400/10 border border-cyan-400/30 font-mono text-xs hover:scale-105 transition-all min-h-[44px] px-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">EXIT_GAME</span>
                    <span className="sm:hidden">EXIT</span>
                  </Button>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg p-2 border border-cyan-400/20">
                  <div className="flex items-center space-x-1 sm:space-x-2 text-cyan-400 font-mono text-xs sm:text-sm">
                    <span className="text-cyan-400/60">🎮</span>
                    <span className="text-cyan-400/60 hidden sm:inline">games</span>
                    <span className="text-cyan-400/60 hidden sm:inline">/</span>
                    <span className="text-cyan-400 truncate max-w-[100px] sm:max-w-none">{courseId}</span>
                    <span className="text-cyan-400/60">/</span>
                    <span className="text-cyan-400 animate-pulse font-bold truncate max-w-[100px] sm:max-w-none">
                      {gameId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Retro Game Header */}
          <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-cyan-400/40 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 relative overflow-hidden">
            {/* Scanlines effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent bg-[length:100%_4px] opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 font-mono leading-tight">
                    {game.name}
                  </h1>
                  <p className="text-gray-300 mb-4 text-base sm:text-lg">{game.description}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <Badge className={`${getGameTypeColor(game.type)} border-2 font-mono font-bold text-xs sm:text-sm`}>
                      {game.type.toUpperCase()}
                    </Badge>
                    {game.timeLimit && (
                      <div className="flex items-center space-x-1 text-cyan-300 bg-cyan-400/10 px-2 sm:px-3 py-1 rounded border border-cyan-400/30">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-mono font-bold">
                          {game.timeLimit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/40 to-purple-900/40 p-3 sm:p-4 rounded-lg border border-cyan-400/30 text-center lg:text-right min-w-[140px]">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-400 font-mono">
                    {score} / {game.maxPoints}
                  </div>
                  <div className="text-xs sm:text-sm text-cyan-300/70 font-mono">SCORE</div>
                  {gameStarted && game.timeLimit && (
                    <div className="mt-2">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 font-mono animate-pulse">
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-xs text-cyan-300/70 font-mono">TIME LEFT</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Score Progress Bar */}
              <div className="bg-black border-2 border-cyan-400/30 rounded-lg h-3 sm:h-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500 relative"
                  style={{ width: `${(score / game.maxPoints) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Game Area */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-cyan-400/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent bg-[length:100%_4px] opacity-20"></div>
                <CardHeader className="relative z-10 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border-b border-cyan-400/30">
                  <CardTitle className="text-cyan-400 flex items-center font-mono text-xl">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                    GAME_ARENA.EXE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!gameStarted ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                      </div>
                      <h3 className="text-green-400 font-semibold mb-2 text-sm sm:text-base">
                        Ready to Start?
                      </h3>
                      <p className="text-green-300/70 text-xs sm:text-sm mb-6">
                        Click the button below to begin the challenge
                      </p>
                      <Button
                        onClick={startGame}
                        className="bg-green-400 text-black hover:bg-green-300 min-h-[44px] px-6"
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
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="text-sm text-red-400 mb-2 block">
                                  Target Input Field:
                                </label>
                                <Input
                                  placeholder="Enter your search term..."
                                  className="bg-black border-red-400/30 text-red-400 font-mono text-xs sm:text-sm min-h-[44px]"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-red-400 mb-2 block">
                                  XSS Payload:
                                </label>
                                <Input
                                  placeholder="<script>alert('XSS')</script>"
                                  className="bg-black border-red-400/30 text-red-400 font-mono text-xs sm:text-sm min-h-[44px]"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <Button
                                className="bg-red-400 text-white hover:bg-red-300 min-h-[44px] flex-1 sm:flex-none"
                                onClick={() => setScore((prev) => prev + 20)}
                              >
                                <Zap className="w-4 h-4 mr-2" />
                                Execute Payload
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-400/30 text-red-400 hover:bg-red-400/10 min-h-[44px] flex-1 sm:flex-none"
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
                            <div className="bg-black border border-green-400/30 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                              <div className="text-green-300 space-y-2 min-w-[300px] sm:min-w-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                                  <span className="break-words">
                                    Challenge: List all files in /etc with permissions
                                  </span>
                                  <span className="text-yellow-400 whitespace-nowrap">
                                    ⏱️ {formatTime(timeRemaining)}
                                  </span>
                                </div>
                                <div className="text-blue-400 break-all">
                                  Expected command: ls -la /etc
                                </div>
                                <div className="flex flex-col sm:flex-row">
                                  <span className="text-green-400 whitespace-nowrap">
                                    user@game:~${" "}
                                  </span>
                                  <input
                                    className="bg-transparent border-none outline-none text-green-400 flex-1 min-h-[32px] mt-1 sm:mt-0"
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
                            <div className="bg-black border border-purple-400/30 rounded-lg p-3 sm:p-4 font-mono text-xs space-y-1 overflow-x-auto">
                              <div className="text-purple-300 min-w-[300px] sm:min-w-0">
                                Capturing packets... 🔍
                              </div>
                              <div className="text-gray-400 break-all min-w-[300px] sm:min-w-0">
                                192.168.1.100:80 → 192.168.1.1:3345 [HTTP GET]
                              </div>
                              <div className="text-gray-400 break-all min-w-[300px] sm:min-w-0">
                                192.168.1.101:443 → 192.168.1.1:3346 [HTTPS]
                              </div>
                              <div
                                className="text-red-400 cursor-pointer hover:bg-red-400/10 p-1 rounded break-all min-w-[300px] sm:min-w-0 min-h-[44px] flex items-center"
                                onClick={() => setScore((prev) => prev + 25)}
                              >
                                192.168.1.102:1337 → 192.168.1.1:3347
                                [SUSPICIOUS] ⚠️
                              </div>
                              <div className="text-gray-400 break-all min-w-[300px] sm:min-w-0">
                                192.168.1.103:22 → 192.168.1.1:3348 [SSH]
                              </div>
                              <div className="text-gray-400 break-all min-w-[300px] sm:min-w-0">
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
                        <div className="text-center py-8 sm:py-12">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                          </div>
                          <h3 className="text-green-400 font-semibold mb-2 text-sm sm:text-base">
                            Game Environment Ready
                          </h3>
                          <p className="text-green-300/70 text-xs sm:text-sm">
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
