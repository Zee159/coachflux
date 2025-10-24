// Convex types for CoachFlux

export interface OrgValue {
  key: string;
  description: string;
}

export interface FrameworkStep {
  name: string;
  system_objective: string;
  required_fields_schema: Record<string, unknown>;
}

export interface Framework {
  id: string;
  steps: FrameworkStep[];
}

export interface ValidationResult {
  verdict: "pass" | "fail";
  reasons: string[];
}

export interface ReflectionPayload {
  [key: string]: unknown;
}

// ============================================================================
// NEW COMPASS Model Types - 4 Stages (Clarity, Ownership, Mapping, Practice)
// ============================================================================

/**
 * Confidence tracking for COMPASS sessions
 */
export interface ConfidenceTracking {
  initial_confidence: number;        // 1-10 scale at session start
  post_clarity_confidence?: number;  // After Clarity stage
  post_ownership_confidence: number; // After Ownership stage (main metric)
  final_confidence: number;          // At session end
  confidence_change: number;         // Final - Initial
  confidence_percent_increase: number; // Percentage increase
}

/**
 * AI Nudge types for COMPASS coaching
 */
export type NudgeType =
  | 'control_clarification'           // Category 1: Control & Agency
  | 'sphere_of_influence'
  | 'specificity_push'                // Category 2: Specificity & Clarity
  | 'concretize_action'
  | 'reduce_scope'
  | 'past_success_mining'             // Category 3: Confidence Building
  | 'evidence_confrontation'
  | 'strength_identification'
  | 'threat_to_opportunity'           // Category 4: Reframing
  | 'resistance_cost'
  | 'story_challenge'
  | 'catastrophe_reality_check'
  | 'build_in_backup'                 // Category 5: Action Support
  | 'perfect_to_progress'
  | 'lower_the_bar'
  | 'future_self_anchor'
  | 'reflect_breakthrough'            // Category 6: Insight Amplification
  | 'confidence_progress_highlight';

/**
 * Nudge usage tracking
 */
export interface NudgeUsage {
  nudge_type: NudgeType;
  stage: 'clarity' | 'ownership' | 'mapping' | 'practice';
  effectiveness: 'low' | 'medium' | 'high' | 'very_high';
  confidence_impact?: number; // How many confidence points it added
  timestamp: number;
}

/**
 * User strength observed during session
 */
export interface ObservedStrength {
  strength: string;
  evidence: string;
  stage: string;
}

/**
 * Potential pitfall identified
 */
export interface IdentifiedPitfall {
  pitfall: string;
  evidence: string;
  mitigation: string;
  stage: string;
}

/**
 * Missed opportunity for user
 */
export interface MissedOpportunity {
  opportunity: string;
  description: string;
  benefit: string;
  why_missed: string;
}

// Type guard for reflection payload with coach_reflection
export function hasCoachReflection(payload: unknown): payload is { coach_reflection: string } & Record<string, unknown> {
  return (
    payload !== null &&
    typeof payload === "object" &&
    "coach_reflection" in payload &&
    typeof (payload as Record<string, unknown>)["coach_reflection"] === "string"
  );
}

// Error type guard
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  return String(error);
}

// ============================================================================
// AI Suggestion Types for COMPASS Framework
// ============================================================================

/**
 * AI-generated suggestion for MAPPING phase actions
 */
export interface ActionSuggestion {
  action: string;
  timeline: string;
  resources_needed: string;
}

/**
 * AI-generated suggestion for ANCHORING phase environment design
 */
export interface EnvironmentSuggestion {
  barrier?: string;
  change?: string;
  habit?: string;
  accountability?: string;
  type: 'barrier' | 'change' | 'habit' | 'accountability';
}

/**
 * AI-generated suggestion for SUSTAINING phase leadership
 */
export interface LeadershipSuggestion {
  visibility_action?: string;
  metric?: string;
  team_support?: string;
  celebration?: string;
  type: 'visibility' | 'metric' | 'support' | 'celebration';
}

/**
 * AI-generated suggestion for OWNERSHIP phase benefits
 */
