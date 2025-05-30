import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getGameTypeColor } from "@/lib";
import { Game } from "@/lib/types";
import {
  CheckCircle,
  Clock,
  ExternalLink,
  Star,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";

interface EnhancedGameViewProps {
  game: Game;
  onStartGame: () => void;
  onChallengeComplete: (challengeId: string) => void;
}

const EnhancedGameView = ({
  game,
  onStartGame,
  onChallengeComplete,
}: EnhancedGameViewProps) => {
  const completedChallenges = game.challenges.filter(
    (challenge) => challenge.completed
  ).length;
  const totalPoints = game.challenges.reduce(
    (sum, challenge) => sum + (challenge.completed ? challenge.points : 0),
    0
  );
  const progressPercentage =
    (completedChallenges / game.challenges.length) * 100;

  return (
    <div className="bg-black/60 border-2 border-pink-400/40 rounded-none overflow-hidden shadow-2xl shadow-pink-400/10">
      {/* Header */}
      <div className="bg-pink-400/15 border-b-2 border-pink-400/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
            <h2 className="text-pink-400 font-bold text-xl font-mono tracking-wider">
              GAME.ARENA
            </h2>
          </div>
          <div
            className={`px-3 py-1 border rounded-none text-xs font-mono font-bold ${getGameTypeColor(
              game.type
            )}`}
          >
            {game.type.toUpperCase()}
          </div>
        </div>

        <h3 className="text-pink-300 text-2xl font-bold font-mono mb-2">
          {game.name}
        </h3>

        <p className="text-pink-300/80 font-mono text-sm leading-relaxed mb-4">
          {game.description}
        </p>

        {/* Progress & Score */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-pink-400/70">PROGRESS</span>
              <span className="text-pink-400">
                {completedChallenges}/{game.challenges.length} CHALLENGES
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-black/50 border border-pink-400/30"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-pink-400/70">SCORE</span>
              <span className="text-pink-400">
                {totalPoints}/{game.maxScore} PTS
              </span>
            </div>
            <Progress
              value={(totalPoints / game.maxScore) * 100}
              className="h-2 bg-black/50 border border-pink-400/30"
            />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Game Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Duration */}
          <Card className="bg-black/40 border border-pink-400/30 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-pink-400" />
                <span className="text-pink-400 font-mono text-sm font-bold">
                  DURATION
                </span>
              </div>
              <div className="text-pink-300 font-mono">{game.duration}</div>
              {game.timeLimit && (
                <div className="text-pink-400/60 font-mono text-xs mt-1">
                  Time Limit: {game.timeLimit}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category */}
          <Card className="bg-black/40 border border-pink-400/30 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-pink-400" />
                <span className="text-pink-400 font-mono text-sm font-bold">
                  CATEGORY
                </span>
              </div>
              <div className="text-pink-300 font-mono">
                {game.category.replace("-", " ").toUpperCase()}
              </div>
            </CardContent>
          </Card>

          {/* Max Score */}
          <Card className="bg-black/40 border border-pink-400/30 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-4 h-4 text-pink-400" />
                <span className="text-pink-400 font-mono text-sm font-bold">
                  MAX SCORE
                </span>
              </div>
              <div className="text-pink-300 font-mono">
                {game.maxScore} POINTS
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Gained */}
        <Card className="bg-black/40 border border-green-400/30 rounded-none">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-green-400" />
              <h3 className="text-green-400 font-bold text-lg font-mono">
                SKILLS GAINED
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {game.skillsGained.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-400/20 border border-green-400/40 text-green-300 text-sm font-mono rounded-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Objectives */}
        <Card className="bg-black/40 border border-blue-400/30 rounded-none">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-blue-400" />
              <h3 className="text-blue-400 font-bold text-lg font-mono">
                OBJECTIVES
              </h3>
            </div>
            <div className="space-y-2">
              {game.objectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-300/90 text-sm font-mono">
                    {objective}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Challenges */}
        <Card className="bg-black/40 border border-purple-400/30 rounded-none">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <h3 className="text-purple-400 font-bold text-lg font-mono">
                CHALLENGES
              </h3>
            </div>
            <div className="space-y-3">
              {game.challenges.map((challenge, index) => (
                <div
                  key={challenge.id}
                  className={`p-4 border rounded-none transition-all ${
                    challenge.completed
                      ? "border-green-400/40 bg-green-400/10"
                      : "border-purple-400/40 bg-purple-400/5 hover:bg-purple-400/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          challenge.completed
                            ? "border-green-400 bg-green-400/20"
                            : "border-purple-400/50 bg-purple-400/10"
                        }`}
                      >
                        {challenge.completed ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <span className="text-purple-400 text-xs font-bold">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <h4 className="text-purple-300 font-mono font-bold">
                        {challenge.title}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-mono border rounded-none ${
                          challenge.difficulty === "easy"
                            ? "border-green-400/40 text-green-400"
                            : challenge.difficulty === "medium"
                            ? "border-yellow-400/40 text-yellow-400"
                            : "border-red-400/40 text-red-400"
                        }`}
                      >
                        {challenge.difficulty.toUpperCase()}
                      </span>
                      <span className="text-purple-400 font-mono text-sm">
                        {challenge.points} PTS
                      </span>
                    </div>
                  </div>
                  <p className="text-purple-300/80 text-sm font-mono mb-3">
                    {challenge.description}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`font-mono text-xs rounded-none ${
                      challenge.completed
                        ? "border-green-400/50 text-green-400 bg-green-400/10"
                        : "border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
                    }`}
                    onClick={() => onChallengeComplete(challenge.id)}
                    disabled={challenge.completed}
                  >
                    {challenge.completed ? "COMPLETED" : "START CHALLENGE"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-pink-400/30">
          <div className="flex items-center space-x-4">
            <div className="text-pink-400/70 text-sm font-mono">
              {completedChallenges === game.challenges.length
                ? "🏆 GAME COMPLETED"
                : "🎮 GAME IN PROGRESS"}
            </div>
            {game.timeLimit && (
              <div className="flex items-center space-x-2 text-orange-400/70 text-sm font-mono">
                <Timer className="w-4 h-4" />
                <span>Time Limit: {game.timeLimit}</span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={onStartGame}
              className="bg-pink-400 text-black hover:bg-pink-300 font-mono font-bold rounded-none border-2 border-pink-400"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {completedChallenges === game.challenges.length
                ? "REPLAY GAME"
                : "START GAME"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGameView;
