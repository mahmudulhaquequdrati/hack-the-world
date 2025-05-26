import { Header } from "@/components/common/header";
import {
  ModuleTree,
  OverviewHeader,
  PhaseCard,
  PhaseCompletionCTA,
  PhaseNavigation,
} from "@/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { COMPLETED_MODULES } from "@/lib/constants";
import { Phase } from "@/lib/types";
import {
  Brain,
  Cloud,
  Code,
  Database,
  Eye,
  GraduationCap,
  Lightbulb,
  Network,
  Shield,
  Terminal,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CyberSecOverview = () => {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState("beginner");
  const completedModules = [...COMPLETED_MODULES];

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
      ],
    },
    {
      id: "advanced",
      title: "Advanced Phase",
      description: "Expert-level specializations and advanced techniques",
      icon: GraduationCap,
      color: "text-red-400",
      modules: [
        {
          id: "penetration-testing",
          title: "Penetration Testing",
          description: "Advanced penetration testing methodologies and tools",
          icon: Shield,
          duration: "6-8 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
          topics: ["PTES", "Metasploit", "Custom Exploits", "Reporting"],
          path: "/course/penetration-testing",
          enrollPath: "/learn/penetration-testing",
          labs: 20,
          games: 10,
          assets: 35,
          enrolled: false,
          completed: false,
        },
        {
          id: "malware-analysis",
          title: "Malware Analysis",
          description: "Reverse engineering and malware analysis techniques",
          icon: Database,
          duration: "5-6 weeks",
          difficulty: "Advanced",
          progress: 0,
          color: "text-purple-400",
          bgColor: "bg-purple-400/10",
          borderColor: "border-purple-400/30",
          topics: [
            "Static Analysis",
            "Dynamic Analysis",
            "Reverse Engineering",
            "Sandboxing",
          ],
          path: "/course/malware-analysis",
          enrollPath: "/learn/malware-analysis",
          labs: 18,
          games: 8,
          assets: 28,
          enrolled: false,
          completed: false,
        },
        {
          id: "cloud-security",
          title: "Cloud Security",
          description: "Securing cloud infrastructure and services",
          icon: Cloud,
          duration: "4-5 weeks",
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
          labs: 15,
          games: 6,
          assets: 25,
          enrolled: false,
          completed: false,
        },
      ],
    },
  ];

  const getOverallProgress = () => {
    const allModules = phases.flatMap((phase) => phase.modules);
    return Math.round(
      allModules.reduce((sum, module) => sum + module.progress, 0) /
        allModules.length
    );
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleEnroll = (path: string) => {
    navigate(path);
  };

  const handleStartPhase = (phase: Phase) => {
    const firstIncomplete = phase.modules.find((m) => !m.enrolled);
    if (firstIncomplete) {
      navigate(firstIncomplete.path);
    }
  };

  const handleViewAllCourses = () => {
    navigate("/courses");
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pt-20 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <OverviewHeader overallProgress={getOverallProgress()} />

          {/* Phase Navigation */}
          <Tabs
            value={activePhase}
            onValueChange={setActivePhase}
            className="space-y-8"
          >
            <PhaseNavigation phases={phases} onPhaseChange={setActivePhase} />

            {phases.map((phase) => (
              <TabsContent
                key={phase.id}
                value={phase.id}
                className="space-y-8"
              >
                {/* Phase Header */}
                <PhaseCard phase={phase} />

                {/* Modules Tree Structure */}
                <ModuleTree
                  phase={phase}
                  completedModules={completedModules}
                  onNavigate={handleNavigate}
                  onEnroll={handleEnroll}
                />

                {/* Phase Completion CTA */}
                <PhaseCompletionCTA
                  phase={phase}
                  onStartPhase={() => handleStartPhase(phase)}
                  onViewAllCourses={handleViewAllCourses}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CyberSecOverview;
