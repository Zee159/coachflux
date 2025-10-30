# Opportunistic Extraction - Intelligent Multi-Field Extraction

**Status:** ✅ COMPLETE - Production Ready  
**Date:** October 30, 2025  
**Framework:** COMPASS (applicable to all frameworks)

## Problem Statement

Users were repeating information they'd already shared because the AI only extracted answers to the current question, missing information relevant to future questions in the same response.

### Example Scenario

**CLARITY Step - Question 1:** "What specific change are you dealing with?"

**User Response:** "We're restructuring the team, which affects 5 departments. I'm worried about resistance from the sales team, but marketing is supportive."

**Old Behavior:**
- AI extracted only: `change_description = "restructuring the team"`
- Later asked: "Who supports this change?" (user repeats: "marketing")
- Later asked: "Who resists this change?" (user repeats: "sales team")
- **Result:** User felt unheard, had to repeat themselves 2-3 times

**New Behavior:**
- AI extracts ALL available information:
  - `change_description = "restructuring the team affecting 5 departments"`
  - `supporters = ["marketing team"]`
  - `resistors = ["sales team"]`
- AI acknowledges: "I can see the restructure affects multiple departments, with marketing supportive but sales resistant..."
- Skips to next unanswered question
- **Result:** User feels heard, no repetition needed

---

## Solution: Opportunistic Extraction

### Core Principle

**Scan EVERY user response for information relevant to ANY question in the current step.**

Extract all explicitly stated information in a single pass, acknowledge what was captured, and skip to the next unanswered question.

---

## Implementation Architecture

### 1. Base Prompt System (`convex/prompts/index.ts`)

Added comprehensive opportunistic extraction rules:

**Key Components:**
- **How It Works:** 5-step process for multi-field extraction
- **Example Scenario:** CLARITY step with full extraction example
- **Validation Rules:** 3 critical rules (explicit, exact words, uncertainty)
- **Acknowledgment Patterns:** 4 templates for acknowledging captured data
- **Hallucination Prevention:** 8 safeguards to prevent AI from inferring data
- **Correction Mechanism:** User correction handling with examples

**Lines Added:** ~120 lines of guidance

---

### 2. COMPASS Step Guidance (`convex/prompts/compass.ts`)

Added step-specific opportunistic extraction examples:

#### CLARITY Step (Q1)
- Listens for: `sphere_of_control`, `supporters`, `resistors` in change description
- Example extraction with 4 fields from one response
- Acknowledgment pattern included

#### OWNERSHIP Step (Q2)
- Listens for: `personal_benefit`, `past_success` when exploring fears
- Example extraction with 3 fields from one response
- Shows how to acknowledge fears AND captured positives

#### MAPPING Step (Q1)
- Listens for: `action_day`, `action_time`, `obstacle`, `backup_plan`, `support_person`, `commitment_confidence`
- Example extraction with 7 fields from one response
- Demonstrates skipping Q2-Q5 when all info provided

#### PRACTICE Step (Q2)
- Listens for: `final_confidence`, `final_mindset_state`, `user_satisfaction` in takeaway response
- Example extraction with CSS measurements
- Shows how to skip CSS questions when already answered

**Lines Added:** ~80 lines across 4 steps

---

## Key Features

### 1. Smart Acknowledgment

AI acknowledges ALL captured information before asking next question:

**Patterns:**
- "I can see you've mentioned [X] and [Y]..."
- "Got it - you've shared [X] and [Y]. Let me ask about [Z]..."
- "Thanks for sharing [X] and [Y]. Now, regarding [Z]..."

**Purpose:** Shows user you're listening, prevents feeling of repetition

---

### 2. Hallucination Prevention (8 Safeguards)

#### 1. Explicit Statement Test
Only extract if user explicitly stated it.

**Example:**
- ✅ "My manager supports this" → Extract: `supporters = ["manager"]`
- ❌ "We're restructuring" → DO NOT extract: `supporters = ["leadership"]`

#### 2. Exact Words Principle
Use user's actual words, don't paraphrase.

**Example:**
- ✅ "I can control my response" → Extract exactly that
- ❌ "I can control my response" → DO NOT elaborate to "attitude, learning pace, actions"

#### 3. Uncertainty Threshold
If 10%+ uncertain, ask instead of extracting.

