/**
 * CAREER Framework Reports
 * Career Advancement & Readiness Coach
 * 
 * Generates session reports with Career Success Score (CaSS) calculation.
 */

import type { ReflectionPayload } from "../types";
import type { SessionReportData, FormattedReport, FrameworkReportGenerator, ReportSection } from './types';

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

// ============================================================================
// CAREER REPORT GENERATOR CLASS
// ============================================================================

/**
 * CAREER Report Generator Class
 * Implements FrameworkReportGenerator interface
 */
export class CareerReportGenerator implements FrameworkReportGenerator {
  generateReport(data: SessionReportData): FormattedReport {
    // Extract reflections by step - use LAST reflection for each step as data accumulates
    const assessmentReflections = data.reflections.filter(r => r.step === 'ASSESSMENT');
    const assessment = assessmentReflections[assessmentReflections.length - 1]?.payload;
    
    const gapAnalysisReflections = data.reflections.filter(r => r.step === 'GAP_ANALYSIS');
    const gapAnalysis = gapAnalysisReflections[gapAnalysisReflections.length - 1]?.payload;
    
    const roadmapReflections = data.reflections.filter(r => r.step === 'ROADMAP');
    const roadmap = roadmapReflections[roadmapReflections.length - 1]?.payload;
    
    const reviewReflections = data.reflections.filter(r => r.step === 'REVIEW');
    const review = reviewReflections[reviewReflections.length - 1]?.payload;

    if (
      assessment === null || assessment === undefined ||
      gapAnalysis === null || gapAnalysis === undefined ||
      roadmap === null || roadmap === undefined ||
      review === null || review === undefined
    ) {
      return {
        title: 'Career Development Session Report',
        summary: '⚠️ Incomplete session - missing required steps',
        sections: []
      };
    }

    // Calculate CaSS
    const cass = calculateCaSS(assessment, gapAnalysis, roadmap, review);
    
    // Build structured sections array
    const sections: ReportSection[] = [];
    
    // 1. CaSS Score Section
    sections.push({
      heading: '📊 Career Success Score (CaSS)',
      content: generateCaSSContent(cass, assessment, gapAnalysis, roadmap, review),
      type: 'scores' as const
    });
    
    // 2. Success Indicators
    sections.push({
      heading: '🎯 Success Indicators',
      content: generateSuccessIndicatorsContent(cass, roadmap, review),
      type: 'insights' as const
    });
    
    // 3. Career Target
    sections.push({
      heading: '🎯 Career Target',
      content: generateCareerTargetContent(assessment),
      type: 'text' as const
    });
    
    // 4. Gap Analysis
    sections.push({
      heading: '📋 Gap Analysis',
      content: generateGapAnalysisContent(gapAnalysis),
      type: 'text' as const
    });
    
    // 5. Roadmap
    sections.push({
      heading: '🗺️ Career Roadmap',
      content: generateRoadmapContent(roadmap),
      type: 'actions' as const
    });
    
    // 6. Session Insights
    sections.push({
      heading: '💡 Session Insights',
      content: generateInsightsContent(review),
      type: 'text' as const
    });
    
    // 7. AI Insights (if available)
    const aiInsightsContent = generateAIInsightsContent(review);
    if (aiInsightsContent.length > 0) {
      sections.push({
        heading: '🤖 AI-Powered Career Insights',
        content: aiInsightsContent,
        type: 'insights' as const
      });
    }
    
    // 8. Skill Development Resources (NEW)
    sections.push({
      heading: '📚 Skill Development Resources',
      content: generateSkillResourcesContent(gapAnalysis, assessment),
      type: 'text' as const
    });
    
    // 9. Role Success Metrics (NEW)
    sections.push({
      heading: '🎯 Success Metrics for Your Target Role',
      content: generateRoleSuccessMetricsContent(assessment, gapAnalysis),
      type: 'text' as const
    });
    
    // 10. Industry Insights (NEW)
    sections.push({
      heading: '🌐 Industry & Market Insights',
      content: generateIndustryInsightsContent(assessment),
      type: 'text' as const
    });
    
    // 11. Networking Strategy (NEW)
    sections.push({
      heading: '🤝 Your Networking Strategy',
      content: generateNetworkingStrategyContent(assessment, roadmap),
      type: 'actions' as const
    });
    
    // 12. Interview Preparation (NEW)
    sections.push({
      heading: '🎓 Interview Preparation Guide',
      content: generateInterviewPrepContent(assessment, gapAnalysis, review),
      type: 'text' as const
    });
    
    // 13. Next Steps
    sections.push({
      heading: '📈 Recommended Next Steps',
      content: generateNextStepsContent(assessment, review),
      type: 'actions' as const
    });
    
    const badges = {
      EXCELLENT: '🌟',
      GOOD: '✅',
      FAIR: '👍',
      MARGINAL: '⚠️',
      INSUFFICIENT: '❌'
    };
    
    return {
      title: 'Career Development Session Report',
      summary: `CaSS Score: ${cass.total_score}/100 ${badges[cass.success_level]} | ${getString(assessment, 'current_role')} → ${getString(assessment, 'target_role')}`,
      sections
    };
  }
}

