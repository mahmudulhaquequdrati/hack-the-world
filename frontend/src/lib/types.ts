import { LucideIcon } from "lucide-react";

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  difficulty: string;
  progress: number;
  color: string;
  bgColor: string;
  borderColor: string;
  topics: string[];
  path: string;
  enrollPath: string;
  labs: number;
  games: number;
  assets: number;
  enrolled: boolean;
  completed: boolean;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  modules: Module[];
}

export interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: string;
  completed: boolean;
  description?: string;
  content?: string;
}

export interface CurriculumSection {
  title: string;
  lessons: number;
  duration: string;
  topics: string[];
  completed: boolean;
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

export interface AssetItem {
  name: string;
  type: string;
  size: string;
}

export interface Instructor {
  name: string;
  title: string;
  avatar: string;
  experience: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  icon: LucideIcon;
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
  curriculum: CurriculumSection[];
  learningOutcomes: LearningOutcome[];
  labsData: LabItem[];
  gamesData: GameItem[];
  assetsData: AssetItem[];
  enrollPath: string;
}

// Enrolled Course Types
export interface EnrolledLesson {
  id: string;
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
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: EnrolledLesson[];
}

export interface Lab {
  id: string;
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
}

export interface Game {
  id: string;
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
}

export interface Resource {
  name: string;
  type: string;
  size: string;
  category?: "reference" | "template" | "tool" | "guide" | "exercise";
  description?: string;
  downloadUrl?: string;
  isContextual?: boolean;
  relatedTopics?: string[];
}

export interface PlaygroundTool {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

export interface Playground {
  title: string;
  description: string;
  tools: string[];
  available: boolean;
}

export interface PlaygroundMode {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface EnrolledCourse {
  title: string;
  description: string;
  icon: LucideIcon;
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
  type: "command" | "output" | "ai";
  content: string;
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export interface LabStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface LabData {
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  objectives: string[];
  steps: LabStep[];
}

export interface GameData {
  name: string;
  description: string;
  type: string;
  maxPoints: number;
  timeLimit?: string;
  objectives: string[];
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  level?: string;
  points?: number;
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
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
}