**Example:**
- "The team might be resistant" → ASK: "Which team members?"
- DO NOT extract: `resistors = ["team"]`

#### 4. Context Boundaries
Only extract fields relevant to current step.

**Example:**
- CLARITY step: Extract `change_description`, `sphere_of_control`, `supporters`, `resistors`
- DO NOT extract: `personal_benefit`, `committed_action` (future steps)

#### 5. Ambiguity Detection
Watch for vague statements.

**Example:**
- "I'll talk to someone" → ASK: "Who specifically?"
- DO NOT extract: `support_person = "someone"`

#### 6. Implied vs Stated
Distinguish between implications and statements.

**Example:**
- ✅ "My boss is supportive" → Extract: `supporters = ["boss"]`
- ❌ "Company-wide implementation" → DO NOT extract: `supporters = ["leadership"]`

#### 7. Negative Evidence
Don't assume opposites.

**Example:**
- "Sales team is resistant" → Extract: `resistors = ["sales team"]`
- DO NOT extract: `supporters = ["other teams"]`

#### 8. Confidence Calibration
Rate extraction confidence:
- **100%:** Explicit and clear → EXTRACT
- **80-99%:** Strongly implied → ASK for confirmation
- **<80%:** Uncertain → DO NOT extract, ASK

---

### 3. User Correction Mechanism

Users can correct misextracted information.

**Correction Signals:**
- "Actually, that's not quite right..."
- "No, I meant..."
- "Let me clarify..."
- "That's not what I said..."

**AI Response:**
1. IMMEDIATELY update field with correction
2. Apologize briefly: "My apologies - I've updated that to [correction]."
3. Continue with next question
4. DO NOT argue or defend interpretation

**Example:**

AI extracted: `supporters = ["marketing team"]`  
User: "Actually, I didn't say marketing supports it - I said they're affected by it."

✅ **Correct Response:**
```json
{
  "supporters": [],
  "coach_reflection": "My apologies - I've corrected that. Marketing is affected, but you haven't mentioned who supports the change yet. Who, if anyone, is supportive of this restructure?"
}
```

---

## Benefits

### User Experience
- ✅ **No Repetition:** Users don't repeat information they've already shared
- ✅ **Feels Heard:** AI acknowledges all captured information
- ✅ **Natural Flow:** Conversation feels more human and intelligent
- ✅ **Faster Sessions:** Fewer questions needed per step

### Technical
- ✅ **Fewer API Calls:** Skip questions = fewer turns = lower cost
- ✅ **Better Data Quality:** Captures information when user is most engaged
- ✅ **Hallucination Prevention:** 8 safeguards prevent AI from inventing data
- ✅ **Error Recovery:** Correction mechanism allows users to fix mistakes

---

## Testing Scenarios

### Scenario 1: CLARITY - Full Multi-Field Extraction

**User Input:** "We're moving to a new CRM system. I can't control the decision, but I can control how I learn it. My manager is supportive but the sales team is resistant."

**Expected AI Behavior:**
1. Extract 4 fields: `change_description`, `sphere_of_control`, `supporters`, `resistors`
2. Acknowledge: "I can see the CRM change is happening, with your manager supportive but sales resistant. You've identified you can control your learning approach."
3. Skip to Q2 (understanding check)
4. DO NOT re-ask about control or stakeholders

---

### Scenario 2: OWNERSHIP - Partial Multi-Field Extraction

**User Input:** "I'm worried I won't have time to learn this properly. Though I guess if I master it, it could open up new opportunities."

**Expected AI Behavior:**
1. Extract 2 fields: `primary_fears`, `personal_benefit`
2. Acknowledge: "Time pressure is a real concern. But I notice you mentioned potential opportunities."
3. Continue with Q3 (challenge catastrophe)
4. Skip Q5 (personal benefit) later since already captured

---

### Scenario 3: MAPPING - Complete Action Details

**User Input:** "I'll complete the training module on Tuesday morning at 10am. The main obstacle is finding quiet time, so I'll book a meeting room. My colleague Sarah can help if I get stuck. I'm pretty confident - maybe 8/10."

