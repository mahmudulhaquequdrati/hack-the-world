import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Terminal,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated } = useAuthRTK();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    experienceLevel: "beginner" as "beginner" | "intermediate" | "advanced",
    agreeToTerms: false,
  });
  const [localError, setLocalError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/overview");
    return null;
  }

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
    // Username validation
    if (!formData.username.trim()) {
      return "Username is required";
    }
    if (formData.username.length < 3 || formData.username.length > 30) {
      return "Username must be between 3 and 30 characters";
    }
    if (!/^[a-z0-9_-]+$/.test(formData.username)) {
      return "Username can only contain lowercase letters, numbers, underscores, and hyphens";
    }

    // Email validation
    if (!formData.email.trim()) {
      return "Email is required";
    }

    // Password validation
    if (!formData.password) {
      return "Password is required";
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      return "You must agree to the Terms of Service and Privacy Policy";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        username: formData.username.toLowerCase().trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        experienceLevel: formData.experienceLevel,
      };

      await register(registrationData);

      // Successful registration - navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Error is handled by the RTK Query hook
      console.error("Registration failed:", err);
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-400";
    if (strength <= 3) return "bg-yellow-400";
    return "bg-green-400";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden flex items-center justify-center py-8">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-rain"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <Card className="bg-black/90 border-green-400 terminal-window">
          <CardHeader className="text-center space-y-4">
            <Link to="/" className="flex justify-center">
              <div className="p-3 rounded-full border border-green-400/50 bg-green-400/10">
                <Terminal className="w-8 h-8 text-green-400" />
              </div>
            </Link>
            <CardTitle className="text-2xl font-bold text-green-400">
              Join the Academy
            </CardTitle>
            <p className="text-green-300/70">
              Create your account to start your cybersecurity journey
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
                  htmlFor="username"
                  className="text-green-400 flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="cyberhacker2024"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value.toLowerCase(),
                    }))
                  }
                  className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-green-400/70">
                  3-30 characters, lowercase letters, numbers, underscores, and
                  hyphens only
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-green-400 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-green-400 flex items-center"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-green-400 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@domain.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="experienceLevel"
                  className="text-green-400 flex items-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Experience Level
                </Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(
                    value: "beginner" | "intermediate" | "advanced"
                  ) =>
                    setFormData((prev) => ({ ...prev, experienceLevel: value }))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-black border-green-400/30 text-green-400 focus:border-green-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-400/30 text-green-400">
                    <SelectItem value="beginner">
                      Beginner - New to cybersecurity
                    </SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate - Some security knowledge
                    </SelectItem>
                    <SelectItem value="advanced">
                      Advanced - Experienced security professional
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i < passwordStrength
                              ? getStrengthColor(passwordStrength)
                              : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs ${
                        passwordStrength <= 2
                          ? "text-red-400"
                          : passwordStrength <= 3
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      Password strength: {getStrengthText(passwordStrength)}
                    </p>
                    <p className="text-xs text-green-400/70">
                      Must contain: uppercase, lowercase, number, and special
                      character
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-green-400 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-green-400/70 hover:text-green-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-xs">
                      Passwords do not match
                    </p>
                  )}
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword &&
                  formData.password && (
                    <p className="text-green-400 text-xs flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Passwords match
                    </p>
                  )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeToTerms: checked as boolean,
                    }))
                  }
                  className="border-green-400 data-[state=checked]:bg-green-400 data-[state=checked]:text-black"
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm text-green-300/70">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    Privacy Policy
                  </button>
                </Label>
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
                      <span>CREATING_ACCOUNT...</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-5 h-5" />
                      <span>CREATE_ACCOUNT</span>
                    </>
                  )}
                </div>
              </Button>
            </form>

            <div className="text-center">
              <p className="text-green-300/70 text-sm">
                Already have an account?{" "}
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
                <div>$ useradd {formData.username || "newagent"}</div>
                <div>$ passwd {formData.username || "newagent"}</div>
                <div>
                  {isLoading
                    ? "Creating secure profile..."
                    : "Ready for deployment"}
                </div>
                <div className="flex items-center">
                  <span>Status: </span>
                  <span className="ml-2 text-green-400">
                    {isLoading ? "Initializing..." : "Ready for deployment"}
                  </span>
                  <span className="terminal-cursor ml-1">|</span>
                </div>
                {displayError && (
                  <div className="text-red-400 mt-1">
                    ! Registration failed: {displayError}
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

export default SignupPage;
