import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrolledCourse, EnrolledLesson, Resource, ContentOutcome } from "@/lib/types";
import {
  Brain,
  FileText,
  Gamepad2,
  Monitor,
  Terminal,
  Video,
  ExternalLink,
  Download,
  Wrench,
  BookOpen,
  Trophy,
  Target,
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

  // Helper function to get icon for resource type
  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "url":
        return <ExternalLink className="w-4 h-4" />;
      case "file":
        return <FileText className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "tool":
        return <Wrench className="w-4 h-4" />;
      case "reference":
        return <BookOpen className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "download":
        return <Download className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Get all resources for current lesson
  const getAllResources = () => {
    return currentLesson?.resources || [];
  };

  const getDetailedDescription = () => {
    if (!currentLesson) return course.description;

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

    return `${baseDescription}\n\n${typeSpecificInfo}`;
  };

  return (
    <div className="bg-black/60 border-2 border-green-400/40 rounded-none overflow-hidden shadow-2xl shadow-green-400/10">
      {/* Terminal-style Header */}
      <div className="bg-green-400/15 border-b-2 border-green-400/40 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="flex space-x-1 flex-shrink-0">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-green-400 font-bold text-base sm:text-lg font-mono tracking-wider truncate">
              LESSON.DETAILS
            </h2>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-green-400/70 font-mono flex-shrink-0">
            <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">INTERACTIVE_MODE</span>
            <span className="sm:hidden">ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-2 bg-black/80 border-2 border-green-400/30 rounded-none">
            <TabsTrigger
              value="details"
              className="text-green-400 font-mono font-bold data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300 rounded-none text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">{`>> DETAILS`}</span>
              <span className="sm:hidden">{`DETAILS`}</span>
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="text-green-400 font-mono font-bold data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300 rounded-none text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">{`>> RESOURCES (${
                getAllResources().length
              })`}</span>
              <span className="sm:hidden">{`RESOURCES`}</span>
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Current Lesson Info */}
              {currentLesson && (
                <div className="bg-black/60 border-2 border-cyan-400/40 rounded-none p-3 sm:p-5 shadow-lg shadow-cyan-400/10">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <div className="flex-shrink-0">
                      {getLessonTypeIcon(currentLesson.type)}
                    </div>
                    <h3 className="text-cyan-400 font-bold text-sm sm:text-lg font-mono tracking-wide truncate">
                      <span className="hidden sm:inline">
                        CURRENT: {currentLesson.title.toUpperCase()}
                      </span>
                      <span className="sm:hidden">
                        {currentLesson.title.toUpperCase()}
                      </span>
                    </h3>
                  </div>

                  <div className="bg-black/40 border border-cyan-400/30 p-3 sm:p-4 rounded-none">
                    <div className="text-xs text-cyan-400/70 font-mono mb-2">
                      DESCRIPTION
                    </div>
                    <p className="text-cyan-300/90 text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-line">
                      {getDetailedDescription()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Resources Section */}
              {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                <div className="bg-black/60 border-2 border-green-400/40 rounded-none p-3 sm:p-5">
                  <h3 className="text-green-400 font-mono text-sm sm:text-lg font-bold mb-4 flex items-center">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    LESSON_RESOURCES
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {currentLesson.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="bg-black/40 border border-green-400/30 rounded-none p-3 hover:border-green-400/60 transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-green-400 flex-shrink-0 mt-1">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-green-300 font-semibold text-sm truncate">
                                {resource.name}
                              </h4>
                              {resource.category && (
                                <span className={`px-2 py-1 rounded text-xs font-mono flex-shrink-0 ml-2 ${
                                  resource.category === "essential" 
                                    ? "bg-red-400/20 text-red-400 border border-red-400/30" 
                                    : resource.category === "advanced"
                                    ? "bg-orange-400/20 text-orange-400 border border-orange-400/30"
                                    : "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                                }`}>
                                  {resource.category.toUpperCase()}
                                </span>
                              )}
                            </div>
                            {resource.description && (
                              <p className="text-green-300/70 text-xs mb-2">
                                {resource.description}
                              </p>
                            )}
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-xs font-mono transition-colors duration-200"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                ACCESS_RESOURCE
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-black/40 border border-green-400/30 rounded-none p-6 text-center">
                  <BookOpen className="w-12 h-12 text-green-400/30 mx-auto mb-4" />
                  <h4 className="text-green-400 font-mono text-lg mb-2">
                    NO_RESOURCES_AVAILABLE
                  </h4>
                  <p className="text-green-300/60 font-mono text-sm">
                    This lesson doesn't have additional resources
                  </p>
                </div>
              )}

              {/* Outcomes Section for Labs and Games */}
              {currentLesson && (currentLesson.type === "lab" || currentLesson.type === "game") && currentLesson.outcomes && currentLesson.outcomes.length > 0 && (
                <div className="bg-black/60 border-2 border-purple-400/40 rounded-none p-3 sm:p-5">
                  <h3 className="text-purple-400 font-mono text-sm sm:text-lg font-bold mb-4 flex items-center">
                    {currentLesson.type === "lab" ? (
                      <>
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        LEARNING_OUTCOMES
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        ACHIEVEMENT_OUTCOMES
                      </>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {currentLesson.outcomes.map((outcome, index) => (
                      <div
                        key={index}
                        className="bg-purple-400/5 border border-purple-400/20 rounded-none p-3"
                      >
                        <div className="text-purple-300 font-semibold text-sm mb-1">
                          {currentLesson.type === "lab" ? "🎯" : "🏆"} {outcome.title}
                        </div>
                        <div className="text-purple-300/80 text-xs mb-2">
                          {outcome.description}
                        </div>
                        {outcome.skills && outcome.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {outcome.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-2 py-1 bg-purple-400/20 border border-purple-400/30 rounded text-xs text-purple-400 font-mono"
                              >
                                {currentLesson.type === "lab" ? "#" : "+"}
                                {skill.toLowerCase().replace(/\s+/g, "_")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
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
