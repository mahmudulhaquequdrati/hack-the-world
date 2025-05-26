import { Header } from "@/components/common/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  Target,
  Terminal,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface LabStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface LabData {
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  objectives: string[];
  steps: LabStep[];
}

const LabPage = () => {
  const navigate = useNavigate();
  const { courseId, labId } = useParams();
  const [labProgress, setLabProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Mock lab data - in real app this would come from API
  const getLabData = (): LabData => {
    const labs: { [key: string]: LabData } = {
      "web-lab-1": {
        name: "SQL Injection Fundamentals",
        description:
          "Learn to identify and exploit SQL injection vulnerabilities",
        difficulty: "Beginner",
        duration: "45 min",
        objectives: [
          "Identify SQL injection entry points",
          "Test basic SQL injection payloads",
          "Extract data from vulnerable database",
          "Document findings and remediation",
        ],
        steps: [
          {
            id: "step-1",
            title: "Reconnaissance",
            description: "Identify the login form and test for SQL injection",
            completed: false,
          },
          {
            id: "step-2",
            title: "Payload Testing",
            description: "Test various SQL injection payloads",
            completed: false,
          },
          {
            id: "step-3",
            title: "Data Extraction",
            description: "Extract user data from the database",
            completed: false,
          },
          {
            id: "step-4",
            title: "Documentation",
            description: "Document your findings and remediation steps",
            completed: false,
          },
        ],
      },
      "linux-lab-1": {
        name: "Linux Command Line Basics",
        description: "Master essential Linux commands and file navigation",
        difficulty: "Beginner",
        duration: "30 min",
        objectives: [
          "Navigate the Linux file system",
          "Use basic file manipulation commands",
          "Understand file permissions",
          "Find hidden files and directories",
        ],
        steps: [
          {
            id: "step-1",
            title: "File System Navigation",
            description: "Use cd, ls, and pwd commands to navigate",
            completed: false,
          },
          {
            id: "step-2",
            title: "File Operations",
            description: "Create, copy, move, and delete files",
            completed: false,
          },
          {
            id: "step-3",
            title: "Permissions",
            description: "Understand and modify file permissions",
            completed: false,
          },
          {
            id: "step-4",
            title: "Hidden Files",
            description: "Find and access hidden files",
            completed: false,
          },
        ],
      },
    };

    return (
      labs[labId || ""] || {
        name: "Lab Environment",
        description: "Interactive cybersecurity lab",
        difficulty: "Intermediate",
        duration: "60 min",
        objectives: ["Complete lab objectives"],
        steps: [],
      }
    );
  };

  const lab = getLabData();

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
      setLabProgress((newCompleted.length / lab.steps.length) * 100);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

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
