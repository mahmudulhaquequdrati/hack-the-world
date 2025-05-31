import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

interface PasswordSettingsProps {
  onPasswordUpdate: (data: PasswordUpdateData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordSettings: React.FC<PasswordSettingsProps> = ({
  onPasswordUpdate,
  isLoading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState<PasswordUpdateData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (password: string): string[] => {
    const issues = [];
    if (password.length < 8) issues.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) issues.push("One uppercase letter");
    if (!/[a-z]/.test(password)) issues.push("One lowercase letter");
    if (!/\d/.test(password)) issues.push("One number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      issues.push("One special character");
    return issues;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordIssues = validatePassword(formData.newPassword);
      if (passwordIssues.length > 0) {
        newErrors.newPassword = `Password must have: ${passwordIssues.join(
          ", "
        )}`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      await onPasswordUpdate(formData);

      // Clear form on success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      // Error handling is done by the parent component
    }
  };

  const handleInputChange = (
    field: keyof PasswordUpdateData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const passwordStrength = formData.newPassword
    ? validatePassword(formData.newPassword)
    : [];

  return (
    <Card className={`border-green-500/30 bg-slate-900/50 ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl text-green-400 font-mono flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Password Settings
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Keep your account secure by using a strong, unique password.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-green-400 font-mono"
            >
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                className="bg-black/50 border-green-500/30 text-green-400 font-mono pr-10"
                placeholder="Enter your current password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
                disabled={isLoading}
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-400 text-sm font-mono">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-green-400 font-mono">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="bg-black/50 border-green-500/30 text-green-400 font-mono pr-10"
                placeholder="Enter your new password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
                disabled={isLoading}
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="text-sm text-gray-400 font-mono">
                  Password Requirements:
                </div>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {[
                    {
                      rule: "At least 8 characters",
                      valid: formData.newPassword.length >= 8,
                    },
                    {
                      rule: "One uppercase letter",
                      valid: /[A-Z]/.test(formData.newPassword),
                    },
                    {
                      rule: "One lowercase letter",
                      valid: /[a-z]/.test(formData.newPassword),
                    },
                    {
                      rule: "One number",
                      valid: /\d/.test(formData.newPassword),
                    },
                    {
                      rule: "One special character",
                      valid: /[!@#$%^&*(),.?":{}|<>]/.test(
                        formData.newPassword
                      ),
                    },
                  ].map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 ${
                        req.valid ? "text-green-400" : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          req.valid ? "bg-green-400" : "bg-gray-600"
                        }`}
                      />
                      {req.rule}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.newPassword && (
              <p className="text-red-400 text-sm font-mono">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-green-400 font-mono"
            >
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="bg-black/50 border-green-500/30 text-green-400 font-mono pr-10"
                placeholder="Confirm your new password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={isLoading}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm font-mono">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || passwordStrength.length > 0}
            className="w-full bg-green-600 hover:bg-green-700 text-black font-mono font-semibold"
          >
            {isLoading ? "Updating Password..." : "Update Password"}
          </Button>
        </form>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <h4 className="text-yellow-400 font-semibold mb-2 font-mono">
            Security Tips:
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Use a unique password that you don't use elsewhere</li>
            <li>• Consider using a password manager</li>
            <li>• Avoid common words, names, or personal information</li>
            <li>• Update your password regularly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordSettings;
