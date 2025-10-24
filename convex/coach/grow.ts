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
      options: ["options"], // Each option should have successCriteriaContribution
      will: ["chosen_option", "actions"], // Each action should contribute to success criteria
      review: ["key_takeaways", "immediate_step"],
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
   * UPDATED: Requires 3 options (up from 2) and 2 explored (up from 1) for better decision quality
   * ENHANCED: Validates success criteria alignment for AI-generated options
   */
  private checkOptionsCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    const options = payload["options"];

    if (!Array.isArray(options) || options.length === 0) {
      return { shouldAdvance: false };
    }

    const exploredOptions = options.filter((opt: unknown) => {
      const option = opt as { label?: string; pros?: unknown[]; cons?: unknown[] };
      return Array.isArray(option.pros) && option.pros.length > 0 &&
             Array.isArray(option.cons) && option.cons.length > 0;
    });

    // NEW: Check for success criteria alignment in AI-generated options
    const successCriteriaAlignedOptions = options.filter((opt: unknown) => {
      const option = opt as { 
        label?: string; 
        pros?: unknown[]; 
        cons?: unknown[]; 
        successCriteriaContribution?: string;
        alignmentReason?: string;
      };
      
      // For AI-generated options, check if they have success criteria contribution
      const hasSuccessCriteriaContribution = 
        typeof option.successCriteriaContribution === "string" && 
        option.successCriteriaContribution.length > 0;
      
      // For user-provided options, check if they have alignment reason
      const hasAlignmentReason = 
        typeof option.alignmentReason === "string" && 
        option.alignmentReason.length > 0;
      
      return hasSuccessCriteriaContribution || hasAlignmentReason;
    });

    // Progressive relaxation based on skip count and loop detection
    if (loopDetected) {
      // System stuck: require 2 options, 1 explored
      return { shouldAdvance: options.length >= 2 && exploredOptions.length >= 1 };
    } else if (skipCount >= 2) {
      // User exhausted skips: require 2 options (exploration optional)
      return { shouldAdvance: options.length >= 2 }; 
    } else if (skipCount === 1) {
      // User used one skip: require 3 options (exploration optional)
      return { shouldAdvance: options.length >= 3 }; 
    } else {
      // DEFAULT (no skips): Require 3+ options with 2+ explored for quality decision-making
      // ENHANCED: Also require at least 1 option with success criteria alignment
      const hasMinimumOptions = options.length >= 3;
      const hasExploredOptions = exploredOptions.length >= 2;
      const hasSuccessCriteriaAlignment = successCriteriaAlignedOptions.length >= 1;
      
      return { 
        shouldAdvance: hasMinimumOptions && hasExploredOptions && hasSuccessCriteriaAlignment 
      };
    }
  }

  /**
   * Will step completion logic
   * UPDATED: Now checks for enhanced action fields for better action quality
   * ENHANCED: Validates that actions contribute to success criteria achievement
   */
  private checkWillCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    const hasChosenOption = typeof payload["chosen_option"] === "string" && payload["chosen_option"].length > 0;
    const actions = payload["actions"];

    if (!hasChosenOption || !Array.isArray(actions) || actions.length === 0) {
      return { shouldAdvance: false };
    }

    // Check for CORE fields (required)
    const coreCompleteActions = actions.filter((a: unknown) => {
      const action = a as { title?: string; owner?: string; due_days?: number };
      const hasTitle = typeof action.title === "string" && action.title.length > 0;
      const hasOwner = typeof action.owner === "string" && action.owner.length > 0;
      const hasDueDate = typeof action.due_days === "number" && action.due_days > 0;
      const isOngoing = action.due_days === undefined; // Ongoing commitment

      return hasTitle && hasOwner && (hasDueDate || isOngoing);
    });

    // Check for ENHANCED fields (for quality actions)
    const enhancedCompleteActions = actions.filter((a: unknown) => {
      const action = a as {
        title?: string;
        owner?: string;
        due_days?: number;
        firstStep?: string;
        specificOutcome?: string;
        accountabilityMechanism?: string;
        reviewDate?: number;
        potentialBarriers?: unknown[];
      };

      // Must have core fields
      const hasCoreFields =
        typeof action.title === "string" &&
        action.title.length > 0 &&
        typeof action.owner === "string" &&
        action.owner.length > 0 &&
        (typeof action.due_days === "number" || action.due_days === undefined);

      // Must have enhanced fields
      const hasEnhancedFields =
        typeof action.firstStep === "string" &&
        action.firstStep.length > 0 &&
        typeof action.specificOutcome === "string" &&
        action.specificOutcome.length > 0 &&
        typeof action.accountabilityMechanism === "string" &&
        action.accountabilityMechanism.length > 0 &&
        typeof action.reviewDate === "number" &&
        Array.isArray(action.potentialBarriers) &&
        action.potentialBarriers.length > 0;

      return hasCoreFields && hasEnhancedFields;
    });

    // NEW: Check for success criteria alignment in actions
    const successCriteriaAlignedActions = actions.filter((a: unknown) => {
      const action = a as {
        title?: string;
        specificOutcome?: string;
        firstStep?: string;
      };

      // Check if action title, outcome, or first step references success criteria
      const titleReferencesSuccess = 
        typeof action.title === "string" && 
        (action.title.toLowerCase().includes("success") || 
         action.title.toLowerCase().includes("goal") ||
         action.title.toLowerCase().includes("achieve"));
      
      const outcomeReferencesSuccess = 
        typeof action.specificOutcome === "string" && 
        (action.specificOutcome.toLowerCase().includes("success") || 
         action.specificOutcome.toLowerCase().includes("goal") ||
         action.specificOutcome.toLowerCase().includes("achieve"));
      
      const firstStepReferencesSuccess = 
        typeof action.firstStep === "string" && 
        (action.firstStep.toLowerCase().includes("success") || 
         action.firstStep.toLowerCase().includes("goal") ||
         action.firstStep.toLowerCase().includes("achieve"));

      return titleReferencesSuccess || outcomeReferencesSuccess || firstStepReferencesSuccess;
    });

    // Progressive relaxation based on skip count and loop detection
    if (loopDetected) {
      // System stuck: Just need 1 action with core fields
      return { shouldAdvance: coreCompleteActions.length >= 1 };
    } else if (skipCount >= 2) {
      // User exhausted skips: Just need ANY action
      return { shouldAdvance: actions.length >= 1 };
    } else if (skipCount === 1) {
      // User used one skip: Need 1 action with core fields
      return { shouldAdvance: coreCompleteActions.length >= 1 };
    } else {
      // DEFAULT (no skips): Need 2+ actions with ALL enhanced fields
      // ENHANCED: Also require at least 1 action with success criteria alignment
      const hasMinimumActions = enhancedCompleteActions.length >= 2;
      const hasSuccessCriteriaAlignment = successCriteriaAlignedActions.length >= 1;
      
      return { 
        shouldAdvance: hasMinimumActions && hasSuccessCriteriaAlignment 
      };
    }
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

