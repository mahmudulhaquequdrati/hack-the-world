import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Database,
  Eye,
  Filter,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Lock,
  Network,
  Play,
  Search,
  Settings,
  Shield,
  Star,
  Target,
  Terminal,
  UserCheck,
  Users,
  Wifi,
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

interface CourseSection {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  lessons: number;
  rating: number;
  students: number;
  price: string;
  icon: LucideIcon;
  color: string;
  image: string;
  skills: string[];
  prerequisites: string;
  certification: boolean;
  phase: "starting" | "intermediate" | "advanced";
  labs: Lab[];
  enrolled: boolean;
  progress: number;
}

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const courseSections: CourseSection[] = [
    {
      id: "linux-fundamentals",
      title: "Linux Fundamentals",
      description:
        "Master command-line operations and system administration with hands-on practice",
      category: "System Administration",
      difficulty: "Beginner",
      duration: "8 hours",
      lessons: 15,
      rating: 4.8,
      students: 15420,
      price: "Free",
      icon: Terminal,
      color: "text-green-400",
      image:
        "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
      skills: [
        "Command Line",
        "File Systems",
        "Process Management",
        "Shell Scripting",
      ],
      prerequisites: "None",
      certification: true,
      phase: "starting",
      enrolled: true,
      progress: 75,
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
      description:
        "Learn to find and exploit web vulnerabilities using industry-standard tools",
      category: "Web Security",
      difficulty: "Intermediate",
      duration: "12 hours",
      lessons: 24,
      rating: 4.9,
      students: 12850,
      price: "$49",
      icon: Shield,
      color: "text-blue-400",
      image:
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
      skills: ["SQL Injection", "XSS", "CSRF", "Authentication Bypass"],
      prerequisites: "Basic web development knowledge",
      certification: true,
      phase: "intermediate",
      enrolled: true,
      progress: 45,
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
      id: "network-security",
      title: "Network Security",
      description:
        "Network protocols, scanning, and penetration testing fundamentals",
      category: "Network Security",
      difficulty: "Intermediate",
      duration: "10 hours",
      lessons: 21,
      rating: 4.8,
      students: 11200,
      price: "$59",
      icon: Network,
      color: "text-cyan-400",
      image:
        "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
      skills: [
        "Network Scanning",
        "Wireshark",
        "Firewall Bypass",
        "VPN Security",
      ],
      prerequisites: "Basic networking knowledge",
      certification: true,
      phase: "intermediate",
      enrolled: true,
      progress: 30,
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
    {
      id: "malware-analysis",
      title: "Malware Analysis",
      description: "Reverse engineering and analyzing malicious software",
      category: "Malware",
      difficulty: "Advanced",
      duration: "15 hours",
      lessons: 30,
      rating: 4.9,
      students: 6420,
      price: "$99",
      icon: Code,
      color: "text-orange-400",
      image:
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
      skills: [
        "Static Analysis",
        "Dynamic Analysis",
        "Reverse Engineering",
        "Sandbox Evasion",
      ],
      prerequisites: "Programming experience required",
      certification: true,
      phase: "advanced",
      enrolled: false,
      progress: 0,
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
        {
          id: "reverse-engineering",
          title: "Reverse Engineering Workshop",
          description: "Disassemble and understand malware code",
          difficulty: "Expert",
          duration: "150 min",
          completed: false,
          icon: Settings,
          color: "text-purple-600",
        },
      ],
    },
    {
      id: "social-engineering",
      title: "Social Engineering",
      description:
        "Psychological manipulation techniques and defense strategies",
      category: "Human Security",
      difficulty: "Advanced",
      duration: "8 hours",
      lessons: 18,
      rating: 4.7,
      students: 8930,
      price: "$79",
      icon: Users,
      color: "text-red-400",
      image:
        "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800",
      skills: ["Phishing", "Pretexting", "Baiting", "Psychological Profiling"],
      prerequisites: "Basic cybersecurity knowledge",
      certification: true,
      phase: "intermediate",
      enrolled: false,
      progress: 0,
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
        {
          id: "pretexting-lab",
          title: "Pretexting Scenarios",
          description: "Practice social manipulation techniques",
          difficulty: "Advanced",
          duration: "95 min",
          completed: false,
          icon: Target,
          color: "text-yellow-400",
        },
      ],
    },
    {
      id: "osint-techniques",
      title: "OSINT Techniques",
      description: "Open source intelligence gathering and analysis methods",
      category: "Intelligence",
      difficulty: "Intermediate",
      duration: "6 hours",
      lessons: 15,
      rating: 4.6,
      students: 9750,
      price: "$39",
      icon: Eye,
      color: "text-purple-400",
      image:
        "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800",
      skills: [
        "Information Gathering",
        "Social Media Analysis",
        "Domain Research",
        "People Search",
      ],
      prerequisites: "Basic internet research skills",
      certification: true,
      phase: "starting",
      enrolled: false,
      progress: 0,
      labs: [
        {
          id: "domain-research",
          title: "Domain Intelligence Gathering",
          description: "Collect information about target domains",
          difficulty: "Beginner",
          duration: "60 min",
          completed: false,
          icon: Database,
          color: "text-green-400",
        },
        {
          id: "social-media-osint",
          title: "Social Media Intelligence",
          description: "Extract information from social platforms",
          difficulty: "Intermediate",
          duration: "75 min",
          completed: false,
          icon: Users,
          color: "text-blue-400",
        },
      ],
    },
  ];

  const categories = [
    "all",
    "System Administration",
    "Web Security",
    "Human Security",
    "Intelligence",
    "Network Security",
    "Malware",
  ];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];
  const phases = ["all", "starting", "intermediate", "advanced"];

  const filteredSections = courseSections.filter((section) => {
    const matchesSearch =
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesDifficulty =
      selectedDifficulty === "all" || section.difficulty === selectedDifficulty;
    const matchesCategory =
      selectedCategory === "all" || section.category === selectedCategory;
    const matchesPhase =
      selectedPhase === "all" || section.phase === selectedPhase;

    return (
      matchesSearch && matchesDifficulty && matchesCategory && matchesPhase
    );
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400 border-green-400";
      case "Intermediate":
        return "text-yellow-400 border-yellow-400";
      case "Advanced":
        return "text-red-400 border-red-400";
      default:
        return "text-blue-400 border-blue-400";
    }
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

  const handleEnroll = (sectionId: string) => {
    // In a real app, this would make an API call
    console.log(`Enrolling in section: ${sectionId}`);
    navigate(`/course/${sectionId}`);
  };

  const handleContinue = (sectionId: string) => {
    navigate(`/learn/${sectionId}`);
  };

  const handleLabClick = (sectionId: string, labId: string) => {
    navigate(`/lab/${sectionId}/${labId}`);
  };

  const renderLabItem = (lab: Lab, sectionId: string) => (
    <div
      key={lab.id}
      className="ml-6 p-3 border-l border-green-400/20 hover:border-green-400 transition-all cursor-pointer group"
      onClick={() => handleLabClick(sectionId, lab.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <lab.icon className={`w-4 h-4 ${lab.color}`} />
          <div>
            <p className="text-green-400 text-sm font-medium group-hover:text-green-300">
              {lab.title}
            </p>
            <p className="text-green-300/60 text-xs">{lab.description}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {lab.difficulty}
              </Badge>
              <span className="text-green-300/50 text-xs">{lab.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {lab.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
          <Play className="w-3 h-3 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );

  const renderGridCard = (section: CourseSection) => {
    const isExpanded = expandedSections.includes(section.id);
    const PhaseIcon = getPhaseIcon(section.phase);

    return (
      <Card
        key={section.id}
        className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all overflow-hidden"
      >
        <div className="relative">
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-48 object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge
              className={`${getDifficultyColor(
                section.difficulty
              )} bg-black/50`}
            >
              {section.difficulty}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <PhaseIcon className={`w-5 h-5 ${getPhaseColor(section.phase)}`} />
            <Badge variant="outline" className="capitalize">
              {section.phase}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <section.icon className={`w-8 h-8 ${section.color}`} />
              <div>
                <CardTitle className="text-green-400">
                  {section.title}
                </CardTitle>
                <p className="text-green-300/70 text-sm">
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-green-300/70" />
                <span className="text-green-300/70">{section.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4 text-green-300/70" />
                <span className="text-green-300/70">
                  {section.lessons} lessons
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FlaskConical className="w-4 h-4 text-green-300/70" />
                <span className="text-green-300/70">
                  {section.labs.length} labs
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-green-300/70">{section.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {section.skills.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs border-green-400/30 text-green-400"
              >
                {skill}
              </Badge>
            ))}
            {section.skills.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs border-green-400/30 text-green-400"
              >
                +{section.skills.length - 3} more
              </Badge>
            )}
          </div>

          {section.enrolled && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-300/70">Progress</span>
                <span className="text-green-400">{section.progress}%</span>
              </div>
              <Progress value={section.progress} className="h-2" />
            </div>
          )}

          <Collapsible>
            <CollapsibleTrigger
              onClick={() => toggleSection(section.id)}
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full border-green-400/50 text-green-400 justify-between"
              >
                <span>View Labs ({section.labs.length})</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-1 border border-green-400/20 rounded-lg p-2">
                {section.labs.map((lab) => renderLabItem(lab, section.id))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-400">
              {section.price}
            </div>
            {section.enrolled ? (
              <Button
                onClick={() => handleContinue(section.id)}
                className="bg-green-400 text-black hover:bg-green-300"
              >
                <Play className="w-4 h-4 mr-2" />
                Continue
              </Button>
            ) : (
              <Button
                onClick={() => handleEnroll(section.id)}
                variant="outline"
                className="border-green-400/50 text-green-400"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Enroll
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header navigate={navigate} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold neon-glow">
              Cybersecurity Courses
            </h1>
            <p className="text-green-300/70">
              Master cybersecurity through structured learning paths with
              hands-on labs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="bg-green-400 text-black border-green-400"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="border-green-400/50 text-green-400"
            >
              List
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-black/50 border-green-400/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                <Input
                  placeholder="Search courses, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/50 border-green-400/50 text-green-400"
                />
              </div>

              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="border-green-400/50">
                  <SelectValue placeholder="Learning Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {phases.slice(1).map((phase) => (
                    <SelectItem
                      key={phase}
                      value={phase}
                      className="capitalize"
                    >
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className="border-green-400/50">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {difficulties.slice(1).map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="border-green-400/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("all");
                  setSelectedCategory("all");
                  setSelectedPhase("all");
                }}
                variant="outline"
                className="border-green-400/50 text-green-400"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/50 border-green-400/30">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {courseSections.length}
              </div>
              <div className="text-green-300/70 text-sm">Total Courses</div>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-green-400/30">
            <CardContent className="p-4 text-center">
              <FlaskConical className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">
                {courseSections.reduce(
                  (total, section) => total + section.labs.length,
                  0
                )}
              </div>
              <div className="text-green-300/70 text-sm">Hands-on Labs</div>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-green-400/30">
            <CardContent className="p-4 text-center">
              <UserCheck className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">
                {courseSections.filter((s) => s.enrolled).length}
              </div>
              <div className="text-green-300/70 text-sm">Enrolled</div>
            </CardContent>
          </Card>
          <Card className="bg-black/50 border-green-400/30">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                {courseSections.filter((s) => s.certification).length}
              </div>
              <div className="text-green-300/70 text-sm">Certifications</div>
            </CardContent>
          </Card>
        </div>

        {/* Course Sections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-green-400">
              Available Courses ({filteredSections.length})
            </h2>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSections.map(renderGridCard)}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSections.map((section) => (
                <Card
                  key={section.id}
                  className="bg-black/50 border-green-400/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <section.icon
                          className={`w-12 h-12 ${section.color}`}
                        />
                        <div>
                          <h3 className="text-green-400 font-semibold text-lg">
                            {section.title}
                          </h3>
                          <p className="text-green-300/70">
                            {section.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge
                              className={getDifficultyColor(section.difficulty)}
                            >
                              {section.difficulty}
                            </Badge>
                            <span className="text-green-300/70 text-sm">
                              {section.duration}
                            </span>
                            <span className="text-green-300/70 text-sm">
                              {section.labs.length} labs
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-green-300/70 text-sm">
                                {section.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            {section.price}
                          </div>
                          {section.enrolled && (
                            <div className="text-sm text-green-300/70">
                              {section.progress}% complete
                            </div>
                          )}
                        </div>
                        {section.enrolled ? (
                          <Button
                            onClick={() => handleContinue(section.id)}
                            className="bg-green-400 text-black hover:bg-green-300"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEnroll(section.id)}
                            variant="outline"
                            className="border-green-400/50 text-green-400"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Enroll
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
