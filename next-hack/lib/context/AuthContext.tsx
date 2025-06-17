"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AuthContextType,
} from "@/lib/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("hackToken");
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
          
          // Fetch current user data
          await fetchCurrentUser(storedToken);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid token
        localStorage.removeItem("hackToken");
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setUser(data.data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      // Don't throw error here, just log it
    }
  };

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store credentials
      setUser(data.data.user);
      setToken(data.data.token);
      setIsAuthenticated(true);
      localStorage.setItem("hackToken", data.data.token);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store credentials
      setUser(data.data.user);
      setToken(data.data.token);
      setIsAuthenticated(true);
      localStorage.setItem("hackToken", data.data.token);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.warn("Logout endpoint failed, clearing local state anyway:", error);
    } finally {
      // Clear state regardless of API call success
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("hackToken");
      router.push("/login");
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (resetToken: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: resetToken, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      // Store credentials (user is automatically logged in after reset)
      setUser(data.data.user);
      setToken(data.data.token);
      setIsAuthenticated(true);
      localStorage.setItem("hackToken", data.data.token);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password reset failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async (): Promise<User> => {
    try {
      if (!token) {
        throw new Error("No authentication token");
      }

      await fetchCurrentUser(token);
      
      if (!user) {
        throw new Error("Failed to get user profile");
      }

      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get user profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}