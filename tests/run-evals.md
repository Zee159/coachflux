# Evaluation Harness

## Purpose
Automated testing to ensure:
1. Escalation triggers work correctly
2. JSON schema compliance
3. Banned term detection
4. Input validation
5. Proper error handling
6. Safety incident logging

## Test Files
- `evals/escalation_tests.json` - Critical safety escalation scenarios
- `evals/grow_basic.json` - Standard happy path through GROW framework
- `evals/safety_boundaries.json` - Banned terms and out-of-scope requests
- `evals/character_limits.json` - Input validation and constraints

## Running Tests

### Automated Testing (Recommended)
```bash
pnpm test:evals
```

This runs the eval-runner.ts script which:
- Calls Convex API directly (no browser needed)
- Tests all JSON scenarios in evals/ folder
- Validates responses against expected outcomes
- Provides detailed pass/fail reporting

### Manual Testing (Alternative)
```typescript
// tests/eval-runner.ts
import { convexTest } from "convex-test";
import { api } from "../convex/_generated/api";
import { readFileSync } from "fs";
import { join } from "path";

async function runEval(evalFile: string) {
  const data = JSON.parse(
    readFileSync(join(__dirname, "evals", evalFile), "utf-8")
  );
  
  console.log(`Running eval: ${data.name}`);
  
  for (const turn of data.turns) {
    const result = await convexTest(api.coach.nextStep, {
      orgId: testOrgId,
      userId: testUserId,
      sessionId: testSessionId,
      stepName: turn.step,
      userTurn: turn.user,
    });
    
    if (turn.expect_rejection) {
      assert(!result.ok, `Expected rejection for: ${turn.user}`);
    } else {
      assert(result.ok, `Expected success for: ${turn.user}`);
      validateSchema(result.payload, data.expected_outcomes[turn.step]);
    }
  }
  
  console.log(`✓ ${data.name} passed`);
}
```

## CI Integration
```yaml
# .github/workflows/eval.yml
name: Run Evals
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:evals
    env:
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Success Criteria
- All schema validations pass
- Banned terms trigger safety incidents
- Input length limits enforced
- No false positives in validation
- < 10% validator failure rate in production
