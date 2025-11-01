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
import { getEmergencyResources } from "../safety";
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
function getFrameworkCoach(frameworkId: string): FrameworkCoach {
  const id = frameworkId.toUpperCase();
  
  if (id === 'GROW') {
    return growCoach;
  }
  
  if (id === 'COMPASS') {
    return compassCoach;
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
    pauseSession: m.pauseSession
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
// MAIN COACHING ACTION
// ============================================================================

export const nextStep = action({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    stepName: v.string(),
    userTurn: v.string(),
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
          aiContext += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT PAST CONTEXT (from similar sessions):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${crossSessionContext.map((ctx, i) => 
  `${i + 1}. ${ctx.content.substring(0, 200)}... (${ctx.framework} session, ${(ctx.relevance * 100).toFixed(0)}% relevant)`
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
      } catch (error) {
        // Silently fail - cross-session context is nice-to-have, not critical
        console.error("Failed to fetch cross-session context:", error);
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
    const validation = await validateResponse(raw, step.required_fields_schema);
    const { isValid, verdict, bannedHit } = validation;

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
      const currentConfidence = payload['current_confidence'] as number | undefined;
      const finalConfidence = payload['final_confidence'] as number | undefined;
      
      if (initialConfidence !== undefined && finalConfidence !== undefined) {
        const confidenceChange = finalConfidence - initialConfidence;
        const confidencePercentIncrease = initialConfidence > 0 ? Math.round((confidenceChange / initialConfidence) * 100) : 0;
        
        payload['confidence_tracking'] = {
          initial_confidence: initialConfidence,
          post_clarity_confidence: step.name === 'ownership' ? currentConfidence : undefined,
          post_ownership_confidence: step.name === 'mapping' ? currentConfidence : undefined,
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
      capturedFields: capturedFields.length,
      missingFields: missingFields.length
    });

    let nextStepName = step.name;
    let sessionClosed = false;

    if (completionResult.shouldAdvance) {
      // If COMPASS PRACTICE completed, compute and persist CSS before advancing
      if (session.framework === 'COMPASS' && step.name === 'practice') {
        try {
          // Re-fetch reflections including this turn
          const reflections = await ctx.runQuery(api.queries.getSessionReflections, { sessionId: args.sessionId });
          // Get CSS baseline from introduction step (not ownership)
          const introList = reflections.filter((r: { step: string }) => r.step === 'introduction');
          const introduction = introList.length > 0 ? introList[introList.length - 1] : undefined;
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

          // Get CSS baseline from introduction step
          const initialConfidence = introduction !== undefined && introduction !== null ? getNum(introduction.payload, 'initial_confidence') : undefined;
          const initialActionClarity = introduction !== undefined && introduction !== null ? getNum(introduction.payload, 'initial_action_clarity') : undefined;
          const initialMindsetStr = introduction !== undefined && introduction !== null ? getStr(introduction.payload, 'initial_mindset_state') : undefined;

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
      sessionClosed = nextStepName === "review" && step.name === "review";
    }

    return { ok: true, nextStep: nextStepName, payload, sessionClosed };
  }
});

// ============================================================================
// REVIEW ANALYSIS ACTION
// ============================================================================

export const generateReviewAnalysis = action({
  args: {
    sessionId: v.id("sessions"),
    orgId: v.id("orgs"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
    if (session === null || session === undefined) {
      return { ok: false, message: "Session not found" };
    }

    const user = await ctx.runQuery(api.queries.getUser, { userId: args.userId });
    const userName = user?.displayName ?? "there";

    const reflections = await ctx.runQuery(api.queries.getSessionReflections, { sessionId: args.sessionId });
    if (reflections === null || reflections === undefined || reflections.length === 0) {
      return { ok: false, message: "No reflections found" };
    }

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
    const willData = willPayload !== undefined && willPayload !== null ? JSON.stringify(willPayload, null, 2) : 'Not captured';
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

    // Call AI to generate analysis
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (apiKey === undefined || apiKey === null || apiKey.length === 0) {
      return { ok: false, message: "ANTHROPIC_API_KEY not configured" };
    }

    const anthropic = new Anthropic({ apiKey });
    const prompt = ANALYSIS_GENERATION_PROMPT(conversationHistory, allStepData);

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

      // Create a new reflection with complete data
      const existingReview = reflections.find((r: { step: string }) => r.step === "review");
      if (existingReview !== undefined && existingReview !== null) {
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: "review",
          userInput: undefined,
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

