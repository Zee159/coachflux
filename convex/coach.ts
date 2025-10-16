import { action } from "./_generated/server";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_BASE, USER_STEP_PROMPT, VALIDATOR_PROMPT } from "./prompts";
import { api } from "./_generated/api";
import type { Framework, OrgValue, ValidationResult, ReflectionPayload } from "./types";
import { hasCoachReflection } from "./types";

const BANNED = ["psychiatric", "prescribe", "diagnosis", "sue", "lawsuit"];

// Serious workplace issues requiring escalation (not coaching)
const ESCALATION_REQUIRED = [
  "sexual harassment", "sexually harassed", "sexual assault", "sexually assaulted",
  "harassment", "harassed", "harassing",
  "bullying", "bullied", "bully",
  "discrimination", "discriminated", "discriminating",
  "abuse", "abused", "abusive",
  "threatened", "threatening", "threat",
  "assault", "assaulted", "assaulting",
  "pornography", "pornographic", "porn",
  "explicit material", "explicit content", "explicit image"
];

// Framework configuration loaded at runtime
const getFramework = (): Framework => {
  return {
    id: "GROW",
    steps: [
      {
        name: "goal",
        system_objective: "Clarify the desired outcome and timeframe.",
        required_fields_schema: {
          type: "object",
          properties: {
            goal: { type: "string", minLength: 8, maxLength: 240 },
            why_now: { type: "string", minLength: 8, maxLength: 240 },
            success_criteria: { type: "array", items: { type: "string", minLength: 3 }, minItems: 1, maxItems: 5 },
            timeframe: { type: "string", minLength: 3, maxLength: 100 },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["coach_reflection"],
          additionalProperties: true
        }
      },
      {
        name: "reality",
        system_objective: "Surface current constraints, facts, and risks without judgement.",
        required_fields_schema: {
          type: "object",
          properties: {
            current_state: { type: "string", minLength: 8, maxLength: 320 },
            constraints: { type: "array", items: { type: "string" }, maxItems: 6 },
            resources: { type: "array", items: { type: "string" }, maxItems: 6 },
            risks: { type: "array", items: { type: "string" }, maxItems: 6 },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["current_state", "coach_reflection"],
          additionalProperties: false
        }
      },
      {
        name: "options",
        system_objective: "Facilitate user discovering at least three viable options with pros and cons.",
        required_fields_schema: {
          type: "object",
          properties: {
            options: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string", minLength: 3, maxLength: 60 },
                  pros: { type: "array", items: { type: "string" }, maxItems: 5 },
                  cons: { type: "array", items: { type: "string" }, maxItems: 5 }
                },
                required: ["label"],
                additionalProperties: false
              },
              minItems: 1,
              maxItems: 5
            },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["coach_reflection"],
          additionalProperties: false
        }
      },
      {
        name: "will",
        system_objective: "Select one option and define SMART actions.",
        required_fields_schema: {
          type: "object",
          properties: {
            chosen_option: { type: "string" },
            actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", minLength: 4, maxLength: 120 },
                  owner: { type: "string" },
                  due_days: { type: "integer", minimum: 1, maximum: 90 }
                },
                required: ["title", "owner", "due_days"],
                additionalProperties: false
              },
              minItems: 2,
              maxItems: 3
            },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["coach_reflection"],
          additionalProperties: false
        }
      },
      {
        name: "review",
        system_objective: "Summarise the plan, provide AI insights, and compute an alignment score with org values.",
        required_fields_schema: {
          type: "object",
          properties: {
            summary: { type: "string", minLength: 16, maxLength: 400 },
            alignment_score: { type: "integer", minimum: 0, maximum: 100 },
            value_tags: { type: "array", items: { type: "string" }, maxItems: 3 },
            ai_insights: { type: "string", minLength: 20, maxLength: 400 },
            unexplored_options: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
            identified_risks: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
            potential_pitfalls: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
            coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
          },
          required: ["summary", "alignment_score", "ai_insights", "unexplored_options", "identified_risks", "potential_pitfalls", "coach_reflection"],
          additionalProperties: false
        }
      }
    ]
  };
};

