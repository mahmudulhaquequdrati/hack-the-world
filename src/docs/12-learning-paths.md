# Learning Paths

## Overview

The platform features a comprehensive learning path system that guides users through structured cybersecurity education, from absolute beginners to advanced practitioners, with personalized progression tracking and adaptive content delivery.

## Course Structure

### Learning Path Hierarchy

```typescript
interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedDuration: string; // e.g., "40 hours"
  prerequisites: string[];
  modules: Module[];
  certifications: string[];
  careerOutcomes: string[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  practicalLabs: Lab[];
  assessment: Assessment;
  estimatedTime: string;
  skills: string[];
}

interface Lesson {
  id: string;
  title: string;
  type: "video" | "interactive" | "reading" | "terminal" | "quiz";
  content: string;
  duration: number; // minutes
  interactiveElements: InteractiveElement[];
  resources: Resource[];
}
```

### Core Learning Paths

#### 1. Cybersecurity Fundamentals

```typescript
const cybersecurityFundamentals: LearningPath = {
  id: "cybersec-fundamentals",
  title: "Cybersecurity Fundamentals",
  difficulty: "beginner",
  estimatedDuration: "30 hours",
  prerequisites: [],
  modules: [
    {
      id: "intro-cybersec",
      title: "Introduction to Cybersecurity",
      lessons: [
        "What is Cybersecurity?",
        "Threat Landscape Overview",
        "CIA Triad Principles",
        "Risk Management Basics",
      ],
    },
    {
      id: "network-security",
      title: "Network Security Basics",
      lessons: [
        "Network Protocols",
        "Firewalls and IDS",
        "VPNs and Encryption",
        "Wireless Security",
      ],
    },
    {
      id: "system-security",
      title: "System Security",
      lessons: [
        "Operating System Hardening",
        "Access Controls",
        "Patch Management",
        "Endpoint Protection",
      ],
    },
  ],
};
```

#### 2. Ethical Hacking & Penetration Testing

```typescript
const ethicalHacking: LearningPath = {
  id: "ethical-hacking",
  title: "Ethical Hacking & Penetration Testing",
  difficulty: "intermediate",
  estimatedDuration: "60 hours",
  prerequisites: ["cybersec-fundamentals"],
  modules: [
    {
      id: "recon-footprinting",
      title: "Reconnaissance & Footprinting",
      lessons: [
        "Information Gathering",
        "OSINT Techniques",
        "Network Scanning",
        "Vulnerability Assessment",
      ],
    },
    {
      id: "exploitation",
      title: "Exploitation Techniques",
      lessons: [
        "Web Application Testing",
        "System Exploitation",
        "Social Engineering",
        "Post-Exploitation",
      ],
    },
  ],
};
```

## Progression System

### Skill Tree Architecture

```typescript
interface SkillTree {
  domains: SkillDomain[];
  userProgress: UserProgress;
}

interface SkillDomain {
  id: string;
  name: string;
  color: string;
  skills: Skill[];
  prerequisites: string[];
}

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number; // 1-5
  xpRequired: number;
  prerequisites: string[];
  assessments: string[];
  badges: Badge[];
}

interface UserProgress {
  userId: string;
  completedLessons: string[];
  skillLevels: { [skillId: string]: number };
  xpEarned: { [skillId: string]: number };
  badges: Badge[];
  currentStreak: number;
  totalStudyTime: number;
}
```

### XP and Leveling System

```typescript
class ProgressionEngine {
  calculateXP(activity: Activity): number {
    const baseXP = {
      "lesson-complete": 100,
      "quiz-perfect": 50,
      "lab-complete": 200,
      "challenge-solve": 300,
      "certification-earn": 1000,
    };

    const difficultyMultiplier = {
      beginner: 1.0,
      intermediate: 1.5,
      advanced: 2.0,
      expert: 3.0,
    };

    return baseXP[activity.type] * difficultyMultiplier[activity.difficulty];
  }

  calculateLevel(totalXP: number): number {
    // Exponential leveling curve
    return Math.floor(Math.sqrt(totalXP / 100));
  }

  getRequiredXPForNextLevel(currentLevel: number): number {
    return Math.pow(currentLevel + 1, 2) * 100;
  }
}
```

## Adaptive Learning

### Personalization Engine

