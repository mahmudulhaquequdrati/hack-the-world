import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  height?: string;
}

const TerminalWindow = ({
  title = "Terminal",
  children,
  className = "",
  height = "h-96",
}: TerminalWindowProps) => {
  return (
    <Card
      className={`terminal-window bg-black/90 border-green-400 ${height} ${className}`}
    >
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-green-400 text-sm">{title}</div>
      </CardHeader>
      <CardContent className="font-mono text-sm h-full overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
};

export default TerminalWindow;
