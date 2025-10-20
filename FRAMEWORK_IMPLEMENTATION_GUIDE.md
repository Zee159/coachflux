# 🛠️ FRAMEWORK IMPLEMENTATION GUIDE

**Companion to**: FRAMEWORK_MODULISATION_STRATEGY.md  
**Purpose**: Production-ready type definitions, error handling, and migration plan

---

## 1. Complete TypeScript Interfaces

### Core Types (`/src/lib/frameworks/types.ts`)

```typescript
import { JSONSchema7 } from 'json-schema';

export type FrameworkId = 'GROW' | 'CLEAR' | 'COMPASS' | 'POWER_INTEREST_GRID' | 'PSYCHOLOGICAL_SAFETY' | 'EXECUTIVE_PRESENCE';
export type ChallengeType = 'goal_achievement' | 'complex_situation' | 'change_leadership' | 'stakeholder_management' | 'team_development' | 'executive_presence';
export type SessionStatus = 'active' | 'paused' | 'completed' | 'abandoned' | 'error';

export interface FrameworkDefinition {
  id: FrameworkId;
  name: string;
  description: string;
  duration_minutes: number;
  challenge_types: ChallengeType[];
  steps: FrameworkStep[];
  completion_rules: CompletionRule[];
}

export interface FrameworkStep {
  name: string;
  order: number;
  duration_minutes: number;
  objective: string;
  required_fields_schema: JSONSchema7;
  system_prompt: string;
  coaching_questions: string[];
  guardrails: string[];
  transition_rules: TransitionRule[];
}

export interface TransitionRule {
  condition: string;
  nextStep: string | 'COMPLETE';
  action: string;
}

export interface CompletionRule {
  required_fields: string[];
  validation: (data: Record<string, unknown>) => boolean;
  error_message: string;
}

export interface ExecutionResult {
  success: boolean;
  response?: string;
  extracted_data?: Record<string, unknown>;
  validation_errors?: ValidationError[];
  next_step?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  expected: string;
  actual: unknown;
}

export interface SessionState {
  sessionId: string;
  userId: string;
  frameworkId: FrameworkId;
  currentStep: number;
  startedAt: Date;
  lastActivityAt: Date;
  status: SessionStatus;
  collectedData: Record<string, unknown>;
  conversationHistory: Message[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface FrameworkSelectionResult {
  frameworkId: FrameworkId;
  confidence: number;
  reason: string;
  alternatives?: Array<{ frameworkId: FrameworkId; confidence: number; }>;
}
```

---

## 2. Type Safety Fixes

### Safe Framework Registry

```typescript
// ❌ OLD (UNSAFE):
export function getFramework(frameworkId: string): FrameworkDefinition {
  return frameworkRegistry[frameworkId]; // Returns undefined if not found!
}

// ✅ NEW (TYPE SAFE):
export function getFramework(frameworkId: FrameworkId): FrameworkDefinition {
  const framework = frameworkRegistry[frameworkId];
  if (!framework) {
    throw new FrameworkNotFoundError(frameworkId);
  }
  return framework;
}

// Type guard
export function isValidFrameworkId(id: string): id is FrameworkId {
  return id in frameworkRegistry;
}

// Safe getter with fallback
export function getFrameworkSafe(
  frameworkId: string,
  fallback: FrameworkId = 'GROW'
): FrameworkDefinition {
  if (isValidFrameworkId(frameworkId)) {
    return frameworkRegistry[frameworkId];
  }
  console.warn(`Invalid framework ID: ${frameworkId}, falling back to ${fallback}`);
  return frameworkRegistry[fallback];
}

export class FrameworkNotFoundError extends Error {
  constructor(frameworkId: string) {
    super(`Framework not found: ${frameworkId}`);
    this.name = 'FrameworkNotFoundError';
  }
}
```

---

## 3. Error Handling Patterns

### Error Hierarchy

