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
    state: v.any(),        // JSON state: { skips: { goal: 0, reality: 0, ... } }
    startedAt: v.number(),
    closedAt: v.optional(v.number()),
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
});
