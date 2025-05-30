# Security

## Overview

The platform implements comprehensive security measures including authentication, authorization, data protection, threat detection, and compliance with industry standards to ensure user data safety and platform integrity.

## Authentication & Authorization

### Multi-Factor Authentication (MFA)

```typescript
interface MFAProvider {
  type: "totp" | "sms" | "email" | "hardware-key";
  enabled: boolean;
  configureProvider(user: User): Promise<MFASetupResult>;
  verifyToken(user: User, token: string): Promise<boolean>;
}

class TOTPProvider implements MFAProvider {
  type = "totp" as const;
  enabled = true;

  async configureProvider(user: User): Promise<MFASetupResult> {
    const secret = generateTOTPSecret();
    const qrCodeUrl = generateQRCode(user.email, secret);

    await this.saveMFASecret(user.id, secret);

    return {
      secret,
      qrCodeUrl,
      backupCodes: generateBackupCodes(),
    };
  }

  async verifyToken(user: User, token: string): Promise<boolean> {
    const secret = await this.getMFASecret(user.id);
    return verifyTOTPToken(token, secret);
  }

  private async saveMFASecret(userId: string, secret: string): Promise<void> {
    const encryptedSecret = await encrypt(secret, getMasterKey());
    await db.userMFA.upsert({
      where: { userId },
      update: { totpSecret: encryptedSecret },
      create: { userId, totpSecret: encryptedSecret },
    });
  }
}

class HardwareKeyProvider implements MFAProvider {
  type = "hardware-key" as const;
  enabled = true;

  async configureProvider(user: User): Promise<MFASetupResult> {
    const credentialCreationOptions = {
      challenge: new Uint8Array(32),
      rp: { id: "cyber-platform.com", name: "Cyber Learning Platform" },
      user: {
        id: stringToArrayBuffer(user.id),
        name: user.email,
        displayName: user.name,
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },
    };

    return { credentialOptions: credentialCreationOptions };
  }

  async verifyToken(user: User, assertion: any): Promise<boolean> {
    // Verify WebAuthn assertion
    return await verifyWebAuthnAssertion(user.id, assertion);
  }
}
```

### JWT Implementation

```typescript
interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  permissions: Permission[];
  iat: number;
  exp: number;
  jti: string; // JWT ID for revocation
  sessionId: string;
}

class JWTService {
  private accessTokenTTL = 15 * 60; // 15 minutes
  private refreshTokenTTL = 7 * 24 * 60 * 60; // 7 days

  async generateTokenPair(user: User): Promise<TokenPair> {
    const jti = generateUUID();
    const sessionId = generateSessionId();

    const accessToken = await this.generateAccessToken(user, jti, sessionId);
    const refreshToken = await this.generateRefreshToken(user, sessionId);

    // Store session for tracking
    await this.storeSession(sessionId, user.id);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(
    user: User,
    jti: string,
    sessionId: string
  ): Promise<string> {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: await this.getUserPermissions(user.id),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.accessTokenTTL,
      jti,
      sessionId,
    };

    return jwt.sign(payload, getPrivateKey(), { algorithm: "RS256" });
  }

  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const payload = jwt.verify(token, getPublicKey()) as JWTPayload;

      // Check if token is revoked
      if (await this.isTokenRevoked(payload.jti)) {
        return null;
      }

      // Check if session is still valid
      if (!(await this.isSessionValid(payload.sessionId))) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  async revokeToken(jti: string): Promise<void> {
    await redis.setex(`revoked_token:${jti}`, this.accessTokenTTL, "1");
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.revokeAllUserSessions(userId);
  }
}
```

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

enum Permission {
  // Course permissions
  VIEW_COURSES = "view_courses",
  CREATE_COURSES = "create_courses",
  EDIT_COURSES = "edit_courses",
  DELETE_COURSES = "delete_courses",

