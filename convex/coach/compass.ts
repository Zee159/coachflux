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
      // NEW COMPASS (4-stage) - Confidence-Optimized
      return {
        // Note: initial_action_clarity is OPTIONAL (only asked if initial_confidence >= 8)
        introduction: ["initial_confidence", "initial_mindset_state"],
        clarity: ["change_description", "sphere_of_control"],
        // Note: initial_confidence is from introduction, not captured again in ownership
        ownership: ["current_confidence", "personal_benefit"],
        mapping: ["committed_action", "action_day", "action_time"],
        practice: [
          "action_commitment_confidence",
          "final_confidence",
          "final_action_clarity",
          "final_mindset_state",
          "user_satisfaction",
          "key_takeaway"
        ],
      };
    } else {
      // ⚠️ DEPRECATED: LEGACY COMPASS (6-stage) - Kept for backward compatibility only
      // DO NOT USE: This model has been replaced by the confidence-optimized 4-stage model
      // See COMPASS_REFACTOR_COMPLETE.md for migration guide
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
    reflections: Array<{ step: string; payload: ReflectionPayload }>,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    if (this.useNewCompass) {
      return this.checkNewCOMPASSCompletion(stepName, payload, reflections, skipCount, loopDetected);
    } else {
      return this.checkLegacyCOMPASSCompletion(stepName, payload, skipCount, loopDetected);
    }
  }

  /**
   * NEW COMPASS (4-stage) completion logic - Confidence-Optimized
   */
  private checkNewCOMPASSCompletion(
    stepName: string,
    payload: ReflectionPayload,
    reflections: Array<{ step: string; payload: ReflectionPayload }>,
    _skipCount: number,
    _loopDetected: boolean
  ): StepCompletionResult {
    if (stepName === "introduction") {
      // Requires CSS baseline measurements
      const hasInitialConfidence = typeof payload["initial_confidence"] === "number" && payload["initial_confidence"] >= 1 && payload["initial_confidence"] <= 10;
      const hasInitialActionClarity = typeof payload["initial_action_clarity"] === "number" && payload["initial_action_clarity"] >= 1 && payload["initial_action_clarity"] <= 10;
      const hasInitialMindsetState = typeof payload["initial_mindset_state"] === "string" && payload["initial_mindset_state"].length > 0;

      const completedFields = [hasInitialConfidence, hasInitialActionClarity, hasInitialMindsetState].filter(Boolean).length;
      return { shouldAdvance: completedFields >= 2 }; // At least 2 out of 3 CSS baseline fields
    } else if (stepName === "clarity") {
      // Requires change_description and sphere_of_control
      const hasChangeDescription = typeof payload["change_description"] === "string" && payload["change_description"].length > 0;
      const hasSphereOfControl = typeof payload["sphere_of_control"] === "string" && payload["sphere_of_control"].length > 0;

      return { shouldAdvance: hasChangeDescription && hasSphereOfControl };
    } else if (stepName === "ownership") {
      // High-confidence branching: requires fewer fields if initial_confidence >= 8
      // Get initial_confidence from introduction step (not current payload)
      const introReflections = reflections.filter(r => r.step === 'introduction');
      const latestIntro = introReflections[introReflections.length - 1];
      const initialConfidence = latestIntro?.payload?.['initial_confidence'] as number | undefined;
      const isHighConfidence = typeof initialConfidence === "number" && initialConfidence >= 8;

      const hasCurrentConfidence = typeof payload["current_confidence"] === "number" && payload["current_confidence"] >= 1 && payload["current_confidence"] <= 10;
      const hasPersonalBenefit = typeof payload["personal_benefit"] === "string" && payload["personal_benefit"].length > 0;
      const hasPastSuccess = typeof payload["past_success"] === "object" && payload["past_success"] !== null;

      if (isHighConfidence) {
        // High-confidence path: 3 questions (confidence_source, personal_benefit, past_success)
        const hasConfidenceSource = typeof payload["confidence_source"] === "string" && payload["confidence_source"].length > 0;
        const completedFields = [hasConfidenceSource, hasPersonalBenefit, hasPastSuccess].filter(Boolean).length;
        return { shouldAdvance: completedFields >= 2 }; // At least 2 out of 3 fields
      } else {
        // Standard path: 7 questions (requires current_confidence, personal_benefit, and past_success)
        const completedFields = [hasCurrentConfidence, hasPersonalBenefit, hasPastSuccess].filter(Boolean).length;
        return { shouldAdvance: completedFields >= 2 }; // At least 2 out of 3 core fields
      }
    } else if (stepName === "mapping") {
      // Requires committed_action, action_day, action_time
      const hasCommittedAction = typeof payload["committed_action"] === "string" && payload["committed_action"].length > 0;
      const hasActionDay = typeof payload["action_day"] === "string" && payload["action_day"].length > 0;
      const hasActionTime = typeof payload["action_time"] === "string" && payload["action_time"].length > 0;

      const completedFields = [hasCommittedAction, hasActionDay, hasActionTime].filter(Boolean).length;
      return { shouldAdvance: completedFields >= 2 }; // At least 2 out of 3 fields
    } else if (stepName === "practice") {
      // Requires CSS final measurements (5 mandatory fields)
      const hasActionCommitmentConfidence = typeof payload["action_commitment_confidence"] === "number" && payload["action_commitment_confidence"] >= 1 && payload["action_commitment_confidence"] <= 10;
      const hasFinalConfidence = typeof payload["final_confidence"] === "number" && payload["final_confidence"] >= 1 && payload["final_confidence"] <= 10;
      const hasFinalActionClarity = typeof payload["final_action_clarity"] === "number" && payload["final_action_clarity"] >= 1 && payload["final_action_clarity"] <= 10;
      const hasFinalMindsetState = typeof payload["final_mindset_state"] === "string" && payload["final_mindset_state"].length > 0;
      const hasUserSatisfaction = typeof payload["user_satisfaction"] === "number" && payload["user_satisfaction"] >= 1 && payload["user_satisfaction"] <= 10;
      const hasKeyTakeaway = typeof payload["key_takeaway"] === "string" && payload["key_takeaway"].length > 0;

      const completedFields = [
        hasActionCommitmentConfidence,
        hasFinalConfidence,
        hasFinalActionClarity,
        hasFinalMindsetState,
        hasUserSatisfaction,
        hasKeyTakeaway
      ].filter(Boolean).length;

      // Require at least 4 out of 6 CSS final fields (strict for session completion)
      return { shouldAdvance: completedFields >= 4 };
    } else if (stepName === "review") {
      // Review never auto-advances
      return { shouldAdvance: false };
    }

    // Default: advance if coach_reflection exists
    const hasCoachReflection = typeof payload["coach_reflection"] === "string" && payload["coach_reflection"].length > 0;
    return { shouldAdvance: hasCoachReflection };
  }

  /**
   * ⚠️ DEPRECATED: LEGACY COMPASS (6-stage) completion logic
   * Kept for backward compatibility only - DO NOT USE for new sessions
   * See COMPASS_REFACTOR_COMPLETE.md for the new 4-stage model
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
      // NEW COMPASS (4-stage) transitions - Confidence-Optimized
      return {
        transitions: {
          introduction: "Thank you. Let's start by getting clear on what's actually happening...",
          clarity: "Great! You've clarified the change and identified what you can control. Now let's build your confidence.",
          ownership: "Excellent! Your confidence has grown. Now let's map out your specific action plan.",
          mapping: "Perfect! You've got a clear plan. Now let's lock in your commitment and measure your transformation.",
          practice: "Well done! You're ready to take action. Your session is complete.",
        },
        openers: {
          clarity: "Let's get super clear on what's actually changing. In your day-to-day work, what will be different?",
          ownership: "You're at [X]/10 confidence. Let's explore what's driving that and build it higher.",
          mapping: "With your confidence built, let's map out your specific action plan. What's the ONE action you want to commit to?",
          practice: "You've got your action plan. Now let's lock in your commitment and see how far you've come.",
          review: "Time to consolidate. Let's review your key takeaways and next actions.",
        }
      };
    } else {
      // ⚠️ DEPRECATED: LEGACY COMPASS (6-stage) transitions - DO NOT USE
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
   * Generate COMPASS-specific AI context (suggestions, nudges, branching logic)
   */
  generateAIContext(
    stepName: string,
    reflections: Array<{ step: string; payload: ReflectionPayload }>,
    userInput: string
  ): string {
    let context = '';

    // Add high-confidence branching logic for ownership stage
    if (this.useNewCompass && stepName === 'ownership') {
      const introReflections = reflections.filter(r => r.step === 'introduction');
      const latestIntro = introReflections[introReflections.length - 1];
      const initialConfidence = latestIntro?.payload?.['initial_confidence'] as number | undefined;

      if (typeof initialConfidence === 'number') {
        if (initialConfidence >= 8) {
          context += `\n\n🔀 HIGH-CONFIDENCE PATH ACTIVATED (initial_confidence: ${initialConfidence}/10)\n`;
          context += `Use shortened Ownership flow (3 questions):\n`;
          context += `1. Confidence Source: "You're at ${initialConfidence}/10 - that's strong! What's giving you that confidence?"\n`;
          context += `2. Personal Benefit: "What could you gain personally if you adapt well to this change?"\n`;
          context += `3. Past Success: "Tell me about a time you successfully handled change before."\n`;
          context += `Then fast-track to MAPPING stage.\n`;
        } else {
          context += `\n\n⚡ STANDARD PATH (initial_confidence: ${initialConfidence}/10)\n`;
          context += `Use full Ownership flow (7 questions) to build confidence from ${initialConfidence}/10 to 6-7/10.\n`;
          context += `Focus on fear exploration, reframing, and past success activation.\n`;
        }
      }
    }

    // Add CSS measurement triggers for practice stage
    if (this.useNewCompass && stepName === 'practice') {
      // Get initial_confidence from introduction for comparison
      const introReflections = reflections.filter(r => r.step === 'introduction');
      const latestIntro = introReflections[introReflections.length - 1];
      const initialConfidence = latestIntro?.payload?.['initial_confidence'] as number | undefined;
      const initialValue = typeof initialConfidence === 'number' ? initialConfidence : '[initial]';
      
      context += `\n\n📊 CSS FINAL MEASUREMENTS REQUIRED\n`;
      context += `Initial confidence from introduction: ${initialValue}/10\n\n`;
      context += `You MUST ask these 5 questions before closing the session:\n`;
      context += `1. final_confidence (1-10): "When we started, you were at ${initialValue}/10. Where are you now?"\n`;
      context += `2. final_action_clarity (1-10): "How clear are you now on your specific next steps?"\n`;
      context += `3. final_mindset_state: "How would you describe your mindset now? (resistant/neutral/open/engaged)"\n`;
      context += `4. user_satisfaction (1-10): "How helpful was this session for you?"\n`;
      context += `5. key_takeaway: "What's the ONE thing you're taking away from our conversation?"\n`;
      context += `\nCelebrate the transformation: Calculate confidence increase (${initialValue} → final) and acknowledge their progress.\n`;
    }

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
export const compassCoach = new COMPASSCoach(true); // ✅ NEW COMPASS (4-stage confidence-optimized)
export const compassLegacyCoach = new COMPASSCoach(false); // ⚠️ DEPRECATED: Legacy COMPASS (6-stage) - DO NOT USE

