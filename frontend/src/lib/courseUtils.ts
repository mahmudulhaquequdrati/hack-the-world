import {
  ContextualContent,
  Course,
  CourseSection,
  EnrolledCourse,
  EnrolledLesson,
  Game,
  GameChallenge,
  Lab,
  Resource,
} from "./types";

// Enhanced dynamic content generators
const generateContextualContent = (topic: string): ContextualContent => {
  const topicLower = topic.toLowerCase();

  const baseObjectives = [
    `Understand ${topic}`,
    `Apply ${topic} concepts`,
    `Analyze ${topic} scenarios`,
  ];
  const baseKeyPoints = [
    `Core principles of ${topic}`,
    `Best practices for ${topic}`,
    `Common challenges in ${topic}`,
  ];

  let objectives = baseObjectives;
  let keyPoints = baseKeyPoints;
  let practicalExercises: string[] = [];
  let realWorldApplications: string[] = [];
  let troubleshootingTips: string[] = [];
  let securityConsiderations: string[] = [];

  // Cybersecurity-specific content
  if (topicLower.includes("threat") || topicLower.includes("security")) {
    objectives = [
      "Identify current threat landscape trends",
      "Analyze threat actor motivations and capabilities",
      "Develop threat mitigation strategies",
    ];
    keyPoints = [
      "Advanced Persistent Threats (APTs)",
      "Threat intelligence sources",
      "Risk assessment methodologies",
    ];
    practicalExercises = [
      "Threat modeling exercise",
      "Risk assessment simulation",
      "Incident response planning",
    ];
    realWorldApplications = [
      "Enterprise threat hunting",
      "Security operations center (SOC) analysis",
      "Vulnerability management programs",
    ];
    securityConsiderations = [
      "Information sharing protocols",
      "Attribution challenges",
      "False positive management",
    ];
  }

  if (topicLower.includes("cia") || topicLower.includes("triad")) {
    objectives = [
      "Master the CIA triad principles",
      "Implement confidentiality controls",
      "Ensure integrity and availability",
    ];
    keyPoints = [
      "Confidentiality through encryption",
      "Integrity via checksums and hashing",
      "Availability through redundancy",
    ];
    practicalExercises = [
      "Encryption implementation lab",
      "Hash verification exercise",
      "Backup and recovery simulation",
    ];
    realWorldApplications = [
      "Data classification systems",
      "Access control implementations",
      "Business continuity planning",
    ];
  }

  if (topicLower.includes("network") || topicLower.includes("protocol")) {
    objectives = [
      "Understand network architecture",
      "Analyze network protocols",
      "Implement network security controls",
    ];
    keyPoints = [
      "OSI model layers",
      "TCP/IP protocol suite",
      "Network segmentation strategies",
    ];
    practicalExercises = [
      "Packet capture analysis",
      "Network scanning exercise",
      "Firewall rule configuration",
    ];
    realWorldApplications = [
      "Network monitoring systems",
      "Intrusion detection deployment",
      "Network forensics investigations",
    ];
    troubleshootingTips = [
      "Use Wireshark for packet analysis",
      "Check routing tables for connectivity issues",
      "Verify DNS resolution problems",
    ];
  }

  if (topicLower.includes("linux") || topicLower.includes("command")) {
    objectives = [
      "Master essential Linux commands",
      "Navigate file system efficiently",
      "Manage system processes and permissions",
    ];
    keyPoints = [
      "Command line navigation",
      "File permission system",
      "Process management",
    ];
    practicalExercises = [
      "Command line navigation challenge",
      "File permission modification lab",
      "System administration tasks",
    ];
    realWorldApplications = [
      "Server administration",
      "Log file analysis",
      "Security tool deployment",
    ];
    troubleshootingTips = [
      "Use 'man' command for help",
      "Check file permissions with 'ls -la'",
      "Monitor processes with 'top' or 'htop'",
    ];
  }

  return {
    objectives,
    keyPoints,
    practicalExercises,
    realWorldApplications,
    troubleshootingTips,
    securityConsiderations,
  };
};

