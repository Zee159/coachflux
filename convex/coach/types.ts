/**
 * Shared types for coaching engine
 */

import type { ReflectionPayload } from "../types";

/**
 * Step completion check result
 */
export interface StepCompletionResult {
  shouldAdvance: boolean;
  reason?: string;
  capturedFields?: string[];
  missingFields?: string[];
  completionPercentage?: number;
}

/**
 * Step state aggregation
 */
export interface StepState {
  capturedState: Record<string, unknown>;
  missingFields: string[];
  capturedFields: string[];
  completionPercentage: number;
}

/**
 * Step transition messages
 */
export interface StepTransitions {
  transitions: Record<string, string>;
  openers: Record<string, string>;
}

/**
 * Framework coach interface
 * Each framework must implement this interface
 */
export interface FrameworkCoach {
  /**
   * Check if a step is complete and ready to advance
   */
  checkStepCompletion(
    stepName: string,
    payload: ReflectionPayload,
    reflections: Array<{ step: string; payload: ReflectionPayload }>,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult;

  /**
   * Get step transition and opener messages
   */
  getStepTransitions(): StepTransitions;

  /**
   * Get required fields for agent state tracking
   */
  getRequiredFields(): Record<string, string[]>;

  /**
   * Generate framework-specific AI context (suggestions, nudges, etc.)
   */
  generateAIContext?(
    stepName: string,
    reflections: Array<{ step: string; payload: ReflectionPayload }>,
    userInput: string
  ): string;
}

/**
 * Coach action result
 */
export interface CoachActionResult {
  ok: boolean;
  message?: string;
  hint?: string;
  nextStep?: string;
  payload?: ReflectionPayload;
  sessionClosed?: boolean;
}


