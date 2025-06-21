import { TabsContent } from "@/components/ui/tabs";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Gamepad2 } from "lucide-react";

interface GamesTabProps {
  moduleOverview?: {
    [sectionName: string]: Array<{
      _id: string;
      type: "video" | "lab" | "game" | "text" | "quiz";
      title: string;
      description: string;
      section: string;
      duration: string;
    }>;
  };
  isLoadingOverview?: boolean;
  overviewError?: FetchBaseQueryError | SerializedError | undefined;
  difficulty: string;
  isEnrolled: boolean | undefined;
}

type GameContentItem = {
  _id: string;
  type: "game";
  title: string;
  description: string;
  section: string;
  duration: string;
};

const GamesTab = ({
  moduleOverview,
  isLoadingOverview = false,
  overviewError,
  difficulty,
  isEnrolled = false,
}: GamesTabProps) => {
  // Extract game items from the moduleOverview prop instead of calling API
  const gamesFromAPI = moduleOverview
    ? Object.values(moduleOverview)
        .flat()
        .filter((item): item is GameContentItem => {
          const typedItem = item as { type: string };
          return typedItem.type === "game";
        })
    : [];

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
    !overviewError && gamesFromAPI.length > 0 ? gamesFromAPI : [];

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
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-green-300/90 mb-6 text-base leading-relaxed">
                      {game.description}
                    </p>

                    {/* Game Preview Information */}
                    <div className="space-y-4">
                      {/* Game Features & Skills */}
                      <div className="bg-red-400/5 border border-red-400/20 rounded-lg p-4">
                        <h5 className="text-red-400 font-mono text-sm font-bold mb-3 flex items-center">
                          <Gamepad2 className="w-4 h-4 mr-2" />
                          GAME_FEATURES & SKILLS
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-red-300/80">
                          <div>• Interactive gameplay</div>
                          <div>• Real-time scoring</div>
                          <div>• Progress tracking</div>
                          <div>• Skill validation</div>
                          <div>• Competitive challenges</div>
                          <div>• Scenario-based learning</div>
                        </div>
                      </div>

                      {/* Game Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-orange-400/10 border border-orange-400/20 rounded-lg p-3 text-center">
                          <div className="text-orange-400 font-mono text-xs font-bold mb-1">
                            DIFFICULTY
                          </div>
                          <div className="text-orange-300 text-sm font-semibold">
                            {difficulty}
                          </div>
                        </div>
                        <div className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-3 text-center">
                          <div className="text-purple-400 font-mono text-xs font-bold mb-1">
                            DURATION
                          </div>
                          <div className="text-purple-300 text-sm font-semibold">
                            {game.duration} mins
                          </div>
                        </div>
                      </div>

                      {/* Enrollment Prompt */}
                      {!isEnrolled && (
                        <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4 text-center">
                          <p className="text-green-400 font-mono text-sm font-bold mb-1">
                            ENROLL_TO_PLAY
                          </p>
                          <p className="text-green-300/80 font-mono text-xs">
                            Join the course to start this interactive game
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            : null}
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
