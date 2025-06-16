import { z } from 'zod';

// Phase validation schema
export const phaseSchema = z.object({
  title: z.string()
    .min(1, 'Phase title is required')
    .max(100, 'Phase title cannot exceed 100 characters')
    .trim(),
  description: z.string()
    .min(1, 'Phase description is required')
    .max(500, 'Phase description cannot exceed 500 characters')
    .trim(),
  icon: z.string()
    .min(1, 'Phase icon is required')
    .max(50, 'Icon name cannot exceed 50 characters')
    .trim(),
  color: z.string()
    .min(1, 'Phase color is required')
    .max(50, 'Color class cannot exceed 50 characters')
    .trim(),
  order: z.number()
    .int('Order must be an integer')
    .min(1, 'Order must be at least 1'),
  isActive: z.boolean().optional().default(true),
  prerequisites: z.array(z.string()).optional().default([]),
  estimatedDuration: z.string()
    .trim()
    .optional()
    .default('4-6 weeks'),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    errorMap: () => ({ message: 'Difficulty level must be one of: Beginner, Intermediate, Advanced, Expert' })
  }),
  tags: z.array(z.string().min(1).max(50)).optional().default([]),
});

// Module validation schema
export const moduleSchema = z.object({
  phaseId: z.string().min(1, 'Phase ID is required'),
  title: z.string()
    .min(1, 'Module title is required')
    .max(100, 'Module title cannot exceed 100 characters')
    .trim(),
  description: z.string()
    .min(1, 'Module description is required')
    .max(500, 'Module description cannot exceed 500 characters')
    .trim(),
  icon: z.string()
    .min(1, 'Module icon is required')
    .max(50, 'Icon name cannot exceed 50 characters')
    .trim(),
  duration: z.string()
    .trim()
    .optional()
    .default('0 hours'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    errorMap: () => ({ message: 'Difficulty must be one of: Beginner, Intermediate, Advanced, Expert' })
  }),
  color: z.string()
    .min(1, 'Module color is required')
    .max(50, 'Color class cannot exceed 50 characters')
    .trim(),
  order: z.number()
    .int('Order must be an integer')
    .min(1, 'Order must be at least 1'),
  topics: z.array(z.string().min(1).max(100)).optional().default([]),
  isActive: z.boolean().optional().default(true),
  prerequisites: z.array(z.string()).optional().default([]),
  learningOutcomes: z.array(z.string()).optional().default([]),
  content: z.object({
    videos: z.array(z.string()).optional().default([]),
    labs: z.array(z.string()).optional().default([]),
    games: z.array(z.string()).optional().default([]),
    documents: z.array(z.string()).optional().default([]),
    estimatedHours: z.number().min(0, 'Estimated hours cannot be negative').optional().default(0),
  }).optional().default({
    videos: [],
    labs: [],
    games: [],
    documents: [],
    estimatedHours: 0,
  }),
});

// Content validation schema
export const contentSchema = z.object({
  moduleId: z.string().min(1, 'Module ID is required'),
  type: z.enum(['video', 'lab', 'game', 'document'], {
    errorMap: () => ({ message: 'Content type must be one of: video, lab, game, document' })
  }),
  title: z.string()
    .min(1, 'Content title is required')
    .max(200, 'Content title cannot exceed 200 characters')
    .trim(),
  description: z.string()
    .min(1, 'Content description is required')
    .max(1000, 'Content description cannot exceed 1000 characters')
    .trim(),
  url: z.string()
    .url('Invalid URL format')
    .optional(),
  instructions: z.string()
    .max(2000, 'Instructions cannot exceed 2000 characters')
    .trim()
    .optional(),
  section: z.string()
    .max(100, 'Section name cannot exceed 100 characters')
    .trim()
    .optional(),
  order: z.number()
    .int('Order must be an integer')
    .min(1, 'Order must be at least 1'),
  duration: z.number()
    .min(0, 'Duration cannot be negative')
    .optional()
    .default(0),
  isActive: z.boolean().optional().default(true),
  metadata: z.object({
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
    tags: z.array(z.string().max(50)).optional().default([]),
    prerequisites: z.array(z.string()).optional().default([]),
    estimatedTime: z.string().optional(),
    tools: z.array(z.string()).optional().default([]),
    objectives: z.array(z.string()).optional().default([]),
  }).optional(),
});

// Update schemas for existing items (without required fields)
export const phaseUpdateSchema = phaseSchema.partial().omit({ order: true });
export const moduleUpdateSchema = moduleSchema.partial().omit({ phaseId: true, order: true });
export const contentUpdateSchema = contentSchema.partial().omit({ moduleId: true, type: true, order: true });

// ID validation schema
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Reorder schema
export const reorderSchema = z.object({
  items: z.array(z.object({
    id: objectIdSchema,
    order: z.number().int().min(1),
  })),
});

// Progress tracking schemas
export const progressUpdateSchema = z.object({
  progressPercentage: z.number().min(0).max(100),
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
});

export const contentProgressSchema = z.object({
  contentId: objectIdSchema,
  progressPercentage: z.number().min(0).max(100),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  score: z.number().min(0).max(100).optional(),
});

// Enrollment schemas
export const enrollmentSchema = z.object({
  moduleId: objectIdSchema,
});

export const enrollmentUpdateSchema = z.object({
  status: z.enum(['active', 'paused', 'completed']).optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  completedSections: z.number().int().min(0).optional(),
});

// Achievement schemas
export const achievementSchema = z.object({
  slug: z.string().min(1).max(100).trim(),
  title: z.string().min(1).max(200).trim(),
  description: z.string().min(1).max(500).trim(),
  category: z.string().min(1).max(100).trim(),
  requirements: z.object({
    type: z.string(),
    target: z.number(),
    description: z.string(),
  }),
  rewards: z.object({
    points: z.number().min(0),
    badge: z.string().optional(),
    title: z.string().optional(),
  }),
  icon: z.string().min(1).max(100).trim(),
  difficulty: z.enum(['Bronze', 'Silver', 'Gold', 'Platinum']),
  isActive: z.boolean().optional().default(true),
});

export const userAchievementUpdateSchema = z.object({
  progress: z.number().min(0).max(100),
  isCompleted: z.boolean().optional(),
});