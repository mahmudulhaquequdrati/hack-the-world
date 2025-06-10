import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { LabItem } from "@/lib/types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Clock, Code, Play, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface LabsTabProps {
  labs: LabItem[];
  moduleId?: string;
  moduleOverview?: {
    [sectionName: string]: Array<{
      _id: string;
      type: "video" | "lab" | "game" | "text" | "quiz";
      title: string;
      description: string;
      section: string;
    }>;
  };
  isLoadingOverview?: boolean;
  overviewError?: FetchBaseQueryError | SerializedError | undefined;
}

type LabContentItem = {
  _id: string;
  type: "lab";
  title: string;
  description: string;
  section: string;
};

const LabsTab = ({
  labs,
  moduleOverview,
  isLoadingOverview = false,
  overviewError,
}: LabsTabProps) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Extract lab items from the moduleOverview prop instead of calling API
  const labsFromAPI = moduleOverview
    ? Object.values(moduleOverview)
        .flat()
        .filter((item): item is LabContentItem => {
          const typedItem = item as { type: string };
          return typedItem.type === "lab";
        })
    : [];

  const handleStartLab = (labName: string) => {
    // Convert lab name to a URL-friendly ID and navigate to dedicated lab route
    const labId = labName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    navigate(`/learn/${courseId}/lab/${labId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "advanced":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "expert":
        return "text-purple-400 bg-purple-400/20 border-purple-400/30";
      case "master":
        return "text-orange-400 bg-orange-400/20 border-orange-400/30";
      default:
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
    }
  };

  if (isLoadingOverview) {
    return (
      <TabsContent value="labs" className="mt-0">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <span className="ml-3 text-green-400 font-mono">LOADING_LABS...</span>
        </div>
      </TabsContent>
    );
  }

  // Use API data if available, otherwise fall back to original labs data
  const labsToShow =
    !overviewError && labsFromAPI.length > 0 ? labsFromAPI : labs;

  return (
    <TabsContent value="labs" className="mt-0">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
            HANDS-ON_LABORATORIES
          </h3>
          <p className="text-green-300/70 font-mono text-sm">
            Practical exercises to reinforce your learning
          </p>
        </div>

        <div className="grid gap-6">
          {/* Show API-based labs */}
          {!overviewError && labsFromAPI.length > 0
            ? labsFromAPI.map((lab, index) => (
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
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 rounded-lg border text-xs font-mono font-bold text-yellow-400 bg-yellow-400/20 border-yellow-400/30">
                          LAB
                        </div>
                        <div className="text-green-400 font-mono text-sm">
                          {lab.section}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-green-300/90 mb-6 text-base leading-relaxed">
                      {lab.description}
                    </p>

                    {/* Start Lab Button */}
                    <Button
                      onClick={() => handleStartLab(lab.title)}
                      className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-mono text-sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      START_LAB
                    </Button>
                  </div>
                </div>
              ))
            : // Fallback to original labs data
              labs.map((lab, index) => (
                <div
                  key={index}
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
                            {lab.name}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold ${getDifficultyColor(
                            lab.difficulty
                          )}`}
                        >
                          {lab.difficulty.toUpperCase()}
                        </div>
                        <div className="flex items-center space-x-2 text-green-300/70 font-mono text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{lab.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-green-300/90 mb-6 text-base leading-relaxed">
                      {lab.description}
                    </p>

                    {/* Skills Section */}
                    <div className="mb-6">
                      <h5 className="text-green-400 font-mono text-sm font-bold mb-3 flex items-center">
                        <Code className="w-4 h-4 mr-2" />
                        SKILLS_COVERED
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {lab.skills.map((skill, skillIndex) => (
                          <div
                            key={skillIndex}
                            className="bg-blue-400/10 border border-blue-400/30 rounded-lg px-3 py-1 text-sm text-blue-400 font-mono hover:bg-blue-400/20 transition-colors"
                          >
                            #{skill.toLowerCase().replace(/\s+/g, "_")}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lab Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-green-400/20 mb-6">
                      <div className="text-center">
                        <div className="text-green-400 font-mono text-xs font-bold mb-1">
                          DIFFICULTY
                        </div>
                        <div className="text-green-300/80 text-sm">
                          {lab.difficulty}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-mono text-xs font-bold mb-1">
                          DURATION
                        </div>
                        <div className="text-green-300/80 text-sm">
                          {lab.duration}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-mono text-xs font-bold mb-1">
                          SKILLS
                        </div>
                        <div className="text-green-300/80 text-sm">
                          {lab.skills.length} skills
                        </div>
                      </div>
                    </div>

                    {/* Start Lab Button */}
                    <Button
                      onClick={() => handleStartLab(lab.name)}
                      className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-mono text-sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      START_LAB
                    </Button>
                  </div>
                </div>
              ))}
        </div>

        {labsToShow.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
            <h4 className="text-green-400 font-mono text-lg mb-2">
              NO_LABS_AVAILABLE
            </h4>
            <p className="text-green-300/60 font-mono text-sm">
              Labs will be added to this course soon
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default LabsTab;