  // User permissions
  VIEW_USERS = "view_users",
  MANAGE_USERS = "manage_users",

  // Lab permissions
  ACCESS_LABS = "access_labs",
  CREATE_LABS = "create_labs",

  // Analytics permissions
  VIEW_ANALYTICS = "view_analytics",
  EXPORT_DATA = "export_data",

  // System permissions
  SYSTEM_CONFIG = "system_config",
  SECURITY_AUDIT = "security_audit",
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [Permission.VIEW_COURSES, Permission.ACCESS_LABS],
  [UserRole.INSTRUCTOR]: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSES,
    Permission.EDIT_COURSES,
    Permission.ACCESS_LABS,
    Permission.CREATE_LABS,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.ADMIN]: [
    ...ROLE_PERMISSIONS[UserRole.INSTRUCTOR],
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.DELETE_COURSES,
    Permission.EXPORT_DATA,
  ],
  [UserRole.SUPER_ADMIN]: [...Object.values(Permission)],
};

class AuthorizationService {
  hasPermission(user: User, permission: Permission): boolean {
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return userPermissions.includes(permission);
  }

  hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some((permission) =>
      this.hasPermission(user, permission)
    );
  }

  hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every((permission) =>
      this.hasPermission(user, permission)
    );
  }

  // Resource-based authorization
  async canAccessResource(
    user: User,
    resource: Resource,
    action: string
  ): Promise<boolean> {
    // Check basic permission
    if (!this.hasPermission(user, resource.requiredPermission)) {
      return false;
    }

    // Check ownership or delegation
    if (resource.ownerId === user.id) {
      return true;
    }

    // Check if user has been granted access
    return await this.hasResourceAccess(user.id, resource.id, action);
  }
}

// Authorization middleware
const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const authService = new AuthorizationService();
    if (!authService.hasPermission(user, permission)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

// Usage in routes
app.get(
  "/api/users",
  requirePermission(Permission.VIEW_USERS),
  getUsersHandler
);
app.post(
  "/api/courses",
  requirePermission(Permission.CREATE_COURSES),
  createCourseHandler
);
```

## Data Protection

### Encryption at Rest

```typescript
class EncryptionService {
  private algorithm = "aes-256-gcm";
  private keyDerivationIterations = 100000;

  async encryptSensitiveData(
    data: string,
    context?: string
  ): Promise<EncryptedData> {
    const key = await this.deriveKey(context);
    const iv = randomBytes(16);
    const cipher = createCipher(this.algorithm, key, { iv });

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
      algorithm: this.algorithm,
    };
  }

  async decryptSensitiveData(
    encryptedData: EncryptedData,
    context?: string
  ): Promise<string> {
    const key = await this.deriveKey(context);
    const decipher = createDecipher(encryptedData.algorithm, key, {
      iv: Buffer.from(encryptedData.iv, "hex"),
      authTag: Buffer.from(encryptedData.authTag, "hex"),
    });

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  private async deriveKey(context?: string): Promise<Buffer> {
    const masterKey = getMasterKey();
    const salt = context ? Buffer.from(context, "utf8") : Buffer.alloc(32, 0);

    return pbkdf2Sync(
      masterKey,
      salt,
      this.keyDerivationIterations,
      32,
      "sha256"
    );
  }

  // Field-level encryption for database
  async encryptUserData(userData: UserData): Promise<EncryptedUserData> {
    return {
      id: userData.id,
      email: userData.email, // Not encrypted - needed for queries
      encryptedSSN: await this.encryptSensitiveData(userData.ssn, "ssn"),
      encryptedAddress: await this.encryptSensitiveData(
        userData.address,
        "address"
      ),
      encryptedPhone: await this.encryptSensitiveData(userData.phone, "phone"),
    };
  }
}

// Database encryption hooks
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  ssn: { type: EncryptedField, required: false },
  address: { type: EncryptedField, required: false },
  phone: { type: EncryptedField, required: false },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("ssn") && this.ssn) {
    this.ssn = await encryptionService.encryptSensitiveData(this.ssn, "ssn");
  }
  next();
});
```

### Data Loss Prevention (DLP)

```typescript
class DLPService {
  private sensitivePatterns = [
    { name: "SSN", pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
    {
      name: "Credit Card",
      pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    },
    {
      name: "Email",
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    },
    { name: "API Key", pattern: /\b[A-Za-z0-9]{32,}\b/g },
  ];

  scanContent(content: string): DLPScanResult {
    const findings: DLPFinding[] = [];

    for (const pattern of this.sensitivePatterns) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        findings.push({
          type: pattern.name,
          matches: matches.length,
          locations: this.findMatchLocations(content, pattern.pattern),
        });
      }
    }