export interface BenefitSuggestion {
  benefit: string;
  category: 'career' | 'skills' | 'relationships' | 'values' | 'personal';
}

/**
 * AI-generated suggestion for PRACTICE phase insights
 */
export interface PracticeSuggestion {
  insight: string;
  type: 'pattern' | 'strength' | 'reframe' | 'connection';
}

/**
 * User choice in the AI suggestion fork
 */
export type UserSuggestionChoice = 'self_generated' | 'ai_suggestions' | 'unclear';

/**
 * Context for generating AI suggestions
 */
export interface SuggestionContext {
  frameworkId: string;
  currentStep: string;
  reflections: Array<{ step: string; payload: ReflectionPayload }>;
  userMessage: string;
}

/**
 * Detect if user wants AI suggestions or prefers self-generation
 */
export function detectSuggestionChoice(userMessage: string): UserSuggestionChoice {
  const lower = userMessage.toLowerCase().trim();
  
  // AI suggestion phrases
  const aiPhrases = [
    'suggest',
    'suggestions',
    'help me',
    'what do you think',
    'what would you',
    'give me',
    'show me',
    'provide',
    'offer',
    'recommend',
    'yes please',
    'yes, please',
    'yeah',
    'sure',
    'ok',
    'okay',
    'ai',
    'you suggest',
  ];
  
  // Self-generation phrases
  const selfPhrases = [
    'i have',
    'i will',
    "i'll",
    'let me',
    'i want to',
    'i think',
    'i\'m considering',
    'another option',
    'myself',
    'on my own',
    'i\'d rather',
    'no thanks',
    'no, thanks',
  ];
  
  // Check for AI suggestion intent
  for (const phrase of aiPhrases) {
    if (lower.includes(phrase)) {
      return 'ai_suggestions';
    }
  }
  
  // Check for self-generation intent
  for (const phrase of selfPhrases) {
    if (lower.includes(phrase)) {
      return 'self_generated';
    }
  }
  
  return 'unclear';
}

// ============================================================================
// COMPASS Transformation Analytics Types
// ============================================================================

/**
 * Emotional state of user towards change
 */
export type EmotionalState = 
  | 'resistant'      // Fighting the change
  | 'anxious'        // Worried about it
  | 'neutral'        // No strong feelings
  | 'cautious'       // Open but careful
  | 'open'           // Receptive
  | 'engaged'        // Actively participating
  | 'leading';       // Championing the change

/**
 * Mindset level in change journey
 */
export type MindsetLevel =
  | 'victim'         // "This is happening TO me"
  | 'observer'       // "I see what's happening"
  | 'stakeholder'    // "This affects me personally"
  | 'actor'          // "I'm taking action"
  | 'leader';        // "I'm leading others through this"

/**
 * The pivotal moment when user shifted perspective
 */
export interface PivotMoment {
  stage: string;              // Which COMPASS stage (e.g., 'ownership')
  user_quote: string;         // Their actual words
  insight: string;            // What they realized
  timestamp: number;          // When it happened
}

/**
 * COMPASS transformation tracking with index signature for frontend compatibility
 */
export interface CompassTransformation extends Record<string, unknown> {
  // Starting state
  initial_emotional_state: EmotionalState;
  initial_mindset: MindsetLevel;
  
  // Ending state
  final_emotional_state: EmotionalState;
  final_mindset: MindsetLevel;
  
  // The pivot moment
  pivot_moment?: PivotMoment;
  
  // Calculated transformation
  transformation_achieved: boolean;  // Did they shift at least 2 levels?
  transformation_magnitude: number;  // How many levels (0-6 for emotional, 0-4 for mindset)
  
  // What unlocked the shift
  unlock_factors: string[];  // E.g., ["Found personal benefits", "Realized control"]
}

/**
 * COMPASS scores with index signature for frontend compatibility
 */
export interface CompassScores extends Record<string, unknown> {
  clarity_score?: number;      // 1-5
  ownership_score?: number;    // 1-5
  mapping_score?: number;      // 1-5
  practice_score?: number;     // 1-5
  anchoring_score?: number;    // 1-5 (now includes leadership visibility - merged from sustaining)
  overall_readiness: number;   // Average of provided scores (5 dimensions max: clarity, ownership, mapping, practice, anchoring)
}

