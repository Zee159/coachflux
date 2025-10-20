# 🏗️ FRAMEWORK MODULISATION STRATEGY: Architecture Design

## Core Principle: Frameworks are DATA, Not CODE

Instead of 6 separate coaching implementations, build ONE framework engine and feed it different framework definitions (JSON/TypeScript objects).

---

## Architecture Layers

```
Layer 1: Framework Registry
├─ Stores all 6 framework definitions
├─ Each framework = JSON object (name, steps, prompts, schemas)
└─ Registry = map of framework_id → definition

Layer 2: Framework Router
├─ Takes user input
├─ Selects appropriate framework (via selector logic)
├─ Loads framework definition from registry
└─ Passes to step executor

Layer 3: Step Executor (Generic)
├─ Takes any framework + current step index
├─ Generates LLM prompt from step definition
├─ Calls Claude API
├─ Validates response against schema
└─ Stores response + moves to next step

Layer 4: Schema Validator
├─ Validates JSON response against step's schema
├─ Checks required fields, data types, lengths
├─ Provides detailed error messages
└─ Blocks invalid responses (asks for retry)

Layer 5: Completion Evaluator
├─ Checks if all required fields for session are complete
├─ Determines if coachee can advance/is done
├─ Updates session state
└─ Triggers action creation if applicable
```

---

## Key Files to Create

### 1. `/src/lib/frameworks/registry.ts`
```typescript
// Single source of truth for all framework definitions
export const frameworkRegistry: Record<string, FrameworkDefinition> = {
  GROW: growFramework,
  CLEAR: clearFramework,
  COMPASS: compassFramework,
  POWER_INTEREST_GRID: powerInterestGridFramework,
  PSYCHOLOGICAL_SAFETY: psychologicalSafetyFramework,
  EXECUTIVE_PRESENCE: executivePresenceFramework
};

export function getFramework(frameworkId: string): FrameworkDefinition {
  return frameworkRegistry[frameworkId];
}
```

### 2. `/src/lib/frameworks/types.ts`
```typescript
interface FrameworkDefinition {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  challenge_types: ChallengeType[];
  steps: FrameworkStep[];
}

interface FrameworkStep {
  name: string;
  order: number;
  duration_minutes: number;
  objective: string;
  required_fields_schema: JSONSchema7;
  system_prompt: string;
  coaching_questions: string[];
  guardrails: string[];
  example_session?: ExampleSession;
  transition_rules: TransitionRule[];
}
```

### 3. `/src/lib/frameworks/selector.ts`
```typescript
// Uses decision tree from FRAMEWORK_SELECTION_GUIDE.md
// Analyzes user input, returns framework ID
export function selectFramework(userInput: string): string {
  // Decision tree logic here
}
```

### 4. `/src/lib/frameworks/router.ts`
```typescript
// Routes coaching request to correct framework
export async function routeCoachingRequest(
  userInput: string,
  conversationHistory: Message[]
): Promise<{ frameworkId: string; nextStep: number }> {
  const frameworkId = selectFramework(userInput);
  return { frameworkId, nextStep: 0 };
}
```

### 5. `/src/lib/frameworks/step-executor.ts`
```typescript
// Generic executor for any framework step
export async function executeFrameworkStep(
  frameworkId: string,
  stepIndex: number,
  userTurn: string,
  conversationHistory: string
): Promise<ExecutionResult> {
  const framework = getFramework(frameworkId);
  const step = framework.steps[stepIndex];
  
  // Generate prompt
  const prompt = generatePrompt(step);
  
  // Call LLM
  const response = await callClaude(prompt);
  
  // Validate
  const validation = validateResponse(response, step.required_fields_schema);
  
  return { response, valid: validation.valid, errors: validation.errors };
}
```

### 6. `/src/lib/frameworks/schema-validator.ts`
```typescript
// Validates responses against JSONSchema
export function validateResponse(
  response: unknown,
  schema: JSONSchema7
): ValidationResult {
  // Use jsonschema library or similar
  // Return detailed errors if invalid
}
```

---

## Data Flow Example: COMPASS Session

