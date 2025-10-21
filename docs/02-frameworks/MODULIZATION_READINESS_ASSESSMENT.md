# 🔍 MODULIZATION READINESS ASSESSMENT

**Date**: Current State Analysis  
**Goal**: Assess if codebase is ready for modular framework architecture

---

## Current State: What You Have ✅

### 1. **Framework Definition Structure** ✅
**Location**: `src/frameworks/grow.json`
- Already has JSON-based framework definition
- Contains: `id`, `steps`, `required_fields_schema`
- Clean separation of data from code

### 2. **Basic Types** ✅
**Location**: `convex/types.ts`
```typescript
interface Framework {
  id: string;
  steps: FrameworkStep[];
}

interface FrameworkStep {
  name: string;
  system_objective: string;
  required_fields_schema: Record<string, unknown>;
}
```

### 3. **Schema Support for Multiple Frameworks** ✅
**Location**: `convex/schema.ts` (line 27)
```typescript
framework: v.string(), // "GROW" - ready for "CLEAR", "COMPASS", etc.
```

### 4. **Step Execution Logic** ✅
**Location**: `convex/coach.ts`
- Has `getFramework()` function (currently hardcoded)
- Step execution with validation
- Schema validation
- Error handling
- Safety checks (escalation)

### 5. **State Management** ✅
- Session tracking in Convex
- Reflection/payload storage
- Skip count tracking
- Session lifecycle (open/closed)

---

## Critical Gaps: What's Missing ❌

### 1. **No Framework Registry** ❌
**Status**: `getFramework()` is hardcoded (line 120 in coach.ts)

```typescript
// ❌ CURRENT (Hardcoded)
const getFramework = (): Framework => {
  return { id: "GROW", steps: [...] }; // All GROW steps hardcoded
};
```

**Needed**: 
```typescript
// ✅ TARGET
export function getFramework(frameworkId: FrameworkId): FrameworkDefinition {
  return frameworkRegistry[frameworkId];
}
```

### 2. **No Framework Selector** ❌
**Missing**: `/src/lib/frameworks/selector.ts`

**What's needed**:
- Logic to analyze user input
- Return appropriate framework ID
- Confidence scoring
- Currently defaults to "GROW" for everything

### 3. **No Framework Router** ❌
**Missing**: `/src/lib/frameworks/router.ts`

**What's needed**:
- Route requests to correct framework
- Load framework definition
- Pass to step executor

### 4. **No lib Directory Structure** ❌
**Current**: `src/` has no `lib/frameworks/` folder
**Needed**:
```
src/
  lib/
    frameworks/
      registry.ts     ❌ Missing
      types.ts        ❌ Missing  
      selector.ts     ❌ Missing
      router.ts       ❌ Missing
      grow.ts         ❌ Missing (framework definition)
      clear.ts        ❌ Missing
      compass.ts      ❌ Missing
```

### 5. **Incomplete Type Definitions** ❌
**Current types are missing**:
- `FrameworkId` union type
- `ChallengeType` enum
- `TransitionRule` interface
- `CompletionRule` interface
- `ExecutionResult` interface
- `ValidationError` interface
- `FrameworkSelectionResult` interface

**Reference**: See `FRAMEWORK_IMPLEMENTATION_GUIDE.md` Section 1

### 6. **No Migration Strategy** ❌
**Missing**:
- Feature flags
- Shadow mode support
- Gradual rollout logic
- Rollback mechanism

### 7. **Hard-coded Framework Steps** ❌
**Location**: `convex/coach.ts` lines 120-232
- All GROW steps hardcoded in `getFramework()`
- Should be loaded from JSON or external file
- Prevents dynamic framework loading

### 8. **No Framework Metadata in Convex** ❌
**Schema missing**:
```typescript
// Needed in schema.ts
frameworks: defineTable({
  id: v.string(),              // "GROW", "CLEAR", etc.
  name: v.string(),
  description: v.string(),
  definition: v.any(),         // JSON framework definition
  enabled: v.boolean(),
  version: v.number(),
}).index("by_id", ["id"]),
```

---

## Template Gaps: What Templates Are Missing

### 1. **Framework Definition Template** ❌
**Needed**: `/src/lib/frameworks/template.ts`
```typescript
export const frameworkTemplate: FrameworkDefinition = {
  id: 'FRAMEWORK_NAME',
  name: 'Framework Display Name',
  description: 'When to use this framework',
  duration_minutes: 20,
  challenge_types: ['goal_achievement'],
  steps: [
    {
      name: 'step_name',
      order: 1,
      duration_minutes: 4,
      objective: 'What this step achieves',
      required_fields_schema: { /* JSON Schema */ },
      system_prompt: 'AI instructions',
      coaching_questions: ['Question 1', 'Question 2'],
      guardrails: ['Don\'t do X'],
      transition_rules: [
        { condition: 'field_exists', nextStep: 'next_step_name', action: 'Advance' }
      ],
    }
  ],
  completion_rules: [
    {
      required_fields: ['goal', 'actions'],
      validation: (data) => !!data.goal && !!data.actions,
      error_message: 'Missing required fields'
    }
  ],
};
```

