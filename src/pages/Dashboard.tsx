import { Header } from "@/components/common/Header";
import {
  DashboardHeader,
  DashboardTabs,
  StatsGrid,
} from "@/components/dashboard";
import { Module, Phase } from "@/lib/types";
import {
  Activity,
  Brain,
  Clock,
  Cloud,
  Code,
  Eye,
  Lightbulb,
  Network,
  Shield,
  Smartphone,
  Target,
  Terminal,
  Trophy,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
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
          games: 2,
          assets: 14,
          enrolled: true,
          completed: false,
        },
      ],
    },
    {
      id: "intermediate",
      title: "Intermediate Phase",
      description: "Advanced security concepts and practical skills",
      icon: Target,
      color: "text-yellow-400",
      modules: [
        {
          id: "penetration-testing",
          title: "Penetration Testing Fundamentals",
          description: "Learn ethical hacking and penetration testing basics",
          icon: Target,
          duration: "4-5 weeks",
          difficulty: "Intermediate",
          progress: 0,
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
          topics: [
            "Reconnaissance",
            "Vulnerability Assessment",
            "Exploitation",
            "Post-Exploitation",
          ],
          path: "/course/penetration-testing",
          enrollPath: "/learn/penetration-testing",
          labs: 15,
          games: 8,
          assets: 25,
          enrolled: false,
          completed: false,
        },
        {
          id: "network-security",
          title: "Advanced Network Security",
          description: "Deep dive into network security and monitoring",
          icon: Wifi,
          duration: "4-5 weeks",
          difficulty: "Intermediate",
          progress: 0,
          color: "text-purple-400",
          bgColor: "bg-purple-400/10",
          borderColor: "border-purple-400/30",
          topics: [
            "Firewalls",
            "IDS/IPS",
            "Network Monitoring",
            "VPN Security",
          ],
          path: "/course/network-security",
          enrollPath: "/learn/network-security",
          labs: 12,
          games: 6,
          assets: 22,
          enrolled: false,
          completed: false,
        },
        {
          id: "web-app-security",
          title: "Web Application Security",
          description: "Advanced web security testing and defense",
          icon: Code,
          duration: "5-6 weeks",
          difficulty: "Intermediate",
          progress: 0,
          color: "text-cyan-400",
          bgColor: "bg-cyan-400/10",
          borderColor: "border-cyan-400/30",
          topics: ["OWASP Top 10", "SQL Injection", "XSS", "Authentication"],
          path: "/course/web-app-security",
          enrollPath: "/learn/web-app-security",
          labs: 18,
          games: 10,
          assets: 30,
          enrolled: false,
          completed: false,
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Phase",
      description: "Expert-level security specializations",
      icon: Brain,
      color: "text-red-400",
      modules: [
        {
          id: "malware-analysis",
          title: "Malware Analysis & Reverse Engineering",
          description: "Advanced malware analysis and reverse engineering",
          icon: Brain,
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
          labs: 20,
          games: 12,
          assets: 35,
          enrolled: false,
          completed: false,
        },
        {
          id: "cloud-security",
          title: "Cloud Security Architecture",
          description: "Securing cloud environments and services",
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
          path: "/course/cloud-security",
          enrollPath: "/learn/cloud-security",
          labs: 16,
          games: 8,
          assets: 28,
          enrolled: false,
          completed: false,
        },
        {
          id: "mobile-security",
          title: "Mobile Application Security",
          description: "iOS and Android security testing",
          icon: Smartphone,
          duration: "4-5 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
          topics: [
            "iOS Security",
            "Android Security",
            "Mobile OWASP",
            "App Store Security",
          ],
          path: "/course/mobile-security",
          enrollPath: "/learn/mobile-security",
          labs: 14,
          games: 7,
          assets: 24,
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
      navigate(module.enrollPath, {
        state: {
          from: "dashboard",
        },
      });
    } else {
      navigate(module.path, {
        state: {
          from: "dashboard",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header navigate={navigate} />

      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        <DashboardHeader />

        <StatsGrid stats={stats} />

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          phases={phases}
          expandedPhases={expandedPhases}
          onTogglePhase={togglePhase}
          onModuleClick={handleModuleClick}
          getAllModules={getAllModules}
          getEnrolledModules={getEnrolledModules}
          getCompletedModules={getCompletedModules}
          achievements={achievements}
        />
      </div>
    </div>
  );
};

export default Dashboard;
