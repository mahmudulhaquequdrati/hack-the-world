import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Animation utilities
export const fadeIn = "animate-fade-in";
export const slideUp = "animate-slide-up";
export const slideDown = "animate-slide-down";

// Color utilities
export const getRandomColor = () => {
  const colors = [
    "text-green-400",
    "text-blue-400",
    "text-red-400",
    "text-purple-400",
    "text-yellow-400",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Local storage utilities
export const setLocalStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getLocalStorage = (key: string): unknown => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

// Debounce utility
export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: T) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
