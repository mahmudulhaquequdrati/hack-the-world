# Hack The World - Development Quick Reference

## 🚀 Instant Development Commands

**For LLMs and developers who need to quickly understand and work with the codebase.**

---

## 📁 Project Structure Quick Map

```
hack-the-world/
├── frontend/           # Student portal (React + TS + RTK Query)
├── admin/             # Admin panel (React + JS + Axios)
├── server/            # API server (Node.js + Express + MongoDB)
├── tasks/             # Project documentation
└── docs/              # Generated documentation
```

---

## ⚡ Quick Start Commands

### Development Setup
```bash
# Start all services
cd server && npm run dev &         # Backend on :5001
cd frontend && npm run dev &       # Frontend on :5173  
cd admin && npm run dev &          # Admin on :5174

# Database setup
cd server && npm run seed:all      # Seed complete database

# Environment setup
cp server/env.example server/.env  # Configure environment variables
```

### Testing
```bash
# Backend tests
cd server && npm test
cd server && npm run test:watch

# Frontend tests  
cd frontend && npm test
cd frontend && npm run test:coverage

# Admin tests
cd admin && npm test
```

### Build & Deploy
```bash
# Build for production
cd frontend && npm run build
cd admin && npm run build

# Start production server
cd server && npm start
```

---

## 🔗 Key API Endpoints Quick Reference

### Authentication (`/api/auth`)
```javascript
POST   /api/auth/register           // User registration
POST   /api/auth/login              // User login
GET    /api/auth/me                 // Get current user
POST   /api/auth/forgot-password    // Password reset request
POST   /api/auth/reset-password     // Password reset confirmation
```

### Content Management (`/api/content`)
```javascript
GET    /api/content/module/:moduleId                    // Module content
GET    /api/content/:id/with-navigation                 // Content with prev/next
GET    /api/content/:id/with-module-and-progress        // Content with progress
POST   /api/content                                     // Create content (admin)
PUT    /api/content/:id                                 // Update content (admin)
```

### Progress Tracking (`/api/progress`)
```javascript
POST   /api/progress/content/complete      // Mark content complete
GET    /api/progress/overview/:userId      // User's overall progress
GET    /api/progress/module/:userId/:moduleId  // Module-specific progress
```

### Enrollment (`/api/enrollments`)
```javascript
POST   /api/enrollments                    // Enroll in module
GET    /api/enrollments                    // User's enrollments
GET    /api/enrollments/module/:moduleId   // Check enrollment status
DELETE /api/enrollments/:enrollmentId     // Unenroll
```

---

## 🎯 Component Architecture Quick Guide

### Frontend Component Categories
```typescript
// UI Components (Shadcn/ui)
import { Button, Card, Dialog } from '@/components/ui'

// Common Components (Shared across features)
import { Header, ProgressBar, AuthLoader } from '@/components/common'

// Feature Components (Specific functionality)
import { VideoPlayer, LabContent, GameContent } from '@/components/enrolled'
import { CourseHero, EnrollmentButton } from '@/components/course'
import { LearningDashboard, ProgressTab } from '@/components/dashboard'
```

### State Management Pattern
```typescript
// RTK Query for API calls
const { data, isLoading, error } = useGetModulesQuery();
const [updateModule] = useUpdateModuleMutation();

// Auth state
const { user, isAuthenticated } = useAuthRTK();

// Local state for UI
const [isModalOpen, setIsModalOpen] = useState(false);
```

---

## 🗄️ Database Models Quick Reference

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  profile: { firstName, lastName, displayName, avatar, bio },
  experienceLevel: 'beginner|intermediate|advanced|expert',
  role: 'student|admin',
  stats: { totalPoints, level, coursesCompleted, labsCompleted }
}
```

### Module Model
```javascript
{
  phaseId: ObjectId,
  title: String,
  description: String,
  difficulty: 'Beginner|Intermediate|Advanced|Expert',
  order: Number,
  content: { videos: [], labs: [], games: [], documents: [] }
}
```

### UserProgress Model
```javascript
{
  userId: ObjectId,
  contentId: ObjectId,
  contentType: 'video|lab|game|document',
  status: 'not-started|in-progress|completed',
  progressPercentage: Number (0-100),
  score: Number (optional)
}
```

---

## 🔧 Common Development Patterns

### Adding New Component
```typescript
// 1. Create component file
interface ComponentProps {
  data: DataType;
  onAction: (id: string) => void;
}

