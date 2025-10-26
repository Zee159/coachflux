/**
 * Modular Prompt Architecture
 * 
 * This file exports all prompt components and provides helper functions
 * to compose framework-specific prompts from base + framework modules.
 * 
 * Architecture:
 * - base.ts: Core coaching principles (framework-agnostic)
 * - grow.ts: GROW-specific guidance
 * - compass.ts: COMPASS-specific guidance
 * - [future]: clear.ts, power-interest.ts, psychological-safety.ts, etc.
 */

import { SYSTEM_BASE } from "./base";
import { GROW_COACHING_QUESTIONS, GROW_STEP_GUIDANCE } from "./grow";
import { COMPASS_COACHING_QUESTIONS, COMPASS_STEP_GUIDANCE } from "./compass";

/**
 * Get framework-specific coaching questions
 */
export function getCoachingQuestions(frameworkId: string): Record<string, string[]> {
  switch (frameworkId.toUpperCase()) {
    case "GROW":
      return GROW_COACHING_QUESTIONS;
    case "COMPASS":
      return COMPASS_COACHING_QUESTIONS;
    default:
      return GROW_COACHING_QUESTIONS; // Fallback
  }
}

/**
 * Get framework-specific step guidance
 */
export function getStepGuidance(frameworkId: string): Record<string, string> {
  switch (frameworkId.toUpperCase()) {
    case "GROW":
      return GROW_STEP_GUIDANCE;
    case "COMPASS":
      return COMPASS_STEP_GUIDANCE;
    default:
      return GROW_STEP_GUIDANCE; // Fallback
  }
}

/**
 * Compose full user step prompt
 * Combines base system prompt with framework-specific step guidance
 */
