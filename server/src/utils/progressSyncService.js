/**
 * Progress Synchronization Service
 * 
 * Handles automatic synchronization between UserProgress (content-level)
 * and UserEnrollment (module-level) progress tracking.
 * 
 * This service ensures that module-level progress accurately reflects
 * the completion status of individual content items within the module.
 */

const UserProgress = require("../models/UserProgress");
const UserEnrollment = require("../models/UserEnrollment");
const Content = require("../models/Content");
const Module = require("../models/Module");

class ProgressSyncService {
  /**
   * Calculate detailed progress statistics for a user's enrollment in a module
   * @param {string} userId - User ID
   * @param {string} moduleId - Module ID
   * @returns {Promise<Object>} Progress statistics
   */
  static async calculateModuleProgress(userId, moduleId) {
    try {
      // Get all active content for the module with improved filtering
      const moduleContent = await Content.find({ 
        moduleId, 
        isActive: true,
        $or: [
          { isDeleted: { $exists: false } },
          { isDeleted: false }
        ]
      }).select('_id type section duration title').lean();

      if (moduleContent.length === 0) {
        return {
          totalSections: 0,
          completedSections: 0,
          progressPercentage: 0,
          contentTypeProgress: {
            video: { completed: 0, total: 0 },
            lab: { completed: 0, total: 0 },
            game: { completed: 0, total: 0 },
            document: { completed: 0, total: 0 }
          },
          detailedProgress: []
        };
      }

      const contentIds = moduleContent.map(content => content._id);

      // Get user progress for all content in the module
      const userProgressData = await UserProgress.find({
        userId,
        contentId: { $in: contentIds }
      }).select('contentId status progressPercentage score maxScore').lean();

      // Create a map for quick lookup
      const progressMap = new Map();
      userProgressData.forEach(progress => {
        progressMap.set(progress.contentId.toString(), progress);
      });

      // Calculate progress statistics
      let completedCount = 0;
      const contentTypeStats = {
        video: { completed: 0, total: 0 },
        lab: { completed: 0, total: 0 },
        game: { completed: 0, total: 0 },
        document: { completed: 0, total: 0 }
      };
      
      const detailedProgress = [];

      moduleContent.forEach(content => {
        const contentId = content._id.toString();
        const progress = progressMap.get(contentId);
        const contentType = content.type || 'document';
        
        // Initialize content type if not exists
        if (!contentTypeStats[contentType]) {
          contentTypeStats[contentType] = { completed: 0, total: 0 };
        }
        
        contentTypeStats[contentType].total++;
        
        // Standardized completion logic: use status as primary check
        const isCompleted = progress && progress.status === 'completed';
        
        if (isCompleted) {
          completedCount++;
          contentTypeStats[contentType].completed++;
        }

        detailedProgress.push({
          contentId,
          type: contentType,
          section: content.section,
          title: content.title, // Include content title
          status: progress?.status || 'not-started',
          progressPercentage: progress?.progressPercentage || 0,
          score: progress?.score || null,
          maxScore: progress?.maxScore || null,
          duration: content.duration || 15, // Include content duration
          isCompleted
        });
      });

      const totalSections = moduleContent.length;
      const progressPercentage = totalSections > 0 
        ? Math.round((completedCount / totalSections) * 100) 
        : 0;

      return {
        totalSections,
        completedSections: completedCount,
        progressPercentage,
        contentTypeProgress: contentTypeStats,
        detailedProgress
      };
    } catch (error) {
      console.error('Error calculating module progress:', error);
      throw error;
    }
  }

