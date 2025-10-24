/**
 * Reports Module - Legacy Entry Point
 * 
 * This file maintains backward compatibility by re-exporting from the modular reports structure.
 * 
 * ⚠️ DEPRECATED: Import from `./reports/index` instead for new code.
 * 
 * New modular structure:
 * - convex/reports/types.ts    - Report-specific types
 * - convex/reports/base.ts     - Shared utilities (formatting, helpers)
 * - convex/reports/compass.ts  - COMPASS report generation & analytics
 * - convex/reports/grow.ts     - GROW report generation
 * - convex/reports/index.ts    - Main entry point with framework routing
 */

export {
  // Main report generation function
  generateSessionReport,
  
  // Framework-specific generators
  generateCompassReport,
  generateGrowReport,
  
  // COMPASS analytics extraction (for advanced use cases)
  extractCompassScores,
  extractCompassTransformation,
  generateCompassInsights,
  
  // Types
  type SessionReportData,
  type FormattedReport,
  type ReportSection,
  type CompassTransformation,
  type CompassScores,
  type EmotionalState,
  type MindsetLevel,
  type PivotMoment,
  type ReflectionPayload,
  type FrameworkReportGenerator
} from "./reports/index";
