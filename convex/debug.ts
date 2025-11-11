/**
 * Debug utilities for troubleshooting Career Coach sessions
 */

import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Debug: Get all reflections for a session with full payload data
 */
export const debugSessionReflections = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (session === null || session === undefined) {
      return { error: "Session not found" };
    }

    const reflections = await ctx.db
      .query("reflections")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();

    return {
      session: {
        _id: session._id,
        framework: session.framework,
        step: session.step,
        createdAt: session._creationTime,
        closedAt: session.closedAt
      },
      reflections: reflections.map(r => {
        const payload = r.payload as Record<string, unknown>;
        return {
          _id: r._id,
          step: r.step,
          userInput: r.userInput,
          payload: payload,
          payloadKeys: Object.keys(payload),
          createdAt: r.createdAt
        };
      })
    };
  }
});

/**
 * Debug: Check what fields are missing from each step
 */
export const debugCareerSessionFields = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (session === null || session === undefined) {
      return { error: "Session not found" };
    }

    if (session.framework !== 'CAREER') {
      return { error: "Not a CAREER framework session" };
    }

    const reflections = await ctx.db
      .query("reflections")
      .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();

    // Expected fields for each step
    const expectedFields: Record<string, string[]> = {
      INTRODUCTION: ["user_consent", "coaching_focus"],
      ASSESSMENT: ["current_role", "years_experience", "industry", "target_role", "timeframe", "career_stage", "initial_confidence", "assessment_score"],
      GAP_ANALYSIS: ["skill_gaps", "experience_gaps", "ai_wants_suggestions", "transferable_skills", "development_priorities", "gap_analysis_score"],
      ROADMAP: ["learning_actions", "networking_actions", "experience_actions", "milestone_3_months", "milestone_6_months", "roadmap_score"],
      REVIEW: ["key_takeaways", "immediate_next_step", "biggest_challenge", "final_confidence", "final_clarity", "session_helpfulness"]
    };

    const stepAnalysis: Record<string, {
      reflectionCount: number;
      lastReflectionPayload: Record<string, unknown>;
      expectedFields: string[];
      foundFields: string[];
      missingFields: string[];
      fieldValues: Record<string, unknown>;
    }> = {};

    for (const [stepName, fields] of Object.entries(expectedFields)) {
      const stepReflections = reflections.filter(r => r.step === stepName);
      const lastReflection = stepReflections[stepReflections.length - 1];
      const payload = (lastReflection?.payload as Record<string, unknown>) ?? {};
      
      const foundFields = fields.filter(f => f in payload);
      const missingFields = fields.filter(f => !(f in payload));
      
      const fieldValues: Record<string, unknown> = {};
      for (const field of fields) {
        fieldValues[field] = payload[field] ?? null;
      }

      stepAnalysis[stepName] = {
        reflectionCount: stepReflections.length,
        lastReflectionPayload: payload,
        expectedFields: fields,
        foundFields,
        missingFields,
        fieldValues
      };
    }

    return {
      sessionId: args.sessionId,
      framework: session.framework,
      currentStep: session.step,
      stepAnalysis
    };
  }
});
