# 👤 Profile System API Documentation

**Generated**: January 27, 2025
**System**: Hack The World Backend API
**Base URL**: `/api/profile`

---

## 🎯 Overview

The Profile System manages user profile information, personal settings, and account preferences within the cybersecurity learning platform. It provides secure endpoints for users to view and update their personal information, change passwords, and manage profile settings.

### 🔑 Key Features

- **Profile Management** - Complete user profile information handling
- **Secure Password Changes** - Safe password update with validation
- **Avatar Management** - Profile picture upload and management
- **Personal Information** - Detailed profile fields for personalization
- **Security Controls** - Password verification and JWT token regeneration
- **User Isolation** - Users can only access and modify their own profiles

---

## 📋 Available Routes

### 1. **Get Current User Profile**

- **Route**: `GET /api/profile`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Retrieve complete profile information for authenticated user

#### How getProfile() Works

**Step-by-Step Process:**

1. **Authentication Verification**

   ```javascript
   // User is already attached to req from the protect middleware
   const user = await User.findById(req.user.id).select("-password");
   ```

   - Uses JWT token to identify user
   - Excludes password field from response

2. **User Validation**

   ```javascript
   if (!user) {
     return next(new ErrorResponse("User not found", 404));
   }
   ```

   - Ensures user still exists in database
   - Handles case where token is valid but user was deleted

3. **Response Formatting**
   ```javascript
   res.status(200).json({
     success: true,
     message: "Profile retrieved successfully",
     data: { user },
   });
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "username": "cyberhacker2024",
      "email": "hacker@terminal-hacks.space",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "displayName": "John Doe",
        "avatar": "https://example.com/avatar.jpg",
        "bio": "Cybersecurity enthusiast and ethical hacker",
        "location": "San Francisco, CA",
        "website": "https://johndoe.com"
      },
      "experienceLevel": "intermediate",
      "stats": {
        "totalPoints": 1250,
        "level": 5,
        "coursesCompleted": 3,
        "labsCompleted": 12,
        "gamesCompleted": 8,
        "achievementsEarned": 15
      },
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "lastLoginAt": "2024-01-27T09:15:00.000Z"
    }
  }
}
```

#### Error Responses

- **401**: Invalid or missing authentication token
- **404**: User not found
- **500**: Server error

#### Database Operations

- **Query**: `User.findById(req.user.id).select("-password")`
- **Index Used**: Primary key (id) index
- **Security**: Password field explicitly excluded

#### Use Cases

- **Profile Pages**: Display user information on profile pages
- **Dashboard**: Show user stats and progress
- **Settings**: Pre-populate form fields with current values

---

### 2. **Change Password**

- **Route**: `PUT /api/profile/change-password`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Securely update user password with verification

#### Request Format

```javascript
{
  "currentPassword": "oldPassword123!",     // Required: Current password for verification
  "newPassword": "newSecurePass456!"       // Required: New password meeting strength requirements
}
```

#### How changePassword() Works

**Step-by-Step Process:**

1. **User Retrieval with Password**

   ```javascript
   const user = await User.findById(req.user.id).select("+password");
   ```

   - Includes password field for verification
   - Uses JWT token to identify user

2. **Current Password Verification**

   ```javascript
   const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
   if (!isCurrentPasswordCorrect) {
     return next(new ErrorResponse("Current password is incorrect", 400));
   }
   ```

   - Verifies current password using bcrypt comparison
   - Prevents unauthorized password changes

3. **New Password Validation**

   ```javascript
   const isSamePassword = await user.comparePassword(newPassword);
   if (isSamePassword) {
     return next(
       new ErrorResponse(
         "New password must be different from current password",
         400
       )
     );
   }
   ```

   - Ensures new password is different from current
   - Prevents meaningless password "changes"

4. **Password Update & Token Regeneration**

   ```javascript
   user.password = newPassword;
   const passwordChangeTime = new Date(Date.now() - 1000);
   user.security.passwordChangedAt = passwordChangeTime;
   await user.save();

   const newToken = generateToken(user.id);
   ```

   - Sets new password (triggers pre-save hashing)
   - Records password change timestamp
   - Generates new JWT token to invalidate old sessions

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

