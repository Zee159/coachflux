/**
 * CAREER Framework Coach
 * Career Advancement & Readiness Coach
 * 
 * Implements FrameworkCoach interface for the CAREER framework.
 * Handles step completion logic, field requirements, and transitions.
 */

import type { FrameworkCoach, StepCompletionResult, StepTransitions } from "./types";
import type { ReflectionPayload } from "../types";

export class CareerCoach implements FrameworkCoach {
  /**
   * Define required fields for each step
   * Used by agent state tracking
   */
  getRequiredFields(): Record<string, string[]> {
    return {
      INTRODUCTION: ["user_consent", "coaching_focus", "coach_reflection"],
      ASSESSMENT: ["current_role", "years_experience", "industry", "target_role", "timeframe", "career_stage", "initial_confidence", "assessment_score"],
      GAP_ANALYSIS: ["skill_gaps", "experience_gaps", "ai_wants_suggestions", "transferable_skills", "development_priorities", "gap_analysis_score"],
      ROADMAP: ["learning_actions", "networking_actions", "experience_actions", "milestone_3_months", "milestone_6_months", "roadmap_score"],
      REVIEW: ["key_takeaways", "immediate_next_step", "biggest_challenge", "final_confidence", "final_clarity", "session_helpfulness"]
    };
  }

  /**
   * Check if a step is complete and ready to advance
   * Implements progressive relaxation based on skip count
   */
  checkStepCompletion(
    stepName: string,
    payload: ReflectionPayload,
    _reflections: Array<{ step: string; payload: ReflectionPayload }>,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    switch (stepName) {
      case "INTRODUCTION":
        return this.checkIntroductionCompletion(payload);
      
      case "ASSESSMENT":
        return this.checkAssessmentCompletion(payload, skipCount, loopDetected);
      
      case "GAP_ANALYSIS":
        return this.checkGapAnalysisCompletion(payload, skipCount, loopDetected);
      
      case "ROADMAP":
        return this.checkRoadmapCompletion(payload, skipCount, loopDetected);
      
      case "REVIEW":
        return this.checkReviewCompletion(payload, skipCount, loopDetected);
      
      default:
        return {
          shouldAdvance: false,
          reason: `Unknown step: ${stepName}`
        };
    }
  }

  /**
   * INTRODUCTION step completion
   * Advances when user gives consent (user_consent = true)
   */
  private checkIntroductionCompletion(payload: ReflectionPayload): StepCompletionResult {
    const userConsent = payload['user_consent'];
    
    // Check if user has explicitly consented
    if (typeof userConsent === 'boolean' && userConsent === true) {
      return { 
        shouldAdvance: true,
        reason: "User has given consent"
      };
    }
    
    // Don't advance without explicit consent
    return { 
      shouldAdvance: false,
      reason: "Waiting for user consent"
    };
  }

  /**
   * ASSESSMENT step completion
   * Progressive relaxation: 7/8 → 5/8 → 3/8 fields
   */
  private checkAssessmentCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    const fields = {
      current_role: typeof payload['current_role'] === 'string' && payload['current_role'].length >= 3,
      years_experience: typeof payload['years_experience'] === 'number',
      industry: typeof payload['industry'] === 'string' && payload['industry'].length >= 3,
      target_role: typeof payload['target_role'] === 'string' && payload['target_role'].length >= 3,
      timeframe: typeof payload['timeframe'] === 'string' && payload['timeframe'].length > 0,
      career_stage: typeof payload['career_stage'] === 'string' && payload['career_stage'].length > 0,
      initial_confidence: typeof payload['initial_confidence'] === 'number',
      assessment_score: typeof payload['assessment_score'] === 'number'
    };

    const capturedFields = Object.keys(fields).filter(k => fields[k as keyof typeof fields]);
    const missingFields = Object.keys(fields).filter(k => !fields[k as keyof typeof fields]);
    const capturedCount = capturedFields.length;

    // Progressive relaxation
    let requiredCount = 8; // Strict: ALL 8 fields required
    if (skipCount >= 1) { requiredCount = 6; } // Lenient: 6/8 fields
    if (skipCount >= 2) { requiredCount = 4; } // Very lenient: 4/8 fields
    if (loopDetected) { requiredCount = 5; } // Loop override: 5/8 fields

    // Minimum critical fields
    const hasCriticalFields = fields.current_role && fields.target_role && fields.initial_confidence;

    if (capturedCount >= requiredCount && hasCriticalFields) {
      return {
        shouldAdvance: false,
        awaitingConfirmation: true,
        reason: `Captured ${capturedCount}/8 fields (required: ${requiredCount})`,
        capturedFields,
        completionPercentage: Math.round((capturedCount / 8) * 100)
      };
    }

