import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lab } from "@/lib/types";
import { Clock, ExternalLink, Play, Target, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface LabDisplayProps {
  lab: Lab;
  onClose: () => void;
}

const LabDisplay = ({ lab, onClose }: LabDisplayProps) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

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

  const openInNewTab = () => {
    window.open(`/learn/${courseId}/lab/${lab.id}`, "_blank");
  };

  const startLab = () => {
    navigate(`/learn/${courseId}/lab/${lab.id}`);
  };

  return (
    <div className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden mt-4">
      <div className="p-4 border-b border-green-400/30 bg-green-400/10">
        <div className="flex items-center justify-between">
          <h3 className="text-green-400 font-semibold text-lg flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Selected Lab
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-green-400 hover:bg-green-400/10"
          >
            ✕
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Card className="bg-black/40 border-green-400/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-400 text-lg">
                {lab.name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div
                  className={`px-2 py-1 rounded text-xs font-mono ${getDifficultyColor(
                    lab.difficulty
                  )}`}
                >
                  {lab.difficulty.toUpperCase()}
                </div>
                <div className="flex items-center space-x-1 text-xs text-green-300/70">
                  <Clock className="w-3 h-3" />
                  <span>{lab.duration}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-green-300/80 text-sm mb-4 leading-relaxed">
              {lab.description}
            </p>

            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                disabled={!lab.available}
                className={
                  lab.available
                    ? "bg-green-400 text-black hover:bg-green-300"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }
                onClick={startLab}
              >
                {lab.available ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Lab
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Coming Soon
                  </>
                )}
              </Button>

              {lab.available && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInNewTab}
                  className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabDisplay;
