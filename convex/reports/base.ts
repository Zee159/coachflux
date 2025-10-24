/**
 * Base Report Utilities
 * Shared helper functions for report generation
 */

import type { ReflectionPayload, CompassScores } from './types';

/**
 * Safely get a number from payload
 */
export function getNumber(payload: ReflectionPayload, key: string): number | undefined {
  const value = payload[key];
  return typeof value === 'number' ? value : undefined;
}

/**
 * Safely get a string from payload
 */
export function getString(payload: ReflectionPayload, key: string): string | undefined {
  const value = payload[key];
  return typeof value === 'string' ? value : undefined;
}

/**
 * Safely get an array from payload
 */
export function getArray<T>(payload: ReflectionPayload, key: string): T[] | undefined {
  const value = payload[key];
  return Array.isArray(value) ? value as T[] : undefined;
}

/**
 * Format score as visual bar (█ for filled, ░ for empty)
 */
export function formatScoreBar(score: number): string {
  const filled = Math.round(score);
  const empty = 5 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Get label for individual score (1-5 scale)
 */
export function getScoreLabel(score: number): string {
  if (score >= 4) {
    return '✅ Strong';
  }
  if (score >= 3) {
    return '⚠️  Developing';
  }
  return '🚨 Needs Focus';
}

/**
 * Get label for overall readiness score
 */
export function getOverallLabel(score: number): string {
  if (score >= 4.0) {
    return 'HIGH READINESS';
  }
  if (score >= 3.0) {
    return 'DEVELOPING';
  }
  if (score >= 2.0) {
    return 'EARLY STAGE';
  }
  return 'SIGNIFICANT WORK NEEDED';
}

/**
 * Format COMPASS scores content for display
 */
export function formatCompassScoresContent(scores: CompassScores): string {
  const lines: string[] = [];
  
  if (scores.clarity_score !== undefined) {
    lines.push(`Clarity: ${formatScoreBar(scores.clarity_score)} ${scores.clarity_score}/5 ${getScoreLabel(scores.clarity_score)}`);
  }
  if (scores.ownership_score !== undefined) {
    lines.push(`Ownership: ${formatScoreBar(scores.ownership_score)} ${scores.ownership_score}/5 ${getScoreLabel(scores.ownership_score)}`);
  }
  if (scores.mapping_score !== undefined) {
    lines.push(`Mapping: ${formatScoreBar(scores.mapping_score)} ${scores.mapping_score}/5 ${getScoreLabel(scores.mapping_score)}`);
  }
  if (scores.practice_score !== undefined) {
    lines.push(`Practice: ${formatScoreBar(scores.practice_score)} ${scores.practice_score}/5 ${getScoreLabel(scores.practice_score)}`);
  }
  if (scores.anchoring_score !== undefined) {
    lines.push(`Anchoring: ${formatScoreBar(scores.anchoring_score)} ${scores.anchoring_score}/5 ${getScoreLabel(scores.anchoring_score)}`);
  }
  
  lines.push(`\nOverall Readiness: ${scores.overall_readiness}/5 (${getOverallLabel(scores.overall_readiness)})`);
  
  return lines.join('\n');
}

/**
 * Format date as readable string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
}