### 2. **Step Executor Template** ❌
**Needed**: `/src/lib/frameworks/step-executor.ts`
- Generic function to execute any framework step
- Currently hardcoded in `coach.ts` action

### 3. **Schema Validator Template** ❌
**Needed**: `/src/lib/frameworks/schema-validator.ts`
- JSON Schema validation (using AJV)
- Currently inline in `coach.ts`

### 4. **Error Handler Template** ❌
**Needed**: `/src/lib/frameworks/error-handler.ts`
- Custom error classes
- User-friendly error messages
- Retry logic

---

## Code Organization Issues

### 1. **Framework Logic Split Across Files** ⚠️
**Current**:
- Framework definition: `coach.ts` (hardcoded)
- Framework JSON: `src/frameworks/grow.json` (not used!)
- Types: `convex/types.ts`

**Problem**: JSON definition exists but isn't loaded

### 2. **Tight Coupling** ⚠️
**Current**: `coach.ts` action has:
- Framework definition ✓
- Step execution ✓
- Validation ✓
- Error handling ✓
- Safety checks ✓
- State management ✓

**Problem**: All in one 893-line file, hard to extend

### 3. **No Separation of Concerns** ⚠️
Need to separate:
- Framework definitions (data)
- Execution engine (logic)
- Validation (rules)
- State management (persistence)

---

## Readiness Summary

### ✅ Ready (30%)
- JSON framework structure exists
- Basic types defined
- Step execution works
- Schema supports multiple frameworks
- Safety/validation working

### ❌ Not Ready (70%)
- No framework registry
- No framework selector
- No router
- Missing lib directory
- Incomplete types
- Hardcoded framework definition
- No templates
- No migration plan

---

## Action Plan: What to Build

### **Phase 1: Foundation (Week 1)**

#### Day 1-2: Create lib Directory Structure
```bash
mkdir -p src/lib/frameworks
touch src/lib/frameworks/registry.ts
touch src/lib/frameworks/types.ts
touch src/lib/frameworks/selector.ts
touch src/lib/frameworks/router.ts
touch src/lib/frameworks/grow.ts
touch src/lib/frameworks/error-handler.ts
```

#### Day 3: Complete Type Definitions
1. Copy from `FRAMEWORK_IMPLEMENTATION_GUIDE.md` Section 1
2. Create `/src/lib/frameworks/types.ts`
3. Add all missing interfaces:
   - `FrameworkId`
   - `ChallengeType`
   - `TransitionRule`
   - `CompletionRule`
   - `ExecutionResult`
   - `ValidationError`
   - `FrameworkSelectionResult`

#### Day 4: Build Framework Registry
1. Create `/src/lib/frameworks/registry.ts`
2. Move GROW definition from `coach.ts` to `/src/lib/frameworks/grow.ts`
3. Load `src/frameworks/grow.json` instead of hardcoding
4. Implement `getFramework()` with type safety

#### Day 5: Refactor coach.ts
1. Replace hardcoded `getFramework()` with import
2. Test that GROW still works
3. No behavior changes, just structure

**Success Criteria**:
- ✅ GROW works exactly as before
- ✅ No regressions
- ✅ Framework loaded from registry, not hardcoded
- ✅ All types are type-safe

### **Phase 2: Multi-Framework (Week 2)**

#### Day 1-2: Add CLEAR Framework
1. Create `/src/lib/frameworks/clear.ts`
2. Add to registry
3. Test selector

#### Day 3-5: Add COMPASS Framework
1. Create `/src/lib/frameworks/compass.ts`
2. Add barrier diagnosis logic
3. Test full session

### **Phase 3: Production (Week 3+)**
Follow migration plan in `FRAMEWORK_IMPLEMENTATION_GUIDE.md` Section 6

---

## Templates Needed (Copy-Paste Ready)

### Template 1: Framework Definition

