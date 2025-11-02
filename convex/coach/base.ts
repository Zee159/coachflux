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
  updateSession: any; // Phase 2: OPTIONS state tracking
  pauseSession: any;
}

/**
 * Queries interface - passed by caller to avoid importing api in base.ts
 * 
 * NOTE: Using 'any' here is a documented workaround for Convex's deep type recursion.
 * This is whitelisted in scripts/safety-check.js
 */
export interface CoachQueries {
  getSessionActions: any;
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
 * Replace dynamic value placeholders in prompts with actual captured data
 * Fixes Issue #2: Makes prompts personalized by substituting {initial_confidence}, etc.
 * 
 * @param prompt - The prompt text with placeholders like {initial_confidence}
 * @param reflections - All reflections to extract values from
 * @returns Prompt with placeholders replaced by actual values
 */
export function replaceDynamicValues(
  prompt: string,
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): string {
  // Aggregate all captured data from reflections
  const allData: Record<string, unknown> = {};
  
  for (const reflection of reflections) {
    Object.assign(allData, reflection.payload);
  }
  
  let result = prompt;
  
  // Replace numeric placeholders
  const numericFields = [
    'initial_confidence', 
    'current_confidence', 
    'final_confidence',
    'initial_action_clarity', 
    'final_action_clarity', 
    'user_satisfaction',
    'action_commitment_confidence',
    'commitment_confidence'
  ];
  
  for (const field of numericFields) {
    const value = allData[field];
    if (typeof value === 'number') {
      const regex = new RegExp(`\\{${field}\\}`, 'g');
      result = result.replace(regex, String(value));
    }
  }
  
  // Replace string placeholders
  const stringFields = [
    'initial_mindset_state',
    'final_mindset_state',
    'change_description',
    'committed_action',
    'action_day',
    'action_time',
    'support_person'
  ];
  
  for (const field of stringFields) {
    const value = allData[field];
    if (typeof value === 'string' && value.length > 0) {
      const regex = new RegExp(`\\{${field}\\}`, 'g');
      result = result.replace(regex, value);
    }
  }
  
  // Calculate and replace derived values
  const initial = allData['initial_confidence'] as number | undefined;
  const final = allData['final_confidence'] as number | undefined;
  const current = allData['current_confidence'] as number | undefined;
  
  if (typeof initial === 'number' && typeof final === 'number') {
    const increase = final - initial;
    result = result.replace(/\{increase\}/g, String(increase));
    result = result.replace(/\{confidence_increase\}/g, String(increase));
  }
  
  if (typeof initial === 'number' && typeof current === 'number') {
    const increase = current - initial;
    result = result.replace(/\{ownership_increase\}/g, String(increase));
  }
  
  return result;
}

/**
 * Aggregate captured state from reflections (AGENT MODE)
 * FIXED: Now merges ALL reflections for current step, not just the latest one
 * This prevents fields from disappearing when AI extracts new fields in subsequent turns
 */
export function aggregateStepState(
  reflections: Array<{ step: string; payload: ReflectionPayload }>,
  currentStep: string,
  requiredFields: string[]
): StepState {
  // Get ALL reflections for current step
  const currentStepReflections = reflections.filter(r => r.step === currentStep);
  
  if (currentStepReflections.length === 0) {
    return {
      capturedState: {},
      missingFields: requiredFields,
      capturedFields: [],
      completionPercentage: 0
    };
  }
  
  // CRITICAL FIX: Merge ALL reflections, not just the latest one
  // This prevents fields from disappearing across turns
  const capturedState: Record<string, unknown> = {};
  
  // Loop through ALL reflections and merge fields
  for (const reflection of currentStepReflections) {
    const payload = reflection.payload;
    
    for (const [key, value] of Object.entries(payload)) {
      // Skip coach_reflection (not a data field)
      if (key === 'coach_reflection') {
        continue;
      }
      
      // Check if field has meaningful content
      const isMeaningful = 
        (typeof value === 'string' && value.length > 0) ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'number') ||
        (typeof value === 'boolean');
      
      if (isMeaningful) {
        // For arrays, merge with existing values (avoid duplicates)
        if (Array.isArray(value) && Array.isArray(capturedState[key])) {
          const existing = capturedState[key] as unknown[];
          // Type-safe array merging: filter out items that already exist
          const newItems: unknown[] = value.filter((item: unknown) => {
            return !existing.some((existingItem: unknown) => {
              // Deep equality check for primitive values
              return JSON.stringify(existingItem) === JSON.stringify(item);
            });
          });
          capturedState[key] = [...existing, ...newItems];
        } 
        // For strings, prefer the most recent non-empty value
        else if (typeof value === 'string' && value.length > 0) {
          capturedState[key] = value;
        }
        // For other types, use the value if not already set
        else if (capturedState[key] === undefined) {
          capturedState[key] = value;
        }
      }
    }
  }
  
