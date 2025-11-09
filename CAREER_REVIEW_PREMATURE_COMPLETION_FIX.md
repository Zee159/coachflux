# CAREER Review Step - Premature Completion Fix

## Problem
The CAREER framework REVIEW step was completing prematurely after only 5 out of 6 questions were answered. The session would show "Session Complete!" and the "Proceed to Report" button after the user answered `final_clarity` (question 5), but BEFORE they could answer `session_helpfulness` (question 6).

### User Experience Impact
```
User answers question 5 (final_clarity): "9"
❌ Session immediately shows "Session Complete!"
❌ "Proceed to Report" button appears
❌ Question 6 (session_helpfulness) never asked
❌ User cannot provide session feedback
```

## Root Cause
The `checkReviewCompletion()` method in `convex/coach/career.ts` was using **progressive relaxation** logic:

```typescript
// OLD CODE (BROKEN)
let requiredUserCount = 6; // Strict: ALL 6 fields required
if (skipCount >= 1) { requiredUserCount = 5; } // Lenient: 5/6 fields ❌
if (skipCount >= 2) { requiredUserCount = 4; } // Very lenient: 4/6 fields
```

This meant:
1. When `skipCount >= 1`, only 5/6 fields were required
2. After capturing 5 fields, `awaitingConfirmation: true` was set
3. Frontend showed "Session Complete!" and "Proceed to Report" button
4. Question 6 was never asked

## Solution
Removed progressive relaxation from the REVIEW step. All 6 review questions are essential for a complete session review, so we now require **exactly 6/6 fields** before allowing confirmation.

### Code Changes

**File:** `convex/coach/career.ts`

**Changed:**
```typescript
// NEW CODE (FIXED)
// CRITICAL: REVIEW step requires ALL 6 fields - no progressive relaxation
// This ensures all review questions are asked before session completion
const requiredUserCount = 6;

// Check if ALL user fields are complete
const userFieldsComplete = userCapturedCount === requiredUserCount && hasCriticalUserFields;
```

**Updated comment:**
```typescript
/**
 * REVIEW step completion
 * NO PROGRESSIVE RELAXATION - All 6 questions are essential for complete review
 */
```

## Expected Behavior After Fix

### Correct Flow:
```
Question 1: key_takeaways → User answers
Question 2: immediate_next_step → User answers
Question 3: biggest_challenge → User answers
Question 4: final_confidence → User answers (scale 1-10)
Question 5: final_clarity → User answers (scale 1-10)
Question 6: session_helpfulness → User answers (scale 1-10)
✅ ALL 6 questions answered
✅ "Session Complete!" appears
✅ "Proceed to Report" button shows
```

## Why REVIEW is Different
Other steps (ASSESSMENT, GAP_ANALYSIS, ROADMAP) use progressive relaxation because:
- They have 6-8 fields
- Some fields are optional or can be skipped
- Progressive relaxation prevents infinite loops

REVIEW step is different because:
- Only 6 fields total
- All 6 questions are essential for complete feedback
- Questions are simple and quick to answer
- No risk of infinite loops (just asking for user reflection)

## Verification
✅ TypeScript compilation: PASS
✅ All 6 REVIEW questions will be asked
✅ Session only completes after ALL questions answered
✅ No breaking changes to other steps

## Files Modified
- `convex/coach/career.ts` - Lines 254-335 (REVIEW completion logic)

## Testing Checklist
- [ ] Start CAREER framework session
- [ ] Complete ASSESSMENT, GAP_ANALYSIS, ROADMAP steps
- [ ] Enter REVIEW step
- [ ] Verify all 6 questions are asked:
  - [ ] key_takeaways
  - [ ] immediate_next_step
  - [ ] biggest_challenge
  - [ ] final_confidence (1-10 scale)
  - [ ] final_clarity (1-10 scale)
  - [ ] session_helpfulness (1-10 scale)
- [ ] Verify "Session Complete!" only appears after question 6
- [ ] Verify "Proceed to Report" button only appears after question 6