// Helper functions to generate section content (plain text, not markdown)
function generateCaSSContent(
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

  let content = `Score: ${cass.total_score}/100 ${badges[cass.success_level]} ${cass.success_level}\n\n`;
  content += `${messages[cass.success_level]}\n\n`;
  content += `Dimension Breakdown:\n`;
  content += `• Confidence Growth: ${getNumber(assessment, 'initial_confidence', 0)}/10 → ${getNumber(review, 'final_confidence', 0)}/10 `;
  content += `(${cass.confidence_delta >= 0 ? '+' : ''}${Math.round(cass.confidence_delta * 10)})\n`;
  content += `• Path Clarity: ${getNumber(review, 'final_clarity', 0)}/10\n`;
  content += `• Action Commitment: ${getNumber(roadmap, 'roadmap_score', 0)}/10\n`;
  content += `• Gap Manageability: ${getNumber(gapAnalysis, 'gap_analysis_score', 0)}/10`;
  
  return content;
}

function generateSuccessIndicatorsContent(
  cass: CaSSBreakdown,
  roadmap: ReflectionPayload,
  review: ReflectionPayload
): string {
  const learningActions = getArray<unknown>(roadmap, 'learning_actions');
  const networkingActions = getArray<unknown>(roadmap, 'networking_actions');
  const immediateNextStep = getString(review, 'immediate_next_step');
  const confidenceDelta = cass.confidence_delta;

  let content = 'These indicators suggest your likelihood of success:\n\n';

  // Plan comprehensiveness
  if (learningActions.length >= 5) {
    content += '✅ Comprehensive learning plan - You have multiple pathways to skill development\n';
  } else if (learningActions.length >= 3) {
    content += '⚠️ Basic learning plan - Consider adding more learning actions for backup options\n';
  } else if (learningActions.length > 0) {
    content += '⚠️ Limited learning plan - More learning actions would increase your chances\n';
  }

  // Network building
  if (networkingActions.length >= 3) {
    content += '✅ Active networking strategy - You\'re building connections proactively\n';
  } else if (networkingActions.length > 0) {
    content += '⚠️ Limited networking - Career transitions often require stronger networks\n';
  } else {
    content += '⚠️ No networking plan - Building connections is critical for career transitions\n';
  }

  // Immediate action
  if (immediateNextStep.length > 10) {
    content += '✅ Clear next step - You have immediate action within 48 hours\n';
  } else {
    content += '⚠️ Vague next step - Clarify your immediate action for momentum\n';
  }

  // Confidence trajectory
  if (confidenceDelta > 0.3) {
    content += '✅ Strong confidence gain - The session significantly boosted your readiness';
  } else if (confidenceDelta >= 0) {
    content += '👍 Confidence maintained - You have a realistic view of the transition';
  } else {
    content += '⚠️ Confidence decreased - This may indicate unrealistic expectations or gaps you hadn\'t considered';
  }

  return content;
}

