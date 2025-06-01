/**
 * Unified Content Seed Data
 * Contains all content types (videos, labs, games, documents) for all modules
 * Uses string moduleId references that will be converted to ObjectIds during seeding
 */

const CONTENT_DATA = [
  // ===================================================================
  // BEGINNER PHASE CONTENT
  // ===================================================================

  // Cybersecurity Fundamentals (foundations)
  {
    moduleId: "foundations", // Will be converted to ObjectId during seeding
    type: "video",
    title: "Introduction to Cybersecurity",
    description:
      "Learn the fundamentals of cybersecurity and why it matters in today's digital world",
    url: "https://example.com/videos/cybersec-intro",
    section: "Introduction",
    duration: 15,
    metadata: {
      difficulty: "beginner",
      tags: ["introduction", "fundamentals", "overview"],
      thumbnail: "/images/cybersec-intro.jpg",
    },
  },
  {
    moduleId: "foundations",
    type: "video",
    title: "CIA Triad Explained",
    description:
      "Understanding Confidentiality, Integrity, and Availability principles",
    url: "https://example.com/videos/cia-triad",
    section: "Core Concepts",
    duration: 12,
    metadata: {
      difficulty: "beginner",
      tags: ["cia-triad", "principles", "security"],
    },
  },
  {
    moduleId: "foundations",
    type: "lab",
    title: "Password Security Lab",
    description:
      "Hands-on practice with password security techniques and tools",
    instructions:
      "In this lab, you'll learn to:\n1. Create strong passwords using best practices\n2. Test password strength using security tools\n3. Implement multi-factor authentication\n4. Use password managers effectively\n\nComplete each section and record your findings.",
    section: "Password Security",
    duration: 30,
    metadata: {
      difficulty: "beginner",
      tools: ["password-checker", "hash-generator", "mfa-simulator"],
      objectives: ["password-creation", "strength-testing", "mfa-setup"],
    },
  },
  {
    moduleId: "foundations",
    type: "game",
    title: "Phishing Detection Challenge",
    description: "Interactive game to identify and analyze phishing attempts",
    instructions:
      "Test your skills in identifying phishing emails and websites:\n1. Analyze suspicious emails for red flags\n2. Check website URLs for legitimacy\n3. Identify social engineering tactics\n4. Score points for correct identifications\n\nGoal: Achieve 80% accuracy to unlock the next level!",
    section: "Threat Recognition",
    duration: 20,
    metadata: {
      difficulty: "beginner",
      scoring: { correct: 10, incorrect: -5, bonus: 15 },
      levels: 5,
      gameType: "identification",
    },
  },

  // Linux Command Line Basics (linux-basics)
  {
    moduleId: "linux-basics",
    type: "video",
    title: "Linux Command Line Introduction",
    description: "Getting started with the Linux terminal and basic navigation",
    url: "https://example.com/videos/linux-intro",
    section: "Getting Started",
    duration: 18,
    metadata: {
      difficulty: "beginner",
      tags: ["linux", "terminal", "navigation"],
    },
  },
  {
    moduleId: "linux-basics",
    type: "lab",
    title: "File Operations Lab",
    description: "Practice essential file and directory operations in Linux",
    instructions:
      "Complete the following file operations:\n1. Navigate the filesystem using cd, ls, pwd\n2. Create, copy, move, and delete files\n3. Set file permissions using chmod\n4. Search for files using find and grep\n\nDocument each command and its output.",
    section: "File Management",
    duration: 45,
    metadata: {
      difficulty: "beginner",
      tools: ["terminal", "file-system"],
      commands: ["cd", "ls", "cp", "mv", "rm", "chmod", "find", "grep"],
    },
  },
  {
    moduleId: "linux-basics",
    type: "game",
    title: "Linux Command Challenge",
    description:
      "Test your Linux command knowledge in this interactive challenge",
    instructions:
      "Complete Linux tasks using the correct commands:\n1. Navigate to specific directories\n2. Find hidden files and directories\n3. Execute commands with proper syntax\n4. Chain commands using pipes and redirects\n\nComplete all challenges within the time limit!",
    section: "Command Mastery",
    duration: 25,
    metadata: {
      difficulty: "beginner",
      scoring: { taskComplete: 20, timeBonus: 10, perfectRun: 50 },
      challenges: 10,
      gameType: "command-execution",
    },
  },

  // Networking Fundamentals (networking-basics)
  {
    moduleId: "networking-basics",
    type: "video",
    title: "Network Protocols Overview",
    description:
      "Understanding TCP/IP, HTTP, DNS, and other essential protocols",
    url: "https://example.com/videos/network-protocols",
    section: "Protocol Fundamentals",
    duration: 22,
    metadata: {
      difficulty: "beginner",
      tags: ["protocols", "tcp-ip", "http", "dns"],
    },
  },
  {
    moduleId: "networking-basics",
    type: "lab",
    title: "Network Traffic Analysis with Wireshark",
    description: "Analyze network traffic and understand packet structures",
    instructions:
      "Use Wireshark to analyze network traffic:\n1. Capture live network traffic\n2. Filter packets by protocol (HTTP, HTTPS, DNS)\n3. Analyze packet headers and payload\n4. Identify suspicious network activity\n\nCreate a report of your findings.",
    section: "Traffic Analysis",
    duration: 50,
    metadata: {
      difficulty: "beginner",
      tools: ["wireshark", "network-capture"],
      protocols: ["http", "https", "dns", "tcp", "udp"],
    },
  },

  // ===================================================================
  // INTERMEDIATE PHASE CONTENT
  // ===================================================================

  // Penetration Testing Fundamentals (penetration-testing)
  {
    moduleId: "penetration-testing",
    type: "video",
    title: "Penetration Testing Methodology",
    description:
      "Learn the systematic approach to ethical hacking and penetration testing",
    url: "https://example.com/videos/pentest-methodology",
    section: "Methodology",
    duration: 25,
    metadata: {
      difficulty: "intermediate",
      tags: ["methodology", "ethical-hacking", "pentest"],
    },
  },
  {
    moduleId: "penetration-testing",
    type: "lab",
    title: "Network Scanning with Nmap",
    description: "Master network reconnaissance using Nmap scanning techniques",
    instructions:
      "Perform comprehensive network reconnaissance:\n1. Discover live hosts on the network\n2. Identify open ports and services\n3. Perform OS detection and version scanning\n4. Use stealth scanning techniques\n5. Generate detailed scan reports\n\nEthical note: Only scan networks you own or have permission to test.",
    section: "Reconnaissance",
    duration: 60,
    metadata: {
      difficulty: "intermediate",
      tools: ["nmap", "network-scanner"],
      techniques: [
        "host-discovery",
        "port-scanning",
        "os-detection",
        "stealth-scan",
      ],
    },
  },
  {
    moduleId: "penetration-testing",
    type: "game",
    title: "Vulnerability Assessment Challenge",
    description:
      "Identify and prioritize security vulnerabilities in simulated environments",
    instructions:
      "Conduct vulnerability assessments on virtual targets:\n1. Scan for common vulnerabilities (OWASP Top 10)\n2. Analyze vulnerability severity and impact\n3. Prioritize findings based on risk assessment\n4. Develop remediation recommendations\n\nScore points for accurate vulnerability identification and risk assessment.",
    section: "Vulnerability Assessment",
    duration: 40,
    metadata: {
      difficulty: "intermediate",
      scoring: { vulnFound: 25, riskAssessment: 15, remediation: 10 },
      vulnerabilities: ["sql-injection", "xss", "csrf", "insecure-auth"],
      gameType: "assessment-simulation",
    },
  },

  // Advanced Network Security (advanced-networking)
  {
    moduleId: "advanced-networking",
    type: "video",
    title: "Network Monitoring and IDS/IPS",
    description:
      "Understanding network monitoring, intrusion detection, and prevention systems",
    url: "https://example.com/videos/network-monitoring",
    section: "Monitoring & Detection",
    duration: 30,
    metadata: {
      difficulty: "intermediate",
      tags: ["monitoring", "ids", "ips", "detection"],
    },
  },
  {
    moduleId: "advanced-networking",
    type: "lab",
    title: "Intrusion Detection with Snort",
    description: "Configure and manage Snort IDS for network threat detection",
    instructions:
      "Set up and configure Snort IDS:\n1. Install and configure Snort rules\n2. Monitor network traffic for intrusions\n3. Analyze Snort alerts and logs\n4. Create custom detection rules\n5. Tune rules to reduce false positives\n\nDocument your configuration and findings.",
    section: "Intrusion Detection",
    duration: 75,
    metadata: {
      difficulty: "intermediate",
      tools: ["snort", "ids", "rule-engine"],
      concepts: ["signature-detection", "anomaly-detection", "alert-analysis"],
    },
  },

  // ===================================================================
  // ADVANCED PHASE CONTENT
  // ===================================================================

  // Advanced Penetration Testing (advanced-pentest)
  {
    moduleId: "advanced-pentest",
    type: "video",
    title: "Advanced Exploitation Techniques",
    description:
      "Master advanced exploitation methods and post-exploitation techniques",
    url: "https://example.com/videos/advanced-exploitation",
    section: "Advanced Exploitation",
    duration: 35,
    metadata: {
      difficulty: "advanced",
      tags: ["exploitation", "post-exploitation", "advanced"],
    },
  },
  {
    moduleId: "advanced-pentest",
    type: "lab",
    title: "Advanced Exploitation with Metasploit",
    description:
      "Use Metasploit framework for advanced penetration testing scenarios",
    instructions:
      "Master the Metasploit framework:\n1. Set up the Metasploit database\n2. Perform advanced vulnerability scanning\n3. Execute exploits against vulnerable targets\n4. Conduct post-exploitation activities\n5. Generate comprehensive penetration test reports\n\nComplete all exploitation scenarios ethically and document your methodology.",
    section: "Exploitation Framework",
    duration: 90,
    metadata: {
      difficulty: "advanced",
      tools: ["metasploit", "msfconsole", "meterpreter"],
      techniques: [
        "exploitation",
        "post-exploitation",
        "persistence",
        "privilege-escalation",
      ],
    },
  },

  // Incident Response (incident-response)
  {
    moduleId: "incident-response",
    type: "video",
    title: "Incident Response Framework",
    description:
      "Learn systematic approaches to cybersecurity incident response",
    url: "https://example.com/videos/incident-response",
    section: "Response Framework",
    duration: 28,
    metadata: {
      difficulty: "advanced",
      tags: ["incident-response", "framework", "methodology"],
    },
  },
  {
    moduleId: "incident-response",
    type: "lab",
    title: "Digital Forensics Analysis",
    description:
      "Conduct digital forensics investigation on compromised systems",
    instructions:
      "Perform digital forensics analysis:\n1. Create forensic images of compromised systems\n2. Analyze system logs and artifacts\n3. Recover deleted files and evidence\n4. Timeline reconstruction of the incident\n5. Prepare forensics report with findings\n\nMaintain chain of custody throughout the investigation.",
    section: "Forensics Investigation",
    duration: 120,
    metadata: {
      difficulty: "advanced",
      tools: ["autopsy", "volatility", "sleuthkit", "wireshark"],
      techniques: [
        "disk-imaging",
        "memory-analysis",
        "log-analysis",
        "timeline-reconstruction",
      ],
    },
  },
  {
    moduleId: "incident-response",
    type: "game",
    title: "Cyber Incident Response Simulation",
    description:
      "Lead an incident response team through a realistic cyber attack scenario",
    instructions:
      "Manage a cybersecurity incident from detection to resolution:\n1. Detect and classify the security incident\n2. Coordinate response team activities\n3. Contain and eradicate the threat\n4. Recover affected systems and data\n5. Conduct post-incident analysis\n\nMake critical decisions under pressure while minimizing business impact.",
    section: "Incident Simulation",
    duration: 60,
    metadata: {
      difficulty: "advanced",
      scoring: {
        responseTime: 30,
        containment: 25,
        recovery: 20,
        analysis: 15,
      },
      scenarios: ["ransomware", "data-breach", "insider-threat", "apt-attack"],
      gameType: "incident-management",
    },
  },
];

module.exports = { CONTENT_DATA };
