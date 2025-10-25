/**
 * Base Coaching Engine
 * Framework-agnostic coaching logic: safety, validation, LLM calls, session management
 */

import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_BASE, USER_STEP_PROMPT, VALIDATOR_PROMPT } from "../prompts/index";
import type { Framework, ValidationResult, ReflectionPayload } from "../types";
import { hasCoachReflection } from "../types";
import { performSafetyCheck, getEmergencyResources } from "../safety";
import type { StepState, CoachActionResult, FrameworkCoach } from "./types";
import type { Id } from "../_generated/dataModel";

/**
 * Minimal context interface for coaching functions
 * Avoids TypeScript "excessively deep" errors with full ActionCtx
 * Note: We don't import api here to avoid type resolution issues
 * 
 * NOTE: Using 'any' here is a documented workaround for Convex's deep type recursion.
 * This is whitelisted in scripts/safety-check.js
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CoachContext {
  runMutation: (mutation: any, args: any) => Promise<any>;
  runQuery: (query: any, args: any) => Promise<any>;
}

/**
 * Mutations interface - passed by caller to avoid importing api in base.ts
 * 
 * NOTE: Using 'any' here is a documented workaround for Convex's deep type recursion.
 * This is whitelisted in scripts/safety-check.js
 */
export interface CoachMutations {
  markSessionEscalated: any;
  createSafetyIncident: any;
  createAction: any;
  closeSession: any;
  createReflection: any;
  updateSessionStep: any;
  pauseSession: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Safety constants
const BANNED = ["psychiatric", "prescribe", "diagnosis", "lawsuit", "litigation"];

// Escalation keywords requiring specialist support
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

// Exceptions to escalation (business context)
const ESCALATION_EXCEPTIONS = [
  "resisting change", "resistance to change", "resistant to change",
  "threat to business", "threat to project", "competitive threat"
];

// Job security concerns requiring empathetic support
const JOB_SECURITY_CONCERNS = [
  "redundant", "redundancy", "made redundant",
  "lose my job", "losing my job", "lost my job",
  "laid off", "being laid off",
  "fired", "being fired", "getting fired",
  "terminated", "being terminated",
  "job at risk", "position eliminated", "role eliminated",
  "job security", "fear of losing"
];

// Emotional distress indicators requiring empathetic support
const EMOTIONAL_DISTRESS_INDICATORS = [
  "overwhelmed", "overwhelming", "can't cope", "cannot cope",
  "anxious", "anxiety", "panic", "panicking", "panicked",
  "stressed", "stress", "stressful",
  "scared", "afraid", "frightened", "terrified",
  "worried", "worrying", "worry",
  "exhausted", "burnt out", "burned out", "burnout",
  "struggling", "can't handle", "cannot handle",
  "breaking down", "falling apart", "losing it",
  "hopeless", "helpless", "stuck", "trapped",
  "depressed", "depression", "sad", "crying"
];

/**
 * Strip validation constraints from schema for validator
 * Keeps only structure and required fields
 */
export function stripValidationConstraints(schema: unknown): unknown {
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

/**
 * Extract already-captured context from reflections to prevent re-asking questions
 * CRITICAL: This prevents the "context amnesia" bug where coach asks same question repeatedly
 */
export function extractExistingContext(
  reflections: Array<{ step: string; payload: ReflectionPayload; userInput?: string }>,
  currentStep: string
): {
  extractedFields: Record<string, unknown>;
  messageCount: number;
  lastUserInputs: string[];
} {
  // Get all reflections for current step
  const currentStepReflections = reflections.filter(r => r.step === currentStep);
  const messageCount = currentStepReflections.length;
  
  // Aggregate all captured fields (from ALL reflections in this step)
  const extractedFields: Record<string, unknown> = {};
  
  for (const reflection of currentStepReflections) {
    const payload = reflection.payload;
    
    // Extract any meaningful fields
    for (const [key, value] of Object.entries(payload)) {
      // Skip if already extracted (first occurrence wins)
      if (extractedFields[key] !== undefined && extractedFields[key] !== null) {
        continue;
      }
      
      // Check if field has meaningful content
      const isMeaningful = 
        (typeof value === 'string' && value.length > 0 && key !== 'coach_reflection') ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'number' && !isNaN(value)) ||
        (typeof value === 'boolean');
      
      if (isMeaningful) {
        extractedFields[key] = value;
      }
    }
  }
  
  // Get last 3 user inputs for context
  const lastUserInputs = currentStepReflections
    .map(r => r.userInput)
    .filter((input): input is string => input !== undefined && input !== null && input.length > 0)
    .slice(-3);
  
  return {
    extractedFields,
    messageCount,
    lastUserInputs
  };
}

/**
 * Aggregate captured state from reflections (AGENT MODE)
 */
export function aggregateStepState(
  reflections: Array<{ step: string; payload: ReflectionPayload }>,
  currentStep: string,
  requiredFields: string[]
): StepState {
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

/**
 * Perform comprehensive safety checks on user input
 */
export async function performSafetyChecks(
  userInput: string,
  ctx: CoachContext,
  mutations: CoachMutations,
  args: { orgId: Id<"orgs">; userId: Id<"users">; sessionId: Id<"sessions"> }
): Promise<CoachActionResult | null> {
  // NEW COMPASS: Perform comprehensive safety check
  const safetyCheck = performSafetyCheck(userInput);
  
  // Handle safety escalation (Level 4-5: severe dysfunction or self-harm risk)
  if (safetyCheck.level === 'severe' || safetyCheck.level === 'crisis') {
    await ctx.runMutation(mutations.markSessionEscalated, {
      sessionId: args.sessionId
    });
    
    // ⚠️ FIX P0-4: Pause session on crisis level (suicidal ideation)
    if (safetyCheck.level === 'crisis') {
      await ctx.runMutation(mutations.pauseSession, {
        sessionId: args.sessionId,
        reason: `Crisis detected: ${Array.isArray(safetyCheck.detected_keywords) ? safetyCheck.detected_keywords.join(', ') : 'self-harm risk'}`
      });
    }
    
    await ctx.runMutation(mutations.createSafetyIncident, {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      reason: `Safety escalation: ${safetyCheck.level === 'severe' ? 'Severe dysfunction' : 'Self-harm risk'} - ${Array.isArray(safetyCheck.detected_keywords) ? safetyCheck.detected_keywords.join(', ') : 'unknown keywords'}`,
      llmOutput: userInput.substring(0, 500),
      severity: "high"
    });
    
    const emergencyResources = getEmergencyResources('US'); // Default to US, could be user-specific
    const safetyResponse = safetyCheck.response ?? '';
    
    return { 
      ok: false, 
      message: safetyResponse.length > 0 ? safetyResponse : `I'm concerned about your wellbeing. Please reach out to professional support immediately. ${emergencyResources.description}`,
      hint: "Your safety is the most important thing right now. This session has been paused. Please contact the crisis services listed above."
    };
  }
  
  // Legacy safety checks (for backward compatibility)
  const userInputLower = userInput.toLowerCase();
  const hasException = ESCALATION_EXCEPTIONS.some(exception => userInputLower.includes(exception));
  
  const escalationHit = !hasException && ESCALATION_REQUIRED.some(term => userInputLower.includes(term));
  
  if (escalationHit) {
    const detectedTerms = ESCALATION_REQUIRED.filter(term => userInputLower.includes(term));
    
    await ctx.runMutation(mutations.markSessionEscalated, {
      sessionId: args.sessionId
    });
    
    await ctx.runMutation(mutations.createSafetyIncident, {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      reason: `Escalation required: ${detectedTerms.join(", ")}`,
      llmOutput: userInput.substring(0, 500),
      severity: "high"
    });
    
    return { 
      ok: false, 
      message: "This is a serious matter that deserves proper support.",
      hint: "Please reach out to appropriate professional services, support hotlines, or authorities through official channels. Once you've got support, I'm here to help with your other goals."
    };
  }
  
  return null; // No safety issues detected
}

/**
 * Generate safety alerts for system prompt
 */
export function generateSafetyAlerts(userInput: string): string {
  const userInputLower = userInput.toLowerCase();
  let alerts = '';
  
  const wordCount = userInput.trim().split(/\s+/).length;
  const charCount = userInput.trim().length;
  const isDisengaged = wordCount < 3 || charCount < 10;
  
  if (isDisengaged && !userInputLower.includes("skip")) {
    console.warn("⚠️ DISENGAGEMENT DETECTED:", { wordCount, charCount, userInput });
  }
  
  const jobSecurityHit = JOB_SECURITY_CONCERNS.some(term => userInputLower.includes(term));
  const emotionalDistressHit = EMOTIONAL_DISTRESS_INDICATORS.some(term => userInputLower.includes(term));
  
  if (jobSecurityHit) {
    alerts += "\n\n🚨 ALERT: User has expressed job security concerns (redundancy/job loss fear). BE EXTRA EMPATHETIC. Accept their input as-is without asking for rephrasing. Validate their feelings deeply: 'I hear your anxiety about job security - that's a very real and understandable fear.' Then gently explore: 'Would you like to talk about what specifically worries you most?' Focus on what they can control (upskilling, positioning). Suggest HR/EAP if appropriate. NEVER dismiss or minimize their fear.";
  }
  
  if (emotionalDistressHit) {
    alerts += "\n\n💙 ALERT: User is showing signs of emotional distress (overwhelm/anxiety/stress). BE GENTLE. Normalise feelings: 'It's completely normal to feel anxious about change.' Slow down the pace. Offer grounding: 'Let's take this one step at a time.' Focus on what they can control. Suggest self-care/support resources if appropriate.";
  }
  
  if (isDisengaged) {
    alerts += "\n\n⚠️ DISENGAGEMENT DETECTED: User gave a very short response (< 3 words). This may indicate: confusion, overwhelm, checking out, or difficulty articulating. INTERVENE GENTLY: Acknowledge the brevity, check in with empathy. Example: 'I notice you're being brief. Is this topic difficult to discuss, or would you like to explore it from a different angle?' Offer to pause, skip, or approach differently. Don't just repeat the question.";
  }
  
  return alerts;
}

/**
 * Detect loop (coach asking similar questions repeatedly)
 */
export function detectLoop(
  reflections: Array<{ step: string; payload: ReflectionPayload; userInput?: string }>,
  stepName: string
): boolean {
  const currentStepReflections = reflections.filter(r => r.step === stepName);
  const recentCoachMessages = currentStepReflections
    .slice(-4) // Look at last 4 messages
    .filter(r => hasCoachReflection(r.payload) && (r.userInput === undefined || r.userInput === null)) // Only coach messages
    .map(r => hasCoachReflection(r.payload) ? r.payload.coach_reflection.toLowerCase() : '')
    .filter(msg => msg.length > 0);
  
  // Check for repetitive questions (3+ similar questions in recent history)
  return recentCoachMessages.length >= 3 && 
    recentCoachMessages.every(msg => 
      msg.includes('what') || msg.includes('why') || msg.includes('how') || msg.includes('?')
    );
}

/**
 * Call Anthropic API to generate coach response
 */
export async function generateCoachResponse(
  framework: Framework,
  step: { name: string; required_fields_schema: Record<string, unknown> },
  userTurn: string,
  conversationHistory: string,
  orgValues: string[],
  loopDetected: boolean,
  skipCount: number,
  capturedState: string,
  missingFields: string[],
  capturedFields: string[],
  safetyAlerts: string,
  aiContext: string
): Promise<{ raw: string; payload: ReflectionPayload }> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (apiKey === undefined || apiKey === null || apiKey === '') {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  const client = new Anthropic({ apiKey });
  
  const system = SYSTEM_BASE(orgValues);
  const user = USER_STEP_PROMPT(
    framework.id,
    step.name, 
    userTurn, 
    conversationHistory, 
    loopDetected, 
    skipCount,
    capturedState,
    missingFields,
    capturedFields
  );
  
  const primary = await client.messages.create({
    model: "claude-4-5-haiku-20241022",
    max_tokens: 800, // Increased from 600 to give more room for JSON generation
    temperature: 0.3, // Slightly increased from 0 to allow more flexibility
    system: system + safetyAlerts + aiContext + "\n\nYou MUST respond with valid JSON only. No other text.",
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
  
  let payload: ReflectionPayload;
  try {
    payload = JSON.parse(raw) as ReflectionPayload;
  } catch (error) {
    console.error("Primary JSON parse error:", error);
    throw error;
  }
  
  return { raw, payload };
}

/**
 * Validate AI response against schema and banned terms
 */
export async function validateResponse(
  raw: string,
  schema: Record<string, unknown>
): Promise<{ isValid: boolean; verdict: ValidationResult; bannedHit: boolean }> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (apiKey === undefined || apiKey === null || apiKey === '') {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  const client = new Anthropic({ apiKey });
  
  const strippedSchema = stripValidationConstraints(schema) as Record<string, unknown>;
  
  const validator = await client.messages.create({
    model: "claude-4-5-haiku-20241022",
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
  let isValid = false;
  try {
    verdict = JSON.parse(verdictRaw) as ValidationResult;
    // Handle both formats: {verdict: "pass"} and {valid: true}
    if ('verdict' in verdict) {
      isValid = verdict.verdict === "pass";
    } else {
      const verdictObj = verdict as Record<string, unknown>;
      isValid = verdictObj['valid'] === true;
    }
  } catch (error) {
    console.error("Validator JSON parse error:", error);
    verdict = { verdict: "fail", reasons: ["Validator returned invalid JSON"] };
    isValid = false;
  }

  const lower = raw.toLowerCase();
  const bannedHit = BANNED.some(b => lower.includes(b));
  
  return { isValid, verdict, bannedHit };
}

/**
 * Build conversation history from reflections
 */
export function buildConversationHistory(
  reflections: Array<{ step: string; payload: ReflectionPayload; userInput?: string }>
): string {
  return reflections
    .map((r) => {
      const parts: string[] = [];
      // Include coach reflection if it exists
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
}

/**
 * Create actions from step payload
 */
export async function createActionsFromPayload(
  ctx: CoachContext,
  mutations: CoachMutations,
  step: { name: string },
  payload: ReflectionPayload,
  args: { orgId: Id<"orgs">; userId: Id<"users">; sessionId: Id<"sessions"> }
): Promise<void> {
  const actions = payload["actions"];
  const nextActions = payload["next_actions"];
  
  // GROW Framework: Create actions from "will" step
  if (step.name === "will" && Array.isArray(actions)) {
    for (const a of actions) {
      const action = a as { title: string; owner: string; due_days?: number };
      const due = action.due_days !== undefined && action.due_days !== null && action.due_days > 0 
        ? Date.now() + action.due_days * 86400000 
        : undefined;
      await ctx.runMutation(mutations.createAction, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        title: action.title,
        dueAt: due,
        status: "open"
      });
    }
  }
  
  // COMPASS Framework: Create actions from "review" step
  if (step.name === "review" && Array.isArray(nextActions)) {
    for (const actionTitle of nextActions) {
      if (typeof actionTitle === 'string' && actionTitle.length > 0) {
        const defaultDue = Date.now() + 7 * 86400000; // 7 days
        await ctx.runMutation(mutations.createAction, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          title: actionTitle,
          dueAt: defaultDue,
          status: "open"
        });
      }
    }
  }
}

/**
 * Advance to next step and create transition/opener reflections
 */
export async function advanceToNextStep(
  ctx: CoachContext,
  mutations: CoachMutations,
  framework: Framework,
  currentStep: { name: string },
  frameworkCoach: FrameworkCoach,
  args: { orgId: Id<"orgs">; userId: Id<"users">; sessionId: Id<"sessions"> }
): Promise<string> {
  const order = framework.steps.map((s) => s.name);
  const idx = order.indexOf(currentStep.name);
  const isLastStep = currentStep.name === "review";
  
  if (isLastStep) {
    // Review complete - close the session
    await ctx.runMutation(mutations.closeSession, {
      sessionId: args.sessionId
    });
    return "review"; // Stay on review
  }
  
  // Create transition message for current step
  const { transitions, openers } = frameworkCoach.getStepTransitions();
  const transition = transitions[currentStep.name];
  if (transition !== undefined) {
    await ctx.runMutation(mutations.createReflection, {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      step: currentStep.name,
      userInput: undefined,
      payload: { coach_reflection: transition }
    });
  }
  
  // Advance to next step
  const nextStepName = idx < order.length - 1 ? (order[idx + 1] ?? "review") : "review";
  await ctx.runMutation(mutations.updateSessionStep, {
    sessionId: args.sessionId,
    step: nextStepName
  });
  
  // Create step opener reflection
  const opener = openers[nextStepName];
  if (opener !== undefined) {
    await ctx.runMutation(mutations.createReflection, {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      step: nextStepName,
      userInput: undefined,
      payload: { coach_reflection: opener }
    });
  }
  
  return nextStepName;
}

