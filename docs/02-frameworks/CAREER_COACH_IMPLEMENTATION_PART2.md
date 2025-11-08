# Career Coach Implementation Guide - Part 2
## Implementation Checklist & File Structure

---

## 🏗️ Implementation Checklist

### **Phase 1: Core Framework (Priority 1)**

- [ ] **1.1** Create `convex/frameworks/career.ts`
  - Define 5 steps with schemas
  - Set duration_minutes for each step
  - Add guardrails and coaching questions
  
- [ ] **1.2** Create `convex/prompts/career.ts`
  - Add CAREER_COACHING_QUESTIONS
  - Add CAREER_STEP_GUIDANCE (detailed like COMPASS)
  - Include opportunistic extraction examples
  - Add hallucination prevention rules
  
- [ ] **1.3** Create `convex/coach/career.ts`
  - Implement CareerCoach class
  - Define getRequiredFields()
  - Define checkStepCompletion() for all 5 steps
  - Define getStepTransitions()

- [ ] **1.4** Update `convex/frameworks/types.ts`
  - Add `'CAREER'` to FrameworkId type
  - Add `'career_development'` to ChallengeType type

- [ ] **1.5** Update `convex/frameworks/registry.ts`
  - Import careerFramework
  - Add to frameworkRegistry

### **Phase 2: Reports & Scoring (Priority 2)**

- [ ] **2.1** Create `convex/reports/career.ts`
  - Implement generateCareerReport()
  - Add CaSS calculation logic
  - Format all report sections

- [ ] **2.2** Update `convex/coach/index.ts`
  - Import CareerCoach
  - Add to getCoach() switch statement

### **Phase 3: Testing (Priority 3)**

- [ ] **3.1** Create test cases in `tests/evals/career_basic.json`
  - Test all 5 steps
  - Test opportunistic extraction
  - Test hallucination prevention
  
- [ ] **3.2** Manual testing
  - Complete full session
  - Verify report generation
  - Check CaSS calculation

### **Phase 4: Documentation (Priority 4)**

- [ ] **4.1** Update main README
  - Add Career Coach to framework list
  
- [ ] **4.2** Create user guide
  - When to use Career Coach vs GROW
  - Example session walkthrough

---

## 📁 File Structure Summary

```
convex/
├── frameworks/
│   ├── career.ts          ← NEW: Framework definition
│   ├── types.ts           ← UPDATE: Add 'CAREER' to FrameworkId
│   └── registry.ts        ← UPDATE: Register careerFramework
│
├── prompts/
│   └── career.ts          ← NEW: Career-specific prompts
│
├── coach/
│   ├── career.ts          ← NEW: CareerCoach class
│   └── index.ts           ← UPDATE: Import CareerCoach
│
└── reports/
    └── career.ts          ← NEW: Report generation

tests/
└── evals/
    └── career_basic.json  ← NEW: Test cases

docs/
└── 02-frameworks/
    ├── CAREER_COACH_IMPLEMENTATION_GUIDE.md
    └── CAREER_COACH_IMPLEMENTATION_PART2.md  ← THIS FILE
```

---

## 🎨 Naming Conventions

**Framework ID:** `'CAREER'` (uppercase, matches GROW/COMPASS pattern)

**Display Name:** `"Career Coach"` (user-facing)

**File Names:** `career.ts` (lowercase, matches grow.ts/compass.ts)

**Class Name:** `CareerCoach` (PascalCase)

**Step Names:** `INTRODUCTION`, `ASSESSMENT`, `GAP_ANALYSIS`, `ROADMAP`, `REVIEW` (SCREAMING_SNAKE_CASE)

**Metric Name:** `CaSS` (Career Success Score)

**Challenge Type:** `'career_development'`

---

## 🔄 Integration Points

### **1. Framework Selection**

When user starts a session, CoachFlux will:
1. Ask about their challenge
2. If career-related → suggest CAREER framework
3. If general goal → suggest GROW framework
4. If organizational change → suggest COMPASS framework

### **2. Navigation**

Add Career Coach to navigation menu:
```typescript
// src/components/shared/Navigation.tsx
const frameworks = [
  { id: 'GROW', name: 'GROW Coach', path: '/coaches/grow' },
  { id: 'COMPASS', name: 'COMPASS Coach', path: '/coaches/compass' },
  { id: 'CAREER', name: 'Career Coach', path: '/coaches/career' }, // NEW
];
```

### **3. Coach Registry**

```typescript
// convex/coach/index.ts
import { CareerCoach } from './career';

function getCoach(frameworkId: string): FrameworkCoach {
  switch (frameworkId) {
    case 'GROW': return new GROWCoach();
    case 'COMPASS': return new COMPASSCoach();
    case 'CAREER': return new CareerCoach(); // NEW
    default: throw new Error(`Unknown framework: ${frameworkId}`);
  }
}
```

---

## 📝 Key Design Decisions Summary

### **1. Linear Flow (No Branching)**
Unlike COMPASS which has high-confidence branching, CAREER is strictly linear:
- Simpler to implement
- Easier to test
- More predictable user experience
- All users get complete gap analysis and roadmap

### **2. Deterministic Completion**
Step advancement based solely on field presence:
- No AI judgment calls
- Progressive relaxation (0 skips → 1 skip → 2+ skips)
- Clear completion criteria per step

### **3. Hallucination Prevention**
Multiple layers of protection:
- Opportunistic extraction (from base prompts)
- Step-specific guardrails (DO NOT / ONLY EXTRACT)
- Field validation (minLength, maxLength, enum)
- Explicit "WRONG vs CORRECT" examples in prompts

### **4. Career Success Score (CaSS)**
Composite metric with 4 dimensions:
- Confidence Growth (30%) - measures learning
- Path Clarity (25%) - measures understanding
- Action Commitment (25%) - measures readiness
- Gap Manageability (20%) - measures feasibility

### **5. Report Structure**
Actionable format with:
- CaSS score at top (like COMPASS CSS)
- Gap analysis breakdown
- Roadmap tables (learning, networking, experience)
- Milestones (3-month, 6-month)
- Immediate next step (48-hour commitment)

---

## 🚀 Ready to Implement

I've created a comprehensive implementation guide covering:

✅ **Linear & deterministic flow** - No branching, clear progression  
✅ **Hallucination prevention** - Multiple guardrail layers  
✅ **Report structure** - CaSS score + actionable roadmap  
✅ **Naming conventions** - "Career Coach" / CAREER framework  
✅ **5 detailed steps** - With questions, schemas, completion criteria  
✅ **Implementation checklist** - Phased approach  

**Next:** Would you like me to create the actual implementation files?

1. `convex/frameworks/career.ts` - Complete framework definition
2. `convex/prompts/career.ts` - Comprehensive prompts (500+ lines)
3. `convex/coach/career.ts` - CareerCoach class
4. `convex/reports/career.ts` - Report generation
5. Registry updates

Let me know and I'll start building the files!
