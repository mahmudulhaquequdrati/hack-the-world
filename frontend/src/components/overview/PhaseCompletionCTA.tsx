import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phase } from "@/lib/types";
import { BookOpen } from "lucide-react";

interface PhaseCompletionCTAProps {
  phase: Phase;
  onStartPhase: () => void;
  onViewAllCourses: () => void;
}

const PhaseCompletionCTA = ({
  phase,
  onStartPhase,
  onViewAllCourses,
}: PhaseCompletionCTAProps) => {
  const getPhaseDescription = (phaseId: string) => {
    switch (phaseId) {
      case "beginner":
        return "Master the fundamentals to unlock intermediate courses";
      case "intermediate":
        return "Build practical skills to access advanced specializations";
      case "advanced":
        return "Become an expert in specialized cybersecurity domains";
      default:
        return "Continue your cybersecurity learning journey";
    }
  };

  return (
    <div className="text-center pt-8">
      <Card className="bg-black/50 border-green-400/30 max-w-2xl mx-auto">
        <CardContent className="p-6">
          <h3 className={`text-xl font-bold ${phase.color} mb-2`}>
            Complete {phase.title}
          </h3>
          <p className="text-green-300/70 mb-4">
            {getPhaseDescription(phase._id)}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              className="bg-green-400 text-black hover:bg-green-300"
              onClick={onStartPhase}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Start {phase.title}
            </Button>
            <Button
              variant="outline"
              className="border-green-400/50 text-green-400"
              onClick={onViewAllCourses}
            >
              View All Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhaseCompletionCTA;
