# Modular Prompt Architecture

## 📁 Structure

```
convex/prompts/
├── index.ts           # Main export file with helper functions
├── base.ts            # Core coaching principles (framework-agnostic)
├── grow.ts            # GROW framework-specific prompts
├── compass.ts         # COMPASS framework-specific prompts
└── README.md          # This file
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- **base.ts**: Universal coaching principles that apply to ALL frameworks
  - Empathy protocols
  - Safety boundaries
  - Conversational style
  - AI role guidance (when to suggest vs facilitate)
  
- **{framework}.ts**: Framework-specific guidance
  - Step-by-step coaching questions
  - Phase-specific techniques
  - Examples and patterns

### 2. **Composability**
- Base prompt + Framework prompt = Complete system prompt
- Easy to add new frameworks without touching existing code
- Shared principles automatically apply to all frameworks

### 3. **Maintainability**
- Each file is focused and manageable (~200-400 lines)
- Changes to core principles update all frameworks
- Framework-specific changes are isolated

## 🚀 Usage

### In `coach.ts`:

```typescript
import { SYSTEM_BASE, USER_STEP_PROMPT, getStepGuidance } from "./prompts";

// Get base system prompt (framework-agnostic)
const system = SYSTEM_BASE(orgValues);

// Get framework-specific step prompt
const user = USER_STEP_PROMPT(
  session.frameworkId,  // "GROW" or "COMPASS"
  stepName,
  userTurn,
  conversationHistory,
  loopDetected,
  skipCount,
  capturedState,
  missingFields,
  capturedFields
);

// Compose final prompt
const finalPrompt = system + user;
```

## ➕ Adding a New Framework

### Step 1: Create framework file

```typescript
// convex/prompts/clear.ts
export const CLEAR_COACHING_QUESTIONS: Record<string, string[]> = {
  current_state: ["What's happening now?", ...],
  limiting_beliefs: ["What beliefs are holding you back?", ...],
  // ... other steps
};

export const CLEAR_STEP_GUIDANCE: Record<string, string> = {
  current_state: `CURRENT STATE PHASE - Assess Where You Are
Guidance:
- Explore current situation objectively
- ...
`,
  // ... other steps
};
```

### Step 2: Update index.ts

```typescript
import { CLEAR_COACHING_QUESTIONS, CLEAR_STEP_GUIDANCE } from "./clear";

export function getCoachingQuestions(frameworkId: string): Record<string, string[]> {
  switch (frameworkId.toUpperCase()) {
    case "GROW":
      return GROW_COACHING_QUESTIONS;
    case "COMPASS":
      return COMPASS_COACHING_QUESTIONS;
    case "CLEAR":
      return CLEAR_COACHING_QUESTIONS;  // Add this
    default:
      return GROW_COACHING_QUESTIONS;
  }
}

// Same for getStepGuidance()
```

### Step 3: Done! ✅
- No changes needed to `coach.ts`
- No changes needed to `base.ts`
- New framework automatically gets all core principles

## 📊 File Size Comparison

### Before (Monolithic):
```
prompts.ts: ~1,000 lines
coach.ts: ~970 lines
Total: ~1,970 lines in 2 files
```

### After (Modular):
```
base.ts: ~350 lines (shared)
grow.ts: ~400 lines
compass.ts: ~200 lines
index.ts: ~150 lines
coach.ts: ~970 lines (unchanged)
Total: ~2,070 lines in 5 files
```

**Benefits:**
- ✅ Each file is manageable (<500 lines)
- ✅ Easy to find what you need
- ✅ Adding 4 more frameworks = 4 new files (~200 lines each)
- ✅ No exponential growth in any single file

## 🔄 Migration Path

### Phase 1: Create new structure (DONE)
- Created `convex/prompts/` directory
- Split prompts into modular files
- Created index with helper functions

### Phase 2: Update imports (NEXT)
- Update `coach.ts` to import from `./prompts` instead of `./prompts.ts`
- Test GROW and COMPASS still work
- Delete old `prompts.ts` once confirmed

### Phase 3: Add new frameworks (FUTURE)
- Create `clear.ts`, `power-interest.ts`, etc.
- Update `index.ts` switch statements
- No other changes needed!

## 🎓 Best Practices

### DO:
✅ Keep base.ts framework-agnostic
✅ Put framework-specific guidance in framework files
✅ Use helper functions from index.ts
✅ Document new frameworks in this README

### DON'T:
❌ Put framework-specific code in base.ts
❌ Duplicate core principles across framework files
❌ Import directly from framework files (use index.ts)
❌ Let any single file exceed 500 lines

## 📝 Future Frameworks

Planned additions:
- `clear.ts` - CLEAR framework
- `power-interest.ts` - Power/Interest Grid
- `psychological-safety.ts` - Psychological Safety framework
- `[your-framework].ts` - Easy to add!

Each will be ~200-300 lines and follow the same pattern.
