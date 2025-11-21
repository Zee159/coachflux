import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

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
      greeting = `Welcome! I'm here to help you navigate workplace change with confidence. COMPASS helps you move from uncertainty to confidence in 20 minutes through 4 stages: Clarity (understand the change), Ownership (build confidence), Mapping (create one action), and Practice (commit to it).

This works best for workplace changes like reorganizations, new systems, leadership changes, or role shifts. If you're working on a personal goal instead, GROW might be better.

Does this framework feel right for what you're facing today?`;
      // NEW COMPASS: 4 stages (Clarity, Ownership, Mapping, Practice) + Introduction
      skipSteps = { introduction: 0, clarity: 0, ownership: 0, mapping: 0, practice: 0 };
    } else if (args.framework === "CAREER") {
      firstStep = "INTRODUCTION";
      greeting = `Welcome! I'm your Career Coach, here to help you navigate career transitions, skill development, and role advancement.

In this 25-minute session, we'll work through 5 steps:
• Introduction: Get started
• Assessment: Understand where you are and where you want to go
• Gap Analysis: Identify what's missing between here and there
• Roadmap: Create a concrete action plan with milestones
• Review: Measure your progress and confidence

This works best for:
• Career transitions (moving to a new role or industry)
• Skill development planning
• Career advancement strategies
• Professional growth roadmaps

Ready to begin your career planning session?`;
      skipSteps = { INTRODUCTION: 0, ASSESSMENT: 0, GAP_ANALYSIS: 0, ROADMAP: 0, REVIEW: 0 };
    } else if (args.framework === "PRODUCTIVITY") {
      firstStep = "ASSESSMENT";
      greeting = `Welcome! I'm your Productivity Coach, here to help you build sustainable productivity systems through focus optimization and time management.

In this 15-minute session, we'll work through 5 steps:
• Assessment: Understand your current productivity state and challenges
• Focus Audit: Analyze how you spend your time and energy
• System Design: Design a personalized productivity system
• Implementation: Create a concrete action plan with accountability
• Review: Reflect and measure your confidence growth

This works best for:
• Time management challenges
• Deep work optimization
• Distraction management
• Building productivity systems

Ready to optimize your productivity?`;
      skipSteps = { ASSESSMENT: 0, FOCUS_AUDIT: 0, SYSTEM_DESIGN: 0, IMPLEMENTATION: 0, REVIEW: 0 };
    } else if (args.framework === "LEADERSHIP") {
      firstStep = "SELF_AWARENESS";
      greeting = `Welcome! I'm your Leadership Coach, here to help you develop leadership capabilities through self-awareness, team building, and strategic influence.

In this 15-minute session, we'll work through 6 steps:
• Self-Awareness: Understand your leadership style and development areas
• Team Dynamics: Explore team health and relationship challenges
• Influence Strategy: Develop strategies for influencing stakeholders
• Development Plan: Create specific development actions
• Accountability: Establish accountability structures
• Review: Reflect on insights and measure confidence growth

This works best for:
• Leadership skill development
• Team management challenges
• Stakeholder influence
• Executive presence building

Ready to develop your leadership capabilities?`;
      skipSteps = { SELF_AWARENESS: 0, TEAM_DYNAMICS: 0, INFLUENCE_STRATEGY: 0, DEVELOPMENT_PLAN: 0, ACCOUNTABILITY: 0, REVIEW: 0 };
    } else if (args.framework === "COMMUNICATION") {
      firstStep = "SITUATION";
      greeting = `Welcome! I'm your Communication Coach, here to help you navigate difficult conversations and deliver effective feedback with confidence.

In this 15-minute session, we'll work through 6 steps:
• Situation: Understand the conversation context and stakes
• Outcome: Define what success looks like
• Perspective: Understand the other person's viewpoint
• Script: Craft your opening and key phrases
• Commitment: Commit to timing and self-care
• Review: Reflect and measure confidence growth

This works best for:
• Difficult conversations
• Feedback delivery
• Conflict resolution
• Setting boundaries
• Crucial conversations

Ready to prepare for your conversation?`;
      skipSteps = { SITUATION: 0, OUTCOME: 0, PERSPECTIVE: 0, SCRIPT: 0, COMMITMENT: 0, REVIEW: 0 };
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
    
    // Generate vector embedding asynchronously for semantic search
    await ctx.scheduler.runAfter(0, internal.embeddingsInternal.generateSessionEmbedding, {
      sessionId: args.sessionId,
    });
    
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

export const updateReflection = mutation({
  args: {
    reflectionId: v.id("reflections"),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const payload: Record<string, unknown> = args.payload as Record<string, unknown>;
    await ctx.db.patch(args.reflectionId, {
      payload,
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

export const storePendingUserTurn = mutation({
  args: {
    sessionId: v.id("sessions"),
    userTurn: v.string(),
    step: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (session === null) {
      throw new Error("Session not found");
    }
    
    await ctx.db.patch(args.sessionId, {
      pending_user_turn: args.userTurn,
      pending_user_step: args.step ?? session.step,
    });
  },
});

export const clearSafetyPause = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (session === null) {
      throw new Error("Session not found");
    }
    
    await ctx.db.patch(args.sessionId, {
      safetyPaused: false,
      safetyPauseReason: undefined,
      pending_user_turn: undefined,
      pending_user_step: undefined,
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

// ================================
// Step Confirmation & Amendment System
// ================================

/**
 * Set session to awaiting confirmation state
 * Called when a step is complete and needs user confirmation to proceed
 */
export const setAwaitingConfirmation = mutation({
  args: {
    sessionId: v.id("sessions"),
    awaiting: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      awaiting_confirmation: args.awaiting,
    });
  },
});

/**
 * Enter amendment mode for a specific step
 * Called when user clicks "Amend Response" button
 */
export const enterAmendmentMode = mutation({
  args: {
    sessionId: v.id("sessions"),
    step: v.string(),
    from_review: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      amendment_mode: {
        active: true,
        step: args.step,
        from_review: args.from_review,
      },
      awaiting_confirmation: false, // Clear confirmation state
    });
  },
});

/**
 * Exit amendment mode
 * Called when user saves or cancels amendments
 */
export const exitAmendmentMode = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      amendment_mode: {
        active: false,
        step: "",
        from_review: false,
      },
    });
  },
});

