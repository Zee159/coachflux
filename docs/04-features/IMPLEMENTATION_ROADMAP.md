# 🚀 Button Interactions Implementation Roadmap

## Status: IN PROGRESS

This document outlines the step-by-step implementation of button-based interactions for Options and Will steps, plus Review step simplification.

---

## ✅ Phase 0: Introduction Step (COMPLETED)

- [x] Created YesNoSelector component
- [x] Integrated into SessionView
- [x] Instant step advancement (no AI wait)
- [x] Clean UI with compact buttons

---

## 🔄 Phase 1: Options Step with Buttons

### Goal
Replace text-based option selection with multi-select pill buttons showing AI-suggested options with pros/cons.

### Current Flow
```
1. User types option → AI asks for pros/cons
2. User types pros/cons → AI asks "another or suggest?"
3. User says "suggest" → AI generates 2-3 options
4. User types which ones they want
5. AI parses text response
```

### New Flow
```
1. AI generates 5 options with pros/cons immediately
2. OptionsSelector appears with pill buttons
3. User clicks to select 1-5 options
4. User clicks "Continue with X selected"
5. System captures selection (no parsing needed)
6. Advance to Will step
```

### Implementation Steps

#### 1.1 Update Options Prompt
**File:** `convex/prompts/grow.ts`

**Change:** Tell AI to generate options immediately instead of asking user first

```typescript
options: `OPTIONS - AI-First Approach

FLOW:
1. IMMEDIATELY generate 5 options based on their Goal and Reality
2. System will display OptionsSelector with buttons
3. User selects 1-5 options via buttons
4. System advances to Will step

GENERATE 5 OPTIONS:
Each option must have:
- id: "1", "2", "3", "4", "5"
- label: Clear, actionable name (e.g., "Update CV/Resume")
- description: One sentence explaining the option
- pros: Array of 2-3 benefits
- cons: Array of 1-2 challenges
- recommended: true/false (mark top 3 as recommended)

EXAMPLE:
{
  "options": [
    {
      "id": "1",
      "label": "Update CV/Resume",
      "description": "Work with specialist to highlight CFO skills",
      "pros": ["Professional quality", "Highlights strengths", "Quick turnaround"],
      "cons": ["Costs money", "Takes 2-3 days"],
      "recommended": true
    },
    // ... 4 more options
  ]
}

CRITICAL:
- Generate ALL 5 options in ONE turn
- Do NOT ask user to type options
- Do NOT ask for pros/cons separately
- System will show buttons automatically
- User selects via clicks, not text

EXTRACT:
- options: Array of 5 option objects
- coach_reflection: "Based on your goal to [goal], here are some options:"
`,
```

#### 1.2 Update Options Schema
**File:** `convex/frameworks/grow.ts`

**Change:** Update options field to accept array of objects

```typescript
options: v.object({
  coach_reflection: v.string({ minLength: 20 }),
  options: v.array(v.object({
    id: v.string(),
    label: v.string(),
    description: v.string(),
    pros: v.array(v.string()),
    cons: v.array(v.string()),
    recommended: v.optional(v.boolean())
  })),
  selected_option_ids: v.optional(v.array(v.string())) // User's selection
}),
```

#### 1.3 Render OptionsSelector in SessionView
**File:** `src/components/SessionView.tsx`

**Add after AI response in Options step:**

```typescript
{/* Options Selector for Options Step */}
{reflection.step === 'options' && isLastReflection && !isSessionComplete && (() => {
  const payload = reflection.payload as Record<string, unknown>;
  const options = payload['options'];
  
  if (!Array.isArray(options) || options.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <OptionsSelector
        options={options.map(opt => ({
          id: opt.id,
          label: opt.label,
          description: opt.description,
          pros: opt.pros,
          cons: opt.cons,
          recommended: opt.recommended
        }))}
        onSubmit={(selectedIds) => {
          // Send structured input to backend
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
        }}
        minSelections={1}
        maxSelections={5}
        coachMessage=""
      />
    </div>
  );
})()}
```

---

## 🔄 Phase 2: Will Step with AI-Suggested Actions

### Goal
For each selected option, AI suggests a complete action. User can Accept/Modify/Skip.

