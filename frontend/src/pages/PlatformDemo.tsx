import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BookOpen,
  Code,
  Eye,
  Play,
  Shield,
  Terminal,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlatformDemo = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState("terminal");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = {
    terminal: [
      "$ whoami",
      "terminal-hacks-trainee",
      "$ pwd",
      "/home/terminal-hacks-trainee/labs",
      "$ ls -la",
      "total 12",
      "drwxr-xr-x 3 terminal-hacks-trainee terminal-hacks-trainee 4096 Dec 15 10:30 .",
      "drwxr-xr-x 5 terminal-hacks-trainee terminal-hacks-trainee 4096 Dec 15 10:25 ..",
      "drwxr-xr-x 2 terminal-hacks-trainee terminal-hacks-trainee 4096 Dec 15 10:30 vulnerable-app",
      "$ cd vulnerable-app",
      "$ nmap -sV localhost",
      "Starting Nmap 7.80 scan...",
      "PORT     STATE SERVICE VERSION",
      "22/tcp   open  ssh     OpenSSH 7.6p1",
      "80/tcp   open  http    Apache httpd 2.4.29",
      "3306/tcp open  mysql   MySQL 5.7.34",
      "$ curl http://localhost/login.php?user=admin'--",
      "SQL Error: You have an error in your SQL syntax...",
      "🎯 Vulnerability Found! SQL Injection detected!",
    ],
  };

  useEffect(() => {
    if (activeDemo === "terminal") {
      const interval = setInterval(() => {
        if (currentStep < demoSteps.terminal.length) {
          setTerminalOutput((prev) => [
            ...prev,
            demoSteps.terminal[currentStep],
          ]);
          setCurrentStep((prev) => prev + 1);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [activeDemo, currentStep, demoSteps.terminal]);

  const resetDemo = () => {
    setTerminalOutput([]);
    setCurrentStep(0);
  };

  const features = [
    {
      icon: Terminal,
      title: "Interactive Terminal",
      description:
        "Real Linux environments with pre-configured vulnerable systems",
      color: "text-green-400",
      demo: "terminal",
    },
    {
      icon: Shield,
      title: "Vulnerability Labs",
      description: "Hands-on exploitation of real-world security flaws",
      color: "text-red-400",
      demo: "vulnlab",
    },
    {
      icon: Code,
      title: "Code Analysis",
      description: "Review and identify security issues in source code",
      color: "text-blue-400",
      demo: "code",
    },
    {
      icon: Users,
      title: "Social Engineering",
      description: "OSINT gathering and social manipulation techniques",
      color: "text-purple-400",
      demo: "social",
    },
  ];

  const learningPath = [
    {
      step: 1,
      title: "Choose Your Module",
      description:
        "Select from Linux, Web Security, Networking, or Social Engineering",
      icon: BookOpen,
    },
    {
      step: 2,
      title: "Watch & Learn",
      description: "Interactive video tutorials with real-world examples",
      icon: Video,
    },
    {
      step: 3,
      title: "Practice in Labs",
      description: "Hands-on practice in safe, isolated environments",
      icon: Terminal,
    },
    {
      step: 4,
      title: "Test Your Skills",
      description: "Complete challenges and earn points for your achievements",
      icon: Activity,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="bg-green-400/20 text-green-400 border-green-400 mb-4">
              Platform Demo
            </Badge>
            <h1 className="text-5xl font-bold mb-4 text-green-400">
              See How It Works
            </h1>
            <p className="text-xl text-green-300/80 max-w-3xl mx-auto mb-8">
              Experience our interactive cybersecurity platform with real
              examples. Learn through hands-on practice, not just theory.
            </p>
          </div>

          {/* Learning Path Overview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-green-400">
              How You Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {learningPath.map((step, index) => (
                <Card
                  key={index}
                  className="bg-black/50 border-green-400/30 relative"
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-green-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    <CardTitle className="text-green-400 text-lg">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-300/80 text-sm text-center">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Interactive Demo */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-green-400">
              Interactive Demo
            </h2>

            <Tabs
              value={activeDemo}
              onValueChange={setActiveDemo}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-green-400/30">
                {features.map((feature) => (
                  <TabsTrigger
                    key={feature.demo}
                    value={feature.demo}
                    className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400"
                  >
                    <feature.icon className="w-4 h-4 mr-2" />
                    {feature.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="terminal" className="mt-6">
                <Card className="bg-black/90 border-green-400">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 text-green-400 text-sm flex items-center justify-between w-full">
                      <span>Terminal - SQL Injection Discovery Lab</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetDemo}
                        className="border-green-400/50 text-green-400 hover:bg-green-400/10"
                      >
                        Reset Demo
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="font-mono text-sm h-96 overflow-y-auto bg-black/50">
                    <div className="space-y-1">
                      {terminalOutput.map((line, index) => (
                        <div
                          key={index}
                          className={`${
                            line.startsWith("$")
                              ? "text-green-400"
                              : line.includes("ERROR") || line.includes("error")
                              ? "text-red-400"
                              : line.includes("🎯")
                              ? "text-yellow-400 font-bold"
                              : line.includes("PORT") || line.includes("tcp")
                              ? "text-blue-400"
                              : "text-green-300/80"
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                      {currentStep < demoSteps.terminal.length && (
                        <div className="text-green-400">
                          $ <span className="terminal-cursor">|</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vulnlab" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black/50 border-red-400/30">
                    <CardHeader>
                      <CardTitle className="text-red-400 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Vulnerable Web App
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/80 p-4 rounded border border-red-400/20 mb-4">
                        <div className="text-red-300 text-sm mb-2">
                          Target: http://vulnerable-app.local
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>SQL Injection:</span>
                            <Badge className="bg-red-400/20 text-red-400">
                              Vulnerable
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>XSS:</span>
                            <Badge className="bg-red-400/20 text-red-400">
                              Vulnerable
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>CSRF:</span>
                            <Badge className="bg-orange-400/20 text-orange-400">
                              Patched
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-red-400 text-black hover:bg-red-300">
                        <Play className="w-4 h-4 mr-2" />
                        Start Exploitation
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-green-400/30">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Real-time Guidance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-green-400 font-medium">
                              Step 1: Reconnaissance
                            </div>
                            <div className="text-green-300/70">
                              Scan for open ports and services
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-yellow-400 font-medium">
                              Step 2: Vulnerability Discovery
                            </div>
                            <div className="text-green-300/70">
                              Test input fields for injection flaws
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-gray-400 font-medium">
                              Step 3: Exploitation
                            </div>
                            <div className="text-green-300/70">
                              Extract sensitive data
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="code" className="mt-6">
                <Card className="bg-black/50 border-blue-400/30">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      Code Security Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/80 p-4 rounded border border-blue-400/20 font-mono text-sm">
                      <div className="text-blue-300 mb-2">
                        // Vulnerable PHP Login Code
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-purple-400">$username</span> ={" "}
                          <span className="text-green-300">$_POST</span>[
                          <span className="text-yellow-400">'username'</span>];
                        </div>
                        <div>
                          <span className="text-purple-400">$password</span> ={" "}
                          <span className="text-green-300">$_POST</span>[
                          <span className="text-yellow-400">'password'</span>];
                        </div>
                        <div className="bg-red-400/20 border-l-4 border-red-400 pl-2">
                          <span className="text-purple-400">$query</span> ={" "}
                          <span className="text-yellow-400">
                            "SELECT * FROM users WHERE username='$username' AND
                            password='$password'"
                          </span>
                          ;
                        </div>
                        <div>
                          <span className="text-blue-400">$result</span> ={" "}
                          <span className="text-green-300">mysqli_query</span>(
                          <span className="text-purple-400">$conn</span>,{" "}
                          <span className="text-purple-400">$query</span>);
                        </div>
                      </div>
                      <div className="mt-4 p-2 bg-red-400/10 border border-red-400/30 rounded">
                        <div className="text-red-400 text-xs">
                          ⚠️ Security Issue Found:
                        </div>
                        <div className="text-red-300 text-xs">
                          Direct SQL concatenation without sanitization
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black/50 border-purple-400/30">
                    <CardHeader>
                      <CardTitle className="text-purple-400 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        OSINT Investigation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-black/80 p-3 rounded border border-purple-400/20">
                          <div className="text-purple-300 text-sm mb-1">
                            Target: john.doe@company.com
                          </div>
                          <div className="text-xs space-y-1">
                            <div>🔍 LinkedIn: Senior Developer at TechCorp</div>
                            <div>🔍 GitHub: 47 repositories, mostly PHP</div>
                            <div>🔍 Twitter: Posts about company events</div>
                            <div className="text-yellow-400">
                              ⚠️ Potential attack vector found
                            </div>
                          </div>
                        </div>
                        <Button className="w-full bg-purple-400 text-black hover:bg-purple-300">
                          <Eye className="w-4 h-4 mr-2" />
                          Analyze Social Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-yellow-400/30">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Phishing Simulation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/80 p-3 rounded border border-yellow-400/20 mb-3">
                        <div className="text-yellow-300 text-sm mb-2">
                          Crafted Email Preview:
                        </div>
                        <div className="text-xs space-y-1 text-green-300/70">
                          <div>
                            <strong>From:</strong> IT-Support@techcorp.com
                          </div>
                          <div>
                            <strong>Subject:</strong> Urgent: Security Update
                            Required
                          </div>
                          <div className="mt-2 text-yellow-200">
                            "Dear John, we've detected suspicious activity..."
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-green-300/70 mb-3">
                        ✅ Personalized content ✅ Urgent tone ✅ Company
                        branding
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-yellow-400/50 text-yellow-400"
                      >
                        Review Ethical Guidelines
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* Key Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-green-400">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <Terminal className="w-12 h-12 text-green-400 mb-4" />
                  <CardTitle className="text-green-400">
                    Isolated Labs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-300/80 text-sm">
                    Practice in completely isolated virtual environments. No
                    risk to real systems or data.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <Activity className="w-12 h-12 text-blue-400 mb-4" />
                  <CardTitle className="text-green-400">
                    Real-time Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-300/80 text-sm">
                    Get instant feedback on your actions with detailed
                    explanations and next steps.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                  <CardTitle className="text-green-400">
                    Progressive Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-300/80 text-sm">
                    Unlock advanced modules as you master the basics. Structured
                    path to expertise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-green-400">
              Ready to Start Learning?
            </h2>
            <p className="text-green-300/80 mb-8 max-w-2xl mx-auto">
              Join thousands of cybersecurity professionals who have mastered
              their skills through our hands-on platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-400 text-black hover:bg-green-300 font-medium"
                onClick={() => navigate("/overview")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Learning Path
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-2 text-green-400 hover:bg-green-400/10 font-medium"
                onClick={() => navigate("/signup")}
              >
                <Zap className="w-5 h-5 mr-2" />
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformDemo;
