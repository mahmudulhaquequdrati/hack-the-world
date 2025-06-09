# 🔐 Authentication System Documentation

**Generated**: January 27, 2025
**System**: Hack The World Backend API
**Base URL**: `/api/auth`

---

## 🎯 Overview

The Authentication System provides secure user registration, login, password management, and session handling using JWT tokens. It supports both regular users and admin roles with comprehensive security features.

### 🔑 Key Features

- **JWT Token Authentication** - Secure token-based authentication
- **Role-based Access Control** - User and Admin roles
- **Password Security** - bcrypt hashing with 12 rounds
- **Password Reset** - Email-based password reset flow
- **Session Management** - Token expiration and refresh
- **Email Integration** - Welcome emails and password reset notifications

---

## 📋 Available Routes

### 1. **User Registration**

- **Route**: `POST /api/auth/register`
- **Access**: Public
- **Authentication**: None required

#### Request Format

```javascript
{
  "username": "cyberhacker2024",     // Required: 3-30 chars, lowercase letters, numbers, underscore, hyphen only
  "email": "hacker@terminal-hacks.space",  // Required: Valid email format
  "password": "SecurePass123!",      // Required: 8+ chars with uppercase, lowercase, number, special char
  "firstName": "John",               // Optional: Max 50 chars
  "lastName": "Doe",                 // Optional: Max 50 chars
  "experienceLevel": "beginner"      // Optional: beginner|intermediate|advanced|expert
}
```

#### How It Works

1. **Validation**: Express-validator checks all input fields
2. **Duplicate Check**: Verifies username and email are unique
3. **Password Hashing**: Uses bcrypt with 12 rounds for security
4. **User Creation**: Creates new User document in MongoDB
5. **JWT Generation**: Creates authentication token
6. **Welcome Email**: Sends welcome email using EmailService
7. **Response**: Returns user data and token

#### Success Response (201)

```javascript
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "username": "cyberhacker2024",
      "email": "hacker@terminal-hacks.space",
      "role": "user",
      "experienceLevel": "beginner",
      "stats": {
        "totalPoints": 0,
        "level": 1,
        "coursesCompleted": 0,
        "labsCompleted": 0,
        "gamesCompleted": 0,
        "achievementsEarned": 0
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

#### Error Responses

- **400**: Validation errors (duplicate username/email, weak password)
- **500**: Server error during registration

#### Database Interactions

- **Creates**: New User document with default stats
- **Indexes Used**: username (unique), email (unique)
- **Side Effects**: Triggers welcome email send

---

### 2. **User Login**

- **Route**: `POST /api/auth/login`
- **Access**: Public
- **Authentication**: None required

#### Request Format

```javascript
{
  "login": "cyberhacker2024",       // Required: Username or email
  "password": "SecurePass123!"      // Required: User's password
}
```

#### How It Works

1. **Input Validation**: Checks login and password are provided
2. **User Lookup**: Finds user by username OR email
3. **Password Verification**: Uses bcrypt to compare hashed password
4. **Status Check**: Verifies user account is active
5. **JWT Generation**: Creates new authentication token
6. **Last Login Update**: Updates user's lastLoginAt timestamp
7. **Response**: Returns user data and token

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "username": "cyberhacker2024",
      "email": "hacker@terminal-hacks.space",
      "role": "user",
      "experienceLevel": "beginner",
      "stats": { /* user stats */ },
      "lastLoginAt": "2024-01-15T11:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

#### Error Responses

- **400**: Validation errors
- **401**: Invalid credentials
- **403**: Account suspended or inactive
- **500**: Server error

#### Database Interactions

- **Queries**: User by username or email
- **Updates**: lastLoginAt timestamp
- **Indexes Used**: username, email

---

### 3. **Get Current User**

- **Route**: `GET /api/auth/me`
- **Access**: Private
- **Authentication**: Bearer token required

#### Request Headers

```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### How It Works

1. **Token Extraction**: Gets JWT from Authorization header
2. **Token Verification**: Validates JWT signature and expiration
3. **User Lookup**: Finds user by decoded userId from token
4. **User Validation**: Ensures user still exists and is active
5. **Response**: Returns current user profile data

#### Success Response (200)

