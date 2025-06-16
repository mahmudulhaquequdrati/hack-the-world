import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import User from '@/lib/models/User';
import { registerSchema } from '@/lib/validators/auth';
import { generateToken, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import EmailService from '@/lib/utils/email';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return createErrorResponse('Too many registration attempts, please try again later', 429);
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.code === 'invalid_type' ? body[err.path[0] as string] : undefined,
        }))
      );
    }

    const { username, email, password, firstName, lastName, experienceLevel } = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const duplicateField = existingUser.email === email ? 'email' : 'username';
      return createErrorResponse(
        `User with this ${duplicateField} already exists`,
        400
      );
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password, // Will be hashed by pre-save middleware
      profile: {
        firstName,
        lastName,
      },
      experienceLevel,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id.toString());

    // Send welcome email (don't wait for it)
    const displayName = newUser.profile.displayName || username;
    EmailService.sendWelcomeEmail(email, username, displayName).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    // Return success response
    return createSuccessResponse(
      {
        user: newUser.toPublicJSON(),
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
      'User registered successfully',
      201
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      const duplicateField = (error as any).keyPattern?.email ? 'email' : 'username';
      return createErrorResponse(
        `User with this ${duplicateField} already exists`,
        400
      );
    }

    return createErrorResponse('Internal server error', 500);
  }
}