```typescript
class AdaptiveLearningEngine {
  analyzeUserProgress(user: UserProgress): LearningRecommendations {
    const strongAreas = this.identifyStrongAreas(user);
    const weakAreas = this.identifyWeakAreas(user);
    const learningStyle = this.detectLearningStyle(user);

    return {
      nextRecommendedLessons: this.recommendLessons(user, weakAreas),
      reviewTopics: weakAreas,
      advancedChallenges: strongAreas,
      studyPlan: this.generateStudyPlan(user, learningStyle),
    };
  }

  adjustDifficulty(user: UserProgress, lesson: Lesson): Lesson {
    const performanceScore = this.calculatePerformanceScore(user);

    if (performanceScore > 0.8) {
      return this.increaseDifficulty(lesson);
    } else if (performanceScore < 0.6) {
      return this.decreaseDifficulty(lesson);
    }

    return lesson;
  }
}
```

### Learning Style Detection

```typescript
interface LearningStyle {
  visual: number; // 0-1 preference for visual content
  auditory: number; // 0-1 preference for audio content
  kinesthetic: number; // 0-1 preference for hands-on labs
  reading: number; // 0-1 preference for text-based content
}

class LearningStyleDetector {
  detectStyle(userActivity: UserActivity[]): LearningStyle {
    const preferences = this.analyzeEngagementPatterns(userActivity);
    const completionRates = this.analyzeCompletionRates(userActivity);
    const timeSpent = this.analyzeTimeSpent(userActivity);

    return this.synthesizeLearningStyle(
      preferences,
      completionRates,
      timeSpent
    );
  }
}
```

## Assessment System

### Multi-Modal Assessments

```typescript
interface Assessment {
  id: string;
  type: "quiz" | "practical" | "project" | "certification";
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
  prerequisites: string[];
}

interface Question {
  id: string;
  type: "multiple-choice" | "code-challenge" | "scenario" | "simulation";
  content: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: string;
  tags: string[];
}

// Practical Assessment Example
const networkSecurityLab: Assessment = {
  id: "network-security-lab",
  type: "practical",
  questions: [
    {
      type: "simulation",
      content:
        "Configure a firewall to block specific traffic while allowing legitimate connections",
      scenarios: [
        "Block all incoming connections except SSH and HTTPS",
        "Allow outbound traffic for specific applications",
        "Implement rate limiting for specific services",
      ],
    },
  ],
};
```

### Real-time Performance Analytics

```typescript
class AssessmentAnalytics {
  trackPerformance(
    userId: string,
    assessmentId: string,
    responses: Response[]
  ) {
    const metrics = {
      accuracy: this.calculateAccuracy(responses),
      speed: this.calculateResponseTime(responses),
      confidence: this.analyzeConfidencePatterns(responses),
      knowledgeGaps: this.identifyKnowledgeGaps(responses),
    };

    this.updateUserProfile(userId, metrics);
    this.generateFeedback(userId, metrics);
  }

  generatePersonalizedFeedback(metrics: PerformanceMetrics): Feedback {
    return {
      strengths: this.identifyStrengths(metrics),
      improvements: this.suggestImprovements(metrics),
      nextSteps: this.recommendNextSteps(metrics),
      resources: this.curateResources(metrics),
    };
  }
}
```

## Career Path Integration

### Industry-Aligned Tracks

```typescript
const careerTracks: CareerTrack[] = [
  {
    id: "security-analyst",
    title: "Security Analyst",
    description: "Monitor and protect organizational assets",
    requiredSkills: [
      "Incident Response",
      "SIEM Tools",
      "Threat Analysis",
      "Security Monitoring",
    ],
    learningPaths: ["cybersec-fundamentals", "incident-response"],
    certifications: ["CompTIA Security+", "GCIH"],
    salaryRange: "$60,000 - $90,000",
    jobOutlook: "Excellent",
  },
  {
    id: "penetration-tester",
    title: "Penetration Tester",
    description: "Identify vulnerabilities through ethical hacking",
    requiredSkills: [
      "Ethical Hacking",
      "Vulnerability Assessment",
      "Report Writing",
      "Tool Proficiency",
    ],
    learningPaths: ["ethical-hacking", "web-app-security"],
    certifications: ["CEH", "OSCP", "CISSP"],
    salaryRange: "$80,000 - $130,000",
    jobOutlook: "Very High",
  },
];
```

### Certification Mapping

```typescript
interface Certification {
  id: string;
  name: string;
  provider: string;
  difficulty: string;
  prerequisites: string[];
  mappedLessons: string[];
  practiceExams: string[];
  studyGuides: string[];
  examDetails: {
    duration: number;
    questions: number;
    passingScore: number;
    cost: number;
  };
}

// Example: CompTIA Security+ mapping
const securityPlusCert: Certification = {
  id: "comptia-security-plus",
  name: "CompTIA Security+",
  provider: "CompTIA",
  difficulty: "intermediate",
  prerequisites: ["cybersec-fundamentals"],
  mappedLessons: [
    "network-security-fundamentals",
    "cryptography-basics",
    "identity-access-management",
    "risk-management",
    "incident-response",
  ],
  practiceExams: ["sec-plus-practice-1", "sec-plus-practice-2"],
  examDetails: {
    duration: 90,
    questions: 90,
    passingScore: 750,
    cost: 370,
  },
};
```

