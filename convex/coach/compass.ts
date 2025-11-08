/**
 * COMPASS Framework Coach
 * Handles COMPASS-specific coaching logic, completion criteria, AI suggestions, and nudges
 */

import type { FrameworkCoach, StepCompletionResult, StepTransitions } from "./types";
import type { ReflectionPayload, NudgeType } from "../types";
import { detectApplicableNudges, generateNudgePrompt } from "../nudges";

export class COMPASSCoach implements FrameworkCoach {

  /**
   * Required fields for each COMPASS step (for agent state tracking)
   */
  getRequiredFields(): Record<string, string[]> {
    return {
      introduction: ["user_consent_given"],
      clarity: [
        "change_description",
        "personal_impact",
        "clarity_score",
        "initial_confidence",
        "initial_mindset_state",
        "control_level",
        "sphere_of_control"
      ],
      ownership: ["personal_benefit", "ownership_confidence"],
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
  }

  /**
   * Check if a COMPASS step is complete
   */
  checkStepCompletion(
    stepName: string,
    payload: ReflectionPayload,
    reflections: Array<{ step: string; payload: ReflectionPayload }>,
    _skipCount: number,
    _loopDetected: boolean
  ): StepCompletionResult {
    if (stepName === "introduction") {
      // Just requires consent
      const hasConsent = typeof payload["user_consent_given"] === "boolean" && payload["user_consent_given"] === true;
      return { shouldAdvance: hasConsent };
    } else if (stepName === "clarity") {
      // NEW SCHEMA: 7 mandatory fields + 1 optional (additional_context)
      const hasChangeDescription = typeof payload["change_description"] === "string" && payload["change_description"].length > 0;
      const hasPersonalImpact = typeof payload["personal_impact"] === "string" && payload["personal_impact"].length > 0;
      const hasClarityScore = typeof payload["clarity_score"] === "number" && payload["clarity_score"] >= 1 && payload["clarity_score"] <= 5;
      const hasInitialConfidence = typeof payload["initial_confidence"] === "number" && payload["initial_confidence"] >= 1 && payload["initial_confidence"] <= 10;
      const hasInitialMindsetState = typeof payload["initial_mindset_state"] === "string" && payload["initial_mindset_state"].length > 0;
      const controlLevel = payload["control_level"];
      const hasControlLevel = typeof controlLevel === "string" && ["high", "mixed", "low"].includes(controlLevel);
      const hasSphereOfControl = typeof payload["sphere_of_control"] === "string" && payload["sphere_of_control"].length > 15;
      
      // Check if sphere_of_control is meaningful (not just resignation)
      const sphereOfControl = payload["sphere_of_control"] as string | undefined;
      const isMeaningfulControl = typeof sphereOfControl === "string" &&
        !sphereOfControl.toLowerCase().includes("accept") &&
        !sphereOfControl.toLowerCase().includes("nothing") &&
        !sphereOfControl.toLowerCase().includes("can't control");
      
      // Count completed mandatory fields
      const completedFields = [
        hasChangeDescription,
        hasPersonalImpact,
        hasClarityScore,
        hasInitialConfidence,
        hasInitialMindsetState,
        hasControlLevel,
        hasSphereOfControl && isMeaningfulControl
      ].filter(Boolean).length;

      // Check if Q7 (optional final question) has been asked
      // Q7 is marked by either having additional_context OR having q7_asked flag
      const hasAdditionalContext = typeof payload["additional_context"] === "string" && payload["additional_context"].length > 0;
      const q7Asked = payload["q7_asked"] === true;
      const q7Handled = hasAdditionalContext || q7Asked;

      // Require all 7 mandatory fields AND Q7 must have been asked (even if skipped)
      const isComplete = completedFields === 7 && q7Handled;
      
      if (isComplete) {
        return { shouldAdvance: false, awaitingConfirmation: true };
      }
      
      return { shouldAdvance: false };
    } else if (stepName === "ownership") {
      // Get initial_confidence from CLARITY step (moved from introduction)
      const clarityReflections = reflections.filter(r => r.step === 'clarity');
      const latestClarity = clarityReflections[clarityReflections.length - 1];
      const initialConfidence = latestClarity?.payload?.['initial_confidence'] as number | undefined;
      const isHighConfidence = typeof initialConfidence === "number" && initialConfidence >= 8;

      const hasOwnershipConfidence = typeof payload["ownership_confidence"] === "number" && payload["ownership_confidence"] >= 1 && payload["ownership_confidence"] <= 10;
      const hasPersonalBenefit = typeof payload["personal_benefit"] === "string" && payload["personal_benefit"].length > 0;
      
      // Strengthen past_success validation - must have both achievement and strategy
      const pastSuccessObj = payload["past_success"] as Record<string, unknown> | null | undefined;
      const hasPastSuccess = 
        typeof pastSuccessObj === "object" && 
        pastSuccessObj !== null &&
        typeof pastSuccessObj["achievement"] === "string" && 
        pastSuccessObj["achievement"].length > 0 &&
        typeof pastSuccessObj["strategy"] === "string" && 
        pastSuccessObj["strategy"].length > 0;
      
      // Check minimum conversation count to ensure proper coaching happened
      const ownershipReflections = reflections.filter(r => r.step === 'ownership');

      if (isHighConfidence) {
        // High-confidence path: 3 questions (confidence_source, personal_benefit, past_success)
        // NO ownership_confidence needed - they're already at 8+
        const hasConfidenceSource = typeof payload["confidence_source"] === "string" && payload["confidence_source"].length > 0;
        const hasMinConversationHigh = ownershipReflections.length >= 3;
        const isComplete = hasConfidenceSource && hasPersonalBenefit && hasPastSuccess && hasMinConversationHigh;
        
        if (isComplete) {
          return { shouldAdvance: false, awaitingConfirmation: true };
        }
        return { shouldAdvance: false };
      } else {
        // Standard path: requires ownership_confidence, personal_benefit, past_success
        const hasMinConversationStandard = ownershipReflections.length >= 5;
        const isComplete = hasOwnershipConfidence && hasPersonalBenefit && hasPastSuccess && hasMinConversationStandard;
        
        if (isComplete) {
          return { shouldAdvance: false, awaitingConfirmation: true };
        }
        return { shouldAdvance: false };
      }
    } else if (stepName === "mapping") {
      // Requires committed_action, action_day, action_time, and commitment_confidence >= 7
      const hasCommittedAction = typeof payload["committed_action"] === "string" && payload["committed_action"].length > 0;
      const hasActionDay = typeof payload["action_day"] === "string" && payload["action_day"].length > 0;
      const hasActionTime = typeof payload["action_time"] === "string" && payload["action_time"].length > 0;
      const commitmentConfidence = payload["commitment_confidence"] as number | undefined;
      const hasHighCommitment = typeof commitmentConfidence === "number" && commitmentConfidence >= 7;

      // ✅ FIXED: Require ALL 3 action fields + commitment confidence 7+ for complete action plan
      const isComplete = hasCommittedAction && hasActionDay && hasActionTime && hasHighCommitment;
      
      // NEW: Instead of auto-advancing, set awaiting confirmation
      if (isComplete) {
        return { shouldAdvance: false, awaitingConfirmation: true };
      }
      
      return { shouldAdvance: false };
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
      const isComplete = completedFields >= 4;
      
      // NEW: Instead of auto-advancing, set awaiting confirmation
      if (isComplete) {
        return { shouldAdvance: false, awaitingConfirmation: true };
      }
      
      return { shouldAdvance: false };
    }

    // Default: advance if coach_reflection exists
    const hasCoachReflection = typeof payload["coach_reflection"] === "string" && payload["coach_reflection"].length > 0;
    return { shouldAdvance: hasCoachReflection };
  }

  /**
   * Get COMPASS step transitions and openers
   */
  getStepTransitions(): StepTransitions {
    return {
      transitions: {
        introduction: "Thank you. Let's start by getting clear on what's actually happening...",
        clarity: "Great! You've clarified the change and identified what you can control. Now let's build your confidence.",
        ownership: "Excellent! Your confidence has grown. Now let's map out your specific action plan.",
        mapping: "Perfect! You've got a clear plan. Now let's lock in your commitment and measure your transformation.",
        practice: "Well done! You're ready to take action. Your session is complete.",
      },
      openers: {
        clarity: "What workplace change are you navigating right now, and what's making you feel uncertain about it?",
        ownership: "Great! You've clarified the change. Now let's build your confidence and find the upside in this situation.",
        mapping: "With your confidence built, let's map out your specific action plan. What's the ONE action you want to commit to?",
        practice: "You've got your action plan. Now let's lock in your commitment and see how far you've come.",
        review: "Time to consolidate. Let's review your key takeaways and next actions.",
      }
    };
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
    if (stepName === 'ownership') {
      // Get initial_confidence from CLARITY step (CSS baseline moved from introduction)
      const clarityReflections = reflections.filter(r => r.step === 'clarity');
      const latestClarity = clarityReflections[clarityReflections.length - 1];
      const initialConfidence = latestClarity?.payload?.['initial_confidence'] as number | undefined;

      if (typeof initialConfidence === 'number') {
        if (initialConfidence >= 8) {
          context += `\n\n🔀 HIGH-CONFIDENCE PATH ACTIVATED (initial_confidence: ${initialConfidence}/10)\n`;
          context += `⚠️ MANDATORY OVERRIDE: Use ONLY these 3 questions:\n`;
          context += `1. Confidence Source: "You're at ${initialConfidence}/10 - that's strong! What's giving you that confidence?"\n`;
          context += `2. Personal Benefit: "What could you gain personally if you adapt well to this change?"\n`;
          context += `3. Past Success: "Tell me about a time you successfully handled change before."\n`;
          context += `\n⚠️ DO NOT ask the standard 7 questions. This user already has strong confidence.\n`;
          context += `⚠️ IMMEDIATELY advance to MAPPING after these 3 questions are answered.\n`;
          context += `⚠️ You do NOT need to ask "where's your confidence now?" - they're already at ${initialConfidence}/10.\n`;
        } else {
          context += `\n\n⚡ STANDARD PATH (initial_confidence: ${initialConfidence}/10)\n`;
          context += `Use full 7-question Ownership flow to build confidence from ${initialConfidence}/10 to 6-7/10.\n`;
          context += `START by asking: "You're at ${initialConfidence}/10. What's making you feel unconfident or worried?"\n`;
          context += `Focus on fear exploration, reframing, and past success activation.\n`;
        }
        
        // Add path-specific completion requirements
        if (initialConfidence >= 8) {
          context += `\n\n⚠️ HIGH-CONFIDENCE PATH COMPLETION:\n`;
          context += `DO NOT advance to mapping until you have:\n`;
          context += `   - confidence_source (what's giving them confidence)\n`;
          context += `   - personal_benefit (user's own words about what they could gain)\n`;
          context += `   - past_success (user's actual story of handling change before)\n`;
          context += `\n⚠️ NO ownership_confidence needed - they're already at ${initialConfidence}/10!\n`;
        } else {
          context += `\n\n⚠️ STANDARD PATH COMPLETION:\n`;
          context += `DO NOT advance to mapping until you have:\n`;
          context += `   - ownership_confidence (final confidence after transformation - Q7)\n`;
          context += `   - personal_benefit (user's own words about what they could gain - Q4)\n`;
          context += `   - past_success (user's actual story of handling change before - Q5)\n`;
        }
        
        // Common rules for both paths
        context += `\n\n⚠️ CRITICAL OWNERSHIP RULES:\n`;
        context += `1. You MUST ask each question and WAIT for the user to answer before extracting any fields.\n`;
        context += `2. DO NOT infer or auto-fill personal_benefit - the user must explicitly state what THEY could gain.\n`;
        context += `3. Opportunistic extraction is ONLY allowed if the user EXPLICITLY mentions benefits or past success in their response.\n`;
        context += `4. When all required fields are captured, provide a completion summary and STOP asking questions.\n`;
      }
    }

    // Add CSS measurement triggers for practice stage
    if (stepName === 'practice') {
      // Get initial_confidence from CLARITY step (CSS baseline moved from introduction)
      const clarityReflections = reflections.filter(r => r.step === 'clarity');
      const latestClarity = clarityReflections[clarityReflections.length - 1];
      const initialConfidence = latestClarity?.payload?.['initial_confidence'] as number | undefined;
      const initialValue = typeof initialConfidence === 'number' ? initialConfidence : '[initial]';
      
      context += `\n\n📊 CSS FINAL MEASUREMENTS REQUIRED\n`;
      context += `Initial confidence from Clarity step: ${initialValue}/10\n\n`;
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
    const applicableNudges = detectApplicableNudges(userInput, stepName as 'clarity' | 'ownership' | 'mapping' | 'practice');
    if (applicableNudges.length > 0) {
      const nudge = applicableNudges[0];
      if (nudge !== undefined) {
        const nudgeTypes: NudgeType[] = applicableNudges.map(n => n.type);
        const nudgePrompt = generateNudgePrompt(stepName as 'clarity' | 'ownership' | 'mapping' | 'practice', nudgeTypes);
        context += `\n\n🎯 NUDGE ACTIVATED: ${nudge.name}\n${nudgePrompt}\n\nUse this nudge naturally in your response to help the user progress.`;
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

    if (stepName === 'ownership') {
      return `Context for AI suggestions: ${context}\n\nOffer 2-3 benefit perspectives (as questions, not statements) from categories: career development, skills building, relationship strengthening, values alignment, or personal growth. Frame as "Some leaders have found..." and ask if any resonate. Be careful not to prescribe - offer perspectives for them to validate.`;
    }

    return null;
  }
}

// Export singleton instance
export const compassCoach = new COMPASSCoach();

