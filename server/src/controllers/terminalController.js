const Content = require("../models/Content");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc    Execute terminal command for specific content
 * @route   POST /api/content/:contentId/terminal/execute
 * @access  Private (enrolled users)
 */
const executeCommand = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const { command } = req.body;

  // Validate input
  if (!command || typeof command !== "string" || command.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Command is required and must be a non-empty string",
    });
  }

  // Get content with terminal configuration
  const content = await Content.findById(contentId).select("terminalConfig");

  if (!content) {
    return res.status(404).json({
      success: false,
      error: "Content not found",
    });
  }

  // Check if terminal is enabled for this content
  if (!content.terminalConfig?.enableTerminal) {
    return res.status(400).json({
      success: false,
      error: "Terminal is not enabled for this content",
    });
  }

  const trimmedCommand = command.trim().toLowerCase();
  const { availableCommands, commandResponses } = content.terminalConfig;

  // Always allow 'help' command regardless of configuration
  if (trimmedCommand === "help") {
    const helpResponse =
      availableCommands && availableCommands.length > 0
        ? `🔧 Available Commands:\n${availableCommands.map((cmd) => `  • ${cmd}`).join("\n")}\n\n💡 Type any command above to execute it!\n🚀 This terminal is configured specifically for this content.`
        : `🔧 Default Available Commands:\n  • ls\n  • pwd\n  • whoami\n  • help\n  • clear\n  • cat\n  • grep\n  • find\n  • ps\n  • netstat\n\n💡 Type any command above to execute it!\n🚀 This terminal has default command configuration.`;

    return res.json({
      success: true,
      data: {
        command: trimmedCommand,
        response: helpResponse,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Check if command is available
  if (!availableCommands || !availableCommands.includes(trimmedCommand)) {
    const availableList =
      availableCommands && availableCommands.length > 0
        ? availableCommands.join(", ")
        : "ls, pwd, whoami, help, clear, cat, grep, find, ps, netstat";

    return res.json({
      success: true,
      data: {
        command: trimmedCommand,
        response: `Command '${trimmedCommand}' not found.\n\n🔧 Available Commands: ${availableList}\n\n💡 Type 'help' for detailed command list.`,
        isError: true,
      },
    });
  }

  // Get command response from configuration
  let response = commandResponses?.[trimmedCommand];

  if (!response) {
    // Fallback to default responses if not configured
    const defaultResponses = {
      ls: "drwxr-xr-x 2 student student 4096 Dec 20 10:30 Documents\ndrwxr-xr-x 2 student student 4096 Dec 20 10:30 Downloads\n-rw-r--r-- 1 student student  156 Dec 20 10:30 README.txt",
      pwd: "/home/student",
      whoami: "student",
      clear: "CLEAR_TERMINAL",
      cat: "Usage: cat <filename>\n\n📝 Example: cat README.txt",
      grep: "Usage: grep <pattern> <file>\n\n🔍 Example: grep 'password' config.txt",
      find: "Usage: find <path> -name <filename>\n\n🔍 Example: find /home -name '*.txt'",
      ps: "PID TTY          TIME CMD\n1234 pts/0    00:00:01 bash\n5678 pts/0    00:00:00 ps\n9101 pts/0    00:00:00 node",
      netstat:
        "Active Internet connections\nProto Recv-Q Send-Q Local Address           Foreign Address         State\ntcp   0      0      127.0.0.1:3000         0.0.0.0:*               LISTEN\ntcp   0      0      127.0.0.1:5001         0.0.0.0:*               LISTEN",
    };

    response =
      defaultResponses[trimmedCommand] ||
      `Command '${trimmedCommand}' executed successfully.\n\n💡 This command doesn't have a configured response. Check the admin panel to customize command outputs.`;
  }

  // Handle special commands
  if (response === "CLEAR_TERMINAL") {
    return res.json({
      success: true,
      data: {
        command: trimmedCommand,
        response: "",
        shouldClear: true,
      },
    });
  }

  // Log command execution for analytics (optional)
  console.log(
    `Terminal command executed: ${trimmedCommand} for content: ${contentId}`
  );

  res.json({
    success: true,
    data: {
      command: trimmedCommand,
      response: response,
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * @desc    Get terminal configuration for content
 * @route   GET /api/content/:contentId/terminal/config
 * @access  Private (enrolled users)
 */
const getTerminalConfig = asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  const content = await Content.findById(contentId).select("terminalConfig");

  if (!content) {
    return res.status(404).json({
      success: false,
      error: "Content not found",
    });
  }

  res.json({
    success: true,
    data: {
      terminalConfig: content.terminalConfig || {
        enableTerminal: false,
        availableCommands: [],
        commandResponses: {},
      },
    },
  });
});

/**
 * @desc    Update terminal configuration for content (admin only)
 * @route   PUT /api/content/:contentId/terminal/config
 * @access  Private (admin only)
 */
const updateTerminalConfig = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const { terminalConfig } = req.body;

  // Validate terminal configuration
  if (!terminalConfig || typeof terminalConfig !== "object") {
    return res.status(400).json({
      success: false,
      error: "Terminal configuration is required",
    });
  }

  const content = await Content.findById(contentId);

  if (!content) {
    return res.status(404).json({
      success: false,
      error: "Content not found",
    });
  }

  // Update terminal configuration
  content.terminalConfig = {
    ...content.terminalConfig,
    ...terminalConfig,
  };

  await content.save();

  res.json({
    success: true,
    data: {
      terminalConfig: content.terminalConfig,
    },
  });
});

module.exports = {
  executeCommand,
  getTerminalConfig,
  updateTerminalConfig,
};
