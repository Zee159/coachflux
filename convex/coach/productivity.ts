/**
 * PRODUCTIVITY Coach Logic
 * 
 * Implements step completion validation and transition logic for the Productivity framework.
 */

import type { FrameworkCoach, StepCompletionResult, StepTransitions } from "./types";
import type { ReflectionPayload } from "../types";

export class ProductivityCoach implements FrameworkCoach {
  /**
   * Get required fields for each PRODUCTIVITY step
   */
  getRequiredFields(): Record<string, string[]> {
    return {
      ASSESSMENT: ["current_productivity_level", "biggest_productivity_challenge", "productivity_goal"],
      FOCUS_AUDIT: ["deep_work_percentage", "peak_energy_hours", "distraction_triggers", "time_audit_score"],
      SYSTEM_DESIGN: ["ai_wants_framework_suggestions", "chosen_framework", "deep_work_blocks", "system_confidence"],
      IMPLEMENTATION: ["first_action", "daily_commitment", "implementation_confidence"],
      REVIEW: ["key_insight", "immediate_next_step", "final_confidence", "system_clarity", "session_helpfulness"],
    };
  }

  /**
   * Get required fields for a given step (helper method)
   */
  private getStepRequiredFields(step: string): string[] {
  switch (step) {
    case "ASSESSMENT":
      return ["current_productivity_level", "biggest_productivity_challenge", "productivity_goal"];
    case "FOCUS_AUDIT":
      return ["deep_work_percentage", "peak_energy_hours", "distraction_triggers", "time_audit_score"];
    case "SYSTEM_DESIGN":
      return ["ai_wants_framework_suggestions", "chosen_framework", "deep_work_blocks", "system_confidence"];
    case "IMPLEMENTATION":
      return ["first_action", "daily_commitment", "implementation_confidence"];
    case "REVIEW":
      return ["key_insight", "immediate_next_step", "final_confidence", "system_clarity", "session_helpfulness"];
    default:
      return [];
  }
}

/**
   * Check if a PRODUCTIVITY step is complete
   * Uses progressive relaxation based on skip count
   */
  checkStepCompletion(
    step: string,
    payload: ReflectionPayload,
    _reflections: Array<{ step: string; payload: ReflectionPayload }>,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    // Special handling for ASSESSMENT first turn (consent)
    if (step === "ASSESSMENT") {
      const userConsentGiven = payload["user_consent_given"];
      
      // If consent not yet given, only check for consent
      if (typeof userConsentGiven !== "boolean" || userConsentGiven !== true) {
        return {
          shouldAdvance: false,
          capturedFields: [],
          missingFields: ["user_consent_given"],
          completionPercentage: 0
        };
      }
      
      // If consent given, check for other required fields
      // (consent is not in requiredFields list, so we check separately)
    }
    
    const requiredFields = this.getStepRequiredFields(step);
  
  // Count how many required fields are present
  const presentFields = requiredFields.filter(field => {
    const value = payload[field];
    if (value === null || value === undefined) {return false;}
    if (typeof value === 'string' && value.trim().length === 0) {return false;}
    if (Array.isArray(value) && value.length === 0) {return false;}
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
        ASSESSMENT: "Great! Now let's analyze how you're currently spending your time and energy.",
        FOCUS_AUDIT: "Perfect. Based on your time audit, let's design a productivity system that works for you.",
        SYSTEM_DESIGN: "Excellent system! Now let's create a concrete plan to implement it.",
        IMPLEMENTATION: "You have a solid implementation plan. Let's wrap up with some final reflections.",
        REVIEW: "Session complete! Your productivity system is ready. Check your report for the full plan."
      },
      openers: {
        ASSESSMENT: "Let's start by understanding your current productivity state.",
        FOCUS_AUDIT: "Now let's analyze how you're spending your time and energy.",
        SYSTEM_DESIGN: "Time to design your personalized productivity system.",
        IMPLEMENTATION: "Let's create a concrete plan to implement your system.",
        REVIEW: "Let's wrap up with some final reflections."
      }
    };
  }

}

// Export singleton instance
export const productivityCoach = new ProductivityCoach();
