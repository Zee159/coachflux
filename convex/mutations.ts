import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOrg = mutation({
  args: {
    name: v.string(),
    values: v.array(v.object({ key: v.string(), description: v.string() })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orgs", {
      name: args.name,
      values: args.values,
    });
  },
});

export const createFeedback = mutation({
  args: {
    orgId: v.optional(v.id("orgs")),
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.id("sessions")),
    overallRating: v.optional(v.number()),
    uxRating: v.optional(v.number()),
    growMethodRating: v.optional(v.number()),
    easeOfUse: v.optional(v.string()),
    helpfulness: v.optional(v.string()),
    willingToPay: v.optional(v.string()),
    improvements: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feedback", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      overallRating: args.overallRating,
      uxRating: args.uxRating,
      growMethodRating: args.growMethodRating,
      easeOfUse: args.easeOfUse,
      helpfulness: args.helpfulness,
      willingToPay: args.willingToPay,
      improvements: args.improvements,
      createdAt: Date.now(),
    });
  },
});

export const createUser = mutation({
  args: {
    authId: v.string(),
    orgId: v.id("orgs"),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("member")),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      authId: args.authId,
      orgId: args.orgId,
      role: args.role,
      displayName: args.displayName,
    });
  },
});

export const createSession = mutation({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    framework: v.string(),
  },
  handler: async (ctx, args) => {
    // Check for existing active sessions
    const existingSessions = await ctx.db
      .query("sessions")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    const activeSessions = existingSessions.filter((s) => s.closedAt === null || s.closedAt === undefined);
    if (activeSessions.length > 0) {
      throw new Error("User already has an active session. Please close it first.");
    }

    // Determine first step and greeting based on framework
    let firstStep = "goal";
    let greeting = "Welcome! I'm delighted to be your thinking partner today. What goal is on your mind that you'd like to work through?";
    let skipSteps: Record<string, number> = { goal: 0, reality: 0, options: 0, will: 0, review: 0 };

    if (args.framework === "COMPASS") {
      firstStep = "clarity";
      greeting = "Welcome! I'm here to help you navigate workplace change with confidence using the COMPASS framework. What specific change are you dealing with right now?";
      // NEW COMPASS: 4 stages (Clarity, Ownership, Mapping, Practice)
      // Set skipSteps for 4-stage model (feature flag controlled in coach.ts)
      skipSteps = { clarity: 0, ownership: 0, mapping: 0, practice: 0 };
    }

    const sessionId = await ctx.db.insert("sessions", {
      orgId: args.orgId,
      userId: args.userId,
      framework: args.framework,
      step: firstStep,
      state: { skips: skipSteps },
      startedAt: Date.now(),
    });

    // Create initial greeting reflection
    await ctx.db.insert("reflections", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: sessionId,
      step: firstStep,
      userInput: undefined,
      payload: {
        coach_reflection: greeting
      },
      createdAt: Date.now(),
    });

    return sessionId;
  },
});

export const updateSessionStep = mutation({
  args: {
    sessionId: v.id("sessions"),
    step: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { step: args.step });
  },
});

export const closeSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { closedAt: Date.now() });
  },
});

export const markSessionEscalated = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { escalated: true });
  },
});

export const createReflection = mutation({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    step: v.string(),
    userInput: v.optional(v.string()),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const payload: Record<string, unknown> = args.payload as Record<string, unknown>;
    return await ctx.db.insert("reflections", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      step: args.step,
      userInput: args.userInput,
      payload,
      createdAt: Date.now(),
    });
  },
});

export const createAction = mutation({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    title: v.string(),
    dueAt: v.optional(v.number()),
    status: v.union(v.literal("open"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("actions", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      title: args.title,
      dueAt: args.dueAt,
      status: args.status,
      createdAt: Date.now(),
    });
  },
});

export const updateActionStatus = mutation({
  args: {
    actionId: v.id("actions"),
    status: v.union(v.literal("open"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.actionId, { status: args.status });
  },
});

export const createSafetyIncident = mutation({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    reason: v.string(),
    llmOutput: v.optional(v.any()),
    severity: v.union(v.literal("low"), v.literal("med"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const llmOutput: unknown = args.llmOutput;
    return await ctx.db.insert("safetyIncidents", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      reason: args.reason,
      llmOutput,
      createdAt: Date.now(),
      severity: args.severity,
    });
  },
});

export const incrementSkipCount = mutation({
  args: {
    sessionId: v.id("sessions"),
    step: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (session === null) {
      throw new Error("Session not found");
    }
    
    const state = session.state as { skips?: Record<string, number> } | undefined;
    const skips = state?.skips ?? { goal: 0, reality: 0, options: 0, will: 0, review: 0 };
    
    if (skips[args.step] !== undefined) {
      skips[args.step] = (skips[args.step] ?? 0) + 1;
    }
    
    await ctx.db.patch(args.sessionId, { 
      state: { ...state, skips } 
    });
  },
});

/**
 * ⚠️ FIX P0-4: Pause session due to safety concern (e.g., suicidal ideation)
 */
export const pauseSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (session === null) {
      throw new Error("Session not found");
    }
    
    await ctx.db.patch(args.sessionId, {
      safetyPaused: true,
      safetyPauseReason: args.reason,
    });
  },
});

export const acceptLegalTerms = mutation({
  args: {
    userId: v.id("users"),
    termsVersion: v.string(),
    privacyVersion: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      legalConsent: {
        termsAccepted: true,
        privacyAccepted: true,
        acceptedAt: Date.now(),
        termsVersion: args.termsVersion,
        privacyVersion: args.privacyVersion,
      },
    });
  },
});
