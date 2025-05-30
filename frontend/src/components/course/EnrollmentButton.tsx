import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface EnrollmentButtonProps {
  enrollmentStatus: string;
  onEnrollment: () => void;
}

const EnrollmentButton = ({
  enrollmentStatus,
  onEnrollment,
}: EnrollmentButtonProps) => {
  return (
    <div className="mb-12">
      <div className="bg-black border-2 border-green-400/50 rounded-lg p-2 relative overflow-hidden">
        <Button
          onClick={onEnrollment}
          size="lg"
          className="w-full bg-gradient-to-r from-green-400 to-green-300 text-black hover:from-green-300 hover:to-green-200 font-mono font-bold text-lg py-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-green-400/20 group-hover:bg-green-400/30 transition-all duration-300"></div>
          <div className="relative flex items-center justify-center space-x-3">
            <Play className="w-6 h-6" />
            <span>
              {enrollmentStatus === "not-enrolled"
                ? "> INITIALIZE_LEARNING_PROTOCOL"
                : "> CONTINUE_MISSION"}
            </span>
          </div>
        </Button>

        {/* Button glow effect */}
        <div className="absolute inset-0 border-2 border-green-400/20 rounded-lg animate-pulse pointer-events-none"></div>
      </div>
    </div>
  );
};

export default EnrollmentButton;
