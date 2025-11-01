/**
 * Internal embedding functions (queries and mutations)
 * 
 * These are called by the public embedding actions.
 * Not exposed directly to the client.
 */

import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Store session-level embedding
 */
export const storeSessionEmbedding = internalMutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    orgId: v.id("orgs"),
    framework: v.string(),
    embedding: v.array(v.float64()),
    embeddedText: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if embedding already exists
    const existing = await ctx.db
      .query("sessionEmbeddings")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing !== null) {
      // Update existing
      await ctx.db.patch(existing._id, {
        embedding: args.embedding,
        embeddedText: args.embeddedText,
      });
      return existing._id;
    }

    // Insert new
    return await ctx.db.insert("sessionEmbeddings", {
      sessionId: args.sessionId,
      userId: args.userId,
      orgId: args.orgId,
      framework: args.framework,
      embedding: args.embedding,
      embeddedText: args.embeddedText,
      createdAt: Date.now(),
    });
  },
});

/**
 * Store reflection-level embedding
 */
export const storeReflectionEmbedding = internalMutation({
  args: {
    reflectionId: v.id("reflections"),
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    orgId: v.id("orgs"),
    step: v.string(),
    framework: v.string(),
    embedding: v.array(v.float64()),
    embeddedText: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if embedding already exists
    const existing = await ctx.db
      .query("reflectionEmbeddings")
      .withIndex("byReflection", (q) => q.eq("reflectionId", args.reflectionId))
      .first();

    if (existing !== null) {
      // Update existing
      await ctx.db.patch(existing._id, {
        embedding: args.embedding,
        embeddedText: args.embeddedText,
      });
      return existing._id;
    }

    // Insert new
    return await ctx.db.insert("reflectionEmbeddings", {
      reflectionId: args.reflectionId,
      sessionId: args.sessionId,
      userId: args.userId,
      orgId: args.orgId,
      step: args.step,
      framework: args.framework,
      embedding: args.embedding,
      embeddedText: args.embeddedText,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get session embedding by session ID
 */
export const getSessionEmbedding = internalQuery({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessionEmbeddings")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

/**
 * Get reflection by ID
 */
export const getReflection = internalQuery({
  args: { reflectionId: v.id("reflections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.reflectionId);
  },
});

/**
 * Get sessions without embeddings (for backfill)
 */
export const getSessionsWithoutEmbeddings = internalQuery({
  args: {
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    // Get all closed sessions
    let sessions;
    if (args.userId !== undefined) {
      const userId = args.userId; // Capture in const to satisfy TypeScript
      sessions = await ctx.db
        .query("sessions")
        .withIndex("byUser", (q) => q.eq("userId", userId))
        .filter((q) => q.neq(q.field("closedAt"), undefined))
        .take(limit * 2);
    } else {
      sessions = await ctx.db
        .query("sessions")
        .filter((q) => q.neq(q.field("closedAt"), undefined))
        .take(limit * 2); // Get more than needed to account for filtering
    }

    // Filter out sessions that already have embeddings
    const sessionsWithoutEmbeddings = [];
    for (const session of sessions) {
      const hasEmbedding = await ctx.db
        .query("sessionEmbeddings")
        .withIndex("bySession", (q) => q.eq("sessionId", session._id))
        .first();

      if (hasEmbedding === null) {
        sessionsWithoutEmbeddings.push(session);
        if (sessionsWithoutEmbeddings.length >= limit) {
          break;
        }
      }
    }

    return sessionsWithoutEmbeddings;
  },
});