### Current Flow
```
1. AI asks: "What action will you take for [option]?"
2. User types action
3. AI asks: "When will you do it?"
4. User types timeline
5. AI asks: "Who's responsible?"
6. User types owner
7. AI asks: "How will you track progress?"
8. User types accountability
9. AI asks: "What support do you need?"
10. User types support
11. Repeat for each option
```

### New Flow
```
1. AI generates suggested action for option 1
2. ActionValidator appears with Accept/Modify/Skip buttons
3. User clicks:
   - Accept → Capture action, move to next option
   - Modify → Show form to edit fields
   - Skip → Move to next option
4. Repeat for each selected option
5. ActionSummary appears with all actions
6. User clicks "Continue to review" or "Add more"
```

### Implementation Steps

#### 2.1 Update Will Prompt
**File:** `convex/prompts/grow.ts`

```typescript
will: `WILL - AI-Suggested Actions

FLOW:
1. For EACH selected option, generate a suggested action
2. System shows ActionValidator with Accept/Modify/Skip buttons
3. User validates or modifies
4. Repeat for all selected options
5. Show ActionSummary

GENERATE SUGGESTED ACTION:
Based on:
- Goal: {goal}
- Reality: {reality}
- Selected option: {option.label}

Create complete action with ALL 5 fields:
{
  "suggested_action": {
    "action": "Specific, actionable step (not vague)",
    "due_days": 7, // Realistic timeline based on goal deadline
    "owner": "Me", // Usually "Me" unless they mentioned someone
    "accountability_mechanism": "How they'll track (from Reality resources)",
    "support_needed": "What help they need (from Reality resources)"
  }
}

CONTEXT-AWARE SUGGESTIONS:
- If goal deadline is 6 months, suggest 2-30 day actions
- If Reality mentioned "wife", suggest "Share with wife" for accountability
- If Reality mentioned "specialist", suggest that as support
- If option is "Update CV", suggest "Get specialist to update CV" not just "Update CV"

CRITICAL:
- Generate COMPLETE action (all 5 fields)
- Do NOT ask user for each field separately
- System will show Accept/Modify/Skip buttons
- User can accept instantly or modify

EXTRACT:
- suggested_action: Complete action object
- coach_reflection: "For [option], I suggest:"
`,
```

#### 2.2 Update Will Schema
**File:** `convex/frameworks/grow.ts`

```typescript
will: v.object({
  coach_reflection: v.string({ minLength: 20 }),
  
  // AI-suggested action (before user validation)
  suggested_action: v.optional(v.object({
    action: v.string(),
    due_days: v.number(),
    owner: v.string(),
    accountability_mechanism: v.string(),
    support_needed: v.string()
  })),
  
  // User's final actions (after Accept/Modify)
  actions: v.optional(v.array(v.object({
    option_id: v.string(),
    option_label: v.string(),
    action: v.string(),
    due_days: v.number(),
    owner: v.string(),
    accountability_mechanism: v.string(),
    support_needed: v.string()
  })))
}),
```

#### 2.3 Render ActionValidator in SessionView
**File:** `src/components/SessionView.tsx`

```typescript
{/* Action Validator for Will Step */}
{reflection.step === 'will' && isLastReflection && !isSessionComplete && (() => {
  const payload = reflection.payload as Record<string, unknown>;
  const suggestedAction = payload['suggested_action'];
  const currentOptionLabel = payload['current_option_label']; // Which option we're on
  
  if (!suggestedAction) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <ActionValidator
        optionLabel={currentOptionLabel}
        suggestedAction={suggestedAction}
        onAccept={() => {
          // Accept suggested action
          void nextStepAction({
            orgId: session.orgId,
            userId: session.userId,
            sessionId: session._id,
            stepName: 'will',
            userTurn: 'Accepted suggested action',
            structuredInput: {
              type: 'action_validation',
              data: { choice: 'accept', action: suggestedAction }
            }
          });
        }}
        onModify={() => {
          // Show modification form (Phase 3)
          alert('Modify form coming in Phase 3');
        }}
        onSkip={() => {
          // Skip this option
          void nextStepAction({
            orgId: session.orgId,
            userId: session.userId,
            sessionId: session._id,
            stepName: 'will',
            userTurn: 'Skipped this option',
            structuredInput: {
              type: 'action_validation',
              data: { choice: 'skip' }
            }
          });
        }}
      />
    </div>
  );
})()}
```

