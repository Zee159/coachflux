# COMPASS Enhancement Summary - Step-by-Step Question Flow

## TL;DR

**Problem**: COMPASS coaching lacks the explicit step-by-step question guidance that makes GROW coaching predictable and systematic.

**Solution**: Enhance COMPASS prompts with GROW-style sequential questioning while preserving COMPASS's strengths (confidence metrics, AI nudges, transformation focus).

**Impact**: More consistent coaching experiences, better context awareness, clearer progression through stages.

**Effort**: ~8-10 hours total implementation + testing

---

## Side-by-Side Comparison

### GROW (Current State) ✅

```typescript
goal: `GOAL PHASE - Clarify and Focus

CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CRITICAL):
- If user ALREADY stated their goal, extract it into the "goal" field
- If they ALREADY mentioned timeframe, extract it into "timeframe" field
- DO NOT ask for information they've ALREADY provided

QUESTION 1 - Ask for Goal:
"What outcomes would you like to achieve?"
→ Extract: goal
→ WAIT for response
→ DO NOT move to Question 2 until you have goal

QUESTION 2 - Why Now:
"Why is this important to you right now?"
→ Extract: why_now
→ Move to Question 3

QUESTION 3 - Success Criteria:
IF goal is MEASURABLE (has specific numbers):
  → SKIP this question (redundant)
  → Move directly to Question 4
ELSE:
  → "What would success look like?"
  → Extract: success_criteria
  → Move to Question 4
```

**Key Features**:
- ✅ Explicit question numbering
- ✅ Context extraction rules
- ✅ Conditional logic (IF/THEN)
- ✅ WAIT instructions
- ✅ "DO NOT" warnings

---

### COMPASS OWNERSHIP (Current State) ⚠️

```typescript
ownership: `OWNERSHIP STAGE (8 minutes)

OBJECTIVE: Transform resistance → acceptance → commitment

⚡ PROGRESSIVE QUESTIONING FLOW:

QUESTION 1 - Initial Confidence
QUESTION 2 - Explore Fears
QUESTION 3 - Resistance Cost
QUESTION 4 - Find Personal Benefit
QUESTION 5 - Past Success Activation
QUESTION 6 - Challenge Limiting Beliefs
QUESTION 7 - Measure Confidence Increase
```

**Current Strengths**:
- ✅ Clear objectives
- ✅ Confidence metrics (3/10 → 6+/10)
- ✅ Rich AI nudges
- ✅ Detailed examples

**Gaps vs GROW**:
- ❌ Less explicit sequencing
- ❌ No context extraction rules
- ❌ No conditional logic
- ❌ No WAIT instructions
- ❌ No validation loops

---

### COMPASS OWNERSHIP (Enhanced Version) ✅

```typescript
ownership: `OWNERSHIP STAGE (8 minutes)

OBJECTIVE: Transform resistance → acceptance → commitment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CHECK FIRST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ IF user ALREADY stated initial confidence:
   → Extract: initial_confidence
   → Move DIRECTLY to Question 2 (DO NOT re-ask)

✅ IF user ALREADY mentioned fears/worries:
   → Extract them
   → Reference: "You mentioned [fear] earlier..."
   → Move to Question 3

