# CoachFlux Authentication Strategy

## Overview

CoachFlux requires a flexible authentication system that supports both anonymous users (free tier) and registered users (paid tier), with a seamless upgrade path between the two.

---

## Authentication Tiers

### **Tier 1: Anonymous Users (Free)**
- No authentication required
- Session tracked via localStorage + sessionId
- Limited to single session per visit
- Data expires after 24 hours
- Can email report (captures email)

### **Tier 2: Registered Users (Paid)**
- Email/password authentication
- OAuth providers (Google, LinkedIn)
- Persistent sessions
- Full feature access
- Data retained indefinitely

### **Tier 3: Enterprise Users (Future)**
- SSO (SAML, OAuth)
- Organization-level management
- Role-based access control (RBAC)
- Custom authentication flows

---

## User Registration Flow

### **Scenario 1: Direct Registration**

```
Landing Page → "Create Account" → Registration Form → Email Verification → Dashboard
```

**Registration Form Fields:**
- Email (required)
- Password (required, min 8 chars, 1 uppercase, 1 number)
- Name (optional, can add later)
- Newsletter opt-in (checkbox)
- Terms acceptance (required checkbox)

**Post-Registration:**
1. Send verification email
2. Create user record in database
3. Generate session token
4. Redirect to dashboard with onboarding
5. Apply discount code if from newsletter

### **Scenario 2: Upgrade from Anonymous**

```
Anonymous Session → "Save This Session" → Registration → Sessions Migrated → Dashboard
```

**Migration Process:**
1. User completes anonymous session
2. Prompted to create account to save
3. Registration form (pre-filled email if captured)
4. Upon registration, migrate anonymous session to user account
5. Apply 50% discount for 3 months

### **Scenario 3: Social OAuth**

```
Landing Page → "Continue with Google" → OAuth Flow → Account Created → Dashboard
```

**OAuth Providers:**
- Google (primary)
- LinkedIn (professional audience)
- Microsoft (future, for enterprise)

**OAuth Data Captured:**
- Email (verified)
- Name
- Profile picture (optional)
- No password needed

---

## Login Flow

### **Standard Login**

```
Login Page → Email + Password → 2FA (optional) → Dashboard
```

**Login Form:**
- Email
- Password
- "Remember me" checkbox (30-day session)
- "Forgot password?" link

**Security Features:**
- Rate limiting (5 attempts per 15 minutes)
- CAPTCHA after 3 failed attempts
- Account lockout after 10 failed attempts
- Email notification on new device login

### **Magic Link Login (Alternative)**

```
Login Page → Enter Email → Magic Link Sent → Click Link → Logged In
```

**Benefits:**
- No password to remember
- More secure (time-limited, one-use token)
- Better UX for mobile
- Reduces support burden

**Implementation:**
```typescript
// Generate magic link
const token = generateSecureToken();
const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

await sendEmail({
  to: user.email,
  subject: "Your CoachFlux login link",
  body: `Click here to log in: ${BASE_URL}/auth/magic?token=${token}`,
});

// Store token
await db.insert("magic_links", {
  userId: user._id,
  token,
  expiresAt,
  used: false,
});
```

---

## Password Management

### **Password Requirements**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (optional but recommended)
- Not in common password list (check against haveibeenpwned)

### **Password Reset Flow**

```
Forgot Password → Enter Email → Reset Link Sent → New Password → Login
```

**Implementation:**
1. User requests password reset
2. Generate secure reset token (expires in 1 hour)
3. Send email with reset link
4. User clicks link, enters new password
5. Invalidate old password and all sessions
6. Send confirmation email
7. Redirect to login

**Security:**
- Rate limit reset requests (3 per hour)
- Token valid for 1 hour only
- One-time use token
- Invalidate all existing sessions on reset

---

## Session Management

### **Session Types**

**Short Session (Default):**
- Duration: 24 hours
- Requires re-login after expiry
- Used when "Remember me" is unchecked

**Long Session (Remember Me):**
- Duration: 30 days
- Automatically refreshed on activity
- Used when "Remember me" is checked

**Anonymous Session:**
- Duration: 24 hours
- Stored in localStorage
- No server-side session

### **Session Storage**