---

## 🔄 Phase 3: Review Step Simplification

### Goal
Remove key_takeaways and confidence_level. Keep only immediate_next_step. Move AI analysis to background.

### Current Flow
```
1. AI asks: "What are the key takeaways?"
2. User types takeaways
3. AI asks: "What's your immediate next step?"
4. User types next step
5. AI asks: "How confident are you?"
6. User types confidence level
7. Frontend triggers generateReviewAnalysis
8. AI generates full analysis
9. Show report
```

### New Flow
```
1. AI asks: "What's your immediate next step to get started?"
2. User types next step
3. Session closes
4. AI generates analysis in background
5. Show report with AI insights
```

### Implementation Steps

#### 3.1 Update Review Prompt
**File:** `convex/prompts/grow.ts`

```typescript
review: `REVIEW - Immediate Next Step Only

Ask ONE question:
"What's your immediate next step to get started?"

EXTRACT:
- immediate_next_step: Their answer
- coach_reflection: "What's your immediate next step to get started?"

CRITICAL:
- Do NOT ask for key takeaways
- Do NOT ask for confidence level
- Just get their immediate next step
- Session will close after this
- AI analysis happens in background
`,
```

#### 3.2 Update Review Schema
**File:** `convex/frameworks/grow.ts`

```typescript
review: v.object({
  coach_reflection: v.string({ minLength: 20 }),
  immediate_next_step: v.string(), // Only this field
  // Removed: key_takeaways, confidence_level
}),
```

#### 3.3 Update Review Step Completion
**File:** `convex/coach/grow.ts`

```typescript
private checkReviewCompletion(payload: ReflectionPayload): StepCompletionResult {
  const hasImmediateStep = typeof payload["immediate_next_step"] === "string" && 
                           payload["immediate_next_step"].length > 0;
  
  if (hasImmediateStep) {
    // Close session and trigger background analysis
    return { shouldAdvance: true, closeSession: true };
  }
  
  return { shouldAdvance: false };
}
```

---

## 📊 Backend: Structured Input Handling

### Add to nextStepAction
**File:** `convex/coach/index.ts`

```typescript
export const nextStepAction = action({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    stepName: v.string(),
    userTurn: v.string(),
    structuredInput: v.optional(v.object({
      type: v.string(),
      data: v.any()
    }))
  },
  handler: async (ctx, args) => {
    // Handle structured input from buttons
    if (args.structuredInput) {
      switch (args.structuredInput.type) {
        case 'options_selection':
          // User selected options via buttons
          const { selected_option_ids } = args.structuredInput.data;
          // Store selection and advance to Will
          break;
        
        case 'action_validation':
          // User accepted/modified/skipped action
          const { choice, action } = args.structuredInput.data;
          if (choice === 'accept') {
            // Store action
          } else if (choice === 'skip') {
            // Move to next option
          }
          break;
      }
    }
    
    // Continue with normal flow...
  }
});
```

---

## 🎯 Success Metrics

### Options Step
- [ ] 90%+ users use buttons (vs text)
- [ ] Options selection time < 10 seconds
- [ ] Zero parsing errors
- [ ] Mobile completion rate +20%

### Will Step
- [ ] 70%+ users accept AI suggestions
- [ ] 20-25% modify suggestions
- [ ] <5% skip actions
- [ ] 2-3 actions per session average
- [ ] Will step time < 2 minutes

### Review Step
- [ ] Review step < 30 seconds
- [ ] Session completion rate 85%+
- [ ] User satisfaction with report 4.5+/5

### Overall
- [ ] Session duration 15-20 min (down from 20-30 min)
- [ ] AI cost per session $0.35 (down from $0.40)
- [ ] Actions per session 2-3 (up from 1-2)

---

## 🚀 Implementation Order

1. ✅ **Introduction:** Yes/No buttons (DONE)
2. 🔄 **Options:** Multi-select with pros/cons (IN PROGRESS)
3. ⏳ **Will:** AI-suggested actions with validation
4. ⏳ **Review:** Simplified to immediate_next_step only
5. ⏳ **Backend:** Structured input handling
6. ⏳ **Testing:** Full flow end-to-end

---

**Ready to proceed with Options step implementation?**
