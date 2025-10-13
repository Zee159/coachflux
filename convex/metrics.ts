import { query } from "./_generated/server";
import { v } from "convex/values";

export const alignmentIndex = query({
  args: { orgId: v.id("orgs"), windowDays: v.number() },
  handler: async (ctx, args) => {
    const from = Date.now() - args.windowDays * 86400000;
    const rows = await ctx.db
      .query("reflections")
      .withIndex("bySession")
      .collect();

    // Filter by orgId and time window, and extract alignment scores
    const scores = rows
      .filter(
        (r) => {
          if (r.orgId.toString() !== args.orgId.toString() || r.createdAt < from) {
            return false;
          }
          const payload = r.payload as Record<string, unknown> | null | undefined;
          if (payload === null || payload === undefined || typeof payload !== 'object') {
            return false;
          }
          const score = payload['alignment_score'];
          return score !== null && score !== undefined && typeof score === 'number';
        }
      )
      .map((r) => {
        const payload = r.payload as Record<string, unknown>;
        return payload['alignment_score'] as number;
      });

    const avg = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    return { avgAlignmentScore: avg, sample: scores.length };
  },
});

export const getSessionStats = query({
  args: { orgId: v.id("orgs"), windowDays: v.number() },
  handler: async (ctx, args) => {
    const from = Date.now() - args.windowDays * 86400000;
    const sessions = await ctx.db.query("sessions").collect();

    const filtered = sessions.filter(
      (s) =>
        s.orgId.toString() === args.orgId.toString() && s.startedAt >= from
    );

    const completed = filtered.filter((s) => s.closedAt !== null && s.closedAt !== undefined).length;
    const active = filtered.filter((s) => s.closedAt === null || s.closedAt === undefined).length;

    return {
      total: filtered.length,
      completed,
      active,
      completionRate: filtered.length > 0 ? (completed / filtered.length) * 100 : 0,
    };
  },
});

export const getActionStats = query({
  args: { orgId: v.id("orgs") },
  handler: async (ctx, args) => {
    const actions = await ctx.db.query("actions").collect();

    const filtered = actions.filter(
      (a) => a.orgId.toString() === args.orgId.toString()
    );

    const done = filtered.filter((a) => a.status === "done").length;
    const open = filtered.filter((a) => a.status === "open").length;
    const overdue = filtered.filter(
      (a) => a.status === "open" && a.dueAt !== null && a.dueAt !== undefined && a.dueAt < Date.now()
    ).length;

    return {
      total: filtered.length,
      done,
      open,
      overdue,
      completionRate: filtered.length > 0 ? (done / filtered.length) * 100 : 0,
    };
  },
});
