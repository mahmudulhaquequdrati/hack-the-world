const asyncHandler = require("../middleware/asyncHandler");
const Content = require("../models/Content");
const Module = require("../models/Module");
const UserProgress = require("../models/UserProgress");
const ErrorResponse = require("../utils/errorResponse");
const axios = require("axios");

/**
 * @desc    Start AI chat session with content context
 * @route   POST /api/ai-chat/start
 * @access  Private
 */
const startChatSession = asyncHandler(async (req, res) => {
  const { contentId, moduleId } = req.body;
  const userId = req.user.id;

  try {
    let context = {};

    // Get content context if contentId provided
    if (contentId) {
      const content = await Content.findById(contentId).populate(
        "moduleId",
        "title description"
      );
      if (!content) {
        return res.status(404).json({
          success: false,
          message: "Content not found",
        });
      }

      context.content = {
        id: content._id,
        title: content.title,
        description: content.description,
        type: content.type,
        aiContent: content.aiContent,
        aiDescription: content.aiDescription,
        availableTools: content.availableTools,
        module: content.moduleId,
      };
    }

    // Get module context if moduleId provided
    if (moduleId) {
      const module = await Module.findById(moduleId).populate(
        "phaseId",
        "title description"
      );
      if (!module) {
        return res.status(404).json({
          success: false,
          message: "Module not found",
        });
      }

      context.module = {
        id: module._id,
        title: module.title,
        description: module.description,
        phase: module.phaseId,
      };
    }

    // Get user progress for context
    if (contentId) {
      const progress = await UserProgress.findOne({
        userId,
        contentId,
      });

      context.progress = {
        completed: progress?.isCompleted || false,
        progressPercentage: progress?.progressPercentage || 0,
        timeSpent: progress?.timeSpent || 0,
      };
    }

    // Generate initial AI response based on context
    const initialResponse = generateInitialResponse(context);

    res.status(200).json({
      success: true,
      message: "AI chat session started",
      data: {
        sessionId: `${userId}-${Date.now()}`,
        context,
        initialResponse,
        availableCommands: getAvailableCommands(
          context.content?.availableTools || []
        ),
      },
    });
  } catch (error) {
    console.error("Error starting AI chat session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start AI chat session",
    });
  }
});

/**
 * @desc    Send message to AI chat
 * @route   POST /api/ai-chat/message
 * @access  Private
 */
const sendChatMessage = asyncHandler(async (req, res) => {
  const { message, sessionId, contentId, moduleId } = req.body;
  const userId = req.user.id;

  console.log("💬 AI Chat Request:", {
    userId,
    message: message.substring(0, 50) + "...",
    contentId,
    hasAuth: !!req.user,
  });

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  try {
    // Get context for the message
    let context = {};

    if (contentId) {
      console.log("🔍 Looking up content:", contentId);
      const content = await Content.findById(contentId).populate(
        "moduleId",
        "title description"
      );
      if (content) {
        context.content = {
          id: content._id,
          title: content.title,
          description: content.description,
          type: content.type,
          aiContent: content.aiContent,
          aiDescription: content.aiDescription,
          availableTools: content.availableTools,
          module: content.moduleId,
        };
        console.log("✅ Content context loaded:", {
          title: content.title,
          hasAiContent: !!content.aiContent,
          hasAiDescription: !!content.aiDescription,
        });
      } else {
        console.log("⚠️ Content not found for ID:", contentId);
      }
    }

    // Generate AI response based on message and context
    console.log("🤖 Generating AI response...");
    const aiResponse = await generateAIResponse(message, context);
    console.log(
      "✅ AI response generated:",
      aiResponse.substring(0, 100) + "..."
    );

    res.status(200).json({
      success: true,
      message: "Message processed",
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString(),
        suggestions: generateSuggestions(message, context),
      },
    });
  } catch (error) {
    console.error("❌ Error processing chat message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process message",
      error: error.message,
    });
  }
});

/**
 * @desc    Execute terminal command with AI assistance
 * @route   POST /api/ai-chat/terminal
 * @access  Private
 */
