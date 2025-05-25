import { TabsContent } from "@/components/ui/tabs";
import { LearningOutcome } from "@/lib/types";
import { CheckCircle, Trophy } from "lucide-react";

interface OverviewTabProps {
  learningOutcomes: LearningOutcome[];
}

const OverviewTab = ({ learningOutcomes }: OverviewTabProps) => {
  return (
    <TabsContent value="overview" className="mt-0">
      <div className="space-y-6">
        {/* Learning Outcomes */}
        <div className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden">
          <div className="bg-green-400/10 border-b border-green-400/20 px-4 py-3">
            <div className="text-green-400 font-mono text-sm font-bold flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              LEARNING.OBJECTIVES
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-6">
              {learningOutcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="bg-black/30 border border-green-400/20 rounded-lg overflow-hidden hover:border-green-400/40 transition-all duration-300"
                >
                  {/* Header with title */}
                  <div className="flex items-start space-x-4 p-4 border-b border-green-400/20">
                    <div className="text-green-400/60 font-mono text-xs mt-1">
                      [{(index + 1).toString().padStart(2, "0")}]
                    </div>
                    <div className="flex items-start space-x-3 flex-1">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-green-300 text-base font-semibold leading-relaxed font-mono">
                        {outcome.title}
                      </span>
                    </div>
                  </div>

                  {/* Description and skills */}
                  <div className="p-4 space-y-4">
                    <p className="text-green-300/80 text-sm leading-relaxed">
                      {outcome.description}
                    </p>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-2">
                      <div className="text-green-400/60 text-xs font-mono mr-2 mt-1">
                        Skills:
                      </div>
                      {outcome.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="bg-blue-400/10 border border-blue-400/30 rounded px-2 py-1 text-xs text-blue-400 font-mono"
                        >
                          #{skill.toLowerCase().replace(/\s+/g, "_")}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
