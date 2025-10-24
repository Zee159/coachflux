/**
 * COMPASS Framework Coach
 * Handles COMPASS-specific coaching logic, completion criteria, AI suggestions, and nudges
 */

import type { FrameworkCoach, StepCompletionResult, StepTransitions } from "./types";
import type { ReflectionPayload, NudgeType } from "../types";
import { detectApplicableNudges, generateNudgePrompt } from "../nudges";

export class COMPASSCoach implements FrameworkCoach {
  constructor(private useNewCompass: boolean = true) {}

  /**
   * Required fields for each COMPASS step (for agent state tracking)
   */
  getRequiredFields(): Record<string, string[]> {
    if (this.useNewCompass) {
      // NEW COMPASS (4-stage)
      return {
        clarity: ["change_description"],
        ownership: ["initial_confidence", "current_confidence", "personal_benefit"],
        mapping: ["committed_action", "action_day", "action_time"],
        practice: ["action_commitment_confidence", "final_confidence", "key_takeaway"],
      };
    } else {
      // LEGACY COMPASS (6-stage)
      return {
        clarity: ["change_description", "why_it_matters", "supporters", "resistors"],
        ownership: ["personal_feelings", "personal_benefits", "personal_risks", "values_alignment"],
        mapping: ["actions", "potential_obstacles", "mapping_score"],
        anchoring: ["environmental_barriers", "environmental_changes", "habits_to_build", "accountability_plan"],
        sustaining: ["leadership_visibility", "metrics_tracking", "team_support_plan", "celebration_plan"],
        practice: ["actions_taken", "what_worked", "what_was_hard", "lessons_learned"],
      };
    }
  }

  /**
   * Check if a COMPASS step is complete
   */
  checkStepCompletion(
    stepName: string,
    payload: ReflectionPayload,
    _reflections: Array<{ step: string; payload: ReflectionPayload }>,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    if (this.useNewCompass) {
      return this.checkNewCOMPASSCompletion(stepName, payload, skipCount, loopDetected);
    } else {
      return this.checkLegacyCOMPASSCompletion(stepName, payload, skipCount, loopDetected);
    }
  }

  /**
   * NEW COMPASS (4-stage) completion logic
   */
  private checkNewCOMPASSCompletion(
    stepName: string,
    payload: ReflectionPayload,
    _skipCount: number,
    _loopDetected: boolean
  ): StepCompletionResult {
    if (stepName === "clarity") {
      // Only requires change_description
      const hasChangeDescription = typeof payload["change_description"] === "string" && payload["change_description"].length > 0;
      return { shouldAdvance: hasChangeDescription };
    } else if (stepName === "ownership") {
      // Requires initial_confidence, current_confidence, personal_benefit
      const hasInitialConfidence = typeof payload["initial_confidence"] === "number" && payload["initial_confidence"] >= 1 && payload["initial_confidence"] <= 5;
      const hasCurrentConfidence = typeof payload["current_confidence"] === "number" && payload["current_confidence"] >= 1 && payload["current_confidence"] <= 5;
      const hasPersonalBenefit = typeof payload["personal_benefit"] === "string" && payload["personal_benefit"].length > 0;

      const completedFields = [hasInitialConfidence, hasCurrentConfidence, hasPersonalBenefit].filter(Boolean).length;
      return { shouldAdvance: completedFields >= 2 }; // At least 2 out of 3 fields
    } else if (stepName === "mapping") {
      // Requires committed_action, action_day, action_time
      const hasCommittedAction = typeof payload["committed_action"] === "string" && payload["committed_action"].length > 0;
      const hasActionDay = typeof payload["action_day"] === "string" && payload["action_day"].length > 0;
      const hasActionTime = typeof payload["action_time"] === "string" && payload["action_time"].length > 0;

      const completedFields = [hasCommittedAction, hasActionDay, hasActionTime].filter(Boolean).length;
      return { shouldAdvance: completedFields >= 2 }; // At least 2 out of 3 fields
    } else if (stepName === "practice") {
      // Requires action_commitment_confidence, final_confidence, key_takeaway
      const hasActionCommitmentConfidence = typeof payload["action_commitment_confidence"] === "number" && payload["action_commitment_confidence"] >= 1 && payload["action_commitment_confidence"] <= 5;
      const hasFinalConfidence = typeof payload["final_confidence"] === "number" && payload["final_confidence"] >= 1 && payload["final_confidence"] <= 5;
      const hasKeyTakeaway = typeof payload["key_takeaway"] === "string" && payload["key_takeaway"].length > 0;

      const completedFields = [hasActionCommitmentConfidence, hasFinalConfidence, hasKeyTakeaway].filter(Boolean).length;
      return { shouldAdvance: completedFields >= 2 }; // At least 2 out of 3 fields
    } else if (stepName === "review") {
      // Review never auto-advances
      return { shouldAdvance: false };
    }

    // Default: advance if coach_reflection exists
    const hasCoachReflection = typeof payload["coach_reflection"] === "string" && payload["coach_reflection"].length > 0;
    return { shouldAdvance: hasCoachReflection };
  }

