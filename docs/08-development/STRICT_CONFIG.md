# Strict TypeScript & ESLint Configuration

## ✅ Installation Complete

All dependencies installed successfully. Project is now configured with **zero-tolerance** for unsafe TypeScript and ESLint patterns.

---

## 🔒 Strict TypeScript Rules (tsconfig.json)

### Core Strict Mode
- ✅ **`strict: true`** - Enables all strict type-checking options
- ✅ **`noImplicitAny: true`** - Error on expressions with implied 'any' type
- ✅ **`strictNullChecks: true`** - Null and undefined must be explicit
- ✅ **`strictFunctionTypes: true`** - Strict checking of function types
- ✅ **`strictBindCallApply: true`** - Strict bind/call/apply methods
- ✅ **`strictPropertyInitialization: true`** - Class properties must be initialized
- ✅ **`noImplicitThis: true`** - Error on 'this' with implied 'any'
- ✅ **`alwaysStrict: true`** - Parse in strict mode and emit "use strict"

### Additional Safety Checks
- ✅ **`noUnusedLocals: true`** - Error on unused local variables
- ✅ **`noUnusedParameters: true`** - Error on unused function parameters
- ✅ **`noImplicitReturns: true`** - Error when not all code paths return a value
- ✅ **`noFallthroughCasesInSwitch: true`** - Error on fallthrough in switch statements
- ✅ **`noUncheckedIndexedAccess: true`** - Add undefined to indexed access types
- ✅ **`noImplicitOverride: true`** - Require 'override' keyword for overridden members
- ✅ **`noPropertyAccessFromIndexSignature: true`** - Require indexed access for dynamic properties
- ✅ **`allowUnusedLabels: false`** - Error on unused labels
- ✅ **`allowUnreachableCode: false`** - Error on unreachable code
- ✅ **`exactOptionalPropertyTypes: true`** - Interpret optional properties exactly as written

### Module Resolution
- ✅ **`forceConsistentCasingInFileNames: true`** - Ensure consistent file name casing
- ✅ **`skipLibCheck: false`** - Check all .d.ts files (no shortcuts)

---

## 🛡️ Strict ESLint Rules (.eslintrc.cjs)

### TypeScript-Specific Rules (All Errors)

#### No Unsafe Types
- ❌ **`@typescript-eslint/no-explicit-any`** - Ban 'any' type completely
- ❌ **`@typescript-eslint/no-unsafe-assignment`** - Ban assignments from 'any'
- ❌ **`@typescript-eslint/no-unsafe-member-access`** - Ban accessing properties on 'any'
- ❌ **`@typescript-eslint/no-unsafe-call`** - Ban calling functions typed as 'any'
- ❌ **`@typescript-eslint/no-unsafe-return`** - Ban returning 'any' from functions
- ❌ **`@typescript-eslint/no-unsafe-argument`** - Ban passing 'any' as arguments

#### Promise Safety
- ❌ **`@typescript-eslint/no-floating-promises`** - Promises must be handled
- ❌ **`@typescript-eslint/no-misused-promises`** - Correct promise usage
- ❌ **`@typescript-eslint/await-thenable`** - Only await on thenables
- ❌ **`@typescript-eslint/require-await`** - Async functions must have await

#### Type Correctness
- ❌ **`@typescript-eslint/no-unnecessary-type-assertion`** - Remove unnecessary assertions
- ❌ **`@typescript-eslint/strict-boolean-expressions`** - Only booleans in conditionals (no truthy/falsy)
  - No strings: `if (str)` ❌ → `if (str !== "")` ✅
  - No numbers: `if (count)` ❌ → `if (count > 0)` ✅
  - No nullable objects: `if (obj)` ❌ → `if (obj !== null)` ✅

#### Code Quality
- ⚠️ **`@typescript-eslint/prefer-nullish-coalescing`** - Use `??` instead of `||`
- ⚠️ **`@typescript-eslint/prefer-optional-chain`** - Use `?.` for safe access

### General Best Practices

- ⚠️ **`no-console`** - Warn on console.log (allow console.warn/error)
- ❌ **`no-debugger`** - No debugger statements
- ⚠️ **`no-alert`** - Avoid alert() calls
- ❌ **`eqeqeq`** - Always use === instead of ==
- ❌ **`curly`** - Require curly braces for all control statements
- ❌ **`no-var`** - Use let/const instead of var
- ❌ **`prefer-const`** - Use const when variables aren't reassigned
- ❌ **`prefer-arrow-callback`** - Use arrow functions for callbacks

---

## 📜 New Package Scripts

```bash
# Development
pnpm dev                  # Start dev server

# Type Checking
pnpm type-check          # Run TypeScript compiler (no emit)

# Linting
pnpm lint                # Check for lint errors (max warnings: 0)
pnpm lint:fix            # Auto-fix lint errors

# Combined Check
pnpm check               # Run type-check + lint (pre-commit)

# Build (runs checks first)
pnpm build               # type-check → lint → vite build

# Convex
pnpm convex:dev          # Start Convex backend
pnpm convex:deploy       # Deploy to production
```

