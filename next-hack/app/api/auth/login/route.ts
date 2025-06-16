import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { loginSchema } from '@/lib/validators/auth';
import { generateToken, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return createErrorResponse('Too many login attempts, please try again later', 429);
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
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

    const { login, password } = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Find user by username or email (include password for comparison)
    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login.toLowerCase() }
      ]
    }).select('+password +security.lockUntil +security.loginAttempts');

    if (!user) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Check if account is locked
    if (user.security.lockUntil && user.security.lockUntil > new Date()) {
      return createErrorResponse(
        'Account locked due to too many failed login attempts. Please try again later.',
        423
      );
    }

    // Check if account is active
    if (user.adminStatus === 'suspended') {
      return createErrorResponse('Account is suspended', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      return createErrorResponse('Invalid credentials', 401);
    }

    // Reset login attempts on successful login
    if (user.security.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.security.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Return success response
    return createSuccessResponse(
      {
        user: user.toPublicJSON(),
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
      'Authentication successful'
    );

  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}