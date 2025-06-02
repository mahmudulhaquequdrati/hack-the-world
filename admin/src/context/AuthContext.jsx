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
    try {
      const response = await axios.post("/auth/login", {
        login: credentials.email, // Backend accepts email or username in 'login' field
        password: credentials.password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Check if user is admin with active status
        if (user.role !== "admin") {
          throw new Error("Admin access required");
        }

        if (user.adminStatus !== "active") {
          throw new Error(
            "Admin account not activated. Please contact an administrator."
          );
        }

        // Store token and set headers
        localStorage.setItem("adminToken", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);

        return { success: true };
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.log(error.response);
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed",
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
