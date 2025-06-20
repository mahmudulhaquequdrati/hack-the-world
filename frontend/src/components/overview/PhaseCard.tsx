import { Card, CardContent } from "@/components/ui/card";
import { getIconFromName } from "@/lib/iconUtils";
import { Module } from "@/lib/types";
import { Activity, BookOpen, LucideIcon, Video, Zap } from "lucide-react";
import { useMemo } from "react";

interface PhaseCardProps {
  phase: {
    _id: string;
    title: string;
    description: string;
    icon: LucideIcon | string;
    color: string;
    modules: Module[];
  };
  className?: string;
}

interface PhaseStatsType {
  courses: number;
  videos: number;
  labs: number;
  games: number;
}

const PhaseCard = ({ phase, className = "" }: PhaseCardProps) => {
  // Calculate stats directly from the phase data instead of using getPhaseStats
  const stats: PhaseStatsType = useMemo(() => {
    if (!phase.modules || phase.modules.length === 0) {
      return {
        courses: 0,
        videos: 0,
        labs: 0,
        games: 0,
      };
    }

    // Calculate stats from the modules data
    const coursesCount = phase.modules.length;

    // Sum up the stats from all modules in the phase
    const totalStats = phase.modules.reduce(
      (acc, module) => {
        // Use the stats from module data if available
        acc.labs += module.labs || 0;
        acc.games += module.games || 0;
        // For videos, we might need to check content.videos.length or use a default
        acc.videos += module.content?.videos?.length || 0;
        return acc;
      },
      { labs: 0, games: 0, videos: 0 }
    );

    return {
      courses: coursesCount,
      videos: totalStats.videos,
      labs: totalStats.labs,
      games: totalStats.games,
    };
  }, [phase.modules]);

  const PhaseIcon = getIconFromName(phase.icon);
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center space-x-3 mb-4">
        <PhaseIcon className={`w-8 h-8 ${phase.color}`} />
        <h2 className={`text-3xl font-bold ${phase.color}`}>{phase.title}</h2>
      </div>
      <p className="text-lg text-green-300/80 max-w-3xl mx-auto mb-8">
        {phase.description}
      </p>

      {/* Phase Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-black/50 border-green-400/30 hover:border-green-400/50 transition-all">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-400">
              {stats.courses}
            </div>
            <div className="text-xs text-green-300/70">Courses</div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-green-400/30 hover:border-cyan-400/50 transition-all">
          <CardContent className="p-4 text-center">
            <Video className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-cyan-400">
              {stats.videos}
            </div>
            <div className="text-xs text-green-300/70">Videos</div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-green-400/30 hover:border-yellow-400/50 transition-all">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-yellow-400">
              {stats.labs}
            </div>
            <div className="text-xs text-green-300/70">Labs</div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-green-400/30 hover:border-red-400/50 transition-all">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-red-400">{stats.games}</div>
            <div className="text-xs text-green-300/70">Games</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhaseCard;
