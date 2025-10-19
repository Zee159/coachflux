import { action } from "./_generated/server";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_BASE, USER_STEP_PROMPT, VALIDATOR_PROMPT, ANALYSIS_GENERATION_PROMPT } from "./prompts";
import { api } from "./_generated/api";
import type { Framework, OrgValue, ValidationResult, ReflectionPayload } from "./types";
import { hasCoachReflection } from "./types";

const BANNED = ["psychiatric", "prescribe", "diagnosis", "lawsuit", "litigation"];

// Strip validation constraints from schema for validator (keeps only structure and required fields)
function stripValidationConstraints(schema: unknown): unknown {
  if (typeof schema !== 'object' || schema === null) {
    return schema;
  }
  
  if (Array.isArray(schema)) {
    return schema.map(item => stripValidationConstraints(item));
  }
  
  const result: Record<string, unknown> = {};
  const obj = schema as Record<string, unknown>;
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip validation constraints
    if (key === 'minLength' || key === 'maxLength' || 
        key === 'minItems' || key === 'maxItems' ||
        key === 'minimum' || key === 'maximum') {
      continue;
    }
    
    // Recursively process nested objects/arrays
    if (typeof value === 'object' && value !== null) {
      result[key] = stripValidationConstraints(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

// Required fields for each step (for agent state tracking)
const STEP_REQUIRED_FIELDS: Record<string, string[]> = {
  goal: ["goal", "why_now", "success_criteria", "timeframe"],
  reality: ["current_state", "constraints", "resources", "risks"],
  options: ["options"],
  will: ["chosen_option", "actions"],
  review: ["key_takeaways", "immediate_step"] // Phase 2 fields generated separately by generateReviewAnalysis
};

// Aggregate captured state from reflections (AGENT MODE)
function aggregateStepState(
  reflections: Array<{ step: string; payload: ReflectionPayload }>,
  currentStep: string
): {
  capturedState: Record<string, unknown>;
  missingFields: string[];
  capturedFields: string[];
  completionPercentage: number;
} {
  const requiredFields = STEP_REQUIRED_FIELDS[currentStep] ?? [];
  
  // Get latest reflection for current step
  const currentStepReflections = reflections.filter(r => r.step === currentStep);
  const latestReflection = currentStepReflections[currentStepReflections.length - 1];
  
  if (latestReflection === undefined || latestReflection === null) {
    return {
      capturedState: {},
      missingFields: requiredFields,
      capturedFields: [],
      completionPercentage: 0
    };
  }
  
  const payload = latestReflection.payload;
  const capturedState: Record<string, unknown> = {};
  const capturedFields: string[] = [];
  
  // Extract captured fields
  for (const field of requiredFields) {
    const value = payload[field];
    
    // Check if field has meaningful content
    const isCaptured = 
      (typeof value === 'string' && value.length > 0) ||
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'number') ||
      (typeof value === 'boolean');
    
    if (isCaptured) {
      capturedState[field] = value;
      capturedFields.push(field);
    }
  }
  
  const missingFields = requiredFields.filter(f => !capturedFields.includes(f));
  const completionPercentage = requiredFields.length > 0 
    ? Math.round((capturedFields.length / requiredFields.length) * 100)
    : 0;
  
  return { capturedState, missingFields, capturedFields, completionPercentage };
}

// Serious issues requiring escalation (not coaching)
const ESCALATION_REQUIRED = [
  "sexual harassment", "sexually harassed", "sexual assault", "sexually assaulted",
  "harassment", "harassed", "harassing",
  "bullying", "bullied", "bully",
  "discrimination", "discriminated", "discriminating",
  "abuse", "abused", "abusive",
  "threatened", "threatening", "threat",
  "assault", "assaulted", "assaulting",
  "pornography", "pornographic", "porn",
  "explicit material", "explicit content", "explicit image"
];

// Framework configuration loaded at runtime
const getFramework = (): Framework => {
  return {
    id: "GROW",
    steps: [
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
          additionalProperties: true
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
                  cons: { type: "array", items: { type: "string" }, maxItems: 5 }
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
        system_objective: "Select one option and define SMART actions with overall timeline.",
        required_fields_schema: {
          type: "object",
          properties: {
            chosen_option: { type: "string" },
            actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", minLength: 4, maxLength: 120 },
                  owner: { type: "string" },
                  due_days: { type: "integer", minimum: 1 }
                },
                required: ["title"],
                additionalProperties: false
              },
              minItems: 0,
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

export const nextStep = action({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    stepName: v.string(),
    userTurn: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if session is already escalated
    const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
    if (session === null || session === undefined) {
      throw new Error("Session not found");
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

    // Check for serious workplace issues requiring escalation
    const userInputLower = args.userTurn.toLowerCase();
    const escalationHit = ESCALATION_REQUIRED.some(term => userInputLower.includes(term));
    
    if (escalationHit) {
      const detectedTerms = ESCALATION_REQUIRED.filter(term => userInputLower.includes(term));
      
      // Mark session as escalated to prevent future coaching
      await ctx.runMutation(api.mutations.markSessionEscalated, {
        sessionId: args.sessionId
      });
      
      // Log as high severity incident
      await ctx.runMutation(api.mutations.createSafetyIncident, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        reason: `Escalation required: ${detectedTerms.join(", ")}`,
        llmOutput: args.userTurn.substring(0, 500),
        severity: "high"
      });
      
      return { 
        ok: false, 
        message: "This is a serious matter that deserves proper support.",
        hint: "Please reach out to appropriate professional services, support hotlines, or authorities through official channels. Once you've got support, I'm here to help with your other goals."
      };
    }

    const org = await ctx.runQuery(api.queries.getOrg, { orgId: args.orgId });
    if (org === null || org === undefined) {
      throw new Error("Organization not found");
    }

    const values = (org.values as OrgValue[] ?? []).map((v) => v.key);
    const fw = getFramework();
    const step = fw.steps.find((s) => s.name === args.stepName);
    if (step === undefined) {
      throw new Error("Unknown step");
    }

    // Fetch conversation history for context (especially important for review step)
    const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
      sessionId: args.sessionId
    });
    
    // Build conversation history string - include both user inputs and coach reflections for current step
    const conversationHistory = sessionReflections
      .map((r) => {
        const parts: string[] = [];
        // Include coach reflection if it exists - use type guard
        if (hasCoachReflection(r.payload)) {
          const coachReflection = r.payload.coach_reflection;
          if (coachReflection.length > 0) {
            parts.push(`[${r.step.toUpperCase()}] Coach: ${coachReflection}`);
          }
        }
        // Include user input if it exists
        if (r.userInput !== undefined && r.userInput !== null && r.userInput.length > 0) {
          parts.push(`[${r.step.toUpperCase()}] User: ${r.userInput}`);
        }
        return parts.join('\n');
      })
      .filter((s) => s.length > 0)
      .join('\n\n');

    // AGENT MODE: Aggregate current captured state
    const stepState = aggregateStepState(sessionReflections, step.name);
    const { capturedState, missingFields, capturedFields } = stepState;
    // Note: completionPercentage available in stepState for future UI enhancements

    // Loop detection - check if coach is asking similar questions repeatedly
    const currentStepReflections = sessionReflections.filter(r => r.step === step.name);
    const recentCoachMessages = currentStepReflections
      .slice(-4) // Look at last 4 messages
      .filter(r => hasCoachReflection(r.payload) && (r.userInput === undefined || r.userInput === null)) // Only coach messages
      .map(r => hasCoachReflection(r.payload) ? r.payload.coach_reflection.toLowerCase() : '')
      .filter(msg => msg.length > 0);
    
    // Check for repetitive questions (3+ similar questions in recent history)
    const loopDetected = recentCoachMessages.length >= 3 && 
      recentCoachMessages.every(msg => 
        msg.includes('what') || msg.includes('why') || msg.includes('how') || msg.includes('?')
      );

    // Initialize Anthropic client
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (apiKey === undefined || apiKey === null || apiKey === '') {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }
    const client = new Anthropic({ apiKey });

    // Primary call with AGENT MODE context
    const system = SYSTEM_BASE(values);
    const user = USER_STEP_PROMPT(
      step.name, 
      args.userTurn, 
      conversationHistory, 
      loopDetected, 
      skipCount,
      capturedState,
      missingFields,
      capturedFields
    );

    const primary = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      temperature: 0,
      system: system + "\n\nYou MUST respond with valid JSON only. No other text.",
      messages: [
        { 
          role: "user", 
          content: `Schema:\n${JSON.stringify(step.required_fields_schema, null, 2)}\n\n${user}\n\nRespond with ONLY valid JSON matching the schema.`
        }
      ]
    });

    const firstContent = primary.content[0];
    if (firstContent === undefined || firstContent === null) {
      throw new Error("No content in primary response");
    }
    const raw = firstContent.type === "text" ? firstContent.text : "{}";

    // Validator call - use stripped schema without validation constraints
    const strippedSchema = stripValidationConstraints(step.required_fields_schema) as object;
    const validator = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      temperature: 0,
      system: "You validate JSON output for schema conformance and banned terms. Respond with ONLY valid JSON.",
      messages: [
        { 
          role: "user", 
          content: VALIDATOR_PROMPT(strippedSchema, raw) + "\n\nRespond with ONLY valid JSON: {\"verdict\":\"pass\"|\"fail\",\"reasons\":[]}"
        }
      ]
    });

    const firstValidatorContent = validator.content[0];
    if (firstValidatorContent === undefined || firstValidatorContent === null) {
      throw new Error("No content in validator response");
    }
    const verdictRaw = firstValidatorContent.type === "text" ? firstValidatorContent.text : '{"verdict":"fail","reasons":["No response"]}';
    let verdict: ValidationResult;
    try {
      verdict = JSON.parse(verdictRaw) as ValidationResult;
    } catch (error) {
      console.error("Validator JSON parse error:", error);
      verdict = { verdict: "fail", reasons: ["Validator returned invalid JSON"] };
    }

    const lower = raw.toLowerCase();
    const bannedHit = BANNED.some(b => lower.includes(b));

    if (verdict.verdict !== "pass" || bannedHit) {
      const reason = bannedHit 
        ? `Banned term detected: ${BANNED.filter(b => lower.includes(b)).join(", ")}`
        : `Validator failed: ${verdict.reasons?.join(", ") ?? "Unknown reason"}`;
      
      console.error("Safety validation failed:", { 
        reason, 
        userInput: args.userTurn.substring(0, 100),
        aiOutput: raw.substring(0, 200)
      });
      
      await ctx.runMutation(api.mutations.createSafetyIncident, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        reason,
        llmOutput: raw,
        severity: "low"
      });
      
      // Create a reflection with error message so it flows through chat naturally
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

    // Parse primary JSON
    let payload: ReflectionPayload;
    try {
      payload = JSON.parse(raw) as ReflectionPayload;
    } catch (error) {
      console.error("Primary JSON parse error:", error);
      await ctx.runMutation(api.mutations.createSafetyIncident, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        reason: "json_parse_error",
        llmOutput: raw,
        severity: "med"
      });
      
      // Create a reflection with error message so it flows through chat naturally
      const errorPayload: ReflectionPayload = {
        coach_reflection: "I'm having a bit of trouble processing that response. Could you rephrase it more directly? Share one clear thought about your situation."
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

    // Create reflection with user input
    await ctx.runMutation(api.mutations.createReflection, {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      step: step.name,
      userInput: args.userTurn,
      payload
    });

    // Create actions if step=will
    const actions = payload["actions"];
    if (step.name === "will" && Array.isArray(actions)) {
      for (const a of actions) {
        const action = a as { title: string; owner: string; due_days?: number };
        const due = action.due_days !== undefined && action.due_days !== null && action.due_days > 0 
          ? Date.now() + action.due_days * 86400000 
          : undefined;
        await ctx.runMutation(api.mutations.createAction, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          title: action.title,
          dueAt: due,
          status: "open"
        });
      }
    }

    // Check if step is complete before advancing
    let shouldAdvance = false;
    
    // Define completion criteria for each step
    if (step.name === "goal") {
      // Goal step requires: 3 out of 4 fields (goal, why_now, success_criteria, timeframe)
      // This allows flexibility while ensuring meaningful goal capture
      const hasGoal = typeof payload["goal"] === "string" && payload["goal"].length > 0;
      const hasWhyNow = typeof payload["why_now"] === "string" && payload["why_now"].length > 0;
      const hasSuccessCriteria = Array.isArray(payload["success_criteria"]) && payload["success_criteria"].length > 0;
      const hasTimeframe = typeof payload["timeframe"] === "string" && payload["timeframe"].length > 0;
      
      const completedFields = [hasGoal, hasWhyNow, hasSuccessCriteria, hasTimeframe].filter(Boolean).length;
      
      // Progressive relaxation based on skip count and loop detection
      // 0 skips: 3/4 fields required (strict)
      // 1 skip:  2/4 fields required (lenient)
      // 2 skips: 1-2/4 fields required (very lenient - force advance)
      // Loop detected: 2/4 fields (override - system is stuck)
      let requiredFields = 3;
      
      if (loopDetected) {
        requiredFields = 2; // System is stuck, be lenient
      } else if (skipCount >= 2) {
        requiredFields = 1; // User has exhausted skips, force advance with minimal info
      } else if (skipCount === 1) {
        requiredFields = 2; // User has used one skip, be more lenient
      }
      
      shouldAdvance = completedFields >= requiredFields;
    } else if (step.name === "reality") {
      // Reality step requires: current_state AND risks (mandatory) AND at least 1 of (constraints or resources)
      const hasCurrentState = typeof payload["current_state"] === "string" && payload["current_state"].length > 0;
      const hasConstraints = Array.isArray(payload["constraints"]) && payload["constraints"].length > 0;
      const hasResources = Array.isArray(payload["resources"]) && payload["resources"].length > 0;
      const hasRisks = Array.isArray(payload["risks"]) && payload["risks"].length > 0;
      const additionalExplorationCount = [hasConstraints, hasResources].filter(Boolean).length;
      
      // Progressive relaxation based on skip count
      // 0 skips: current_state + risks + 2 additional areas (constraints AND resources) - strict
      // 1 skip:  current_state + risks + 1 additional area (lenient)
      // 2 skips: current_state + risks only (very lenient)
      // Loop detected: current_state + risks + 1 additional area
      let requiredAdditionalExploration = 2;
      
      if (loopDetected) {
        requiredAdditionalExploration = 1;
      } else if (skipCount >= 2) {
        requiredAdditionalExploration = 0; // Just need current_state + risks
      } else if (skipCount === 1) {
        requiredAdditionalExploration = 1;
      }
      
      // Risks is ALWAYS required, plus current_state and additional exploration based on skip count
      shouldAdvance = hasCurrentState && hasRisks && additionalExplorationCount >= requiredAdditionalExploration;
    } else if (step.name === "options") {
      // Options step requires: at least 2 options with at least 1 fully explored (pros AND cons)
      // New flow supports mix of user-generated and AI-generated options
      const options = payload["options"];
      
      if (!Array.isArray(options) || options.length === 0) {
        shouldAdvance = false;
      } else {
        const exploredOptions = options.filter((opt: unknown) => {
          const option = opt as { label?: string; pros?: unknown[]; cons?: unknown[] };
          return Array.isArray(option.pros) && option.pros.length > 0 &&
                 Array.isArray(option.cons) && option.cons.length > 0;
        });
        
        // Progressive relaxation based on skip count
        // 0 skips: 2+ options, 1+ fully explored (standard)
        // 1 skip:  2+ options, 1+ with ANY exploration (lenient)
        // 2 skips: 1+ option with ANY content (very lenient)
        // Loop detected: 2+ options, 1+ explored
        if (loopDetected) {
          shouldAdvance = options.length >= 2 && exploredOptions.length >= 1;
        } else if (skipCount >= 2) {
          shouldAdvance = options.length >= 1; // Just need ANY option
        } else if (skipCount === 1) {
          shouldAdvance = options.length >= 2; // Just need 2 options, exploration optional
        } else {
          shouldAdvance = options.length >= 2 && exploredOptions.length >= 1;
        }
      }
    } else if (step.name === "will") {
      // Will step requires: chosen_option, at least 2 concrete actions with ALL details
      const hasChosenOption = typeof payload["chosen_option"] === "string" && payload["chosen_option"].length > 0;
      const actions = payload["actions"];
      
      if (!hasChosenOption || !Array.isArray(actions) || actions.length === 0) {
        shouldAdvance = false;
      } else {
        // Check that actions have complete details (title, owner, and optionally due_days)
        // Note: due_days is optional for ongoing commitments/habits without specific deadlines
        const completeActions = actions.filter((a: unknown) => {
          const action = a as { title?: string; owner?: string; due_days?: number };
          const hasTitle = typeof action.title === "string" && action.title.length > 0;
          const hasOwner = typeof action.owner === "string" && action.owner.length > 0;
          const hasDueDate = typeof action.due_days === "number" && action.due_days > 0;
          const isOngoing = action.due_days === undefined; // Ongoing commitment without deadline
          
          return hasTitle && hasOwner && (hasDueDate || isOngoing);
        });
        
        // Progressive relaxation based on skip count
        // 0 skips: 2+ complete actions (strict)
        // 1 skip:  1+ complete action (lenient)
        // 2 skips: 1+ action with ANY detail (very lenient)
        // Loop detected: 1+ complete action
        if (loopDetected) {
          shouldAdvance = completeActions.length >= 1;
        } else if (skipCount >= 2) {
          shouldAdvance = actions.length >= 1; // Just need ANY action
        } else if (skipCount === 1) {
          shouldAdvance = completeActions.length >= 1;
        } else {
          shouldAdvance = completeActions.length >= 2;
        }
      }
    } else if (step.name === "review") {
      // Review step Phase 1: Just need both questions answered
      // Phase 2 analysis is generated separately by generateReviewAnalysis action
      // Frontend will trigger generateReviewAnalysis, which will close the session
      // So we DON'T advance here - let the frontend handle it
      shouldAdvance = false; // Never auto-advance from review step
    }

    // Only advance if step is complete
    let nextStepName = step.name;
    let sessionClosed = false;
    
    if (shouldAdvance) {
      const order = fw.steps.map((s) => s.name);
      const idx = order.indexOf(step.name);
      const isLastStep = step.name === "review";
      
      if (isLastStep) {
        // Review complete - close the session
        await ctx.runMutation(api.mutations.closeSession, {
          sessionId: args.sessionId
        });
        sessionClosed = true;
        nextStepName = "review"; // Stay on review
      } else {
        // Create transition message for current step
        const stepTransitions: Record<string, string> = {
          goal: "Excellent! You've got a clear goal. Now let's explore your current reality.",
          reality: "Great work exploring the situation. Now let's brainstorm your options.",
          options: "You've identified some solid options. Let's now turn one into action.",
          will: "Perfect! You've committed to specific actions. Let's review everything together."
        };
        
        const transition = stepTransitions[step.name];
        if (transition !== undefined) {
          await ctx.runMutation(api.mutations.createReflection, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            step: step.name,
            userInput: undefined,
            payload: { coach_reflection: transition }
          });
        }
        
        // Advance to next step
        nextStepName = idx < order.length - 1 ? (order[idx + 1] ?? "review") : "review";
        await ctx.runMutation(api.mutations.updateSessionStep, {
          sessionId: args.sessionId,
          step: nextStepName
        });

        // Create step opener reflections
        const stepOpeners: Record<string, string> = {
          reality: "Now let's explore what's actually happening. What's the current situation you're facing?",
          options: "Great clarity on your goal! Let's brainstorm possibilities. What are some ways you could move forward?",
          will: "Excellent options! Now let's turn this into action. Which option feels right for you?",
          review: "You've done excellent work! Let's review everything together. What are the key takeaways from this conversation for you?"
        };

        const opener = stepOpeners[nextStepName];
        if (opener !== undefined) {
          await ctx.runMutation(api.mutations.createReflection, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            step: nextStepName,
            userInput: undefined,
            payload: { coach_reflection: opener }
          });
        }
      }
    }

    return { ok: true, nextStep: nextStepName, payload, sessionClosed };
  }
});

