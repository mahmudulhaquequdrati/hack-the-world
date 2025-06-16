import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { forgotPasswordSchema } from '@/lib/validators/auth';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import EmailService from '@/lib/utils/email';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return createErrorResponse('Too many password reset attempts, please try again later', 429);
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
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

    const { email } = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Find user by email (for security, always return success regardless of whether user exists)
    const user = await User.findOne({ email });

    if (user) {
      // Generate reset token
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      // Send password reset email
      try {
        await EmailService.sendPasswordResetEmail(email, resetToken, user.username);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Continue without throwing error to avoid exposing user existence
      }
    }

    // Always return success for security (don't reveal if email exists)
    return createSuccessResponse(
      null,
      'If an account with that email exists, we have sent password reset instructions'
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}