import { Card, CardContent } from "@/components/ui/card";
import { Module } from "@/lib/types";
import { Activity, BookOpen, Database, LucideIcon, Zap } from "lucide-react";

interface PhaseCardProps {
  phase: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    modules: Module[];
  };
  className?: string;
}

const PhaseCard = ({ phase, className = "" }: PhaseCardProps) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center space-x-3 mb-4">
        <phase.icon className={`w-8 h-8 ${phase.color}`} />
        <h2 className={`text-3xl font-bold ${phase.color}`}>{phase.title}</h2>
      </div>
      <p className="text-lg text-green-300/80 max-w-3xl mx-auto mb-8">
        {phase.description}
      </p>

      {/* Phase Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-black/50 border-green-400/30">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-400">
              {phase.modules.length}
            </div>
            <div className="text-xs text-green-300/70">Courses</div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-green-400/30">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-yellow-400">
              {phase.modules.reduce((sum, module) => sum + module.labs, 0)}
            </div>
            <div className="text-xs text-green-300/70">Labs</div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-green-400/30">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-red-400">
              {phase.modules.reduce((sum, module) => sum + module.games, 0)}
            </div>
            <div className="text-xs text-green-300/70">Games</div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-green-400/30">
          <CardContent className="p-4 text-center">
            <Database className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-400">
              {phase.modules.reduce((sum, module) => sum + module.assets, 0)}
            </div>
            <div className="text-xs text-green-300/70">Assets</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhaseCard;
