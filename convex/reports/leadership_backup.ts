/**
 * PRODUCTIVITY Report Generator
 * 
 * Generates structured reports for completed Productivity coaching sessions.
 */

import type { SessionReportData, FormattedReport, ReportSection } from "../types";

/**
 * Type-safe helper to extract string from payload
 */
function getString(payload: Record<string, unknown> | undefined, key: string, fallback: string = ''): string {
  if (payload === null || payload === undefined) {
    return fallback;
  }
  const value = payload[key];
  return typeof value === 'string' ? value : fallback;
}

/**
 * Type-safe helper to extract number from payload
 */
function getNumber(payload: Record<string, unknown> | undefined, key: string, fallback: number = 0): number {
  if (payload === null || payload === undefined) {
    return fallback;
  }
  const value = payload[key];
  return typeof value === 'number' ? value : fallback;
}

/**
 * Type-safe helper to extract array from payload
 */
function getArray<T>(payload: Record<string, unknown> | undefined, key: string): T[] {
  if (payload === null || payload === undefined) {
    return [];
  }
  const value = payload[key];
  return Array.isArray(value) ? value as T[] : [];
}

/**
 * Format date for display
 */
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Generate Productivity Coach report
 */
export function generateProductivityReport(data: SessionReportData): FormattedReport {
  const sections: ReportSection[] = [];
  
  // Extract reflections by step
  const assessmentReflections = data.reflections.filter(r => r.step === 'ASSESSMENT');
  const assessment = assessmentReflections[assessmentReflections.length - 1]?.payload;
  
  const focusAuditReflections = data.reflections.filter(r => r.step === 'FOCUS_AUDIT');
  const focusAudit = focusAuditReflections[focusAuditReflections.length - 1]?.payload;
  
  const systemDesignReflections = data.reflections.filter(r => r.step === 'SYSTEM_DESIGN');
  const systemDesign = systemDesignReflections[systemDesignReflections.length - 1]?.payload;
  
  const implementationReflections = data.reflections.filter(r => r.step === 'IMPLEMENTATION');
  const implementation = implementationReflections[implementationReflections.length - 1]?.payload;
  
  const reviewReflections = data.reflections.filter(r => r.step === 'REVIEW');
  const review = reviewReflections[reviewReflections.length - 1]?.payload;
  
  // ========================================================================
  // SECTION 1: Productivity Assessment
  // ========================================================================
  
  const currentLevel = getNumber(assessment, 'current_productivity_level');
  const challenge = getString(assessment, 'biggest_productivity_challenge');
  const distractions = getArray<string>(assessment, 'main_distractions');
  const goal = getString(assessment, 'productivity_goal');
  
  let assessmentContent = `**Current Productivity Level:** ${currentLevel}/10\n\n`;
  assessmentContent += `**Biggest Challenge:** ${challenge}\n\n`;
  
  if (distractions.length > 0) {
    assessmentContent += `**Main Distractions:**\n`;
    distractions.forEach(d => {
      assessmentContent += `• ${d}\n`;
    });
    assessmentContent += '\n';
  }
  
  assessmentContent += `**Productivity Goal:** ${goal}`;
  
  sections.push({
    heading: '📊 Productivity Assessment',
    content: assessmentContent,
    type: 'text'
  });
  
  // ========================================================================
  // SECTION 2: Time & Energy Audit
  // ========================================================================
  
  const deepWorkPct = getNumber(focusAudit, 'deep_work_percentage');
  const peakHours = getArray<string>(focusAudit, 'peak_energy_hours');
  const triggers = getArray<string>(focusAudit, 'distraction_triggers');
  const auditScore = getNumber(focusAudit, 'time_audit_score');
  
  let auditContent = `**Deep Work Time:** ${deepWorkPct}% of workday\n\n`;
  
  if (peakHours.length > 0) {
    auditContent += `**Peak Energy Hours:**\n`;
    peakHours.forEach(h => {
      auditContent += `• ${h}\n`;
    });
    auditContent += '\n';
  }
  
  if (triggers.length > 0) {
    auditContent += `**Distraction Triggers:**\n`;
    triggers.forEach(t => {
      auditContent += `• ${t}\n`;
    });
    auditContent += '\n';
  }
  
  auditContent += `**Time Allocation Score:** ${auditScore}/10`;
  
  sections.push({
    heading: '⏰ Time & Energy Audit',
    content: auditContent,
    type: 'text'
  });
  
  // ========================================================================
  // SECTION 3: Your Productivity System
  // ========================================================================
  
  const framework = getString(systemDesign, 'chosen_framework');
  const deepWorkBlocks = getArray<{
    time_slot: string;
    focus_area: string;
    protection_strategy: string;
  }>(systemDesign, 'deep_work_blocks');
  const blockers = getArray<string>(systemDesign, 'distraction_blockers');
  const systemConfidence = getNumber(systemDesign, 'system_confidence');
  
  let systemContent = `**Framework:** ${framework}\n\n`;
  
  if (deepWorkBlocks.length > 0) {
    systemContent += `**Deep Work Blocks:**\n`;
    deepWorkBlocks.forEach((block, idx) => {
      systemContent += `\n${idx + 1}. **${block.time_slot}** - ${block.focus_area}\n`;
      systemContent += `   Protection: ${block.protection_strategy}\n`;
    });
    systemContent += '\n';
  }
  
  if (blockers.length > 0) {
    systemContent += `**Distraction Blockers:**\n`;
    blockers.forEach(b => {
      systemContent += `• ${b}\n`;
    });
    systemContent += '\n';
  }
  
  systemContent += `**System Confidence:** ${systemConfidence}/10`;
  
  sections.push({
    heading: '⚡ Your Productivity System',
    content: systemContent,
    type: 'insights'
  });
  
  // ========================================================================
  // SECTION 4: Implementation Plan
  // ========================================================================
  
  const firstAction = getString(implementation, 'first_action');
  const startDate = getString(implementation, 'start_date');
  const dailyCommitment = getString(implementation, 'daily_commitment');
  const accountability = getString(implementation, 'accountability_method');
  const implConfidence = getNumber(implementation, 'implementation_confidence');
  
  let implContent = `**First Action:** ${firstAction}\n\n`;
  implContent += `**Start Date:** ${startDate}\n\n`;
  implContent += `**Daily Commitment:** ${dailyCommitment}\n\n`;
  implContent += `**Accountability:** ${accountability}\n\n`;
  implContent += `**Implementation Confidence:** ${implConfidence}/10`;
  
  sections.push({
    heading: '🎯 Implementation Plan',
    content: implContent,
    type: 'actions'
  });
  
  // ========================================================================
  // SECTION 5: Session Insights
  // ========================================================================
  
  const keyInsight = getString(review, 'key_insight');
  const nextStep = getString(review, 'immediate_next_step');
  const concern = getString(review, 'biggest_concern');
  const finalConfidence = getNumber(review, 'final_confidence');
  const clarity = getNumber(review, 'system_clarity');
  const helpfulness = getNumber(review, 'session_helpfulness');
  
  let insightsContent = `**Key Insight:** ${keyInsight}\n\n`;
  insightsContent += `**Immediate Next Step:** ${nextStep}\n\n`;
  
  if (concern.length > 0) {
    insightsContent += `**Biggest Concern:** ${concern}\n\n`;
  }
  
  insightsContent += `**Final Scores:**\n`;
  insightsContent += `• Productivity Confidence: ${finalConfidence}/10`;
  if (currentLevel > 0) {
    const improvement = finalConfidence - currentLevel;
    if (improvement > 0) {
      insightsContent += ` (+${improvement} from start)`;
    }
  }
  insightsContent += `\n• System Clarity: ${clarity}/10\n`;
  insightsContent += `• Session Helpfulness: ${helpfulness}/10`;
  
  sections.push({
    heading: '💡 Session Insights',
    content: insightsContent,
    type: 'insights'
  });
  
  // ========================================================================
  // Generate Summary
  // ========================================================================
  
  const summary = `Productivity coaching session completed on ${formatDate(data.completed_at)}. ` +
    `Designed ${framework} system with ${deepWorkBlocks.length} deep work block(s) during peak energy hours. ` +
    `Starting ${startDate} with daily commitment: ${dailyCommitment}. ` +
    `Confidence improved from ${currentLevel}/10 to ${finalConfidence}/10.`;
  
  return {
    title: 'Productivity Coach Report',
    summary,
    sections
  };
}

/**
 * Productivity Report Generator Class
 * Implements FrameworkReportGenerator interface
 */
export class ProductivityReportGenerator {
  generateReport(data: SessionReportData): FormattedReport {
    return generateProductivityReport(data);
  }
}

// Export singleton instance
export const productivityReportGenerator = new ProductivityReportGenerator();
