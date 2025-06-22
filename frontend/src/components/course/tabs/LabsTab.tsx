import { TabsContent } from "@/components/ui/tabs";
import type { ContentOutcome, Resource } from "@/lib/types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  PenTool,
  Target,
  Video,
} from "lucide-react";

interface LabsTabProps {
  moduleOverview?: {
    [sectionName: string]: Array<{
      _id: string;
      type: "video" | "lab" | "game" | "text" | "quiz";
      title: string;
      description: string;
      section: string;
      duration: string;
      resources?: Resource[];
      outcomes?: ContentOutcome[];
    }>;
  };
  isLoadingOverview?: boolean;
  overviewError?: FetchBaseQueryError | SerializedError | undefined;
  difficulty: string;
  isEnrolled: boolean | undefined;
}

type LabContentItem = {
  _id: string;
  type: "lab";
  title: string;
  description: string;
  section: string;
  duration: string;
  resources?: Resource[];
  outcomes?: ContentOutcome[];
  instructions?: string;
};

// Helper function to get icon for resource type
const getResourceIcon = (type: Resource["type"]) => {
  switch (type) {
    case "url":
      return <ExternalLink className="w-4 h-4" />;
    case "file":
      return <FileText className="w-4 h-4" />;
    case "document":
      return <FileText className="w-4 h-4" />;
    case "tool":
      return <PenTool className="w-4 h-4" />;
    case "reference":
      return <BookOpen className="w-4 h-4" />;
    case "video":
      return <Video className="w-4 h-4" />;
    case "download":
      return <Download className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const LabsTab = ({
  moduleOverview,
  isLoadingOverview = false,
  overviewError,
  difficulty,
  isEnrolled = false,
}: LabsTabProps) => {
  // Extract lab items from the moduleOverview prop instead of calling API
  const labsFromAPI = moduleOverview
    ? Object.values(moduleOverview)
        .flat()
        .filter((item): item is LabContentItem => {
          const typedItem = item as { type: string };
          return typedItem.type === "lab";
        })
    : [];

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
                      {/* <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 rounded-lg border text-xs font-mono font-bold text-yellow-400 bg-yellow-400/20 border-yellow-400/30">
                          LAB
                        </div>
                        <div className="text-green-400 font-mono text-sm">
                          {lab.section}
                        </div>
                      </div> */}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-green-300/90 mb-6 text-base leading-relaxed">
                      {lab.description}
                    </p>

                    {/* Lab Preview Information */}
                    <div className="space-y-4">
                      {/* Learning Outcomes */}
                      {lab.outcomes && lab.outcomes.length > 0 && (
                        <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-4">
                          <h5 className="text-blue-400 font-mono text-sm font-bold mb-3 flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            LEARNING_OUTCOMES
                          </h5>
                          <div className="space-y-3">
                            {lab.outcomes.map((outcome, outcomeIndex) => (
                              <div
                                key={outcomeIndex}
                                className="bg-blue-400/5 border border-blue-400/10 rounded p-3"
                              >
                                <div className="text-blue-300 font-semibold text-sm mb-1">
                                  {outcome.title}
                                </div>
                                <div className="text-blue-300/80 text-xs mb-2">
                                  {outcome.description}
                                </div>
                                {outcome.skills &&
                                  outcome.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {outcome.skills.map(
                                        (skill, skillIndex) => (
                                          <span
                                            key={skillIndex}
                                            className="px-2 py-1 bg-blue-400/20 border border-blue-400/30 rounded text-xs text-blue-400 font-mono"
                                          >
                                            #
                                            {skill
                                              .toLowerCase()
                                              .replace(/\s+/g, "_")}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resources */}
                      {lab.resources && lab.resources.length > 0 && (
                        <div className="bg-green-400/5 border border-green-400/20 rounded-lg p-4">
                          <h5 className="text-green-400 font-mono text-sm font-bold mb-3 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            LAB_RESOURCES
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {lab.resources.map((resource, resourceIndex) => (
                              <div
                                key={resourceIndex}
                                className="flex items-center space-x-2 p-2 bg-green-400/5 border border-green-400/10 rounded hover:bg-green-400/10 transition-colors duration-200"
                              >
                                <div className="text-green-400 flex-shrink-0">
                                  {getResourceIcon(resource.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-green-300 text-sm font-medium truncate">
                                    {resource.name}
                                  </div>
                                  {resource.description && (
                                    <div className="text-green-300/60 text-xs truncate">
                                      {resource.description}
                                    </div>
                                  )}
                                </div>
                                {resource.category && (
                                  <div
                                    className={`px-2 py-1 rounded text-xs font-mono ${
                                      resource.category === "essential"
                                        ? "bg-red-400/20 text-red-400 border border-red-400/30"
                                        : resource.category === "advanced"
                                        ? "bg-orange-400/20 text-orange-400 border border-orange-400/30"
                                        : "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                                    }`}
                                  >
                                    {resource.category.toUpperCase()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lab Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 text-center">
                          <div className="text-yellow-400 font-mono text-xs font-bold mb-1">
                            DIFFICULTY
                          </div>
                          <div className="text-yellow-300 text-sm font-semibold">
                            {difficulty}
                          </div>
                        </div>
                        <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-lg p-3 text-center">
                          <div className="text-cyan-400 font-mono text-xs font-bold mb-1">
                            DURATION
                          </div>
                          <div className="text-cyan-300 text-sm font-semibold">
                            {lab.duration} mins
                          </div>
                        </div>
                      </div>

                      {/* Enrollment Prompt */}
                      {!isEnrolled && (
                        <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4 text-center">
                          <p className="text-green-400 font-mono text-sm font-bold mb-1">
                            ENROLL_TO_ACCESS
                          </p>
                          <p className="text-green-300/80 font-mono text-xs">
                            Join the course to start this hands-on laboratory
                          </p>
                        </div>
                      )}
                    </div>
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