```
User: "We're implementing a new system and people are resisting"
    ↓
[Router] selectFramework("implementing") → "COMPASS"
    ↓
[Registry] getFramework("COMPASS") → Returns COMPASS definition
    ↓
[StepExecutor] executeStep(COMPASS, step=0, userInput)
    - Generates system prompt from COMPASS step 0
    - Calls Claude with prompt
    - Gets JSON response
    ↓
[Validator] validateResponse(response, step.schema)
    - Checks: clarity_rating is 1-5
    - Checks: their_understanding is 20-300 chars
    - Checks: coach_reflection is 20-300 chars
    ↓
If valid:
    - Store response in session
    - Move to step 1 (COMPASS Ownership step)
    ↓
If invalid:
    - Return error to user
    - Ask to retry
```

---

## Code Reuse Breakdown

**How 90% reuse is achieved:**

| Component | Reused Across | Code Duplication |
|-----------|------|---|
| Framework Registry | All 6 frameworks | 0% (1 file) |
| Router | All 6 frameworks | 0% (1 file) |
| Step Executor | All 6 frameworks | 0% (1 file) |
| Schema Validator | All 6 frameworks | 0% (1 file) |
| Completion Evaluator | All 6 frameworks | 0% (1 file) |
| Framework Definition | Framework-specific | 100% (6 files) |

**Total:** ~2,000 lines of generic code + 300-400 lines per framework definition = 4,000 total LOC for 6 frameworks

**vs. GROW only:** 600 lines per framework × 6 = 3,600 lines needed if built separately

**Reality:** Modular approach is 11% MORE code for first 6 frameworks, BUT each framework after that costs only 350 lines vs 600 lines (42% savings at scale)

---

## Framework Definition Pattern

Each framework is defined as a data object (no code logic):

```typescript
const compassFramework: FrameworkDefinition = {
  id: "COMPASS",
  name: "COMPASS",
  description: "Change management model",
  duration_minutes: 20,
  challenge_types: ["change_leadership"],
  steps: [
    {
      name: "clarity",
      order: 1,
      duration_minutes: 4,
      objective: "Assess if they understand WHAT is changing and WHY",
      required_fields_schema: {
        type: "object",
        properties: {
          awareness_rating: { type: "integer", minimum: 1, maximum: 5 },
          their_understanding: { type: "string", minLength: 30, maxLength: 300 }
        },
        required: ["awareness_rating", "their_understanding"]
      },
      system_prompt: `You are coaching on change awareness...`,
      coaching_questions: [
        "From your perspective, why is the company making this change?",
        "What problem is it trying to solve?"
      ],
      guardrails: ["Don't ask about training yet (that's Knowledge step)"],
      transition_rules: [
        {
          condition: "awareness_rating provided",
          nextStep: "desire",
          action: "Move to Desire assessment"
        }
      ]
    }
    // ... more steps
  ]
};
```

**Key principle:** Framework definition contains NO logic, only data and prompts. All logic is in the generic engine.

---

## Testing Strategy

### Unit Tests (Per-Component)
- Test selector logic (correct framework for input)
- Test validator (correct schema validation)
- Test router (correct framework loaded)

### Integration Tests (End-to-End)
- Full GROW session (existing)
- Full CLEAR session (new)
- Full COMPASS session (new)
- Framework switching (mid-session change)

### Regression Tests
- All existing GROW sessions still work perfectly
- No performance degradation
- All data captured correctly

---

## Adding a New Framework (Week-by-Week Roadmap)

### Week 3: Add CLEAR
1. Define CLEAR framework (copy template)
2. Add to registry
3. Test with selector
4. Run E2E tests
5. → Done in 1-2 days

### Week 4: Add COMPASS
1. Define COMPASS framework
2. Add to registry
3. Test barrier diagnosis logic
4. Run E2E tests
5. → Done in 1-2 days

### Weeks 5-8: Add remaining 3
Each takes 1-2 days using same pattern

**Total time to add 5 new frameworks: 2 weeks (vs. 8+ weeks if built separately)**

---

## Benefits of This Architecture

1. **DRY Principle** — 90% code reuse
2. **Scalability** — Add new framework in 1-2 days
3. **Consistency** — All frameworks use same engine/quality
4. **Maintainability** — Bug fix in engine fixes all frameworks
5. **Flexibility** — Frameworks can be added/changed/removed easily
6. **Testing** — One code path to test thoroughly
7. **Performance** — Optimise engine once, all frameworks benefit

---

## Performance Considerations

**Caching framework definitions:** Load once, cache in memory
**Prompt generation:** Pre-compute templates, inject variables
**Schema validation:** Use fastest validator (AJV)
**LLM calls:** Timeout 30s, retry up to 2x

---

---

## Cost-Benefit Analysis

