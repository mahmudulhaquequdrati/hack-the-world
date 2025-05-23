import { Header } from "@/components/header.tsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Globe,
  Lock,
  Network,
  Shield,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CyberSecOverview = () => {
  const navigate = useNavigate();
  const [completedModules] = useState<string[]>(["foundations", "linux"]);

  const modules = [
    {
      id: "foundations",
      title: "Cybersecurity Foundations",
      description: "Essential concepts, terminology, and security principles",
      icon: Shield,
      duration: "2-3 weeks",
      difficulty: "Beginner",
      progress: 85,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/30",
      prerequisites: [],
      topics: [
        "CIA Triad",
        "Risk Assessment",
        "Compliance",
        "Security Frameworks",
      ],
      path: "/course/foundations",
      enrollPath: "/learn/foundations",
      labs: 5,
      games: 3,
      assets: 12,
    },
    {
      id: "linux",
      title: "Linux Command Line Mastery",
      description: "Master the terminal, file systems, and command-line tools",
      icon: Terminal,
      duration: "3-4 weeks",
      difficulty: "Beginner",
      progress: 70,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
      prerequisites: ["foundations"],
      topics: [
        "Basic Commands",
        "File Permissions",
        "Process Management",
        "Scripting",
      ],
      path: "/course/linux",
      enrollPath: "/learn/linux",
      labs: 8,
      games: 4,
      assets: 18,
    },
    {
      id: "networking",
      title: "Network Security & Analysis",
      description: "Understand network protocols, scanning, and monitoring",
      icon: Network,
      duration: "4-5 weeks",
      difficulty: "Intermediate",
      progress: 45,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30",
      prerequisites: ["foundations", "linux"],
      topics: ["TCP/IP", "Wireshark", "Port Scanning", "Network Defense"],
      path: "/course/networking",
      enrollPath: "/learn/networking",
      labs: 12,
      games: 6,
      assets: 25,
    },
    {
      id: "web-security",
      title: "Web Application Security",
      description: "Discover and exploit web vulnerabilities ethically",
      icon: Globe,
      duration: "5-6 weeks",
      difficulty: "Intermediate",
      progress: 30,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/30",
      prerequisites: ["foundations", "networking"],
      topics: ["OWASP Top 10", "SQL Injection", "XSS", "Authentication Bypass"],
      path: "/course/web-security",
      enrollPath: "/learn/web-security",
      labs: 15,
      games: 8,
      assets: 30,
    },
    {
      id: "social-engineering",
      title: "Social Engineering & OSINT",
      description: "Human psychology, information gathering, and awareness",
      icon: Users,
      duration: "3-4 weeks",
      difficulty: "Intermediate",
      progress: 15,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
      prerequisites: ["foundations"],
      topics: [
        "OSINT Techniques",
        "Phishing",
        "Social Psychology",
        "Defense Strategies",
      ],
      path: "/course/social-engineering",
      enrollPath: "/learn/social-engineering",
      labs: 10,
      games: 5,
      assets: 20,
    },
    {
      id: "advanced-exploitation",
      title: "Advanced Penetration Testing",
      description: "Advanced attack techniques and post-exploitation",
      icon: Activity,
      duration: "6-8 weeks",
      difficulty: "Advanced",
      progress: 0,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/30",
      prerequisites: ["linux", "networking", "web-security"],
      topics: [
        "Buffer Overflows",
        "Privilege Escalation",
        "Lateral Movement",
        "Persistence",
      ],
      path: "/course/advanced-exploitation",
      enrollPath: "/learn/advanced-exploitation",
      labs: 20,
      games: 12,
      assets: 45,
    },
  ];

  const getModuleStatus = (moduleId: string, prerequisites: string[]) => {
    if (completedModules.includes(moduleId)) return "completed";
    if (prerequisites.every((req) => completedModules.includes(req)))
      return "available";
    return "locked";
  };

  const overallProgress = Math.round(
    modules.reduce((sum, module) => sum + module.progress, 0) / modules.length
  );

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-400/20 text-green-400 border-green-400 mb-4">
              Complete Cybersecurity Mastery Path
            </Badge>
            <h1 className="text-5xl font-bold mb-4 text-green-400">
              Your Cybersecurity Journey
            </h1>
            <p className="text-xl text-green-300/80 max-w-3xl mx-auto mb-8">
              Master cybersecurity through our structured learning path. Each
              module builds upon the previous, creating a comprehensive
              understanding of modern cybersecurity practices.
            </p>

            {/* Overall Progress */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-300">Overall Progress</span>
                <span className="text-sm text-green-400 font-bold">
                  {overallProgress}%
                </span>
              </div>
              <Progress
                value={overallProgress}
                className="h-3 bg-black border border-green-400/30"
              />
            </div>
          </div>

          {/* Linear Learning Path */}
          <div className="relative mb-16">
            <h2 className="text-2xl font-bold text-center mb-12 text-green-400">
              Learning Path - Complete in Order
            </h2>

            <div className="space-y-8">
              {modules.map((module, index) => {
                const status = getModuleStatus(module.id, module.prerequisites);
                const isLocked = status === "locked";
                const isCompleted = status === "completed";
                const isLastModule = index === modules.length - 1;

                return (
                  <div key={module.id} className="relative">
                    {/* Module Card */}
                    <Card
                      className={`
                        ${module.bgColor} ${module.borderColor} border-2
                        ${
                          isLocked
                            ? "opacity-60"
                            : "hover:scale-[1.02] cursor-pointer"
                        }
                        transition-all duration-300 relative
                      `}
                      onClick={() => !isLocked && navigate(module.path)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Module Number */}
                            <div
                              className={`
                              w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg
                              ${
                                isCompleted
                                  ? "bg-green-400 text-black border-green-400"
                                  : isLocked
                                  ? "bg-gray-600 text-gray-300 border-gray-600"
                                  : `${module.bgColor} ${module.borderColor} ${module.color}`
                              }
                            `}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                index + 1
                              )}
                            </div>

                            {/* Module Icon and Info */}
                            <div className="flex items-center space-x-3">
                              <module.icon
                                className={`w-10 h-10 ${
                                  isLocked ? "text-gray-400" : module.color
                                }`}
                              />
                              <div>
                                <CardTitle
                                  className={`${
                                    isLocked ? "text-gray-400" : module.color
                                  } text-xl mb-1`}
                                >
                                  {module.title}
                                </CardTitle>
                                <div className="flex space-x-3">
                                  <Badge variant="outline" className="text-xs">
                                    {module.difficulty}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {module.duration}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {module.labs} Labs
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {!isLocked && (
                            <ArrowRight
                              className={`w-6 h-6 ${module.color} opacity-70`}
                            />
                          )}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p
                          className={`text-base mb-4 ${
                            isLocked ? "text-gray-500" : "text-green-300/80"
                          }`}
                        >
                          {module.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-green-300">
                              Progress
                            </span>
                            <span className="text-sm text-green-400 font-bold">
                              {module.progress}%
                            </span>
                          </div>
                          <Progress
                            value={module.progress}
                            className="h-2 bg-black/50 border border-green-400/20"
                          />
                        </div>

                        {/* Content Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div
                              className={`text-lg font-bold ${module.color}`}
                            >
                              {module.labs}
                            </div>
                            <div className="text-xs text-green-300/70">
                              Labs
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-lg font-bold ${module.color}`}
                            >
                              {module.games}
                            </div>
                            <div className="text-xs text-green-300/70">
                              Games
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-lg font-bold ${module.color}`}
                            >
                              {module.assets}
                            </div>
                            <div className="text-xs text-green-300/70">
                              Assets
                            </div>
                          </div>
                        </div>

                        {/* Topics */}
                        <div className="space-y-2">
                          <span className="text-sm text-green-300 font-medium">
                            Key Topics:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {module.topics.map((topic, topicIndex) => (
                              <Badge
                                key={topicIndex}
                                variant="outline"
                                className="text-xs px-2 py-1 border-green-400/30 text-green-400"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Prerequisites */}
                        {module.prerequisites.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-green-400/20">
                            <span className="text-xs text-green-300/70">
                              Prerequisites: {module.prerequisites.join(", ")}
                            </span>
                          </div>
                        )}

                        {isLocked && (
                          <div className="mt-4 p-3 bg-gray-600/20 border border-gray-600/30 rounded">
                            <div className="flex items-center space-x-2">
                              <Lock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">
                                Complete prerequisites to unlock this module
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Connection Arrow */}
                    {!isLastModule && (
                      <div className="flex justify-center py-4">
                        <ArrowDown className="w-8 h-8 text-green-400/50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-black/50 border-green-400/30">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">6</div>
                <div className="text-sm text-green-300/70">
                  Learning Modules
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-green-400/30">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">70+</div>
                <div className="text-sm text-green-300/70">Hands-on Labs</div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-green-400/30">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400">38+</div>
                <div className="text-sm text-green-300/70">
                  Interactive Games
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-green-400/30">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">150+</div>
                <div className="text-sm text-green-300/70">Learning Assets</div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-green-400">
              Ready to Start Your Journey?
            </h2>
            <p className="text-green-300/80 mb-8 max-w-2xl mx-auto">
              Begin with the foundations and progress through our structured
              learning path. Each module is designed to build upon the previous,
              ensuring comprehensive mastery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-400 text-black hover:bg-green-300 font-medium"
                onClick={() => navigate("/course/foundations")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start with Foundations
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-2 text-green-400 hover:bg-green-400/10 font-medium"
                onClick={() => navigate("/demo")}
              >
                <Activity className="w-5 h-5 mr-2" />
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberSecOverview;
