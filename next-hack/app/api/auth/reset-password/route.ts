import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { resetPasswordSchema } from '@/lib/validators/auth';
import { generateToken, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
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
    const validationResult = resetPasswordSchema.safeParse(body);
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

    const { token, password } = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Hash the token to compare with stored version
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      'security.passwordResetToken': hashedToken,
      'security.passwordResetExpires': { $gt: Date.now() },
    }).select('+security.passwordResetToken +security.passwordResetExpires');

    if (!user) {
      return createErrorResponse('Invalid or expired password reset token', 400);
    }

    // Set new password (will be hashed by pre-save middleware)
    user.password = password;
    user.security.passwordChangedAt = new Date();
    
    // Clear reset token fields
    user.security.passwordResetToken = undefined;
    user.security.passwordResetExpires = undefined;
    
    // Reset login attempts if any
    user.security.loginAttempts = 0;
    user.security.lockUntil = undefined;
    
    await user.save();

    // Generate new JWT token for immediate login
    const jwtToken = generateToken(user._id.toString());

    // Send confirmation email (don't wait for it)
    EmailService.sendPasswordResetConfirmationEmail(user.email, user.username).catch(err => 
      console.error('Failed to send password reset confirmation email:', err)
    );

    // Return success response with immediate login
    return createSuccessResponse(
      {
        user: user.toPublicJSON(),
        token: jwtToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
      'Password reset successful'
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}