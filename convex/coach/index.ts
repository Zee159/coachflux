/**
 * Coach Module - Main Entry Point
 * Exports coaching actions and orchestrates framework-specific coaches
 */

import { action, type ActionCtx } from "../_generated/server";
import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import Anthropic from "@anthropic-ai/sdk";
import { ANALYSIS_GENERATION_PROMPT } from "../prompts/index";
import { api } from "../_generated/api";
import type { Framework, OrgValue, ReflectionPayload } from "../types";
import { detectSuggestionChoice } from "../types";
import { getFrameworkLegacy } from "../frameworks/registry";
import type { FrameworkCoach, CoachActionResult } from "./types";
import { growCoach } from "./grow";
import { compassCoach } from "./compass";
import { CareerCoach } from "./career";
import { getEmergencyResources } from "../safety";

// Type for knowledge base search results
interface KnowledgeEmbedding {
  _id: Id<"knowledgeEmbeddings">;
  _score: number;
  source: string;
  category: string;
  title: string;
  content: string;
  embedding: number[];
  metadata?: unknown;
  createdAt: number;
}
import {
  aggregateStepState,
  performSafetyChecks,
  generateSafetyAlerts,
  detectLoop,
  generateCoachResponse,
  validateResponse,
  preValidateResponse,
  buildConversationHistory,
  createActionsFromPayload,
  advanceToNextStep,
  extractExistingContext,
  replaceDynamicValues,
  type CoachMutations,
  type CoachQueries
} from "./base";
import { calculateCSS } from "../utils/cssCalculator";
import type { MindsetState } from "../utils/cssCalculator";

// ============================================================================
// FEATURE FLAGS
// ============================================================================
const USE_MODULAR_REGISTRY = true; // Use modular framework registry

// ============================================================================
// FRAMEWORK COACH REGISTRY
// ============================================================================

/**
 * Get framework coach for a specific framework
 */
const careerCoach = new CareerCoach();

function getFrameworkCoach(frameworkId: string): FrameworkCoach {
  const id = frameworkId.toUpperCase();
  
  if (id === 'GROW') {
    return growCoach;
  }
  
  if (id === 'COMPASS') {
    return compassCoach;
  }
  
  if (id === 'CAREER') {
    return careerCoach;
  }
  
  // Default to GROW coach for unknown frameworks
  console.warn(`Unknown framework: ${frameworkId}, defaulting to GROW coach`);
  return growCoach;
}

/**
 * Legacy framework getter (for backward compatibility)
 */
const getFrameworkHardcoded = (): Framework => {
  return {
    id: "GROW",
    steps: [
      {
        name: "introduction",
        system_objective: "Welcome user, explain GROW framework, and get consent before starting session.",
        required_fields_schema: {
          type: "object",
          properties: {
            user_consent_given: { type: "boolean" },
            coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
          },
          required: ["coach_reflection"],
          additionalProperties: false
        }
      },
      {
        name: "goal",
        system_objective: "Clarify the desired outcome and timeframe.",
        required_fields_schema: {
          type: "object",
          properties: {
            goal: { type: "string", minLength: 8, maxLength: 240 },
            why_now: { type: "string", minLength: 8, maxLength: 240 },
            success_criteria: { type: "array", items: { type: "string", minLength: 3 }, minItems: 1, maxItems: 5 },
            timeframe: { type: "string", minLength: 3, maxLength: 100 },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["coach_reflection"],
          additionalProperties: false
        }
      },
      {
        name: "reality",
        system_objective: "Surface current constraints, facts, and risks without judgement.",
        required_fields_schema: {
          type: "object",
          properties: {
            current_state: { type: "string", minLength: 8, maxLength: 320 },
            constraints: { type: "array", items: { type: "string" }, maxItems: 6 },
            resources: { type: "array", items: { type: "string" }, maxItems: 6 },
            risks: { type: "array", items: { type: "string" }, maxItems: 6 },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["current_state", "coach_reflection"],
          additionalProperties: false
        }
      },
      {
        name: "options",
        system_objective: "Facilitate user discovering at least two viable options (user-generated or AI-suggested) with pros and cons.",
        required_fields_schema: {
          type: "object",
          properties: {
            options: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string", minLength: 3, maxLength: 60 },
                  pros: { type: "array", items: { type: "string" }, maxItems: 5 },
                  cons: { type: "array", items: { type: "string" }, maxItems: 5 },
                  feasibilityScore: { type: "integer", minimum: 1, maximum: 10 },
                  effortRequired: { type: "string" },
                  alignmentReason: { type: "string", maxLength: 200 }
                },
                required: ["label"],
                additionalProperties: false
              },
              minItems: 1,
              maxItems: 5
            },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["coach_reflection"],
          additionalProperties: false
        }
      },
      {
        name: "will",
        system_objective: "Select 1-3 options and define SMART actions with accountability for each.",
        required_fields_schema: {
          type: "object",
          properties: {
            chosen_options: { 
              type: "array", 
              items: { type: "string" },
              minItems: 1,
              maxItems: 3
            },
            actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", minLength: 4, maxLength: 120 },
                  owner: { type: "string" },
                  due_days: { type: "integer", minimum: 1 },
                  support_needed: { type: "string", minLength: 2, maxLength: 200 },
                  accountability_mechanism: { type: "string", minLength: 5, maxLength: 200 }
                },
                required: ["title"],
                additionalProperties: false
              },
              minItems: 1,
              maxItems: 3
            },
            action_plan_timeframe: { type: "string", minLength: 2, maxLength: 100 },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["coach_reflection"],
          additionalProperties: false
        }
      },
      {
        name: "review",
        system_objective: "Two-phase: First ask user review questions, then provide AI insights.",
        required_fields_schema: {
          type: "object",
          properties: {
            key_takeaways: { type: "string", minLength: 10, maxLength: 500 },
            immediate_step: { type: "string", minLength: 5, maxLength: 300 },
            summary: { type: "string", minLength: 16, maxLength: 400 },
            ai_insights: { type: "string", minLength: 20, maxLength: 400 },
            unexplored_options: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
            identified_risks: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
            potential_pitfalls: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["coach_reflection"],
          additionalProperties: false
        }
      }
    ]
  };
};

const getFramework = (frameworkId: string = 'GROW'): Framework => {
  if (USE_MODULAR_REGISTRY) {
    return getFrameworkLegacy(frameworkId) as Framework;
  }
  return getFrameworkHardcoded();
};

/**
 * Helper to create mutations object without triggering TypeScript deep recursion
 * 
 * NOTE: @ts-expect-error and 'any' are documented workarounds for Convex's deep type recursion.
 * This is whitelisted in scripts/safety-check.js
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
function createMutations(): CoachMutations {
  // @ts-ignore - Convex generated types cause deep recursion; runtime types are correct
  const m: any = api.mutations;
  return {
    markSessionEscalated: m.markSessionEscalated,
    createSafetyIncident: m.createSafetyIncident,
    createAction: m.createAction,
    closeSession: m.closeSession,
    createReflection: m.createReflection,
    updateSessionStep: m.updateSessionStep,
    updateSession: m.updateSession, // Phase 2: OPTIONS state tracking
    pauseSession: m.pauseSession,
    storePendingUserTurn: m.storePendingUserTurn,
    clearSafetyPause: m.clearSafetyPause
  };
}

function createQueries(): CoachQueries {
  const q: any = api.queries;
  return {
    getSessionActions: q.getSessionActions
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

// ============================================================================
// PHASE 2: OPTIONS STATE TRACKING
// ============================================================================

/**
 * Update OPTIONS state tracking for GROW framework
 * Tracks current state (A or B) and AI suggestion count
 */
async function updateOptionsState(
  ctx: ActionCtx,
  _mutations: CoachMutations,
  sessionId: Id<"sessions">,
  payload: ReflectionPayload
): Promise<void> {
  const options = payload["options"] as Array<{ label?: string; pros?: unknown[]; cons?: unknown[]; feasibilityScore?: number }> | undefined;
  
  if (!Array.isArray(options) || options.length === 0) {
    return; // No options yet, stay in current state
  }

  // Determine current state based on last option
  const lastOption = options[options.length - 1];
  const hasPros = Array.isArray(lastOption?.pros) && lastOption.pros.length > 0;
  const hasCons = Array.isArray(lastOption?.cons) && lastOption.cons.length > 0;
  
  let newState: "A" | "B";
  if (!hasPros && !hasCons) {
    newState = "A"; // Just collected label, waiting for pros/cons
  } else if (hasPros && hasCons) {
    newState = "B"; // Collected pros/cons, ready for next option or AI suggestions
  } else {
    newState = "A"; // Partial data, stay in collection mode
  }

  // Count AI-generated options (have feasibilityScore)
  const aiOptions = options.filter(opt => opt.feasibilityScore !== undefined);
  const aiCount = aiOptions.length;

  // Update session state
  await ctx.runMutation(api.mutations.updateSession, {
    sessionId,
    options_state: newState,
    ai_suggestion_count: aiCount
  });
}

// ============================================================================
// STRUCTURED INPUT HANDLER (for button interactions)
// ============================================================================

