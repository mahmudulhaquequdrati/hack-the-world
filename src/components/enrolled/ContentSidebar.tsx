import { Button } from "@/components/ui/button";
import { CourseSection, EnrolledCourse } from "@/lib/types";
import { Brain, CheckCircle, FileText, Video, X, Zap } from "lucide-react";

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
        return <Video className="w-3 h-3 text-green-400/70" />;
      case "text":
        return <FileText className="w-3 h-3 text-green-400/70" />;
      case "quiz":
        return <Brain className="w-3 h-3 text-green-400/70" />;
      case "lab":
        return <Zap className="w-3 h-3 text-green-400/70" />;
      default:
        return <FileText className="w-3 h-3 text-green-400/70" />;
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
        <div className="bg-black/95 border-l border-green-400/30 w-96 h-full backdrop-blur-sm overflow-y-auto hide-scrollbar">
          <div className="p-4 border-b border-green-400/30 px-4 sticky top-0 bg-black/95 pr-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-green-400">
                Course Content
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-green-400 hover:bg-green-400/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-green-300/70">{course.title}</div>
          </div>

          <div className="p-4 h-[calc(100vh-100px)] pb-20 px-2">
            <div className="space-y-1">
              {course.sections.map((section: CourseSection, sectionIndex) => (
                <div key={section.id} className="space-y-1">
                  <div className="font-medium text-green-400 text-sm py-2 px-2 mx-2 bg-green-400/10 rounded">
                    {section.title}
                  </div>
                  <div className="space-y-1 mx-2">
                    {section.lessons.map((lesson, lessonIndex) => {
                      const flatIndex =
                        course.sections
                          .slice(0, sectionIndex)
                          .reduce((acc, s) => acc + s.lessons.length, 0) +
                        lessonIndex;

                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all group ${
                            currentVideo === flatIndex
                              ? "border-green-400 bg-green-400/10"
                              : "border-green-400/20 hover:border-green-400/40 hover:bg-green-400/5"
                          }`}
                          onClick={() => {
                            onLessonSelect(flatIndex);
                            onClose();
                          }}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <div className="flex items-center space-x-2">
                              {completedLessons.includes(lesson.id) ? (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              ) : (
                                <div className="w-3 h-3 border border-green-400/30 rounded-full" />
                              )}
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-green-400 group-hover:text-green-300">
                                {lesson.title}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-green-300/50">
                            {lesson.duration}
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
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}
    </>
  );
};

export default ContentSidebar;
