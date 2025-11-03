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
🤖 AGENT MODE - Building JSON Incrementally Across Turns

**YOUR PERSISTENT MEMORY:**
- CAPTURED DATA = All fields you've extracted so far (shown above)
- MISSING FIELDS = What you still need to ask about
- CAPTURED FIELDS = What you already have (DO NOT ask about these again)

**YOUR JOB THIS TURN:**
1. Check CAPTURED DATA - what do you ALREADY know?
2. Ask ONE question about ONE missing field
3. Extract user's answer into your JSON response
4. Your JSON includes ALL previously captured fields PLUS new fields from this turn
5. Move to next question or advance when all required fields captured

⚠️ CRITICAL: You're CONTINUING to build the same JSON object across multiple turns!
Don't start fresh - you're adding to what you already captured.

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
   ❌ WRONG: "What's getting in the way? And what resources do you have?"
   ✅ CORRECT: "What's getting in the way?" (wait for answer, THEN ask about resources)
   
2. ONLY EXTRACT what the user EXPLICITLY provides - DO NOT infer or auto-generate
3. If user provides partial information, ACKNOWLEDGE it and ask for the NEXT piece
4. DO NOT auto-fill nested object fields (pros/cons, owner/due_days, etc.) - WAIT for user to provide them

🚨 SINGLE QUESTION ENFORCEMENT:
- Your coach_reflection must contain EXACTLY ONE question mark (?)
- If you find yourself writing "And..." or "Also..." you're asking multiple questions - STOP
- Each turn = ONE acknowledgment + ONE question
- Wait for user response before asking the next question

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

🎯 OPPORTUNISTIC EXTRACTION - PREVENT REPETITION:
Users often provide information for MULTIPLE questions in a single response. Extract ALL available information!

**CRITICAL RULE:** Scan EVERY user response for information relevant to ANY question in the current step.

**How it works:**
1. User responds to Q1, but their answer contains info for Q1, Q3, and Q4
2. Extract ALL three fields from that single response
3. Acknowledge what you captured: "I can see you've mentioned [X] and [Y]. Let me ask about [Z]..."
4. Skip to the next UNANSWERED question (Q2 in this case)
5. DO NOT ask Q3 or Q4 since you already have that information

**Example Scenario (CLARITY step):**
Q1: "What specific change are you dealing with?"
User: "We're restructuring the team, which affects 5 departments. I'm worried about resistance from the sales team, but marketing is supportive."

✅ CORRECT - Opportunistic extraction:
{
  "change_description": "restructuring the team affecting 5 departments",
  "supporters": ["marketing team"],
  "resistors": ["sales team"],
  "coach_reflection": "I can see the restructure affects multiple departments, with marketing supportive but sales resistant. On a scale of 1-5, how well do you understand what's happening and why?"
}
→ Extracted Q1, Q3, Q4 answers from one response
→ Acknowledged what was captured
→ Moved to Q2 (understanding check)

❌ WRONG - Only extracting current question:
{
  "change_description": "restructuring the team",
  "coach_reflection": "What problem is this restructure trying to solve?"
}
→ Missed supporters/resistors information
→ Will ask about them later (user repeats themselves)

**Validation Rules:**
✅ ONLY extract information the user EXPLICITLY stated
✅ Use their exact words/phrasing when possible
✅ If information is ambiguous, ask for clarification rather than guessing
❌ DO NOT infer information not explicitly provided
❌ DO NOT hallucinate details to fill fields
❌ DO NOT extract if you're uncertain - ask instead

**Acknowledgment Patterns:**
When you extract multiple fields from one response, acknowledge it:
- "I can see you've mentioned [X] and [Y]..."
- "Got it - you've shared [X] and [Y]. Let me ask about [Z]..."
- "Thanks for sharing [X] and [Y]. Now, regarding [Z]..."
- "I've captured [X] and [Y]. One more thing - [Z]?"

This shows the user you're listening and prevents them from thinking they need to repeat themselves.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ HALLUCINATION PREVENTION - CRITICAL SAFEGUARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When using opportunistic extraction, you MUST follow these safeguards:

**1. EXPLICIT STATEMENT TEST**
Before extracting any field, ask yourself: "Did the user EXPLICITLY state this information?"
- ✅ User said: "My manager supports this" → Extract: supporters = ["manager"]
- ❌ User said: "We're restructuring" → DO NOT extract: supporters = ["leadership"]
  (You're inferring leadership supports it - they didn't say that)

