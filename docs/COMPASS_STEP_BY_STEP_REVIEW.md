# COMPASS Framework - Step-by-Step Review & Improvement Recommendations

**Review Date:** November 11, 2025  
**Framework:** COMPASS (4-stage change navigation)  
**Comparison Baseline:** CAREER framework patterns

---

## EXECUTIVE SUMMARY

### Overall Assessment: ⚠️ GOOD (7.5/10)

**Strengths:**
- ✅ Intelligent high-confidence branching
- ✅ Comprehensive CSS measurement integration
- ✅ Strong opportunistic extraction patterns
- ✅ Empathetic safety considerations (job loss handling)
- ✅ Clear transformation arc with measurable outcomes

**Critical Issues Found:**
- 🔧 Inconsistent progressive relaxation (only Practice has it)
- 🔧 Minimum conversation counts too low (Ownership)
- 🔧 CSS completion threshold too lenient (4/6 = 66%)
- 🔧 Q7 flag complexity (manual flag setting required)
- 🔧 Commitment confidence gate too rigid (7+ required)

**Recommended Actions:**
1. Implement progressive relaxation across all steps
2. Increase Ownership min conversations (5→8 for standard, 3→5 for high)
3. Increase Practice CSS threshold (4/6 → 5/6 with all 4 dimensions required)
4. Remove Q7 flag OR auto-set in backend
5. Lower commitment gate (7+ → 6+)

---

## DETAILED FINDINGS BY STEP

### STEP 1: INTRODUCTION ✅ EXCELLENT (10/10)
- No issues found
- Clear consent gate, appropriate scope
- Matches CAREER pattern

### STEP 2: CLARITY ⚠️ GOOD (7/10)

**Issues:**
1. 🔧 Q7 flag complexity - requires manual `q7_asked = true` setting
2. 🔧 No progressive relaxation - always requires 7/7 fields
3. ⚠️ Fast pace - 7 questions in 4 minutes

**Recommendations:**
- Backend auto-set Q7 flag OR remove requirement
- Add progressive relaxation: 7/7 → 6/7 → 5/7
- Consider increasing to 5-6 minutes

### STEP 3: OWNERSHIP ⚠️ GOOD (7.5/10)

**Issues:**
1. 🔧 Min conversation counts too low (3 for high, 5 for standard)
2. ⚠️ Job loss detection not documented in code
3. ✅ past_success validation is appropriately strict

**Recommendations:**
- Increase min conversations: 3→5 (high), 5→8 (standard)
- Document job loss detection keywords
- Keep past_success validation as-is

### STEP 4: MAPPING ⚠️ GOOD (8/10)

**Issues:**
1. 🔧 Commitment confidence gate too rigid (requires 7+)
2. ✅ Optional fields appropriately optional
3. ✅ No min conversation count needed

**Recommendations:**
- Lower commitment gate to 6+ OR add escape hatch
- Keep optional fields as-is

### STEP 5: PRACTICE ⚠️ GOOD (7/10)

**Issues:**
1. 🔧 CSS threshold too lenient (4/6 = 66%)
2. ⚠️ Very fast pace (7 questions in 2 minutes)
3. 🔧 action_commitment_confidence not in question flow

**Recommendations:**
- Increase to 5/6 with all 4 CSS dimensions required
- Increase duration to 3-4 minutes
- Clarify action_commitment_confidence comes from Mapping

---

## CROSS-STEP ISSUES

### ISSUE 1: Inconsistent Progressive Relaxation 🔧 HIGH PRIORITY

**Problem:** Only Practice has progressive relaxation (4/6 threshold). Other steps require 100% of mandatory fields regardless of skip count.

**Impact:** Users can't effectively use skip button in Clarity, Ownership, Mapping.

**Recommendation:** Implement consistent progressive relaxation:

```typescript
// CLARITY
0 skips: 7/7 fields
1 skip: 6/7 fields  
2 skips: 5/7 fields

// OWNERSHIP (Standard)
0 skips: 4 fields (ownership_confidence, personal_benefit, past_success, primary_fears)
1 skip: 3 fields (ownership_confidence, personal_benefit, past_success)
2 skips: 2 fields (ownership_confidence, personal_benefit)

// MAPPING
0 skips: 4 fields + confidence 7+
1 skip: 3 fields + confidence 6+
2 skips: 3 fields (no confidence gate)

// PRACTICE
0 skips: 6/6 CSS fields
1 skip: 5/6 CSS fields
2 skips: 4/6 CSS fields (current)
```

### ISSUE 2: Skip Count Not Used in Coach Logic 🔧 MEDIUM PRIORITY

**Problem:** `checkStepCompletion()` receives `_skipCount` parameter but doesn't use it (underscore prefix indicates unused).

**Recommendation:** Remove underscore and implement skip-based logic OR remove parameter if not needed.

---

## PRIORITY MATRIX

### 🔴 HIGH PRIORITY (Must Fix)
1. Implement progressive relaxation across all steps
2. Increase Practice CSS threshold to 5/6 with all 4 dimensions
3. Increase Ownership min conversations (3→5, 5→8)

### 🟡 MEDIUM PRIORITY (Should Fix)
4. Remove Q7 flag complexity OR auto-set in backend
5. Lower Mapping commitment gate (7+ → 6+)
6. Clarify action_commitment_confidence source
7. Increase Clarity duration (4→5 min) OR reduce questions (7→6)
8. Increase Practice duration (2→3 min)

### 🟢 LOW PRIORITY (Nice to Have)
9. Document job loss detection keywords
10. Add escape hatch for commitment confidence gate

---

## COMPARISON TO CAREER FRAMEWORK

| Aspect | COMPASS | CAREER | Winner |
|--------|---------|--------|--------|
| Progressive Relaxation | ❌ Only Practice | ✅ All steps | CAREER |
| Opportunistic Extraction | ✅ Comprehensive | ✅ Comprehensive | TIE |
| Branching Logic | ✅ High-confidence path | ✅ Industry-specific | TIE |
| Safety Considerations | ✅ Job loss handling | ⚠️ Less explicit | COMPASS |
| CSS Measurement | ✅ 4 dimensions | ❌ Not applicable | COMPASS |
| Min Conversation Counts | ⚠️ Too low | ❌ Not used | NEITHER |
| Completion Thresholds | ⚠️ Inconsistent | ✅ Consistent | CAREER |
| Button Selectors | ✅ Control level, Yes/No | ✅ Confidence scales | TIE |

**Overall:** CAREER has more consistent completion logic, COMPASS has better safety and measurement.

---

## RECOMMENDED IMPLEMENTATION PLAN

### Phase 1: Critical Fixes (Week 1)
1. Add progressive relaxation to Clarity, Ownership, Mapping
2. Increase Practice CSS threshold to 5/6
3. Increase Ownership min conversations

### Phase 2: Medium Priority (Week 2)
4. Remove Q7 flag complexity
5. Lower Mapping commitment gate
6. Increase step durations

### Phase 3: Polish (Week 3)
7. Document job loss detection
8. Add escape hatches
9. Clarify field sources in documentation

---

## CONCLUSION

COMPASS framework is **well-designed** with strong transformation arc and intelligent branching. Main issues are **inconsistent completion logic** and **thresholds that are either too strict or too lenient**.

**Key Takeaway:** Implement progressive relaxation consistently across all steps to match CAREER's proven pattern.

**Next Steps:** Prioritize Phase 1 critical fixes for immediate improvement.
