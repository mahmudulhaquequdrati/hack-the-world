import { Phase } from "@/lib/types";
import { Gamepad2, Network, Target, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetContentTypeProgressQuery } from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";

interface DashboardGamesTabProps {
  phases: Phase[];
}

interface GameItem {
  _id: string;
  title: string;
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
  progressPercentage: number;
  maxScore?: number;
}

export const DashboardGamesTab = ({
  phases,
}: DashboardGamesTabProps) => {
  const navigate = useNavigate();
  const { user } = useAuthRTK();

  // Fetch real games data from API
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
  } = useGetContentTypeProgressQuery(
    {
      userId: user?._id || "",
      contentType: "game",
    },
    {
      skip: !user?._id,
    }
  );

  const handlePlayGame = (game: GameItem) => {
    // Navigate to dedicated game route using the real content ID
    navigate(`/learn/${game.moduleId}/game/${game._id}`);
  };

  // Transform real API data into GameItem format
  const transformGamesData = (): GameItem[] => {
    if (!gamesData?.success || !gamesData.data?.content) {
      return [];
    }

    return gamesData.data.content.map((gameContent) => {
      const module = gameContent.module;
      const progress = gameContent.progress;
      const isCompleted = progress?.status === "completed";

      // Find the phase this module belongs to
      const phase = phases.find((p) => p._id === module.phase) || phases[0];

      return {
        _id: gameContent._id,
        title: gameContent.title,
        description:
          gameContent.description ||
          `Interactive cybersecurity game in ${module.title}. Test your skills and compete for high scores.`,
        type: "Challenge", // Default type, could be enhanced with content metadata
        points: progress?.maxScore || 100,
        difficulty: module.difficulty,
        moduleTitle: module.title,
        moduleColor: "#00ff41", // Default green, could be enhanced with module data
        moduleBgColor: "#001100", // Default dark green, could be enhanced
        completed: isCompleted,
        available: true,
        score: progress?.score || undefined,
        phaseId: phase._id,
        phaseTitle: phase.title,
        moduleId: module._id,
        progressPercentage: progress?.progressPercentage || 0,
        maxScore: progress?.maxScore || undefined,
      };
    });
  };

  const games = transformGamesData();

  // Loading state
  if (gamesLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 border-2 border-cyan-400/50 rounded-lg p-6">
          <div className="text-center text-cyan-400 font-mono animate-pulse">
            Loading games data...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (gamesError) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-900/80 to-red-800/80 border-2 border-red-400/50 rounded-lg p-6">
          <div className="text-center text-red-400 font-mono">
            Error loading games: {gamesError.toString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Retro Header */}
      <div className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 border-2 border-cyan-400/50 rounded-lg p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzAwRkZGRiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPgo=')] opacity-30"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/25">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
                  ARCADE ZONE
                </h1>
                <p className="text-cyan-300/80 font-mono text-sm">
                  {games.length} cybersecurity games available
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400 font-mono animate-pulse">
                READY
              </div>
              <div className="text-xs text-purple-300 font-mono">
                {user?.username || "player_one"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {games.length === 0 ? (
        <div className="bg-black/60 border border-cyan-400/30 rounded-lg p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-10 h-10 text-cyan-400" />
          </div>
          <h4 className="text-cyan-400 font-mono text-xl mb-2">GAME_OVER</h4>
          <p className="text-purple-300 font-mono text-sm">
            Insert coin to continue // No games available
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Game Grid - Show all games in a retro arcade style */}
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {games.map((game) => (
              <div
                key={game._id}
                className="group relative bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-cyan-400/30 rounded-lg overflow-hidden hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
              >
                {/* Retro scanlines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent bg-[length:100%_4px] opacity-20"></div>

                {/* Game Header */}
                <div className="relative z-10 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border-b border-cyan-400/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {/* Game Icon */}
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded border border-cyan-400/40 flex items-center justify-center">
                        {game.type === "Challenge" && (
                          <Target className="w-5 h-5 text-red-400" />
                        )}
                        {game.type === "Simulation" && (
                          <Network className="w-5 h-5 text-blue-400" />
                        )}
                        {game.type === "Puzzle" && (
                          <Trophy className="w-5 h-5 text-yellow-400" />
                        )}
                        {!["Challenge", "Simulation", "Puzzle"].includes(
                          game.type
                        ) && <Gamepad2 className="w-5 h-5 text-cyan-400" />}
                      </div>
                      <div>
                        <h3 className="text-cyan-400 font-mono text-sm font-bold">
                          {game.title}
                        </h3>
                        <p className="text-purple-300/80 text-xs font-mono">
                          {game.phaseTitle} • {game.moduleTitle}
                        </p>
                      </div>
                    </div>

                    {/* Game Status */}
                    <div className="text-right">
                      {game.completed ? (
                        <div className="text-green-400 text-xs font-mono font-bold">
                          ✓ COMPLETE
                        </div>
                      ) : (
                        <div className="text-cyan-400 text-xs font-mono font-bold animate-pulse">
                          ▶ READY
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Game Info */}
                <div className="relative z-10 p-4">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  {/* Game Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-black/40 border border-cyan-400/20 rounded p-2">
                      <div className="text-cyan-400 font-mono text-xs font-bold">
                        POINTS
                      </div>
                      <div className="text-white text-sm">{game.points}</div>
                    </div>
                    <div className="bg-black/40 border border-purple-400/20 rounded p-2">
                      <div className="text-purple-400 font-mono text-xs font-bold">
                        TYPE
                      </div>
                      <div className="text-white text-sm">{game.type}</div>
                    </div>
                  </div>

                  {/* High Score */}
                  {game.completed && game.score && (
                    <div className="mb-4 p-2 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/30 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 font-mono text-xs font-bold">
                          HIGH SCORE
                        </span>
                        <span className="text-yellow-300 font-mono text-sm font-bold">
                          {game.score}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Play Button */}
                  <button
                    onClick={() => handlePlayGame(game)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-mono text-sm font-bold py-2 px-4 rounded border border-cyan-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Gamepad2 className="w-4 h-4" />
                      <span>
                        {game.completed ? "PLAY AGAIN" : "START GAME"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
