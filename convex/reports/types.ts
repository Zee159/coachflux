/**
 * Report-specific type definitions
 * 
 * Note: Most report types are defined in ../types.ts
 * This file re-exports them for convenience and adds report-specific types
 */

// Re-export report-related types from main types file
export type {
  ReflectionPayload,
  SessionReportData,
  FormattedReport,
  ReportSection,
  CompassTransformation,
  CompassScores,
  EmotionalState,
  MindsetLevel,
  PivotMoment
} from '../types';

export { calculateTransformationMagnitude } from '../types';

// Import for use in interface definition
import type { SessionReportData, FormattedReport } from '../types';

/**
 * Report generator interface
 * Each framework must implement this interface for report generation
 */
export interface FrameworkReportGenerator {
  /**
   * Generate a formatted report for a completed session
   */
  generateReport(data: SessionReportData): FormattedReport;
}