/**
 * Update a specific field in a reflection
 * Called when user amends a field value
 */
export const amendReflectionField = mutation({
  args: {
    sessionId: v.id("sessions"),
    step: v.string(),
    field: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    // Find the latest reflection for this step
    const reflections = await ctx.db
      .query("reflections")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    const stepReflections = reflections.filter(r => r.step === args.step);
    if (stepReflections.length === 0) {
      throw new Error(`No reflections found for step: ${args.step}`);
    }
    
    // Get the latest reflection for this step
    const latestReflection = stepReflections[stepReflections.length - 1];
    if (latestReflection === undefined) {
      throw new Error(`No reflection found for step: ${args.step}`);
    }
    
    // Update the field in the payload
    const payload = latestReflection.payload as Record<string, unknown>;
    payload[args.field] = args.value;
    
    await ctx.db.patch(latestReflection._id, {
      payload,
    });
    
    return latestReflection._id;
  },
});

/**
 * Batch update multiple fields in a reflection
 * Called when user saves multiple amendments at once
 */
export const amendReflectionFields = mutation({
  args: {
    sessionId: v.id("sessions"),
    step: v.string(),
    amendments: v.any(), // Record<string, unknown>
  },
  handler: async (ctx, args) => {
    // Find the latest reflection for this step
    const reflections = await ctx.db
      .query("reflections")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    const stepReflections = reflections.filter(r => r.step === args.step);
    if (stepReflections.length === 0) {
      throw new Error(`No reflections found for step: ${args.step}`);
    }
    
    // Get the latest reflection for this step
    const latestReflection = stepReflections[stepReflections.length - 1];
    if (latestReflection === undefined) {
      throw new Error(`No reflection found for step: ${args.step}`);
    }
    
    // Update all amended fields in the payload
    const payload = latestReflection.payload as Record<string, unknown>;
    const amendments = args.amendments as Record<string, unknown>;
    
    for (const [field, value] of Object.entries(amendments)) {
      payload[field] = value;
    }
    
    await ctx.db.patch(latestReflection._id, {
      payload,
    });
    
    return latestReflection._id;
  },
});
