import {
  Activity,
  BookOpen,
  Brain,
  Cloud,
  Code,
  Eye,
  Network,
  Shield,
  Smartphone,
  Target,
  Terminal,
  Users,
} from "lucide-react";
import React from "react";
import type {
  Course,
  CourseSection,
  EnrolledCourse,
  EnrolledLesson,
  Game,
  Lab,
  Module,
  Phase,
  Resource,
} from "./types";
import { LearningOutcome } from "./types";

// API response types
interface ApiModule {
  _id: string;
  title: string;
  description: string;
  icon: string;
  duration: string | number;
  difficulty: string;
  topics?: string[];
  phaseId?: string;
  content?: {
    videos: string[];
    labs: string[];
    games: string[];
    documents: string[];
    estimatedHours: number | string;
  };
  phase?: {
    _id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
  order?: number;
  isActive?: boolean;
  prerequisites?: string[];
  learningOutcomes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ApiPhase {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UserProgress {
  moduleId: string;
  progress: number;
  completedAt?: string;
}

// Helper function to get icon name (serializable)
export const getIconNameFromString = (iconName: string): string => {
  const validIcons = [
    "Shield",
    "Target",
    "Network",
    "Code",
    "Brain",
    "Cloud",
    "Smartphone",
    "Users",
    "Eye",
    "Activity",
    "BookOpen",
    "Terminal",
  ];
  return validIcons.includes(iconName) ? iconName : "Shield";
};

// Helper function to convert icon name to React component (for rendering)
export const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: typeof Shield } = {
    Shield,
    Target,
    Network,
    Code,
    Brain,
    Cloud,
    Smartphone,
    Users,
    Eye,
    Activity,
    BookOpen,
    Terminal,
  };
  return iconMap[iconName] || Shield;
};

// React component to render icons (handles both string and React component)
export const IconRenderer: React.FC<{
  icon: string | React.ComponentType<{ className?: string }>;
  className?: string;
}> = ({ icon, className }) => {
  if (typeof icon === "string") {
    const IconComponent = getIconComponent(icon);
    return React.createElement(IconComponent, { className });
  } else {
    return React.createElement(icon, { className });
  }
};

/**
 * Transform API module data to Course format for course detail page
 */
export const transformApiModuleToCourse = (
  apiModule: ApiModule,
  userProgress?: UserProgress[]
): Course => {
  // Get user progress for this module
  const moduleProgress = userProgress?.find((p) => p.moduleId === apiModule._id);

  // Determine colors based on difficulty
  const getColorsForDifficulty = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return {
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
        };
      case "intermediate":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
        };
      case "advanced":
        return {
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
        };
      case "expert":
        return {
          color: "text-purple-400",
          bgColor: "bg-purple-400/10",
          borderColor: "border-purple-400/30",
        };
      default:
        return {
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/30",
        };
    }
  };

  const colors = getColorsForDifficulty(apiModule.difficulty);

  // Transform learning outcomes from API data
  const learningOutcomes: LearningOutcome[] =
    apiModule.learningOutcomes?.map((outcome, index) => ({
      title: outcome,
      description: outcome,
      skills: apiModule.topics?.slice(index * 2, (index + 1) * 2) || [],
    })) || [];

  return {
    _id: apiModule._id,
    title: apiModule.title,
    description: apiModule.description,
    category: apiModule.phase?.title || "Course",
    difficulty: apiModule.difficulty,
    duration: apiModule.content?.estimatedHours || 0,
    icon: getIconNameFromString(apiModule.icon),
    color: colors.color,
    bgColor: colors.bgColor,
    borderColor: colors.borderColor,
    enrolled: moduleProgress ? true : false,
    progress: moduleProgress?.progress || 0,
    lessons: apiModule.content?.videos?.length || 0,
    labs: apiModule.content?.labs?.length || 0,
    games: apiModule.content?.games?.length || 0,
    assets: apiModule.content?.documents?.length || 0,
    rating: 0, // No rating data available
    students: 0, // No student count available
    price: "Free", // No price data available
    skills: apiModule.topics || [],
    prerequisites: apiModule.prerequisites?.join(", ") || "None",
    certification: false, // No certification data available
    instructor: {
      name: "",
      title: "",
      avatar: "",
      experience: "",
    }, // No instructor data available
    // Empty until real curriculum data is available
    learningOutcomes,
  };
};

/**
 * Transform API module data to frontend module format
 */
export const transformApiModule = (
  apiModule: ApiModule,
  userProgress?: UserProgress[]
): Module => {
  // Get user progress for this module
  const moduleProgress = userProgress?.find((p) => p.moduleId === apiModule._id);

  // Determine colors based on difficulty
  const getColorsForDifficulty = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return {
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
        };
      case "intermediate":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
        };
      case "advanced":
        return {
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
        };
      case "expert":
        return {
          color: "text-purple-400",
          bgColor: "bg-purple-400/10",
          borderColor: "border-purple-400/30",
        };
      default:
        return {
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/30",
        };
    }
  };

  const colors = getColorsForDifficulty(apiModule.difficulty);

  return {
    _id: apiModule._id,
    title: apiModule.title,
    description: apiModule.description,
    icon: apiModule.icon,
    duration: apiModule.duration,
    difficulty: apiModule.difficulty,
    progress: moduleProgress?.progress || 0,
    color: colors.color,
    bgColor: colors.bgColor,
    borderColor: colors.borderColor,
    topics: apiModule.topics || [],
    labs: apiModule.content?.labs?.length || 0,
    games: apiModule.content?.games?.length || 0,
    assets: apiModule.content?.documents?.length || 0,
    enrolled: moduleProgress ? true : false,
    completed: moduleProgress?.progress === 100,
    phaseId: apiModule.phaseId || apiModule.phase?._id,
    // Keep API specific fields
    content: apiModule.content,
    phase: apiModule.phase,
    order: apiModule.order,
    isActive: apiModule.isActive,
    prerequisites: apiModule.prerequisites,
    learningOutcomes: apiModule.learningOutcomes,
    createdAt: apiModule.createdAt,
    updatedAt: apiModule.updatedAt,
  };
};

