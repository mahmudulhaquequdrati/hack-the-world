import { NextRequest } from 'next/server';
import { authenticate, createErrorResponse, createSuccessResponse } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticate(request);

    // Update last active (don't wait for it)
    user.updateLastActive().catch(err => 
      console.error('Failed to update last active:', err)
    );

    // Return user profile
    return createSuccessResponse(
      { user: user.toPublicJSON() },
      'User profile retrieved successfully'
    );

  } catch (error) {
    console.error('Get current user error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}