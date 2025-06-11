// Progress tracking service utilities
export class ProgressService {
  private static lastReportedProgress = new Map<string, number>();

  /**
   * Check if we should update progress based on last reported value
   */
  static shouldUpdateProgress(
    contentId: string,
    progressPercentage: number,
    threshold = 5
  ): boolean {
    const lastReported = this.lastReportedProgress.get(contentId) || 0;
    return Math.abs(progressPercentage - lastReported) >= threshold;
  }

  /**
   * Track that progress was reported for a content item
   */
  static markProgressReported(contentId: string, progressPercentage: number) {
    this.lastReportedProgress.set(contentId, progressPercentage);
  }

  /**
   * Calculate video progress percentage
   */
  static calculateVideoProgress(currentTime: number, duration: number): number {
    if (duration <= 0) return 0;
    return Math.floor((currentTime / duration) * 100);
  }

  /**
   * Check if video progress should trigger an update (every 10%)
   */
  static shouldReportVideoProgress(
    progressPercentage: number,
    contentId: string
  ): boolean {
    return (
      progressPercentage % 10 === 0 &&
      this.shouldUpdateProgress(contentId, progressPercentage, 8)
    );
  }

  /**
   * Check if video should auto-complete (at 90%)
   */
  static shouldAutoCompleteVideo(progressPercentage: number): boolean {
    return progressPercentage >= 90;
  }

  /**
   * Format time for display
   */
  static formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  /**
   * Get progress status color based on completion
   */
  static getProgressColor(status: string): string {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "in-progress":
        return "text-yellow-400";
      case "not-started":
      default:
        return "text-gray-400";
    }
  }

  /**
   * Get progress icon based on status
   */
  static getProgressIcon(status: string): string {
    switch (status) {
      case "completed":
        return "✓";
      case "in-progress":
        return "●";
      case "not-started":
      default:
        return "○";
    }
  }

  /**
   * Calculate overall completion percentage
   */
  static calculateCompletionPercentage(
    completed: number,
    total: number
  ): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  /**
   * Reset cached progress tracking data
   */
  static resetCache() {
    this.lastReportedProgress.clear();
  }

  /**
   * Extract MongoDB content ID from a content item
   */
  static getContentId(item: Record<string, unknown>): string {
    // Try different possible ID fields in order of preference
    if (item.id && typeof item.id === "string") return item.id;
    if (item.contentId && typeof item.contentId === "string")
      return item.contentId;
    return "";
  }
}

export default ProgressService;
