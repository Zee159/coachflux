/**
 * GROW Framework Coach
 * Handles GROW-specific coaching logic, completion criteria, and transitions
 */

import type { FrameworkCoach, StepCompletionResult, StepTransitions } from "./types";
import type { ReflectionPayload } from "../types";

export class GROWCoach implements FrameworkCoach {
  /**
   * Required fields for each GROW step (for agent state tracking)
   * Enhanced with success criteria alignment validation
   */
  getRequiredFields(): Record<string, string[]> {
    return {
      introduction: ["user_consent_given"],
      goal: ["goal", "why_now", "success_criteria", "timeframe"],
      reality: ["current_state", "constraints", "resources", "risks"],
      options: ["options"],
      will: ["suggested_action", "selected_option_ids", "current_option_index"], // Button-based flow
      review: ["key_takeaways", "immediate_step", "confidence_level"],
    };
  }

  /**
   * Check if a GROW step is complete
   */
  checkStepCompletion(
    stepName: string,
    payload: ReflectionPayload,
    _reflections: Array<{ step: string; payload: ReflectionPayload }>,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    if (stepName === "introduction") {
      return this.checkIntroductionCompletion(payload);
    } else if (stepName === "goal") {
      return this.checkGoalCompletion(payload, skipCount, loopDetected);
    } else if (stepName === "reality") {
      return this.checkRealityCompletion(payload, skipCount, loopDetected);
    } else if (stepName === "options") {
      return this.checkOptionsCompletion(payload, skipCount, loopDetected);
    } else if (stepName === "will") {
      return this.checkWillCompletion(payload, skipCount, loopDetected);
    } else if (stepName === "review") {
      // Review step never auto-advances (frontend triggers generateReviewAnalysis)
      return { shouldAdvance: false };
    }

    // Default: advance if coach_reflection exists
    const hasCoachReflection = typeof payload["coach_reflection"] === "string" && payload["coach_reflection"].length > 0;
    return { shouldAdvance: hasCoachReflection };
  }

  /**
   * Introduction step completion logic
   * Advances when user gives consent (user_consent_given = true)
   */
  private checkIntroductionCompletion(payload: ReflectionPayload): StepCompletionResult {
    const userConsentGiven = payload["user_consent_given"];
    
    // Check if user has explicitly consented
    if (typeof userConsentGiven === "boolean" && userConsentGiven === true) {
      return { shouldAdvance: true };
    }
    
    // Don't advance without explicit consent
    return { shouldAdvance: false };
  }

  /**
   * Goal step completion logic
   */
  private checkGoalCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    const hasGoal = typeof payload["goal"] === "string" && payload["goal"].length > 0;
    const hasWhyNow = typeof payload["why_now"] === "string" && payload["why_now"].length > 0;
    const hasSuccessCriteria = Array.isArray(payload["success_criteria"]) && payload["success_criteria"].length > 0;
    const hasTimeframe = typeof payload["timeframe"] === "string" && payload["timeframe"].length > 0;

    const completedFields = [hasGoal, hasWhyNow, hasSuccessCriteria, hasTimeframe].filter(Boolean).length;

    // Progressive relaxation based on skip count and loop detection
    let requiredFields = 4; // Default: ALL 4 fields required (goal, why_now, success_criteria, timeframe)

    if (loopDetected) {
      requiredFields = 2; // System is stuck, be lenient
    } else if (skipCount >= 2) {
      requiredFields = 1; // User exhausted skips, force advance with minimal info
    } else if (skipCount === 1) {
      requiredFields = 3; // User used one skip, require 3/4 fields
    }

