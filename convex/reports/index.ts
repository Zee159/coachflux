/**
 * Reports Module - Main Entry Point
 * 
 * Exports report generation functions and orchestrates framework-specific report generators
 */

import type { SessionReportData, FormattedReport, FrameworkReportGenerator } from './types';
import { compassReportGenerator } from './compass';
import { growReportGenerator } from './grow';

// Re-export types for convenience
export type {
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

// Re-export individual generators
export { generateCompassReport, extractCompassScores, extractCompassTransformation, generateCompassInsights } from './compass';
export { generateGrowReport } from './grow';

// ============================================================================
// FRAMEWORK REPORT GENERATOR REGISTRY
// ============================================================================

/**
 * Get report generator for a specific framework
 */
function getReportGenerator(frameworkId: string): FrameworkReportGenerator {
  const id = frameworkId.toUpperCase();
  
  if (id === 'COMPASS') {
    return compassReportGenerator;
  }
  
  if (id === 'GROW') {
    return growReportGenerator;
  }
  
  // Default to GROW for unknown frameworks
  console.warn(`Unknown framework: ${frameworkId}, defaulting to GROW report generator`);
  return growReportGenerator;
}

// ============================================================================
// MAIN REPORT GENERATION FUNCTION
// ============================================================================

/**
 * Generate report based on framework type
 * 
 * This is the main entry point for report generation.
 * It automatically routes to the correct framework-specific generator.
 * 
 * @param data - Session data with framework ID and reflections
 * @returns Formatted report for display
 */
export function generateSessionReport(data: SessionReportData): FormattedReport {
  const generator = getReportGenerator(data.framework_id);
  
  try {
    return generator.generateReport(data);
  } catch (error) {
    console.error(`Error generating ${data.framework_id} report:`, error);
    
    // Fallback report on error
    return {
      title: 'Session Report',
      summary: `Session completed: ${data.framework_id}`,
      sections: [
        {
          heading: 'Error',
          content: 'Unable to generate detailed report. Please contact support if this persists.',
          type: 'text'
        },
        {
          heading: 'Session Info',
          content: `Framework: ${data.framework_id}\nCompleted: ${new Date(data.completed_at).toLocaleString()}\nDuration: ${data.duration_minutes} minutes`,
          type: 'text'
        }
      ]
    };
  }
}