[... full context extraction rules ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROGRESSIVE QUESTIONING FLOW (FOLLOW THIS SEQUENCE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTION 1 - Initial Confidence (MANDATORY):

Ask: "On 1-10, how confident do you feel about navigating this successfully?"

→ Extract: initial_confidence (number 1-10)
→ ⚠️ WAIT for explicit number
→ DO NOT guess, auto-fill, or assume
→ DO NOT move to Question 2 until you have number

CONDITIONAL RESPONSE:

IF initial_confidence >= 7 (HIGH):
  → "That's strong! What's giving you that confidence?"
  → SKIP Question 2 (Explore Fears)
  → Move DIRECTLY to Question 4

IF initial_confidence 4-6 (MODERATE):
  → "What's holding you back from being more confident?"
  → Proceed to Question 2

IF initial_confidence <= 3 (LOW):
  → "That's tough. What specifically makes you feel unconfident?"
  → USE NUDGE: catastrophe_reality_check
  → Proceed to Question 2 with extra empathy

[... full question flow with conditionals ...]
```

**New Features Added**:
- ✅ Explicit context extraction
- ✅ Conditional branching logic
- ✅ WAIT instructions throughout
- ✅ Validation requirements
- ✅ Edge case handling
- ✅ Completion checklist

---

## What Makes GROW Coaching Effective

### 1. **Context Awareness**
```typescript
CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CRITICAL):
- If user ALREADY stated their goal → Extract it, don't re-ask
- DO NOT ask for information they've ALREADY provided
- Move to NEXT question
```

**Why it matters**: Users get frustrated repeating themselves.

---

### 2. **Explicit Sequencing**
```typescript
QUESTION 1 - Ask for Goal:
→ Extract: goal
→ WAIT for response
→ DO NOT move to Question 2 until you have goal

QUESTION 2 - Why Now:
→ Extract: why_now
→ Move to Question 3
```

**Why it matters**: AI knows exactly what to ask next, reducing ambiguity.

---

### 3. **Conditional Logic**
```typescript
IF goal is MEASURABLE (has numbers):
  → SKIP success criteria question (redundant)
  → Move directly to timeframe
ELSE:
  → ASK: "What would success look like?"
```

**Why it matters**: Avoids robotic questioning, adapts to context.

---

### 4. **Validation Loops**
```typescript
IF user gives ORGANIZATIONAL benefit:
  → PUSH BACK: "That's for the organization. What's in it for YOU?"
  → WAIT for personal benefit
```

**Why it matters**: Ensures quality of responses before moving forward.

---

### 5. **Edge Case Handling**
```typescript
IF user says "Nothing" or struggles:
  → OFFER AI suggestions as questions
  → VALIDATE: "Do any resonate?"
  → WAIT for confirmation
```

**Why it matters**: Handles common coaching obstacles gracefully.

---

## Recommended Enhancements for COMPASS

### Priority 1: OWNERSHIP Stage (Highest Impact)

**Why OWNERSHIP first?**
- Most complex stage (7 questions)
- Highest transformation value (+3 confidence points)
- Most edge cases (limiting beliefs, catastrophizing, etc.)
- Most AI nudges to integrate

**Enhancements needed**:
1. ✅ Add context extraction rules
2. ✅ Add explicit question sequencing (Q1 → Q2 → Q3...)
3. ✅ Add conditional logic (IF confidence >= 7, SKIP fears)
4. ✅ Add WAIT instructions
5. ✅ Add validation loops (push back on organizational benefits)
6. ✅ Add edge case handling
7. ✅ Add completion checklist

**Estimated effort**: 3-4 hours

---

### Priority 2: CLARITY Stage

**Enhancements needed**:
1. Context extraction (check if already described change)
2. Sequential questions (Q1: What's changing → Q2: Understanding → Q3: Sphere of control)
3. Conditional logic (IF clarity_score 1-2, dig deeper)
4. WAIT instructions

**Estimated effort**: 2 hours

---

### Priority 3: MAPPING Stage

**Enhancements needed**:
1. Context extraction (check if action already mentioned)
2. Sequential questions (Q1: Action → Q2: Day/time → Q3: Obstacle → Q4: Backup → Q5: Support)
3. Validation (vague action → push for specificity)
4. Edge case handling (action too big → reduce scope)

**Estimated effort**: 2-3 hours

---

### Priority 4: PRACTICE Stage

**Enhancements needed**:
1. Context extraction
2. Sequential questions
3. Conditional logic (IF commitment < 8, boost to 10)
4. Validation

**Estimated effort**: 1-2 hours

---

## Implementation Plan

### Phase 1: Enhance OWNERSHIP (Week 1)

**Day 1-2: Update Prompts**
- [ ] Copy enhanced OWNERSHIP prompt from docs/COMPASS_ENHANCED_OWNERSHIP_EXAMPLE.md
- [ ] Integrate into convex/prompts/compass.ts
- [ ] Preserve existing AI nudges
- [ ] Add context extraction section
- [ ] Add completion checklist

**Day 3-4: Test & Validate**
- [ ] Run 10 test sessions with different personas
- [ ] Verify context extraction works
- [ ] Verify conditional logic triggers correctly
- [ ] Verify confidence metrics calculated properly
- [ ] Compare to current OWNERSHIP version

**Day 5: Iterate & Deploy**
- [ ] Fix any issues found in testing
- [ ] Deploy to production
- [ ] Monitor first 20 real sessions
- [ ] Gather feedback

---

### Phase 2: Enhance Other Stages (Week 2)

**Apply same pattern to**:
- [ ] CLARITY stage
- [ ] MAPPING stage
- [ ] PRACTICE stage

**Test & validate each**

---

### Phase 3: Measure Impact (Week 3)

**Metrics to track**:
- Average confidence increase (target: +3 points)
- Stage completion rate (% users who complete stage)
- Re-asking rate (how often AI re-asks same question)
- User satisfaction (qualitative feedback)
- Session duration (should stay ~20 min)

**Compare**:
- Enhanced COMPASS vs Current COMPASS
- COMPASS vs GROW (consistency, completion rates)

---

## Quick Wins You Can Implement Today

### 1. Add Context Extraction Header (5 minutes)

Add to top of each COMPASS stage:

```typescript
CONTEXT EXTRACTION FROM CONVERSATION HISTORY (CRITICAL):
Before asking ANY question, check if user ALREADY provided information:
- If ALREADY mentioned [key field] → Extract it, don't re-ask
- Move to NEXT unanswered question
```

---

### 2. Add WAIT Instructions (10 minutes)

After each question, add:

```typescript
→ ⚠️ WAIT for user response
→ DO NOT move to next question until you have [field]
```

---

### 3. Add Completion Checklist (10 minutes)

At end of each stage:

```typescript
STAGE COMPLETION CHECKLIST:
Before advancing, verify:
✅ [mandatory_field_1] - [description]
✅ [mandatory_field_2] - [description]

IF ANY MISSING:
→ Go back and complete it
→ DO NOT advance without mandatory fields
```

---

## Example User Flows

### Current COMPASS (Can Be Repetitive)

```
AI: "How confident do you feel about this change?"
User: "About a 3. I'm not good at tech."
AI: "What's making you feel unconfident?"
User: "I said I'm not good at tech."
AI: "What personal benefits might you gain?"
User: "I don't know."
AI: "What if you could build new skills?"
User: "Maybe."
AI: "What's a time you handled change before?"
User: "When we moved to Slack."
AI: "How confident are you now?"
User: "Still about 3."
→ No transformation, repetitive questioning
```

---

### Enhanced COMPASS (Context-Aware & Progressive)

```
AI: "On 1-10, how confident do you feel about this change?"
User: "About a 3. I'm not good at tech."
[AI extracts: initial_confidence: 3, limiting_belief: "not good at tech"]

AI: "That's a tough place to start. What's the worst that could realistically happen?"
[Uses catastrophe_reality_check nudge immediately]
User: "I guess... I'd be slower at first. Need to ask for help."

AI: "So even worst-case, you'd handle it by asking for help. What could you gain personally if you adapt well?"
User: "I don't see any benefit."

AI: "Some leaders have found: Could this build career-advancing skills? Might you become a valuable expert? Do any resonate?"
[Offers AI suggestions, waits for validation]
User: "The expert thing. I did that with Slack actually."

AI: "You became a Slack expert! You called yourself 'not good at tech' but you're the Slack expert. What if that story isn't accurate?"
[Uses evidence_confrontation with their own past success]
User: "Huh. I guess I CAN learn tech. I just need time."

AI: "Exactly. Where's your confidence now, 1-10?"
User: "Maybe 6. I'm not scared anymore."

[Calculates: +3 point increase, SUCCESS]
AI: "That's a +3 point increase! You've had a real shift. Ready to identify your action?"
→ Clear transformation, context-aware, no repetition
```

---

## Benefits of Enhanced Approach

### For Users
- ✅ No repetitive questioning
- ✅ Feels like conversation, not interrogation
- ✅ Clear progress through stages
- ✅ Better confidence transformation

### For Coaches (AI)
- ✅ Clear decision logic
- ✅ Knows what to ask next
- ✅ Handles edge cases gracefully
- ✅ Measures success clearly

### For Product
- ✅ More consistent experiences
- ✅ Higher completion rates
- ✅ Better metrics tracking
- ✅ Easier to debug issues

---

## Risks & Mitigations

### Risk 1: Prompts Become Too Long
**Mitigation**: Keep core logic, move examples to separate section

### Risk 2: Too Rigid/Prescriptive
**Mitigation**: Preserve AI flexibility with "Consider..." language, not "MUST"

### Risk 3: Breaks Existing Behavior
**Mitigation**: Test thoroughly, have rollback plan, deploy gradually

### Risk 4: Increases LLM Token Usage
**Mitigation**: Monitor costs, optimize prompts after testing

---

## Success Criteria

### Quantitative
- [ ] Confidence increase >= +3 points (80% of sessions)
- [ ] Re-asking rate < 10% (currently ~30%)
- [ ] Stage completion rate >= 90%
- [ ] Session duration stays ~20 minutes

### Qualitative
- [ ] Users report "AI understood me better"
- [ ] Fewer "AI keeps asking same thing" complaints
- [ ] Smoother transitions between stages
- [ ] Clearer coaching progression

---

## FAQs

### Q: Won't this make prompts too long?
**A**: GROW prompts are already this detailed and work well. Users prefer clear guidance over ambiguity.

### Q: Will this slow down conversations?
**A**: No - it actually speeds up by avoiding repetitive questioning and dead ends.

### Q: Can we keep AI nudges with this structure?
**A**: Yes! Enhanced version integrates nudges with "USE NUDGE: [name]" instructions.

### Q: Do we need to change the backend code?
**A**: No - this is prompt-only changes. Schema and logic stay the same.

### Q: What if users don't follow the flow?
**A**: Context extraction handles this - AI extracts from wherever user provides info.

---

## Next Steps

### Immediate (Today)
1. ✅ Review this analysis
2. ✅ Review enhanced OWNERSHIP example
3. ✅ Decide: Implement or iterate?

### This Week
1. [ ] Implement enhanced OWNERSHIP stage
2. [ ] Test with 10-20 sessions
3. [ ] Measure confidence transformation metrics

### Next Week
1. [ ] Apply pattern to CLARITY, MAPPING, PRACTICE
2. [ ] Full system testing
3. [ ] Production deployment

---

## Resources

- **Analysis Document**: `docs/COMPASS_STEP_BY_STEP_ANALYSIS.md`
- **Enhanced OWNERSHIP Example**: `docs/COMPASS_ENHANCED_OWNERSHIP_EXAMPLE.md`
- **Current GROW Prompts**: `convex/prompts/grow.ts`
- **Current COMPASS Prompts**: `convex/prompts/compass.ts`

---

## Contact & Questions

Questions about this enhancement? Want to discuss implementation approach?

**Key Stakeholders**:
- Product: Define success metrics
- Engineering: Implementation timeline
- Design: UI considerations for question progress
- Operations: Rollout strategy

---

**Document Status**: Ready for Team Review  
**Created**: 2025-01-23  
**Estimated Implementation**: 8-10 hours total  
**Expected Impact**: High (better UX, higher completion rates)  
**Risk Level**: Low (prompt-only changes, fully reversible)

