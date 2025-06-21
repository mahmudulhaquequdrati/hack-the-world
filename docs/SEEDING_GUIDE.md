# Hack The World - Complete Seeding Guide

## 🌱 Overview

The Hack The World platform uses a sophisticated dynamic seeding system that automatically manages dependencies between database models. This guide provides complete instructions for seeding your database with sample data for development, testing, and demonstration purposes.

## 🏗️ System Architecture

### Dependency Tiers

The seeding system organizes models into dependency tiers to ensure proper creation order:

```
Tier 0 (Independent - No Dependencies)
├── Phases (learning phases: Beginner, Intermediate, Advanced)
├── Users (admin and student accounts)
└── Achievements (platform achievements and rewards)

Tier 1 (Depends on Tier 0)
└── Modules (courses within phases - requires Phases)

Tier 2 (Depends on Tier 1)
└── Content (videos, labs, games, documents - requires Modules)

Tier 3 (Depends on Everything)
├── UserEnrollments (user-module relationships)
├── UserProgress (user-content progress tracking)
└── UserAchievements (user achievement progress)
```

### Dynamic Dependency Resolution

Unlike traditional seeding systems with hardcoded IDs, our system:
- ✅ Dynamically queries the database for actual ObjectIds
- ✅ Validates dependencies exist before seeding
- ✅ Provides clear error messages for missing dependencies
- ✅ Uses intelligent title matching to resolve relationships

## 📋 Quick Start

### 1. Basic Commands

```bash
# Show help and available commands
pnpm seed:help

# Seed everything (recommended for new setups)
pnpm seed:all

# Seed only core data (phases, modules, content)
pnpm seed

# Clear all data and start fresh
pnpm seed:clear
```

### 2. Environment Setup

Ensure your environment is configured:

```bash
# Required environment variables in .env
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

## 🎯 Detailed Command Reference

### Core Commands

#### `pnpm seed:all`
**Description**: Seeds all data in proper dependency order
**Dependencies**: None
**Creates**:
- 3 Phases (Beginner, Intermediate, Advanced)
- 4 Users (1 admin, 3 students)
- 10 Achievements across 5 categories
- 8 Modules with dynamic phase references
- 19 Content items with dynamic module references
- 7+ User enrollments with realistic progress
- 25+ User progress entries with varied completion
- 10+ User achievement progress entries

```bash
pnpm seed:all
```

#### `pnpm seed`
**Description**: Seeds core learning content only
**Dependencies**: None
**Creates**: Phases → Modules → Content

```bash
pnpm seed
```

### Individual Model Commands

#### `pnpm seed:phases`
**Description**: Seeds learning phases
**Dependencies**: None
**Creates**: 3 phases with proper ordering

```bash
pnpm seed:phases
```

**Sample Output**:
```
🌱 Seeding phases...
✅ Created 3 phases
```

#### `pnpm seed:modules`
**Description**: Seeds learning modules
**Dependencies**: Requires Phases
**Creates**: 8 modules across all phases

```bash
pnpm seed:modules
```

**Sample Output**:
```
🌱 Seeding modules...
🔍 Validating dependencies for modules...
✅ All dependencies satisfied for modules: Phase(3)
📋 Dynamic phase mapping created: { beginner: '✅', intermediate: '✅', advanced: '✅' }
✅ Created 8 modules with dynamic phase references
```

#### `pnpm seed:content`
**Description**: Seeds learning content
**Dependencies**: Requires Modules (which requires Phases)
**Creates**: 19 content items across all modules

```bash
pnpm seed:content
```

#### `pnpm seed:users`
**Description**: Seeds user accounts
**Dependencies**: None
**Creates**: 1 admin account + 3 student accounts

```bash
pnpm seed:users
```

**Created Accounts**:
- **Admin**: `admin@hacktheworld.dev` / `SecureAdmin123!`
- **Student 1**: `alice@example.com` / `SecurePassword123!`
- **Student 2**: `bob@example.com` / `SecurePassword123!`
- **Student 3**: `carol@example.com` / `SecurePassword123!`

#### `pnpm seed:achievements`
**Description**: Seeds platform achievements
**Dependencies**: None
**Creates**: 10 achievements across 5 categories

```bash
pnpm seed:achievements
```

**Achievement Categories**:
- Module completion (first module, 5 modules)
- Lab completion (first lab, 10 labs)
- Game completion (first game, 5 games)
- XP milestones (1000 XP, 5000 XP)
- General achievements (enrollment, dedication)

#### `pnpm seed:user-data`
**Description**: Seeds user relationship data
**Dependencies**: Requires Users, Modules, Content, and Achievements
**Creates**: User enrollments, progress tracking, and achievement progress

```bash
pnpm seed:user-data
```

### Utility Commands

#### `pnpm seed:clear`
**Description**: Clears all database collections in proper dependency order
**Dependencies**: None
**Effect**: Removes all seeded data

```bash
pnpm seed:clear
```

#### `pnpm seed:reseed`
**Description**: Clears and reseeds core data
**Dependencies**: None
**Effect**: `clear` + `seed`

```bash
pnpm seed:reseed
```

#### `pnpm seed:reseed-all`
**Description**: Clears and reseeds all data
**Dependencies**: None
**Effect**: `clear` + `seed:all`

```bash
pnpm seed:reseed-all
```

## 🛠️ Advanced Usage

### Sequential Seeding

For granular control, seed in dependency order:

```bash
# Step 1: Tier 0 (Independent models)
pnpm seed:phases
pnpm seed:users  
pnpm seed:achievements