/**
 * Transform API phase data to frontend phase format
 */
export const transformApiPhase = (
  apiPhase: ApiPhase,
  modules?: Module[]
): Phase => {
  return {
    _id: apiPhase._id,
    title: apiPhase.title,
    description: apiPhase.description,
    icon: apiPhase.icon,
    color: apiPhase.color,
    modules: modules || [],
    // Keep API specific fields
    order: apiPhase.order,
    createdAt: apiPhase.createdAt,
    updatedAt: apiPhase.updatedAt,
  };
};

/**
 * Organize modules by phase and transform them
 */
export const organizeModulesByPhase = (
  phases: ApiPhase[],
  modules: ApiModule[],
  userProgress?: UserProgress[]
): Phase[] => {
  return phases
    .map((phase) => {
      const phaseModules = modules
        .filter(
          (module) =>
            module.phaseId === phase._id || module.phase?._id === phase._id
        )
        .map((module) => transformApiModule(module, userProgress))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      return transformApiPhase(phase, phaseModules);
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

// Transform API module content grouped response to EnrolledCourse format
export const transformApiContentToEnrolledCourse = (
  moduleId: string,
  moduleTitle: string,
  moduleDescription: string,
  groupedContent: Record<
    string,
    Array<{
      _id: string;
      title: string;
      description?: string;
      type: "video" | "lab" | "game" | "document";
      duration?: number;
      url?: string;
      instructions?: string;
      metadata?: Record<string, unknown>;
      order?: number;
    }>
  >
): EnrolledCourse => {
  // Convert grouped content to sections
  const sections: CourseSection[] = Object.entries(groupedContent).map(
    ([sectionTitle, contentItems], sectionIndex) => {
      const lessons: EnrolledLesson[] = contentItems.map((item, itemIndex) => {
        const lessonId = `${moduleId}-${sectionIndex}-${itemIndex}-${item._id}`;

        // Generate realistic duration if not provided
        const duration = item.duration
          ? `${item.duration}:00`
          : item.type === "video"
          ? "15:30"
          : item.type === "lab"
          ? "45:00"
          : item.type === "game"
          ? "25:00"
          : "10:00";

        return {
          _id: lessonId,
          title: item.title,
          duration,
          type: item.type === "document" ? "text" : item.type, // Map document to text
          completed: false, // Default to not completed
          description: item.description || `Learn about ${item.title}`,
          videoUrl: item.type === "video" ? item.url : undefined,
          content: item.type === "document" ? item.instructions : undefined,
          dynamicResources: [], // Will be populated if needed
          relatedLabs: [],
          relatedGames: [],
          contextualContent: {
            objectives: [`Master ${item.title}`],
            keyPoints: [item.description || `Key concepts in ${item.title}`],
            practicalTips: [`Practice ${item.title} regularly`],
            commonMistakes: [`Avoid rushing through ${item.title}`],
            nextSteps: [`Apply ${item.title} knowledge`],
          },
        };
      });

      return {
        _id: `${moduleId}-section-${sectionIndex}`,
        title: sectionTitle,
        lessons,
      };
    }
  );

  // Generate labs array from lab content
  const labs: Lab[] = Object.values(groupedContent)
    .flat()
    .filter((item) => item.type === "lab")
    .map((lab, index) => ({
      _id: `${moduleId}-lab-${index}`,
      name: lab.title,
      description: lab.description || `Hands-on lab: ${lab.title}`,
      difficulty: "intermediate",
      duration: lab.duration ? `${lab.duration} minutes` : "45 minutes",
      completed: false,
      available: true,
      objectives: [lab.description || `Complete ${lab.title}`],
      prerequisites: [],
      tools: [],
      steps: [],
      hints: [],
      solution: lab.instructions || `Complete the ${lab.title} lab`,
      category: "security",
      estimatedTime: lab.duration ? `${lab.duration} minutes` : "45 minutes",
      skillsGained: [],
    }));

  // Generate games array from game content
  const games: Game[] = Object.values(groupedContent)
    .flat()
    .filter((item) => item.type === "game")
    .map((game, index) => ({
      _id: `${moduleId}-game-${index}`,
      name: game.title,
      description: game.description || `Interactive game: ${game.title}`,
      difficulty: "intermediate",
      duration: game.duration ? `${game.duration} minutes` : "25 minutes",
      points: 100,
      available: true,
      type: "simulation",
      objectives: [game.description || `Complete ${game.title}`],
      maxScore: 100,
      timeLimit: game.duration ? `${game.duration} minutes` : undefined,
      category: "security",
      skillsGained: [],
      challenges: [],
    }));

  // Generate resources from document content
  const resources: Resource[] = Object.values(groupedContent)
    .flat()
    .filter((item) => item.type === "document")
    .map((doc) => ({
      name: doc.title,
      type: "PDF" as const,
      size: "1.2 MB",
      category: "reference" as const,
      description: doc.description || doc.title,
      isContextual: false,
      relatedTopics: [doc.title],
    }));

  return {
    _id: moduleId,
    title: moduleTitle,
    description: moduleDescription,
    sections,
    labs,
    games,
    resources,
  };
};