**File**: `/src/lib/frameworks/grow.ts`
```typescript
import { FrameworkDefinition } from './types';
import growJson from '../../frameworks/grow.json';

export const growFramework: FrameworkDefinition = {
  id: 'GROW',
  name: 'GROW Model',
  description: 'Goal-Reality-Options-Will for any goal or challenge',
  duration_minutes: 20,
  challenge_types: ['goal_achievement'],
  steps: growJson.steps.map((step, index) => ({
    name: step.name,
    order: index + 1,
    duration_minutes: 4,
    objective: step.system_objective,
    required_fields_schema: step.required_fields_schema,
    system_prompt: `You are a GROW coach. ${step.system_objective}`,
    coaching_questions: [], // Add from prompts.ts
    guardrails: [], // Add safety rules
    transition_rules: [
      { condition: 'step_complete', nextStep: growJson.steps[index + 1]?.name || 'COMPLETE', action: 'Advance' }
    ],
  })),
  completion_rules: [
    {
      required_fields: ['goal', 'actions'],
      validation: (data) => {
        return !!(data.goal && data.actions);
      },
      error_message: 'Goal and actions are required'
    }
  ],
};
```

### Template 2: Framework Registry

**File**: `/src/lib/frameworks/registry.ts`
```typescript
import { FrameworkDefinition, FrameworkId } from './types';
import { growFramework } from './grow';

const frameworkRegistry: Record<FrameworkId, FrameworkDefinition> = {
  GROW: growFramework,
  // CLEAR: clearFramework,    // Add Week 2
  // COMPASS: compassFramework, // Add Week 3
};

export function getFramework(frameworkId: FrameworkId): FrameworkDefinition {
  const framework = frameworkRegistry[frameworkId];
  if (!framework) {
    throw new Error(`Framework not found: ${frameworkId}`);
  }
  return framework;
}

export function isValidFrameworkId(id: string): id is FrameworkId {
  return id in frameworkRegistry;
}

export function getAllFrameworks(): FrameworkDefinition[] {
  return Object.values(frameworkRegistry);
}
```

### Template 3: Update coach.ts

**File**: `convex/coach.ts`
```typescript
// ❌ DELETE THIS (lines 120-232):
// const getFramework = (): Framework => { ... }

// ✅ ADD THIS:
import { getFramework } from '../src/lib/frameworks/registry';
import type { FrameworkId } from '../src/lib/frameworks/types';

// Then in nextStep action:
const framework = getFramework('GROW' as FrameworkId); // Later: dynamic selection
```

---

## Risk Assessment

### High Risk ⚠️
1. **Breaking GROW**: Refactoring could break existing functionality
   - **Mitigation**: Keep old code, run in shadow mode
   
2. **Convex Import Issues**: Can't import from `src/` in `convex/`
   - **Mitigation**: Create `convex/frameworks/` mirror or use Convex functions

### Medium Risk ⚠️
3. **Type Mismatches**: New strict types may conflict with existing code
   - **Mitigation**: Gradual type migration

4. **Performance**: Loading frameworks dynamically could be slower
   - **Mitigation**: Cache framework definitions

### Low Risk ✅
5. **Schema Changes**: Minimal, just using existing `framework` field
6. **UI Changes**: None needed for Phase 1

---

## Immediate Next Steps (This Week)

### **Before You Code**:
1. ✅ Read `FRAMEWORK_MODULISATION_STRATEGY.md`
2. ✅ Read `FRAMEWORK_IMPLEMENTATION_GUIDE.md`
3. ✅ Review this assessment

### **Day 1 (Monday)**:
```bash
# 1. Create directory structure
mkdir src/lib
mkdir src/lib/frameworks

# 2. Copy type definitions
# Create src/lib/frameworks/types.ts from FRAMEWORK_IMPLEMENTATION_GUIDE.md

# 3. Backup current code
git commit -am "Backup before modularization"
git tag "pre-modular-v1.0"
```

### **Day 2 (Tuesday)**:
- Create `registry.ts`
- Create `grow.ts` (load from grow.json)
- Test that it compiles

### **Day 3 (Wednesday)**:
- Replace hardcoded `getFramework()` in `coach.ts`
- Run test session
- Verify GROW still works

### **Day 4-5 (Thu-Fri)**:
- Fix any regressions
- Add logging
- Prepare for Week 2 (CLEAR framework)

---

## Go/No-Go Checklist

**Before starting modulization, you need**:
- [x] Clear understanding of architecture
- [x] Implementation guide ready
- [x] Templates ready
- [ ] Backup of current code ⚠️ **DO THIS FIRST**
- [ ] Testing plan
- [ ] Rollback plan
- [ ] 2 weeks dedicated time

**If any checkbox is unchecked, don't start yet.**

---

## Summary

**Current State**: 30% ready
- Has framework JSON structure ✅
- Has basic types ✅
- Works for GROW ✅

**Missing**: 70% of modular architecture
- No registry ❌
- No selector ❌
- No lib structure ❌
- Hardcoded logic ❌

**Time to Ready**: 1 week of focused work
**Recommendation**: Follow Phase 1 action plan above before adding new frameworks

**Critical First Step**: Create `src/lib/frameworks/` directory and copy types from implementation guide.