  // Determine which required fields are captured
  const capturedFields: string[] = [];
  for (const field of requiredFields) {
    const value = capturedState[field];
    const isCaptured = 
      (typeof value === 'string' && value.length > 0) ||
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'number') ||
      (typeof value === 'boolean');
    
    if (isCaptured) {
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
  
  // Strip validation constraints from schema before showing to AI
  // This prevents the AI from trying to meet minLength/maxLength requirements
  // which can cause unnatural responses or validation failures
  const strippedSchema = stripValidationConstraints(step.required_fields_schema) as Record<string, unknown>;
  
  // Phase 3: Use prompt caching to reduce costs by 90% on cached content
  // System prompt is cached across requests, saving ~2.5K tokens per message
  const primary = await client.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 800, // Increased from 600 to give more room for JSON generation
    temperature: 0.3, // Slightly increased from 0 to allow more flexibility
    system: [
      {
        type: "text",
        text: system + safetyAlerts + aiContext + "\n\nYou MUST respond with valid JSON only. No other text.",
        cache_control: { type: "ephemeral" } // Cache this for 5 minutes
      }
    ],
    messages: [
      { 
        role: "user", 
        content: `Schema:\n${JSON.stringify(strippedSchema, null, 2)}\n\n${user}\n\nRespond with ONLY valid JSON matching the schema.`
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
    console.error("=== PRIMARY JSON PARSE ERROR ===");
    console.error("Error:", error);
    console.error("Raw AI response:", raw);
    console.error("Step:", step.name);
    console.error("User input:", userTurn);
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
    model: "claude-3-7-sonnet-20250219",
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
 * Phase 2: Pre-validate AI response before sending to user
 * Catches structural errors early and prevents bad data from reaching users
 */
export function preValidateResponse(
  payload: ReflectionPayload,
  stepName: string,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[]; errors: string[] } {
  const errors: string[] = [];
  const missingFields: string[] = [];

  // Check for coach_reflection (required for all steps)
  const coachReflection = payload["coach_reflection"];
  if (coachReflection === undefined || coachReflection === null || typeof coachReflection !== 'string') {
    errors.push("Missing or invalid coach_reflection");
  } else if (coachReflection.length < 20) {
    errors.push("coach_reflection too short (min 20 characters)");
  }

  // Check required fields for this step
  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null) {
      missingFields.push(field);
    }
  }

  // OPTIONS-specific validation for GROW framework
  if (stepName === 'options') {
    const options = payload["options"] as Array<{
      label?: string;
      pros?: unknown[];
      cons?: unknown[];
      feasibilityScore?: number;
      effortRequired?: string;
    }> | undefined;

    if (Array.isArray(options)) {
      // Validate AI-generated options have required quality fields
      options.forEach((opt, idx) => {
        const isAIGenerated = opt.feasibilityScore !== undefined || opt.effortRequired !== undefined;
        
        if (isAIGenerated) {
          // AI options MUST have both feasibilityScore AND effortRequired
          if (opt.feasibilityScore === undefined) {
            errors.push(`Option ${idx + 1}: AI-generated option missing feasibilityScore`);
          } else if (opt.feasibilityScore < 1 || opt.feasibilityScore > 10) {
            errors.push(`Option ${idx + 1}: feasibilityScore must be 1-10, got ${opt.feasibilityScore}`);
          }

          if (opt.effortRequired === undefined) {
            errors.push(`Option ${idx + 1}: AI-generated option missing effortRequired`);
          } else if (!['low', 'medium', 'high'].includes(opt.effortRequired)) {
            errors.push(`Option ${idx + 1}: effortRequired must be low/medium/high, got ${opt.effortRequired}`);
          }
        }

        // All options need label, pros, and cons
        if (opt.label === undefined || opt.label === null || opt.label.length === 0) {
          errors.push(`Option ${idx + 1}: missing label`);
        }
        if (!Array.isArray(opt.pros)) {
          errors.push(`Option ${idx + 1}: pros must be an array`);
        }
        if (!Array.isArray(opt.cons)) {
          errors.push(`Option ${idx + 1}: cons must be an array`);
        }
      });
    }
  }

  // WILL-specific validation for GROW framework
  if (stepName === 'will') {
    const actions = payload["actions"] as Array<{
      action?: string;  // GROW uses 'action' field
      title?: string;   // COMPASS uses 'title' field
      owner?: string;
      due_days?: number;
      support_needed?: string;
      accountability_mechanism?: string;
    }> | undefined;

    if (Array.isArray(actions)) {
      actions.forEach((action, idx) => {
        // Check 5 core fields (GROW uses 'action' field, not 'title')
        const actionText = action.action ?? action.title;
        if (actionText === undefined || actionText === null || actionText.length === 0) {
          errors.push(`Action ${idx + 1}: missing action text`);
        }
        if (action.owner === undefined || action.owner === null || action.owner.length === 0) {
          errors.push(`Action ${idx + 1}: missing owner`);
        }
        if (typeof action.due_days !== 'number' || action.due_days <= 0) {
          errors.push(`Action ${idx + 1}: due_days must be a positive number`);
        }
        if (action.support_needed === undefined || action.support_needed === null || action.support_needed.length === 0) {
          errors.push(`Action ${idx + 1}: missing support_needed`);
        }
        if (action.accountability_mechanism === undefined || action.accountability_mechanism === null || action.accountability_mechanism.length === 0) {
          errors.push(`Action ${idx + 1}: missing accountability_mechanism`);
        }
      });
    }
  }

  const isValid = errors.length === 0 && missingFields.length === 0;
  return { isValid, missingFields, errors };
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
 * Includes deduplication logic to prevent creating duplicate actions for the same session
 */
export async function createActionsFromPayload(
  ctx: CoachContext,
  mutations: CoachMutations,
  queries: CoachQueries,
  step: { name: string },
  payload: ReflectionPayload,
  args: { orgId: Id<"orgs">; userId: Id<"users">; sessionId: Id<"sessions"> }
): Promise<void> {
  const actions = payload["actions"];
  const nextActions = payload["next_actions"];
  
  // Check if actions already exist for this session to prevent duplicates
  const existingActions = await ctx.runQuery(queries.getSessionActions, {
    sessionId: args.sessionId
  }) as Array<{ title: string }>;
  
  // GROW Framework: Create actions from "will" step
  if (step.name === "will" && Array.isArray(actions)) {
    // eslint-disable-next-line no-console
    console.log('[CREATE ACTIONS] Processing', actions.length, 'actions from Will step');
    
    for (const a of actions) {
      // eslint-disable-next-line no-console
      console.log('[CREATE ACTIONS] Action object:', JSON.stringify(a));
      
      const action = a as Record<string, unknown>;
      
      // Extract title from action field (GROW uses "action" field, not "title")
      const title = typeof action['action'] === 'string' ? action['action'] : '';
      
      // eslint-disable-next-line no-console
      console.log('[CREATE ACTIONS] Extracted title:', title);
      
      if (title.length === 0) {
        console.warn('[CREATE ACTIONS] Skipping action with empty title');
        continue; // Skip invalid actions
      }
      
      // Check if this action already exists (by title)
      const isDuplicate = existingActions.some(
        (existing: { title: string }) => existing.title === title
      );
      
      if (isDuplicate) {
        // eslint-disable-next-line no-console
        console.log('[CREATE ACTIONS] Skipping duplicate action:', title);
        continue;
      }
      
      const dueDays = typeof action['due_days'] === 'number' ? action['due_days'] : 0;
      const due = dueDays > 0 ? Date.now() + dueDays * 86400000 : undefined;
      
      // eslint-disable-next-line no-console
      console.log('[CREATE ACTIONS] Creating action:', { title, dueDays, due });
      
      await ctx.runMutation(mutations.createAction, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        title: title,
        dueAt: due,
        status: "open"
      });
    }
  }
  
  // COMPASS Framework: Create actions from "review" step
  if (step.name === "review" && Array.isArray(nextActions)) {
    for (const actionTitle of nextActions) {
      if (typeof actionTitle === 'string' && actionTitle.length > 0) {
        // Check if this action already exists (by title)
        const isDuplicate = existingActions.some(
          (existing: { title: string }) => existing.title === actionTitle
        );
        
        if (isDuplicate === false) {
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
  args: { orgId: Id<"orgs">; userId: Id<"users">; sessionId: Id<"sessions"> },
  reflections?: Array<{ step: string; payload: Record<string, unknown> }>
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
  let opener = openers[nextStepName];
  
  // COMPASS: Replace [X] placeholder in ownership opener with actual initial_confidence
  if (opener !== undefined && nextStepName === 'ownership' && reflections !== undefined) {
    const introReflections = reflections.filter(r => r.step === 'introduction');
    const latestIntro = introReflections[introReflections.length - 1];
    const initialConfidence = latestIntro?.payload?.['initial_confidence'];
    
    console.log('🔍 Opener replacement debug:', {
      hasOpener: opener !== undefined,
      openerText: opener,
      hasReflections: reflections !== undefined,
      introReflectionsCount: introReflections.length,
      latestIntroPayload: latestIntro?.payload,
      initialConfidence,
      hasPlaceholder: opener?.includes('[X]')
    });
    
    if (typeof initialConfidence === 'number' && opener.includes('[X]')) {
      opener = opener.replace('[X]', String(initialConfidence));
      console.log('✅ Replaced [X] with', initialConfidence, '→', opener);
    } else {
      console.warn('⚠️ Could not replace [X]:', {
        isNumber: typeof initialConfidence === 'number',
        hasPlaceholder: opener.includes('[X]'),
        initialConfidence
      });
    }
  }
  
  // 🔧 FIX: Only create opener reflection if it's not empty
  if (opener !== undefined && opener.length > 0) {
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

