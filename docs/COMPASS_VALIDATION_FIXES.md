# COMPASS Validation Fixes

**Date:** November 3, 2025  
**Status:** ✅ RESOLVED

## Issues Fixed

### 1. Safety Incident Severity Validation Error

**Error:**
```
ArgumentValidationError: Value does not match validator.
Path: .severity
Value: "medium"
Validator: v.union(v.literal("low"), v.literal("med"), v.literal("high"))
```

**Root Cause:**
The code was using `"medium"` but the schema validator expected `"med"`.

**Fix:**
Changed severity value in `convex/coach/base.ts` line 418:
```typescript
// Before
severity: "medium"

// After
severity: "med"
```

**Files Modified:**
- `convex/coach/base.ts` - Line 418

---

### 2. Pre-Validation Missing Field Warning

**Warning:**
```
=== PRE-VALIDATION FAILED === {
  step: 'clarity',
  errors: [],
  missingFields: [ 'sphere_of_control' ]
}
```

**Root Cause:**
Schema mismatch between agent tracking requirements and JSON schema validation:
- `convex/coach/compass.ts` line 19: Listed `sphere_of_control` as **required** in `getRequiredFields()`
- `convex/frameworks/compass.ts` line 158: Only required `change_description` and `coach_reflection` in JSON schema

**Fix:**
Added `sphere_of_control` to the required fields in the CLARITY step schema:
```typescript
// Before
required: ['change_description', 'coach_reflection'],

// After
required: ['change_description', 'sphere_of_control', 'coach_reflection'],
```

**Rationale:**
The `sphere_of_control` field is a critical part of the CLARITY step coaching flow (Question 4: "What parts of this can you control vs. what's beyond your control?"). Making it required ensures:
1. Consistency between agent tracking and schema validation
2. Users explicitly identify their sphere of control before advancing
3. Better coaching outcomes by ensuring this key insight is captured

**Files Modified:**
- `convex/frameworks/compass.ts` - Line 158

---

## Verification

✅ TypeScript compilation: PASS  
✅ Schema consistency: ALIGNED  
✅ Pre-validation: Will now pass when `sphere_of_control` is captured  
✅ Safety incident logging: Fixed severity value

---

## Impact

- **Safety logging**: No more validation errors when logging medium-severity safety incidents
- **CLARITY step**: Pre-validation will now correctly validate all required fields
- **User experience**: Coach will ensure sphere of control is captured before advancing
- **Data quality**: All CLARITY sessions will have complete control analysis

---

## Testing Recommendations

1. Start a new COMPASS session
2. Progress through CLARITY step
3. Verify coach asks all 4 questions including sphere of control
4. Confirm no pre-validation warnings in logs
5. Verify step advances only after all required fields captured

---

## Additional Fix: Opportunistic Extraction for Control Signals

**Date:** November 3, 2025 (11:10 PM)

**Issue:**
When asked Q3 (supporters/resistors), user responded with control-related information: "we dont know if we will have a job or not". AI didn't recognize this as `sphere_of_control` data and only extracted empty arrays for supporters/resistors, causing validation failure.

**Root Cause:**
AI wasn't applying opportunistic extraction when users answered with control/uncertainty information instead of stakeholder information.

**Fix:**
Added explicit control-related signal detection in Q3 guidance:

```typescript
CONTROL-RELATED SIGNALS:
- "we don't know if..." → sphere_of_control: "job security is uncertain"
- "I can't control..." → sphere_of_control: [what they said]
- "it's out of my hands..." → sphere_of_control: [what they said]
- "uncertain about..." → sphere_of_control: [what they said]
- "no control over..." → sphere_of_control: [what they said]
```

**Behavior:**
When user talks about control/uncertainty in Q3 response:
1. Extract `sphere_of_control` from their statement
2. Set `supporters = []`, `resistors = []` (they didn't answer Q3 yet)
3. Acknowledge the control concern
4. Re-ask Q3 about supporters/resistors
5. Continue to Q4 if still needed

**Files Modified:**
- `convex/prompts/compass.ts` - Lines 273-287

**Impact:**
- AI now recognizes control-related responses even when asked about other topics
- Better opportunistic extraction across question boundaries
- Reduces validation failures from missing `sphere_of_control`
