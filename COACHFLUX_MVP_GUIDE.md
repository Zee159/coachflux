Purpose: ship a B2B leadership-reflection MVP on Convex with deterministic flows, strict guardrails, and low hallucination risk.


0) Repo bootstrap
# prerequisites: Node 20+, pnpm 9+
pnpm dlx create-convex@latest coachflux
cd coachflux
pnpm i
pnpm dev

Recommended libraries:
pnpm add react-router-dom zod
pnpm add -D @types/node @types/react



1) Domain model (Convex)
/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orgs: defineTable({
    name: v.string(),
    values: v.array(v.object({ key: v.string(), description: v.string() })), // org value glossary
  }).index("name", ["name"]),

  users: defineTable({
    authId: v.string(),
    orgId: v.id("orgs"),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("member")),
    displayName: v.string(),
  }).index("byAuth", ["authId"]),

  sessions: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    framework: v.string(), // "GROW"
    step: v.string(),      // "goal" | "reality" | "options" | "will" | "review"
    state: v.any(),        // JSON state machine snapshot
    startedAt: v.number(),
    closedAt: v.optional(v.number()),
  }).index("byUser", ["userId"]),

  reflections: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    step: v.string(),
    payload: v.any(), // validated JSON output from LLM
    createdAt: v.number(),
  }).index("bySession", ["sessionId"]),

  actions: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    title: v.string(),
    dueAt: v.optional(v.number()),
    status: v.union(v.literal("open"), v.literal("done")),
    createdAt: v.number(),
  }).index("byUser", ["userId"]),

  safetyIncidents: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    reason: v.string(),           // policy breach or unsafe content
    llmOutput: v.optional(v.any()),
    createdAt: v.number(),
    severity: v.union(v.literal("low"), v.literal("med"), v.literal("high")),
  }).index("byOrg", ["orgId"]),
});



2) Coaching framework as data (deterministic)
/src/frameworks/grow.json
{
  "id": "GROW",
  "steps": [
    {
      "name": "goal",
      "system_objective": "Clarify the desired outcome for the next 1-12 weeks.",
      "required_fields_schema": {
        "type": "object",
        "properties": {
          "goal": { "type": "string", "minLength": 8, "maxLength": 240 },
          "why_now": { "type": "string", "minLength": 8, "maxLength": 240 },
          "success_criteria": { "type": "array", "items": { "type": "string", "minLength": 3 }, "minItems": 1, "maxItems": 5 },
          "horizon_weeks": { "type": "integer", "minimum": 1, "maximum": 12 }
        },
        "required": ["goal", "why_now", "success_criteria", "horizon_weeks"],
        "additionalProperties": false
      }
    },
    {
      "name": "reality",
      "system_objective": "Surface current constraints, facts, and risks without judgment.",
      "required_fields_schema": {
        "type": "object",
        "properties": {
          "current_state": { "type": "string", "minLength": 8, "maxLength": 320 },
          "constraints": { "type": "array", "items": { "type": "string" }, "maxItems": 6 },
          "resources": { "type": "array", "items": { "type": "string" }, "maxItems": 6 },
          "risks": { "type": "array", "items": { "type": "string" }, "maxItems": 6 }
        },
        "required": ["current_state"],
        "additionalProperties": false
      }
    },
    {
      "name": "options",
      "system_objective": "Generate at least three viable options with pros and cons.",
      "required_fields_schema": {
        "type": "object",
        "properties": {
          "options": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "label": { "type": "string", "minLength": 3, "maxLength": 60 },
                "pros": { "type": "array", "items": { "type": "string" }, "maxItems": 5 },
                "cons": { "type": "array", "items": { "type": "string" }, "maxItems": 5 }
              },
              "required": ["label"],
              "additionalProperties": false
            },
            "minItems": 3,
            "maxItems": 5
          }
        },
        "required": ["options"],
        "additionalProperties": false
      }
    },
    {
      "name": "will",
      "system_objective": "Select one option and define SMART actions.",
      "required_fields_schema": {
        "type": "object",
        "properties": {
          "chosen_option": { "type": "string" },
          "actions": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": { "type": "string", "minLength": 4, "maxLength": 120 },
                "owner": { "type": "string" },
                "due_days": { "type": "integer", "minimum": 1, "maximum": 90 }
              },
              "required": ["title", "owner", "due_days"],
              "additionalProperties": false
            },
            "minItems": 1,
            "maxItems": 3
          }
        },
        "required": ["chosen_option", "actions"],
        "additionalProperties": false
      }
    },
    {
      "name": "review",
      "system_objective": "Summarise the plan and compute an alignment score with org values.",
      "required_fields_schema": {
        "type": "object",
        "properties": {
          "summary": { "type": "string", "minLength": 16, "maxLength": 400 },
          "alignment_score": { "type": "integer", "minimum": 0, "maximum": 100 },
          "value_tags": { "type": "array", "items": { "type": "string" }, "maxItems": 3 }
        },
        "required": ["summary", "alignment_score"],
        "additionalProperties": false
      }
    }
  ]
}



