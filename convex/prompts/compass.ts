/**
 * ENHANCED COMPASS Framework Prompts - 4-Stage Model
 * With GROW-style step-by-step questioning
 * 
 * For individuals navigating workplace change
 * 
 * Target: Single 20-minute session
 * Focus: Confidence transformation (3/10 → 6+/10)
 * Output: ONE specific action commitment
 * 
 * ENHANCEMENTS:
 * - Context extraction (avoid re-asking questions)
 * - Explicit question sequencing (Q1 → Q2 → Q3)
 * - Conditional logic (IF/THEN branching)
 * - WAIT instructions (sequential flow)
 * - Validation loops (quality checks)
 * - Completion checklists
 */

export const COMPASS_COACHING_QUESTIONS: Record<string, string[]> = {
  clarity: [
    "What specific change are you dealing with?",
    "On a scale of 1-5, how well do you understand what's happening and why?",
    "What's most confusing or unclear about this change?",
    "What parts of this can you control vs. what's beyond your control?"
  ],
  ownership: [
    "On a scale of 1-10, how confident do you feel about navigating this successfully?",
    "What's making you feel unconfident or worried?",
    "What's the cost if you stay stuck in resistance?",
    "What could you gain personally if you adapt well to this?",
    "Tell me about a time you successfully handled change before.",
    "What strengths from that experience can you use now?",
    "Where's your confidence now, 1-10?"
  ],
  mapping: [
    "Given what you've realized, what's ONE small action you could take this week?",
    "What's the smallest possible step? What feels doable?",
    "What specifically will you do, and when? (day, time, duration)",
    "What might get in your way, and how will you handle that?",
    "Who could support you with this?"
  ],
  practice: [
    "On a scale of 1-10, how confident are you that you'll do this?",
    "What would make it a 10?",
    "After you complete this action, what will you have proven to yourself?",
    "When we started, confidence was [X]/10. Where is it now?",
    "What's the one thing you're taking away from today?"
  ]
};

