import { useAuthRTK } from "@/hooks/useAuthRTK";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading } = useAuthRTK();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="font-mono text-green-400">
            <div>$ verifying credentials...</div>
            <div className="flex items-center justify-center">
              <span>Status: </span>
              <span className="ml-2">Authenticating</span>
              <span className="terminal-cursor ml-1">|</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
