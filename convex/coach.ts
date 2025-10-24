/**
 * Coach Module - Legacy Entry Point
 * 
 * This file maintains backward compatibility by re-exporting from the modular coach structure.
 * 
 * ⚠️ DEPRECATED: Import from `./coach/index` instead for new code.
 * 
 * New modular structure:
 * - convex/coach/base.ts     - Core coaching engine (safety, validation, LLM calls)
 * - convex/coach/grow.ts     - GROW framework coach
 * - convex/coach/compass.ts  - COMPASS framework coach
 * - convex/coach/types.ts    - Shared coaching types
 * - convex/coach/index.ts    - Main entry point with actions
 */

export { nextStep, generateReviewAnalysis } from "./coach/index";