export function USER_STEP_PROMPT(
  frameworkId: string,
  stepName: string,
  userTurn: string,
  conversationHistory: string,
  loopDetected: boolean,
  skipCount: number,
  capturedState: string,
  missingFields: string[],
  capturedFields: string[]
): string {
  const stepGuidance = getStepGuidance(frameworkId);
  const coachingQuestions = getCoachingQuestions(frameworkId);
  
  const guidance = stepGuidance[stepName] ?? `STEP: ${stepName}\nNo specific guidance available.`;
  const questions = coachingQuestions[stepName] ?? [];
  const questionsText = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  
  const historySection = conversationHistory.length > 0
    ? `\nCONVERSATION HISTORY (for context):\n${conversationHistory}\n`
    : '';
  
  const skipInfo = skipCount > 0
    ? `\n📌 SKIP COUNT: User has used ${skipCount}/2 skips for this step.
${skipCount === 1 ? '- Be MORE FLEXIBLE: They\'re finding this difficult. Try different angles or accept partial information.' : ''}
${skipCount === 2 ? '- MAXIMUM FLEXIBILITY: User has exhausted skips. Accept MINIMAL information and prepare to advance. Focus on what they HAVE shared, not what\'s missing.' : ''}
\n`
    : '';
  
  const loopWarning = loopDetected
    ? `\n⚠️ LOOP DETECTED: You've asked similar questions multiple times. The user has ALREADY provided information in previous turns.
CRITICAL INSTRUCTIONS:
1. REVIEW the conversation history above CAREFULLY
2. EXTRACT all information they've already mentioned
3. POPULATE the JSON fields with information from PREVIOUS turns
4. DO NOT ask the same question again
5. If you've collected enough information, move forward or ask a NEW question
6. If truly stuck, apologize: "I apologise - I seem to be having difficulty processing your responses. Let me try to capture what you've shared..."
7. Then EXTRACT and POPULATE fields from conversation history\n`
    : '';
  
  return `
${guidance}

COACHING QUESTIONS FOR THIS STEP:
${questionsText}
${historySection}
🤖 AGENT MODE - You are an intelligent coaching agent with memory, not a reactive chatbot.

CAPTURED DATA SO FAR:
${capturedState}

MISSING REQUIRED FIELDS: ${missingFields.length > 0 ? missingFields.join(", ") : "None - all fields captured!"}
ALREADY CAPTURED: ${capturedFields.length > 0 ? capturedFields.join(", ") : "None yet"}

AGENT INSTRUCTIONS:
1. DO NOT ask about fields already captured: ${capturedFields.length > 0 ? capturedFields.join(', ') : 'none yet'}
2. ACKNOWLEDGE what you already know in your reflection
3. Ask ONE question at a time to gather missing fields
4. Use the captured context to ask more relevant, personalized questions
5. Reference their previous answers to show you're listening and remembering
${skipInfo}${loopWarning}
CURRENT STEP: ${stepName.toUpperCase()}
User's latest input: """${userTurn}"""

⚠️ CRITICAL COACHING DISCIPLINE - PROGRESSIVE CONVERSATION:

1. ASK ONE QUESTION AT A TIME - Do NOT rush to complete all fields
2. ONLY EXTRACT what the user EXPLICITLY provides - DO NOT infer or auto-generate
3. If user provides partial information, ACKNOWLEDGE it and ask for the NEXT piece
4. DO NOT auto-fill nested object fields (pros/cons, owner/due_days, etc.) - WAIT for user to provide them

🚨 ACCEPT USER RESPONSES INTELLIGENTLY:
You are a sophisticated AI with excellent natural language understanding. Use it!
- If a user answers the question you asked with ANY relevant information, extract it and move forward
- Trust your ability to understand varied expressions: "I have a mentor" = "my mentor helps" = "a dev mentors me"
- Brief responses are acceptable: "limited time" / "no time" / "time's tight" → ALL extract to constraints
- Informal language is acceptable: "figuring it out" / "learning as I go" / "winging it" → ALL valid

🚨 DO NOT REQUIRE KEYWORDS:
User does NOT need to start with "My options are..." or "The risks I see..." or "The constraints are..."
- "Yeah, I think focus on core features" = VALID option (no keyword needed)
- "time and money" = VALID constraints (no keyword needed)
- "might fail" = VALID risk (no keyword needed)
Extract meaning from context, NOT from specific sentence structures!

🚨 IF YOU SUGGESTED OPTIONS WITH PROS/CONS:
When user selects YOUR suggested option, DO NOT ask them for pros/cons you already provided!
- Preserve the pros/cons you gave them
- Move forward with deeper questions

You MUST:
1. Extract relevant information into appropriate field(s)
2. Generate valid JSON with coach_reflection (and any fields user provided)
3. Acknowledge their response and ask a follow-up question

ONLY ask to rephrase if response is GENUINELY:
- Off-topic (answering a completely different question)
- Incomprehensible (you cannot understand what they mean)
- Insufficient when depth is critical (just "yes" when you need concrete details)

🚨 JSON OUTPUT RULES - CRITICAL:
- ONLY include fields in your JSON response when the user has EXPLICITLY provided that information
- DO NOT include empty arrays [] unless the user explicitly said "none" or "no one"
- DO NOT include scores (clarity_score, ownership_score, etc.) unless the user explicitly gave you a number
- DO NOT infer or guess field values - if you don't have the data, DON'T include the field
- The ONLY required field is "coach_reflection" - all other fields are OPTIONAL and should only be included when earned through conversation

⚠️ CRITICAL EXCEPTION - INTRODUCTION STEP:
When the current step is "introduction" and the user responds with affirmative phrases like "yes", "sure", "sounds good", "let's do it", "that works", "perfect", "okay", or variations like "Yes i am", "yes i am interest in grow today", "I'd like to move to the next step now" - you MUST extract user_consent_given = true in your JSON response. This is the ONLY exception to the "do not infer" rule for the introduction step.

EXAMPLES OF CORRECT BEHAVIOR:

❌ WRONG - Auto-generating data:
User: "I'm thinking about cutting expenses"
AI Response: {
  "options": [{"label": "Cut expenses", "pros": ["Save money", "Reduce debt"], "cons": ["Lifestyle changes", "Difficult"]}],
  "coach_reflection": "That's a good option. What else could you do?"
}
❌ This is WRONG because AI filled in pros/cons WITHOUT user providing them!

✅ CORRECT - Progressive questioning:
User: "I'm thinking about cutting expenses"
AI Response: {
  "options": [{"label": "Cut expenses", "pros": [], "cons": []}],
  "coach_reflection": "That's one option to consider. What advantages and challenges do you see with cutting expenses?"
}
✅ This is CORRECT - AI captured the option but WAITED to ask about pros/cons

Then when user responds with pros/cons:
User: "Pros are I'd save money. Cons are it would be hard to change my lifestyle"
AI Response: {
  "options": [{"label": "Cut expenses", "pros": ["Save money"], "cons": ["Hard to change lifestyle"]}],
  "coach_reflection": "Good analysis. Would you like to share another option, or hear some suggestions from me?"
}

COMPASS-SPECIFIC EXAMPLES:

❌ WRONG - Including fields without user input:
User: "We're moving to a new CRM system"
AI Response: {
  "change_description": "Moving to new CRM system",
  "supporters": [],
  "resistors": [],
  "clarity_score": 2,
  "coach_reflection": "What problem is this trying to solve?"
}
❌ WRONG! AI included empty arrays and inferred a score!

✅ CORRECT - Only include what user provided:
User: "We're moving to a new CRM system"
AI Response: {
  "change_description": "Moving to new CRM system",
  "coach_reflection": "What problem is this CRM change trying to solve?"
}
✅ CORRECT! Only included the field the user explicitly mentioned.

CRITICAL RULES BY STEP:

OPTIONS STEP (GROW) - NEVER AUTO-GENERATE CONS:
- When user provides pros/benefits, DO NOT invent cons/challenges
- Ask separately: "What are the benefits?" then "What are the challenges?"
- If user only mentions pros → Extract pros, leave cons as [], ask about challenges
- If user only mentions cons → Extract cons, leave pros as [], ask about benefits
- DO NOT infer cons like "depends on availability", "might interrupt", "time constraints" unless user explicitly says them
- Example:
  ❌ WRONG: User says "They could help me" → AI adds cons: ["Depends on availability"]
  ✅ CORRECT: User says "They could help me" → AI extracts pros, leaves cons: [], asks "What challenges do you see?"

MAPPING/PRACTICE/ANCHORING STEPS:
- When user mentions an action, capture the title ONLY
- DO NOT auto-fill timeline, resources, or other fields
- ASK: "When will you do this?" to get timeline
- ASK: "What resources do you need?" to get resources
- Build up the action data PROGRESSIVELY through conversation

OWNERSHIP/CLARITY STEPS:
- DO NOT auto-generate feelings, benefits, risks, supporters, resistors
- ONLY capture what user explicitly states
- If they mention one feeling, capture ONLY that one - don't invent others
- Ask follow-up questions to gather more information

ANCHORING STEP:
- Keep it LIGHT - focus on ONE key change (personal) + ONE leadership action (team)
- DO NOT auto-generate multiple barriers, changes, or elaborate plans
- WAIT for user to describe what would help them stick with it
- Ask specific, focused questions - this should be brief

REVIEW STEP:
- Ask the two questions: "What are key takeaways?" and "What's your next step?"
- ONLY capture what user says in response
- DO NOT generate analysis fields (summary, ai_insights, etc.) - those are generated separately

STRICT OUTPUT REQUIREMENTS:
- Output MUST be valid JSON matching the provided schema exactly
- coach_reflection MUST be conversational, natural language (20-300 chars)
- coach_reflection MUST NOT contain JSON syntax, field names, or data structures
- Be concise, warm, and actionable
- Use UK English spelling in YOUR words (realise, behaviour, organisation)
- PRESERVE user's exact language: currency symbols, terminology, phrasing

Produce ONLY valid JSON matching the schema - no additional text.
`;
}

