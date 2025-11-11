# COMPASS Framework Analysis - Sequence, Logic & Flow Patterns

## Executive Summary

COMPASS is a **4-stage, 20-minute change navigation framework** with a clear transformation arc:
- **North Star:** "Will this increase the user's confidence?"
- **Target:** +3 to +4 point confidence increase (e.g., 3/10 → 7/10)
- **Architecture:** Introduction → Clarity → Ownership → Mapping → Practice

---

## 1. FRAMEWORK ARCHITECTURE

### Stage Breakdown (Time Allocation)
```
Introduction (2 min)  → Welcome, consent, framework explanation
Clarity (4 min)       → Understand change + CSS baseline measurement
Ownership (9 min)     → TRANSFORMATION STAGE - Build confidence
Mapping (5 min)       → Create ONE specific action
Practice (2 min)      → Lock commitment + CSS finals + celebrate
```

### Key Design Principles
1. **Progressive Questioning** - ONE question at a time, WAIT for response
2. **Opportunistic Extraction** - Extract all explicitly stated information
3. **Mandatory Field Validation** - Steps won't advance without required fields
4. **Confirmation Summaries** - Summarize captured data before advancing
5. **High-Confidence Branching** - Different paths for users at 8+/10 confidence

---

## 2. STEP-BY-STEP ANALYSIS

### INTRODUCTION (2 minutes)

**Objective:** Get consent and explain framework

**Question Flow:**
1. "Does this framework feel right for what you're facing today?"

**Schema Fields:**
- `user_consent_given` (boolean) - MANDATORY
- `coach_reflection` (string, 20-600 chars) - MANDATORY

**Completion Logic:**
```typescript
hasConsent = user_consent_given === true
shouldAdvance = hasConsent
```

**Pattern:**
- ✅ Simple boolean gate
- ✅ No complex validation
- ✅ Clear yes/no decision

---

### CLARITY (4 minutes → 7 questions)

**Objective:** Deep understanding of change + CSS baseline measurement

**Question Flow:**
```
Q1: What's changing? → change_description
Q2: How's it affecting you? → personal_impact
Q3: Understanding score (1-5) → clarity_score
Q4: Confidence baseline (1-10) → initial_confidence (CSS)
Q5: Mindset state → initial_mindset_state (CSS)
Q6a: Control level (button) → control_level (high/mixed/low)
Q6b: What can you control? → sphere_of_control
Q7: Anything else? (YES/NO button) → additional_context (optional)
```

**Schema Fields (8 total):**
1. ✅ `change_description` (string) - MANDATORY
2. ✅ `personal_impact` (string) - MANDATORY
3. ✅ `clarity_score` (1-5) - MANDATORY
4. ✅ `initial_confidence` (1-10) - MANDATORY (CSS BASELINE)
5. ✅ `initial_mindset_state` (string) - MANDATORY (CSS BASELINE)
6. ✅ `control_level` (high/mixed/low) - MANDATORY (CSS INSIGHT)
7. ✅ `sphere_of_control` (string, min 15 chars) - MANDATORY
8. ⭕ `additional_context` (string) - OPTIONAL
9. ✅ `q7_asked` (boolean) - MANDATORY FLAG

**Completion Logic:**
```typescript
// Count completed mandatory fields
completedFields = [
  hasChangeDescription,
  hasPersonalImpact,
  hasClarityScore,
  hasInitialConfidence,
  hasInitialMindsetState,
  hasControlLevel,
  hasSphereOfControl && isMeaningfulControl
].filter(Boolean).length;

// Check if Q7 was asked (even if skipped)
q7Handled = hasAdditionalContext || q7_asked === true;

// Require ALL 7 mandatory + Q7 asked
isComplete = completedFields === 7 && q7Handled;

if (isComplete) {
  return { shouldAdvance: false, awaitingConfirmation: true };
}
```

**Key Patterns:**
- ✅ **7 mandatory + 1 optional** field structure
- ✅ **Q7 flag** ensures completion summary appears AFTER Q7, not before
- ✅ **Meaningful control check** - rejects "nothing", "accept", "can't control"
- ✅ **Awaiting confirmation** - shows "Proceed to Ownership" buttons
- ✅ **Opportunistic extraction** - can capture multiple fields from one response

