# Career Coach REVIEW Step - Testing & Debugging Guide

## 🎯 Purpose
This guide helps diagnose and fix issues with the Career Coach REVIEW step, specifically:
- Question 5 being asked twice
- Question 6 not appearing
- "Proceed to Report" button not showing

## ✅ What's Already Implemented

### UI Components (SessionView.tsx)
All three scale selectors exist and are properly configured:

1. **Question 4: final_confidence** (Lines 2054-2092)
   - Shows when: Q1-Q3 complete, Q4 not answered
   - Triggers: ConfidenceScaleSelector with "Not confident" to "Very confident"

2. **Question 5: final_clarity** (Lines 2094-2125)
   - Shows when: Q4 complete, Q5 not answered
   - Triggers: ConfidenceScaleSelector with "Not clear" to "Very clear"

3. **Question 6: session_helpfulness** (Lines 2127-2159)
   - Shows when: Q4-Q5 complete, Q6 not answered
   - Triggers: ConfidenceScaleSelector with "Not helpful" to "Very helpful"

### Backend Logic (convex/coach/career.ts)
- Requires ALL 6 fields before completion (lines 254-336)
- No progressive relaxation
- Debug logging enabled (lines 274-288)
- Sets `awaitingConfirmation: true` when all 6 fields captured

### Schema (convex/frameworks/career.ts)
- `session_helpfulness` properly defined as number (1-10)

### Prompts (convex/prompts/career.ts)
- Explicit instructions for all 6 questions
- Sequential question flow enforced
- Verification checklist before summary

## 🔍 Diagnostic Steps

### Step 1: Check Debug Logs
When a user completes the REVIEW step, check Convex logs for:

```
🔍 === CAREER REVIEW COMPLETION CHECK ===
```

Look for:
- `userCapturedCount`: Should be 6 when complete
- `requiredUserCount`: Should always be 6
- `session_helpfulness`: Check if it exists and has correct type/value

### Step 2: Verify Question Sequence
The AI should ask questions in this exact order:

1. ✅ "What are your key takeaways from this session?"
2. ✅ "What's your immediate next step within the next 48 hours?"
3. ✅ "What's your biggest challenge in executing this plan?"
4. ✅ "On a scale of 1-10, how confident are you now about your career transition?"
5. ✅ "How clear are you on your path forward (1-10)?"
6. ✅ "How helpful was this session (1-10)?"

### Step 3: Check UI Component Visibility
After each question is answered, verify:

**After Q3 answered:**
- Q4 scale selector should appear
- Q5 and Q6 should NOT appear

**After Q4 answered:**
- Q4 should disappear
- Q5 scale selector should appear
- Q6 should NOT appear

**After Q5 answered:**
- Q5 should disappear
- Q6 scale selector should appear

**After Q6 answered:**
- All scale selectors should disappear
- "Proceed to Report" button should appear

## 🐛 Common Issues & Solutions

### Issue 1: Question 5 Asked Twice
**Symptom:** User sees Q5 scale selector appear again after answering

**Diagnosis:**
```typescript
// Check if finalClarity is being properly set in payload
console.log(payload['final_clarity']); // Should be number 1-10
```

**Possible Causes:**
1. AI not extracting `final_clarity` from user response
2. Payload not being updated after user clicks button
3. Conditional logic bug in UI component

**Solution:**
- Check debug logs for `final_clarity` extraction
- Verify `nextStepAction` is being called with correct value
- Ensure payload is updated in reflection

### Issue 2: Question 6 Not Appearing
**Symptom:** After Q5, no scale selector appears

**Diagnosis:**
```typescript
// In SessionView.tsx line 2136, check conditions:
if (typeof finalConfidence !== 'number' || typeof finalClarity !== 'number' || sessionHelpfulness !== undefined) {
  return null; // Component won't show
}
```

