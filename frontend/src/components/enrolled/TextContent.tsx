interface TextContentProps {
  content?: string;
  description?: string;
}

export const TextContent = ({ content, description }: TextContentProps) => {
  return (
    <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-8">
      <div className="prose prose-green max-w-none">
        <div className="text-green-400 text-xl mb-4 font-mono">
          Reading Material
        </div>
        <div className="text-green-300/90 leading-relaxed font-mono text-sm">
          {content || description}
        </div>
      </div>
    </div>
  );
};
