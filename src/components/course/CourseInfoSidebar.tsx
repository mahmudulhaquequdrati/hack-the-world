import { getDetailedCourseProgress } from "@/lib/appData";
import { Course } from "@/lib/types";

interface CourseInfoSidebarProps {
  course: Course;
}

const CourseInfoSidebar = ({ course }: CourseInfoSidebarProps) => {
  // Get detailed progress information
  const detailedProgress = getDetailedCourseProgress(course.id);

  return (
    <div className="space-y-6">
      {/* Course Info Terminal */}
      <div className="bg-black border-2 border-green-400/50 rounded-lg overflow-hidden">
        {/* Terminal header */}
        <div className="bg-green-400/10 border-b border-green-400/30 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-green-400 font-mono text-sm font-bold">
              COURSE.INFO
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-green-400/60 text-xs font-mono">ACTIVE</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-2 font-mono text-sm">
          <div className="flex items-center justify-between border-b border-green-400/20 pb-2">
            <span className="text-green-300/70">Duration:</span>
            <span className="text-green-400 font-bold">{course.duration}</span>
          </div>
          <div className="flex items-center justify-between border-b border-green-400/20 pb-2">
            <span className="text-green-300/70">Price:</span>
            <span className={`font-bold ${course.color} text-lg`}>
              {course.price}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-green-400/20 pb-2">
            <span className="text-green-300/70">Category:</span>
            <span className="text-green-400">{course.category}</span>
          </div>
          <div className="flex items-center justify-between border-b border-green-400/20 pb-2">
            <span className="text-green-300/70">Certificate:</span>
            <span className="text-green-400">
              {course.certification ? "✓ YES" : "✗ NO"}
            </span>
          </div>

          <div className="bg-black/60 border border-green-400/20 rounded p-3 mt-4">
            <div className="text-green-400/60 text-xs mb-1">PREREQUISITES:</div>
            <p className="text-green-400 text-sm leading-relaxed">
              {course.prerequisites}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Terminal */}
      {detailedProgress &&
        detailedProgress.isEnrolled &&
        detailedProgress.overallProgress > 0 && (
          <div className="bg-black border-2 border-blue-400/50 rounded-lg overflow-hidden">
            <div className="bg-blue-400/10 border-b border-blue-400/30 px-4 py-2">
              <div className="text-blue-400 font-mono text-sm font-bold">
                PROGRESS.LOG
              </div>
            </div>

            <div className="p-6 font-mono">
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-300/70">Completion:</span>
                <span className="text-blue-400 font-bold text-lg">
                  {detailedProgress.overallProgress}%
                </span>
              </div>

              {/* Custom progress bar */}
              <div className="bg-black border border-green-400/30 rounded h-4 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400/60 to-blue-400/60 relative"
                  style={{ width: `${detailedProgress.overallProgress}%` }}
                >
                  <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-green-400">
                  {detailedProgress.overallProgress}% COMPLETE
                </div>
              </div>

              {/* Dynamic progress details */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-green-300/60">Lessons:</span>
                  <span className="text-green-400">
                    {detailedProgress.completedLessons}/
                    {detailedProgress.totalLessons}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300/60">Labs:</span>
                  <span className="text-yellow-400">
                    {detailedProgress.completedLabs}/
                    {detailedProgress.totalLabs}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300/60">Games:</span>
                  <span className="text-red-400">
                    {detailedProgress.completedGames}/
                    {detailedProgress.totalGames}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CourseInfoSidebar;
