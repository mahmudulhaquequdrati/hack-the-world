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
  Mail,
  Shield,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, isAuthenticated, isLoading, error } = useAuthRTK();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validate email
    if (!email.trim()) {
      setLocalError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    setLocalLoading(true);

    try {
      await forgotPassword(email.toLowerCase().trim());
      setIsSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send reset email";
      setLocalError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const displayError = error || localError;
  const displayLoading = isLoading || localLoading;

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
                Reset Email Sent
              </CardTitle>
              <p className="text-green-300/70">
                If an account with that email exists, we have sent password
                reset instructions
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
                  <p className="text-green-300 text-sm">
                    Check your email for password reset instructions. The link
                    will expire in 10 minutes for security.
                  </p>
                </div>

                <Button
                  className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn font-bold"
                  onClick={() => navigate("/login")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>

                <p className="text-green-300/70 text-sm">
                  Didn't receive an email?{" "}
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    Try again
                  </button>
                </p>
              </div>

              {/* Terminal-style footer */}
              <div className="border-t border-green-400/30 pt-4">
                <div className="font-mono text-xs text-green-400/70">
                  <div>$ sendmail -t {email}</div>
                  <div>Message queued for delivery...</div>
                  <div className="flex items-center">
                    <span>Status: </span>
                    <span className="ml-2 text-green-400">
                      Email sent successfully
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
              Reset Password
            </CardTitle>
            <p className="text-green-300/70">
              Enter your email address and we'll send you a link to reset your
              password
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
                  htmlFor="email"
                  className="text-green-400 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400"
                  required
                  disabled={displayLoading}
                />
                <p className="text-xs text-green-400/70">
                  Enter the email address associated with your account
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn font-bold"
                disabled={displayLoading || !email.trim()}
              >
                {displayLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Reset Email...
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Email
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-green-300/70 text-sm">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-green-400 hover:text-green-300 underline"
                  disabled={displayLoading}
                >
                  Sign In
                </button>
              </p>
              <p className="text-green-300/70 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-green-400 hover:text-green-300 underline"
                  disabled={displayLoading}
                >
                  Create Account
                </button>
              </p>
            </div>

            {/* Terminal-style footer */}
            <div className="border-t border-green-400/30 pt-4">
              <div className="font-mono text-xs text-green-400/70">
                <div>$ passwd --reset {email || "user@domain.com"}</div>
                <div>
                  {displayLoading
                    ? "Generating reset token..."
                    : "Waiting for email input..."}
                </div>
                <div className="flex items-center">
                  <span>Status: </span>
                  <span className="ml-2 text-green-400">
                    {displayLoading ? "Processing..." : "Ready"}
                  </span>
                  <span className="terminal-cursor ml-1">|</span>
                </div>
                {displayError && (
                  <div className="text-red-400 mt-1">
                    ! Password reset failed: {displayError}
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

export default ForgotPasswordPage;
