import {
  Brain,
  Code,
  Lightbulb,
  LucideIcon,
  Network,
  Shield,
  Target,
  Terminal,
} from "lucide-react";

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
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
 * @param iconName - The name of the icon (e.g., "Lightbulb", "Target")
 * @returns The corresponding Lucide icon component or Shield as fallback
 */
export const getIconFromName = (iconName: string | LucideIcon): LucideIcon => {
  // If it's already a LucideIcon component, return it
  if (typeof iconName !== "string") {
    return iconName;
  }

  // Return the mapped icon or Shield as fallback
  return iconMap[iconName] || Shield;
};

/**
 * Get all available icon names
 * @returns Array of available icon names
 */
export const getAvailableIconNames = (): string[] => {
  return Object.keys(iconMap);
};
