// Authentication types for Next.js application
export interface User {
  id: string;
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

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expiresIn: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
}

export interface APIErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (resetToken: string, password: string) => Promise<AuthResponse>;
  getCurrentUser: () => Promise<User>;
  clearError: () => void;
}