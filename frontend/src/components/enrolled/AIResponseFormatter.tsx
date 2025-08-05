import { Button } from "@/components/ui/button";
import {
  Copy,
  Terminal,
  Lightbulb,
  Info,
  AlertTriangle,
  CheckCircle,
  Code,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AIResponseFormatterProps {
  content: string;
  isTyping?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

interface ParsedContent {
  type:
    | "text"
    | "code"
    | "command"
    | "list"
    | "heading"
    | "tip"
    | "warning"
    | "success"
    | "info";
  content: string;
  language?: string;
  items?: string[];
}

const AIResponseFormatter = ({
  content,
  isTyping = false,
  onSuggestionClick,
  className = "",
}: AIResponseFormatterProps) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [parsedBlocks, setParsedBlocks] = useState<ParsedContent[]>([]);

  // Parse content into structured blocks - simplified for more natural AI responses
  const parseContent = (text: string): ParsedContent[] => {
    const blocks: ParsedContent[] = [];
    const lines = text.split("\n");
    let currentBlock: ParsedContent | null = null;
    let codeBuffer: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";

    for (const line of lines) {
      // Handle code blocks
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // End code block
          if (codeBuffer.length > 0) {
            blocks.push({
              type: "code",
              content: codeBuffer.join("\n"),
              language: codeLanguage,
            });
          }
          codeBuffer = [];
          inCodeBlock = false;
          codeLanguage = "";
        } else {
          // Start code block
          inCodeBlock = true;
          codeLanguage = line.trim().substring(3);
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Handle inline code/commands only for clear terminal commands
      if (
        line.trim().startsWith("$ ") ||
        line.trim().startsWith("sudo ") ||
        line.trim().startsWith("nmap ") ||
        line.trim().startsWith("cat ") ||
        line.trim().startsWith("ls ") ||
        line.trim().startsWith("grep ")
      ) {
        blocks.push({
          type: "command",
          content: line.trim(),
        });
        continue;
      }

      // Handle clear headings only (with # at start of line)
      if (line.trim().startsWith("# ") && line.trim().length > 2) {
        blocks.push({
          type: "heading",
          content: line.trim().substring(2),
        });
        continue;
      }

      // Handle special sections only with clear emoji markers at start
      if (line.trim().startsWith("💡 ")) {
        blocks.push({
          type: "tip",
          content: line.trim().substring(3),
        });
        continue;
      }

      if (line.trim().startsWith("⚠️ ")) {
        blocks.push({
          type: "warning",
          content: line.trim().substring(3),
        });
        continue;
      }

      if (line.trim().startsWith("✅ ")) {
        blocks.push({
          type: "success",
          content: line.trim().substring(3),
        });
        continue;
      }

      if (line.trim().startsWith("ℹ️ ")) {
        blocks.push({
          type: "info",
          content: line.trim().substring(3),
        });
        continue;
      }

      // Handle lists only for clear bullet points
      if (
        line.trim().startsWith("- ") ||
        line.trim().startsWith("• ") ||
        /^\d+\.\s/.test(line.trim())
      ) {
        if (currentBlock?.type === "list") {
          currentBlock.items?.push(line.trim().replace(/^[-•]\s|^\d+\.\s/, ""));
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = {
            type: "list",
            content: "",
            items: [line.trim().replace(/^[-•]\s|^\d+\.\s/, "")],
          };
        }
        continue;
      }

      // Handle regular text - keep formatting like **bold** and *italic*
      if (line.trim()) {
        if (currentBlock?.type === "text") {
          currentBlock.content += "\n" + line.trim();
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = {
            type: "text",
            content: line.trim(),
          };
        }
      } else {
        // Empty line - finish current block
        if (currentBlock) {
          blocks.push(currentBlock);
          currentBlock = null;
        }
      }
    }

    // Add final block
    if (currentBlock) {
      blocks.push(currentBlock);
    }

    return blocks;
  };

  // Typing animation effect
  useEffect(() => {
    if (!isTyping) {
      setDisplayedContent(content);
      setIsComplete(true);
      setParsedBlocks(parseContent(content));
      return;
    }

    setDisplayedContent("");
    setIsComplete(false);

    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character

    const typeWriter = () => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        setIsComplete(true);
        setParsedBlocks(parseContent(content));
      }
    };

    typeWriter();
  }, [content, isTyping]);

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  // Render text with basic markdown formatting (like ChatGPT/Claude)
  const renderTextWithFormatting = (text: string) => {
    const parts = [];
    let currentIndex = 0;

    // Find **bold** text
    let boldMatch;
    const boldRegex = /\*\*(.*?)\*\*/g;

    while ((boldMatch = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (boldMatch.index > currentIndex) {
        parts.push(text.slice(currentIndex, boldMatch.index));
      }

      // Add bold text
      parts.push(
        <strong
          key={`bold-${boldMatch.index}`}
          className="font-semibold text-green-200"
        >
          {boldMatch[1]}
        </strong>
      );

      currentIndex = boldMatch.index + boldMatch[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Render different block types
  const renderBlock = (block: ParsedContent, index: number) => {
    switch (block.type) {
      case "heading":
        return (
          <div key={index} className="mb-4">
            <h3 className="text-green-300 font-bold text-sm border-b border-green-400/30 pb-1">
              {block.content}
            </h3>
          </div>
        );

      case "code":
        return (
          <div key={index} className="mb-4 relative group">
            <div className="bg-gray-900/80 border border-green-400/20 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-green-400/10 border-b border-green-400/20">
                <div className="flex items-center space-x-2">
                  <Code className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400 font-mono">
                    {block.language || "code"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(block.content)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-green-400 hover:bg-green-400/10"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="p-3 text-xs text-green-300 font-mono overflow-x-auto">
                <code>{block.content}</code>
              </pre>
            </div>
          </div>
        );

      case "command":
        return (
          <div key={index} className="mb-3 relative group">
            <div className="bg-black/60 border border-green-400/30 rounded-md p-2 flex items-center space-x-2">
              <Terminal className="w-3 h-3 text-green-400 flex-shrink-0" />
              <code className="text-green-300 font-mono text-xs flex-1">
                {block.content}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(block.content)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-green-400 hover:bg-green-400/10"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );

      case "list":
        return (
          <div key={index} className="mb-4">
            <ul className="space-y-2">
              {block.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1 text-xs">▶</span>
                  <span className="text-green-300 text-xs leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "tip":
        return (
          <div
            key={index}
            className="mb-4 bg-blue-400/10 border border-blue-400/30 rounded-lg p-3"
          >
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-blue-300 font-semibold text-xs mb-1">
                  Tip
                </div>
                <div className="text-blue-200 text-xs leading-relaxed">
                  {block.content}
                </div>
              </div>
            </div>
          </div>
        );

      case "warning":
        return (
          <div
            key={index}
            className="mb-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3"
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-yellow-300 font-semibold text-xs mb-1">
                  Warning
                </div>
                <div className="text-yellow-200 text-xs leading-relaxed">
                  {block.content}
                </div>
              </div>
            </div>
          </div>
        );

      case "success":
        return (
          <div
            key={index}
            className="mb-4 bg-green-400/10 border border-green-400/30 rounded-lg p-3"
          >
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-green-300 font-semibold text-xs mb-1">
                  Success
                </div>
                <div className="text-green-200 text-xs leading-relaxed">
                  {block.content}
                </div>
              </div>
            </div>
          </div>
        );

      case "info":
        return (
          <div
            key={index}
            className="mb-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-3"
          >
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-cyan-300 font-semibold text-xs mb-1">
                  Info
                </div>
                <div className="text-cyan-200 text-xs leading-relaxed">
                  {block.content}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className="mb-3">
            <div className="text-green-300 text-xs leading-relaxed whitespace-pre-wrap">
              {renderTextWithFormatting(block.content)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`ai-response-formatter ${className}`}>
      {isComplete && parsedBlocks.length > 0 ? (
        // Render parsed content
        <div className="space-y-2">
          {parsedBlocks.map((block, index) => renderBlock(block, index))}
        </div>
      ) : (
        // Render typing animation
        <div className="text-green-300 text-xs leading-relaxed whitespace-pre-wrap">
          {displayedContent}
          {isTyping && !isComplete && (
            <span className="animate-pulse ml-1 text-green-400">█</span>
          )}
        </div>
      )}
    </div>
  );
};

export default AIResponseFormatter;
