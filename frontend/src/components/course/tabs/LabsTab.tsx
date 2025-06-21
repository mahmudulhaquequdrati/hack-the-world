import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Play, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface LabsTabProps {
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
    !overviewError && labsFromAPI.length > 0 ? labsFromAPI : [];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            : null}
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