export const NewComponent: React.FC<ComponentProps> = ({ data, onAction }) => {
  const [loading, setLoading] = useState(false);
  const { data: apiData } = useGetDataQuery(data.id);
  
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
};

// 2. Export from index
export { NewComponent } from './NewComponent';

// 3. Use in parent component
import { NewComponent } from '@/components/feature';
```

### Adding New API Endpoint

#### Backend (Server)
```javascript
// 1. Add route (routes/feature.js)
router.get('/new-endpoint/:id', protect, validation, controller.newFunction);

// 2. Add controller (controllers/featureController.js)
const newFunction = asyncHandler(async (req, res, next) => {
  const result = await Model.findById(req.params.id);
  res.status(200).json({ success: true, data: result });
});

// 3. Add validation (middleware/validation/featureValidation.js)
const newEndpointValidation = [
  param('id').isMongoId().withMessage('Invalid ID')
];
```

#### Frontend
```typescript
// 1. Add to RTK Query (features/api/apiSlice.ts)
newEndpoint: builder.query<ResponseType, string>({
  query: (id) => `/feature/new-endpoint/${id}`,
  providesTags: ['Feature'],
}),

// 2. Use in component
const { data, isLoading } = useNewEndpointQuery(id);
```

### Progress Tracking Pattern
```typescript
// Mark content as complete
const [markComplete] = useMarkContentCompleteMutation();

const handleContentComplete = async (contentId: string, score?: number) => {
  await markComplete({ 
    contentId, 
    score,
    maxScore: 100 
  });
};

// Update progress percentage
const [updateProgress] = useUpdateContentProgressMutation();

const handleProgressUpdate = (contentId: string, percentage: number) => {
  updateProgress({ contentId, progressPercentage: percentage });
};
```

---

## 🎮 Game Development Pattern

### Creating New Game
```typescript
// 1. Create game component (components/games/NewGame.tsx)
export const NewGame: React.FC<GameProps> = ({ content }) => {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [markComplete] = useMarkContentCompleteMutation();
  
  const handleGameComplete = async () => {
    setGameState('completed');
    await markComplete({ 
      contentId: content.id, 
      score,
      maxScore: 1000 
    });
  };
  
  return (
    <div className="game-container">
      <GameHeader score={score} timeRemaining={timeRemaining} />
      <GameContent onScoreUpdate={setScore} onComplete={handleGameComplete} />
    </div>
  );
};

// 2. Add to game selector (components/games/GameSelector.tsx)
case 'new-game':
  return <NewGame content={content} />;

// 3. Update game data (lib/gameData.ts)
export const gameTypes = {
  'new-game': {
    title: 'New Game',
    description: 'Game description',
    difficulty: 'beginner',
    estimatedTime: 15
  }
};
```

---

## 🧪 Lab Development Pattern

### Creating New Lab
```typescript
// 1. Create lab component (components/enrolled/LabContent.tsx or pages/NewLab.tsx)
export const NewLab: React.FC<LabProps> = ({ content }) => {
  const [labState, setLabState] = useState<LabState>('setup');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const handleStepComplete = (stepNumber: number) => {
    setCompletedSteps(prev => [...prev, stepNumber]);
    
    // Check if all steps completed
    if (completedSteps.length + 1 === totalSteps) {
      handleLabComplete();
    }
  };
  
  const handleLabComplete = async () => {
    await markContentComplete({ contentId: content.id });
  };
  
  return (
    <div className="lab-container">
      <LabInstructions content={content} />
      <LabEnvironment onStepComplete={handleStepComplete} />
      <ProgressIndicator completed={completedSteps} total={totalSteps} />
    </div>
  );
};

// 2. Add route if standalone lab (App.tsx)
{
  path: '/lab/new-lab',
  element: <ProtectedRoute><NewLab /></ProtectedRoute>
}
```

---

## 🔍 Debugging Quick Commands

### Backend Debugging
```javascript
// Add to any controller for debugging
console.log('Request data:', req.body);
console.log('User:', req.user);
console.log('Database result:', result);

