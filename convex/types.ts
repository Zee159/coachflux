// Convex types for CoachFlux

export interface OrgValue {
  key: string;
  description: string;
}

export interface FrameworkStep {
  name: string;
  system_objective: string;
  required_fields_schema: Record<string, unknown>;
}

export interface Framework {
  id: string;
  steps: FrameworkStep[];
}

export interface ValidationResult {
  verdict: "pass" | "fail";
  reasons: string[];
}

export interface ReflectionPayload {
  [key: string]: unknown;
}

// Error type guard
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  return String(error);
}
