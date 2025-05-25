import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { LabItem } from "@/lib/types";
import { Clock, Lock, Play, Shield } from "lucide-react";

interface LabsTabProps {
  labs: LabItem[];
  enrollmentStatus: string;
  onEnrollment: () => void;
}

const LabsTab = ({ labs, enrollmentStatus, onEnrollment }: LabsTabProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20";
      case "advanced":
        return "text-red-400 bg-red-400/20";
      case "expert":
        return "text-purple-400 bg-purple-400/20";
      case "master":
        return "text-orange-400 bg-orange-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  return (
    <TabsContent value="labs" className="mt-0">
      <div className="grid gap-4">
        {labs.map((lab, index) => (
          <div
            key={index}
            className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300"
          >
            <div className="bg-yellow-400/10 border-b border-yellow-400/20 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-yellow-400 font-mono text-sm font-bold flex items-center">
                  <div className="w-6 h-6 rounded bg-yellow-400/20 border border-yellow-400 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  {lab.name.toUpperCase()}
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`px-2 py-1 rounded text-xs font-mono ${getDifficultyColor(
                      lab.difficulty
                    )}`}
                  >
                    {lab.difficulty.toUpperCase()}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-green-300/70 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{lab.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-green-300/80 mb-4 text-sm leading-relaxed">
                {lab.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {lab.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="bg-blue-400/10 border border-blue-400/30 rounded px-2 py-1 text-xs text-blue-400 font-mono"
                  >
                    #{skill.toLowerCase().replace(/\s+/g, "_")}
                  </div>
                ))}
              </div>
              {enrollmentStatus === "enrolled" ? (
                <Button
                  size="sm"
                  className="bg-yellow-400 text-black hover:bg-yellow-300 font-mono"
                >
                  <Play className="w-4 h-4 mr-2" />
                  START_LAB
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-400/10 border border-red-400/20 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-mono text-xs font-bold">
                        ENROLLMENT_REQUIRED
                      </span>
                    </div>
                    <p className="text-red-300/80 text-xs font-mono">
                      This lab requires course enrollment to access
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onEnrollment}
                    className="bg-green-400 text-black hover:bg-green-300 font-mono"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    ENROLL_TO_ACCESS
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
};

export default LabsTab;
