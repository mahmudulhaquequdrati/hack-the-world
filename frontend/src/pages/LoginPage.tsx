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
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated } = useAuthRTK();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  // Get the location the user was trying to access before login
  const from = location.state?.from || "/dashboard";
  const enrollModuleId = location.state?.enrollModuleId;

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from);
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

      // Successful login - navigate back to where they came from
      // If they were trying to enroll in a specific module, go back there
      if (enrollModuleId && from !== "/dashboard") {
        navigate(from, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error is handled by the RTK Query hook
      console.error("Login failed:", err);
    }
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,0,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,0,0.05),transparent_70%)]"></div>

      {/* Terminal-style grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-green-400/20"></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-400/10 p-3 ring-2 ring-green-400/20">
                <Shield className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-green-400 font-mono">
                ACCESS_TERMINAL
              </h1>
              <p className="mt-2 text-sm text-green-300/70 font-mono">
                {enrollModuleId
                  ? "Authentication required to enroll in module"
                  : "Enter your credentials to access the system"}
              </p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border border-green-400/30 bg-black/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-green-400 font-mono flex items-center justify-center gap-2">
                <Terminal className="h-5 w-5" />
                LOGIN_PROTOCOL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayError && (
                <Alert className="border-red-500/50 bg-red-900/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300 font-mono text-sm">
                    {displayError}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="login"
                    className="text-green-400 font-mono text-sm"
                  >
                    USERNAME_OR_EMAIL
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400/70" />
                    <Input
                      id="login"
                      type="text"
                      value={formData.login}
                      onChange={(e) =>
                        setFormData({ ...formData, login: e.target.value })
                      }
                      className="pl-10 bg-black/50 border-green-400/30 text-green-300 placeholder:text-green-400/50 focus:border-green-400 font-mono"
                      placeholder="Enter username or email"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-green-400 font-mono text-sm"
                  >
                    PASSWORD
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400/70" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 pr-10 bg-black/50 border-green-400/30 text-green-300 placeholder:text-green-400/50 focus:border-green-400 font-mono"
                      placeholder="Enter password"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400/70 hover:text-green-400 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-400 to-green-300 text-black hover:from-green-300 hover:to-green-200 font-mono font-bold py-6 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>AUTHENTICATING...</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-5 h-5" />
                        <span>INITIALIZE_LOGIN</span>
                      </>
                    )}
                  </div>
                </Button>
              </form>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-green-400/70 hover:text-green-400 font-mono transition-colors"
                  disabled={isLoading}
                >
                  FORGOT_PASSWORD?
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="text-sm text-green-400/70 font-mono">
              Don't have access credentials?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-green-400 hover:text-green-300 transition-colors font-bold"
                disabled={isLoading}
              >
                REQUEST_ACCESS
              </button>
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm text-green-400/70 hover:text-green-400 transition-colors font-mono"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              RETURN_TO_BASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