async function handleStructuredInput(
  ctx: ActionCtx,
  _mutations: ReturnType<typeof createMutations>,
  args: {
    orgId: Id<"orgs">;
    userId: Id<"users">;
    sessionId: Id<"sessions">;
    stepName: string;
    userTurn: string;
    structuredInput?: { type: string; data: unknown };
  },
  _session: { framework: string; step: string; _id: Id<"sessions"> }
): Promise<CoachActionResult> {
  
  if (args.structuredInput === null || args.structuredInput === undefined) {
    return { ok: false, message: "No structured input provided" };
  }

  const { type, data } = args.structuredInput;

  switch (type) {
    case 'options_selection': {
      // User selected options via buttons
      const { selected_option_ids } = data as { selected_option_ids: string[] };
      
      // Get the options from the last reflection to find labels
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const lastReflection = sessionReflections[sessionReflections.length - 1];
      const lastPayload = lastReflection?.payload as Record<string, unknown> | undefined;
      const options = lastPayload?.['options'] as Array<{ id: string; label: string; description?: string }> | undefined;
      
      // Create reflection with selected options and advance to Will step
      const selectedOptions = selected_option_ids.map(id => {
        const option = options?.find(opt => opt.id === id);
        return option?.label ?? id;
      });
      
      // Create reflection with selected options (silent transition marker)
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: 'options',
        userInput: args.userTurn,
        payload: {
          ...lastPayload,
          selected_option_ids,
          coach_reflection: `[OPTIONS_SELECTED:${selectedOptions.join(', ')}]`
        }
      });
      
      // Advance to Will step
      await ctx.runMutation(api.mutations.updateSessionStep, {
        sessionId: args.sessionId,
        step: 'will'
      });
      
      // Frontend will make a second call to trigger AI generation of first suggested action
      return { ok: true };
    }

    case 'action_accepted': {
      // User accepted AI-suggested action
      const { option_id, action } = data as { option_id: string; action: Record<string, unknown> };
      
      // Get current state from last reflection
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const lastReflection = sessionReflections[sessionReflections.length - 1];
      const lastPayload = lastReflection?.payload as Record<string, unknown> | undefined;
      
      const selectedOptionIds = lastPayload?.['selected_option_ids'] as string[] | undefined ?? [];
      const currentOptionIndex = (lastPayload?.['current_option_index'] as number | undefined) ?? 0;
      const currentOptionLabel = lastPayload?.['current_option_label'] as string | undefined;
      const existingActions = lastPayload?.['actions'] as Array<Record<string, unknown>> | undefined ?? [];
      
      // eslint-disable-next-line no-console
      console.log('[ACTION_ACCEPTED] Debug:', {
        selectedOptionIds,
        currentOptionIndex,
        totalOptions: selectedOptionIds.length,
        existingActionsCount: existingActions.length
      });
      
      // Add accepted action to actions array
      const newAction = {
        option_id,
        option_label: currentOptionLabel,
        ...action
      };
      const updatedActions = [...existingActions, newAction];
      
      // Check if more options to process
      const nextIndex = currentOptionIndex + 1;
      const hasMoreOptions = nextIndex < selectedOptionIds.length;
      
      // eslint-disable-next-line no-console
      console.log('[ACTION_ACCEPTED] Next step:', {
        nextIndex,
        hasMoreOptions,
        willAdvanceToReview: !hasMoreOptions
      });
      
      // Store accepted action
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: 'will',
        userInput: args.userTurn,
        payload: {
          ...lastPayload,
          actions: updatedActions,
          current_option_index: nextIndex,
          coach_reflection: `[ACTION_ACCEPTED]`
        }
      });
      
      if (hasMoreOptions) {
        // Frontend will make another call to generate next suggested action
        return { ok: true };
      } else {
        // All options processed - advance to Review
        // Remove suggested_action to prevent ActionValidator from showing
        const finalPayload = { ...lastPayload };
        delete finalPayload['suggested_action'];
        delete finalPayload['current_option_label'];
        
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: 'will',
          userInput: args.userTurn,
          payload: {
            ...finalPayload,
            actions: updatedActions,
            coach_reflection: `Perfect! You've created ${updatedActions.length} action${updatedActions.length > 1 ? 's' : ''}. Let's review what you've accomplished.`
          }
        });
        
        // Advance to Review step
        await ctx.runMutation(api.mutations.updateSessionStep, {
          sessionId: args.sessionId,
          step: 'review'
        });
        
        // Create actions in database from Will step payload
        const mutations = createMutations();
        const queries = createQueries();
        const willStep = { name: 'will' };
        const willPayload = { ...finalPayload, actions: updatedActions };
        await createActionsFromPayload(ctx, mutations, queries, willStep, willPayload, args);
        
        // Create initial Review reflection with first question
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: 'review',
          userInput: '',
          payload: {
            coach_reflection: "What are your key takeaways from this session?"
          }
        });
        
        return { ok: true };
      }
    }

    case 'action_skipped': {
      // User skipped this option
      const { option_id: _option_id } = data as { option_id: string };
      
      // Get current state from last reflection
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const lastReflection = sessionReflections[sessionReflections.length - 1];
      const lastPayload = lastReflection?.payload as Record<string, unknown> | undefined;
      
      const selectedOptionIds = lastPayload?.['selected_option_ids'] as string[] | undefined ?? [];
      const currentOptionIndex = (lastPayload?.['current_option_index'] as number | undefined) ?? 0;
      const existingActions = lastPayload?.['actions'] as Array<Record<string, unknown>> | undefined ?? [];
      
      // Check if more options to process
      const nextIndex = currentOptionIndex + 1;
      const hasMoreOptions = nextIndex < selectedOptionIds.length;
      
      // Store skip action
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: 'will',
        userInput: args.userTurn,
        payload: {
          ...lastPayload,
          current_option_index: nextIndex,
          coach_reflection: `[ACTION_SKIPPED]`
        }
      });
      
      if (hasMoreOptions) {
        // Frontend will make another call to generate next suggested action
        return { ok: true };
      } else {
        // All options processed - advance to Review
        // Remove suggested_action to prevent ActionValidator from showing
        const finalPayload = { ...lastPayload };
        delete finalPayload['suggested_action'];
        delete finalPayload['current_option_label'];
        
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: 'will',
          userInput: args.userTurn,
          payload: {
            ...finalPayload,
            coach_reflection: existingActions.length > 0 
              ? `You've created ${existingActions.length} action${existingActions.length > 1 ? 's' : ''}. Let's review what you've accomplished.`
              : `No actions created. Let's review your session and identify next steps.`
          }
        });
        
        // Advance to Review step
        await ctx.runMutation(api.mutations.updateSessionStep, {
          sessionId: args.sessionId,
          step: 'review'
        });
        
        // Create actions in database from Will step payload
        const mutations = createMutations();
        const queries = createQueries();
        const willStep = { name: 'will' };
        const willPayload = { ...finalPayload, actions: existingActions };
        await createActionsFromPayload(ctx, mutations, queries, willStep, willPayload, args);
        
        // Create initial Review reflection with first question
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: 'review',
          userInput: '',
          payload: {
            coach_reflection: "What are your key takeaways from this session?"
          }
        });
        
        return { ok: true };
      }
    }

    case 'gap_selection': {
      // User selected AI-suggested gaps in Career Coach GAP_ANALYSIS
      const { selected_gap_ids } = data as { selected_gap_ids: string[] };
      
      // Create reflection with selected gap IDs
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: args.stepName,
        userInput: args.userTurn,
        payload: {
          selected_gap_ids,
          coach_reflection: selected_gap_ids.length > 0
            ? `Great! I've noted those ${selected_gap_ids.length} gap${selected_gap_ids.length > 1 ? 's' : ''}. Now let's identify your transferable skills.`
            : "No problem! Let's move on to identifying your transferable skills."
        }
      });
      
      return { ok: true, message: 'Gap selection recorded' };
    }

    case 'priority_selection': {
      // User selected development priorities in Career Coach GAP_ANALYSIS
      const { development_priorities } = data as { development_priorities: string[] };
      
      // Create reflection with priorities
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: args.stepName,
        userInput: args.userTurn,
        payload: {
          development_priorities,
          coach_reflection: `Perfect! You've prioritized ${development_priorities.length} gap${development_priorities.length > 1 ? 's' : ''} to focus on. These will guide your roadmap. On a scale of 1-10, how manageable do these gaps feel?`
        }
      });
      
      return { ok: true, message: 'Priorities recorded' };
    }

    case 'roadmap_finalization': {
      // User finalized roadmap selections in Career Coach ROADMAP
      const { 
        selected_learning_ids,
        selected_networking_ids,
        selected_experience_ids,
        milestone_3_months,
        milestone_6_months
      } = data as {
        selected_learning_ids: string[];
        selected_networking_ids: string[];
        selected_experience_ids: string[];
        milestone_3_months: string;
        milestone_6_months: string;
      };
      
      // Create reflection with finalized roadmap
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: args.stepName,
        userInput: args.userTurn,
        payload: {
          selected_learning_ids,
          selected_networking_ids,
          selected_experience_ids,
          milestone_3_months,
          milestone_6_months,
          coach_reflection: `Excellent! You've created a comprehensive roadmap with ${selected_learning_ids.length} learning actions, ${selected_networking_ids.length} networking actions, and ${selected_experience_ids.length} experience actions. On a scale of 1-10, how committed are you to executing this roadmap?`
        }
      });
      
      return { ok: true, message: 'Roadmap finalized' };
    }

    case 'gap_completion': {
      // User completed one gap in the roadmap
      const {
        gap_id,
        selected_learning_ids,
        selected_networking_ids,
        selected_experience_ids,
        milestone
      } = data as {
        gap_id: string;
        selected_learning_ids: string[];
        selected_networking_ids: string[];
        selected_experience_ids: string[];
        milestone: string;
      };
      
      const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
      if (session === null) {
        return { ok: false, message: 'Session not found' };
      }
      
      // Get current roadmap state
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const roadmapReflections = sessionReflections.filter((r: { step: string }) => r.step === 'ROADMAP');
      const lastRoadmapReflection = roadmapReflections[roadmapReflections.length - 1];
      
      if (lastRoadmapReflection === undefined) {
        return { ok: false, message: 'Roadmap not found' };
      }
      
      const payload = lastRoadmapReflection.payload as Record<string, unknown>;
      const aiSuggestedRoadmap = payload['ai_suggested_roadmap'] as Record<string, unknown> | undefined;
      
      if (aiSuggestedRoadmap === undefined) {
        return { ok: false, message: 'Roadmap data not found' };
      }
      
      const gapCards = Array.isArray(aiSuggestedRoadmap['gap_cards']) 
        ? aiSuggestedRoadmap['gap_cards'] as Array<Record<string, unknown>>
        : [];
      const currentGapIndex = typeof aiSuggestedRoadmap['current_gap_index'] === 'number'
        ? aiSuggestedRoadmap['current_gap_index']
        : 0;
      
      // Store this gap's selections
      const gapSelections = payload[`gap_${currentGapIndex}_selections`] as Record<string, unknown> | undefined ?? {};
      gapSelections[gap_id] = {
        selected_learning_ids,
        selected_networking_ids,
        selected_experience_ids,
        milestone
      };
      
      // Check if there are more gaps
      const nextGapIndex = currentGapIndex + 1;
      const hasMoreGaps = nextGapIndex < gapCards.length;
      
      if (hasMoreGaps) {
        // Move to next gap
        const nextGap = gapCards[nextGapIndex];
        const nextGapName = nextGap !== undefined ? String(nextGap['gap_name'] ?? 'next gap') : 'next gap';
        
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: args.stepName,
          userInput: args.userTurn,
          payload: {
            ...payload,
            [`gap_${currentGapIndex}_selections`]: gapSelections[gap_id],
            ai_suggested_roadmap: {
              ...aiSuggestedRoadmap,
              current_gap_index: nextGapIndex
            },
            coach_reflection: `Great! You've completed gap ${currentGapIndex + 1}. Now let's work on gap ${nextGapIndex + 1}: ${nextGapName}.`
          }
        });
        
        return { ok: true, message: `Moving to gap ${nextGapIndex + 1}` };
      } else {
        // All gaps completed - finalize roadmap
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: args.stepName,
          userInput: args.userTurn,
          payload: {
            ...payload,
            [`gap_${currentGapIndex}_selections`]: gapSelections[gap_id],
            roadmap_completed: true,
            coach_reflection: `Excellent! You've completed your roadmap for all ${gapCards.length} gaps. On a scale of 1-10, how committed are you to executing this roadmap?`
          }
        });
        
        return { ok: true, message: 'Roadmap completed!' };
      }
    }

    case 'gap_modification': {
      // User wants to modify a previously completed gap
      const {
        gap_index,
        selected_learning_ids,
        selected_networking_ids,
        selected_experience_ids,
        milestone
      } = data as {
        gap_index: number;
        selected_learning_ids: string[];
        selected_networking_ids: string[];
        selected_experience_ids: string[];
        milestone: string;
      };
      
      const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
      if (session === null) {
        return { ok: false, message: 'Session not found' };
      }
      
      // Get current roadmap state
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const roadmapReflections = sessionReflections.filter((r: { step: string }) => r.step === 'ROADMAP');
      const lastRoadmapReflection = roadmapReflections[roadmapReflections.length - 1];
      
      if (lastRoadmapReflection === undefined) {
        return { ok: false, message: 'Roadmap not found' };
      }
      
      const payload = lastRoadmapReflection.payload as Record<string, unknown>;
      
      // Update the specific gap's selections
      const updatedPayload = {
        ...payload,
        [`gap_${gap_index}_selections`]: {
          selected_learning_ids,
          selected_networking_ids,
          selected_experience_ids,
          milestone
        }
      };
      
      // Create new reflection with updated selections
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: args.stepName,
        userInput: args.userTurn,
        payload: {
          ...updatedPayload,
          coach_reflection: `Great! I've updated your selections for gap ${gap_index + 1}.`
        }
      });
      
      return { ok: true, message: `Gap ${gap_index + 1} updated successfully` };
    }

    case 'step_confirmation': {
      // User clicked Proceed or Amend on step confirmation buttons
      const { action } = data as { action: 'proceed' | 'amend' };
      const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
      
      if (session === null) {
        return { ok: false, message: 'Session not found' };
      }
      
      if (action === 'proceed') {
        // Clear awaiting confirmation
        await ctx.runMutation(api.mutations.setAwaitingConfirmation, {
          sessionId: args.sessionId,
          awaiting: false
        });
        
        const framework = session.framework;
        const currentStep = session.step;
        
        // Special handling for review step - trigger report generation instead of advancing
        if (currentStep.toLowerCase() === 'review') {
          if (framework === 'GROW') {
            // GROW: Generate full AI analysis via the generateReviewAnalysis action
            // This will be called from the frontend after this returns
            return { ok: true, message: 'Review confirmed, ready for report generation', triggerReportGeneration: true };
          } else if (framework === 'COMPASS') {
            // COMPASS: Trigger report generation (no AI analysis, but need to close properly)
            return { ok: true, message: 'Review confirmed, ready for report generation', triggerReportGeneration: true };
          } else if (framework === 'CAREER') {
            // CAREER: Generate career transition report via the generateReviewAnalysis action
            // This will be called from the frontend after this returns
            return { ok: true, message: 'Review confirmed, ready for report generation', triggerReportGeneration: true };
          }
        }
        
        // For non-review steps, advance to next step
        const nextStep = getNextStepForFramework(currentStep, framework);
        
        // Advance to next step
        await ctx.runMutation(api.mutations.updateSessionStep, {
          sessionId: args.sessionId,
          step: nextStep
        });
        
        // Special handling for CAREER ROADMAP - generate AI-powered personalized roadmap
        if (framework === 'CAREER' && nextStep === 'ROADMAP') {
          // Get all reflections to extract session context
          const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
            sessionId: args.sessionId
          });
          
          // Extract ASSESSMENT data
          const assessmentReflections = sessionReflections.filter((r: { step: string }) => r.step === 'ASSESSMENT');
          let currentRole = '';
          let targetRole = '';
          let industry = '';
          let careerStage = '';
          let timeframe = '';
          
          for (const reflection of assessmentReflections) {
            const payload = reflection.payload as Record<string, unknown>;
            if (typeof payload['current_role'] === 'string') {
              currentRole = payload['current_role'];
            }
            if (typeof payload['target_role'] === 'string') {
              targetRole = payload['target_role'];
            }
            if (typeof payload['industry'] === 'string') {
              industry = payload['industry'];
            }
            if (typeof payload['career_stage'] === 'string') {
              careerStage = payload['career_stage'];
            }
            if (typeof payload['timeframe'] === 'string') {
              timeframe = payload['timeframe'];
            }
          }
          
          // Extract development_priorities from GAP_ANALYSIS
          const gapReflections = sessionReflections.filter((r: { step: string }) => r.step === 'GAP_ANALYSIS');
          let developmentPriorities: string[] = [];
          
          for (const reflection of gapReflections) {
            const payload = reflection.payload as Record<string, unknown>;
            if (Array.isArray(payload['development_priorities'])) {
              developmentPriorities = payload['development_priorities'] as string[];
              break;
            }
          }
          
          // Generate AI-powered roadmap
          let gapCards;
          try {
            const aiRoadmap = await generateAIRoadmap(ctx, {
              currentRole,
              targetRole,
              industry,
              careerStage,
              timeframe,
              developmentPriorities
            });
            gapCards = aiRoadmap.gap_cards;
          } catch (error) {
            console.error('AI roadmap generation failed, using fallback:', error);
            // Fallback to simple template if AI fails
            gapCards = developmentPriorities.map((gap, gapIndex) => ({
              gap_id: `gap_${gapIndex}`,
              gap_name: gap,
              gap_index: gapIndex,
              total_gaps: developmentPriorities.length,
              learning_actions: [
                {
                  id: `learn_${gapIndex}_1`,
                  action: `Complete comprehensive training on ${gap}`,
                  timeline: "2 months",
                  resource: "Online course"
                },
                {
                  id: `learn_${gapIndex}_2`,
                  action: `Practice ${gap} through hands-on projects`,
                  timeline: "6 weeks",
                  resource: "Practice exercises"
                }
              ],
              networking_actions: [
                {
                  id: `network_${gapIndex}_1`,
                  action: `Connect with professionals who excel in ${gap}`,
                  timeline: "Next 2 weeks"
                }
              ],
              experience_actions: [
                {
                  id: `exp_${gapIndex}_1`,
                  action: `Take on project requiring ${gap}`,
                  timeline: "Next quarter"
                }
              ],
              milestone: `Develop proficiency in ${gap} through learning and practice`
            }));
          }
          
          // Create reflection with roadmap
          await ctx.runMutation(api.mutations.createReflection, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            step: nextStep,
            userInput: '',
            payload: {
              coach_reflection: `Let's build your roadmap! I've identified ${developmentPriorities.length} gaps to address. We'll work on them one at a time, starting with: ${developmentPriorities[0] ?? 'your first gap'}.`,
              ai_suggested_roadmap: {
                gap_cards: gapCards,
                current_gap_index: 0,
                total_gaps: developmentPriorities.length
              }
            }
          });
          
          return { ok: true, message: 'Roadmap generated!', nextStep };
        }
        
        // Get step transitions for opener message
        const frameworkCoach = getFrameworkCoach(framework);
        const transitions = frameworkCoach.getStepTransitions();
        const openerMessage = transitions.openers[nextStep] ?? `Let's continue with ${nextStep}.`;
        
        // Create reflection with opener
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: nextStep,
          userInput: '',
          payload: {
            coach_reflection: openerMessage
          }
        });
        
        return { ok: true, message: `Moving to ${nextStep}...`, nextStep };
      } else if (action === 'amend') {
        // Enter amendment mode for current step
        await ctx.runMutation(api.mutations.enterAmendmentMode, {
          sessionId: args.sessionId,
          step: session.step,
          from_review: false
        });
        
        return { ok: true, message: 'Amendment mode activated' };
      }
      
      return { ok: false, message: 'Invalid confirmation action' };
    }

    case 'amendment_complete': {
      // User clicked Save or Cancel in amendment modal
      const { action, amendments } = data as { 
        action: 'save' | 'cancel'; 
        amendments?: Record<string, unknown> 
      };
      
      const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
      if (session === null) {
        return { ok: false, message: 'Session not found' };
      }
      
      const amendmentMode = session.amendment_mode;
      if (amendmentMode?.active !== true) {
        return { ok: false, message: 'Not in amendment mode' };
      }
      
      if (action === 'save' && amendments !== null && amendments !== undefined) {
        // Apply amendments
        await ctx.runMutation(api.mutations.amendReflectionFields, {
          sessionId: args.sessionId,
          step: amendmentMode.step,
          amendments
        });
      }
      
      // Exit amendment mode
      await ctx.runMutation(api.mutations.exitAmendmentMode, {
        sessionId: args.sessionId
      });
      
      // If from review, trigger report generation
      if (amendmentMode.from_review) {
        // DO NOT close session here - let report generation handle it
        
        // Auto-trigger report generation (only for GROW framework)
        if (session.framework === 'GROW') {
          await ctx.runAction(api.coach.generateReviewAnalysis, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId
          });
          return {
            ok: true,
            message: 'Report generated!',
            sessionClosed: true
          };
        }
        
        // For CAREER, return to awaiting confirmation
        return {
          ok: true,
          message: 'Review updated. Ready to proceed to report.',
          awaitingConfirmation: true
        };
      }
      
      // Otherwise, set awaiting confirmation (loop back)
      await ctx.runMutation(api.mutations.setAwaitingConfirmation, {
        sessionId: args.sessionId,
        awaiting: true
      });
      
      return {
        ok: true,
        message: action === 'save' ? 'Changes saved' : 'Changes discarded'
      };
    }

    case 'review_amendment_selection': {
      // User selected which step to amend from review
      const { step } = data as { step: string };
      
      // Enter amendment mode for selected step
      await ctx.runMutation(api.mutations.enterAmendmentMode, {
        sessionId: args.sessionId,
        step,
        from_review: true
      });
      
      return {
        ok: true,
        message: `Amending ${step} step...`
      };
    }

    case 'mindset_selection': {
      // User selected mindset state via MindsetSelector
      const { mindset_state } = data as { mindset_state: string };
      
      // Get current state from last reflection
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const lastReflection = sessionReflections[sessionReflections.length - 1];
      const lastPayload = lastReflection?.payload as Record<string, unknown> | undefined;
      
      // Store mindset state in payload and let AI ask the follow-up question
      const updatedPayload = {
        ...lastPayload,
        initial_mindset_state: mindset_state
      };
      
      // Update the last reflection with initial_mindset_state (silent update)
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: 'clarity',
        userInput: args.userTurn,
        payload: {
          ...updatedPayload,
          coach_reflection: '[MINDSET_STATE_CAPTURED]' // Marker for silent transition
        }
      });
      
      // Recursively call nextStep to let AI ask the follow-up question
      const result1 = await ctx.runAction(api.coach.nextStep, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        stepName: 'clarity',
        userTurn: `[Mindset state selected: ${mindset_state}]`
      }) as unknown;
      return result1 as { ok: boolean; message: string };
    }

    case 'control_level_selection': {
      // User selected control level via ControlLevelSelector
      const { control_level } = data as { control_level: 'high' | 'mixed' | 'low' };
      
      // Get current state from last reflection
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const lastReflection = sessionReflections[sessionReflections.length - 1];
      const lastPayload = lastReflection?.payload as Record<string, unknown> | undefined;
      
      // Store control level in payload and let AI ask the follow-up question
      const updatedPayload = {
        ...lastPayload,
        control_level
      };
      
      // Update the last reflection with control_level (silent update)
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: 'clarity',
        userInput: args.userTurn,
        payload: {
          ...updatedPayload,
          coach_reflection: '[CONTROL_LEVEL_CAPTURED]' // Marker for silent transition
        }
      });
      
      // Recursively call nextStep to let AI ask the follow-up question
      const result2 = await ctx.runAction(api.coach.nextStep, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        stepName: 'clarity',
        userTurn: `[Control level selected: ${control_level}]`
      }) as unknown;
      return result2 as { ok: boolean; message: string };
    }

    case 'q7_yes_response': {
      // User clicked YES on Q7 - wants to add more context
      // Get current state from last reflection
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const lastReflection = sessionReflections[sessionReflections.length - 1];
      const lastPayload = lastReflection?.payload as Record<string, unknown> | undefined;
      
      // Store marker that user wants to add context (but don't set q7_asked yet)
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: 'clarity',
        userInput: args.userTurn,
        payload: {
          ...lastPayload,
          coach_reflection: '[Q7_YES_RESPONSE]' // Marker for silent transition
        }
      });
      
      // Recursively call nextStep to let AI ask follow-up question
      const result3 = await ctx.runAction(api.coach.nextStep, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        stepName: 'clarity',
        userTurn: '[User wants to add more context]'
      }) as unknown;
      return result3 as { ok: boolean; message: string };
    }

    case 'q7_no_response': {
      // User clicked NO on Q7 - nothing else to add
      // Get current state from last reflection
      const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
        sessionId: args.sessionId
      });
      
      const lastReflection = sessionReflections[sessionReflections.length - 1];
      const lastPayload = lastReflection?.payload as Record<string, unknown> | undefined;
      
      // Store that Q7 was asked and user said no
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: 'clarity',
        userInput: args.userTurn,
        payload: {
          ...lastPayload,
          additional_context: '',
          q7_asked: true,
          coach_reflection: '[Q7_NO_RESPONSE]' // Marker for silent transition
        }
      });
      
      // Recursively call nextStep to let AI provide completion summary
      const result4 = await ctx.runAction(api.coach.nextStep, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        stepName: 'clarity',
        userTurn: '[User has nothing else to add - ready for summary]'
      }) as unknown;
      return result4 as { ok: boolean; message: string };
    }

    case 'safety_choice': {
      // User chose to continue or close session after safety pause
      const { action } = data as { action: 'continue' | 'close' };
      
      const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
      if (session === null) {
        return { ok: false, message: 'Session not found' };
      }
      
      if (action === 'close') {
        // User chose to close the session
        await ctx.runMutation(api.mutations.closeSession, {
          sessionId: args.sessionId
        });
        
        return {
          ok: true,
          message: 'Session closed. Take care of yourself.',
          sessionClosed: true
        };
      } else if (action === 'continue') {
        // User chose to continue - retrieve pending input and resume
        const pendingUserTurn = session.pending_user_turn;
        const pendingUserStep = session.pending_user_step;
        
        if (typeof pendingUserTurn !== 'string' || pendingUserTurn.length === 0) {
          return { ok: false, message: 'No pending input found' };
        }
        
        // Clear safety pause state
        await ctx.runMutation(api.mutations.clearSafetyPause, {
          sessionId: args.sessionId
        });
        
        // Recursively call nextStep with the stored user input
        // This will process it through the normal coaching flow
        const result = await ctx.runAction(api.coach.nextStep, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          stepName: pendingUserStep ?? session.step,
          userTurn: pendingUserTurn
        }) as unknown;
        return result as { ok: boolean; message: string };
      }
      
      return { ok: false, message: 'Invalid safety choice action' };
    }

    default:
      return { ok: false, message: `Unknown structured input type: ${type}` };
  }
}