function generateCareerTargetContent(assessment: ReflectionPayload): string {
  const careerLevel = getString(assessment, 'career_stage', 'Not specified');
  const levelLabels: Record<string, string> = {
    'entry_level': 'Entry Level',
    'middle_manager': 'Middle Manager',
    'senior_manager': 'Senior Manager',
    'executive': 'Executive',
    'founder': 'Founder/Entrepreneur'
  };
  const formattedLevel = careerLevel.length > 0 ? (levelLabels[careerLevel] ?? careerLevel) : 'Not specified';
  
  let content = 'Current Position:\n';
  content += `• Role: ${getString(assessment, 'current_role', 'Not specified')}\n`;
  content += `• Industry: ${getString(assessment, 'industry', 'Not specified')}\n`;
  content += `• Experience: ${getNumber(assessment, 'years_experience', 0)} years\n`;
  content += `• Current Level: ${formattedLevel}\n\n`;
  
  content += 'Target Position:\n';
  content += `• Role: ${getString(assessment, 'target_role', 'Not specified')}\n`;
  content += `• Timeframe: ${getString(assessment, 'timeframe', 'Not specified')}\n`;
  content += `• Initial Confidence: ${getNumber(assessment, 'initial_confidence', 0)}/10`;
  
  return content;
}

function generateGapAnalysisContent(gapAnalysis: ReflectionPayload): string {
  let content = '';
  
  // Skills to Develop
  content += 'Skills to Develop:\n';
  const skillGaps = getArray<string>(gapAnalysis, 'skill_gaps');
  if (skillGaps.length > 0) {
    skillGaps.forEach((skill) => {
      content += `• ${skill}\n`;
    });
  } else {
    content += 'No skill gaps identified\n';
  }
  content += '\n';
  
  // Experience Needed
  content += 'Experience Needed:\n';
  const experienceGaps = getArray<string>(gapAnalysis, 'experience_gaps');
  if (experienceGaps.length > 0) {
    experienceGaps.forEach((exp) => {
      content += `• ${exp}\n`;
    });
  } else {
    content += 'No experience gaps identified\n';
  }
  content += '\n';
  
  // Transferable Strengths
  content += 'Transferable Strengths:\n';
  const transferableSkills = getArray<string>(gapAnalysis, 'transferable_skills');
  if (transferableSkills.length > 0) {
    transferableSkills.forEach((skill) => {
      content += `• ${skill}\n`;
    });
  } else {
    content += 'No transferable skills identified\n';
  }
  content += '\n';
  
  // Top Development Priorities
  content += 'Top Development Priorities:\n';
  const priorities = getArray<string>(gapAnalysis, 'development_priorities');
  if (priorities.length > 0) {
    priorities.forEach((priority, index) => {
      content += `${index + 1}. ${priority}\n`;
    });
  } else {
    content += 'No priorities set';
  }
  
  return content;
}

function generateRoadmapContent(roadmap: ReflectionPayload): string {
  let content = '';
  
  // Learning Actions
  content += 'Learning Actions:\n';
  const learningActions = getArray<unknown>(roadmap, 'learning_actions');
  if (learningActions.length > 0) {
    learningActions.forEach((action) => {
      content += `• ${getObjectString(action, 'action')} (${getObjectString(action, 'timeline')}) - ${getObjectString(action, 'resource')}\n`;
    });
  } else {
    content += 'No learning actions planned\n';
  }
  content += '\n';
  
  // Networking Actions
  content += 'Networking Actions:\n';
  const networkingActions = getArray<unknown>(roadmap, 'networking_actions');
  if (networkingActions.length > 0) {
    networkingActions.forEach((action) => {
      content += `• ${getObjectString(action, 'action')} (${getObjectString(action, 'timeline')})\n`;
    });
  } else {
    content += 'No networking actions planned\n';
  }
  content += '\n';
  
  // Experience-Building Actions
  content += 'Experience-Building Actions:\n';
  const experienceActions = getArray<unknown>(roadmap, 'experience_actions');
  if (experienceActions.length > 0) {
    experienceActions.forEach((action) => {
      content += `• ${getObjectString(action, 'action')} (${getObjectString(action, 'timeline')})\n`;
    });
  } else {
    content += 'No experience actions planned\n';
  }
  content += '\n';
  
  // Milestones
  content += 'Milestones:\n';
  content += `• 3 Months: ${getString(roadmap, 'milestone_3_months', 'Not set')}\n`;
  content += `• 6 Months: ${getString(roadmap, 'milestone_6_months', 'Not set')}`;
  
  return content;
}