```typescript
export abstract class FrameworkError extends Error {
  public readonly timestamp: Date;
  public readonly context: Record<string, unknown>;
  
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.timestamp = new Date();
    this.context = context;
    this.name = this.constructor.name;
  }
}

export class LLMTimeoutError extends FrameworkError {}
export class ValidationError extends FrameworkError {}
export class SessionNotFoundError extends FrameworkError {}
```

### Retry with Exponential Backoff

```typescript
async function callLLMWithRetry(
  prompt: string,
  maxRetries: number = 3
): Promise<LLMResponse> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await callClaude(prompt);
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw new LLMTimeoutError('LLM call failed after retries');
      }
      await sleep(1000 * Math.pow(2, attempt)); // Exponential backoff
    }
  }
  throw new Error('Unreachable');
}
```

### User-Friendly Error Messages

```typescript
export function getUserFriendlyError(error: FrameworkError): string {
  switch (error.constructor) {
    case FrameworkNotFoundError:
      return 'The selected coaching framework is not available.';
    case LLMTimeoutError:
      return 'The AI coach is taking longer than expected. Please try again.';
    case SessionExpiredError:
      return 'Your session has expired. Please start a new session.';
    default:
      return 'Something went wrong. Please try again or contact support.';
  }
}
```

---

## 4. State Management Architecture

### Session Lifecycle (Convex)

```typescript
export const createSession = mutation({
  args: { userId: v.string(), frameworkId: v.string(), initialInput: v.string() },
  handler: async (ctx, args): Promise<string> => {
    if (!isValidFrameworkId(args.frameworkId)) {
      throw new FrameworkNotFoundError(args.frameworkId);
    }
    
    const sessionId = await ctx.db.insert('sessions', {
      userId: args.userId,
      frameworkId: args.frameworkId as FrameworkId,
      currentStep: 0,
      status: 'active',
      startedAt: Date.now(),
      lastActivityAt: Date.now(),
      collectedData: {},
    });
    
    return sessionId;
  },
});

export const advanceSession = mutation({
  args: { sessionId: v.id('sessions'), extractedData: v.any() },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new SessionNotFoundError(args.sessionId);
    
    // Check expiry (24 hours)
    const hoursSinceActivity = (Date.now() - session.lastActivityAt) / (1000 * 60 * 60);
    if (hoursSinceActivity > 24) {
      await ctx.db.patch(args.sessionId, { status: 'abandoned' });
      throw new SessionExpiredError(args.sessionId);
    }
    
    // Update session
    await ctx.db.patch(args.sessionId, {
      currentStep: session.currentStep + 1,
      collectedData: { ...session.collectedData, ...args.extractedData },
      lastActivityAt: Date.now(),
    });
  },
});
```

### Concurrent Sessions

```typescript
// Limit concurrent sessions per user
export const canCreateSession = query({
  args: { userId: v.string() },
  handler: async (ctx, args): Promise<boolean> => {
    const activeSessions = await ctx.db
      .query('sessions')
      .withIndex('by_user', q => q.eq('userId', args.userId))
      .filter(q => q.eq(q.field('status'), 'active'))
      .collect();
    
    return activeSessions.length < 3; // Max 3 concurrent sessions
  },
});
```

---

## 5. Security Considerations

### Input Sanitization

```typescript
export function sanitizeUserInput(input: string): string {
  let sanitized = input.trim();
  
  // Limit length (prevent DoS)
  const MAX_LENGTH = 5000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }
  
  // Remove null bytes & normalize unicode
  sanitized = sanitized.replace(/\0/g, '').normalize('NFC');
  
  return sanitized;
}
```

### Prompt Injection Detection

```typescript
export function detectPromptInjection(input: string): boolean {
  const suspiciousPatterns = [
    /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/i,
    /system\s*:\s*/i,
    /you\s+are\s+(now|actually)\s+/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
}
```

### Rate Limiting

