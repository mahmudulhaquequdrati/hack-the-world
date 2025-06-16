import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import Module from '@/lib/models/Module';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    moduleId: string;
  };
}

// GET /api/enrollments/admin/stats/[moduleId] - Get enrollment statistics for specific module (Admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate and require admin role
    const user = await authenticate(request);
    requireAdmin(user);

    // Validate module ID
    const idValidation = objectIdSchema.safeParse(params.moduleId);
    if (!idValidation.success) {
      return createErrorResponse('Invalid module ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Check if module exists
    const moduleData = await Module.findById(params.moduleId);
    if (!moduleData) {
      return createErrorResponse('Module not found', 404);
    }

    // Get enrollment statistics
    const enrollmentStats = await UserEnrollment.aggregate([
      { $match: { moduleId: params.moduleId, isActive: true } },
      {
        $group: {
          _id: null,
          totalEnrollments: { $sum: 1 },
          activeEnrollments: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          completedEnrollments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pausedEnrollments: {
            $sum: { $cond: [{ $eq: ['$status', 'paused'] }, 1, 0] }
          },
          averageProgress: { $avg: '$progressPercentage' },
          totalProgressSum: { $sum: '$progressPercentage' }
        }
      }
    ]);

    // Get progress distribution
    const progressDistribution = await UserEnrollment.aggregate([
      { $match: { moduleId: params.moduleId, isActive: true } },
      {
        $bucket: {
          groupBy: '$progressPercentage',
          boundaries: [0, 25, 50, 75, 90, 100],
          default: 'other',
          output: {
            count: { $sum: 1 },
            users: { $push: '$user' }
          }
        }
      }
    ]);

    // Get recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEnrollments = await UserEnrollment.aggregate([
      { 
        $match: { 
          moduleId: params.moduleId, 
          isActive: true,
          enrolledAt: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$enrolledAt' },
            month: { $month: '$enrolledAt' },
            day: { $dayOfMonth: '$enrolledAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get completion rate over time
    const completionRate = await UserEnrollment.aggregate([
      { $match: { moduleId: params.moduleId, isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$enrolledAt' },
            month: { $month: '$enrolledAt' }
          },
          totalEnrollments: { $sum: 1 },
          completedEnrollments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $eq: ['$totalEnrollments', 0] },
              0,
              { $multiply: [{ $divide: ['$completedEnrollments', '$totalEnrollments'] }, 100] }
            ]
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format statistics
    const stats = enrollmentStats[0] || {
      totalEnrollments: 0,
      activeEnrollments: 0,
      completedEnrollments: 0,
      pausedEnrollments: 0,
      averageProgress: 0,
      totalProgressSum: 0
    };

    // Calculate completion rate
    const overallCompletionRate = stats.totalEnrollments > 0 
      ? (stats.completedEnrollments / stats.totalEnrollments) * 100 
      : 0;

    return createSuccessResponse(
      {
        module: {
          id: moduleData._id,
          title: moduleData.title,
          description: moduleData.description
        },
        statistics: {
          enrollments: {
            total: stats.totalEnrollments,
            active: stats.activeEnrollments,
            completed: stats.completedEnrollments,
            paused: stats.pausedEnrollments
          },
          progress: {
            average: Math.round(stats.averageProgress * 100) / 100,
            distribution: progressDistribution
          },
          rates: {
            completion: Math.round(overallCompletionRate * 100) / 100,
            active: stats.totalEnrollments > 0 
              ? Math.round((stats.activeEnrollments / stats.totalEnrollments) * 100 * 100) / 100 
              : 0
          }
        },
        trends: {
          recentEnrollments,
          completionRate
        },
        generatedAt: new Date()
      },
      'Module enrollment statistics retrieved successfully'
    );

  } catch (error) {
    console.error('Get module enrollment statistics error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('token') || error.message.includes('authorization')) {
        return createErrorResponse(error.message, 401);
      }
      if (error.message.includes('admin')) {
        return createErrorResponse(error.message, 403);
      }
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}