function generateInsightsContent(review: ReflectionPayload): string {
  let content = '';
  
  content += 'Key Takeaways:\n';
  content += `${getString(review, 'key_takeaways', 'Not provided')}\n\n`;
  
  content += 'Immediate Next Step (48 hours):\n';
  content += `${getString(review, 'immediate_next_step', 'Not specified')}\n\n`;
  
  const biggestChallenge = getString(review, 'biggest_challenge', '');
  if (biggestChallenge.length > 0) {
    content += 'Biggest Challenge:\n';
    content += `${biggestChallenge}\n\n`;
  }
  
  content += `Final Confidence: ${getNumber(review, 'final_confidence', 0)}/10\n`;
  content += `Path Clarity: ${getNumber(review, 'final_clarity', 0)}/10\n`;
  content += `Session Helpfulness: ${getNumber(review, 'session_helpfulness', 0)}/10`;
  
  return content;
}

function generateAIInsightsContent(review: ReflectionPayload): string {
  const aiInsights = getString(review, 'ai_insights');
  const hiddenOpportunities = getArray<string>(review, 'hidden_opportunities');
  const potentialObstacles = getArray<string>(review, 'potential_obstacles');
  const successAccelerators = getArray<string>(review, 'success_accelerators');
  
  // Only generate if AI insights were provided
  if (aiInsights.length === 0 && hiddenOpportunities.length === 0 && potentialObstacles.length === 0 && successAccelerators.length === 0) {
    return '';
  }
  
  let content = '';
  
  // Main insights
  if (aiInsights.length > 0) {
    content += `${aiInsights}\n\n`;
  }
  
  // Hidden opportunities
  if (hiddenOpportunities.length > 0) {
    content += '💎 Hidden Opportunities:\n';
    hiddenOpportunities.forEach((opportunity) => {
      content += `• ${opportunity}\n`;
    });
    content += '\n';
  }
  
  // Potential obstacles
  if (potentialObstacles.length > 0) {
    content += '⚠️ Potential Obstacles:\n';
    potentialObstacles.forEach((obstacle) => {
      content += `• ${obstacle}\n`;
    });
    content += '\n';
  }
  
  // Success accelerators
  if (successAccelerators.length > 0) {
    content += '🚀 Success Accelerators:\n';
    successAccelerators.forEach((accelerator) => {
      content += `• ${accelerator}\n`;
    });
  }
  
  return content.trim();
}

function generateNextStepsContent(
  assessment: ReflectionPayload,
  review: ReflectionPayload
): string {
  let content = '';
  
  content += `1. Execute your immediate next step within 48 hours: ${getString(review, 'immediate_next_step', 'Review your plan')}\n`;
  content += '2. Schedule your first learning action from your roadmap\n';
  content += '3. Reach out for your first networking action to build connections\n';
  content += '4. Review progress at 3-month milestone to assess if you\'re on track\n';
  
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
  
  content += `5. Consider a follow-up Career Coach session in ${followUpSuggestion} to reassess and adjust`;
  
  return content;
}

// ============================================================================
// NEW ENHANCED REPORT SECTIONS
// ============================================================================

/**
 * 1. Skill Development Resources
 * Provides actionable learning paths for each skill gap
 */
