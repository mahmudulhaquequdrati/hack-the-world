import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Globe,
  Lock,
  Network,
  Play,
  Shield,
  Star,
  Target,
  Terminal,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [enrollmentStatus, setEnrollmentStatus] = useState("not-enrolled");

  // Helper function to create generic course data
  const createGenericCourse = (
    title: string,
    description: string,
    category: string,
    difficulty: string,
    duration: string,
    icon: React.ComponentType<{ className?: string }>,
    color: string
  ) => {
    const baseColor = color.replace("text-", "");
    return {
      title,
      description,
      category,
      difficulty,
      duration,
      lessons:
        difficulty === "Beginner"
          ? 10
          : difficulty === "Intermediate"
          ? 16
          : 24,
      rating: 4.5 + Math.random() * 0.4,
      students: Math.floor(Math.random() * 5000) + 2000,
      price:
        difficulty === "Beginner"
          ? "Free"
          : difficulty === "Intermediate"
          ? "$49"
          : "$99",
      icon,
      color,
      bgColor: `bg-${baseColor}-400/10`,
      borderColor: `border-${baseColor}-400/30`,
      progress: Math.floor(Math.random() * 100),
      labsCount:
        difficulty === "Beginner" ? 5 : difficulty === "Intermediate" ? 8 : 12,
      gamesCount:
        difficulty === "Beginner" ? 3 : difficulty === "Intermediate" ? 5 : 8,
      assetsCount:
        difficulty === "Beginner"
          ? 12
          : difficulty === "Intermediate"
          ? 18
          : 25,
      enrollPath: `/learn/${title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/&/g, "")
        .replace(/[^\w-]/g, "")}`,
      skills: [
        "Coming Soon",
        "In Development",
        "Advanced Topics",
        "Hands-on Practice",
      ],
      prerequisites:
        difficulty === "Beginner"
          ? "None"
          : "Previous cybersecurity courses recommended",
      certification: true,
      instructor: {
        name: "Expert Instructor",
        title: "Cybersecurity Specialist",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
        experience: "10+ years in cybersecurity",
      },
      curriculum: [
        {
          title: "Course Introduction",
          lessons: 3,
          duration: "1h 30min",
          topics: ["Overview", "Objectives", "Prerequisites"],
          completed: false,
        },
        {
          title: "Core Concepts",
          lessons: 4,
          duration: "2h",
          topics: ["Fundamentals", "Best Practices", "Tools"],
          completed: false,
        },
        {
          title: "Practical Applications",
          lessons: 5,
          duration: "2h 30min",
          topics: ["Hands-on Labs", "Case Studies", "Real-world Scenarios"],
          completed: false,
        },
      ],
      learningOutcomes: [
        {
          title: "Understand core concepts and principles",
          description:
            "Master fundamental concepts, industry best practices, and essential methodologies used in this specialized cybersecurity domain.",
          skills: ["Core Concepts", "Best Practices", "Methodologies"],
        },
        {
          title: "Apply practical techniques and tools",
          description:
            "Gain hands-on experience with industry-standard tools, techniques, and technologies through guided exercises and real-world scenarios.",
          skills: ["Practical Application", "Tool Usage", "Technical Skills"],
        },
        {
          title: "Implement security best practices",
          description:
            "Learn to implement and maintain security controls, policies, and procedures following industry standards and organizational requirements.",
          skills: ["Implementation", "Security Controls", "Policy Management"],
        },
        {
          title: "Analyze real-world scenarios",
          description:
            "Develop analytical skills to assess, investigate, and respond to realistic cybersecurity challenges and threat scenarios.",
          skills: ["Analysis", "Investigation", "Problem Solving"],
        },
        {
          title: "Develop professional skills",
          description:
            "Build essential professional competencies including communication, documentation, and collaboration skills required in cybersecurity roles.",
          skills: ["Communication", "Documentation", "Teamwork"],
        },
        {
          title: "Earn industry certification",
          description:
            "Prepare for relevant industry certifications and demonstrate mastery of key concepts through comprehensive assessments.",
          skills: ["Certification Prep", "Assessment", "Knowledge Validation"],
        },
      ],
      labs: [
        {
          name: "Introduction Lab",
          description: "Get familiar with the course tools and environment",
          difficulty,
          duration: "45 min",
          skills: ["Tools", "Environment"],
        },
        {
          name: "Practical Workshop",
          description: "Apply concepts in hands-on scenarios",
          difficulty,
          duration: "90 min",
          skills: ["Practice", "Application"],
        },
      ],
      games: [
        {
          name: "Knowledge Challenge",
          description: "Test your understanding",
          points: 100,
          type: "Quiz",
        },
        {
          name: "Scenario Simulator",
          description: "Practice real-world scenarios",
          points: 150,
          type: "Simulation",
        },
      ],
      assets: [
        { name: "Course Reference Guide", type: "PDF", size: "2.5 MB" },
        { name: "Tools and Resources", type: "ZIP", size: "5.2 MB" },
        { name: "Additional Reading", type: "PDF", size: "1.8 MB" },
      ],
    };
  };

  // Helper function to generate course data for all courses
  const generateCourseData = () => {
    return {
      // BEGINNER PHASE
      foundations: {
        title: "Cybersecurity Fundamentals",
        description:
          "Essential concepts, terminology, and security principles that form the backbone of cybersecurity knowledge.",
        category: "Fundamentals",
        difficulty: "Beginner",
        duration: "2-3 weeks",
        lessons: 15,
        rating: 4.9,
        students: 8420,
        price: "Free",
        icon: Shield,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/30",
        progress: 85,
        labsCount: 5,
        gamesCount: 3,
        assetsCount: 12,
        enrollPath: "/learn/foundations",
        skills: [
          "CIA Triad",
          "Risk Assessment",
          "Compliance",
          "Security Frameworks",
        ],
        prerequisites: "None - Perfect for beginners",
        certification: true,
        instructor: {
          name: "Dr. Sarah Chen",
          title: "Chief Security Officer",
          avatar:
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
          experience: "15+ years in cybersecurity",
        },
        curriculum: [
          {
            title: "Introduction to Cybersecurity",
            lessons: 4,
            duration: "1h 30min",
            topics: [
              "What is Cybersecurity",
              "Threat Landscape",
              "Security Principles",
              "CIA Triad",
            ],
            completed: true,
          },
          {
            title: "Risk Management",
            lessons: 3,
            duration: "1h 15min",
            topics: ["Risk Assessment", "Risk Analysis", "Risk Mitigation"],
            completed: true,
          },
          {
            title: "Security Frameworks",
            lessons: 4,
            duration: "2h",
            topics: ["NIST Framework", "ISO 27001", "COBIT", "SOX Compliance"],
            completed: false,
          },
          {
            title: "Security Policies & Governance",
            lessons: 4,
            duration: "1h 45min",
            topics: [
              "Policy Development",
              "Governance",
              "Compliance",
              "Auditing",
            ],
            completed: false,
          },
        ],
        learningOutcomes: [
          {
            title: "Understand core cybersecurity principles",
            description:
              "Master the fundamental concepts of information security including the CIA triad (Confidentiality, Integrity, Availability), defense in depth strategies, and basic security principles that form the foundation of all cybersecurity practices.",
            skills: ["CIA Triad", "Security Principles", "Defense in Depth"],
          },
          {
            title: "Implement risk assessment methodologies",
            description:
              "Learn to identify, analyze, and evaluate security risks using industry-standard frameworks. Develop skills in quantitative and qualitative risk analysis, risk calculation, and risk mitigation strategies.",
            skills: ["Risk Assessment", "Risk Analysis", "Risk Mitigation"],
          },
          {
            title: "Apply security frameworks effectively",
            description:
              "Gain practical experience with major security frameworks including NIST Cybersecurity Framework, ISO 27001, and COBIT. Learn how to map organizational needs to framework requirements and implement controls.",
            skills: [
              "NIST Framework",
              "ISO 27001",
              "COBIT",
              "Control Implementation",
            ],
          },
          {
            title: "Develop comprehensive security policies",
            description:
              "Create effective security policies and procedures that align with business objectives. Learn policy development lifecycle, stakeholder engagement, and how to ensure policy compliance and enforcement.",
            skills: [
              "Policy Development",
              "Governance",
              "Compliance Management",
            ],
          },
          {
            title: "Navigate compliance requirements",
            description:
              "Understand major compliance frameworks such as SOX, HIPAA, GDPR, and PCI-DSS. Learn how to conduct compliance assessments, maintain audit trails, and prepare for regulatory audits.",
            skills: [
              "Regulatory Compliance",
              "Audit Preparation",
              "Documentation",
            ],
          },
          {
            title: "Design threat modeling strategies",
            description:
              "Master threat modeling methodologies like STRIDE and PASTA. Learn to identify threats, assess attack vectors, and design appropriate security controls to mitigate identified risks.",
            skills: ["Threat Modeling", "STRIDE", "Attack Vector Analysis"],
          },
        ],
        labs: [
          {
            name: "Risk Assessment Simulation",
            description: "Hands-on risk assessment of a fictional company",
            difficulty: "Beginner",
            duration: "45 min",
            skills: ["Risk Analysis", "Documentation"],
          },
          {
            name: "Policy Development Workshop",
            description: "Create security policies for different scenarios",
            difficulty: "Beginner",
            duration: "60 min",
            skills: ["Policy Writing", "Compliance"],
          },
          {
            name: "Framework Implementation",
            description: "Apply NIST Framework to a real scenario",
            difficulty: "Intermediate",
            duration: "90 min",
            skills: ["NIST Framework", "Implementation"],
          },
          {
            name: "Threat Modeling Exercise",
            description: "Model threats for a web application",
            difficulty: "Intermediate",
            duration: "75 min",
            skills: ["Threat Modeling", "Analysis"],
          },
          {
            name: "Compliance Audit Simulation",
            description: "Conduct a mock compliance audit",
            difficulty: "Advanced",
            duration: "120 min",
            skills: ["Auditing", "Compliance"],
          },
        ],
        games: [
          {
            name: "Security Policy Builder",
            description: "Interactive game to build security policies",
            points: 100,
            type: "Strategy",
          },
          {
            name: "Risk Matrix Challenge",
            description: "Calculate and prioritize security risks",
            points: 150,
            type: "Puzzle",
          },
          {
            name: "Compliance Quest",
            description: "Navigate compliance requirements and regulations",
            points: 200,
            type: "Adventure",
          },
        ],
        assets: [
          { name: "CIA Triad Reference Guide", type: "PDF", size: "2.1 MB" },
          { name: "Risk Assessment Template", type: "Excel", size: "1.5 MB" },
          { name: "NIST Framework Checklist", type: "PDF", size: "850 KB" },
          { name: "Security Policy Templates", type: "Word", size: "3.2 MB" },
          { name: "Threat Modeling Toolkit", type: "ZIP", size: "12.8 MB" },
          {
            name: "Compliance Frameworks Comparison",
            type: "PDF",
            size: "4.1 MB",
          },
          {
            name: "Security Governance Best Practices",
            type: "PDF",
            size: "2.8 MB",
          },
          { name: "Risk Register Template", type: "Excel", size: "1.2 MB" },
          {
            name: "Security Awareness Training Materials",
            type: "ZIP",
            size: "45.3 MB",
          },
        ],
      },

      "linux-basics": {
        title: "Linux Command Line Basics",
        description:
          "Master the terminal and basic command-line operations essential for cybersecurity.",
        category: "System Administration",
        difficulty: "Beginner",
        duration: "2-3 weeks",
        lessons: 12,
        rating: 4.8,
        students: 7250,
        price: "Free",
        icon: Terminal,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/30",
        progress: 70,
        labsCount: 8,
        gamesCount: 4,
        assetsCount: 18,
        enrollPath: "/learn/linux-basics",
        skills: [
          "Basic Commands",
          "File Navigation",
          "Text Processing",
          "Permissions",
        ],
        prerequisites: "None",
        certification: true,
        instructor: {
          name: "Alex Rodriguez",
          title: "Senior Systems Administrator",
          avatar:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
          experience: "12+ years in Linux administration",
        },
        curriculum: [
          {
            title: "Getting Started with Linux",
            lessons: 3,
            duration: "1h",
            topics: ["Linux History", "Distributions", "Terminal Basics"],
            completed: true,
          },
          {
            title: "File System Navigation",
            lessons: 4,
            duration: "1h 30min",
            topics: [
              "Directory Structure",
              "Navigation Commands",
              "File Operations",
            ],
            completed: true,
          },
          {
            title: "Text Processing & Permissions",
            lessons: 3,
            duration: "1h 15min",
            topics: ["Text Editors", "File Permissions", "Ownership"],
            completed: false,
          },
          {
            title: "Process Management",
            lessons: 2,
            duration: "45min",
            topics: ["Process Control", "Job Management"],
            completed: false,
          },
        ],
        learningOutcomes: [
          {
            title: "Navigate Linux file system efficiently",
            description:
              "Master the Linux directory structure, learn essential navigation commands like cd, ls, pwd, and understand relative vs absolute paths. Develop proficiency in finding files and directories using find, locate, and which commands.",
            skills: [
              "File System Navigation",
              "Directory Structure",
              "Path Management",
            ],
          },
          {
            title: "Understand file permissions and ownership",
            description:
              "Learn the Linux permission system including read, write, and execute permissions for user, group, and others. Master chmod, chown, and chgrp commands, and understand special permissions like sticky bits and setuid.",
            skills: ["File Permissions", "Ownership", "Access Control"],
          },
          {
            title: "Use essential command-line tools",
            description:
              "Become proficient with core Linux utilities including grep, awk, sed, sort, uniq, and cut for text processing. Learn file manipulation commands like cp, mv, rm, and archive tools like tar and gzip.",
            skills: [
              "Command Line Tools",
              "Text Processing",
              "File Manipulation",
            ],
          },
          {
            title: "Manage processes and jobs",
            description:
              "Understand process lifecycle, learn to monitor running processes with ps, top, and htop. Master job control including foreground/background processes, and learn to terminate processes safely.",
            skills: ["Process Management", "Job Control", "System Monitoring"],
          },
          {
            title: "Edit files using terminal editors",
            description:
              "Gain proficiency in vi/vim and nano text editors. Learn basic editing commands, search and replace functionality, and how to efficiently edit configuration files from the command line.",
            skills: ["Text Editors", "Vi/Vim", "File Editing"],
          },
          {
            title: "Automate tasks with basic scripting",
            description:
              "Introduction to bash scripting fundamentals including variables, loops, and conditional statements. Learn to create simple automation scripts and understand shell scripting best practices.",
            skills: ["Bash Scripting", "Automation", "Shell Programming"],
          },
        ],
        labs: [
          {
            name: "Basic Commands Lab",
            description: "Practice essential Linux commands",
            difficulty: "Beginner",
            duration: "30 min",
            skills: ["Commands", "Navigation"],
          },
          {
            name: "File Permissions Workshop",
            description: "Master file permissions and ownership",
            difficulty: "Beginner",
            duration: "45 min",
            skills: ["Permissions", "Security"],
          },
          {
            name: "Text Processing Challenge",
            description: "Process text files using Linux tools",
            difficulty: "Intermediate",
            duration: "60 min",
            skills: ["Text Processing", "Filtering"],
          },
        ],
        games: [
          {
            name: "Command Line Quest",
            description: "Adventure through the Linux filesystem",
            points: 120,
            type: "Adventure",
          },
          {
            name: "Permission Puzzle",
            description: "Solve file permission challenges",
            points: 80,
            type: "Puzzle",
          },
        ],
        assets: [
          { name: "Linux Command Cheat Sheet", type: "PDF", size: "1.2 MB" },
          { name: "File System Reference", type: "PDF", size: "2.1 MB" },
          { name: "Permission Calculator", type: "Tool", size: "500 KB" },
        ],
      },

      "networking-basics": {
        title: "Networking Fundamentals",
        description:
          "Understanding network protocols and basic concepts essential for cybersecurity.",
        category: "Networking",
        difficulty: "Beginner",
        duration: "3-4 weeks",
        lessons: 16,
        rating: 4.7,
        students: 6850,
        price: "Free",
        icon: Network,
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/30",
        progress: 60,
        labsCount: 10,
        gamesCount: 5,
        assetsCount: 20,
        enrollPath: "/learn/networking-basics",
        skills: ["TCP/IP", "OSI Model", "DNS", "Basic Protocols"],
        prerequisites: "Basic computer knowledge",
        certification: true,
        instructor: {
          name: "Maya Patel",
          title: "Network Security Engineer",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
          experience: "10+ years in network security",
        },
        curriculum: [
          {
            title: "Network Fundamentals",
            lessons: 4,
            duration: "2h",
            topics: ["Network Types", "Topologies", "Components"],
            completed: true,
          },
          {
            title: "OSI Model Deep Dive",
            lessons: 4,
            duration: "2h 15min",
            topics: ["7 Layers", "Protocols", "Data Flow"],
            completed: true,
          },
          {
            title: "TCP/IP Protocol Suite",
            lessons: 4,
            duration: "2h 30min",
            topics: ["IP Addressing", "Routing", "Subnetting"],
            completed: false,
          },
          {
            title: "Network Services",
            lessons: 4,
            duration: "1h 45min",
            topics: ["DNS", "DHCP", "NAT"],
            completed: false,
          },
        ],
        learningOutcomes: [
          {
            title: "Understand network fundamentals",
            description:
              "Master core networking concepts including network types (LAN, WAN, MAN), topologies (star, ring, mesh), and essential network components like routers, switches, and hubs. Learn how data flows through networks.",
            skills: ["Network Types", "Topologies", "Network Components"],
          },
          {
            title: "Master the OSI model",
            description:
              "Gain deep understanding of all seven OSI layers, their functions, and how protocols operate at each layer. Learn to troubleshoot network issues using the layered approach and understand data encapsulation.",
            skills: ["OSI Model", "Layer Functions", "Protocol Mapping"],
          },
          {
            title: "Configure TCP/IP networks",
            description:
              "Learn IP addressing fundamentals including IPv4 and IPv6, subnetting, VLSM, and CIDR notation. Master routing concepts, default gateways, and understand how packets are routed across networks.",
            skills: ["IP Addressing", "Subnetting", "Routing"],
          },
          {
            title: "Implement network services",
            description:
              "Configure and manage essential network services including DNS for name resolution, DHCP for automatic IP assignment, and NAT for address translation. Understand how these services interact.",
            skills: ["DNS", "DHCP", "NAT", "Network Services"],
          },
          {
            title: "Troubleshoot network issues",
            description:
              "Develop systematic troubleshooting skills using tools like ping, traceroute, netstat, and packet analyzers. Learn to identify and resolve common network problems including connectivity and performance issues.",
            skills: [
              "Network Troubleshooting",
              "Diagnostic Tools",
              "Problem Resolution",
            ],
          },
          {
            title: "Design secure network architectures",
            description:
              "Learn network security fundamentals including firewalls, VLANs, and network segmentation. Understand secure network design principles and how to implement defense in depth strategies.",
            skills: [
              "Network Security",
              "Architecture Design",
              "Defense in Depth",
            ],
          },
        ],
        labs: [
          {
            name: "Network Configuration Lab",
            description: "Set up and configure network devices",
            difficulty: "Beginner",
            duration: "60 min",
            skills: ["Configuration", "Protocols"],
          },
          {
            name: "Packet Analysis Workshop",
            description: "Analyze network packets",
            difficulty: "Intermediate",
            duration: "75 min",
            skills: ["Analysis", "Troubleshooting"],
          },
        ],
        games: [
          {
            name: "Network Builder",
            description: "Build and configure networks",
            points: 150,
            type: "Strategy",
          },
          {
            name: "Protocol Stack Challenge",
            description: "Match protocols to OSI layers",
            points: 100,
            type: "Puzzle",
          },
        ],
        assets: [
          { name: "OSI Model Reference", type: "PDF", size: "1.8 MB" },
          { name: "TCP/IP Guide", type: "PDF", size: "3.2 MB" },
          {
            name: "Network Troubleshooting Toolkit",
            type: "ZIP",
            size: "8.5 MB",
          },
        ],
      },

      // For all other courses, provide a generic template that shows the course exists
      "web-security-intro": createGenericCourse(
        "Introduction to Web Security",
        "Basic web application security concepts and common vulnerabilities",
        "Web Security",
        "Beginner",
        "2-3 weeks",
        Shield,
        "text-cyan-400"
      ),
      "digital-forensics-basics": createGenericCourse(
        "Digital Forensics Basics",
        "Introduction to digital evidence and investigation techniques",
        "Digital Forensics",
        "Beginner",
        "2-3 weeks",
        BookOpen,
        "text-yellow-400"
      ),
      "security-awareness": createGenericCourse(
        "Security Awareness & Policies",
        "Understanding security policies, compliance, and human factors",
        "Human Security",
        "Beginner",
        "1-2 weeks",
        Users,
        "text-orange-400"
      ),

      // Intermediate courses
      "advanced-networking": createGenericCourse(
        "Advanced Network Security",
        "Network monitoring, intrusion detection, and security protocols",
        "Network Security",
        "Intermediate",
        "4-5 weeks",
        Network,
        "text-purple-400"
      ),
      "web-application-security": createGenericCourse(
        "Web Application Security",
        "Advanced web vulnerabilities and exploitation techniques",
        "Web Security",
        "Intermediate",
        "5-6 weeks",
        Globe,
        "text-red-400"
      ),
      "social-engineering-osint": createGenericCourse(
        "Social Engineering & OSINT",
        "Human psychology, information gathering, and awareness",
        "Social Engineering",
        "Intermediate",
        "3-4 weeks",
        Users,
        "text-yellow-400"
      ),
      "incident-response": createGenericCourse(
        "Incident Response & Management",
        "Responding to security incidents and managing cyber crises",
        "Incident Response",
        "Intermediate",
        "4-5 weeks",
        Shield,
        "text-green-400"
      ),
      "cryptography-pki": createGenericCourse(
        "Cryptography & PKI",
        "Encryption, digital signatures, and public key infrastructure",
        "Cryptography",
        "Intermediate",
        "4-5 weeks",
        Lock,
        "text-blue-400"
      ),
      "vulnerability-assessment": createGenericCourse(
        "Vulnerability Assessment & Scanning",
        "Identifying and assessing security weaknesses in systems",
        "Vulnerability Assessment",
        "Intermediate",
        "3-4 weeks",
        Target,
        "text-cyan-400"
      ),
      "mobile-security": createGenericCourse(
        "Mobile Security",
        "iOS and Android security, mobile app testing",
        "Mobile Security",
        "Intermediate",
        "3-4 weeks",
        Globe,
        "text-pink-400"
      ),

      // Advanced courses
      "advanced-penetration-testing": createGenericCourse(
        "Advanced Penetration Testing",
        "Advanced attack techniques and post-exploitation",
        "Penetration Testing",
        "Advanced",
        "6-8 weeks",
        Activity,
        "text-orange-400"
      ),
      "malware-analysis": createGenericCourse(
        "Malware Analysis & Reverse Engineering",
        "Analyzing malicious software and reverse engineering techniques",
        "Malware Analysis",
        "Advanced",
        "6-8 weeks",
        Terminal,
        "text-red-400"
      ),
      "red-team-operations": createGenericCourse(
        "Red Team Operations",
        "Advanced adversarial simulation and tactics",
        "Red Team",
        "Advanced",
        "8-10 weeks",
        Target,
        "text-red-600"
      ),
      "cloud-security-architecture": createGenericCourse(
        "Cloud Security Architecture",
        "Securing cloud environments and infrastructure",
        "Cloud Security",
        "Advanced",
        "5-6 weeks",
        Globe,
        "text-blue-400"
      ),
      "iot-security": createGenericCourse(
        "IoT Security",
        "Internet of Things security and embedded systems",
        "IoT Security",
        "Advanced",
        "4-5 weeks",
        Network,
        "text-purple-400"
      ),
      "advanced-forensics": createGenericCourse(
        "Advanced Digital Forensics",
        "Advanced investigation techniques and specialized tools",
        "Digital Forensics",
        "Advanced",
        "6-7 weeks",
        BookOpen,
        "text-yellow-400"
      ),
      "threat-hunting": createGenericCourse(
        "Threat Hunting",
        "Proactive threat detection and hunting methodologies",
        "Threat Hunting",
        "Advanced",
        "5-6 weeks",
        Target,
        "text-green-400"
      ),
    };
  };

  // Use the generated course data
  const moduleData = generateCourseData();

  const module = moduleData[courseId as keyof typeof moduleData];

  // Handle case where course is not found
  if (!module) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative">
        <Header navigate={navigate} />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
            <p className="text-green-300/70 mb-8">
              The course you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => navigate("/overview")}
              className="bg-green-400 text-black hover:bg-green-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
      case "master":
        return "text-orange-400 bg-orange-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "zip":
        return <Download className="w-4 h-4" />;
      case "html":
        return <Globe className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleEnrollment = () => {
    if (enrollmentStatus === "not-enrolled") {
      setEnrollmentStatus("enrolled");
      // Navigate to the specific enrolled course page
      navigate(`/learn/${courseId}`);
    } else {
      // Continue to enrolled course
      navigate(`/learn/${courseId}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

      <div className="pb-20 pt-5 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/overview")}
            className="mb-4 text-green-400 hover:bg-green-400/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Course Info */}
            <div className="lg:col-span-2">
              {/* Terminal-style header */}
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 mb-6 relative overflow-hidden">
                {/* Terminal header bar */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-green-400/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-green-400/60 text-xs font-mono">
                    cybersec-academy/course/{courseId}
                  </div>
                </div>

                {/* Course header */}
                <div className="flex items-start space-x-6 mb-6">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 ${module.bgColor} border-2 ${module.borderColor} rounded-lg flex items-center justify-center relative`}
                    >
                      <module.icon className={`w-10 h-10 ${module.color}`} />
                      {/* Glitch effect */}
                      <div className="absolute inset-0 border-2 border-green-400/20 rounded-lg animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h1 className="text-4xl font-bold text-green-400 font-mono tracking-tight">
                        {module.title}
                      </h1>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <Badge
                        className={`${getDifficultyColor(
                          module.difficulty
                        )} font-mono text-xs px-3 py-1`}
                      >
                        /{module.difficulty.toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-mono">
                          {module.rating}
                        </span>
                      </div>
                      <span className="text-sm text-green-300/70 font-mono">
                        {module.students.toLocaleString()} enrolled
                      </span>
                    </div>

                    <p className="text-green-300/90 leading-relaxed text-lg mb-6">
                      {module.description}
                    </p>
                  </div>
                </div>

                {/* Skills terminal output */}
                <div className="bg-black/40 border border-green-400/20 rounded p-4">
                  <div className="text-green-400/60 text-xs mb-2 font-mono">
                    $ course --list-skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-green-400/10 border border-green-400/30 rounded text-green-400 text-sm font-mono"
                      >
                        #{skill.toLowerCase().replace(/\s+/g, "_")}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scan line effect */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse"></div>
              </div>

              {/* Course Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-black border-2 border-green-400/30 rounded-lg p-6 text-center relative overflow-hidden hover:border-green-400/60 transition-all duration-300">
                  <div className="absolute top-2 left-2 text-green-400/30 text-xs font-mono">
                    [01]
                  </div>
                  <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-400 mb-1 font-mono">
                    {module.lessons}
                  </div>
                  <div className="text-sm text-green-300/70 uppercase tracking-wider font-mono">
                    Video Lessons
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400/20"></div>
                </div>

                <div className="bg-black border-2 border-yellow-400/30 rounded-lg p-6 text-center relative overflow-hidden hover:border-yellow-400/60 transition-all duration-300">
                  <div className="absolute top-2 left-2 text-yellow-400/30 text-xs font-mono">
                    [02]
                  </div>
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-yellow-400 mb-1 font-mono">
                    {module.labsCount}
                  </div>
                  <div className="text-sm text-green-300/70 uppercase tracking-wider font-mono">
                    Hands-on Labs
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400/20"></div>
                </div>

                <div className="bg-black border-2 border-red-400/30 rounded-lg p-6 text-center relative overflow-hidden hover:border-red-400/60 transition-all duration-300">
                  <div className="absolute top-2 left-2 text-red-400/30 text-xs font-mono">
                    [03]
                  </div>
                  <Activity className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-red-400 mb-1 font-mono">
                    {module.gamesCount}
                  </div>
                  <div className="text-sm text-green-300/70 uppercase tracking-wider font-mono">
                    Interactive Games
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400/20"></div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Info Terminal */}
              <div className="bg-black border-2 border-green-400/50 rounded-lg overflow-hidden">
                {/* Terminal header */}
                <div className="bg-green-400/10 border-b border-green-400/30 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-green-400 font-mono text-sm font-bold">
                      COURSE.INFO
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="text-green-400/60 text-xs font-mono">
                        ACTIVE
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-2 font-mono text-sm">
                  <div className="flex items-center justify-between border-b border-green-400/20 pb-2">
                    <span className="text-green-300/70">Duration:</span>
                    <span className="text-green-400 font-bold">
                      {module.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-green-400/20 pb-2">
                    <span className="text-green-300/70">Price:</span>
                    <span className={`font-bold ${module.color} text-lg`}>
                      {module.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-green-400/20 pb-2">
                    <span className="text-green-300/70">Category:</span>
                    <span className="text-green-400">{module.category}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-green-400/20 pb-2">
                    <span className="text-green-300/70">Certificate:</span>
                    <span className="text-green-400">
                      {module.certification ? "✓ YES" : "✗ NO"}
                    </span>
                  </div>

                  <div className="bg-black/60 border border-green-400/20 rounded p-3 mt-4">
                    <div className="text-green-400/60 text-xs mb-1">
                      PREREQUISITES:
                    </div>
                    <p className="text-green-400 text-sm leading-relaxed">
                      {module.prerequisites}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Terminal */}
              {module.progress > 0 && (
                <div className="bg-black border-2 border-blue-400/50 rounded-lg overflow-hidden">
                  <div className="bg-blue-400/10 border-b border-blue-400/30 px-4 py-2">
                    <div className="text-blue-400 font-mono text-sm font-bold">
                      PROGRESS.LOG
                    </div>
                  </div>

                  <div className="p-6 font-mono">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-green-300/70">Completion:</span>
                      <span className="text-blue-400 font-bold text-lg">
                        {module.progress}%
                      </span>
                    </div>

                    {/* Custom progress bar */}
                    <div className="bg-black border border-green-400/30 rounded h-4 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400/60 to-blue-400/60 relative"
                        style={{ width: `${module.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-green-400">
                        {module.progress}% COMPLETE
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-green-300/60">Lessons:</span>
                        <span className="text-green-400">
                          {Math.floor((module.progress / 100) * module.lessons)}
                          /{module.lessons}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300/60">Labs:</span>
                        <span className="text-yellow-400">
                          {Math.floor(
                            (module.progress / 100) * module.labsCount
                          )}
                          /{module.labsCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300/60">Games:</span>
                        <span className="text-red-400">
                          {Math.floor(
                            (module.progress / 100) * module.gamesCount
                          )}
                          /{module.gamesCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructor Info */}
              {/* <div className="bg-black border-2 border-purple-400/50 rounded-lg overflow-hidden">
                <div className="bg-purple-400/10 border-b border-purple-400/30 px-4 py-2">
                  <div className="text-purple-400 font-mono text-sm font-bold">
                    INSTRUCTOR.DATA
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-400/20 border border-purple-400/30 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-green-400 font-bold font-mono">
                        {module.instructor.name}
                      </div>
                      <div className="text-green-300/70 text-sm">
                        {module.instructor.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-green-300/80 text-sm font-mono">
                    {module.instructor.experience}
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Enrollment Button */}
          <div className="mb-12">
            <div className="bg-black border-2 border-green-400/50 rounded-lg p-2 relative overflow-hidden">
              <Button
                onClick={handleEnrollment}
                size="lg"
                className="w-full bg-gradient-to-r from-green-400 to-green-300 text-black hover:from-green-300 hover:to-green-200 font-mono font-bold text-lg py-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-green-400/20 group-hover:bg-green-400/30 transition-all duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Play className="w-6 h-6" />
                  <span>
                    {enrollmentStatus === "not-enrolled"
                      ? "> INITIALIZE_LEARNING_PROTOCOL"
                      : "> CONTINUE_MISSION"}
                  </span>
                </div>
              </Button>

              {/* Button glow effect */}
              <div className="absolute inset-0 border-2 border-green-400/20 rounded-lg animate-pulse pointer-events-none"></div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-black border-2 border-green-400/50 rounded-lg overflow-hidden">
            {/* Terminal-style tab header */}
            <div className="bg-green-400/10 border-b border-green-400/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-green-400 font-mono text-lg font-bold">
                  COURSE.MODULES
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="text-green-400/60 text-xs font-mono">
                    INTERACTIVE
                  </div>
                </div>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-black/60 border-b border-green-400/20 px-6 py-2">
                <TabsList className="grid w-full grid-cols-5 bg-transparent border-0 gap-2">
                  <TabsTrigger
                    value="overview"
                    className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
                  >
                    OVERVIEW
                  </TabsTrigger>
                  <TabsTrigger
                    value="curriculum"
                    className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
                  >
                    CURRICULUM
                  </TabsTrigger>
                  <TabsTrigger
                    value="labs"
                    className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
                  >
                    LABS
                  </TabsTrigger>
                  <TabsTrigger
                    value="games"
                    className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
                  >
                    GAMES
                  </TabsTrigger>
                  <TabsTrigger
                    value="assets"
                    className="bg-black/60 border border-green-400/30 text-green-400 font-mono text-sm data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-green-400 hover:bg-green-400/10 transition-all duration-300"
                  >
                    ASSETS
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-6">
                    {/* Learning Outcomes */}
                    <div className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden">
                      <div className="bg-green-400/10 border-b border-green-400/20 px-4 py-3">
                        <div className="text-green-400 font-mono text-sm font-bold flex items-center">
                          <Trophy className="w-4 h-4 mr-2" />
                          LEARNING.OBJECTIVES
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid gap-6">
                          {module.learningOutcomes.map((outcome, index) => (
                            <div
                              key={index}
                              className="bg-black/30 border border-green-400/20 rounded-lg overflow-hidden hover:border-green-400/40 transition-all duration-300"
                            >
                              {/* Header with title */}
                              <div className="flex items-start space-x-4 p-4 border-b border-green-400/20">
                                <div className="text-green-400/60 font-mono text-xs mt-1">
                                  [{(index + 1).toString().padStart(2, "0")}]
                                </div>
                                <div className="flex items-start space-x-3 flex-1">
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-green-300 text-base font-semibold leading-relaxed font-mono">
                                    {typeof outcome === "string"
                                      ? outcome
                                      : outcome.title}
                                  </span>
                                </div>
                              </div>

                              {/* Description and skills (only for detailed outcomes) */}
                              {typeof outcome !== "string" && (
                                <div className="p-4 space-y-4">
                                  <p className="text-green-300/80 text-sm leading-relaxed">
                                    {outcome.description}
                                  </p>

                                  {/* Skills tags */}
                                  <div className="flex flex-wrap gap-2">
                                    <div className="text-green-400/60 text-xs font-mono mr-2 mt-1">
                                      Skills:
                                    </div>
                                    {outcome.skills.map((skill, skillIndex) => (
                                      <div
                                        key={skillIndex}
                                        className="bg-blue-400/10 border border-blue-400/30 rounded px-2 py-1 text-xs text-blue-400 font-mono"
                                      >
                                        #
                                        {skill
                                          .toLowerCase()
                                          .replace(/\s+/g, "_")}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Curriculum Tab */}
                <TabsContent value="curriculum" className="mt-0">
                  <div className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden">
                    {/* File explorer header */}
                    <div className="bg-green-400/10 border-b border-green-400/20 px-4 py-3">
                      <div className="text-green-400 font-mono text-sm font-bold flex items-center">
                        <div className="text-green-400/60 mr-2">📁</div>
                        /course/curriculum/
                      </div>
                    </div>

                    {/* Folder structure */}
                    <div className="p-4 font-mono text-sm">
                      {module.curriculum.map((section, index) => (
                        <div key={index} className="mb-3">
                          {/* Folder line */}
                          <div className="flex items-center space-x-3 py-2 hover:bg-green-400/5 transition-colors">
                            <div className="flex items-center space-x-2 flex-1">
                              <span className="text-green-400/60">
                                {section.completed ? "📂" : "📁"}
                              </span>
                              <span className="text-green-400 flex-1">
                                {section.title}
                              </span>
                              <span className="text-green-300/60 text-xs">
                                {section.lessons} files
                              </span>
                              <span className="text-green-300/60 text-xs">
                                {section.duration}
                              </span>
                              {section.completed && (
                                <span className="text-green-400 text-xs">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Files in folder */}
                          <div className="ml-6 space-y-1">
                            {section.topics.map((topic, topicIndex) => (
                              <div
                                key={topicIndex}
                                className="flex items-center space-x-2 py-1 text-green-300/70 hover:bg-green-400/5 transition-colors"
                              >
                                <span className="text-green-400/40">├─</span>
                                <span className="text-blue-400/50">
                                  <Video className="w-5 h-5" />
                                </span>
                                <span className="text-sm">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Footer info */}
                      <div className="border-t border-green-400/20 pt-3 mt-4">
                        <div className="text-green-400/60 text-xs">
                          Total: {module.curriculum.length} folders,{" "}
                          {module.curriculum.reduce(
                            (acc, section) => acc + section.topics.length,
                            0
                          )}{" "}
                          files
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Labs Tab */}
                <TabsContent value="labs" className="mt-0">
                  <div className="grid gap-4">
                    {module.labs.map((lab, index) => (
                      <div
                        key={index}
                        className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300"
                      >
                        <div className="bg-yellow-400/10 border-b border-yellow-400/20 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div className="text-yellow-400 font-mono text-sm font-bold flex items-center">
                              <div className="w-6 h-6 rounded bg-yellow-400/20 border border-yellow-400 flex items-center justify-center mr-3">
                                <span className="text-xs font-bold">
                                  {(index + 1).toString().padStart(2, "0")}
                                </span>
                              </div>
                              {lab.name.toUpperCase()}
                            </div>
                            <div className="flex items-center space-x-3">
                              <div
                                className={`px-2 py-1 rounded text-xs font-mono ${getDifficultyColor(
                                  lab.difficulty
                                )}`}
                              >
                                {lab.difficulty.toUpperCase()}
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-green-300/70 font-mono">
                                <Clock className="w-3 h-3" />
                                <span>{lab.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-green-300/80 mb-4 text-sm leading-relaxed">
                            {lab.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {lab.skills.map((skill, skillIndex) => (
                              <div
                                key={skillIndex}
                                className="bg-blue-400/10 border border-blue-400/30 rounded px-2 py-1 text-xs text-blue-400 font-mono"
                              >
                                #{skill.toLowerCase().replace(/\s+/g, "_")}
                              </div>
                            ))}
                          </div>
                          {enrollmentStatus === "enrolled" ? (
                            <Button
                              size="sm"
                              className="bg-yellow-400 text-black hover:bg-yellow-300 font-mono"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              START_LAB
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <div className="bg-red-400/10 border border-red-400/20 rounded p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Lock className="w-4 h-4 text-red-400" />
                                  <span className="text-red-400 font-mono text-xs font-bold">
                                    ENROLLMENT_REQUIRED
                                  </span>
                                </div>
                                <p className="text-red-300/80 text-xs font-mono">
                                  This lab requires course enrollment to access
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={handleEnrollment}
                                className="bg-green-400 text-black hover:bg-green-300 font-mono"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                ENROLL_TO_ACCESS
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Games Tab */}
                <TabsContent value="games" className="mt-0">
                  <div className="grid gap-4 md:grid-cols-2">
                    {module.games.map((game, index) => (
                      <div
                        key={index}
                        className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300"
                      >
                        <div className="bg-red-400/10 border-b border-red-400/20 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div className="text-red-400 font-mono text-sm font-bold flex items-center">
                              <div className="w-6 h-6 rounded bg-red-400/20 border border-red-400 flex items-center justify-center mr-3">
                                <span className="text-xs font-bold">
                                  {(index + 1).toString().padStart(2, "0")}
                                </span>
                              </div>
                              {game.name.toUpperCase()}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="bg-yellow-400/20 border border-yellow-400 rounded px-2 py-1 text-yellow-400 text-xs font-mono">
                                {game.points} PTS
                              </div>
                              <div className="bg-purple-400/20 border border-purple-400 rounded px-2 py-1 text-purple-400 text-xs font-mono">
                                {game.type.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-green-300/80 mb-4 text-sm leading-relaxed">
                            {game.description}
                          </p>
                          {enrollmentStatus === "enrolled" ? (
                            <Button
                              size="sm"
                              className="bg-red-400 text-black hover:bg-red-300 font-mono"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              PLAY_GAME
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <div className="bg-red-400/10 border border-red-400/20 rounded p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Lock className="w-4 h-4 text-red-400" />
                                  <span className="text-red-400 font-mono text-xs font-bold">
                                    ENROLLMENT_REQUIRED
                                  </span>
                                </div>
                                <p className="text-red-300/80 text-xs font-mono">
                                  This game requires course enrollment to access
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={handleEnrollment}
                                className="bg-green-400 text-black hover:bg-green-300 font-mono"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                ENROLL_TO_ACCESS
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Assets Tab */}
                <TabsContent value="assets" className="mt-0">
                  <div className="grid gap-3">
                    {module.assets.map((asset, index) => (
                      <div
                        key={index}
                        className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-green-400/10 border border-green-400/30 rounded flex items-center justify-center">
                                {getFileTypeIcon(asset.type)}
                              </div>
                              <div>
                                <div className="font-medium text-green-400 text-sm font-mono">
                                  {asset.name}
                                </div>
                                <div className="text-xs text-green-300/70 font-mono">
                                  {asset.type.toUpperCase()} • {asset.size}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-400 hover:bg-green-400/10 border border-green-400/30 font-mono"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              DOWNLOAD
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-green-400/20 py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Terminal className="w-6 h-6 text-green-400" />
            <span className="font-bold text-green-400">CyberSec Academy</span>
          </div>
          <div className="text-green-300/60 text-sm">
            © 2024 CyberSec Academy. All rights reserved. Hack responsibly.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetailPage;