```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "username": "cyberhacker2024",
      "email": "hacker@terminal-hacks.space",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "displayName": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "role": "user",
      "experienceLevel": "intermediate",
      "stats": {
        "totalPoints": 1250,
        "level": 5,
        "coursesCompleted": 3,
        "labsCompleted": 12,
        "gamesCompleted": 8,
        "achievementsEarned": 15
      },
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### Error Responses

- **401**: Missing, invalid, or expired token
- **404**: User not found
- **500**: Server error

#### Database Interactions

- **Queries**: User by ID from JWT payload
- **Indexes Used**: id (primary key)

---

### 4. **User Logout**

- **Route**: `POST /api/auth/logout`
- **Access**: Private
- **Authentication**: Bearer token required

#### How It Works

1. **Token Validation**: Middleware validates JWT token
2. **Logout Confirmation**: Returns success message
3. **Client Responsibility**: Client must delete token from storage

> **Note**: This is a client-side logout. The server returns success, but the client must remove the JWT token from local storage. For enhanced security, consider implementing a token blacklist.

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### No Database Interactions

- JWT tokens are stateless, so no database updates needed
- Future enhancement: Implement token blacklist for immediate revocation

---

### 5. **Forgot Password**

- **Route**: `POST /api/auth/forgot-password`
- **Access**: Public
- **Authentication**: None required

#### Request Format

```javascript
{
  "email": "hacker@terminal-hacks.space"  // Required: Valid email address
}
```

#### How It Works

1. **Email Validation**: Checks if email format is valid
2. **User Lookup**: Searches for user with provided email
3. **Security Response**: Always returns success to prevent email enumeration
4. **Token Generation**: Creates secure password reset token (if user exists)
5. **Token Storage**: Saves hashed token and expiration to user document
6. **Email Send**: Sends password reset email with token link
7. **Error Handling**: Handles email failures gracefully

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "If an account with that email exists, we have sent password reset instructions"
}
```

#### Email Template Includes

- **Reset Link**: Contains token for password reset
- **Expiration Info**: Token expires in 1 hour
- **Security Warning**: Instructions about not sharing the link

#### Database Interactions

- **Queries**: User by email
- **Updates**: passwordResetToken (hashed), passwordResetExpires
- **Security**: Token is hashed before storage using crypto.createHash('sha256')

---

### 6. **Reset Password**

- **Route**: `POST /api/auth/reset-password`
- **Access**: Public
- **Authentication**: Reset token required

#### Request Format

```javascript
{
  "token": "a1b2c3d4e5f6789012345678901234567890abcdef",  // Required: Reset token from email
  "password": "NewSecurePass123!"                         // Required: New password meeting requirements
}
```

#### How It Works

1. **Input Validation**: Validates token and password strength
2. **Token Hashing**: Hashes provided token to match stored hash
3. **User Lookup**: Finds user with matching token and valid expiration
4. **Password Update**: Sets new password (triggers pre-save hashing)
5. **Token Cleanup**: Removes reset token and expiration
6. **Password Change Tracking**: Updates passwordChangedAt timestamp
7. **Auto Login**: Generates JWT for immediate login
8. **Confirmation Email**: Sends password reset confirmation

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

#### Error Responses

- **400**: Invalid or expired token, weak password
- **500**: Server error

#### Database Interactions

- **Queries**: User by hashed reset token and expiration date
- **Updates**: password, passwordResetToken (cleared), passwordResetExpires (cleared), passwordChangedAt, lastLogin
- **Side Effects**: Triggers confirmation email

---

## 🔒 Middleware Integration

### Authentication Middleware (`protect`)

```javascript
// Used on routes requiring authentication
router.use("/protected-route", protect, controller);
```

**How It Works:**

1. Extracts JWT from Authorization header
2. Verifies token signature and expiration
3. Decodes user ID from token payload
4. Fetches user from database
5. Attaches user to `req.user` for subsequent middleware
6. Continues to next middleware/controller

### Authorization Middleware (`requireAdmin`)

```javascript
// Used on admin-only routes
router.use("/admin-route", protect, requireAdmin, controller);
```

**How It Works:**

1. Assumes `protect` middleware has already run
2. Checks if `req.user.role === 'admin'`
3. Returns 403 Forbidden if not admin
4. Continues to next middleware if admin

---

## 🔐 Security Features

### Password Security

- **Hashing**: bcrypt with 12 rounds (configurable via `BCRYPT_ROUNDS`)
- **Strength Requirements**: Minimum 8 characters with mixed case, numbers, symbols
- **Reset Security**: Tokens are cryptographically secure and expire in 1 hour

### JWT Token Security

- **Algorithm**: HS256 (HMAC SHA-256)
- **Secret**: Environment variable `JWT_SECRET`
- **Expiration**: 7 days (configurable via `JWT_EXPIRES_IN`)
- **Payload**: Contains only user ID and role for minimal exposure

### Rate Limiting

- **Applied**: 100 requests per 15 minutes per IP (global API rate limit)
- **Protection**: Against brute force attacks and abuse

### Input Validation

- **Library**: express-validator
- **Scope**: All input fields validated for type, length, format
- **XSS Protection**: Input sanitization prevents script injection

---

## 📧 Email Integration

### EmailService Integration

The authentication system integrates with `EmailService` for automated communications:

#### Welcome Email

- **Trigger**: Successful user registration
- **Content**: Welcome message, platform overview, getting started tips
- **Template**: Professional design with cybersecurity theme

#### Password Reset Email

- **Trigger**: Forgot password request (if user exists)
- **Content**: Reset link with token, security instructions, expiration warning
- **Security**: Contains time-limited, single-use token

