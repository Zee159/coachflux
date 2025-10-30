/**
 * COMPASS Framework Report Generator
 * 
 * Generates comprehensive change readiness reports with transformation analytics
 */

import type {
  SessionReportData,
  FormattedReport,
  ReportSection,
  CompassTransformation,
  CompassScores,
  EmotionalState,
  MindsetLevel,
  PivotMoment,
  ReflectionPayload,
  FrameworkReportGenerator
} from './types';
import { calculateTransformationMagnitude } from './types';
import { getNumber, getString, getArray, formatCompassScoresContent } from './base';

/**
 * Extract COMPASS scores from reflections (Confidence-Optimized)
 * Now uses 1-10 scale and CSS measurements
 */
export function extractCompassScores(
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): CompassScores {
  const scores: CompassScores = {
    overall_readiness: 0
  };
  
  let scoreCount = 0;
  let totalScore = 0;
  
  // Extract confidence progression (primary metric)
  const introReflection = reflections.find(r => r.step === 'introduction');
  const practiceReflection = reflections.find(r => r.step === 'practice');
  
  if (introReflection !== undefined) {
    const initialConfidence = getNumber(introReflection.payload, 'initial_confidence');
    if (initialConfidence !== undefined) {
      scores['initial_confidence'] = initialConfidence;
    }
  }
  
  if (practiceReflection !== undefined) {
    const finalConfidence = getNumber(practiceReflection.payload, 'final_confidence');
    if (finalConfidence !== undefined) {
      scores['final_confidence'] = finalConfidence;
      totalScore += finalConfidence;
      scoreCount++;
    }
    
    const actionCommitment = getNumber(practiceReflection.payload, 'action_commitment_confidence');
    if (actionCommitment !== undefined) {
      scores['action_commitment'] = actionCommitment;
      totalScore += actionCommitment;
      scoreCount++;
    }
  }
  
  // Extract optional clarity score
  const clarityReflection = reflections.find(r => r.step === 'clarity');
  if (clarityReflection !== undefined) {
    const score = getNumber(clarityReflection.payload, 'clarity_score');
    if (score !== undefined) {
      scores.clarity_score = score;
      totalScore += score;
      scoreCount++;
    }
  }
  
  // Calculate overall readiness (average of provided scores, normalized to 10)
  scores.overall_readiness = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : 0;
  
  return scores;
}

/**
 * Extract COMPASS transformation data (Confidence-Optimized)
 * Now uses CSS mindset_state measurements
 */
