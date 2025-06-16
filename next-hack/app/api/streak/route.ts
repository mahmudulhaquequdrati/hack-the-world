import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/streak - Get user's current streak status
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Ensure database connection
    await ensureDBConnection();

    // Get current streak information
    const currentStreak = user.currentStreak || 0;
    const longestStreak = user.longestStreak || 0;
    const lastActiveAt = user.lastActiveAt;

    // Calculate streak status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = lastActiveAt ? new Date(lastActiveAt) : null;
    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
    }

    let streakStatus: string;
    let isAtRisk = false;
    let daysUntilRisk = 0;

    if (!lastActive) {
      streakStatus = 'start';
    } else if (lastActive.getTime() === today.getTime()) {
      // User was active today
      streakStatus = 'active';
      daysUntilRisk = 1; // Will be at risk tomorrow if no activity
    } else if (lastActive.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
      // User was active yesterday, at risk of losing streak
      streakStatus = 'at_risk';
      isAtRisk = true;
      daysUntilRisk = 0;
    } else {
      // Streak is broken
      streakStatus = 'broken';
    }

    return createSuccessResponse(
      {
        currentStreak,
        longestStreak,
        lastActiveAt,
        streakStatus,
        isAtRisk,
        daysUntilRisk,
        streakLevel: getStreakLevel(currentStreak),
        nextMilestone: getNextMilestone(currentStreak)
      },
      'Streak status retrieved successfully'
    );

  } catch (error) {
    console.error('Get streak status error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// Helper function to determine streak level
function getStreakLevel(streak: number): string {
  if (streak >= 365) return 'Master';
  if (streak >= 100) return 'Expert';
  if (streak >= 30) return 'Advanced';
  if (streak >= 7) return 'Intermediate';
  if (streak >= 3) return 'Beginner';
  return 'Starter';
}

// Helper function to get next milestone
function getNextMilestone(streak: number): { target: number; description: string } {
  if (streak < 3) return { target: 3, description: 'First milestone - 3 days' };
  if (streak < 7) return { target: 7, description: 'One week streak' };
  if (streak < 14) return { target: 14, description: 'Two week streak' };
  if (streak < 30) return { target: 30, description: 'One month streak' };
  if (streak < 60) return { target: 60, description: 'Two month streak' };
  if (streak < 100) return { target: 100, description: 'Century mark' };
  if (streak < 365) return { target: 365, description: 'One year streak' };
  return { target: streak + 100, description: 'Next century mark' };
}