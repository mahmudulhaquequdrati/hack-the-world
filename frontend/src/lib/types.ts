import { LucideIcon } from "lucide-react";

export interface Module {
  _id: string; // MongoDB ObjectId as string
  title: string;
  description: string;
  icon: LucideIcon | string; // Support both string from API and LucideIcon for frontend
  duration: string | number;
  difficulty: string;
  progress?: number; // Make optional for API data
  color: string;
  bgColor?: string; // Make optional, computed in frontend
  borderColor?: string; // Make optional, computed in frontend
  topics: string[];
  labs?: number; // Make optional, computed from content
  games?: number; // Make optional, computed from content
  assets?: number; // Make optional, computed from content
  enrolled?: boolean; // Make optional, computed from user progress
  completed?: boolean; // Make optional, computed from user progress
  phaseId?: string; // MongoDB ObjectId as string - optional for backwards compatibility
  // API specific fields
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

export interface Phase {
  _id: string; // MongoDB ObjectId as string
  title: string;
  description: string;
  icon: LucideIcon | string; // Support both string from API and LucideIcon for frontend
  color: string;
  modules?: Module[]; // Make optional, might be populated separately
  // API specific fields
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  _id: string;
  contentId?: string; // Real MongoDB ID for progress tracking
  title: string;
  type: string;
  duration: string;
  completed: boolean;
  description?: string;
  content?: string;
}

export interface LearningOutcome {
  title: string;
  description: string;
  skills: string[];
}

export interface LabItem {
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  skills: string[];
}

export interface GameItem {
  name: string;
  description: string;
  points: number;
  type: string;
}

export interface Instructor {
  name: string;
  title: string;
  avatar: string;
  experience: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string | number;
  icon: LucideIcon | string; // Support both string from API and LucideIcon for frontend
  color: string;
  bgColor: string;
  borderColor: string;
  enrolled: boolean;
  progress: number;
  lessons: Lesson[] | number;
  labs: number;
  games: number;
  assets: number;
  rating: number;
  students: number;
  price: string;
  skills: string[];
  prerequisites: string;
  certification: boolean;
  instructor: Instructor;

  learningOutcomes: LearningOutcome[];
  labsData?: LabItem[];
  gamesData?: GameItem[];
}

// Enrolled Course Types
export interface EnrolledLesson {
  _id: string;
  contentId?: string; // Real MongoDB ID for progress tracking
  title: string;
  duration: string;
  type: "video" | "text" | "quiz" | "lab" | "game";
  completed: boolean;
  description: string;
  videoUrl?: string;
  content?: string;
  questions?: QuizQuestion[];
  dynamicResources?: Resource[];
  relatedLabs?: string[];
  relatedGames?: string[];
  contextualContent?: ContextualContent;
  resources?: Resource[]; // Updated to use new Resource structure
  outcomes?: ContentOutcome[]; // Add outcomes for labs and games
  instructions?: string; // Add instructions for labs and games
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface CourseSection {
  _id: string;
  title: string;
  lessons: EnrolledLesson[];
}

export interface Lab {
  _id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  completed: boolean;
  available: boolean;
  objectives: string[];
  prerequisites: string[];
  tools: string[];
  steps: LabStep[];
  hints: string[];
  solution?: string;
  category: string;
  estimatedTime: string;
  skillsGained: string[];
  outcomes?: ContentOutcome[]; // Add outcomes for labs
  resources?: Resource[]; // Add structured resources
  instructions?: string; // Add instructions
}

export interface Game {
  _id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  points: number;
  available: boolean;
  type: "simulation" | "puzzle" | "strategy" | "quiz" | "ctf" | "scenario";
  objectives: string[];
  maxScore: number;
  timeLimit?: string;
  category: string;
  skillsGained: string[];
  challenges: GameChallenge[];
  outcomes?: ContentOutcome[]; // Add outcomes for games
  resources?: Resource[]; // Add structured resources
  instructions?: string; // Add instructions
}

export interface Resource {
  name: string;
  type: "url" | "file" | "document" | "tool" | "reference" | "video" | "download";
  url?: string;
  description?: string;
  size?: string;
  category?: "essential" | "supplementary" | "advanced";
  icon?: string;
  downloadable?: boolean;
  // Legacy fields for backwards compatibility
  downloadUrl?: string;
  isContextual?: boolean;
  relatedTopics?: string[];
}

export interface ContentOutcome {
  title: string;
  description: string;
  skills: string[];
  category?: "primary" | "secondary";
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export interface Playground {
  title: string;
  description: string;
  tools: string[];
  available: boolean;
}

export interface PlaygroundMode {
  _id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface EnrolledCourse {
  title: string;
  description: string;
  icon: LucideIcon | string; // Support both string from API and LucideIcon for frontend
  color: string;
  bgColor: string;
  borderColor: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  sections: CourseSection[];
  labs: Lab[];
  playground: Playground;
  resources: Resource[];
  games: Game[];
}

export interface TerminalMessage {
  type: string;
  content: string;
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export interface LabStep {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
  experienceLevel: "beginner" | "intermediate" | "advanced" | "expert";
  stats: {
    totalPoints: number;
    level: number;
    coursesCompleted: number;
    labsCompleted: number;
    gamesCompleted: number;
    achievementsEarned: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContextualContent {
  objectives: string[];
  keyPoints: string[];
  practicalExercises: string[];
  realWorldApplications: string[];
  troubleshootingTips?: string[];
  securityConsiderations?: string[];
}

export interface GameChallenge {
  _id: string;
  title: string;
  description: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
}