const executeTerminalCommand = asyncHandler(async (req, res) => {
  const { command, contentId } = req.body;
  const userId = req.user.id;

  try {
    let context = {};

    if (contentId) {
      const content = await Content.findById(contentId);
      if (content) {
        context.content = {
          id: content._id,
          title: content.title,
          type: content.type,
          aiContent: content.aiContent,
          availableTools: content.availableTools,
        };
      }
    }

    // Process terminal command
    const commandResult = await processTerminalCommand(command, context);

    res.status(200).json({
      success: true,
      message: "Command executed",
      data: {
        command,
        output: commandResult.output,
        aiExplanation: commandResult.explanation,
        suggestions: commandResult.suggestions,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error executing terminal command:", error);
    res.status(500).json({
      success: false,
      message: "Failed to execute command",
    });
  }
});

/**
 * @desc    Get available tools for content
 * @route   GET /api/ai-chat/tools/:contentId
 * @access  Private
 */
const getAvailableTools = asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  try {
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    const tools = getToolsConfiguration(content.availableTools);

    res.status(200).json({
      success: true,
      message: "Available tools retrieved",
      data: {
        tools,
        contentType: content.type,
        contentTitle: content.title,
      },
    });
  } catch (error) {
    console.error("Error getting available tools:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get tools",
    });
  }
});

// Helper functions

function generateInitialResponse(context) {
  let response = "Hello! I'm your AI learning assistant. ";

  if (context.content) {
    response += `I see you're working on "${context.content.title}". `;

    if (context.content.aiDescription) {
      response += `${context.content.aiDescription} `;
    }

    if (context.content.type === "lab") {
      response +=
        "I can help you with terminal commands, explain concepts, and guide you through the lab exercises. ";
    } else if (context.content.type === "video") {
      response +=
        "I can answer questions about the video content and provide additional explanations. ";
    } else if (context.content.type === "game") {
      response +=
        "I can provide hints, explain game mechanics, and help you understand the underlying security concepts. ";
    }

    if (
      context.content.availableTools &&
      context.content.availableTools.length > 0
    ) {
      response += `Available tools for this lesson: ${context.content.availableTools.join(", ")}. `;
    }
  }

  if (context.progress && context.progress.completed) {
    response +=
      "I see you've completed this content before. Feel free to ask for a review or deeper insights!";
  } else {
    response += "What would you like to learn about or need help with?";
  }

  return response;
}

