// Route parameter types for Next.js API routes

export interface RouteParams {
  id: string;
}

export interface UserRouteParams {
  userId: string;
}

export interface ModuleRouteParams {
  moduleId: string;
}

export interface PhaseRouteParams {
  phaseId: string;
}

export interface ContentRouteParams {
  contentId: string;
}

export interface CategoryRouteParams {
  category: string;
}

export interface TypeRouteParams {
  type: string;
}

export interface UserContentParams {
  userId: string;
  contentType: string;
}

export interface UserModuleParams {
  userId: string;
  moduleId: string;
}

// Context types for route handlers
export interface RouteContext<T = Record<string, string>> {
  params: Promise<T>;
}

// Achievement statistics aggregation types
export interface AchievementStatsRaw {
  totalAchievements: number;
  completedAchievements: number;
  inProgressAchievements: number;
  totalPoints: number;
  avgProgress: number;
  achievementsByDifficulty: DifficultyItem[];
}

export interface DifficultyItem {
  difficulty: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  isCompleted: boolean;
}

export interface DifficultyStats {
  [key: string]: {
    total: number;
    completed: number;
  };
}

export interface UserRankInfo {
  rank: number;
  totalUsers: number;
}