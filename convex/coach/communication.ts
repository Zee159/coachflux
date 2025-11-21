/**
 * COMMUNICATION Coach Logic
 * Implements FrameworkCoach interface for the Communication framework
 */

import type { FrameworkCoach, StepCompletionResult, StepTransitions } from "./types";
import type { ReflectionPayload } from "../types";

export class CommunicationCoach implements FrameworkCoach {
  /**
   * Get required fields for each COMMUNICATION step
   */
  getRequiredFields(): Record<string, string[]> {
    return {
      SITUATION: ["conversation_type", "person_relationship", "conversation_context", "stakes", "situation_clarity"],
      OUTCOME: ["ideal_outcome", "relationship_goal", "must_say", "outcome_clarity"],
      PERSPECTIVE: ["their_perspective", "likely_reactions", "empathy_level", "preparation_confidence"],
      SCRIPT: ["opening_line", "key_phrases", "script_confidence"],
      COMMITMENT: ["when_conversation", "where_conversation", "commitment_level"],
      REVIEW: ["key_insight", "final_confidence", "session_helpfulness"],
    };
  }

  /**
   * Get required fields for a given step (helper method)
   */
  private getStepRequiredFields(step: string): string[] {
    switch (step) {
      case "SITUATION":
        return ["conversation_type", "person_relationship", "conversation_context", "stakes", "situation_clarity"];
      case "OUTCOME":
        return ["ideal_outcome", "relationship_goal", "must_say", "outcome_clarity"];
      case "PERSPECTIVE":
        return ["their_perspective", "likely_reactions", "empathy_level", "preparation_confidence"];
      case "SCRIPT":
        return ["opening_line", "key_phrases", "script_confidence"];
      case "COMMITMENT":
        return ["when_conversation", "where_conversation", "commitment_level"];
      case "REVIEW":
        return ["key_insight", "final_confidence", "session_helpfulness"];
      default:
        return [];
    }
  }

  /**
   * Check if a LEADERSHIP step is complete
   * Uses progressive relaxation based on skip count
   */
  checkStepCompletion(
    step: string,
    payload: ReflectionPayload,
    _reflections: Array<{ step: string; payload: ReflectionPayload }>,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    const requiredFields = this.getStepRequiredFields(step);

    // Count how many required fields are present
    const presentFields = requiredFields.filter(field => {
      const value = payload[field];
      if (value === null || value === undefined) {
        return false;
      }
      if (typeof value === 'string' && value.trim().length === 0) {
        return false;
      }
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
      return true;
    });

    const completionRate = presentFields.length / requiredFields.length;

    // Progressive relaxation thresholds
    let shouldAdvance = false;
    if (loopDetected) {
      shouldAdvance = completionRate >= 0.5; // 50% if loop detected
    } else if (skipCount === 0) {
      shouldAdvance = completionRate === 1.0; // 100% on first try
    } else if (skipCount === 1) {
      shouldAdvance = completionRate >= 0.75; // 75% after 1 skip
    } else if (skipCount === 2) {
      shouldAdvance = completionRate >= 0.66; // 66% after 2 skips
    } else {
      shouldAdvance = completionRate >= 0.5; // 50% after 3+ skips
    }

    return {
      shouldAdvance,
      capturedFields: presentFields,
      missingFields: requiredFields.filter(f => !presentFields.includes(f)),
      completionPercentage: Math.round(completionRate * 100)
    };
  }

  /**
   * Get step transition and opener messages
   */
  getStepTransitions(): StepTransitions {
    return {
      transitions: {
        SITUATION: "Good clarity on the situation. Now let's define what success looks like.",
        OUTCOME: "Clear outcome defined. Now let's understand their perspective.",
        PERSPECTIVE: "Great empathy building. Now let's craft your script.",
        SCRIPT: "Excellent script! Now let's commit to timing and self-care.",
        COMMITMENT: "Perfect commitment. Let's wrap up with final reflections.",
        REVIEW: "Session complete! Your conversation preparation is ready. Check your report."
      },
      openers: {
        SITUATION: "Let's start by understanding the conversation you need to have.",
        OUTCOME: "Now let's define what success looks like for this conversation.",
        PERSPECTIVE: "Let's understand the other person's perspective.",
        SCRIPT: "Time to craft your opening and key phrases.",
        COMMITMENT: "Let's commit to when and how you'll have this conversation.",
        REVIEW: "Let's wrap up with some final reflections."
      }
    };
  }
}

// Export singleton instance
export const communicationCoach = new CommunicationCoach();