    return { shouldAdvance: completedFields >= requiredFields };
  }

  /**
   * Reality step completion logic
   */
  private checkRealityCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    const hasCurrentState = typeof payload["current_state"] === "string" && payload["current_state"].length > 0;
    const hasConstraints = Array.isArray(payload["constraints"]) && payload["constraints"].length > 0;
    const hasResources = Array.isArray(payload["resources"]) && payload["resources"].length > 0;
    const hasRisks = Array.isArray(payload["risks"]) && payload["risks"].length > 0;
    const additionalExplorationCount = [hasConstraints, hasResources].filter(Boolean).length;

    // Progressive relaxation based on skip count
    let requiredAdditionalExploration = 2; // Default: constraints AND resources

    if (loopDetected) {
      requiredAdditionalExploration = 1;
    } else if (skipCount >= 2) {
      requiredAdditionalExploration = 0; // Just need current_state + risks
    } else if (skipCount === 1) {
      requiredAdditionalExploration = 1;
    }

    // Risks is ALWAYS required, plus current_state and additional exploration
    return {
      shouldAdvance: hasCurrentState && hasRisks && additionalExplorationCount >= requiredAdditionalExploration
    };
  }

  /**
   * Options step completion logic
   * NEW: Button-based flow - ONLY advances when user selects options via buttons
   */
  private checkOptionsCompletion(
    payload: ReflectionPayload,
    _skipCount: number,
    _loopDetected: boolean
  ): StepCompletionResult {
    const options = payload["options"];
    const selectedOptionIds = payload["selected_option_ids"];

    // CRITICAL: Options step uses button-based selection
    // Only advance when user has selected options via OptionsSelector buttons
    if (Array.isArray(selectedOptionIds) && selectedOptionIds.length > 0) {
      // User selected options via buttons - advance to Will step
      return { shouldAdvance: true };
    }

    // If no options array generated yet, DO NOT advance
    if (!Array.isArray(options) || options.length === 0) {
      return { shouldAdvance: false };
    }

    // If options exist but user hasn't selected yet, DO NOT advance
    // (Wait for button click which will trigger structured input handler)
    return { shouldAdvance: false };
  }

  /**
   * Will step completion logic
   * NEW: Button-based flow - NEVER auto-advances
   * Backend explicitly advances to Review after all options processed
   */
  private checkWillCompletion(
    payload: ReflectionPayload,
    _skipCount: number,
    _loopDetected: boolean
  ): StepCompletionResult {
    // CRITICAL: Will step uses button-based action validation
    // The step NEVER auto-advances based on payload fields
    // Backend explicitly advances to Review when all options are processed
    
    // Check if we're still processing options (has suggested_action)
    const suggestedAction = payload["suggested_action"];
    if (suggestedAction !== undefined && suggestedAction !== null) {
      // Still showing ActionValidator buttons - DO NOT advance
      return { shouldAdvance: false };
    }
    
    // Check if backend has explicitly moved to Review
    // (This happens in action_accepted/action_skipped handlers when no more options)
    const actions = payload["actions"];
    const selectedOptionIds = payload["selected_option_ids"];
    
    if (Array.isArray(actions) && Array.isArray(selectedOptionIds)) {
      // If we have actions but no suggested_action, backend is done
      // But we still don't auto-advance - backend handles Review transition
      return { shouldAdvance: false };
    }
    
    // Default: DO NOT advance
    // Backend controls all Will → Review transitions
    return { shouldAdvance: false };
  }

  /**
   * Get GROW step transitions and openers
   * Enhanced with success criteria reinforcement
   */
  getStepTransitions(): StepTransitions {
    return {
      transitions: {
        introduction: "Great! Let's begin.",
        goal: "Excellent! You've got a clear goal and success criteria. Now let's explore your current reality.",
        reality: "Great work exploring the situation. Now let's brainstorm your options that will help you achieve your success criteria.",
        options: "You've identified some solid options aligned with your success criteria. Let's now turn one into action.",
        will: "Perfect! You've committed to specific actions that contribute to your success criteria. Let's review everything together.",
      },
      openers: {
        goal: "What goal or challenge would you like to work on today?",
        reality: "We clarified your goal and success criteria. Now let's map the current reality — facts, constraints, resources and risks — so your options are grounded and aligned with your success criteria. After this we'll explore options together. What's the current situation you're facing?",
        options: "With your reality on the table, let's generate possibilities that directly contribute to your success criteria. First share one option, then we'll explore pros and cons. When you're ready we'll commit to action in Will. What's one option you're considering for achieving your success criteria?",
        will: "You've considered options aligned with your success criteria. Now let's commit to action: choose the approach and define specific steps with owner and timeline that will help you achieve your success criteria. Next we'll review takeaways. Which option feels right for you for achieving your success criteria?",
        review: "Time to consolidate. Summarise key takeaways and your next immediate step; I'll add concise insights to close the session. What stands out most for you in terms of achieving your success criteria?",
      }
    };
  }
}

// Export singleton instance
export const growCoach = new GROWCoach();

