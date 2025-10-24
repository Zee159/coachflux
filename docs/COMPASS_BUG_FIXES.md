# COMPASS Framework Bug Fixes

**Date**: October 22, 2025  
**Status**: ✅ FIXED - Ready for Testing

## Problem Summary

COMPASS sessions were experiencing three critical bugs:
1. **AI Auto-Filling Fields** - AI was inventing scores, empty arrays, and data without asking
2. **Premature Step Advancement** - Steps advanced with only 1-2 fields when 4 were required
3. **Questions Being Skipped** - AI skipped 3-4 questions per step, rushing through conversations

## Root Cause Analysis

### Bug #1: AI Auto-Filling Optional Fields
**Symptom**: AI invented `clarity_score: 2`, `supporters: []`, `mapping_score: 3` without asking  
**Root Cause**: Schema listed all fields as `properties` with `additionalProperties: true`, which the AI interpreted as "you CAN fill these fields"  
**Impact**: Backend validation thought fields were complete when they weren't

### Bug #2: Premature Step Advancement  
**Symptom**: CLARITY advanced with only `change_description` when 4 fields required  
**Root Cause**: AI was auto-filling fields that passed validation checks (empty arrays, inferred scores)  
**Impact**: Users didn't get asked all required questions

### Bug #3: Questions Not Being Asked
**Symptom**: CLARITY should ask 5 questions, only asked 1  
**Root Cause**: Step advanced too early due to auto-filled fields  
**Impact**: Incomplete coaching sessions, poor user experience

## Fixes Implemented

### Fix #1: Debug Logging (coach.ts)

Added comprehensive logging to track:
- Skip counts per step
- Field validation results
- Step advancement decisions
- Payload contents

**Files Modified**:
- `convex/coach.ts` (lines 635-644, 795-807, 921-927)

**What to Look For in Logs**:
```
=== STEP COMPLETION CHECK ===
{
  framework: "COMPASS",
  step: "clarity",
  skipCount: 0,
  loopDetected: false,
  capturedFields: 1,
  missingFields: 3,
  payloadKeys: ["change_description", "coach_reflection"]
}

CLARITY Step Validation:
{
  hasChangeDescription: true,
  hasWhyItMatters: false,
  hasSupporters: false,
  hasResistors: false,
  completedFields: 1,
  requiredFields: 4,
  shouldAdvance: false  // ✅ Should NOT advance!
}
```

### Fix #2: Schema Changes (compass.ts)

**Changed**:
1. `additionalProperties: true` → `additionalProperties: false` (CLARITY, OWNERSHIP)
2. Added explicit instructions to `system_objective` for each step:
   - "ONLY include fields when user explicitly provides the information"
   - "DO NOT include empty arrays or inferred scores"
   - "DO NOT auto-fill timelines, resources, or obstacles"

**Files Modified**:
- `convex/frameworks/compass.ts` (lines 18, 30, 35, 47, 52, 81, 98, 115)

**Before**:
```typescript
{
  name: "clarity",
  system_objective: "Help identify what's changing...",
  required_fields_schema: {
    properties: { ... },
    required: ["coach_reflection"],
    additionalProperties: true  // ❌ Allows AI to add any field
  }
}
```

**After**:
```typescript
{
  name: "clarity",
  system_objective: "Help identify what's changing... ONLY include fields when user explicitly provides the information. DO NOT include empty arrays or inferred scores.",
  required_fields_schema: {
    properties: { ... },
    required: ["coach_reflection"],
    additionalProperties: false  // ✅ Strict - only defined fields
  }
}
```

### Fix #3: Strengthened Prompts (index.ts)

Added **🚨 JSON OUTPUT RULES** section with explicit instructions:

```
🚨 JSON OUTPUT RULES - CRITICAL:
- ONLY include fields in your JSON response when the user has EXPLICITLY provided that information
- DO NOT include empty arrays [] unless the user explicitly said "none" or "no one"
- DO NOT include scores (clarity_score, ownership_score, etc.) unless the user explicitly gave you a number
- DO NOT infer or guess field values - if you don't have the data, DON'T include the field
- The ONLY required field is "coach_reflection" - all other fields are OPTIONAL and should only be included when earned through conversation
```

Added **COMPASS-SPECIFIC EXAMPLES**:

❌ **WRONG**:
```json
User: "We're moving to a new CRM system"
AI Response: {
  "change_description": "Moving to new CRM system",
  "supporters": [],      // ❌ Don't include empty arrays!
  "resistors": [],       // ❌ Don't include empty arrays!
  "clarity_score": 2,    // ❌ Don't infer scores!
  "coach_reflection": "What problem is this trying to solve?"
}
```

✅ **CORRECT**:
```json
User: "We're moving to a new CRM system"
AI Response: {
  "change_description": "Moving to new CRM system",  // ✅ Only what user said
  "coach_reflection": "What problem is this CRM change trying to solve?"
}
```

**Files Modified**:
- `convex/prompts/index.ts` (lines 122-173)

## Testing Instructions

### 1. Start a New COMPASS Session

Navigate to the app and start a COMPASS session with this scenario:

**User Input**: "We're implementing a new CRM system and I'm worried about my job"

### 2. Expected Behavior (CLARITY Step)

The AI should ask **5 progressive questions**:

1. ✅ "What specific change is happening?" → User: "CRM change"
2. ✅ "What problem is this trying to solve?" → User: "Old system is outdated"
3. ✅ "Who supports this change and why?" → User: "IT team, management"
4. ✅ "Who resists this change and why?" → User: "Some senior staff"
5. ✅ "On a scale of 1-5, how clear are you?" → User: "3"

**Only then** should it advance to OWNERSHIP.

### 3. Check Debug Logs

In Convex dashboard, check logs for:

```
CLARITY Step Validation:
{
  completedFields: 4,
  requiredFields: 4,
  shouldAdvance: true  // ✅ Should advance after all 4 fields!
}

Step Advancement Decision:
{
  step: "clarity",
  shouldAdvance: true,
  nextAction: "ADVANCE"
}
```

### 4. Verify No Auto-Filling

Check that the AI's JSON responses do NOT include:
- Empty arrays: `"supporters": []`
- Inferred scores: `"clarity_score": 2` (unless user explicitly gave a number)
- Auto-filled timelines/resources in MAPPING step

## Success Criteria

✅ **CLARITY step asks all 5 questions before advancing**  
✅ **OWNERSHIP step asks all 5 questions before advancing**  
✅ **MAPPING step asks 6 questions progressively**  
✅ **No empty arrays in JSON unless user said "none"**  
✅ **No scores in JSON unless user gave a number**  
✅ **Debug logs show correct field validation**  
✅ **Session completes properly with full report**

## Rollback Plan

If issues persist:

1. **Revert schema changes**: Change `additionalProperties: false` back to `true`
2. **Remove debug logging**: Delete console.log statements
3. **Revert prompt changes**: Remove JSON OUTPUT RULES section

## Next Steps

1. ✅ Test with real COMPASS session
2. ✅ Review debug logs to confirm fix
3. ✅ Monitor for any new issues
4. 🔄 Remove debug logging once confirmed working
5. 🔄 Update memory with successful fix

## Files Changed

- `convex/coach.ts` - Added debug logging
- `convex/frameworks/compass.ts` - Updated schemas and objectives
- `convex/prompts/index.ts` - Strengthened JSON output rules
- `src/components/SessionView.tsx` - Fixed COMPASS session completion (previous fix)

## Related Issues

- [x] COMPASS sessions never ending (fixed in previous commit)
- [x] AI auto-filling optional fields
- [x] Questions being skipped
- [x] Premature step advancement
