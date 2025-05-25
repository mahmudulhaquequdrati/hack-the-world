import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { AssetItem } from "@/lib/types";
import { Download, FileText, Globe } from "lucide-react";

interface AssetsTabProps {
  assets: AssetItem[];
}

const AssetsTab = ({ assets }: AssetsTabProps) => {
  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "zip":
        return <Download className="w-4 h-4" />;
      case "html":
        return <Globe className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <TabsContent value="assets" className="mt-0">
      <div className="grid gap-3">
        {assets.map((asset, index) => (
          <div
            key={index}
            className="bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-400/10 border border-green-400/30 rounded flex items-center justify-center">
                    {getFileTypeIcon(asset.type)}
                  </div>
                  <div>
                    <div className="font-medium text-green-400 text-sm font-mono">
                      {asset.name}
                    </div>
                    <div className="text-xs text-green-300/70 font-mono">
                      {asset.type.toUpperCase()} • {asset.size}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-400 hover:bg-green-400/10 border border-green-400/30 font-mono"
                >
                  <Download className="w-4 h-4 mr-2" />
                  DOWNLOAD
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
};

export default AssetsTab;
