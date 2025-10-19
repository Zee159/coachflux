# 📋 THIS WEEK'S FOCUS: Your 5 Concrete Tasks (Mon-Fri)

**Week 1 of 8 | Refactoring GROW + Building Foundation**

---

## 🎯 Your 5 Tasks This Week

### MONDAY: Architecture & Planning

**Task:** Set up framework registry architecture

**What to do:**
1. Create `/src/lib/frameworks/registry.ts`
2. Define base `FrameworkDefinition` type (see template below)
3. Define `FrameworkStep` type structure
4. Define `CompletionCriteria` type
5. Export types for all frameworks

**Why:** Everything else depends on this. Get it right.

**Definition Template:**
```typescript
interface FrameworkDefinition {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  challenge_types: string[];
  steps: FrameworkStep[];
  completion_rules: CompletionRule[];
}

interface FrameworkStep {
  name: string;
  order: number;
  duration_minutes: number;
  objective: string;
  required_fields_schema: JSONSchema;
  system_prompt: string;
  coaching_questions: string[];
  guardrails: string[];
  example_session?: string;
  transition_rules: TransitionRule[];
}
```

**Success Criteria:**
- ✅ TypeScript compiles with no errors
- ✅ GROW framework loads via registry
- ✅ All framework definitions type-safe

**Files to Create:**
- `/src/lib/frameworks/registry.ts`
- `/src/lib/frameworks/types.ts`
- `/src/lib/frameworks/grow.ts` (copy GROW into new structure)

---

### TUESDAY: GROW Refactoring (Part 1)

**Task:** Refactor GROW into the new framework structure

**What to do:**
1. Move existing GROW logic into `/src/lib/frameworks/grow.ts`
2. Adapt GROW to new `FrameworkDefinition` interface
3. Convert GROW steps to new `FrameworkStep` structure
4. Convert all GROW prompts to system prompts
5. Move all coaching questions into the questions array

**Why:** Proves the architecture works before building 5 new frameworks.

**File to Refactor:**
- `/src/lib/frameworks/grow.ts`

**Success Criteria:**
- ✅ GROW still works exactly as before
- ✅ All existing GROW sessions complete successfully
- ✅ No behaviour changes, just structure

---

### WEDNESDAY: Framework Router & Selector

**Task:** Build framework selection and routing logic

**What to do:**
1. Create `/src/lib/frameworks/selector.ts`
2. Implement `selectFramework()` function
   - Takes user input/situation
   - Returns appropriate framework ID
   - Uses decision tree from FRAMEWORK_SELECTION_GUIDE.md
3. Create `/src/lib/frameworks/router.ts`
   - Routes incoming coaching request to correct framework
   - Loads framework definition from registry
   - Passes to step executor
4. Add tests for selector logic

**Why:** This is how users get the right framework without having to choose manually.

**Decision Tree (Pseudo-code):**
```
If "change" → ADKAR
Else if "stakeholder" → POWER_INTEREST_GRID
Else if "team" → PSYCHOLOGICAL_SAFETY
Else if "complex" → CLEAR
Else → GROW
```

**Files to Create:**
- `/src/lib/frameworks/selector.ts`
- `/src/lib/frameworks/router.ts`
- `/tests/frameworks/selector.test.ts`

**Success Criteria:**
- ✅ `selectFramework("implementing change")` → returns ADKAR ID
- ✅ `selectFramework("need to influence CFO")` → returns POWER_INTEREST_GRID ID
- ✅ Router correctly loads framework definition
- ✅ Tests pass

---

### THURSDAY: Step Executor & JSON Schema Validation

**Task:** Build generic step executor and validation

**What to do:**
1. Create `/src/lib/frameworks/step-executor.ts`
   - Generic handler for any framework step
   - Loads step definition
   - Generates prompt for LLM
   - Validates response against schema
   - Stores response
2. Create `/src/lib/frameworks/schema-validator.ts`
   - Validates JSON responses against schema
   - Provides detailed error messages
   - Handles optional vs. required fields
3. Add error handling and retry logic

**Why:** This allows one code path to handle all 6 frameworks.

**Files to Create:**
- `/src/lib/frameworks/step-executor.ts`
- `/src/lib/frameworks/schema-validator.ts`

**Success Criteria:**
- ✅ Any framework step can be executed
- ✅ Responses validated correctly
- ✅ Schema errors caught with helpful messages
- ✅ Works with GROW (proven)

---

### FRIDAY: Testing & Integration

**Task:** End-to-end test of refactored GROW

**What to do:**
1. Run complete GROW session end-to-end
   - Select GROW framework
   - Execute step 1
   - Validate response
   - Move to step 2
   - Complete all 4 steps
2. Test framework switching
   - Start GROW
   - Switch to hypothetical CLEAR mid-session
   - Verify state transfers correctly
3. Test completion logic
   - Mark session complete
   - Verify all required data captured
   - Check no data loss
4. Create integration tests

**Why:** Proves architecture works before building new frameworks.

**Files to Create:**
- `/tests/frameworks/e2e.test.ts`
- `/tests/frameworks/integration.test.ts`

