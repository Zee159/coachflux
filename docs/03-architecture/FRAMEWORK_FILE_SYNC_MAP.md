# Framework File Synchronization Map

**Quick Reference:** Files that must stay in sync when implementing a new framework

---

## Critical Synchronization Points

### 1. Step Names (MUST MATCH EXACTLY)

| File | Location | Purpose |
|------|----------|---------|
| `convex/frameworks/[name].ts` | `steps[].name` | Source of truth |
| `convex/coach/[name].ts` | `getRequiredFields()` keys | Validation logic |
| `convex/prompts/[name].ts` | Prompt object keys | AI guidance |
| `src/components/SessionView.tsx` | `FRAMEWORK_STEPS` array | Progress tracking |
| `src/components/SessionView.tsx` | `COACHING_TIPS` keys | UI tips |
| `src/components/SessionView.tsx` | `getNextStepName()` mapping | Button text |

**Example:** If framework has step `"gap_analysis"`, ALL files must use `"gap_analysis"` (not `"gapAnalysis"` or `"GAP_ANALYSIS"`)

---

### 2. Coaching Questions (MUST MATCH ORDER)

| File | Location | Purpose |
|------|----------|---------|
| `convex/frameworks/[name].ts` | `steps[].coaching_questions` | Sidebar display |
| `convex/prompts/[name].ts` | Question flow (Q1, Q2, Q3...) | AI asks in order |

**Rule:** Questions in sidebar should appear in same order as AI asks them in prompts.

---

### 3. Framework Registration (MUST ADD TO ALL)

| File | Location | What to Add |
|------|----------|-------------|
| `convex/coach/base.ts` | Step completion router | Import + if statement |
| `convex/prompts/index.ts` | Prompt builder | Import + if statement |
| `convex/queries.ts` | `getFrameworkQuestions` | Ternary condition |
| `convex/reports/[name].ts` | New file | Report generator |
| `src/components/SessionView.tsx` | Multiple locations | See below |

---

### 4. SessionView.tsx Integration Points

| Line | What to Add | Example |
|------|-------------|---------|
| ~300 | `COACHING_TIPS` entries | `step1: "Tip text"` |
| ~706 | Step array constant | `const FRAMEWORK_STEPS = [...]` |
| ~708 | `frameworkSteps` selection | `session.framework === "NAME" ? FRAMEWORK_STEPS :` |
| ~800 | `getNextStepName()` mapping | `if (session.framework === "NAME") { ... }` |

---

## File Dependency Chain

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Framework Definition (convex/frameworks/[name].ts)      │
│    - Step names (source of truth)                          │
│    - Coaching questions                                     │
│    - Schema definitions                                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─────────────────────────────────────────────┐
                 │                                             │
                 ▼                                             ▼
┌────────────────────────────────┐    ┌─────────────────────────────────┐
│ 2. Coach Logic                 │    │ 3. Prompts                      │
│    (convex/coach/[name].ts)    │    │    (convex/prompts/[name].ts)   │
│    - Uses step names           │    │    - Uses step names            │
│    - Validation rules          │    │    - Question flows             │
└────────────────┬───────────────┘    └────────────┬────────────────────┘
                 │                                  │
                 └──────────────┬───────────────────┘
                                │
                                ▼
                ┌───────────────────────────────────┐
                │ 4. Base Coach Router              │
                │    (convex/coach/base.ts)         │
                │    - Routes to framework coach    │
                │    - Routes to framework prompts  │
                └───────────────┬───────────────────┘
                                │
                                ▼
                ┌───────────────────────────────────┐
                │ 5. Backend Query                  │
                │    (convex/queries.ts)            │
                │    - Fetches coaching questions   │
                └───────────────┬───────────────────┘
                                │
                                ▼
                ┌───────────────────────────────────┐
                │ 6. Frontend Integration           │
                │    (src/components/SessionView)   │
                │    - Step arrays                  │
                │    - Progress tracking            │
                │    - Sidebar display              │
                └───────────────────────────────────┘