const generateDynamicResources = (
  topic: string,
  lessonType: string
): Resource[] => {
  const topicLower = topic.toLowerCase();
  const resources: Resource[] = [];

  // Base resources for all lessons
  resources.push({
    name: `${topic} - Study Guide`,
    type: "PDF",
    size: "2.1 MB",
    category: "guide",
    description: `Comprehensive study guide covering ${topic}`,
    isContextual: true,
    relatedTopics: [topic],
  });

  // Type-specific resources
  if (lessonType === "video") {
    resources.push(
      {
        name: `${topic} - Video Transcript`,
        type: "PDF",
        size: "1.2 MB",
        category: "reference",
        description: "Complete transcript of the video lesson",
        isContextual: true,
      },
      {
        name: `${topic} - Presentation Slides`,
        type: "PDF",
        size: "3.5 MB",
        category: "reference",
        description: "Downloadable presentation slides",
        isContextual: true,
      }
    );
  }

  if (lessonType === "lab") {
    resources.push(
      {
        name: `${topic} - Lab Instructions`,
        type: "PDF",
        size: "4.2 MB",
        category: "guide",
        description: "Detailed lab setup and instructions",
        isContextual: true,
      },
      {
        name: `${topic} - Code Templates`,
        type: "ZIP",
        size: "8.1 MB",
        category: "template",
        description: "Starter code and configuration files",
        isContextual: true,
      },
      {
        name: `${topic} - Solution Guide`,
        type: "PDF",
        size: "2.8 MB",
        category: "reference",
        description: "Complete solution with explanations",
        isContextual: true,
      }
    );
  }

  if (lessonType === "game") {
    resources.push(
      {
        name: `${topic} - Game Rules`,
        type: "PDF",
        size: "1.5 MB",
        category: "guide",
        description: "Game mechanics and scoring system",
        isContextual: true,
      },
      {
        name: `${topic} - Strategy Guide`,
        type: "PDF",
        size: "2.3 MB",
        category: "guide",
        description: "Tips and strategies for success",
        isContextual: true,
      }
    );
  }

  // Topic-specific resources
  if (topicLower.includes("threat") || topicLower.includes("security")) {
    resources.push(
      {
        name: "Threat Intelligence Report 2024",
        type: "PDF",
        size: "5.2 MB",
        category: "reference",
        description: "Latest threat intelligence and trends",
        relatedTopics: ["threat intelligence", "cybersecurity"],
      },
      {
        name: "MITRE ATT&CK Framework",
        type: "PDF",
        size: "3.8 MB",
        category: "reference",
        description: "Complete MITRE ATT&CK framework reference",
        relatedTopics: ["threat modeling", "attack patterns"],
      }
    );
  }

  if (topicLower.includes("network")) {
    resources.push(
      {
        name: "Network Protocol Reference",
        type: "PDF",
        size: "4.1 MB",
        category: "reference",
        description: "Comprehensive protocol documentation",
        relatedTopics: ["networking", "protocols"],
      },
      {
        name: "Wireshark Capture Files",
        type: "ZIP",
        size: "12.3 MB",
        category: "exercise",
        description: "Sample network captures for analysis",
        relatedTopics: ["packet analysis", "network forensics"],
      }
    );
  }

  return resources;
};

const generateRelatedLabs = (topic: string, courseId: string): string[] => {
  const topicLower = topic.toLowerCase();
  const labs: string[] = [];

  if (topicLower.includes("threat") || topicLower.includes("security")) {
    labs.push(
      `${courseId}-lab-threat-modeling`,
      `${courseId}-lab-risk-assessment`,
      `${courseId}-lab-incident-response`
    );
  }

  if (topicLower.includes("cia") || topicLower.includes("triad")) {
    labs.push(
      `${courseId}-lab-encryption-implementation`,
      `${courseId}-lab-access-control`,
      `${courseId}-lab-backup-recovery`
    );
  }

  if (topicLower.includes("network")) {
    labs.push(
      `${courseId}-lab-packet-analysis`,
      `${courseId}-lab-network-scanning`,
      `${courseId}-lab-firewall-config`
    );
  }

  if (topicLower.includes("linux") || topicLower.includes("command")) {
    labs.push(
      `${courseId}-lab-command-mastery`,
      `${courseId}-lab-file-permissions`,
      `${courseId}-lab-system-admin`
    );
  }

  return labs;
};

const generateRelatedGames = (topic: string, courseId: string): string[] => {
  const topicLower = topic.toLowerCase();
  const games: string[] = [];

  if (topicLower.includes("threat") || topicLower.includes("security")) {
    games.push(
      `${courseId}-game-threat-hunter`,
      `${courseId}-game-security-architect`,
      `${courseId}-game-incident-commander`
    );
  }

  if (topicLower.includes("cia") || topicLower.includes("triad")) {
    games.push(
      `${courseId}-game-crypto-challenge`,
      `${courseId}-game-access-control-puzzle`,
      `${courseId}-game-availability-simulator`
    );
  }

  if (topicLower.includes("network")) {
    games.push(
      `${courseId}-game-protocol-master`,
      `${courseId}-game-network-detective`,
      `${courseId}-game-packet-puzzle`
    );
  }

  return games;
};