  /**
   * LEGACY COMPASS (6-stage) completion logic
   */
  private checkLegacyCOMPASSCompletion(
    stepName: string,
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    if (stepName === "clarity") {
      const hasChangeDescription = typeof payload["change_description"] === "string" && payload["change_description"].length > 0;
      const hasWhyItMatters = typeof payload["why_it_matters"] === "string" && payload["why_it_matters"].length > 0;
      const hasSupporters = Array.isArray(payload["supporters"]) && payload["supporters"].length > 0;
      const hasResistors = Array.isArray(payload["resistors"]) && payload["resistors"].length > 0;

      const completedFields = [hasChangeDescription, hasWhyItMatters, hasSupporters, hasResistors].filter(Boolean).length;

      let requiredFields = 4;
      if (loopDetected) {
        requiredFields = 2;
      } else if (skipCount >= 2) {
        requiredFields = 2;
      } else if (skipCount === 1) {
        requiredFields = 3;
      }

      const minGuardsMet = hasWhyItMatters && (hasSupporters || hasResistors);
      return { shouldAdvance: (completedFields >= requiredFields) && minGuardsMet };
    } else if (stepName === "ownership") {
      const hasPersonalFeelings = typeof payload["personal_feelings"] === "string" && payload["personal_feelings"].length > 0;
      const hasPersonalBenefits = Array.isArray(payload["personal_benefits"]) && payload["personal_benefits"].length > 0;
      const hasPersonalRisks = Array.isArray(payload["personal_risks"]) && payload["personal_risks"].length > 0;
      const hasValuesAlignment = typeof payload["values_alignment"] === "string" && payload["values_alignment"].length > 0;

      const completedFields = [hasPersonalFeelings, hasPersonalBenefits, hasPersonalRisks, hasValuesAlignment].filter(Boolean).length;

      let requiredFields = 4;
      if (loopDetected) {
        requiredFields = 2;
      } else if (skipCount >= 2) {
        requiredFields = 2;
      } else if (skipCount === 1) {
        requiredFields = 3;
      }

      return { shouldAdvance: completedFields >= requiredFields };
    } else if (stepName === "mapping") {
      const actions = payload["actions"];
      const hasActions = Array.isArray(actions) && actions.length > 0;
      const hasObstacles = Array.isArray(payload["potential_obstacles"]) && payload["potential_obstacles"].length > 0;
      const hasMappingScore = typeof payload["mapping_score"] === "number" && payload["mapping_score"] >= 1 && payload["mapping_score"] <= 5;

      const completedFields = [hasActions, hasObstacles, hasMappingScore].filter(Boolean).length;

      let requiredFields = 3;
      if (loopDetected) {
        requiredFields = 2;
      } else if (skipCount >= 2) {
        requiredFields = 1;
      } else if (skipCount === 1) {
        requiredFields = 2;
      }

      return { shouldAdvance: completedFields >= requiredFields };
    } else if (stepName === "anchoring") {
      const hasEnvBarriers = Array.isArray(payload["environmental_barriers"]) && payload["environmental_barriers"].length > 0;
      const hasEnvChanges = Array.isArray(payload["environmental_changes"]) && payload["environmental_changes"].length > 0;
      const hasHabits = Array.isArray(payload["habits_to_build"]) && payload["habits_to_build"].length > 0;
      const hasAccountability = typeof payload["accountability_plan"] === "string" && payload["accountability_plan"].length > 0;

      const completedFields = [hasEnvBarriers, hasEnvChanges, hasHabits, hasAccountability].filter(Boolean).length;

      let requiredFields = 4;
      if (loopDetected) {
        requiredFields = 2;
      } else if (skipCount >= 2) {
        requiredFields = 2;
      } else if (skipCount === 1) {
        requiredFields = 3;
      }

      return { shouldAdvance: completedFields >= requiredFields };
    } else if (stepName === "sustaining") {
      const hasLeadership = typeof payload["leadership_visibility"] === "string" && payload["leadership_visibility"].length > 0;
      const hasMetrics = Array.isArray(payload["metrics_tracking"]) && payload["metrics_tracking"].length > 0;
      const hasTeamSupport = typeof payload["team_support_plan"] === "string" && payload["team_support_plan"].length > 0;
      const hasCelebration = typeof payload["celebration_plan"] === "string" && payload["celebration_plan"].length > 0;

      const completedFields = [hasLeadership, hasMetrics, hasTeamSupport, hasCelebration].filter(Boolean).length;

      let requiredFields = 4;
      if (loopDetected) {
        requiredFields = 2;
      } else if (skipCount >= 2) {
        requiredFields = 2;
      } else if (skipCount === 1) {
        requiredFields = 3;
      }

      return { shouldAdvance: completedFields >= requiredFields };
    } else if (stepName === "practice") {
      const hasActionsTaken = Array.isArray(payload["actions_taken"]) && payload["actions_taken"].length > 0;
      const hasWhatWorked = Array.isArray(payload["what_worked"]) && payload["what_worked"].length > 0;
      const hasWhatWasHard = Array.isArray(payload["what_was_hard"]) && payload["what_was_hard"].length > 0;
      const hasLessonsLearned = typeof payload["lessons_learned"] === "string" && payload["lessons_learned"].length > 0;

      const completedFields = [hasActionsTaken, hasWhatWorked, hasWhatWasHard, hasLessonsLearned].filter(Boolean).length;

      let requiredFields = 4;
      if (loopDetected) {
        requiredFields = 2;
      } else if (skipCount >= 2) {
        requiredFields = 2;
      } else if (skipCount === 1) {
        requiredFields = 3;
      }

      return { shouldAdvance: completedFields >= requiredFields };
    }

    // Default: advance if coach_reflection exists
    const hasCoachReflection = typeof payload["coach_reflection"] === "string" && payload["coach_reflection"].length > 0;
    return { shouldAdvance: hasCoachReflection };
  }