/**
 * Dynamic report template interface
 */
export interface ReportTemplate {
  framework_id: string;
  generate: (sessionData: SessionReportData) => FormattedReport;
}

/**
 * Session data for report generation (NEW COMPASS Model)
 */
export interface SessionReportData {
  framework_id: string;
  user_id: string;
  session_id: string;
  reflections: Array<{ step: string; payload: ReflectionPayload }>;
  completed_at: number;
  duration_minutes: number;
  
  // NEW COMPASS Model - 4-Stage Session Data
  change_description?: string;
  sphere_of_control?: string;
  clarity_score?: number;
  
  // Confidence tracking (PRIMARY METRIC)
  confidence_tracking?: ConfidenceTracking;
  
  // Ownership stage data
  initial_fear?: string;
  breakthrough_moment?: string;
  limiting_belief_identified?: string;
  limiting_belief_challenged?: boolean;
  evidence_against_belief?: string;
  personal_benefit_discovered?: string;
  key_reframe?: string;
  past_success_activated?: {
    achievement: string;
    strategy_used: string;
    current_reputation?: string;
  };
  
  // Mapping stage data
  committed_action?: string;
  action_date?: string;
  action_time?: string;
  action_duration_hours?: number;
  obstacle_identified?: string;
  backup_plan?: string;
  support_person?: string;
  calendar_blocked?: boolean;
  action_commitment_confidence?: number; // 1-10
  
  // Practice/Completion stage data
  key_takeaway?: string;
  key_insight?: string;
  what_shifted?: string;
  
  // Analytics
  nudges_used?: NudgeUsage[];
  strengths_observed?: ObservedStrength[];
  pitfalls_identified?: IdentifiedPitfall[];
  missed_opportunities?: MissedOpportunity[];
  
  // Safety tracking
  safety_flags?: {
    anxiety_detected: boolean;
    agitation_detected: boolean;
    redundancy_concerns: boolean;
    crisis_indicators: boolean;
    severe_dysfunction: boolean;
    session_stopped_for_safety: boolean;
    safety_level?: string;
  };
  
  // Legacy COMPASS (6-stage) - for backward compatibility
  compass_transformation?: CompassTransformation;
  compass_scores?: CompassScores;
  
  // GROW-specific (future)
  grow_goal?: string;
  grow_actions?: Array<{ title: string; owner: string; due_days: number }>;
}

/**
 * Formatted report output
 */
export interface FormattedReport {
  title: string;
  summary: string;
  sections: ReportSection[];
}

/**
 * Report section
 */
export interface ReportSection {
  heading: string;
  content: string;
  type: 'text' | 'scores' | 'insights' | 'actions' | 'transformation';
  data?: Record<string, unknown>;
}

/**
 * Calculate transformation magnitude
 */
export function calculateTransformationMagnitude(
  initial: EmotionalState,
  final: EmotionalState
): number {
  const stateOrder: EmotionalState[] = [
    'resistant',
    'anxious',
    'neutral',
    'cautious',
    'open',
    'engaged',
    'leading'
  ];
  
  const initialIndex = stateOrder.indexOf(initial);
  const finalIndex = stateOrder.indexOf(final);
  
  if (initialIndex === -1 || finalIndex === -1) {
    return 0;
  }
  
  return Math.max(0, finalIndex - initialIndex);
}

/**
 * Calculate mindset level change
 */
export function calculateMindsetChange(
  initial: MindsetLevel,
  final: MindsetLevel
): number {
  const mindsetOrder: MindsetLevel[] = [
    'victim',
    'observer',
    'stakeholder',
    'actor',
    'leader'
  ];
  
  const initialIndex = mindsetOrder.indexOf(initial);
  const finalIndex = mindsetOrder.indexOf(final);
  
  if (initialIndex === -1 || finalIndex === -1) {
    return 0;
  }
  
  return Math.max(0, finalIndex - initialIndex);
}
