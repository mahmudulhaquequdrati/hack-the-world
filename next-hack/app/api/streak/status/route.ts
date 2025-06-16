import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/streak/status - Get user's streak status (alias for /api/streak)
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

    // Get current streak information from user document
    const currentStreak = user.stats.currentStreak || 0;
    const longestStreak = user.stats.longestStreak || 0;
    const lastActiveAt = user.stats.lastActivityDate;

    // Calculate detailed streak status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = lastActiveAt ? new Date(lastActiveAt) : null;
    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
    }

    let streakStatus: string;
    let statusMessage: string;
    let isAtRisk = false;
    let daysUntilRisk = 0;
    let canExtendToday = false;

    if (!lastActive) {
      streakStatus = 'start';
      statusMessage = 'Start your learning streak today!';
      canExtendToday = true;
    } else if (lastActive.getTime() === today.getTime()) {
      // User was active today
      streakStatus = 'active';
      statusMessage = `Great! You've maintained your ${currentStreak}-day streak today.`;
      daysUntilRisk = 1;
      canExtendToday = false; // Already extended today
    } else if (lastActive.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
      // User was active yesterday, at risk of losing streak
      streakStatus = 'at_risk';
      statusMessage = `Your ${currentStreak}-day streak is at risk! Learn something today to keep it going.`;
      isAtRisk = true;
      daysUntilRisk = 0;
      canExtendToday = true;
    } else {
      // Streak is broken
      streakStatus = 'broken';
      statusMessage = 'Your streak has ended. Start a new one today!';
      canExtendToday = true;
    }

    // Calculate progress to next milestone
    const nextMilestone = getNextMilestone(currentStreak);
    const progressToMilestone = currentStreak > 0 
      ? Math.min(100, (currentStreak / nextMilestone.target) * 100)
      : 0;

    return createSuccessResponse(
      {
        currentStreak,
        longestStreak,
        lastActiveAt,
        streakStatus,
        statusMessage,
        isAtRisk,
        daysUntilRisk,
        canExtendToday,
        streakLevel: getStreakLevel(currentStreak),
        nextMilestone,
        progressToMilestone: Math.round(progressToMilestone),
        streakBadge: getStreakBadge(currentStreak),
        encouragement: getEncouragement(streakStatus, currentStreak)
      },
      'Detailed streak status retrieved successfully'
    );

  } catch (error) {
    console.error('Get detailed streak status error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// Helper functions
function getStreakLevel(streak: number): string {
  if (streak >= 365) return 'Master';
  if (streak >= 100) return 'Expert';
  if (streak >= 30) return 'Advanced';
  if (streak >= 7) return 'Intermediate';
  if (streak >= 3) return 'Beginner';
  return 'Starter';
}

function getNextMilestone(streak: number): { target: number; description: string } {
  if (streak < 3) return { target: 3, description: 'First milestone - 3 days' };
  if (streak < 7) return { target: 7, description: 'One week streak' };
  if (streak < 14) return { target: 14, description: 'Two week streak' };
  if (streak < 30) return { target: 30, description: 'One month streak' };
  if (streak < 60) return { target: 60, description: 'Two month streak' };
  if (streak < 100) return { target: 100, description: 'Century mark' };
  if (streak < 365) return { target: 365, description: 'One year streak' };
  return { target: Math.ceil((streak + 1) / 100) * 100, description: 'Next century mark' };
}

function getStreakBadge(streak: number): string {
  if (streak >= 365) return '👑'; // Crown for year+
  if (streak >= 100) return '💎'; // Diamond for 100+
  if (streak >= 30) return '🏆'; // Trophy for 30+
  if (streak >= 14) return '⭐'; // Star for 2 weeks+
  if (streak >= 7) return '🔥'; // Fire for 1 week+
  if (streak >= 3) return '🌟'; // Sparkle for 3+
  if (streak >= 1) return '✨'; // Sparkles for 1+
  return '🎯'; // Target for starting
}

function getEncouragement(status: string, streak: number): string {
  switch (status) {
    case 'active':
      if (streak >= 30) return "You're on fire! Keep this amazing momentum going!";
      if (streak >= 7) return "Fantastic work! You're building a strong learning habit!";
      if (streak >= 3) return "Great job! You're developing consistency!";
      return "Nice work today! Keep it up!";
    
    case 'at_risk':
      if (streak >= 30) return "Don't let this amazing streak slip away! You've got this!";
      if (streak >= 7) return "You've worked hard for this streak - keep it alive!";
      return "Quick! Save your streak with just a few minutes of learning!";
    
    case 'broken':
      return "Every expert was once a beginner. Start your comeback today!";
    
    case 'start':
      return "Today is the perfect day to start your learning journey!";
    
    default:
      return "Keep learning, keep growing!";
  }
}