import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnrolledCourse } from "@/lib/types";
import {
  BookOpen,
  Brain,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Gamepad2,
  Monitor,
  Play,
  Search,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ContentSidebarProps {
  course: EnrolledCourse;
  currentVideo: number;
  isOpen: boolean;
  onClose: () => void;
  onLessonSelect: (lessonIndex: number) => void;
}

const ContentSidebar = ({
  course,
  currentVideo,
  isOpen,
  onClose,
  onLessonSelect,
}: ContentSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Collapsible section states (default collapsed)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Determine completion based on lesson.completed flag coming from API
  const isLessonCompleted = useCallback((lesson: { completed?: boolean }) => {
    return Boolean(lesson.completed);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  console.log(course, "course");

  // Filter lessons based on search and filter
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const matchesSearch = lesson.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        selectedFilter === "all" ||
        lesson.type === selectedFilter ||
        (selectedFilter === "completed" && lesson.completed) ||
        (selectedFilter === "incomplete" && !lesson.completed);

      return matchesSearch && matchesFilter;
    });
  }, [allLessons, searchTerm, selectedFilter]);

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

  // Helper function to ensure section title is never empty
  const getSectionTitle = (title: string, index: number) => {
    if (!title || title.trim() === "") {
      return `Section ${index + 1}`;
    }
    return title.trim();
  };

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
  ];

  // Group filtered lessons by section for display
  const groupedLessons = useMemo(() => {
    const sections = new Map<string, typeof filteredLessons>();

    filteredLessons.forEach((lesson) => {
      const sectionKey = lesson.sectionTitle || "Uncategorized";
      if (!sections.has(sectionKey)) {
        sections.set(sectionKey, []);
      }
      sections.get(sectionKey)!.push(lesson);
    });

    return Array.from(sections.entries()).map(([title, lessons]) => ({
      title,
      lessons: lessons as typeof filteredLessons,
    }));
  }, [filteredLessons]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full z-50 transition-transform duration-300 w-full sm:w-96 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-black/95 border-l-2 border-green-400/40 w-full h-full backdrop-blur-sm overflow-y-auto hide-scrollbar">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b-2 border-green-400/30 sticky top-0 bg-black/95 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                <h2 className="text-lg sm:text-xl font-bold text-green-400 font-mono tracking-wider truncate">
                  COURSE.CONTENT
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-green-400 hover:bg-green-400/20 border border-green-400/30 rounded-none flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-sm text-green-300/70 font-mono mb-2 truncate">
              {course.title}
            </div>
            <div className="flex items-center space-x-2 text-xs text-green-400/60">
              <BookOpen className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{course.totalLessons} MODULES</span>
            </div>

            {/* Search and Filter */}
            <div className="mt-4 sm:mt-6 space-y-2">
              {/* Search and Filter */}
              <div>
                <button
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  className="w-full flex items-center justify-between p-2 sm:p-3 bg-green-400/5 border border-green-400/20 rounded-lg hover:bg-green-400/10 transition-all duration-200"
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <Search className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span className="text-xs text-green-400 font-mono font-bold truncate">
                      <span className="hidden sm:inline">SEARCH.AND.FILTER</span>
                      <span className="sm:hidden">SEARCH</span>
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-green-400 transition-transform duration-200 flex-shrink-0 ${
                      isSearchExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isSearchExpanded && (
                  <div className="mt-2 space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400/60" />
                      <Input
                        type="text"
                        placeholder="Search content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-black/50 border-green-400/30 text-green-400 placeholder-green-400/50 focus:border-green-400 font-mono text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {filterOptions.map((option) => (
                        <Button
                          key={option.value}
                          size="sm"
                          variant={
                            selectedFilter === option.value
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedFilter(option.value)}
                          className={`text-xs font-mono transition-all duration-200 px-2 sm:px-3 ${
                            selectedFilter === option.value
                              ? "bg-green-400/20 text-green-400 border-green-400/50"
                              : "bg-transparent text-green-400/70 border-green-400/30 hover:bg-green-400/10"
                          }`}
                        >
                          <span className="truncate">{option.label}</span>
                          <Badge
                            variant="secondary"
                            className="ml-1 text-xs bg-green-400/20 text-green-300 hidden sm:inline-flex"
                          >
                            {option.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 max-h-[calc(100vh-0px)]">
            <div className="space-y-3 sm:space-y-4">
              {groupedLessons.map((section, sectionIndex) => (
                <div key={`section-${sectionIndex}`} className="space-y-2">
                  {/* Section Header */}
                  <div className="bg-green-400/10 border border-green-400/30 rounded-none p-2 sm:p-3 mx-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                        <div className="font-bold text-green-400 text-xs sm:text-sm font-mono tracking-wide truncate">
                          {getSectionTitle(
                            section.title,
                            sectionIndex
                          ).toUpperCase()}
                        </div>
                      </div>

                      {/* T023: Section completion progress indicator */}
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <div className="text-xs text-green-400/70 font-mono">
                          {
                            section.lessons.filter((lesson) => lesson.completed)
                              .length
                          }
                          /{section.lessons.length}
                        </div>
                        <div className="w-6 sm:w-8 h-1 bg-green-400/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-400 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                section.lessons.length > 0
                                  ? (section.lessons.filter(
                                      (lesson) => lesson.completed
                                    ).length /
                                      section.lessons.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-2 pb-4 sm:pb-6">
                    {section.lessons.map((lesson) => {
                      const isActive = lesson.globalIndex === currentVideo;
                      const isCompleted = isLessonCompleted(lesson);

                      return (
                        <div
                          key={lesson.id}
                          className={`group cursor-pointer transition-all duration-200 px-1 ${
                            isActive
                              ? "transform scale-[1.01]"
                              : "hover:transform hover:scale-[1.02]"
                          }`}
                          onClick={() => {
                            onLessonSelect(lesson.globalIndex);
                            onClose();
                          }}
                        >
                          <div
                            className={`border-2 rounded-none p-3 sm:p-4 transition-all ${
                              isActive
                                ? "border-green-400 bg-green-400/15 shadow-lg shadow-green-400/20"
                                : "border-green-400/20 hover:border-green-400/50 hover:bg-green-400/5"
                            }`}
                          >
                            {/* Lesson Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                {/* Enhanced Completion Status Indicators */}
                                {isCompleted ? (
                                  <div className="relative flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-pulse" />
                                  </div>
                                ) : (
                                  <div className="relative flex-shrink-0">
                                    <div className="w-4 h-4 border-2 border-green-400/40 rounded-full bg-transparent" />
                                    <div className="absolute inset-0.5 bg-green-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                )}

                                {/* Content Type Icon */}
                                <div className="flex-shrink-0">
                                  {getLessonIcon(lesson.type)}
                                </div>
                              </div>

                              {/* Type Badge with Progress Indicator */}
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <div
                                  className={`px-1 sm:px-2 py-1 border rounded-none text-xs font-mono font-bold ${getTypeColor(
                                    lesson.type
                                  )}`}
                                >
                                  <span className="hidden sm:inline">{getTypeLabel(lesson.type)}</span>
                                  <span className="sm:hidden">{getTypeLabel(lesson.type).slice(0, 3)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Lesson Title */}
                            <div className="mb-2">
                              <div
                                className={`text-xs sm:text-sm font-semibold font-mono ${
                                  isActive ? "text-green-300" : "text-green-400"
                                } group-hover:text-green-300 transition-colors line-clamp-2`}
                              >
                                {lesson.title}
                              </div>
                            </div>

                            {/* Lesson Meta */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-green-300/60">
                                <Clock className="w-3 h-3 flex-shrink-0" />
                                <span className="font-mono truncate">
                                  {lesson.duration}
                                </span>
                              </div>

                              {isActive && (
                                <div className="flex items-center space-x-1 text-xs text-green-400">
                                  <Play className="w-3 h-3 flex-shrink-0" />
                                  <span className="font-mono hidden sm:inline">ACTIVE</span>
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

              {groupedLessons.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-gray-500 font-mono text-sm px-4">
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
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 " onClick={onClose} />
      )}
    </>
  );
};

export default ContentSidebar;