export function extractCompassTransformation(
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): CompassTransformation | null {
  let initialState: EmotionalState | null = null;
  let finalState: EmotionalState | null = null;
  let pivotMoment: PivotMoment | null = null;
  const unlockFactors: string[] = [];
  
  // Extract initial mindset state from introduction (CSS baseline)
  const introReflection = reflections.find(r => r.step === 'introduction');
  if (introReflection !== undefined && introReflection !== null) {
    const state = getString(introReflection.payload, 'initial_mindset_state');
    if (state !== undefined) {
      // Map mindset_state to EmotionalState
      initialState = state as EmotionalState;
    }
  }
  
  // Extract final mindset state from practice (CSS final)
  const practiceReflection = reflections.find(r => r.step === 'practice');
  if (practiceReflection !== undefined && practiceReflection !== null) {
    const state = getString(practiceReflection.payload, 'final_mindset_state');
    if (state !== undefined) {
      // Map mindset_state to EmotionalState
      finalState = state as EmotionalState;
    }
  }
  
  // Extract pivot moment from ownership
  const ownershipReflection = reflections.find(r => r.step === 'ownership');
  if (ownershipReflection !== undefined && ownershipReflection !== null) {
    const quote = getString(ownershipReflection.payload, 'pivot_moment_quote');
    if (quote !== undefined && quote.length > 0) {
      pivotMoment = {
        stage: 'ownership',
        user_quote: quote,
        insight: 'Found personal meaning in the change',
        timestamp: Date.now()
      };
      unlockFactors.push('Found personal benefits');
    }
    
    // Check for personal benefits
    const benefits = getArray(ownershipReflection.payload, 'personal_benefits');
    if (benefits !== undefined && benefits.length > 0) {
      unlockFactors.push('Identified specific benefits');
    }
  }
  
  // Check for action planning
  const mappingReflection = reflections.find(r => r.step === 'mapping');
  if (mappingReflection !== undefined && mappingReflection !== null) {
    const actions = getArray(mappingReflection.payload, 'actions');
    if (actions !== undefined && actions.length > 0) {
      unlockFactors.push('Created concrete action plan');
    }
  }
  
  // Both states must be present
  if (initialState === null || finalState === null) {
    return null;
  }
  
  // Map emotional states to mindset levels (approximation)
  const initialMindset: MindsetLevel = 
    initialState === 'resistant' || initialState === 'anxious' ? 'victim' :
    initialState === 'neutral' ? 'observer' :
    initialState === 'cautious' || initialState === 'open' ? 'stakeholder' :
    initialState === 'engaged' ? 'actor' : 'leader';
    
  const finalMindset: MindsetLevel =
    finalState === 'resistant' || finalState === 'anxious' ? 'victim' :
    finalState === 'neutral' ? 'observer' :
    finalState === 'cautious' || finalState === 'open' ? 'stakeholder' :
    finalState === 'engaged' ? 'actor' : 'leader';
  
  const transformationMagnitude = calculateTransformationMagnitude(initialState, finalState);
  const transformationAchieved = transformationMagnitude >= 2;
  
  return {
    initial_emotional_state: initialState,
    initial_mindset: initialMindset,
    final_emotional_state: finalState,
    final_mindset: finalMindset,
    pivot_moment: pivotMoment ?? undefined,
    transformation_achieved: transformationAchieved,
    transformation_magnitude: transformationMagnitude,
    unlock_factors: unlockFactors
  };
}

/**
 * Generate AI insights for COMPASS transformation
 */