#### Password Reset Confirmation

- **Trigger**: Successful password reset
- **Content**: Confirmation of password change, security recommendations
- **Purpose**: Security notification and account activity tracking

---

## 🗄️ Database Schema Integration

### User Model Fields Used

```javascript
{
  username: String,                    // Unique identifier for login
  email: String,                       // Unique email for login and communications
  password: String,                    // bcrypt hashed password
  role: String,                        // 'user' or 'admin' for authorization
  status: String,                      // 'active', 'inactive', 'suspended'
  profile: {
    firstName: String,
    lastName: String,
    displayName: String,
    avatar: String
  },
  experienceLevel: String,             // Learning level tracking
  stats: {                             // Achievement tracking
    totalPoints: Number,
    level: Number,
    coursesCompleted: Number,
    labsCompleted: Number,
    gamesCompleted: Number,
    achievementsEarned: Number
  },
  security: {                          // Security-related fields
    passwordResetToken: String,        // Hashed reset token
    passwordResetExpires: Date,        // Token expiration
    passwordChangedAt: Date,           // Last password change
    lastLogin: Date                    // Last successful login
  }
}
```

### Database Indexes Used

- **username**: Unique index for fast login lookup
- **email**: Unique index for login and reset functionality
- **passwordResetToken**: Index for password reset token lookup
- **role**: Index for role-based queries
- **status**: Index for active user filtering

---

## 🧪 Testing Considerations

### Test Scenarios to Cover

1. **Registration**: Valid/invalid inputs, duplicate users, password strength
2. **Login**: Valid/invalid credentials, account status checks
3. **Password Reset**: Email flow, token validation, expiration handling
4. **JWT Validation**: Token parsing, expiration, signature verification
5. **Email Integration**: Mock email service for testing
6. **Security**: Rate limiting, input sanitization, SQL injection prevention

### Test Data Requirements

- **Valid Users**: Mix of regular users and admins
- **Invalid Inputs**: Malformed emails, weak passwords, SQL injection attempts
- **Edge Cases**: Expired tokens, deleted users, concurrent requests

---

## 🚀 Usage Examples

### Frontend Registration Flow

```javascript
// Registration
const registerUser = async (userData) => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      // Store token in localStorage/sessionStorage
      localStorage.setItem("authToken", result.data.token);
      return result.data.user;
    }
  } catch (error) {
    throw new Error("Registration failed");
  }
};
```

### Frontend Login Flow

```javascript
// Login
const loginUser = async (login, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });

  const result = await response.json();

  if (result.success) {
    localStorage.setItem("authToken", result.data.token);
    return result.data.user;
  }

  throw new Error(result.message);
};
```

### Frontend Protected Requests

```javascript
// Making authenticated requests
const getProfile = async () => {
  const token = localStorage.getItem("authToken");

  const response = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
```

### Admin Route Access

```javascript
// Admin-only functionality
const getAdminData = async () => {
  const token = localStorage.getItem("authToken");

  const response = await fetch("/api/admin/data", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 403) {
    throw new Error("Admin access required");
  }

  return response.json();
};
```

---

## 🔧 Configuration

### Environment Variables Required

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-key-here     # Required: Strong secret for JWT signing
JWT_EXPIRES_IN=7d                         # Optional: Token expiration (default: 7d)

# Password Security
BCRYPT_ROUNDS=12                          # Optional: bcrypt rounds (default: 12)

# Database
MONGODB_URI=mongodb://localhost:27017/hack-the-world  # Required: MongoDB connection

# Email Service (for password reset)
RESEND_KEY=your-resend-api-key           # Required: For email functionality

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000              # Optional: 15 minutes in ms
RATE_LIMIT_MAX_REQUESTS=100              # Optional: Max requests per window
```

### Security Recommendations

1. **JWT_SECRET**: Use a strong, random secret (minimum 32 characters)
2. **BCRYPT_ROUNDS**: Higher rounds = more security but slower performance
3. **Token Expiration**: Balance security with user experience
4. **HTTPS**: Always use HTTPS in production
5. **Email Verification**: Consider adding email verification for registration

---

## 📈 Performance Considerations

### Database Query Optimization

- **Indexes**: Ensure username and email indexes for fast lookups
- **Projections**: Use field selection to limit data transfer
- **Connection Pooling**: Configure MongoDB connection pool for concurrent requests

### JWT Performance

- **Stateless**: JWTs are stateless, no database lookup for validation
- **Payload Size**: Keep payload minimal to reduce token size
- **Caching**: Consider caching user data for frequently accessed profiles

### Email Performance

- **Async Processing**: Email sending is asynchronous to not block requests
- **Error Handling**: Email failures don't block authentication flow
- **Rate Limiting**: Consider email-specific rate limiting for abuse prevention

---

This authentication system provides a robust foundation for secure user management in the Hack The World platform, with comprehensive features for registration, login, password management, and session handling.
