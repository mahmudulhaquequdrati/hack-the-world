import { TabsContent } from "@/components/ui/tabs";
import { Book, BookOpen, Code, FileText, Gamepad2, Video } from "lucide-react";

interface CurriculumTabProps {
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
}

type ContentItem = {
  _id: string;
  type: "video" | "lab" | "game" | "text" | "quiz";
  title: string;
  description: string;
  section: string;
};

const CurriculumTab = ({ moduleOverview }: CurriculumTabProps) => {
  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-blue-400" />;
      case "lab":
        return <Code className="w-4 h-4 text-yellow-400" />;
      case "game":
        return <Gamepad2 className="w-4 h-4 text-red-400" />;
      case "text":
        return <FileText className="w-4 h-4 text-green-400" />;
      case "quiz":
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      default:
        return <Book className="w-4 h-4 text-gray-400" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "text-blue-400";
      case "lab":
        return "text-yellow-400";
      case "game":
        return "text-red-400";
      case "text":
        return "text-green-400";
      case "quiz":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  if (!moduleOverview) {
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

          <div className="text-center text-white py-4">
            <p className="text-lg font-bold">No Curriculum Found</p>
            <p className="text-sm">
              The module you have selected is not yet available. Please check
              back later.
            </p>
          </div>
        </div>
      </TabsContent>
    );
  }

  // Calculate totals for footer
  const totalSections = Object.keys(moduleOverview).length;
  const totalContent = Object.values(moduleOverview).reduce(
    (acc, items) => acc + (items as ContentItem[]).length,
    0
  );

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
          {Object.entries(moduleOverview).map(([sectionName, items], index) => {
            const typedItems = items as ContentItem[];
            return (
              <div key={index} className="mb-3">
                {/* Folder line */}
                <div className="flex items-center space-x-3 py-2 hover:bg-green-400/5 transition-colors">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-green-400/60">📂</span>
                    <span className="text-green-400 flex-1">{sectionName}</span>
                    <span className="text-green-300/60 text-xs">
                      {typedItems.length} files
                    </span>
                  </div>
                </div>

                {/* Files in folder */}
                <div className="ml-6 space-y-1">
                  {typedItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-2 py-1 text-green-300/70 hover:bg-green-400/5 transition-colors group cursor-pointer"
                    >
                      <span className="text-green-400/40">├─</span>
                      <span className="text-blue-400/50">
                        {getContentIcon(item.type)}
                      </span>
                      <span className="text-sm flex-1">{item.title}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getContentTypeColor(
                          item.type
                        )} bg-current/10`}
                      >
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Footer info */}
          <div className="border-t border-green-400/20 pt-3 mt-4">
            <div className="text-green-400/60 text-xs">
              Total: {totalSections} folders, {totalContent} files
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default CurriculumTab;
