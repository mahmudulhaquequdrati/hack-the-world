import { getDifficultyColor } from "@/lib";
import { Phase } from "@/lib/types";
import {
  Beaker,
  Clock,
  Target,
  Zap,
  Shield,
  Code,
  Network,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetContentTypeProgressQuery } from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";

interface DashboardLabsTabProps {
  phases: Phase[];
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
  phases,
}: DashboardLabsTabProps) => {
  const navigate = useNavigate();
  const { user } = useAuthRTK();

  // Fetch real labs data from API
  const {
    data: labsData,
    isLoading: labsLoading,
    error: labsError,
  } = useGetContentTypeProgressQuery(
    {
      userId: user?._id || "",
      contentType: "lab",
    },
    {
      skip: !user?._id,
    }
  );

  const handleStartLab = (lab: LabItem) => {
    // Navigate to dedicated lab route using the real content ID
    navigate(`/learn/${lab.moduleId}/lab/${lab._id}`);
  };

  // Transform real API data into LabItem format
  const transformLabsData = (): LabItem[] => {
    if (!labsData?.success || !labsData.data?.content) {
      return [];
    }

    return labsData.data.content.map((labContent) => {
      const module = labContent.module;
      const progress = labContent.progress;
      const isCompleted = progress?.status === "completed";

      // Find the phase this module belongs to
      const phase = phases.find((p) => p._id === module.phase) || phases[0];

      // Calculate estimated duration from content duration (convert seconds to minutes)
      const durationMinutes = labContent.duration
        ? Math.ceil(labContent.duration / 60)
        : 45;

      return {
        _id: labContent._id,
        title: labContent.title,
        description:
          labContent.description ||
          `Hands-on laboratory exercise in ${module.title}. Practice real-world cybersecurity scenarios in a controlled environment.`,
        difficulty: module.difficulty,
        duration: `${durationMinutes} min`,
        skills: ["Cybersecurity", "Hands-on Practice", module.title], // Default skills, could be enhanced with content metadata
        moduleTitle: module.title,
        moduleColor: "#00ff41", // Default green, could be enhanced with module data
        moduleBgColor: "#001100", // Default dark green, could be enhanced
        completed: isCompleted,
        available: true,
        phaseId: phase._id,
        phaseTitle: phase.title,
        moduleId: module._id,
        type: "Lab Environment", // Default type, could be enhanced with content metadata
        progressPercentage: progress?.progressPercentage || 0,
        score: progress?.score || undefined,
        maxScore: progress?.maxScore || undefined,
      };
    });
  };

  const labs = transformLabsData();

  const getLabIcon = (type: string) => {
    switch (type) {
      case "Web Security":
        return <Shield className="w-5 h-5 text-green-400" />;
      case "Network Analysis":
        return <Network className="w-5 h-5 text-blue-400" />;
      case "Penetration Testing":
        return <Target className="w-5 h-5 text-red-400" />;
      case "Forensics":
        return <Code className="w-5 h-5 text-purple-400" />;
      case "Social Engineering":
        return <Lock className="w-5 h-5 text-orange-400" />;
      default:
        return <Beaker className="w-5 h-5 text-cyan-400" />;
    }
  };

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
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-900/80 to-red-800/80 border-2 border-red-400/50 rounded-lg p-6">
          <div className="text-center text-red-400 font-mono">
            Error loading labs: {labsError.toString()}
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
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {labs.map((lab) => (
              <div
                key={lab._id}
                className="group relative bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-green-400/30 rounded-lg overflow-hidden hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25"
              >
                {/* Matrix-like pattern overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/3 to-transparent bg-[length:100%_8px] opacity-30"></div>

                {/* Lab Header */}
                <div className="relative z-10 bg-gradient-to-r from-green-900/40 to-cyan-900/40 border-b border-green-400/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {/* Lab Icon */}
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400/20 to-cyan-500/20 rounded border border-green-400/40 flex items-center justify-center">
                        {getLabIcon(lab.type)}
                      </div>
                      <div>
                        <h3 className="text-green-400 font-mono text-sm font-bold">
                          {lab.title}
                        </h3>
                        <p className="text-cyan-300/80 text-xs font-mono">
                          {lab.phaseTitle} • {lab.moduleTitle}
                        </p>
                      </div>
                    </div>

                    {/* Lab Status */}
                    <div className="text-right">
                      {lab.completed ? (
                        <div className="text-green-400 text-xs font-mono font-bold">
                          ✓ COMPLETE
                        </div>
                      ) : (
                        <div className="text-cyan-400 text-xs font-mono font-bold animate-pulse">
                          ⚡ READY
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lab Info */}
                <div className="relative z-10 p-4">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {lab.description}
                  </p>

                  {/* Lab Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-black/40 border border-green-400/20 rounded p-2">
                      <div className="text-green-400 font-mono text-xs font-bold">
                        DURATION
                      </div>
                      <div className="text-white text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {lab.duration}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-cyan-400/20 rounded p-2">
                      <div className="text-cyan-400 font-mono text-xs font-bold">
                        LEVEL
                      </div>
                      <div
                        className={`text-sm ${
                          getDifficultyColor(lab.difficulty).split(" ")[0]
                        }`}
                      >
                        {lab.difficulty}
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="mb-4">
                    <div className="text-green-400 font-mono text-xs font-bold mb-2">
                      SKILLS
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {lab.skills.slice(0, 2).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-green-400/10 border border-green-400/30 rounded text-xs text-green-300 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                      {lab.skills.length > 2 && (
                        <span className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded text-xs text-cyan-300 font-mono">
                          +{lab.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress indicator for completed labs */}
                  {lab.completed && (
                    <div className="mb-4 p-2 bg-gradient-to-r from-green-400/10 to-cyan-400/10 border border-green-400/30 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-mono text-xs font-bold">
                          EXPERIMENT COMPLETE
                        </span>
                        <span className="text-green-300 font-mono text-xs">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Start Lab Button */}
                  <button
                    onClick={() => handleStartLab(lab)}
                    className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white font-mono text-sm font-bold py-2 px-4 rounded border border-green-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-400/25"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>{lab.completed ? "REVIEW LAB" : "START LAB"}</span>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
