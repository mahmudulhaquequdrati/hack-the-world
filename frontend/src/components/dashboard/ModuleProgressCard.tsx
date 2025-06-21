import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getEnrollPath } from "@/lib/pathUtils";
import { Module } from "@/lib/types";
import { CheckCircle, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModuleProgressCardProps {
  module: Module;
}

export const ModuleProgressCard = ({ module }: ModuleProgressCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className={`${module.bgColor} ${module.borderColor} border-2 transition-all cursor-pointer`}
      onClick={() => navigate(getEnrollPath(module._id))}
    >
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle
          className={`${module.color} flex items-center justify-between font-mono`}
        >
          <div className="flex items-center space-x-2">
            <module.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">
              {module.title.toLowerCase().replace(/\s+/g, "_")}
            </span>
          </div>
          {module.completed && (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <div className="flex justify-between text-xs sm:text-sm mb-2 font-mono">
              <span className="text-green-300/70">progress:</span>
              <span className={module.color}>{module.progress || 0}%</span>
            </div>
            <Progress value={module.progress || 0} className="h-2" />
          </div>
          <div className="text-xs sm:text-sm text-green-300/70 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
              <span>difficulty: {module.difficulty.toLowerCase()}</span>
              <span>duration: {module.content?.estimatedHours}h</span>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full bg-green-400 text-black hover:bg-green-300 font-mono text-xs sm:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(getEnrollPath(module._id));
            }}
          >
            <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            {">> "}continue_learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
