/**
 * Module Helper Functions
 * Utilities for module operations including ID generation and duration calculation
 */

/**
 * Generate moduleId from title - takes first 2 words max and replaces spaces with hyphens
 * @param {string} title - Module title
 * @returns {string} - Generated moduleId
 */
function generateModuleId(title) {
  if (!title || typeof title !== "string") {
    throw new Error("Title is required and must be a string");
  }

  return title
    .trim()
    .toLowerCase()
    .split(/\s+/) // Split by whitespace
    .slice(0, 2) // Take first 2 words max
    .join("-") // Join with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove any non-alphanumeric characters except hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Calculate total duration from content durations
 * @param {Object} content - Content object with videos, labs, games, documents arrays
 * @param {Object} contentDatabase - Database of content with durations
 * @returns {string} - Calculated duration string
 */
function calculateModuleDuration(content, contentDatabase = {}) {
  if (!content) return "0 hours";

  let totalMinutes = 0;

  // Helper function to get duration from content item
  const getDurationMinutes = (contentType, contentId) => {
    const item = contentDatabase[contentType]?.[contentId];
    if (!item || !item.duration) return 0;

    // Parse duration string (e.g., "15 minutes", "2 hours", "1.5 hours")
    const duration = item.duration.toLowerCase();

    if (duration.includes("hour")) {
      const hours = parseFloat(duration.match(/(\d+\.?\d*)/)?.[1] || 0);
      return hours * 60;
    } else if (duration.includes("minute")) {
      return parseFloat(duration.match(/(\d+\.?\d*)/)?.[1] || 0);
    }

    return 0;
  };

  // Calculate total duration from all content types
  ["videos", "labs", "games", "documents"].forEach((contentType) => {
    if (content[contentType] && Array.isArray(content[contentType])) {
      content[contentType].forEach((contentId) => {
        totalMinutes += getDurationMinutes(contentType, contentId);
      });
    }
  });

  // Convert to readable format
  if (totalMinutes === 0) return "0 hours";
  if (totalMinutes < 60) return `${Math.round(totalMinutes)} minutes`;

  const hours = totalMinutes / 60;
  if (hours < 1) return `${Math.round(totalMinutes)} minutes`;
  if (hours === 1) return "1 hour";
  if (hours < 2) return `1.5 hours`;

  return `${Math.round(hours * 2) / 2} hours`;
}

/**
 * Default content duration database for calculation
 * This would typically come from actual content items in the database
 */
const DEFAULT_CONTENT_DURATIONS = {
  videos: {
    "cybersec-intro-001": { duration: "25 minutes" },
    "cia-triad-explained": { duration: "15 minutes" },
    "threat-landscape-2024": { duration: "30 minutes" },
    "password-best-practices": { duration: "20 minutes" },
    "mfa-setup-guide": { duration: "10 minutes" },
    "password-managers-comparison": { duration: "18 minutes" },
    "tcp-ip-explained": { duration: "35 minutes" },
    "firewall-configuration": { duration: "25 minutes" },
    "vpn-setup-guide": { duration: "20 minutes" },
    "social-engineering-explained": { duration: "22 minutes" },
    "phishing-examples": { duration: "15 minutes" },
    "security-awareness-training": { duration: "40 minutes" },
    "pentest-methodology": { duration: "45 minutes" },
    "reconnaissance-techniques": { duration: "30 minutes" },
    "vulnerability-scanning": { duration: "35 minutes" },
  },
  labs: {
    "basic-risk-assessment": { duration: "45 minutes" },
    "security-terminology-quiz": { duration: "15 minutes" },
    "password-strength-tester": { duration: "30 minutes" },
    "mfa-setup-lab": { duration: "25 minutes" },
    "password-attack-simulation": { duration: "40 minutes" },
    "network-packet-analysis": { duration: "1 hour" },
    "firewall-rules-lab": { duration: "45 minutes" },
    "wifi-security-audit": { duration: "50 minutes" },
    "phishing-identification-lab": { duration: "35 minutes" },
    "social-engineering-simulation": { duration: "1 hour" },
    "nmap-scanning-lab": { duration: "1.5 hours" },
    "vulnerability-assessment": { duration: "2 hours" },
    "basic-exploitation": { duration: "1.5 hours" },
  },
  games: {
    "cybersec-crossword": { duration: "20 minutes" },
    "threat-identification-game": { duration: "25 minutes" },
    "password-cracking-game": { duration: "30 minutes" },
    "mfa-challenge": { duration: "15 minutes" },
    "network-topology-puzzle": { duration: "25 minutes" },
    "firewall-configuration-challenge": { duration: "35 minutes" },
    "phishing-detection-game": { duration: "20 minutes" },
    "social-engineering-scenarios": { duration: "30 minutes" },
    "reconnaissance-challenge": { duration: "40 minutes" },
    "vulnerability-hunt": { duration: "45 minutes" },
  },
  documents: {
    "cybersec-fundamentals-guide": { duration: "30 minutes" },
  },
};

/**
 * Add content to module automatically
 * @param {Object} module - Module document
 * @param {string} contentType - Type of content (videos, labs, games, documents)
 * @param {string} contentId - ID of content to add
 * @returns {Object} - Updated module
 */
function addContentToModule(module, contentType, contentId) {
  const validTypes = ["videos", "labs", "games", "documents"];

  if (!validTypes.includes(contentType)) {
    throw new Error(
      `Invalid content type: ${contentType}. Must be one of: ${validTypes.join(", ")}`
    );
  }

  if (!module.content) {
    module.content = {
      videos: [],
      labs: [],
      games: [],
      documents: [],
    };
  }

  if (!module.content[contentType]) {
    module.content[contentType] = [];
  }

  // Add content ID if not already present
  if (!module.content[contentType].includes(contentId)) {
    module.content[contentType].push(contentId);

    // Recalculate duration
    module.duration = calculateModuleDuration(
      module.content,
      DEFAULT_CONTENT_DURATIONS
    );
  }

  return module;
}

/**
 * Remove content from module
 * @param {Object} module - Module document
 * @param {string} contentType - Type of content (videos, labs, games, documents)
 * @param {string} contentId - ID of content to remove
 * @returns {Object} - Updated module
 */
function removeContentFromModule(module, contentType, contentId) {
  const validTypes = ["videos", "labs", "games", "documents"];

  if (!validTypes.includes(contentType)) {
    throw new Error(
      `Invalid content type: ${contentType}. Must be one of: ${validTypes.join(", ")}`
    );
  }

  if (!module.content || !module.content[contentType]) {
    return module;
  }

  // Remove content ID if present
  const index = module.content[contentType].indexOf(contentId);
  if (index > -1) {
    module.content[contentType].splice(index, 1);

    // Recalculate duration
    module.duration = calculateModuleDuration(
      module.content,
      DEFAULT_CONTENT_DURATIONS
    );
  }

  return module;
}

module.exports = {
  generateModuleId,
  calculateModuleDuration,
  addContentToModule,
  removeContentFromModule,
  DEFAULT_CONTENT_DURATIONS,
};
