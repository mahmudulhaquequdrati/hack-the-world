import { TabsContent } from "@/components/ui/tabs";
import { CurriculumSection } from "@/lib/types";
import { Video } from "lucide-react";

interface CurriculumTabProps {
  curriculum: CurriculumSection[];
}

const CurriculumTab = ({ curriculum }: CurriculumTabProps) => {
  return (
    <TabsContent value="curriculum" className="mt-0">
      <div className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden">
        {/* File explorer header */}
        <div className="bg-green-400/10 border-b border-green-400/20 px-4 py-3">
          <div className="text-green-400 font-mono text-sm font-bold flex items-center">
            <div className="text-green-400/60 mr-2">📁</div>
            /course/curriculum/
          </div>
        </div>

        {/* Folder structure */}
        <div className="p-4 font-mono text-sm">
          {curriculum.map((section, index) => (
            <div key={index} className="mb-3">
              {/* Folder line */}
              <div className="flex items-center space-x-3 py-2 hover:bg-green-400/5 transition-colors">
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-green-400/60">
                    {section.completed ? "📂" : "📁"}
                  </span>
                  <span className="text-green-400 flex-1">{section.title}</span>
                  <span className="text-green-300/60 text-xs">
                    {section.lessons} files
                  </span>
                  <span className="text-green-300/60 text-xs">
                    {section.duration}
                  </span>
                  {section.completed && (
                    <span className="text-green-400 text-xs">✓</span>
                  )}
                </div>
              </div>

              {/* Files in folder */}
              <div className="ml-6 space-y-1">
                {section.topics.map((topic, topicIndex) => (
                  <div
                    key={topicIndex}
                    className="flex items-center space-x-2 py-1 text-green-300/70 hover:bg-green-400/5 transition-colors"
                  >
                    <span className="text-green-400/40">├─</span>
                    <span className="text-blue-400/50">
                      <Video className="w-5 h-5" />
                    </span>
                    <span className="text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Footer info */}
          <div className="border-t border-green-400/20 pt-3 mt-4">
            <div className="text-green-400/60 text-xs">
              Total: {curriculum.length} folders,{" "}
              {curriculum.reduce(
                (acc, section) => acc + section.topics.length,
                0
              )}{" "}
              files
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default CurriculumTab;
