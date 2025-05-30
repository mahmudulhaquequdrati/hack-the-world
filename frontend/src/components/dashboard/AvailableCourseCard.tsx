import { Module } from "@/lib/types";
import { Plus } from "lucide-react";

interface AvailableCourseCardProps {
  module: Module;
  onModuleClick: (module: Module) => void;
}

export const AvailableCourseCard = ({
  module,
  onModuleClick,
}: AvailableCourseCardProps) => {
  return (
    <div
      className={`rounded-xl border ${module.borderColor} ${module.bgColor} p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-400/10 cursor-pointer`}
      onClick={() => onModuleClick(module)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <module.icon className={`w-5 h-5 ${module.color}`} />
          <div>
            <h4 className="text-md font-semibold text-white font-mono">
              {module.title}
            </h4>
            <p className="text-xs text-gray-400">{module.description}</p>
          </div>
        </div>
        <Plus className="w-5 h-5 text-green-400" />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{module.difficulty}</span>
        <span>{module.duration}</span>
      </div>
    </div>
  );
};