export function generateCompassInsights(
  transformation: CompassTransformation,
  scores: CompassScores,
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): string {
  const insights: string[] = [];
  
  // Get success vision for context
  const clarityReflection = reflections.find(r => r.step === 'clarity');
  const successVision = clarityReflection !== undefined && clarityReflection !== null
    ? getString(clarityReflection.payload, 'success_vision')
    : null;
  
  // Success Vision Reminder
  if (successVision !== null && successVision !== undefined) {
    insights.push(`🎯 YOUR NORTH STAR:\n"${successVision}"\n\nKeep this vision front and center. Every action should move you closer to this outcome.`);
  }
  
  // Transformation achieved
  if (transformation.transformation_achieved) {
    insights.push(`\n✅ TRANSFORMATION ACHIEVED: You shifted from "${transformation.initial_emotional_state}" to "${transformation.final_emotional_state}" (+${transformation.transformation_magnitude} levels)`);
    insights.push(`🎭 MINDSET SHIFT: From "${transformation.initial_mindset}" to "${transformation.final_mindset}"`);
  } else {
    insights.push(`\n⚠️ PARTIAL SHIFT: You moved from "${transformation.initial_emotional_state}" to "${transformation.final_emotional_state}"`);
    insights.push(`This is progress, but there's more work to do. Focus on the areas where you scored lowest.`);
  }
  
  // Pivot moment
  if (transformation.pivot_moment !== undefined) {
    insights.push(`\n💡 YOUR BREAKTHROUGH MOMENT:\n"${transformation.pivot_moment.user_quote}"\nThis was your pivot from resistance to ownership. Remember this when things get tough.`);
  }
  
  // What unlocked the shift
  if (transformation.unlock_factors.length > 0) {
    const factors = transformation.unlock_factors.map(f => `- ${f}`).join('\n');
    insights.push(`\n🔓 WHAT UNLOCKED THE SHIFT:\n${factors}`);
  }
  
  // Primary barrier analysis
  const reviewReflection = reflections.find(r => r.step === 'review');
  if (reviewReflection !== undefined && reviewReflection !== null) {
    const barrier = getString(reviewReflection.payload, 'primary_barrier');
    const barrierScore = getNumber(reviewReflection.payload, 'barrier_score');
    if (barrier !== undefined && barrierScore !== undefined) {
      const severity = barrierScore >= 4 ? 'CRITICAL' : barrierScore >= 3 ? 'SIGNIFICANT' : 'MODERATE';
      insights.push(`\n🚨 ${severity} BARRIER (${barrierScore}/5): ${barrier}`);
      
      // Specific recommendations based on barrier score
      if (barrierScore >= 4) {
        insights.push(`⚡ URGENT ACTION NEEDED: This is blocking your progress. Address this FIRST before moving forward.`);
      } else if (barrierScore >= 3) {
        insights.push(`📋 HIGH PRIORITY: Tackle this within the next 7 days. It's holding you back.`);
      } else {
        insights.push(`💡 WATCH & MITIGATE: Keep an eye on this. Small actions now prevent bigger issues later.`);
      }
    }
  }
  
  // Readiness assessment with specific guidance
  if (scores.overall_readiness >= 4.0) {
    insights.push(`\n📈 HIGH READINESS (${scores.overall_readiness}/5): You're well-equipped to lead this change.`);
    insights.push(`Next steps: Execute your action plan, support others, and maintain momentum.`);
  } else if (scores.overall_readiness >= 3.0) {
    insights.push(`\n📊 DEVELOPING READINESS (${scores.overall_readiness}/5): You're on the right track.`);
    insights.push(`Next steps: Focus on your lowest-scoring dimension. Build competence there before expanding.`);
  } else {
    insights.push(`\n⚠️ EARLY READINESS (${scores.overall_readiness}/5): Significant work needed.`);
    insights.push(`Next steps: Don't try to lead yet. Focus on your own development first. Revisit in 2-4 weeks.`);
  }
  
  // Leadership edge
  if (transformation.transformation_achieved) {
    insights.push(`\n💪 YOUR LEADERSHIP EDGE:\n- You've experienced the journey from resistance to engagement yourself\n- You can authentically guide others through similar struggles\n- Your genuine transformation will inspire more than fake positivity\n- Share your story (including doubts) to build trust with your team`);
  }
  
  return insights.join('\n');
}

/**
 * Generate COMPASS-specific report
 */
