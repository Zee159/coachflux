# COMPASS Score Auto-Fill Bug - Additional Fix

**Date**: October 22, 2025  
**Status**: ✅ FIXED - Deployed to Production

## Problem Discovered After Initial Fix

Even after implementing the first round of fixes, the AI was **still auto-filling `clarity_score`** without the user providing a number:

### Example from User's Session:
```
Turn 1: User: "change of CRM" 
        AI filled: clarity_score: 0 ❌

Turn 2: User: "new serum altogether"
        AI filled: clarity_score: 1 ❌

Turn 3: User: described systems
        AI filled: clarity_score: 2 ❌
```

**User NEVER said**: "my clarity is 0" or "I'd rate it a 2"  
**AI was INFERRING** scores based on conversation progress.

## Root Cause

The prompts had **contradictory instructions**:

### Issue #1: Prompt Said "Extract" Without Conditions
```typescript
QUESTION 5 - Clarity Assessment:
- "On a scale of 1-5, how clear are you on the change landscape?"
- Extract clarity_score  // ❌ No condition!
```

This told the AI: "Always extract the score" → AI inferred it from context.

### Issue #2: Example Showed Empty Arrays
```typescript
✅ CORRECT - Progressive questioning:
AI Response: {
  "change_description": "Moving to remote work",
  "supporters": [],      // ❌ Still showing empty arrays!
  "resistors": [],       // ❌ Contradicts our new rules!
  "coach_reflection": "..."
}
```

This example **contradicted** our "DO NOT include empty arrays" rule.

## Fix Applied

### Change #1: Conditional Score Extraction

**Before**:
```
- Extract clarity_score
```

**After**:
```
- ONLY extract clarity_score if user gives you a NUMBER
- DO NOT infer or guess the score based on their responses
```

Applied to ALL score fields:
- `clarity_score` (CLARITY step)
- `ownership_score` (OWNERSHIP step)
- `mapping_score` (MAPPING step)
- `practice_score` (PRACTICE step)
- `anchoring_score` (ANCHORING step)
- `sustaining_score` (SUSTAINING step)

### Change #2: Updated Examples to NOT Include Empty Arrays

**Before**:
```typescript
✅ CORRECT:
AI Response: {
  "change_description": "Moving to remote work",
  "supporters": [],      // ❌ Bad example!
  "resistors": [],
  "coach_reflection": "..."
}
```

**After**:
```typescript
✅ CORRECT:
AI Response: {
  "change_description": "Moving to remote work",
  "coach_reflection": "..."  // ✅ Only what user provided!
}
✅ CORRECT - AI captured the change but DID NOT include supporters/resistors arrays yet
```

### Change #3: Added Explicit "DO NOT include" Rules

Added to CRITICAL sections:
```
⚠️ CRITICAL - DO NOT auto-fill:
- DO NOT include clarity_score unless user explicitly gives you a number (1-5)
- DO NOT include supporters/resistors arrays unless user mentions specific people/groups
```

## Expected Behavior After Fix

### Scenario: User Describes Change Without Giving Score

**User Input**: "We're moving to a new CRM system"

**AI Response (CORRECT)**:
```json
{
  "change_description": "Moving to a new CRM system",
  "coach_reflection": "What problem is this change trying to solve?"
}
```

**NO** `clarity_score` field included because user didn't give a number!

### Scenario: User Gives Explicit Score

**User Input**: "I'd say my clarity is about a 3 out of 5"

**AI Response (CORRECT)**:
```json
{
  "clarity_score": 3,
  "coach_reflection": "Thanks for that. What else would help increase your clarity?"
}
```

**NOW** `clarity_score` is included because user explicitly provided it!

## Files Modified

- `convex/prompts/compass.ts` (lines 88-99, 112-118, 158-165, 236-239, 339-345, 419-422, 516-522)

## Testing Instructions

1. **Start a new COMPASS session**
2. **CLARITY step**: Describe a change WITHOUT mentioning a clarity score
3. **Check the UI**: The "Clarity Score" field should remain **empty** or show **0** (not 1, 2, 3)
4. **Check debug logs**: Payload should NOT contain `clarity_score` field
5. **When AI asks**: "On a scale of 1-5, how clear are you?"
6. **User responds**: "I'd say a 3"
7. **Check the UI**: NOW the "Clarity Score" should show **3**

## Success Criteria

✅ **No scores appear until user explicitly provides a number**  
✅ **No empty arrays appear in JSON responses**  
✅ **AI asks all 5 CLARITY questions progressively**  
✅ **Scores only extracted when user says "I'd rate it X" or "It's a 3"**  
✅ **Debug logs show clean payloads without inferred data**

## Deployment

- ✅ Deployed to production: `https://original-owl-376.convex.cloud`
- ✅ Changes live immediately (no frontend rebuild needed)

## Related Fixes

This is a **follow-up fix** to the initial COMPASS bug fixes documented in `COMPASS_BUG_FIXES.md`.

**Previous fixes**:
1. Debug logging added
2. Schema `additionalProperties: false`
3. Strengthened base prompts

**This fix**:
4. Conditional score extraction in COMPASS prompts
5. Corrected examples to not show empty arrays
6. Explicit "DO NOT include unless..." rules for all scores
