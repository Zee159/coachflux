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

/**
 * Debug: Analyze knowledge base content depth
 */
export const analyzeKnowledgeDepth = query({
  args: {},
  handler: async (ctx) => {
    const allKnowledge = await ctx.db.query("knowledgeEmbeddings").collect();
    
    const analysis = allKnowledge.map(item => {
      const wordCount = item.content.split(/\s+/).length;
      const hasScripts = item.content.includes('Script:') || item.content.includes('"') || item.content.includes("'");
      const hasTemplates = item.content.includes('Template:') || item.content.includes('Checklist:') || item.content.includes('✅');
      const hasTroubleshooting = item.content.toLowerCase().includes('mistake') || item.content.toLowerCase().includes('wrong') || item.content.toLowerCase().includes('avoid');
      const hasExamples = item.content.toLowerCase().includes('example') || item.content.includes('Situation');
      
      return {
        id: item._id,
        title: item.title,
        category: item.category,
        source: item.source,
        wordCount,
        hasScripts,
        hasTemplates,
        hasTroubleshooting,
        hasExamples,
        qualityScore: (
          (wordCount > 800 ? 2 : wordCount > 500 ? 1 : 0) +
          (hasScripts ? 1 : 0) +
          (hasTemplates ? 1 : 0) +
          (hasTroubleshooting ? 1 : 0) +
          (hasExamples ? 1 : 0)
        )
      };
    });
    
    // Sort by quality score descending
    analysis.sort((a, b) => b.qualityScore - a.qualityScore);
    
    // Calculate summary stats
    const totalScenarios = analysis.length;
    const avgWordCount = Math.round(analysis.reduce((sum, item) => sum + item.wordCount, 0) / totalScenarios);
    const deepContent = analysis.filter(item => item.wordCount > 800).length;
    const mediumContent = analysis.filter(item => item.wordCount >= 500 && item.wordCount <= 800).length;
    const shallowContent = analysis.filter(item => item.wordCount < 500).length;
    const withScripts = analysis.filter(item => item.hasScripts).length;
    const withTemplates = analysis.filter(item => item.hasTemplates).length;
    const avgQualityScore = (analysis.reduce((sum, item) => sum + item.qualityScore, 0) / totalScenarios).toFixed(1);
    
    // Group by category
    const byCategory: Record<string, { count: number; avgWords: number }> = {};
    for (const item of analysis) {
      const existing = byCategory[item.category];
      if (existing !== undefined) {
        existing.count += 1;
        existing.avgWords += item.wordCount;
      } else {
        byCategory[item.category] = { count: 1, avgWords: item.wordCount };
      }
    }
    
    for (const [, categoryStats] of Object.entries(byCategory)) {
      if (categoryStats.count > 0) {
        categoryStats.avgWords = Math.round(categoryStats.avgWords / categoryStats.count);
      }
    }
    
    return {
      summary: {
        totalScenarios,
        avgWordCount,
        deepContent: `${deepContent} (${Math.round(deepContent/totalScenarios*100)}%)`,
        mediumContent: `${mediumContent} (${Math.round(mediumContent/totalScenarios*100)}%)`,
        shallowContent: `${shallowContent} (${Math.round(shallowContent/totalScenarios*100)}%)`,
        withScripts: `${withScripts} (${Math.round(withScripts/totalScenarios*100)}%)`,
        withTemplates: `${withTemplates} (${Math.round(withTemplates/totalScenarios*100)}%)`,
        avgQualityScore: `${avgQualityScore}/6`,
        readyForChatbot: deepContent >= 30 && avgWordCount >= 700
      },
      byCategory,
      topQuality: analysis.slice(0, 10),
      needsEnhancement: analysis.filter(item => item.qualityScore < 3).slice(0, 10)
    };
  }
});
