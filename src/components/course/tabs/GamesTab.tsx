import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { GameItem } from "@/lib/types";
import { Lock, Play, Shield } from "lucide-react";

interface GamesTabProps {
  games: GameItem[];
  enrollmentStatus: string;
  onEnrollment: () => void;
}

const GamesTab = ({ games, enrollmentStatus, onEnrollment }: GamesTabProps) => {
  return (
    <TabsContent value="games" className="mt-0">
      <div className="grid gap-4 md:grid-cols-2">
        {games.map((game, index) => (
          <div
            key={index}
            className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300"
          >
            <div className="bg-red-400/10 border-b border-red-400/20 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-red-400 font-mono text-sm font-bold flex items-center">
                  <div className="w-6 h-6 rounded bg-red-400/20 border border-red-400 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  {game.name.toUpperCase()}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-400/20 border border-yellow-400 rounded px-2 py-1 text-yellow-400 text-xs font-mono">
                    {game.points} PTS
                  </div>
                  <div className="bg-purple-400/20 border border-purple-400 rounded px-2 py-1 text-purple-400 text-xs font-mono">
                    {game.type.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-green-300/80 mb-4 text-sm leading-relaxed">
                {game.description}
              </p>
              {enrollmentStatus === "enrolled" ? (
                <Button
                  size="sm"
                  className="bg-red-400 text-black hover:bg-red-300 font-mono"
                >
                  <Play className="w-4 h-4 mr-2" />
                  PLAY_GAME
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-400/10 border border-red-400/20 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-mono text-xs font-bold">
                        ENROLLMENT_REQUIRED
                      </span>
                    </div>
                    <p className="text-red-300/80 text-xs font-mono">
                      This game requires course enrollment to access
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onEnrollment}
                    className="bg-green-400 text-black hover:bg-green-300 font-mono"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    ENROLL_TO_ACCESS
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
};

export default GamesTab;