3) LLM guardrails
Global model settings
temperature: 0.0
top_p: 0.0
response_format: "json" (strict)
Max tokens per step: 300–600
Hard stop words: therapy, diagnose, cure, medical, legal, financial advice
Policy
Role = "Reflective leadership partner."
No therapy. No medical or legal advice.
Never invent company policy.
If asked for unknown policy → respond: "Not in my scope. Ask HR or consult your policy source."
Self-check pass (two-call pattern)
Primary call → returns JSON.
Validator call → input: schema + output JSON + banned terms. Returns pass|fail + reasons.
If fail: show user a neutral message and ask a narrower question.
Safety capture
If validator flags high severity → store copy in safetyIncidents and show "I cannot proceed. Please contact your manager or HR."


4) Prompt templates
/convex/functions/prompts.ts
export const SYSTEM_BASE = (orgValues: string[]) => `
You are a reflective leadership partner for employees and managers.
Objective: facilitate structured reflection and decisions aligned to organisation values.
Values to reference (select only if relevant): ${orgValues.join(", ")}.
Rules:
- Output MUST be valid JSON matching the provided schema.
- No therapy, diagnosis, or medical/legal/financial advice.
- Do not fabricate policies or facts. If unknown, say: "Out of scope".
- Keep language concise, neutral, and actionable.
- Use the user's own words where possible; avoid new facts.
`;

export const USER_STEP_PROMPT = (stepName: string, userTurn: string) => `
Step: ${stepName}
User input: """${userTurn}"""
Produce the minimal JSON required by the schema, nothing extra.
`;

export const VALIDATOR_PROMPT = (schema: object, candidateJson: string) => `
Validate the candidate against this JSON Schema:
${JSON.stringify(schema)}

Reject if:
- Not valid JSON
- Missing required fields
- Contains banned terms: ["therapy","diagnose","cure","medical","legal","financial advice"]
Return:
{"verdict":"pass"|"fail","reasons":string[]}
Candidate:
${candidateJson}
`;



5) Coordinator (state machine executor)
/convex/functions/coach.ts
import { action, mutation, query } from "./_generated/server";
import grow from "../../src/frameworks/grow.json";
import { v } from "convex/values";
import OpenAI from "openai"; // or Anthropic

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const frameworks: Record<string, any> = { GROW: grow };
const BANNED = ["therapy","diagnose","cure","medical","legal","financial advice"];

export const nextStep = action({
  args: {
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    stepName: v.string(),
    userTurn: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.orgId);
    const values = (org?.values ?? []).map(v => v.key);
    const fw = frameworks["GROW"];
    const step = fw.steps.find((s: any) => s.name === args.stepName);
    if (!step) throw new Error("Unknown step");

    // Primary call
    const system = SYSTEM_BASE(values);
    const user = USER_STEP_PROMPT(step.name, args.userTurn);

    const primary = await client.chat.completions.create({
      model: "gpt-4o-mini", // cost-effective; enforce JSON mode if available
      temperature: 0,
      top_p: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify({ schema: step.required_fields_schema }) },
        { role: "user", content: user }
      ]
    });

    const raw = primary.choices[0].message?.content ?? "{}";

    // Validator call
    const validator = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      top_p: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You validate JSON output for schema conformance and banned terms." },
        { role: "user", content: VALIDATOR_PROMPT(step.required_fields_schema, raw) }
      ]
    });

    const verdict = JSON.parse(validator.choices[0].message?.content ?? "{}");
    const lower = raw.toLowerCase();
    const bannedHit = BANNED.some(b => lower.includes(b));

    if (verdict.verdict !== "pass" || bannedHit) {
      await ctx.db.insert("safetyIncidents", {
        orgId: args.orgId, userId: args.userId, sessionId: args.sessionId,
        reason: "validator_fail_or_banned", llmOutput: raw, createdAt: Date.now(), severity: "med"
      });
      return { ok: false, message: "I can't process that. Try rephrasing with factual details." };
    }

    // Persist reflection
    const payload = JSON.parse(raw);
    await ctx.db.insert("reflections", {
      orgId: args.orgId, userId: args.userId, sessionId: args.sessionId,
      step: step.name, payload, createdAt: Date.now()
    });

    // Create actions if step=will
    if (step.name === "will") {
      for (const a of payload.actions ?? []) {
        const due = a.due_days ? Date.now() + a.due_days * 86400000 : undefined;
        await ctx.db.insert("actions", {
          orgId: args.orgId, userId: args.userId, sessionId: args.sessionId,
          title: a.title, dueAt: due, status: "open", createdAt: Date.now()
        });
      }
    }

    // Advance step
    const order = fw.steps.map((s: any) => s.name);
    const idx = order.indexOf(step.name);
    const next = order[idx + 1] ?? "review";

    await ctx.db.patch(args.sessionId, { step: next });

    return { ok: true, nextStep: next, payload };
  }
});