```typescript
interface UserSession {
  sessionId: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  lastActivityAt: number;
  deviceInfo: {
    userAgent: string;
    ip: string;
    location?: string;
  };
  isActive: boolean;
}
```

### **Session Security**

- Store session tokens in httpOnly cookies
- Use secure flag (HTTPS only)
- Implement CSRF protection
- Rotate session tokens periodically
- Detect suspicious activity (new device, new location)
- Allow users to view and revoke sessions

---

## Multi-Device Support

### **Session Management Dashboard**

Users can view all active sessions:

```
Active Sessions:
┌─────────────────────────────────────────┐
│ 🖥️  MacBook Pro - London, UK           │
│    Last active: 2 minutes ago           │
│    [Current Session]                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📱  iPhone 14 - London, UK              │
│    Last active: 2 hours ago             │
│    [Revoke]                             │
└─────────────────────────────────────────┘
```

**Features:**
- View all active sessions
- Revoke individual sessions
- "Log out all devices" option
- Email notification on new device login

---

## Two-Factor Authentication (2FA)

### **Optional for Users, Required for Admin**

**Supported Methods:**
1. **Authenticator App (TOTP)** - Google Authenticator, Authy
2. **SMS** (less secure, but convenient)
3. **Email** (backup method)

### **Setup Flow**

```
Settings → Enable 2FA → Choose Method → Scan QR Code → Enter Code → Backup Codes → Enabled
```

**Backup Codes:**
- Generate 10 one-time use codes
- Store securely (hashed)
- User downloads and saves
- Can regenerate if lost

### **Login with 2FA**

```
Email + Password → 2FA Code → Logged In
```

**Implementation:**
```typescript
// Verify TOTP code
import { authenticator } from 'otplib';

const isValid = authenticator.verify({
  token: userInputCode,
  secret: user.totpSecret,
});

if (!isValid) {
  throw new Error("Invalid 2FA code");
}
```

---

## OAuth Integration

### **Google OAuth**

**Setup:**
1. Create OAuth app in Google Cloud Console
2. Configure authorized redirect URIs
3. Store client ID and secret in environment variables

**Flow:**
```typescript
// Initiate OAuth
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=${GOOGLE_CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  response_type=code&
  scope=email profile&
  state=${secureRandomState}`;

// Handle callback
const { code } = req.query;
const tokens = await exchangeCodeForTokens(code);
const userInfo = await fetchGoogleUserInfo(tokens.access_token);

// Create or update user
const user = await findOrCreateUser({
  email: userInfo.email,
  name: userInfo.name,
  picture: userInfo.picture,
  provider: 'google',
  providerId: userInfo.sub,
});
```

### **LinkedIn OAuth**

Similar flow to Google, targeting professional users.

**Benefits:**
- Pre-verified email
- Professional context
- Higher quality leads

---

## Email Verification

### **Verification Flow**

```
Registration → Verification Email Sent → Click Link → Email Verified → Full Access
```

**Unverified User Limitations:**
- Can log in but see banner
- Limited to 1 session
- Cannot access paid features
- Prompted to verify on each login

**Verification Email:**
```
Subject: Verify your CoachFlux email

Hi [Name],

Welcome to CoachFlux! Please verify your email to get started.

[Verify Email Button]

Or copy this link: https://coachflux.com/verify?token=...

This link expires in 24 hours.

Questions? Reply to this email.

- The CoachFlux Team
```

**Implementation:**
```typescript
// Generate verification token
const token = generateSecureToken();
const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

await db.insert("email_verifications", {
  userId: user._id,
  token,
  expiresAt,
  verified: false,
});

// Verify email
const verification = await db
  .query("email_verifications")
  .filter(q => q.eq(q.field("token"), token))
  .first();

if (!verification || verification.expiresAt < Date.now()) {
  throw new Error("Invalid or expired token");
}

