/**
 * Core Framework Type Definitions
 * 
 * Strict TypeScript types for modular coaching framework architecture.
 * All types follow zero-tolerance type safety policy (no 'any', proper validation).
 */

// ============================================================================
// Framework Identifiers
// ============================================================================

export type FrameworkId = 
  | 'GROW' 
  | 'CLEAR' 
  | 'COMPASS' 
  | 'CAREER'
  | 'PRODUCTIVITY'
  | 'LEADERSHIP'
  | 'COMMUNICATION'
  | 'POWER_INTEREST_GRID' 
  | 'PSYCHOLOGICAL_SAFETY' 
  | 'EXECUTIVE_PRESENCE';

export type ChallengeType = 
  | 'goal_achievement' 
  | 'complex_situation' 
  | 'change_leadership' 
  | 'career_development' 
  | 'stakeholder_management' 
  | 'team_development' 
  | 'executive_presence';

export type SessionStatus = 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'abandoned' 
  | 'error';

// ============================================================================
// JSON Schema Types (Simplified for Convex compatibility)
// ============================================================================

export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
  items?: JSONSchemaProperty;
  minItems?: number;
  maxItems?: number;
}

export interface JSONSchemaProperty {
  type: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  enum?: string[];
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
  minItems?: number;
  maxItems?: number;
}

// ============================================================================
// Framework Definition
// ============================================================================

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
  required_fields_schema: JSONSchema;
  system_prompt: string;
  coaching_questions: string[];
  guardrails: string[];
  transition_rules: TransitionRule[];
}

export interface TransitionRule {
  condition: string;
  nextStep: string;
  action: string;
}

export interface CompletionRule {
  required_fields: string[];
  validation: (data: Record<string, unknown>) => boolean;
  error_message: string;
}

// ============================================================================
// Execution & Validation
// ============================================================================

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

// ============================================================================
// Session State
// ============================================================================

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

// ============================================================================
// Framework Selection
// ============================================================================

export interface FrameworkSelectionResult {
  frameworkId: FrameworkId;
  confidence: number;
  reason: string;
  alternatives?: Array<{ 
    frameworkId: FrameworkId; 
    confidence: number; 
  }>;
}

// ============================================================================
// Legacy Compatibility (for existing coach.ts)
// ============================================================================

/**
 * Legacy Framework type from coach.ts
 * Used during migration phase - will be deprecated
 */
export interface LegacyFramework {
  id: string;
  steps: LegacyFrameworkStep[];
}

export interface LegacyFrameworkStep {
  name: string;
  system_objective: string;
  required_fields_schema: Record<string, unknown>;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isValidFrameworkId(id: string): id is FrameworkId {
  const validIds: FrameworkId[] = [
    'GROW',
    'CLEAR',
    'COMPASS',
    'CAREER',
    'PRODUCTIVITY',
    'LEADERSHIP',
    'COMMUNICATION',
    'POWER_INTEREST_GRID',
    'PSYCHOLOGICAL_SAFETY',
    'EXECUTIVE_PRESENCE'
  ];
  return validIds.includes(id as FrameworkId);
}

export function isValidChallengeType(type: string): type is ChallengeType {
  const validTypes: ChallengeType[] = [
    'goal_achievement',
    'complex_situation',
    'change_leadership',
    'career_development',
    'stakeholder_management',
    'team_development',
    'executive_presence'
  ];
  return validTypes.includes(type as ChallengeType);
}

// ============================================================================
// Error Classes
// ============================================================================

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

export class FrameworkNotFoundError extends FrameworkError {
  constructor(frameworkId: string) {
    super(`Framework not found: ${frameworkId}`, { frameworkId });
  }
}

export class StepValidationError extends FrameworkError {
  constructor(stepName: string, errors: ValidationError[]) {
    super(`Validation failed for step: ${stepName}`, { stepName, errors });
  }
}

export class SessionExpiredError extends FrameworkError {
  constructor(sessionId: string) {
    super(`Session expired: ${sessionId}`, { sessionId });
  }
}

export class LLMTimeoutError extends FrameworkError {
  constructor(attemptCount: number) {
    super(`LLM call failed after ${attemptCount} attempts`, { attemptCount });
  }
}
