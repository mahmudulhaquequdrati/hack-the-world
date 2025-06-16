import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { z } from 'zod';

const updateBasicProfileSchema = z.object({
  firstName: z.string().max(50, 'First name cannot exceed 50 characters').trim().optional(),
  lastName: z.string().max(50, 'Last name cannot exceed 50 characters').trim().optional(),
  displayName: z.string().max(100, 'Display name cannot exceed 100 characters').trim().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').trim().optional(),
  location: z.string().max(100, 'Location cannot exceed 100 characters').trim().optional(),
  website: z.string()
    .url('Website must be a valid URL')
    .regex(/^https?:\/\/.+/, 'Website must start with http:// or https://')
    .optional()
    .or(z.literal('')), // Allow empty string to clear website
});

// PUT /api/profile/basic - Update basic profile information
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 20, 15 * 60 * 1000)) { // 20 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = updateBasicProfileSchema.safeParse(body);
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

    const updateData = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Build update object for nested profile fields
    const profileUpdate: Record<string, unknown> = {};
    
    if (updateData.firstName !== undefined) {
      profileUpdate['profile.firstName'] = updateData.firstName || undefined;
    }
    if (updateData.lastName !== undefined) {
      profileUpdate['profile.lastName'] = updateData.lastName || undefined;
    }
    if (updateData.displayName !== undefined) {
      profileUpdate['profile.displayName'] = updateData.displayName || undefined;
    }
    if (updateData.bio !== undefined) {
      profileUpdate['profile.bio'] = updateData.bio || undefined;
    }
    if (updateData.location !== undefined) {
      profileUpdate['profile.location'] = updateData.location || undefined;
    }
    if (updateData.website !== undefined) {
      profileUpdate['profile.website'] = updateData.website || undefined;
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: profileUpdate },
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
      'Profile updated successfully'
    );

  } catch (error) {
    console.error('Update basic profile error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}