    return {
      hasViolations: findings.length > 0,
      findings,
      riskLevel: this.calculateRiskLevel(findings),
    };
  }

  async sanitizeContent(
    content: string,
    options: SanitizationOptions = {}
  ): Promise<string> {
    let sanitized = content;

    for (const pattern of this.sensitivePatterns) {
      if (options.mask?.includes(pattern.name)) {
        sanitized = sanitized.replace(pattern.pattern, this.maskValue);
      } else if (options.remove?.includes(pattern.name)) {
        sanitized = sanitized.replace(pattern.pattern, "");
      }
    }

    return sanitized;
  }

  private maskValue(match: string): string {
    return "*".repeat(match.length);
  }

  private calculateRiskLevel(
    findings: DLPFinding[]
  ): "low" | "medium" | "high" {
    const totalFindings = findings.reduce((sum, f) => sum + f.matches, 0);

    if (totalFindings === 0) return "low";
    if (totalFindings <= 3) return "medium";
    return "high";
  }
}

// Middleware for scanning uploads
const dlpScanMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "string") {
    const dlpService = new DLPService();
    const scanResult = dlpService.scanContent(req.body);

    if (scanResult.hasViolations && scanResult.riskLevel === "high") {
      await logSecurityEvent("DLP_VIOLATION", {
        userId: req.user?.id,
        content: req.body.substring(0, 100),
        findings: scanResult.findings,
      });

      return res.status(400).json({
        error: "Content contains sensitive information",
        findings: scanResult.findings,
      });
    }
  }

  next();
};
```

## Threat Detection

### Intrusion Detection System (IDS)

```typescript
class IntrusionDetectionSystem {
  private suspiciousActivities = new Map<string, SuspiciousActivity[]>();
  private ipWhitelist = new Set<string>();
  private ipBlacklist = new Set<string>();

  async analyzeRequest(req: Request): Promise<ThreatAssessment> {
    const clientIP = this.getClientIP(req);
    const userAgent = req.get("User-Agent") || "";
    const endpoint = req.path;

    const threats: ThreatIndicator[] = [];

    // Check IP reputation
    if (this.ipBlacklist.has(clientIP)) {
      threats.push({
        type: "BLACKLISTED_IP",
        severity: "high",
        description: `Request from blacklisted IP: ${clientIP}`,
      });
    }

    // Check for SQL injection patterns
    if (this.detectSQLInjection(req)) {
      threats.push({
        type: "SQL_INJECTION",
        severity: "high",
        description: "Potential SQL injection detected",
      });
    }

    // Check for XSS patterns
    if (this.detectXSS(req)) {
      threats.push({
        type: "XSS_ATTEMPT",
        severity: "medium",
        description: "Potential XSS attack detected",
      });
    }

    // Check for brute force attempts
    if (await this.detectBruteForce(clientIP, endpoint)) {
      threats.push({
        type: "BRUTE_FORCE",
        severity: "high",
        description: "Brute force attack detected",
      });
    }

    // Check for unusual user agent
    if (this.detectSuspiciousUserAgent(userAgent)) {
      threats.push({
        type: "SUSPICIOUS_USER_AGENT",
        severity: "low",
        description: "Suspicious user agent detected",
      });
    }

    const riskScore = this.calculateRiskScore(threats);

    return {
      threats,
      riskScore,
      action: this.determineAction(riskScore),
      clientIP,
    };
  }