#### Error Responses

- **400**: Current password incorrect, new password same as current, validation errors
- **401**: Invalid authentication token
- **404**: User not found
- **500**: Server error

#### Database Operations

- **Query**: `User.findById(req.user.id).select("+password")`
- **Update**: Password field update with pre-save hashing
- **Security Fields**: Updates passwordChangedAt timestamp
- **Token Generation**: New JWT token issued

#### Security Features

- **Password Verification**: Requires current password before change
- **Strength Validation**: New password must meet complexity requirements
- **Session Invalidation**: New token invalidates previous sessions
- **Audit Trail**: Password change timestamp recorded
- **Timing Protection**: Slight buffer to prevent timing issues

---

### 3. **Update Basic Profile**

- **Route**: `PUT /api/profile/basic`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Update basic profile information like name, bio, location

#### Request Format (All fields optional)

```javascript
{
  "firstName": "John",                                    // Optional: Max 50 chars
  "lastName": "Doe",                                     // Optional: Max 50 chars
  "displayName": "John Doe",                             // Optional: Max 100 chars
  "bio": "Cybersecurity enthusiast and ethical hacker", // Optional: Max 500 chars
  "location": "San Francisco, CA",                       // Optional: Max 100 chars
  "website": "https://johndoe.com"                       // Optional: Valid URL format
}
```

#### How updateBasicProfile() Works

**Step-by-Step Process:**

1. **User Retrieval**

   ```javascript
   const user = await User.findById(req.user.id);
   if (!user) {
     return next(new ErrorResponse("User not found", 404));
   }
   ```

2. **Selective Updates**

   ```javascript
   if (firstName !== undefined) user.profile.firstName = firstName;
   if (lastName !== undefined) user.profile.lastName = lastName;
   if (displayName !== undefined) user.profile.displayName = displayName;
   if (bio !== undefined) user.profile.bio = bio;
   if (location !== undefined) user.profile.location = location;
   if (website !== undefined) user.profile.website = website;
   ```

   - Updates only provided fields
   - Preserves existing values for omitted fields

3. **Save and Return Updated User**
   ```javascript
   await user.save();
   const updatedUser = await User.findById(user.id).select("-password");
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "username": "cyberhacker2024",
      "email": "hacker@terminal-hacks.space",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "displayName": "John Doe",
        "bio": "Updated bio - Cybersecurity expert and red team specialist",
        "location": "San Francisco, CA",
        "website": "https://johndoe.com"
      },
      "experienceLevel": "intermediate",
      "stats": { /* unchanged stats */ },
      "updatedAt": "2024-01-27T12:30:00.000Z"
    }
  }
}
```

#### Error Responses

- **400**: Validation errors (field length, URL format)
- **401**: Invalid authentication token
- **404**: User not found
- **500**: Server error

#### Database Operations

- **Query**: `User.findById(req.user.id)`
- **Update**: Selective profile field updates
- **Validation**: Schema validation on save
- **Return**: Fresh user query without password

#### Validation Rules

```javascript
// Field length validations
firstName: {
  maxLength: 50;
}
lastName: {
  maxLength: 50;
}
displayName: {
  maxLength: 100;
}
bio: {
  maxLength: 500;
}
location: {
  maxLength: 100;
}

// URL format validation
website: {
  format: "uri";
}
```

---

### 4. **Update Avatar**

- **Route**: `PUT /api/profile/avatar`
- **Access**: Private
- **Authentication**: Bearer token required
- **Purpose**: Update user profile picture/avatar

#### Request Format

```javascript
{
  "avatar": "https://example.com/new-avatar.jpg"  // Required: Valid URL to avatar image
}
```

#### How updateAvatar() Works

**Step-by-Step Process:**

1. **User Retrieval**

   ```javascript
   const user = await User.findById(req.user.id);
   if (!user) {
     return next(new ErrorResponse("User not found", 404));
   }
   ```

2. **Avatar Update**

   ```javascript
   user.profile.avatar = avatar;
   await user.save();
   ```

   - Simple avatar URL update
   - URL validation handled by middleware

3. **Return Updated User**
   ```javascript
   const updatedUser = await User.findById(user.id).select("-password");
   ```

