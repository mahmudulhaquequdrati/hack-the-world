import {
  Lightbulb,
  Target,
  Brain,
  Shield,
  Terminal,
  Network,
  Code,
} from "lucide-react";

// Map of icon names to Lucide components (same as frontend)
const iconMap = {
  Lightbulb,
  Target,
  Brain,
  Shield,
  Terminal,
  Network,
  Code,
};

/**
 * Get a Lucide icon component from an icon name string
 * @param {string} iconName - The name of the icon (e.g., "Lightbulb", "Target")
 * @returns {React.Component} The corresponding Lucide icon component or Shield as fallback
 */
export const getIconFromName = (iconName) => {
  // Return the mapped icon or Shield as fallback
  return iconMap[iconName] || Shield;
};

/**
 * Get all available icon names
 * @returns {string[]} Array of available icon names
 */
export const getAvailableIconNames = () => {
  return Object.keys(iconMap);
};

/**
 * Get icon options for form selects with labels
 * @returns {Array} Array of icon options with value and label
 */
export const getIconOptions = () => {
  return Object.keys(iconMap).map((iconName) => ({
    value: iconName,
    label: iconName, // Use icon name as label instead of emoji
  }));
};