### Upfront Investment
**Week 1-2: Building the Engine**
- Time: 2 weeks (10 days)
- What you build: Registry, Router, Selector, Step Executor, Validator
- Output: 0 new frameworks (just GROW refactored)
- Risk: High (if architecture is wrong, you waste 2 weeks)

### Break-Even Point
**After Framework #3 (Week 5)**
- Modular approach: 2 weeks (engine) + 1 week (CLEAR) + 1 week (COMPASS) + 3 days (Grid) = **4.6 weeks**
- Separate approach: 1 week × 3 frameworks = **3 weeks**
- Status: **Still behind by 1.6 weeks** ⚠️

**After Framework #6 (Week 8)**
- Modular approach: 2 weeks (engine) + 6 frameworks × 1.5 days avg = **3.8 weeks total**
- Separate approach: 1 week × 6 frameworks = **6 weeks**
- Status: **Ahead by 2.2 weeks** ✅

### Long-Term Payoff
**Adding framework #7-10:**
- Modular: 1-2 days each = **1 week for 4 frameworks**
- Separate: 1 week each = **4 weeks for 4 frameworks**
- Savings: **75% time reduction**

### When to Use This Architecture
✅ **Use modular if**: You plan to build 4+ frameworks
✅ **Use modular if**: You need consistent quality across frameworks
✅ **Use modular if**: You have 2 weeks to invest upfront

❌ **Don't use modular if**: You only need 1-2 frameworks
❌ **Don't use modular if**: You need results in < 2 weeks
❌ **Don't use modular if**: Requirements are unclear

---

## Rollback Strategy

### If Modular Architecture Fails

**Scenario 1: Week 2 - Architecture doesn't work**
- **Symptom**: Can't get GROW refactored by end of Week 2
- **Decision point**: Friday Week 2
- **Rollback action**: 
  1. Revert frontend to last working commit (GitHub)
  2. Keep Convex as-is (GROW already works)
  3. Build CLEAR as standalone (1 week)
  4. Reassess modular approach after CLEAR works
- **Time lost**: 2 weeks
- **Recovery**: Build 2-3 frameworks separately, revisit modular later

**Scenario 2: Week 4 - Framework selection failing**
- **Symptom**: Selector picks wrong framework >30% of time
- **Decision point**: End of Week 4
- **Rollback action**:
  1. Make framework selection MANUAL (dropdown menu)
  2. Keep engine intact
  3. Improve selector algorithm in parallel
  4. Switch to auto-selection when accuracy >90%
- **Time lost**: 0 (manual selection is acceptable)
- **Risk**: Lower but acceptable

**Scenario 3: Week 6 - Performance issues**
- **Symptom**: Sessions take >5 seconds to respond
- **Decision point**: Load testing in Week 6
- **Rollback action**:
  1. Identify bottleneck (likely schema validator or prompt generation)
  2. Optimize hot path
  3. If unfixable: Cache aggressively or pre-compute prompts
- **Time lost**: 2-3 days
- **Acceptable**: Yes, optimization is normal

### Convex-Specific Rollback
**Problem**: No CI/CD, so bad deploy = manual fix

**Prevention**:
1. **Schema versioning**: Keep old schemas alongside new ones during migration
2. **Feature flags**: Use Convex environment variables to toggle modular mode
3. **Shadow mode**: Run old GROW and new engine in parallel, compare outputs
4. **Data backup**: Export all sessions before major Convex changes

**Emergency Rollback** (if production breaks):
```bash
# 1. Revert Convex functions
npx convex deploy --prod --schema-only  # Keep data, revert functions

# 2. Revert frontend
git revert <commit-hash>
git push

# 3. Verify
# Run test session manually
```

**Max downtime target**: 30 minutes

### Go/No-Go Checkpoints

**Week 2 Friday (Architecture):**
- ✅ GROW works via new engine → Continue
- ❌ GROW broken or slower → Rollback to separate frameworks

**Week 4 Friday (Multi-framework):**
- ✅ 2+ frameworks working, selector >70% accurate → Continue
- ⚠️ Selector <70% → Make it manual, keep building
- ❌ Only 1 framework working → Consider rollback

**Week 6 Friday (Scale test):**
- ✅ All frameworks work, performance acceptable → Continue to pilot
- ⚠️ Performance issues → Fix before pilot
- ❌ Major bugs, can't fix in 1 week → Delay pilot 2 weeks

---

**This architecture breaks even after framework #6 and saves 75% time for frameworks #7+.** 🚀