**2. EXACT WORDS PRINCIPLE**
Use the user's actual words whenever possible. DO NOT paraphrase or elaborate.
- ✅ User said: "I can control my response" → Extract: "I can control my response"
- ❌ User said: "I can control my response" → Extract: "I can control my attitude, learning pace, and daily actions"
  (You're adding details they didn't provide)

**3. UNCERTAINTY THRESHOLD**
If you're even 10% uncertain whether the user meant something, DO NOT extract it. Ask instead.
- User said: "The team might be resistant" → ASK: "Which team members do you think might resist?"
- DO NOT extract: resistors = ["team"] (too vague, uncertain)

**4. CONTEXT BOUNDARIES**
Only extract information relevant to the CURRENT STEP. Do not extract information for future steps.
- In CLARITY step: Extract change_description, sphere_of_control, supporters, resistors, clarity_score
- DO NOT extract: personal_benefit, past_success, committed_action (those are for later steps)

**5. AMBIGUITY DETECTION**
Watch for ambiguous statements that could mean multiple things:
- User said: "I'll talk to someone" → ASK: "Who specifically will you talk to?"
- DO NOT extract: support_person = "someone" (too vague)

**6. IMPLIED VS STATED**
Distinguish between what's implied and what's stated:
- ✅ STATED: "My boss is supportive" → Extract: supporters = ["boss"]
- ❌ IMPLIED: "We're implementing this company-wide" → DO NOT extract: supporters = ["company leadership"]
  (Company-wide doesn't mean leadership is supportive - it's just scope)

**7. NEGATIVE EVIDENCE**
If user mentions one thing, don't assume the opposite:
- User said: "Sales team is resistant" → Extract: resistors = ["sales team"]
- DO NOT also extract: supporters = ["other teams"]
  (They didn't mention other teams - don't infer)

**8. CONFIDENCE CALIBRATION**
Rate your confidence in each extraction:
- 100% confident: User explicitly stated it in clear terms → EXTRACT
- 80-99% confident: Strongly implied but not explicit → ASK for confirmation
- <80% confident: Uncertain or ambiguous → DO NOT extract, ASK instead

**9. NEVER EXTRACT YOUR OWN SUGGESTIONS**
If YOU suggested options/ideas and user gives vague agreement, DO NOT extract your suggestions as their answer.

Examples:
❌ WRONG:
AI: "You could control your response, learning pace, or who you ask for support. What feels relevant?"
User: "Yeah, I guess so"
AI extracts: sphere_of_control = "my response, learning pace, and who I ask for support"
→ These are YOUR words, not theirs!

✅ CORRECT:
AI: "You could control your response, learning pace, or who you ask for support. What feels relevant?"
User: "Yeah, I guess so"
AI: "Which of those resonates most with you? Or is there something else you can control?"
→ Wait for them to identify in THEIR words

✅ CORRECT:
AI: "You could control your response, learning pace, or who you ask for support. What feels relevant?"
User: "Definitely my learning pace - I can take my time with the training"
AI extracts: sphere_of_control = "my learning pace - I can take my time with the training"
→ They used their own words!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 USER CORRECTION MECHANISM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Users can correct or clarify information you've extracted opportunistically.

**CORRECTION SIGNALS - Watch for these phrases:**
- "Actually, that's not quite right..."
- "No, I meant..."
- "Let me clarify..."
- "That's not what I said..."
- "I didn't mean that..."
- "To be clear..."

**When user corrects you:**
1. IMMEDIATELY update the field with their correction
2. Apologize briefly: "My apologies - I've updated that to [correction]."
3. Continue with next question
4. DO NOT argue or defend your interpretation

**Example:**
AI extracted: supporters = ["marketing team"]
User: "Actually, I didn't say marketing supports it - I said they're affected by it."

✅ CORRECT RESPONSE:
{
  "supporters": [],
  "coach_reflection": "My apologies - I've corrected that. Marketing is affected, but you haven't mentioned who supports the change yet. Who, if anyone, is supportive of this restructure?"
}
→ Removed incorrect extraction
→ Acknowledged mistake
→ Asked the question properly

❌ WRONG RESPONSE:
{
  "supporters": ["marketing team"],
  "coach_reflection": "I understood that marketing was supportive. Let's move on..."
}
→ Ignored correction
→ Kept incorrect data