**Special Handling:**
- **Control reframe:** If user says "nothing", coach uses `control_clarification` nudge
- **Button selectors:** Q6a (control level) and Q7 (yes/no) trigger UI components
- **CSS baseline:** Q4-Q6 capture initial confidence measurements

---

### OWNERSHIP (9 minutes - TRANSFORMATION STAGE)

**Objective:** Transform fear → confidence through reframes and evidence

**🔀 HIGH-CONFIDENCE BRANCHING:**

#### Path A: High Confidence (initial_confidence >= 8)
**Question Flow (3 questions):**
```
Q1: Confidence Source → confidence_source
Q2: Personal Benefit → personal_benefit
Q3: Past Success → past_success {achievement, strategy}
```

**Required Fields:**
- ✅ `confidence_source` (string)
- ✅ `personal_benefit` (string)
- ✅ `past_success` (object with achievement + strategy)
- ⚠️ NO `ownership_confidence` needed (already at 8+)

**Minimum Conversation:** 3 reflections

#### Path B: Standard Confidence (initial_confidence < 8)
**Question Flow (7 questions):**
```
Q1: Explore Fears → primary_fears
Q2: Challenge Catastrophe → (reframe, no extraction)
Q3: Cost of Staying Stuck → cost_of_resistance
Q4: Personal Benefit Hunt → personal_benefit
Q5: Past Success Activation → past_success {achievement, strategy}
Q6: Mindset Shift Check → breakthrough_moment (optional)
Q7: Confidence Re-Check → ownership_confidence (1-10)
```

**Required Fields:**
- ✅ `ownership_confidence` (1-10) - Final confidence after transformation
- ✅ `personal_benefit` (string)
- ✅ `past_success` (object with achievement + strategy)

**Minimum Conversation:** 5 reflections

**Completion Logic:**
```typescript
// Get initial_confidence from CLARITY step
const clarityReflections = reflections.filter(r => r.step === 'clarity');
const initialConfidence = latestClarity?.payload?.['initial_confidence'];
const isHighConfidence = initialConfidence >= 8;

// Validate past_success structure
const hasPastSuccess = 
  typeof pastSuccessObj === "object" && 
  pastSuccessObj !== null &&
  typeof pastSuccessObj["achievement"] === "string" && 
  pastSuccessObj["achievement"].length > 0 &&
  typeof pastSuccessObj["strategy"] === "string" && 
  pastSuccessObj["strategy"].length > 0;

if (isHighConfidence) {
  // High-confidence path: 3 questions
  const hasMinConversation = ownershipReflections.length >= 3;
  isComplete = hasConfidenceSource && hasPersonalBenefit && hasPastSuccess && hasMinConversation;
} else {
  // Standard path: 7 questions
  const hasMinConversation = ownershipReflections.length >= 5;
  isComplete = hasOwnershipConfidence && hasPersonalBenefit && hasPastSuccess && hasMinConversation;
}

if (isComplete) {
  return { shouldAdvance: false, awaitingConfirmation: true };
}
```

**Key Patterns:**
- ✅ **Dynamic branching** based on initial_confidence from Clarity
- ✅ **Strict past_success validation** - requires both achievement AND strategy
- ✅ **Minimum conversation enforcement** - prevents premature advancement
- ✅ **Safety check for job loss** - skips Q2/Q3 if user mentioned redundancy
- ✅ **AI assistance** - offers suggestions if user says "I don't know"

**Special Handling:**
- **Redundancy-specific framing:** Different language for job loss vs. other fears
- **Opportunistic extraction:** Can capture personal_benefit or past_success from Q1 response
- **7 Confidence Techniques:** Evidence over encouragement, past success activation, etc.

---

### MAPPING (5 minutes → 5 questions)

**Objective:** Build ONE specific action with 8+/10 commitment confidence

**Question Flow:**
```
Q1: ONE Action → committed_action
Q2: Make It Specific → action_day, action_time
Q3: Obstacle Preparation → obstacle, backup_plan
Q4: Support Activation → support_person
Q5: Commitment Confidence → commitment_confidence (1-10)
```

