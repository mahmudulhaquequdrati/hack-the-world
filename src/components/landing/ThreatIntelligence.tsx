import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ThreatStat {
  label: string;
  value: string;
  trend: string;
  color: string;
}

interface ThreatIntelligenceProps {
  stats: ThreatStat[];
  className?: string;
}

const ThreatIntelligence = ({
  stats,
  className = "",
}: ThreatIntelligenceProps) => {
  return (
    <Card className={`bg-black/50 border-green-400/50 ${className}`}>
      <CardHeader>
        <CardTitle className="text-green-400 text-sm flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Threat Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <div className="text-xs text-green-300/70">{stat.label}</div>
              <div className={`text-sm font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
            <div
              className={`text-xs ${
                stat.trend.startsWith("+") ? "text-green-400" : "text-red-400"
              }`}
            >
              {stat.trend}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ThreatIntelligence;