#### Success Response (200)

```javascript
{
  "success": true,
  "message": "Avatar updated successfully",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "username": "cyberhacker2024",
      "email": "hacker@terminal-hacks.space",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "displayName": "John Doe",
        "avatar": "https://example.com/new-avatar.jpg",
        "bio": "Cybersecurity enthusiast",
        "location": "San Francisco, CA"
      },
      "experienceLevel": "intermediate",
      "updatedAt": "2024-01-27T12:45:00.000Z"
    }
  }
}
```

#### Error Responses

- **400**: Invalid URL format, validation errors
- **401**: Invalid authentication token
- **404**: User not found
- **500**: Server error

#### Database Operations

- **Query**: `User.findById(req.user.id)`
- **Update**: profile.avatar field update
- **Validation**: URL format validation via middleware
- **Return**: Fresh user query without password

#### Implementation Notes

- **File Upload**: This endpoint expects a URL, not file upload
- **Image Validation**: URL format validated, but image existence not verified
- **CDN Integration**: Works well with CDN/cloud storage URLs
- **Future Enhancement**: Could include image validation and processing

---

## 🗄️ Database Schema Integration

### User Profile Fields

```javascript
{
  username: String,                    // Unique username
  email: String,                       // Unique email address
  password: String,                    // Hashed password (excluded from responses)
  profile: {
    firstName: String,                 // First name (max 50 chars)
    lastName: String,                  // Last name (max 50 chars)
    displayName: String,               // Display name (max 100 chars)
    avatar: String,                    // Avatar URL
    bio: String,                       // User biography (max 500 chars)
    location: String,                  // User location (max 100 chars)
    website: String                    // Personal website URL
  },
  experienceLevel: String,             // beginner|intermediate|advanced|expert
  stats: {
    totalPoints: Number,               // Total points earned
    level: Number,                     // Current level
    coursesCompleted: Number,          // Completed courses count
    labsCompleted: Number,             // Completed labs count
    gamesCompleted: Number,            // Completed games count
    achievementsEarned: Number         // Achievements earned count
  },
  security: {
    passwordChangedAt: Date,           // Last password change timestamp
    lastLoginAt: Date                  // Last login timestamp
  },
  role: String,                        // user|admin
  status: String                       // active|inactive|suspended
}
```

### Key Indexes

```javascript
// Unique indexes
{ username: 1 } (unique: true)
{ email: 1 } (unique: true)

// Query indexes
{ role: 1 }                          // Role-based queries
{ status: 1 }                        // Status filtering
{ "stats.level": 1 }                 // Level-based queries
{ experienceLevel: 1 }               // Experience filtering
```

### Instance Methods Used

```javascript
// Password comparison (bcrypt)
user.comparePassword(candidatePassword);

// Password hashing (pre-save middleware)
user.save(); // Triggers password hashing if modified
```

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Required**: All profile operations require valid authentication
- **User Isolation**: Users can only access their own profile data
- **Password Verification**: Current password required for password changes
- **Token Regeneration**: New JWT issued after password changes

### Password Security

```javascript
// Password strength requirements (handled by validation middleware)
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

// Password change security
- Current password verification required
- New password must be different from current
- Password change timestamp recorded
- New JWT token issued (invalidates old sessions)
```

### Input Validation

```javascript
// Profile field validation
body("firstName").optional().isLength({ max: 50 });
body("lastName").optional().isLength({ max: 50 });
body("displayName").optional().isLength({ max: 100 });
body("bio").optional().isLength({ max: 500 });
body("location").optional().isLength({ max: 100 });
body("website").optional().isURL();

// Password validation
body("currentPassword").notEmpty().withMessage("Current password required");
body("newPassword")
  .isStrongPassword()
  .withMessage("Password must meet strength requirements");

// Avatar validation
body("avatar").isURL().withMessage("Avatar must be valid URL");
```

### Data Protection

- **Password Exclusion**: Password field never returned in responses
- **Selective Updates**: Only provided fields are updated
- **Audit Trail**: Password changes and login times tracked
- **Session Management**: Token regeneration for security-sensitive operations

---

## 📊 Model Interactions & Side Effects

### When Updating Profile

