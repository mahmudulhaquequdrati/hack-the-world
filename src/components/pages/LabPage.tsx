import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LabPage = () => {
  const navigate = useNavigate();
  const { courseId, labId } = useParams();
  const [labProgress, setLabProgress] = useState(0);

  // Mock lab data - in a real app this would come from an API
  const getLabData = () => {
    const labs = {
      "web-lab-1": {
        name: "SQL Injection Fundamentals",
        description:
          "Learn to identify and exploit SQL injection vulnerabilities",
        difficulty: "Beginner",
        duration: "45 min",
        objectives: [
          "Identify the login form vulnerable to SQL injection",
          "Test various SQL injection payloads",
          "Extract user data from the database",
          "Document your findings and remediation steps",
        ],
      },
      "linux-lab-1": {
        name: "Terminal Navigation Challenge",
        description: "Master basic Linux command line navigation",
        difficulty: "Beginner",
        duration: "30 min",
        objectives: [
          "Find the hidden flag in the current directory",
          "Navigate to the secrets directory",
          "List all files including hidden ones",
          "Read the contents of important files",
        ],
      },
    };

    return labs[labId as keyof typeof labs] || labs["web-lab-1"];
  };

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
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const lab = getLabData();

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pt-5 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(`/learn/${courseId}`)}
            className="mb-4 text-green-400 hover:bg-green-400/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>

          {/* Lab Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-400/20 border-2 border-green-400/30 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-1">
                  {lab.name}
                </h1>
                <p className="text-green-300/80">{lab.description}</p>
              </div>
            </div>

            {/* Lab Info Card */}
            <div className="bg-black/50 border border-green-400/30 rounded-lg p-4 min-w-[250px]">
              <div className="flex items-center justify-between mb-2">
                <Badge className={getDifficultyColor(lab.difficulty)}>
                  {lab.difficulty}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-green-300/70">
                  <Clock className="w-3 h-3" />
                  <span>{lab.duration}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-green-400 font-medium">
                  Progress
                </span>
                <span className="text-sm text-green-400 font-bold">
                  {labProgress}%
                </span>
              </div>
              <Progress
                value={labProgress}
                className="h-1.5 bg-black border border-green-400/30"
              />
            </div>
          </div>

          {/* Lab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lab Environment */}
            <div className="lg:col-span-2">
              <Card className="bg-black/50 border-green-400/30 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-xl flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Lab Environment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Dynamic lab content based on labId */}
                  {labId === "web-lab-1" && (
                    <div className="space-y-6">
                      <div className="bg-black/30 border border-green-400/30 rounded-lg p-4">
                        <h3 className="text-green-400 font-semibold mb-3">
                          SQL Injection Lab Environment
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
                              Payload:
                            </label>
                            <Input
                              placeholder="' OR 1=1 --"
                              className="bg-black border-green-400/30 text-green-400 font-mono"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            className="bg-green-400 text-black hover:bg-green-300 mr-2"
                            onClick={() =>
                              setLabProgress(Math.min(100, labProgress + 25))
                            }
                          >
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
                          Terminal Navigation Challenge
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
                                    setLabProgress(
                                      Math.min(100, labProgress + 20)
                                    );
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lab Instructions */}
            <div className="space-y-6">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-lg flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Lab Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ol className="list-decimal list-inside space-y-2 text-green-300/80 text-sm">
                    {lab.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">{index + 1}.</span>
                        <span className="flex-1">{objective}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-lg">
                    Lab Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span>{labProgress}%</span>
                    </div>
                    <Progress value={labProgress} className="h-2" />

                    {labProgress === 100 && (
                      <div className="flex items-center justify-center p-4 bg-green-400/20 border border-green-400/30 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-green-400 font-semibold">
                          Lab Completed!
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-green-400/30 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-green-400 text-sm">
              © 2024 CyberSec Academy. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400 hover:bg-green-400/10"
              >
                Help
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400 hover:bg-green-400/10"
              >
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LabPage;
