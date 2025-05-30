import { LoadingSkeleton } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";
import { getPhaseStats } from "@/lib/appData";
import { Module } from "@/lib/types";
import { Activity, BookOpen, LucideIcon, Video, Zap } from "lucide-react";
import { useEffect, useState } from "react";

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

interface PhaseStatsType {
  courses: number;
  videos: number;
  labs: number;
  games: number;
}

const PhaseCard = ({ phase, className = "" }: PhaseCardProps) => {
  const [stats, setStats] = useState<PhaseStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);

      // Simulate API call with 1 second delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const phaseStats = getPhaseStats(phase.id);
      setStats(phaseStats);
      setLoading(false);
    };

    loadStats();
  }, [phase.id]);

  if (loading || !stats) {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <phase.icon className={`w-8 h-8 ${phase.color}`} />
          <h2 className={`text-3xl font-bold ${phase.color}`}>{phase.title}</h2>
        </div>
        <p className="text-lg text-green-300/80 max-w-3xl mx-auto mb-8">
          {phase.description}
        </p>

        {/* Loading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <LoadingSkeleton type="stats" count={4} className="contents" />
        </div>
      </div>
    );
  }

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
