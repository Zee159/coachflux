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
      will: ["chosen_options", "actions"], // Support 1-3 chosen options with streamlined actions
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
   * Simple validation matching GOAL/REALITY pattern
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

    // Count explored options (have pros AND cons)
    const exploredOptions = options.filter((opt: unknown) => {
      const option = opt as { pros?: unknown[]; cons?: unknown[] };
      return Array.isArray(option.pros) && option.pros.length > 0 &&
             Array.isArray(option.cons) && option.cons.length > 0;
    });

    const hasExploredOptions = exploredOptions.length >= 1;
    const hasMultipleOptions = options.length >= 2;

    // Progressive relaxation based on skip count and loop detection
    if (loopDetected) {
      // System stuck: 1 explored option is enough
      return { shouldAdvance: hasExploredOptions };
    } else if (skipCount >= 2) {
      // User exhausted skips: 1 explored option is enough
      return { shouldAdvance: hasExploredOptions };
    } else if (skipCount === 1) {
      // User used one skip: still need 2 options
      return { shouldAdvance: hasMultipleOptions && hasExploredOptions };
    } else {
      // DEFAULT (no skips): Need 2+ options with 1+ explored
      return { shouldAdvance: hasMultipleOptions && hasExploredOptions };
    }
  }

  /**
   * Will step completion logic
   * STREAMLINED: Supports 1-3 chosen options with simplified action requirements
   * NEW: Requires accountability_mechanism for each action
   */
  private checkWillCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    const chosenOptions = payload["chosen_options"];
    const actions = payload["actions"];

    // Must have at least 1 chosen option and matching actions
    if (!Array.isArray(chosenOptions) || chosenOptions.length === 0) {
      return { shouldAdvance: false };
    }

    if (!Array.isArray(actions) || actions.length === 0) {
      return { shouldAdvance: false };
    }

    // Check for REQUIRED fields (streamlined: title, owner, due_days, support_needed, accountability_mechanism)
    const completeActions = actions.filter((a: unknown) => {
      const action = a as { 
        title?: string; 
        owner?: string; 
        due_days?: number;
        support_needed?: string;
        accountability_mechanism?: string;
      };
      
      const hasTitle = typeof action.title === "string" && action.title.length > 0;
      const hasOwner = typeof action.owner === "string" && action.owner.length > 0;
      const hasDueDate = typeof action.due_days === "number" && action.due_days > 0;
      const hasSupport = typeof action.support_needed === "string" && action.support_needed.length > 0;
      const hasAccountability = typeof action.accountability_mechanism === "string" && action.accountability_mechanism.length > 0;

      return hasTitle && hasOwner && hasDueDate && hasSupport && hasAccountability;
    });

    // Progressive relaxation based on skip count and loop detection
    if (loopDetected) {
      // System stuck: Just need 1 action with basic fields (title + owner + due_days)
      const basicActions = actions.filter((a: unknown) => {
        const action = a as { title?: string; owner?: string; due_days?: number };
        return typeof action.title === "string" && action.title.length > 0 &&
               typeof action.owner === "string" && action.owner.length > 0 &&
               typeof action.due_days === "number" && action.due_days > 0;
      });
      return { shouldAdvance: basicActions.length >= 1 };
    } else if (skipCount >= 2) {
      // User exhausted skips: Need 1 action with basic fields
      const basicActions = actions.filter((a: unknown) => {
        const action = a as { title?: string; owner?: string; due_days?: number };
        return typeof action.title === "string" && action.title.length > 0 &&
               typeof action.owner === "string" && action.owner.length > 0 &&
               typeof action.due_days === "number" && action.due_days > 0;
      });
      return { shouldAdvance: basicActions.length >= 1 };
    } else if (skipCount === 1) {
      // User used one skip: Need actions matching number of chosen options (without support/accountability)
      const basicActions = actions.filter((a: unknown) => {
        const action = a as { title?: string; owner?: string; due_days?: number };
        return typeof action.title === "string" && action.title.length > 0 &&
               typeof action.owner === "string" && action.owner.length > 0 &&
               typeof action.due_days === "number" && action.due_days > 0;
      });
      return { shouldAdvance: basicActions.length >= chosenOptions.length };
    } else {
      // DEFAULT (no skips): Need complete actions matching number of chosen options
      // Each action must have: title, owner, due_days, support_needed, accountability_mechanism
      return { 
        shouldAdvance: completeActions.length >= chosenOptions.length
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