    return {
      shouldAdvance: false,
      reason: `Need ${requiredCount} fields, have ${capturedCount}/8`,
      capturedFields,
      missingFields,
      completionPercentage: Math.round((capturedCount / 8) * 100)
    };
  }

  /**
   * GAP_ANALYSIS step completion
   * Progressive relaxation: 5/6 → 4/6 → 3/6 fields
   */
  private checkGapAnalysisCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    const fields = {
      skill_gaps: Array.isArray(payload['skill_gaps']) && payload['skill_gaps'].length >= 1,
      experience_gaps: Array.isArray(payload['experience_gaps']), // Optional, can be empty
      ai_wants_suggestions: typeof payload['ai_wants_suggestions'] === 'boolean', // CRITICAL: Must ask this question
      transferable_skills: Array.isArray(payload['transferable_skills']) && payload['transferable_skills'].length >= 1,
      development_priorities: Array.isArray(payload['development_priorities']) && payload['development_priorities'].length >= 1,
      gap_analysis_score: typeof payload['gap_analysis_score'] === 'number'
    };

    const capturedFields = Object.keys(fields).filter(k => fields[k as keyof typeof fields]);
    const missingFields = Object.keys(fields).filter(k => !fields[k as keyof typeof fields]);
    const capturedCount = capturedFields.length;

    // Progressive relaxation
    let requiredCount = 6; // Strict: ALL 6 fields required
    if (skipCount >= 1) { requiredCount = 5; } // Lenient: 5/6 fields
    if (skipCount >= 2) { requiredCount = 4; } // Very lenient: 4/6 fields
    if (loopDetected) { requiredCount = 4; } // Loop override: 4/6 fields

    // Minimum critical fields (including ai_wants_suggestions)
    const hasCriticalFields = fields.skill_gaps && fields.ai_wants_suggestions && fields.transferable_skills;

    if (capturedCount >= requiredCount && hasCriticalFields) {
      return {
        shouldAdvance: false,
        awaitingConfirmation: true,
        reason: `Captured ${capturedCount}/6 fields (required: ${requiredCount})`,
        capturedFields,
        completionPercentage: Math.round((capturedCount / 6) * 100)
      };
    }

    return {
      shouldAdvance: false,
      reason: `Need ${requiredCount} fields, have ${capturedCount}/6`,
      capturedFields,
      missingFields,
      completionPercentage: Math.round((capturedCount / 6) * 100)
    };
  }

  /**
   * ROADMAP step completion
   * Progressive relaxation: 5/6 → 4/6 → 3/6 fields
   */
  private checkRoadmapCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    // Check for new sequential gap flow
    const roadmapCompleted = payload['roadmap_completed'] === true;
    const roadmapScore = typeof payload['roadmap_score'] === 'number';
    
    // If roadmap is completed and score is captured, await confirmation
    if (roadmapCompleted && roadmapScore) {
      return {
        shouldAdvance: false,
        awaitingConfirmation: true,
        reason: 'Roadmap completed with commitment score',
        capturedFields: ['roadmap_completed', 'roadmap_score'],
        completionPercentage: 100
      };
    }
    
    // Backward compatibility: Check for old format (all gaps in one go)
    const fields = {
      learning_actions: Array.isArray(payload['learning_actions']) && payload['learning_actions'].length >= 1,
      networking_actions: Array.isArray(payload['networking_actions']), // Optional, can be empty
      experience_actions: Array.isArray(payload['experience_actions']) && payload['experience_actions'].length >= 1,
      milestone_3_months: typeof payload['milestone_3_months'] === 'string' && payload['milestone_3_months'].length >= 10,
      milestone_6_months: typeof payload['milestone_6_months'] === 'string' && payload['milestone_6_months'].length >= 10,
      roadmap_score: typeof payload['roadmap_score'] === 'number'
    };

    const capturedFields = Object.keys(fields).filter(k => fields[k as keyof typeof fields]);
    const missingFields = Object.keys(fields).filter(k => !fields[k as keyof typeof fields]);
    const capturedCount = capturedFields.length;

    // Progressive relaxation
    let requiredCount = 6; // Strict: ALL 6 fields required
    if (skipCount >= 1) { requiredCount = 5; } // Lenient: 5/6 fields
    if (skipCount >= 2) { requiredCount = 4; } // Very lenient: 4/6 fields
    if (loopDetected) { requiredCount = 4; } // Loop override: 4/6 fields

    // Minimum critical fields
    const hasCriticalFields = fields.learning_actions && fields.experience_actions && fields.milestone_3_months;

    if (capturedCount >= requiredCount && hasCriticalFields) {
      return {
        shouldAdvance: false,
        awaitingConfirmation: true,
        reason: `Captured ${capturedCount}/6 fields (required: ${requiredCount})`,
        capturedFields,
        completionPercentage: Math.round((capturedCount / 6) * 100)
      };
    }

    return {
      shouldAdvance: false,
      reason: roadmapCompleted 
        ? 'Waiting for commitment score'
        : `Need ${requiredCount} fields, have ${capturedCount}/6`,
      capturedFields,
      missingFields,
      completionPercentage: Math.round((capturedCount / 6) * 100)
    };
  }

  /**
   * REVIEW step completion
   * Progressive relaxation: 5/6 → 4/6 → 3/6 fields
   */
  private checkReviewCompletion(
    payload: ReflectionPayload,
    skipCount: number,
    loopDetected: boolean
  ): StepCompletionResult {
    // User input fields (6 fields)
    const userFields = {
      key_takeaways: typeof payload['key_takeaways'] === 'string' && payload['key_takeaways'].length >= 50,
      immediate_next_step: typeof payload['immediate_next_step'] === 'string' && payload['immediate_next_step'].length >= 10,
      biggest_challenge: typeof payload['biggest_challenge'] === 'string' && payload['biggest_challenge'].length >= 10,
      final_confidence: typeof payload['final_confidence'] === 'number',
      final_clarity: typeof payload['final_clarity'] === 'number',
      session_helpfulness: typeof payload['session_helpfulness'] === 'number'
    };

    // AI-generated fields (4 fields)
    const aiFields = {
      ai_insights: typeof payload['ai_insights'] === 'string' && payload['ai_insights'].length >= 100,
      hidden_opportunities: Array.isArray(payload['hidden_opportunities']) && payload['hidden_opportunities'].length >= 2,
      potential_obstacles: Array.isArray(payload['potential_obstacles']) && payload['potential_obstacles'].length >= 2,
      success_accelerators: Array.isArray(payload['success_accelerators']) && payload['success_accelerators'].length >= 2
    };

    const userCapturedFields = Object.keys(userFields).filter(k => userFields[k as keyof typeof userFields]);
    const aiCapturedFields = Object.keys(aiFields).filter(k => aiFields[k as keyof typeof aiFields]);
    const userCapturedCount = userCapturedFields.length;
    const aiCapturedCount = aiCapturedFields.length;
    const missingUserFields = Object.keys(userFields).filter(k => !userFields[k as keyof typeof userFields]);
    const missingAiFields = Object.keys(aiFields).filter(k => !aiFields[k as keyof typeof aiFields]);

    // Progressive relaxation for user fields
    let requiredUserCount = 6; // Strict: ALL 6 fields required
    if (skipCount >= 1) { requiredUserCount = 5; } // Lenient: 5/6 fields
    if (skipCount >= 2) { requiredUserCount = 4; } // Very lenient: 4/6 fields
    if (loopDetected) { requiredUserCount = 4; } // Loop override: 4/6 fields

    // Minimum critical user fields
    const hasCriticalUserFields = userFields.key_takeaways && userFields.immediate_next_step && userFields.final_confidence;

    // Check if user fields are complete
    const userFieldsComplete = userCapturedCount >= requiredUserCount && hasCriticalUserFields;

    // Check if AI fields are complete (all 4 required for final completion)
    const aiFieldsComplete = aiCapturedCount === 4;

    // If both user and AI fields are complete, await confirmation
    if (userFieldsComplete && aiFieldsComplete) {
      return {
        shouldAdvance: false,
        awaitingConfirmation: true,
        reason: `Captured ${userCapturedCount}/6 user fields + ${aiCapturedCount}/4 AI fields`,
        capturedFields: [...userCapturedFields, ...aiCapturedFields],
        completionPercentage: 100
      };
    }

    // If user fields complete but AI fields missing, continue (AI will generate them)
    if (userFieldsComplete && !aiFieldsComplete) {
      return {
        shouldAdvance: false,
        reason: `User fields complete (${userCapturedCount}/6), waiting for AI insights (${aiCapturedCount}/4)`,
        capturedFields: userCapturedFields,
        missingFields: missingAiFields,
        completionPercentage: Math.round(((userCapturedCount / 6) * 60 + (aiCapturedCount / 4) * 40))
      };
    }

    // User fields incomplete
    return {
      shouldAdvance: false,
      reason: `Need ${requiredUserCount} user fields, have ${userCapturedCount}/6`,
      capturedFields: userCapturedFields,
      missingFields: missingUserFields,
      completionPercentage: Math.round((userCapturedCount / 6) * 60)
    };
  }

  /**
   * Get step transition and opener messages
   */
  getStepTransitions(): StepTransitions {
    return {
      transitions: {
        INTRODUCTION: "Great! Let's start by understanding your current position and career goals.",
        ASSESSMENT: "Now let's identify the gaps between where you are and where you want to be.",
        GAP_ANALYSIS: "Perfect. Let's create a concrete roadmap to bridge those gaps.",
        ROADMAP: "Excellent plan! Let's review what we've covered and your next steps.",
        REVIEW: "Session complete! You now have a clear career development roadmap."
      },
      openers: {
        INTRODUCTION: "Ready to begin your career planning session?",
        ASSESSMENT: "What's your current role?",
        GAP_ANALYSIS: "What skills does your target role require that you don't currently have?",
        ROADMAP: "Let me create a comprehensive roadmap for your transition. I'll suggest learning actions for each gap, networking opportunities, hands-on experiences, and milestones.",
        REVIEW: "What are your key takeaways from this session?"
      }
    };
  }
}
