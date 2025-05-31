const Module = require("../models/Module");
const Phase = require("../models/Phase");
const {
  generateModuleId,
  calculateModuleDuration,
  DEFAULT_CONTENT_DURATIONS,
} = require("./moduleHelpers");

/**
 * 🛡️ Hack The World - Updated Module Seed Data
 * Comprehensive cybersecurity learning modules with content tracking
 * ModuleIds are auto-generated from titles, durations are calculated from content
 */

const CYBERSECURITY_MODULES = [
  // 🟢 BEGINNER PHASE MODULES
  {
    // moduleId will be auto-generated from title: "cybersecurity-fundamentals"
    phaseId: "beginner",
    title: "Cybersecurity Fundamentals",
    description:
      "Essential concepts and terminology for cybersecurity beginners. Learn the CIA triad, threat landscape, and basic security principles.",
    icon: "Shield",
    // duration will be auto-calculated from content
    difficulty: "Beginner",
    color: "text-green-400",
    order: 1,
    topics: [
      "CIA Triad (Confidentiality, Integrity, Availability)",
      "Threat Landscape Overview",
      "Security Principles and Best Practices",
      "Risk Assessment Basics",
      "Security Terminology",
    ],
    content: {
      videos: [
        "cybersec-intro-001",
        "cia-triad-explained",
        "threat-landscape-2024",
      ],
      labs: ["basic-risk-assessment", "security-terminology-quiz"],
      games: ["cybersec-crossword", "threat-identification-game"],
      documents: ["cybersec-fundamentals-guide"],
    },
    prerequisites: [],
    learningOutcomes: [
      "Understand the fundamental principles of cybersecurity",
      "Identify common threats and vulnerabilities",
      "Apply basic risk assessment techniques",
    ],
  },

  {
    // moduleId will be auto-generated from title: "password-security"
    phaseId: "beginner",
    title: "Password Security & Authentication",
    description:
      "Master password security best practices, multi-factor authentication, and secure authentication methods.",
    icon: "Key",
    difficulty: "Beginner",
    color: "text-blue-400",
    order: 2,
    topics: [
      "Password Strength and Complexity",
      "Password Managers",
      "Multi-Factor Authentication (MFA)",
      "Biometric Authentication",
      "Common Password Attacks",
    ],
    content: {
      videos: [
        "password-best-practices",
        "mfa-setup-guide",
        "password-managers-comparison",
      ],
      labs: [
        "password-strength-tester",
        "mfa-setup-lab",
        "password-attack-simulation",
      ],
      games: ["password-cracking-game", "mfa-challenge"],
      documents: [],
    },
    prerequisites: [],
    learningOutcomes: [
      "Create and manage strong passwords",
      "Implement multi-factor authentication",
      "Recognize and prevent password attacks",
    ],
  },

  {
    // moduleId will be auto-generated from title: "network-security"
    phaseId: "beginner",
    title: "Network Security Basics",
    description:
      "Introduction to network protocols, firewalls, and basic network security concepts.",
    icon: "Network",
    difficulty: "Beginner",
    color: "text-purple-400",
    order: 3,
    topics: [
      "TCP/IP Protocol Stack",
      "Firewalls and Network Filtering",
      "VPNs and Encrypted Tunnels",
      "WiFi Security (WPA3, WEP vulnerabilities)",
      "Network Monitoring Basics",
    ],
    content: {
      videos: ["tcp-ip-explained", "firewall-configuration", "vpn-setup-guide"],
      labs: [
        "network-packet-analysis",
        "firewall-rules-lab",
        "wifi-security-audit",
      ],
      games: ["network-topology-puzzle", "firewall-configuration-challenge"],
      documents: [],
    },
    prerequisites: [],
    learningOutcomes: [
      "Understand basic network protocols and architecture",
      "Configure basic firewall rules",
      "Secure wireless networks",
    ],
  },

  {
    // moduleId will be auto-generated from title: "social-engineering"
    phaseId: "beginner",
    title: "Social Engineering & Human Factors",
    description:
      "Learn about social engineering attacks, human psychology in security, and defense strategies.",
    icon: "Users",
    difficulty: "Beginner",
    color: "text-orange-400",
    order: 4,
    topics: [
      "Social Engineering Tactics",
      "Phishing and Spear Phishing",
      "Pretexting and Baiting",
      "Physical Security Awareness",
      "Security Awareness Training",
    ],
    content: {
      videos: [
        "social-engineering-explained",
        "phishing-examples",
        "security-awareness-training",
      ],
      labs: ["phishing-identification-lab", "social-engineering-simulation"],
      games: ["phishing-detection-game", "social-engineering-scenarios"],
      documents: [],
    },
    prerequisites: [],
    learningOutcomes: [
      "Identify common social engineering tactics",
      "Recognize phishing attempts",
      "Implement security awareness measures",
    ],
  },

  // 🟡 INTERMEDIATE PHASE MODULES
  {
    // moduleId will be auto-generated from title: "penetration-testing"
    phaseId: "intermediate",
    title: "Penetration Testing Introduction",
    description:
      "Learn the fundamentals of ethical hacking and penetration testing methodologies.",
    icon: "Target",
    difficulty: "Intermediate",
    color: "text-red-400",
    order: 1,
    topics: [
      "Penetration Testing Methodology",
      "Information Gathering and Reconnaissance",
      "Vulnerability Assessment",
      "Exploitation Techniques",
      "Post-Exploitation and Reporting",
    ],
    content: {
      videos: [
        "pentest-methodology",
        "reconnaissance-techniques",
        "vulnerability-scanning",
      ],
      labs: [
        "nmap-scanning-lab",
        "vulnerability-assessment",
        "basic-exploitation",
      ],
      games: ["reconnaissance-challenge", "vulnerability-hunt"],
      documents: [],
    },
    prerequisites: ["network-security", "cybersecurity-fundamentals"],
    learningOutcomes: [
      "Understand penetration testing methodology",
      "Perform basic reconnaissance and scanning",
      "Identify and assess vulnerabilities",
    ],
  },

  {
    // moduleId will be auto-generated from title: "web-application"
    phaseId: "intermediate",
    title: "Web Application Security",
    description:
      "Comprehensive guide to securing web applications, including OWASP Top 10 vulnerabilities and secure coding practices.",
    icon: "Globe",
    difficulty: "Intermediate",
    color: "text-cyan-400",
    order: 2,
    topics: [
      "OWASP Top 10 Vulnerabilities",
      "SQL Injection Prevention",
      "Cross-Site Scripting (XSS) Protection",
      "Authentication and Session Management",
      "Secure Coding Practices",
    ],
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
    },
    prerequisites: ["cybersecurity-fundamentals"],
    learningOutcomes: [
      "Identify web application vulnerabilities",
      "Implement secure coding practices",
      "Perform web application security testing",
    ],
  },

  {
    // moduleId will be auto-generated from title: "incident-response"
    phaseId: "intermediate",
    title: "Incident Response & Digital Forensics",
    description:
      "Learn how to respond to security incidents and conduct digital forensic investigations.",
    icon: "AlertTriangle",
    difficulty: "Intermediate",
    color: "text-yellow-400",
    order: 3,
    topics: [
      "Incident Response Framework",
      "Digital Evidence Collection",
      "Forensic Analysis Techniques",
      "Malware Analysis Basics",
      "Recovery and Lessons Learned",
    ],
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
    },
    prerequisites: ["cybersecurity-fundamentals", "network-security"],
    learningOutcomes: [
      "Develop incident response procedures",
      "Collect and analyze digital evidence",
      "Coordinate security incident recovery",
    ],
  },

  // 🔴 ADVANCED PHASE MODULES
  {
    // moduleId will be auto-generated from title: "advanced-penetration"
    phaseId: "advanced",
    title: "Advanced Penetration Testing",
    description:
      "Advanced ethical hacking techniques, custom exploit development, and complex network penetration.",
    icon: "Zap",
    difficulty: "Advanced",
    color: "text-red-500",
    order: 1,
    topics: [
      "Custom Exploit Development",
      "Advanced Persistence Techniques",
      "Privilege Escalation",
      "Lateral Movement",
      "Anti-Forensics and Evasion",
    ],
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
    },
    prerequisites: ["penetration-testing", "web-application"],
    learningOutcomes: [
      "Develop custom exploits",
      "Perform advanced penetration testing",
      "Implement evasion techniques",
    ],
  },

  {
    // moduleId will be auto-generated from title: "malware-analysis"
    phaseId: "advanced",
    title: "Malware Analysis & Reverse Engineering",
    description:
      "Deep dive into malware analysis, reverse engineering techniques, and threat intelligence.",
    icon: "Bug",
    difficulty: "Advanced",
    color: "text-purple-500",
    order: 2,
    topics: [
      "Static and Dynamic Analysis",
      "Reverse Engineering Tools",
      "Behavioral Analysis",
      "Threat Intelligence",
      "Malware Family Classification",
    ],
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
    },
    prerequisites: ["incident-response", "penetration-testing"],
    learningOutcomes: [
      "Analyze malware samples",
      "Reverse engineer malicious code",
      "Develop threat intelligence",
    ],
  },

  {
    // moduleId will be auto-generated from title: "cloud-security"
    phaseId: "advanced",
    title: "Cloud Security Architecture",
    description:
      "Advanced cloud security concepts, multi-cloud strategies, and DevSecOps implementation.",
    icon: "Cloud",
    difficulty: "Advanced",
    color: "text-blue-500",
    order: 3,
    topics: [
      "Cloud Security Frameworks",
      "Multi-Cloud Security",
      "Container Security",
      "DevSecOps Integration",
      "Cloud Incident Response",
    ],
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
    },
    prerequisites: ["web-application", "incident-response"],
    learningOutcomes: [
      "Design secure cloud architectures",
      "Implement DevSecOps practices",
      "Secure containerized environments",
    ],
  },
];