  private detectSQLInjection(req: Request): boolean {
    const sqlPatterns = [
      /(\bunion\b.*\bselect\b)|(\bselect\b.*\bunion\b)/i,
      /(\bdrop\b.*\btable\b)|(\btable\b.*\bdrop\b)/i,
      /(\binsert\b.*\binto\b)|(\binto\b.*\binsert\b)/i,
      /(\bdelete\b.*\bfrom\b)|(\bfrom\b.*\bdelete\b)/i,
      /(\bupdate\b.*\bset\b)|(\bset\b.*\bupdate\b)/i,
      /(\band\b.*\bor\b.*\b=\b)|(\bor\b.*\band\b.*\b=\b)/i,
    ];

    const testString =
      JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
    return sqlPatterns.some((pattern) => pattern.test(testString));
  }

  private detectXSS(req: Request): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    ];

    const testString = JSON.stringify(req.body) + JSON.stringify(req.query);
    return xssPatterns.some((pattern) => pattern.test(testString));
  }

  private async detectBruteForce(
    ip: string,
    endpoint: string
  ): Promise<boolean> {
    const key = `${ip}:${endpoint}`;
    const attempts = (await redis.get(`attempts:${key}`)) || "0";
    const attemptCount = parseInt(attempts);

    // More than 10 requests per minute to sensitive endpoints
    if (this.isSensitiveEndpoint(endpoint) && attemptCount > 10) {
      return true;
    }

    // More than 100 requests per minute to any endpoint
    if (attemptCount > 100) {
      return true;
    }

    // Increment attempt counter
    await redis.setex(`attempts:${key}`, 60, (attemptCount + 1).toString());

    return false;
  }

  async blockIP(ip: string, duration: number = 3600): Promise<void> {
    this.ipBlacklist.add(ip);
    await redis.setex(`blocked_ip:${ip}`, duration, "1");

    await logSecurityEvent("IP_BLOCKED", {
      ip,
      duration,
      timestamp: new Date(),
    });
  }

  async reportThreat(
    assessment: ThreatAssessment,
    req: Request
  ): Promise<void> {
    if (assessment.riskScore > 70) {
      await this.alertSecurityTeam(assessment, req);
    }

    await this.logThreatAssessment(assessment, req);

    if (assessment.action === "block") {
      await this.blockIP(assessment.clientIP);
    }
  }
}

// IDS Middleware
const idsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ids = new IntrusionDetectionSystem();
  const assessment = await ids.analyzeRequest(req);

  if (assessment.action === "block") {
    await ids.reportThreat(assessment, req);
    return res.status(403).json({
      error: "Request blocked due to security concerns",
      requestId: generateRequestId(),
    });
  }

  if (assessment.action === "challenge") {
    // Implement CAPTCHA or additional verification
    return res.status(429).json({
      error: "Additional verification required",
      challenge: await generateSecurityChallenge(),
    });
  }

  if (assessment.riskScore > 50) {
    await ids.reportThreat(assessment, req);
  }

  req.securityAssessment = assessment;
  next();
};
```

### Security Monitoring

```typescript
class SecurityMonitor {
  private eventQueue: SecurityEvent[] = [];
  private alertThresholds = {
    failedLogins: 5,
    suspiciousIPs: 3,
    dataExfiltration: 1,
    privilegeEscalation: 1,
  };

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    // Store in database
    await db.securityEvents.create({
      data: {
        type: event.type,
        severity: event.severity,
        userId: event.userId,
        ip: event.ip,
        userAgent: event.userAgent,
        details: event.details,
        timestamp: new Date(),
      },
    });

