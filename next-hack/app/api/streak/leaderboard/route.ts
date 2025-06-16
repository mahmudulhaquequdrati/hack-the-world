import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/streak/leaderboard - Get streak leaderboard
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Max 100
    const type = searchParams.get('type') || 'current'; // 'current' or 'longest'

    // Determine which streak field to sort by
    const sortField = type === 'longest' ? 'longestStreak' : 'currentStreak';

    // Get leaderboard with user data
    const leaderboard = await User.aggregate([
      {
        $match: {
          [sortField]: { $gt: 0 }, // Only users with streaks > 0
          role: 'student' // Only include students in leaderboard
        }
      },
      {
        $project: {
          username: 1,
          'profile.firstName': 1,
          'profile.lastName': 1,
          'profile.avatar': 1,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveAt: 1,
          'stats.totalCompletedContent': 1,
          'stats.totalCompletedModules': 1
        }
      },
      {
        $sort: { [sortField]: -1, lastActiveAt: -1 } // Sort by streak, then by recent activity
      },
      {
        $limit: limit
      },
      {
        $addFields: {
          rank: { $add: [{ $indexOfArray: [{ $range: [1, limit + 1] }, '$_id'] }, 1] },
          displayName: {
            $cond: {
              if: { $and: [{ $ne: ['$profile.firstName', null] }, { $ne: ['$profile.firstName', ''] }] },
              then: {
                $concat: [
                  '$profile.firstName',
                  { $cond: { if: { $ne: ['$profile.lastName', null] }, then: { $concat: [' ', '$profile.lastName'] }, else: '' } }
                ]
              },
              else: '$username'
            }
          },
          streakLevel: {
            $switch: {
              branches: [
                { case: { $gte: [`$${sortField}`, 365] }, then: 'Master' },
                { case: { $gte: [`$${sortField}`, 100] }, then: 'Expert' },
                { case: { $gte: [`$${sortField}`, 30] }, then: 'Advanced' },
                { case: { $gte: [`$${sortField}`, 7] }, then: 'Intermediate' },
                { case: { $gte: [`$${sortField}`, 3] }, then: 'Beginner' }
              ],
              default: 'Starter'
            }
          },
          streakBadge: {
            $switch: {
              branches: [
                { case: { $gte: [`$${sortField}`, 365] }, then: '👑' },
                { case: { $gte: [`$${sortField}`, 100] }, then: '💎' },
                { case: { $gte: [`$${sortField}`, 30] }, then: '🏆' },
                { case: { $gte: [`$${sortField}`, 14] }, then: '⭐' },
                { case: { $gte: [`$${sortField}`, 7] }, then: '🔥' },
                { case: { $gte: [`$${sortField}`, 3] }, then: '🌟' },
                { case: { $gte: [`$${sortField}`, 1] }, then: '✨' }
              ],
              default: '🎯'
            }
          },
          isActiveToday: {
            $gte: [
              '$lastActiveAt',
              {
                $dateFromString: {
                  dateString: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: new Date()
                    }
                  }
                }
              }
            ]
          }
        }
      }
    ]);

    // Add manual ranking since $indexOfArray doesn't work as expected
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    // Get statistics
    const stats = await User.aggregate([
      {
        $match: {
          role: 'student',
          [sortField]: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          avgStreak: { $avg: `$${sortField}` },
          maxStreak: { $max: `$${sortField}` },
          activeToday: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$lastActiveAt',
                    {
                      $dateFromString: {
                        dateString: {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: new Date()
                          }
                        }
                      }
                    }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const leaderboardStats = stats[0] || {
      totalUsers: 0,
      avgStreak: 0,
      maxStreak: 0,
      activeToday: 0
    };

    return createSuccessResponse(
      {
        leaderboard: rankedLeaderboard,
        type,
        stats: {
          ...leaderboardStats,
          avgStreak: Math.round(leaderboardStats.avgStreak * 10) / 10, // Round to 1 decimal
          displayedUsers: rankedLeaderboard.length,
          totalEligibleUsers: leaderboardStats.totalUsers
        },
        metadata: {
          generatedAt: new Date(),
          sortBy: sortField,
          maxResults: limit
        }
      },
      `${type === 'longest' ? 'Longest' : 'Current'} streak leaderboard retrieved successfully`
    );

  } catch (error) {
    console.error('Get streak leaderboard error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}