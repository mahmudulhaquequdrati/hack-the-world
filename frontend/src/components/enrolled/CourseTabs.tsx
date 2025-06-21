import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrolledCourse, EnrolledLesson } from "@/lib/types";
import {
  Brain,
  FileText,
  Gamepad2,
  Monitor,
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
              <h1>Resources</h1>
              {currentLesson?.resources?.map((resource) => (
                <div key={resource}>
                  <a href={resource} target="_blank" rel="noopener noreferrer">
                    {resource}
                  </a>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseTabs;
