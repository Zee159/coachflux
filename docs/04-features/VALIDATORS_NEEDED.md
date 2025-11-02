# 🔌 Backend Validators Needed for Button Interactions

## Overview

For button interactions to work smoothly, we need to update the backend validators to recognize when users have completed steps via buttons (not text).

---

## Current Status

### ✅ Introduction Step (WORKING)
**What we did:**
- Frontend: Yes button calls `updateSessionStep` to advance directly to 'goal'
- Backend: No validator needed - we bypass AI processing entirely

**Why it works:**
- Instant step change, no AI involved
- Clean and fast

---

## 🔄 Options Step (NEEDS UPDATE)

### Current Validator Logic
**File:** `convex/coach/grow.ts` lines 135-170

```typescript
private checkOptionsCompletion(payload, skipCount, loopDetected) {
  const options = payload["options"];
  
  // Checks if options array exists
  // Checks if 2+ options with pros/cons
  // Advances when criteria met
}
```

### Problem with Button Flow
1. AI generates 5 options with pros/cons ✅
2. User selects via buttons (e.g., options 1, 2, 3) ✅
3. Frontend sends: `userTurn: "Selected options: 1, 2, 3"` ✅
4. **Backend validator checks for `options` array** ✅ (already exists from step 1)
5. **Backend validator checks for `selected_option_ids`** ❌ (NOT CHECKED YET)

### What We Need to Add

**Update `checkOptionsCompletion` to check for selection:**

```typescript
private checkOptionsCompletion(
  payload: ReflectionPayload,
  skipCount: number,
  loopDetected: boolean
): StepCompletionResult {
  const options = payload["options"];
  const selectedOptionIds = payload["selected_option_ids"];

  // Must have generated options
  if (!Array.isArray(options) || options.length === 0) {
    return { shouldAdvance: false };
  }

  // NEW: Check if user has selected options via buttons
  if (Array.isArray(selectedOptionIds) && selectedOptionIds.length > 0) {
    // User selected via buttons - advance immediately
    return { shouldAdvance: true };
  }

  // FALLBACK: Old text-based flow (for voice/text users)
  const exploredOptions = options.filter((opt: unknown) => {
    const option = opt as { pros?: unknown[]; cons?: unknown[] };
    return Array.isArray(option.pros) && option.pros.length > 0 &&
           Array.isArray(option.cons) && option.cons.length > 0;
  });

  const hasExploredOptions = exploredOptions.length >= 1;
  const hasMultipleOptions = options.length >= 2;

  // Progressive relaxation for text-based flow
  if (loopDetected || skipCount >= 2) {
    return { shouldAdvance: hasExploredOptions };
  } else if (skipCount === 1) {
    return { shouldAdvance: hasMultipleOptions && hasExploredOptions };
  } else {
    return { shouldAdvance: hasMultipleOptions && hasExploredOptions };
  }
}
```

### Frontend Change Needed

**Update `onSubmit` in SessionView to send `selected_option_ids`:**

Currently sends:
```typescript
userTurn: `Selected options: ${selectedIds.join(', ')}`
```

Should also update the payload:
```typescript
// Need to add structured input or update reflection payload
// Option 1: Use structured input (cleaner)
void nextStepAction({
  orgId: session.orgId,
  userId: session.userId,
  sessionId: session._id,
  stepName: 'options',
  userTurn: `Selected options: ${selectedIds.join(', ')}`,
  structuredInput: {
    type: 'options_selection',
    data: { selected_option_ids: selectedIds }
  }
});

// Option 2: Have AI extract it (current approach)
// AI sees "Selected options: 1, 2, 3" and extracts to selected_option_ids
```

---

## 🔄 Will Step (NEEDS UPDATE)

### Current Validator Logic
**File:** `convex/coach/grow.ts` lines 177-230

```typescript
private checkWillCompletion(payload, skipCount, loopDetected) {
  const chosenOptions = payload["chosen_options"];
  const actions = payload["actions"];
  
  // Checks if chosen_options exists
  // Checks if actions array has complete actions
  // Advances when all actions have required fields
}
```

### Problem with Button Flow
1. AI suggests action for option 1 ✅
2. User clicks "Accept" ✅
3. Frontend sends: `userTurn: "Accepted suggested action"` ✅
4. **Backend needs to:**
   - Move suggested_action to actions array ❌
   - Check if all selected options have been processed ❌
   - Generate next suggested action OR advance to review ❌

### What We Need to Add

**Update `checkWillCompletion` to handle button flow:**

