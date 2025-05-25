import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrolledCourse, Game, Lab, Resource } from "@/lib/types";
import {
  Clock,
  Download,
  FileText,
  Globe,
  Lock,
  Play,
  Target,
  Zap,
} from "lucide-react";

interface CourseTabsProps {
  course: EnrolledCourse;
  activeTab: string;
  activeLab: string | null;
  activeGame: string | null;
  onTabChange: (tab: string) => void;
  onLabSelect: (labId: string) => void;
  onGameSelect: (gameId: string) => void;
}

const CourseTabs = ({
  course,
  activeTab,
  activeLab,
  activeGame,
  onTabChange,
  onLabSelect,
  onGameSelect,
}: CourseTabsProps) => {
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
      case "master":
        return "text-orange-400 bg-orange-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "zip":
        return <Download className="w-4 h-4" />;
      case "html":
        return <Globe className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-green-400/30 bg-green-400/10">
        <h2 className="text-green-400 font-semibold text-lg">Course Details</h2>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-4 bg-black/60 border border-green-400/30">
            <TabsTrigger
              value="details"
              className="text-green-400 data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="labs"
              className="text-green-400 data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              Labs ({course.labs.length})
            </TabsTrigger>
            <TabsTrigger
              value="games"
              className="text-green-400 data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              Games ({course.games.length})
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="text-green-400 data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              Resources ({course.resources.length})
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <div className="bg-black/40 border border-green-400/30 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2">
                  Course Overview
                </h3>
                <p className="text-green-300/80 text-sm leading-relaxed">
                  {course.description}
                </p>
              </div>

              {course.playground.available && (
                <div className="bg-black/40 border border-green-400/30 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    {course.playground.title}
                  </h3>
                  <p className="text-green-300/80 text-sm mb-3">
                    {course.playground.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {course.playground.tools.map((tool, index) => (
                      <div
                        key={index}
                        className="bg-blue-400/10 border border-blue-400/30 rounded px-2 py-1 text-xs text-blue-400"
                      >
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Labs Tab */}
          <TabsContent value="labs" className="mt-4">
            <div className="grid gap-3">
              {course.labs.map((lab: Lab) => (
                <Card
                  key={lab.id}
                  className={`bg-black/50 border-green-400/30 hover:border-green-400 transition-colors cursor-pointer ${
                    activeLab === lab.id
                      ? "border-green-400 bg-green-400/5"
                      : ""
                  }`}
                  onClick={() => onLabSelect(lab.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-400 text-base flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        {lab.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`px-2 py-1 rounded text-xs ${getDifficultyColor(
                            lab.difficulty
                          )}`}
                        >
                          {lab.difficulty}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-green-300/70">
                          <Clock className="w-3 h-3" />
                          <span>{lab.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-300/70">
                        {lab.available ? "Ready to start" : "Coming soon"}
                      </div>
                      <Button
                        size="sm"
                        disabled={!lab.available}
                        className={
                          lab.available
                            ? "bg-green-400 text-black hover:bg-green-300"
                            : "bg-gray-600 text-gray-300 cursor-not-allowed"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (lab.available) {
                            onLabSelect(lab.id);
                          }
                        }}
                      >
                        {lab.available ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Lab
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              {course.games.map((game: Game) => (
                <Card
                  key={game.id}
                  className={`bg-black/50 border-green-400/30 hover:border-green-400 transition-colors cursor-pointer ${
                    activeGame === game.id
                      ? "border-green-400 bg-green-400/5"
                      : ""
                  }`}
                  onClick={() => onGameSelect(game.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-400 text-base">
                        {game.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="bg-yellow-400/20 border border-yellow-400 rounded px-2 py-1 text-yellow-400 text-xs">
                          {game.points} PTS
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-green-300/70">
                          <Clock className="w-3 h-3" />
                          <span>{game.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-300/70">
                        {game.available ? "Ready to play" : "Coming soon"}
                      </div>
                      <Button
                        size="sm"
                        disabled={!game.available}
                        className={
                          game.available
                            ? "bg-green-400 text-black hover:bg-green-300"
                            : "bg-gray-600 text-gray-300 cursor-not-allowed"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (game.available) {
                            onGameSelect(game.id);
                          }
                        }}
                      >
                        {game.available ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Play Game
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-2">
            <div className="grid gap-3">
              {course.resources.map((resource: Resource, index) => (
                <Card
                  key={index}
                  className="bg-black/50 border-green-400/30 hover:border-green-400 transition-colors"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-green-400">
                          {getFileTypeIcon(resource.type)}
                        </div>
                        <div>
                          <div className="font-medium text-green-400 text-sm">
                            {resource.name}
                          </div>
                          <div className="text-xs text-green-300/70">
                            {resource.type.toUpperCase()} • {resource.size}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-400 hover:bg-green-400/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseTabs;