await db.patch(user._id, { emailVerified: true });
await db.patch(verification._id, { verified: true });
```

---

## Account Management

### **User Profile**

**Editable Fields:**
- Name
- Email (requires re-verification)
- Password (requires current password)
- Profile picture (optional)
- Timezone
- Notification preferences

### **Account Settings**

**Privacy:**
- Data export (GDPR)
- Data deletion request
- Session management
- 2FA settings

**Notifications:**
- Email preferences
- Action item reminders
- Newsletter subscription
- Product updates

**Subscription:**
- Current plan
- Billing information
- Payment method
- Upgrade/downgrade
- Cancel subscription

### **Account Deletion**

```
Settings → Delete Account → Confirm Password → Reason (optional) → Delete
```

**Deletion Process:**
1. User requests deletion
2. Confirm with password
3. Optional feedback form
4. Grace period (7 days to cancel)
5. Send confirmation email
6. After 7 days, permanently delete:
   - User data
   - Sessions
   - Action items
   - Reports (keep anonymized for analytics)
7. Cancel subscription
8. Send final confirmation

---

## Security Best Practices

### **Password Storage**
- Use bcrypt with salt rounds = 12
- Never store plaintext passwords
- Hash passwords on server, not client

```typescript
import bcrypt from 'bcryptjs';

// Hash password
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### **Token Generation**
- Use cryptographically secure random tokens
- Minimum 32 bytes of entropy
- URL-safe encoding

```typescript
import crypto from 'crypto';

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}
```

### **Rate Limiting**

**Login Attempts:**
- 5 attempts per 15 minutes per IP
- 10 attempts per hour per email
- Exponential backoff after failures

**API Endpoints:**
- 100 requests per minute per user
- 1000 requests per hour per user
- Stricter limits for sensitive endpoints

### **CSRF Protection**
- Use CSRF tokens for state-changing requests
- Validate origin header
- SameSite cookie attribute

### **XSS Prevention**
- Sanitize all user input
- Use Content Security Policy (CSP)
- Escape output in templates

---

## Convex Schema

```typescript
// users table
export default defineSchema({
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    picture: v.optional(v.string()),
    passwordHash: v.optional(v.string()), // Optional for OAuth users
    provider: v.optional(v.union(
      v.literal("email"),
      v.literal("google"),
      v.literal("linkedin")
    )),
    providerId: v.optional(v.string()),
    totpSecret: v.optional(v.string()),
    totpEnabled: v.boolean(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    subscriptionStatus: v.union(
      v.literal("free"),
      v.literal("trial"),
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due")
    ),
    stripeCustomerId: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_provider", ["provider", "providerId"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    lastActivityAt: v.number(),
    deviceInfo: v.object({
      userAgent: v.string(),
      ip: v.string(),
    }),
    isActive: v.boolean(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  email_verifications: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    verified: v.boolean(),
  })
    .index("by_token", ["token"]),

  password_resets: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
  })
    .index("by_token", ["token"]),

  magic_links: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
  })
    .index("by_token", ["token"]),
});
```

---

## Implementation Checklist

### **Phase 1: Basic Auth (Week 1-2)**
- [ ] Email/password registration
- [ ] Login/logout
- [ ] Password hashing (bcrypt)
- [ ] Session management
- [ ] Email verification
- [ ] Password reset

### **Phase 2: OAuth (Week 3)**
- [ ] Google OAuth integration
- [ ] LinkedIn OAuth integration
- [ ] OAuth user creation/linking

### **Phase 3: Security (Week 4)**
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] Session security
- [ ] 2FA (optional)

### **Phase 4: Account Management (Week 5)**
- [ ] User profile editing
- [ ] Account settings
- [ ] Session management UI
- [ ] Account deletion

### **Phase 5: Migration (Week 6)**
- [ ] Anonymous to registered migration
- [ ] Session data transfer
- [ ] Discount code application

---

## Testing Strategy

### **Unit Tests**
- Password hashing/verification
- Token generation
- Email validation
- Session expiry logic

### **Integration Tests**
- Registration flow
- Login flow
- Password reset flow
- OAuth flow
- Session management

### **Security Tests**
- SQL injection attempts
- XSS attempts
- CSRF attacks
- Brute force login attempts
- Session hijacking attempts

---

## Monitoring & Alerts

### **Metrics to Track**
- Registration rate
- Login success/failure rate
- Password reset requests
- OAuth vs email signup ratio
- Session duration
- Failed login attempts by IP

### **Alerts**
- Unusual login patterns
- High failed login rate
- Password reset spike
- New device logins
- Account deletion requests

---

**Document Version:** 1.0  
**Last Updated:** October 20, 2025  
**Status:** Planning Complete
