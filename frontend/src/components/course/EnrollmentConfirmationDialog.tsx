import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Course } from "@/lib/types";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Gamepad2,
  Monitor,
  Play,
  Star,
  Users,
  Zap,
} from "lucide-react";

interface EnrollmentConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  course: Course;
  isEnrolling: boolean;
}

const EnrollmentConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  course,
  isEnrolling,
}: EnrollmentConfirmationDialogProps) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const lessonsCount =
    typeof course.lessons === "number" ? course.lessons : course.lessons.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-green-400/50 text-green-400 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-green-400 flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span>ENROLLMENT_CONFIRMATION</span>
          </DialogTitle>
          <DialogDescription className="text-green-300/70 font-mono">
            Initialize learning protocol for: {course.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Overview */}
          <div className="bg-green-400/5 border border-green-400/20 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-400/20 rounded-lg">
                <course.icon className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-300 font-mono mb-2">
                  {course.title}
                </h3>
                <p className="text-green-300/70 text-sm mb-3">
                  {course.description}
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  <Badge
                    variant="secondary"
                    className="bg-green-400/20 text-green-300"
                  >
                    {course.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1 text-green-300/70">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono">{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-300/70">
                    <Star className="w-3 h-3" />
                    <span className="font-mono">{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-300/70">
                    <Users className="w-3 h-3" />
                    <span className="font-mono">
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-3 text-center">
              <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-300 font-mono">
                {lessonsCount}
              </div>
              <div className="text-xs text-green-300/70 font-mono">LESSONS</div>
            </div>
            <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-3 text-center">
              <Monitor className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-cyan-300 font-mono">
                {course.labs}
              </div>
              <div className="text-xs text-cyan-300/70 font-mono">LABS</div>
            </div>
            <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-3 text-center">
              <Gamepad2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-300 font-mono">
                {course.games}
              </div>
              <div className="text-xs text-purple-300/70 font-mono">GAMES</div>
            </div>
            <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-3 text-center">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-yellow-300 font-mono">
                {course.assets}
              </div>
              <div className="text-xs text-yellow-300/70 font-mono">ASSETS</div>
            </div>
          </div>

          {/* Skills You'll Learn */}
          <div className="bg-green-400/5 border border-green-400/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-400 font-mono mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              SKILLS_YOU_WILL_ACQUIRE
            </h4>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-400/10 text-green-300 border border-green-400/30 font-mono text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {course.prerequisites &&
            course.prerequisites !== "None - Perfect for beginners" && (
              <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-400 font-mono mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  PREREQUISITES_REQUIRED
                </h4>
                <p className="text-yellow-300/70 text-sm font-mono">
                  {course.prerequisites}
                </p>
              </div>
            )}

          {/* Certification */}
          {course.certification && (
            <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-mono text-sm font-semibold">
                  CERTIFICATION_AVAILABLE
                </span>
              </div>
              <p className="text-blue-300/70 text-xs font-mono mt-1">
                Complete this course to earn a verified certificate
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isEnrolling}
            className="font-mono text-green-400 border-green-400/30 hover:bg-green-400/10"
          >
            CANCEL_MISSION
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isEnrolling}
            className="bg-gradient-to-r from-green-400 to-green-300 text-black hover:from-green-300 hover:to-green-200 font-mono font-bold"
          >
            {isEnrolling ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span>ENROLLING...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>CONFIRM_ENROLLMENT</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentConfirmationDialog;