    // Add to real-time monitoring queue
    this.eventQueue.push(event);

    // Check for alert conditions
    await this.checkAlertConditions(event);

    // Real-time dashboard update
    await this.updateDashboard(event);
  }

  private async checkAlertConditions(event: SecurityEvent): Promise<void> {
    const recentEvents = await this.getRecentEvents(15); // Last 15 minutes

    // Failed login attempts from same IP
    const failedLogins = recentEvents.filter(
      (e) => e.type === "FAILED_LOGIN" && e.ip === event.ip
    ).length;

    if (failedLogins >= this.alertThresholds.failedLogins) {
      await this.triggerAlert("MULTIPLE_FAILED_LOGINS", {
        ip: event.ip,
        count: failedLogins,
        timeWindow: "15 minutes",
      });
    }

    // Suspicious IP activity
    const suspiciousActivities = recentEvents.filter(
      (e) =>
        e.ip === event.ip &&
        ["THREAT_DETECTED", "BLOCKED_REQUEST"].includes(e.type)
    ).length;

    if (suspiciousActivities >= this.alertThresholds.suspiciousIPs) {
      await this.triggerAlert("SUSPICIOUS_IP_ACTIVITY", {
        ip: event.ip,
        activities: suspiciousActivities,
      });
    }

    // Data exfiltration attempts
    if (event.type === "DATA_EXPORT" && event.details?.volume > 10000) {
      await this.triggerAlert("POTENTIAL_DATA_EXFILTRATION", {
        userId: event.userId,
        volume: event.details.volume,
        type: event.details.dataType,
      });
    }
  }

  async generateSecurityReport(
    timeframe: "daily" | "weekly" | "monthly"
  ): Promise<SecurityReport> {
    const events = await this.getEventsInTimeframe(timeframe);

    const report: SecurityReport = {
      timeframe,
      summary: {
        totalEvents: events.length,
        criticalEvents: events.filter((e) => e.severity === "critical").length,
        highEvents: events.filter((e) => e.severity === "high").length,
        blockedIPs: new Set(
          events.filter((e) => e.type === "IP_BLOCKED").map((e) => e.ip)
        ).size,
      },
      topThreats: this.analyzeTopThreats(events),
      recommendations: await this.generateRecommendations(events),
      trends: this.analyzeTrends(events),
    };

    return report;
  }

  private async triggerAlert(type: string, details: any): Promise<void> {
    const alert: SecurityAlert = {
      id: generateUUID(),
      type,
      severity: this.getAlertSeverity(type),
      details,
      timestamp: new Date(),
      acknowledged: false,
    };

    // Store alert
    await db.securityAlerts.create({ data: alert });

    // Send notifications
    await this.sendSecurityNotifications(alert);

    // Auto-response actions
    await this.executeAutoResponse(alert);
  }

  private async sendSecurityNotifications(alert: SecurityAlert): Promise<void> {
    // Email security team
    await emailService.send({
      to: getSecurityTeamEmails(),
      subject: `Security Alert: ${alert.type}`,
      template: "security-alert",
      data: alert,
    });

    // Slack notification
    await slackService.sendMessage({
      channel: "#security-alerts",
      text: `🚨 Security Alert: ${alert.type}`,
      attachments: [
        {
          color: this.getAlertColor(alert.severity),
          fields: [
            { title: "Type", value: alert.type, short: true },
            { title: "Severity", value: alert.severity, short: true },
            { title: "Details", value: JSON.stringify(alert.details, null, 2) },
          ],
        },
      ],
    });

    // PagerDuty for critical alerts
    if (alert.severity === "critical") {
      await pagerDutyService.triggerIncident({
        routingKey: getPagerDutyKey(),
        eventAction: "trigger",
        payload: {
          summary: `Critical Security Alert: ${alert.type}`,
          source: "cyber-platform-security",
          severity: "critical",
          customDetails: alert.details,
        },
      });
    }
  }
}
```

## Compliance & Auditing

### GDPR Compliance

```typescript
class GDPRComplianceService {
  async handleDataSubjectRequest(
    request: DataSubjectRequest
  ): Promise<DataSubjectResponse> {
    switch (request.type) {
      case "access":
        return await this.handleAccessRequest(request);
      case "rectification":
        return await this.handleRectificationRequest(request);
      case "erasure":
        return await this.handleErasureRequest(request);
      case "portability":
        return await this.handlePortabilityRequest(request);
      case "restriction":
        return await this.handleRestrictionRequest(request);
      default:
        throw new Error(`Unsupported request type: ${request.type}`);
    }
  }

