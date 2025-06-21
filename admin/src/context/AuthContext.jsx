import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// Set up axios defaults
const API_BASE_URL = "http://localhost:5001/api";
axios.defaults.baseURL = API_BASE_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored token on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // Set authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Verify token with backend
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get("/auth/me");
      if (response.data.success && response.data.data.user.role === "admin") {
        setUser(response.data.data.user);
      } else {
        // User is not admin
        logout();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    console.log("AuthContext login called with:", credentials);
    
    try {
      console.log("Making login request to:", `${API_BASE_URL}/auth/login`);
      
      const response = await axios.post("/auth/login", {
        login: credentials.email, // Backend accepts email or username in 'login' field
        password: credentials.password,
      });

      console.log("Login response:", response.data);

      if (response.data.success) {
        const { user, token } = response.data.data;

        console.log("User data:", user);

        // Check if user is admin with active status
        if (user.role !== "admin") {
          console.log("Login failed: User is not admin");
          return {
            success: false,
            error: "Admin access required"
          };
        }

        if (user.adminStatus !== "active") {
          console.log("Login failed: Admin account not activated");
          return {
            success: false,
            error: "Admin account not activated. Please contact an administrator."
          };
        }

        // Store token and set headers
        localStorage.setItem("adminToken", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);

        console.log("Login successful, user set");
        return { success: true };
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = "Login failed";
      
      // Helper function to extract string from error response
      const extractErrorMessage = (errorData) => {
        if (typeof errorData === 'string') {
          return errorData;
        }
        if (typeof errorData === 'object' && errorData?.message) {
          return errorData.message;
        }
        return null;
      };
      
      // Handle specific error cases
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || "15 minutes";
        errorMessage = `Too many login attempts. Please try again in ${retryAfter}.`;
      } else if (error.response?.data?.error) {
        const extracted = extractErrorMessage(error.response.data.error);
        errorMessage = extracted || "Authentication failed";
      } else if (error.response?.data?.message) {
        const extracted = extractErrorMessage(error.response.data.message);
        errorMessage = extracted || "Login failed";
      } else if (error.response?.data) {
        // Fallback: try to extract message from root data object
        const extracted = extractErrorMessage(error.response.data);
        errorMessage = extracted || "Login failed";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Ensure errorMessage is always a string to prevent React rendering errors
      const finalErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Login failed. Please try again.';
      
      return {
        success: false,
        error: finalErrorMessage,
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/auth/register", {
        username: userData.name.toLowerCase().replace(/\s+/g, ""), // Generate username from name
        email: userData.email,
        password: userData.password,
        firstName: userData.name.split(" ")[0],
        lastName: userData.name.split(" ").slice(1).join(" "),
        role: "admin", // Register as admin
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store token and set headers
        localStorage.setItem("adminToken", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);

        return { success: true };
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
