interface LoadingContentProps {
  title: string;
  description: string;
}

export const LoadingContent = ({ title, description }: LoadingContentProps) => {
  return (
    <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-8 text-center">
      <h4 className="text-green-400 text-xl mb-4 font-mono">{title}</h4>
      <p className="text-green-300/70 mb-6 font-mono">{description}</p>
      <div className="animate-pulse">
        <div className="h-4 bg-green-400/20 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-green-400/20 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
};