/**
 * Seed the database with cybersecurity modules
 * This function will create modules with auto-generated moduleIds and calculated durations
 */
async function seedModules() {
  try {
    console.log("🌱 Starting module seeding process...");

    // Check if phases exist first
    const phases = await Phase.find({});
    if (phases.length === 0) {
      throw new Error("❌ No phases found! Please seed phases first.");
    }
    console.log(`✅ Found ${phases.length} phases in database`);

    // Clear existing modules
    const deleteResult = await Module.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing modules`);

    // Process modules with calculated data
    const processedModules = CYBERSECURITY_MODULES.map((moduleData) => {
      // Generate moduleId from title
      const moduleId = generateModuleId(moduleData.title);

      // Calculate duration from content
      const duration = calculateModuleDuration(
        moduleData.content,
        DEFAULT_CONTENT_DURATIONS
      );

      return {
        ...moduleData,
        moduleId,
        duration,
        // Auto-generate paths
        path: `/course/${moduleId}`,
        enrollPath: `/learn/${moduleId}`,
      };
    });

    // Insert new modules
    const insertedModules = await Module.insertMany(processedModules);
    console.log(`✅ Successfully seeded ${insertedModules.length} modules`);

    // Display module summary
    console.log("\n📊 Module Summary by Phase:");
    const modulesByPhase = {};
    insertedModules.forEach((module) => {
      if (!modulesByPhase[module.phaseId]) {
        modulesByPhase[module.phaseId] = [];
      }
      modulesByPhase[module.phaseId].push(module);
    });

    Object.entries(modulesByPhase).forEach(([phaseId, modules]) => {
      console.log(
        `\n🔸 ${phaseId.toUpperCase()} Phase (${modules.length} modules):`
      );
      modules.forEach((module) => {
        console.log(
          `   • ${module.title} (${module.moduleId}) - ${module.duration}`
        );
        console.log(
          `     Content: ${module.contentStats.totalContent} items (${module.contentStats.totalVideos}v, ${module.contentStats.totalLabs}l, ${module.contentStats.totalGames}g, ${module.contentStats.totalDocuments}d)`
        );
      });
    });

    console.log(`\n🎉 Module seeding completed successfully!`);
    return insertedModules;
  } catch (error) {
    console.error("❌ Error seeding modules:", error.message);
    throw error;
  }
}

/**
 * Clear all modules from the database
 */
async function clearModules() {
  try {
    console.log("🗑️  Clearing all modules...");
    const result = await Module.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} modules`);
    return result;
  } catch (error) {
    console.error("❌ Error clearing modules:", error.message);
    throw error;
  }
}

/**
 * Re-seed modules (clear and seed)
 */
async function reseedModules() {
  try {
    console.log("🔄 Re-seeding modules...");
    await clearModules();
    const result = await seedModules();
    console.log("✅ Module re-seeding completed!");
    return result;
  } catch (error) {
    console.error("❌ Error re-seeding modules:", error.message);
    throw error;
  }
}

/**
 * Get module seeding status
 */
async function getModuleStatus() {
  try {
    const totalModules = await Module.countDocuments();
    const modulesByPhase = await Module.aggregate([
      {
        $group: {
          _id: "$phaseId",
          count: { $sum: 1 },
          totalContent: { $sum: "$contentStats.totalContent" },
        },
      },
    ]);

    return {
      totalModules,
      modulesByPhase,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("❌ Error getting module status:", error.message);
    throw error;
  }
}

module.exports = {
  seedModules,
  clearModules,
  reseedModules,
  getModuleStatus,
  CYBERSECURITY_MODULES,
};