/**
 * Helper function to get next step based on framework
 */
function getNextStepForFramework(currentStep: string, framework: string): string {
  if (framework === 'GROW') {
    const steps = ['introduction', 'goal', 'reality', 'options', 'will', 'review'];
    const idx = steps.indexOf(currentStep);
    return steps[idx + 1] ?? 'review';
  } else if (framework === 'COMPASS') {
    const steps = ['introduction', 'clarity', 'ownership', 'mapping', 'practice', 'review'];
    const idx = steps.indexOf(currentStep);
    return steps[idx + 1] ?? 'review';
  } else if (framework === 'CAREER') {
    const steps = ['INTRODUCTION', 'ASSESSMENT', 'GAP_ANALYSIS', 'ROADMAP', 'REVIEW'];
    const idx = steps.indexOf(currentStep);
    return steps[idx + 1] ?? 'REVIEW';
  }
  return 'review';
}

// ============================================================================
// MAIN COACHING ACTION
// ============================================================================

export const nextStep = action({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    stepName: v.string(),
    userTurn: v.string(),
    structuredInput: v.optional(v.object({
      type: v.string(),
      data: v.any()
    }))
  },
  handler: async (ctx, args): Promise<CoachActionResult> => {
    // Create mutations object (avoids TypeScript "excessively deep" errors)
    const mutations = createMutations();
    // Check if session exists and is not closed
    const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
    if (session === null || session === undefined) {
      throw new Error("Session not found");
    }
    
    // Prevent responses to closed sessions
    if (session.closedAt !== null && session.closedAt !== undefined) {
      return { 
        ok: false, 
        message: "This session has been completed. Please view your report or start a new session."
      };
    }
    
    // ⚠️ FIX P0-4: Block input when session is paused for safety
    if (session.safetyPaused === true) {
      const resources = getEmergencyResources('US');
      return { 
        ok: false, 
        message: `This session has been paused due to wellbeing concerns.\n\n` +
                 `Please contact:\n` +
                 `📞 ${resources.crisis} - ${resources.description}\n` +
                 `🚨 Emergency: ${resources.emergency}\n\n` +
                 `Your wellbeing is the priority. These services are free, confidential, and available 24/7.`
      };
    }
    
    if (session.escalated === true) {
      return { 
        ok: false, 
        message: "This session requires specialist help. Please contact appropriate professional services, support hotlines, or authorities through official channels. If you're in immediate danger, contact emergency services."
      };
    }

    // Get skip count for current step
    const sessionState = session.state as { skips?: Record<string, number> } | undefined;
    const skipCount = sessionState?.skips?.[args.stepName] ?? 0;

    // Validate input length (800 char cap)
    if (args.userTurn.length > 800) {
      return { 
        ok: false, 
        message: "That's a lot to unpack! 😊 Let's break it down.",
        hint: "Please share one main thought in 100-150 words, then we'll dig deeper together."
      };
    }

    // Perform safety checks
    const safetyResult = await performSafetyChecks(args.userTurn, ctx, mutations, args);
    if (safetyResult !== null) {
      return safetyResult;
    }

    // Handle structured input from button interactions (bypass AI processing)
    if (args.structuredInput !== null && args.structuredInput !== undefined) {
      return await handleStructuredInput(ctx, mutations, args, session);
    }

    // Get organization and framework
    const org = await ctx.runQuery(api.queries.getOrg, { orgId: args.orgId });
    if (org === null || org === undefined) {
      throw new Error("Organization not found");
    }

    const values = (org.values as OrgValue[] ?? []).map((v) => v.key);
    const fw = getFramework(session.framework);
    const step = fw.steps.find((s) => s.name === args.stepName);
    if (step === undefined) {
      const availableSteps = fw.steps.map(s => s.name).join(', ');
      throw new Error(`Unknown step: ${args.stepName}. Framework: ${session.framework} (ID: ${fw.id}). Available steps: ${availableSteps}`);
    }

    // Fetch conversation history
    const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
      sessionId: args.sessionId
    });
    
    const conversationHistory = buildConversationHistory(sessionReflections);

    // Get framework coach
    const frameworkCoach = getFrameworkCoach(fw.id);
    const requiredFields = frameworkCoach.getRequiredFields()[step.name] ?? [];

    // AGENT MODE: Aggregate current captured state
    const stepState = aggregateStepState(sessionReflections, step.name, requiredFields);
    const { capturedState, missingFields, capturedFields } = stepState;

    // Loop detection
    const loopDetected = detectLoop(sessionReflections, step.name);
    
    // Generate safety alerts
    const safetyAlerts = generateSafetyAlerts(args.userTurn);
    
    // ⚠️ FIX P0-1: Extract existing context to prevent re-asking questions
    const contextExtraction = extractExistingContext(sessionReflections, step.name);
    const { extractedFields, messageCount, lastUserInputs } = contextExtraction;
    
    // ⚠️ FIX P0-3: MAX MESSAGES GUARD - Prevent infinite loops in a step
    const MAX_MESSAGES_PER_STEP = 15; // Escalate if > 15 messages in one step
    if (messageCount >= MAX_MESSAGES_PER_STEP) {
      console.warn(`⚠️ MAX MESSAGES EXCEEDED: Step ${step.name} has ${messageCount} messages (max: ${MAX_MESSAGES_PER_STEP})`);
      
      // Force advance to next step with partial data
      const frameworkCoach = getFrameworkCoach(fw.id);
      const transitions = frameworkCoach.getStepTransitions();
      const transitionMessage = transitions.transitions[step.name] ?? "Let's move forward.";
      const nextStepName = await advanceToNextStep(ctx, mutations, fw, step, frameworkCoach, args, sessionReflections);
      
      // Create transition reflection
      const escapePayload: ReflectionPayload = {
        coach_reflection: `${transitionMessage}\n\n💡 I can see we've covered a lot of ground here. Let's keep the momentum going.`
      };
      
      // @ts-ignore - Convex type instantiation depth limitation
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: step.name,
        userInput: args.userTurn,
        payload: escapePayload
      });
      
      return { ok: true, nextStep: nextStepName, payload: escapePayload };
    }
    
    // Generate framework-specific AI context (suggestions, nudges)
    let aiContext = '';
    if (frameworkCoach.generateAIContext !== undefined) {
      aiContext = frameworkCoach.generateAIContext(step.name, sessionReflections, args.userTurn);
    }
    
    // GROW Will step: Inject previous reflection payload so AI can access selected_option_ids
    if (session.framework === 'GROW' && step.name === 'will' && sessionReflections.length > 0) {
      const previousReflection = sessionReflections[sessionReflections.length - 1];
      const previousPayload = previousReflection?.payload as Record<string, unknown> | undefined;
      
      if (previousPayload !== undefined && previousPayload !== null) {
        const selectedOptionIds = previousPayload['selected_option_ids'];
        const options = previousPayload['options'];
        const currentOptionIndex = typeof previousPayload['current_option_index'] === 'number' 
          ? previousPayload['current_option_index'] 
          : 0;
        
        if (selectedOptionIds !== undefined && selectedOptionIds !== null && Array.isArray(selectedOptionIds)) {
          // Get the current option label from the options array
          const currentOptionId: unknown = selectedOptionIds[currentOptionIndex];
          const currentOptionIdStr = String(currentOptionId ?? '');
          const currentOption = Array.isArray(options) 
            ? (options as Array<Record<string, unknown>>).find((opt) => opt['id'] === currentOptionId)
            : undefined;
          const currentOptionLabel = currentOption !== undefined && currentOption !== null
            ? String(currentOption['label'] ?? `Option ${currentOptionIndex + 1}`)
            : `Option ${currentOptionIndex + 1}`;
          
          aiContext += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 WILL STEP - ACTION GENERATION CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECTED OPTION IDS: ${JSON.stringify(selectedOptionIds)}
CURRENT OPTION INDEX: ${currentOptionIndex} (processing option ${currentOptionIndex + 1} of ${selectedOptionIds.length})
CURRENT OPTION ID: ${currentOptionIdStr}
CURRENT OPTION LABEL: ${currentOptionLabel}

CRITICAL INSTRUCTIONS:
1. You MUST include "selected_option_ids": ${JSON.stringify(selectedOptionIds)} in your JSON response
2. You MUST set "current_option_index": ${currentOptionIndex}
3. You MUST set "current_option_label": "${currentOptionLabel}"
4. Generate a suggested action specifically for "${currentOptionLabel}" (option ${currentOptionIndex + 1})

${Array.isArray(options) ? `\nALL AVAILABLE OPTIONS:\n${JSON.stringify(options, null, 2)}` : ''}

⚠️ IMPORTANT: Generate action for index ${currentOptionIndex} ("${currentOptionLabel}"), NOT index 0!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        }
      }
    }
    
    // 🔧 FIX Issue #2: Replace dynamic value placeholders with actual captured data
    // This ensures AI says "You're at 3/10" instead of "You're at {initial_confidence}/10"
    aiContext = replaceDynamicValues(aiContext, sessionReflections);
    
    // 📚 Vector Embeddings: Inject cross-session context for continuity and pattern recognition
    // Only fetch if user input is substantial (>20 chars) to avoid unnecessary API calls
    // NOTE: This will work properly once user authentication is implemented
    // For now, test sessions may see each other's context (same test userId)
    if (session.userId !== undefined && args.userTurn.length > 20) {
      try {
        // @ts-ignore - Convex type instantiation depth limitation
        const crossSessionContext = await ctx.runAction(
          api.embeddings.getCrossSessionContext,
          {
            userId: session.userId,
            currentStep: step.name,
            framework: session.framework,
            limit: 2 // Keep it minimal to avoid overwhelming the AI
          }
        );
        
        if (crossSessionContext.length > 0) {
          // Filter out any results with missing content
          const validContext = crossSessionContext.filter((ctx: { content: string | null | undefined; framework?: string; relevance?: number }) => 
            ctx.content !== null && 
            ctx.content !== undefined && 
            typeof ctx.content === 'string' && 
            ctx.content.length > 0
          );
          
          if (validContext.length > 0) {
            aiContext += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT PAST CONTEXT (from similar sessions):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${validContext.map((ctx: { content: string; framework?: string; relevance?: number }, i: number) => 
  `${i + 1}. ${ctx.content.substring(0, 200)}... (${ctx.framework ?? 'unknown'} session, ${((ctx.relevance ?? 0) * 100).toFixed(0)}% relevant)`
).join('\n\n')}

💡 Use this context to:
- Reference patterns from past sessions ("I notice this is similar to...")
- Avoid repeating advice already given
- Build on previous insights and progress
- Show continuity in their coaching journey

⚠️ IMPORTANT: Only reference past context if directly relevant to current discussion.
Don't force it if the connection isn't clear.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
          }
        }
      } catch (error) {
        // Silently fail - cross-session context is nice-to-have, not critical
        console.error("Failed to fetch cross-session context:", error);
      }
    }
    
    // 📚 ALWAYS-ON RAG: Knowledge Base Integration
    // Works for both GROW and COMPASS frameworks
    // Extract goal/change from previous reflections (not just current capturedState)
    
    // Helper to extract field from any previous reflection
    const extractFromReflections = (fieldName: string): string => {
      for (const reflection of sessionReflections) {
        const payload = reflection.payload as Record<string, unknown>;
        const value = payload[fieldName];
        if (typeof value === 'string' && value.length > 0) {
          return value;
        }
      }
      return '';
    };
    
    // GROW fields - check current step AND previous reflections
    const goalText = typeof capturedState['goal'] === 'string' ? capturedState['goal'] : extractFromReflections('goal');
    const realityText = typeof capturedState['current_state'] === 'string' ? capturedState['current_state'] : extractFromReflections('current_state');
    const constraintsText = typeof capturedState['constraints'] === 'string' ? capturedState['constraints'] : extractFromReflections('constraints');
    
    // COMPASS fields - check current step AND previous reflections
    const changeDescription = typeof capturedState['change_description'] === 'string' ? capturedState['change_description'] : extractFromReflections('change_description');
    const sphereOfControl = typeof capturedState['sphere_of_control'] === 'string' ? capturedState['sphere_of_control'] : extractFromReflections('sphere_of_control');
    
    // Determine primary context based on framework
    const primaryContext = goalText.length > 0 ? goalText : changeDescription;
    
    // Only search in steps where we provide suggestions/solutions
    // GROW: Options, Will | COMPASS: Mapping, Practice
    const ragEnabledSteps = ['options', 'will', 'mapping', 'practice'];
    const shouldSearchKnowledge = primaryContext.length > 0 && ragEnabledSteps.includes(step.name);
    
    // Track if knowledge was actually provided (for validator)
    let knowledgeProvided = false;
    
    // Debug logging
    if (shouldSearchKnowledge) {
      // eslint-disable-next-line no-console
      console.log(`[RAG] Searching knowledge for step: ${step.name}, context: "${primaryContext.substring(0, 50)}..."`);
    } else if (primaryContext.length > 0 && !ragEnabledSteps.includes(step.name)) {
      // eslint-disable-next-line no-console
      console.log(`[RAG] Disabled for step: ${step.name} (only enabled for: ${ragEnabledSteps.join(', ')})`);
    }
    
    if (shouldSearchKnowledge) {
      try {
        // Build rich search context from both GROW and COMPASS fields
        // This gives better semantic matches than just primary context alone
        const contextParts = [
          goalText,           // GROW: goal
          realityText,        // GROW: current_state
          constraintsText,    // GROW: constraints
          changeDescription,  // COMPASS: change_description
          sphereOfControl,    // COMPASS: sphere_of_control
          args.userTurn       // Current user input
        ].filter(part => part.length > 0);
        
        const searchText = contextParts.join(' ').substring(0, 500);
        
        // eslint-disable-next-line no-console
        console.log(`[RAG] Search text (${searchText.length} chars): "${searchText.substring(0, 100)}..."`);
        
        const OPENAI_API_KEY = process.env["OPENAI_API_KEY"];
        if (OPENAI_API_KEY !== null && OPENAI_API_KEY !== undefined && OPENAI_API_KEY.trim() !== "") {
          const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "text-embedding-3-small",
              input: searchText,
            }),
          });
          
          if (embeddingResponse.ok) {
            const embeddingData = await embeddingResponse.json() as { data: Array<{ embedding: number[] }> };
            const queryEmbedding = embeddingData.data[0]?.embedding;
            
            if (queryEmbedding !== null && queryEmbedding !== undefined) {
              // Search knowledge base for relevant coaching scenarios
              const knowledgeResults = await ctx.vectorSearch(
                "knowledgeEmbeddings",
                "by_embedding",
                {
                  vector: queryEmbedding,
                  limit: 5, // Top 5 scenarios for richer context
                }
              );
              
              if (knowledgeResults.length > 0) {
                // Filter with moderate threshold (0.6) to cast wider net
                // Lower threshold = more knowledge available to AI
                const relevantKnowledge = (knowledgeResults as KnowledgeEmbedding[]).filter(r => r._score > 0.6);
                
                // eslint-disable-next-line no-console
                console.log(`[RAG] Found ${knowledgeResults.length} results, ${relevantKnowledge.length} above threshold (0.6)`);
                if (relevantKnowledge.length > 0) {
                  // eslint-disable-next-line no-console
                  console.log(`[RAG] Injecting: ${relevantKnowledge.map(k => `${k.title} (${k._score.toFixed(2)})`).join(', ')}`);
                }
                
                if (relevantKnowledge.length > 0) {
                  knowledgeProvided = true; // Flag for validator
                  
                  // Context-aware RAG instructions based on step
                  const ragInstructions = step.name === 'options'
                    ? `💡 **WHEN TO USE THIS KNOWLEDGE:**
- ONLY when user asks for suggestions ("I don't know", "suggest options", "help me")
- ONLY when generating AI options (PATH B)
- NOT when exploring user's own options (PATH A - ask about pros/cons first)

🎯 IF USER PROVIDED THEIR OWN OPTION:
- Follow PATH A: Ask about benefits/challenges of THEIR option
- Do NOT generate AI suggestions yet
- Wait until they ask for more options

🎯 IF USER ASKS FOR SUGGESTIONS:
- Use this knowledge to generate evidence-based options
- Reference frameworks: "Research shows...", "The [model] suggests..."
- Connect to their specific situation`
                    : `💡 **USE THIS KNOWLEDGE IN YOUR RESPONSE:**

🎯 REQUIRED ACTIONS:
1. **Reference frameworks by name** - e.g., "The SBIR model suggests..." or "Research on delegation shows..."
2. **Quote specific techniques** - e.g., "One proven approach is..." or "Studies indicate..."
3. **Connect to their situation** - e.g., "Given your perfectionism, the gradual delegation model recommends..."
4. **Cite the source** - e.g., "Management research shows..." or "Evidence-based practice suggests..."

✅ GOOD EXAMPLES:
- "Research on delegation shows that perfectionism often stems from lack of trust. The SBIR model suggests starting with small, low-risk tasks..."
- "Studies indicate that gradual delegation builds confidence. Given your quality concerns, you might start with..."
- "Evidence-based practice recommends creating clear expectations before delegating. This addresses your worry about..."`;
                  
                  aiContext += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT PROVEN APPROACHES (Management Bible):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${relevantKnowledge.map((k, i) => 
  `${i + 1}. **${k.title}** (${k.category})

${k.content.substring(0, 500)}${k.content.length > 500 ? '...' : ''}`
).join('\n\n')}

${ragInstructions}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
                }
              }
            }
          }
        }
      } catch (error) {
        // Silently fail - knowledge base is nice-to-have, not critical
        console.error("Failed to fetch knowledge base:", error);
      }
    }
    
    // ⚠️ FIX P0-1: Inject extracted context to prevent re-asking questions
    if (Object.keys(extractedFields).length > 0 || messageCount > 3) {
      aiContext += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRITICAL CONTEXT EXTRACTION - READ BEFORE RESPONDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is message #${messageCount} in the ${step.name} stage. You MUST check this extracted context BEFORE asking any questions:

📋 ALREADY EXTRACTED FIELDS (DO NOT ASK AGAIN):
${JSON.stringify(extractedFields, null, 2)}

💬 RECENT USER INPUTS:
${lastUserInputs.map((input, i) => `${i + 1}. "${input}"`).join('\n')}

⚠️ GOLDEN RULES:
1. NEVER ask for information already in ALREADY EXTRACTED FIELDS
2. REFERENCE extracted fields instead: "You mentioned X..."
3. If confidence already captured, DO NOT ask "how confident are you?" again
4. If action already stated, DO NOT ask "what action?" again
5. Move to NEXT question in the sequence, not questions already answered

${messageCount >= 10 ? '🚨 WARNING: This stage has ' + messageCount + ' messages (target: 5-7). Move forward ASAP!\n' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    }
    
    // Detect if user wants AI suggestions (COMPASS only)
    const suggestionChoice = detectSuggestionChoice(args.userTurn);
    const aiSuggestionsRequested = suggestionChoice === 'ai_suggestions';
    
    if (aiSuggestionsRequested && session.framework === 'COMPASS' && aiContext.length > 0) {
      aiContext += `\n\n🤖 AI SUGGESTION MODE ACTIVATED:\nUser has requested AI suggestions. Generate specific, contextually relevant suggestions based on their situation. Present suggestions in a structured format (arrays or objects as appropriate for the step schema). After providing suggestions, ALWAYS ask validation questions like "Do any of these resonate with you?" or "Which ones fit your situation?" and WAIT for user confirmation before considering the step complete.`;
    }

    // Generate coach response
    let responseResult;
    try {
      responseResult = await generateCoachResponse(
        fw,
        step,
        args.userTurn,
        conversationHistory,
        values,
        loopDetected,
        skipCount,
        JSON.stringify(capturedState, null, 2),
        missingFields,
        capturedFields,
        safetyAlerts,
        aiContext
      );
    } catch (error) {
      console.error("=== ERROR GENERATING COACH RESPONSE ===");
      console.error("Error:", error);
      console.error("User input:", args.userTurn);
      console.error("Step:", step.name);
      console.error("Error type:", error instanceof Error ? error.name : typeof error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      
      // CRITICAL: This error often happens when AI fails to generate valid JSON
      // But the user's response is usually perfectly clear!
      // We should try to be more forgiving here.
      
      // Create dynamic error reflection based on current step
      const stepSpecificErrorMessages: Record<string, string> = {
        // GROW Framework steps
        introduction: "I'm having trouble understanding your response. Could you tell me more simply - are you interested in trying GROW coaching today?",
        goal: "I'm having trouble processing that. Could you share one clear goal you'd like to work on? For example: 'I want to save money' or 'I need to improve my leadership skills'.",
        reality: "I'm having trouble understanding your situation. Could you describe what's happening right now in simpler terms? For example: 'I'm struggling with time management' or 'My team isn't communicating well'.",
        options: "I'm having trouble processing your options. Could you share one specific approach you're considering? For example: 'I could take an online course' or 'I could ask my manager for help'.",
        will: "I'm having trouble understanding your action plan. Could you tell me one specific thing you'll do? For example: 'I'll call my manager tomorrow' or 'I'll start the course next week'.",
        review: "I'm having trouble processing your reflection. Could you share one key takeaway from our conversation? For example: 'I learned that I need to ask for help more often'.",
        // COMPASS Framework steps
        clarity: "I'm having trouble understanding your situation. Could you describe the change you're dealing with in simpler terms? For example: 'We're switching to a new system' or 'My role is changing'.",
        ownership: "I'm having trouble processing your response. Could you share how you're feeling about this change? For example: 'I'm worried about learning new skills' or 'I'm excited about new opportunities'.",
        mapping: "I'm having trouble understanding your plan. Could you tell me one specific thing you'll do? For example: 'I'll practice the new system for 30 minutes' or 'I'll ask my colleague for help'.",
        practice: "I'm having trouble processing your reflection. Could you share one key insight from our conversation? For example: 'I realized I can learn new things' or 'I have more control than I thought'."
      };
      
      const errorMessage = stepSpecificErrorMessages[step.name] ?? 
        "I'm having trouble understanding your response. Could you rephrase it more directly? Share one clear thought about your situation.";
      
      const errorPayload: ReflectionPayload = {
        coach_reflection: errorMessage
      };
      
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: step.name,
        userInput: args.userTurn,
        payload: errorPayload
      });
      
      return { ok: true };
    }

    const { raw, payload } = responseResult;

    // GROW Will step: Ensure selected_option_ids is in payload BEFORE validation
    // This must happen before pre-validation to prevent missing field errors
    if (session.framework === 'GROW' && step.name === 'will') {
      // eslint-disable-next-line no-console
      console.log('[WILL STEP] Checking for selected_option_ids. Total reflections:', sessionReflections.length);
      
      // Look through all reflections to find selected_option_ids (might be in Options step)
      let selectedOptionIds: unknown = null;
      let options: unknown = null;
      
      for (let i = sessionReflections.length - 1; i >= 0; i--) {
        const reflection = sessionReflections[i];
        const reflectionPayload = reflection?.payload as Record<string, unknown> | undefined;
        
        if (reflectionPayload?.['selected_option_ids'] !== undefined && reflectionPayload?.['selected_option_ids'] !== null) {
          selectedOptionIds = reflectionPayload['selected_option_ids'];
          // eslint-disable-next-line no-console
          console.log('[WILL STEP] Found selected_option_ids in reflection', i, '(step:', reflection?.step, '):', selectedOptionIds);
        }
        
        if (reflectionPayload?.['options'] !== undefined && reflectionPayload?.['options'] !== null) {
          options = reflectionPayload['options'];
        }
        
        if (selectedOptionIds !== null && options !== null) {
          break;
        }
      }
      
      // Copy selected_option_ids if AI didn't include it
      if (payload['selected_option_ids'] === undefined || payload['selected_option_ids'] === null) {
        if (selectedOptionIds !== undefined && selectedOptionIds !== null) {
          // eslint-disable-next-line no-console
          console.log('[WILL STEP] AI forgot selected_option_ids, copying:', selectedOptionIds);
          payload['selected_option_ids'] = selectedOptionIds;
        } else {
          console.warn('[WILL STEP] No selected_option_ids found in any reflection!');
        }
      }
      
      // Also copy options array if not present (needed to map IDs to labels)
      if (payload['options'] === undefined || payload['options'] === null) {
        if (options !== undefined && options !== null) {
          payload['options'] = options;
        }
      }
    }

    // Phase 2: Pre-validate response structure before sending to user
    const preValidation = preValidateResponse(payload, step.name, requiredFields);
    if (!preValidation.isValid) {
      console.warn("=== PRE-VALIDATION FAILED ===", {
        step: step.name,
        errors: preValidation.errors,
        missingFields: preValidation.missingFields
      });
      
      // Log the issue but continue - schema validation will catch it
      // This gives us visibility into what's failing before it reaches users
    }

    // Validate response
    // SKIP validator for GROW Will step - it hallucinates that selected_option_ids isn't in schema
    // SKIP validator for CAREER ROADMAP step - roadmap is generated programmatically in backend
    // Pre-validation already checked required fields, and we have fallback to ensure selected_option_ids
    const skipValidation = (session.framework === 'GROW' && step.name === 'will') ||
                           (session.framework === 'CAREER' && step.name === 'ROADMAP');
    
    let isValid = true;
    let verdict: { valid?: boolean; verdict?: string; reasons?: string[] } = { valid: true };
    let bannedHit = false;
    
    if (!skipValidation) {
      const validation = await validateResponse(raw, step.required_fields_schema, knowledgeProvided);
      isValid = validation.isValid;
      verdict = validation.verdict;
      bannedHit = validation.bannedHit;
    } else {
      // For Will step, just check banned terms manually
      const lower = raw.toLowerCase();
      const BANNED = ['placeholder', 'lorem ipsum', 'todo', 'tbd', 'xxx', 'n/a'];
      bannedHit = BANNED.some(b => lower.includes(b));
      isValid = !bannedHit;
    }

    if (!isValid || bannedHit) {
      const reason = bannedHit 
        ? `Banned term detected in response`
        : `Validator failed: ${verdict.reasons?.join(", ") ?? "Unknown reason"}`;
      
      console.error("Safety validation failed:", { 
        reason,
        verdict,
        userInput: args.userTurn.substring(0, 100),
        aiOutput: raw.substring(0, 500)
      });
      
      await ctx.runMutation(api.mutations.createSafetyIncident, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        reason,
        llmOutput: raw,
        severity: "low"
      });
      
      // Create error reflection
      const errorPayload: ReflectionPayload = {
        coach_reflection: bannedHit 
          ? "I appreciate you sharing that, but this topic needs more specialized support than coaching can offer. I'd recommend speaking with appropriate professional services. In the meantime, what else is on your mind about your goals?"
          : "I'm having a bit of trouble processing that response. Could you rephrase it more directly? For example, share one clear thought about your situation."
      };
      
      await ctx.runMutation(api.mutations.createReflection, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        step: step.name,
        userInput: args.userTurn,
        payload: errorPayload
      });
      
      return { ok: true };
    }

    // COMPASS: Track confidence progression and nudges
    if (session.framework === 'COMPASS') {
      const initialConfidence = payload['initial_confidence'] as number | undefined;
      const ownershipConfidence = payload['ownership_confidence'] as number | undefined;
      const finalConfidence = payload['final_confidence'] as number | undefined;
      
      if (initialConfidence !== undefined && finalConfidence !== undefined) {
        const confidenceChange = finalConfidence - initialConfidence;
        const confidencePercentIncrease = initialConfidence > 0 ? Math.round((confidenceChange / initialConfidence) * 100) : 0;
        
        payload['confidence_tracking'] = {
          initial_confidence: initialConfidence,
          ownership_confidence: ownershipConfidence,
          final_confidence: finalConfidence,
          confidence_change: confidenceChange,
          confidence_percent_increase: confidencePercentIncrease
        };
      }
    }

    // Create reflection with user input
    await ctx.runMutation(api.mutations.createReflection, {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      step: step.name,
      userInput: args.userTurn,
      payload
    });

    // =============================
    // CSS Baseline capture (COMPASS)
    // Capture baseline in INTRODUCTION step when CSS fields are present
    // =============================
    if (session.framework === 'COMPASS' && step.name === 'introduction') {
      const initialConfidence = (payload['initial_confidence'] as number | undefined);
      const initialActionClarity = (payload['initial_action_clarity'] as number | undefined);
      const initialMindset = (payload['initial_mindset_state'] as string | undefined);
      
      // Save baseline if ANY CSS field is present
      if (
        (typeof initialConfidence === 'number' && initialConfidence >= 1 && initialConfidence <= 10) ||
        (typeof initialActionClarity === 'number' && initialActionClarity >= 1 && initialActionClarity <= 10) ||
        (typeof initialMindset === 'string' && initialMindset.length > 0)
      ) {
        await ctx.runMutation(api.mutations.createMeasurementPoint, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          stage: 'introduction',
          measurementType: 'baseline',
          payload: {
            initial_confidence: initialConfidence,
            initial_action_clarity: initialActionClarity,
            initial_mindset_state: initialMindset,
          }
        });
      }
    }

    // Phase 2: Track OPTIONS state for GROW framework
    if (session.framework === 'GROW' && step.name === 'options') {
      await updateOptionsState(ctx, mutations, args.sessionId, payload);
    }

    // Create actions if applicable
    const queries = createQueries();
    await createActionsFromPayload(ctx, mutations, queries, step, payload, args);

    // Check if step is complete before advancing
    const completionResult = frameworkCoach.checkStepCompletion(
      step.name,
      payload,
      sessionReflections,
      skipCount,
      loopDetected
    );

    // Debug logging
    console.warn("=== STEP COMPLETION CHECK ===", {
      framework: fw.id,
      step: step.name,
      skipCount,
      loopDetected,
      shouldAdvance: completionResult.shouldAdvance,
      awaitingConfirmation: completionResult.awaitingConfirmation,
      capturedFields: capturedFields.length,
      missingFields: missingFields.length,
      missingFieldsBefore: missingFields
    });

    // NEW: Handle awaiting confirmation state
    if (completionResult.awaitingConfirmation === true) {
      await ctx.runMutation(api.mutations.setAwaitingConfirmation, {
        sessionId: args.sessionId,
        awaiting: true
      });
      return { ok: true };
    }

    let nextStepName = step.name;
    let sessionClosed = false;

    if (completionResult.shouldAdvance) {
      // If COMPASS PRACTICE completed, compute and persist CSS before advancing
      if (session.framework === 'COMPASS' && step.name === 'practice') {
        try {
          // Re-fetch reflections including this turn
          const reflections = await ctx.runQuery(api.queries.getSessionReflections, { sessionId: args.sessionId });
          // Get CSS baseline from CLARITY step (moved from introduction)
          const clarityList = reflections.filter((r: { step: string }) => r.step === 'clarity');
          const clarity = clarityList.length > 0 ? clarityList[clarityList.length - 1] : undefined;
          const practiceList = reflections.filter((r: { step: string }) => r.step === 'practice');
          const practice = practiceList.length > 0 ? practiceList[practiceList.length - 1] : undefined;

          const getNum = (obj: unknown, key: string): number | undefined => {
            if (typeof obj === 'object' && obj !== null) {
              const v = (obj as Record<string, unknown>)[key];
              if (typeof v === 'number' && Number.isFinite(v)) {
                return v;
              }
            }
            return undefined;
          };
          const getStr = (obj: unknown, key: string): string | undefined => {
            if (typeof obj === 'object' && obj !== null) {
              const v = (obj as Record<string, unknown>)[key];
              if (typeof v === 'string' && v.length > 0) {
                return v;
              }
            }
            return undefined;
          };
          const toMindsetState = (s: string | undefined): MindsetState => {
            const allowed: MindsetState[] = ['resistant', 'neutral', 'open', 'engaged'];
            return allowed.includes(s as MindsetState) ? (s as MindsetState) : 'neutral';
          };

          // Get CSS baseline from clarity step (moved from introduction)
          const initialConfidence = clarity !== undefined && clarity !== null ? getNum(clarity.payload, 'initial_confidence') : undefined;
          const initialActionClarity = clarity !== undefined && clarity !== null ? getNum(clarity.payload, 'initial_action_clarity') : undefined;
          const initialMindsetStr = clarity !== undefined && clarity !== null ? getStr(clarity.payload, 'initial_mindset_state') : undefined;

          const finalConfidence = practice !== undefined && practice !== null ? getNum(practice.payload, 'final_confidence') : undefined;
          const finalActionClarity = practice !== undefined && practice !== null ? getNum(practice.payload, 'final_action_clarity') : undefined;
          const finalMindsetStr = practice !== undefined && practice !== null ? getStr(practice.payload, 'final_mindset_state') : undefined;
          const userSatisfaction = practice !== undefined && practice !== null ? getNum(practice.payload, 'user_satisfaction') : undefined;

          // Build CSS input with safe defaults if some fields missing
          const ic = typeof initialConfidence === 'number' ? initialConfidence : 5;
          const fc = typeof finalConfidence === 'number' ? finalConfidence : 5;
          const iac = typeof initialActionClarity === 'number' ? initialActionClarity : 5;
          const fac = typeof finalActionClarity === 'number' ? finalActionClarity : 5;
          const im = toMindsetState(initialMindsetStr);
          const fm = toMindsetState(finalMindsetStr);
          const sat = typeof userSatisfaction === 'number' ? userSatisfaction : 7;

          // Calculate CSS
          const css = calculateCSS({
            initialConfidence: ic,
            finalConfidence: fc,
            initialActionClarity: iac,
            finalActionClarity: fac,
            initialMindset: im,
            finalMindset: fm,
            userSatisfaction: sat,
          });

          // Persist per-dimension success measurements
          await ctx.runMutation(api.mutations.createSuccessMeasurement, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            dimension: 'confidence',
            initialRaw: ic,
            finalRaw: fc,
            increase: fc - ic,
            normalizedScore: css.breakdown.confidence_score,
            calculationVersion: css.calculationVersion,
          });
          await ctx.runMutation(api.mutations.createSuccessMeasurement, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            dimension: 'action',
            initialRaw: iac,
            finalRaw: fac,
            increase: fac - iac,
            normalizedScore: css.breakdown.action_score,
            calculationVersion: css.calculationVersion,
          });
          await ctx.runMutation(api.mutations.createSuccessMeasurement, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            dimension: 'mindset',
            initialRaw: im,
            finalRaw: fm,
            normalizedScore: css.breakdown.mindset_score,
            calculationVersion: css.calculationVersion,
          });
          await ctx.runMutation(api.mutations.createSuccessMeasurement, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            dimension: 'satisfaction',
            finalRaw: sat,
            normalizedScore: css.breakdown.satisfaction_score,
            calculationVersion: css.calculationVersion,
          });

          // Persist final CSS score
          await ctx.runMutation(api.mutations.createCSSScore, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            composite_success_score: css.composite_success_score,
            success_level: css.success_level,
            breakdown: css.breakdown,
            raw_inputs: {
              initial_confidence: ic,
              final_confidence: fc,
              initial_action_clarity: iac,
              final_action_clarity: fac,
              initial_mindset_state: im,
              final_mindset_state: fm,
              user_satisfaction: sat,
            },
            calculationVersion: css.calculationVersion,
            calculation_metadata: css.calculation_metadata,
          });

          // Record final measurement point
          await ctx.runMutation(api.mutations.createMeasurementPoint, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            stage: 'practice',
            measurementType: 'final',
            payload: {
              final_confidence: fc,
              final_action_clarity: fac,
              final_mindset_state: fm,
              user_satisfaction: sat,
            },
          });
        } catch (e) {
          console.error('CSS computation failed:', e);
        }
      }

      nextStepName = await advanceToNextStep(ctx, mutations, fw, step, frameworkCoach, args, sessionReflections);
      sessionClosed = nextStepName.toLowerCase() === "review" && step.name.toLowerCase() === "review";
    }

    return { ok: true, nextStep: nextStepName, payload, sessionClosed };
  }
});

