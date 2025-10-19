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
  ADKAR: adkarFramework,
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

## Data Flow Example: ADKAR Session

```
User: "We're implementing a new system and people are resisting"
    ↓
[Router] selectFramework("implementing") → "ADKAR"
    ↓
[Registry] getFramework("ADKAR") → Returns ADKAR definition
    ↓
[StepExecutor] executeStep(ADKAR, step=0, userInput)
    - Generates system prompt from ADKAR step 0
    - Calls Claude with prompt
    - Gets JSON response
    ↓
[Validator] validateResponse(response, step.schema)
    - Checks: awareness_rating is 1-5
    - Checks: their_understanding is 20-300 chars
    - Checks: coach_reflection is 20-300 chars
    ↓
If valid:
    - Store response in session
    - Move to step 1 (ADKAR Desire step)
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

**vs. GROW only:** 600 lines per framework × 6 = 3,600 lines needed if built separately (23% smaller with modular approach)

---

## Framework Definition Pattern

Each framework is defined as a data object (no code logic):

```typescript
const adkarFramework: FrameworkDefinition = {
  id: "ADKAR",
  name: "ADKAR",
  description: "Change management model",
  duration_minutes: 20,
  challenge_types: ["change_leadership"],
  steps: [
    {
      name: "awareness",
      order: 1,
      duration_minutes: 4,
      objective: "Assess if they understand WHY the change is happening",
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
- Full ADKAR session (new)
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

### Week 4: Add ADKAR
1. Define ADKAR framework
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

**This architecture allows 6 frameworks in 8 weeks vs. 6 months separately.** 🚀
