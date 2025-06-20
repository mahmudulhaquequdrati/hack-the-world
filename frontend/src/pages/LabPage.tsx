import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import useProgressTracking from "@/hooks/useProgressTracking";
import { useGetContentWithModuleAndProgressQuery } from "@/features/api/apiSlice";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  Target,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

  // Fetch real lab data from API using the content ID
  const { data: labData, isLoading: labLoading, error: labError } = useGetContentWithModuleAndProgressQuery(
    labId || "",
    {
      skip: !labId
    }
  );

  // Transform API data to match expected format - use useMemo to prevent infinite re-renders
  const lab = useMemo(() => {
    return labData?.success ? {
      name: labData.data.content.title,
      description: labData.data.content.description || "Interactive cybersecurity lab",
      difficulty: labData.data.module.difficulty,
      duration: labData.data.content.duration ? `${Math.ceil(labData.data.content.duration / 60)} min` : "60 min",
      objectives: ["Complete the lab exercises", "Practice security techniques", "Gain hands-on experience"],
      steps: [
        {
          id: "step-1",
          title: "Setup Environment",
          description: "Initialize the lab environment and tools",
          completed: false
        },
        {
          id: "step-2", 
          title: "Execute Lab Tasks",
          description: "Complete the main lab objectives",
          completed: false
        },
        {
          id: "step-3",
          title: "Document Results",
          description: "Record findings and submit results",
          completed: false
        }
      ]
    } : {
      name: "Lab Environment",
      description: "Interactive cybersecurity lab",
      difficulty: "Intermediate", 
      duration: "60 min",
      objectives: ["Complete lab objectives"],
      steps: [],
    };
  }, [labData]);

  // Use the labId from URL as the MongoDB content ID (it's already the real content ID now)
  const contentId = labId || "";
  
  // Progress data is available but currently unused
  // const currentProgress = labData?.data?.progress?.progressPercentage || 0;
  // const currentScore = labData?.data?.progress?.score || 0;

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

  // Initialize progress from API data
  useEffect(() => {
    if (labData?.data?.progress) {
      setLabProgress(labData.data.progress.progressPercentage);
      // If lab was already completed, mark all steps as completed
      if (labData.data.progress.status === 'completed') {
        setCompletedSteps(lab.steps.map(step => step.id));
      }
    }
  }, [labData, lab.steps]);

  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      const newProgress = (newCompleted.length / lab.steps.length) * 100;
      setLabProgress(newProgress);

      // If lab is fully completed, mark it as complete with score
      if (newCompleted.length === lab.steps.length && contentId) {
        progressTracking.handleCompleteContent(
          contentId,
          newCompleted.length,
          lab.steps.length
        );
      }
    }
  };

  // Loading state
  if (labLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-green-950/20 to-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-green-400 font-mono text-xl mb-2">
            Loading lab environment...
          </div>
          <div className="text-green-400/60 font-mono text-sm">
            Initializing laboratory
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (labError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black text-red-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-mono text-xl mb-2">
            Error loading lab
          </div>
          <div className="text-red-400/60 font-mono text-sm mb-4">
            {labError.toString()}
          </div>
          <Button 
            onClick={() => navigate(`/learn/${courseId}`)}
            className="bg-red-400 text-black hover:bg-red-300"
          >
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950/20 to-black text-green-400 relative overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iOSIgeT0iOSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzAwRkY0MSIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPgo=')] opacity-20 animate-pulse"></div>
      
      <div className="relative z-10 pt-3 px-3 sm:pt-5 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Retro Lab Header */}
          <div className="bg-gradient-to-r from-green-900/80 to-cyan-900/80 border-2 border-green-400/50 rounded-lg mb-4 sm:mb-6 overflow-hidden shadow-lg shadow-green-400/20">
            <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border-b border-green-400/30 px-2 py-2 sm:px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="text-green-400/80 text-xs font-mono hidden sm:block">
                  LAB://environment/{courseId}/{labId}
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/learn/${courseId}`)}
                    className="text-green-400 hover:bg-green-400/10 border border-green-400/30 font-mono text-xs hover:scale-105 transition-all min-h-[44px] px-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">EXIT_LAB</span>
                    <span className="sm:hidden">EXIT</span>
                  </Button>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-lg p-2 border border-green-400/20">
                  <div className="flex items-center space-x-1 sm:space-x-2 text-green-400 font-mono text-xs sm:text-sm">
                    <span className="text-green-400/60">🧪</span>
                    <span className="text-green-400/60 hidden sm:inline">labs</span>
                    <span className="text-green-400/60 hidden sm:inline">/</span>
                    <span className="text-green-400 truncate max-w-[100px] sm:max-w-none">{courseId}</span>
                    <span className="text-green-400/60">/</span>
                    <span className="text-green-400 animate-pulse font-bold truncate max-w-[100px] sm:max-w-none">
                      {labId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Retro Lab Header */}
          <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-green-400/40 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 relative overflow-hidden">
            {/* Matrix scanlines effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/3 to-transparent bg-[length:100%_8px] opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 font-mono leading-tight">
                    {lab.name}
                  </h1>
                  <p className="text-gray-300 mb-4 text-base sm:text-lg">{lab.description}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <Badge className={`${getDifficultyColor(lab.difficulty)} border-2 font-mono font-bold text-xs sm:text-sm`}>
                      {lab.difficulty.toUpperCase()}
                    </Badge>
                    <div className="flex items-center space-x-1 text-green-300 bg-green-400/10 px-2 sm:px-3 py-1 rounded border border-green-400/30">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-mono font-bold">{lab.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-900/40 to-cyan-900/40 p-3 sm:p-4 rounded-lg border border-green-400/30 text-center lg:text-right min-w-[140px]">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400 font-mono">
                    {Math.round(labProgress)}%
                  </div>
                  <div className="text-xs sm:text-sm text-green-300/70 font-mono">PROGRESS</div>
                  <div className="mt-2">
                    <div className="text-xs text-cyan-300 font-mono">
                      STATUS:
                    </div>
                    <div className={`text-xs sm:text-sm font-mono font-bold ${
                      labProgress === 100 ? 'text-green-400 animate-pulse' : 'text-cyan-400'
                    }`}>
                      {labProgress === 100 ? 'COMPLETE' : 'IN_PROGRESS'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="bg-black border-2 border-green-400/30 rounded-lg h-3 sm:h-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-pulse"></div>
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 transition-all duration-500 relative"
                  style={{ width: `${labProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Lab Environment */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-green-400/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/3 to-transparent bg-[length:100%_8px] opacity-30"></div>
                <CardHeader className="relative z-10 bg-gradient-to-r from-green-900/40 to-cyan-900/40 border-b border-green-400/30">
                  <CardTitle className="text-green-400 flex items-center font-mono text-xl">
                    <Terminal className="w-6 h-6 mr-2 text-cyan-400" />
                    LAB_ENVIRONMENT.SYS
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
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Target URL:
                            </label>
                            <Input
                              value="http://vulnerable-app.local/login.php"
                              readOnly
                              className="bg-black border-green-400/30 text-green-400 font-mono text-xs sm:text-sm min-h-[44px]"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-green-400 mb-2 block">
                              Test Payload:
                            </label>
                            <Input
                              placeholder="' OR 1=1 --"
                              className="bg-black border-green-400/30 text-green-400 font-mono text-xs sm:text-sm min-h-[44px]"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            className="bg-green-400 text-black hover:bg-green-300 min-h-[44px] flex-1 sm:flex-none"
                            onClick={() => completeStep("step-1")}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Test Injection
                          </Button>
                          <Button
                            variant="outline"
                            className="border-green-400/30 text-green-400 hover:bg-green-400/10 min-h-[44px] flex-1 sm:flex-none"
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
                        <div className="bg-black border border-green-400/30 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                          <div className="text-green-300 space-y-1 min-w-[300px] sm:min-w-0">
                            <div>user@lab:~$ ls</div>
                            <div className="break-all">
                              Desktop Documents Downloads challenge_files
                            </div>
                            <div>user@lab:~$ cd challenge_files</div>
                            <div>user@lab:~/challenge_files$ ls -la</div>
                            <div>total 16</div>
                            <div className="break-all">
                              drwxr-xr-x 4 user user 4096 Dec 16 10:30 .
                            </div>
                            <div className="break-all">
                              drwxr-xr-x 3 user user 4096 Dec 16 10:29 ..
                            </div>
                            <div className="break-all">
                              -rw-r--r-- 1 user user 42 Dec 16 10:30
                              .hidden_flag
                            </div>
                            <div className="break-all">
                              drwxr-xr-x 2 user user 4096 Dec 16 10:30 secrets
                            </div>
                            <div className="flex flex-col sm:flex-row">
                              <span className="whitespace-nowrap">user@lab:~/challenge_files$ </span>
                              <input
                                className="bg-transparent border-none outline-none text-green-400 flex-1 min-h-[32px] mt-1 sm:mt-0"
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
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                      </div>
                      <h3 className="text-green-400 font-semibold mb-2 text-sm sm:text-base">
                        Lab Environment Ready
                      </h3>
                      <p className="text-green-300/70 text-xs sm:text-sm">
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
