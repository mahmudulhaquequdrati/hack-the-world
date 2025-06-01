/**
 * Path Utilities
 * Dynamic path generation for modules and courses
 */

/**
 * Generate course detail page path
 * @param moduleId - The module ID
 * @returns Course detail path
 */
export const getCoursePath = (moduleId: string): string => {
  return `/course/${moduleId}`;
};

/**
 * Generate enrollment/learning path
 * @param moduleId - The module ID
 * @returns Learning path
 */
export const getEnrollPath = (moduleId: string): string => {
  return `/learn/${moduleId}`;
};

/**
 * Generate lab path
 * @param moduleId - The module ID
 * @param labId - The lab ID
 * @returns Lab path
 */
export const getLabPath = (moduleId: string, labId: string): string => {
  return `/learn/${moduleId}/lab/${labId}`;
};

/**
 * Generate game path
 * @param moduleId - The module ID
 * @param gameId - The game ID
 * @returns Game path
 */
export const getGamePath = (moduleId: string, gameId: string): string => {
  return `/learn/${moduleId}/game/${gameId}`;
};

/**
 * Generate dashboard path
 * @returns Dashboard path
 */
export const getDashboardPath = (): string => {
  return "/dashboard";
};

/**
 * Generate overview path
 * @returns Overview path
 */
export const getOverviewPath = (): string => {
  return "/overview";
};
