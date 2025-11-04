# Step Confirmation & Amendment System - Implementation Status

## ✅ COMPLETED (Steps 1-6)

### 1. Schema Updates
- **File:** `convex/schema.ts`
- **Changes:**
  - Added `awaiting_confirmation: boolean` - Tracks when step is complete and waiting for user action
  - Added `amendment_mode: { active, step, from_review }` - Tracks amendment state
- **Status:** ✅ DONE

### 2. UI Components Created
- **StepConfirmationButtons.tsx** - Proceed/Amend buttons shown at step completion
  - Green "Proceed to [Next Step]" button with arrow icon
  - White "Amend Response" button with edit icon
  - Visual feedback and loading states
- **AmendmentModal.tsx** - Full-screen modal for editing extracted fields
  - Inline field editors (string, number, array types)
  - Save/Cancel actions
  - Type-safe implementation with proper TypeScript
- **Status:** ✅ DONE

### 3. Backend Mutations
- **File:** `convex/mutations.ts`
- **New Mutations:**
  - `setAwaitingConfirmation` - Set/clear confirmation state
  - `enterAmendmentMode` - Activate amendment mode for a step
  - `exitAmendmentMode` - Deactivate amendment mode
  - `amendReflectionField` - Update single field
  - `amendReflectionFields` - Batch update multiple fields
- **Status:** ✅ DONE

## 🚧 IN PROGRESS (Steps 7-13)

### 4. Update GROW Coach Logic
- **File:** `convex/coach/grow.ts`
- **Required Changes:**
  - Modify `checkStepCompletion` to return `{ shouldAdvance: false, awaitingConfirmation: true }` for all steps except introduction
  - Keep introduction step auto-advancing (user_consent_given = true)
  - Review step stays as-is (never auto-advances)
- **Status:** PENDING

### 5. Update COMPASS Coach Logic
- **File:** `convex/coach/compass.ts`
- **Required Changes:**
  - Same pattern as GROW - return awaiting confirmation instead of auto-advancing
  - Introduction step keeps current behavior
  - Review step stays as-is
- **Status:** PENDING

### 6. Handle Structured Inputs
- **File:** `convex/coach/index.ts`
- **Required Changes:**
  - Add handler for `step_confirmation` type:
    - `action: 'proceed'` → Advance to next step, clear awaiting_confirmation
    - `action: 'amend'` → Enter amendment mode for current step
  - Add handler for `amendment_complete` type:
    - `action: 'save'` → Apply amendments, exit amendment mode
    - `action: 'cancel'` → Exit amendment mode without changes
  - Add handler for `review_amendment_selection` type:
    - User selects which step to amend from review
- **Status:** PENDING

### 7. Update SessionView Rendering
- **File:** `src/components/SessionView.tsx`
- **Required Changes:**
  - Detect `awaiting_confirmation` state from session
  - Render `<StepConfirmationButtons>` when awaiting confirmation
  - Detect `amendment_mode.active` state
  - Render `<AmendmentModal>` when in amendment mode
  - Extract fields from latest reflection for amendment modal
  - Handle button clicks (proceed/amend/save/cancel)
- **Status:** PENDING

### 8. Review Step Special Handling
- **File:** `src/components/SessionView.tsx` + `convex/coach/index.ts`
- **Required Logic:**
  - Review step shows "Show Report" or "Amend a Step" buttons
  - If "Amend a Step" clicked:
    - Show step selector (Goal, Reality, Options, Will for GROW)
    - User selects step → Enter amendment mode for that step
    - Show AmendmentModal with that step's fields
    - On Save OR Cancel → Auto-trigger report generation
  - If "Show Report" clicked:
    - Direct report generation
- **Status:** PENDING

### 9. Update Prompts
- **Files:** `convex/prompts/grow.ts`, `convex/prompts/compass.ts`
- **Required Changes:**
  - Add confirmation question at end of each step:
    - "You've completed [Step]. Ready to proceed to [Next Step], or would you like to review your responses?"
  - This question triggers the confirmation UI
- **Status:** PENDING

### 10. Testing & Audit
- **Test Scenarios:**
  1. Complete Goal step → See confirmation buttons → Click Proceed → Advance to Reality
  2. Complete Goal step → Click Amend → See modal with goal fields → Edit → Save → See confirmation again
  3. Complete Goal step → Click Amend → Cancel → See confirmation again
  4. Complete Review step → Click "Amend a Step" → Select Goal → Edit → Save → Report generates
  5. Complete Review step → Click "Amend a Step" → Select Goal → Cancel → Report generates
  6. Complete Review step → Click "Show Report" → Report generates immediately
- **Status:** PENDING

## 🎯 CRITICAL IMPLEMENTATION NOTES

### Auto-Advancement Rules
- **Introduction:** Auto-advances when `user_consent_given = true` (UNCHANGED)
- **Goal, Reality, Options, Will:** Set `awaiting_confirmation = true` instead of auto-advancing
- **Review:** Never auto-advances (UNCHANGED)

### Amendment Flow
```
Step Complete → awaiting_confirmation = true
                      ↓
         [Proceed] or [Amend]
              ↓              ↓
    Advance to Next    Enter Amendment Mode
                            ↓
                  [Save] or [Cancel]
                            ↓
                  Exit Amendment Mode
                            ↓
                  awaiting_confirmation = true (loop back)
```

### Review Step Flow
```
Review Complete → Show [Show Report] or [Amend a Step]
                            ↓                    ↓
                    Generate Report      Select Step → Amendment Modal
                                                    ↓
                                          [Save] or [Cancel]
                                                    ↓
                                          Generate Report (both paths)
```

## 📋 NEXT STEPS

1. Update GROW coach completion logic
2. Update COMPASS coach completion logic
3. Add structured input handlers in coach/index.ts
4. Update SessionView to render confirmation UI
5. Implement review step special handling
6. Update prompts with confirmation questions
7. Full flow testing

## 🔍 FILES TO MODIFY

- `convex/coach/grow.ts` - Step completion logic
- `convex/coach/compass.ts` - Step completion logic
- `convex/coach/index.ts` - Structured input handlers
- `src/components/SessionView.tsx` - UI rendering and state management
- `convex/prompts/grow.ts` - Add confirmation questions
- `convex/prompts/compass.ts` - Add confirmation questions

## ⚠️ ZERO BREAKING CHANGES

- Introduction step behavior unchanged (auto-advances on consent)
- Review step behavior unchanged (never auto-advances)
- All existing data structures compatible
- No migration required
