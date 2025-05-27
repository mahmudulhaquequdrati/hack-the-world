import {
  GAME_TYPES,
  getGameTypeColor,
  getPhaseColor,
  getPhaseIcon,
} from "@/lib";
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
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["beginner"]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Generate game items from enrolled modules, organized by module
  const generateGamesFromModules = (): GameItem[] => {
    const games: GameItem[] = [];

    phases.forEach((phase) => {
      const phaseModules = getModulesByPhase(phase.id, true); // Only enrolled modules

      phaseModules.forEach((module) => {
        for (let i = 1; i <= module.games; i++) {
          const isAvailable = module.progress > (i - 1) * (100 / module.games);
          const isCompleted = module.completed && Math.random() > 0.4;
          const gameType = GAME_TYPES[i % GAME_TYPES.length];

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

  // Group games by phase, then by module
  const gamesByPhase = phases.reduce((acc, phase) => {
    const phaseModules = getModulesByPhase(phase.id, true);
    if (phaseModules.length === 0) return acc;

    acc[phase.id] = {
      phase,
      modules: phaseModules.reduce((moduleAcc, module) => {
        const moduleGames = games.filter((game) => game.moduleId === module.id);
        if (moduleGames.length > 0) {
          moduleAcc[module.id] = {
            module,
            games: moduleGames,
          };
        }
        return moduleAcc;
      }, {} as Record<string, { module: Module; games: GameItem[] }>),
    };
    return acc;
  }, {} as Record<string, { phase: Phase; modules: Record<string, { module: Module; games: GameItem[] }> }>);

  return (
    <div className="space-y-6">
      <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">
            ~/games$ find . -name "*.game" -type f | grep enrolled | sort -k1,2
          </span>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
            INTERACTIVE_GAMES
          </h3>
          <p className="text-green-300/70 font-mono text-sm">
            Organized by phases → modules → games • {games.length} total games
            available
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
          <div className="space-y-6">
            {Object.entries(gamesByPhase).map(
              ([phaseId, { phase, modules }]) => {
                const isPhaseExpanded = expandedPhases.includes(phaseId);
                const phaseGameCount = Object.values(modules).reduce(
                  (sum, { games }) => sum + games.length,
                  0
                );
                const phaseCompletedCount = Object.values(modules).reduce(
                  (sum, { games }) =>
                    sum + games.filter((game) => game.completed).length,
                  0
                );
                const phaseTotalPoints = Object.values(modules).reduce(
                  (sum, { games }) =>
                    sum +
                    games.reduce(
                      (gameSum, game) =>
                        gameSum + (game.completed ? game.points : 0),
                      0
                    ),
                  0
                );

                if (phaseGameCount === 0) return null;

                return (
                  <div key={phaseId} className="space-y-4">
                    {/* Phase Header */}
                    <div
                      className={`bg-gradient-to-r from-${
                        phaseId === "beginner"
                          ? "green"
                          : phaseId === "intermediate"
                          ? "yellow"
                          : "red"
                      }-400/10 to-transparent border border-${
                        phaseId === "beginner"
                          ? "green"
                          : phaseId === "intermediate"
                          ? "yellow"
                          : "red"
                      }-400/30 rounded-lg p-4 cursor-pointer transition-all hover:border-opacity-80`}
                      onClick={() => togglePhase(phaseId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {getPhaseIcon(phaseId)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h2
                                className={`text-xl font-bold font-mono ${getPhaseColor(
                                  phaseId
                                )}`}
                              >
                                {phase.title.toUpperCase()}
                              </h2>
                              <span className="text-xs font-mono px-2 py-1 rounded bg-black/40 text-green-300">
                                {Object.keys(modules).length} modules
                              </span>
                            </div>
                            <p className="text-green-300/70 text-sm">
                              {phaseGameCount} games • {phaseCompletedCount}{" "}
                              completed • {phaseTotalPoints} points earned
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div
                              className={`${getPhaseColor(
                                phaseId
                              )} font-mono text-sm font-bold`}
                            >
                              {Math.round(
                                (phaseCompletedCount / phaseGameCount) * 100
                              )}
                              % COMPLETE
                            </div>
                            <div className="text-xs text-green-300/60">
                              phase progress
                            </div>
                          </div>
                          {isPhaseExpanded ? (
                            <ChevronDown
                              className={`w-5 h-5 ${getPhaseColor(phaseId)}`}
                            />
                          ) : (
                            <ChevronRight
                              className={`w-5 h-5 ${getPhaseColor(phaseId)}`}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phase Modules */}
                    {isPhaseExpanded && (
                      <div className="ml-6 space-y-4">
                        {Object.entries(modules).map(
                          ([moduleId, { module, games: moduleGames }]) => {
                            const isModuleExpanded =
                              expandedModules.includes(moduleId);

                            return (
                              <div key={moduleId} className="space-y-3">
                                {/* Module Header */}
                                <div
                                  className={`${module.bgColor} ${module.borderColor} border rounded-lg p-4 cursor-pointer transition-all hover:border-opacity-80`}
                                  onClick={() => toggleModule(moduleId)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className={`p-2 rounded-lg ${module.bgColor}`}
                                      >
                                        <module.icon
                                          className={`w-5 h-5 ${module.color}`}
                                        />
                                      </div>
                                      <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                          <h3 className="text-lg font-bold font-mono text-green-400">
                                            {module.title}
                                          </h3>
                                        </div>
                                        <p className="text-green-300/70 text-sm">
                                          {moduleGames.length} games •{" "}
                                          {
                                            moduleGames.filter(
                                              (game) => game.completed
                                            ).length
                                          }{" "}
                                          completed
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="text-right">
                                        <div className="text-green-400 font-mono text-sm font-bold">
                                          {Math.round(
                                            (moduleGames.filter(
                                              (game) => game.completed
                                            ).length /
                                              moduleGames.length) *
                                              100
                                          )}
                                          % COMPLETE
                                        </div>
                                        <div className="text-xs text-green-300/60">
                                          {module.progress}% module progress
                                        </div>
                                      </div>
                                      {isModuleExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-green-400" />
                                      ) : (
                                        <ChevronRight className="w-5 h-5 text-green-400" />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Module Games */}
                                {isModuleExpanded && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
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
                                                  {(index + 1)
                                                    .toString()
                                                    .padStart(2, "0")}
                                                </div>
                                                <h4 className="text-green-400 font-semibold">
                                                  {game.name}
                                                </h4>
                                              </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <div
                                                className={`px-2 py-1 rounded border text-xs font-mono font-bold ${getGameTypeColor(
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

                                          {/* Game Stats */}
                                          <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-black/40 border border-green-400/20 rounded p-2">
                                              <div className="text-green-400 font-mono text-xs font-bold mb-1">
                                                POINTS
                                              </div>
                                              <div className="text-green-300 text-sm">
                                                {game.points} pts
                                              </div>
                                            </div>
                                            <div className="bg-black/40 border border-green-400/20 rounded p-2">
                                              <div className="text-green-400 font-mono text-xs font-bold mb-1">
                                                TYPE
                                              </div>
                                              <div className="text-green-300 text-sm">
                                                {game.type}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Score Display */}
                                          {game.completed && game.score && (
                                            <div className="mb-4 p-2 bg-green-400/10 border border-green-400/30 rounded">
                                              <div className="text-green-400 font-mono text-xs font-bold mb-1">
                                                BEST SCORE
                                              </div>
                                              <div className="text-green-300 text-sm flex items-center">
                                                <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
                                                {game.score} points
                                              </div>
                                            </div>
                                          )}

                                          {/* Game Actions & Status */}
                                          <div className="flex items-center justify-between pt-3 border-t border-green-400/20">
                                            <div className="flex items-center space-x-2">
                                              <div className="text-green-400 font-mono text-xs">
                                                {game.completed ? (
                                                  <div className="flex items-center space-x-1">
                                                    <span className="text-green-400">
                                                      ✓
                                                    </span>
                                                    <span>COMPLETED</span>
                                                  </div>
                                                ) : game.available ? (
                                                  "○ AVAILABLE"
                                                ) : (
                                                  "⚬ LOCKED"
                                                )}
                                              </div>
                                            </div>
                                            {game.available && (
                                              <button className="px-3 py-1 bg-red-400/20 border border-red-400/40 rounded text-red-400 font-mono text-xs hover:bg-red-400/30 transition-colors">
                                                {game.completed
                                                  ? "PLAY_AGAIN"
                                                  : "START_GAME"}
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
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};