```typescript
// 20 requests per minute per user
export const checkRateLimit = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args): Promise<boolean> => {
    const now = Date.now();
    const windowMs = 60 * 1000;
    
    const recentActions = await ctx.db
      .query('rate_limits')
      .withIndex('by_user', q => q.eq('userId', args.userId))
      .filter(q => q.gt(q.field('timestamp'), now - windowMs))
      .collect();
    
    if (recentActions.length >= 20) return false;
    
    await ctx.db.insert('rate_limits', { userId: args.userId, timestamp: now });
    return true;
  },
});
```

---

## 6. Migration Plan

### Phase 1: Preparation (Week 0)

```typescript
// Feature flag
export const MODULAR_FRAMEWORK_ENABLED = process.env.VITE_MODULAR_FRAMEWORK === 'true';

// Backup data
export const backupSessions = mutation({
  handler: async (ctx) => {
    const sessions = await ctx.db.query('sessions').collect();
    await ctx.db.insert('session_backups', { timestamp: Date.now(), sessions });
    return { backed_up: sessions.length };
  },
});
```

### Phase 2: Shadow Mode (Week 1)

```typescript
// Run old + new systems in parallel, return old result
export const processMessageShadow = mutation({
  args: { sessionId: v.id('sessions'), userInput: v.string() },
  handler: async (ctx, args) => {
    const oldResult = await processMessageOldWay(ctx, args);
    
    // Run new system in background (don't block)
    if (MODULAR_FRAMEWORK_ENABLED) {
      processMessageNewWay(ctx, args).catch(console.error);
    }
    
    return oldResult; // Always return old
  },
});
```

### Phase 3: Gradual Rollout (Week 2)

```typescript
// Percentage-based rollout
const ROLLOUT_PERCENTAGE = parseInt(process.env.VITE_ROLLOUT_PERCENTAGE || '0');

function shouldUseNewSystem(userId: string): boolean {
  if (!MODULAR_FRAMEWORK_ENABLED) return false;
  const hash = hashCode(userId);
  return (Math.abs(hash) % 100) < ROLLOUT_PERCENTAGE;
}
```

### Phase 4: Full Cutover (Week 3)

```typescript
// Monitor health
export const getSystemHealth = query({
  handler: async (ctx) => {
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const sessions = await ctx.db.query('sessions')
      .filter(q => q.gt(q.field('startedAt'), last24h))
      .collect();
    const errors = await ctx.db.query('error_logs')
      .filter(q => q.gt(q.field('timestamp'), last24h))
      .collect();
    
    return {
      total_sessions: sessions.length,
      error_rate: errors.length / sessions.length,
      healthy: errors.length < sessions.length * 0.05, // <5% errors
    };
  },
});
```

### Phase 5: Cleanup (Week 4)

- Remove old code
- Remove feature flags
- Archive migration logs

### Migration Checklist

**Week 0: Preparation**
- [ ] Create feature flag
- [ ] Backup all sessions
- [ ] Set up monitoring

**Week 1: Shadow Mode**
- [ ] Deploy new system (disabled)
- [ ] Run both in parallel
- [ ] Compare outputs

**Week 2: Gradual Rollout**
- [ ] Enable for 10% users
- [ ] Monitor errors
- [ ] Increase to 100%

**Week 3: Full Cutover**
- [ ] All users on new system
- [ ] Monitor for 1 week

**Week 4: Cleanup**
- [ ] Remove old code
- [ ] Archive logs

---

## Emergency Rollback

```bash
# If production breaks:
# 1. Revert Convex functions
npx convex deploy --prod --schema-only

# 2. Revert frontend
git revert <commit-hash>
git push

# 3. Verify manually
```

**Max downtime target**: 30 minutes

---

## Summary

This guide provides production-ready TypeScript interfaces, error handling patterns, security measures, and a 4-week migration plan with rollback strategy. All code is type-safe and follows strict TypeScript guidelines.
