import { Button } from "@/components/ui/button";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { ContentOutcome, Phase, Resource } from "@/lib/types";
import {
  BookOpen,
  Crown,
  Download,
  ExternalLink,
  FileText,
  Gamepad2,
  PenTool,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardGamesTabProps {
  phases: Phase[];
  gamesData?: {
    success: boolean;
    data?: {
      content: GameItem[];
    };
  };
  isLoading?: boolean;
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
  instructions?: string;
  resources?: Resource[];
  outcomes?: ContentOutcome[];
}

// Helper function to get icon for resource type
const getResourceIcon = (type: Resource["type"]) => {
  switch (type) {
    case "url":
      return <ExternalLink className="w-3 h-3" />;
    case "file":
      return <FileText className="w-3 h-3" />;
    case "document":
      return <FileText className="w-3 h-3" />;
    case "tool":
      return <PenTool className="w-3 h-3" />;
    case "reference":
      return <BookOpen className="w-3 h-3" />;
    case "video":
      return <Video className="w-3 h-3" />;
    case "download":
      return <Download className="w-3 h-3" />;
    default:
      return <FileText className="w-3 h-3" />;
  }
};

export const DashboardGamesTab = ({
  gamesData,
  isLoading: gamesLoading = false,
}: DashboardGamesTabProps) => {
  const navigate = useNavigate();
  const { user } = useAuthRTK();

  // Use data from props instead of API call
  const gamesError = null; // No error since we're using props

  const handlePlayGame = (game: GameItem) => {
    // Navigate to dedicated game route using the real content ID
    navigate(`/learn/${game.moduleId}/game/${game._id}`);
  };

  // Use pre-formatted data from props
  const transformGamesData = (): GameItem[] => {
    if (!gamesData?.success || !gamesData.data?.content) {
      return [];
    }

    // Data is already formatted in Dashboard.tsx, just return it
    return gamesData.data.content;
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
    const errorMessage = "Failed to load games";

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-900/80 to-red-800/80 border-2 border-red-400/50 rounded-lg p-6">
          <div className="text-center text-red-400 font-mono">
            Error loading games: {errorMessage}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game, index) => (
              <div
                key={game._id}
                className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-400/10 to-red-400/5 border-b border-red-400/20 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-red-400/20 border border-red-400/40 flex items-center justify-center">
                        <Gamepad2 className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <div className="text-red-400 font-mono text-lg font-bold flex items-center">
                          GAME_{(index + 1).toString().padStart(2, "0")}
                        </div>
                        <h4 className="text-green-400 font-semibold text-xl">
                          {game.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-green-300/90 mb-6 text-base leading-relaxed">
                    {game.description}
                  </p>

                  {/* Game Preview Information */}
                  <div className="space-y-4">
                    {/* Achievement Outcomes or Generic Features */}
                    {game.outcomes && game.outcomes.length > 0 && (
                      <div className="bg-purple-400/5 border border-purple-400/20 rounded-lg p-4">
                        <h5 className="text-purple-400 font-mono text-sm font-bold mb-3 flex items-center">
                          <Crown className="w-4 h-4 mr-2" />
                          UNLOCK_ACHIEVEMENTS
                        </h5>
                        <div className="space-y-2">
                          {game.outcomes
                            .slice(0, 2)
                            .map((outcome, outcomeIndex) => (
                              <div
                                key={outcomeIndex}
                                className="bg-purple-400/5 border border-purple-400/10 rounded p-2"
                              >
                                <div className="text-purple-300 font-medium text-xs mb-1">
                                  🏆 {outcome.title}
                                </div>
                                {outcome.skills &&
                                  outcome.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {outcome.skills
                                        .slice(0, 4)
                                        .map((skill, skillIndex) => (
                                          <span
                                            key={skillIndex}
                                            className="px-2 py-1 bg-purple-400/15 rounded text-xs text-purple-400 font-mono"
                                          >
                                            +
                                            {skill
                                              .toLowerCase()
                                              .replace(/\s+/g, "_")}
                                          </span>
                                        ))}
                                    </div>
                                  )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Game Power-ups/Resources */}
                    {game.resources && game.resources.length > 0 && (
                      <div className="bg-red-400/5 border border-red-400/20 rounded-lg p-3">
                        <h5 className="text-red-400 font-mono text-xs font-bold mb-2 flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" />
                          POWER-UPS
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {game.resources
                            .slice(0, 4)
                            .map((resource, resourceIndex) => (
                              <div
                                key={resourceIndex}
                                className="flex items-center space-x-1 px-2 py-1 bg-red-400/10 border border-red-400/20 rounded text-xs"
                              >
                                <div className="text-red-400">
                                  {getResourceIcon(resource.type)}
                                </div>
                                <span className="text-red-300 font-mono">
                                  🎮 {resource.name}
                                </span>
                              </div>
                            ))}
                          {game.resources.length > 4 && (
                            <div className="px-2 py-1 bg-red-400/5 border border-red-400/10 rounded text-xs text-red-400 font-mono">
                              +{game.resources.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Game Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-orange-400/10 border border-orange-400/20 rounded-lg p-3 text-center">
                        <div className="text-orange-400 font-mono text-xs font-bold mb-1">
                          DIFFICULTY
                        </div>
                        <div className="text-orange-300 text-sm font-semibold">
                          {game.difficulty}
                        </div>
                      </div>
                      <div className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-3 text-center">
                        <div className="text-purple-400 font-mono text-xs font-bold mb-1">
                          POINTS
                        </div>
                        <div className="text-purple-300 text-sm font-semibold">
                          {game.points}
                        </div>
                      </div>
                    </div>

                    {/* Play Game Button */}
                    <Button
                      onClick={() => handlePlayGame(game)}
                      className="w-full bg-green-400 text-black hover:bg-green-300 font-mono text-sm"
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      PLAY_GAME
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