async function generateAIResponse(message, context) {
  try {
    console.log("🤖 AI Context:", JSON.stringify(context, null, 2));

    // Build context-aware prompt
    let systemPrompt = `You are an expert cybersecurity instructor and AI assistant. You help students learn cybersecurity concepts through interactive chat and terminal commands.

Key guidelines:
- Provide clear, educational explanations
- Use practical examples and real-world scenarios
- Encourage hands-on learning with terminal commands
- Be concise but thorough
- Always prioritize security best practices`;

    // Add module context if available
    if (context.module) {
      systemPrompt += `\n\nCurrent module: ${context.module.title}`;
      if (context.module.description) {
        systemPrompt += `\nModule description: ${context.module.description}`;
      }
    }

    // Add content context with emphasis on aiContent
    if (context.content) {
      systemPrompt += `\n\nCurrent lesson: ${context.content.title}`;

      // Prioritize aiContent as the primary knowledge source
      if (context.content.aiContent && context.content.aiContent.trim()) {
        systemPrompt += `\n\nDETAILED LESSON KNOWLEDGE (Use this as your primary reference):
${context.content.aiContent}`;
        console.log("✅ Using AI Content as primary knowledge source");
      } else if (context.content.description) {
        systemPrompt += `\nLesson description: ${context.content.description}`;
        console.log("⚠️ Using fallback description, no AI Content provided");
      }

      // Add AI description if available (for additional context)
      if (
        context.content.aiDescription &&
        context.content.aiDescription.trim()
      ) {
        systemPrompt += `\n\nAdditional context: ${context.content.aiDescription}`;
      }

      // Add content type context
      systemPrompt += `\nContent type: ${context.content.type}`;

      // Add available tools context
      if (
        context.content.availableTools &&
        context.content.availableTools.length > 0
      ) {
        systemPrompt += `\nAvailable learning tools: ${context.content.availableTools.join(", ")}`;
      }
    }

    console.log("🔑 Checking API keys...");
    console.log("OpenAI Key present:", !!process.env.OPENAI_API_KEY);
    console.log("DeepSeek Key present:", !!process.env.DEEPSEEK_API_KEY);

    // Try OpenAI first, fallback to DeepSeek
    if (process.env.OPENAI_API_KEY) {
      console.log("🚀 Using OpenAI API...");
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ OpenAI response received");
      return response.data.choices[0].message.content;
    }

    // Fallback to DeepSeek
    if (process.env.DEEPSEEK_API_KEY) {
      console.log("🚀 Using DeepSeek API...");
      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ DeepSeek response received");
      return response.data.choices[0].message.content;
    }

    // Fallback to local response if no API keys
    console.log("⚠️ No API keys configured, using fallback response");
    return `I'd be happy to help you with "${message}"! However, real AI features require API keys to be configured. Please set up OpenAI or DeepSeek API keys in your environment variables.

For now, I can provide some general guidance: This appears to be a cybersecurity question. ${context.content ? `You're currently studying "${context.content.title}".` : ""}

To enable full AI capabilities:
1. Get an API key from OpenAI (platform.openai.com) or DeepSeek (platform.deepseek.com)
2. Add it to your server/.env file as OPENAI_API_KEY=your-key-here
3. Restart the server

Try using the terminal for hands-on practice in the meantime!`;
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);

    // Fallback response
    return `I understand you're asking about "${message}". While I'm having trouble connecting to the AI service right now, I can tell you this is an important cybersecurity topic. Try checking the terminal commands or explore the course materials for more information.`;
  }
}

async function processTerminalCommand(command, context) {
  const output = simulateTerminalCommand(command);
  const explanation = explainCommand(command, context);
  const suggestions = getSuggestedCommands(command, context);

  return {
    output,
    explanation,
    suggestions,
  };
}

function simulateTerminalCommand(command) {
  // Simulate common cybersecurity commands
  const cmd = command.trim().toLowerCase();

  if (cmd.startsWith("ls")) {
    return "file1.txt  file2.log  vuln_app.py  config.conf";
  } else if (cmd.startsWith("pwd")) {
    return "/home/student/cybersec_lab";
  } else if (cmd.startsWith("whoami")) {
    return "student";
  } else if (cmd.startsWith("nmap")) {
    return `Starting Nmap scan...
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.6p1
80/tcp   open  http    Apache httpd 2.4.29
443/tcp  open  https   Apache httpd 2.4.29`;
  } else if (cmd.startsWith("cat")) {
    return "Sample file content goes here...";
  } else if (cmd.includes("--help") || cmd.includes("-h")) {
    return `Usage: ${command.split(" ")[0]} [options]
Common options:
  -h, --help     Show this help message
  -v, --verbose  Verbose output`;
  } else {
    return `Command '${command}' executed. Output would appear here in a real environment.`;
  }
}

function explainCommand(command, context) {
  const cmd = command.trim().toLowerCase().split(" ")[0];

  const explanations = {
    ls: "Lists files and directories in the current location. Essential for navigation and file discovery.",
    pwd: "Prints the current working directory path. Helps you understand where you are in the file system.",
    nmap: "Network mapper - scans for open ports and services. Critical tool for network reconnaissance.",
    cat: "Displays file contents. Useful for reading configuration files, logs, and text files.",
    grep: "Searches for patterns in files. Essential for log analysis and finding specific information.",
    chmod:
      "Changes file permissions. Important for understanding and modifying security settings.",
    sudo: "Executes commands with elevated privileges. Critical for system administration tasks.",
  };

  return (
    explanations[cmd] ||
    `The command '${cmd}' is used in cybersecurity for various purposes. It's part of the standard toolkit for security professionals.`
  );
}