```

---

## Pre-Implementation Checklist

Before writing any code, decide on:

- [ ] **Framework name** (e.g., "MINIMAL", "POWER", "SMART")
- [ ] **Step count** (5-8 recommended)
- [ ] **Step names** (lowercase with underscores: `gap_analysis`)
- [ ] **Step sequence** (introduction → steps → review)
- [ ] **Required fields per step** (2-5 fields recommended)

---

## Implementation Order

**Phase 1: Backend (Do First)**
1. Create `convex/frameworks/[name].ts` ✅ Source of truth
2. Create `convex/coach/[name].ts` ✅ Validation logic
3. Create `convex/prompts/[name].ts` ✅ AI guidance
4. Update `convex/coach/base.ts` ✅ Router
5. Update `convex/prompts/index.ts` ✅ Prompt builder
6. Update `convex/queries.ts` ✅ Questions query
7. Create `convex/reports/[name].ts` ✅ Report generator

**Phase 2: Frontend (Do Second)**
8. Update `src/components/SessionView.tsx` ✅ All integration points

**Phase 3: Testing (Do Last)**
9. Test full session flow
10. Verify sidebar integration
11. Check report generation

---

## Common Sync Errors

### Error 1: Step Name Mismatch

**Symptom:** "Step not found" or validation fails

**Example:**
```typescript
// ❌ WRONG - Inconsistent naming
convex/frameworks/minimal.ts:  steps: [{ name: "explore" }]
convex/coach/minimal.ts:       getRequiredFields("exploration")  // Different!
```

**Fix:** Use exact same name everywhere:
```typescript
// ✅ CORRECT
convex/frameworks/minimal.ts:  steps: [{ name: "explore" }]
convex/coach/minimal.ts:       getRequiredFields("explore")  // Same!
```

---

### Error 2: Missing Framework Registration

**Symptom:** Framework not recognized, falls back to GROW

**Example:**
```typescript
// ❌ WRONG - Forgot to add to queries.ts
export const getFrameworkQuestions = query({
  handler: (_ctx, args) => {
    const framework = args.framework === "GROW" ? growFramework 
                    : args.framework === "COMPASS" ? compassFramework
                    : growFramework;  // Missing MINIMAL!
  },
});
```

**Fix:** Add to all routers:
```typescript
// ✅ CORRECT
const framework = args.framework === "GROW" ? growFramework 
                : args.framework === "COMPASS" ? compassFramework
                : args.framework === "MINIMAL" ? minimalFramework  // Added!
                : growFramework;
```

---

### Error 3: Question Order Mismatch

**Symptom:** Sidebar shows questions in different order than AI asks

**Example:**
```typescript
// ❌ WRONG - Different order
convex/frameworks/minimal.ts:
  coaching_questions: ["What's your goal?", "What's the situation?"]

convex/prompts/minimal.ts:
  Q1: "What's the situation?"  // Asked first
  Q2: "What's your goal?"      // Asked second
```

**Fix:** Match the order:
```typescript
// ✅ CORRECT
convex/frameworks/minimal.ts:
  coaching_questions: ["What's the situation?", "What's your goal?"]

convex/prompts/minimal.ts:
  Q1: "What's the situation?"  // Matches sidebar
  Q2: "What's your goal?"      // Matches sidebar
```

---

### Error 4: Progress Bar Wrong

**Symptom:** Shows 6 steps when framework has 5

**Example:**
```typescript
// ❌ WRONG - Using GROW steps for MINIMAL framework
const frameworkSteps = 
  session.framework === "COMPASS" ? COMPASS_STEPS :
  GROW_STEPS;  // Missing MINIMAL!
```

**Fix:** Add framework steps:
```typescript
// ✅ CORRECT
const MINIMAL_STEPS = ["introduction", "explore", "plan", "review"];

const frameworkSteps = 
  session.framework === "COMPASS" ? COMPASS_STEPS :
  session.framework === "MINIMAL" ? MINIMAL_STEPS :  // Added!
  GROW_STEPS;
```

---

## Quick Validation Script

After implementation, verify sync with this checklist:

```bash
# 1. Check step names match
grep -r "step_name_here" convex/frameworks/
grep -r "step_name_here" convex/coach/
grep -r "step_name_here" convex/prompts/
grep -r "step_name_here" src/components/SessionView.tsx

# 2. Check framework registered
grep "FRAMEWORK_NAME" convex/coach/base.ts
grep "FRAMEWORK_NAME" convex/prompts/index.ts
grep "FRAMEWORK_NAME" convex/queries.ts
grep "FRAMEWORK_NAME" src/components/SessionView.tsx

# 3. Count steps match
# Should return same number for all:
grep -c "name:" convex/frameworks/[name].ts
grep -c "case" convex/coach/[name].ts
wc -l FRAMEWORK_STEPS array in SessionView.tsx
```

---

## File Templates

### Minimal Framework Definition Template

```typescript
// convex/frameworks/minimal.ts
import { v } from "convex/values";

export const MINIMAL_STEPS = ["introduction", "explore", "plan", "review"] as const;

export const minimalFramework = {
  name: "MINIMAL",
  steps: [
    {
      name: "introduction",
      objective: "Welcome. Get consent.",
      coaching_questions: ["Ready to begin?"],
      schema: v.object({
        coach_reflection: v.string(),
        user_consent: v.optional(v.boolean()),
      }),
    },
    // ... more steps
  ],
  system_objective: "Quick coaching framework.",
};
```

### Minimal Coach Logic Template

```typescript
// convex/coach/minimal.ts
import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export function getRequiredFields(step: string): string[] {
  const fieldMap: Record<string, string[]> = {
    introduction: ["user_consent"],
    explore: ["situation", "goal"],
    plan: ["actions"],
    review: ["key_takeaway"],
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
    // Implementation here
  },
});
```

---

## Summary

**3 Golden Rules:**

1. **Step names are sacred** - Use exact same names everywhere
2. **Register everywhere** - Add framework to all routers/queries
3. **Test the chain** - Verify backend → query → frontend flow

**Files that MUST sync:**
- Framework definition (source of truth)
- Coach logic (uses step names)
- Prompts (uses step names)
- Base router (routes to framework)
- Queries (fetches questions)
- SessionView (displays everything)

**When in doubt:**
- Copy existing framework (GROW/COMPASS/CAREER)
- Search for framework name in all files
- Use grep to verify step names match

---

**Last Updated:** November 11, 2025
