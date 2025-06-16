import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { authenticate, generateToken, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    ),
});

// PUT /api/profile/change-password - Change user password
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return createErrorResponse('Too many password change attempts, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = changePasswordSchema.safeParse(body);
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

    const { currentPassword, newPassword } = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Get user with password field (normally excluded)
    const userWithPassword = await User.findById(user._id).select('+password');
    if (!userWithPassword) {
      return createErrorResponse('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await userWithPassword.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return createErrorResponse('Current password is incorrect', 400);
    }

    // Check if new password is different from current
    const isSamePassword = await userWithPassword.comparePassword(newPassword);
    if (isSamePassword) {
      return createErrorResponse('New password must be different from current password', 400);
    }

    // Update password (will be hashed by pre-save middleware)
    userWithPassword.password = newPassword;
    userWithPassword.security.passwordChangedAt = new Date();
    await userWithPassword.save();

    // Generate new JWT token (invalidates old tokens)
    const token = generateToken(userWithPassword._id.toString());

    return createSuccessResponse(
      {
        user: userWithPassword.toPublicJSON(),
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
      'Password changed successfully'
    );

  } catch (error) {
    console.error('Change password error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}