**Schema Fields:**
- ✅ `committed_action` (string) - MANDATORY
- ✅ `action_day` (string) - MANDATORY
- ✅ `action_time` (string) - MANDATORY
- ⭕ `action_duration_hours` (number) - OPTIONAL
- ⭕ `obstacle` (string) - OPTIONAL
- ⭕ `backup_plan` (string) - OPTIONAL
- ⭕ `support_person` (string) - OPTIONAL
- ✅ `commitment_confidence` (1-10) - MANDATORY (must be 7+)

**Completion Logic:**
```typescript
const hasCommittedAction = typeof payload["committed_action"] === "string" && payload["committed_action"].length > 0;
const hasActionDay = typeof payload["action_day"] === "string" && payload["action_day"].length > 0;
const hasActionTime = typeof payload["action_time"] === "string" && payload["action_time"].length > 0;
const commitmentConfidence = payload["commitment_confidence"];
const hasHighCommitment = typeof commitmentConfidence === "number" && commitmentConfidence >= 7;

// Require ALL 3 action fields + commitment confidence 7+
const isComplete = hasCommittedAction && hasActionDay && hasActionTime && hasHighCommitment;

if (isComplete) {
  return { shouldAdvance: false, awaitingConfirmation: true };
}
```

**Key Patterns:**
- ✅ **Extreme specificity enforcement** - day, time, exact action
- ✅ **Commitment confidence gate** - must be 7+ to advance
- ✅ **Action quality checks** - not too vague, not too big, within control
- ✅ **Opportunistic extraction** - can capture all 5 fields from one detailed response

**Special Handling:**
- **Action too vague:** "Let's make that more specific. What's the smallest concrete step?"
- **Action too big:** "What's the first 5% of that you could knock out this week?"
- **Commitment < 7:** Adjust action until confidence increases

---

### PRACTICE (2 minutes → 7 questions)

**Objective:** Lock commitment + capture CSS finals + celebrate transformation

**Question Flow:**
```
Q1: Final Commitment → (confirmation, no extraction)
Q2: Biggest Takeaway → key_takeaway
Q3: Final Confidence → final_confidence (1-10) - CSS Dimension 1
Q4: Final Action Clarity → final_action_clarity (1-10) - CSS Dimension 2
Q5: Final Mindset State → final_mindset_state - CSS Dimension 3
Q6: Session Satisfaction → user_satisfaction (1-10) - CSS Dimension 4
Q7: Helpfulness Reason → session_helpfulness_reason (optional)
```

**Schema Fields (CSS Finals):**
- ✅ `action_commitment_confidence` (1-10) - MANDATORY
- ✅ `key_takeaway` (string) - MANDATORY
- ✅ `final_confidence` (1-10) - MANDATORY (CSS)
- ✅ `final_action_clarity` (1-10) - MANDATORY (CSS)
- ✅ `final_mindset_state` (string) - MANDATORY (CSS)
- ✅ `user_satisfaction` (1-10) - MANDATORY (CSS)
- ⭕ `session_helpfulness_reason` (string) - OPTIONAL
- ⭕ `confidence_increase` (integer) - CALCULATED
- ⭕ `what_caused_shift` (string) - OPTIONAL

**Completion Logic:**
```typescript
const completedFields = [
  hasActionCommitmentConfidence,
  hasFinalConfidence,
  hasFinalActionClarity,
  hasFinalMindsetState,
  hasUserSatisfaction,
  hasKeyTakeaway
].filter(Boolean).length;

// Require at least 4 out of 6 CSS final fields
const isComplete = completedFields >= 4;

if (isComplete) {
  return { shouldAdvance: false, awaitingConfirmation: true };
}
```

**Key Patterns:**
- ✅ **CSS measurement completion** - captures all 4 dimensions
- ✅ **Celebration of progress** - calculates and highlights confidence increase
- ✅ **Opportunistic extraction** - can capture CSS measurements from takeaway response
- ✅ **Dynamic value replacement** - uses actual values from Clarity step
- ✅ **Progressive relaxation** - requires 4/6 fields minimum

