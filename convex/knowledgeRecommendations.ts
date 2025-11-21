/**
 * Knowledge Recommendations for Post-Session Reports
 * 
 * Generates personalized knowledge article recommendations based on session content.
 * Called asynchronously after report generation to avoid blocking the main report query.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { ReflectionPayload } from "./types";

interface KnowledgeRecommendation {
  id: string;
  title: string;
  category: string;
  content: string;
  fullContent: string;
  relevance: number;
  source: string;
}

/**
 * Type-safe helper to extract string from payload
 */
function getString(payload: ReflectionPayload | undefined, key: string, fallback: string = ''): string {
  if (payload === null || payload === undefined) {
    return fallback;
  }
  const value = payload[key];
  return typeof value === 'string' ? value : fallback;
}

/**
 * Type-safe helper to extract array from payload
 */
function getArray<T>(payload: ReflectionPayload | undefined, key: string): T[] {
  if (payload === null || payload === undefined) {
    return [];
  }
  const value = payload[key];
  return Array.isArray(value) ? value as T[] : [];
}

/**
 * Generate knowledge recommendations for a GROW session
 */
async function generateGrowRecommendations(
  ctx: any,
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): Promise<KnowledgeRecommendation[]> {
  const topics: string[] = [];
  
  // Extract goal
  const goalReflection = reflections.find(r => r.step === 'goal');
  const goal = getString(goalReflection?.payload, 'goal');
  if (goal.length > 0) {
    topics.push(goal);
  }
  
  // Extract current state and challenges
  const realityReflection = reflections.find(r => r.step === 'reality');
  const currentState = getString(realityReflection?.payload, 'current_state');
  if (currentState.length > 0) {
    topics.push(currentState);
  }
  
  // Extract constraints as additional context
  const constraints = getArray<string>(realityReflection?.payload, 'constraints');
  if (constraints.length > 0) {
    topics.push(...constraints.slice(0, 2)); // Top 2 constraints
  }
  
  // Build search query
  const searchQuery = topics.join(' ').substring(0, 500); // Limit query length
  
  if (searchQuery.trim().length === 0) {
    return [];
  }
  
  // Search knowledge base
  const results = await ctx.runAction(api.knowledgeSearch.searchKnowledge, {
    query: searchQuery,
    limit: 5
  });
  
  return results as KnowledgeRecommendation[];
}

/**
 * Generate knowledge recommendations for a CAREER session
 */
async function generateCareerRecommendations(
  ctx: any,
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): Promise<KnowledgeRecommendation[]> {
  const topics: string[] = [];
  
  // Extract target role and current role
  const assessmentReflections = reflections.filter(r => r.step === 'ASSESSMENT');
  const assessment = assessmentReflections[assessmentReflections.length - 1]?.payload;
  
  const currentRole = getString(assessment, 'current_role');
  const targetRole = getString(assessment, 'target_role');
  
  if (targetRole.length > 0) {
    topics.push(`career transition to ${targetRole}`);
  }
  if (currentRole.length > 0 && targetRole.length > 0) {
    topics.push(`from ${currentRole} to ${targetRole}`);
  }
  
  // Extract skill gaps
  const gapAnalysisReflections = reflections.filter(r => r.step === 'GAP_ANALYSIS');
  const gapAnalysis = gapAnalysisReflections[gapAnalysisReflections.length - 1]?.payload;
  
  const skillGaps = getArray<string>(gapAnalysis, 'skill_gaps');
  if (skillGaps.length > 0) {
    topics.push(...skillGaps.slice(0, 3)); // Top 3 skill gaps
  }
  
  // Extract development priorities
  const priorities = getArray<string>(gapAnalysis, 'development_priorities');
  if (priorities.length > 0) {
    topics.push(...priorities.slice(0, 2)); // Top 2 priorities
  }
  
  // Build search query
  const searchQuery = topics.join(' ').substring(0, 500);
  
  if (searchQuery.trim().length === 0) {
    return [];
  }
  
  // Search knowledge base with career focus
  const results = await ctx.runAction(
    { _name: 'knowledgeSearch:searchKnowledge' } as any,
    {
      query: searchQuery,
      category: 'career_development', // Filter to career articles
      limit: 5
    }
  );
  
  return results as KnowledgeRecommendation[];
}

/**
 * Generate knowledge recommendations for a COMPASS session
 */
async function generateCompassRecommendations(
  ctx: any,
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): Promise<KnowledgeRecommendation[]> {
  const topics: string[] = [];
  
  // Extract change description
  const clarityReflection = reflections.find(r => r.step === 'clarity');
  const changeDescription = getString(clarityReflection?.payload, 'change_description');
  if (changeDescription.length > 0) {
    topics.push(changeDescription);
  }
  
  // Extract personal benefit and fears
  const ownershipReflection = reflections.find(r => r.step === 'ownership');
  const personalBenefit = getString(ownershipReflection?.payload, 'personal_benefit');
  if (personalBenefit.length > 0) {
    topics.push(personalBenefit);
  }
  
  const primaryFears = getArray<string>(ownershipReflection?.payload, 'primary_fears');
  if (primaryFears.length > 0) {
    topics.push(...primaryFears.slice(0, 2));
  }
  
  // Extract committed action
  const mappingReflection = reflections.find(r => r.step === 'mapping');
  const committedAction = getString(mappingReflection?.payload, 'committed_action');
  if (committedAction.length > 0) {
    topics.push(committedAction);
  }
  
  // Build search query
  const searchQuery = topics.join(' ').substring(0, 500);
  
  if (searchQuery.trim().length === 0) {
    return [];
  }
  
  // Search knowledge base
  const results = await ctx.runAction(
    { _name: 'knowledgeSearch:searchKnowledge' } as any,
    {
      query: searchQuery,
      limit: 5
    }
  );
  
  return results as KnowledgeRecommendation[];
}

/**
 * Main action to generate knowledge recommendations for any framework
 * 
 * @example
 * ```typescript
 * const recommendations = await ctx.runAction(api.knowledgeRecommendations.generateRecommendations, {
 *   sessionId: session._id
 * });
 * ```
 */
export const generateRecommendations = action({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    // Get session
    const session = await ctx.runQuery(api.queries.getSession, {
      sessionId: args.sessionId
    });
    
    if (session === null || session === undefined) {
      throw new Error(`Session ${args.sessionId} not found`);
    }
    
    // Get reflections
    const reflections = await ctx.runQuery(api.queries.getSessionReflections, {
      sessionId: args.sessionId
    });
    
    // Generate recommendations based on framework
    const framework = session.framework.toUpperCase();
    
    let recommendations: KnowledgeRecommendation[] = [];
    
    if (framework === 'GROW') {
      recommendations = await generateGrowRecommendations(ctx, reflections);
    } else if (framework === 'CAREER') {
      recommendations = await generateCareerRecommendations(ctx, reflections);
    } else if (framework === 'COMPASS') {
      recommendations = await generateCompassRecommendations(ctx, reflections);
    }
    
    // Filter by relevance threshold (60%)
    const filtered = recommendations.filter(r => r.relevance >= 0.6);
    
    // Return top 5
    return filtered.slice(0, 5);
  },
});

/**
 * Get recommendations by category for browsing
 * Useful for "Explore More" sections
 */
export const getRecommendationsByCategory = action({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    const results = await ctx.runAction(
      { _name: 'knowledgeSearch:searchByCategory' } as any,
      {
        category: args.category,
        limit
      }
    );
    
    return results as KnowledgeRecommendation[];
  },
});