  /**
   * Get COMPASS step transitions and openers
   */
  getStepTransitions(): StepTransitions {
    if (this.useNewCompass) {
      // NEW COMPASS (4-stage) transitions
      return {
        transitions: {
          clarity: "Great! You've clarified the change. Now let's explore your personal connection and build confidence.",
          ownership: "Excellent! You've built personal commitment. Now let's map out your specific action plan.",
          mapping: "Perfect! You've got a clear plan. Now let's practice and commit to your first step.",
          practice: "Well done! You're ready to take action. Let's review everything together.",
        },
        openers: {
          ownership: "We clarified the change. Now let's explore your personal connection — how confident do you feel about this change, and what personal benefits do you see? This builds the foundation for your action plan.",
          mapping: "With your personal connection established, let's map out your specific action plan. What's the ONE specific action you want to commit to, and when will you do it?",
          practice: "You've got your action plan. Now let's practice and commit — how confident are you about taking this action, and what's your key takeaway from our session?",
          review: "Time to consolidate. Let's review your key takeaways and next actions.",
        }
      };
    } else {
      // LEGACY COMPASS (6-stage) transitions
      return {
        transitions: {
          clarity: "Excellent! You've clarified the change. Now let's explore your personal ownership.",
          ownership: "Great! You've built personal ownership. Now let's map out your action plan.",
          mapping: "Perfect! You've got a clear plan. Now let's anchor the new behavior.",
          anchoring: "Fantastic! You've got what you need to make this work. Let's review everything together.",
          practice: "Well done! You've practiced the new behavior. Let's review everything together.",
        },
        openers: {
          ownership: "We clarified the change. Now let's explore your personal connection — how does this change feel to you personally?",
          mapping: "With your personal ownership established, let's map out your action plan. What specific actions will you take?",
          anchoring: "Let's make it stick — one environmental change and one way to lead by example. Then we'll review everything together. What's the ONE thing in your environment that makes the old way easier?",
          practice: "You've anchored the behavior. Now let's explore what you've learned through practice.",
          review: "Time to consolidate. Let's review your key takeaways and next actions.",
        }
      };
    }
  }

  /**
   * Generate COMPASS-specific AI context (suggestions, nudges)
   */
  generateAIContext(
    stepName: string,
    reflections: Array<{ step: string; payload: ReflectionPayload }>,
    userInput: string
  ): string {
    let context = '';

    // Generate AI suggestions if applicable
    const suggestionContext = this.generateAISuggestions(stepName, reflections);
    if (suggestionContext !== null) {
      context += suggestionContext;
    }

    // Detect and add nudges if applicable
    if (this.useNewCompass) {
      const applicableNudges = detectApplicableNudges(userInput, stepName as 'clarity' | 'ownership' | 'mapping' | 'practice');
      if (applicableNudges.length > 0) {
        const nudge = applicableNudges[0];
        if (nudge !== undefined) {
          const nudgeTypes: NudgeType[] = applicableNudges.map(n => n.type);
          const nudgePrompt = generateNudgePrompt(stepName as 'clarity' | 'ownership' | 'mapping' | 'practice', nudgeTypes);
          context += `\n\n🎯 NUDGE ACTIVATED: ${nudge.name}\n${nudgePrompt}\n\nUse this nudge naturally in your response to help the user progress.`;
        }
      }
    }

    return context;
  }

