import { Button } from "@/components/ui/button";
import { CourseSection, EnrolledCourse } from "@/lib/types";
import {
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  FileText,
  Gamepad2,
  Monitor,
  Play,
  Video,
  X,
  Zap,
} from "lucide-react";

interface ContentSidebarProps {
  course: EnrolledCourse;
  currentVideo: number;
  completedLessons: string[];
  isOpen: boolean;
  onClose: () => void;
  onLessonSelect: (lessonIndex: number) => void;
}

const ContentSidebar = ({
  course,
  currentVideo,
  completedLessons,
  isOpen,
  onClose,
  onLessonSelect,
}: ContentSidebarProps) => {
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-cyan-400" />;
      case "text":
        return <FileText className="w-4 h-4 text-green-400" />;
      case "quiz":
        return <Brain className="w-4 h-4 text-purple-400" />;
      case "lab":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case "game":
        return <Gamepad2 className="w-4 h-4 text-pink-400" />;
      default:
        return <Monitor className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "VIDEO";
      case "text":
        return "READ";
      case "quiz":
        return "QUIZ";
      case "lab":
        return "LAB";
      case "game":
        return "GAME";
      default:
        return "CONTENT";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30";
      case "text":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "quiz":
        return "text-purple-400 bg-purple-400/10 border-purple-400/30";
      case "lab":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "game":
        return "text-pink-400 bg-pink-400/10 border-pink-400/30";
      default:
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-96"
        }`}
      >
        <div className="bg-black/95 border-l-2 border-green-400/40 w-96 h-full backdrop-blur-sm overflow-y-auto hide-scrollbar">
          {/* Header */}
          <div className="p-6 border-b-2 border-green-400/30 sticky top-0 bg-black/95 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold text-green-400 font-mono tracking-wider">
                  COURSE.CONTENT
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-green-400 hover:bg-green-400/20 border border-green-400/30 rounded-none"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-green-300/70 font-mono">
              {course.title}
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-green-400/60">
              <BookOpen className="w-3 h-3" />
              <span>
                {course.sections.reduce(
                  (acc, section) => acc + section.lessons.length,
                  0
                )}{" "}
                MODULES
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[calc(100vh-0px)] pb-20">
            <div className="space-y-4">
              {course.sections.map((section: CourseSection, sectionIndex) => (
                <div key={section.id} className="space-y-2">
                  {/* Section Header */}
                  <div className="bg-green-400/10 border border-green-400/30 rounded-none p-3 mx-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="font-bold text-green-400 text-sm font-mono tracking-wide">
                        {section.title.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-2 pb-6">
                    {section.lessons.map((lesson, lessonIndex) => {
                      const flatIndex =
                        course.sections
                          .slice(0, sectionIndex)
                          .reduce((acc, s) => acc + s.lessons.length, 0) +
                        lessonIndex;

                      const isActive = currentVideo === flatIndex;
                      const isCompleted = completedLessons.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          className={`group cursor-pointer transition-all duration-200 px-1 ${
                            isActive
                              ? "transform scale-[1.01]"
                              : "hover:transform hover:scale-[1.02]"
                          }`}
                          onClick={() => {
                            onLessonSelect(flatIndex);
                            onClose();
                          }}
                        >
                          <div
                            className={`border-2 rounded-none p-4 transition-all ${
                              isActive
                                ? "border-green-400 bg-green-400/15 shadow-lg shadow-green-400/20"
                                : "border-green-400/20 hover:border-green-400/50 hover:bg-green-400/5"
                            }`}
                          >
                            {/* Lesson Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                {/* Completion Status */}
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-green-400/40 rounded-full flex-shrink-0" />
                                )}

                                {/* Content Type Icon */}
                                {getLessonIcon(lesson.type)}
                              </div>

                              {/* Type Badge */}
                              <div
                                className={`px-2 py-1 border rounded-none text-xs font-mono font-bold ${getTypeColor(
                                  lesson.type
                                )}`}
                              >
                                {getTypeLabel(lesson.type)}
                              </div>
                            </div>

                            {/* Lesson Title */}
                            <div className="mb-2">
                              <div
                                className={`text-sm font-semibold font-mono ${
                                  isActive ? "text-green-300" : "text-green-400"
                                } group-hover:text-green-300 transition-colors`}
                              >
                                {lesson.title}
                              </div>
                            </div>

                            {/* Lesson Meta */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-green-300/60">
                                <Clock className="w-3 h-3" />
                                <span className="font-mono">
                                  {lesson.duration}
                                </span>
                              </div>

                              {isActive && (
                                <div className="flex items-center space-x-1 text-xs text-green-400">
                                  <Play className="w-3 h-3" />
                                  <span className="font-mono">ACTIVE</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default ContentSidebar;
