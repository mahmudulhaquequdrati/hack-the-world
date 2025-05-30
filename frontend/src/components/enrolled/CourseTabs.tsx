import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAllResourcesForLesson,
  getContextualContentForLesson,
} from "@/lib/courseUtils";
import { EnrolledCourse, EnrolledLesson, Resource } from "@/lib/types";
import {
  BookOpen,
  Brain,
  Code,
  Download,
  FileText,
  Gamepad2,
  Monitor,
  Target,
  Terminal,
  Video,
} from "lucide-react";

interface CourseTabsProps {
  course: EnrolledCourse;
  activeTab: string;
  activeLab: string | null;
  activeGame: string | null;
  currentLesson?: EnrolledLesson;
  onTabChange: (tab: string) => void;
  onLabSelect: (labId: string) => void;
  onGameSelect: (gameId: string) => void;
}

const CourseTabs = ({
  course,
  activeTab,
  currentLesson,
  onTabChange,
}: CourseTabsProps) => {
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5 text-cyan-400" />;
      case "text":
        return <FileText className="w-5 h-5 text-green-400" />;
      case "quiz":
        return <Brain className="w-5 h-5 text-purple-400" />;
      case "lab":
        return <Monitor className="w-5 h-5 text-yellow-400" />;
      case "game":
        return <Gamepad2 className="w-5 h-5 text-pink-400" />;
      default:
        return <Monitor className="w-5 h-5 text-blue-400" />;
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "guide":
        return <BookOpen className="w-4 h-4 text-blue-300" />;
      case "template":
        return <Code className="w-4 h-4 text-green-300" />;
      case "tool":
        return <Terminal className="w-4 h-4 text-yellow-300" />;
      case "exercise":
        return <Target className="w-4 h-4 text-red-300" />;
      case "reference":
      default:
        return <FileText className="w-4 h-4 text-purple-300" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "guide":
        return "border-blue-400/40 bg-blue-400/10";
      case "template":
        return "border-green-400/40 bg-green-400/10";
      case "tool":
        return "border-yellow-400/40 bg-yellow-400/10";
      case "exercise":
        return "border-red-400/40 bg-red-400/10";
      case "reference":
      default:
        return "border-purple-400/40 bg-purple-400/10";
    }
  };

  // Get all resources for current lesson
  const getAllResources = () => {
    if (!currentLesson) return course.resources;
    return getAllResourcesForLesson(currentLesson, course.resources);
  };

  // Get contextual resources (lesson-specific)
  const getContextualResources = () => {
    const allResources = getAllResources();
    return allResources.filter((resource) => resource.isContextual);
  };

  // Get course resources (general)
  const getCourseResources = () => {
    const allResources = getAllResources();
    return allResources.filter((resource) => !resource.isContextual);
  };

  const getDetailedDescription = () => {
    if (!currentLesson) return course.description;

    const contextualContent = getContextualContentForLesson(currentLesson);
    const baseDescription = currentLesson.description || course.description;
    const lessonType = currentLesson.type;

    let typeSpecificInfo = "";
    switch (lessonType) {
      case "video":
        typeSpecificInfo =
          "📹 Interactive video content with AI-powered assistance and real-time Q&A support.";
        break;
      case "text":
        typeSpecificInfo =
          "📖 Comprehensive reading material with interactive elements and knowledge checks.";
        break;
      case "lab":
        typeSpecificInfo =
          "🧪 Hands-on laboratory exercise with guided instructions and practical implementation.";
        break;
      case "quiz":
        typeSpecificInfo =
          "🧠 Knowledge assessment with immediate feedback and performance analytics.";
        break;
      case "game":
        typeSpecificInfo =
          "🎮 Gamified learning experience with challenges and achievement tracking.";
        break;
      default:
        typeSpecificInfo =
          "💻 Interactive learning module with multimedia content.";
    }

    return `${baseDescription}\n\n${typeSpecificInfo}\n\nObjectives:\n${contextualContent.objectives
      .map((obj) => `• ${obj}`)
      .join("\n")}`;
  };

  return (
    <div className="bg-black/60 border-2 border-green-400/40 rounded-none overflow-hidden shadow-2xl shadow-green-400/10">
      {/* Terminal-style Header */}
      <div className="bg-green-400/15 border-b-2 border-green-400/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-green-400 font-bold text-lg font-mono tracking-wider">
              LESSON.DETAILS
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs text-green-400/70 font-mono">
            <Terminal className="w-4 h-4" />
            <span>INTERACTIVE_MODE</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-2 bg-black/80 border-2 border-green-400/30 rounded-none">
            <TabsTrigger
              value="details"
              className="text-green-400 font-mono font-bold data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300 rounded-none"
            >
              {`>> DETAILS`}
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="text-green-400 font-mono font-bold data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300 rounded-none"
            >
              {`>> RESOURCES (${getAllResources().length})`}
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <div className="space-y-6">
              {/* Current Lesson Info */}
              {currentLesson && (
                <div className="bg-black/60 border-2 border-cyan-400/40 rounded-none p-5 shadow-lg shadow-cyan-400/10">
                  <div className="flex items-center space-x-3 mb-4">
                    {getLessonTypeIcon(currentLesson.type)}
                    <h3 className="text-cyan-400 font-bold text-lg font-mono tracking-wide">
                      CURRENT: {currentLesson.title.toUpperCase()}
                    </h3>
                  </div>

                  <div className="bg-black/40 border border-cyan-400/30 p-4 rounded-none">
                    <div className="text-xs text-cyan-400/70 font-mono mb-2">
                      DESCRIPTION
                    </div>
                    <p className="text-cyan-300/90 text-sm leading-relaxed font-mono whitespace-pre-line">
                      {getDetailedDescription()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6">
            <div className="space-y-6">
              {/* Contextual Resources */}
              {getContextualResources().length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Target className="w-5 h-5 text-green-400" />
                    <h3 className="text-green-400 font-bold text-lg font-mono">
                      LESSON RESOURCES ({getContextualResources().length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {getContextualResources().map(
                      (resource: Resource, index) => (
                        <Card
                          key={index}
                          className={`bg-black/60 border-2 hover:border-green-400/70 transition-all duration-300 rounded-none shadow-lg hover:shadow-green-400/20 ${getCategoryColor(
                            resource.category
                          )}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="bg-black/60 border border-green-400/30 p-2 rounded-none">
                                  {getCategoryIcon(resource.category)}
                                </div>
                                <div>
                                  <div className="font-bold text-green-400 text-sm font-mono">
                                    {resource.name}
                                  </div>
                                  <div className="text-xs text-green-400/70 font-mono mt-1">
                                    {resource.type.toUpperCase()} •{" "}
                                    {resource.size}
                                    {resource.category &&
                                      ` • ${resource.category.toUpperCase()}`}
                                  </div>
                                  {resource.description && (
                                    <div className="text-xs text-green-300/60 font-mono mt-1">
                                      {resource.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="bg-green-400 text-black hover:bg-green-300 font-mono font-bold rounded-none border-2 border-green-400 transition-all duration-300"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                DOWNLOAD
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Course Resources */}
              {getCourseResources().length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h3 className="text-purple-400 font-bold text-lg font-mono">
                      COURSE RESOURCES ({getCourseResources().length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {getCourseResources().map((resource: Resource, index) => (
                      <Card
                        key={index}
                        className={`bg-black/60 border-2 hover:border-purple-400/70 transition-all duration-300 rounded-none shadow-lg hover:shadow-purple-400/20 ${getCategoryColor(
                          resource.category
                        )}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-black/60 border border-purple-400/30 p-2 rounded-none">
                                {getCategoryIcon(resource.category)}
                              </div>
                              <div>
                                <div className="font-bold text-purple-400 text-sm font-mono">
                                  {resource.name}
                                </div>
                                <div className="text-xs text-purple-400/70 font-mono mt-1">
                                  {resource.type.toUpperCase()} •{" "}
                                  {resource.size}
                                  {resource.category &&
                                    ` • ${resource.category.toUpperCase()}`}
                                </div>
                                {resource.description && (
                                  <div className="text-xs text-purple-300/60 font-mono mt-1">
                                    {resource.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-purple-400 text-black hover:bg-purple-300 font-mono font-bold rounded-none border-2 border-purple-400 transition-all duration-300"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              DOWNLOAD
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseTabs;
