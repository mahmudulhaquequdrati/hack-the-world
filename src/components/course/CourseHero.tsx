import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/types";
import { Star } from "lucide-react";

interface CourseHeroProps {
  course: Course;
}

const CourseHero = ({ course }: CourseHeroProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20";
      case "advanced":
        return "text-red-400 bg-red-400/20";
      case "expert":
        return "text-purple-400 bg-purple-400/20";
      case "master":
        return "text-orange-400 bg-orange-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  return (
    <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 mb-6 relative overflow-hidden">
      {/* Terminal header bar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-green-400/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-green-400/60 text-xs font-mono">
          cybersec-academy/course/
          {course.title.toLowerCase().replace(/\s+/g, "-")}
        </div>
      </div>

      {/* Course header */}
      <div className="flex items-start space-x-6 mb-6">
        <div className="relative">
          <div
            className={`w-20 h-20 ${course.bgColor} border-2 ${course.borderColor} rounded-lg flex items-center justify-center relative`}
          >
            <course.icon className={`w-10 h-10 ${course.color}`} />
            {/* Glitch effect */}
            <div className="absolute inset-0 border-2 border-green-400/20 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h1 className="text-4xl font-bold text-green-400 font-mono tracking-tight">
              {course.title}
            </h1>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <Badge
              className={`${getDifficultyColor(
                course.difficulty
              )} font-mono text-xs px-3 py-1`}
            >
              /{course.difficulty.toUpperCase()}
            </Badge>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-mono">{course.rating}</span>
            </div>
            <span className="text-sm text-green-300/70 font-mono">
              {course.students.toLocaleString()} enrolled
            </span>
          </div>

          <p className="text-green-300/90 leading-relaxed text-lg mb-6">
            {course.description}
          </p>
        </div>
      </div>

      {/* Skills terminal output */}
      <div className="bg-black/40 border border-green-400/20 rounded p-4">
        <div className="text-green-400/60 text-xs mb-2 font-mono">
          $ course --list-skills
        </div>
        <div className="flex flex-wrap gap-2">
          {course.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-green-400/10 border border-green-400/30 rounded text-green-400 text-sm font-mono px-2 py-1"
            >
              #{skill.toLowerCase().replace(/\s+/g, "_")}
            </div>
          ))}
        </div>
      </div>

      {/* Scan line effect */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse"></div>
    </div>
  );
};

export default CourseHero;
