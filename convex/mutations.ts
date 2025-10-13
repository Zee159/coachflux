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

    const sessionId = await ctx.db.insert("sessions", {
      orgId: args.orgId,
      userId: args.userId,
      framework: args.framework,
      step: "goal",
      state: { skips: { goal: 0, reality: 0, options: 0, will: 0, review: 0 } },
      startedAt: Date.now(),
    });

    // Create initial greeting reflection
    await ctx.db.insert("reflections", {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: sessionId,
      step: "goal",
      userInput: undefined,
      payload: {
        coach_reflection: "Welcome! I'm delighted to be your thinking partner today. What goal is on your mind that you'd like to work through?"
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
