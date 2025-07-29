import { apiSlice } from "@/features/api/apiSlice";

// Types for AI Chat functionality
export interface ChatSession {
  sessionId: string;
  context: {
    content?: {
      id: string;
      title: string;
      description: string;
      type: string;
      aiContent: string;
      aiDescription: string;
      availableTools: string[];
      module: any;
    };
    module?: {
      id: string;
      title: string;
      description: string;
      phase: any;
    };
    progress?: {
      completed: boolean;
      progressPercentage: number;
      timeSpent: number;
    };
  };
  initialResponse: string;
  availableCommands: string[];
}

export interface ChatMessage {
  message: string;
  response: string;
  timestamp: string;
  suggestions: string[];
}

export interface TerminalCommand {
  command: string;
  output: string;
  aiExplanation: string;
  suggestions: string[];
  timestamp: string;
}

export interface AvailableTools {
  tools: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
  contentType: string;
  contentTitle: string;
}

// AI Chat API endpoints
export const aiChatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startChatSession: builder.mutation<
      { success: boolean; message: string; data: ChatSession },
      { contentId?: string; moduleId?: string }
    >({
      query: (body) => ({
        url: "/ai-chat/start",
        method: "POST",
        body,
      }),
    }),

    sendChatMessage: builder.mutation<
      { success: boolean; message: string; data: ChatMessage },
      {
        message: string;
        sessionId?: string;
        contentId?: string;
        moduleId?: string;
      }
    >({
      query: (body) => ({
        url: "/ai-chat/message",
        method: "POST",
        body,
      }),
    }),

    executeTerminalCommand: builder.mutation<
      { success: boolean; message: string; data: TerminalCommand },
      { command: string; contentId?: string }
    >({
      query: (body) => ({
        url: "/ai-chat/terminal",
        method: "POST",
        body,
      }),
    }),

    getAvailableTools: builder.query<
      { success: boolean; message: string; data: AvailableTools },
      string
    >({
      query: (contentId) => `/ai-chat/tools/${contentId}`,
    }),
  }),
});

export const {
  useStartChatSessionMutation,
  useSendChatMessageMutation,
  useExecuteTerminalCommandMutation,
  useGetAvailableToolsQuery,
} = aiChatApi;

// Helper functions for AI chat functionality
export class AIChatService {
  private static currentSession: ChatSession | null = null;
  private static chatHistory: Array<{
    role: "user" | "ai";
    content: string;
    timestamp: string;
  }> = [];
  private static terminalHistory: Array<{
    type: "command" | "output" | "ai";
    content: string;
    timestamp: string;
  }> = [];

  static setCurrentSession(session: ChatSession) {
    this.currentSession = session;
    this.chatHistory = [
      {
        role: "ai",
        content: session.initialResponse,
        timestamp: new Date().toISOString(),
      },
    ];
    this.terminalHistory = [];
  }

  static getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  static addChatMessage(role: "user" | "ai", content: string) {
    this.chatHistory.push({
      role,
      content,
      timestamp: new Date().toISOString(),
    });
  }

  static getChatHistory() {
    return this.chatHistory;
  }

  static addTerminalEntry(type: "command" | "output" | "ai", content: string) {
    this.terminalHistory.push({
      type,
      content,
      timestamp: new Date().toISOString(),
    });
  }

  static getTerminalHistory() {
    return this.terminalHistory;
  }

  static clearHistory() {
    this.chatHistory = [];
    this.terminalHistory = [];
  }

  static getContextualPrompt(): string {
    if (!this.currentSession?.context?.content) {
      return "Hello! I'm your AI learning assistant. How can I help you today?";
    }

    const { content } = this.currentSession.context;
    let prompt = `I'm here to help you with "${content.title}". `;

    if (content.aiDescription) {
      prompt += `${content.aiDescription} `;
    }

    switch (content.type) {
      case "lab":
        prompt +=
          "I can guide you through lab exercises, explain commands, and help troubleshoot issues.";
        break;
      case "video":
        prompt +=
          "I can explain concepts from the video and answer related questions.";
        break;
      case "game":
        prompt +=
          "I can provide hints, explain game mechanics, and help you understand the security concepts.";
        break;
      case "document":
        prompt += "I can clarify document content and expand on key concepts.";
        break;
      default:
        prompt += "I can help explain concepts and answer your questions.";
    }

    return prompt;
  }