const generateEnhancedLabs = (course: Course): Lab[] => {
  const enhancedLabs: Lab[] = [];

  // Generate labs based on course content and existing lab data
  course.labsData.forEach((labData, index) => {
    const labId = `${course.id}-lab-${index}`;

    // Determine category based on lab name and course category
    let category = "general";
    const labNameLower = labData.name.toLowerCase();

    if (labNameLower.includes("risk") || labNameLower.includes("assessment")) {
      category = "risk-management";
    } else if (
      labNameLower.includes("network") ||
      labNameLower.includes("packet")
    ) {
      category = "networking";
    } else if (
      labNameLower.includes("web") ||
      labNameLower.includes("application")
    ) {
      category = "web-security";
    } else if (
      labNameLower.includes("penetration") ||
      labNameLower.includes("exploit")
    ) {
      category = "offensive-security";
    }

    // Generate objectives based on lab content
    const objectives = [
      `Complete ${labData.name} successfully`,
      `Apply theoretical knowledge in practical scenarios`,
      `Develop hands-on skills in ${category.replace("-", " ")}`,
    ];

    // Generate prerequisites
    const prerequisites = [
      "Basic understanding of cybersecurity concepts",
      "Familiarity with the course material",
      "Access to lab environment",
    ];

    // Generate tools based on category
    let tools: string[] = ["Virtual Machine", "Web Browser", "Text Editor"];

    if (category === "networking") {
      tools = [...tools, "Wireshark", "Nmap", "Netcat"];
    } else if (category === "web-security") {
      tools = [...tools, "Burp Suite", "OWASP ZAP", "Browser Dev Tools"];
    } else if (category === "offensive-security") {
      tools = [...tools, "Metasploit", "Nmap", "John the Ripper"];
    }

    // Generate steps
    const steps = [
      {
        id: `${labId}-step-1`,
        title: "Environment Setup",
        description:
          "Set up the lab environment and verify all tools are working",
        completed: false,
      },
      {
        id: `${labId}-step-2`,
        title: "Initial Analysis",
        description: "Perform initial reconnaissance and analysis",
        completed: false,
      },
      {
        id: `${labId}-step-3`,
        title: "Implementation",
        description: "Execute the main lab activities",
        completed: false,
      },
      {
        id: `${labId}-step-4`,
        title: "Verification",
        description: "Verify results and document findings",
        completed: false,
      },
    ];

    // Generate hints
    const hints = [
      "Read the lab instructions carefully before starting",
      "Take screenshots of important findings",
      "Document your methodology for future reference",
      "Don't hesitate to research additional resources if needed",
    ];

    enhancedLabs.push({
      id: labId,
      name: labData.name,
      description: labData.description,
      difficulty: labData.difficulty,
      duration: labData.duration,
      completed: false,
      available: true,
      objectives,
      prerequisites,
      tools,
      steps,
      hints,
      category,
      estimatedTime: labData.duration,
      skillsGained: labData.skills || [],
    });
  });

  return enhancedLabs;
};

const generateEnhancedGames = (course: Course): Game[] => {
  const enhancedGames: Game[] = [];

  course.gamesData.forEach((gameData, index) => {
    const gameId = `${course.id}-game-${index}`;

    // Determine game type based on name and description
    let gameType:
      | "simulation"
      | "puzzle"
      | "strategy"
      | "quiz"
      | "ctf"
      | "scenario" = "quiz";
    const gameNameLower = gameData.name.toLowerCase();

    if (
      gameNameLower.includes("simulation") ||
      gameNameLower.includes("simulator")
    ) {
      gameType = "simulation";
    } else if (
      gameNameLower.includes("puzzle") ||
      gameNameLower.includes("challenge")
    ) {
      gameType = "puzzle";
    } else if (
      gameNameLower.includes("strategy") ||
      gameNameLower.includes("builder")
    ) {
      gameType = "strategy";
    } else if (
      gameNameLower.includes("ctf") ||
      gameNameLower.includes("capture")
    ) {
      gameType = "ctf";
    } else if (
      gameNameLower.includes("scenario") ||
      gameNameLower.includes("case")
    ) {
      gameType = "scenario";
    }

    // Generate objectives
    const objectives = [
      `Score maximum points in ${gameData.name}`,
      "Apply cybersecurity knowledge in gamified scenarios",
      "Develop problem-solving skills through interactive challenges",
    ];

    // Generate challenges
    const challenges: GameChallenge[] = [
      {
        id: `${gameId}-challenge-1`,
        title: "Basic Challenge",
        description: "Complete the fundamental tasks",
        points: Math.floor(gameData.points * 0.3),
        difficulty: "easy",
        completed: false,
      },
      {
        id: `${gameId}-challenge-2`,
        title: "Intermediate Challenge",
        description: "Tackle more complex scenarios",
        points: Math.floor(gameData.points * 0.4),
        difficulty: "medium",
        completed: false,
      },
      {
        id: `${gameId}-challenge-3`,
        title: "Advanced Challenge",
        description: "Master the most difficult tasks",
        points: Math.floor(gameData.points * 0.3),
        difficulty: "hard",
        completed: false,
      },
    ];

    enhancedGames.push({
      id: gameId,
      name: gameData.name,
      description: gameData.description,
      difficulty: "Beginner",
      duration: "20-30 min",
      points: gameData.points,
      available: true,
      type: gameType,
      objectives,
      maxScore: gameData.points,
      timeLimit: gameType === "ctf" ? "60 minutes" : undefined,
      category: course.category.toLowerCase().replace(" ", "-"),
      skillsGained: course.skills.slice(0, 3),
      challenges,
    });
  });

  return enhancedGames;
};