function generateSkillResourcesContent(
  gapAnalysis: ReflectionPayload,
  assessment: ReflectionPayload
): string {
  const skillGaps = getArray<string>(gapAnalysis, 'skill_gaps');
  const targetRole = getString(assessment, 'target_role', 'your target role');
  
  if (skillGaps.length === 0) {
    return `No specific skill gaps identified. Focus on deepening expertise in your current strengths and staying current with ${targetRole} best practices.`;
  }
  
  let content = `For each skill gap, consider these development approaches:\n\n`;
  
  skillGaps.forEach((skill, index) => {
    content += `${index + 1}. ${skill}\n`;
    content += `   • Online Learning: Search for "${skill}" courses on Coursera, LinkedIn Learning, or Udemy\n`;
    content += `   • Books/Articles: Look for top-rated books on Amazon or articles on Medium/Harvard Business Review\n`;
    content += `   • Practice: Seek projects in your current role or volunteer opportunities to apply this skill\n`;
    content += `   • Mentorship: Connect with someone who excels in ${skill} for guidance\n`;
    content += `   • Time Investment: Typically 2-4 months to gain proficiency (5-10 hours/week)\n\n`;
  });
  
  content += `💡 Pro Tip: Focus on your top 1-2 priority skills first. Mastering a few skills deeply is more valuable than surface-level knowledge of many.`;
  
  return content;
}

/**
 * 2. Role Success Metrics
 * Defines what success looks like in the target role
 */
function generateRoleSuccessMetricsContent(
  assessment: ReflectionPayload,
  gapAnalysis: ReflectionPayload
): string {
  const targetRole = getString(assessment, 'target_role', 'your target role');
  const priorities = getArray<string>(gapAnalysis, 'development_priorities');
  
  let content = `Understanding how success is measured in ${targetRole} roles:\n\n`;
  
  // Generic success dimensions that apply to most roles
  content += `Key Performance Areas:\n`;
  content += `• Results Delivery: Meeting or exceeding role-specific targets and objectives\n`;
  content += `• Strategic Impact: Contributing to organizational goals and long-term success\n`;
  content += `• Team Leadership: Building, developing, and inspiring high-performing teams\n`;
  content += `• Stakeholder Management: Building trust and credibility with key stakeholders\n`;
  content += `• Innovation & Improvement: Driving process improvements and innovative solutions\n\n`;
  
  content += `Your First 90 Days in ${targetRole}:\n`;
  content += `Week 1-4: Learn & Listen\n`;
  content += `• Understand team dynamics, key processes, and immediate priorities\n`;
  content += `• Schedule 1-on-1s with direct reports, peers, and key stakeholders\n`;
  content += `• Identify quick wins and potential challenges\n\n`;
  
  content += `Week 5-8: Build & Plan\n`;
  content += `• Develop your 90-day action plan based on what you learned\n`;
  content += `• Start implementing quick wins to build credibility\n`;
  content += `• Establish your working style and communication norms\n\n`;
  
  content += `Week 9-12: Execute & Deliver\n`;
  content += `• Deliver on your first major initiative or improvement\n`;
  content += `• Build momentum with visible progress\n`;
  content += `• Set foundation for long-term strategic initiatives\n\n`;
  
  if (priorities.length > 0) {
    content += `Your Development Priorities Align With:\n`;
    priorities.forEach((priority) => {
      content += `• ${priority} - Critical for ${targetRole} success\n`;
    });
  }
  
  return content;
}

/**
 * 3. Industry & Market Insights
 * Provides context about the industry and market trends
 */
