import { store } from "@/app/store";
import { apiSlice } from "@/features/api/apiSlice";
import {
  getNormalizedCourseById as getDummyCourseById,
  getGamesByModule as getDummyGamesByModule,
  getLabsByModule as getDummyLabsByModule,
  getNormalizedModuleById as getDummyModuleById,
  getModulesByPhase as getDummyModulesByPhase,
  getNormalizedPhases as getDummyPhases,
  USER_ENROLLMENTS,
  USER_PROGRESS,
} from "./appData";
import type { Course, GameData, LabData, Module, Phase } from "./types";

// Configuration to control data source
const USE_API = import.meta.env.VITE_USE_API === "true" || false;
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Helper function to check if API is available
async function isApiAvailable(): Promise<boolean> {
  if (!USE_API) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Data Service Class
export class DataService {
  private static apiAvailable: boolean | null = null;

  private static async checkApiAvailability(): Promise<boolean> {
    if (this.apiAvailable === null) {
      this.apiAvailable = await isApiAvailable();
    }
    return this.apiAvailable;
  }

  // Phase Discovery methods
  static async getPhases(): Promise<Phase[]> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getPhases.initiate()
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data
    return getDummyPhases();
  }

  static async getPhaseById(phaseId: string): Promise<Phase | undefined> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getPhaseById.initiate(phaseId)
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data
    return getDummyPhases().find((phase) => phase.id === phaseId);
  }

  // Module Organization methods
  static async getModulesByPhase(phaseId: string): Promise<Module[]> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getModulesByPhase.initiate(phaseId)
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data
    return getDummyModulesByPhase(phaseId);
  }

  static async getModuleById(moduleId: string): Promise<Module | undefined> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getModuleById.initiate(moduleId)
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data
    return getDummyModuleById(moduleId);
  }

  // Course Content methods
  static async getCourseById(courseId: string): Promise<Course | null> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getCourseById.initiate(courseId)
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data
    return getDummyCourseById(courseId);
  }

  static async getGamesByModule(
    moduleId: string
  ): Promise<{ [gameId: string]: GameData }> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getGamesByModule.initiate(moduleId)
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data
    return getDummyGamesByModule(moduleId);
  }

  static async getLabsByModule(
    moduleId: string
  ): Promise<{ [labId: string]: LabData }> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getLabsByModule.initiate(moduleId)
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data
    return getDummyLabsByModule(moduleId);
  }

  // Enrollment methods
  static async enrollInModule(
    moduleId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.enrollInModule.initiate(moduleId)
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, using dummy enrollment:", error);
    }

    // Fallback to dummy enrollment (simulate success)
    return { success: true, message: "Enrolled successfully (dummy data)" };
  }

  static async unenrollFromModule(
    moduleId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.unenrollFromModule.initiate(moduleId)
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, using dummy unenrollment:", error);
    }

    // Fallback to dummy unenrollment (simulate success)
    return { success: true, message: "Unenrolled successfully (dummy data)" };
  }

  static async getUserEnrollments(): Promise<
    { moduleId: string; enrolledAt: string; progress: number }[]
  > {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getUserEnrollments.initiate()
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data - transform to match expected format
    return USER_ENROLLMENTS.map((enrollment) => ({
      moduleId: enrollment.moduleId,
      enrolledAt: enrollment.enrolledAt,
      progress:
        USER_PROGRESS.find((p) => p.moduleId === enrollment.moduleId)
          ?.progress || 0,
    }));
  }

  // Progress methods
  static async getUserProgress(): Promise<
    { moduleId: string; progress: number; completedAt?: string }[]
  > {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.getUserProgress.initiate()
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, falling back to dummy data:", error);
    }

    // Fallback to dummy data
    return USER_PROGRESS.map((progress) => ({
      moduleId: progress.moduleId,
      progress: progress.progress,
      completedAt: progress.completedAt,
    }));
  }

  static async updateProgress(
    moduleId: string,
    progress: number
  ): Promise<{ success: boolean }> {
    try {
      if (await this.checkApiAvailability()) {
        const result = await store.dispatch(
          apiSlice.endpoints.updateProgress.initiate({ moduleId, progress })
        );
        if (result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.warn("API failed, using dummy progress update:", error);
    }

    // Fallback to dummy progress update (simulate success)
    return { success: true };
  }

  // Utility methods
  static getDataSource(): string {
    return this.apiAvailable ? "API" : "Dummy Data";
  }

  static async refreshApiStatus(): Promise<void> {
    this.apiAvailable = null;
    await this.checkApiAvailability();
  }
}

// Export for backward compatibility with existing code
export const getPhases = () => DataService.getPhases();
export const getPhaseById = (phaseId: string) =>
  DataService.getPhaseById(phaseId);
export const getModulesByPhase = (phaseId: string) =>
  DataService.getModulesByPhase(phaseId);
export const getModuleById = (moduleId: string) =>
  DataService.getModuleById(moduleId);
export const getCourseById = (courseId: string) =>
  DataService.getCourseById(courseId);
export const getGamesByModule = (moduleId: string) =>
  DataService.getGamesByModule(moduleId);
export const getLabsByModule = (moduleId: string) =>
  DataService.getLabsByModule(moduleId);
export const enrollInModule = (moduleId: string) =>
  DataService.enrollInModule(moduleId);
export const unenrollFromModule = (moduleId: string) =>
  DataService.unenrollFromModule(moduleId);
export const getUserEnrollments = () => DataService.getUserEnrollments();
export const getUserProgress = () => DataService.getUserProgress();
export const updateProgress = (moduleId: string, progress: number) =>
  DataService.updateProgress(moduleId, progress);

export default DataService;