  /**
   * Generate AI suggestions for COMPASS framework based on context
   */
  private generateAISuggestions(
    stepName: string,
    reflections: Array<{ step: string; payload: ReflectionPayload }>
  ): string | null {
    // Extract context from earlier phases
    const clarityReflections = reflections.filter(r => r.step === 'clarity');
    const ownershipReflections = reflections.filter(r => r.step === 'ownership');
    const mappingReflections = reflections.filter(r => r.step === 'mapping');
    const practiceReflections = reflections.filter(r => r.step === 'practice');

    const latestClarity = clarityReflections[clarityReflections.length - 1];
    const latestOwnership = ownershipReflections[ownershipReflections.length - 1];
    const latestMapping = mappingReflections[mappingReflections.length - 1];
    const latestPractice = practiceReflections[practiceReflections.length - 1];

    // Extract key context fields
    const changeDescription = latestClarity?.payload?.['change_description'] as string | undefined;
    const whyItMatters = latestClarity?.payload?.['why_it_matters'] as string | undefined;
    const personalBenefits = latestOwnership?.payload?.['personal_benefits'] as string[] | undefined;
    const actions = latestMapping?.payload?.['actions'] as Array<{ action: string }> | undefined;
    const whatWorked = latestPractice?.payload?.['what_worked'] as string[] | undefined;
    const whatWasHard = latestPractice?.payload?.['what_was_hard'] as string[] | undefined;

    // Build context string
    const contextParts: string[] = [];
    if (changeDescription !== undefined && changeDescription !== null && changeDescription.length > 0) {
      contextParts.push(`Change: ${changeDescription}`);
    }
    if (whyItMatters !== undefined && whyItMatters !== null && whyItMatters.length > 0) {
      contextParts.push(`Why it matters: ${whyItMatters}`);
    }
    if (personalBenefits !== undefined && personalBenefits !== null && personalBenefits.length > 0) {
      contextParts.push(`Personal benefits: ${personalBenefits.join(', ')}`);
    }
    if (actions !== undefined && actions !== null && actions.length > 0) {
      const actionList = actions.map(a => a.action).join(', ');
      contextParts.push(`Actions planned: ${actionList}`);
    }
    if (whatWorked !== undefined && whatWorked !== null && whatWorked.length > 0) {
      contextParts.push(`What worked: ${whatWorked.join(', ')}`);
    }
    if (whatWasHard !== undefined && whatWasHard !== null && whatWasHard.length > 0) {
      contextParts.push(`What was hard: ${whatWasHard.join(', ')}`);
    }

    const context = contextParts.join(' | ');

    // Generate suggestions based on step
    if (stepName === 'mapping') {
      return `Context for AI suggestions: ${context}\n\nSuggest 2-3 specific actions based on their change situation. Include timeline and resources needed for each. Focus on stakeholder communication, change champions, and feedback mechanisms that align with their change description.`;
    }

    if (stepName === 'anchoring') {
      return `Context for AI suggestions: ${context}\n\nSuggest 2-3 environmental design strategies based on change psychology. Include environmental changes, habit stacking techniques, cues/reminders, and accountability mechanisms that align with their actions and learnings.`;
    }

    if (stepName === 'sustaining') {
      return `Context for AI suggestions: ${context}\n\nSuggest 2-3 leadership visibility strategies. Include specific metrics to track (leading and lagging indicators), team support mechanisms, and celebration plans that align with their change leadership role.`;
    }

    if (stepName === 'ownership') {
      return `Context for AI suggestions: ${context}\n\nOffer 2-3 benefit perspectives (as questions, not statements) from categories: career development, skills building, relationship strengthening, values alignment, or personal growth. Frame as "Some leaders have found..." and ask if any resonate. Be careful not to prescribe - offer perspectives for them to validate.`;
    }

    return null;
  }
}

// Export singleton instances
export const compassCoach = new COMPASSCoach(true); // New COMPASS (4-stage)
export const compassLegacyCoach = new COMPASSCoach(false); // Legacy COMPASS (6-stage)

