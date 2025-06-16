import { Button } from "@/components/ui/button";
import { Lock, Zap } from "lucide-react";

interface CTASectionProps {
  onStartJourney: () => void;
  onViewPricing: () => void;
}

const CTASection = ({ onStartJourney, onViewPricing }: CTASectionProps) => {
  return (
    <section className="pb-20 px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-green-400">
          Ready to become a cyber warrior?
        </h2>
        <p className="text-green-300/80 text-lg mb-8">
          Join thousands of ethical hackers who have mastered cybersecurity
          through our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-green-400 text-black hover:bg-green-300 font-medium"
            onClick={onStartJourney}
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="border-2 text-green-400 hover:bg-green-400/10 font-medium"
            onClick={onViewPricing}
          >
            <Lock className="w-5 h-5 mr-2" />
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;