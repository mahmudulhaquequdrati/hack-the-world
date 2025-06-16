import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/profile - Get current user profile
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

    // Update last active (don't wait for it)
    user.updateLastActive().catch(err => 
      console.error('Failed to update last active:', err)
    );

    // Return complete user profile
    return createSuccessResponse(
      { user: user.toPublicJSON() },
      'Profile retrieved successfully'
    );

  } catch (error) {
    console.error('Get profile error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}