function getSuggestedCommands(command, context) {
  const cmd = command.trim().toLowerCase().split(" ")[0];

  const suggestions = {
    ls: ["ls -la", "ls -ltr", "find . -name '*.conf'"],
    nmap: ["nmap -sV localhost", "nmap -A target_ip", "nmap -sC -sV target"],
    cat: ["grep 'error' filename", "tail -f logfile", "head -n 20 filename"],
    grep: [
      "grep -r 'password' .",
      "grep -i 'error' logfile",
      "grep -n 'config' file",
    ],
  };

  return suggestions[cmd] || ["help", "man " + cmd, cmd + " --help"];
}

function getAvailableCommands(tools) {
  const commands = {
    terminal: ["ls", "pwd", "cat", "grep", "find", "chmod", "sudo"],
    "network-scanner": ["nmap", "netstat", "ss", "ping", "traceroute"],
    "vulnerability-scanner": ["nikto", "openvas", "nessus", "masscan"],
    "forensics-kit": ["volatility", "autopsy", "sleuthkit", "foremost"],
    "malware-analyzer": ["yara", "clamav", "strings", "hexdump"],
    "web-security": ["burpsuite", "sqlmap", "gobuster", "dirb"],
    "crypto-tools": ["openssl", "hashcat", "john", "gpg"],
  };

  let availableCommands = ["help", "clear"];
  tools.forEach((tool) => {
    if (commands[tool]) {
      availableCommands = availableCommands.concat(commands[tool]);
    }
  });

  return [...new Set(availableCommands)]; // Remove duplicates
}

function getToolsConfiguration(availableTools) {
  const toolsConfig = {
    terminal: {
      name: "Terminal",
      icon: "Terminal",
      description: "Command line interface for executing cybersecurity tools",
    },
    chat: {
      name: "AI Chat",
      icon: "MessageCircle",
      description: "Interactive chat with AI learning assistant",
    },
    analysis: {
      name: "Code Analysis",
      icon: "Search",
      description: "AI-powered code and log analysis",
    },
    "risk-calc": {
      name: "Risk Calculator",
      icon: "Calculator",
      description: "Risk assessment and calculation tools",
    },
    "threat-intel": {
      name: "Threat Intelligence",
      icon: "Shield",
      description: "Threat analysis and intelligence gathering",
    },
    "network-scanner": {
      name: "Network Scanner",
      icon: "Wifi",
      description: "Network discovery and port scanning tools",
    },
    "vulnerability-scanner": {
      name: "Vulnerability Scanner",
      icon: "AlertTriangle",
      description: "Automated vulnerability detection and assessment",
    },
    "forensics-kit": {
      name: "Digital Forensics",
      icon: "Eye",
      description: "Digital evidence analysis and investigation tools",
    },
    "malware-analyzer": {
      name: "Malware Analysis",
      icon: "Bug",
      description: "Malware detection and reverse engineering tools",
    },
    "social-engineer": {
      name: "Social Engineering",
      icon: "Users",
      description: "Social engineering simulation and awareness tools",
    },
    "password-cracker": {
      name: "Password Tools",
      icon: "Key",
      description: "Password cracking and security testing tools",
    },
    "web-security": {
      name: "Web Security",
      icon: "Globe",
      description: "Web application security testing tools",
    },
    "crypto-tools": {
      name: "Cryptography",
      icon: "Lock",
      description: "Encryption, hashing, and cryptographic tools",
    },
  };

  return availableTools.map((tool) => toolsConfig[tool]).filter(Boolean);
}

function generateSuggestions(message, context) {
  const suggestions = [];

  if (context.content) {
    if (context.content.type === "lab") {
      suggestions.push("Help me with terminal commands");
      suggestions.push("Explain the lab objectives");
      suggestions.push("What should I do next?");
    } else if (context.content.type === "video") {
      suggestions.push("Summarize key concepts");
      suggestions.push("Give me examples");
      suggestions.push("How does this apply in practice?");
    } else if (context.content.type === "game") {
      suggestions.push("Give me a hint");
      suggestions.push("Explain the rules");
      suggestions.push("What's the best strategy?");
    }
  }

  suggestions.push("Explain cybersecurity concepts");
  suggestions.push("Show me relevant commands");
  suggestions.push("Help me understand this better");

  return suggestions.slice(0, 4); // Return max 4 suggestions
}

module.exports = {
  startChatSession,
  sendChatMessage,
  executeTerminalCommand,
  getAvailableTools,
};
