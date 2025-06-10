import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { getGameTypeColor, getPointsColor } from "@/lib";
import { GameItem } from "@/lib/types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Gamepad2, Play, Star, Trophy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface GamesTabProps {
  games: GameItem[];
  moduleId?: string;
  moduleOverview?: {
    [sectionName: string]: Array<{
      _id: string;
      type: "video" | "lab" | "game" | "text" | "quiz";
      title: string;
      description: string;
      section: string;
    }>;
  };
  isLoadingOverview?: boolean;
  overviewError?: FetchBaseQueryError | SerializedError | undefined;
}

type GameContentItem = {
  _id: string;
  type: "game";
  title: string;
  description: string;
  section: string;
};

const GamesTab = ({
  games,
  moduleOverview,
  isLoadingOverview = false,
  overviewError,
}: GamesTabProps) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Extract game items from the moduleOverview prop instead of calling API
  const gamesFromAPI = moduleOverview
    ? Object.values(moduleOverview)
        .flat()
        .filter((item): item is GameContentItem => {
          const typedItem = item as { type: string };
          return typedItem.type === "game";
        })
    : [];

  const handlePlayGame = (gameName: string) => {
    // Convert game name to a URL-friendly ID and navigate to dedicated game route
    const gameId = gameName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    navigate(`/learn/${courseId}/game/${gameId}`);
  };

  if (isLoadingOverview) {
    return (
      <TabsContent value="games" className="mt-0">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <span className="ml-3 text-green-400 font-mono">
            LOADING_GAMES...
          </span>
        </div>
      </TabsContent>
    );
  }

  // Use API data if available, otherwise fall back to original games data
  const gamesToShow =
    !overviewError && gamesFromAPI.length > 0 ? gamesFromAPI : games;

  return (
    <TabsContent value="games" className="mt-0">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
            INTERACTIVE_GAMES
          </h3>
          <p className="text-green-300/70 font-mono text-sm">
            Gamified learning experiences to test your skills
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Show API-based games */}
          {!overviewError && gamesFromAPI.length > 0
            ? gamesFromAPI.map((game, index) => (
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
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 rounded-lg border text-xs font-mono font-bold text-red-400 bg-red-400/20 border-red-400/30">
                          GAME
                        </div>
                        <div className="text-green-400 font-mono text-sm">
                          {game.section}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-green-300/90 mb-6 text-base leading-relaxed">
                      {game.description}
                    </p>

                    {/* Game Features */}
                    <div className="mt-6 p-4 bg-green-400/5 border border-green-400/20 rounded-lg">
                      <h5 className="text-green-400 font-mono text-sm font-bold mb-2 flex items-center">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        GAME_FEATURES
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-sm text-green-300/80 mb-4">
                        <div>• Interactive gameplay</div>
                        <div>• Real-time scoring</div>
                        <div>• Progress tracking</div>
                        <div>• Skill validation</div>
                      </div>

                      {/* Play Game Button */}
                      <Button
                        onClick={() => handlePlayGame(game.title)}
                        className="w-full bg-green-400 text-black hover:bg-green-300 font-mono text-sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        PLAY_GAME
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : // Fallback to original games data
              games.map((game, index) => (
                <div
                  key={index}
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
                            {game.name}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold ${getPointsColor(
                            game.points
                          )}`}
                        >
                          <Trophy className="w-3 h-3 inline mr-1" />
                          {game.points} PTS
                        </div>
                        <div
                          className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold ${getGameTypeColor(
                            game.type
                          )}`}
                        >
                          {game.type.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-green-300/90 mb-6 text-base leading-relaxed">
                      {game.description}
                    </p>

                    {/* Game Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-green-400/20">
                      <div className="text-center">
                        <div className="text-green-400 font-mono text-xs font-bold mb-1">
                          GAME_TYPE
                        </div>
                        <div className="text-green-300/80 text-sm capitalize">
                          {game.type}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-mono text-xs font-bold mb-1">
                          MAX_POINTS
                        </div>
                        <div className="text-green-300/80 text-sm flex items-center justify-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {game.points}
                        </div>
                      </div>
                    </div>

                    {/* Game Features */}
                    <div className="mt-6 p-4 bg-green-400/5 border border-green-400/20 rounded-lg">
                      <h5 className="text-green-400 font-mono text-sm font-bold mb-2 flex items-center">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        GAME_FEATURES
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-sm text-green-300/80 mb-4">
                        <div>• Interactive gameplay</div>
                        <div>• Real-time scoring</div>
                        <div>• Progress tracking</div>
                        <div>• Skill validation</div>
                      </div>

                      {/* Play Game Button */}
                      <Button
                        onClick={() => handlePlayGame(game.name)}
                        className="w-full bg-green-400 text-black hover:bg-green-300 font-mono text-sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        PLAY_GAME
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {gamesToShow.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
            <h4 className="text-green-400 font-mono text-lg mb-2">
              NO_GAMES_AVAILABLE
            </h4>
            <p className="text-green-300/60 font-mono text-sm">
              Interactive games will be added to this course soon
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default GamesTab;
