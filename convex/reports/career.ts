/**
 * CAREER Framework Reports
 * Career Advancement & Readiness Coach
 * 
 * Generates session reports with Career Success Score (CaSS) calculation.
 */

import type { ReflectionPayload } from "../types";

// ============================================================================
// TYPE-SAFE HELPER FUNCTIONS
// ============================================================================

/**
 * Safely extract a string value from ReflectionPayload
 */
function getString(payload: ReflectionPayload, key: string, fallback: string = ''): string {
  const value = payload[key];
  return typeof value === 'string' ? value : fallback;
}

/**
 * Safely extract a number value from ReflectionPayload
 */
function getNumber(payload: ReflectionPayload, key: string, fallback: number = 0): number {
  const value = payload[key];
  return typeof value === 'number' ? value : fallback;
}

/**
 * Safely extract an array value from ReflectionPayload
 */
function getArray<T>(payload: ReflectionPayload, key: string): T[] {
  const value = payload[key];
  return Array.isArray(value) ? value as T[] : [];
}

/**
 * Safely extract a string property from an object
 */
function getObjectString(obj: unknown, key: string, fallback: string = 'N/A'): string {
  if (typeof obj === 'object' && obj !== null && key in obj) {
    const value = (obj as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : fallback;
  }
  return fallback;
}

// ============================================================================
// CAREER SUCCESS SCORE (CaSS) CALCULATION
// ============================================================================

interface CaSSBreakdown {
  confidence_delta: number;      // 0-1 (30% weight)
  clarity_score: number;          // 0-1 (25% weight)
  action_commitment: number;      // 0-1 (25% weight)
  gap_manageability: number;      // 0-1 (20% weight)
  total_score: number;            // 0-100
  success_level: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'MARGINAL' | 'INSUFFICIENT';
}

/**
 * Calculate Career Success Score (CaSS)
 * 
 * Formula:
 * CaSS = (
 *   (confidence_delta * 0.30) +
 *   (clarity_score * 0.25) +
 *   (action_commitment * 0.25) +
 *   (gap_manageability * 0.20)
 * ) * 100
 */
export function calculateCaSS(
  assessmentPayload: ReflectionPayload,
  gapAnalysisPayload: ReflectionPayload,
  roadmapPayload: ReflectionPayload,
  reviewPayload: ReflectionPayload
): CaSSBreakdown {
  // Extract scores using type-safe helpers
  const initialConfidence = getNumber(assessmentPayload, 'initial_confidence', 5);
  const finalConfidence = getNumber(reviewPayload, 'final_confidence', 5);
  const finalClarity = getNumber(reviewPayload, 'final_clarity', 5);
  const gapAnalysisScore = getNumber(gapAnalysisPayload, 'gap_analysis_score', 5);
  const roadmapScore = getNumber(roadmapPayload, 'roadmap_score', 5);

  // Normalize to 0-1 scale
  const confidenceDelta = (finalConfidence - initialConfidence) / 10;
  const clarityNormalized = finalClarity / 10;
  const actionCommitmentNormalized = roadmapScore / 10;
  const gapManageabilityNormalized = gapAnalysisScore / 10;

  // Calculate weighted score (0-100)
  const totalScore = (
    (confidenceDelta * 0.30) +
    (clarityNormalized * 0.25) +
    (actionCommitmentNormalized * 0.25) +
    (gapManageabilityNormalized * 0.20)
  ) * 100;

  // Determine success level
  let successLevel: CaSSBreakdown['success_level'];
  if (totalScore >= 90) {
    successLevel = 'EXCELLENT';
  } else if (totalScore >= 75) {
    successLevel = 'GOOD';
  } else if (totalScore >= 60) {
    successLevel = 'FAIR';
  } else if (totalScore >= 40) {
    successLevel = 'MARGINAL';
  } else {
    successLevel = 'INSUFFICIENT';
  }

  return {
    confidence_delta: confidenceDelta,
    clarity_score: clarityNormalized,
    action_commitment: actionCommitmentNormalized,
    gap_manageability: gapManageabilityNormalized,
    total_score: Math.round(totalScore),
    success_level: successLevel
  };
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

/**
 * Generate Career Development Session Report
 */
export function generateCareerReport(
  reflections: Array<{ step: string; payload: ReflectionPayload }>
): string {
  // Extract reflections by step
  const assessment = reflections.find(r => r.step === 'ASSESSMENT')?.payload;
  const gapAnalysis = reflections.find(r => r.step === 'GAP_ANALYSIS')?.payload;
  const roadmap = reflections.find(r => r.step === 'ROADMAP')?.payload;
  const review = reflections.find(r => r.step === 'REVIEW')?.payload;

  if (
    assessment === null || assessment === undefined ||
    gapAnalysis === null || gapAnalysis === undefined ||
    roadmap === null || roadmap === undefined ||
    review === null || review === undefined
  ) {
    return '# Career Development Session Report\n\n⚠️ Incomplete session - missing required steps.';
  }

  // Calculate CaSS
  const cass = calculateCaSS(assessment, gapAnalysis, roadmap, review);

  // Build report
  let report = '';

  // Header
  report += '# Career Development Session Report\n\n';

  // CaSS Score Section
  report += generateCaSSSection(cass, assessment, gapAnalysis, roadmap, review);

  // Success Indicators Section
  report += generateSuccessIndicatorsSection(cass, roadmap, review);

  // Career Target Section
  report += generateCareerTargetSection(assessment);

  // Gap Analysis Section
  report += generateGapAnalysisSection(gapAnalysis);

  // Roadmap Section
  report += generateRoadmapSection(roadmap);

  // Session Insights Section
  report += generateInsightsSection(review);

  // AI Insights Section
  report += generateAIInsightsSection(review);

  // Recommended Next Steps
  report += generateNextStepsSection(assessment, review);

  // Footer
  report += `\n---\n\n*Generated: ${new Date().toLocaleString()}*\n`;

  return report;
}

/**
 * Generate Success Indicators Section
 */
function generateSuccessIndicatorsSection(
  cass: CaSSBreakdown,
  roadmap: ReflectionPayload,
  review: ReflectionPayload
): string {
  const learningActions = getArray<unknown>(roadmap, 'learning_actions');
  const networkingActions = getArray<unknown>(roadmap, 'networking_actions');
  const immediateNextStep = getString(review, 'immediate_next_step');
  const confidenceDelta = cass.confidence_delta;

  let section = '## 🎯 Success Indicators\n\n';
  section += 'These indicators suggest your likelihood of success:\n\n';

  // Plan comprehensiveness
  if (learningActions.length >= 5) {
    section += '✅ **Comprehensive learning plan** - You have multiple pathways to skill development\n';
  } else if (learningActions.length >= 3) {
    section += '⚠️ **Basic learning plan** - Consider adding more learning actions for backup options\n';
  } else if (learningActions.length > 0) {
    section += '⚠️ **Limited learning plan** - More learning actions would increase your chances\n';
  }

  // Network building
  if (networkingActions.length >= 3) {
    section += '✅ **Active networking strategy** - You\'re building connections proactively\n';
  } else if (networkingActions.length > 0) {
    section += '⚠️ **Limited networking** - Career transitions often require stronger networks\n';
  } else {
    section += '⚠️ **No networking plan** - Building connections is critical for career transitions\n';
  }

  // Immediate action
  if (immediateNextStep.length > 10) {
    section += '✅ **Clear next step** - You have immediate action within 48 hours\n';
  } else {
    section += '⚠️ **Vague next step** - Clarify your immediate action for momentum\n';
  }

  // Confidence trajectory
  if (confidenceDelta > 0.3) {
    section += '✅ **Strong confidence gain** - The session significantly boosted your readiness\n';
  } else if (confidenceDelta >= 0) {
    section += '👍 **Confidence maintained** - You have a realistic view of the transition\n';
  } else {
    section += '⚠️ **Confidence decreased** - This may indicate unrealistic expectations or gaps you hadn\'t considered\n';
  }

  section += '\n---\n\n';

  return section;
}

/**
 * Generate CaSS Score Section
 */
function generateCaSSSection(
  cass: CaSSBreakdown,
  assessment: ReflectionPayload,
  gapAnalysis: ReflectionPayload,
  roadmap: ReflectionPayload,
  review: ReflectionPayload
): string {
  const badges = {
    EXCELLENT: '🌟',
    GOOD: '✅',
    FAIR: '👍',
    MARGINAL: '⚠️',
    INSUFFICIENT: '❌'
  };

  const messages = {
    EXCELLENT: 'Outstanding readiness! You have a clear path and strong commitment.',
    GOOD: 'Strong foundation. You\'re well-prepared to execute your plan.',
    FAIR: 'Solid start. Some areas need refinement for optimal success.',
    MARGINAL: 'Significant gaps remain. Consider additional planning or support.',
    INSUFFICIENT: 'More exploration needed. Revisit your goals and approach.'
  };

  let section = '## 📊 Career Success Score (CaSS)\n\n';
  section += `**Score: ${cass.total_score}/100** ${badges[cass.success_level]} **${cass.success_level}**\n\n`;
  section += `*${messages[cass.success_level]}*\n\n`;
  
  section += '**Dimension Breakdown:**\n\n';
  section += `- **Confidence Growth:** ${getNumber(assessment, 'initial_confidence', 0)}/10 → ${getNumber(review, 'final_confidence', 0)}/10 `;
  section += `(${cass.confidence_delta >= 0 ? '+' : ''}${Math.round(cass.confidence_delta * 10)})\n`;
  section += `- **Path Clarity:** ${getNumber(review, 'final_clarity', 0)}/10\n`;
  section += `- **Action Commitment:** ${getNumber(roadmap, 'roadmap_score', 0)}/10\n`;
  section += `- **Gap Manageability:** ${getNumber(gapAnalysis, 'gap_analysis_score', 0)}/10\n\n`;
  
  section += '---\n\n';
  
  return section;
}

/**
 * Generate Career Target Section
 */
function generateCareerTargetSection(assessment: ReflectionPayload): string {
  let section = '## 🎯 Career Target\n\n';
  
  section += '**Current Position:**\n\n';
  section += `- **Role:** ${getString(assessment, 'current_role', 'Not specified')}\n`;
  section += `- **Industry:** ${getString(assessment, 'industry', 'Not specified')}\n`;
  section += `- **Experience:** ${getNumber(assessment, 'years_experience', 0)} years\n`;
  
  // Format career level with human-readable labels
  const careerLevel = getString(assessment, 'career_stage', 'Not specified');
  const levelLabels: Record<string, string> = {
    'entry_level': 'Entry Level',
    'middle_manager': 'Middle Manager',
    'senior_manager': 'Senior Manager',
    'executive': 'Executive',
    'founder': 'Founder/Entrepreneur'
  };
  const formattedLevel = careerLevel.length > 0 ? (levelLabels[careerLevel] ?? careerLevel) : 'Not specified';
  section += `- **Current Level:** ${formattedLevel}\n\n`;
  
  section += '**Target Position:**\n\n';
  section += `- **Role:** ${getString(assessment, 'target_role', 'Not specified')}\n`;
  section += `- **Timeframe:** ${getString(assessment, 'timeframe', 'Not specified')}\n`;
  section += `- **Initial Confidence:** ${getNumber(assessment, 'initial_confidence', 0)}/10\n\n`;
  
  section += '---\n\n';
  
  return section;
}

/**
 * Generate Gap Analysis Section
 */
function generateGapAnalysisSection(gapAnalysis: ReflectionPayload): string {
  let section = '## 📋 Gap Analysis\n\n';
  
  // Skills to Develop
  section += '### Skills to Develop\n\n';
  const skillGaps = getArray<string>(gapAnalysis, 'skill_gaps');
  if (skillGaps.length > 0) {
    skillGaps.forEach((skill) => {
      section += `- ${skill}\n`;
    });
  } else {
    section += '*No skill gaps identified*\n';
  }
  section += '\n';
  
  // Experience Needed
  section += '### Experience Needed\n\n';
  const experienceGaps = getArray<string>(gapAnalysis, 'experience_gaps');
  if (experienceGaps.length > 0) {
    experienceGaps.forEach((exp) => {
      section += `- ${exp}\n`;
    });
  } else {
    section += '*No experience gaps identified*\n';
  }
  section += '\n';
  
  // Transferable Strengths
  section += '### Transferable Strengths\n\n';
  const transferableSkills = getArray<string>(gapAnalysis, 'transferable_skills');
  if (transferableSkills.length > 0) {
    transferableSkills.forEach((skill) => {
      section += `- ${skill}\n`;
    });
  } else {
    section += '*No transferable skills identified*\n';
  }
  section += '\n';
  
  // Top 3 Development Priorities
  section += '### Top 3 Development Priorities\n\n';
  const priorities = getArray<string>(gapAnalysis, 'development_priorities');
  if (priorities.length > 0) {
    priorities.forEach((priority, index) => {
      section += `${index + 1}. ${priority}\n`;
    });
  } else {
    section += '*No priorities set*\n';
  }
  section += '\n';
  
  section += '---\n\n';
  
  return section;
}

/**
 * Generate Roadmap Section
 */
function generateRoadmapSection(roadmap: ReflectionPayload): string {
  let section = '## 🗺️ Career Roadmap\n\n';
  
  // Learning Actions
  section += '### Learning Actions\n\n';
  const learningActions = getArray<unknown>(roadmap, 'learning_actions');
  if (learningActions.length > 0) {
    section += '| Action | Timeline | Resource |\n';
    section += '|--------|----------|----------|\n';
    learningActions.forEach((action) => {
      section += `| ${getObjectString(action, 'action')} | ${getObjectString(action, 'timeline')} | ${getObjectString(action, 'resource')} |\n`;
    });
  } else {
    section += '*No learning actions planned*\n';
  }
  section += '\n';
  
  // Networking Actions
  section += '### Networking Actions\n\n';
  const networkingActions = getArray<unknown>(roadmap, 'networking_actions');
  if (networkingActions.length > 0) {
    section += '| Action | Timeline |\n';
    section += '|--------|----------|\n';
    networkingActions.forEach((action) => {
      section += `| ${getObjectString(action, 'action')} | ${getObjectString(action, 'timeline')} |\n`;
    });
  } else {
    section += '*No networking actions planned*\n';
  }
  section += '\n';
  
  // Experience-Building Actions
  section += '### Experience-Building Actions\n\n';
  const experienceActions = getArray<unknown>(roadmap, 'experience_actions');
  if (experienceActions.length > 0) {
    section += '| Action | Timeline |\n';
    section += '|--------|----------|\n';
    experienceActions.forEach((action) => {
      section += `| ${getObjectString(action, 'action')} | ${getObjectString(action, 'timeline')} |\n`;
    });
  } else {
    section += '*No experience actions planned*\n';
  }
  section += '\n';
  
  // Milestones
  section += '### Milestones\n\n';
  section += `- **3 Months:** ${getString(roadmap, 'milestone_3_months', 'Not set')}\n`;
  section += `- **6 Months:** ${getString(roadmap, 'milestone_6_months', 'Not set')}\n\n`;
  
  section += '---\n\n';
  
  return section;
}

/**
 * Generate AI Insights Section
 */
function generateAIInsightsSection(review: ReflectionPayload): string {
  const aiInsights = getString(review, 'ai_insights');
  const hiddenOpportunities = getArray<string>(review, 'hidden_opportunities');
  const potentialObstacles = getArray<string>(review, 'potential_obstacles');
  const successAccelerators = getArray<string>(review, 'success_accelerators');
  
  // Only show section if AI insights were generated
  if (aiInsights.length === 0 && hiddenOpportunities.length === 0 && potentialObstacles.length === 0 && successAccelerators.length === 0) {
    return '';
  }
  
  let section = '## 🤖 AI-Powered Career Insights\n\n';
  
  // Main insights
  if (aiInsights.length > 0) {
    section += `${aiInsights}\n\n`;
  }
  
  // Hidden opportunities
  if (hiddenOpportunities.length > 0) {
    section += '### 💎 Hidden Opportunities\n\n';
    section += '*Opportunities you may have overlooked:*\n\n';
    hiddenOpportunities.forEach((opportunity) => {
      section += `- ${opportunity}\n`;
    });
    section += '\n';
  }
  
  // Potential obstacles
  if (potentialObstacles.length > 0) {
    section += '### ⚠️ Potential Obstacles\n\n';
    section += '*Risks to prepare for:*\n\n';
    potentialObstacles.forEach((obstacle) => {
      section += `- ${obstacle}\n`;
    });
    section += '\n';
  }
  
  // Success accelerators
  if (successAccelerators.length > 0) {
    section += '### 🚀 Success Accelerators\n\n';
    section += '*High-leverage actions to prioritize:*\n\n';
    successAccelerators.forEach((accelerator) => {
      section += `- ${accelerator}\n`;
    });
    section += '\n';
  }
  
  section += '---\n\n';
  
  return section;
}

/**
 * Generate Session Insights Section
 */
function generateInsightsSection(review: ReflectionPayload): string {
  let section = '## 💡 Session Insights\n\n';
  
  section += '**Key Takeaways:**\n\n';
  section += `${getString(review, 'key_takeaways', 'Not provided')}\n\n`;
  
  section += '**Immediate Next Step (48 hours):**\n\n';
  section += `${getString(review, 'immediate_next_step', 'Not specified')}\n\n`;
  
  const biggestChallenge = getString(review, 'biggest_challenge', '');
  if (biggestChallenge.length > 0) {
    section += '**Biggest Challenge:**\n\n';
    section += `${biggestChallenge}\n\n`;
  }
  
  section += '**Final Confidence:** ';
  section += `${getNumber(review, 'final_confidence', 0)}/10\n\n`;
  
  section += '**Path Clarity:** ';
  section += `${getNumber(review, 'final_clarity', 0)}/10\n\n`;
  
  section += '**Session Helpfulness:** ';
  section += `${getNumber(review, 'session_helpfulness', 0)}/10\n\n`;
  
  section += '---\n\n';
  
  return section;
}

/**
 * Generate Recommended Next Steps Section
 */
function generateNextStepsSection(
  assessment: ReflectionPayload,
  review: ReflectionPayload
): string {
  let section = '## 📈 Recommended Next Steps\n\n';
  
  section += `1. **Execute your immediate next step within 48 hours:** ${getString(review, 'immediate_next_step', 'Review your plan')}\n`;
  section += '2. **Schedule your first learning action** from your roadmap\n';
  section += '3. **Reach out for your first networking action** to build connections\n';
  section += '4. **Review progress at 3-month milestone** to assess if you\'re on track\n';
  
  // Calculate follow-up timeframe
  const timeframe = assessment['timeframe'] as string | undefined;
  let followUpSuggestion = '6 months';
  if (timeframe === '3-6 months') {
    followUpSuggestion = '3 months';
  } else if (timeframe === '6-12 months') {
    followUpSuggestion = '6 months';
  } else if (timeframe === '1-2 years') {
    followUpSuggestion = '6 months';
  }
  
  section += `5. **Consider a follow-up Career Coach session in ${followUpSuggestion}** to reassess and adjust\n\n`;
  
  return section;
}
