import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Database,
  Eye,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Lock,
  Network,
  Play,
  Plus,
  Settings,
  Shield,
  Target,
  Terminal,
  Trophy,
  UserPlus,
  Users,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  completed: boolean;
  icon: LucideIcon;
  color: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  progress: number;
  labs: Lab[];
  enrolled: boolean;
  phase: "starting" | "intermediate" | "advanced";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState("");

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections: Section[] = [
    {
      id: "linux-fundamentals",
      title: "Linux Fundamentals",
      description: "Master command-line operations and system administration",
      progress: 75,
      phase: "starting",
      enrolled: true,
      labs: [
        {
          id: "basic-commands",
          title: "Basic Linux Commands",
          description: "Learn essential command-line operations",
          difficulty: "Beginner",
          duration: "45 min",
          completed: true,
          icon: Terminal,
          color: "text-green-400",
        },
        {
          id: "file-system",
          title: "File System Navigation",
          description: "Master directory structures and file permissions",
          difficulty: "Beginner",
          duration: "60 min",
          completed: true,
          icon: Database,
          color: "text-blue-400",
        },
        {
          id: "process-management",
          title: "Process Management",
          description: "Control and monitor system processes",
          difficulty: "Beginner",
          duration: "50 min",
          completed: false,
          icon: Settings,
          color: "text-yellow-400",
        },
        {
          id: "shell-scripting",
          title: "Shell Scripting Basics",
          description: "Automate tasks with bash scripts",
          difficulty: "Intermediate",
          duration: "90 min",
          completed: false,
          icon: Code,
          color: "text-purple-400",
        },
      ],
    },
    {
      id: "web-security",
      title: "Web Application Security",
      description: "Learn to find and exploit web vulnerabilities",
      progress: 45,
      phase: "intermediate",
      enrolled: true,
      labs: [
        {
          id: "sql-injection",
          title: "SQL Injection Lab",
          description: "Practice SQL injection techniques",
          difficulty: "Intermediate",
          duration: "75 min",
          completed: true,
          icon: Database,
          color: "text-red-400",
        },
        {
          id: "xss-lab",
          title: "Cross-Site Scripting",
          description: "Exploit XSS vulnerabilities",
          difficulty: "Intermediate",
          duration: "60 min",
          completed: false,
          icon: Code,
          color: "text-orange-400",
        },
        {
          id: "csrf-lab",
          title: "CSRF Protection",
          description: "Understand Cross-Site Request Forgery",
          difficulty: "Intermediate",
          duration: "55 min",
          completed: false,
          icon: Shield,
          color: "text-blue-400",
        },
        {
          id: "auth-bypass",
          title: "Authentication Bypass",
          description: "Break authentication mechanisms",
          difficulty: "Advanced",
          duration: "85 min",
          completed: false,
          icon: Lock,
          color: "text-red-600",
        },
      ],
    },
    {
      id: "advanced-penetration",
      title: "Advanced Penetration Testing",
      description: "Master advanced exploitation techniques",
      progress: 0,
      phase: "advanced",
      enrolled: false,
      labs: [
        {
          id: "buffer-overflow",
          title: "Buffer Overflow Exploitation",
          description: "Advanced memory corruption techniques",
          difficulty: "Advanced",
          duration: "120 min",
          completed: false,
          icon: Code,
          color: "text-red-600",
        },
        {
          id: "privilege-escalation",
          title: "Privilege Escalation",
          description: "Gain higher system privileges",
          difficulty: "Advanced",
          duration: "90 min",
          completed: false,
          icon: Target,
          color: "text-yellow-600",
        },
        {
          id: "post-exploitation",
          title: "Post-Exploitation Techniques",
          description: "Maintain access and pivot through networks",
          difficulty: "Expert",
          duration: "150 min",
          completed: false,
          icon: Network,
          color: "text-purple-600",
        },
      ],
    },
    {
      id: "network-security",
      title: "Network Security",
      description: "Network protocols and penetration testing",
      progress: 30,
      phase: "intermediate",
      enrolled: true,
      labs: [
        {
          id: "network-scanning",
          title: "Network Scanning Lab",
          description: "Discover and enumerate network services",
          difficulty: "Intermediate",
          duration: "70 min",
          completed: true,
          icon: Network,
          color: "text-cyan-400",
        },
        {
          id: "wireshark-analysis",
          title: "Wireshark Analysis",
          description: "Analyze network traffic patterns",
          difficulty: "Intermediate",
          duration: "80 min",
          completed: false,
          icon: Eye,
          color: "text-blue-400",
        },
        {
          id: "mitm-attacks",
          title: "Man-in-the-Middle Attacks",
          description: "Intercept and manipulate network traffic",
          difficulty: "Advanced",
          duration: "95 min",
          completed: false,
          icon: Wifi,
          color: "text-red-400",
        },
      ],
    },
  ];

  const availableSections: Section[] = [
    {
      id: "malware-analysis",
      title: "Malware Analysis",
      description: "Reverse engineering and analyzing malicious software",
      progress: 0,
      phase: "advanced",
      enrolled: false,
      labs: [
        {
          id: "static-analysis",
          title: "Static Analysis Techniques",
          description: "Analyze malware without execution",
          difficulty: "Advanced",
          duration: "100 min",
          completed: false,
          icon: Code,
          color: "text-orange-600",
        },
        {
          id: "dynamic-analysis",
          title: "Dynamic Analysis Lab",
          description: "Study malware behavior during execution",
          difficulty: "Advanced",
          duration: "110 min",
          completed: false,
          icon: FlaskConical,
          color: "text-red-600",
        },
      ],
    },
    {
      id: "social-engineering",
      title: "Social Engineering",
      description: "Psychological manipulation and defense techniques",
      progress: 0,
      phase: "intermediate",
      enrolled: false,
      labs: [
        {
          id: "phishing-campaigns",
          title: "Phishing Campaign Design",
          description: "Create and execute phishing simulations",
          difficulty: "Intermediate",
          duration: "85 min",
          completed: false,
          icon: Users,
          color: "text-red-400",
        },
        {
          id: "osint-gathering",
          title: "OSINT Information Gathering",
          description: "Collect intelligence from open sources",
          difficulty: "Intermediate",
          duration: "75 min",
          completed: false,
          icon: Eye,
          color: "text-purple-400",
        },
      ],
    },
  ];

  const stats = [
    {
      label: "Labs Completed",
      value: "12",
      icon: Target,
      color: "text-green-400",
    },
    {
      label: "Hours Practiced",
      value: "89",
      icon: Clock,
      color: "text-blue-400",
    },
    { label: "Rank", value: "#342", icon: Trophy, color: "text-yellow-400" },
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
      description: "Complete your first lab",
      earned: true,
      icon: Lightbulb,
    },
    {
      title: "Terminal Master",
      description: "Complete all Linux fundamental labs",
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
      description: "Complete advanced network labs",
      earned: false,
      icon: Network,
    },
  ];

  const handleLabClick = (sectionId: string, labId: string) => {
    navigate(`/lab/${sectionId}/${labId}`);
  };

  const handleEnrollSection = (sectionId: string) => {
    // In a real app, this would make an API call
    console.log(`Enrolling in section: ${sectionId}`);
    setShowEnrollDialog(false);
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "starting":
        return Lightbulb;
      case "intermediate":
        return Brain;
      case "advanced":
        return GraduationCap;
      default:
        return BookOpen;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "starting":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  const renderLabTreeItem = (lab: Lab, sectionId: string) => (
    <div
      key={lab.id}
      className="ml-6 p-3 border-l border-green-400/30 hover:border-green-400 transition-all cursor-pointer group"
      onClick={() => handleLabClick(sectionId, lab.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <lab.icon className={`w-5 h-5 ${lab.color}`} />
          <div>
            <p className="text-green-400 font-medium group-hover:text-green-300">
              {lab.title}
            </p>
            <p className="text-green-300/70 text-sm">{lab.description}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {lab.difficulty}
              </Badge>
              <span className="text-green-300/50 text-xs">{lab.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {lab.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
          <Play className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );

  const renderSectionTree = (section: Section) => {
    const isExpanded = expandedSections.includes(section.id);
    const PhaseIcon = getPhaseIcon(section.phase);

    return (
      <Card
        key={section.id}
        className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all"
      >
        <CardContent className="p-0">
          <Collapsible>
            <CollapsibleTrigger
              onClick={() => toggleSection(section.id)}
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
                    <PhaseIcon
                      className={`w-5 h-5 ${getPhaseColor(section.phase)}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-green-400 font-semibold">
                      {section.title}
                    </h3>
                    <p className="text-green-300/70 text-sm">
                      {section.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline" className="capitalize">
                        {section.phase}
                      </Badge>
                      <span className="text-green-300/50 text-sm">
                        {section.labs.length} labs
                      </span>
                      <span className="text-green-300/50 text-sm">
                        {section.labs.filter((lab) => lab.completed).length}{" "}
                        completed
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {section.enrolled && (
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">
                        {section.progress}%
                      </div>
                      <Progress value={section.progress} className="w-20 h-2" />
                    </div>
                  )}
                  {!section.enrolled && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-400/50 text-green-400"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Enroll
                    </Button>
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={`${
                isExpanded ? "animate-in slide-in-from-top-2" : ""
              }`}
            >
              <div className="border-t border-green-400/20">
                {section.labs.map((lab) => renderLabTreeItem(lab, section.id))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header navigate={navigate} />

      <div className="max-w-7xl mx-auto py-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold neon-glow">Command Center</h1>
            <p className="text-green-300/70">
              Welcome back, Agent. Ready for your next mission?
            </p>
          </div>
          <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-400 text-black hover:bg-green-300">
                <UserPlus className="w-4 h-4 mr-2" />
                Enroll New Section
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-green-400/50">
              <DialogHeader>
                <DialogTitle className="text-green-400">
                  Enroll in New Section
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                  <SelectTrigger className="border-green-400/50">
                    <SelectValue placeholder="Select learning phase" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-400/50">
                    <SelectItem value="starting">Starting Phase</SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate Phase
                    </SelectItem>
                    <SelectItem value="advanced">Advanced Phase</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableSections
                    .filter(
                      (section) =>
                        !selectedPhase || section.phase === selectedPhase
                    )
                    .map((section) => (
                      <Card
                        key={section.id}
                        className="bg-black/50 border-green-400/30 hover:border-green-400 cursor-pointer transition-all"
                        onClick={() => handleEnrollSection(section.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-green-400 font-medium">
                                {section.title}
                              </h4>
                              <p className="text-green-300/70 text-sm">
                                {section.description}
                              </p>
                              <Badge
                                variant="outline"
                                className="mt-1 capitalize"
                              >
                                {section.phase}
                              </Badge>
                            </div>
                            <Plus className="w-5 h-5 text-green-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                    <p className="text-green-300/70 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-green-400">
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
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              Course Overview
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              My Progress
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-6">
              {/* Starting Phase */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-bold text-green-400">
                    Starting Phase
                  </h2>
                  <Badge variant="outline" className="text-green-400">
                    {sections.filter((s) => s.phase === "starting").length}{" "}
                    sections
                  </Badge>
                </div>
                <div className="space-y-4">
                  {sections
                    .filter((section) => section.phase === "starting")
                    .map(renderSectionTree)}
                </div>
              </div>

              {/* Intermediate Phase */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold text-yellow-400">
                    Intermediate Phase
                  </h2>
                  <Badge variant="outline" className="text-yellow-400">
                    {sections.filter((s) => s.phase === "intermediate").length}{" "}
                    sections
                  </Badge>
                </div>
                <div className="space-y-4">
                  {sections
                    .filter((section) => section.phase === "intermediate")
                    .map(renderSectionTree)}
                </div>
              </div>

              {/* Advanced Phase */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <GraduationCap className="w-6 h-6 text-red-400" />
                  <h2 className="text-xl font-bold text-red-400">
                    Advanced Phase
                  </h2>
                  <Badge variant="outline" className="text-red-400">
                    {sections.filter((s) => s.phase === "advanced").length}{" "}
                    sections
                  </Badge>
                </div>
                <div className="space-y-4">
                  {sections
                    .filter((section) => section.phase === "advanced")
                    .map(renderSectionTree)}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sections
                .filter((section) => section.enrolled)
                .map((section) => (
                  <Card
                    key={section.id}
                    className="bg-black/50 border-green-400/30"
                  >
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center justify-between">
                        {section.title}
                        <Badge variant="outline" className="capitalize">
                          {section.phase}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-green-300/70">Progress</span>
                            <span className="text-green-400">
                              {section.progress}%
                            </span>
                          </div>
                          <Progress value={section.progress} className="h-3" />
                        </div>
                        <div className="text-sm text-green-300/70">
                          {section.labs.filter((lab) => lab.completed).length}{" "}
                          of {section.labs.length} labs completed
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/course/${section.id}`)}
                          className="w-full border-green-400/50 text-green-400"
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
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
                          className={`font-semibold ${
                            achievement.earned
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {achievement.title}
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
