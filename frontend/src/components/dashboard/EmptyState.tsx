import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconSize?: string;
  titleSize?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  iconSize = "w-16 h-16",
  titleSize = "text-xl",
}: EmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <Icon className={`${iconSize} text-gray-400 mx-auto mb-4`} />
      <h4 className={`${titleSize} font-bold text-gray-400 mb-2 font-mono`}>
        {title}
      </h4>
      <p className="text-gray-500 font-mono">{description}</p>
    </div>
  );
};