**Special Handling:**
- **Confidence increase calculation:** `final_confidence - initial_confidence`
- **Control attribution:** "What caused that shift?" (Confidence Technique #6)
- **Final send-off:** Comprehensive summary with specific action details

---

## 3. CROSS-STEP PATTERNS

### Pattern 1: Progressive Questioning
**Rule:** ONE question at a time, WAIT for response

**Implementation:**
```
⚠️ CRITICAL: ASK ONLY THIS QUESTION - DO NOT ask Q2-Q7 yet!
→ Wait for user's response before asking next question
→ ONE QUESTION AT A TIME
```

**Why:** Prevents overwhelming users, allows opportunistic extraction

---

### Pattern 2: Opportunistic Extraction
**Rule:** Extract ALL explicitly stated information from any response

**Example:**
```
User (Q1): "We're restructuring. I'm worried about my role changing and 
how it affects my team's morale. I can control how I communicate with 
them but not whether my team stays together."

✅ EXTRACT IMMEDIATELY:
{
  "change_description": "restructuring",
  "personal_impact": "worried about role changing and team morale",
  "sphere_of_control": "how I communicate with my team",
  "coach_reflection": "I can hear your concern... [acknowledge all captured]. 
  Let me ask: on a scale of 1-5, how well do you understand what's happening?"
}
→ Skip to Q3 (next unanswered question)
```

**Why:** Reduces repetition, feels more natural, faster sessions

---

### Pattern 3: Mandatory Field Validation
**Rule:** Steps won't advance without ALL required fields

**Implementation:**
```typescript
// Check sidebar "CAPTURED DATA" before advancing
if (ANY mandatory field is missing) {
  ask corresponding question
  DO NOT try to advance
}
```

**Why:** Ensures data quality, prevents incomplete coaching

---

### Pattern 4: Confirmation Summaries
**Rule:** When all fields captured, provide summary and STOP asking questions

**Example:**
```
coach_reflection: "Let me summarize what we've clarified:
• Change: [change_description]
• Impact on you: [personal_impact]
• Your understanding: [clarity_score]/5
• Your confidence: [initial_confidence]/10
• Your mindset: [initial_mindset_state]
• Control level: [control_level]
• What you can control: [sphere_of_control]

Ready to build your ownership and confidence?"
```

**Then:** System shows "Proceed to Ownership" and "Amend Response" buttons

**Why:** Gives user control, allows corrections, clear transition

---

### Pattern 5: Dynamic Value Replacement
**Rule:** Replace placeholders with actual values from captured data

**Implementation:**
```
⚠️ CRITICAL: DYNAMIC VALUE REPLACEMENT
When you see {initial_confidence}, ALWAYS replace with ACTUAL VALUE.
Example: If initial_confidence = 3, say "You're at 3/10" 
NOT "You're at {initial_confidence}/10"
```

**Why:** Personalized coaching, shows AI is tracking progress

---

### Pattern 6: High-Confidence Branching
**Rule:** Different question flows based on initial_confidence

**Logic:**
```typescript
if (initial_confidence >= 8) {
  // HIGH-CONFIDENCE PATH: 3 questions
  // Skip fear exploration, focus on validation
} else {
  // STANDARD PATH: 7 questions
  // Full transformation journey
}
```

**Why:** Respects user's starting point, avoids patronizing high-confidence users

---

### Pattern 7: AI Assistance for "I Don't Know"
**Rule:** Offer context-aware suggestions when user is stuck

**Example (Ownership Q4):**
```
🤖 AI ASSISTANCE - If user says "I don't know":
OFFER SUGGESTIONS: "Let me share what I often see. Staying stuck can cost you:
• Constant stress and mental energy drain
• Missed opportunities to learn and grow
• Falling behind while others adapt
...
Do any of these resonate? What else might it cost you?"

WAIT for their response
⚠️ CRITICAL: Extract what THEY identify, not what you suggested
```

**Why:** Helps users articulate thoughts, maintains user ownership

---

## 4. COMPLETION LOGIC SUMMARY

### Step Completion Requirements

| Step | Mandatory Fields | Optional Fields | Min Conversation | Awaiting Confirmation |
|------|-----------------|-----------------|------------------|----------------------|
| **Introduction** | 1 (consent) | 0 | N/A | No |
| **Clarity** | 7 + Q7 flag | 1 (additional_context) | N/A | Yes |
| **Ownership (High)** | 3 | 2 | 3 reflections | Yes |
| **Ownership (Std)** | 3 | 2 | 5 reflections | Yes |
| **Mapping** | 4 (action + day + time + confidence 7+) | 3 | N/A | Yes |
| **Practice** | 6 (CSS finals) | 2 | N/A | Yes |

### Progressive Relaxation (Not Implemented in COMPASS)
- COMPASS uses **strict validation** - all mandatory fields required
- No skip-based relaxation like CAREER framework
- Exception: User can explicitly skip using skip button

---

## 5. KEY INSIGHTS & DESIGN STRENGTHS

### ✅ Strengths

1. **Clear Transformation Arc**
   - Measurable confidence increase (initial → final)
   - CSS dimensions capture multi-faceted progress

2. **Intelligent Branching**
   - High-confidence path respects user's starting point
   - Prevents patronizing users who are already confident

3. **Opportunistic Extraction**
   - Reduces repetition
   - Feels more conversational
   - Faster sessions

4. **Strict Validation**
   - Ensures data quality
   - Prevents incomplete coaching
   - Minimum conversation enforcement

5. **Button Selectors**
   - Control level (high/mixed/low)
   - Yes/No for Q7
   - Improves UX, reduces typing

6. **Safety Considerations**
   - Job loss detection and empathetic framing
   - Skips inappropriate questions (catastrophe challenge)

7. **Confirmation Summaries**
   - User sees what was captured
   - Can amend before advancing
   - Clear transitions

### ⚠️ Potential Issues to Review

1. **Ownership Minimum Conversation**
   - High-confidence: 3 reflections (seems low?)
   - Standard: 5 reflections (appropriate?)
   - Could users skip too quickly?

2. **Practice Completion**
   - Requires 4/6 CSS fields (66%)
   - Should it require 5/6 or 6/6 for complete data?

3. **Q7 Flag Complexity**
   - Requires both asking Q7 AND setting flag
   - Could AI forget to set flag?
   - Should backend handle this automatically?

4. **Past Success Validation**
   - Requires both achievement AND strategy
   - What if user gives great achievement but vague strategy?
   - Too strict?

5. **Commitment Confidence Gate**
   - Requires 7+ to advance from Mapping
   - What if user is honest but at 6/10?
   - Should coach adjust action or accept lower commitment?

---

## 6. COMPARISON TO CAREER FRAMEWORK

| Aspect | COMPASS | CAREER |
|--------|---------|--------|
| **Duration** | 20 minutes | 45-60 minutes |
| **Steps** | 4 (+ intro) | 4 (+ intro + review) |
| **Completion Logic** | Strict validation | Progressive relaxation |
| **Skip Handling** | No skip-based relaxation | 0/1/2 skips adjust requirements |
| **Branching** | High-confidence path | Industry-specific insights |
| **Measurement** | CSS (4 dimensions) | Confidence + clarity scores |
| **AI Assistance** | "I don't know" suggestions | Gap suggestions, roadmap generation |
| **Button Selectors** | Control level, Yes/No | Confidence scales (1-10) |
| **Opportunistic Extraction** | Yes, comprehensive | Yes, comprehensive |

---

## 7. NEXT STEPS FOR REVIEW

### Questions to Answer:
1. Is Ownership minimum conversation count appropriate?
2. Should Practice require 5/6 or 6/6 CSS fields?
3. Should Q7 flag be set automatically by backend?
4. Is past_success validation too strict?
5. Should commitment confidence gate be flexible?

### Testing Scenarios:
1. User provides all info in one response (opportunistic extraction)
2. User at 9/10 confidence (high-confidence path)
3. User mentions job loss (safety handling)
4. User says "I don't know" to personal benefit (AI assistance)
5. User at 6/10 commitment confidence (gate handling)

### Comparison Tasks:
1. Compare Ownership question flow to CAREER Assessment
2. Compare Mapping specificity to CAREER Roadmap
3. Compare CSS measurement to CAREER Review
4. Identify patterns that work well in both frameworks
5. Identify patterns that could be improved

---

## 8. CONCLUSION

COMPASS framework demonstrates **sophisticated coaching logic** with:
- ✅ Clear transformation arc (confidence increase)
- ✅ Intelligent branching (high-confidence path)
- ✅ Strict validation (data quality)
- ✅ Opportunistic extraction (natural conversation)
- ✅ Safety considerations (job loss handling)
- ✅ Confirmation summaries (user control)

**Overall Assessment:** Well-designed framework with clear patterns and strong validation logic. Minor improvements possible around minimum conversation counts and completion thresholds.

**Ready for detailed review:** Yes - patterns understood, logic documented, questions identified.