export const nextStep = action({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    stepName: v.string(),
    userTurn: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate input length (800 char cap)
    if (args.userTurn.length > 800) {
      return { ok: false, message: "Input too long. Please keep responses under 800 characters." };
    }

    // Check for serious workplace issues requiring escalation
    const userInputLower = args.userTurn.toLowerCase();
    const escalationHit = ESCALATION_REQUIRED.some(term => userInputLower.includes(term));
    
    if (escalationHit) {
      const detectedTerms = ESCALATION_REQUIRED.filter(term => userInputLower.includes(term));
      
      // Log as high severity incident
      await ctx.runMutation(api.mutations.createSafetyIncident, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        reason: `Escalation required: ${detectedTerms.join(", ")}`,
        llmOutput: args.userTurn.substring(0, 500),
        severity: "high"
      });
      
      return { 
        ok: false, 
        message: "This is a serious matter that requires specialist help or HR support. Please contact your HR department, manager, or appropriate specialist services through your organisation's official channels. If you're in immediate danger, contact emergency services."
      };
    }

    const org = await ctx.runQuery(api.queries.getOrg, { orgId: args.orgId });
    if (org === null || org === undefined) {
      throw new Error("Organization not found");
    }

    const values = (org.values as OrgValue[] ?? []).map((v) => v.key);
    const fw = getFramework();
    const step = fw.steps.find((s) => s.name === args.stepName);
    if (step === undefined) {
      throw new Error("Unknown step");
    }

    // Fetch conversation history for context (especially important for review step)
    const sessionReflections = await ctx.runQuery(api.queries.getSessionReflections, {
      sessionId: args.sessionId
    });
    
    // Build conversation history string - include both user inputs and coach reflections for current step
    const conversationHistory = sessionReflections
      .map((r) => {
        const parts: string[] = [];
        // Include coach reflection if it exists - use type guard
        if (hasCoachReflection(r.payload)) {
          const coachReflection = r.payload.coach_reflection;
          if (coachReflection.length > 0) {
            parts.push(`[${r.step.toUpperCase()}] Coach: ${coachReflection}`);
          }
        }
        // Include user input if it exists
        if (r.userInput !== undefined && r.userInput !== null && r.userInput.length > 0) {
          parts.push(`[${r.step.toUpperCase()}] User: ${r.userInput}`);
        }
        return parts.join('\n');
      })
      .filter((s) => s.length > 0)
      .join('\n\n');

    // Initialize Anthropic client
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (apiKey === undefined || apiKey === null || apiKey === '') {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }
    const client = new Anthropic({ apiKey });

    // Primary call
    const system = SYSTEM_BASE(values);
    const user = USER_STEP_PROMPT(step.name, args.userTurn, conversationHistory);

    const primary = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      temperature: 0,
      system: system + "\n\nYou MUST respond with valid JSON only. No other text.",
      messages: [
        { 
          role: "user", 
          content: `Schema:\n${JSON.stringify(step.required_fields_schema, null, 2)}\n\n${user}\n\nRespond with ONLY valid JSON matching the schema.`
        }
      ]
    });

    const firstContent = primary.content[0];
    if (firstContent === undefined || firstContent === null) {
      throw new Error("No content in primary response");
    }
    const raw = firstContent.type === "text" ? firstContent.text : "{}";

    // Validator call
    const validator = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      temperature: 0,
      system: "You validate JSON output for schema conformance and banned terms. Respond with ONLY valid JSON.",
      messages: [
        { 
          role: "user", 
          content: VALIDATOR_PROMPT(step.required_fields_schema, raw) + "\n\nRespond with ONLY valid JSON: {\"verdict\":\"pass\"|\"fail\",\"reasons\":[]}"
        }
      ]
    });

    const firstValidatorContent = validator.content[0];
    if (firstValidatorContent === undefined || firstValidatorContent === null) {
      throw new Error("No content in validator response");
    }
    const verdictRaw = firstValidatorContent.type === "text" ? firstValidatorContent.text : '{"verdict":"fail","reasons":["No response"]}';
    let verdict: ValidationResult;
    try {
      verdict = JSON.parse(verdictRaw) as ValidationResult;
    } catch (error) {
      console.error("Validator JSON parse error:", error);
      verdict = { verdict: "fail", reasons: ["Validator returned invalid JSON"] };
    }

    const lower = raw.toLowerCase();
    const bannedHit = BANNED.some(b => lower.includes(b));

    if (verdict.verdict !== "pass" || bannedHit) {
      const reason = bannedHit 
        ? `Banned term detected: ${BANNED.filter(b => lower.includes(b)).join(", ")}`
        : `Validator failed: ${verdict.reasons?.join(", ") ?? "Unknown reason"}`;
      
      console.error("Safety validation failed:", { 
        reason, 
        userInput: args.userTurn.substring(0, 100),
        aiOutput: raw.substring(0, 200)
      });
      
      await ctx.runMutation(api.mutations.createSafetyIncident, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        reason,
        llmOutput: raw,
        severity: "low"
      });
      
      return { 
        ok: false, 
        message: bannedHit 
          ? "This topic requires specialist support beyond coaching. Please consult appropriate professional services."
          : "I'm having trouble processing that. Could you rephrase your response?"
      };
    }

    // Parse primary JSON
    let payload: ReflectionPayload;
    try {
      payload = JSON.parse(raw) as ReflectionPayload;
    } catch (error) {
      console.error("Primary JSON parse error:", error);
      await ctx.runMutation(api.mutations.createSafetyIncident, {
        orgId: args.orgId,
        userId: args.userId,
        sessionId: args.sessionId,
        reason: "validator_fail_or_banned",
        llmOutput: raw,
        severity: "med"
      });
      return { ok: false, message: "I can't process that. Try rephrasing with factual details." };
    }

    // Create reflection with user input
    await ctx.runMutation(api.mutations.createReflection, {
      orgId: args.orgId,
      userId: args.userId,
      sessionId: args.sessionId,
      step: step.name,
      userInput: args.userTurn,
      payload
    });

    // Create actions if step=will
    const actions = payload["actions"];
    if (step.name === "will" && Array.isArray(actions)) {
      for (const a of actions) {
        const action = a as { title: string; owner: string; due_days?: number };
        const due = action.due_days !== undefined && action.due_days !== null && action.due_days > 0 
          ? Date.now() + action.due_days * 86400000 
          : undefined;
        await ctx.runMutation(api.mutations.createAction, {
          orgId: args.orgId,
          userId: args.userId,
          sessionId: args.sessionId,
          title: action.title,
          dueAt: due,
          status: "open"
        });
      }
    }

    // Check if step is complete before advancing
    let shouldAdvance = false;
    
    // Define completion criteria for each step
    if (step.name === "goal") {
      // Goal step requires: goal, why_now, success_criteria, timeframe
      shouldAdvance = Boolean(
        typeof payload["goal"] === "string" && payload["goal"].length > 0 && 
        typeof payload["why_now"] === "string" && payload["why_now"].length > 0 && 
        Array.isArray(payload["success_criteria"]) && payload["success_criteria"].length > 0 && 
        typeof payload["timeframe"] === "string" && payload["timeframe"].length > 0
      );
    } else if (step.name === "reality") {
      // Reality step requires: current_state AND at least 2 of (constraints, resources, risks)
      const hasConstraints = Array.isArray(payload["constraints"]) && payload["constraints"].length > 0;
      const hasResources = Array.isArray(payload["resources"]) && payload["resources"].length > 0;
      const hasRisks = Array.isArray(payload["risks"]) && payload["risks"].length > 0;
      const explorationCount = [hasConstraints, hasResources, hasRisks].filter(Boolean).length;
      
      shouldAdvance = Boolean(typeof payload["current_state"] === "string" && payload["current_state"].length > 0 && explorationCount >= 2);
    } else if (step.name === "options") {
      // Options step requires: at least 3 options AND at least 2 must have pros/cons explored
      const options = payload["options"];
      if (!Array.isArray(options) || options.length < 3) {
        shouldAdvance = false;
      } else {
        const exploredOptions = options.filter((opt: unknown) => {
          const option = opt as { label?: string; pros?: unknown[]; cons?: unknown[] };
          return Array.isArray(option.pros) && option.pros.length > 0 &&
                 Array.isArray(option.cons) && option.cons.length > 0;
        });
        shouldAdvance = exploredOptions.length >= 2;
      }
    } else if (step.name === "will") {
      // Will step requires: chosen_option, at least 2 concrete actions with ALL details, and commitment confirmation
      const actions = payload["actions"];
      if (typeof payload["chosen_option"] !== "string" || payload["chosen_option"].length === 0 || !Array.isArray(actions) || actions.length < 2) {
        shouldAdvance = false;
      } else {
        // Check that all actions have complete details (title, owner, due_days)
        const completeActions = actions.filter((a: unknown) => {
          const action = a as { title?: string; owner?: string; due_days?: number };
          return typeof action.title === "string" && action.title.length > 0 && typeof action.owner === "string" && action.owner.length > 0 && typeof action.due_days === "number" && action.due_days > 0;
        });
        
        // Need at least 2 complete actions to advance
        shouldAdvance = completeActions.length >= 2;
      }
    } else if (step.name === "review") {
      // Review step requires: summary, alignment_score, ai_insights, unexplored_options, identified_risks, potential_pitfalls
      shouldAdvance = Boolean(
        typeof payload["summary"] === "string" && payload["summary"].length > 0 && 
        typeof payload["alignment_score"] === "number" &&
        typeof payload["ai_insights"] === "string" && payload["ai_insights"].length > 0 &&
        Array.isArray(payload["unexplored_options"]) && payload["unexplored_options"].length > 0 &&
        Array.isArray(payload["identified_risks"]) && payload["identified_risks"].length > 0 &&
        Array.isArray(payload["potential_pitfalls"]) && payload["potential_pitfalls"].length > 0
      );
    }

    // Only advance if step is complete
    let nextStepName = step.name;
    let sessionClosed = false;
    
    if (shouldAdvance) {
      const order = fw.steps.map((s) => s.name);
      const idx = order.indexOf(step.name);
      const isLastStep = step.name === "review";
      
      if (isLastStep) {
        // Review complete - close the session
        await ctx.runMutation(api.mutations.closeSession, {
          sessionId: args.sessionId
        });
        sessionClosed = true;
        nextStepName = "review"; // Stay on review
      } else {
        // Create transition message for current step
        const stepTransitions: Record<string, string> = {
          goal: "Excellent! You've got a clear goal. Now let's explore your current reality.",
          reality: "Great work exploring the situation. Now let's brainstorm your options.",
          options: "You've identified some solid options. Let's now turn one into action.",
          will: "Perfect! You've committed to specific actions. Let's review everything together."
        };
        
        const transition = stepTransitions[step.name];
        if (transition !== undefined) {
          await ctx.runMutation(api.mutations.createReflection, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            step: step.name,
            userInput: undefined,
            payload: { coach_reflection: transition }
          });
        }
        
        // Advance to next step
        nextStepName = idx < order.length - 1 ? (order[idx + 1] ?? "review") : "review";
        await ctx.runMutation(api.mutations.updateSessionStep, {
          sessionId: args.sessionId,
          step: nextStepName
        });

        // Create step opener reflection (except for review)
        const stepOpeners: Record<string, string> = {
          reality: "Now let's explore what's actually happening. What's the current situation you're facing?",
          options: "Great clarity on your goal! Let's brainstorm possibilities. What are some ways you could move forward?",
          will: "Excellent options! Now let's turn this into action. Which option feels right for you?"
        };

        const opener = stepOpeners[nextStepName];
        if (opener !== undefined) {
          await ctx.runMutation(api.mutations.createReflection, {
            orgId: args.orgId,
            userId: args.userId,
            sessionId: args.sessionId,
            step: nextStepName,
            userInput: undefined,
            payload: { coach_reflection: opener }
          });
        }
      }
    }

    return { ok: true, nextStep: nextStepName, payload, sessionClosed };
  }
});