function generateIndustryInsightsContent(assessment: ReflectionPayload): string {
  const industry = getString(assessment, 'industry', 'your industry');
  const targetRole = getString(assessment, 'target_role', 'your target role');
  const timeframe = getString(assessment, 'timeframe', '6-12 months');
  
  let content = `Market Context for ${targetRole} in ${industry}:\n\n`;
  
  content += `Industry Research Checklist:\n`;
  content += `□ Industry Trends: Research current trends affecting ${industry} (use Google Trends, industry reports)\n`;
  content += `□ Key Players: Identify top 10-20 companies in ${industry} hiring for ${targetRole}\n`;
  content += `□ Salary Benchmarks: Use Glassdoor, Payscale, or LinkedIn Salary to research ${targetRole} compensation\n`;
  content += `□ Required Certifications: Check job postings to see common certifications for ${targetRole}\n`;
  content += `□ Emerging Skills: Identify skills becoming more important (AI, data analytics, etc.)\n\n`;
  
  content += `Professional Development:\n`;
  content += `• Join industry associations related to ${industry} and ${targetRole}\n`;
  content += `• Subscribe to industry newsletters and podcasts\n`;
  content += `• Attend 2-3 industry conferences or webinars in the next ${timeframe}\n`;
  content += `• Follow thought leaders in ${industry} on LinkedIn and Twitter\n\n`;
  
  content += `Competitive Positioning:\n`;
  content += `• Identify your unique value proposition for ${targetRole} roles\n`;
  content += `• Understand what differentiates you from other candidates\n`;
  content += `• Build a personal brand that showcases your expertise\n`;
  content += `• Create content (articles, posts) demonstrating your knowledge`;
  
  return content;
}

/**
 * 4. Networking Strategy
 * Actionable networking plan with templates
 */
function generateNetworkingStrategyContent(
  assessment: ReflectionPayload,
  roadmap: ReflectionPayload
): string {
  const targetRole = getString(assessment, 'target_role', 'your target role');
  const industry = getString(assessment, 'industry', 'your industry');
  const networkingActions = getArray<unknown>(roadmap, 'networking_actions');
  
  let content = `Strategic networking is critical for career transitions. Here's your action plan:\n\n`;
  
  content += `Target Connections (Next 30 Days):\n`;
  content += `□ 3-5 people currently in ${targetRole} roles (informational interviews)\n`;
  content += `□ 2-3 recruiters specializing in ${industry} or ${targetRole} placements\n`;
  content += `□ 1-2 mentors who have made similar career transitions\n`;
  content += `□ Join 2-3 professional groups/communities related to ${targetRole}\n\n`;
  
  content += `LinkedIn Outreach Template:\n`;
  content += `"Hi [Name],\n\n`;
  content += `I came across your profile and was impressed by your experience as ${targetRole} in ${industry}. `;
  content += `I'm currently transitioning toward a ${targetRole} role and would love to learn from your journey.\n\n`;
  content += `Would you be open to a brief 20-minute virtual coffee chat? I'm particularly interested in [specific topic related to their experience].\n\n`;
  content += `Thank you for considering!\n`;
  content += `Best regards,\n`;
  content += `[Your Name]"\n\n`;
  
  content += `Coffee Chat Question Framework:\n`;
  content += `1. "What does a typical day/week look like in your ${targetRole} role?"\n`;
  content += `2. "What skills have been most critical to your success?"\n`;
  content += `3. "What surprised you most when you transitioned to this role?"\n`;
  content += `4. "What advice would you give someone making this transition?"\n`;
  content += `5. "Are there any resources (books, courses, people) you'd recommend?"\n\n`;
  
  if (networkingActions.length > 0) {
    content += `Your Planned Networking Actions:\n`;
    networkingActions.forEach((action) => {
      const actionStr = getObjectString(action, 'action');
      const timeline = getObjectString(action, 'timeline');
      content += `• ${actionStr}${timeline.length > 0 ? ` (${timeline})` : ''}\n`;
    });
    content += `\n`;
  }
  
  content += `Networking Best Practices:\n`;
  content += `• Always follow up within 24 hours with a thank you message\n`;
  content += `• Offer value before asking for favors (share articles, make introductions)\n`;
  content += `• Keep conversations focused on learning, not job hunting\n`;
  content += `• Build genuine relationships, not transactional connections`;
  
  return content;
}

