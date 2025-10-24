# COMPASS Step-by-Step Question Flow Analysis

## Executive Summary

**Finding**: GROW framework has significantly more prescriptive, sequential question-by-question guidance than COMPASS. This makes the coaching experience more predictable and systematic.

**Recommendation**: Enhance COMPASS prompts with explicit sequential question flows similar to GROW, while preserving COMPASS's strength in confidence transformation and AI nudges.

---

## Current State Analysis

### ✅ GROW Framework - What Works Well

#### 1. **Explicit Question Sequencing**
Each step has numbered questions with clear progression:

**Example from GOAL Phase:**
```
QUESTION 1 - What's the Goal:
"What outcomes would you like to achieve?"
→ Extract: goal
→ Move to Question 2

QUESTION 2 - Why Now:
"Why is this important right now?"
→ Extract: why_now
→ Move to Question 3

QUESTION 3 - Success Criteria:
"What would success look like?"
→ Extract: success_criteria
→ Move to Question 4
```

#### 2. **Context Extraction Rules**
GROW explicitly tells the AI to check conversation history:
```
CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CRITICAL):
- If user ALREADY stated their goal → Extract it, don't re-ask
- If they ALREADY mentioned timeframe → Extract it, move to NEXT question
- DO NOT ask for information they've ALREADY provided
```

#### 3. **Conditional Logic & Edge Cases**
GROW handles edge cases explicitly:

**Measurable vs Vague Goals:**
```
STEP 1: DETECT IF GOAL IS MEASURABLE

MEASURABLE GOALS (binary outcomes):
✅ FOR MEASURABLE GOALS - REQUIRED APPROACH:
- SKIP success criteria question (redundant)
- MOVE DIRECTLY to exploring WHY NOW

VAGUE GOALS (subjective):
✅ FOR VAGUE GOALS - REQUIRED APPROACH:
- ASK for clarification: "What would 'better leader' look like?"
```

#### 4. **Three-Question Flow in OPTIONS**
GROW has a sophisticated 3-question flow:
```
QUESTION 1 - Ask for First Option
QUESTION 2 - Explore Pros/Cons
QUESTION 3 - Offer Choice (THE FORK):
  PATH A: User shares another option → Continue facilitating
  PATH B: User wants AI suggestions → Generate + validate
```

#### 5. **Progressive Validation**
GROW validates after suggestions:
```
→ After AI suggestions, VALIDATE:
  - "Do any of these resonate?"
  - "Would you like to explore further?"
  - "Shall we move forward?"
→ WAIT for user response before advancing
```

---

### 📊 COMPASS Framework - Current State

#### 1. **High-Level Question Flow**
COMPASS has progressive flows but less prescriptive:

**Example from OWNERSHIP Phase:**
```
⚡ PROGRESSIVE QUESTIONING FLOW:

QUESTION 1 - Initial Confidence
QUESTION 2 - Explore Fears
QUESTION 3 - Resistance Cost
QUESTION 4 - Find Personal Benefit
QUESTION 5 - Past Success Activation
QUESTION 6 - Challenge Limiting Beliefs
QUESTION 7 - Measure Confidence Increase
```

#### 2. **Strengths**
- ✅ Clear stage objectives
- ✅ Confidence transformation metrics (3/10 → 6+/10)
- ✅ Rich AI nudges for specific situations
- ✅ Detailed examples of success scenarios

