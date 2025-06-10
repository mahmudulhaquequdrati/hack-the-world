import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import useProgressTracking from "@/hooks/useProgressTracking";
import { getLabData, getLabsByModule } from "@/lib/appData";
import { LabData } from "@/lib/types";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  Target,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface LabStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const LabPage = () => {
  const navigate = useNavigate();
  const { courseId, labId } = useParams();
  const [labProgress, setLabProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Progress tracking
  const progressTracking = useProgressTracking();
  const contentStartedRef = useRef(false);

  // Get lab data from centralized system
  const getLabDataFromCentral = (): LabData => {
    if (!courseId || !labId) {
      return {
        name: "Lab Environment",
        description: "Interactive cybersecurity lab",
        difficulty: "Intermediate",
        duration: "60 min",
        objectives: ["Complete lab objectives"],
        steps: [],
      };
    }

    // First try direct lookup
    let labData = getLabData(courseId, labId);

    // If not found, try to find by matching name converted to URL-friendly ID
    if (!labData) {
      const labsForModule = getLabsByModule(courseId);
      for (const [, lab] of Object.entries(labsForModule)) {
        const labUrlId = lab.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        if (labUrlId === labId) {
          labData = lab;
          break;
        }
      }
    }

    if (labData) {
      return labData;
    }

    // Fallback data if lab not found
    return {
      name: "Lab Environment",
      description: "Interactive cybersecurity lab",
      difficulty: "Intermediate",
      duration: "60 min",
      objectives: ["Complete lab objectives"],
      steps: [],
    };
  };

  const lab = getLabDataFromCentral();

  // Use the labId from URL as the MongoDB content ID
  const contentId = labId || "";

  // Auto-start content tracking when lab loads
  useEffect(() => {
    if (contentId && !contentStartedRef.current) {
      contentStartedRef.current = true;
      progressTracking.startContent(contentId);
    }
  }, [contentId, progressTracking]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20";
      case "advanced":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      const newProgress = (newCompleted.length / lab.steps.length) * 100;
      setLabProgress(newProgress);

      // If lab is fully completed, mark it as complete with score
      if (newCompleted.length === lab.steps.length && contentId) {
        progressTracking.completeLabGame(
          contentId,
          newCompleted.length,
          lab.steps.length
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <div className="pt-5 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Terminal-style Header */}
          <div className="bg-black border border-green-400/50 rounded-lg mb-6 overflow-hidden">
            {/* <div className="bg-green-400/10 border-b border-green-400/30 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="text-green-400/60 text-xs font-mono">
                  lab-environment/{courseId}/{labId}
                </div>
              </div>
            </div> */}

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/learn/${courseId}`)}
                    className="text-green-400 hover:bg-green-400/10 border border-green-400/30 font-mono text-xs"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    BACK_TO_COURSE
                  </Button>
                </div>
                <div className="flex items-center space-x-4 bg-green-400/10 rounded-lg p-2">
                  <div className="flex items-center space-x-2 text-green-400 font-mono text-sm">
                    <span className="text-green-400/60">🧪</span>
                    <span className="text-green-400/60">labs</span>
                    <span className="text-green-400/60">/</span>
                    <span className="text-green-400">{courseId}</span>
                    <span className="text-green-400/60">/</span>
                    <span className="text-green-400 animate-pulse">
                      {labId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Header */}
          <div className="bg-black/50 border border-green-400/30 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-2 font-mono">
                  {lab.name}
                </h1>
                <p className="text-green-300/80 mb-4">{lab.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge className={getDifficultyColor(lab.difficulty)}>
                    {lab.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1 text-green-300/70">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-mono">{lab.duration}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-green-400 font-mono">
                  {Math.round(labProgress)}%
                </div>
                <div className="text-sm text-green-300/70">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-black border border-green-400/30 rounded h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400/60 to-green-300/60 transition-all duration-500"
                style={{ width: `${labProgress}%` }}
              />
            </div>
          </div>

          {/* Lab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Lab Environment */}
            <div className="lg:col-span-2">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Lab Environment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Dynamic lab content based on labId */}
                  {labId === "web-lab-1" && (
                    <div className="space-y-6">
                      <div className="bg-black/30 border border-green-400/30 rounded-lg p-4">
                        <h3 className="text-green-400 font-semibold mb-3">
                          SQL Injection Testing Environment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Target URL:
                            </label>
                            <Input
                              value="http://vulnerable-app.local/login.php"
                              readOnly
                              className="bg-black border-green-400/30 text-green-400 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Test Payload:
                            </label>
                            <Input
                              placeholder="' OR 1=1 --"
                              className="bg-black border-green-400/30 text-green-400 font-mono"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button
                            className="bg-green-400 text-black hover:bg-green-300"
                            onClick={() => completeStep("step-1")}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Test Injection
                          </Button>
                          <Button
                            variant="outline"
                            className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                          >
                            View Source
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {labId === "linux-lab-1" && (
                    <div className="space-y-6">
                      <div className="bg-black/30 border border-green-400/30 rounded-lg p-4">
                        <h3 className="text-green-400 font-semibold mb-3">
                          Linux Terminal Simulator
                        </h3>
                        <div className="bg-black border border-green-400/30 rounded-lg p-4 font-mono text-sm">
                          <div className="text-green-300 space-y-1">
                            <div>user@lab:~$ ls</div>
                            <div>
                              Desktop Documents Downloads challenge_files
                            </div>
                            <div>user@lab:~$ cd challenge_files</div>
                            <div>user@lab:~/challenge_files$ ls -la</div>
                            <div>total 16</div>
                            <div>
                              drwxr-xr-x 4 user user 4096 Dec 16 10:30 .
                            </div>
                            <div>
                              drwxr-xr-x 3 user user 4096 Dec 16 10:29 ..
                            </div>
                            <div>
                              -rw-r--r-- 1 user user 42 Dec 16 10:30
                              .hidden_flag
                            </div>
                            <div>
                              drwxr-xr-x 2 user user 4096 Dec 16 10:30 secrets
                            </div>
                            <div className="flex">
                              <span>user@lab:~/challenge_files$ </span>
                              <input
                                className="bg-transparent border-none outline-none text-green-400 flex-1"
                                placeholder="Enter your command..."
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    completeStep("step-1");
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Default lab environment */}
                  {!["web-lab-1", "linux-lab-1"].includes(labId || "") && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-green-400 font-semibold mb-2">
                        Lab Environment Ready
                      </h3>
                      <p className="text-green-300/70 text-sm">
                        Interactive cybersecurity lab environment
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Objectives and Progress */}
            <div className="space-y-6">
              {/* Objectives */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {lab.objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-green-300/80 text-sm">
                          {objective}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Progress Steps */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lab.steps.map((step: LabStep) => (
                      <div
                        key={step.id}
                        className={`p-3 rounded border transition-colors ${
                          completedSteps.includes(step.id)
                            ? "border-green-400 bg-green-400/10"
                            : "border-green-400/30"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {completedSteps.includes(step.id) ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <div className="w-4 h-4 border border-green-400/30 rounded-full" />
                          )}
                          <span className="text-green-400 font-medium text-sm">
                            {step.title}
                          </span>
                        </div>
                        <p className="text-green-300/70 text-xs ml-6">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;
