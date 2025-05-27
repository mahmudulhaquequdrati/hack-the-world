import { Module, Phase } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Terminal,
  Trophy,
} from "lucide-react";
import { useState } from "react";

interface DashboardGamesTabProps {
  phases: Phase[];
  getModulesByPhase: (phaseId: string, enrolledOnly?: boolean) => Module[];
}

interface GameItem {
  id: string;
  name: string;
  description: string;
  type: string;
  points: number;
  difficulty: string;
  moduleTitle: string;
  moduleColor: string;
  moduleBgColor: string;
  completed: boolean;
  available: boolean;
  score?: number;
  phaseId: string;
  phaseTitle: string;
  moduleId: string;
}

export const DashboardGamesTab = ({
  phases,
  getModulesByPhase,
}: DashboardGamesTabProps) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const gameTypes = [
    "Strategy",
    "Puzzle",
    "Simulation",
    "Educational",
    "Speed",
    "CTF",
    "Hunt",
    "Configuration",
  ];

  // Generate game items from enrolled modules, organized by module
  const generateGamesFromModules = (): GameItem[] => {
    const games: GameItem[] = [];

    phases.forEach((phase) => {
      const phaseModules = getModulesByPhase(phase.id, true); // Only enrolled modules

      phaseModules.forEach((module) => {
        for (let i = 1; i <= module.games; i++) {
          const isAvailable = module.progress > (i - 1) * (100 / module.games);
          const isCompleted = module.completed && Math.random() > 0.4;
          const gameType = gameTypes[i % gameTypes.length];

          games.push({
            id: `${module.id}-game-${i}`,
            name: `${gameType}: ${module.topics[i % module.topics.length]}`,
            description: `Interactive ${gameType.toLowerCase()} challenge focused on ${
              module.topics[Math.floor(Math.random() * module.topics.length)]
            }. Test your skills and compete for high scores in this gamified learning experience.`,
            type: gameType,
            points: Math.floor(Math.random() * 300) + 100,
            difficulty: module.difficulty,
            moduleTitle: module.title,
            moduleColor: module.color,
            moduleBgColor: module.bgColor,
            completed: isCompleted,
            available: isAvailable,
            score: isCompleted
              ? Math.floor(Math.random() * 300) + 200
              : undefined,
            phaseId: phase.id,
            phaseTitle: phase.title,
            moduleId: module.id,
          });
        }
      });
    });

    return games;
  };

  const games = generateGamesFromModules();

  // Group games by module
  const gamesByModule = phases.reduce((acc, phase) => {
    const phaseModules = getModulesByPhase(phase.id, true);
    phaseModules.forEach((module) => {
      acc[module.id] = {
        module,
        games: games.filter((game) => game.moduleId === module.id),
        phase,
      };
    });
    return acc;
  }, {} as Record<string, { module: Module; games: GameItem[]; phase: Phase }>);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "strategy":
        return "text-purple-400 bg-purple-400/20 border-purple-400/30";
      case "puzzle":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
      case "simulation":
        return "text-cyan-400 bg-cyan-400/20 border-cyan-400/30";
      case "educational":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "speed":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "ctf":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "hunt":
        return "text-orange-400 bg-orange-400/20 border-orange-400/30";
      case "configuration":
        return "text-indigo-400 bg-indigo-400/20 border-indigo-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  const getPointsColor = (points: number) => {
    if (points >= 300) return "text-red-400 bg-red-400/20 border-red-400/30";
    if (points >= 200)
      return "text-orange-400 bg-orange-400/20 border-orange-400/30";
    if (points >= 150)
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
    return "text-green-400 bg-green-400/20 border-green-400/30";
  };

  const getPhaseColor = (phaseId: string) => {
    switch (phaseId) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">
            ~/games$ find . -name "*.game" -type f | grep enrolled | sort -k2
          </span>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
            INTERACTIVE_GAMES
          </h3>
          <p className="text-green-300/70 font-mono text-sm">
            Organized by modules • {games.length} total games available
          </p>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
            <h4 className="text-green-400 font-mono text-lg mb-2">
              NO_GAMES_AVAILABLE
            </h4>
            <p className="text-green-300/60 font-mono text-sm">
              Enroll in courses to access interactive games
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(gamesByModule).map(
              ([moduleId, { module, games: moduleGames, phase }]) => {
                const isExpanded = expandedModules.includes(moduleId);

                if (moduleGames.length === 0) return null;

                return (
                  <div key={moduleId} className="space-y-3">
                    {/* Module Header */}
                    <div
                      className={`${module.bgColor} ${module.borderColor} border rounded-lg p-4 cursor-pointer transition-all hover:border-opacity-80`}
                      onClick={() => toggleModule(moduleId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${module.bgColor}`}>
                            <module.icon
                              className={`w-5 h-5 ${module.color}`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-bold font-mono text-green-400">
                                {module.title}
                              </h3>
                              <span
                                className={`text-xs font-mono px-2 py-1 rounded ${getPhaseColor(
                                  phase.id
                                )} bg-current/10`}
                              >
                                {phase.title}
                              </span>
                            </div>
                            <p className="text-green-300/70 text-sm">
                              {moduleGames.length} games •{" "}
                              {
                                moduleGames.filter((game) => game.completed)
                                  .length
                              }{" "}
                              completed •{" "}
                              {moduleGames.reduce(
                                (sum, game) => sum + (game.score || 0),
                                0
                              )}{" "}
                              total points
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-green-400 font-mono text-sm font-bold">
                              {Math.round(
                                (moduleGames.filter((game) => game.completed)
                                  .length /
                                  moduleGames.length) *
                                  100
                              )}
                              % COMPLETE
                            </div>
                            <div className="text-xs text-green-300/60">
                              {module.progress}% module progress
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-green-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Module Games */}
                    {isExpanded && (
                      <div className="grid gap-3 md:grid-cols-2 ml-6">
                        {moduleGames.map((game, index) => (
                          <div
                            key={game.id}
                            className={`bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300 ${
                              !game.available ? "opacity-50" : ""
                            }`}
                          >
                            {/* Game Header */}
                            <div className="bg-gradient-to-r from-red-400/10 to-red-400/5 border-b border-red-400/20 px-4 py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded bg-red-400/20 border border-red-400/40 flex items-center justify-center">
                                    <Gamepad2 className="w-4 h-4 text-red-400" />
                                  </div>
                                  <div>
                                    <div className="text-red-400 font-mono text-sm font-bold">
                                      GAME_
                                      {(index + 1).toString().padStart(2, "0")}
                                    </div>
                                    <h4 className="text-green-400 font-semibold">
                                      {game.name}
                                    </h4>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                  <div
                                    className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${getPointsColor(
                                      game.points
                                    )}`}
                                  >
                                    <Trophy className="w-3 h-3 inline mr-1" />
                                    {game.points}
                                  </div>
                                  <div
                                    className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${getTypeColor(
                                      game.type
                                    )}`}
                                  >
                                    {game.type.toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Game Content */}
                            <div className="p-4">
                              <p className="text-green-300/90 mb-4 text-sm leading-relaxed">
                                {game.description}
                              </p>

                              {/* Game Features */}
                              <div className="mb-4 p-3 bg-green-400/5 border border-green-400/20 rounded">
                                <h5 className="text-green-400 font-mono text-xs font-bold mb-2 flex items-center">
                                  <Gamepad2 className="w-3 h-3 mr-1" />
                                  FEATURES
                                </h5>
                                <div className="grid grid-cols-2 gap-1 text-xs text-green-300/80">
                                  <div>• Interactive</div>
                                  <div>• Real-time</div>
                                  <div>• Progress tracking</div>
                                  <div>• Skill validation</div>
                                </div>
                              </div>

                              {/* Score display for completed games */}
                              {game.completed && game.score && (
                                <div className="mb-3 p-2 bg-blue-400/10 border border-blue-400/30 rounded">
                                  <div className="flex items-center justify-between">
                                    <span className="text-blue-400 font-mono text-xs font-bold">
                                      YOUR_SCORE
                                    </span>
                                    <span className="text-blue-400 font-mono text-sm font-bold">
                                      {game.score} / {game.points}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Game Actions & Status */}
                              <div className="flex items-center justify-between pt-3 border-t border-green-400/20">
                                <div className="text-green-400 font-mono text-xs">
                                  {game.completed
                                    ? "✓ COMPLETED"
                                    : game.available
                                    ? "○ AVAILABLE"
                                    : "⚬ LOCKED"}
                                </div>
                                {game.available && (
                                  <button className="px-3 py-1 bg-red-400/20 border border-red-400/40 rounded text-red-400 font-mono text-xs hover:bg-red-400/30 transition-colors">
                                    {game.completed ? "REPLAY" : "PLAY_GAME"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};