  static getAvailableToolsForContent(
    contentId: string,
    availableTools: string[] = []
  ) {
    // Map tool names to their configurations
    const toolConfigs = {
      terminal: {
        id: "terminal",
        name: "Terminal",
        icon: "Terminal",
        description: "AI-enhanced command line interface",
      },
      chat: {
        id: "chat",
        name: "AI Chat",
        icon: "MessageCircle",
        description: "Interactive chat with AI learning assistant",
      },
      analysis: {
        id: "analysis",
        name: "Code Analysis",
        icon: "Search",
        description: "AI-powered code and log analysis",
      },
      "risk-calc": {
        id: "risk-calc",
        name: "Risk Calculator",
        icon: "Calculator",
        description: "Risk assessment and calculation tools",
      },
      "threat-intel": {
        id: "threat-intel",
        name: "Threat Intelligence",
        icon: "Shield",
        description: "Threat analysis and intelligence gathering",
      },
      "network-scanner": {
        id: "network-scanner",
        name: "Network Scanner",
        icon: "Wifi",
        description: "Network discovery and port scanning tools",
      },
      "vulnerability-scanner": {
        id: "vulnerability-scanner",
        name: "Vulnerability Scanner",
        icon: "AlertTriangle",
        description: "Automated vulnerability detection and assessment",
      },
      "forensics-kit": {
        id: "forensics-kit",
        name: "Digital Forensics",
        icon: "Eye",
        description: "Digital evidence analysis and investigation tools",
      },
      "malware-analyzer": {
        id: "malware-analyzer",
        name: "Malware Analysis",
        icon: "Bug",
        description: "Malware detection and reverse engineering tools",
      },
      "social-engineer": {
        id: "social-engineer",
        name: "Social Engineering",
        icon: "Users",
        description: "Social engineering simulation and awareness tools",
      },
      "password-cracker": {
        id: "password-cracker",
        name: "Password Tools",
        icon: "Key",
        description: "Password cracking and security testing tools",
      },
      "web-security": {
        id: "web-security",
        name: "Web Security",
        icon: "Globe",
        description: "Web application security testing tools",
      },
      "crypto-tools": {
        id: "crypto-tools",
        name: "Cryptography",
        icon: "Lock",
        description: "Encryption, hashing, and cryptographic tools",
      },
    };

    // Return only the tools that are available for this content
    return availableTools
      .map((toolName) => toolConfigs[toolName as keyof typeof toolConfigs])
      .filter(Boolean);
  }

  static generateSuggestions(
    contentType: string,
    currentMessage: string = ""
  ): string[] {
    const suggestions = [];
    const lowerMessage = currentMessage.toLowerCase();

    // Content-specific suggestions
    if (contentType === "lab") {
      if (lowerMessage.includes("help") || lowerMessage.includes("stuck")) {
        suggestions.push(
          "What commands should I use?",
          "Explain the lab objectives"
        );
      } else {
        suggestions.push(
          "Help me with terminal commands",
          "Explain the lab steps",
          "What should I do next?"
        );
      }
    } else if (contentType === "video") {
      suggestions.push(
        "Summarize key concepts",
        "Give me examples",
        "How does this apply in practice?"
      );
    } else if (contentType === "game") {
      suggestions.push(
        "Give me a hint",
        "Explain the rules",
        "What's the best strategy?"
      );
    }

    // General suggestions
    suggestions.push(
      "Explain cybersecurity concepts",
      "Show me relevant commands"
    );

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }
}

export default AIChatService;