# Step 2: Tier 1 (Phase-dependent)
pnpm seed:modules

# Step 3: Tier 2 (Module-dependent)
pnpm seed:content

# Step 4: Tier 3 (User relationships)
pnpm seed:user-data
```

### Partial Seeding

Seed specific parts for targeted testing:

```bash
# Just learning content (no users/achievements)
pnpm seed:phases
pnpm seed:modules
pnpm seed:content

# Just user system (no learning content)
pnpm seed:users
pnpm seed:achievements

# Add user relationships to existing content
pnpm seed:user-data
```

### Development Workflow

```bash
# Daily development reset
pnpm seed:clear && pnpm seed:all

# Test new features with fresh data
pnpm seed:reseed-all

# Add sample users to existing content
pnpm seed:users && pnpm seed:user-data
```

## 🔍 Dependency Validation

### How It Works

The system automatically validates dependencies before seeding:

```javascript
// Example: Seeding modules
🔍 Validating dependencies for modules...
✅ All dependencies satisfied for modules: Phase(3)
```

### Error Handling

When dependencies are missing:

```bash
❌ Missing dependencies for modules: Phase. Please seed these models first.
```

**Solution**: Seed the missing dependencies first:
```bash
pnpm seed:phases
pnpm seed:modules  # Now works
```

## 📊 Sample Data Overview

### Phases Created
1. **Beginner Phase** - Foundation courses
2. **Intermediate Phase** - Advanced concepts
3. **Advanced Phase** - Expert specializations

### Modules Created (8 total)

**Beginner Phase**:
- Cybersecurity Fundamentals
- Linux Command Line Basics
- Networking Fundamentals
- Introduction to Web Security

**Intermediate Phase**:
- Penetration Testing Fundamentals
- Advanced Network Security

**Advanced Phase**:
- Advanced Penetration Testing
- Incident Response and Forensics

### Content Created (19 items)

Each module contains multiple types of content:
- **Videos**: Educational content with URLs
- **Labs**: Hands-on exercises with instructions
- **Games**: Interactive security challenges
- **Documents**: Reference materials

**Example Content Structure**:
```
Cybersecurity Fundamentals/
├── Introduction/
│   └── Introduction to Cybersecurity (video)
├── Core Concepts/
│   └── CIA Triad Explained (video)
├── Password Security/
│   └── Password Security Lab (lab)
└── Threat Recognition/
    └── Phishing Detection Challenge (game)
```

### Users Created (4 total)

**Admin Account**:
- Username: `admin`
- Email: `admin@hacktheworld.dev`
- Role: Admin
- Status: Active

**Student Accounts**:
- **Alice**: Intermediate level, 2500 XP, 12 achievements
- **Bob**: Beginner level, 750 XP, 3 achievements  
- **Carol**: Advanced level, 4200 XP, 14 achievements

### User Relationships Created

**Enrollments**: Students randomly enrolled in 1-3 modules each
**Progress**: Varied completion states across different content
**Achievements**: Realistic progress on platform achievements

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
Error: Database connection failed
```
**Solution**: Check your `MONGODB_URI` in `.env`

#### Dependency Validation Failed
```bash
❌ Missing dependencies for content: Module. Please seed these models first.
```
**Solution**: Seed in proper order or use `pnpm seed:all`

#### Duplicate Key Error
```bash
Error: E11000 duplicate key error
```
**Solution**: Clear existing data first: `pnpm seed:clear`

#### Model Validation Error
```bash
UserAchievement validation failed: progress.target: Target is required
```
**Solution**: This is handled automatically by skipping invalid achievements