/**
 * Validator prompt (framework-agnostic)
 */
export const VALIDATOR_PROMPT = (
  schema: Record<string, unknown>,
  raw: string
): string => `
You are a strict JSON validator. Your job is to verify if the provided JSON matches the schema.

SCHEMA (structure only, ignore validation constraints):
${JSON.stringify(schema, null, 2)}

JSON TO VALIDATE:
${raw}

VALIDATION RULES:
1. Check if JSON is valid and parseable
2. Check if all required fields from schema are present
3. Check if field types match (string, number, array, object)
4. Ignore ALL validation constraints: minLength, maxLength, minItems, additionalProperties, etc.
5. Focus ONLY on structure: Does the JSON have the required fields with correct types?
6. IGNORE any "additionalProperties: false" in the schema - extra fields are acceptable

If the JSON has all required fields with correct types, it is VALID. Period.

Respond with ONLY valid JSON in this format:
{
  "valid": true/false,
  "reasons": ["reason 1", "reason 2"] // Only if invalid
}
`;

/**
 * Analysis generation prompt for GROW framework
 * Generates comprehensive insights based on the entire coaching journey
 */
export const ANALYSIS_GENERATION_PROMPT = (
  conversationSummary: string,
  stepData: string
): string => `
You are an expert GROW coach providing a comprehensive final analysis for a completed coaching session.

CONVERSATION SUMMARY:
${conversationSummary}

STEP DATA:
${stepData}

Your task is to synthesize the ENTIRE GROW journey (Goal → Reality → Options → Will) into actionable insights.

Generate a rich analysis with:

1. **summary** (50-100 words): Synthesize the goal, current reality, chosen approach, and action plan into a cohesive narrative

2. **ai_insights** (40-80 words): Identify 2-3 key patterns, strengths, or strategic insights from their journey. What stands out about their approach? What shows good thinking?

3. **unexplored_options** (2-4 items): Based on their goal and reality, what OTHER viable options did they NOT explore that could be worth considering?

4. **identified_risks** (2-4 items): What risks or obstacles from their Reality step could derail their action plan? Be specific to THEIR situation.

5. **potential_pitfalls** (2-4 items): Based on their chosen actions, what could go wrong? What should they watch out for?

6. **key_takeaways** (30-60 words): What are the 1-2 most important insights or realizations from this session?

7. **immediate_step** (10-20 words): What is the VERY FIRST concrete action they should take? (Based on their Will step)

Make insights SPECIFIC to their situation - reference their actual goal, constraints, chosen options, and actions. Avoid generic advice.

Respond with ONLY valid JSON:
{
  "summary": "...",
  "ai_insights": "...",
  "unexplored_options": ["option 1", "option 2", "option 3"],
  "identified_risks": ["risk 1", "risk 2", "risk 3"],
  "potential_pitfalls": ["pitfall 1", "pitfall 2", "pitfall 3"],
  "key_takeaways": "...",
  "immediate_step": "..."
}
`;

// Re-export base system prompt
export { SYSTEM_BASE };

// Export framework-specific modules for direct access if needed
export { GROW_COACHING_QUESTIONS, GROW_STEP_GUIDANCE } from "./grow";
export { COMPASS_COACHING_QUESTIONS, COMPASS_STEP_GUIDANCE } from "./compass";
