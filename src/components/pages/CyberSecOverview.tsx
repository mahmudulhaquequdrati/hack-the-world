import { Header } from "@/components/header.tsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Cloud,
  Code,
  Database,
  Eye,
  GraduationCap,
  Lightbulb,
  Lock,
  Network,
  Shield,
  Smartphone,
  Target,
  Terminal,
  Users,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  difficulty: string;
  progress: number;
  color: string;
  bgColor: string;
  borderColor: string;
  topics: string[];
  path: string;
  enrollPath: string;
  labs: number;
  games: number;
  assets: number;
  enrolled: boolean;
  completed: boolean;
}

interface Phase {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  modules: Module[];
}

const CyberSecOverview = () => {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState("beginner");
  const [completedModules] = useState<string[]>([
    "foundations",
    "linux-basics",
    "networking-basics",
  ]);

  const phases: Phase[] = [
    {
      id: "beginner",
      title: "Beginner Phase",
      description: "Foundation courses for cybersecurity beginners",
      icon: Lightbulb,
      color: "text-green-400",
      modules: [
        {
          id: "foundations",
          title: "Cybersecurity Fundamentals",
          description:
            "Essential concepts, terminology, and security principles",
          icon: Shield,
          duration: "2-3 weeks",
          difficulty: "Beginner",
          progress: 85,
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/30",
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
          enrolled: true,
          completed: true,
        },
        {
          id: "linux-basics",
          title: "Linux Command Line Basics",
          description: "Master the terminal and basic command-line operations",
          icon: Terminal,
          duration: "2-3 weeks",
          difficulty: "Beginner",
          progress: 70,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
          topics: [
            "Basic Commands",
            "File Navigation",
            "Text Processing",
            "Permissions",
          ],
          path: "/course/linux-basics",
          enrollPath: "/learn/linux-basics",
          labs: 8,
          games: 4,
          assets: 18,
          enrolled: true,
          completed: true,
        },
        {
          id: "networking-basics",
          title: "Networking Fundamentals",
          description: "Understanding network protocols and basic concepts",
          icon: Network,
          duration: "3-4 weeks",
          difficulty: "Beginner",
          progress: 60,
          color: "text-purple-400",
          bgColor: "bg-purple-400/10",
          borderColor: "border-purple-400/30",
          topics: ["TCP/IP", "OSI Model", "DNS", "Basic Protocols"],
          path: "/course/networking-basics",
          enrollPath: "/learn/networking-basics",
          labs: 10,
          games: 5,
          assets: 20,
          enrolled: true,
          completed: true,
        },
        {
          id: "web-security-intro",
          title: "Introduction to Web Security",
          description:
            "Basic web application security concepts and common vulnerabilities",
          icon: Shield,
          duration: "2-3 weeks",
          difficulty: "Beginner",
          progress: 40,
          color: "text-cyan-400",
          bgColor: "bg-cyan-400/10",
          borderColor: "border-cyan-400/30",
          topics: ["HTTP/HTTPS", "Authentication", "Basic XSS", "CSRF Basics"],
          path: "/course/web-security-intro",
          enrollPath: "/learn/web-security-intro",
          labs: 6,
          games: 3,
          assets: 15,
          enrolled: true,
          completed: false,
        },
        {
          id: "digital-forensics-basics",
          title: "Digital Forensics Basics",
          description:
            "Introduction to digital evidence and investigation techniques",
          icon: Eye,
          duration: "2-3 weeks",
          difficulty: "Beginner",
          progress: 20,
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
          topics: [
            "Evidence Handling",
            "File Systems",
            "Basic Analysis",
            "Chain of Custody",
          ],
          path: "/course/digital-forensics-basics",
          enrollPath: "/learn/digital-forensics-basics",
          labs: 7,
          games: 4,
          assets: 16,
          enrolled: true,
          completed: false,
        },
        {
          id: "security-awareness",
          title: "Security Awareness & Policies",
          description:
            "Understanding security policies, compliance, and human factors",
          icon: Users,
          duration: "1-2 weeks",
          difficulty: "Beginner",
          progress: 0,
          color: "text-orange-400",
          bgColor: "bg-orange-400/10",
          borderColor: "border-orange-400/30",
          topics: [
            "Security Policies",
            "GDPR",
            "Phishing Awareness",
            "Password Security",
          ],
          path: "/course/security-awareness",
          enrollPath: "/learn/security-awareness",
          labs: 4,
          games: 6,
          assets: 10,
          enrolled: false,
          completed: false,
        },
      ],
    },
    {
      id: "intermediate",
      title: "Intermediate Phase",
      description: "Building on fundamentals with practical security skills",
      icon: Brain,
      color: "text-yellow-400",
      modules: [
        {
          id: "advanced-networking",
          title: "Advanced Network Security",
          description:
            "Network monitoring, intrusion detection, and security protocols",
          icon: Network,
          duration: "4-5 weeks",
          difficulty: "Intermediate",
          progress: 30,
          color: "text-purple-400",
          bgColor: "bg-purple-400/10",
          borderColor: "border-purple-400/30",
          topics: ["IDS/IPS", "VPNs", "Firewalls", "Network Monitoring"],
          path: "/course/advanced-networking",
          enrollPath: "/learn/advanced-networking",
          labs: 12,
          games: 6,
          assets: 25,
          enrolled: true,
          completed: false,
        },
        {
          id: "web-application-security",
          title: "Web Application Security",
          description:
            "Advanced web vulnerabilities and exploitation techniques",
          icon: Code,
          duration: "5-6 weeks",
          difficulty: "Intermediate",
          progress: 45,
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
          topics: [
            "OWASP Top 10",
            "SQL Injection",
            "XSS",
            "Authentication Bypass",
          ],
          path: "/course/web-application-security",
          enrollPath: "/learn/web-application-security",
          labs: 15,
          games: 8,
          assets: 30,
          enrolled: true,
          completed: false,
        },
        {
          id: "social-engineering-osint",
          title: "Social Engineering & OSINT",
          description: "Human psychology, information gathering, and awareness",
          icon: Users,
          duration: "3-4 weeks",
          difficulty: "Intermediate",
          progress: 15,
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
          topics: [
            "OSINT Techniques",
            "Phishing",
            "Social Psychology",
            "Defense Strategies",
          ],
          path: "/course/social-engineering-osint",
          enrollPath: "/learn/social-engineering-osint",
          labs: 10,
          games: 5,
          assets: 20,
          enrolled: true,
          completed: false,
        },
        {
          id: "incident-response",
          title: "Incident Response & Management",
          description:
            "Responding to security incidents and managing cyber crises",
          icon: Target,
          duration: "4-5 weeks",
          difficulty: "Intermediate",
          progress: 0,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
          topics: [
            "IR Frameworks",
            "Containment",
            "Eradication",
            "Recovery Procedures",
          ],
          path: "/course/incident-response",
          enrollPath: "/learn/incident-response",
          labs: 11,
          games: 7,
          assets: 22,
          enrolled: false,
          completed: false,
        },
        {
          id: "cryptography-pki",
          title: "Cryptography & PKI",
          description:
            "Encryption, digital signatures, and public key infrastructure",
          icon: Lock,
          duration: "4-5 weeks",
          difficulty: "Intermediate",
          progress: 0,
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/30",
          topics: [
            "Symmetric Crypto",
            "Asymmetric Crypto",
            "Digital Signatures",
            "PKI",
          ],
          path: "/course/cryptography-pki",
          enrollPath: "/learn/cryptography-pki",
          labs: 9,
          games: 4,
          assets: 18,
          enrolled: false,
          completed: false,
        },
        {
          id: "vulnerability-assessment",
          title: "Vulnerability Assessment & Scanning",
          description:
            "Identifying and assessing security weaknesses in systems",
          icon: Eye,
          duration: "3-4 weeks",
          difficulty: "Intermediate",
          progress: 0,
          color: "text-cyan-400",
          bgColor: "bg-cyan-400/10",
          borderColor: "border-cyan-400/30",
          topics: [
            "Vulnerability Scanners",
            "Risk Assessment",
            "Patch Management",
            "Reporting",
          ],
          path: "/course/vulnerability-assessment",
          enrollPath: "/learn/vulnerability-assessment",
          labs: 8,
          games: 5,
          assets: 16,
          enrolled: false,
          completed: false,
        },
        {
          id: "mobile-security",
          title: "Mobile Security",
          description: "iOS and Android security, mobile app testing",
          icon: Smartphone,
          duration: "3-4 weeks",
          difficulty: "Intermediate",
          progress: 0,
          color: "text-pink-400",
          bgColor: "bg-pink-400/10",
          borderColor: "border-pink-400/30",
          topics: ["Mobile Platforms", "App Security", "MDM", "Mobile Threats"],
          path: "/course/mobile-security",
          enrollPath: "/learn/mobile-security",
          labs: 10,
          games: 6,
          assets: 19,
          enrolled: false,
          completed: false,
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Phase",
      description: "Specialized advanced topics for security experts",
      icon: GraduationCap,
      color: "text-red-400",
      modules: [
        {
          id: "advanced-penetration-testing",
          title: "Advanced Penetration Testing",
          description: "Advanced attack techniques and post-exploitation",
          icon: Activity,
          duration: "6-8 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-orange-400",
          bgColor: "bg-orange-400/10",
          borderColor: "border-orange-400/30",
          topics: [
            "Buffer Overflows",
            "Privilege Escalation",
            "Lateral Movement",
            "Persistence",
          ],
          path: "/course/advanced-penetration-testing",
          enrollPath: "/learn/advanced-penetration-testing",
          labs: 20,
          games: 12,
          assets: 45,
          enrolled: false,
          completed: false,
        },
        {
          id: "malware-analysis",
          title: "Malware Analysis & Reverse Engineering",
          description:
            "Analyzing malicious software and reverse engineering techniques",
          icon: Code,
          duration: "6-8 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
          topics: [
            "Static Analysis",
            "Dynamic Analysis",
            "Reverse Engineering",
            "Sandbox Evasion",
          ],
          path: "/course/malware-analysis",
          enrollPath: "/learn/malware-analysis",
          labs: 18,
          games: 10,
          assets: 40,
          enrolled: false,
          completed: false,
        },
        {
          id: "red-team-operations",
          title: "Red Team Operations",
          description: "Advanced adversarial simulation and tactics",
          icon: Target,
          duration: "8-10 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-red-600",
          bgColor: "bg-red-600/10",
          borderColor: "border-red-600/30",
          topics: [
            "TTPs",
            "Command & Control",
            "Persistence",
            "Evasion Techniques",
          ],
          path: "/course/red-team-operations",
          enrollPath: "/learn/red-team-operations",
          labs: 25,
          games: 15,
          assets: 55,
          enrolled: false,
          completed: false,
        },
        {
          id: "cloud-security-architecture",
          title: "Cloud Security Architecture",
          description: "Securing cloud environments and infrastructure",
          icon: Cloud,
          duration: "5-6 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/30",
          topics: [
            "AWS Security",
            "Azure Security",
            "Container Security",
            "DevSecOps",
          ],
          path: "/course/cloud-security-architecture",
          enrollPath: "/learn/cloud-security-architecture",
          labs: 16,
          games: 8,
          assets: 35,
          enrolled: false,
          completed: false,
        },
        {
          id: "iot-security",
          title: "IoT Security",
          description: "Internet of Things security and embedded systems",
          icon: Wifi,
          duration: "4-5 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-purple-400",
          bgColor: "bg-purple-400/10",
          borderColor: "border-purple-400/30",
          topics: [
            "Embedded Systems",
            "Hardware Security",
            "IoT Protocols",
            "Firmware Analysis",
          ],
          path: "/course/iot-security",
          enrollPath: "/learn/iot-security",
          labs: 14,
          games: 7,
          assets: 28,
          enrolled: false,
          completed: false,
        },
        {
          id: "advanced-forensics",
          title: "Advanced Digital Forensics",
          description:
            "Advanced investigation techniques and specialized tools",
          icon: Eye,
          duration: "6-7 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
          topics: [
            "Memory Forensics",
            "Network Forensics",
            "Mobile Forensics",
            "Timeline Analysis",
          ],
          path: "/course/advanced-forensics",
          enrollPath: "/learn/advanced-forensics",
          labs: 17,
          games: 9,
          assets: 38,
          enrolled: false,
          completed: false,
        },
        {
          id: "threat-hunting",
          title: "Threat Hunting",
          description: "Proactive threat detection and hunting methodologies",
          icon: Target,
          duration: "5-6 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
          topics: [
            "Hunting Methodologies",
            "MITRE ATT&CK",
            "IOCs",
            "Behavioral Analysis",
          ],
          path: "/course/threat-hunting",
          enrollPath: "/learn/threat-hunting",
          labs: 15,
          games: 8,
          assets: 32,
          enrolled: false,
          completed: false,
        },
      ],
    },
  ];

  const getModuleStatus = (moduleId: string) => {
    return completedModules.includes(moduleId) ? "completed" : "available";
  };

  const getOverallProgress = () => {
    const allModules = phases.flatMap((phase) => phase.modules);
    return Math.round(
      allModules.reduce((sum, module) => sum + module.progress, 0) /
        allModules.length
    );
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-400/20 text-green-400 border-green-400 mb-4">
              Complete Cybersecurity Mastery Path
            </Badge>
            <h1 className="text-5xl font-bold mb-4 text-green-400">
              Your Cybersecurity Journey
            </h1>
            <p className="text-xl text-green-300/80 max-w-4xl mx-auto mb-8">
              Master cybersecurity through our structured learning path.
              Progress through beginner fundamentals, intermediate practical
              skills, and advanced specialized expertise.
            </p>

            {/* Overall Progress */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-300">Overall Progress</span>
                <span className="text-sm text-green-400 font-bold">
                  {getOverallProgress()}%
                </span>
              </div>
              <Progress
                value={getOverallProgress()}
                className="h-3 bg-black border border-green-400/30"
              />
            </div>
          </div>

          {/* Phase Navigation */}
          <Tabs
            value={activePhase}
            onValueChange={setActivePhase}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <TabsList className="bg-black/50 border border-green-400/30 p-1">
                {phases.map((phase) => {
                  const PhaseIcon = phase.icon;
                  return (
                    <TabsTrigger
                      key={phase.id}
                      value={phase.id}
                      className="data-[state=active]:bg-green-400 data-[state=active]:text-black flex items-center space-x-2"
                    >
                      <PhaseIcon className="w-4 h-4" />
                      <span>{phase.title}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {phases.map((phase) => (
              <TabsContent
                key={phase.id}
                value={phase.id}
                className="space-y-8"
              >
                {/* Phase Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <phase.icon className={`w-8 h-8 ${phase.color}`} />
                    <h2 className={`text-3xl font-bold ${phase.color}`}>
                      {phase.title}
                    </h2>
                  </div>
                  <p className="text-lg text-green-300/80 max-w-3xl mx-auto mb-8">
                    {phase.description}
                  </p>

                  {/* Phase Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-black/50 border-green-400/30">
                      <CardContent className="p-4 text-center">
                        <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-green-400">
                          {phase.modules.length}
                        </div>
                        <div className="text-xs text-green-300/70">Courses</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-black/50 border-green-400/30">
                      <CardContent className="p-4 text-center">
                        <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-yellow-400">
                          {phase.modules.reduce(
                            (sum, module) => sum + module.labs,
                            0
                          )}
                        </div>
                        <div className="text-xs text-green-300/70">Labs</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-black/50 border-green-400/30">
                      <CardContent className="p-4 text-center">
                        <Activity className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-red-400">
                          {phase.modules.reduce(
                            (sum, module) => sum + module.games,
                            0
                          )}
                        </div>
                        <div className="text-xs text-green-300/70">Games</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-black/50 border-green-400/30">
                      <CardContent className="p-4 text-center">
                        <Database className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-blue-400">
                          {phase.modules.reduce(
                            (sum, module) => sum + module.assets,
                            0
                          )}
                        </div>
                        <div className="text-xs text-green-300/70">Assets</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Modules Tree Structure */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-6">
                    <Terminal className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-mono text-sm">
                      ~/{phase.id}_phase/
                    </span>
                  </div>

                  <div className="bg-black/60 border border-green-400/30 rounded-lg p-6 font-mono">
                    <div className="space-y-0">
                      {phase.modules.map((module, index) => {
                        const status = getModuleStatus(module.id);
                        const isCompleted = status === "completed";
                        const isLast = index === phase.modules.length - 1;
                        const treeChar = isLast ? "└──" : "├──";

                        return (
                          <div key={module.id} className="relative">
                            {/* Tree Structure */}
                            <div className="flex items-start space-x-1">
                              <div className="flex flex-col items-center">
                                <span className="text-green-400/70 text-sm leading-none">
                                  {treeChar}
                                </span>
                                {!isLast && (
                                  <div className="w-px h-12 bg-green-400/30 mt-1"></div>
                                )}
                              </div>

                              {/* Module Card */}
                              <Card
                                className={`
                                  flex-1 ${module.bgColor} ${module.borderColor} border-2
                                  hover:scale-[1.01] cursor-pointer transition-all duration-300
                                  relative ml-2 mb-4
                                `}
                                onClick={() => navigate(module.path)}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      {/* Status Indicator */}
                                      <div className="flex items-center space-x-2">
                                        <div
                                          className={`
                                            w-8 h-8 rounded border-2 flex items-center justify-center
                                            ${
                                              isCompleted
                                                ? "bg-green-400 text-black border-green-400"
                                                : module.enrolled
                                                ? `${module.bgColor} ${module.borderColor} ${module.color}`
                                                : "bg-gray-600/20 border-gray-600/50 text-gray-400"
                                            }
                                          `}
                                        >
                                          {isCompleted ? (
                                            <CheckCircle className="w-4 h-4" />
                                          ) : (
                                            <module.icon className="w-4 h-4" />
                                          )}
                                        </div>

                                        {/* File-like name */}
                                        <div className="font-mono">
                                          <span className="text-green-400/70">
                                            📁
                                          </span>
                                          <CardTitle
                                            className={`${module.color} text-base inline ml-1`}
                                          >
                                            {module.title
                                              .toLowerCase()
                                              .replace(/\s+/g, "_")}
                                          </CardTitle>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Status badges */}
                                    <div className="flex items-center space-x-2">
                                      {module.enrolled && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-green-400/10 border-green-400/50 text-green-400"
                                        >
                                          ENROLLED
                                        </Badge>
                                      )}
                                      {isCompleted && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-green-400/20 border-green-400 text-green-400"
                                        >
                                          COMPLETED
                                        </Badge>
                                      )}
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          module.difficulty === "Beginner"
                                            ? "border-green-400/50 text-green-400"
                                            : module.difficulty ===
                                              "Intermediate"
                                            ? "border-yellow-400/50 text-yellow-400"
                                            : "border-red-400/50 text-red-400"
                                        }`}
                                      >
                                        {module.difficulty.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                  {/* Description */}
                                  <p className="text-green-300/70 text-sm mb-3 font-sans">
                                    {module.description}
                                  </p>

                                  {/* Progress Terminal Line */}
                                  <div className="mb-3">
                                    <div className="flex items-center space-x-2 text-xs font-mono">
                                      <span className="text-green-400">$</span>
                                      <span className="text-green-300/70">
                                        progress
                                      </span>
                                      <span className="text-green-400">
                                        --check
                                      </span>
                                      <span className="text-yellow-400">
                                        {module.progress}%
                                      </span>
                                    </div>
                                    <Progress
                                      value={module.progress}
                                      className="h-1 bg-black/50 border border-green-400/20 mt-1"
                                    />
                                  </div>

                                  {/* Stats in terminal format */}
                                  <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-mono">
                                    <div className="text-center">
                                      <span className="text-green-300/50">
                                        labs:
                                      </span>
                                      <span
                                        className={`ml-1 font-bold ${module.color}`}
                                      >
                                        {module.labs}
                                      </span>
                                    </div>
                                    <div className="text-center">
                                      <span className="text-green-300/50">
                                        games:
                                      </span>
                                      <span
                                        className={`ml-1 font-bold ${module.color}`}
                                      >
                                        {module.games}
                                      </span>
                                    </div>
                                    <div className="text-center">
                                      <span className="text-green-300/50">
                                        assets:
                                      </span>
                                      <span
                                        className={`ml-1 font-bold ${module.color}`}
                                      >
                                        {module.assets}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Duration and Topics */}
                                  <div className="flex items-center space-x-4 mb-3 text-xs">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3 text-green-300/70" />
                                      <span className="text-green-300/70">
                                        {module.duration}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex flex-wrap gap-1">
                                        {module.topics
                                          .slice(0, 2)
                                          .map((topic, topicIndex) => (
                                            <Badge
                                              key={topicIndex}
                                              variant="outline"
                                              className="text-xs px-1 py-0 border-green-400/30 text-green-400 font-mono"
                                            >
                                              #
                                              {topic
                                                .toLowerCase()
                                                .replace(/\s+/g, "_")}
                                            </Badge>
                                          ))}
                                        {module.topics.length > 2 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs px-1 py-0 border-green-400/30 text-green-400 font-mono"
                                          >
                                            +{module.topics.length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action buttons */}
                                  <div className="flex justify-between items-center pt-2 border-t border-green-400/20">
                                    {module.enrolled ? (
                                      <Button
                                        size="sm"
                                        className="bg-green-400 text-black hover:bg-green-300 font-mono text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(module.enrollPath);
                                        }}
                                      >
                                        {">>"} continue
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-green-400/50 text-green-400 font-mono text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(module.path);
                                        }}
                                      >
                                        {">>"} enroll
                                      </Button>
                                    )}

                                    <div className="text-xs font-mono text-green-300/50">
                                      {String(index + 1).padStart(2, "0")}/
                                      {String(phase.modules.length).padStart(
                                        2,
                                        "0"
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Terminal Footer */}
                    <div className="mt-4 pt-4 border-t border-green-400/30">
                      <div className="flex items-center justify-between text-xs font-mono text-green-300/70">
                        <span>
                          {phase.modules.filter((m) => m.enrolled).length}{" "}
                          enrolled,{" "}
                          {phase.modules.filter((m) => m.completed).length}{" "}
                          completed
                        </span>
                        <span>
                          total:{" "}
                          {phase.modules.reduce(
                            (sum, m) => sum + m.labs + m.games,
                            0
                          )}{" "}
                          activities
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase Completion CTA */}
                <div className="text-center pt-8">
                  <Card className="bg-black/50 border-green-400/30 max-w-2xl mx-auto">
                    <CardContent className="p-6">
                      <h3 className={`text-xl font-bold ${phase.color} mb-2`}>
                        Complete {phase.title}
                      </h3>
                      <p className="text-green-300/70 mb-4">
                        {phase.id === "beginner" &&
                          "Master the fundamentals to unlock intermediate courses"}
                        {phase.id === "intermediate" &&
                          "Build practical skills to access advanced specializations"}
                        {phase.id === "advanced" &&
                          "Become an expert in specialized cybersecurity domains"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button
                          className="bg-green-400 text-black hover:bg-green-300"
                          onClick={() => {
                            const firstIncomplete = phase.modules.find(
                              (m) => !m.enrolled
                            );
                            if (firstIncomplete) {
                              navigate(firstIncomplete.path);
                            }
                          }}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Start {phase.title}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-green-400/50 text-green-400"
                          onClick={() => navigate("/courses")}
                        >
                          View All Courses
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CyberSecOverview;
