import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  Code,
  Eye,
  GraduationCap,
  Lightbulb,
  Lock,
  Network,
  Play,
  Plus,
  Shield,
  Smartphone,
  Target,
  Terminal,
  Trophy,
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["beginner"]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

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

  const getAllModules = () => phases.flatMap((phase) => phase.modules);
  const getEnrolledModules = () =>
    getAllModules().filter((module) => module.enrolled);
  const getCompletedModules = () =>
    getAllModules().filter((module) => module.completed);

  const stats = [
    {
      label: "Modules Completed",
      value: getCompletedModules().length.toString(),
      icon: Target,
      color: "text-green-400",
    },
    {
      label: "Hours Practiced",
      value: "89",
      icon: Clock,
      color: "text-blue-400",
    },
    {
      label: "Rank",
      value: "#342",
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      label: "Current Streak",
      value: "12 days",
      icon: Zap,
      color: "text-purple-400",
    },
  ];

  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first module",
      earned: true,
      icon: Lightbulb,
    },
    {
      title: "Terminal Master",
      description: "Complete all Linux fundamental modules",
      earned: true,
      icon: Terminal,
    },
    {
      title: "Web Warrior",
      description: "Find 10 web vulnerabilities",
      earned: false,
      icon: Shield,
    },
    {
      title: "Network Ninja",
      description: "Complete advanced network modules",
      earned: false,
      icon: Network,
    },
    {
      title: "Penetration Pro",
      description: "Complete advanced penetration testing",
      earned: false,
      icon: Activity,
    },
    {
      title: "Forensics Expert",
      description: "Master digital forensics techniques",
      earned: false,
      icon: Eye,
    },
  ];

  const handleModuleClick = (module: Module) => {
    if (module.enrolled) {
      navigate(module.enrollPath);
    } else {
      navigate(module.path);
    }
  };

  const renderModuleTreeItem = (
    module: Module,
    phaseIndex: number,
    moduleIndex: number,
    isLast: boolean
  ) => {
    const treeChar = isLast ? "└──" : "├──";
    const isCompleted = module.completed;

    return (
      <div key={module.id} className="relative">
        <div className="flex items-start space-x-1 mb-3">
          <div className="flex flex-col items-center">
            <span className="text-green-400/70 text-sm leading-none font-mono">
              {treeChar}
            </span>
            {!isLast && <div className="w-px h-16 bg-green-400/30 mt-1"></div>}
          </div>

          <Card
            className={`
              flex-1 ${module.bgColor} ${module.borderColor} border-2
              hover:scale-[1.01] cursor-pointer transition-all duration-300
              relative ml-2 hover:shadow-lg hover:shadow-green-400/20
            `}
            onClick={() => handleModuleClick(module)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
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

                  <div className="font-mono">
                    <span className="text-green-400/70">📁</span>
                    <span
                      className={`${module.color} text-sm ml-1 font-semibold`}
                    >
                      {module.title.toLowerCase().replace(/\s+/g, "_")}
                    </span>
                  </div>
                </div>

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
                      ✓ COMPLETED
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-green-300/80 text-sm mb-3 font-sans">
                {module.description}
              </p>

              {module.enrolled && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-green-400 font-mono">
                      progress: {module.progress}%
                    </span>
                    <span className="text-xs text-green-300/70">
                      {module.duration}
                    </span>
                  </div>
                  <Progress
                    value={module.progress}
                    className="h-1 bg-black/50 border border-green-400/20"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-mono">
                <div className="text-center">
                  <div className="text-green-300/50">labs</div>
                  <div className={`font-bold ${module.color}`}>
                    {module.labs}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-green-300/50">games</div>
                  <div className={`font-bold ${module.color}`}>
                    {module.games}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-green-300/50">assets</div>
                  <div className={`font-bold ${module.color}`}>
                    {module.assets}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {module.topics.slice(0, 2).map((topic, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs px-1 py-0 border-green-400/30 text-green-400 font-mono"
                    >
                      #{topic.toLowerCase().replace(/\s+/g, "_")}
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
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    module.difficulty === "Beginner"
                      ? "border-green-400/50 text-green-400"
                      : module.difficulty === "Intermediate"
                      ? "border-yellow-400/50 text-yellow-400"
                      : "border-red-400/50 text-red-400"
                  }`}
                >
                  {module.difficulty.toUpperCase()}
                </Badge>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-green-400/20 mt-3">
                {module.enrolled ? (
                  <Button
                    size="sm"
                    className="bg-green-400 text-black hover:bg-green-300 font-mono text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(module.path);
                    }}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    {">> "}continue
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
                    <Plus className="w-3 h-3 mr-1" />
                    {">> "}enroll
                  </Button>
                )}

                <div className="text-xs font-mono text-green-300/50">
                  {String(moduleIndex + 1).padStart(2, "0")}/
                  {String(phases[phaseIndex].modules.length).padStart(2, "0")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderPhaseTree = (phase: Phase, phaseIndex: number) => {
    const isExpanded = expandedPhases.includes(phase.id);
    const PhaseIcon = phase.icon;
    const enrolledCount = phase.modules.filter((m) => m.enrolled).length;
    const completedCount = phase.modules.filter((m) => m.completed).length;
    const avgProgress =
      phase.modules.reduce((sum, m) => sum + m.progress, 0) /
      phase.modules.length;

    return (
      <div key={phase.id} className="mb-6">
        <Card className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all">
          <CardContent className="p-0">
            <Collapsible>
              <CollapsibleTrigger
                onClick={() => togglePhase(phase.id)}
                className="w-full p-4 text-left hover:bg-green-400/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-green-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-green-400" />
                      )}
                      <PhaseIcon className={`w-6 h-6 ${phase.color}`} />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${phase.color} font-mono`}
                      >
                        ./{phase.id}_phase/
                      </h3>
                      <p className="text-green-300/70 text-sm">
                        {phase.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-green-300/50 text-xs font-mono">
                          {phase.modules.length} modules
                        </span>
                        <span className="text-green-300/50 text-xs font-mono">
                          {enrolledCount} enrolled
                        </span>
                        <span className="text-green-300/50 text-xs font-mono">
                          {completedCount} completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`font-semibold ${phase.color}`}>
                        {Math.round(avgProgress)}%
                      </div>
                      <Progress value={avgProgress} className="w-20 h-2" />
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={`${
                  isExpanded ? "animate-in slide-in-from-top-2" : ""
                }`}
              >
                <div className="border-t border-green-400/20 p-4 bg-black/60 font-mono">
                  <div className="mb-4 text-xs text-green-400">
                    <Terminal className="w-4 h-4 inline mr-2" />
                    ~/{phase.id}_phase$ ls -la
                  </div>
                  <div className="space-y-0">
                    {phase.modules.map((module, moduleIndex) =>
                      renderModuleTreeItem(
                        module,
                        phaseIndex,
                        moduleIndex,
                        moduleIndex === phase.modules.length - 1
                      )
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-400/30 text-xs font-mono text-green-300/70">
                    <div className="flex items-center justify-between">
                      <span>
                        total activities:{" "}
                        {phase.modules.reduce(
                          (sum, m) => sum + m.labs + m.games,
                          0
                        )}
                      </span>
                      <span>
                        completion rate:{" "}
                        {Math.round(
                          (completedCount / phase.modules.length) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header navigate={navigate} />

      <div className="max-w-7xl mx-auto py-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold neon-glow font-mono">
              {">> "}command_center.exe
            </h1>
            <p className="text-green-300/70 font-mono">
              [STATUS] Welcome back, Agent. Ready for your next mission?
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300/70 text-xs font-mono uppercase">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-green-400 font-mono">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-black/50 border border-green-400/30">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
            >
              {">> "}course_tree
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
            >
              {">> "}my_progress
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono"
            >
              {">> "}achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Terminal className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-mono text-sm">
                  ~/cybersecurity_mastery_path$ tree -L 3
                </span>
              </div>

              <div className="space-y-0">
                {phases.map((phase, phaseIndex) =>
                  renderPhaseTree(phase, phaseIndex)
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-green-400/30 text-center">
                <div className="flex items-center justify-center space-x-2 text-green-400 font-mono text-sm">
                  <span>{getAllModules().length} total modules</span>
                  <span>•</span>
                  <span>{getEnrolledModules().length} enrolled</span>
                  <span>•</span>
                  <span>{getCompletedModules().length} completed</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Terminal className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-mono text-sm">
                  ~/enrolled_courses$ ls -la --progress
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getEnrolledModules().map((module) => (
                  <Card
                    key={module.id}
                    className={`${module.bgColor} ${module.borderColor} border-2 hover:scale-[1.02] transition-all cursor-pointer`}
                    onClick={() => navigate(module.enrollPath)}
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
                            <span className={module.color}>
                              {module.progress}%
                            </span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                        <div className="text-sm text-green-300/70 font-mono">
                          difficulty: {module.difficulty.toLowerCase()} |
                          duration: {module.duration}
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-green-400 text-black hover:bg-green-300 font-mono"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(module.enrollPath);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {">> "}continue_learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {getEnrolledModules().length === 0 && (
                <div className="text-center py-12">
                  <Terminal className="w-12 h-12 text-green-400/50 mx-auto mb-4" />
                  <p className="text-green-300/70 font-mono">
                    $ ls: no enrolled modules found
                  </p>
                  <p className="text-green-300/50 text-sm font-mono mt-2">
                    hint: try enrolling in some modules from the course tree
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Terminal className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-mono text-sm">
                  ~/achievements$ cat badges.log
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className={`bg-black/50 border transition-all ${
                      achievement.earned
                        ? "border-green-400/50 bg-green-400/5"
                        : "border-gray-600/30"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            achievement.earned
                              ? "bg-green-400/20 text-green-400"
                              : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          <achievement.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3
                            className={`font-semibold font-mono ${
                              achievement.earned
                                ? "text-green-400"
                                : "text-gray-400"
                            }`}
                          >
                            {achievement.title
                              .toLowerCase()
                              .replace(/\s+/g, "_")}
                          </h3>
                          <p
                            className={`text-sm ${
                              achievement.earned
                                ? "text-green-300/70"
                                : "text-gray-500"
                            }`}
                          >
                            {achievement.description}
                          </p>
                          {achievement.earned && (
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs text-green-400 border-green-400/50"
                            >
                              UNLOCKED
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