### Debug Mode

For detailed output during seeding:

```bash
NODE_ENV=development pnpm seed:all
```

### Manual Verification

Check seeded data in MongoDB:

```javascript
// Connect to your MongoDB database
use hacktheworld

// Check collection counts
db.phases.countDocuments()      // Should be 3
db.modules.countDocuments()     // Should be 8
db.contents.countDocuments()    // Should be 19
db.users.countDocuments()       // Should be 4
db.achievements.countDocuments() // Should be 10

// Check relationships
db.modules.findOne({}, {title: 1, phaseId: 1})
db.contents.findOne({}, {title: 1, moduleId: 1})
```

## 🔧 Customization

### Adding Custom Data

Modify the data arrays in `src/utils/seed.js`:

```javascript
// Add new phases
const PHASES_DATA = [
  // existing phases...
  {
    title: "Expert Phase",
    description: "Master-level content",
    icon: "Crown",
    color: "gold",
    order: 4,
  }
];

// Add new achievements
const ACHIEVEMENTS_DATA = [
  // existing achievements...
  {
    slug: "custom-achievement",
    title: "Custom Achievement",
    description: "Complete custom challenge",
    category: "custom",
    // ... rest of achievement data
  }
];
```

### Environment-Specific Seeding

Create environment-specific seed scripts:

```javascript
// package.json
{
  "scripts": {
    "seed:dev": "NODE_ENV=development node src/utils/seed.js all",
    "seed:test": "NODE_ENV=test node src/utils/seed.js all",
    "seed:staging": "NODE_ENV=staging node src/utils/seed.js seed"
  }
}
```

## 📈 Performance Considerations

### Bulk Operations

The system uses efficient bulk operations:
- `insertMany()` for creating multiple documents
- Proper indexing for fast lookups
- Minimal database round trips

### Memory Usage

For large datasets:
- Process data in chunks
- Clear memory between operations
- Monitor database connection pool

### Production Notes

**⚠️ Warning**: This seeding system is designed for development and testing. For production:

1. **Never run in production** without careful consideration
2. **Backup your database** before running any seed commands
3. **Use environment variables** to prevent accidental production seeding
4. **Consider data privacy** when using sample user data

## 🚀 Best Practices

### Development Workflow

1. **Start fresh daily**: `pnpm seed:reseed-all`
2. **Test incrementally**: Use individual commands for specific testing
3. **Verify relationships**: Check that foreign keys resolve correctly
4. **Monitor performance**: Watch for slow operations

### Testing Strategy

```bash
# Unit tests with fresh data
pnpm seed:clear && pnpm test

# Integration tests with full dataset
pnpm seed:all && pnpm test:integration

# Performance tests with large dataset
pnpm seed:all && pnpm test:performance
```

### Data Consistency

- Always use the provided seeding commands
- Don't manually insert data that breaks relationships
- Verify dependency order when adding new models
- Test with fresh data regularly

## 📚 API Integration

### Using Seeded Data in Tests

```javascript
// Example test setup
beforeEach(async () => {
  await seedDatabase(); // Seeds core data
  
  // Get seeded data for tests
  const phases = await Phase.find().sort({ order: 1 });
  const users = await User.find({ role: 'student' });
  
  // Use in your tests
  expect(phases).toHaveLength(3);
  expect(users).toHaveLength(3);
});
```

### API Endpoints with Seeded Data

```javascript
// Test API endpoints with seeded data
describe('API Integration Tests', () => {
  beforeAll(async () => {
    await seedAll(); // Full seeding
  });

  test('GET /api/phases', async () => {
    const response = await request(app).get('/api/phases');
    expect(response.body.data).toHaveLength(3);
  });

  test('GET /api/modules', async () => {
    const response = await request(app).get('/api/modules');
    expect(response.body.data).toHaveLength(8);
  });
});
```

## 🔗 Related Documentation

- **[Development Setup](./DEVELOPMENT_SETUP.md)** - Initial project setup
- **[Database Schema](./DATABASE_SCHEMA.md)** - Model definitions and relationships
- **[API Documentation](./API_DOCUMENTATION.md)** - Endpoint references
- **[Testing Guide](./TESTING_GUIDE.md)** - Testing strategies and best practices

## 📞 Support

For issues with seeding:

1. **Check the logs** for detailed error messages
2. **Verify dependencies** are seeded in correct order
3. **Clear and reseed** if you encounter data inconsistencies
4. **Report bugs** with full error output and steps to reproduce

---

**Last Updated**: June 2025
**Version**: 2.0.0 (Dynamic Seeding System)