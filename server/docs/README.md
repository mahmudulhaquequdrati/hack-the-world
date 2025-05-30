# Hack The World - Backend API Documentation

## 🚀 Overview

This is the backend API for the **Hack The World** cybersecurity learning platform. Built with Express.js, MongoDB, and JWT authentication, it provides a robust and secure foundation for the learning management system.

## 📋 Table of Contents

- [🏗️ Architecture](#architecture)
- [🛠️ Setup & Installation](#setup--installation)
- [🔧 Configuration](#configuration)
- [📊 Database Schema](#database-schema)
- [🔐 Authentication](#authentication)
- [📡 API Endpoints](#api-endpoints)
- [🧪 Testing](#testing)
- [🚀 Deployment](#deployment)
- [📈 Performance](#performance)
- [🔒 Security](#security)

## 🏗️ Architecture

### Technology Stack

- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, Rate Limiting, CORS
- **Environment**: Node.js 18+

### Project Structure

```
server/
├── docs/                    # Documentation
├── src/
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route controllers (TODO)
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API routes
│   ├── types/             # TypeScript definitions (TODO)
│   └── utils/             # Utility functions
├── env.example            # Environment variables template
├── index.js              # Main server file
└── package.json          # Dependencies and scripts
```

### Data Flow

```
Frontend Request → Express Middleware → Routes → Controllers → Models → MongoDB
                ↓
Frontend Response ← JSON Response ← Business Logic ← Mongoose ODM ← Database
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- MongoDB 5.0+
- pnpm (recommended) or npm

### Installation Steps

1. **Clone and navigate to server directory**

   ```bash
   cd server
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment setup**

   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

4. **Start MongoDB**

   ```bash
   # Using MongoDB service
   sudo systemctl start mongod

   # Or using Docker
   docker run -d -p 27017:27017 mongo:5.0
   ```

5. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:5000/health
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hack-the-world

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Configuration

The server implements multiple security layers:

- **Helmet**: Basic security headers
- **Rate Limiting**: API protection (100 requests per 15 minutes)
- **CORS**: Cross-origin resource sharing
- **JWT**: Stateless authentication
- **Password Hashing**: bcrypt with 12 rounds
- **Account Locking**: After 5 failed login attempts

## 📊 Database Schema

### Core Models

#### Phase Model

Represents learning phases (Beginner, Intermediate, Advanced)

```javascript
{
  id: String,              // 'beginner', 'intermediate', 'advanced'
  title: String,           // 'Beginner Phase'
  description: String,     // Phase description
  icon: String,           // Icon name for frontend
  color: String,          // Tailwind color class
  order: Number,          // Display order
  isActive: Boolean,      // Status flag
  // ... additional fields
}
```

#### Module Model

Individual learning modules within phases

```javascript
{
  id: String,              // 'foundations', 'linux-basics', etc.
  phaseId: String,         // Reference to phase
  title: String,           // Module title
  description: String,     // Module description
  icon: String,           // Icon name
  duration: String,       // '2-3 weeks'
  difficulty: String,     // 'Beginner', 'Intermediate', etc.
  content: {
    estimatedHours: Number,
    lessonsCount: Number,
    labsCount: Number,
    gamesCount: Number,
    assetsCount: Number
  },
  // ... styling and path information
}
```

#### Game Model

Interactive cybersecurity games

```javascript
{
  id: String,              // 'command-master', 'packet-sniffer', etc.
  moduleId: String,        // Reference to module
  name: String,           // Game name
  description: String,    // Game description
  type: String,          // 'Strategy', 'Puzzle', etc.
  maxPoints: Number,     // Maximum achievable points
  timeLimit: String,     // '5 minutes', '10 minutes'
  difficulty: String,    // 'Beginner', 'Advanced', etc.
  category: String,      // 'command-line', 'web-security', etc.
  objectives: [{
    id: String,
    objective: String,
    points: Number,
    order: Number
  }],
  // ... configuration and stats
}
```

#### Lab Model

Hands-on laboratory exercises

```javascript
{
  id: String,              // 'file-system-mastery', etc.
  moduleId: String,        // Reference to module
  name: String,           // Lab name
  description: String,    // Lab description
  difficulty: String,     // Difficulty level
  duration: String,       // '45 min', '2 hours'
  category: String,       // Lab category
  objectives: [Object],   // Learning objectives
  steps: [{              // Step-by-step instructions
    id: String,
    title: String,
    description: String,
    order: Number,
    instructions: String,
    expectedOutput: String,
    hints: [Object]
  }],
  // ... configuration and resources
}
```

#### User Model

User accounts and profiles

```javascript
{
  username: String,        // Unique username
  email: String,          // User email
  password: String,       // Hashed password
  profile: {
    firstName: String,
    lastName: String,
    displayName: String,
    avatar: String,
    bio: String,
    // ... social links
  },
  role: String,           // 'student', 'instructor', 'admin'
  experienceLevel: String, // 'beginner', 'intermediate', etc.
  stats: {
    totalPoints: Number,
    currentStreak: Number,
    coursesCompleted: Number,
    level: Number,
    // ... learning statistics
  },
  security: {
    lastLogin: Date,
    loginAttempts: Number,
    lockUntil: Date,
    emailVerified: Boolean,
    // ... security settings
  }
}
```

### Relationships

```
Phase (1) ←→ (Many) Module
Module (1) ←→ (Many) Game
Module (1) ←→ (Many) Lab
User (1) ←→ (Many) UserProgress
User (1) ←→ (Many) UserEnrollment
User (1) ←→ (Many) UserGameProgress
User (1) ←→ (Many) UserLabProgress
```

## 🔐 Authentication

### JWT Implementation

The API uses JWT tokens for stateless authentication:

```javascript
// Token Structure
{
  "userId": "ObjectId",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Authentication Flow

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server creates JWT token
3. **Token Storage**: Client stores token (localStorage/cookies)
4. **Request Authentication**: Client sends token in Authorization header
5. **Token Verification**: Server validates token on protected routes

### Protected Routes

All routes under `/api/users/`, `/api/progress/`, and certain admin endpoints require authentication.

## 📡 API Endpoints

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "experienceLevel": "beginner"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "64f5c8e12345abcd67890123",
      "username": "johndoe",
      "profile": { ... },
      "stats": { ... }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

#### POST /api/auth/login

Authenticate existing user.

**Request Body:**

```json
{
  "login": "johndoe", // username or email
  "password": "SecurePass123!"
}
```

#### GET /api/auth/me

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

#### POST /api/auth/refresh

Refresh JWT token.

#### GET /api/auth/validate-token

Validate JWT token.

### Learning Content Endpoints

#### GET /api/phases

Get all learning phases.

**Response:**

```json
{
  "success": true,
  "data": {
    "phases": [
      {
        "id": "beginner",
        "title": "Beginner Phase",
        "description": "Foundation courses for cybersecurity beginners",
        "icon": "Lightbulb",
        "color": "text-green-400",
        "order": 1
      }
    ],
    "count": 3
  }
}
```

#### GET /api/modules

Get all modules or filter by phase.

**Query Parameters:**

- `phaseId`: Filter modules by phase (optional)

#### GET /api/games

Get games (Coming Soon)

#### GET /api/labs

Get labs (Coming Soon)

### System Endpoints

#### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-30T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "database": "Connected"
}
```

#### GET /api

API information and documentation.

### Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "username",
      "message": "Username is required"
    }
  ]
}
```

### Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

## 🧪 Testing

### Manual Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "password": "TestPass123!"
  }'

# Get phases
curl http://localhost:5000/api/phases

# Get user profile (with token)
curl -H "Authorization: Bearer <your_jwt_token>" \
  http://localhost:5000/api/auth/me
```

### Load Testing

Use artillery.io or similar tools:

```bash
npm install -g artillery
artillery quick --count 10 --num 100 http://localhost:5000/health
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**

   ```env
   NODE_ENV=production
   PORT=80
   MONGODB_URI=mongodb://prod-db:27017/hack-the-world
   JWT_SECRET=<strong-production-secret>
   CLIENT_URL=https://your-frontend-domain.com
   ```

2. **Database Setup**

   - Set up MongoDB Atlas or dedicated MongoDB server
   - Create production database
   - Set up database backups

3. **Security Checklist**
   - [ ] Change all default passwords
   - [ ] Use strong JWT secret
   - [ ] Enable MongoDB authentication
   - [ ] Set up SSL/TLS certificates
   - [ ] Configure firewall rules
   - [ ] Enable audit logging

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Process Management

Use PM2 for production:

```bash
npm install -g pm2
pm2 start index.js --name "hack-the-world-api"
pm2 startup
pm2 save
```

## 📈 Performance

### Monitoring

- **Application Performance**: Monitor response times, throughput
- **Database Performance**: Query optimization, indexing
- **Memory Usage**: Heap size, garbage collection
- **Error Rates**: Track 4xx/5xx responses

### Optimization

- Database indexing on frequently queried fields
- Connection pooling for MongoDB
- Response compression (gzip)
- Caching for static data
- Rate limiting to prevent abuse

## 🔒 Security

### Implemented Security Measures

1. **Authentication & Authorization**

   - JWT token-based authentication
   - Password hashing with bcrypt
   - Account locking after failed attempts
   - Role-based access control

2. **API Security**

   - Rate limiting (100 requests per 15 minutes)
   - CORS configuration
   - Helmet for security headers
   - Input validation and sanitization

3. **Data Protection**

   - Password encryption
   - Sensitive data exclusion from responses
   - Secure token generation
   - SQL injection prevention (NoSQL context)

4. **Network Security**
   - HTTPS enforcement (production)
   - Secure headers
   - CORS policy enforcement

### Security Best Practices

- Regular security audits
- Dependency vulnerability scanning
- Database connection encryption
- Environment variable protection
- Audit logging for sensitive operations

## 🔄 Development Workflow

### Adding New Features

1. **Create Model** (if needed)

   ```bash
   # Create new model in src/models/
   touch src/models/NewModel.js
   ```

2. **Create Routes**

   ```bash
   # Create new routes in src/routes/
   touch src/routes/newFeature.js
   ```

3. **Update Main Server**

   ```javascript
   // Add to index.js
   const newFeatureRoutes = require("./src/routes/newFeature");
   app.use("/api/new-feature", newFeatureRoutes);
   ```

4. **Test and Document**
   - Add API tests
   - Update documentation
   - Test error scenarios

### Code Standards

- Use async/await for asynchronous operations
- Implement proper error handling
- Follow RESTful API conventions
- Add JSDoc comments for functions
- Use consistent naming conventions

## 📞 Support

For technical support or questions:

- **Documentation**: Check this README and inline comments
- **Issues**: Create GitHub issues for bugs
- **Development**: Follow the setup guide above

---

## 📄 License

This project is part of the Hack The World cybersecurity learning platform.

---

**Last Updated**: January 2024
**API Version**: 1.0.0
