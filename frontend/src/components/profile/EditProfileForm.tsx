import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  UpdateProfileRequest,
  User,
  useUpdateProfileMutation,
} from "@/features/auth/authApi";
import { Check, CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface EditProfileFormProps {
  user: User;
  onCancel: () => void;
  onSuccess: () => void;
  className?: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onCancel,
  onSuccess,
  className = "",
}) => {
  const [updateProfile, { isLoading, isSuccess }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: user.profile.firstName || "",
    lastName: user.profile.lastName || "",
    displayName: user.profile.displayName || "",
    bio: user.profile.bio || "",
    location: user.profile.location || "",
    website: user.profile.website || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle success feedback
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 1500); // Show success message for 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onSuccess]);

  const handleInputChange = (
    field: keyof UpdateProfileRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate website URL if provided
    if (formData.website && formData.website.trim()) {
      if (!/^https?:\/\/.+/.test(formData.website.trim())) {
        newErrors.website =
          "Website must be a valid URL starting with http:// or https://";
      }
    }

    // Validate field lengths
    if (formData.firstName && formData.firstName.length > 50) {
      newErrors.firstName = "First name cannot exceed 50 characters";
    }
    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = "Last name cannot exceed 50 characters";
    }
    if (formData.displayName && formData.displayName.length > 100) {
      newErrors.displayName = "Display name cannot exceed 100 characters";
    }
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio cannot exceed 500 characters";
    }
    if (formData.location && formData.location.length > 100) {
      newErrors.location = "Location cannot exceed 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Filter out empty strings and send only changed fields
      const updateData: UpdateProfileRequest = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim()) {
          updateData[key as keyof UpdateProfileRequest] = value.trim();
        } else if (value === "") {
          // Allow clearing fields by sending empty string
          updateData[key as keyof UpdateProfileRequest] = "";
        }
      });

      await updateProfile(updateData).unwrap();
      // Success is handled by useEffect
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);

      // Handle validation errors from server
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as {
          errors?: Array<{ field?: string; msg: string }>;
        };
        if (errorData?.errors) {
          const serverErrors: Record<string, string> = {};
          errorData.errors.forEach((err) => {
            if (err.field) {
              serverErrors[err.field] = err.msg;
            }
          });
          setErrors(serverErrors);
        }
      }
    }
  };

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.firstName !== (user.profile.firstName || "") ||
      formData.lastName !== (user.profile.lastName || "") ||
      formData.displayName !== (user.profile.displayName || "") ||
      formData.bio !== (user.profile.bio || "") ||
      formData.location !== (user.profile.location || "") ||
      formData.website !== (user.profile.website || "")
    );
  };

  // Show success overlay
  if (showSuccess) {
    return (
      <Card className={`border-green-500/30 bg-slate-900/50 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
            Profile Updated!
          </h3>
          <p className="text-gray-400 text-center">
            Your profile information has been successfully updated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-green-500/30 bg-slate-900/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-green-400 font-mono">
              Edit Profile
            </CardTitle>
            <p className="text-gray-400">
              Update your profile information below.
            </p>
          </div>
          {hasChanges() && (
            <Badge
              variant="outline"
              className="border-yellow-500/50 text-yellow-400"
            >
              Unsaved Changes
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-green-400 font-mono">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-black/30 border-green-500/30 text-green-100 font-mono"
                placeholder="Enter your first name"
                maxLength={50}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-green-400 font-mono">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-black/30 border-green-500/30 text-green-100 font-mono"
                placeholder="Enter your last name"
                maxLength={50}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-green-400 font-mono">
              Display Name
            </Label>
            <Input
              id="displayName"
              type="text"
              value={formData.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              className="bg-black/30 border-green-500/30 text-green-100 font-mono"
              placeholder="How should others see your name?"
              maxLength={100}
              disabled={isLoading}
            />
            {errors.displayName && (
              <p className="text-red-400 text-sm">{errors.displayName}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-green-400 font-mono">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-black/30 border-green-500/30 text-green-100 font-mono min-h-[100px]"
              placeholder="Tell us about yourself..."
              maxLength={500}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              {errors.bio && (
                <p className="text-red-400 text-sm">{errors.bio}</p>
              )}
              <p
                className={`text-sm ml-auto ${
                  (formData.bio || "").length > 450
                    ? "text-yellow-400"
                    : "text-gray-500"
                }`}
              >
                {(formData.bio || "").length}/500
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-green-400 font-mono">
              Location
            </Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-black/30 border-green-500/30 text-green-100 font-mono"
              placeholder="Where are you based?"
              maxLength={100}
              disabled={isLoading}
            />
            {errors.location && (
              <p className="text-red-400 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-green-400 font-mono">
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="bg-black/30 border-green-500/30 text-green-100 font-mono"
              placeholder="https://your-website.com"
              disabled={isLoading}
            />
            {errors.website && (
              <p className="text-red-400 text-sm">{errors.website}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !hasChanges()}
              className="bg-green-600 hover:bg-green-700 text-black font-mono flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 font-mono flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfileForm;
