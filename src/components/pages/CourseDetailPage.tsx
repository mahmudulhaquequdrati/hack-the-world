import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Network,
  Play,
  Shield,
  Star,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [enrollmentStatus, setEnrollmentStatus] = useState("not-enrolled");

  // Cybersecurity modules data
  const moduleData = {
    foundations: {
      title: "Cybersecurity Foundations",
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
        "Threat Modeling",
        "Security Policies",
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
        "Understand core cybersecurity principles",
        "Implement risk assessment methodologies",
        "Apply security frameworks effectively",
        "Develop comprehensive security policies",
        "Navigate compliance requirements",
        "Design threat modeling strategies",
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
        {
          name: "Incident Response Plan Template",
          type: "Word",
          size: "2.4 MB",
        },
        { name: "Security Metrics Dashboard", type: "Excel", size: "3.7 MB" },
        {
          name: "Regulatory Compliance Checklist",
          type: "PDF",
          size: "1.9 MB",
        },
      ],
    },
    linux: {
      title: "Linux Command Line Mastery",
      description:
        "Master the terminal, file systems, and command-line tools essential for cybersecurity professionals.",
      category: "System Administration",
      difficulty: "Beginner",
      duration: "3-4 weeks",
      lessons: 20,
      rating: 4.8,
      students: 12340,
      price: "Free",
      icon: Terminal,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
      progress: 70,
      labsCount: 8,
      gamesCount: 4,
      assetsCount: 18,
      enrollPath: "/learn/linux",
      skills: [
        "Command Line",
        "File Systems",
        "Process Management",
        "Shell Scripting",
        "User Management",
        "Log Analysis",
      ],
      prerequisites: "Cybersecurity Foundations",
      certification: true,
      instructor: {
        name: "Marcus Rodriguez",
        title: "Senior Linux Administrator",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
        experience: "12+ years in Linux administration",
      },
      curriculum: [
        {
          title: "Linux Fundamentals",
          lessons: 5,
          duration: "2h",
          topics: [
            "Linux History",
            "Distributions",
            "File System Hierarchy",
            "Basic Commands",
          ],
          completed: true,
        },
        {
          title: "File Operations & Permissions",
          lessons: 5,
          duration: "2h 30min",
          topics: ["File Management", "Permissions", "Ownership", "ACLs"],
          completed: true,
        },
        {
          title: "Process & Service Management",
          lessons: 4,
          duration: "1h 45min",
          topics: ["Process Control", "Systemd", "Cron Jobs", "Log Management"],
          completed: false,
        },
        {
          title: "Network & Security Tools",
          lessons: 6,
          duration: "3h",
          topics: ["Network Commands", "SSH", "Firewall", "Security Hardening"],
          completed: false,
        },
      ],
      learningOutcomes: [
        "Navigate Linux systems with confidence",
        "Manage files, users, and permissions",
        "Monitor and control system processes",
        "Write effective shell scripts",
        "Configure network services securely",
        "Analyze system logs for security events",
      ],
      labs: [
        {
          name: "Terminal Navigation Challenge",
          description: "Master file system navigation and basic commands",
          difficulty: "Beginner",
          duration: "30 min",
          skills: ["Navigation", "File Operations"],
        },
        {
          name: "Permission Puzzle",
          description: "Configure complex file permissions and ownership",
          difficulty: "Beginner",
          duration: "45 min",
          skills: ["Permissions", "Security"],
        },
        {
          name: "Process Management Lab",
          description: "Monitor, control, and troubleshoot system processes",
          difficulty: "Intermediate",
          duration: "60 min",
          skills: ["Process Control", "Troubleshooting"],
        },
        {
          name: "Shell Scripting Workshop",
          description: "Create automation scripts for common tasks",
          difficulty: "Intermediate",
          duration: "90 min",
          skills: ["Scripting", "Automation"],
        },
        {
          name: "System Hardening Exercise",
          description: "Secure a Linux system against common threats",
          difficulty: "Advanced",
          duration: "120 min",
          skills: ["Security", "Hardening"],
        },
        {
          name: "Log Analysis Challenge",
          description: "Analyze system logs to identify security incidents",
          difficulty: "Advanced",
          duration: "75 min",
          skills: ["Log Analysis", "Incident Response"],
        },
        {
          name: "Network Configuration Lab",
          description: "Configure network services and firewall rules",
          difficulty: "Advanced",
          duration: "105 min",
          skills: ["Networking", "Security"],
        },
        {
          name: "Forensics Simulation",
          description: "Conduct digital forensics on a compromised system",
          difficulty: "Expert",
          duration: "150 min",
          skills: ["Forensics", "Investigation"],
        },
      ],
      games: [
        {
          name: "Command Line Race",
          description: "Speed challenge for common Linux commands",
          points: 100,
          type: "Speed",
        },
        {
          name: "Permission Puzzle Master",
          description: "Solve complex file permission scenarios",
          points: 150,
          type: "Puzzle",
        },
        {
          name: "Script Builder Challenge",
          description: "Build automation scripts to solve problems",
          points: 200,
          type: "Creation",
        },
        {
          name: "System Admin Simulator",
          description: "Manage a virtual data center",
          points: 300,
          type: "Simulation",
        },
      ],
      assets: [
        { name: "Linux Command Reference Sheet", type: "PDF", size: "1.8 MB" },
        { name: "File Permission Calculator", type: "HTML", size: "245 KB" },
        { name: "Shell Scripting Templates", type: "ZIP", size: "2.4 MB" },
        { name: "System Hardening Checklist", type: "PDF", size: "1.1 MB" },
        { name: "Log Analysis Tools Collection", type: "ZIP", size: "15.2 MB" },
        { name: "Network Configuration Examples", type: "TXT", size: "890 KB" },
        { name: "Cron Job Generator", type: "HTML", size: "156 KB" },
        { name: "Linux Security Best Practices", type: "PDF", size: "3.4 MB" },
        { name: "Process Monitoring Scripts", type: "ZIP", size: "1.7 MB" },
        { name: "SSH Configuration Guide", type: "PDF", size: "2.2 MB" },
        { name: "Firewall Rules Templates", type: "TXT", size: "445 KB" },
        {
          name: "System Performance Tuning Guide",
          type: "PDF",
          size: "4.1 MB",
        },
        { name: "Backup and Recovery Scripts", type: "ZIP", size: "3.8 MB" },
        { name: "Linux Forensics Toolkit", type: "ZIP", size: "28.6 MB" },
        { name: "Package Management Cheat Sheet", type: "PDF", size: "675 KB" },
        { name: "Service Configuration Examples", type: "ZIP", size: "5.2 MB" },
        { name: "Troubleshooting Flowcharts", type: "PDF", size: "2.9 MB" },
        { name: "Advanced Bash Techniques", type: "PDF", size: "3.6 MB" },
      ],
    },
    networking: {
      title: "Network Security & Analysis",
      description:
        "Understand network protocols, scanning, and monitoring essential for cybersecurity.",
      category: "Network Security",
      difficulty: "Intermediate",
      duration: "4-5 weeks",
      lessons: 25,
      rating: 4.7,
      students: 9850,
      price: "$29",
      icon: Network,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30",
      progress: 45,
      labsCount: 12,
      gamesCount: 6,
      assetsCount: 25,
      enrollPath: "/learn/networking",
      skills: [
        "TCP/IP",
        "Wireshark",
        "Port Scanning",
        "Network Defense",
        "Packet Analysis",
        "Network Forensics",
      ],
      prerequisites: "Cybersecurity Foundations, Linux Command Line Mastery",
      certification: true,
      instructor: {
        name: "Dr. Emily Watson",
        title: "Network Security Specialist",
        avatar:
          "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150",
        experience: "10+ years in network security",
      },
      curriculum: [
        {
          title: "Network Fundamentals",
          lessons: 6,
          duration: "3h",
          topics: ["OSI Model", "TCP/IP Stack", "Subnetting", "Routing"],
          completed: true,
        },
        {
          title: "Network Scanning & Reconnaissance",
          lessons: 7,
          duration: "3h 30min",
          topics: [
            "Port Scanning",
            "Network Discovery",
            "Banner Grabbing",
            "OS Fingerprinting",
          ],
          completed: false,
        },
        {
          title: "Packet Analysis & Monitoring",
          lessons: 6,
          duration: "3h",
          topics: [
            "Wireshark",
            "tcpdump",
            "Network Forensics",
            "Protocol Analysis",
          ],
          completed: false,
        },
        {
          title: "Network Defense & Security",
          lessons: 6,
          duration: "2h 45min",
          topics: ["Firewalls", "IDS/IPS", "VPNs", "Network Segmentation"],
          completed: false,
        },
      ],
      learningOutcomes: [
        "Understand network protocols deeply",
        "Perform network reconnaissance and scanning",
        "Analyze network traffic with Wireshark",
        "Implement network security controls",
        "Detect and respond to network attacks",
        "Design secure network architectures",
      ],
      labs: [
        {
          name: "Network Topology Discovery",
          description: "Map network infrastructure",
          difficulty: "Beginner",
          duration: "45 min",
          skills: ["Network Discovery", "Mapping"],
        },
        {
          name: "Port Scanning Workshop",
          description: "Master Nmap and scanning techniques",
          difficulty: "Beginner",
          duration: "60 min",
          skills: ["Port Scanning", "Reconnaissance"],
        },
        {
          name: "Wireshark Deep Dive",
          description: "Advanced packet analysis techniques",
          difficulty: "Intermediate",
          duration: "90 min",
          skills: ["Packet Analysis", "Troubleshooting"],
        },
        {
          name: "Network Attack Simulation",
          description: "Detect and analyze network attacks",
          difficulty: "Intermediate",
          duration: "120 min",
          skills: ["Attack Detection", "Analysis"],
        },
        {
          name: "Firewall Configuration Lab",
          description: "Configure and test firewall rules",
          difficulty: "Intermediate",
          duration: "75 min",
          skills: ["Firewall", "Security"],
        },
        {
          name: "IDS/IPS Deployment",
          description: "Deploy and tune intrusion detection systems",
          difficulty: "Advanced",
          duration: "135 min",
          skills: ["IDS/IPS", "Monitoring"],
        },
        {
          name: "VPN Security Assessment",
          description: "Assess VPN configurations for security",
          difficulty: "Advanced",
          duration: "105 min",
          skills: ["VPN", "Assessment"],
        },
        {
          name: "Network Forensics Investigation",
          description: "Investigate a network security incident",
          difficulty: "Advanced",
          duration: "180 min",
          skills: ["Forensics", "Investigation"],
        },
        {
          name: "Wireless Security Testing",
          description: "Test wireless network security",
          difficulty: "Advanced",
          duration: "150 min",
          skills: ["Wireless", "Testing"],
        },
        {
          name: "Network Penetration Testing",
          description: "Conduct comprehensive network pentest",
          difficulty: "Expert",
          duration: "240 min",
          skills: ["Penetration Testing", "Assessment"],
        },
        {
          name: "SCADA Network Security",
          description: "Secure industrial control systems",
          difficulty: "Expert",
          duration: "165 min",
          skills: ["SCADA", "Industrial Security"],
        },
        {
          name: "Cloud Network Security",
          description: "Secure cloud network architectures",
          difficulty: "Expert",
          duration: "195 min",
          skills: ["Cloud Security", "Architecture"],
        },
      ],
      games: [
        {
          name: "Network Detective",
          description: "Solve network mysteries using packet analysis",
          points: 150,
          type: "Detective",
        },
        {
          name: "Firewall Fortress",
          description: "Build impenetrable network defenses",
          points: 200,
          type: "Strategy",
        },
        {
          name: "Packet Puzzle Master",
          description: "Decode complex network communications",
          points: 175,
          type: "Puzzle",
        },
        {
          name: "Network Scanner Pro",
          description: "Master network reconnaissance techniques",
          points: 125,
          type: "Skill",
        },
        {
          name: "Protocol Stack Challenge",
          description: "Navigate the OSI model layers",
          points: 100,
          type: "Educational",
        },
        {
          name: "Cyber Defense Command",
          description: "Command a network security operations center",
          points: 300,
          type: "Simulation",
        },
      ],
      assets: [
        { name: "Network Protocol Reference", type: "PDF", size: "5.2 MB" },
        { name: "Wireshark Filter Cheat Sheet", type: "PDF", size: "890 KB" },
        { name: "Nmap Command Reference", type: "PDF", size: "1.4 MB" },
        { name: "Network Security Checklist", type: "PDF", size: "2.1 MB" },
        { name: "Firewall Rules Templates", type: "TXT", size: "675 KB" },
        { name: "IDS/IPS Signature Database", type: "ZIP", size: "25.3 MB" },
        { name: "Network Diagram Templates", type: "ZIP", size: "3.8 MB" },
        { name: "Packet Capture Samples", type: "ZIP", size: "45.6 MB" },
        { name: "Network Troubleshooting Guide", type: "PDF", size: "4.3 MB" },
        { name: "VPN Configuration Examples", type: "ZIP", size: "2.7 MB" },
        { name: "Wireless Security Tools", type: "ZIP", size: "18.9 MB" },
        { name: "Network Monitoring Scripts", type: "ZIP", size: "3.2 MB" },
        { name: "Subnetting Calculator", type: "HTML", size: "234 KB" },
        { name: "Network Discovery Tools", type: "ZIP", size: "12.5 MB" },
        { name: "Protocol Analyzers Collection", type: "ZIP", size: "67.8 MB" },
        { name: "Network Security Policies", type: "ZIP", size: "4.1 MB" },
        { name: "Incident Response Playbooks", type: "PDF", size: "6.7 MB" },
        { name: "Network Architecture Patterns", type: "PDF", size: "8.3 MB" },
        { name: "Cloud Networking Guide", type: "PDF", size: "5.9 MB" },
        { name: "IoT Security Framework", type: "PDF", size: "3.4 MB" },
        { name: "Network Forensics Toolkit", type: "ZIP", size: "89.2 MB" },
        {
          name: "Security Orchestration Templates",
          type: "ZIP",
          size: "7.6 MB",
        },
        {
          name: "Network Performance Baselines",
          type: "Excel",
          size: "2.8 MB",
        },
        { name: "Threat Intelligence Feeds", type: "JSON", size: "12.1 MB" },
        { name: "Zero Trust Architecture Guide", type: "PDF", size: "4.5 MB" },
      ],
    },
    "web-security": {
      title: "Web Application Security",
      description:
        "Discover and exploit web vulnerabilities ethically using industry-standard tools and techniques.",
      category: "Web Security",
      difficulty: "Intermediate",
      duration: "5-6 weeks",
      lessons: 30,
      rating: 4.9,
      students: 11200,
      price: "$39",
      icon: Globe,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/30",
      progress: 30,
      labsCount: 15,
      gamesCount: 8,
      assetsCount: 30,
      enrollPath: "/learn/web-security",
      skills: [
        "OWASP Top 10",
        "SQL Injection",
        "XSS",
        "Authentication Bypass",
        "Burp Suite",
        "Web Penetration Testing",
      ],
      prerequisites: "Cybersecurity Foundations, Network Security & Analysis",
      certification: true,
      instructor: {
        name: "Jake Thompson",
        title: "Senior Web Security Researcher",
        avatar:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
        experience: "8+ years in web application security",
      },
      curriculum: [
        {
          title: "Web Security Fundamentals",
          lessons: 8,
          duration: "4h",
          topics: [
            "Web Architecture",
            "HTTP/HTTPS",
            "OWASP Top 10",
            "Common Vulnerabilities",
          ],
          completed: true,
        },
        {
          title: "Injection Attacks",
          lessons: 8,
          duration: "4h 30min",
          topics: [
            "SQL Injection",
            "NoSQL Injection",
            "Command Injection",
            "LDAP Injection",
          ],
          completed: false,
        },
        {
          title: "Cross-Site Attacks",
          lessons: 7,
          duration: "3h 45min",
          topics: ["XSS Variants", "CSRF", "Clickjacking", "DOM Manipulation"],
          completed: false,
        },
        {
          title: "Advanced Web Attacks",
          lessons: 7,
          duration: "4h 15min",
          topics: ["XXE", "SSRF", "Deserialization", "Authentication Bypass"],
          completed: false,
        },
      ],
      learningOutcomes: [
        "Master OWASP Top 10 vulnerabilities",
        "Perform advanced SQL injection attacks",
        "Execute comprehensive XSS exploitation",
        "Use Burp Suite professionally",
        "Conduct web application penetration testing",
        "Implement secure coding practices",
      ],
      labs: [
        {
          name: "DVWA Fundamentals",
          description: "Practice on Damn Vulnerable Web Application",
          difficulty: "Beginner",
          duration: "60 min",
          skills: ["Basic Web Attacks", "Tool Usage"],
        },
        {
          name: "SQL Injection Mastery",
          description: "Advanced SQL injection techniques",
          difficulty: "Intermediate",
          duration: "90 min",
          skills: ["SQL Injection", "Database Exploitation"],
        },
        {
          name: "XSS Laboratory",
          description: "Comprehensive cross-site scripting practice",
          difficulty: "Intermediate",
          duration: "75 min",
          skills: ["XSS", "Client-side Attacks"],
        },
        {
          name: "Authentication Bypass Workshop",
          description: "Break authentication mechanisms",
          difficulty: "Intermediate",
          duration: "105 min",
          skills: ["Authentication", "Session Management"],
        },
        {
          name: "Burp Suite Mastery",
          description: "Advanced Burp Suite techniques",
          difficulty: "Advanced",
          duration: "120 min",
          skills: ["Burp Suite", "Web Testing"],
        },
        {
          name: "API Security Testing",
          description: "Test REST and GraphQL APIs",
          difficulty: "Advanced",
          duration: "135 min",
          skills: ["API Security", "Testing"],
        },
        {
          name: "Business Logic Flaws",
          description: "Identify and exploit business logic issues",
          difficulty: "Advanced",
          duration: "150 min",
          skills: ["Logic Flaws", "Analysis"],
        },
        {
          name: "File Upload Exploitation",
          description: "Exploit file upload vulnerabilities",
          difficulty: "Advanced",
          duration: "90 min",
          skills: ["File Upload", "Exploitation"],
        },
        {
          name: "SSRF & XXE Workshop",
          description: "Server-side request forgery and XML attacks",
          difficulty: "Advanced",
          duration: "165 min",
          skills: ["SSRF", "XXE"],
        },
        {
          name: "Web Application Firewall Bypass",
          description: "Bypass WAF protections",
          difficulty: "Expert",
          duration: "180 min",
          skills: ["WAF Bypass", "Evasion"],
        },
        {
          name: "Full Web Penetration Test",
          description: "Comprehensive web application assessment",
          difficulty: "Expert",
          duration: "300 min",
          skills: ["Penetration Testing", "Reporting"],
        },
        {
          name: "Mobile Web Security",
          description: "Test mobile web applications",
          difficulty: "Expert",
          duration: "195 min",
          skills: ["Mobile Security", "Web Testing"],
        },
        {
          name: "Cloud Web Application Security",
          description: "Secure cloud-hosted web applications",
          difficulty: "Expert",
          duration: "210 min",
          skills: ["Cloud Security", "Web Applications"],
        },
        {
          name: "DevSecOps Integration",
          description: "Integrate security into CI/CD pipelines",
          difficulty: "Expert",
          duration: "240 min",
          skills: ["DevSecOps", "Automation"],
        },
        {
          name: "Zero-Day Discovery Simulation",
          description: "Discover new vulnerabilities",
          difficulty: "Expert",
          duration: "360 min",
          skills: ["Research", "Discovery"],
        },
      ],
      games: [
        {
          name: "SQL Injection Champion",
          description: "Master SQL injection challenges",
          points: 200,
          type: "Challenge",
        },
        {
          name: "XSS Hunter",
          description: "Find and exploit XSS vulnerabilities",
          points: 175,
          type: "Hunt",
        },
        {
          name: "Web App Fortress Breaker",
          description: "Break through web defenses",
          points: 250,
          type: "Strategy",
        },
        {
          name: "Burp Suite Ninja",
          description: "Master professional web testing tools",
          points: 225,
          type: "Skill",
        },
        {
          name: "OWASP Top 10 Master",
          description: "Conquer all OWASP vulnerabilities",
          points: 300,
          type: "Comprehensive",
        },
        {
          name: "Bug Bounty Simulator",
          description: "Hunt bugs like a professional",
          points: 400,
          type: "Simulation",
        },
        {
          name: "API Attack Academy",
          description: "Master API security testing",
          points: 275,
          type: "Specialized",
        },
        {
          name: "Web Pentest Pro",
          description: "Conduct professional penetration tests",
          points: 500,
          type: "Professional",
        },
      ],
      assets: [
        { name: "OWASP Top 10 Guide 2023", type: "PDF", size: "3.4 MB" },
        { name: "SQL Injection Cheat Sheet", type: "PDF", size: "1.8 MB" },
        { name: "XSS Payload Collection", type: "TXT", size: "2.3 MB" },
        { name: "Burp Suite Extensions Pack", type: "ZIP", size: "15.7 MB" },
        { name: "Web Security Testing Checklist", type: "PDF", size: "2.6 MB" },
        {
          name: "Vulnerable Web Applications Collection",
          type: "ZIP",
          size: "125.4 MB",
        },
        {
          name: "Authentication Bypass Techniques",
          type: "PDF",
          size: "4.1 MB",
        },
        { name: "Web Shell Collection", type: "ZIP", size: "8.9 MB" },
        { name: "HTTP Request Templates", type: "ZIP", size: "1.2 MB" },
        { name: "API Testing Tools", type: "ZIP", size: "22.6 MB" },
        { name: "Secure Coding Guidelines", type: "PDF", size: "5.8 MB" },
        { name: "Web Vulnerability Scanners", type: "ZIP", size: "89.3 MB" },
        { name: "Business Logic Testing Guide", type: "PDF", size: "3.7 MB" },
        { name: "Mobile Web Testing Tools", type: "ZIP", size: "34.5 MB" },
        { name: "WAF Bypass Techniques", type: "PDF", size: "6.2 MB" },
        { name: "Web Forensics Toolkit", type: "ZIP", size: "45.8 MB" },
        { name: "CSRF Protection Patterns", type: "PDF", size: "2.1 MB" },
        { name: "File Upload Security Guide", type: "PDF", size: "3.3 MB" },
        {
          name: "Session Management Best Practices",
          type: "PDF",
          size: "2.9 MB",
        },
        { name: "Web Application Firewall Rules", type: "ZIP", size: "7.4 MB" },
        { name: "HTTPS/TLS Configuration Guide", type: "PDF", size: "4.6 MB" },
        { name: "Client-side Security Controls", type: "PDF", size: "3.2 MB" },
        { name: "Web Security Headers Reference", type: "PDF", size: "1.5 MB" },
        {
          name: "Penetration Testing Report Templates",
          type: "ZIP",
          size: "5.1 MB",
        },
        { name: "DevSecOps Integration Guide", type: "PDF", size: "6.8 MB" },
        { name: "Bug Bounty Hunting Methodology", type: "PDF", size: "4.9 MB" },
        { name: "Web3 Security Fundamentals", type: "PDF", size: "7.3 MB" },
        { name: "GraphQL Security Testing", type: "PDF", size: "3.8 MB" },
        {
          name: "Microservices Security Patterns",
          type: "PDF",
          size: "5.4 MB",
        },
        { name: "Container Web Security", type: "PDF", size: "4.2 MB" },
      ],
    },
    "social-engineering": {
      title: "Social Engineering & OSINT",
      description:
        "Human psychology, information gathering, and awareness - the human element of cybersecurity.",
      category: "Social Engineering",
      difficulty: "Intermediate",
      duration: "3-4 weeks",
      lessons: 18,
      rating: 4.6,
      students: 7890,
      price: "$25",
      icon: Users,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
      progress: 15,
      labsCount: 10,
      gamesCount: 5,
      assetsCount: 20,
      enrollPath: "/learn/social-engineering",
      skills: [
        "OSINT Techniques",
        "Phishing",
        "Social Psychology",
        "Defense Strategies",
        "Information Gathering",
        "Human Hacking",
      ],
      prerequisites: "Cybersecurity Foundations",
      certification: true,
      instructor: {
        name: "Dr. Alex Rivera",
        title: "Social Engineering Specialist",
        avatar:
          "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150",
        experience: "9+ years in social engineering research",
      },
      curriculum: [
        {
          title: "Introduction to Social Engineering",
          lessons: 4,
          duration: "2h",
          topics: [
            "Psychology Basics",
            "Attack Vectors",
            "Human Vulnerabilities",
            "Ethics",
          ],
          completed: true,
        },
        {
          title: "OSINT & Information Gathering",
          lessons: 6,
          duration: "3h 15min",
          topics: [
            "OSINT Fundamentals",
            "Search Techniques",
            "Social Media Intelligence",
            "Data Correlation",
          ],
          completed: false,
        },
        {
          title: "Phishing & Pretexting",
          lessons: 4,
          duration: "2h 30min",
          topics: [
            "Email Phishing",
            "Vishing",
            "Smishing",
            "Pretexting Scenarios",
          ],
          completed: false,
        },
        {
          title: "Defense & Awareness",
          lessons: 4,
          duration: "2h 15min",
          topics: [
            "Awareness Training",
            "Defense Strategies",
            "Security Culture",
            "Incident Response",
          ],
          completed: false,
        },
      ],
      learningOutcomes: [
        "Master OSINT investigation techniques",
        "Understand human psychological vulnerabilities",
        "Develop effective phishing campaigns (ethically)",
        "Build comprehensive security awareness programs",
        "Implement social engineering defenses",
        "Conduct responsible disclosure and education",
      ],
      labs: [
        {
          name: "OSINT Investigation Challenge",
          description: "Gather intelligence on fictional targets",
          difficulty: "Beginner",
          duration: "90 min",
          skills: ["OSINT", "Investigation"],
        },
        {
          name: "Social Media Intelligence",
          description: "Extract information from social platforms",
          difficulty: "Beginner",
          duration: "75 min",
          skills: ["Social Media", "Intelligence"],
        },
        {
          name: "Phishing Email Analysis",
          description: "Analyze real phishing campaigns",
          difficulty: "Intermediate",
          duration: "60 min",
          skills: ["Email Analysis", "Detection"],
        },
        {
          name: "Pretext Development Workshop",
          description: "Create convincing social engineering pretexts",
          difficulty: "Intermediate",
          duration: "105 min",
          skills: ["Pretexting", "Psychology"],
        },
        {
          name: "Vishing Campaign Simulation",
          description: "Conduct ethical voice phishing exercises",
          difficulty: "Advanced",
          duration: "120 min",
          skills: ["Vishing", "Voice Communication"],
        },
        {
          name: "Physical Security Assessment",
          description: "Test physical security through social engineering",
          difficulty: "Advanced",
          duration: "180 min",
          skills: ["Physical Security", "Assessment"],
        },
        {
          name: "Awareness Training Development",
          description: "Create effective security awareness programs",
          difficulty: "Advanced",
          duration: "150 min",
          skills: ["Training Development", "Education"],
        },
        {
          name: "Incident Response Simulation",
          description: "Respond to social engineering attacks",
          difficulty: "Advanced",
          duration: "135 min",
          skills: ["Incident Response", "Management"],
        },
        {
          name: "Advanced OSINT Techniques",
          description: "Master advanced information gathering",
          difficulty: "Expert",
          duration: "240 min",
          skills: ["Advanced OSINT", "Correlation"],
        },
        {
          name: "Comprehensive SE Assessment",
          description: "Full social engineering penetration test",
          difficulty: "Expert",
          duration: "300 min",
          skills: ["Comprehensive Assessment", "Reporting"],
        },
      ],
      games: [
        {
          name: "OSINT Detective",
          description: "Solve mysteries using open source intelligence",
          points: 150,
          type: "Investigation",
        },
        {
          name: "Phishing Defense Master",
          description: "Identify and block phishing attempts",
          points: 125,
          type: "Defense",
        },
        {
          name: "Social Engineer Simulator",
          description: "Practice ethical social engineering",
          points: 200,
          type: "Simulation",
        },
        {
          name: "Human Psychology Challenge",
          description: "Understand psychological manipulation",
          points: 175,
          type: "Psychology",
        },
        {
          name: "Awareness Training Builder",
          description: "Create effective training programs",
          points: 250,
          type: "Creation",
        },
      ],
      assets: [
        { name: "OSINT Framework Guide", type: "PDF", size: "4.3 MB" },
        { name: "Social Engineering Toolkit", type: "ZIP", size: "25.6 MB" },
        { name: "Phishing Email Templates", type: "ZIP", size: "3.1 MB" },
        { name: "Psychology of Persuasion Guide", type: "PDF", size: "2.8 MB" },
        { name: "OSINT Tools Collection", type: "ZIP", size: "67.9 MB" },
        {
          name: "Social Media Investigation Guide",
          type: "PDF",
          size: "3.7 MB",
        },
        { name: "Pretext Scenarios Database", type: "PDF", size: "5.2 MB" },
        { name: "Awareness Training Materials", type: "ZIP", size: "89.4 MB" },
        { name: "Phishing Detection Checklist", type: "PDF", size: "1.4 MB" },
        { name: "HUMINT Collection Techniques", type: "PDF", size: "6.1 MB" },
        {
          name: "Social Engineering Defense Playbook",
          type: "PDF",
          size: "4.9 MB",
        },
        {
          name: "Digital Footprint Analysis Tools",
          type: "ZIP",
          size: "12.8 MB",
        },
        { name: "Behavioral Analysis Framework", type: "PDF", size: "3.3 MB" },
        { name: "Crisis Communication Templates", type: "ZIP", size: "2.7 MB" },
        {
          name: "Physical Security Assessment Guide",
          type: "PDF",
          size: "5.8 MB",
        },
        {
          name: "Insider Threat Detection Methods",
          type: "PDF",
          size: "4.1 MB",
        },
        {
          name: "Cultural Intelligence Framework",
          type: "PDF",
          size: "2.9 MB",
        },
        { name: "Ethical Hacking Guidelines", type: "PDF", size: "3.6 MB" },
        { name: "Information Warfare Tactics", type: "PDF", size: "7.2 MB" },
        { name: "Cognitive Security Measures", type: "PDF", size: "4.4 MB" },
      ],
    },
    "advanced-exploitation": {
      title: "Advanced Penetration Testing",
      description:
        "Advanced attack techniques and post-exploitation for expert-level cybersecurity professionals.",
      category: "Advanced Security",
      difficulty: "Advanced",
      duration: "6-8 weeks",
      lessons: 35,
      rating: 4.8,
      students: 3240,
      price: "$99",
      icon: Activity,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/30",
      progress: 0,
      labsCount: 20,
      gamesCount: 12,
      assetsCount: 45,
      enrollPath: "/learn/advanced-exploitation",
      skills: [
        "Buffer Overflows",
        "Privilege Escalation",
        "Lateral Movement",
        "Persistence",
        "Advanced Evasion",
        "Red Team Operations",
      ],
      prerequisites:
        "Linux Command Line Mastery, Network Security & Analysis, Web Application Security",
      certification: true,
      instructor: {
        name: "David Chen",
        title: "Principal Security Consultant",
        avatar:
          "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
        experience: "15+ years in advanced penetration testing",
      },
      curriculum: [
        {
          title: "Advanced Exploitation Fundamentals",
          lessons: 8,
          duration: "5h",
          topics: [
            "Exploit Development",
            "Memory Corruption",
            "Return-oriented Programming",
            "ASLR/DEP Bypass",
          ],
          completed: false,
        },
        {
          title: "Post-Exploitation Techniques",
          lessons: 9,
          duration: "6h",
          topics: [
            "Privilege Escalation",
            "Lateral Movement",
            "Persistence Mechanisms",
            "Data Exfiltration",
          ],
          completed: false,
        },
        {
          title: "Evasion & Anti-Forensics",
          lessons: 8,
          duration: "4h 30min",
          topics: [
            "AV Evasion",
            "Traffic Obfuscation",
            "Log Evasion",
            "Anti-Forensics",
          ],
          completed: false,
        },
        {
          title: "Red Team Operations",
          lessons: 10,
          duration: "7h",
          topics: [
            "Campaign Planning",
            "C2 Infrastructure",
            "Team Coordination",
            "Objective Achievement",
          ],
          completed: false,
        },
      ],
      learningOutcomes: [
        "Develop custom exploits for buffer overflows",
        "Master advanced privilege escalation techniques",
        "Implement persistent access mechanisms",
        "Conduct sophisticated lateral movement",
        "Evade modern security controls",
        "Plan and execute red team operations",
      ],
      labs: [
        {
          name: "Buffer Overflow Workshop",
          description: "Develop working buffer overflow exploits",
          difficulty: "Advanced",
          duration: "180 min",
          skills: ["Exploit Development", "Assembly"],
        },
        {
          name: "Privilege Escalation Lab",
          description: "Escalate privileges on hardened systems",
          difficulty: "Advanced",
          duration: "150 min",
          skills: ["Privilege Escalation", "Enumeration"],
        },
        {
          name: "Lateral Movement Simulation",
          description: "Move through enterprise networks",
          difficulty: "Advanced",
          duration: "240 min",
          skills: ["Lateral Movement", "Network Navigation"],
        },
        {
          name: "Persistence Mechanisms",
          description: "Maintain access across reboots",
          difficulty: "Advanced",
          duration: "165 min",
          skills: ["Persistence", "Stealth"],
        },
        {
          name: "AV Evasion Workshop",
          description: "Bypass modern antivirus solutions",
          difficulty: "Expert",
          duration: "210 min",
          skills: ["AV Evasion", "Obfuscation"],
        },
        {
          name: "C2 Infrastructure Setup",
          description: "Build command and control infrastructure",
          difficulty: "Expert",
          duration: "300 min",
          skills: ["C2", "Infrastructure"],
        },
        {
          name: "Advanced Payloads",
          description: "Create sophisticated attack payloads",
          difficulty: "Expert",
          duration: "195 min",
          skills: ["Payload Development", "Evasion"],
        },
        {
          name: "Memory Forensics Evasion",
          description: "Evade memory analysis tools",
          difficulty: "Expert",
          duration: "180 min",
          skills: ["Memory Evasion", "Anti-Forensics"],
        },
        {
          name: "Kernel Exploitation",
          description: "Exploit kernel-level vulnerabilities",
          difficulty: "Expert",
          duration: "360 min",
          skills: ["Kernel Exploitation", "System Internals"],
        },
        {
          name: "Cloud Infrastructure Attack",
          description: "Attack cloud environments",
          difficulty: "Expert",
          duration: "270 min",
          skills: ["Cloud Attacks", "Infrastructure"],
        },
        {
          name: "Mobile Device Exploitation",
          description: "Exploit mobile platforms",
          difficulty: "Expert",
          duration: "225 min",
          skills: ["Mobile Exploitation", "Platform Security"],
        },
        {
          name: "IoT Device Hacking",
          description: "Hack Internet of Things devices",
          difficulty: "Expert",
          duration: "240 min",
          skills: ["IoT Security", "Embedded Systems"],
        },
        {
          name: "Zero-Day Development",
          description: "Develop original zero-day exploits",
          difficulty: "Master",
          duration: "480 min",
          skills: ["Zero-Day Research", "Vulnerability Discovery"],
        },
        {
          name: "Advanced Persistent Threat Simulation",
          description: "Simulate nation-state level attacks",
          difficulty: "Master",
          duration: "600 min",
          skills: ["APT Simulation", "Strategic Operations"],
        },
        {
          name: "Red Team Campaign",
          description: "Plan and execute full red team engagement",
          difficulty: "Master",
          duration: "720 min",
          skills: ["Red Team Operations", "Campaign Management"],
        },
        {
          name: "Purple Team Collaboration",
          description: "Work with blue team for defense improvement",
          difficulty: "Master",
          duration: "360 min",
          skills: ["Purple Team", "Collaborative Security"],
        },
        {
          name: "Threat Hunting Evasion",
          description: "Evade advanced threat hunting techniques",
          difficulty: "Master",
          duration: "300 min",
          skills: ["Threat Hunting Evasion", "Advanced Stealth"],
        },
        {
          name: "AI/ML Security Testing",
          description: "Test AI and machine learning systems",
          difficulty: "Master",
          duration: "420 min",
          skills: ["AI Security", "ML Exploitation"],
        },
        {
          name: "Blockchain Security Assessment",
          description: "Assess blockchain and DeFi security",
          difficulty: "Master",
          duration: "390 min",
          skills: ["Blockchain Security", "DeFi Testing"],
        },
        {
          name: "Quantum Computing Implications",
          description: "Understand quantum threats to cryptography",
          difficulty: "Master",
          duration: "240 min",
          skills: ["Quantum Security", "Cryptographic Futures"],
        },
      ],
      games: [
        {
          name: "Exploit Developer Challenge",
          description: "Create working exploits for vulnerabilities",
          points: 400,
          type: "Development",
        },
        {
          name: "Red Team Commander",
          description: "Lead red team operations",
          points: 500,
          type: "Strategy",
        },
        {
          name: "Stealth Master",
          description: "Achieve objectives without detection",
          points: 350,
          type: "Stealth",
        },
        {
          name: "Advanced Persistence Pro",
          description: "Maintain access through advanced techniques",
          points: 300,
          type: "Technical",
        },
        {
          name: "Evasion Specialist",
          description: "Bypass all security controls",
          points: 450,
          type: "Evasion",
        },
        {
          name: "Zero-Day Hunter",
          description: "Discover new vulnerabilities",
          points: 600,
          type: "Research",
        },
        {
          name: "APT Simulator",
          description: "Simulate advanced persistent threats",
          points: 750,
          type: "Simulation",
        },
        {
          name: "Cyber Warfare Academy",
          description: "Master nation-state level techniques",
          points: 1000,
          type: "Advanced Simulation",
        },
        {
          name: "Purple Team Coordinator",
          description: "Balance offense and defense",
          points: 550,
          type: "Collaboration",
        },
        {
          name: "Next-Gen Threat Lab",
          description: "Explore emerging threat vectors",
          points: 800,
          type: "Innovation",
        },
        {
          name: "Quantum Security Pioneer",
          description: "Prepare for quantum computing era",
          points: 900,
          type: "Future Tech",
        },
        {
          name: "Ultimate Pentest Master",
          description: "The most comprehensive security challenge",
          points: 1500,
          type: "Master Challenge",
        },
      ],
      assets: [
        {
          name: "Exploit Development Framework",
          type: "ZIP",
          size: "125.8 MB",
        },
        { name: "Shellcode Library", type: "ZIP", size: "45.3 MB" },
        { name: "Privilege Escalation Exploits", type: "ZIP", size: "89.7 MB" },
        { name: "Persistence Techniques Guide", type: "PDF", size: "8.9 MB" },
        { name: "AV Evasion Toolkit", type: "ZIP", size: "234.6 MB" },
        { name: "C2 Framework Collection", type: "ZIP", size: "456.2 MB" },
        { name: "Red Team Playbooks", type: "PDF", size: "15.7 MB" },
        { name: "Advanced Payload Generator", type: "ZIP", size: "67.4 MB" },
        { name: "Memory Exploitation Tools", type: "ZIP", size: "98.3 MB" },
        { name: "Kernel Exploitation Suite", type: "ZIP", size: "178.9 MB" },
        { name: "Cloud Attack Tools", type: "ZIP", size: "134.5 MB" },
        {
          name: "Mobile Exploitation Framework",
          type: "ZIP",
          size: "256.7 MB",
        },
        { name: "IoT Hacking Toolkit", type: "ZIP", size: "89.2 MB" },
        { name: "Zero-Day Research Methodology", type: "PDF", size: "12.4 MB" },
        { name: "APT Simulation Framework", type: "ZIP", size: "345.8 MB" },
        {
          name: "Purple Team Collaboration Guide",
          type: "PDF",
          size: "9.6 MB",
        },
        {
          name: "Threat Hunting Evasion Techniques",
          type: "PDF",
          size: "7.8 MB",
        },
        { name: "AI/ML Security Testing Tools", type: "ZIP", size: "167.3 MB" },
        { name: "Blockchain Security Toolkit", type: "ZIP", size: "78.9 MB" },
        {
          name: "Quantum Cryptography Resources",
          type: "PDF",
          size: "11.2 MB",
        },
        {
          name: "Advanced Forensics Anti-Tools",
          type: "ZIP",
          size: "123.7 MB",
        },
        {
          name: "Social Engineering for Red Teams",
          type: "PDF",
          size: "6.8 MB",
        },
        {
          name: "Physical Security Bypass Tools",
          type: "ZIP",
          size: "45.1 MB",
        },
        { name: "Network Pivoting Techniques", type: "PDF", size: "5.4 MB" },
        { name: "Data Exfiltration Methods", type: "PDF", size: "4.9 MB" },
        { name: "Incident Response Evasion", type: "PDF", size: "6.7 MB" },
        { name: "Advanced Covert Channels", type: "PDF", size: "8.3 MB" },
        { name: "Operational Security Guide", type: "PDF", size: "7.1 MB" },
        {
          name: "Intelligence Gathering Automation",
          type: "ZIP",
          size: "89.6 MB",
        },
        { name: "Custom Malware Development", type: "ZIP", size: "234.9 MB" },
        {
          name: "Steganography and Hiding Techniques",
          type: "ZIP",
          size: "56.8 MB",
        },
        {
          name: "Advanced Reconnaissance Tools",
          type: "ZIP",
          size: "145.7 MB",
        },
        { name: "Post-Exploitation Automation", type: "ZIP", size: "178.4 MB" },
        { name: "Red Team Infrastructure Guide", type: "PDF", size: "13.9 MB" },
        {
          name: "Advanced Persistent Threat Toolkit",
          type: "ZIP",
          size: "567.8 MB",
        },
        {
          name: "Cyber Warfare Simulation Platform",
          type: "ZIP",
          size: "789.3 MB",
        },
        { name: "Nation-State TTPs Database", type: "JSON", size: "45.6 MB" },
        {
          name: "Future Threat Vectors Research",
          type: "PDF",
          size: "16.8 MB",
        },
        {
          name: "Quantum-Safe Security Measures",
          type: "PDF",
          size: "14.2 MB",
        },
        {
          name: "Next-Generation Exploitation Techniques",
          type: "PDF",
          size: "18.7 MB",
        },
        {
          name: "Advanced Security Research Methodology",
          type: "PDF",
          size: "12.3 MB",
        },
        { name: "Cutting-Edge Defense Evasion", type: "ZIP", size: "345.2 MB" },
        {
          name: "Elite Penetration Testing Framework",
          type: "ZIP",
          size: "456.9 MB",
        },
        {
          name: "Master-Level Security Assessment Tools",
          type: "ZIP",
          size: "678.4 MB",
        },
        { name: "Ultimate Red Team Arsenal", type: "ZIP", size: "1.2 GB" },
      ],
    },
  };

  const module = moduleData[courseId as keyof typeof moduleData];

  if (!module) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Module Not Found</h1>
          <p className="text-green-300/80 mb-8">
            The requested cybersecurity module doesn't exist.
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="flex items-center space-x-4 mb-4">
                <div
                  className={`w-16 h-16 ${module.bgColor} ${module.borderColor} border-2 rounded-full flex items-center justify-center`}
                >
                  <module.icon className={`w-8 h-8 ${module.color}`} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-green-400 mb-2">
                    {module.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{module.rating}</span>
                    </div>
                    <span className="text-sm text-green-300/70">
                      {module.students.toLocaleString()} students
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-green-300/80 mb-4">{module.description}</p>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-xl font-bold ${module.color}`}>
                    {module.lessons}
                  </div>
                  <div className="text-xs text-green-300/70">Lessons</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${module.color}`}>
                    {module.labsCount}
                  </div>
                  <div className="text-xs text-green-300/70">Labs</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${module.color}`}>
                    {module.gamesCount}
                  </div>
                  <div className="text-xs text-green-300/70">Games</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${module.color}`}>
                    {module.assetsCount}
                  </div>
                  <div className="text-xs text-green-300/70">Assets</div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-400">
                  What You'll Learn:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {module.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-green-400/30 text-green-400"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Course Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className="bg-black/50 border-green-400/30">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-green-400 mb-1">
                      {module.lessons}
                    </div>
                    <div className="text-xs text-green-300/70">
                      Video Lessons
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-green-400/30">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-yellow-400 mb-1">
                      {module.labsCount}
                    </div>
                    <div className="text-xs text-green-300/70">
                      Hands-on Labs
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-green-400/30">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-red-400 mb-1">
                      {module.gamesCount}
                    </div>
                    <div className="text-xs text-green-300/70">
                      Interactive Games
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:col-span-2">
              {/* Course Info */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 text-lg">
                    Course Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300/70">Duration:</span>
                    <span className="text-green-400">{module.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-300/70">Price:</span>
                    <span className={`font-bold ${module.color}`}>
                      {module.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-300/70">Category:</span>
                    <span className="text-green-400">{module.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-300/70">Certificate:</span>
                    <span className="text-green-400">
                      {module.certification ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-green-400/20">
                    <span className="text-green-300/70 text-sm">
                      Prerequisites:
                    </span>
                    <p className="text-green-400 text-sm mt-1">
                      {module.prerequisites}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              {module.progress > 0 && (
                <Card className="bg-black/50 border-green-400/30 gap-1.5">
                  <CardHeader className="">
                    <CardTitle className="text-green-400 text-lg ">
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-300/70">Completed:</span>
                      <span className="text-green-400 font-bold">
                        {module.progress}%
                      </span>
                    </div>
                    <Progress
                      value={module.progress}
                      className="h-3 bg-black border border-green-400/30"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Enrollment Button */}
          <div className="mb-6">
            <Button
              onClick={handleEnrollment}
              size="lg"
              className="w-full bg-green-400 text-black hover:bg-green-300 font-medium"
            >
              <Play className="w-5 h-5 mr-2" />
              {enrollmentStatus === "not-enrolled"
                ? "Start Learning Now"
                : "Continue Course"}
            </Button>
          </div>

          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 bg-black/50 border-green-400/30">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="curriculum"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="labs"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                Labs
              </TabsTrigger>
              <TabsTrigger
                value="games"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                Games
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
              >
                Assets
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4">
              <div className="space-y-6">
                {/* Learning Outcomes */}
                <Card className="bg-black/50 border-green-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-400 flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      Learning Outcomes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-2">
                      {module.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-green-300/80 text-sm">
                            {outcome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="mt-4">
              <div className="space-y-3">
                {module.curriculum.map((section, index) => (
                  <Card key={index} className="bg-black/50 border-green-400/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-400 flex items-center">
                          <div className="w-6 h-6 rounded-full bg-green-400/20 border border-green-400 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>
                          {section.title}
                        </CardTitle>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 text-xs text-green-300/70">
                            <BookOpen className="w-3 h-3" />
                            <span>{section.lessons} lessons</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-green-300/70">
                            <Clock className="w-3 h-3" />
                            <span>{section.duration}</span>
                          </div>
                          {section.completed && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                        {section.topics.map((topic, topicIndex) => (
                          <Badge
                            key={topicIndex}
                            variant="outline"
                            className="text-xs border-green-400/30 text-green-400"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Labs Tab */}
            <TabsContent value="labs" className="mt-4">
              <div className="grid gap-4">
                {module.labs.map((lab, index) => (
                  <Card
                    key={index}
                    className="bg-black/50 border-green-400/30 hover:border-green-400 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-400 text-lg">
                          {lab.name}
                        </CardTitle>
                        <div className="flex items-center space-x-3">
                          <Badge className={getDifficultyColor(lab.difficulty)}>
                            {lab.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-green-300/70">
                            <Clock className="w-3 h-3" />
                            <span>{lab.duration}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-green-300/80 mb-3 text-sm">
                        {lab.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {lab.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="outline"
                            className="text-xs border-blue-400/30 text-blue-400"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Games Tab */}
            <TabsContent value="games" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {module.games.map((game, index) => (
                  <Card
                    key={index}
                    className="bg-black/50 border-green-400/30 hover:border-green-400 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-400 text-lg">
                          {game.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-400/20 text-yellow-400">
                            {game.points} pts
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-purple-400/30 text-purple-400"
                          >
                            {game.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-green-300/80 mb-3 text-sm">
                        {game.description}
                      </p>
                      <Button
                        size="sm"
                        className="bg-green-400 text-black hover:bg-green-300"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Game
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="mt-4">
              <div className="grid gap-3">
                {module.assets.map((asset, index) => (
                  <Card
                    key={index}
                    className="bg-black/50 border-green-400/30 hover:border-green-400 transition-colors"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-green-400">
                            {getFileTypeIcon(asset.type)}
                          </div>
                          <div>
                            <div className="font-medium text-green-400 text-sm">
                              {asset.name}
                            </div>
                            <div className="text-xs text-green-300/70">
                              {asset.type.toUpperCase()} • {asset.size}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-400/10"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
