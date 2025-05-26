import { TabsContent } from "@/components/ui/tabs";
import { GameItem } from "@/lib/types";
import { Gamepad2, Star, Trophy } from "lucide-react";

interface GamesTabProps {
  games: GameItem[];
}

const GamesTab = ({ games }: GamesTabProps) => {
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
    if (points >= 200) return "text-red-400 bg-red-400/20 border-red-400/30";
    if (points >= 150)
      return "text-orange-400 bg-orange-400/20 border-orange-400/30";
    if (points >= 100)
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
    return "text-green-400 bg-green-400/20 border-green-400/30";
  };

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
          {games.map((game, index) => (
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
                      className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold ${getTypeColor(
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
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-300/80">
                    <div>• Interactive gameplay</div>
                    <div>• Real-time scoring</div>
                    <div>• Progress tracking</div>
                    <div>• Skill validation</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 && (
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