**Possible Causes:**
1. `finalConfidence` or `finalClarity` not set as numbers
2. `sessionHelpfulness` already exists (shouldn't)
3. AI skipping Q6 and moving to summary

**Solution:**
- Verify Q4 and Q5 are captured as numbers (not strings)
- Check if AI is following prompt instructions
- Look for "session_helpfulness" in payload before Q6 asked

### Issue 3: "Proceed to Report" Button Not Showing
**Symptom:** After Q6, no button appears

**Diagnosis:**
```typescript
// Check completion check result
console.error('✅ === CAREER REVIEW COMPLETE ===', {
  userCapturedCount, // Should be 6
  awaitingConfirmation // Should be true
});
```

**Possible Causes:**
1. Not all 6 fields captured
2. `awaitingConfirmation` not set to true
3. UI not detecting completion state

**Solution:**
- Verify all 6 fields exist in payload with correct types
- Check `awaitingConfirmation` flag in session state
- Ensure `StepConfirmationButtons` component is rendering

## 🛠️ Recent Fixes Applied

### Fix 1: Enhanced Debug Logging
Added `userCapturedCount` and `requiredUserCount` to debug output for easier diagnosis.

**File:** `convex/coach/career.ts` (Line 284-285)

### Fix 2: Strengthened REVIEW Prompt
Added explicit numbered list of all 6 required questions with emphasis on Q6.

**File:** `convex/prompts/career.ts` (Lines 454-460)

### Fix 3: Verification Checklist
Added pre-summary verification checklist to prevent AI from skipping Q6.

**File:** `convex/prompts/career.ts` (Lines 525-533)

## 📊 Testing Procedure

### Manual Test
1. Start a new Career Coach session
2. Progress through: INTRODUCTION → ASSESSMENT → GAP_ANALYSIS → ROADMAP
3. Enter REVIEW step
4. Answer each question and verify:
   - ✅ Q1: Text input accepted
   - ✅ Q2: Text input accepted
   - ✅ Q3: Text input accepted
   - ✅ Q4: Scale selector appears, click value
   - ✅ Q5: Scale selector appears, click value
   - ✅ Q6: Scale selector appears, click value
   - ✅ "Proceed to Report" button appears
5. Click "Proceed to Report"
6. Verify report generates successfully

### Automated Test (Future)
```typescript
// Test case for REVIEW step completion
test('Career Coach REVIEW - All 6 questions asked', async () => {
  const session = await startCareerSession();
  await progressToReview(session);
  
  // Answer Q1-Q3
  await answerTextQuestion(session, 'key_takeaways', 'My key takeaway is...');
  await answerTextQuestion(session, 'immediate_next_step', 'Update my resume');
  await answerTextQuestion(session, 'biggest_challenge', 'Time management');
  
  // Answer Q4-Q6
  await answerScaleQuestion(session, 'final_confidence', 8);
  await answerScaleQuestion(session, 'final_clarity', 7);
  await answerScaleQuestion(session, 'session_helpfulness', 9);
  
  // Verify completion
  const reflection = await getLastReflection(session);
  expect(reflection.payload.session_helpfulness).toBe(9);
  expect(session.awaitingConfirmation).toBe(true);
});
```

## 🎯 Success Criteria

### All Tests Pass When:
- ✅ All 6 questions asked in order
- ✅ No questions repeated
- ✅ All scale selectors appear correctly
- ✅ All user responses captured in payload
- ✅ "Proceed to Report" button appears after Q6
- ✅ Report generates with all 6 fields
- ✅ Debug logs show `userCapturedCount: 6`

## 📝 Monitoring Checklist

After deploying fixes, monitor for:
- [ ] Question 5 duplication reports
- [ ] Question 6 missing reports
- [ ] Button not appearing reports
- [ ] Debug logs showing incomplete reviews
- [ ] User feedback on review flow

## 🔗 Related Files

- **UI:** `src/components/SessionView.tsx` (Lines 2054-2159)
- **Backend:** `convex/coach/career.ts` (Lines 254-336)
- **Schema:** `convex/frameworks/career.ts` (Lines 459-462)
- **Prompts:** `convex/prompts/career.ts` (Lines 450-551)

## 📞 Support

If issues persist after applying fixes:
1. Check Convex logs for debug output
2. Verify all 6 UI components exist
3. Test with different user responses
4. Check for race conditions in state updates
5. Verify prompt changes deployed correctly
