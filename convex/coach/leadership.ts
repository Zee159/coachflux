/**
 * LEADERSHIP Coach Logic
 * 
 * Implements step completion validation and transition logic for the Leadership framework.
 */

import type { FrameworkCoach, StepCompletionResult, StepTransitions } from "./types";
import type { ReflectionPayload } from "../types";

export class LeadershipCoach implements FrameworkCoach {
  /**
   * Get required fields for each LEADERSHIP step
   */
  getRequiredFields(): Record<string, string[]> {
    return {
      SELF_AWARENESS: ["current_leadership_role", "leadership_challenge", "leadership_strengths", "development_areas", "self_awareness_score"],
      TEAM_DYNAMICS: ["team_health_score", "team_strengths", "team_challenges", "trust_level", "psychological_safety"],
      INFLUENCE_STRATEGY: ["key_stakeholders", "influence_goal", "influence_barriers", "ai_wants_tactic_suggestions", "influence_confidence"],
      DEVELOPMENT_PLAN: ["priority_development_area", "development_actions", "practice_opportunities", "feedback_sources", "development_confidence"],
      ACCOUNTABILITY: ["first_action", "action_date", "accountability_partner", "commitment_level"],
      REVIEW: ["key_insight", "immediate_next_step", "final_confidence", "leadership_clarity", "session_helpfulness"],
    };
  }

  /**
   * Get required fields for a given step (helper method)
   */
  private getStepRequiredFields(step: string): string[] {
    switch (step) {
      case "SELF_AWARENESS":
        return ["current_leadership_role", "leadership_challenge", "leadership_strengths", "development_areas", "self_awareness_score"];
      case "TEAM_DYNAMICS":
        return ["team_health_score", "team_strengths", "team_challenges", "trust_level", "psychological_safety"];
      case "INFLUENCE_STRATEGY":
        return ["key_stakeholders", "influence_goal", "influence_barriers", "ai_wants_tactic_suggestions", "influence_confidence"];
      case "DEVELOPMENT_PLAN":
        return ["priority_development_area", "development_actions", "practice_opportunities", "feedback_sources", "development_confidence"];
      case "ACCOUNTABILITY":
        return ["first_action", "action_date", "accountability_partner", "commitment_level"];
      case "REVIEW":
        return ["key_insight", "immediate_next_step", "final_confidence", "leadership_clarity", "session_helpfulness"];
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
    // Special handling for SELF_AWARENESS first turn (consent)
    if (step === "SELF_AWARENESS") {
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
        SELF_AWARENESS: "Great self-awareness! Now let's look at your team dynamics.",
        TEAM_DYNAMICS: "Good understanding of your team. Let's develop your influence strategy.",
        INFLUENCE_STRATEGY: "Excellent. Now let's create your development plan.",
        DEVELOPMENT_PLAN: "Solid plan! Let's establish accountability.",
        ACCOUNTABILITY: "Perfect. Let's wrap up with final reflections.",
        REVIEW: "Session complete! Your leadership development plan is ready. Check your report."
      },
      openers: {
        SELF_AWARENESS: "Let's start by understanding your leadership style and challenges.",
        TEAM_DYNAMICS: "Now let's explore your team dynamics and relationships.",
        INFLUENCE_STRATEGY: "Let's develop strategies for influencing stakeholders.",
        DEVELOPMENT_PLAN: "Time to create your leadership development plan.",
        ACCOUNTABILITY: "Let's establish accountability for your development.",
        REVIEW: "Let's wrap up with some final reflections."
      }
    };
  }
}

// Export singleton instance
export const leadershipCoach = new LeadershipCoach();
