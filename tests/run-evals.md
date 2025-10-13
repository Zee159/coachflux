# Evaluation Harness

## Purpose
Automated testing to ensure:
1. JSON schema compliance
2. Banned term detection
3. Input validation
4. Proper error handling
5. Safety incident logging

## Test Files
- `evals/grow_basic.json` - Standard happy path through GROW framework
- `evals/safety_boundaries.json` - Banned terms and out-of-scope requests
- `evals/character_limits.json` - Input validation and constraints

## Running Tests

### Manual Testing
1. Start Convex dev server: `pnpm convex:dev`
2. Set `OPENAI_API_KEY` in Convex dashboard
3. Run frontend: `pnpm dev`
4. Navigate through each test scenario manually

### Automated Testing (Future)
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
