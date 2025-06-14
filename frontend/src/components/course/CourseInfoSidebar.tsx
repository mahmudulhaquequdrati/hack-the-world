import { Course } from "@/lib/types";

interface CourseInfoSidebarProps {
  course: Course;
}

const CourseInfoSidebar = ({ course }: CourseInfoSidebarProps) => {
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
            <span className="text-green-400 font-bold">
              {course.duration} hours
            </span>
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

      {/* Progress Terminal - Removed mock data, will need real API integration */}
    </div>
  );
};

export default CourseInfoSidebar;
