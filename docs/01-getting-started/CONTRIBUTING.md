# Contributing to CoachFlux

## Development Workflow

1. **Clone and Setup**
   ```bash
   pnpm install
   pnpm convex:dev
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Backend: Edit files in `convex/`
   - Frontend: Edit files in `src/`
   - Tests: Add scenarios in `tests/evals/`

4. **Test Locally**
   ```bash
   # Manual testing through UI
   pnpm dev
   
   # Run eval scenarios (future)
   pnpm test:evals
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add new coaching framework"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Describe changes
   - Link related issues
   - Request review

## Code Style

### TypeScript
- Use TypeScript strict mode
- Avoid `any` types where possible
- Prefer functional components in React
- Use async/await over promises

### Naming Conventions
- **Files**: camelCase.ts, PascalCase.tsx (components)
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Components**: PascalCase
- **Convex functions**: camelCase

### Formatting
```bash
# Auto-format (when prettier is added)
pnpm format
```

## Adding a New Coaching Framework

1. **Create JSON Schema**
   ```json
   // src/frameworks/clear.json
   {
     "id": "CLEAR",
     "steps": [
       {
         "name": "contract",
         "system_objective": "...",
         "required_fields_schema": { ... }
       }
     ]
   }
   ```

2. **Update Coach Coordinator**
   ```typescript
   // convex/coach.ts
   import clear from "../../src/frameworks/clear.json";
   
   const frameworks: Record<string, any> = { 
     GROW: grow,
     CLEAR: clear 
   };
   ```

3. **Add Test Scenarios**
   ```json
   // tests/evals/clear_basic.json
   {
     "name": "clear_basic",
     "turns": [ ... ]
   }
   ```

4. **Update UI**
   ```typescript
   // src/components/SessionView.tsx
   const STEP_DESCRIPTIONS: Record<StepName, string> = {
     // Add CLEAR step descriptions
   };
   ```

## Safety Guidelines

### When Modifying Prompts
- Never remove banned term checks
- Keep temperature at 0.0
- Maintain two-pass validation
- Test with safety boundary scenarios

### When Changing Schema
- Ensure backward compatibility
- Add migrations if needed
- Update evaluation tests
- Verify validator still works

### When Adding Features
- Consider rate limiting
- Log security-relevant events
- Add input validation
- Document privacy implications

## Testing

### Manual Testing Checklist
- [ ] Normal GROW flow completes
- [ ] Banned terms are rejected
- [ ] Input length limits enforced
- [ ] Safety incidents logged
- [ ] Actions created correctly
- [ ] Dashboard shows correct stats
- [ ] Session can be closed

### Evaluation Tests
```bash
# Run specific eval
node tests/eval-runner.js grow_basic

# Run all evals
node tests/eval-runner.js --all
```

## Documentation

Update relevant docs when you change:
- **API**: Update function signatures in comments
- **Features**: Update README.md
- **Deployment**: Update DEPLOYMENT.md
- **Setup**: Update QUICKSTART.md
- **Architecture**: Update COACHFLUX_MVP_GUIDE.md

## Commit Message Format

```
type(scope): short description

Longer description if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(coach): add CLEAR framework support
fix(validator): handle edge case in banned terms
docs(readme): update installation instructions
```

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows style guide
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console.log() left in code
- [ ] Environment variables documented

### PR Description Template
```markdown
## What
Brief description of changes

## Why
Problem being solved or feature being added

## How
Technical approach and key changes

## Testing
- [ ] Manual testing completed
- [ ] Evaluation tests pass
- [ ] Edge cases considered

## Screenshots
(if applicable)

## Checklist
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Safety checks in place
```

## Getting Help

- Check existing documentation first
- Search closed issues and PRs
- Ask in team chat
- Create a GitHub issue for bugs

## Code of Conduct

- Be respectful and professional
- Focus on the code, not the person
- Accept constructive feedback
- Help others learn and grow

---

**Thank you for contributing to CoachFlux!**
