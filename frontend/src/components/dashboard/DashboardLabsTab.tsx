import { Button } from "@/components/ui/button";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { Phase } from "@/lib/types";
import { Beaker, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardLabsTabProps {
  phases: Phase[];
  labsData?: {
    success: boolean;
    data?: {
      content: LabItem[];
    };
  };
  isLoading?: boolean;
}

interface LabItem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  skills: string[];
  moduleTitle: string;
  moduleColor: string;
  moduleBgColor: string;
  completed: boolean;
  available: boolean;
  phaseId: string;
  phaseTitle: string;
  moduleId: string;
  type: string;
  progressPercentage: number;
  score?: number;
  maxScore?: number;
}

export const DashboardLabsTab = ({
  labsData,
  isLoading: labsLoading = false,
}: DashboardLabsTabProps) => {
  const navigate = useNavigate();
  const { user } = useAuthRTK();

  // Use data from props instead of API call
  const labsError = null; // No error since we're using props

  const handleStartLab = (lab: LabItem) => {
    // Navigate to dedicated lab route using the real content ID
    navigate(`/learn/${lab.moduleId}/lab/${lab._id}`);
  };

  // Use pre-formatted data from props
  const transformLabsData = (): LabItem[] => {
    if (!labsData?.success || !labsData.data?.content) {
      return [];
    }

    // Data is already formatted in Dashboard.tsx, just return it
    return labsData.data.content;
  };

  const labs = transformLabsData();

  // Loading state
  if (labsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-900/80 to-cyan-900/80 border-2 border-green-400/50 rounded-lg p-6">
          <div className="text-center text-green-400 font-mono animate-pulse">
            Loading labs data...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (labsError) {
    const errorMessage = "Failed to load labs";

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-900/80 to-red-800/80 border-2 border-red-400/50 rounded-lg p-6">
          <div className="text-center text-red-400 font-mono">
            Error loading labs: {errorMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Retro Header */}
      <div className="bg-gradient-to-r from-green-900/80 to-cyan-900/80 border-2 border-green-400/50 rounded-lg p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iOSIgeT0iOSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzAwRkY0MSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/25">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                  LAB COMPLEX
                </h1>
                <p className="text-green-300/80 font-mono text-sm">
                  {labs.length} hands-on cybersecurity laboratories
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400 font-mono animate-pulse">
                ONLINE
              </div>
              <div className="text-xs text-cyan-300 font-mono">
                {user?.username || "lab_user"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {labs.length === 0 ? (
        <div className="bg-black/60 border border-green-400/30 rounded-lg p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Beaker className="w-10 h-10 text-green-400" />
          </div>
          <h4 className="text-green-400 font-mono text-xl mb-2">LAB_OFFLINE</h4>
          <p className="text-cyan-300 font-mono text-sm">
            Initializing laboratory environment... // No labs available
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Lab Grid - Show all labs in a retro lab style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labs.map((lab, index) => (
              <div
                key={lab._id}
                className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-yellow-400/20 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center">
                        <Target className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-yellow-400 font-mono text-lg font-bold flex items-center">
                          LAB_{(index + 1).toString().padStart(2, "0")}
                        </div>
                        <h4 className="text-green-400 font-semibold text-xl">
                          {lab.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-green-300/90 mb-6 text-base leading-relaxed">
                    {lab.description}
                  </p>

                  {/* Lab Preview Information */}
                  <div className="space-y-4">
                    {/* Skills & Learning Objectives */}
                    <div className="bg-green-400/5 border border-green-400/20 rounded-lg p-4">
                      <h5 className="text-green-400 font-mono text-sm font-bold mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        SKILLS_YOU'LL_LEARN
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-green-300/80">
                        {lab.skills && lab.skills.length > 0 ? (
                          lab.skills
                            .slice(0, 6)
                            .map((skill, skillIndex) => (
                              <div key={skillIndex}>• {skill}</div>
                            ))
                        ) : (
                          <>
                            <div>• Hands-on cybersecurity</div>
                            <div>• Penetration testing</div>
                            <div>• Vulnerability assessment</div>
                            <div>• Security analysis</div>
                            <div>• Real-world scenarios</div>
                            <div>• Tool mastery</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Lab Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 text-center">
                        <div className="text-yellow-400 font-mono text-xs font-bold mb-1">
                          DIFFICULTY
                        </div>
                        <div className="text-yellow-300 text-sm font-semibold">
                          {lab.difficulty}
                        </div>
                      </div>
                      <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-lg p-3 text-center">
                        <div className="text-cyan-400 font-mono text-xs font-bold mb-1">
                          DURATION
                        </div>
                        <div className="text-cyan-300 text-sm font-semibold">
                          {lab.duration}
                        </div>
                      </div>
                    </div>

                    {/* Start Lab Button */}
                    <Button
                      onClick={() => handleStartLab(lab)}
                      className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-mono text-sm"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      START_LAB
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