export function generateCompassReport(data: SessionReportData): FormattedReport {
  const scores = extractCompassScores(data.reflections);
  const transformation = extractCompassTransformation(data.reflections);
  
  const sections: ReportSection[] = [];
  
  // ========================================================================
  // CSS (Composite Success Score) Section - NEW
  // ========================================================================
  // Note: CSS data must be fetched separately via query since this is a pure function
  // The frontend should call api.queries.getCSSScore({ sessionId }) and pass it here
  // For now, we'll add a placeholder that can be populated when CSS data is available
  
  // CSS Score Section (if available in data)
  // This will be populated when CSS calculation is complete
  const cssData = data.css_score;
  if (cssData !== undefined && cssData !== null) {
    const css = cssData;
    
    const levelEmoji = {
      'EXCELLENT': '🌟',
      'GOOD': '✅',
      'FAIR': '👍',
      'MARGINAL': '⚠️',
      'INSUFFICIENT': '❌'
    }[css.success_level] ?? '📊';
    
    sections.push({
      heading: `${levelEmoji} COMPOSITE SUCCESS SCORE`,
      content: `Overall Score: ${Math.round(css.composite_success_score)}/100 (${css.success_level})

📊 DIMENSION BREAKDOWN:
• Confidence Level: ${Math.round(css.breakdown.confidence_score)}/100
• Confidence Growth: ${Math.round(css.breakdown.confidence_growth)}/100
• Action Commitment: ${Math.round(css.breakdown.action_score)}/100
• Mindset Shift: ${Math.round(css.breakdown.mindset_score)}/100
• Session Value: ${Math.round(css.breakdown.satisfaction_score)}/100

${css.composite_success_score >= 85 ? '🌟 EXCELLENT - Outstanding transformation and commitment!' : css.composite_success_score >= 70 ? '✅ GOOD - Strong progress with clear action plan!' : css.composite_success_score >= 50 ? '👍 FAIR - Meaningful progress, continue building momentum!' : css.composite_success_score >= 30 ? '⚠️ MARGINAL - Some progress, may need additional support!' : '❌ INSUFFICIENT - Consider revisiting with different approach!'}`,
      type: 'css_score',
      data: css
    });
  }
  
  // Transformation Summary Section
  if (transformation !== null) {
    sections.push({
      heading: '🎉 YOUR TRANSFORMATION JOURNEY',
      content: `Starting Point: ${transformation.initial_emotional_state} (${transformation.initial_mindset} mindset)\nEnding Point: ${transformation.final_emotional_state} (${transformation.final_mindset} mindset)\n\n${transformation.transformation_achieved ? '✅ Significant transformation achieved!' : '⚠️ Partial shift - continue working on this'}`,
      type: 'transformation',
      data: transformation
    });
  }
  
  // Readiness Scores Section
  sections.push({
    heading: '📊 YOUR CHANGE READINESS PROFILE',
    content: formatCompassScoresContent(scores),
    type: 'scores',
    data: scores
  });
  
  // Change Context Section (Confidence-Optimized)
  const clarityReflection = data.reflections.find(r => r.step === 'clarity');
  if (clarityReflection !== undefined && clarityReflection !== null) {
    const changeDesc = getString(clarityReflection.payload, 'change_description');
    const sphereOfControl = getString(clarityReflection.payload, 'sphere_of_control');
    const clarityScore = getNumber(clarityReflection.payload, 'clarity_score');
    
    const parts: string[] = [];
    
    if (changeDesc !== undefined) {
      parts.push(`📌 WHAT'S CHANGING:\n${changeDesc}`);
    }
    
    if (sphereOfControl !== undefined) {
      parts.push(`\n🎯 WHAT YOU CAN CONTROL:\n${sphereOfControl}`);
    }
    
    if (clarityScore !== undefined) {
      parts.push(`\n📊 CLARITY LEVEL: ${clarityScore}/10`);
    }
    
    if (parts.length > 0) {
      sections.push({
        heading: '📋 CHANGE CLARITY',
        content: parts.join('\n'),
        type: 'text'
      });
    }
  }
  
  // Personal Connection Section (Confidence Transformation)
  const introReflection = data.reflections.find(r => r.step === 'introduction');
  const ownershipReflection = data.reflections.find(r => r.step === 'ownership');
  const practiceReflection = data.reflections.find(r => r.step === 'practice');
  
  const parts: string[] = [];
  
  // Confidence transformation (primary metric)
  const initialConfidence = introReflection !== undefined ? getNumber(introReflection.payload, 'initial_confidence') : undefined;
  const finalConfidence = practiceReflection !== undefined ? getNumber(practiceReflection.payload, 'final_confidence') : undefined;
  
  if (initialConfidence !== undefined && finalConfidence !== undefined) {
    const increase = finalConfidence - initialConfidence;
    const arrow = increase > 0 ? '↗️' : increase < 0 ? '↘️' : '➡️';
    parts.push(`📈 CONFIDENCE TRANSFORMATION:\n${initialConfidence}/10 ${arrow} ${finalConfidence}/10 (${increase > 0 ? '+' : ''}${increase} points)`);
  }
  
  // Personal benefit
  if (ownershipReflection !== undefined) {
    const personalBenefit = getString(ownershipReflection.payload, 'personal_benefit');
    if (personalBenefit !== undefined) {
      parts.push(`\n💎 PERSONAL BENEFIT:\n${personalBenefit}`);
    }
    
    // Past success
    const pastSuccess = ownershipReflection.payload['past_success'];
    if (pastSuccess !== undefined && typeof pastSuccess === 'object' && pastSuccess !== null) {
      const achievement = (pastSuccess as Record<string, unknown>)['achievement'];
      if (typeof achievement === 'string') {
        parts.push(`\n🏆 PAST SUCCESS:\n${achievement}`);
      }
    }
  }
  
  if (parts.length > 0) {
    sections.push({
      heading: '💪 YOUR CONFIDENCE JOURNEY',
      content: parts.join('\n'),
      type: 'text'
    });
  }
  
  // Implementation Plan Section (Mapping)
  const mappingReflection = data.reflections.find(r => r.step === 'mapping');
  if (mappingReflection !== undefined && mappingReflection !== null) {
    const committedAction = getString(mappingReflection.payload, 'committed_action');
    const actionDay = getString(mappingReflection.payload, 'action_day');
    const actionTime = getString(mappingReflection.payload, 'action_time');
    const obstacle = getString(mappingReflection.payload, 'obstacle');
    const backupPlan = getString(mappingReflection.payload, 'backup_plan');
    const supportPerson = getString(mappingReflection.payload, 'support_person');

    const planParts: string[] = [];
    if (committedAction !== undefined) {
      planParts.push(`🎬 ACTION: ${committedAction}`);
    }
    if (actionDay !== undefined || actionTime !== undefined) {
      const when = [actionDay, actionTime].filter(Boolean).join(' • ');
      if (when.length > 0) {
        planParts.push(`🗓️ WHEN: ${when}`);
      }
    }
    if (supportPerson !== undefined) {
      planParts.push(`🤝 SUPPORT: ${supportPerson}`);
    }
    if (obstacle !== undefined) {
      planParts.push(`🚧 OBSTACLE: ${obstacle}`);
    }
    if (backupPlan !== undefined) {
      planParts.push(`🛡️ BACKUP PLAN: ${backupPlan}`);
    }

    if (planParts.length > 0) {
      sections.push({
        heading: '🛠️ YOUR IMPLEMENTATION PLAN',
        content: planParts.join('\n'),
        type: 'text'
      });
    }
  }
  
  // Key Takeaway & Session Value (Practice Stage)
  if (practiceReflection !== undefined && practiceReflection !== null) {
    const keyTakeaway = getString(practiceReflection.payload, 'key_takeaway');
    const userSatisfaction = getNumber(practiceReflection.payload, 'user_satisfaction');
    const actionCommitment = getNumber(practiceReflection.payload, 'action_commitment_confidence');
    
    // Key Takeaway
    if (keyTakeaway !== undefined) {
      sections.push({
        heading: '💡 YOUR KEY TAKEAWAY',
        content: keyTakeaway,
        type: 'text'
      });
    }
    
    // Session Value
    if (userSatisfaction !== undefined) {
      const satisfactionEmoji = userSatisfaction >= 8 ? '🌟' : userSatisfaction >= 6 ? '✅' : userSatisfaction >= 4 ? '👍' : '⚠️';
      sections.push({
        heading: `${satisfactionEmoji} SESSION VALUE`,
        content: `Session Helpfulness: ${userSatisfaction}/10\n${actionCommitment !== undefined ? `Action Commitment: ${actionCommitment}/10` : ''}`,
        type: 'text'
      });
    }
  }
  
  // AI Insights Section
  if (transformation !== null) {
    const insights = generateCompassInsights(transformation, scores, data.reflections);
    sections.push({
      heading: '🤖 AI COACH INSIGHTS',
      content: insights,
      type: 'insights'
    });
  }
  
  const initialConf = typeof scores['initial_confidence'] === 'number' ? scores['initial_confidence'] : 'N/A';
  const finalConf = typeof scores['final_confidence'] === 'number' ? scores['final_confidence'] : 'N/A';
  
  return {
    title: 'COMPASS Confidence Journey Report',
    summary: `Confidence: ${initialConf}/10 → ${finalConf}/10 | ${transformation?.transformation_achieved === true ? 'Transformation Achieved ✅' : 'Building Confidence 📈'}`,
    sections
  };
}

/**
 * COMPASS Report Generator Class
 * Implements FrameworkReportGenerator interface
 */
export class COMPASSReportGenerator implements FrameworkReportGenerator {
  generateReport(data: SessionReportData): FormattedReport {
    return generateCompassReport(data);
  }
}

// Export singleton instance
export const compassReportGenerator = new COMPASSReportGenerator();


