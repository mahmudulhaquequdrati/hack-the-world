import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IconRenderer } from "@/lib/dataTransformers";
import { EnrolledCourse } from "@/lib/types";
import { ArrowLeft, List } from "lucide-react";

interface CourseHeaderProps {
  course: EnrolledCourse;
  currentVideo: number;
  totalLessons: number;
  onNavigateBack: () => void;
  onOpenContentSidebar: () => void;
}

const CourseHeader = ({
  course,
  currentVideo,
  totalLessons,
  onNavigateBack,
  onOpenContentSidebar,
}: CourseHeaderProps) => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Terminal-style Navigation Bar */}
      <div className="pb-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={onNavigateBack}
              className="text-green-400 hover:bg-green-400/10 font-mono text-xs sm:text-sm !px-0 min-w-0"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline ml-1">COURSE_DETAILS</span>
              <span className="sm:hidden ml-1">BACK</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Course Header with Compact Progress */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 ${course.bgColor} ${course.borderColor} border-2 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <IconRenderer
              icon={course.icon}
              className={`w-5 h-5 sm:w-6 sm:h-6 ${course.color}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 mb-1 truncate">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-green-300/80 line-clamp-2">{course.description}</p>
          </div>
        </div>

        <div className="bg-black/90 border border-green-400/30 rounded-lg p-3 backdrop-blur-sm shadow-2xl w-full lg:w-auto lg:min-w-[320px] lg:max-w-[320px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-400 font-medium">
              Lesson {currentVideo + 1}/{totalLessons}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenContentSidebar}
                className="text-green-400 hover:bg-green-400/10 h-6 px-2 text-xs"
              >
                <List className="w-3 h-3" /> 
                <span className="hidden sm:inline ml-1">Content List</span>
                <span className="sm:hidden ml-1">List</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400 font-bold">
                {course.progress}%
              </span>
              <Progress
                value={course.progress}
                className="h-1.5 bg-black border border-green-400/30 flex-1 mx-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
