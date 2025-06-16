import { createSuccessResponse } from '@/lib/middleware/auth';

export async function POST() {
  // Since JWT tokens are stateless, logout is primarily a client-side operation
  // This endpoint provides a consistent logout experience
  
  return createSuccessResponse(
    null,
    'Logged out successfully'
  );
}