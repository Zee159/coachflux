# GROW Reality Step - Risks Question Added

## Status: ✅ COMPLETE

## Problem
The Reality step completion logic required `risks` field to be filled, but the prompt didn't explicitly ask about risks. This created a mismatch where:
- **Code required:** `current_state` + `risks` + additional exploration (constraints/resources)
- **Prompt asked:** Only 3 questions (current situation, constraints, resources)
- **Result:** Users had to volunteer risk information or AI had to infer it

## Solution Implemented

### 1. Updated GROW_COACHING_QUESTIONS
Added explicit 4th question about risks:

```typescript
reality: [
  "What's the current situation?",
  "What's getting in the way?",
  "What resources do you have?",
  "What could derail your progress or put this at risk?" // ✅ NEW
]
```

### 2. Updated GROW_STEP_GUIDANCE
Enhanced Reality step guidance:

**Before:**
```
Ask 3-4 questions:
1. "What's the current situation?"
2. "What's getting in the way?"
3. "What resources do you have?"

Ready when: current_state + constraints filled
```

**After:**
```
Ask 4 questions progressively:
1. "What's the current situation?"
2. "What's getting in the way?"
3. "What resources do you have?"
4. "What could derail your progress or put this at risk?"

EXTRACT:
- current_state: Their description (from Q1)
- constraints: Barriers/limitations (from Q2)
- resources: What they have available (from Q3)
- risks: What could derail them (from Q4)

CRITICAL: Ask ALL 4 questions before advancing. Risks is REQUIRED.

Ready when: current_state + constraints + resources + risks all filled
```

## Completion Criteria (Unchanged in Code)

The completion logic in `convex/coach/grow.ts` remains the same:

**Progressive Relaxation:**
- **0 skips (strict):** `current_state` + `risks` + `constraints` + `resources` (all 4 fields)
- **1 skip (lenient):** `current_state` + `risks` + 1 of (constraints OR resources)
- **2 skips (very lenient):** `current_state` + `risks` only
- **Loop detected:** `current_state` + `risks` + 1 of (constraints OR resources)

**Key Point:** `risks` is ALWAYS required regardless of skip count.

## Impact

✅ **Prompt now matches code requirements**
- AI will explicitly ask about risks as the 4th question
- Users will be prompted to identify potential risks
- No more reliance on volunteered or inferred risk information

✅ **Better coaching quality**
- Comprehensive reality assessment
- Proactive risk identification
- More informed options generation

✅ **Clear completion criteria**
- All 4 fields explicitly requested
- Step won't advance until risks are captured
- Consistent with code logic

## Files Modified
- `convex/prompts/grow.ts` - Updated GROW_COACHING_QUESTIONS and GROW_STEP_GUIDANCE

## Verification
✅ TypeScript compilation: PASS
✅ Prompt guidance matches code requirements
✅ All 4 questions now explicitly asked
✅ Risks field will be properly extracted

## Next Steps
Deploy to production and test Reality → Options transition to confirm risks are being captured before advancing.