  private async handleAccessRequest(
    request: DataSubjectRequest
  ): Promise<DataSubjectResponse> {
    const userId = await this.verifyDataSubject(request);

    // Collect all personal data
    const userData = await this.collectUserData(userId);

    // Generate data export
    const exportData = {
      personalInformation: userData.profile,
      learningProgress: userData.progress,
      assessments: userData.assessments,
      communications: userData.communications,
      loginHistory: userData.loginHistory,
    };

    // Log the access request
    await this.logDataSubjectRequest(request, "completed");

    return {
      requestId: request.id,
      status: "completed",
      data: exportData,
      format: "json",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }

  private async handleErasureRequest(
    request: DataSubjectRequest
  ): Promise<DataSubjectResponse> {
    const userId = await this.verifyDataSubject(request);

    // Check if erasure is legally possible
    const canErase = await this.checkErasureLegality(userId);

    if (!canErase.allowed) {
      return {
        requestId: request.id,
        status: "rejected",
        reason: canErase.reason,
      };
    }

    // Perform data erasure
    await this.eraseUserData(userId);

    // Anonymize data that must be retained
    await this.anonymizeRetainedData(userId);

    await this.logDataSubjectRequest(request, "completed");

    return {
      requestId: request.id,
      status: "completed",
      message: "Personal data has been erased",
    };
  }

  private async eraseUserData(userId: string): Promise<void> {
    const tables = [
      "users",
      "user_profiles",
      "user_preferences",
      "user_sessions",
      "user_communications",
      "user_files",
    ];

    for (const table of tables) {
      await db.raw(`DELETE FROM ${table} WHERE user_id = ?`, [userId]);
    }

    // Soft delete from tables that need audit trail
    await db.user_progress.updateMany({
      where: { userId },
      data: {
        deleted: true,
        deletedAt: new Date(),
        personalDataErased: true,
      },
    });
  }

  async checkConsentStatus(userId: string): Promise<ConsentStatus> {
    const consents = await db.userConsents.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      marketing: this.getLatestConsent(consents, "marketing"),
      analytics: this.getLatestConsent(consents, "analytics"),
      functional: this.getLatestConsent(consents, "functional"),
      lastUpdated: consents[0]?.createdAt,
    };
  }

  async recordConsent(userId: string, consentData: ConsentData): Promise<void> {
    await db.userConsents.create({
      data: {
        userId,
        type: consentData.type,
        granted: consentData.granted,
        version: await this.getCurrentPolicyVersion(),
        ipAddress: consentData.ipAddress,
        userAgent: consentData.userAgent,
        createdAt: new Date(),
      },
    });

    // Update user preferences based on consent
    await this.updateUserPreferences(userId, consentData);
  }
}
```

### Security Audit Logging

```typescript
class AuditLogger {
  async logUserAction(action: UserAction): Promise<void> {
    const auditEntry: AuditEntry = {
      id: generateUUID(),
      timestamp: new Date(),
      userId: action.userId,
      action: action.type,
      resource: action.resource,
      resourceId: action.resourceId,
      details: action.details,
      ipAddress: action.ipAddress,
      userAgent: action.userAgent,
      sessionId: action.sessionId,
      outcome: action.outcome,
    };

    // Store in audit log database
    await this.storeAuditEntry(auditEntry);

    // Send to SIEM system
    await this.sendToSIEM(auditEntry);

    // Check for suspicious patterns
    await this.analyzeForAnomalies(auditEntry);
  }

