/**
 * Enhanced Color Utilities for Cybersecurity Theme
 * Provides consistent color schemes and utility functions
 */

// Primary cybersecurity color palette
export const CYBERSEC_COLORS = {
  // Matrix Green - Primary brand color
  GREEN: {
    light: '#00ff41',
    DEFAULT: '#00ff00', 
    dark: '#00cc33',
    muted: '#004d1a'
  },
  
  // Terminal Blue - Secondary accent
  BLUE: {
    light: '#4fc3f7',
    DEFAULT: '#2196f3',
    dark: '#1976d2',
    muted: '#0d47a1'
  },
  
  // Warning Red - Alerts and dangers
  RED: {
    light: '#ff5722',
    DEFAULT: '#f44336',
    dark: '#d32f2f',
    muted: '#c62828'
  },
  
  // Warning Yellow - Cautions
  YELLOW: {
    light: '#ffeb3b',
    DEFAULT: '#ffc107',
    dark: '#ff8f00',
    muted: '#e65100'
  },
  
  // Purple - Advanced features
  PURPLE: {
    light: '#e1bee7',
    DEFAULT: '#9c27b0',
    dark: '#7b1fa2',
    muted: '#4a148c'
  },
  
  // Cyan - Information
  CYAN: {
    light: '#80deea',
    DEFAULT: '#00bcd4',
    dark: '#00838f',
    muted: '#006064'
  }
};

// Difficulty level color mapping
export const DIFFICULTY_COLORS = {
  'beginner': CYBERSEC_COLORS.GREEN,
  'intermediate': CYBERSEC_COLORS.YELLOW,
  'advanced': CYBERSEC_COLORS.RED,
  'expert': CYBERSEC_COLORS.PURPLE
};

// Status indicator colors
export const STATUS_COLORS = {
  active: CYBERSEC_COLORS.GREEN,
  inactive: CYBERSEC_COLORS.RED,
  pending: CYBERSEC_COLORS.YELLOW,
  completed: CYBERSEC_COLORS.CYAN
};

/**
 * Get color scheme for difficulty level
 * @param {string} difficulty - The difficulty level
 * @returns {object} Color scheme object
 */
export const getDifficultyColorScheme = (difficulty) => {
  const normalizedDifficulty = difficulty?.toLowerCase() || 'beginner';
  return DIFFICULTY_COLORS[normalizedDifficulty] || DIFFICULTY_COLORS.beginner;
};

/**
 * Get Tailwind classes for difficulty level
 * @param {string} difficulty - The difficulty level
 * @returns {object} Tailwind class names
 */
export const getDifficultyTailwindClasses = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return {
        text: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/50',
        glow: 'shadow-green-400/20'
      };
    case 'intermediate':
      return {
        text: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/50',
        glow: 'shadow-yellow-400/20'
      };
    case 'advanced':
      return {
        text: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/50',
        glow: 'shadow-red-400/20'
      };
    case 'expert':
      return {
        text: 'text-purple-400',
        bg: 'bg-purple-400/10',
        border: 'border-purple-400/50',
        glow: 'shadow-purple-400/20'
      };
    default:
      return {
        text: 'text-gray-400',
        bg: 'bg-gray-400/10',
        border: 'border-gray-400/50',
        glow: 'shadow-gray-400/20'
      };
  }
};

/**
 * Get enhanced visual effects for cybersecurity theme
 * @param {string} color - Base color name
 * @returns {object} CSS classes for enhanced effects
 */
export const getCybersecEffects = (color = 'green') => {
  return {
    cardGlow: `hover:shadow-lg hover:shadow-${color}-400/20`,
    borderGlow: `border-${color}-400/30 hover:border-${color}-400/50`,
    backgroundGradient: `bg-gradient-to-br from-${color}-900/30 to-black/80`,
    textGlow: `text-${color}-400`,
    pulseAnimation: 'animate-pulse',
    hoverScale: 'hover:scale-105',
    transitionAll: 'transition-all duration-300'
  };
};

/**
 * Generate terminal-style ASCII decorations
 */
export const TERMINAL_CHARS = {
  bullet: '◆',
  arrow: '▶',
  leftArrow: '◄',
  rightArrow: '►',
  upArrow: '▲',
  downArrow: '▼',
  diamond: '◊',
  square: '■',
  circle: '●',
  dot: '•',
  treeNode: '├──',
  treeEnd: '└──',
  treeVertical: '│',
  prompt: '$',
  cursor: '█'
};

/**
 * Get random matrix-style animation delay
 */
export const getRandomAnimationDelay = () => {
  return `${Math.random() * 2}s`;
};

/**
 * Create CSS custom properties for color themes
 */
export const createColorCSSProperties = (colorScheme) => {
  return {
    '--primary-color': colorScheme.DEFAULT,
    '--primary-light': colorScheme.light,
    '--primary-dark': colorScheme.dark,
    '--primary-muted': colorScheme.muted
  };
};