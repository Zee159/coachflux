# CoachFlux Data Schema Design

## Complete Convex Schema

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // USER MANAGEMENT
  // ============================================
  
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    picture: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    provider: v.optional(v.union(
      v.literal("email"),
      v.literal("google"),
      v.literal("linkedin")
    )),
    providerId: v.optional(v.string()),
    totpSecret: v.optional(v.string()),
    totpEnabled: v.boolean(),
    subscriptionStatus: v.union(
      v.literal("free"),
      v.literal("trial"),
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due")
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    emailPreferences: v.object({
      productUpdates: v.boolean(),
      newsletter: v.boolean(),
      actionReminders: v.boolean(),
      marketingEmails: v.boolean(),
    }),
    onboardingCompleted: v.boolean(),
    preferredFramework: v.optional(v.string()),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    lastActiveAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_provider", ["provider", "providerId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  // ============================================
  // AUTHENTICATION
  // ============================================

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    lastActivityAt: v.number(),
    deviceInfo: v.object({
      userAgent: v.string(),
      ip: v.string(),
      location: v.optional(v.string()),
    }),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"])
    .index("by_expiry", ["expiresAt"]),

  email_verifications: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    verified: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  password_resets: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  magic_links: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"]),

  // ============================================
  // ORGANIZATIONS (Future B2B)
  // ============================================

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    domain: v.optional(v.string()),
    logo: v.optional(v.string()),
    plan: v.union(
      v.literal("enterprise"),
      v.literal("team")
    ),
    seatCount: v.number(),
    usedSeats: v.number(),
    stripeCustomerId: v.optional(v.string()),
    settings: v.object({
      ssoEnabled: v.boolean(),
      customBranding: v.boolean(),
      dataResidency: v.optional(v.string()),
    }),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_domain", ["domain"]),

  org_members: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member")
    ),
    joinedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"])
    .index("by_org_and_user", ["orgId", "userId"]),

  // ============================================
  // COACHING SESSIONS
  // ============================================

  coaching_sessions: defineTable({
    userId: v.optional(v.id("users")), // Optional for anonymous
    orgId: v.optional(v.id("organizations")),
    framework: v.string(), // "GROW", "CLEAR", "COMPASS", etc.
    step: v.string(),
    state: v.any(), // Framework-specific state
    isAnonymous: v.boolean(),
    anonymousId: v.optional(v.string()), // For anonymous tracking
    closedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()), // For anonymous sessions
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_anonymous", ["anonymousId"])
    .index("by_expiry", ["expiresAt"])
    .index("by_created", ["createdAt"]),

  session_reflections: defineTable({
    sessionId: v.id("coaching_sessions"),
    step: v.string(),
    userInput: v.string(),
    payload: v.any(), // Structured reflection data
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_step", ["sessionId", "step"]),

  // ============================================
  // ACTION ITEMS
  // ============================================

  action_items: defineTable({
    userId: v.id("users"),
    sessionId: v.id("coaching_sessions"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    tags: v.array(v.string()),
    reminderSent: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_due_date", ["userId", "dueDate"])
    .index("by_completed", ["userId", "completed"]),

  // ============================================
  // SUBSCRIPTIONS & BILLING
  // ============================================

  subscriptions: defineTable({
    userId: v.id("users"),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("trialing"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("unpaid")
    ),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    trialEnd: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_id", ["stripeSubscriptionId"])
    .index("by_status", ["status"]),

  invoices: defineTable({
    userId: v.id("users"),
    stripeInvoiceId: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    paidAt: v.optional(v.number()),
    invoicePdf: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_id", ["stripeInvoiceId"]),

  coupons: defineTable({
    code: v.string(),
    stripeCouponId: v.string(),
    percentOff: v.optional(v.number()),
    amountOff: v.optional(v.number()),
    currency: v.optional(v.string()),
    duration: v.string(),
    durationInMonths: v.optional(v.number()),
    maxRedemptions: v.optional(v.number()),
    timesRedeemed: v.number(),
    active: v.boolean(),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["active"]),

  // ============================================
  // RESOURCES & CONTENT
  // ============================================

  resources: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("template"),
      v.literal("guide"),
      v.literal("worksheet"),
      v.literal("video")
    ),
    category: v.string(),
    fileUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    accessLevel: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    downloadCount: v.number(),
    tags: v.array(v.string()),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_access", ["accessLevel"])
    .index("by_published", ["published"]),

  // ============================================
  // ANALYTICS & TRACKING
  // ============================================

  events: defineTable({
    userId: v.optional(v.id("users")),
    anonymousId: v.optional(v.string()),
    eventName: v.string(),
    properties: v.any(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_event", ["eventName"])
    .index("by_timestamp", ["timestamp"]),

  user_metrics: defineTable({
    userId: v.id("users"),
    sessionsCompleted: v.number(),
    actionsCreated: v.number(),
    actionsCompleted: v.number(),
    frameworksUsed: v.array(v.string()),
    lastSessionAt: v.optional(v.number()),
    totalTimeSpent: v.number(), // in seconds
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // ============================================
  // FEEDBACK & SUPPORT
  // ============================================

  feedback: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.id("coaching_sessions")),
    type: v.union(
      v.literal("bug"),
      v.literal("feature"),
      v.literal("general")
    ),
    rating: v.optional(v.number()), // 1-5
    message: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("reviewed"),
      v.literal("resolved")
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  support_tickets: defineTable({
    userId: v.id("users"),
    subject: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assignedTo: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"]),

  // ============================================
  // FRAMEWORK METADATA
  // ============================================

  frameworks: defineTable({
    id: v.string(), // "GROW", "CLEAR", etc.
    name: v.string(),
    emoji: v.string(),
    tagline: v.string(),
    description: v.string(),
    bestFor: v.array(v.string()),
    steps: v.array(v.object({
      name: v.string(),
      description: v.string(),
    })),
    estimatedTime: v.string(),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    category: v.union(
      v.literal("general"),
      v.literal("specialist")
    ),
    tags: v.array(v.string()),
    isAvailable: v.boolean(),
    comingSoon: v.boolean(),
    usageCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_id", ["id"])
    .index("by_category", ["category"])
    .index("by_available", ["isAvailable"]),

  // ============================================
  // NOTIFICATIONS
  // ============================================

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    actionUrl: v.optional(v.string()),
    read: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_read", ["userId", "read"])
    .index("by_created", ["userId", "createdAt"]),
});
```

---

## Data Retention Policies

### **Anonymous Sessions**
- Expire after 24 hours
- Deleted automatically via scheduled job
- Can be extended if user creates account

### **User Data**
- Retained indefinitely while account active
- 7-day grace period after deletion request
- Anonymized data kept for analytics

### **Session Data**
- Free users: Last 3 sessions
- Pro users: Unlimited retention
- Deleted with account deletion

### **Action Items**
- Retained with sessions
- Completed items archived after 90 days
- Deleted with account deletion

---

## Data Migration Strategy

### **Anonymous to Registered**

```typescript
export const migrateAnonymousSession = mutation({
  args: {
    anonymousId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Find all anonymous sessions
    const sessions = await ctx.db
      .query("coaching_sessions")
      .withIndex("by_anonymous", (q) => 
        q.eq("anonymousId", args.anonymousId)
      )
      .collect();

    // Migrate each session
    for (const session of sessions) {
      await ctx.db.patch(session._id, {
        userId: args.userId,
        isAnonymous: false,
        anonymousId: undefined,
        expiresAt: undefined, // Remove expiry
      });
    }

    return { migratedCount: sessions.length };
  },
});
```

---

## Backup & Recovery

### **Automated Backups**
- Daily snapshots (Convex handles this)
- Point-in-time recovery
- 30-day retention

### **Data Export (GDPR)**

```typescript
export const exportUserData = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const sessions = await ctx.db
      .query("coaching_sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const actions = await ctx.db
      .query("action_items")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return {
      user,
      sessions,
      actions,
      exportedAt: Date.now(),
    };
  },
});
```

---

**Document Version:** 1.0  
**Last Updated:** October 20, 2025  
**Status:** Planning Complete