**Success Criteria:**
- ✅ Complete GROW session works perfectly
- ✅ Framework switching works
- ✅ Session completion logic works
- ✅ All tests pass
- ✅ No performance regression vs. existing GROW

---

## 📊 End-of-Week Deliverables

By EOD Friday, you should have:

✅ Framework registry system (`registry.ts`, `types.ts`)  
✅ GROW refactored into new structure (`grow.ts`)  
✅ Framework selector working (`selector.ts`)  
✅ Framework router working (`router.ts`)  
✅ Step executor working (`step-executor.ts`)  
✅ Schema validator working (`schema-validator.ts`)  
✅ Complete integration tests passing  
✅ GROW sessions still working perfectly  
✅ Zero regressions  

**Deliverable:** All code committed, tests passing, GROW fully working in new architecture.

---

## 🛠️ Code Templates

### Template 1: Framework Definition Structure
```typescript
const growFramework: FrameworkDefinition = {
  id: "GROW",
  name: "GROW",
  description: "Goal-Reality-Options-Will framework",
  duration_minutes: 20,
  challenge_types: ["any"],
  steps: [
    {
      name: "goal",
      order: 1,
      duration_minutes: 5,
      objective: "Define the goal clearly",
      required_fields_schema: {
        type: "object",
        properties: {
          goal_statement: { type: "string", minLength: 10 }
        },
        required: ["goal_statement"]
      },
      system_prompt: `You are coaching someone on their goal...`,
      coaching_questions: [
        "What's your goal?",
        "What does success look like?"
      ],
      guardrails: ["Don't jump to solutions yet"],
      transition_rules: [
        {
          condition: "goal_statement complete",
          nextStep: "reality",
          action: "Move to reality assessment"
        }
      ]
    }
    // ... more steps
  ],
  completion_rules: []
};
```

### Template 2: Framework Selector
```typescript
function selectFramework(userInput: string): string {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes("change") || lowerInput.includes("implement")) {
    return "ADKAR";
  }
  if (lowerInput.includes("stakeholder") || lowerInput.includes("influence")) {
    return "POWER_INTEREST_GRID";
  }
  if (lowerInput.includes("team") || lowerInput.includes("collaboration")) {
    return "PSYCHOLOGICAL_SAFETY";
  }
  if (lowerInput.includes("complex") || lowerInput.includes("emotional")) {
    return "CLEAR";
  }
  
  return "GROW"; // default
}
```

### Template 3: Step Executor
```typescript
async function executeStep(
  framework: FrameworkDefinition,
  stepIndex: number,
  userTurn: string,
  conversationHistory: string
): Promise<{ response: object; valid: boolean; errors: string[] }> {
  const step = framework.steps[stepIndex];
  
  // Generate prompt
  const prompt = generatePrompt(step, userTurn, conversationHistory);
  
  // Call LLM
  const aiResponse = await callClaude(prompt);
  
  // Validate against schema
  const validation = validateAgainstSchema(aiResponse, step.required_fields_schema);
  
  return {
    response: aiResponse,
    valid: validation.valid,
    errors: validation.errors
  };
}
```

---

## 🚨 If You Get Stuck

**Stuck on architecture?**
- Read: `FRAMEWORKS_EXECUTIVE_SUMMARY.md` (Architecture Innovation section)
- Look at: FRAMEWORK_SELECTION_GUIDE.md for how decisions work

**Stuck on types?**
- Reference: Each framework file (schemas at bottom)
- Check: TypeScript types in `/src/types`

**Stuck on GROW refactoring?**
- Old GROW code: Your existing codebase
- New structure: See "Code Templates" above
- Test against: Existing GROW tests

**Stuck on validation?**
- Reference: JSON Schema docs (jsonschema.org)
- Pattern: Each framework file has a JSON schema
- Validator pattern: Type validation + custom validation

---

## 📞 Check-in Points

**Morning (9am):** Review task for the day, start coding  
**Midday (12pm):** Check if on track, adjust if needed  
**EOD (5pm):** Commit code, mark task complete  
**Friday EOD:** All 5 tasks complete + tests passing  

---

## 🎯 Success Criteria for Week 1

By Friday EOD:

- ✅ Framework registry system built
- ✅ GROW refactored into new structure
- ✅ Framework selector working
- ✅ Router working
- ✅ Step executor working
- ✅ Schema validator working
- ✅ E2E tests passing
- ✅ GROW fully functional (no regressions)
- ✅ All code committed
- ✅ Ready for Week 2 (add CLEAR)

**If all 10 criteria met:** Go to Week 2  
**If 8-9 met:** Good progress, finish Week 2 tasks  
**If <8 met:** Debug and extend Week 1  

---

## 📖 Documents to Reference

- `FRAMEWORK_SELECTION_GUIDE.md` — Decision tree logic
- `FRAMEWORKS_EXECUTIVE_SUMMARY.md` — Architecture explanation
- `2_FRAMEWORK_CLEAR.md` → `5_FRAMEWORK_PSYCHOLOGICAL_SAFETY.md` — Framework patterns

---

**Week 1 is foundational. Get it right. Everything else builds on this.** 🚀

Next week: Build CLEAR framework using patterns you establish this week.
