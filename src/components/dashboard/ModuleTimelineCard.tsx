import { Module } from "@/lib/types";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Code,
  GamepadIcon,
  Play,
  Target,
} from "lucide-react";

interface ModuleTimelineCardProps {
  module: Module;
  isLast: boolean;
  onModuleClick: (module: Module) => void;
}

export const ModuleTimelineCard = ({
  module,
  isLast,
  onModuleClick,
}: ModuleTimelineCardProps) => {
  const getStatusColor = () => {
    if (module.completed)
      return "text-green-400 bg-green-400/20 border-green-400/30";
    if (module.progress > 0)
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
    return "text-gray-400 bg-gray-400/20 border-gray-400/30";
  };

  const getStatusIcon = () => {
    if (module.completed) return CheckCircle2;
    if (module.progress > 0) return Play;
    return Clock;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="relative flex items-start space-x-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-green-400/50 to-transparent" />
      )}

      {/* Status Icon */}
      <div
        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor()}`}
      >
        <StatusIcon className="w-5 h-5" />
      </div>

      {/* Module Card */}
      <div
        className={`flex-1 rounded-xl border ${module.borderColor} ${module.bgColor} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-400/10 cursor-pointer`}
        onClick={() => onModuleClick(module)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <module.icon className={`w-6 h-6 ${module.color}`} />
            <div>
              <h3 className="text-lg font-semibold text-white font-mono">
                {module.title}
              </h3>
              <p className="text-sm text-gray-400">{module.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400 font-mono">
              {module.progress}%
            </div>
            <div className="text-xs text-gray-500">
              {module.completed
                ? "Completed"
                : module.progress > 0
                ? "In Progress"
                : "Not Started"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-black/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                module.completed
                  ? "bg-gradient-to-r from-green-400 to-blue-400"
                  : module.progress > 0
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                  : "bg-gray-600"
              }`}
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>

        {/* Module Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{module.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Target className="w-4 h-4" />
            <span>{module.difficulty}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Code className="w-4 h-4" />
            <span>{module.labs} Labs</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <GamepadIcon className="w-4 h-4" />
            <span>{module.games} Games</span>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {module.topics.slice(0, 4).map((topic, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-medium bg-green-400/10 text-green-400 rounded-full border border-green-400/20"
            >
              {topic}
            </span>
          ))}
          {module.topics.length > 4 && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-400/10 text-gray-400 rounded-full border border-gray-400/20">
              +{module.topics.length - 4} more
            </span>
          )}
        </div>

        {/* Click to continue indicator */}
        <div className="flex items-center justify-end text-sm text-green-400/70 hover:text-green-400 transition-colors">
          <span className="font-mono">Click to continue</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );
};
