import { FeatureCard } from "@/components/landing";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  onFeatureClick?: (feature: Feature) => void;
}

const FeaturesSection = ({
  features,
  onFeatureClick,
}: FeaturesSectionProps) => {
  return (
    <section className="py-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-green-400">
            Training Modules
          </h2>
          <p className="text-green-300/80 text-lg">
            Master cybersecurity through hands-on practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              onClick={() => onFeatureClick?.(feature)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
