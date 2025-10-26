export type MindsetState = "resistant" | "neutral" | "open" | "engaged";

export interface Weights {
  confidence: number;
  action: number;
  mindset: number;
  satisfaction: number;
}

export interface Thresholds {
  excellent: number;
  good: number;
  fair: number;
  marginal: number;
}

export interface CalculationMetadata {
  dimension_weights: Weights;
  thresholds: Thresholds;
}

export interface CSSInput {
  initialConfidence: number; // 1-10
  finalConfidence: number; // 1-10
  initialActionClarity: number; // 1-10
  finalActionClarity: number; // 1-10
  initialMindset: MindsetState;
  finalMindset: MindsetState;
  userSatisfaction: number; // 1-10
  highConfidenceThreshold?: number; // default 8
}

export interface CSSBreakdown {
  confidence_score: number; // 0-100
  action_score: number; // 0-100
  mindset_score: number; // 0-100
  satisfaction_score: number; // 0-100
}

export type SuccessLevel = "EXCELLENT" | "GOOD" | "FAIR" | "MARGINAL" | "INSUFFICIENT";

export interface CSSResult {
  composite_success_score: number; // 0-100
  success_level: SuccessLevel;
  breakdown: CSSBreakdown;
  calculationVersion: string;
  calculation_metadata: CalculationMetadata;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function normalize10(value: number): number {
  // Map 1..10 to 0..100
  const v = clamp(value, 1, 10);
  return ((v - 1) / 9) * 100;
}

function mapMindset(state: MindsetState): number {
  switch (state) {
    case "resistant":
      return 25;
    case "neutral":
      return 50;
    case "open":
      return 75;
    case "engaged":
      return 100;
  }
}

function pickLevel(score: number, thresholds: Thresholds): SuccessLevel {
  if (score >= thresholds.excellent) {
    return "EXCELLENT";
  }
  if (score >= thresholds.good) {
    return "GOOD";
  }
  if (score >= thresholds.fair) {
    return "FAIR";
  }
  if (score >= thresholds.marginal) {
    return "MARGINAL";
  }
  return "INSUFFICIENT";
}

function validateInput(input: CSSInput): void {
  const { initialConfidence, finalConfidence, initialActionClarity, finalActionClarity, userSatisfaction } = input;
  if (!Number.isFinite(initialConfidence) || initialConfidence < 1 || initialConfidence > 10) {
    throw new Error("initialConfidence must be 1-10");
  }
  if (!Number.isFinite(finalConfidence) || finalConfidence < 1 || finalConfidence > 10) {
    throw new Error("finalConfidence must be 1-10");
  }
  if (!Number.isFinite(initialActionClarity) || initialActionClarity < 1 || initialActionClarity > 10) {
    throw new Error("initialActionClarity must be 1-10");
  }
  if (!Number.isFinite(finalActionClarity) || finalActionClarity < 1 || finalActionClarity > 10) {
    throw new Error("finalActionClarity must be 1-10");
  }
  if (!Number.isFinite(userSatisfaction) || userSatisfaction < 1 || userSatisfaction > 10) {
    throw new Error("userSatisfaction must be 1-10");
  }
}

export interface CalculateOptions {
  weights?: Weights;
  thresholds?: Thresholds;
  version?: string;
}

const DEFAULT_WEIGHTS: Weights = { confidence: 0.4, action: 0.3, mindset: 0.2, satisfaction: 0.1 };
const DEFAULT_THRESHOLDS: Thresholds = { excellent: 85, good: 70, fair: 50, marginal: 30 };
const DEFAULT_VERSION = "1.0";

export function calculateCSS(input: CSSInput, options: CalculateOptions = {}): CSSResult {
  validateInput(input);
  const weights: Weights = options.weights ?? DEFAULT_WEIGHTS;
  const thresholds: Thresholds = options.thresholds ?? DEFAULT_THRESHOLDS;
  const version: string = options.version ?? DEFAULT_VERSION;

  const highThreshold = input.highConfidenceThreshold ?? 8;

  // Confidence dimension (adaptive)
  const isHighConfidence = input.initialConfidence >= highThreshold;
  const confidence_score = isHighConfidence
    ? normalize10(input.finalActionClarity)
    : clamp(normalize10(input.finalConfidence) - normalize10(input.initialConfidence) + 50, 0, 100);

  // Action dimension (final clarity of plan)
  const action_score = normalize10(input.finalActionClarity);

  // Mindset dimension (final state mapping)
  const mindset_score = mapMindset(input.finalMindset);

  // Satisfaction dimension (user experience)
  const satisfaction_score = normalize10(input.userSatisfaction);

  const breakdown: CSSBreakdown = {
    confidence_score: Math.round(confidence_score),
    action_score: Math.round(action_score),
    mindset_score: Math.round(mindset_score),
    satisfaction_score: Math.round(satisfaction_score),
  };

  const composite_success_score = Math.round(
    breakdown.confidence_score * weights.confidence +
      breakdown.action_score * weights.action +
      breakdown.mindset_score * weights.mindset +
      breakdown.satisfaction_score * weights.satisfaction
  );

  const success_level = pickLevel(composite_success_score, thresholds);

  return {
    composite_success_score,
    success_level,
    breakdown,
    calculationVersion: version,
    calculation_metadata: { dimension_weights: weights, thresholds },
  };
}
