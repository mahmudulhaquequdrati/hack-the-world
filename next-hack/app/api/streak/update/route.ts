import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// POST /api/streak/update - Update user's learning streak
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Ensure database connection
    await ensureDBConnection();

    // Get the full user document to update streak
    const userDoc = await User.findById(user._id);
    if (!userDoc) {
      return createErrorResponse('User not found', 404);
    }

    // Calculate streak update
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = userDoc.lastActiveAt ? new Date(userDoc.lastActiveAt) : null;
    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
    }

    let streakUpdated = false;
    let streakAction = 'maintained';
    const previousStreak = userDoc.currentStreak || 0;

    if (!lastActive) {
      // First time or no previous activity
      userDoc.currentStreak = 1;
      userDoc.longestStreak = Math.max(userDoc.longestStreak || 0, 1);
      userDoc.lastActiveAt = new Date();
      streakUpdated = true;
      streakAction = 'started';
    } else if (lastActive.getTime() === today.getTime()) {
      // Already active today, no streak change but update last active time
      userDoc.lastActiveAt = new Date();
      streakAction = 'already_updated';
    } else if (lastActive.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
      // Was active yesterday, extend streak
      userDoc.currentStreak = (userDoc.currentStreak || 0) + 1;
      userDoc.longestStreak = Math.max(userDoc.longestStreak || 0, userDoc.currentStreak);
      userDoc.lastActiveAt = new Date();
      streakUpdated = true;
      streakAction = 'extended';
    } else {
      // Streak broken, start new one
      userDoc.currentStreak = 1;
      userDoc.lastActiveAt = new Date();
      streakUpdated = true;
      streakAction = 'restarted';
    }

    // Save the updated user
    await userDoc.save();

    // Check for streak milestones and achievements
    const milestoneReached = checkStreakMilestone(userDoc.currentStreak, previousStreak);

    return createSuccessResponse(
      {
        currentStreak: userDoc.currentStreak,
        longestStreak: userDoc.longestStreak,
        lastActiveAt: userDoc.lastActiveAt,
        streakUpdated,
        streakAction,
        previousStreak,
        milestoneReached,
        streakLevel: getStreakLevel(userDoc.currentStreak),
        nextMilestone: getNextMilestone(userDoc.currentStreak),
        message: getStreakMessage(streakAction, userDoc.currentStreak, milestoneReached)
      },
      'Streak updated successfully'
    );

  } catch (error) {
    console.error('Update streak error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// Helper functions
function checkStreakMilestone(currentStreak: number, previousStreak: number): { reached: boolean; milestone?: number; description?: string } {
  const milestones = [3, 7, 14, 30, 60, 100, 365];
  
  for (const milestone of milestones) {
    if (currentStreak >= milestone && previousStreak < milestone) {
      return {
        reached: true,
        milestone,
        description: getMilestoneDescription(milestone)
      };
    }
  }
  
  return { reached: false };
}

function getMilestoneDescription(milestone: number): string {
  switch (milestone) {
    case 3: return 'First milestone reached!';
    case 7: return 'One week of consistent learning!';
    case 14: return 'Two weeks strong!';
    case 30: return 'One month of dedication!';
    case 60: return 'Two months of consistency!';
    case 100: return 'Century club member!';
    case 365: return 'One full year of learning!';
    default: return `${milestone} days of awesome learning!`;
  }
}

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

function getStreakMessage(action: string, streak: number, milestone: any): string {
  if (milestone.reached) {
    return `🎉 ${milestone.description} You're now at ${streak} days!`;
  }
  
  switch (action) {
    case 'started':
      return '🎯 Welcome to your learning streak! Day 1 complete!';
    case 'extended':
      return `🔥 Streak extended! You're now at ${streak} days!`;
    case 'restarted':
      return '🚀 Fresh start! Your new streak begins today!';
    case 'already_updated':
      return `✅ Great! You've already learned today. Keep up the ${streak}-day streak!`;
    default:
      return `📚 Learning streak: ${streak} days strong!`;
  }
}