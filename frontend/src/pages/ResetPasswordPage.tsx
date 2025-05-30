import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * Reset Password Page Component
 *
 * Security Implementation:
 * - Only stores "hackToken" in localStorage
 * - User data is kept in Redux state only (never in localStorage)
 * - Follows security best practices for sensitive data handling
 */
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isAuthenticated } = useAuthRTK();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  // Get token from URL params
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid or missing reset token");
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const validateForm = () => {
    if (!token) {
      setError("Invalid reset token");
      return false;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token!, formData.password);
      setIsSuccess(true);

      // Redirect to overview after successful reset (user is automatically logged in)
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
      case 5:
        return "Strong";
      default:
        return "";
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative overflow-hidden flex items-center justify-center">
        {/* Background Matrix Effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="matrix-rain"></div>
        </div>

        <div className="relative z-10 w-full max-w-md p-6">
          <Card className="bg-black/90 border-green-400 terminal-window">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full border border-green-400/50 bg-green-400/10">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-green-400">
                Password Reset Successful
              </CardTitle>
              <p className="text-green-300/70">
                Your password has been successfully reset. You are now logged
                in.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
                  <p className="text-green-300 text-sm">
                    Redirecting to your dashboard...
                  </p>
                </div>

                <Button
                  className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn font-bold"
                  onClick={() => navigate("/dashboard")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              {/* Terminal-style footer */}
              <div className="border-t border-green-400/30 pt-4">
                <div className="font-mono text-xs text-green-400/70">
                  <div>$ passwd --reset --complete</div>
                  <div>Password updated successfully</div>
                  <div className="flex items-center">
                    <span>Status: </span>
                    <span className="ml-2 text-green-400">
                      Authentication granted
                    </span>
                    <span className="terminal-cursor ml-1">|</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>

        <Card className="bg-black/90 border-green-400 terminal-window">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full border border-green-400/50 bg-green-400/10">
                <Terminal className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-400">
              Reset Your Password
            </CardTitle>
            <p className="text-green-300/70">
              Enter your new password to complete the reset process
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-green-400 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400/70 hover:text-green-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400/70">
                        Password Strength:
                      </span>
                      <span
                        className={`font-medium ${
                          passwordStrength >= 4
                            ? "text-green-400"
                            : passwordStrength >= 3
                            ? "text-blue-400"
                            : passwordStrength >= 2
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{
                          width: `${(passwordStrength / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-green-400 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400/70 hover:text-green-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn font-bold"
                disabled={isLoading || !token || passwordStrength < 3}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-green-300/70 text-sm">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-green-400 hover:text-green-300 underline"
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </p>
            </div>

            {/* Terminal-style footer */}
            <div className="border-t border-green-400/30 pt-4">
              <div className="font-mono text-xs text-green-400/70">
                <div>
                  $ passwd --reset --token{" "}
                  {token ? "****" + token.slice(-4) : "invalid"}
                </div>
                <div>
                  {isLoading
                    ? "Updating password..."
                    : token
                    ? "Ready to reset password"
                    : "Invalid token"}
                </div>
                <div className="flex items-center">
                  <span>Status: </span>
                  <span className="ml-2 text-green-400">
                    {isLoading ? "Processing..." : token ? "Ready" : "Error"}
                  </span>
                  <span className="terminal-cursor ml-1">|</span>
                </div>
                {error && (
                  <div className="text-red-400 mt-1">
                    ! Reset failed: {error}
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

export default ResetPasswordPage;
