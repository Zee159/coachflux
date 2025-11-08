/**
 * Framework Registry
 * 
 * Central registry for all coaching frameworks.
 * Provides type-safe access to framework definitions with proper error handling.
 */

import { 
  FrameworkDefinition, 
  FrameworkId, 
  LegacyFramework,
  FrameworkNotFoundError,
  isValidFrameworkId 
} from './types';
import { growFramework, growFrameworkLegacy } from './grow';
import { compassFramework } from './compass';
import { careerFramework } from './career';

// ============================================================================
// Legacy Registry (Phase 1 - Migration Mode)
// ============================================================================

/**
 * Legacy framework registry - matches current coach.ts behavior exactly
 * Used during migration to ensure zero regression
 * 
 * NOTE: COMPASS now uses the NEW 4-stage confidence-optimized version
 * Legacy 6-stage version is kept for backward compatibility only
 */
const legacyFrameworkRegistry: Record<string, LegacyFramework> = {
  'GROW': growFrameworkLegacy,
  'COMPASS': compassFramework as unknown as LegacyFramework, // Use NEW COMPASS (4-stage)
  'CAREER': careerFramework as unknown as LegacyFramework, // Career Coach
};

/**
 * Get framework using legacy format (for backward compatibility)
 * This is a drop-in replacement for the hardcoded getFramework() in coach.ts
 * 
 * @param frameworkId - The framework identifier (defaults to GROW for backward compatibility)
 */
export function getFrameworkLegacy(frameworkId: string = 'GROW'): LegacyFramework {
  const framework = legacyFrameworkRegistry[frameworkId];
  if (framework === null || framework === undefined) {
    throw new Error(`${frameworkId} framework not found in legacy registry`);
  }
  return framework;
}

// ============================================================================
// Modern Registry (Phase 2 - Full Modular)
// ============================================================================

/**
 * Modern framework registry with full type safety
 * Will be populated with CLEAR, COMPASS, etc. in future phases
 */
const frameworkRegistry: Partial<Record<FrameworkId, FrameworkDefinition>> = {
  GROW: growFramework,
  COMPASS: compassFramework,
  CAREER: careerFramework,
  // Phase 2: Add CLEAR framework
  // CLEAR: clearFramework,
  // Future: Additional frameworks
  // POWER_INTEREST_GRID: powerInterestGridFramework,
  // PSYCHOLOGICAL_SAFETY: psychologicalSafetyFramework,
  // EXECUTIVE_PRESENCE: executivePresenceFramework,
};

/**
 * Get framework by ID with type safety and error handling
 * 
 * @param frameworkId - The framework identifier
 * @returns Framework definition
 * @throws FrameworkNotFoundError if framework doesn't exist
 */
export function getFramework(frameworkId: FrameworkId): FrameworkDefinition {
  const framework = frameworkRegistry[frameworkId];
  if (framework === null || framework === undefined) {
    throw new FrameworkNotFoundError(frameworkId);
  }
  return framework;
}

/**
 * Get framework with fallback to default (GROW)
 * Safe version that never throws
 * 
 * @param frameworkId - The framework identifier (may be invalid)
 * @param fallback - Fallback framework ID (default: GROW)
 * @returns Framework definition
 */
export function getFrameworkSafe(
  frameworkId: string,
  fallback: FrameworkId = 'GROW'
): FrameworkDefinition {
  if (isValidFrameworkId(frameworkId)) {
    const framework = frameworkRegistry[frameworkId];
    if (framework !== null && framework !== undefined) {
      return framework;
    }
  }
  console.warn(`Invalid framework ID: ${frameworkId}, falling back to ${fallback}`);
  const fallbackFramework = frameworkRegistry[fallback];
  if (fallbackFramework === null || fallbackFramework === undefined) {
    throw new FrameworkNotFoundError(fallback);
  }
  return fallbackFramework;
}

/**
 * Get all available frameworks
 * Useful for framework selection UI
 * 
 * @returns Array of all framework definitions
 */
export function getAllFrameworks(): FrameworkDefinition[] {
  return Object.values(frameworkRegistry).filter(
    (f): f is FrameworkDefinition => f !== null && f !== undefined
  );
}

/**
 * Get frameworks by challenge type
 * Used for intelligent framework selection
 * 
 * @param challengeType - The type of challenge
 * @returns Array of matching frameworks
 */
export function getFrameworksByChallengeType(
  challengeType: string
): FrameworkDefinition[] {
  return getAllFrameworks().filter(framework =>
    framework.challenge_types.includes(challengeType as never)
  );
}

/**
 * Check if a framework exists in the registry
 * 
 * @param frameworkId - The framework identifier to check
 * @returns True if framework exists
 */
export function hasFramework(frameworkId: string): boolean {
  return isValidFrameworkId(frameworkId) && frameworkId in frameworkRegistry;
}

/**
 * Get framework metadata (without full definition)
 * Useful for listing frameworks without loading all steps
 * 
 * @param frameworkId - The framework identifier
 * @returns Framework metadata
 */
export function getFrameworkMetadata(frameworkId: FrameworkId): {
  id: FrameworkId;
  name: string;
  description: string;
  duration_minutes: number;
  challenge_types: string[];
} {
  const framework = getFramework(frameworkId);
  return {
    id: framework.id,
    name: framework.name,
    description: framework.description,
    duration_minutes: framework.duration_minutes,
    challenge_types: framework.challenge_types,
  };
}

// ============================================================================
// Registry Statistics (for monitoring/debugging)
// ============================================================================

/**
 * Get registry statistics
 * Useful for debugging and monitoring
 */
export function getRegistryStats(): {
  total_frameworks: number;
  framework_ids: FrameworkId[];
  total_steps: number;
  average_duration: number;
} {
  const frameworks = getAllFrameworks();
  const totalSteps = frameworks.reduce((sum, f) => sum + f.steps.length, 0);
  const avgDuration = frameworks.reduce((sum, f) => sum + f.duration_minutes, 0) / frameworks.length;

  return {
    total_frameworks: frameworks.length,
    framework_ids: frameworks.map(f => f.id),
    total_steps: totalSteps,
    average_duration: Math.round(avgDuration),
  };
}
