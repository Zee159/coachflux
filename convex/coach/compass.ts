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
      // Requires CSS baseline measurements
      const hasInitialConfidence = typeof payload["initial_confidence"] === "number" && payload["initial_confidence"] >= 1 && payload["initial_confidence"] <= 10;
      const hasInitialActionClarity = typeof payload["initial_action_clarity"] === "number" && payload["initial_action_clarity"] >= 1 && payload["initial_action_clarity"] <= 10;
      const hasInitialMindsetState = typeof payload["initial_mindset_state"] === "string" && payload["initial_mindset_state"].length > 0;

      const completedFields = [hasInitialConfidence, hasInitialActionClarity, hasInitialMindsetState].filter(Boolean).length;
      return { shouldAdvance: completedFields >= 2 }; // At least 2 out of 3 CSS baseline fields
    } else if (stepName === "clarity") {
      // Requires change_description, sphere_of_control, AND meaningful conversation
      const hasChangeDescription = typeof payload["change_description"] === "string" && payload["change_description"].length > 0;
      const hasSphereOfControl = typeof payload["sphere_of_control"] === "string" && payload["sphere_of_control"].length > 0;
      
      // Check if sphere_of_control is meaningful (not just resignation like "accept my fate")
      const sphereOfControl = payload["sphere_of_control"] as string | undefined;
      const isMeaningfulControl = typeof sphereOfControl === "string" &&
        sphereOfControl.length > 15 && // More than just a short phrase
        !sphereOfControl.toLowerCase().includes("accept") && // Not resignation
        !sphereOfControl.toLowerCase().includes("nothing") && // Not helplessness
        !sphereOfControl.toLowerCase().includes("can't control"); // Not pure negativity
      
      // Also check if we have at least 2 reflections in this step (ensures conversation happened)
      const clarityReflections = reflections.filter(r => r.step === 'clarity');
      const hasMinimumConversation = clarityReflections.length >= 2;

      return { shouldAdvance: hasChangeDescription && hasSphereOfControl && isMeaningfulControl && hasMinimumConversation };
    } else if (stepName === "ownership") {
      // High-confidence branching: requires fewer fields if initial_confidence >= 8
      // Get initial_confidence from introduction step (not current payload)
      const introReflections = reflections.filter(r => r.step === 'introduction');
      const latestIntro = introReflections[introReflections.length - 1];
      const initialConfidence = latestIntro?.payload?.['initial_confidence'] as number | undefined;
      const isHighConfidence = typeof initialConfidence === "number" && initialConfidence >= 8;

      const hasCurrentConfidence = typeof payload["current_confidence"] === "number" && payload["current_confidence"] >= 1 && payload["current_confidence"] <= 10;
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
        const hasConfidenceSource = typeof payload["confidence_source"] === "string" && payload["confidence_source"].length > 0;
        const hasMinConversationHigh = ownershipReflections.length >= 3; // At least 3 exchanges for high-confidence path
        // 🔧 FIX: Require ALL 3 fields + minimum conversation to prevent premature advancement
        return { shouldAdvance: hasConfidenceSource && hasPersonalBenefit && hasPastSuccess && hasMinConversationHigh };
      } else {
        // Standard path: 8 questions (requires current_confidence, personal_benefit, past_success, and meaningful conversation)
        const hasMinConversationStandard = ownershipReflections.length >= 5; // At least 5 exchanges for standard path
        // 🔧 FIX: Require ALL 3 core fields + minimum conversation to prevent premature advancement
        return { shouldAdvance: hasCurrentConfidence && hasPersonalBenefit && hasPastSuccess && hasMinConversationStandard };
      }
    } else if (stepName === "mapping") {
      // Requires committed_action, action_day, action_time, and commitment_confidence >= 7
      const hasCommittedAction = typeof payload["committed_action"] === "string" && payload["committed_action"].length > 0;
      const hasActionDay = typeof payload["action_day"] === "string" && payload["action_day"].length > 0;
      const hasActionTime = typeof payload["action_time"] === "string" && payload["action_time"].length > 0;
      const commitmentConfidence = payload["commitment_confidence"] as number | undefined;
      const hasHighCommitment = typeof commitmentConfidence === "number" && commitmentConfidence >= 7;

      // ✅ FIXED: Require ALL 3 action fields + commitment confidence 7+ for complete action plan
      return { shouldAdvance: hasCommittedAction && hasActionDay && hasActionTime && hasHighCommitment };
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
        ownership: "Great! You've clarified the change. Now let's build your confidence. On a scale of 1-10, how confident do you feel about navigating this successfully?",
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
      const introReflections = reflections.filter(r => r.step === 'introduction');
      const latestIntro = introReflections[introReflections.length - 1];
      const initialConfidence = latestIntro?.payload?.['initial_confidence'] as number | undefined;

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
        
        // 🔧 FIX: Add explicit warning about data extraction
        context += `\n\n⚠️ CRITICAL OWNERSHIP RULES:\n`;
        context += `1. You MUST ask each question and WAIT for the user to answer before extracting any fields.\n`;
        context += `2. DO NOT infer or auto-fill personal_benefit - the user must explicitly state what THEY could gain.\n`;
        context += `3. DO NOT extract personal_benefit until you have ASKED Q5 and the user has ANSWERED it.\n`;
        context += `4. DO NOT extract past_success until you have ASKED Q6 and the user has ANSWERED it.\n`;
        context += `5. Opportunistic extraction is ONLY allowed if the user EXPLICITLY mentions benefits or past success in their response.\n`;
        context += `6. If you extract personal_benefit opportunistically, you MUST acknowledge it and SKIP Q5.\n`;
        context += `7. DO NOT advance to mapping until you have explicitly asked for and received:\n`;
        context += `   - current_confidence (asked and answered)\n`;
        context += `   - personal_benefit (user's own words about what they could gain)\n`;
        context += `   - past_success (user's actual story of handling change before)\n`;
        context += `8. If you only have the opener message and user says "ok", ask the FIRST QUESTION now.\n`;
      }
    }

    // Add CSS measurement triggers for practice stage
    if (stepName === 'practice') {
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