// Database queries debugging
Model.find().explain('executionStats'); // Query performance
```

### Frontend Debugging
```typescript
// RTK Query debugging
console.log('API State:', store.getState().api);

// Component debugging
console.log('Props:', props);
console.log('State:', state);
console.log('API Data:', data);

// Browser developer tools
// Use Redux DevTools Extension for state inspection
```

### Network Debugging
```bash
# Check API endpoints
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check database connection
mongosh mongodb://localhost:27017/hack-the-world
```

---

## 📊 Performance Optimization Quick Tips

### Frontend Optimization
```typescript
// 1. Use React.memo for pure components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.name}</div>;
});

// 2. Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return expensiveDataProcessing(data);
}, [data]);

// 3. Use useCallback for stable function references
const handleClick = useCallback((id: string) => {
  console.log('Clicked:', id);
}, []);

// 4. Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Backend Optimization
```javascript
// 1. Use lean queries for better performance
const modules = await Module.find().lean();

// 2. Use select to limit returned fields
const users = await User.find().select('username email profile.firstName');

// 3. Use indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// 4. Use aggregation for complex queries
const stats = await UserProgress.aggregate([
  { $match: { userId: new ObjectId(userId) } },
  { $group: { _id: '$contentType', count: { $sum: 1 } } }
]);
```

---

## 🚨 Error Handling Patterns

### Frontend Error Handling
```typescript
// Component-level error boundary
const ComponentWithErrorHandling = () => {
  const [error, setError] = useState<string | null>(null);
  
  const handleAsyncAction = async () => {
    try {
      setError(null);
      await riskyOperation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };
  
  if (error) {
    return <ErrorAlert message={error} onDismiss={() => setError(null)} />;
  }
  
  return <ComponentContent />;
};

// RTK Query error handling
const { data, error, isLoading } = useGetDataQuery();

if (error) {
  if ('status' in error) {
    return <div>API Error: {error.status}</div>;
  }
  return <div>Network Error</div>;
}
```

### Backend Error Handling
```javascript
// Use asyncHandler for automatic error catching
const controllerFunction = asyncHandler(async (req, res, next) => {
  const result = await Model.findById(req.params.id);
  
  if (!result) {
    return next(new APIError('Resource not found', 404));
  }
  
  res.status(200).json({ success: true, data: result });
});

// Custom error class
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

---

## 🔐 Security Quick Checklist

### Authentication
- ✅ JWT tokens with expiry (7 days)
- ✅ Password hashing with bcrypt (salt rounds 12)
- ✅ Login attempt limiting (10 attempts, 1-hour lockout)
- ✅ Password complexity requirements
- ✅ Secure password reset with time-limited tokens

### API Security
- ✅ Rate limiting (10,000 requests/15 minutes)
- ✅ CORS configuration for specific origins
- ✅ Input validation with express-validator
- ✅ Helmet.js for security headers
- ✅ Role-based access control

### Data Protection
- ✅ Password field excluded from responses
- ✅ Sensitive data not logged
- ✅ MongoDB injection protection via Mongoose
- ✅ Environment variables for secrets

---

## 📝 Code Style & Conventions

### TypeScript/JavaScript
```typescript
// Use descriptive variable names
const userEnrollments = await getUserEnrollments(userId);

// Use async/await instead of promises
const result = await apiCall();

// Use proper TypeScript types
interface UserProps {
  user: User;
  onUpdate: (user: User) => void;
}

// Use meaningful component names
const EnrollmentConfirmationDialog = () => { ... };
```

### CSS/Styling
```css
/* Use Tailwind utility classes */
className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"

/* Use semantic class names for custom CSS */
.learning-progress-indicator { ... }
.game-completion-celebration { ... }
```

### File Naming
```
// Components: PascalCase
VideoPlayer.tsx
EnrollmentButton.tsx

// Utilities: camelCase
courseUtils.ts
progressService.ts

// Constants: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
GAME_TYPES.ts
```

This quick reference provides instant access to the most commonly needed development patterns, commands, and conventions for the Hack The World platform.