#### 3. **Gaps vs GROW**
- ❌ Less explicit sequencing ("ask this, THEN that")
- ❌ No context extraction rules (doesn't check if already answered)
- ❌ No conditional logic for edge cases
- ❌ No explicit validation after AI suggestions
- ❌ No "WAIT for response" instructions

---

## Recommended Enhancements for COMPASS

### 🎯 Enhancement 1: Explicit Question Sequencing

#### BEFORE (Current COMPASS - CLARITY):
```typescript
QUESTION 1 - What's Changing:
"What specific change are you dealing with?"
→ Extract: change_description

QUESTION 2 - Understanding Check:
"On a scale of 1-5, how well do you understand what's happening?"
→ Extract: clarity_score
```

#### AFTER (Enhanced COMPASS - CLARITY):
```typescript
QUESTION 1 - What's Changing:
"What specific change are you dealing with?"
→ Extract: change_description
→ WAIT for response
→ DO NOT ask Question 2 until you have change_description
→ If user provides sphere_of_control in their answer, extract it and SKIP to Question 3

QUESTION 2 - Understanding Check:
"On a scale of 1-5, how well do you understand what's happening and why?"
→ If 1-2: "What's most confusing or unclear?" (dig deeper)
→ If 3-5: "What do you understand so far?" (validate understanding)
→ Extract: clarity_score (ONLY if user gives number)
→ DO NOT auto-fill or guess clarity_score
→ Move to Question 3

QUESTION 3 - Sphere of Control (MANDATORY):
"What parts of this can you control vs. what's beyond your control?"
→ This is CRITICAL - do not skip
→ Extract: sphere_of_control
→ If user says "nothing" or "I can't control anything" → USE nudge: control_clarification
→ WAIT for meaningful answer before advancing
```

---

### 🎯 Enhancement 2: Context Extraction Rules

Add to each COMPASS stage:

```typescript
CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CRITICAL):

CLARITY:
- If user ALREADY described the change → Extract change_description, don't re-ask
- If they ALREADY mentioned understanding level → Extract clarity_score
- If they ALREADY identified what they can control → Extract sphere_of_control
- Move to NEXT unanswered question

OWNERSHIP:
- If user ALREADY stated initial confidence → Extract it, don't re-ask
- If they ALREADY mentioned a fear → Extract it, validate, move to next fear
- If they ALREADY mentioned personal benefit → Extract it, don't re-ask
- Only ask questions for MISSING fields

MAPPING:
- If user ALREADY stated an action → Extract committed_action, don't re-ask
- If they ALREADY mentioned a day/time → Extract it
- Move to MISSING fields (obstacle, backup_plan, support_person)

PRACTICE:
- If user ALREADY stated commitment confidence → Extract it
- If they ALREADY mentioned key takeaway → Extract it
- Don't make them repeat themselves
```

---

### 🎯 Enhancement 3: Conditional Logic & Edge Cases

#### OWNERSHIP - Handle Low Initial Confidence

```typescript
QUESTION 1 - Initial Confidence:
"On 1-10, how confident do you feel about navigating this successfully?"
→ Extract: initial_confidence
→ CONDITIONAL RESPONSE:

IF initial_confidence >= 7:
  → "That's a strong starting point! What's giving you that confidence?"
  → Skip Question 2 (Explore Fears)
  → Move directly to Question 4 (Personal Benefit)

IF initial_confidence 4-6:
  → "What's holding you back from being more confident?"
  → Proceed to Question 2 normally

IF initial_confidence <= 3:
  → "That's a tough place to start. What specifically is making you feel unconfident?"
  → USE NUDGE: catastrophe_reality_check or past_success_mining
  → Proceed to Question 2 with extra empathy
```

#### MAPPING - Handle Vague vs Concrete Actions

```typescript
QUESTION 1 - Identify Action:
"What's ONE small action you could take this week?"
→ User responds with action

VALIDATION CHECK:
IF action is VAGUE (e.g., "learn the system", "work on it"):
  → PUSH for specificity: "Let's get concrete. What's the smallest first step?"
  → USE NUDGE: reduce_scope or concretize_action
  → WAIT for specific action
  → Do NOT move to Question 2 until action is concrete

IF action is CONCRETE (e.g., "Complete Module 1 training"):
  → "Perfect! That's specific and doable."
  → Move to Question 2 (day/time)

IF action is TOO BIG (mentions "plan", "strategy", multiple steps):
  → USE NUDGE: reduce_scope
  → "That's great long-term. What's the 10-minute version you could do THIS WEEK?"
  → WAIT for smaller action
```

---

### 🎯 Enhancement 4: Explicit Validation After AI Suggestions

Currently COMPASS generates suggestions but doesn't always validate. Add:

```typescript
OWNERSHIP - After Personal Benefit Perspectives:

IF user struggles with personal benefit:
  → "Some leaders have found benefits like: [AI generates 2-3 perspectives as QUESTIONS]
      - Career: 'Could this build skills that advance your career?'
      - Relationships: 'Might this improve team dynamics?'
      - Values: 'Does this align with your personal values in any way?'"
  
  → CRITICAL - VALIDATE WITH USER:
    "Do any of these resonate with you?"
  
  → WAIT for user response
  → DO NOT auto-extract their benefit
  → DO NOT move forward until they confirm relevance
  
  → IF user says none resonate:
      "What matters most to YOU in your work?" (dig deeper)
  
  → IF user confirms one:
      Extract their validation as personal_benefit
      Move to Question 5 (Past Success)
```

---

### 🎯 Enhancement 5: WAIT Instructions

Add explicit WAIT instructions throughout:

```typescript
QUESTION X - [Question Name]:
"[Question text]"
→ Extract: [field_name]
→ ⚠️ WAIT for user response - DO NOT ask next question yet
→ DO NOT auto-fill this field
→ DO NOT move to Question Y until user provides answer
→ If user is vague, ask follow-up before moving on
```

---

## Comparison Matrix

| Feature | GROW | Current COMPASS | Enhanced COMPASS |
|---------|------|-----------------|------------------|
| **Numbered Question Sequence** | ✅ Explicit | ⚠️ High-level | ✅ Explicit |
| **Context Extraction Rules** | ✅ Yes | ❌ No | ✅ Yes |
| **Conditional Logic** | ✅ Multiple | ⚠️ Some | ✅ Multiple |
| **Edge Case Handling** | ✅ Explicit | ⚠️ Implicit | ✅ Explicit |
| **Validation After Suggestions** | ✅ Yes | ⚠️ Sometimes | ✅ Always |
| **WAIT Instructions** | ✅ Explicit | ❌ Implicit | ✅ Explicit |
| **Example Scenarios** | ✅ Good/Bad | ✅ Success | ✅ Both |
| **AI Nudges Integration** | ❌ No | ✅ Rich | ✅ Rich |
| **Confidence Metrics** | ❌ No | ✅ Yes | ✅ Yes |

---

## Implementation Plan

### Phase 1: Enhance COMPASS Prompts (Priority: HIGH)

**File**: `convex/prompts/compass.ts`

**Changes**:
1. ✅ Add explicit question numbering to each stage
2. ✅ Add "CONTEXT EXTRACTION FROM CONVERSATION HISTORY" sections
3. ✅ Add conditional logic for common edge cases
4. ✅ Add "WAIT for response" instructions
5. ✅ Add validation requirements after AI suggestions
6. ✅ Add "DO NOT" instructions for common mistakes

**Estimated effort**: 3-4 hours

---

### Phase 2: Update Base Prompts (Priority: MEDIUM)

**File**: `convex/prompts/base.ts`

**Changes**:
1. ✅ Add general context extraction guidance
2. ✅ Strengthen "DO NOT repeat questions" instructions
3. ✅ Add explicit "WAIT for user" guidance

**Estimated effort**: 1 hour

---

### Phase 3: Test & Validate (Priority: HIGH)

**Process**:
1. Run COMPASS sessions with new prompts
2. Check if AI follows sequential flow
3. Verify context extraction works
4. Test edge cases (vague input, already-answered questions)
5. Compare to GROW sessions for consistency

**Estimated effort**: 2-3 hours

---

## Example: Enhanced OWNERSHIP Stage

### Current Version (485 lines)
```typescript
ownership: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OWNERSHIP STAGE (8 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE: Transform resistance → acceptance → commitment

⚡ PROGRESSIVE QUESTIONING FLOW:

QUESTION 1 - Initial Confidence
QUESTION 2 - Explore Fears
QUESTION 3 - Resistance Cost
...
```

### Enhanced Version (with explicit sequencing)
```typescript
ownership: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OWNERSHIP STAGE (8 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE: Transform resistance → acceptance → commitment
Build confidence from 3/10 to 6+/10 by finding personal meaning and activating past successes.

🎯 THIS IS THE TRANSFORMATION STAGE - Expect +3 to +4 point confidence increase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before asking ANY question, check if user ALREADY provided this information:

✅ IF user ALREADY stated initial confidence:
   → Extract initial_confidence
   → Move to Question 2 (DO NOT re-ask)

✅ IF user ALREADY mentioned fears/worries:
   → Extract them
   → Validate: "You mentioned [fear] - tell me more about that"
   → Move to next unexplored fear or Question 3

✅ IF user ALREADY mentioned personal benefit:
   → Extract personal_benefit
   → Don't re-ask about benefits
   → Move to Question 5 (Past Success)

✅ IF user ALREADY shared past success story:
   → Extract past_success
   → Reference it: "You mentioned [past success] - what strength from that can you use now?"
   → Move to Question 7 (Measure Confidence)

⚠️ RULE: NEVER ask the same question twice. Extract from history first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROGRESSIVE QUESTIONING FLOW (CRITICAL SEQUENCE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTION 1 - Initial Confidence (PRIMARY METRIC - MANDATORY):
────────────────────────────────────────────────────
"On a scale of 1-10, how confident do you feel about navigating this successfully?"

→ Extract: initial_confidence (MUST RECORD THIS)
→ This is your baseline - everything builds from here
→ ⚠️ WAIT for user to give number
→ DO NOT auto-fill or guess the number
→ DO NOT move to Question 2 until you have initial_confidence

CONDITIONAL RESPONSE BASED ON SCORE:

IF initial_confidence >= 7:
  → Coach: "That's a strong starting point! What's giving you that confidence?"
  → Extract: confidence_source
  → SKIP Question 2 (Explore Fears) - they're already confident
  → Move directly to Question 4 (Personal Benefit)

IF initial_confidence 4-6 (MOST COMMON):
  → Coach: "So you're at [X]/10. What's holding you back from being more confident?"
  → Proceed to Question 2 normally

IF initial_confidence <= 3 (HIGH CONCERN):
  → Coach: "That's a tough place to start. What specifically is making you feel so unconfident?"
  → ⚠️ USE NUDGE: catastrophe_reality_check or past_success_mining
  → Proceed to Question 2 with EXTRA EMPATHY
  → Slow down - don't rush them

────────────────────────────────────────────────────

QUESTION 2 - Explore Fears (ONLY IF initial_confidence <= 6):
────────────────────────────────────────────────────
"What's making you feel [unconfident/worried/resistant]?"

→ Listen for limiting beliefs ("I'm not tech-savvy", "I'm bad at change")
→ Listen for catastrophic thinking ("I'll fail", "Everyone will judge me")
→ Listen for specific fears (time, competence, support, judgment)

→ ⚠️ WAIT for their response
→ DO NOT move to Question 3 until you understand their primary fear
→ If they mention a limiting belief → Set flag to use Question 6 later

CONDITIONAL RESPONSE:

IF user mentions limiting belief (e.g., "I'm not good at..."):
  → Extract: limiting_belief
  → Mark for later challenge in Question 6
  → Coach: "I hear you saying [limiting belief]. Let's explore that more."
  → Move to Question 3

IF user catastrophizes (e.g., "I'll fail", "It'll be a disaster"):
  → USE NUDGE: catastrophe_reality_check immediately
  → "What's the worst that could REALISTICALLY happen?"
  → Extract their catastrophic thought and realistic assessment
  → Move to Question 3

IF user mentions specific fear (time, skills, support):
  → Validate: "That's a real concern."
  → Extract the fear
  → Move to Question 3

────────────────────────────────────────────────────

QUESTION 3 - Resistance Cost:
────────────────────────────────────────────────────
"What's the cost if you stay stuck in resistance?"

→ Help them see: resistance uses energy without changing outcome
→ Frame as: "What's fighting this change costing you emotionally/mentally/time-wise?"

→ Extract: resistance_cost (if meaningful)
→ ⚠️ WAIT for their reflection
→ DO NOT rush to Question 4

COACHING APPROACH:
→ If user says "nothing" or "I don't know":
  USE NUDGE: resistance_cost
  "Is fighting this using more energy than adapting?"
  
→ Move to Question 4 when they acknowledge a cost OR after 2 attempts

────────────────────────────────────────────────────

QUESTION 4 - Find Personal Benefit (CRITICAL FOR OWNERSHIP):
────────────────────────────────────────────────────
"What could you gain personally if you adapt well to this?"

→ Extract: personal_benefit
→ NOT organizational benefit - PERSONAL benefit
→ This is CRITICAL for building ownership

⚠️ CRITICAL VALIDATION:
- If user gives ORGANIZATIONAL benefit (e.g., "company will do better"):
  → PUSH BACK: "That's a benefit for the organization. What's in it for YOU personally?"
  
- If user says "nothing" or struggles:
  → OFFER AI-GENERATED PERSPECTIVES as QUESTIONS (not statements):
  
  Coach: "Some leaders have found benefits like:
  - Career development: 'Could this build skills that advance your career?'
  - Skills building: 'Might you learn something valuable?'
  - Relationships: 'Could this strengthen team connections?'
  - Values: 'Does this align with your personal values in any way?'
  
  Do any of these resonate with you?"
  
  → ⚠️ WAIT for user response
  → DO NOT auto-fill personal_benefit from AI suggestions
  → DO NOT move to Question 5 until user confirms a personal benefit
  
  → IF user says none resonate:
      "What matters most to YOU in your work right now?"
      Dig deeper into their values
  
  → IF user confirms one:
      Extract their confirmation as personal_benefit
      Move to Question 5

────────────────────────────────────────────────────

QUESTION 5 - Past Success Activation (EVIDENCE BUILDING):
────────────────────────────────────────────────────
"Tell me about a time you successfully handled change before."

→ Extract: past_success { achievement, strategy }
→ This builds confidence through evidence

⚠️ WAIT for their story
→ DO NOT move to Question 6 until you have a past success story
→ If user says "never" or "can't think of one":
  → PUSH: "Ever learned a new skill? Started a new job? Adapted to new manager?"
  → Everyone has handled change - help them find it

FOLLOW-UP (MANDATORY):
After they share past success:
"What strengths from that experience can you use now?"

→ Extract: transferable_strengths
→ Help them see connection between past success and current change
→ Move to Question 6 IF limiting belief was detected in Question 2
→ OTHERWISE skip to Question 7

────────────────────────────────────────────────────

QUESTION 6 - Challenge Limiting Beliefs (CONDITIONAL):
────────────────────────────────────────────────────
ONLY IF user expressed limiting belief in Question 2 (e.g., "I'm not tech-savvy")

USE NUDGE: evidence_confrontation

Coach: "You called yourself [limiting belief], but you just told me you [past success that contradicts it]. What if that story isn't accurate?"

→ Extract: evidence_against_belief
→ This is powerful reframing moment
→ ⚠️ WAIT for their realization
→ Celebrate when they see the contradiction

Example:
User said: "I'm not tech-savvy"
Past success: "Became Slack expert"
Coach: "You called yourself 'not tech-savvy' but you're the Slack expert your team asks for help. What if that story isn't accurate?"

→ Move to Question 7

────────────────────────────────────────────────────

QUESTION 7 - Measure Confidence Increase (MANDATORY - PRIMARY METRIC):
────────────────────────────────────────────────────
"Where's your confidence now, 1-10?"

→ Extract: current_confidence
→ Calculate increase: current_confidence - initial_confidence
→ ⚠️ CELEBRATE THE INCREASE!

CONDITIONAL RESPONSE:

IF increase >= 3 points:
  → "That's a +[X] point increase - you've had a real shift! What changed for you?"
  → Extract: what_shifted
  → This is a transformation - celebrate it!
  → Move to MAPPING stage

IF increase 1-2 points:
  → "That's movement in the right direction. What helped you get from [initial] to [current]?"
  → Extract: what_shifted
  → Move to MAPPING stage

IF increase 0 or negative:
  → "Your confidence is still at [X]/10. What would need to happen for it to increase?"
  → Consider: revisit personal benefit, mine more past successes
  → Don't force advance - build more confidence first
  → Try Question 5 again with different angle

TARGET: Confidence increase of +3 to +4 points (e.g., 3 → 6, 4 → 7)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END STATE CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before advancing to MAPPING, verify:
✅ initial_confidence recorded (MANDATORY)
✅ current_confidence recorded (MANDATORY)
✅ Confidence increased by at least +1 point (ideally +3)
✅ personal_benefit identified (NOT organizational benefit)
✅ past_success captured with transferable_strengths
✅ limiting_beliefs challenged (if detected)
✅ User feels ready to identify action

IF ANY CRITICAL FIELD MISSING:
→ Go back and complete it
→ DO NOT advance to MAPPING without confidence transformation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Key Takeaways

### What GROW Does Better
1. ✅ **Explicit sequencing** - "Ask this, THEN that"
2. ✅ **Context extraction** - Checks if already answered
3. ✅ **Conditional logic** - "IF this, do that"
4. ✅ **WAIT instructions** - Forces AI to pause
5. ✅ **Validation loops** - Confirms understanding before moving

### What COMPASS Does Better
1. ✅ **Confidence metrics** - Measures transformation (3→6)
2. ✅ **AI nudges** - Contextual reframing techniques
3. ✅ **Examples** - Detailed success scenarios
4. ✅ **Emotional depth** - Handles limiting beliefs, past successes

### Synthesis - Enhanced COMPASS
Combine the best of both:
- GROW's structure + COMPASS's depth
- Sequential questions + AI nudges
- Explicit validation + confidence metrics
- Context extraction + transformation tracking

---

## Next Steps

1. ✅ Review this analysis with team
2. ✅ Prioritize which enhancements to implement first
3. ✅ Update `convex/prompts/compass.ts` with enhanced prompts
4. ✅ Test with real coaching sessions
5. ✅ Iterate based on results

---

## Questions for Discussion

1. Should we apply same level of detail to ALL 4 COMPASS stages, or start with OWNERSHIP (highest impact)?
2. Do we want to maintain COMPASS's 20-minute target with more detailed questioning?
3. Should we add question numbering to UI to show users progress through stage?
4. How do we balance prescription (follow steps) with flexibility (AI adaptation)?

---

**Document Status**: Draft for Review  
**Created**: 2025-01-23  
**Last Updated**: 2025-01-23  
**Next Review**: After team discussion