// Helper function to check if a lesson is completed - now returns false since mock data is removed
const isLessonCompletedByIndex = (
  _moduleId: string,
  _lessonIndex: number
): boolean => {
  // TODO: Replace with real API call to check lesson completion status
  return false;
};

// Convert Course curriculum to EnrolledCourse sections
export const convertCourseToEnrolledCourse = (
  course: Course
): EnrolledCourse => {
  // Convert curriculum to sections with lessons
  let globalLessonIndex = 0; // Keep track of lesson indices across all sections

  const allSections: CourseSection[] = course.curriculum.map(
    (curriculumSection, sectionIndex) => {
      const curriculumLessons: EnrolledLesson[] = curriculumSection.topics
        .map((topic, topicIndex) => {
          const lessonId = `${course.id}-section-${sectionIndex}-lesson-${topicIndex}`;

          // Determine lesson type based on topic content and position
          let lessonType: "video" | "text" | "lab" | "game" = "video";
          const topicLower = topic.toLowerCase();

          // Skip quiz/test/assessment content entirely
          if (
            topicLower.includes("quiz") ||
            topicLower.includes("test") ||
            topicLower.includes("assessment")
          ) {
            return null; // Mark for filtering out
          } else if (
            topicLower.includes("lab") ||
            topicLower.includes("hands-on") ||
            topicLower.includes("practice")
          ) {
            lessonType = "lab";
          } else if (
            topicLower.includes("game") ||
            topicLower.includes("challenge") ||
            topicLower.includes("simulation")
          ) {
            lessonType = "game";
          } else if (
            topicLower.includes("reading") ||
            topicLower.includes("guide") ||
            topicLower.includes("reference")
          ) {
            lessonType = "text";
          }

          // Generate realistic duration
          const durations = [
            "12:30",
            "15:45",
            "18:20",
            "22:15",
            "25:30",
            "14:10",
            "16:45",
            "20:30",
          ];
          const duration = durations[topicIndex % durations.length];

          // Generate enhanced content
          const contextualContent = generateContextualContent(topic);
          const dynamicResources = generateDynamicResources(topic, lessonType);
          const relatedLabs = generateRelatedLabs(topic, course.id);
          const relatedGames = generateRelatedGames(topic, course.id);

          const lesson = {
            id: lessonId,
            title: topic,
            duration,
            type: lessonType,
            completed: isLessonCompletedByIndex(course.id, globalLessonIndex),
            description: `Learn about ${topic.toLowerCase()} in this comprehensive lesson. ${
              contextualContent.objectives[0]
            }.`,
            videoUrl:
              lessonType === "video"
                ? `https://example.com/videos/${lessonId}.mp4`
                : undefined,
            content:
              lessonType === "text"
                ? `Detailed content about ${topic}...`
                : undefined,
            dynamicResources,
            relatedLabs,
            relatedGames,
            contextualContent,
          };

          globalLessonIndex++; // Increment for next lesson
          return lesson;
        })
        .filter(Boolean) as EnrolledLesson[]; // Remove null entries (quizzes)

      // Add actual games from course data to this section
      const sectionGames: EnrolledLesson[] = course.gamesData
        .slice(sectionIndex * 2, (sectionIndex + 1) * 2) // Distribute games across sections
        .map((game, gameIndex) => {
          const gameId = `${course.id}-section-${sectionIndex}-game-${gameIndex}`;
          const lesson = {
            id: gameId,
            title: game.name,
            duration: "20:00",
            type: "game" as const,
            completed: isLessonCompletedByIndex(course.id, globalLessonIndex),
            description: game.description,
            contextualContent: generateContextualContent(game.name),
            dynamicResources: generateDynamicResources(game.name, "game"),
            relatedLabs: [],
            relatedGames: [],
          };

          globalLessonIndex++; // Increment for next lesson
          return lesson;
        });

      // Add actual labs from course data to this section
      const sectionLabs: EnrolledLesson[] = course.labsData
        .slice(sectionIndex * 2, (sectionIndex + 1) * 2) // Distribute labs across sections
        .map((lab, labIndex) => {
          const labId = `${course.id}-section-${sectionIndex}-lab-${labIndex}`;
          const lesson = {
            id: labId,
            title: lab.name,
            duration: lab.duration || "45:00",
            type: "lab" as const,
            completed: isLessonCompletedByIndex(course.id, globalLessonIndex),
            description: lab.description,
            contextualContent: generateContextualContent(lab.name),
            dynamicResources: generateDynamicResources(lab.name, "lab"),
            relatedLabs: [],
            relatedGames: [],
          };

          globalLessonIndex++; // Increment for next lesson
          return lesson;
        });

      // Mix curriculum lessons, games, and labs together
      const allLessons = [
        ...curriculumLessons,
        ...sectionGames,
        ...sectionLabs,
      ];

      return {
        id: `${course.id}-section-${sectionIndex}`,
        title: curriculumSection.title,
        lessons: allLessons,
      };
    }
  );

  // Process sections: show all sections with proper titles
  const sections = allSections
    .map((section, index) => {
      const hasAnyLessons = section.lessons.length > 0;

      return {
        ...section,
        // Always show section title if it has lessons, with fallback
        title: hasAnyLessons ? section.title || `Section ${index + 1}` : "",
        // Keep all lessons (videos, labs, games, etc.)
        lessons: section.lessons,
      };
    })
    .filter((section) => section.lessons.length > 0); // Remove completely empty sections

  // Generate enhanced labs
  const labs = generateEnhancedLabs(course);

  // Generate enhanced games
  const games = generateEnhancedGames(course);

  // Convert resources with enhanced properties
  const resources = course.assetsData.map((asset) => ({
    name: asset.name,
    type: asset.type,
    size: asset.size,
    category: "reference" as const,
    description: `${asset.name} - Essential resource for the course`,
    isContextual: false,
    relatedTopics: course.skills.slice(0, 2),
  }));

  // Calculate total lessons (only from sections with videos)
  const totalLessons = sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );

  // Calculate completed lessons (first few lessons of completed sections)
  const completedLessonsCount = sections.reduce((acc, section) => {
    if (section.lessons.some((lesson) => lesson.completed)) {
      return acc + section.lessons.filter((lesson) => lesson.completed).length;
    }
    return acc;
  }, 0);

  return {
    title: course.title,
    description: course.description,
    icon: course.icon,
    color: course.color,
    bgColor: course.bgColor,
    borderColor: course.borderColor,
    totalLessons,
    completedLessons: completedLessonsCount,
    progress: course.progress,
    sections,
    labs,
    playground: {
      title: `${course.title} Playground`,
      description: `Interactive environment to practice ${course.category.toLowerCase()} concepts`,
      tools: course.skills.slice(0, 3).map((skill) => `${skill} Tool`),
      available: true,
    },
    resources,
    games,
  };
};

// Get default completed lessons for a course
export const getDefaultCompletedLessons = (
  course: EnrolledCourse
): string[] => {
  const completedLessons: string[] = [];

  course.sections.forEach((section) => {
    section.lessons.forEach((lesson) => {
      if (lesson.completed) {
        completedLessons.push(lesson.id);
      }
    });
  });

  return completedLessons;
};

// Get contextual content for current lesson
export const getContextualContentForLesson = (lesson: EnrolledLesson) => {
  return (
    lesson.contextualContent || {
      objectives: [`Learn about ${lesson.title}`],
      keyPoints: [`Key concepts of ${lesson.title}`],
      practicalExercises: [`Practice ${lesson.title}`],
      realWorldApplications: [`Apply ${lesson.title} in real scenarios`],
      troubleshootingTips: [],
      securityConsiderations: [],
    }
  );
};

// Get all resources for a lesson (dynamic + course resources)
export const getAllResourcesForLesson = (
  lesson: EnrolledLesson,
  courseResources: Resource[]
) => {
  const dynamicResources = lesson.dynamicResources || [];
  return [...dynamicResources, ...courseResources];
};
