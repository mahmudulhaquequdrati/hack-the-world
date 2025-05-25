import { Activity, BookOpen, Zap } from "lucide-react";

interface CourseFeaturesProps {
  lessons: number;
  labs: number;
  games: number;
}

const CourseFeatures = ({ lessons, labs, games }: CourseFeaturesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-black border-2 border-green-400/30 rounded-lg p-6 text-center relative overflow-hidden hover:border-green-400/60 transition-all duration-300">
        <div className="absolute top-2 left-2 text-green-400/30 text-xs font-mono">
          [01]
        </div>
        <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-3" />
        <div className="text-2xl font-bold text-green-400 mb-1 font-mono">
          {lessons}
        </div>
        <div className="text-sm text-green-300/70 uppercase tracking-wider font-mono">
          Video Lessons
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400/20"></div>
      </div>

      <div className="bg-black border-2 border-yellow-400/30 rounded-lg p-6 text-center relative overflow-hidden hover:border-yellow-400/60 transition-all duration-300">
        <div className="absolute top-2 left-2 text-yellow-400/30 text-xs font-mono">
          [02]
        </div>
        <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
        <div className="text-2xl font-bold text-yellow-400 mb-1 font-mono">
          {labs}
        </div>
        <div className="text-sm text-green-300/70 uppercase tracking-wider font-mono">
          Hands-on Labs
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400/20"></div>
      </div>

      <div className="bg-black border-2 border-red-400/30 rounded-lg p-6 text-center relative overflow-hidden hover:border-red-400/60 transition-all duration-300">
        <div className="absolute top-2 left-2 text-red-400/30 text-xs font-mono">
          [03]
        </div>
        <Activity className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <div className="text-2xl font-bold text-red-400 mb-1 font-mono">
          {games}
        </div>
        <div className="text-sm text-green-300/70 uppercase tracking-wider font-mono">
          Interactive Games
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400/20"></div>
      </div>
    </div>
  );
};

export default CourseFeatures;
