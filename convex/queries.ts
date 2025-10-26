import { query } from "./_generated/server";
import { v } from "convex/values";
import { generateSessionReport } from "./reports";
import type { SessionReportData, FormattedReport, ReflectionPayload } from "./types";

export const getOrg = query({
  args: { orgId: v.id("orgs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orgId);
  },
});

export const getUserByAuth = query({
  args: { authId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("byAuth", (q) => q.eq("authId", args.authId))
      .first();
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const getSessionReflections = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reflections")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
  },
});

export const getUserActions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actions")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getSessionActions = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actions")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const getOrgSafetyIncidents = query({
  args: { orgId: v.id("orgs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("safetyIncidents")
      .withIndex("byOrg", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();
  },
});

export const checkLegalConsent = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (user === null || user === undefined) {
      return null;
    }
    return user.legalConsent ?? null;
  },
});

/**
 * Generate dynamic session report based on framework type
 */
export const generateReport = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    // Get session
    const session = await ctx.db.get(args.sessionId);
    if (session === null || session === undefined) {
      throw new Error("Session not found");
    }
    
    // Get reflections
    const reflections = await ctx.db
      .query("reflections")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
    
    // Get CSS score if available (COMPASS only)
    let cssScore = undefined;
    if (session.framework === 'COMPASS') {
      const cssRecord = await ctx.db
        .query("css_scores")
        .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
        .first();
      
      if (cssRecord !== null && cssRecord !== undefined) {
        cssScore = {
          composite_success_score: cssRecord.composite_success_score,
          success_level: cssRecord.success_level,
          breakdown: cssRecord.breakdown
        };
      }
    }
    
    // Build session data
    const durationMs = (session.closedAt ?? Date.now()) - session._creationTime;
    const durationMinutes = Math.round(durationMs / 60000); // Convert ms to minutes
    
    const sessionData: SessionReportData = {
      framework_id: session.framework,
      user_id: session.userId,
      session_id: args.sessionId,
      reflections: reflections.map(r => {
        const reflection: { step: string; payload: ReflectionPayload } = {
          step: r.step,
          payload: r.payload as ReflectionPayload
        };
        return reflection;
      }),
      completed_at: session.closedAt ?? Date.now(),
      duration_minutes: durationMinutes,
      css_score: cssScore
    };
    
    // Generate report using dynamic template system
    const report: FormattedReport = generateSessionReport(sessionData);
    return report;
  },
});

/**
 * Get CSS score for a session
 */
export const getCSSScore = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const cssRecord = await ctx.db
      .query("css_scores")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .first();
    
    if (cssRecord === null || cssRecord === undefined) {
      return null;
    }
    
    return {
      composite_success_score: cssRecord.composite_success_score,
      success_level: cssRecord.success_level,
      breakdown: cssRecord.breakdown,
      calculatedAt: cssRecord.calculatedAt,
      calculationVersion: cssRecord.calculationVersion
    };
  },
});