  /**
   * Calculate detailed progress statistics for a user's enrollment in a module (Atomic version)
   * @param {string} userId - User ID
   * @param {string} moduleId - Module ID
   * @param {Object} session - Database session for transaction
   * @returns {Promise<Object>} Progress statistics
   */
  static async calculateModuleProgressAtomic(userId, moduleId, session) {
    try {
      // Get all active content for the module with improved filtering
      const moduleContent = await Content.find({ 
        moduleId, 
        isActive: true,
        $or: [
          { isDeleted: { $exists: false } },
          { isDeleted: false }
        ]
      }).select('_id type section duration title').lean().session(session);

      if (moduleContent.length === 0) {
        return {
          totalSections: 0,
          completedSections: 0,
          progressPercentage: 0,
          contentTypeProgress: {
            video: { completed: 0, total: 0 },
            lab: { completed: 0, total: 0 },
            game: { completed: 0, total: 0 },
            document: { completed: 0, total: 0 }
          },
          detailedProgress: []
        };
      }

      const contentIds = moduleContent.map(content => content._id);

      // Get user progress for all content in the module
      const userProgressData = await UserProgress.find({
        userId,
        contentId: { $in: contentIds }
      }).select('contentId status progressPercentage score maxScore').lean().session(session);

      // Create a map for quick lookup
      const progressMap = new Map();
      userProgressData.forEach(progress => {
        progressMap.set(progress.contentId.toString(), progress);
      });

      // Calculate progress statistics
      let completedCount = 0;
      const contentTypeStats = {
        video: { completed: 0, total: 0 },
        lab: { completed: 0, total: 0 },
        game: { completed: 0, total: 0 },
        document: { completed: 0, total: 0 }
      };
      
      const detailedProgress = [];

      moduleContent.forEach(content => {
        const contentId = content._id.toString();
        const progress = progressMap.get(contentId);
        const contentType = content.type || 'document';
        
        // Initialize content type if not exists
        if (!contentTypeStats[contentType]) {
          contentTypeStats[contentType] = { completed: 0, total: 0 };
        }
        
        contentTypeStats[contentType].total++;
        
        // Standardized completion logic: use status as primary check
        const isCompleted = progress && progress.status === 'completed';
        
        if (isCompleted) {
          completedCount++;
          contentTypeStats[contentType].completed++;
        }

        detailedProgress.push({
          contentId,
          type: contentType,
          section: content.section,
          title: content.title, // Include content title
          status: progress?.status || 'not-started',
          progressPercentage: progress?.progressPercentage || 0,
          score: progress?.score || null,
          maxScore: progress?.maxScore || null,
          duration: content.duration || 15, // Include content duration
          isCompleted
        });
      });

      const totalSections = moduleContent.length;
      const progressPercentage = totalSections > 0 
        ? Math.round((completedCount / totalSections) * 100) 
        : 0;

      return {
        totalSections,
        completedSections: completedCount,
        progressPercentage,
        contentTypeProgress: contentTypeStats,
        detailedProgress
      };
    } catch (error) {
      console.error('Error calculating module progress (atomic):', error);
      throw error;
    }
  }

  /**
   * Sync UserEnrollment progress based on UserProgress data
   * @param {string} userId - User ID
   * @param {string} moduleId - Module ID
   * @returns {Promise<Object>} Updated enrollment
   */
  static async syncEnrollmentProgress(userId, moduleId) {
    try {
      // Find the enrollment
      const enrollment = await UserEnrollment.findOne({ userId, moduleId });
      if (!enrollment) {
        console.warn(`No enrollment found for user ${userId} in module ${moduleId}`);
        return null;
      }

      // Calculate current progress
      const progressStats = await this.calculateModuleProgress(userId, moduleId);

      // Update enrollment with calculated progress
      enrollment.totalSections = progressStats.totalSections;
      enrollment.completedSections = progressStats.completedSections;
      enrollment.progressPercentage = progressStats.progressPercentage;

      // Auto-complete if all sections are done
      if (progressStats.progressPercentage === 100 && enrollment.status === 'active') {
        enrollment.status = 'completed';
      }

      // Update last accessed time
      enrollment.lastAccessedAt = new Date();

      await enrollment.save();

      console.log(`Synced progress for user ${userId} in module ${moduleId}: ${progressStats.progressPercentage}%`);
      
      return enrollment;
    } catch (error) {
      console.error('Error syncing enrollment progress:', error);
      throw error;
    }
  }

  /**
   * Atomic sync UserEnrollment progress with database transaction
   * @param {string} userId - User ID
   * @param {string} moduleId - Module ID
   * @param {Object} session - Database session for transaction
   * @returns {Promise<Object>} Updated enrollment
   */
  static async syncEnrollmentProgressAtomic(userId, moduleId, session) {
    try {
      // Find the enrollment within the session
      const enrollment = await UserEnrollment.findOne({ userId, moduleId }).session(session);
      if (!enrollment) {
        console.warn(`No enrollment found for user ${userId} in module ${moduleId}`);
        return null;
      }

      // Calculate current progress with session-aware queries
      const progressStats = await this.calculateModuleProgressAtomic(userId, moduleId, session);

      // Validate progress data consistency
      if (progressStats.totalSections < 0 || progressStats.completedSections < 0) {
        throw new Error('Invalid progress data: negative section counts');
      }

      if (progressStats.completedSections > progressStats.totalSections) {
        console.warn(`Completed sections (${progressStats.completedSections}) exceeds total sections (${progressStats.totalSections}) for user ${userId} module ${moduleId}`);
        progressStats.completedSections = progressStats.totalSections;
        progressStats.progressPercentage = 100;
      }

      // Update enrollment with calculated progress
      enrollment.totalSections = progressStats.totalSections;
      enrollment.completedSections = progressStats.completedSections;
      enrollment.progressPercentage = progressStats.progressPercentage;

      // Auto-complete if all sections are done and currently active
      if (progressStats.progressPercentage === 100 && enrollment.status === 'active') {
        enrollment.status = 'completed';
      }

      // Update last accessed time
      enrollment.lastAccessedAt = new Date();

      await enrollment.save({ session });

      console.log(`Atomically synced progress for user ${userId} in module ${moduleId}: ${progressStats.progressPercentage}%`);
      
      return enrollment;
    } catch (error) {
      console.error('Error in atomic enrollment progress sync:', error);
      throw error;
    }
  }

