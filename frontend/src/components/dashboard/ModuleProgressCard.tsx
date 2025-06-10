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
      className={`${module.bgColor} ${module.borderColor} border-2 hover:scale-[1.02] transition-all cursor-pointer`}
      onClick={() => navigate(getEnrollPath(module.id))}
    >
      <CardHeader>
        <CardTitle
          className={`${module.color} flex items-center justify-between font-mono`}
        >
          <div className="flex items-center space-x-2">
            <module.icon className="w-5 h-5" />
            <span className="text-base">
              {module.title.toLowerCase().replace(/\s+/g, "_")}
            </span>
          </div>
          {module.completed && (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2 font-mono">
              <span className="text-green-300/70">progress:</span>
              <span className={module.color}>{module.progress}%</span>
            </div>
            <Progress value={module.progress} className="h-2" />
          </div>
          <div className="text-sm text-green-300/70 font-mono">
            difficulty: {module.difficulty.toLowerCase()} | duration:{" "}
            {module.content?.estimatedHours}
          </div>
          <Button
            size="sm"
            className="w-full bg-green-400 text-black hover:bg-green-300 font-mono"
            onClick={(e) => {
              e.stopPropagation();
              navigate(getEnrollPath(module.id));
            }}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {">> "}continue_learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
