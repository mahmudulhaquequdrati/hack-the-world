import { Button } from "@/components/ui/button";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { CheckCircle, Loader2, Play, UserCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface EnrollmentButtonProps {
  enrollmentStatus: string;
  onEnrollment: () => Promise<void>;
  disabled?: boolean;
  isLoadingEnrollment?: boolean;
  moduleId?: string; // Add moduleId to support enrollment checking
}

const EnrollmentButton = ({
  enrollmentStatus,
  onEnrollment,
  disabled = false,
  isLoadingEnrollment = false,
  moduleId,
}: EnrollmentButtonProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthRTK();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const isEnrolled = enrollmentStatus === "enrolled";

  const handleEnrollment = async () => {
    if (disabled || isEnrolling || isLoadingEnrollment) {
      return;
    }

    // Check authentication first
    if (!isAuthenticated) {
      // Store current location to redirect back after login
      const currentLocation = window.location.pathname;
      navigate("/login", {
        state: {
          from: currentLocation,
          enrollModuleId: moduleId,
        },
      });
      return;
    }

    setIsEnrolling(true);
    try {
      await onEnrollment();
      if (!isEnrolled) {
        toast.success("Enrollment Successful!", {
          description:
            "Welcome to the mission. Your learning journey begins now.",
          duration: 4000,
        });
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
      toast.error("Enrollment Failed", {
        description:
          "There was an issue enrolling you in this course. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const getButtonText = () => {
    if (isLoadingEnrollment) return "LOADING_ENROLLMENT_STATUS...";
    if (isEnrolling) return "ENROLLING_IN_MISSION...";
    if (isEnrolled) return "> CONTINUE_MISSION";
    if (!isAuthenticated) return "> INITIALIZE_LEARNING_PROTOCOL";
    return "> INITIALIZE_LEARNING_PROTOCOL";
  };

  const getButtonIcon = () => {
    if (isLoadingEnrollment || isEnrolling)
      return <Loader2 className="w-6 h-6 animate-spin" />;
    if (isEnrolled) return <CheckCircle className="w-6 h-6" />;
    return <Play className="w-6 h-6" />;
  };

  const isButtonDisabled = disabled || isEnrolling || isLoadingEnrollment;

  return (
    <div className="mb-12">
      <div className="bg-black border-2 border-green-400/50 rounded-lg p-2 relative overflow-hidden">
        <Button
          onClick={handleEnrollment}
          size="lg"
          disabled={isButtonDisabled}
          className={`w-full font-mono font-bold text-lg py-6 relative overflow-hidden group transition-all duration-300 ${
            isEnrolled
              ? "bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 "
              : "bg-gradient-to-r from-green-400 to-green-300 text-black hover:from-green-300 hover:to-green-200"
          } ${isButtonDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
          <div className="relative flex items-center justify-center space-x-3">
            {getButtonIcon()}
            <span>{getButtonText()}</span>
          </div>
        </Button>

        {/* Button glow effect */}
        <div
          className={`absolute inset-0 border-2 rounded-lg pointer-events-none ${
            isEnrolled
              ? "border-green-400/20 animate-pulse"
              : "border-yellow-400/20 animate-pulse"
          }`}
        ></div>
      </div>

      {/* Authentication reminder for non-authenticated users */}
      {!isAuthenticated && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <UserCheck className="w-5 h-5 text-blue-400" />
            <h4 className="text-blue-400 font-mono font-semibold">
              AUTHENTICATION_REQUIRED
            </h4>
          </div>
          <p className="text-blue-300/80 text-sm font-mono">
            Login required to enroll in modules and track progress.
          </p>
        </div>
      )}
    </div>
  );
};

export default EnrollmentButton;
