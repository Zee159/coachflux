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
    legalConsent: v.optional(v.object({
      termsAccepted: v.boolean(),
      privacyAccepted: v.boolean(),
      acceptedAt: v.number(),
      termsVersion: v.string(),
      privacyVersion: v.string(),
    })),
  }).index("byAuth", ["authId"]),

  sessions: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    framework: v.string(), // "GROW" | "COMPASS"
    step: v.string(),      // "goal" | "reality" | "options" | "will" | "review"
    state: v.any(),        // JSON state: { skips: { goal: 0, reality: 0, ... } }
    
    // Phase 2: OPTIONS state tracking (GROW framework)
    options_state: v.optional(v.union(
      v.literal("A"),  // STATE A: Collecting option label
      v.literal("B")   // STATE B: Collecting pros/cons
    )),
    ai_suggestion_count: v.optional(v.number()), // Track AI suggestion rounds (0-3)
    
    startedAt: v.number(),
    closedAt: v.optional(v.number()),
    escalated: v.optional(v.boolean()), // Session flagged for escalation to HR/specialist
    safetyPaused: v.optional(v.boolean()), // ⚠️ FIX P0-4: Session paused due to safety concern
    safetyPauseReason: v.optional(v.string()), // Reason for safety pause
    rating: v.optional(v.number()), // User satisfaction rating 1-5 stars
    ratingSubmittedAt: v.optional(v.number()), // When rating was submitted
  }).index("byUser", ["userId"]),

  reflections: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    step: v.string(),
    userInput: v.optional(v.string()), // raw user response text
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

  feedback: defineTable({
    orgId: v.optional(v.id("orgs")),
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.id("sessions")),
    overallRating: v.optional(v.number()),
    uxRating: v.optional(v.number()),
    growMethodRating: v.optional(v.number()),
    easeOfUse: v.optional(v.string()),
    helpfulness: v.optional(v.string()),
    willingToPay: v.optional(v.string()),
    improvements: v.optional(v.string()),
    createdAt: v.number(),
  }).index("byOrg", ["orgId"]).index("byUser", ["userId"]).index("bySession", ["sessionId"]),
});
