import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Terminal,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthRTK();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validate form
    if (!formData.login.trim() || !formData.password) {
      setLocalError("Please enter both username/email and password");
      return;
    }

    try {
      await login({
        login: formData.login.trim(),
        password: formData.password,
      });

      // Successful login - navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Error is handled by the RTK Query hook
      console.error("Login failed:", err);
    }
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden flex items-center justify-center">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-rain"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-green-400 hover:bg-green-400/10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-black/90 border-green-400 terminal-window">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full border border-green-400/50 bg-green-400/10">
                <Terminal className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-400">
              Access Terminal
            </CardTitle>
            <p className="text-green-300/70">
              Enter your credentials to access the cyber range
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {displayError && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  {displayError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="login"
                  className="text-green-400 flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Username or Email
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="agent@terminal-hacks.space"
                  value={formData.login}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, login: e.target.value }))
                  }
                  className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400 "
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-green-400 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-green-400/70 hover:text-green-400"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Access Granted
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-green-300/70 text-sm">
                Don't have access credentials?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-green-400 hover:text-green-300 underline"
                  disabled={isLoading}
                >
                  Request Access
                </button>
              </p>
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-green-400/70 hover:text-green-400 underline text-xs"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Terminal-style footer */}
            <div className="border-t border-green-400/30 pt-4">
              <div className="font-mono text-xs text-green-400/70">
                <div>
                  $ ssh {formData.login || "agent"}@terminal-hacks.space
                </div>
                <div>
                  {isLoading
                    ? "Authenticating credentials..."
                    : "Connecting to secure terminal..."}
                </div>
                <div className="flex items-center">
                  <span>Password: </span>
                  <span className="ml-2 text-green-400">
                    {"*".repeat(formData.password.length)}
                  </span>
                  <span className="terminal-cursor ml-1">|</span>
                </div>
                {displayError && (
                  <div className="text-red-400 mt-1">
                    ! Authentication failed: Access denied
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
