import { useState, useEffect } from "react";
import { Play, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";

interface HeaderProps {
  navigate: (path: string) => void;
}

export function Header({ navigate }: HeaderProps) {
  // Check if user is logged in (in real app, this would come from auth context)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulate checking login status
  useEffect(() => {
    // In real app, check auth token or context
    const checkAuth = () => {
      // For demo, we'll check if we're on dashboard or course pages
      const currentPath = window.location.pathname;
      setIsLoggedIn(
        currentPath.includes("/dashboard") ||
          currentPath.includes("/course/") ||
          currentPath.includes("/learn/")
      );
    };

    checkAuth();
    // Listen for route changes
    window.addEventListener("popstate", checkAuth);
    return () => window.removeEventListener("popstate", checkAuth);
  }, []);

  return (
    <nav className="flex justify-between items-center p-6 lg:px-24 border-b border-green-400/20 ">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Terminal className="w-8 h-8 text-green-400" />
        <span className="text-xl font-bold text-green-400">
          CyberSec Academy
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <UserAvatar />
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-green-400 hover:bg-green-400/10 hacker-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              size="lg"
              className="bg-green-400 text-black hover:bg-green-300 font-medium"
              onClick={() => navigate("/signup")}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Hacking
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