// ============================================================================
// CAREER REPORT GENERATION HELPER
// ============================================================================

async function generateCareerReport(
  ctx: ActionCtx,
  _session: { _id: Id<"sessions">; framework: string; orgId: Id<"orgs">; userId: Id<"users"> },
  reflections: Array<{ _id: Id<"reflections">; step: string; payload: Record<string, unknown> }>,
  _userName: string,
  args: { sessionId: Id<"sessions">; orgId: Id<"orgs">; userId: Id<"users"> }
): Promise<{ ok: boolean; message: string }> {
  // Extract review reflections
  const reviewReflections = reflections.filter(r => r.step === 'REVIEW');
  const lastReviewReflection = reviewReflections[reviewReflections.length - 1];
  
  if (lastReviewReflection === undefined) {
    return { ok: false, message: 'No review reflection found' };
  }
  
  const review = lastReviewReflection.payload;
  
  // TODO: Generate AI insights using OpenAI/Anthropic
  // For now, create placeholder insights
  // In future: Call AI API to analyze the entire session and generate personalized insights
  const aiInsights = {
    ai_insights: "Based on your career transition session, you've demonstrated strong self-awareness and commitment to your goals. Your roadmap is comprehensive and actionable.",
    hidden_opportunities: [
      "Leverage your current role's network for informational interviews in your target industry",
      "Consider internal mobility opportunities or job shadowing before external job search"
    ],
    potential_obstacles: [
      "Time management between current role responsibilities and skill development activities",
      "Potential skills gap may take longer to close than anticipated in your timeline"
    ],
    success_accelerators: [
      "Start with small wins to build momentum and confidence in your transition",
      "Connect with 2-3 professionals already in your target role for mentorship"
    ]
  };
  
  // Merge AI insights with existing review data
  const finalPayload = {
    ...review,
    ...aiInsights
  };
  
  // Update the LAST review reflection with AI insights
  // This ensures the report generator can access them
  await ctx.runMutation(api.mutations.updateReflection, {
    reflectionId: lastReviewReflection._id,
    payload: finalPayload
  });
  
  // Close the session
  await ctx.runMutation(api.mutations.closeSession, {
    sessionId: args.sessionId
  });
  
  return { ok: true, message: 'Career transition report ready!' };
}

