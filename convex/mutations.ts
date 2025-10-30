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

// ================================
// CSS (Composite Success Score)
// ================================

export const createMeasurementPoint = mutation({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    stage: v.string(),
    measurementType: v.union(v.literal("baseline"), v.literal("final"), v.literal("marker")),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const payload: Record<string, unknown> = args.payload as Record<string, unknown>;
    return await ctx.db.insert("measurement_points", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      stage: args.stage,
      measurementType: args.measurementType,
      payload,
      createdAt: Date.now(),
    });
  },
});

export const createSuccessMeasurement = mutation({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    dimension: v.union(
      v.literal("confidence"),
      v.literal("action"),
      v.literal("mindset"),
      v.literal("satisfaction")
    ),
    initialRaw: v.optional(v.union(v.number(), v.string())),
    finalRaw: v.optional(v.union(v.number(), v.string())),
    increase: v.optional(v.number()),
    normalizedScore: v.optional(v.number()),
    calculationVersion: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("success_measurements", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      dimension: args.dimension,
      initialRaw: args.initialRaw,
      finalRaw: args.finalRaw,
      increase: args.increase,
      normalizedScore: args.normalizedScore,
      calculatedAt: Date.now(),
      calculationVersion: args.calculationVersion,
    });
  },
});

export const createCSSScore = mutation({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    composite_success_score: v.number(),
    success_level: v.union(
      v.literal("EXCELLENT"),
      v.literal("GOOD"),
      v.literal("FAIR"),
      v.literal("MARGINAL"),
      v.literal("INSUFFICIENT")
    ),
    breakdown: v.object({
      confidence_score: v.number(),
      confidence_growth: v.number(),
      action_score: v.number(),
      mindset_score: v.number(),
      satisfaction_score: v.number(),
    }),
    raw_inputs: v.any(),
    calculationVersion: v.string(),
    calculation_metadata: v.optional(v.object({
      dimension_weights: v.object({
        confidence: v.number(),
        confidence_growth: v.number(),
        action: v.number(),
        mindset: v.number(),
        satisfaction: v.number(),
      }),
      thresholds: v.object({
        excellent: v.number(),
        good: v.number(),
        fair: v.number(),
        marginal: v.number(),
      }),
    })),
  },
  handler: async (ctx, args) => {
    const rawInputs: Record<string, unknown> = args.raw_inputs as Record<string, unknown>;
    return await ctx.db.insert("css_scores", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      composite_success_score: args.composite_success_score,
      success_level: args.success_level,
      breakdown: args.breakdown,
      raw_inputs: rawInputs,
      calculatedAt: Date.now(),
      calculationVersion: args.calculationVersion,
      calculation_metadata: args.calculation_metadata,
    });
  },
});

export const createCSSInsights = mutation({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    insights: v.optional(v.array(v.string())),
    flags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("css_insights", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      insights: args.insights,
      flags: args.flags,
      notes: args.notes,
      createdAt: Date.now(),
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
    // UPDATED: All sessions now start with introduction phase
    let firstStep = "introduction";
    let greeting = `Welcome! I'll help you tackle your goals using the GROW coaching method - a proven approach to move from where you are to where you want to be.

Here's our 15-20 minute process:
• Goal: Define what you want to achieve and why
• Reality: Assess your current situation and obstacles
• Options: Explore different approaches
• Will: Create concrete action steps

GROW works great for:
• Achieving specific goals (career, personal, business)
• Making decisions with multiple options
• Breaking through obstacles
• Creating project action plans

I'll guide you with targeted questions to build clarity and create actionable next steps you can implement immediately.

Ready to dive in with this framework?`;
    let skipSteps: Record<string, number> = { introduction: 0, goal: 0, reality: 0, options: 0, will: 0, review: 0 };

    if (args.framework === "COMPASS") {
      firstStep = "introduction";
      greeting = `Welcome! I'm here to help you navigate change with confidence.

We'll use the COMPASS method - a coaching approach specifically designed for workplace change. COMPASS helps you transform from feeling uncertain about a change to feeling confident and in control.

Here's our journey together:
• Clarity: Understand exactly what's changing and what you can control
• Ownership: Build confidence by recognizing your strengths and potential benefits
• Mapping: Create one specific action you'll take this week
• Practice: Commit to your action with a clear plan

This takes about 15-20 minutes.

COMPASS is specifically for workplace change situations like:
• Company reorganizations or restructuring
• New processes, tools, or ways of working
• Leadership changes or team transitions
• Role changes or new responsibilities
• Adapting to industry shifts or market changes

We'll help you move from feeling uncertain to confident. You'll identify one specific action you can take this week to build momentum. Most people see their confidence increase significantly by the end of our session.

Note: COMPASS is designed for workplace change. If you're working on a personal goal, decision-making, or project planning (not change-related), the GROW method might be a better fit.

Does this framework feel right for what you're facing today?`;
      // NEW COMPASS: 4 stages (Clarity, Ownership, Mapping, Practice) + Introduction
      skipSteps = { introduction: 0, clarity: 0, ownership: 0, mapping: 0, practice: 0 };
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

// Phase 2: Update session with OPTIONS state tracking
export const updateSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    options_state: v.optional(v.union(v.literal("A"), v.literal("B"))),
    ai_suggestion_count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updates: {
      options_state?: "A" | "B";
      ai_suggestion_count?: number;
    } = {};
    
    if (args.options_state !== undefined) {
      updates.options_state = args.options_state;
    }
    if (args.ai_suggestion_count !== undefined) {
      updates.ai_suggestion_count = args.ai_suggestion_count;
    }
    
    await ctx.db.patch(args.sessionId, updates);
  },
});

export const closeSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (session === null) {
      throw new Error("Session not found");
    }
    
    // Close the session
    await ctx.db.patch(args.sessionId, { closedAt: Date.now() });
    
    // Note: CSS score for COMPASS sessions is calculated in coach/index.ts
    // during the PRACTICE step completion (lines 738-811)
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

export const submitSessionRating = mutation({
  args: {
    sessionId: v.id("sessions"),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate rating is between 1 and 5
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    
    const session = await ctx.db.get(args.sessionId);
    if (session === null) {
      throw new Error("Session not found");
    }
    
    await ctx.db.patch(args.sessionId, {
      rating: args.rating,
      ratingSubmittedAt: Date.now(),
    });
  },
});
