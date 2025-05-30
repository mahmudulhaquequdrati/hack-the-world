/**
 * Security Utilities for Hack The World Platform
 *
 * Security Implementation:
 * - Only "hackToken" is stored in localStorage
 * - User data is kept in Redux state only
 * - No sensitive information in localStorage
 */

export const SECURITY_CONFIG = {
  TOKEN_KEY: "hackToken",
  FORBIDDEN_STORAGE_KEYS: ["user", "authToken"], // Legacy keys to avoid
} as const;

/**
 * Securely get the authentication token from localStorage
 * @returns The hackToken or null if not found
 */
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(SECURITY_CONFIG.TOKEN_KEY);
  } catch (error) {
    console.error("Error reading token from localStorage:", error);
    return null;
  }
};

/**
 * Securely store the authentication token in localStorage
 * @param token - The JWT token to store
 */
export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(SECURITY_CONFIG.TOKEN_KEY, token);
  } catch (error) {
    console.error("Error storing token in localStorage:", error);
  }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(SECURITY_CONFIG.TOKEN_KEY);

    // Clean up legacy tokens (migration support)
    SECURITY_CONFIG.FORBIDDEN_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};

/**
 * Check if any forbidden keys are present in localStorage
 * This helps ensure we don't accidentally store user data
 * @returns Array of forbidden keys found in localStorage
 */
export const checkForForbiddenKeys = (): string[] => {
  const foundKeys: string[] = [];

  try {
    SECURITY_CONFIG.FORBIDDEN_STORAGE_KEYS.forEach((key) => {
      if (localStorage.getItem(key) !== null) {
        foundKeys.push(key);
      }
    });
  } catch (error) {
    console.error("Error checking localStorage keys:", error);
  }

  return foundKeys;
};

/**
 * Validate that localStorage only contains allowed authentication data
 * @returns Object with validation results
 */
export const validateSecureStorage = (): {
  isValid: boolean;
  issues: string[];
  hasToken: boolean;
} => {
  const issues: string[] = [];
  const forbiddenKeys = checkForForbiddenKeys();

  if (forbiddenKeys.length > 0) {
    issues.push(
      `Found forbidden keys in localStorage: ${forbiddenKeys.join(", ")}`
    );
  }

  const hasToken = getAuthToken() !== null;

  return {
    isValid: issues.length === 0,
    issues,
    hasToken,
  };
};

/**
 * Development helper to log security validation results
 * Only runs in development mode
 */
export const logSecurityValidation = (): void => {
  if (import.meta.env.DEV) {
    const validation = validateSecureStorage();

    if (!validation.isValid) {
      console.warn("🚨 Security validation failed:", validation.issues);
    } else {
      console.log(
        "✅ Security validation passed - only hackToken in localStorage"
      );
    }
  }
};
