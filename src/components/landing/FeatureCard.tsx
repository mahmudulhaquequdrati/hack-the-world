import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
  onClick,
}: FeatureCardProps) => {
  return (
    <Card
      className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all duration-300 group cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <Icon
          className={`w-12 h-12 ${color} group-hover:scale-110 transition-transform`}
        />
        <CardTitle className="text-green-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-green-300/70">{description}</p>
        <div className="mt-4 flex items-center text-green-400 group-hover:text-green-300">
          <span className="text-sm">Start Training</span>
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
