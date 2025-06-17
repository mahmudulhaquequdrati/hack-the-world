// Course and module types for Next.js application
export interface Phase {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  order: number;
  isActive: boolean;
  modules?: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  phaseId: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  order: number;
  isActive: boolean;
  estimatedDuration: number;
  prerequisites: string[];
  labs?: number;
  games?: number;
  content?: {
    videos?: Content[];
    documents?: Content[];
    labs?: Content[];
    games?: Content[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: "video" | "document" | "lab" | "game";
  moduleId: string;
  order: number;
  duration: number;
  isActive: boolean;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UserEnrollment {
  id: string;
  userId: string;
  moduleId: string;
  enrolledAt: string;
  completedAt?: string;
  status: "active" | "paused" | "completed";
  progress: number;
  currentContentId?: string;
  module?: Module;
}

export interface UserProgress {
  id: string;
  userId: string;
  contentId: string;
  moduleId: string;
  progress: number;
  completedAt?: string;
  isCompleted: boolean;
  timeSpent: number;
  score?: number;
  content?: Content;
}