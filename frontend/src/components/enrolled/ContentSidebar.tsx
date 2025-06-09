import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnrolledCourse } from "@/lib/types";
import {
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Gamepad2,
  Monitor,
  Play,
  Search,
  Video,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Get flat list of all lessons with their indices
  const allLessons = useMemo(() => {
    let lessonIndex = 0;
    return course.sections.flatMap((section) =>
      section.lessons.map((lesson) => ({
        ...lesson,
        sectionTitle: section.title,
        globalIndex: lessonIndex++,
      }))
    );
  }, [course.sections]);

  // Filter lessons based on search and filter
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const matchesSearch = lesson.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        selectedFilter === "all" ||
        lesson.type === selectedFilter ||
        (selectedFilter === "completed" &&
          completedLessons.includes(lesson.id)) ||
        (selectedFilter === "incomplete" &&
          !completedLessons.includes(lesson.id));

      return matchesSearch && matchesFilter;
    });
  }, [allLessons, searchTerm, selectedFilter, completedLessons]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "lab":
        return <Monitor className="w-4 h-4" />;
      case "game":
        return <Gamepad2 className="w-4 h-4" />;
      case "text":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <Brain className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getProgressStats = () => {
    const total = allLessons.length;
    const completed = allLessons.filter((lesson) =>
      completedLessons.includes(lesson.id)
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  };

  const progressStats = getProgressStats();

  const filterOptions = [
    { value: "all", label: "All Content", count: allLessons.length },
    {
      value: "video",
      label: "Videos",
      count: allLessons.filter((l) => l.type === "video").length,
    },
    {
      value: "lab",
      label: "Labs",
      count: allLessons.filter((l) => l.type === "lab").length,
    },
    {
      value: "game",
      label: "Games",
      count: allLessons.filter((l) => l.type === "game").length,
    },
    {
      value: "text",
      label: "Reading",
      count: allLessons.filter((l) => l.type === "text").length,
    },
    { value: "completed", label: "Completed", count: progressStats.completed },
    {
      value: "incomplete",
      label: "Remaining",
      count: progressStats.total - progressStats.completed,
    },
  ];

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

            <div className="text-sm text-green-300/70 font-mono mb-4">
              {course.title}
            </div>

            {/* Progress Overview */}
            <div className="mb-4 p-3 bg-green-400/5 border border-green-400/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-400 font-mono">
                  PROGRESS
                </span>
                <span className="text-xs text-green-300 font-mono">
                  {progressStats.completed}/{progressStats.total}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressStats.percentage}%` }}
                />
              </div>
              <div className="text-xs text-green-300/60 font-mono mt-1">
                {progressStats.percentage}% COMPLETE
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400/60" />
              <Input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-green-400/30 text-green-400 placeholder-green-400/50 focus:border-green-400 font-mono text-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={
                    selectedFilter === option.value ? "default" : "outline"
                  }
                  onClick={() => setSelectedFilter(option.value)}
                  className={`text-xs font-mono transition-all duration-200 ${
                    selectedFilter === option.value
                      ? "bg-green-400/20 text-green-400 border-green-400/50"
                      : "bg-transparent text-green-400/70 border-green-400/30 hover:bg-green-400/10"
                  }`}
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {option.label}
                  <Badge
                    variant="secondary"
                    className="ml-1 text-xs bg-green-400/20 text-green-300"
                  >
                    {option.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Content List */}
          <div className="p-4 space-y-3">
            {filteredLessons.map((lesson) => {
              const isActive = lesson.globalIndex === currentVideo;
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`group p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                    isActive
                      ? "bg-green-400/20 border-green-400/60 shadow-lg shadow-green-400/10"
                      : "bg-gray-900/50 border-gray-700/30 hover:border-green-400/40 hover:bg-green-400/5"
                  }`}
                  onClick={() => onLessonSelect(lesson.globalIndex)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Content type icon */}
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        isActive
                          ? "bg-green-400/30"
                          : "bg-gray-800/50 group-hover:bg-green-400/20"
                      }`}
                    >
                      <div
                        className={`${
                          isActive
                            ? "text-green-300"
                            : "text-gray-400 group-hover:text-green-400"
                        }`}
                      >
                        {getContentIcon(lesson.type)}
                      </div>
                    </div>

                    {/* Content details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4
                          className={`font-semibold text-sm font-mono truncate ${
                            isActive
                              ? "text-green-300"
                              : "text-gray-300 group-hover:text-green-400"
                          }`}
                        >
                          {lesson.title}
                        </h4>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        )}
                        {isActive && (
                          <Play className="w-4 h-4 text-green-300 flex-shrink-0 animate-pulse" />
                        )}
                      </div>

                      {/* Section and metadata */}
                      <div className="flex items-center space-x-2 text-xs">
                        <Badge
                          variant="secondary"
                          className={`text-xs font-mono capitalize ${
                            isActive
                              ? "bg-green-400/30 text-green-200"
                              : "bg-gray-700/50 text-gray-400"
                          }`}
                        >
                          {lesson.type}
                        </Badge>
                        <div
                          className={`flex items-center space-x-1 ${
                            isActive ? "text-green-300/70" : "text-gray-500"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span className="font-mono">{lesson.duration}</span>
                        </div>
                      </div>

                      {/* Section title */}
                      <div
                        className={`text-xs font-mono mt-1 ${
                          isActive ? "text-green-300/60" : "text-gray-500"
                        }`}
                      >
                        📁 {lesson.sectionTitle}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLessons.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 font-mono text-sm">
                  {searchTerm || selectedFilter !== "all"
                    ? "No content matches your search/filter"
                    : "No content available"}
                </div>
                {(searchTerm || selectedFilter !== "all") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilter("all");
                    }}
                    className="mt-3 text-green-400 border-green-400/30 hover:bg-green-400/10"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
    </>
  );
};

export default ContentSidebar;