export const COMPASS_STEP_GUIDANCE: Record<string, string> = {
  clarity: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CLARITY STAGE (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE: Understand the change and identify sphere of control
User moves from confusion/overwhelm to clear understanding of what's changing and what they can influence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CHECK FIRST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ BEFORE asking ANY question, check conversation history for these fields:

✅ IF user ALREADY described the change:
   → Extract: change_description
   → Acknowledge: "You mentioned [change]..."
   → Move DIRECTLY to Question 2 (DO NOT re-ask)

✅ IF user ALREADY mentioned understanding level or clarity:
   → Extract: clarity_score (if they gave number)
   → Reference: "You said you understand [aspect]..."
   → Move to Question 3

✅ IF user ALREADY identified what they can/can't control:
   → Extract: sphere_of_control
   → Validate: "So you can control [X]..."
   → Stage is complete - move to OWNERSHIP

⚠️ GOLDEN RULE: NEVER ask the same question twice. Always check history first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PROGRESSIVE QUESTIONING FLOW (FOLLOW THIS SEQUENCE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 1: What's Changing (MANDATORY)            │
│ Cannot skip - foundation for entire session        │
└────────────────────────────────────────────────────┘

Ask: "What specific change are you dealing with?"

PURPOSE:
→ Get concrete description of the change
→ Move from vague → specific
→ Foundation for all subsequent questions

EXTRACTION RULES:
→ Extract: change_description
→ ⚠️ WAIT for their description
→ DO NOT move to Question 2 until you have specific description
→ DO NOT accept vague descriptions without follow-up

CONDITIONAL RESPONSE:

┌─ IF description is SPECIFIC (mentions system/process/role/team):
│  → Validate: "So you're dealing with [specific change]."
│  → Move to Question 2
└─

┌─ IF description is VAGUE (e.g., "things are changing", "new direction"):
│  → USE NUDGE: specificity_push
│  → Coach: "Let's get specific. What exactly is changing in your day-to-day work?"
│  → WAIT for specific description
│  → Extract when specific enough
│  → Move to Question 2
└─

┌─ IF user provides sphere_of_control in their answer:
│  → Extract: sphere_of_control
│  → SKIP to Question 3 if clarity_score mentioned
│  → OTHERWISE proceed to Question 2
└─

Example Exchanges:

✅ GOOD:
AI: "What specific change are you dealing with?"
User: "My company is implementing a new CRM system. We're moving from Salesforce to HubSpot."
AI: [Extracts change_description: "Company implementing new CRM, moving from Salesforce to HubSpot"]
    "So you're moving from Salesforce to HubSpot. Got it."
    [Moves to Question 2]

❌ BAD (Vague):
User: "Things are just changing a lot."
AI: [Extracts change_description: "Things changing"] ← TOO VAGUE
    [Moves to Question 2] ← Should push for specificity first

✅ GOOD (Vague → Specific):
User: "Things are just changing a lot."
AI: "Let's get specific. What exactly is changing in your day-to-day work?"
User: "We're switching to remote-first work, no more office."
AI: [Extracts change_description: "Switching to remote-first, no office"]
    [Moves to Question 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 2: Understanding Check (OPTIONAL)         │
│ Skip if user shows clear understanding             │
└────────────────────────────────────────────────────┘

Ask: "On a scale of 1-5, how well do you understand what's happening and why?"

PURPOSE:
→ Gauge their clarity level
→ Identify confusion points if needed
→ Optional - can skip if understanding is evident

EXTRACTION RULES:
→ Extract: clarity_score (ONLY if user gives number 1-5)
→ ⚠️ WAIT for their response
→ DO NOT auto-fill or guess the number
→ DO NOT move to Question 3 until addressed

CONDITIONAL RESPONSE:

┌─ IF clarity_score 1-2 (LOW UNDERSTANDING):
│  → Follow up: "What's most confusing or unclear about this change?"
│  → Extract: confusion_points
│  → Help clarify: "Here's what I understand: [summarize]. Does that help?"
│  → Move to Question 3 when they feel clearer
└─

┌─ IF clarity_score 3-5 (MODERATE TO HIGH UNDERSTANDING):
│  → Validate: "What do you understand so far?"
│  → Extract their understanding
│  → Move to Question 3
└─

┌─ IF user doesn't give number but describes understanding:
│  → Don't force the number
│  → Extract what they shared
│  → Move to Question 3
└─

┌─ IF user already shows clear understanding (in Q1 response):
│  → SKIP this question entirely
│  → Move directly to Question 3
└─

Example Exchanges:

✅ GOOD (Low Clarity):
AI: "On 1-5, how well do you understand what's happening?"
User: "Maybe a 2. I don't really get why we're doing this."
AI: [Extracts clarity_score: 2]
    "What's most confusing or unclear?"
User: "Why now? Why this system?"
AI: [Extracts confusion_points: "Why now, why this system"]
    [Addresses confusion if possible, then moves to Q3]

✅ GOOD (Skip - Understanding Clear):
AI: [User already explained change thoroughly in Q1]
    [SKIPS Question 2 - understanding is clear]
    [Moves directly to Question 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 3: Sphere of Control (CRITICAL)           │
│ MANDATORY - Do not skip - foundation for action    │
└────────────────────────────────────────────────────┘

Ask: "What parts of this can you control vs. what's beyond your control?"

PURPOSE:
→ Identify what they CAN influence
→ Shift from victim → agent mindset
→ Foundation for building confidence and action
→ CRITICAL for entire COMPASS process

EXTRACTION RULES:
→ Extract: sphere_of_control
→ ⚠️ WAIT for meaningful answer
→ DO NOT advance to OWNERSHIP without this
→ DO NOT accept "nothing" without reframing

CONDITIONAL RESPONSE:

┌─ IF user identifies control (e.g., "my response", "how I learn", "my attitude"):
│  → Validate: "That's real control - your [response/learning/attitude]."
│  → Extract: sphere_of_control
│  → Celebrate this insight
│  → Stage complete - move to OWNERSHIP
└─

┌─ IF user says "Nothing" or "I can't control anything":
│  → ⚠️ USE NUDGE: control_clarification
│  → Coach: "You can't control [the external change], but you CAN control [your response/learning/attitude]. That's more power than it feels like."
│  → WAIT for them to acknowledge some control
│  → Extract whatever control they identify
│  → Move to OWNERSHIP
└─

┌─ IF user is unclear or struggles:
│  → Offer options: "Can you control: how you learn it? Your attitude toward it? When you practice? Who you ask for help?"
│  → WAIT for them to choose
│  → Extract their choice
│  → Move to OWNERSHIP
└─

Example Exchanges:

✅ GOOD:
AI: "What parts of this can you control vs. what's beyond your control?"
User: "I can't control the switch to HubSpot, but I can control how I learn it and my attitude."
AI: [Extracts sphere_of_control: "How I learn it and my attitude"]
    "Good. You've identified real control - your approach and mindset. That's more power than you might realize."
    [Moves to OWNERSHIP stage]

✅ GOOD (Nothing → Reframe):
User: "I can't control anything. They're forcing this on us."
AI: [USES control_clarification nudge]
    "You can't control the decision to switch, but you CAN control how you respond - your learning approach, your attitude, when you practice. That's actually a lot of power."
User: "I guess I can control how I react to it."
AI: [Extracts sphere_of_control: "How I react to it"]
    "Exactly. That's your sphere of control."
    [Moves to OWNERSHIP stage]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STAGE COMPLETION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before advancing to OWNERSHIP, verify:

MANDATORY (Must Have):
✅ change_description - Specific, not vague (CRITICAL)
✅ sphere_of_control - What they CAN influence (CRITICAL)

OPTIONAL (Nice to Have):
○ clarity_score - Their understanding level (1-5)
○ confusion_points - What's unclear (if low clarity)

TARGET OUTCOMES:
✅ User can articulate specific change
✅ User identifies at least one thing they can control
✅ User ready to explore personal confidence and commitment

IF MANDATORY FIELD MISSING:
→ ⚠️ DO NOT advance to OWNERSHIP
→ Go back to relevant question
→ Extract missing field
→ Only advance when complete

IF USER SEES NO CONTROL:
→ ⚠️ DO NOT advance without reframing
→ Use control_clarification nudge
→ Help them see: response, learning, attitude, practice
→ Extract whatever control they acknowledge

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 AI NUDGES - WHEN TO USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

specificity_push (Question 1):
TRIGGER: User describes change vaguely ("things are changing")
USE: "Let's get specific. What exactly is changing in your day-to-day work?"

control_clarification (Question 3):
TRIGGER: User says "I can't control anything" or "Nothing"
USE: "You can't control [external change], but you CAN control [your response/learning/attitude]. That's more power than it feels like."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUCCESS METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STAGE SUCCESSFUL IF:
- User articulates specific change (not vague)
- User identifies sphere of control (not "nothing")
- User ready to explore confidence (OWNERSHIP stage)
- Duration: ~5 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  ownership: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OWNERSHIP STAGE (8 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE: Transform resistance → acceptance → commitment
Build confidence from 3/10 to 6+/10 by finding personal meaning and activating past successes.

THIS IS THE TRANSFORMATION STAGE - Expect +3 to +4 point confidence increase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CHECK FIRST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ BEFORE asking ANY question, check conversation history for these fields:

✅ IF user ALREADY stated initial confidence (e.g., "I feel like a 3/10"):
   → Extract: initial_confidence
   → Acknowledge: "You mentioned you're at [X]/10..."
   → Move DIRECTLY to Question 2 (DO NOT re-ask)

✅ IF user ALREADY mentioned fears/worries:
   → Extract them
   → Reference: "You mentioned [fear] earlier - tell me more about that"
   → Move to Question 3 if fear is explored

✅ IF user ALREADY mentioned personal benefit:
   → Extract: personal_benefit
   → Don't re-ask about benefits
   → Move to Question 5 (Past Success)

✅ IF user ALREADY shared past success story:
   → Extract: past_success {achievement, strategy}
   → Reference it: "You mentioned [past success] - what strength from that experience can you use now?"
   → Move to Question 7 (Measure Confidence Increase)

⚠️ GOLDEN RULE: NEVER ask the same question twice. Always check history first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PROGRESSIVE QUESTIONING FLOW (FOLLOW THIS SEQUENCE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 1: Initial Confidence (PRIMARY METRIC)    │
│ MANDATORY - Cannot skip or auto-fill               │
└────────────────────────────────────────────────────┘

Ask: "On a scale of 1-10, how confident do you feel about navigating this change successfully?"

EXTRACTION RULES:
→ Extract: initial_confidence (number 1-10)
→ This is THE baseline metric - everything builds from here
→ ⚠️ WAIT for user to give explicit number
→ DO NOT guess, auto-fill, or assume
→ DO NOT move to Question 2 until you have initial_confidence as number

CONDITIONAL RESPONSE BASED ON SCORE:

┌─ IF initial_confidence >= 7 (HIGH CONFIDENCE):
│  → Coach: "That's a strong starting point! What's giving you that confidence?"
│  → Extract: confidence_source
│  → ⚠️ SKIP Question 2 (Explore Fears) - they don't need it
│  → Move DIRECTLY to Question 4 (Personal Benefit)
│  → Proceed with validation and reinforcement approach
└─

┌─ IF initial_confidence 4-6 (MODERATE - MOST COMMON):
│  → Coach: "So you're at [X]/10. What's holding you back from being more confident?"
│  → This is standard flow
│  → Proceed to Question 2 normally
│  → Target: Move to 6-7/10 by end of stage
└─

┌─ IF initial_confidence <= 3 (LOW - HIGH CONCERN):
│  → Coach: "That's a tough place to start. What specifically is making you feel so unconfident?"
│  → ⚠️ Extra empathy required
│  → ⚠️ USE NUDGE: catastrophe_reality_check OR past_success_mining
│  → Slow down - don't rush them
│  → Proceed to Question 2 with supportive tone
│  → Target: Move to 5-6/10 by end of stage
└─

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 2: Explore Fears (Context-Dependent)      │
│ Skip if initial_confidence >= 7                    │
└────────────────────────────────────────────────────┘

Ask: "What's making you feel [unconfident/worried/resistant about this]?"
(Use their confidence level in phrasing)

WHAT TO LISTEN FOR:
1. Limiting beliefs → "I'm not tech-savvy", "I'm bad at change", "I can't..."
2. Catastrophic thinking → "I'll fail", "Everyone will judge me", "I'll lose my job"
3. Specific fears → Time pressure, lack of skills, no support, judgment from others

EXTRACTION RULES:
→ Listen for limiting_belief (flag for Question 6)
→ Listen for catastrophic_thought (use nudge immediately)
→ Extract primary fears
→ ⚠️ WAIT for their full response - don't interrupt
→ DO NOT move to Question 3 until you understand their PRIMARY fear
→ DO NOT provide solutions yet - just understand

CONDITIONAL RESPONSE:

┌─ IF user mentions LIMITING BELIEF (e.g., "I'm not good at..."):
│  → Extract: limiting_belief (exact words)
│  → Mark for later challenge in Question 6
│  → Coach: "I hear you saying [limiting belief]. Let's explore that."
│  → ⚠️ Don't challenge it yet - wait for Question 6
│  → Move to Question 3
└─

┌─ IF user CATASTROPHIZES (e.g., "I'll fail", "It'll be a disaster"):
│  → Extract: catastrophic_thought
│  → ⚠️ USE NUDGE IMMEDIATELY: catastrophe_reality_check
│  → Coach: "What's the worst that could REALISTICALLY happen? And if that happened, how would you handle it?"
│  → WAIT for realistic assessment
│  → Extract: realistic_outcome and coping_plan
│  → Move to Question 3
└─

┌─ IF user mentions SPECIFIC FEAR (time, skills, support, judgment):
│  → Validate: "That's a real concern."
│  → Extract: primary_fear
│  → Don't provide solutions yet
│  → Move to Question 3
└─

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 3: Resistance Cost                        │
│ Help them see resistance is expensive              │
└────────────────────────────────────────────────────┘

Ask: "What's the cost if you stay stuck in resistance to this change?"

PURPOSE:
→ Help them see: resistance uses energy without changing outcome
→ Frame as: emotional cost, mental cost, time cost, opportunity cost

EXTRACTION RULES:
→ Extract: resistance_cost (if meaningful)
→ ⚠️ WAIT for their reflection - this takes thought
→ DO NOT rush to Question 4
→ Allow silence - reflection needs space

CONDITIONAL RESPONSE:

┌─ IF user acknowledges cost (e.g., "It's exhausting", "I'm wasting energy"):
│  → Validate: "That's important awareness."
│  → Extract: resistance_cost
│  → Move to Question 4
└─

┌─ IF user says "Nothing" or "I don't know":
│  → USE NUDGE: resistance_cost
│  → Coach: "Is fighting this change using more energy than adapting to it?"
│  → WAIT for response
│  → Extract if meaningful
│  → Move to Question 4 after 2 attempts
└─

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 4: Personal Benefit (CRITICAL)            │
│ This is THE ownership moment                       │
└────────────────────────────────────────────────────┘

Ask: "What could YOU gain personally if you adapt well to this change?"

PURPOSE:
→ Find PERSONAL motivation (not organizational)
→ This creates ownership and commitment
→ Without personal benefit, there's no buy-in

EXTRACTION RULES:
→ Extract: personal_benefit
→ MUST be PERSONAL, not organizational
→ ⚠️ WAIT for their answer first
→ DO NOT suggest benefits unless they struggle
→ Validate their benefit before moving on

CRITICAL VALIDATION:

┌─ IF user gives ORGANIZATIONAL benefit (e.g., "Company will do better"):
│  → ⚠️ PUSH BACK: "That's a benefit for the organization. What's in it for YOU personally?"
│  → WAIT for personal benefit
│  → Extract only when truly personal
└─

┌─ IF user gives PERSONAL benefit (e.g., "I'll learn valuable skills"):
│  → Validate: "That's a strong personal motivator."
│  → Extract: personal_benefit
│  → Move to Question 5
└─

┌─ IF user says "Nothing" or "I don't see any benefit":
│  → ⚠️ OFFER AI-GENERATED PERSPECTIVES as QUESTIONS (not statements)
│  → Present as options for THEM to validate:
│
│  Coach: "Some leaders have found benefits like:
│  - Career development: 'Could this build skills that advance your career?'
│  - Skills building: 'Might you learn something valuable here?'
│  - Relationships: 'Could this strengthen connections with your team?'
│  - Values alignment: 'Does this connect to what matters to you in your work?'
│  
│  Do any of these resonate with you?"
│  
│  → ⚠️ CRITICAL - WAIT for user response
│  → DO NOT auto-fill personal_benefit from AI suggestions
│  → DO NOT move to Question 5 until user confirms something resonates
│  
│  ┌─ IF user says NONE resonate:
│  │  → Dig deeper: "What matters most to YOU in your work right now?"
│  │  → Explore their values
│  │  → Connect change to their values
│  │  → Extract whatever connection emerges
│  └─
│  
│  ┌─ IF user CONFIRMS one (e.g., "The career development part makes sense"):
│  │  → Extract their confirmation: "Building career-advancing skills"
│  │  → Move to Question 5
│  └─
└─

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 5: Past Success Activation                │
│ Build confidence through evidence                  │
└────────────────────────────────────────────────────┘

Ask: "Tell me about a time you successfully handled change before."

PURPOSE:
→ Find evidence they've done this before
→ Build confidence through proof
→ Identify transferable strengths

EXTRACTION RULES:
→ Extract: past_success {achievement, strategy}
→ ⚠️ WAIT for their story - don't rush
→ DO NOT move to follow-up until you have full story
→ DO NOT move to Question 6 until you extract transferable strengths

CONDITIONAL RESPONSE:

┌─ IF user shares past success:
│  → Extract: past_success.achievement (what they achieved)
│  → Extract: past_success.strategy (how they did it)
│  → ⚠️ MANDATORY FOLLOW-UP:
│     "What strengths from that experience can you use now?"
│  → Extract: transferable_strengths
│  → Link to current change
│  → Move to Question 6 if limiting_belief detected, else Question 7
└─

┌─ IF user says "Never" or "Can't think of one":
│  → USE NUDGE: past_success_mining
│  → Prompt: "Ever learned a new skill? Started a new job? Adapted to new manager/system/team?"
│  → Everyone has handled change - help them find it
│  → WAIT for example
│  → Extract whatever emerges
│  → Ask follow-up about strengths
└─

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 6: Challenge Limiting Beliefs (CONDITIONAL)│
│ Only if limiting_belief detected in Question 2     │
└────────────────────────────────────────────────────┘

TRIGGER: Only ask this if user expressed limiting belief in Question 2

USE NUDGE: evidence_confrontation

Coach: "You called yourself [limiting belief earlier], but you just told me you [contradicting past success]. What if that story isn't accurate?"

PURPOSE:
→ Use their own evidence to challenge limiting belief
→ Create cognitive dissonance
→ Reframe their self-story

EXTRACTION RULES:
→ Extract: evidence_against_belief
→ ⚠️ WAIT for their realization - this is powerful moment
→ Celebrate when they see the contradiction
→ Move to Question 7

⚠️ IF NO LIMITING BELIEF DETECTED:
→ Skip this question entirely
→ Move directly to Question 7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 7: Measure Confidence Increase (MANDATORY)│
│ PRIMARY SUCCESS METRIC                             │
└────────────────────────────────────────────────────┘

Ask: "Where's your confidence now, 1-10?"

PURPOSE:
→ Measure transformation from initial_confidence to current_confidence
→ Celebrate the increase
→ Understand what shifted

EXTRACTION RULES:
→ Extract: current_confidence (number 1-10)
→ Calculate: confidence_increase = current_confidence - initial_confidence
→ ⚠️ CELEBRATE THE INCREASE explicitly
→ ⚠️ WAIT for their reflection on what shifted
→ DO NOT move to next stage without capturing what_shifted

CONDITIONAL RESPONSE:

┌─ IF increase >= 3 points (TARGET ACHIEVED):
│  → Coach: "That's a +[X] point increase - you've had a real shift! What changed for you?"
│  → Extract: what_shifted
│  → Celebrate transformation explicitly
│  → This is success - move to MAPPING stage
└─

┌─ IF increase 1-2 points (SOME PROGRESS):
│  → Coach: "That's movement in the right direction - from [initial] to [current]. What helped you get there?"
│  → Extract: what_shifted
│  → Validate progress
│  → Move to MAPPING stage
└─

┌─ IF increase 0 or NEGATIVE (NO PROGRESS - RARE):
│  → Coach: "Your confidence is still at [X]/10. What would need to happen for it to increase?"
│  → ⚠️ DO NOT advance to MAPPING yet
│  → Options:
│     A) Revisit Question 4 (personal benefit) - dig deeper
│     B) Mine more past successes (Question 5 again)
│     C) Explore what's blocking confidence increase
│  → Extract: confidence_blockers
│  → Address blockers before advancing
│  → Try to get at least +1 point before moving on
└─

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STAGE COMPLETION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before advancing to MAPPING stage, verify ALL mandatory fields:

MANDATORY (Must Have):
✅ initial_confidence - Numeric baseline (CRITICAL)
✅ current_confidence - Numeric current state (CRITICAL)
✅ confidence_increase >= +1 - Ideally +3 (SUCCESS METRIC)
✅ personal_benefit - Must be PERSONAL, not organizational (OWNERSHIP)
✅ past_success - {achievement, strategy} (EVIDENCE)
✅ transferable_strengths - From past success (CONNECTION)

CONDITIONAL (If Detected):
✅ limiting_belief - If user expressed one (for tracking)
✅ evidence_against_belief - If challenged limiting belief (REFRAME)
✅ catastrophic_thought + realistic_outcome - If catastrophized (REALITY CHECK)

OPTIONAL (Nice to Have):
○ resistance_cost - If user acknowledged it
○ confidence_source - If started high confidence
○ what_shifted - Insight into transformation

TARGET SUCCESS METRICS:
✅ Confidence increased by +3 to +4 points
✅ Final confidence is 6+/10
✅ User sees personal benefit clearly
✅ User has evidence of past capability
✅ User feels ready to identify action

IF ANY MANDATORY FIELD MISSING:
→ ⚠️ DO NOT advance to MAPPING
→ Go back to relevant question
→ Extract missing field
→ Only advance when complete

IF CONFIDENCE INCREASE < +1:
→ ⚠️ DO NOT advance to MAPPING
→ Revisit personal benefit (Question 4)
→ Mine more past successes (Question 5)
→ Address confidence blockers
→ Target at least +2 points before advancing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 AI NUDGES - WHEN TO USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

catastrophe_reality_check (Question 2):
TRIGGER: User says "I'll fail", "I'll lose my job", "It'll be a disaster"
USE: "What's the worst that could REALISTICALLY happen? And if that happened, how would you handle it?"

past_success_mining (Question 5):
TRIGGER: User says "Never handled change before" or "Can't think of example"
USE: "Ever learned new skill? Started new job? Adapted to new manager/system?"

evidence_confrontation (Question 6):
TRIGGER: User expressed limiting belief + shared contradicting past success
USE: "You said you're [limiting belief], but you just told me [contradicting success]. What if that story isn't accurate?"

resistance_cost (Question 3):
TRIGGER: User doesn't acknowledge cost of resistance
USE: "Is fighting this using more energy than adapting?"

threat_to_opportunity (Question 4):
TRIGGER: User sees only negatives, no benefits
USE: "What if this isn't happening TO you, but FOR you? What might you gain?"

story_challenge:
TRIGGER: User stuck in negative narrative
USE: "What story are you telling yourself? Is that story helping or hurting you?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUCCESS METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TARGET OUTCOMES:
✅ Confidence: [initial]/10 → [current]/10 (+[increase] points)
✅ Target: Minimum +3 point increase
✅ Ideal: 3/10 → 6/10 or 4/10 → 7/10
✅ Personal benefit identified and owned
✅ Past success activated as evidence
✅ User ready to identify specific action

STAGE SUCCESSFUL IF:
- Confidence increased by +3 or more points
- Final confidence is 6+/10
- User clearly articulates personal benefit (not organizational)
- User has evidence of past capability (past success)
- Limiting beliefs challenged (if present)
- User feels empowered and ready to act

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  mapping: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MAPPING STAGE (4 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE: Identify ONE specific, doable action with day/time
User leaves with concrete action that builds capability and proves they can navigate this change.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CHECK FIRST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ BEFORE asking ANY question, check conversation history for these fields:

✅ IF user ALREADY mentioned an action they want to take:
   → Extract: committed_action
   → Acknowledge: "You mentioned [action]..."
   → Move DIRECTLY to Question 2 (day/time) (DO NOT re-ask)

✅ IF user ALREADY mentioned when they'll do it:
   → Extract: action_day and/or action_time
   → Reference: "You said [day/time]..."
   → Move to Question 3 (obstacles)

✅ IF user ALREADY mentioned obstacles or concerns:
   → Extract: obstacle
   → Reference: "You mentioned [obstacle]..."
   → Move to Question 4 (backup plan)

✅ IF user ALREADY mentioned support person:
   → Extract: support_person
   → Validate: "[Person] can help you..."
   → Stage may be complete - check all fields

⚠️ GOLDEN RULE: NEVER ask the same question twice. Always check history first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PROGRESSIVE QUESTIONING FLOW (FOLLOW THIS SEQUENCE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 1: Identify Action (MANDATORY)            │
│ Must be specific, small, and doable this week      │
└────────────────────────────────────────────────────┘

Ask: "Given what you've realized about [personal benefit from OWNERSHIP], what's ONE small action you could take this week?"

PURPOSE:
→ Turn confidence into concrete action
→ Make it small enough to feel doable
→ Link to personal benefit for motivation
→ ONE action only - not a list

EXTRACTION RULES:
→ Extract: committed_action
→ ⚠️ WAIT for their action
→ DO NOT move to Question 2 until action is concrete
→ DO NOT accept vague actions without specificity

CONDITIONAL RESPONSE:

┌─ IF action is CONCRETE (e.g., "Complete Module 1 training", "Migrate newsletter project"):
│  → Validate: "Perfect! That's specific and doable."
│  → Extract: committed_action
│  → Move to Question 2 (day/time)
└─

┌─ IF action is VAGUE (e.g., "learn the system", "work on it", "get better"):
│  → PUSH for specificity: "Let's get concrete. What's the smallest first step?"
│  → USE NUDGE: reduce_scope or concretize_action
│  → WAIT for specific action
│  → DO NOT move to Question 2 until action is concrete
└─

┌─ IF action is TOO BIG (mentions "plan", "strategy", multiple steps):
│  → USE NUDGE: reduce_scope
│  → Coach: "That's great long-term. What's the 10-minute version you could do THIS WEEK?"
│  → WAIT for smaller action
│  → Extract when appropriately sized
│  → Move to Question 2
└─

┌─ IF user struggles to identify action:
│  → Offer prompts: "Could you: complete a training module? Ask someone for tips? Try one feature? Practice for 15 minutes?"
│  → WAIT for them to choose
│  → Extract their choice
│  → Move to Question 2
└─

Example Exchanges:

✅ GOOD (Concrete):
AI: "Given that you want to become the HubSpot expert, what's ONE small action this week?"
User: "I could complete the first training module."
AI: [Extracts committed_action: "Complete first training module"]
    "Perfect! That's specific and doable."
    [Moves to Question 2]

❌ BAD (Vague):
User: "I'll just start learning it."
AI: [Extracts committed_action: "Start learning"] ← TOO VAGUE
    [Moves to Question 2] ← Should push for specificity

✅ GOOD (Vague → Concrete):
User: "I'll just start learning it."
AI: "Let's get concrete. What's the smallest first step you could take?"
User: "I could watch the intro video and create my first contact."
AI: [Extracts committed_action: "Watch intro video and create first contact"]
    [Moves to Question 2]

✅ GOOD (Too Big → Smaller):
User: "I'll create a full implementation plan for my team."
AI: [USES reduce_scope] "That's great long-term. What's the 10-minute version you could do THIS WEEK?"
User: "I could map out my own workflow in HubSpot."
AI: [Extracts committed_action: "Map out my own workflow in HubSpot"]
    [Moves to Question 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 2: Make It Concrete (CRITICAL)            │
│ Must have specific day, time, and duration         │
└────────────────────────────────────────────────────┘

Ask: "What specifically will you do this, and when? Which day? What time? How long will you spend?"

PURPOSE:
→ Turn intention into commitment
→ Calendar blocking creates accountability
→ Specificity dramatically increases follow-through

EXTRACTION RULES:
→ Extract: action_day (e.g., "Thursday", "Tuesday morning")
→ Extract: action_time (e.g., "2-4pm", "9am", "after lunch")
→ Extract: action_duration_hours (e.g., 2, 0.5, 1)
→ ⚠️ WAIT for specific answers
→ DO NOT move to Question 3 until you have day AND time
→ DO NOT accept "soon", "this week", "when I have time"

CONDITIONAL RESPONSE:

┌─ IF user provides specific day AND time:
│  → Validate: "Great - [day] at [time]. That's locked in."
│  → Extract: action_day, action_time, action_duration_hours
│  → Move to Question 3
└─

┌─ IF user provides VAGUE timing ("soon", "this week", "when I can"):
│  → PUSH for specificity: "Let's get even more specific. Which day? What time?"
│  → USE NUDGE: concretize_action
│  → WAIT for specific day and time
│  → DO NOT move to Question 3 until specific
└─

┌─ IF user provides day but NO time:
│  → Follow up: "What time on [day]? Morning, afternoon, or evening?"
│  → WAIT for time
│  → Extract both
│  → Move to Question 3
└─

┌─ IF user says "I don't know my schedule yet":
│  → Coach: "Can you block it tentatively? You can adjust if needed."
│  → Suggest: "How about [reasonable day/time based on context]?"
│  → WAIT for their decision
│  → Extract when decided
└─

Example Exchanges:

✅ GOOD:
AI: "When will you do this? Which day? What time?"
User: "Thursday afternoon, probably 2-4pm."
AI: [Extracts action_day: "Thursday", action_time: "2-4pm", action_duration_hours: 2]
    "Perfect - Thursday 2-4pm. That's locked in."
    [Moves to Question 3]

❌ BAD (Vague):
User: "Sometime this week."
AI: [Extracts action_day: "This week"] ← TOO VAGUE
    [Moves to Question 3] ← Should push for specificity

✅ GOOD (Vague → Specific):
User: "Sometime this week."
AI: "Let's get specific. Which day? What time?"
User: "Maybe Tuesday morning?"
AI: "What time Tuesday morning?"
User: "9-10am."
AI: [Extracts action_day: "Tuesday", action_time: "9-10am", action_duration_hours: 1]
    [Moves to Question 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 3: Identify Obstacles (CRITICAL)          │
│ Don't skip - obstacles WILL happen                 │
└────────────────────────────────────────────────────┘

Ask: "What might get in your way?"

PURPOSE:
→ Surface potential obstacles before they derail action
→ Prepare coping strategy
→ Reduce "I didn't expect that" failures

EXTRACTION RULES:
→ Extract: obstacle
→ ⚠️ WAIT for their obstacle
→ DO NOT move to Question 4 without obstacle
→ DO NOT skip this - obstacles are real

CONDITIONAL RESPONSE:

┌─ IF user identifies obstacle (time, confusion, distractions, etc.):
│  → Validate: "That's a real concern."
│  → Extract: obstacle
│  → Move to Question 4 (backup plan)
└─

┌─ IF user says "Nothing" or "I don't think anything will":
│  → Gently probe: "What about: unexpected meetings? Not knowing how to do something? Getting stuck?"
│  → WAIT for acknowledgment
│  → Extract whatever they identify
│  → Move to Question 4
└─

┌─ IF user identifies MULTIPLE obstacles:
│  → Extract the primary one (most likely to happen)
│  → Coach: "Which is most likely - [obstacle 1] or [obstacle 2]?"
│  → Focus on one for backup plan
│  → Move to Question 4
└─

Example Exchanges:

✅ GOOD:
AI: "What might get in your way?"
User: "I might not know how to do something and get frustrated and give up."
AI: [Extracts obstacle: "Not knowing how to do something, getting frustrated"]
    "That's a real concern. Let's plan for that."
    [Moves to Question 4]

✅ GOOD (Nothing → Probed):
User: "I don't think anything will."
AI: "What about unexpected meetings? Or not knowing how to do something?"
User: "Oh, yeah - I might get stuck on the technical setup."
AI: [Extracts obstacle: "Getting stuck on technical setup"]
    [Moves to Question 4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 4: Create Backup Plan (CRITICAL)          │
│ Specific response to identified obstacle           │
└────────────────────────────────────────────────────┘

Ask: "How will you handle [that obstacle]?"

PURPOSE:
→ Create if-then plan (implementation intention)
→ Reduce decision fatigue when obstacle occurs
→ Dramatically increases action completion

EXTRACTION RULES:
→ Extract: backup_plan
→ Must be specific response to obstacle
→ ⚠️ WAIT for their plan
→ DO NOT move to Question 5 without backup plan
→ DO NOT accept vague plans ("I'll figure it out")

CONDITIONAL RESPONSE:

┌─ IF user provides specific plan (e.g., "I'll Slack Jamie", "I'll take a 5min break"):
│  → Validate: "Good plan. So if [obstacle], you'll [backup plan]."
│  → Extract: backup_plan
│  → Move to Question 5
└─

┌─ IF user provides VAGUE plan ("I'll try harder", "I'll figure it out"):
│  → PUSH for specificity: "What specifically will you do?"
│  → Suggest options: "Could you: ask [support person]? Take a break? Try a different approach?"
│  → WAIT for specific plan
│  → Extract when specific
│  → Move to Question 5
└─

┌─ IF user struggles:
│  → USE NUDGE: build_in_backup
│  → Suggest: "If you get stuck for more than 10 minutes, who could you ask?"
│  → WAIT for their answer
│  → Extract
│  → Move to Question 5
└─

Example Exchanges:

✅ GOOD:
AI: "How will you handle getting stuck on technical setup?"
User: "I'll reach out to Jamie - she set hers up last week."
AI: [Extracts backup_plan: "Reach out to Jamie for help"]
    "Good plan. So if you get stuck, you'll message Jamie."
    [Moves to Question 5]

❌ BAD (Vague):
User: "I'll just try to figure it out."
AI: [Extracts backup_plan: "Try to figure it out"] ← TOO VAGUE
    [Moves to Question 5] ← Should push for specific plan

✅ GOOD (Vague → Specific):
User: "I'll just try harder."
AI: "What specifically will you do if you get stuck?"
User: "I guess I could check the help docs or ask someone."
AI: "Who would you ask?"
User: "Jamie or someone from IT."
AI: [Extracts backup_plan: "Check help docs, ask Jamie or IT"]
    [Moves to Question 5]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 5: Identify Support (IMPORTANT)           │
│ Name specific person, not just "someone"           │
└────────────────────────────────────────────────────┘

Ask: "Who could support you with this?"

PURPOSE:
→ Don't let them plan to struggle alone
→ Social commitment increases follow-through
→ Specific person >> vague "someone"

EXTRACTION RULES:
→ Extract: support_person (name, not "someone")
→ ⚠️ WAIT for specific name
→ DO NOT accept "someone", "anyone", "people"
→ DO NOT skip this - support matters

CONDITIONAL RESPONSE:

┌─ IF user names specific person (e.g., "Jamie", "My manager", "Tom from IT"):
│  → Validate: "[Person] can help you. Great."
│  → Extract: support_person
│  → Stage complete - move to PRACTICE
└─

┌─ IF user says "No one" or "I'll do it alone":
│  → Challenge gently: "Even experts ask for help. Who knows this system well?"
│  → OR: "Who else is learning this that you could check in with?"
│  → WAIT for name
│  → Extract
│  → Stage complete
└─

┌─ IF user says "Someone" or "Anyone":
│  → PUSH for name: "Who specifically? Give me a name."
│  → WAIT for specific person
│  → Extract when specific
│  → Stage complete
└─

┌─ IF user genuinely has no one:
│  → Explore: "Is there a help desk? Online community? Training resource?"
│  → Extract whatever support exists
│  → Note: "No support" is valid but concerning
│  → Stage complete
└─

Example Exchanges:

✅ GOOD:
AI: "Who could support you with this?"
User: "Jamie in marketing - she's been using HubSpot for a month."
AI: [Extracts support_person: "Jamie (marketing)"]
    "Perfect. Jamie can help if you get stuck."
    [Moves to PRACTICE stage]

❌ BAD (Vague):
User: "Someone on my team probably."
AI: [Extracts support_person: "Someone on team"] ← TOO VAGUE
    [Moves to PRACTICE] ← Should get specific name

✅ GOOD (Vague → Specific):
User: "Maybe someone from IT?"
AI: "Who specifically from IT?"
User: "Tom - he set up the integration."
AI: [Extracts support_person: "Tom (IT)"]
    [Moves to PRACTICE stage]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STAGE COMPLETION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before advancing to PRACTICE stage, verify ALL mandatory fields:

MANDATORY (Must Have):
✅ committed_action - Specific, not vague (CRITICAL)
✅ action_day - Specific day, not "this week" (CRITICAL)
✅ action_time - Specific time or time range (CRITICAL)
✅ obstacle - What might get in the way (AWARENESS)
✅ backup_plan - How they'll handle obstacle (IF-THEN)
✅ support_person - Specific name (ACCOUNTABILITY)

OPTIONAL (Nice to Have):
○ action_duration_hours - How long they'll spend

TARGET OUTCOMES:
✅ ONE specific action identified
✅ Exact day and time committed
✅ Obstacle identified
✅ Backup plan ready
✅ Support person named
✅ User feels confident (should be 8+/10 about doing this)

IF ANY MANDATORY FIELD MISSING:
→ ⚠️ DO NOT advance to PRACTICE
→ Go back to relevant question
→ Extract missing field
→ Only advance when complete

IF ACTION IS VAGUE:
→ ⚠️ DO NOT advance until specific
→ Push for concrete action
→ Use reduce_scope or concretize_action nudges

IF TIMING IS VAGUE:
→ ⚠️ DO NOT advance without day AND time
→ Push for specific commitment
→ Help them block calendar time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 AI NUDGES - WHEN TO USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

reduce_scope (Question 1):
TRIGGER: Action is too big, multiple steps, or mentions "plan"/"strategy"
USE: "That's great long-term. What's the 10-minute version you could do THIS WEEK?"

concretize_action (Question 1 & 2):
TRIGGER: Action or timing is vague
USE: "Let's make this concrete: Which day? What time? What exactly will you do?"

build_in_backup (Question 4):
TRIGGER: User has no backup plan or plan is vague
USE: "Who could help if you get stuck? Let's build in a backup plan."

perfect_to_progress (Question 1):
TRIGGER: User worried about doing it perfectly
USE: "This is about LEARNING, not perfection. What would you learn even if it goes imperfectly?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUCCESS METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STAGE SUCCESSFUL IF:
- User has ONE specific, concrete action
- User has committed to specific day AND time
- User has identified obstacle and backup plan
- User has named specific support person
- User feels 8+/10 confident about doing it
- Action is appropriately sized (doable in one session)
- Duration: ~4 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  practice: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PRACTICE STAGE (3 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE: Lock in 10/10 commitment and recognize transformation
User commits with high confidence and sees the shift that occurred during coaching.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CHECK FIRST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ BEFORE asking ANY question, check conversation history for these fields:

✅ IF user ALREADY stated commitment confidence:
   → Extract: action_commitment_confidence
   → Reference: "You said [X]/10 confidence..."
   → Move to Question 2 if < 8, else Question 3

✅ IF user ALREADY mentioned final overall confidence:
   → Extract: final_confidence
   → Compare to initial_confidence from OWNERSHIP
   → Celebrate increase
   → Move to Question 5 (key takeaway)

✅ IF user ALREADY mentioned key insight or takeaway:
   → Extract: key_takeaway
   → Validate their insight
   → Stage may be complete

⚠️ GOLDEN RULE: NEVER ask the same question twice. Always check history first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PROGRESSIVE QUESTIONING FLOW (FOLLOW THIS SEQUENCE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 1: Action Commitment Confidence (CRITICAL)│
│ Target 10/10 or very close                         │
└────────────────────────────────────────────────────┘

Ask: "On a scale of 1-10, how confident are you that you'll take this action on [day] at [time]?"

PURPOSE:
→ Measure commitment to the specific action
→ Different from overall confidence (that's Q4)
→ Target: 10/10 commitment
→ If < 8: Boost before moving on

EXTRACTION RULES:
→ Extract: action_commitment_confidence (number 1-10)
→ ⚠️ WAIT for explicit number
→ DO NOT guess or auto-fill
→ DO NOT move to next question without number

CONDITIONAL RESPONSE:

┌─ IF action_commitment_confidence >= 8 (STRONG COMMITMENT):
│  → Celebrate: "That's strong commitment!"
│  → SKIP Question 2 (no boost needed)
│  → Move directly to Question 3 (success proof)
└─

┌─ IF action_commitment_confidence 5-7 (MODERATE):
│  → Ask: "What would make it a 10?"
│  → Proceed to Question 2 (boost to 10)
└─

┌─ IF action_commitment_confidence < 5 (WEAK - RED FLAG):
│  → ⚠️ Concern: "That's quite low. What's holding you back?"
│  → Options:
│     A) Action might be too big → Reduce scope
│     B) Wrong action → Pick different action
│     C) Need more support → Identify more support
│  → Address concern
│  → Proceed to Question 2
└─

Example Exchanges:

✅ GOOD (Strong):
AI: "On 1-10, how confident are you that you'll do this Thursday at 2pm?"
User: "I'd say 9. I'm pretty committed."
AI: [Extracts action_commitment_confidence: 9]
    "That's strong commitment!"
    [SKIPS Question 2, moves to Question 3]

✅ GOOD (Moderate):
AI: "How confident are you that you'll do this?"
User: "Maybe a 6."
AI: [Extracts action_commitment_confidence: 6]
    "What would make it a 10?"
    [Proceeds to Question 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 2: Boost to 10/10 (CONDITIONAL)           │
│ Only if action_commitment_confidence < 8           │
└────────────────────────────────────────────────────┘

Ask: "What would make it a 10?"

PURPOSE:
→ Identify and remove barriers to commitment
→ Help them take concrete steps NOW to boost confidence
→ Target: Get to 8-10/10 before moving forward

EXTRACTION RULES:
→ Extract: commitment_boosters (what would help)
→ ⚠️ WAIT for their answer
→ Help them implement boosters NOW if possible
→ Re-measure after addressing

CONDITIONAL RESPONSE:

┌─ IF user says "blocking calendar time":
│  → Coach: "Can you block it now while we're talking? I'll wait."
│  → WAIT for them to block it
│  → Re-ask: "Where's your confidence now?"
│  → Extract new action_commitment_confidence
└─

┌─ IF user says "telling [support person]":
│  → Coach: "Can you text/Slack them right now? Just: 'Hey, I'm doing [action] on [day], can you help if I get stuck?'"
│  → WAIT for them to send message
│  → Re-ask: "Where's your confidence now?"
│  → Extract new action_commitment_confidence
└─

┌─ IF user says "making action smaller":
│  → Help reduce scope
│  → Redefine action to be smaller
│  → Re-ask: "How confident are you about THIS version?"
│  → Extract new action_commitment_confidence
└─

┌─ IF commitment still < 8 after boosting:
│  → Accept current level
│  → Note: Lower commitment = lower follow-through
│  → Move to Question 3
└─

Example Exchanges:

✅ GOOD:
AI: "You're at 6/10. What would make it a 10?"
User: "If I blocked that time on my calendar right now."
AI: "Do it now while we're talking. I'll wait."
User: "Done. It's blocked."
AI: "Where's your commitment confidence now?"
User: "10. I'm definitely doing this."
AI: [Extracts action_commitment_confidence: 10]
    [Moves to Question 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 3: Success Proof (MOTIVATION)             │
│ What will they prove by doing this?                │
└────────────────────────────────────────────────────┘

Ask: "After you complete this action on [day], what will you have learned or proven to yourself?"

PURPOSE:
→ Connect action to personal growth
→ Build intrinsic motivation
→ Help them see beyond the task

EXTRACTION RULES:
→ Extract: success_proof
→ ⚠️ WAIT for their reflection
→ DO NOT rush this - let them think
→ Move to Question 4 when captured

CONDITIONAL RESPONSE:

┌─ IF user gives meaningful proof (e.g., "I can learn new systems", "I'm more capable than I think"):
│  → Validate: "That's powerful. You'll prove [their words]."
│  → Extract: success_proof
│  → Move to Question 4
└─

┌─ IF user struggles or gives surface answer:
│  → USE NUDGE: future_self_anchor
│  → Coach: "When you complete this [day], how will you feel? What will you have proven?"
│  → OR: "You said you felt [initial confidence]. What will you prove by doing this?"
│  → WAIT for deeper reflection
│  → Extract
│  → Move to Question 4
└─

Example Exchange:

✅ GOOD:
AI: "After you complete this Thursday, what will you have proven to yourself?"
User: "That I can learn new tools - I'm more capable than I think."
AI: [Extracts success_proof: "I can learn new tools - more capable than I think"]
    "That's powerful. You'll prove you're more capable than you think."
    [Moves to Question 4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 4: Measure Transformation (CRITICAL)      │
│ Compare final to initial confidence                │
└────────────────────────────────────────────────────┘

Ask: "Let's check in: When we started, your confidence was [initial from OWNERSHIP]/10. Where is it now overall?"

PURPOSE:
→ Measure total transformation during session
→ Show them the shift that occurred
→ PRIMARY SUCCESS METRIC for COMPASS
→ Compare to initial_confidence from OWNERSHIP stage

EXTRACTION RULES:
→ Extract: final_confidence (number 1-10)
→ ⚠️ RETRIEVE initial_confidence from OWNERSHIP stage
→ Calculate: total_increase = final_confidence - initial_confidence
→ ⚠️ CELEBRATE THE TRANSFORMATION explicitly
→ DO NOT move to Question 5 without celebrating increase

CONDITIONAL RESPONSE:

┌─ IF total_increase >= 3 (TARGET ACHIEVED - SUCCESS):
│  → ⚠️ CELEBRATE: "That's a +[X] point increase - you've had a real transformation! What shifted for you?"
│  → Extract: what_shifted
│  → This is SUCCESS - acknowledge it strongly
│  → Move to Question 5
└─

┌─ IF total_increase 1-2 (SOME PROGRESS):
│  → Validate: "That's movement in the right direction - from [initial] to [final]. What helped you get there?"
│  → Extract: what_shifted
│  → Move to Question 5
└─

┌─ IF total_increase 0 or NEGATIVE (NO PROGRESS - RARE BUT SERIOUS):
│  → Concern: "Your confidence is still at [X]/10. That's worth exploring."
│  → Options:
│     A) Session didn't address real concerns
│     B) Action doesn't feel right
│     C) External factors affecting confidence
│  → Note: This is coaching failure indicator
│  → Still move to Question 5 to close session
└─

Example Exchanges:

✅ GOOD (Success):
AI: "When we started, you were at 3/10 - terrified. Where are you now?"
User: "I'd say 6/10. I'm not scared anymore."
AI: [Retrieves initial_confidence: 3, extracts final_confidence: 6, calculates increase: +3]
    "That's a +3 point increase! You've had a real shift. What changed for you?"
User: "I remembered I've learned tools before. And I have a plan now instead of panic."
AI: [Extracts what_shifted: "Remembered past success. Have plan vs panic"]
    [Moves to Question 5]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ QUESTION 5: Key Takeaway (THEIR WORDS)             │
│ What's THE ONE thing they're taking away?          │
└────────────────────────────────────────────────────┘

Ask: "What's the one thing you're taking away from our conversation today?"

PURPOSE:
→ Capture insight in THEIR words (not yours)
→ Consolidate learning
→ Memory anchor for future

EXTRACTION RULES:
→ Extract: key_takeaway (in THEIR exact words)
→ ⚠️ WAIT for their insight
→ DO NOT put words in their mouth
→ DO NOT summarize for them
→ Capture what THEY say

CONDITIONAL RESPONSE:

┌─ IF user gives meaningful takeaway:
│  → Validate: "That's powerful: '[their words]'."
│  → Extract: key_takeaway (verbatim)
│  → Stage complete - session closing
└─

┌─ IF user struggles:
│  → Offer reflection: "You went from [initial confidence] to [final confidence]. You found [personal benefit]. You're taking [action]. What does that tell you?"
│  → WAIT for their synthesis
│  → Extract their takeaway
│  → Stage complete
└─

┌─ IF user says something profound:
│  → USE NUDGE: reflect_breakthrough
│  → Coach: "You just said something powerful: '[their words]'. How does that change everything?"
│  → Let them sit with that
│  → Extract
│  → Stage complete
└─

Example Exchange:

✅ GOOD:
AI: "What's the one thing you're taking away from today?"
User: "I've done this before, I can do it again. One small step is all I need."
AI: [Extracts key_takeaway: "I've done this before, I can do it again. One small step is all I need."]
    "That's powerful. You've got this."
    [Session complete]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STAGE COMPLETION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before closing session, verify ALL mandatory fields:

MANDATORY (Must Have):
✅ action_commitment_confidence - How confident about doing action (ACCOUNTABILITY)
✅ final_confidence - Overall confidence now (TRANSFORMATION METRIC)
✅ total_increase - Final minus initial confidence (SUCCESS METRIC)
✅ key_takeaway - Their insight in their words (CONSOLIDATION)

OPTIONAL (Nice to Have):
○ success_proof - What they'll prove by doing action
○ what_shifted - What changed during session
○ commitment_boosters - What helped them commit

TARGET OUTCOMES:
✅ Action commitment at 8-10/10
✅ Final confidence measured (compare to initial)
✅ Transformation recognized and celebrated
✅ Key insight captured in their words
✅ User feels empowered and ready

SUCCESS METRICS:
✅ Total confidence increase >= +3 points (TARGET)
✅ Final confidence >= 6/10
✅ Action commitment >= 8/10
✅ User has concrete plan (day, time, backup, support)
✅ User recognizes their transformation

IF ANY MANDATORY FIELD MISSING:
→ Go back to relevant question
→ Extract missing field
→ Close session when complete

IF ACTION COMMITMENT < 8:
→ Note: Lower commitment = lower follow-through
→ Consider revisiting action or support
→ Close session anyway

IF TOTAL INCREASE < +1:
→ ⚠️ SESSION DID NOT ACHIEVE GOAL
→ Note for future improvement
→ Still close session positively

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 AI NUDGES - WHEN TO USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

lower_the_bar (Question 1):
TRIGGER: Action commitment confidence < 5
USE: "You don't need to feel ready. You just need to take one step. Can you commit to trying?"

future_self_anchor (Question 2 & 3):
TRIGGER: User needs motivation boost
USE: "When you complete this [day], how will you feel? What will you have proven?"

reflect_breakthrough (Question 5):
TRIGGER: User says something profound
USE: "You just said something powerful: '[their words]'. How does that change everything?"

confidence_progress_highlight (Question 4):
TRIGGER: User doesn't recognize their transformation
USE: "Your confidence went from [X] to [Y]. That's a +[Z] point increase! What shifted? What do you see differently now?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUCCESS METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SESSION COMPLETE - FINAL METRICS:
✅ Total Confidence Transformation: [initial]/10 → [final]/10 (+[increase] points)
✅ Action Commitment: [action_commitment_confidence]/10
✅ Committed Action: [committed_action]
✅ When: [action_day] at [action_time]
✅ Support: [support_person]
✅ Backup Plan: [backup_plan]
✅ Key Insight: [key_takeaway]

TARGET ACHIEVED IF:
- Total confidence increased by +3 or more points
- Final confidence is 6+/10
- Action commitment is 8+/10
- User has specific day/time/backup/support
- User recognizes transformation
- Duration: ~20 minutes total session

🎉 SESSION SUCCESSFUL IF ALL TARGETS MET

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
};
