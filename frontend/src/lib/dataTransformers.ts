import { Module, Phase } from "./types";

// API response types
interface ApiModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  difficulty: string;
  topics?: string[];
  phaseId?: string;
  content?: {
    videos: string[];
    labs: string[];
    games: string[];
    documents: string[];
    estimatedHours: number;
  };
  phase?: {
    id: string;
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
  id: string;
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

/**
 * Transform API module data to frontend module format
 */
export const transformApiModule = (
  apiModule: ApiModule,
  userProgress?: UserProgress[]
): Module => {
  // Get user progress for this module
  const moduleProgress = userProgress?.find((p) => p.moduleId === apiModule.id);

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
    id: apiModule.id,
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
    phaseId: apiModule.phaseId || apiModule.phase?.id,
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
    id: apiPhase.id,
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
            module.phaseId === phase.id || module.phase?.id === phase.id
        )
        .map((module) => transformApiModule(module, userProgress))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      return transformApiPhase(phase, phaseModules);
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};