```typescript
private checkWillCompletion(
  payload: ReflectionPayload,
  skipCount: number,
  loopDetected: boolean
): StepCompletionResult {
  const selectedOptionIds = payload["selected_option_ids"]; // From Options step
  const actions = payload["actions"]; // Finalized actions
  const currentOptionIndex = payload["current_option_index"]; // Which option we're on
  const totalOptions = payload["total_options"]; // How many total

  // NEW: Button flow - check if we've processed all selected options
  if (Array.isArray(selectedOptionIds) && selectedOptionIds.length > 0) {
    const finalizedActions = Array.isArray(actions) ? actions.length : 0;
    const totalOptionsToProcess = selectedOptionIds.length;
    
    // Check if we've processed all options
    if (finalizedActions >= totalOptionsToProcess) {
      // All options processed - advance to review
      return { shouldAdvance: true };
    } else {
      // Still have options to process - don't advance yet
      return { shouldAdvance: false };
    }
  }

  // FALLBACK: Old text-based flow
  const chosenOptions = payload["chosen_options"];
  
  if (!Array.isArray(chosenOptions) || chosenOptions.length === 0) {
    return { shouldAdvance: false };
  }

  if (!Array.isArray(actions) || actions.length === 0) {
    return { shouldAdvance: false };
  }

  // Check for complete actions (old flow)
  const completeActions = actions.filter((a: unknown) => {
    const action = a as { 
      title?: string; 
      owner?: string; 
      due_days?: number;
      support_needed?: string;
      accountability_mechanism?: string;
    };
    return (
      typeof action.title === "string" && action.title.length > 0 &&
      typeof action.owner === "string" && action.owner.length > 0 &&
      typeof action.due_days === "number" && action.due_days > 0 &&
      typeof action.support_needed === "string" && action.support_needed.length > 0 &&
      typeof action.accountability_mechanism === "string" && action.accountability_mechanism.length > 0
    );
  });

  // Progressive relaxation
  if (loopDetected || skipCount >= 2) {
    return { shouldAdvance: actions.length >= 1 };
  } else {
    return { shouldAdvance: completeActions.length >= chosenOptions.length };
  }
}
```

### Backend Logic Needed

**When user clicks "Accept":**

```typescript
// In nextStepAction handler
if (userTurn === "Accepted suggested action") {
  // 1. Move suggested_action to actions array
  const suggestedAction = payload.suggested_action;
  const currentOptionLabel = payload.current_option_label;
  const currentOptionId = selectedOptionIds[currentOptionIndex];
  
  const newAction = {
    option_id: currentOptionId,
    option_label: currentOptionLabel,
    ...suggestedAction
  };
  
  // Add to actions array
  payload.actions = [...(payload.actions || []), newAction];
  
  // 2. Check if more options to process
  const nextIndex = currentOptionIndex + 1;
  if (nextIndex < selectedOptionIds.length) {
    // Generate next suggested action
    payload.current_option_index = nextIndex;
    payload.current_option_label = getOptionLabel(selectedOptionIds[nextIndex]);
    // AI will generate new suggested_action
  } else {
    // All done - clear suggested_action, advance to review
    delete payload.suggested_action;
    delete payload.current_option_index;
    delete payload.current_option_label;
  }
}
```

**When user clicks "Skip":**

```typescript
if (userTurn === "Skipped this option") {
  // Don't add to actions array
  
  // Check if more options to process
  const nextIndex = currentOptionIndex + 1;
  if (nextIndex < selectedOptionIds.length) {
    // Generate next suggested action
    payload.current_option_index = nextIndex;
    payload.current_option_label = getOptionLabel(selectedOptionIds[nextIndex]);
  } else {
    // All done - advance to review
    delete payload.suggested_action;
    delete payload.current_option_index;
    delete payload.current_option_label;
  }
}
```

---

## 📋 Implementation Checklist

### Options Step
- [ ] Update `checkOptionsCompletion` to check for `selected_option_ids`
- [ ] Add structured input support OR ensure AI extracts `selected_option_ids`
- [ ] Test: Select options via buttons → Should advance to Will

### Will Step
- [ ] Update `checkWillCompletion` to check finalized actions count vs selected options count
- [ ] Add logic to handle "Accepted suggested action" - move to actions array
- [ ] Add logic to handle "Skipped this option" - skip to next
- [ ] Add logic to generate next suggested action OR advance to review
- [ ] Update required fields: `selected_option_ids` should carry over from Options
- [ ] Test: Accept action → Should show next option OR advance to review
- [ ] Test: Skip action → Should show next option OR advance to review

### Alternative Approach: Structured Input

Instead of parsing text, use structured input (cleaner):

```typescript
// Options step
structuredInput: {
  type: 'options_selection',
  data: { selected_option_ids: ['1', '2', '3'] }
}

// Will step - Accept
structuredInput: {
  type: 'action_accepted',
  data: { 
    option_id: '1',
    action: suggestedAction 
  }
}

// Will step - Skip
structuredInput: {
  type: 'action_skipped',
  data: { option_id: '1' }
}
```

Then handle in `nextStepAction`:

```typescript
if (args.structuredInput) {
  switch (args.structuredInput.type) {
    case 'options_selection':
      // Store selected_option_ids in payload
      // Advance to Will
      break;
    
    case 'action_accepted':
      // Add action to actions array
      // Generate next or advance
      break;
    
    case 'action_skipped':
      // Generate next or advance
      break;
  }
}
```

---

## 🎯 Recommended Approach

**Use Structured Input** (cleaner, more reliable):

1. Frontend sends structured data via `structuredInput` parameter
2. Backend handles each type explicitly
3. No text parsing needed
4. Clear, type-safe flow

This is similar to how we handled Introduction step - bypass AI parsing entirely for button clicks!

---

**Which approach do you prefer?**
1. Update validators + AI extraction (current approach)
2. Structured input + explicit handlers (cleaner, recommended)
