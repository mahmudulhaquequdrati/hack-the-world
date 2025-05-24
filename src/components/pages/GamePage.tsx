import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  Shield,
  Target,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GamePage = () => {
  const navigate = useNavigate();
  const { courseId, gameId } = useParams();
  const [gameScore, setGameScore] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [level, setLevel] = useState(1);

  // Mock game data - in a real app this would come from an API
  const getGameData = () => {
    const games = {
      "xss-hunter": {
        name: "XSS Hunter Challenge",
        description: "Hunt for XSS vulnerabilities and earn points",
        difficulty: "Intermediate",
        duration: "60 min",
        maxScore: 300,
        challenges: [
          { name: "Find basic XSS", points: 20, completed: false },
          { name: "Bypass input filter", points: 30, completed: false },
          { name: "DOM-based XSS", points: 50, completed: false },
          { name: "Steal session cookies", points: 100, completed: false },
        ],
      },
      "command-master": {
        name: "Command Line Master",
        description: "Speed challenge for Linux command mastery",
        difficulty: "Beginner",
        duration: "45 min",
        maxScore: 500,
        challenges: [
          { name: "Basic navigation", points: 50, completed: false },
          { name: "File operations", points: 75, completed: false },
          { name: "Process management", points: 100, completed: false },
          { name: "Network commands", points: 125, completed: false },
        ],
      },
    };

    return games[gameId as keyof typeof games] || games["xss-hunter"];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20";
      case "advanced":
        return "text-red-400 bg-red-400/20";
      case "expert":
        return "text-purple-400 bg-purple-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const handleChallengeComplete = (points: number) => {
    setGameScore((prev) => prev + points);
    setGameProgress((prev) => Math.min(100, prev + 25));
    if (gameProgress >= 75) {
      setLevel((prev) => prev + 1);
    }
  };

  const game = getGameData();

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pt-5 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(`/learn/${courseId}`)}
            className="mb-4 text-green-400 hover:bg-green-400/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>

          {/* Game Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-1">
                  {game.name}
                </h1>
                <p className="text-green-300/80">{game.description}</p>
              </div>
            </div>

            {/* Game Stats Card */}
            <div className="bg-black/50 border border-green-400/30 rounded-lg p-4 min-w-[300px]">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {gameScore}
                  </div>
                  <div className="text-xs text-green-300/70">Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {level}
                  </div>
                  <div className="text-xs text-green-300/70">Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {gameProgress}%
                  </div>
                  <div className="text-xs text-green-300/70">Progress</div>
                </div>
              </div>
              <Progress
                value={gameProgress}
                className="h-2 bg-black border border-green-400/30 mt-2"
              />
            </div>
          </div>

          {/* Game Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Environment */}
            <div className="lg:col-span-2">
              <Card className="bg-black/50 border-green-400/30 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-xl flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Game Arena
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Dynamic game content based on gameId */}
                  {gameId === "xss-hunter" && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg p-4">
                        <h3 className="text-red-400 font-semibold mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2" />
                          XSS Hunter Challenge - Level {level}
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
                            onClick={() => handleChallengeComplete(20)}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Execute Payload
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                            onClick={() => handleChallengeComplete(30)}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Bypass Filter
                          </Button>
                        </div>
                      </div>

                      {/* Score Display */}
                      <div className="bg-black/30 border border-yellow-400/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-yellow-400 font-semibold">
                            Recent Achievement
                          </span>
                          <Trophy className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="text-green-300/80 text-sm">
                          {gameScore > 0
                            ? `+${gameScore} points earned!`
                            : "Start hunting for vulnerabilities!"}
                        </div>
                      </div>
                    </div>
                  )}

                  {gameId === "command-master" && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-lg p-4">
                        <h3 className="text-green-400 font-semibold mb-3 flex items-center">
                          <Terminal className="w-5 h-5 mr-2" />
                          Command Line Master - Level {level}
                        </h3>
                        <div className="bg-black border border-green-400/30 rounded-lg p-4 font-mono text-sm">
                          <div className="text-green-300 space-y-2">
                            <div className="flex justify-between">
                              <span>
                                Challenge: List all files in /etc with
                                permissions
                              </span>
                              <span className="text-yellow-400">⏱️ 30s</span>
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
                                    handleChallengeComplete(50);
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
                              Level {level}/10
                            </span>
                          </div>
                          <Progress
                            value={level * 10}
                            className="h-2 bg-black border border-green-400/30"
                          />
                        </div>
                      </div>

                      {/* Achievement Display */}
                      <div className="bg-black/30 border border-blue-400/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-400 font-semibold">
                            Speed Stats
                          </span>
                          <Award className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-green-300/80 text-sm">
                          Average time:{" "}
                          {gameScore > 0 ? "12.5s" : "Not started"}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Game Sidebar */}
            <div className="space-y-6">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-lg flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {game.challenges.map((challenge, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded border ${
                          challenge.completed
                            ? "border-green-400/50 bg-green-400/10"
                            : "border-green-400/30"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {challenge.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <div className="w-4 h-4 border border-green-400/30 rounded-full" />
                          )}
                          <span className="text-sm text-green-400">
                            {challenge.name}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-yellow-400 bg-yellow-400/20"
                        >
                          {challenge.points}pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                      <span className="text-sm font-medium text-yellow-400">
                        1. You
                      </span>
                      <span className="text-sm text-yellow-400">
                        {gameScore} pts
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                      <span className="text-sm text-green-300/70">
                        2. CyberNinja
                      </span>
                      <span className="text-sm text-green-300/70">285 pts</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                      <span className="text-sm text-green-300/70">
                        3. HackMaster
                      </span>
                      <span className="text-sm text-green-300/70">270 pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-lg">
                    Game Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-300/70">Difficulty</span>
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-300/70">Duration</span>
                      <span className="text-green-400">{game.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-300/70">Max Score</span>
                      <span className="text-yellow-400">
                        {game.maxScore} pts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-green-400/30 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-green-400 text-sm">
              © 2024 CyberSec Academy. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400 hover:bg-green-400/10"
              >
                Help
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400 hover:bg-green-400/10"
              >
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GamePage;