/**
 * 6. Interview Preparation Guide
 * Role-specific interview preparation framework
 */
function generateInterviewPrepContent(
  assessment: ReflectionPayload,
  gapAnalysis: ReflectionPayload,
  review: ReflectionPayload
): string {
  const targetRole = getString(assessment, 'target_role', 'your target role');
  const currentRole = getString(assessment, 'current_role', 'your current role');
  const transferableSkills = getArray<string>(gapAnalysis, 'transferable_skills');
  const keyTakeaways = getString(review, 'key_takeaways', '');
  
  let content = `Prepare for ${targetRole} interviews with this comprehensive guide:\n\n`;
  
  content += `Core Interview Questions You'll Face:\n\n`;
  
  content += `1. "Tell me about yourself and why you're interested in this ${targetRole} role."\n`;
  content += `   Your Answer Framework:\n`;
  content += `   • Current role: "${currentRole}" with [X] years experience\n`;
  content += `   • Key achievements: [2-3 specific accomplishments]\n`;
  content += `   • Why this role: [Connect your experience to target role requirements]\n`;
  content += `   • What you bring: [Unique value proposition]\n\n`;
  
  content += `2. "What makes you qualified for this ${targetRole} position?"\n`;
  content += `   Highlight Your Transferable Strengths:\n`;
  if (transferableSkills.length > 0) {
    transferableSkills.slice(0, 3).forEach((skill) => {
      content += `   • ${skill} - [Prepare specific example demonstrating this]\n`;
    });
  } else {
    content += `   • [List your top 3 relevant skills with specific examples]\n`;
  }
  content += `\n`;
  
  content += `3. "What are your development areas or gaps for this role?"\n`;
  content += `   Honest But Strategic Response:\n`;
  content += `   • Acknowledge gaps: "I'm actively developing [specific skill]"\n`;
  content += `   • Show initiative: "I've already started [course/project] to address this"\n`;
  content += `   • Demonstrate learning agility: "In my career, I've successfully learned [example]"\n\n`;
  
  content += `4. "Where do you see yourself in 3-5 years?"\n`;
  content += `   Show Ambition + Commitment:\n`;
  content += `   • Short-term: Excel in ${targetRole}, deliver measurable impact\n`;
  content += `   • Long-term: Grow within the organization, take on increasing responsibility\n`;
  content += `   • Alignment: Connect your goals to company's growth trajectory\n\n`;
  
  content += `Questions to Ask Them:\n`;
  content += `• "What does success look like for someone in this ${targetRole} role in the first 6-12 months?"\n`;
  content += `• "What are the biggest challenges facing the team/department right now?"\n`;
  content += `• "How does this role contribute to the organization's strategic goals?"\n`;
  content += `• "What opportunities are there for professional development and growth?"\n`;
  content += `• "What's the team culture like, and how does leadership support the team?"\n\n`;
  
  content += `STAR Method for Behavioral Questions:\n`;
  content += `Situation: Set the context (where, when, what was happening)\n`;
  content += `Task: Explain your responsibility or challenge\n`;
  content += `Action: Describe specific steps you took\n`;
  content += `Result: Share measurable outcomes and what you learned\n\n`;
  
  if (keyTakeaways.length > 0) {
    content += `Your Career Narrative:\n`;
    content += `"${keyTakeaways}"\n`;
    content += `Use this as your core message throughout interviews.\n\n`;
  }
  
  content += `Pre-Interview Checklist:\n`;
  content += `□ Research company thoroughly (website, news, LinkedIn, Glassdoor)\n`;
  content += `□ Prepare 5-7 STAR stories showcasing different competencies\n`;
  content += `□ Practice answers out loud (record yourself if possible)\n`;
  content += `□ Prepare 5-8 thoughtful questions to ask\n`;
  content += `□ Review job description and match your experience to each requirement\n`;
  content += `□ Plan your outfit and test technology (for virtual interviews)`;
  
  return content;
}

// Export singleton instance
export const careerReportGenerator = new CareerReportGenerator();
