# Framework Implementation Guide

**Last Updated:** November 11, 2025  
**Purpose:** Step-by-step guide for implementing new coaching frameworks in CoachFlux

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start Checklist](#quick-start-checklist)
3. [Implementation Steps](#implementation-steps)
4. [Common Patterns](#common-patterns)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Overview

CoachFlux uses a **modular coaching architecture** with 5 core components:

1. **Framework Schema** (`convex/frameworks/[name].ts`) - Data structure, validation
2. **Coach Logic** (`convex/coach/[name].ts`) - Step completion, field validation
3. **Prompts** (`convex/prompts/[name].ts`) - AI guidance, question flows
4. **Reports** (`convex/reports/[name].ts`) - Data presentation
5. **UI Integration** (`src/components/SessionView.tsx`) - Frontend display

**Existing Frameworks:**
- **GROW:** 6 steps (introduction → goal → reality → options → will → review)
- **COMPASS:** 7 steps (introduction → clarity → ownership → mapping → practice → anchoring → sustaining → review)
- **CAREER:** 5 steps (INTRODUCTION → ASSESSMENT → GAP_ANALYSIS → ROADMAP → REVIEW)

---

## Quick Start Checklist

### Planning (1-2 hours)
- [ ] Define framework name and acronym
- [ ] Map step sequence (5-8 steps recommended)
- [ ] Identify required fields per step
- [ ] Design completion criteria

### Backend (4-6 hours)
- [ ] Create schema (`convex/frameworks/[name].ts`)
- [ ] Implement coach logic (`convex/coach/[name].ts`)
- [ ] Write prompts (`convex/prompts/[name].ts`)
- [ ] Create report generator (`convex/reports/[name].ts`)
- [ ] Update base coach router

### Frontend (2-3 hours)
- [ ] Add framework to SessionView step arrays
- [ ] Create custom UI components (if needed)
- [ ] Update progress tracking

### Testing (2-4 hours)
- [ ] Test full session flow
- [ ] Verify field extraction
- [ ] Validate report generation
- [ ] Test edge cases

**Total Time:** 9-15 hours

---

## Implementation Steps

### Step 1: Create Framework Schema

**File:** `convex/frameworks/[name].ts`

```typescript
import { v } from "convex/values";

export const FRAMEWORK_STEPS = ["introduction", "step1", "step2", "review"] as const;
export type FrameworkStep = typeof FRAMEWORK_STEPS[number];

export const frameworkSchema = {
  introduction: v.object({
    coach_reflection: v.string(),
    user_consent: v.optional(v.boolean()),
  }),
  
  step1: v.object({
    coach_reflection: v.string(),
    field1: v.optional(v.string()),
    field2: v.optional(v.number()),
    field3: v.optional(v.array(v.string())),
  }),
  
  review: v.object({
    coach_reflection: v.string(),
    key_takeaways: v.optional(v.string()),
    final_confidence: v.optional(v.number()),
  }),
};

export const frameworkDefinition = {
  name: "FRAMEWORK_NAME",
  steps: FRAMEWORK_STEPS,
  schema: frameworkSchema,
  system_objective: "High-level description of framework purpose",
};
```

**Key Decisions:**
- Use `v.optional()` for all fields except `coach_reflection`
- Add `minLength`, `maxLength` constraints where appropriate
- Set `additionalProperties: false` to prevent auto-filling
- Use lowercase step names (except CAREER uses uppercase)

---

### Step 2: Implement Coach Logic

**File:** `convex/coach/[name].ts`

```typescript
import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export function getRequiredFields(step: string): string[] {
  const fieldMap: Record<string, string[]> = {
    introduction: ["user_consent"],
    step1: ["field1", "field2", "field3"],
    review: ["key_takeaways", "final_confidence"],
  };
  return fieldMap[step] || [];
}

export const checkStepCompletion = internalMutation({
  args: {
    sessionId: v.id("sessions"),
    currentStep: v.string(),
    payload: v.any(),
    skipCount: v.number(),
  },
  handler: async (ctx, args) => {
    const { currentStep, payload, skipCount } = args;
    
    // Introduction - special handling
    if (currentStep === "introduction") {
      return payload["user_consent"] === true;
    }
    
    // Review - special handling
    if (currentStep === "review") {
      return payload["key_takeaways"]?.length >= 50 && 
             typeof payload["final_confidence"] === "number";
    }
    
    // Regular steps - field validation with progressive relaxation
    const requiredFields = getRequiredFields(currentStep);
    const completedCount = requiredFields.filter(field => {
      const value = payload[field];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.length > 0;
      return value !== undefined && value !== null;
    }).length;
    
    // Progressive relaxation
    if (skipCount === 0) {
      return completedCount >= Math.max(1, requiredFields.length - 1); // Strict: 4/5
    } else if (skipCount === 1) {
      return completedCount >= Math.max(1, requiredFields.length - 2); // Lenient: 3/5
    } else {
      return completedCount >= Math.max(1, Math.floor(requiredFields.length / 2)); // Very lenient: 2/5
    }
  },
});
```

**Key Patterns:**
- Introduction: Only check `user_consent`
- Review: Check comprehensive reflection fields
- Regular steps: Use progressive relaxation based on skip count
- Identify critical fields that MUST be present

---

### Step 3: Write Prompts

**File:** `convex/prompts/[name].ts`

```typescript
export const FRAMEWORK_PROMPTS = {
  introduction: `
# INTRODUCTION Phase

## Objective
Explain framework and get consent.

## Question Flow
1. Explain what this framework does
2. Ask: "Would you like to begin?"

## Field Extraction
- **user_consent:** Extract TRUE when user says yes/sure/let's go
- **coach_reflection:** Your explanation (20+ chars)

## Completion Criteria
- user_consent = true
`,

  step1: `
# STEP1 Phase

## Objective
[What this step achieves]

## Question Flow (Progressive)
1. **Q1:** "What is [field1]?" → Extract field1
2. **Q2:** "How would you rate [field2] (1-10)?" → Extract field2
3. **Q3:** "What are [field3]?" → Extract field3 (array)

## Field Extraction Rules

### field1 (string, required)
- **Ask:** "What is [field1]?"
- **Wait for:** User provides specific answer
- **Extract when:** User explicitly states information
- **Validation:** minLength: 10 chars
- **DO NOT:** Auto-fill or infer

### field2 (number, required)
- **Ask:** "How would you rate [field2] on scale of 1-10?"
- **Wait for:** User provides number
- **Extract when:** User says number between 1-10
- **DO NOT:** Estimate or guess

### field3 (array, required)
- **Ask:** "What are [field3]?"
- **Wait for:** User lists items
- **Extract when:** User provides list (or says "none")
- **DO NOT:** Generate suggestions unless user asks

## Opportunistic Extraction
If user mentions multiple fields in one response, extract all explicitly stated information.
✅ Extract: Information directly stated
❌ Do NOT extract: Implied, inferred, or assumed information

## Completion Criteria
- All 3 fields captured (or 2/3 if skip count = 1)
- field1 length >= 10 chars
- field2 is valid number 1-10
- field3 is array (can be empty if user said "none")

## Examples

### WRONG (Auto-filling)
**User:** "I want to improve my leadership."
**AI Extracts:** field1="leadership", field2=5, field3=["communication"]
**Problem:** AI invented field2 and field3

### CORRECT (Wait for explicit info)
**User:** "I want to improve my leadership."
**AI:** "How confident are you (1-10)?"
**User:** "Maybe a 6."
**AI Extracts:** field1="improve leadership", field2=6
**AI:** "What specific areas do you want to focus on?"
`,

  review: `
# REVIEW Phase

## Objective
Capture reflections and final measurements.

## Question Flow
1. "What are your key takeaways?" → key_takeaways
2. "What's your immediate next step?" → immediate_next_step
3. "How confident are you now (1-10)?" → final_confidence

## Completion Criteria
- key_takeaways >= 50 chars
- immediate_next_step >= 10 chars
- final_confidence is number 1-10
`,
};

export function getFrameworkPrompt(step: string): string {
  return FRAMEWORK_PROMPTS[step as keyof typeof FRAMEWORK_PROMPTS] || "";
}
```

**Prompt Best Practices:**
1. Progressive question flow (Q1, Q2, Q3...)
2. Explicit field extraction rules
3. WAIT instructions for each field
4. DO NOT rules to prevent auto-filling
5. WRONG vs CORRECT examples
6. Opportunistic extraction guidance
7. Clear completion criteria

---

### Step 4: Create Report Generator

**File:** `convex/reports/[name].ts`

```typescript
import type { SessionReportData } from "../types";

export function generateFrameworkReport(
  session: any,
  reflections: any[]
): SessionReportData {
  const step1 = reflections.find(r => r.step === "step1");
  const review = reflections.find(r => r.step === "review");
  
  const sections: SessionReportData["sections"] = [];
  
  // Overview
  sections.push({
    title: "Session Overview",
    content: `**Framework:** ${session.framework}\n**Date:** ${new Date(session._creationTime).toLocaleDateString()}`,
  });
  
  // Step 1 Summary
  if (step1?.payload) {
    sections.push({
      title: "Step 1",
      content: `**Field 1:** ${step1.payload.field1 || "Not captured"}\n**Field 2:** ${step1.payload.field2 || "Not captured"}`,
    });
  }
  
  // Key Takeaways
  if (review?.payload) {
    sections.push({
      title: "Key Takeaways",
      content: review.payload.key_takeaways || "Not captured",
    });
  }
  
  return {
    sessionId: session._id,
    framework: session.framework,
    createdAt: session._creationTime,
    sections,
  };
}
```

---

### Step 5: Update Base Coach Router

**File:** `convex/coach/base.ts`

```typescript
import { checkStepCompletion as checkFrameworkCompletion } from "./framework";

// In step completion check
if (session.framework === "FRAMEWORK_NAME") {
  isComplete = await checkFrameworkCompletion(ctx, {
    sessionId: session._id,
    currentStep: session.currentStep,
    payload: latestReflection.payload,
    skipCount: session.skipCount || 0,
  });
}
```

**File:** `convex/prompts/index.ts`

```typescript
import { getFrameworkPrompt } from "./framework";

// In buildSystemPrompt function
if (framework === "FRAMEWORK_NAME") {
  const stepGuidance = getFrameworkPrompt(currentStep);
  systemPrompt += `\n\n${stepGuidance}`;
}
```

---

### Step 6: Frontend Integration

**File:** `src/components/SessionView.tsx`

```typescript
// Add step array (around line 706)
const FRAMEWORK_STEPS = ["introduction", "step1", "step2", "review"];

// Update getNextStepName (around line 800)
if (session.framework === "FRAMEWORK_NAME") {
  const steps: Record<string, string> = {
    introduction: "Step 1",
    step1: "Step 2",
    step2: "Review",
    review: "Report",
  };
  return steps[currentStep.toLowerCase()] || "Next Step";
}

// Update frameworkSteps selection (around line 708)
const frameworkSteps = 
  session.framework === "COMPASS" ? COMPASS_STEPS :
  session.framework === "CAREER" ? CAREER_STEPS :
  session.framework === "FRAMEWORK_NAME" ? FRAMEWORK_STEPS :
  GROW_STEPS;
```

---

## Common Patterns

### Pattern 1: Scale Questions (1-10)

**Schema:** `confidence_score: v.optional(v.number())`

**Prompt:**
```
**confidence_score (number, required)**
- **Ask:** "On a scale of 1-10, how confident are you?"
- **Wait for:** User provides number
- **Extract when:** User says number between 1-10
```

**UI:** Use `ConfidenceScaleSelector` component

---

### Pattern 2: AI-Generated Suggestions

**Schema:**
```typescript
ai_suggested_items: v.optional(v.array(v.object({
  id: v.string(),
  title: v.string(),
  description: v.string(),
}))),
selected_item_ids: v.optional(v.array(v.string())),
```

**Prompt:**
```
1. Ask: "Would you like me to suggest [items]?"
2. If yes → Generate 3-5 suggestions with IDs
3. Ask: "Which would you like to focus on?"
4. Extract selected_item_ids when user chooses
```

**Example:** CAREER framework's gap suggestions

---

### Pattern 3: Iterative Collection

**Schema:**
```typescript
actions: v.optional(v.array(v.object({
  action: v.string(),
  due_days: v.number(),
}))),
```

**Prompt:**
```
1. Ask: "What's the first action?"
2. Extract action details
3. Ask: "Add another action, or move to next step?"
4. If "another" → Repeat from step 1
5. If "next" → Advance step
```

**Example:** GROW framework's Will step

---

## Testing

### Manual Testing Checklist

- [ ] Introduction flow (consent → advance)
- [ ] Each step asks all required questions
- [ ] Questions appear in correct order
- [ ] No auto-filled fields
- [ ] Opportunistic extraction works
- [ ] Skip handling (progressive relaxation)
- [ ] Amendment flow
- [ ] Review questions all asked
- [ ] Report generates correctly

### Edge Cases

- [ ] Very short responses
- [ ] Very long responses
- [ ] Special characters in text
- [ ] Empty arrays ("none")
- [ ] Session recovery after error

---

## Troubleshooting

### Issue 1: AI Auto-Filling Fields

**Solutions:**
- Add `additionalProperties: false` to schema
- Add "DO NOT auto-fill" rules in prompts
- Add "WAIT for user response" instructions
- Show WRONG vs CORRECT examples

**Reference:** COMPASS bug fixes (Memory: a1ab26e5)

---

### Issue 2: Steps Advancing Too Early

**Solutions:**
- Check `getRequiredFields()` includes all fields
- Verify completion logic requires sufficient field count
- Add critical field checks
- Test progressive relaxation thresholds

**Reference:** COMPASS step completion (Memory: 40348d12)

---

### Issue 3: JSON Parsing Errors

**Solutions:**
- Increase `max_tokens` to 1200+
- Add JSON safety rules to prompts
- Keep descriptions concise (< 150 chars)
- Avoid quotes in generated text

**Reference:** CAREER JSON safety (Memory: 3ba60c92)

---

### Issue 4: Progress Bar Not Working

**Solutions:**
- Add framework steps array to SessionView
- Update `frameworkSteps` selection logic
- Add framework to `getNextStepName()` function
- Handle case sensitivity

**Reference:** CAREER progress bar (Memory: c7935d0f)

---

## Best Practices Summary

### Schema Design
✅ Use `v.optional()` for all fields except `coach_reflection`  
✅ Add `minLength` for text fields (10-50 chars)  
✅ Set `additionalProperties: false`  
✅ Include validation constraints (1-10 for scales)  

### Prompt Writing
✅ Number questions progressively  
✅ Add "WAIT for user response" instructions  
✅ Include "DO NOT auto-fill" rules  
✅ Show WRONG vs CORRECT examples  
✅ Enable opportunistic extraction  

### Coach Logic
✅ Implement progressive relaxation  
✅ Identify critical fields  
✅ Handle introduction/review specially  
✅ Add debug logging  

### Report Generation
✅ Extract data from reflections by step  
✅ Handle missing data gracefully  
✅ Show before/after measurements  
✅ Include actionable next steps  

---

## Minimal Framework Template

Quick-start template you can copy and modify:

**convex/frameworks/minimal.ts:**
```typescript
import { v } from "convex/values";

export const MINIMAL_STEPS = ["introduction", "explore", "plan", "review"] as const;

export const minimalSchema = {
  introduction: v.object({
    coach_reflection: v.string(),
    user_consent: v.optional(v.boolean()),
  }),
  explore: v.object({
    coach_reflection: v.string(),
    situation: v.optional(v.string()),
    goal: v.optional(v.string()),
  }),
  plan: v.object({
    coach_reflection: v.string(),
    actions: v.optional(v.array(v.string())),
    confidence: v.optional(v.number()),
  }),
  review: v.object({
    coach_reflection: v.string(),
    key_takeaway: v.optional(v.string()),
  }),
};

export const minimalFramework = {
  name: "MINIMAL",
  steps: MINIMAL_STEPS,
  schema: minimalSchema,
  system_objective: "A minimal coaching framework for quick goal exploration.",
};
```

---

---

## Sidebar Integration

The sidebar is a critical UI component that displays coaching questions and progress. It requires coordination across **4 files**.

### Architecture Overview

```
Framework Definition (convex/frameworks/[name].ts)
    ↓ coaching_questions field
Backend Query (convex/queries.ts)
    ↓ getFrameworkQuestions
Frontend Hook (src/components/SessionView.tsx)
    ↓ useQuery(api.queries.getFrameworkQuestions)
Sidebar UI (src/components/SessionView.tsx)
    ↓ Displays questions + progress
```

---

### File 1: Framework Definition

**File:** `convex/frameworks/[name].ts`

Add `coaching_questions` array to each step:

```typescript
export const frameworkDefinition = {
  name: "FRAMEWORK_NAME",
  steps: [
    {
      name: "introduction",
      objective: "Explain framework and get consent.",
      coaching_questions: [
        "Does this framework feel right for what you're facing today?"
      ],
      schema: v.object({
        coach_reflection: v.string(),
        user_consent: v.optional(v.boolean()),
      }),
    },
    {
      name: "step1",
      objective: "Explore the situation and identify goals.",
      coaching_questions: [
        "What situation are you facing?",
        "What would you like to achieve?",
        "Why is this important to you right now?",
        "What timeframe are you working with?"
      ],
      schema: v.object({
        coach_reflection: v.string(),
        situation: v.optional(v.string()),
        goal: v.optional(v.string()),
      }),
    },
    // ... more steps
  ],
  system_objective: "Framework description",
};
```

**Key Points:**
- `coaching_questions` is an array of strings
- Questions appear in sidebar before user starts answering
- First sentence of `objective` becomes sidebar title
- Questions should match prompt flow

---

### File 2: Backend Query

**File:** `convex/queries.ts`

Add your framework to `getFrameworkQuestions` query:

```typescript
export const getFrameworkQuestions = query({
  args: { framework: v.string() },
  handler: (_ctx, args) => {
    const framework = args.framework === "GROW" ? growFramework 
                    : args.framework === "CAREER" ? careerFramework 
                    : args.framework === "COMPASS" ? compassFramework
                    : args.framework === "FRAMEWORK_NAME" ? frameworkDefinition // ✅ Add this
                    : growFramework; // Default fallback
    
    // Build questions map from framework steps
    const questionsMap: Record<string, { title: string; questions: string[] }> = {};
    
    for (const step of framework.steps) {
      questionsMap[step.name] = {
        title: step.objective?.split('.')[0] ?? step.name,
        questions: step.coaching_questions ?? []
      };
    }
    
    return questionsMap;
  },
});
```

**Import your framework at top of file:**
```typescript
import { frameworkDefinition } from "./frameworks/framework";
```

---

### File 3: Frontend Hook

**File:** `src/components/SessionView.tsx`

The hook is already implemented (around line 562), no changes needed:

```typescript
// Fetch framework questions dynamically from backend (single source of truth)
const frameworkQuestions = useQuery(
  api.queries.getFrameworkQuestions,
  session?.framework !== undefined && session.framework !== null && session.framework.length > 0
    ? { framework: session.framework }
    : "skipToken"
);
```

This automatically fetches questions for any framework.

---

### File 4: Sidebar UI

**File:** `src/components/SessionView.tsx`

Add coaching tips for your framework (around line 300):

```typescript
const COACHING_TIPS: Record<StepName, string> = {
  // ... existing tips
  step1: "Focus on specific details, not vague concepts.",
  step2: "Generate multiple possibilities before evaluating them.",
  // Add tips for each step
};
```

**Sidebar displays 3 components:**

1. **Coaching Questions Card** (lines 3193-3348)
   - Shows questions from `frameworkQuestions` (backend)
   - Falls back to `COACHING_PROMPTS` (hardcoded)
   - Displays discussion summary after user responds
   - Collapsible "View All Questions" section

2. **Framework Progress Card** (lines 3350-3386)
   - Shows all steps with current step highlighted
   - Uses `frameworkSteps` array
   - Formats step names (e.g., "GAP_ANALYSIS" → "Gap Analysis")

3. **Coaching Tips** (lines 3387-3395)
   - Shows tip for current step from `COACHING_TIPS`

---

### Synchronization Checklist

When adding a new framework, ensure these match:

**Step Names Must Match Across:**
- [ ] `convex/frameworks/[name].ts` - `steps[].name`
- [ ] `convex/coach/[name].ts` - `getRequiredFields()` keys
- [ ] `convex/prompts/[name].ts` - Prompt keys
- [ ] `src/components/SessionView.tsx` - `FRAMEWORK_STEPS` array
- [ ] `src/components/SessionView.tsx` - `COACHING_TIPS` keys
- [ ] `src/components/SessionView.tsx` - `getNextStepName()` mapping

**Coaching Questions Must Match:**
- [ ] `convex/frameworks/[name].ts` - `coaching_questions` array
- [ ] `convex/prompts/[name].ts` - Question flow in prompts
- [ ] Questions should be in same order as prompt asks them

**Progress Tracking Must Match:**
- [ ] `src/components/SessionView.tsx` - Add to `frameworkSteps` selection (line ~708)
- [ ] `src/components/SessionView.tsx` - Add to `getNextStepName()` (line ~800)
- [ ] Step count should match framework definition

---

### Example: Complete Sidebar Integration

**1. Framework Definition:**
```typescript
// convex/frameworks/minimal.ts
export const minimalFramework = {
  name: "MINIMAL",
  steps: [
    {
      name: "introduction",
      objective: "Welcome. Get user consent to begin.",
      coaching_questions: ["Ready to begin?"],
      schema: v.object({
        coach_reflection: v.string(),
        user_consent: v.optional(v.boolean()),
      }),
    },
    {
      name: "explore",
      objective: "Explore the situation. Understand context and goals.",
      coaching_questions: [
        "What situation are you facing?",
        "What would you like to achieve?",
        "Why is this important now?"
      ],
      schema: v.object({
        coach_reflection: v.string(),
        situation: v.optional(v.string()),
        goal: v.optional(v.string()),
      }),
    },
  ],
  system_objective: "Quick 3-step coaching for goal exploration.",
};
```

**2. Backend Query:**
```typescript
// convex/queries.ts
import { minimalFramework } from "./frameworks/minimal";

export const getFrameworkQuestions = query({
  args: { framework: v.string() },
  handler: (_ctx, args) => {
    const framework = args.framework === "GROW" ? growFramework 
                    : args.framework === "CAREER" ? careerFramework 
                    : args.framework === "COMPASS" ? compassFramework
                    : args.framework === "MINIMAL" ? minimalFramework // ✅ Added
                    : growFramework;
    // ... rest of function
  },
});
```

**3. Frontend Integration:**
```typescript
// src/components/SessionView.tsx

// Add step array (line ~706)
const MINIMAL_STEPS = ["introduction", "explore", "plan", "review"];

// Add to frameworkSteps selection (line ~708)
const frameworkSteps = 
  session.framework === "COMPASS" ? COMPASS_STEPS :
  session.framework === "CAREER" ? CAREER_STEPS :
  session.framework === "MINIMAL" ? MINIMAL_STEPS : // ✅ Added
  GROW_STEPS;

// Add to getNextStepName (line ~800)
if (session.framework === "MINIMAL") {
  const steps: Record<string, string> = {
    introduction: "Explore",
    explore: "Plan",
    plan: "Review",
    review: "Report",
  };
  return steps[currentStep.toLowerCase()] || "Next Step";
}

// Add coaching tips (line ~300)
const COACHING_TIPS: Record<StepName, string> = {
  // ... existing tips
  explore: "Be specific about your situation and what you want to achieve.",
  plan: "Commit to concrete actions with clear timelines.",
};
```

---

### Sidebar Behavior

**Before User Responds:**
- Shows coaching questions for current step
- Questions come from framework definition
- Displays coaching tip at bottom

**After User Responds:**
- Shows "Discussion Summary" with coach's latest reflection
- Displays up to 3 key fields from payload
- Collapses questions into "View All Questions" dropdown
- Progress card highlights current step

**On Step Completion:**
- Progress card updates to next step
- Questions card switches to new step's questions
- Coaching tip updates to new step

---

### Common Sidebar Issues

**Issue 1: Questions Not Showing**

**Symptoms:**
- Sidebar shows "Coaching Questions" but empty list
- Falls back to hardcoded `COACHING_PROMPTS`

**Solutions:**
- Check `coaching_questions` array exists in framework definition
- Verify framework added to `getFrameworkQuestions` query
- Ensure step names match exactly (case-sensitive)

---

**Issue 2: Progress Bar Shows Wrong Steps**

**Symptoms:**
- Progress shows GROW steps for your framework
- Step count incorrect (e.g., 6 instead of 5)

**Solutions:**
- Add framework steps array to SessionView (line ~706)
- Update `frameworkSteps` selection logic (line ~708)
- Verify step names match framework definition

---

**Issue 3: Step Names Display Incorrectly**

**Symptoms:**
- "GAP_ANALYSIS" instead of "Gap Analysis"
- "introduction" instead of "Introduction"

**Solutions:**
- Step name formatting is automatic (line 3379)
- Handles underscores and capitalization
- No changes needed if using standard naming

---

**Issue 4: "Next Step" Button Shows Wrong Text**

**Symptoms:**
- Button says "Proceed to Next Step" instead of "Proceed to Plan"
- Generic text instead of specific step name

**Solutions:**
- Add framework to `getNextStepName()` function (line ~800)
- Map each step to its next step name
- Last step should map to "Report"

---

### Testing Sidebar Integration

**Manual Test:**
1. Start new session with your framework
2. Check sidebar shows correct questions
3. Answer first question
4. Verify discussion summary appears
5. Check progress card highlights current step
6. Complete step
7. Verify progress advances to next step
8. Check new questions appear
9. Complete all steps
10. Verify sidebar hides on session completion

**Checklist:**
- [ ] Questions match prompt flow
- [ ] Step names formatted correctly
- [ ] Progress bar shows correct percentage
- [ ] Discussion summary shows latest reflection
- [ ] Coaching tips display for each step
- [ ] "Next Step" button shows correct text
- [ ] Sidebar hides when session complete

---

## Resources

- **Existing Frameworks:** Study GROW, COMPASS, CAREER implementations
- **Memories:** Search for framework-specific fixes and patterns
- **Documentation:** See `docs/02-frameworks/` for framework guides
- **Testing:** Use `tests/evals/` for test scenarios

---

## Conclusion

Implementing a new framework follows this pattern:

1. **Define schema** - Structure your data
2. **Implement coach logic** - Validation and progression
3. **Write prompts** - AI guidance and extraction rules
4. **Create reports** - Data presentation
5. **Integrate frontend** - UI and progress tracking
6. **Test thoroughly** - Manual and edge cases

**Estimated time:** 9-15 hours for complete implementation

**Key success factors:**
- Clear step sequence
- Explicit field extraction rules
- Progressive relaxation for flexibility
- Comprehensive testing
- Good documentation

For questions or issues, reference existing framework implementations and troubleshooting memories.