  async logSystemEvent(event: SystemEvent): Promise<void> {
    const auditEntry: AuditEntry = {
      id: generateUUID(),
      timestamp: new Date(),
      action: event.type,
      resource: "system",
      details: event.details,
      outcome: event.outcome,
      severity: event.severity,
    };

    await this.storeAuditEntry(auditEntry);
    await this.sendToSIEM(auditEntry);
  }

  async generateAuditReport(criteria: AuditCriteria): Promise<AuditReport> {
    const entries = await this.queryAuditEntries(criteria);

    return {
      criteria,
      totalEntries: entries.length,
      dateRange: {
        start: criteria.startDate,
        end: criteria.endDate,
      },
      summary: this.summarizeAuditEntries(entries),
      entries: entries.slice(0, criteria.maxEntries || 1000),
      generatedAt: new Date(),
      generatedBy: criteria.requestedBy,
    };
  }

  private async storeAuditEntry(entry: AuditEntry): Promise<void> {
    // Store in tamper-evident format
    const hash = this.calculateEntryHash(entry);
    const signature = await this.signEntry(entry);

    await db.auditLog.create({
      data: {
        ...entry,
        hash,
        signature,
        previousHash: await this.getLastEntryHash(),
      },
    });
  }

  private calculateEntryHash(entry: AuditEntry): string {
    const data = JSON.stringify({
      timestamp: entry.timestamp,
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
    });

    return createHash("sha256").update(data).digest("hex");
  }

  async verifyAuditIntegrity(): Promise<IntegrityCheck> {
    const entries = await db.auditLog.findMany({
      orderBy: { timestamp: "asc" },
    });

    let previousHash = "";
    const tamperedEntries: string[] = [];

    for (const entry of entries) {
      const expectedHash = this.calculateEntryHash(entry);

      if (entry.hash !== expectedHash) {
        tamperedEntries.push(entry.id);
      }

      if (entry.previousHash !== previousHash && previousHash !== "") {
        tamperedEntries.push(entry.id);
      }

      previousHash = entry.hash;
    }

    return {
      isIntact: tamperedEntries.length === 0,
      tamperedEntries,
      totalEntries: entries.length,
      checkedAt: new Date(),
    };
  }
}
```

## API Security

### Rate Limiting

```typescript
class RateLimiter {
  private redis: Redis;
  private defaultLimits = {
    general: { requests: 100, window: 60 }, // 100 requests per minute
    auth: { requests: 5, window: 60 }, // 5 login attempts per minute
    api: { requests: 1000, window: 3600 }, // 1000 API calls per hour
    upload: { requests: 10, window: 60 }, // 10 uploads per minute
  };

  async checkLimit(
    identifier: string,
    category: string = "general",
    customLimit?: RateLimit
  ): Promise<RateLimitResult> {
    const limit = customLimit || this.defaultLimits[category];
    const key = `rate_limit:${category}:${identifier}`;

    const current = await this.redis.get(key);
    const currentCount = current ? parseInt(current) : 0;

    if (currentCount >= limit.requests) {
      const ttl = await this.redis.ttl(key);
      return {
        allowed: false,
        limit: limit.requests,
        remaining: 0,
        resetTime: new Date(Date.now() + ttl * 1000),
        retryAfter: ttl,
      };
    }

    // Increment counter
    const newCount = await this.redis.incr(key);
    if (newCount === 1) {
      await this.redis.expire(key, limit.window);
    }

    return {
      allowed: true,
      limit: limit.requests,
      remaining: limit.requests - newCount,
      resetTime: new Date(Date.now() + limit.window * 1000),
    };
  }