/**
 * Generate Phase 2 analysis for review step
 * Called by frontend after user answers both review questions
 */
export const generateReviewAnalysis = action({
  args: {
    sessionId: v.id("sessions"),
    orgId: v.id("orgs"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // 1. Get session and all reflections
    const session = await ctx.runQuery(api.queries.getSession, { sessionId: args.sessionId });
    if (session === null || session === undefined) {
      return { ok: false, message: "Session not found" };
    }

    const reflections = await ctx.runQuery(api.queries.getSessionReflections, { sessionId: args.sessionId });
    if (reflections === null || reflections === undefined || reflections.length === 0) {
      return { ok: false, message: "No reflections found" };
    }

    // 2. Extract data from each step
    const goalReflection = reflections.find((r) => r.step === "goal");
    const realityReflection = reflections.find((r) => r.step === "reality");
    const optionsReflection = reflections.find((r) => r.step === "options");
    const willReflection = reflections.find((r) => r.step === "will");
    // Get the LAST review reflection (in case there are multiple)
    const reviewReflections = reflections.filter((r) => r.step === "review");
    const reviewReflection = reviewReflections[reviewReflections.length - 1];

    const goalPayload = goalReflection?.payload as Record<string, unknown> | undefined;
    const realityPayload = realityReflection?.payload as Record<string, unknown> | undefined;
    const optionsPayload = optionsReflection?.payload as Record<string, unknown> | undefined;
    const willPayload = willReflection?.payload as Record<string, unknown> | undefined;
    const reviewPayload = reviewReflection?.payload as Record<string, unknown> | undefined;

    // 3. Build conversation history
    const conversationHistory = reflections
      .map((r) => {
        const payload = r.payload as Record<string, unknown>;
        const coachMsg = payload['coach_reflection'];
        const userMsg = r.userInput;
        let msg = `[${r.step.toUpperCase()}]`;
        if (typeof userMsg === 'string' && userMsg.length > 0) {
          msg += `\nUser: ${userMsg}`;
        }
        if (typeof coachMsg === 'string' && coachMsg.length > 0) {
          msg += `\nCoach: ${coachMsg}`;
        }
        return msg;
      })
      .join('\n\n');

    // 4. Format step data
    const goalData = goalPayload !== undefined && goalPayload !== null ? JSON.stringify(goalPayload, null, 2) : 'Not captured';
    const realityData = realityPayload !== undefined && realityPayload !== null ? JSON.stringify(realityPayload, null, 2) : 'Not captured';
    const optionsData = optionsPayload !== undefined && optionsPayload !== null ? JSON.stringify(optionsPayload, null, 2) : 'Not captured';
    const willData = willPayload !== undefined && willPayload !== null ? JSON.stringify(willPayload, null, 2) : 'Not captured';
    const reviewData = reviewPayload !== undefined && reviewPayload !== null ? JSON.stringify(reviewPayload, null, 2) : 'Not captured';

    // 5. Call AI to generate analysis
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (apiKey === undefined || apiKey === null || apiKey.length === 0) {
      return { ok: false, message: "ANTHROPIC_API_KEY not configured" };
    }

    const anthropic = new Anthropic({ apiKey });
    const prompt = ANALYSIS_GENERATION_PROMPT(conversationHistory, goalData, realityData, optionsData, willData, reviewData);

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
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

      // 6. Parse AI response
      const analysisText = content.text.trim();
      let analysis: Record<string, unknown>;
      
      try {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = analysisText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) ?? analysisText.match(/(\{[\s\S]*\})/);
        const jsonText = jsonMatch !== null && jsonMatch !== undefined ? jsonMatch[1] : analysisText;
        analysis = JSON.parse(jsonText ?? '{}') as Record<string, unknown>;
      } catch (parseError) {
        console.error("Failed to parse analysis JSON:", parseError);
        return { ok: false, message: "Failed to parse AI analysis" };
      }

      // 7. Validate required fields
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

      // 8. Merge analysis with existing review data
      const finalPayload = {
        ...reviewPayload,
        ...analysis,
        coach_reflection: "You've created a solid action plan with clear steps and accountability. I'm confident you have the self-awareness and commitment to make this work. Best of luck!"
      };

      // 9. Update the review reflection with analysis
      // Check if ANY review reflection exists (we'll create a new complete one)
      const existingReview = reflections.find((r) => r.step === "review");
      if (existingReview !== undefined && existingReview !== null) {
        // Create a new reflection with complete data (we can't update existing ones)
        await ctx.runMutation(api.mutations.createReflection, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          step: "review",
          userInput: undefined,
          payload: finalPayload
        });
      }

      // 10. Close the session
      try {
        await ctx.runMutation(api.mutations.closeSession, {
          sessionId: args.sessionId
        });
      } catch (closeError: unknown) {
        console.error("Failed to close session:", closeError);
        // Continue anyway - we still want to return the analysis
      }

      return { ok: true, analysis };
    } catch (error: unknown) {
      console.error("Error generating analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { ok: false, message: `AI error: ${errorMessage}` };
    }
  }
});
