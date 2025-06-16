import User, { IUser } from "@/lib/models/User";
import { ensureDBConnection } from "@/lib/mongodb/connection";
import jwt, { SignOptions } from "jsonwebtoken";
import { NextRequest } from "next/server";

// Extend NextRequest to include user
export interface AuthenticatedRequest extends NextRequest {
  user?: IUser;
}

// JWT payload interface
interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

// API Response interface
export interface APIResponse {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: unknown[];
}

// Error class for API errors
export class APIError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Helper function to create error response
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  errors?: unknown[]
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message,
      ...(errors && { errors }),
    }),
    {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Helper function to create success response
export function createSuccessResponse(
  data: unknown,
  message: string = "Success",
  statusCode: number = 200
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      message,
      data,
    }),
    {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Extract token from request headers
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

// Verify JWT token
async function verifyToken(token: string): Promise<JWTPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        reject(new APIError("Invalid or expired token", 401));
      } else {
        resolve(decoded as JWTPayload);
      }
    });
  });
}

// Main authentication middleware
export async function authenticate(request: NextRequest): Promise<IUser> {
  try {
    // Extract token from Authorization header
    const token = extractToken(request);

    if (!token) {
      throw new APIError("Access token is required", 401);
    }

    // Verify JWT token
    const decoded = await verifyToken(token);

    // Ensure database connection
    await ensureDBConnection();

    // Find user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new APIError("User not found or token invalid", 401);
    }

    // Check if user account is active
    if (user.adminStatus === "suspended") {
      throw new APIError("Account is suspended", 403);
    }

    // Check if password was changed after token was issued
    const passwordChangedAt = user.security.passwordChangedAt;
    if (passwordChangedAt) {
      const passwordChangedTimestamp = Math.floor(
        passwordChangedAt.getTime() / 1000
      );
      if (decoded.iat < passwordChangedTimestamp) {
        throw new APIError(
          "Password recently changed. Please login again.",
          401
        );
      }
    }

    return user;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("Authentication failed", 401);
  }
}

// Authorization middleware for admin-only routes
export async function requireAdmin(user: IUser): Promise<void> {
  if (user.role !== "admin") {
    throw new APIError("Admin access required", 403);
  }

  if (user.adminStatus !== "active") {
    throw new APIError("Admin account not active", 403);
  }
}

// Authorization middleware for student access
export async function requireStudent(user: IUser): Promise<void> {
  if (user.role !== "student") {
    throw new APIError("Student access required", 403);
  }
}

// Helper function to generate JWT token
export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign(
    { userId },
    secret as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as SignOptions
  );
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(identifier);

  if (!entry) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now });
    return true;
  }

  if (entry.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}