**Expected AI Behavior:**
1. Extract 7 fields: `committed_action`, `action_day`, `action_time`, `obstacle`, `backup_plan`, `support_person`, `commitment_confidence`
2. Acknowledge: "Excellent! You've got a solid plan: training module Tuesday at 10am, meeting room booked for quiet time, and Sarah as backup. That 8/10 confidence shows you're ready."
3. Skip Q2-Q5 entirely
4. Move directly to Practice step (final commitment)

---

### Scenario 4: User Correction

**AI Extracted:** `supporters = ["marketing team"]`  
**User:** "Actually, I didn't say marketing supports it - I said they're affected by it."

**Expected AI Behavior:**
1. Update: `supporters = []`
2. Apologize: "My apologies - I've corrected that."
3. Ask properly: "Who, if anyone, is supportive of this restructure?"

---

## Monitoring & Metrics

### Success Metrics
- **Skip Rate:** % of questions skipped due to opportunistic extraction
- **Correction Rate:** % of extractions that users correct
- **Session Length:** Average turns per step (should decrease)
- **User Satisfaction:** CSS satisfaction scores (should increase)

### Quality Metrics
- **Hallucination Rate:** % of extractions that are incorrect/inferred
- **Acknowledgment Rate:** % of multi-field extractions that include acknowledgment
- **Repetition Rate:** % of times users repeat information

### Target Benchmarks
- Skip Rate: 15-25% (healthy opportunistic extraction)
- Correction Rate: <5% (high accuracy)
- Hallucination Rate: <2% (strict validation working)
- Repetition Rate: <10% (users rarely repeat themselves)

---

## Future Enhancements

### 1. Cross-Step Extraction (Phase 2)
Allow extraction of information for NEXT step if user volunteers it.

**Example:**
- In CLARITY, user mentions: "I'm worried about time pressure"
- Extract for OWNERSHIP step: `primary_fears = ["time pressure"]`
- When OWNERSHIP starts, acknowledge: "Earlier you mentioned time pressure as a concern..."

**Complexity:** High - requires careful step boundary management

---

### 2. Proactive Confirmation (Phase 2)
AI proactively confirms ambiguous extractions.

**Example:**
- User: "The team is resistant"
- AI: "Just to confirm - which team specifically is resistant?"
- Prevents incorrect extraction before it happens

**Complexity:** Medium - requires ambiguity detection logic

---

### 3. Extraction Confidence Scores (Phase 3)
Track AI's confidence in each extraction for analytics.

**Purpose:**
- Identify patterns in low-confidence extractions
- Improve validation rules based on correction data
- Provide transparency to users ("I think you mentioned X - is that right?")

**Complexity:** Medium - requires metadata tracking

---

## Files Modified

### Primary Changes
1. **`convex/prompts/index.ts`** - Base opportunistic extraction system
   - Lines 151-254: Opportunistic extraction rules
   - Lines 255-302: Correction mechanism

2. **`convex/prompts/compass.ts`** - Step-specific examples
   - Lines 166-182: CLARITY Q1 opportunistic extraction
   - Lines 205-209: CLARITY Q3 skip check
   - Lines 331-353: OWNERSHIP Q2 opportunistic extraction
   - Lines 481-500: MAPPING Q1 opportunistic extraction
   - Lines 622-637: PRACTICE Q2 opportunistic extraction

### Documentation
3. **`docs/04-features/OPPORTUNISTIC_EXTRACTION.md`** - This file

---

## Verification

✅ TypeScript compilation: PASS  
✅ All safeguards implemented  
✅ Examples provided for all major steps  
✅ Correction mechanism included  
✅ Documentation complete  

---

## Deployment Notes

**No breaking changes** - This is purely prompt enhancement. Existing sessions will benefit immediately.

**Rollout:** Can deploy directly to production. Monitor correction rate and hallucination rate for first 100 sessions.

**Rollback:** If issues arise, revert `convex/prompts/index.ts` and `convex/prompts/compass.ts` to previous versions.

---

## Summary

Opportunistic extraction transforms COMPASS coaching from a rigid Q&A flow into an intelligent conversation that:
- Listens for ALL relevant information in each response
- Acknowledges what was captured to show understanding
- Skips questions the user has already answered
- Prevents hallucination with 8 strict safeguards
- Allows users to correct misunderstandings

**Result:** Users feel heard, sessions are faster, and data quality is higher.

**Status:** ✅ Production ready - Deploy when ready