  /**
   * Sync progress for all of a user's enrollments
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Updated enrollments
   */
  static async syncUserEnrollments(userId) {
    try {
      const enrollments = await UserEnrollment.find({ userId }).select('moduleId');
      const syncPromises = enrollments.map(enrollment => 
        this.syncEnrollmentProgress(userId, enrollment.moduleId)
      );
      
      const results = await Promise.allSettled(syncPromises);
      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');

      if (failed.length > 0) {
        console.warn(`Failed to sync ${failed.length} enrollments for user ${userId}`);
        failed.forEach(failure => console.error(failure.reason));
      }

      console.log(`Successfully synced ${successful.length} enrollments for user ${userId}`);
      return successful.map(result => result.value);
    } catch (error) {
      console.error('Error syncing user enrollments:', error);
      throw error;
    }
  }

  /**
   * Sync progress for all enrollments in a specific module
   * @param {string} moduleId - Module ID
   * @returns {Promise<Array>} Updated enrollments
   */
  static async syncModuleEnrollments(moduleId) {
    try {
      const enrollments = await UserEnrollment.find({ moduleId }).select('userId');
      const syncPromises = enrollments.map(enrollment => 
        this.syncEnrollmentProgress(enrollment.userId, moduleId)
      );
      
      const results = await Promise.allSettled(syncPromises);
      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');

      if (failed.length > 0) {
        console.warn(`Failed to sync ${failed.length} enrollments for module ${moduleId}`);
        failed.forEach(failure => console.error(failure.reason));
      }

      console.log(`Successfully synced ${successful.length} enrollments for module ${moduleId}`);
      return successful.map(result => result.value);
    } catch (error) {
      console.error('Error syncing module enrollments:', error);
      throw error;
    }
  }

  /**
   * Update totalSections for all enrollments when module content changes
   * @param {string} moduleId - Module ID
   * @returns {Promise<number>} Number of updated enrollments
   */
  static async updateModuleSectionCounts(moduleId) {
    try {
      // Get current active content count
      const contentCount = await Content.countDocuments({ 
        moduleId, 
        isActive: true 
      });

      // Update all enrollments for this module
      const result = await UserEnrollment.updateMany(
        { moduleId },
        { 
          $set: { totalSections: contentCount },
          $currentDate: { lastAccessedAt: true }
        }
      );

      console.log(`Updated totalSections to ${contentCount} for ${result.modifiedCount} enrollments in module ${moduleId}`);
      
      // Trigger progress recalculation for all enrollments in this module
      await this.syncModuleEnrollments(moduleId);
      
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating module section counts:', error);
      throw error;
    }
  }

  /**
   * Get enhanced enrollment data with detailed progress breakdown
   * @param {string} userId - User ID
   * @param {string} moduleId - Module ID
   * @returns {Promise<Object>} Enhanced enrollment data
   */
  static async getEnhancedEnrollmentData(userId, moduleId) {
    try {
      const enrollment = await UserEnrollment.findOne({ userId, moduleId })
        .populate('moduleId', 'title description difficulty duration')
        .lean();

      if (!enrollment) {
        return null;
      }

      const progressStats = await this.calculateModuleProgress(userId, moduleId);

      return {
        ...enrollment,
        enhancedProgress: progressStats
      };
    } catch (error) {
      console.error('Error getting enhanced enrollment data:', error);
      throw error;
    }
  }

  /**
   * Bulk recalculate progress for all enrollments (useful for migrations)
   * @param {Object} options - Options for bulk recalculation
   * @param {number} options.batchSize - Number of enrollments to process at once
   * @param {boolean} options.dryRun - Whether to actually update the database
   * @returns {Promise<Object>} Recalculation results
   */
  static async bulkRecalculateProgress(options = {}) {
    const { batchSize = 100, dryRun = false } = options;
    
    try {
      console.log(`Starting bulk progress recalculation${dryRun ? ' (DRY RUN)' : ''}...`);
      
      const totalEnrollments = await UserEnrollment.countDocuments();
      let processed = 0;
      let updated = 0;
      let errors = 0;

      // Process in batches to avoid memory issues
      for (let skip = 0; skip < totalEnrollments; skip += batchSize) {
        const enrollments = await UserEnrollment.find({})
          .select('userId moduleId')
          .skip(skip)
          .limit(batchSize)
          .lean();

        console.log(`Processing batch ${Math.floor(skip / batchSize) + 1}, enrollments ${skip + 1}-${Math.min(skip + batchSize, totalEnrollments)}`);

        for (const enrollment of enrollments) {
          try {
            if (!dryRun) {
              await this.syncEnrollmentProgress(enrollment.userId, enrollment.moduleId);
              updated++;
            }
            processed++;
          } catch (error) {
            console.error(`Error processing enrollment ${enrollment._id}:`, error);
            errors++;
          }
        }
      }

      const results = {
        totalEnrollments,
        processed,
        updated: dryRun ? 0 : updated,
        errors,
        dryRun
      };

      console.log('Bulk recalculation completed:', results);
      return results;
    } catch (error) {
      console.error('Error in bulk recalculation:', error);
      throw error;
    }
  }
}

module.exports = ProgressSyncService;