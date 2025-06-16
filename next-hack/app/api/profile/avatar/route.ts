import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { z } from 'zod';

const updateAvatarSchema = z.object({
  avatar: z.string()
    .url('Avatar must be a valid URL')
    .min(1, 'Avatar URL is required'),
});

// PUT /api/profile/avatar - Update user avatar
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 15 * 60 * 1000)) { // 10 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = updateAvatarSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      );
    }

    const { avatar } = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { 
        $set: { 'profile.avatar': avatar }
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedUser) {
      return createErrorResponse('User not found', 404);
    }

    return createSuccessResponse(
      { user: updatedUser.toPublicJSON() },
      'Avatar updated successfully'
    );

  } catch (error) {
    console.error('Update avatar error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}