import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentContainerProps {
  title: string;
  contentType: string;
  onOpenInNewTab?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const ContentContainer = ({
  title,
  contentType,
  onOpenInNewTab,
  onClose,
  children,
  className,
  headerClassName,
  bodyClassName,
}: ContentContainerProps) => {
  return (
    <div className={cn(
      "bg-black/50 border border-green-400/30 rounded-lg overflow-hidden mb-6",
      className
    )}>
      <div className={cn(
        "p-4 border-b border-green-400/30 bg-green-400/10",
        headerClassName
      )}>
        <div className="flex items-center justify-between">
          <h3 className="text-green-400 font-semibold text-lg">{title}</h3>
          <div className="flex items-center space-x-2">
            {onOpenInNewTab && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenInNewTab}
                className="border-green-400/30 text-green-400 hover:bg-green-400/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            )}
            <div className="px-3 py-1 bg-green-400/20 border border-green-400/40 rounded text-green-400 text-xs font-mono font-bold">
              {contentType.toUpperCase()}
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-green-400 hover:bg-green-400/10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className={cn("p-6", bodyClassName)}>{children}</div>
    </div>
  );
};
