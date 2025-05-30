import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    <>
      {/* Terminal-style Navigation Bar */}
      <div className="pb-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={onNavigateBack}
              className="text-green-400 hover:bg-green-400/10 font-mono text-xs !px-0"
            >
              <ArrowLeft className="w-4 h-4" />
              COURSE_DETAILS
            </Button>
          </div>
        </div>
      </div>

      {/* Course Header with Compact Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 ${course.bgColor} ${course.borderColor} border-2 rounded-full flex items-center justify-center`}
          >
            <course.icon className={`w-6 h-6 ${course.color}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-400 mb-1">
              {course.title}
            </h1>
            <p className="text-green-300/80">{course.description}</p>
          </div>
        </div>

        <div className="bg-black/90 border border-green-400/30 rounded-lg p-3 backdrop-blur-sm shadow-2xl min-w-[320px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-400 font-medium">
              Lesson {currentVideo + 1}/{totalLessons}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenContentSidebar}
                className="text-green-400 hover:bg-green-400/10 h-6 px-2"
              >
                <List className="w-3 h-3" /> Content List
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
    </>
  );
};

export default CourseHeader;
