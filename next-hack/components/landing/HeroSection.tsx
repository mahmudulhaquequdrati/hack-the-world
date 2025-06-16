import TypewriterText from "@/components/effects/TypewriterText";
import StatDisplay from "./StatDisplay";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { Button } from "@/components/ui/button";
import { BookOpen, Zap } from "lucide-react";

interface HeroSectionProps {
  onStartJourney: () => void;
  onViewDemo: () => void;
  stats: Array<{
    label: string;
    value: string;
  }>;
}

const HeroSection = ({
  onStartJourney,
  onViewDemo,
  stats,
}: HeroSectionProps) => {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="space-y-8 col-span-3">
          <div className="space-y-4 pt-10 lg:pt-0 text-center lg:text-left">
            <h1 className="text-3xl lg:text-6xl font-bold leading-tight text-green-400">
              <TypewriterText text="Welcome to Terminal Hacks" speed={100} />
            </h1>
            <p className="text-xl text-green-300/80 max-w-lg">
              The world&apos;s shortest cybersecurity training platform—get skilled,
              fast.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
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
              onClick={onViewDemo}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              How Platform Works
            </Button>
          </div>

          <StatDisplay stats={stats} />
        </div>

        {/* Terminal Demo */}
        <div className="relative col-span-2">
          <TerminalWindow title="Terminal">
            <div className="space-y-2">
              <div className="text-green-400">
                $ nmap -sV --script vuln 10.10.10.10
              </div>
              <div className="text-green-300">Starting Nmap scan...</div>
              <div className="text-green-300">Scanning target...</div>
              <div className="text-green-300">Discovered open port 22/tcp</div>
              <div className="text-green-300">Discovered open port 80/tcp</div>
              <div className="text-red-400">
                Discovered vulnerability: CVE-2021-44228
              </div>
              <div className="text-green-400">
                $ <span className="terminal-cursor">|</span>
              </div>
            </div>
          </TerminalWindow>

          {/* Floating Code Snippets */}
          <div className="absolute -top-8 -right-6 bg-black/80 border border-green-400/50 rounded p-2 text-xs w-60">
            <div className="text-green-400 pb-1">{/* System Stats */}</div>
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between">
                <span className="text-green-300">CPU Usage:</span>
                <span className="text-green-200 font-bold">23%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Memory:</span>
                <span className="text-green-200 font-bold">3.2 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Active Users:</span>
                <span className="text-green-200 font-bold">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;