## Social Learning Features

### Study Groups and Collaboration

```typescript
interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: User[];
  learningPath: string;
  schedule: StudySession[];
  sharedResources: Resource[];
  discussions: Discussion[];
}

interface StudySession {
  id: string;
  title: string;
  scheduledTime: Date;
  duration: number;
  topics: string[];
  facilitator: User;
  attendees: User[];
  recordings?: string;
}
```

### Peer Learning and Mentorship

```typescript
class MentorshipSystem {
  matchMentorMentee(mentee: User): User[] {
    const criteria = {
      skillAlignment: this.calculateSkillGap(mentee),
      learningStyle: mentee.profile.learningStyle,
      availability: mentee.preferences.mentorshipTime,
      goals: mentee.careerGoals,
    };

    return this.findCompatibleMentors(criteria);
  }

  facilitateKnowledgeSharing(users: User[]): KnowledgeExchange[] {
    return users.map((user) => ({
      expertise: user.strongSkills,
      learningNeeds: user.weakSkills,
      potentialConnections: this.findComplementaryUsers(user, users),
    }));
  }
}
```

## Progress Tracking and Analytics

### Learning Dashboard

```typescript
interface LearningDashboard {
  overallProgress: {
    completedLessons: number;
    totalLessons: number;
    skillsAcquired: number;
    certificationProgress: CertificationProgress[];
  };
  recentActivity: Activity[];
  upcomingDeadlines: Deadline[];
  recommendations: Recommendation[];
  performanceMetrics: PerformanceMetrics;
  streakData: StreakData;
}

interface PerformanceMetrics {
  averageQuizScore: number;
  labCompletionRate: number;
  studyTimeThisWeek: number;
  conceptsMastered: number;
  challengesSolved: number;
}
```

### Predictive Analytics

```typescript
class LearningAnalytics {
  predictCourseCompletion(userId: string, courseId: string): Prediction {
    const userHistory = this.getUserLearningHistory(userId);
    const courseData = this.getCourseData(courseId);

    return {
      estimatedCompletionDate: this.calculateCompletionDate(
        userHistory,
        courseData
      ),
      successProbability: this.calculateSuccessProbability(userHistory),
      recommendedStudySchedule: this.optimizeStudySchedule(
        userHistory,
        courseData
      ),
      riskFactors: this.identifyRiskFactors(userHistory),
    };
  }

  generateInsights(userId: string): LearningInsights {
    const data = this.aggregateUserData(userId);

    return {
      learningVelocity: this.calculateLearningVelocity(data),
      optimalStudyTimes: this.identifyOptimalStudyTimes(data),
      knowledgeRetention: this.analyzeRetention(data),
      improvementAreas: this.identifyImprovementAreas(data),
    };
  }
}
```

## Gamification Elements

### Achievement System

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
  criteria: AchievementCriteria;
}

const achievements: Achievement[] = [
  {
    id: "first-lesson",
    name: "First Steps",
    description: "Complete your first lesson",
    rarity: "common",
    xpReward: 50,
    criteria: { lessonsCompleted: 1 },
  },
  {
    id: "week-streak",
    name: "Consistent Learner",
    description: "Study for 7 consecutive days",
    rarity: "rare",
    xpReward: 200,
    criteria: { studyStreak: 7 },
  },
  {
    id: "hack-master",
    name: "Hack Master",
    description: "Successfully complete 50 hacking challenges",
    rarity: "epic",
    xpReward: 1000,
    criteria: { hackingChallengesCompleted: 50 },
  },
];
```

### Leaderboards and Competition

```typescript
interface Leaderboard {
  id: string;
  name: string;
  type: "weekly" | "monthly" | "all-time" | "course-specific";
  metric: "xp" | "lessons" | "challenges" | "streak";
  entries: LeaderboardEntry[];
  rewards: Reward[];
}

interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  change: number; // position change from last period
}
```

## Future Enhancements

- **AI-powered content generation**: Dynamic lesson creation
- **VR/AR learning experiences**: Immersive cybersecurity simulations
- **Blockchain credentials**: Verifiable skill certificates
- **Industry partnerships**: Real-world project collaborations
