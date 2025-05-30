# 🚀 Hack The World - Development Quick Start Guide

## 📋 System Overview

**Hack The World** is a comprehensive cybersecurity learning platform with:

- **Backend**: Node.js/Express.js + MongoDB + JWT Authentication
- **Frontend**: React + TypeScript + Tailwind CSS
- **Architecture**: RESTful API + Component-based UI

## 🏗️ System Architecture Quick View

```
Frontend (React)  ←→  Backend API (Express)  ←→  Database (MongoDB)
     ↓                      ↓                         ↓
- Landing Page         - JWT Auth              - Users
- Dashboard           - REST Endpoints        - Phases
- Course Interface    - Controllers          - Modules
- Game Engine         - Validation           - Games
- Lab Interface       - Error Handling       - Labs
- Terminal UI         - Rate Limiting        - Progress
```

## 🔧 Quick Setup (5 Minutes)

### 1. Environment Setup

```bash
# Clone and navigate
git clone <repository-url>
cd hack-the-world

# Backend setup
cd server
cp env.example .env
# Edit .env with MongoDB URI and JWT secret
pnpm install

# Frontend setup (new terminal)
cd ../src
pnpm install
```

### 2. Database Setup

```bash
# Start MongoDB (local or Docker)
# MongoDB: mongodb://localhost:27017/hack-the-world

# Seed data
cd server
pnpm run seed
```

### 3. Start Development

```bash
# Terminal 1: Backend
cd server && pnpm dev  # Port 5001

# Terminal 2: Frontend
cd src && pnpm dev     # Port 5173
```

### 4. Access Points

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:5001/api/docs
- **Health Check**: http://localhost:5001/health

## 📊 Core Data Models

### Schema Relationships

```
PHASES (3) → MODULES (15) → GAMES/LABS (50+)
     ↓            ↓              ↓
   Beginner   →  5 modules  →  games + labs
   Intermediate → 5 modules  →  games + labs
   Advanced  →   5 modules  →  games + labs

USERS → ENROLLMENTS → PROGRESS → ACHIEVEMENTS
```

### Key Collections

```javascript
// Phase: Learning phases (beginner/intermediate/advanced)
{
  id, title, description, icon, color, order;
}

// Module: Course modules within phases
{
  id, phaseId, title, difficulty, content, courseDetails;
}

// User: User accounts and progress
{
  username, email, profile, stats, enrollments, achievements;
}

// Game: Interactive security games
{
  id, moduleId, name, type, difficulty, objectives, maxPoints;
}

// Lab: Hands-on exercises
{
  id, moduleId, name, duration, steps, objectives;
}
```

## 🔌 API Patterns

### Authentication Flow

```javascript
// 1. Register/Login
POST /api/auth/register
POST /api/auth/login
→ Returns JWT token

// 2. Protected requests
Headers: { Authorization: 'Bearer <token>' }

// 3. Response format
{
  success: Boolean,
  message: String,
  data: Object,
  errors?: Array
}
```

### Core Endpoints

```
/api/auth/*          # Authentication
/api/phases          # Learning phases
/api/modules         # Course modules
/api/games           # Security games
/api/labs            # Hands-on labs
/api/users           # User management
/api/achievements    # Achievement system
```

## 🎨 Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── common/      # Shared UI (ProgressBar, DifficultyBadge)
│   ├── course/      # Course components
│   ├── dashboard/   # Dashboard UI
│   ├── games/       # Game interface
│   ├── terminal/    # Lab terminal
│   └── ui/          # Base components (shadcn/ui)
├── pages/           # Route components
├── lib/
│   ├── appData.ts   # SINGLE SOURCE OF TRUTH
│   ├── types.ts     # TypeScript interfaces
│   └── api.ts       # API client
└── hooks/           # Custom React hooks
```

### Data Flow Pattern

```
appData.ts → Context Providers → Pages → Components → API
```

## 🔄 Development Workflow

### Adding New Features

#### 1. Backend (API + Database)

```javascript
// 1. Create Model (server/src/models/)
const newSchema = new mongoose.Schema({...});

// 2. Create Controller (server/src/controllers/)
const getAll = async (req, res, next) => {...};

// 3. Create Routes (server/src/routes/)
router.get('/', getAll);

// 4. Register in server/index.js
app.use('/api/new-feature', newRoutes);
```

#### 2. Frontend (React + TypeScript)

```typescript
// 1. Add types (src/lib/types.ts)
export interface NewFeature { id: string; name: string; }

// 2. Create component (src/components/)
const NewFeatureCard: React.FC<Props> = ({ data }) => {...};

// 3. Add API calls (src/lib/api.ts)
export const getNewFeatures = () => api.get('/new-features');

// 4. Add to routing (src/App.tsx)
<Route path="/new-feature" element={<NewFeaturePage />} />
```

### Testing Strategy

```bash
# Backend tests
cd server && pnpm test

# Frontend tests
cd src && pnpm test

# API testing via Swagger
# Visit: http://localhost:5001/api/docs
```

## 🎯 Key Features to Understand

### 1. User Flow

```
Landing → Register → Dashboard → Enroll → Learn → Progress → Achieve
```

### 2. Learning Structure

```
Phase → Module → Enroll → Content (Games/Labs) → Complete → Certificate
```

### 3. Progress Tracking

```
User completes objective → API updates progress → UI updates → Check achievements
```

## 🔒 Security Implementation

### Authentication

```javascript
// JWT token required for protected routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

### Rate Limiting

```javascript
// 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

## 📚 Essential Files to Know

### Backend Core Files

```
server/
├── index.js                 # Main server file
├── src/config/database.js   # MongoDB connection
├── src/models/User.js       # User schema & methods
├── src/controllers/authController.js  # Auth logic
└── src/utils/seedData.js    # Database seeding
```

### Frontend Core Files

```
src/
├── lib/appData.ts          # ALL data definitions
├── lib/types.ts            # TypeScript interfaces
├── components/common/      # Reusable components
├── pages/Dashboard.tsx     # Main dashboard
└── pages/LandingPage.tsx   # Entry point
```

## 🚀 Next Steps

1. **Explore the API**: Visit `/api/docs` and test endpoints
2. **Review Data Flow**: Check `appData.ts` for all data structures
3. **Run Seed Script**: Populate database with sample data
4. **Start Development**: Follow the component patterns
5. **Read Documentation**: Check `SYSTEM_DESIGN.md` for deep dive

## 🆘 Troubleshooting

### Common Issues

```bash
# MongoDB connection error
# Solution: Check MONGODB_URI in .env

# JWT token invalid
# Solution: Check JWT_SECRET in .env

# CORS error
# Solution: Check CLIENT_URL in .env

# Port already in use
# Solution: Change PORT in .env or kill process
```

### Debug Commands

```bash
# Check API health
curl http://localhost:5001/health

# Check database connection
cd server && node -e "require('./src/config/database').connect()"

# View logs
cd server && pnpm dev # Shows request logs
```

This guide provides everything needed to start developing on the Hack The World platform. The system is designed to be modular and extensible, following modern full-stack development practices.
