import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-green-400",
  bgColor = "bg-green-400/10",
  className = "",
}: StatCardProps) => {
  return (
    <Card className={`${bgColor} border-green-400/30 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-300/70">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
