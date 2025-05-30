import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lab } from "@/lib/types";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  ExternalLink,
  Lightbulb,
  Play,
  Target,
  Wrench,
} from "lucide-react";

interface EnhancedLabViewProps {
  lab: Lab;
  onStartLab: () => void;
  onStepComplete: (stepId: string) => void;
}

const EnhancedLabView = ({
  lab,
  onStartLab,
  onStepComplete,
}: EnhancedLabViewProps) => {
  const completedSteps = lab.steps.filter((step) => step.completed).length;
  const progressPercentage = (completedSteps / lab.steps.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 border-green-400/40 bg-green-400/10";
      case "intermediate":
        return "text-yellow-400 border-yellow-400/40 bg-yellow-400/10";
      case "advanced":
        return "text-red-400 border-red-400/40 bg-red-400/10";
      default:
        return "text-blue-400 border-blue-400/40 bg-blue-400/10";
    }
  };

  return (
    <div className="bg-black/60 border-2 border-yellow-400/40 rounded-none overflow-hidden shadow-2xl shadow-yellow-400/10">
      {/* Header */}
      <div className="bg-yellow-400/15 border-b-2 border-yellow-400/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <h2 className="text-yellow-400 font-bold text-xl font-mono tracking-wider">
              LAB.ENVIRONMENT
            </h2>
          </div>
          <div
            className={`px-3 py-1 border rounded-none text-xs font-mono font-bold ${getDifficultyColor(
              lab.difficulty
            )}`}
          >
            {lab.difficulty.toUpperCase()}
          </div>
        </div>

        <h3 className="text-yellow-300 text-2xl font-bold font-mono mb-2">
          {lab.name}
        </h3>

        <p className="text-yellow-300/80 font-mono text-sm leading-relaxed mb-4">
          {lab.description}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-mono">
            <span className="text-yellow-400/70">PROGRESS</span>
            <span className="text-yellow-400">
              {completedSteps}/{lab.steps.length} STEPS
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 bg-black/50 border border-yellow-400/30"
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Lab Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration & Category */}
          <Card className="bg-black/40 border border-yellow-400/30 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-mono text-sm font-bold">
                  DURATION
                </span>
              </div>
              <div className="text-yellow-300 font-mono">
                {lab.estimatedTime}
              </div>
              <div className="text-yellow-400/60 font-mono text-xs mt-1">
                Category: {lab.category.replace("-", " ").toUpperCase()}
              </div>
            </CardContent>
          </Card>

          {/* Skills Gained */}
          <Card className="bg-black/40 border border-yellow-400/30 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-mono text-sm font-bold">
                  SKILLS GAINED
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {lab.skillsGained.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-mono rounded-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objectives */}
        <Card className="bg-black/40 border border-blue-400/30 rounded-none">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-blue-400" />
              <h3 className="text-blue-400 font-bold text-lg font-mono">
                OBJECTIVES
              </h3>
            </div>
            <div className="space-y-2">
              {lab.objectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-300/90 text-sm font-mono">
                    {objective}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prerequisites */}
        <Card className="bg-black/40 border border-orange-400/30 rounded-none">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-orange-400" />
              <h3 className="text-orange-400 font-bold text-lg font-mono">
                PREREQUISITES
              </h3>
            </div>
            <div className="space-y-2">
              {lab.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-orange-300/90 text-sm font-mono">
                    {prerequisite}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tools Required */}
        <Card className="bg-black/40 border border-green-400/30 rounded-none">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2 mb-4">
              <Wrench className="w-5 h-5 text-green-400" />
              <h3 className="text-green-400 font-bold text-lg font-mono">
                TOOLS REQUIRED
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {lab.tools.map((tool, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-green-400/20 border border-green-400/40 text-green-300 text-sm font-mono rounded-none text-center"
                >
                  {tool}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lab Steps */}
        <Card className="bg-black/40 border border-cyan-400/30 rounded-none">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2 mb-4">
              <Play className="w-5 h-5 text-cyan-400" />
              <h3 className="text-cyan-400 font-bold text-lg font-mono">
                LAB STEPS
              </h3>
            </div>
            <div className="space-y-3">
              {lab.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`border-2 rounded-none p-4 transition-all ${
                    step.completed
                      ? "border-green-400/40 bg-green-400/10"
                      : "border-cyan-400/30 bg-cyan-400/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-cyan-400" />
                      )}
                      <span
                        className={`font-bold font-mono ${
                          step.completed ? "text-green-400" : "text-cyan-400"
                        }`}
                      >
                        STEP {index + 1}: {step.title}
                      </span>
                    </div>
                    {!step.completed && (
                      <Button
                        size="sm"
                        onClick={() => onStepComplete(step.id)}
                        className="bg-cyan-400 text-black hover:bg-cyan-300 font-mono font-bold rounded-none"
                      >
                        COMPLETE
                      </Button>
                    )}
                  </div>
                  <p
                    className={`text-sm font-mono ${
                      step.completed ? "text-green-300/80" : "text-cyan-300/80"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hints */}
        <Card className="bg-black/40 border border-purple-400/30 rounded-none">
          <CardContent className="p-5">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-purple-400" />
              <h3 className="text-purple-400 font-bold text-lg font-mono">
                HINTS & TIPS
              </h3>
            </div>
            <div className="space-y-2">
              {lab.hints.map((hint, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-purple-300/90 text-sm font-mono">
                    {hint}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-yellow-400/30">
          <div className="text-yellow-400/70 text-sm font-mono">
            {lab.completed ? "✓ LAB COMPLETED" : "LAB IN PROGRESS"}
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={onStartLab}
              className="bg-yellow-400 text-black hover:bg-yellow-300 font-mono font-bold rounded-none border-2 border-yellow-400"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {lab.completed ? "REVIEW LAB" : "START LAB"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLabView;
