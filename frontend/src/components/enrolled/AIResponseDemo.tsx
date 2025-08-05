import AIResponseFormatter from "./AIResponseFormatter";

// Demo component to showcase the enhanced AI response formatting
const AIResponseDemo = () => {
  const sampleResponses = [
    {
      title: "Simple Text Response",
      content: `Hello! I'm your AI cybersecurity assistant. I can help you understand various security concepts and guide you through practical exercises.

This is a regular paragraph with some **bold text** and \`inline code\` examples.`,
    },
    {
      title: "Command Explanation with Code Blocks",
      content: `# 🔍 \`nmap\` Command Explanation

**Network Mapper** - Essential tool for network discovery and security auditing.

## What it does:
- Discovers hosts and services on a network
- Identifies open ports and running services
- Detects operating systems and versions

⚠️ **Security Note:** Only scan networks you own or have permission to test!

## Common usage:
\`\`\`bash
nmap -sS target.com    # SYN scan (stealth)
nmap -sV target.com    # Version detection
nmap -O target.com     # OS detection
\`\`\`

💡 **Pro tip:** Always use \`-sS\` for stealth scanning to avoid detection by intrusion detection systems.`,
    },
    {
      title: "Terminal Commands with Explanations",
      content: `Here are some essential commands to get you started:

$ ls -la
$ pwd
$ whoami

## Security Analysis Steps:

1. **Reconnaissance** - Gather information about the target
2. **Scanning** - Identify open ports and services
3. **Enumeration** - Extract detailed information
4. **Exploitation** - Attempt to gain access

✅ **Remember:** Always document your findings during penetration testing!`,
    },
    {
      title: "Multiple Alert Types Demo",
      content: `# Security Assessment Guide

Let me walk you through a comprehensive security assessment:

💡 **Best Practice:** Always start with passive reconnaissance to avoid detection.

⚠️ **Warning:** Never perform these techniques on systems you don't own or lack explicit permission to test.

ℹ️ **Information:** This assessment follows the OWASP Testing Guide methodology.

## Phase 1: Information Gathering

\`\`\`bash
# Passive reconnaissance
whois target.com
dig target.com
nslookup target.com
\`\`\`

## Phase 2: Active Scanning

- **Port Scanning**: Identify open services
- **Version Detection**: Determine software versions
- **Vulnerability Assessment**: Check for known issues

✅ **Success Indicator:** You should now have a comprehensive map of the target's attack surface.`,
    },
  ];

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-400 mb-2">
            🤖 Enhanced AI Response Formatter Demo
          </h1>
          <p className="text-green-300 text-sm">
            Showcasing beautiful, structured AI responses for cybersecurity
            learning
          </p>
        </div>

        {sampleResponses.map((response, index) => (
          <div
            key={index}
            className="border border-green-400/30 rounded-lg p-6 bg-gray-900/30"
          >
            <h2 className="text-lg font-semibold text-green-300 mb-4 border-b border-green-400/20 pb-2">
              {response.title}
            </h2>
            <div className="bg-gray-900/60 p-4 rounded-lg border border-blue-400/20">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-blue-300">
                  AI Assistant
                </span>
                <span className="text-xs text-gray-400 font-mono ml-auto">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <AIResponseFormatter
                content={response.content}
                isTyping={false}
              />
            </div>
          </div>
        ))}

        <div className="text-center pt-8 border-t border-green-400/20">
          <p className="text-green-400/70 text-sm">
            🎯 This enhanced formatting makes cybersecurity learning more
            engaging and easier to follow!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIResponseDemo;
