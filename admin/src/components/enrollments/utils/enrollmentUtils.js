import { progressColors, statusConfigs, progressThresholds } from "../constants/enrollmentConstants";

// Get progress color based on percentage
export const getProgressColor = (percentage) => {
  if (percentage >= progressThresholds.excellent) return progressColors.excellent;
  if (percentage >= progressThresholds.good) return progressColors.good;
  if (percentage >= progressThresholds.average) return progressColors.average;
  if (percentage >= progressThresholds.poor) return progressColors.poor;
  return progressColors.critical;
};

// Get progress icon based on percentage
export const getProgressIcon = (percentage) => {
  if (percentage >= 90) return "🏆";
  if (percentage >= 75) return "🔥";
  if (percentage >= 50) return "📈";
  if (percentage >= 25) return "📊";
  return "🚀";
};

// Get status configuration
export const getStatusConfig = (status) => {
  return statusConfigs[status] || statusConfigs.default;
};

// Calculate progress metrics
export const getProgressMetrics = (enrollment) => {
  const totalSections = enrollment.moduleId?.sections?.length || 0;
  const progressPercentage = enrollment.progressPercentage || 0;
  const completed = Math.round((progressPercentage / 100) * totalSections);
  const remaining = totalSections - completed;
  
  // Estimate time spent (mock calculation)
  const timeSpent = Math.round(progressPercentage * 2.4); // ~2.4 minutes per percent
  
  return {
    percentage: progressPercentage,
    total: totalSections,
    completed,
    remaining,
    timeSpent,
  };
};

// Calculate progress trend
export const getProgressTrend = (enrollment) => {
  const enrolledDate = new Date(enrollment.enrolledAt);
  const currentDate = new Date();
  const daysSinceEnrollment = Math.ceil(
    (currentDate - enrolledDate) / (1000 * 60 * 60 * 24)
  );
  
  const progress = enrollment.progressPercentage || 0;
  
  // Expected progress: 5% per day (adjust as needed)
  const expectedProgress = Math.min(daysSinceEnrollment * 5, 100);
  
  if (progress > expectedProgress + 10)
    return { trend: "up", icon: "📈", text: "Above Average", color: "green" };
  if (progress < expectedProgress - 10)
    return { trend: "down", icon: "📉", text: "Below Average", color: "red" };
  return { trend: "stable", icon: "➡️", text: "On Track", color: "yellow" };
};

// Format time duration
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

// Format date
export const formatDate = (date) => {
  if (!date) return "Never";
  const now = new Date();
  const targetDate = new Date(date);
  const diffTime = now - targetDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// Calculate completion rate
export const calculateCompletionRate = (enrollments) => {
  if (!enrollments.length) return 0;
  const completed = enrollments.filter(e => e.status === "completed").length;
  return Math.round((completed / enrollments.length) * 100);
};

// Sort enrollments
export const sortEnrollments = (enrollments, sortBy, sortOrder = "asc") => {
  const sorted = [...enrollments].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "progress":
        aValue = a.progressPercentage || 0;
        bValue = b.progressPercentage || 0;
        break;
      case "enrolledAt":
        aValue = new Date(a.enrolledAt);
        bValue = new Date(b.enrolledAt);
        break;
      case "lastAccessed":
        aValue = new Date(a.lastAccessedAt || a.enrolledAt);
        bValue = new Date(b.lastAccessedAt || b.enrolledAt);
        break;
      case "username":
        aValue = a.userId?.username || "";
        bValue = b.userId?.username || "";
        break;
      case "module":
        aValue = a.moduleId?.title || "";
        bValue = b.moduleId?.title || "";
        break;
      case "status":
        aValue = a.status || "";
        bValue = b.status || "";
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

// Filter enrollments
export const filterEnrollments = (enrollments, filters) => {
  return enrollments.filter(enrollment => {
    // Status filter
    if (filters.status && enrollment.status !== filters.status) {
      return false;
    }
    
    // Module filter
    if (filters.moduleId && enrollment.moduleId?.id !== filters.moduleId) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const username = enrollment.userId?.username?.toLowerCase() || "";
      const email = enrollment.userId?.email?.toLowerCase() || "";
      const moduleTitle = enrollment.moduleId?.title?.toLowerCase() || "";
      
      if (!username.includes(searchTerm) && 
          !email.includes(searchTerm) && 
          !moduleTitle.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
};

// Paginate enrollments
export const paginateEnrollments = (enrollments, page = 1, limit = 20) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: enrollments.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: enrollments.length,
      totalPages: Math.ceil(enrollments.length / limit),
      hasNext: endIndex < enrollments.length,
      hasPrev: page > 1,
    }
  };
};