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
 * Extract COMPASS scores from reflections  
 */
export function extractCompassScores(
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): CompassScores {
  const scores: CompassScores = {
    overall_readiness: 0
  };
  
  let scoreCount = 0;
  let totalScore = 0;
  
  // Extract scores from each phase
  for (const reflection of reflections) {
    const payload = reflection.payload;
    
    if (reflection.step === 'clarity') {
      const score = getNumber(payload, 'clarity_score');
      if (score !== undefined) {
        scores.clarity_score = score;
        totalScore += score;
        scoreCount++;
      }
    }
    
    if (reflection.step === 'ownership') {
      const score = getNumber(payload, 'ownership_score');
      if (score !== undefined) {
        scores.ownership_score = score;
        totalScore += score;
        scoreCount++;
      }
    }
    
    if (reflection.step === 'mapping') {
      const score = getNumber(payload, 'mapping_score');
      if (score !== undefined) {
        scores.mapping_score = score;
        totalScore += score;
        scoreCount++;
      }
    }
    
    if (reflection.step === 'practice') {
      const score = getNumber(payload, 'practice_score');
      if (score !== undefined) {
        scores.practice_score = score;
        totalScore += score;
        scoreCount++;
      }
    }
    
    // Anchoring removed in 4-step COMPASS
  }
  
  // Calculate overall readiness (average of provided scores)
  scores.overall_readiness = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : 0;
  
  return scores;
}

/**
 * Extract COMPASS transformation data
 */
export function extractCompassTransformation(
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): CompassTransformation | null {
  let initialState: EmotionalState | null = null;
  let finalState: EmotionalState | null = null;
  let pivotMoment: PivotMoment | null = null;
  const unlockFactors: string[] = [];
  
  // Extract initial emotional state from clarity
  const clarityReflection = reflections.find(r => r.step === 'clarity');
  if (clarityReflection !== undefined && clarityReflection !== null) {
    const state = getString(clarityReflection.payload, 'initial_emotional_state');
    if (state !== undefined) {
      initialState = state as EmotionalState;
    }
  }
  
  // Extract final emotional state from review
  const reviewReflection = reflections.find(r => r.step === 'review');
  if (reviewReflection !== undefined && reviewReflection !== null) {
    const state = getString(reviewReflection.payload, 'final_emotional_state');
    if (state !== undefined) {
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
• Confidence: ${Math.round(css.breakdown.confidence_score)}/100
• Action Clarity: ${Math.round(css.breakdown.action_score)}/100
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
  
  // Change Context Section (Enhanced with Success Vision)
  const clarityReflection = data.reflections.find(r => r.step === 'clarity');
  if (clarityReflection !== undefined && clarityReflection !== null) {
    const changeDesc = getString(clarityReflection.payload, 'change_description');
    const whyMatters = getString(clarityReflection.payload, 'why_it_matters');
    const successVision = getString(clarityReflection.payload, 'success_vision');
    const supporters = getArray<string>(clarityReflection.payload, 'supporters');
    const resistors = getArray<string>(clarityReflection.payload, 'resistors');
    
    const parts: string[] = [];
    
    if (changeDesc !== undefined) {
      parts.push(`📌 WHAT'S CHANGING:\n${changeDesc}`);
    }
    
    if (whyMatters !== undefined) {
      parts.push(`\n🎯 WHY IT MATTERS:\n${whyMatters}`);
    }
    
    if (successVision !== undefined) {
      parts.push(`\n✨ YOUR SUCCESS VISION:\n${successVision}`);
    }
    
    if (supporters !== undefined && supporters.length > 0) {
      parts.push(`\n✅ SUPPORTERS:\n${supporters.map(s => `• ${s}`).join('\n')}`);
    }
    
    if (resistors !== undefined && resistors.length > 0) {
      parts.push(`\n⚠️ RESISTORS:\n${resistors.map(r => `• ${r}`).join('\n')}`);
    }
    
    if (parts.length > 0) {
      sections.push({
        heading: '📋 CHANGE LANDSCAPE',
        content: parts.join('\n'),
        type: 'text'
      });
    }
  }
  
  // Personal Connection Section (Ownership)
  const ownershipReflection = data.reflections.find(r => r.step === 'ownership');
  if (ownershipReflection !== undefined && ownershipReflection !== null) {
    const personalBenefit = getString(ownershipReflection.payload, 'personal_benefit');
    const confidenceStart = getNumber(ownershipReflection.payload, 'initial_confidence');
    const confidenceCurrent = getNumber(ownershipReflection.payload, 'current_confidence');
    const parts: string[] = [];

    if (personalBenefit !== undefined) {
      parts.push(`💎 PERSONAL BENEFIT:\n${personalBenefit}`);
    }
    if (confidenceStart !== undefined || confidenceCurrent !== undefined) {
      const conf = [
        confidenceStart !== undefined ? `Start: ${confidenceStart}/10` : null,
        confidenceCurrent !== undefined ? `Now: ${confidenceCurrent}/10` : null
      ].filter(Boolean).join(' → ');
      if (conf.length > 0) {
        parts.push(`\n📈 CONFIDENCE PROGRESSION:\n${conf}`);
      }
    }

    if (parts.length > 0) {
      sections.push({
        heading: '💪 YOUR PERSONAL CONNECTION',
        content: parts.join('\n'),
        type: 'text'
      });
    }
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
  
  // Key Insights & Reflections Section (Review)
  const reviewReflection = data.reflections.find(r => r.step === 'review');
  if (reviewReflection !== undefined && reviewReflection !== null) {
    const keyInsights = getString(reviewReflection.payload, 'key_insights');
    const whatShifted = getString(reviewReflection.payload, 'what_shifted');
    const nextActions = getArray<string>(reviewReflection.payload, 'next_actions');
    const confidenceLevel = getNumber(reviewReflection.payload, 'confidence_level');
    
    // Key Insights
    if (keyInsights !== undefined) {
      sections.push({
        heading: '💡 YOUR KEY INSIGHTS',
        content: keyInsights,
        type: 'text'
      });
    }
    
    // What Shifted
    if (whatShifted !== undefined) {
      sections.push({
        heading: '🔄 WHAT SHIFTED FOR YOU',
        content: whatShifted,
        type: 'text'
      });
    }
    
    // Action Plan
    if (nextActions !== undefined && nextActions.length > 0) {
      const confidenceLevelStr = confidenceLevel !== undefined ? String(confidenceLevel) : 'N/A';
      sections.push({
        heading: '🎬 YOUR ACTION PLAN',
        content: `IMMEDIATE ACTIONS (Next 7 days):\n${nextActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n✊ Confidence Level: ${confidenceLevelStr}/10`,
        type: 'actions',
        data: { next_actions: nextActions, confidence_level: confidenceLevel }
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
  
  return {
    title: 'COMPASS Change Readiness Report',
    summary: `Overall Readiness: ${scores.overall_readiness}/5 | ${transformation?.transformation_achieved === true ? 'Transformation Achieved ✅' : 'In Progress'}`,
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