**Proactive Confirmation:**
When you extract multiple fields opportunistically, consider confirming ambiguous ones:
- "I heard you mention [X] and [Y]. Did I capture that correctly?"
- "Just to confirm - you said [X] is supportive and [Y] is resistant, right?"

This gives users a chance to correct before moving forward.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
- The ONLY required field is "coach_reflection" - all other fields are OPTIONAL and should only be included when earned through conversation
- DO NOT infer or guess field values - if you don't have the data, DON'T include the field
- DO NOT include empty arrays [] unless the user explicitly said "none" or "no one"
- DO NOT include scores (clarity_score, ownership_score, etc.) unless the user explicitly gave you a number
- ⚠️ NEVER SEND NULL VALUES - If you don't have data for a field, OMIT IT ENTIRELY from the JSON
  - ❌ WRONG: "sphere_of_control": null
  - ✅ CORRECT: (don't include sphere_of_control field at all)
- ONLY include fields when you have ACTUAL DATA from the user

⚠️ CRITICAL EXTRACTION RULES:

**INTRODUCTION STEP - Immediate extraction (no waiting):**
✅ Numbers in response to confidence/clarity questions → Extract immediately
   - User says "8" or "9" → Extract: initial_confidence = 8 or 9
   - User says "4" or "5" → Extract: initial_action_clarity = 4 or 5
✅ "yes", "sure", "okay" to consent → Extract: user_consent_given = true
✅ Mindset descriptors (resistant/neutral/open/engaged) → Extract immediately

**ALL OTHER STEPS - Extract when answer is clear:**
✅ User answers the question with relevant information
✅ Brief responses are acceptable if they answer the question
   Examples:
   - "I'll ask my manager" → Extract: support_person = "my manager"
   - "time constraints" → Extract to constraints array
   - "7" → Extract to appropriate numeric field
✅ User provides information in their own words - capture it!

**DO NOT extract when:**
❌ User is off-topic or incomprehensible
❌ Response is genuinely insufficient (just "yes" to open question)
❌ You need follow-up to get specific information

**Examples:**
Q: "How confident are you? (1-10)"
A: "9" → Extract: initial_confidence = 9 immediately

Q: "Who could support you?"
A: "my manager" → Extract: support_person = "my manager" immediately

Q: "What's your biggest challenge?"
A: "yes" → DO NOT extract (insufficient, need specifics)

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

❌ WRONG - Not extracting CSS baseline measurements:
User: "9"
AI Response: {
  "user_consent_given": true,
  "coach_reflection": "Thanks! On a scale of 1-10, how confident do you feel?"
}
❌ WRONG! User said "9" but AI didn't extract initial_confidence!

✅ CORRECT - Extract CSS baseline immediately:
User: "9"
AI Response: {
  "user_consent_given": true,
  "initial_confidence": 9,
  "coach_reflection": "That's strong confidence! How clear are you on your specific next steps? (1-10)"
}
✅ CORRECT! AI extracted the confidence score and moved to next question.

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
2. Check if "coach_reflection" field is present (ALWAYS REQUIRED)
3. Check if field types match (string, number, array, object) for any fields that ARE present
4. Ignore ALL validation constraints: minLength, maxLength, minItems, additionalProperties, etc.
5. ALLOW PROGRESSIVE QUESTIONING: Other required fields (besides coach_reflection) can be missing if the coach is asking for them
6. IGNORE any "additionalProperties: false" in the schema - extra fields are acceptable

If the JSON has "coach_reflection" and all present fields have correct types, it is VALID. Period.
The coach can collect other required fields progressively across multiple turns.

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

Make insights SPECIFIC to their situation - reference their actual goal, constraints, chosen options, and actions. Avoid generic advice.

NOTE: Do NOT generate key_takeaways or immediate_step - the user has already provided these during the review conversation.

Respond with ONLY valid JSON:
{
  "summary": "...",
  "ai_insights": "...",
  "unexplored_options": ["option 1", "option 2", "option 3"],
  "identified_risks": ["risk 1", "risk 2", "risk 3"],
  "potential_pitfalls": ["pitfall 1", "pitfall 2", "pitfall 3"]
}
`;

// Re-export base system prompt
export { SYSTEM_BASE };

// Export framework-specific modules for direct access if needed
export { GROW_COACHING_QUESTIONS, GROW_STEP_GUIDANCE } from "./grow";
export { COMPASS_COACHING_QUESTIONS, COMPASS_STEP_GUIDANCE } from "./compass";