1. **Cache Invalidation**: User profile caches may need refreshing
2. **Display Updates**: Changes affect user display throughout application
3. **Search Indexing**: Profile updates may affect user search results
4. **Activity Logging**: Profile changes logged for audit purposes

### When Changing Password

1. **Session Invalidation**: Old JWT tokens become invalid
2. **Security Logging**: Password change events logged
3. **Email Notification**: May trigger security notification email
4. **Multi-device Logout**: Forces re-authentication on all devices

### When Updating Avatar

1. **Image Processing**: May trigger avatar image optimization
2. **CDN Updates**: Avatar changes propagated to CDN
3. **Cache Invalidation**: Avatar caches cleared across system
4. **Display Updates**: New avatar shown throughout application

---

## 🎯 Common Use Cases

### Profile Management Interface

```javascript
// Get current user profile
const getUserProfile = async () => {
  const response = await fetch("/api/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { data } = await response.json();
  return data.user;
};

// Update profile information
const updateProfile = async (profileData) => {
  const response = await fetch("/api/profile/basic", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  return response.json();
};
```

### Password Change Flow

```javascript
// Change password with validation
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch("/api/profile/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Update stored token
      localStorage.setItem("authToken", result.data.token);
      return { success: true, message: "Password updated successfully" };
    }

    throw new Error(result.message);
  } catch (error) {
    return { success: false, message: error.message };
  }
};
```

### Avatar Management

```javascript
// Upload and update avatar
const updateAvatar = async (avatarFile) => {
  // First upload to CDN/storage service
  const uploadResponse = await uploadToCloudStorage(avatarFile);
  const avatarUrl = uploadResponse.url;

  // Then update profile with new URL
  const response = await fetch("/api/profile/avatar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar: avatarUrl }),
  });

  return response.json();
};
```

### Profile Form Component

```javascript
// React component for profile editing
const ProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user.profile.firstName || "",
    lastName: user.profile.lastName || "",
    displayName: user.profile.displayName || "",
    bio: user.profile.bio || "",
    location: user.profile.location || "",
    website: user.profile.website || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await updateProfile(formData);
    if (result.success) {
      onSave(result.data.user);
      showSuccessMessage("Profile updated successfully");
    } else {
      showErrorMessage(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for each profile property */}
    </form>
  );
};
```

---

## 📈 Performance Considerations

### Database Optimization

- **Selective Queries**: Only necessary fields retrieved
- **Index Usage**: Efficient queries using username/email indexes
- **Minimal Updates**: Only modified fields updated
- **Password Exclusion**: Automatic password field exclusion

### Caching Strategies

- **User Profile Caching**: Cache profile data with reasonable TTL
- **Avatar Caching**: CDN caching for avatar images
- **Session Caching**: Cache authentication state
- **Stats Caching**: Cache computed user statistics

### Security Performance

- **Password Hashing**: Bcrypt operations are CPU-intensive but secure
- **Token Generation**: JWT creation is lightweight
- **Validation**: Client-side validation reduces server load
- **Rate Limiting**: Prevent brute force on password changes

---

## 🧪 Testing Scenarios

### Unit Tests

1. **Profile Retrieval**: Get profile for authenticated user
2. **Password Changes**: Valid/invalid password change attempts
3. **Profile Updates**: Partial and complete profile updates
4. **Avatar Updates**: Valid/invalid avatar URL updates
5. **Validation**: Field length and format validation
6. **Error Handling**: Invalid tokens, missing users, server errors

### Integration Tests

1. **Authentication Flow**: Profile access with various auth states
2. **Password Security**: Password change security measures
3. **Data Persistence**: Profile updates persisted correctly
4. **Token Management**: JWT regeneration after password changes
5. **Concurrent Updates**: Multiple profile update requests

### Security Tests

1. **Access Control**: Users can only access own profiles
2. **Password Verification**: Current password required for changes
3. **Input Validation**: Malicious input handling
4. **Token Security**: JWT token validation and regeneration
5. **Session Management**: Old token invalidation

---

This profile system provides comprehensive user profile management with strong security controls, flexible update capabilities, and efficient performance characteristics suitable for a modern cybersecurity learning platform.