---

## 🚨 Common Strict Mode Issues & Fixes

### 1. Array Access Returns `T | undefined`
```typescript
// ❌ Error: Object is possibly 'undefined'
const items = [1, 2, 3];
const first = items[0];
console.log(first.toString()); // Error!

// ✅ Fix 1: Check for undefined
const first = items[0];
if (first !== undefined) {
  console.log(first.toString());
}

// ✅ Fix 2: Use optional chaining
console.log(items[0]?.toString());

// ✅ Fix 3: Use non-null assertion (only if 100% sure)
console.log(items[0]!.toString());
```

### 2. Strict Boolean Expressions
```typescript
// ❌ Error: Expected boolean, got string
const name = "Alice";
if (name) { /* ... */ }

// ✅ Fix: Explicit comparison
if (name !== "") { /* ... */ }

// ❌ Error: Expected boolean, got number
const count = 5;
if (count) { /* ... */ }

// ✅ Fix: Explicit comparison
if (count > 0) { /* ... */ }

// ❌ Error: Expected boolean, got object
const user = { name: "Alice" };
if (user) { /* ... */ }

// ✅ Fix: Explicit null check
if (user !== null) { /* ... */ }
```

### 3. No Implicit Any
```typescript
// ❌ Error: Parameter 'x' implicitly has 'any' type
function double(x) {
  return x * 2;
}

// ✅ Fix: Add explicit type
function double(x: number) {
  return x * 2;
}
```

### 4. Async/Promise Handling
```typescript
// ❌ Error: Promises must be handled
async function fetchData() { /* ... */ }
fetchData(); // Not awaited or .then()'d

// ✅ Fix 1: Await it
await fetchData();

// ✅ Fix 2: Handle with .catch()
void fetchData().catch(console.error);

// ✅ Fix 3: Explicitly ignore (use sparingly)
void fetchData();
```

### 5. No Unsafe 'any'
```typescript
// ❌ Error: 'any' is not allowed
const data: any = JSON.parse(input);

// ✅ Fix 1: Use 'unknown' and type guard
const data: unknown = JSON.parse(input);
if (typeof data === "object" && data !== null) {
  // Type narrowed, safe to use
}

// ✅ Fix 2: Define proper type
interface Data {
  name: string;
  age: number;
}
const data = JSON.parse(input) as Data; // Still risky
// Better: Use Zod for runtime validation
```

### 6. Unused Variables
```typescript
// ❌ Error: 'unused' is declared but never used
const unused = 5;

// ✅ Fix 1: Remove it
// (delete the line)

// ✅ Fix 2: Prefix with underscore if intentionally unused
const _unused = 5; // ESLint will allow this
```

---

## 🎯 Next Steps

### 1. Install Dependencies ✅
```bash
pnpm install  # Already done!
```

### 2. Set Up Convex
```bash
# Start Convex dev server (opens dashboard)
pnpm convex:dev

# In Convex dashboard:
# 1. Go to Settings → Environment Variables
# 2. Add: OPENAI_API_KEY=sk-proj-...
# 3. Save
```

### 3. Run Type Check
```bash
pnpm type-check

# If errors appear, fix them one by one
# The strict rules will guide you to safer code
```

### 4. Run Linter
```bash
pnpm lint

# Auto-fix what can be fixed
pnpm lint:fix
```

### 5. Start Development
```bash
# Terminal 1: Convex backend
pnpm convex:dev

# Terminal 2: Frontend
pnpm dev
```

---

## 📊 Comparison: Before vs After

| Setting | Before | After | Impact |
|---------|--------|-------|--------|
| `skipLibCheck` | true | **false** | Check all type definitions |
| `@typescript-eslint/no-explicit-any` | off | **error** | No 'any' allowed |
| Array access | `T` | **`T \| undefined`** | Safer indexing |
| Boolean checks | Truthy/falsy | **Explicit only** | No implicit coercion |
| Promises | Can ignore | **Must handle** | No forgotten awaits |
| Unused vars | Warning | **Error** | Cleaner code |
| Build script | `tsc && build` | **`check + lint + build`** | Catches errors early |

---

## 🏆 Benefits of Strict Mode

1. **Catch bugs at compile time** - Not at runtime
2. **Better IDE autocomplete** - Precise type information
3. **Safer refactoring** - TypeScript catches breaking changes
4. **Self-documenting code** - Types serve as documentation
5. **Prevents null/undefined crashes** - Explicit null checks required
6. **No silent failures** - Promises must be handled
7. **Production-ready** - Code that passes strict checks is robust

---

## ⚠️ Temporary Exceptions (Use Sparingly)

If you absolutely must bypass a rule temporarily:

```typescript
// Disable for one line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const temp: any = externalLib.getData();

// Disable for a block
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const data = externalLib.getData();
const result = data.process();
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
```

**⚠️ Warning:** Every disable comment should have a TODO comment explaining why and when it can be removed.

---

## 🎓 Learning Resources

- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Your project is now configured with industry-leading type safety. Happy coding! 🚀**