// ============================================================================
// AI-POWERED ROADMAP GENERATION HELPER
// ============================================================================

/**
 * Generate personalized roadmap suggestions using AI
 * Takes into account user's full context: role transition, industry, gaps, career stage
 */
async function generateAIRoadmap(
  _ctx: ActionCtx,
  sessionContext: {
    currentRole: string;
    targetRole: string;
    industry: string;
    careerStage: string;
    timeframe: string;
    developmentPriorities: string[];
  }
): Promise<{
  gap_cards: Array<{
    gap_id: string;
    gap_name: string;
    gap_index: number;
    total_gaps: number;
    learning_actions: Array<{ id: string; action: string; timeline: string; resource: string }>;
    networking_actions: Array<{ id: string; action: string; timeline: string }>;
    experience_actions: Array<{ id: string; action: string; timeline: string }>;
    milestone: string;
  }>;
}> {
  const apiKey = process.env['ANTHROPIC_API_KEY'];
  if (apiKey === undefined || apiKey === null || apiKey.length === 0) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const anthropic = new Anthropic({ apiKey });

  const prompt = `You are a career development coach helping someone transition from ${sessionContext.currentRole} to ${sessionContext.targetRole} in the ${sessionContext.industry} industry.

**Career Context:**
- Current Role: ${sessionContext.currentRole}
- Target Role: ${sessionContext.targetRole}
- Industry: ${sessionContext.industry}
- Career Stage: ${sessionContext.careerStage}
- Timeframe: ${sessionContext.timeframe}

**Priority Gaps to Address:**
${sessionContext.developmentPriorities.map((gap, i) => `${i + 1}. ${gap}`).join('\n')}

**Your Task:**
Generate a personalized roadmap with specific, actionable suggestions for EACH gap. Consider their industry, role transition, and career stage.

**Output Format (JSON):**
{
  "gap_cards": [
    {
      "gap_id": "gap_0",
      "gap_name": "Financial modeling",
      "gap_index": 0,
      "total_gaps": 3,
      "learning_actions": [
        {
          "id": "learn_0_1",
          "action": "Complete comprehensive financial modeling course focusing on DCF and LBO models",
          "timeline": "2 months",
          "resource": "Online course (e.g., Coursera, Udemy)"
        },
        {
          "id": "learn_0_2",
          "action": "Practice building financial models using real company data",
          "timeline": "6 weeks",
          "resource": "Practice exercises with templates"
        },
        {
          "id": "learn_0_3",
          "action": "Study financial modeling best practices from industry leaders",
          "timeline": "1 month",
          "resource": "Books (e.g., 'Financial Modeling' by Simon Benninga)"
        }
      ],
      "networking_actions": [
        {
          "id": "network_0_1",
          "action": "Connect with 5 financial analysts or CFOs on LinkedIn who work in similar industries",
          "timeline": "Next 2 weeks"
        },
        {
          "id": "network_0_2",
          "action": "Join finance professionals community or Slack group",
          "timeline": "This month"
        },
        {
          "id": "network_0_3",
          "action": "Attend financial modeling workshop or webinar",
          "timeline": "Next quarter"
        }
      ],
      "experience_actions": [
        {
          "id": "exp_0_1",
          "action": "Volunteer to build financial model for upcoming project or budget cycle",
          "timeline": "Next quarter"
        },
        {
          "id": "exp_0_2",
          "action": "Shadow finance team during quarterly planning to see models in action",
          "timeline": "Within 2 months"
        },
        {
          "id": "exp_0_3",
          "action": "Offer to create financial analysis for department or team initiative",
          "timeline": "Next 3 months"
        }
      ],
      "milestone": "Build 3 complete financial models and present analysis to leadership"
    }
  ]
}

**CRITICAL RULES:**
1. Generate 2-3 learning actions per gap (specific to that gap, not generic)
2. Generate 3 networking actions per gap (relevant to the gap and their transition)
3. Generate 3 experience actions per gap (hands-on opportunities)
4. Make milestones SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
5. Consider their industry and role transition in every suggestion
6. Use realistic timelines based on their timeframe (${sessionContext.timeframe})
7. Make resources specific but not prescriptive (e.g., "Online course (e.g., Coursera)" not "Take Coursera course X")
8. Tailor difficulty to their career stage (${sessionContext.careerStage})

**DO NOT:**
- Use generic templates like "Complete training on X"
- Suggest the same actions for different gaps
- Recommend specific course names or platforms
- Make suggestions that don't fit their industry or role transition

Return ONLY valid JSON with the gap_cards array. No other text.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content === undefined || content.type !== "text") {
      throw new Error("Invalid AI response format");
    }

    // Parse JSON response
    const responseText = content.text.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch === null) {
      throw new Error("No JSON found in AI response");
    }

    const roadmapData = JSON.parse(jsonMatch[0]) as {
      gap_cards: Array<{
        gap_id: string;
        gap_name: string;
        gap_index: number;
        total_gaps: number;
        learning_actions: Array<{ id: string; action: string; timeline: string; resource: string }>;
        networking_actions: Array<{ id: string; action: string; timeline: string }>;
        experience_actions: Array<{ id: string; action: string; timeline: string }>;
        milestone: string;
      }>;
    };

    return roadmapData;
  } catch (error) {
    console.error("Error generating AI roadmap:", error);
    throw new Error("Failed to generate personalized roadmap");
  }
}

// ============================================================================
// REVIEW ANALYSIS ACTION
// ============================================================================

export const generateReviewAnalysis = action({
  args: {
    sessionId: v.id("sessions"),
    orgId: v.id("orgs"),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ ok: boolean; message?: string; analysis?: Record<string, unknown> }> => {
    const session: { _id: Id<"sessions">; framework: string; orgId: Id<"orgs">; userId: Id<"users"> } | null = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
    if (session === null || session === undefined) {
      return { ok: false, message: "Session not found" };
    }

    const user = await ctx.runQuery(api.queries.getUser, { userId: args.userId });
    const userName = user?.displayName ?? "there";

    const reflections = await ctx.runQuery(api.queries.getSessionReflections, { sessionId: args.sessionId });
    if (reflections === null || reflections === undefined || reflections.length === 0) {
      return { ok: false, message: "No reflections found" };
    }

    // Framework-specific report generation
    if (session.framework === 'CAREER') {
      // CAREER framework report generation
      return await generateCareerReport(
        ctx, 
        session as { _id: Id<"sessions">; framework: string; orgId: Id<"orgs">; userId: Id<"users"> },
        reflections as Array<{ _id: Id<"reflections">; step: string; payload: Record<string, unknown> }>,
        userName,
        args
      );
    }

    // GROW framework report generation (existing logic)
    const goalReflection = reflections.find((r: { step: string }) => r.step === "goal");
    const realityReflection = reflections.find((r: { step: string }) => r.step === "reality");
    const optionsReflection = reflections.find((r: { step: string }) => r.step === "options");
    const willReflection = reflections.find((r: { step: string }) => r.step === "will");
    const reviewReflections = reflections.filter((r: { step: string }) => r.step === "review");
    const reviewReflection = reviewReflections[reviewReflections.length - 1];

    const goalPayload = goalReflection?.payload as Record<string, unknown> | undefined;
    const realityPayload = realityReflection?.payload as Record<string, unknown> | undefined;
    const optionsPayload = optionsReflection?.payload as Record<string, unknown> | undefined;
    const willPayload = willReflection?.payload as Record<string, unknown> | undefined;
    const reviewPayload = reviewReflection?.payload as Record<string, unknown> | undefined;

    // Build conversation history
    const conversationHistory = buildConversationHistory(reflections);

    // Format step data
    const goalData = goalPayload !== undefined && goalPayload !== null ? JSON.stringify(goalPayload, null, 2) : 'Not captured';
    const realityData = realityPayload !== undefined && realityPayload !== null ? JSON.stringify(realityPayload, null, 2) : 'Not captured';
    const optionsData = optionsPayload !== undefined && optionsPayload !== null ? JSON.stringify(optionsPayload, null, 2) : 'Not captured';
    
    // Format Will data - extract action titles from action objects
    let willData = 'Not captured';
    if (willPayload !== undefined && willPayload !== null) {
      const actions = willPayload['actions'];
      if (Array.isArray(actions) && actions.length > 0) {
        const actionTitles = actions.map((a: Record<string, unknown>) => {
          const actionText = a['action'];
          return typeof actionText === 'string' ? actionText : '[Invalid action]';
        });
        willData = JSON.stringify({ ...willPayload, actions: actionTitles }, null, 2);
      } else {
        willData = JSON.stringify(willPayload, null, 2);
      }
    }
    
    const reviewData = reviewPayload !== undefined && reviewPayload !== null ? JSON.stringify(reviewPayload, null, 2) : 'Not captured';

    const allStepData = `
GOAL:
${goalData}

REALITY:
${realityData}

OPTIONS:
${optionsData}

WILL (Action Plan):
${willData}

REVIEW:
${reviewData}
`;

    // 📚 Search knowledge base for relevant frameworks
    let knowledgeContext = '';
    try {
      const OPENAI_API_KEY = process.env["OPENAI_API_KEY"];
      if (OPENAI_API_KEY !== null && OPENAI_API_KEY !== undefined && OPENAI_API_KEY.trim() !== "") {
        // Create search query from goal + reality
        const searchText = `${goalData} ${realityData}`.substring(0, 500);
        
        const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: searchText,
          }),
        });
        
        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json() as { data: Array<{ embedding: number[] }> };
          const queryEmbedding = embeddingData.data[0]?.embedding;
          
          if (queryEmbedding !== null && queryEmbedding !== undefined) {
            const knowledgeResults = await ctx.vectorSearch(
              "knowledgeEmbeddings",
              "by_embedding",
              {
                vector: queryEmbedding,
                limit: 3, // Top 3 most relevant
              }
            );
            
            if (knowledgeResults.length > 0) {
              const relevantKnowledge = (knowledgeResults as KnowledgeEmbedding[]).filter(r => r._score > 0.7);
              
              if (relevantKnowledge.length > 0) {
                knowledgeContext = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT MANAGEMENT FRAMEWORKS (Use in your analysis):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${relevantKnowledge.map((k, i) => 
  `${i + 1}. **${k.title}** (${k.category})
${k.content.substring(0, 400)}...`
).join('\n\n')}

💡 Use these proven frameworks to enhance your analysis:
- Reference specific models (e.g., "The SBIR model suggests...")
- Cite proven techniques in unexplored_options
- Identify risks based on these frameworks
- Suggest pitfalls from management research
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
              }
            }
          }
        }
      }
    } catch (error) {
      // Silently fail - knowledge base is nice-to-have for reports
      console.error("Failed to fetch knowledge base for report:", error);
    }

    // Call AI to generate analysis
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (apiKey === undefined || apiKey === null || apiKey.length === 0) {
      return { ok: false, message: "ANTHROPIC_API_KEY not configured" };
    }

    const anthropic = new Anthropic({ apiKey });
    const prompt = ANALYSIS_GENERATION_PROMPT(conversationHistory, allStepData + knowledgeContext);

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 3000,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const content = response.content[0];
      if (content === undefined || content.type !== "text") {
        return { ok: false, message: "Invalid AI response format" };
      }

      // Parse AI response
      const analysisText = content.text.trim();
      let analysis: Record<string, unknown>;
      
      try {
        const jsonMatch = analysisText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) ?? analysisText.match(/(\{[\s\S]*\})/);
        const jsonText = jsonMatch !== null && jsonMatch !== undefined ? jsonMatch[1] : analysisText;
        analysis = JSON.parse(jsonText ?? '{}') as Record<string, unknown>;
      } catch (parseError) {
        console.error("Failed to parse analysis JSON:", parseError);
        return { ok: false, message: "Failed to parse AI analysis" };
      }

      // Validate required fields
      const requiredFields = ['summary', 'ai_insights', 'unexplored_options', 'identified_risks', 'potential_pitfalls'];
      const missingFields = requiredFields.filter(field => {
        const value = analysis[field];
        return value === undefined || value === null || 
          (typeof value === 'string' && value.length === 0) ||
          (Array.isArray(value) && value.length === 0);
      });

      if (missingFields.length > 0) {
        console.error("Missing analysis fields:", missingFields);
        return { ok: false, message: `Incomplete analysis: missing ${missingFields.join(', ')}` };
      }

      // Build personalized final message
      const summaryText = typeof analysis['summary'] === 'string' ? analysis['summary'] : '';
      const insightsText = typeof analysis['ai_insights'] === 'string' ? analysis['ai_insights'] : '';
      const unexploredText = Array.isArray(analysis['unexplored_options']) && (analysis['unexplored_options'] as unknown[]).length > 0
        ? `\n\nUnexplored options you might consider: ${(analysis['unexplored_options'] as string[]).join(', ')}.`
        : '';
      const pitfallsText = Array.isArray(analysis['potential_pitfalls']) && (analysis['potential_pitfalls'] as unknown[]).length > 0
        ? `\n\nPotential pitfalls to watch out for: ${(analysis['potential_pitfalls'] as string[]).join(', ')}.`
        : '';
      
      const finalMessage = `${summaryText}\n\n${insightsText}${unexploredText}${pitfallsText}\n\nYou've created a solid action plan with clear steps and accountability. I'm confident you have the self-awareness and commitment to make this work. Best wishes, ${userName}!`;

      // Merge analysis with existing review data
      const finalPayload = {
        ...reviewPayload,
        ...analysis,
        coach_reflection: finalMessage
      };

      // Update the LAST review reflection with complete analysis data
      // This prevents duplicate reflections and ensures single report generation
      const lastReviewReflection = reviewReflections[reviewReflections.length - 1];
      if (lastReviewReflection !== undefined && lastReviewReflection !== null) {
        await ctx.runMutation(api.mutations.updateReflection, {
          reflectionId: lastReviewReflection._id,
          payload: finalPayload
        });
      }

      // Close the session
      try {
        await ctx.runMutation(api.mutations.closeSession, {
          sessionId: args.sessionId
        });
      } catch (closeError: unknown) {
        console.error("Failed to close session:", closeError);
      }

      return { ok: true, analysis };
    } catch (error: unknown) {
      console.error("Error generating analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { ok: false, message: `AI error: ${errorMessage}` };
    }
  }
});