6) React UI skeleton
/src/App.tsx
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const [text, setText] = useState("");
  const [step, setStep] = useState<"goal"|"reality"|"options"|"will"|"review">("goal");
  const [transcript, setTranscript] = useState<any[]>([]);
  const nextStep = useAction(api.coach.nextStep);

  async function submit() {
    const res = await nextStep({
      orgId: /* from auth context */, 
      userId: /* from auth context */,
      sessionId: /* created on start */,
      stepName: step,
      userTurn: text
    });
    if (!res.ok) { alert(res.message); return; }
    setTranscript(t => [...t, { step, text, output: res.payload }]);
    setStep(res.nextStep);
    setText("");
  }

  return (
    <div className="mx-auto max-w-5xl p-4 grid grid-cols-3 gap-4">
      <section className="col-span-2 border rounded p-3">
        <h1 className="font-semibold mb-2">CoachFlux — {step.toUpperCase()}</h1>
        <div className="h-[60vh] overflow-auto border rounded p-2 mb-2 bg-white">
          {transcript.map((t, i) => (
            <div key={i} className="mb-3">
              <div className="text-sm text-gray-600">[{t.step}] You</div>
              <div className="mb-1">{t.text}</div>
              <pre className="bg-gray-50 p-2 text-xs rounded">{JSON.stringify(t.output, null, 2)}</pre>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 border rounded p-2" value={text} onChange={e=>setText(e.target.value)} placeholder="Type your response…" />
          <button className="px-3 py-2 border rounded" onClick={submit}>Submit</button>
        </div>
      </section>
      <aside className="col-span-1 border rounded p-3">
        <h2 className="font-semibold mb-2">Session Summary</h2>
        {/* render parsed fields per step */}
      </aside>
    </div>
  );
}



7) Org alignment scoring (simple)
/convex/functions/metrics.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const alignmentIndex = query({
  args: { orgId: v.id("orgs"), windowDays: v.number() },
  handler: async (ctx, args) => {
    const from = Date.now() - args.windowDays * 86400000;
    const rows = await ctx.db.query("reflections")
      .withIndex("bySession")
      .collect(); // filter by orgId and createdAt >= from after fetching or add another index

    // naive scoring: average of review.alignment_score
    const scores = rows
      .filter(r => r.orgId.equals(args.orgId) && r.payload?.alignment_score != null)
      .map(r => r.payload.alignment_score);
    const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
    return { avgAlignmentScore: avg, sample: scores.length };
  }
});



8) Rate limits and abuse controls
Per user:
Max 1 active session.
Max 20 LLM calls/day.
Backoff on 429 or failures.
Request size caps: 800 chars per user message.
Strip PII in logs. Never store raw tokens.
Security headers on frontend hosting (CSP, no-sniff, frame-ancestors none).


9) Evaluation harness (CI)
Create canned transcripts under /tests/evals/*.json:
{
  "name": "grow_basic",
  "turns": [
    { "step": "goal", "user": "I want to improve weekly status reports." },
    { "step": "reality", "user": "Reports are late and unclear." },
    { "step": "options", "user": "Possible fixes?" },
    { "step": "will", "user": "I will pilot a new template." }
  ],
  "banned_terms": ["therapy","diagnose","medical"]
}

Test script (pseudo):
Run nextStep for each turn.
Validate JSON against schema.
Assert no banned terms.
Fail CI on any violation.


10) Deployment checklist
Env:
OPENAI_API_KEY set in Convex dashboard.
Monitoring:
Log summary: step, tokens, duration, pass/fail.
Alert on >10% validator failures in 24h.
Data:
Daily export of actions for managers.
Legal:
Terms, Privacy, Safety disclaimers (no therapy).
Pilot:
Seed orgs.values with 5–7 values.
Onboard 10–50 users.


11) Roadmap next
Add CLEAR framework as another JSON flow.
Add values-aware RAG (small, tagged snippets).
Manager dashboard: reflection frequency, action completion, alignment trend.
SSO (Google Workspace / Azure AD).
Stripe for paid tiers.


12) Prompts summary (copy-paste ready)
System base (dynamic by org values)
You are a reflective leadership partner.
Align outputs with the organisation's values only when relevant.
No therapy, diagnosis, medical, legal, or financial advice.
No fabrication of policy. If unknown, reply: "Out of scope".
Return ONLY valid JSON that matches the provided schema.
Be concise and actionable.

User step
Step: <goal|reality|options|will|review>
User input: """{{text}}"""
Output only the minimal JSON described by the schema. Nothing else.

Validator
Task: Validate candidate JSON against schema. Fail on banned terms:
["therapy","diagnose","cure","medical","legal","financial advice"].
Return {"verdict":"pass"|"fail","reasons":[]}



13) Operating principles
Deterministic first. Creativity later.
One step, one schema, one short prompt.
Two-pass validation on every call.
Instrument everything. Kill regressions fast.
Ship the pilot in two weeks.


This file is production-oriented. Drop it at repo root as COACHFLUX_MVP_GUIDE.md and build.
