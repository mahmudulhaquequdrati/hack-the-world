import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      /^[a-z0-9_-]+$/,
      'Username can only contain lowercase letters, numbers, underscores, and hyphens'
    )
    .transform((val) => val.toLowerCase()),
  
  email: z
    .string()
    .email('Please provide a valid email')
    .transform((val) => val.toLowerCase()),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  firstName: z
    .string()
    .max(50, 'First name cannot exceed 50 characters')
    .optional(),
  
  lastName: z
    .string()
    .max(50, 'Last name cannot exceed 50 characters')
    .optional(),
  
  experienceLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .default('beginner'),
});

// User login schema
export const loginSchema = z.object({
  login: z
    .string()
    .min(1, 'Username or email is required'),
  
  password: z
    .string()
    .min(1, 'Password is required'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email')
    .transform((val) => val.toLowerCase()),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, 'Reset token is required'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

// Profile update schema
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .max(50, 'First name cannot exceed 50 characters')
    .optional(),
  
  lastName: z
    .string()
    .max(50, 'Last name cannot exceed 50 characters')
    .optional(),
  
  displayName: z
    .string()
    .max(100, 'Display name cannot exceed 100 characters')
    .optional(),
  
  bio: z
    .string()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
  
  location: z
    .string()
    .max(100, 'Location cannot exceed 100 characters')
    .optional(),
  
  website: z
    .string()
    .url('Website must be a valid URL')
    .optional()
    .or(z.literal('')),
});

// Password change schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

// Type exports for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;