  // Sliding window rate limiter
  async checkSlidingWindow(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<boolean> {
    const key = `sliding:${identifier}`;
    const now = Date.now();
    const cutoff = now - windowMs;

    // Remove old entries
    await this.redis.zremrangebyscore(key, "-inf", cutoff);

    // Count current requests
    const count = await this.redis.zcard(key);

    if (count >= limit) {
      return false;
    }

    // Add current request
    await this.redis.zadd(key, now, `${now}-${Math.random()}`);
    await this.redis.expire(key, Math.ceil(windowMs / 1000));

    return true;
  }
}

// Rate limiting middleware
const rateLimitMiddleware = (category: string = "general") => {
  const limiter = new RateLimiter();

  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.user?.id || req.ip;
    const result = await limiter.checkLimit(identifier, category);

    // Add rate limit headers
    res.set({
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": result.resetTime.toISOString(),
    });

    if (!result.allowed) {
      res.set("Retry-After", result.retryAfter.toString());
      return res.status(429).json({
        error: "Rate limit exceeded",
        retryAfter: result.retryAfter,
      });
    }

    next();
  };
};
```

### Input Validation & Sanitization

```typescript
class InputValidator {
  private schemas = new Map<string, Joi.Schema>();

  constructor() {
    this.initializeSchemas();
  }

  private initializeSchemas(): void {
    // User registration schema
    this.schemas.set(
      "userRegistration",
      Joi.object({
        email: Joi.string().email().required().max(255),
        password: Joi.string()
          .min(8)
          .max(128)
          .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
          )
          .required()
          .messages({
            "string.pattern.base":
              "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
          }),
        name: Joi.string().min(1).max(100).required(),
        terms: Joi.boolean().valid(true).required(),
      })
    );

    // Course creation schema
    this.schemas.set(
      "courseCreation",
      Joi.object({
        title: Joi.string().min(1).max(200).required(),
        description: Joi.string().max(2000).required(),
        difficulty: Joi.string()
          .valid("beginner", "intermediate", "advanced")
          .required(),
        tags: Joi.array().items(Joi.string().max(50)).max(10),
        content: Joi.string().max(100000).required(),
      })
    );

    // File upload schema
    this.schemas.set(
      "fileUpload",
      Joi.object({
        filename: Joi.string()
          .pattern(/^[a-zA-Z0-9_\-\.]+$/)
          .max(255)
          .required()
          .messages({
            "string.pattern.base": "Filename contains invalid characters",
          }),
        size: Joi.number()
          .max(10 * 1024 * 1024)
          .required(), // 10MB max
        type: Joi.string()
          .valid(
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
            "text/plain"
          )
          .required(),
      })
    );
  }

  validate(schemaName: string, data: any): ValidationResult {
    const schema = this.schemas.get(schemaName);

    if (!schema) {
      throw new Error(`Schema '${schemaName}' not found`);
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    return {
      isValid: !error,
      data: value,
      errors:
        error?.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })) || [],
    };
  }

  sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "code",
        "pre",
      ],
      ALLOWED_ATTR: [],
      FORBID_SCRIPTS: true,
      FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
    });
  }

  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, ""); // Remove event handlers
  }
}

// Validation middleware
const validateInput = (schemaName: string) => {
  const validator = new InputValidator();

  return (req: Request, res: Response, next: NextFunction) => {
    const result = validator.validate(schemaName, req.body);

    if (!result.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.errors,
      });
    }

    req.body = result.data;
    next();
  };
};
```

## Future Security Enhancements

- **Zero Trust Architecture**: Implement comprehensive zero trust security model
- **AI-Powered Threat Detection**: Machine learning for advanced threat detection
- **Behavioral Analytics**: User behavior analysis for anomaly detection
- **Quantum-Resistant Cryptography**: Prepare for post-quantum security
- **Security Orchestration**: Automated incident response and remediation
