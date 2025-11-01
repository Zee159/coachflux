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
  }).index("byUser", ["userId"]).index("bySession", ["sessionId"]),

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

  // === Composite Success Score (CSS) tables ===
  // Raw measurement capture at defined points (baseline, final, qualitative markers)
  measurement_points: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    stage: v.string(), // e.g. "ownership", "practice", "sustaining" (legacy)
    measurementType: v.union(
      v.literal("baseline"),
      v.literal("final"),
      v.literal("marker") // qualitative marker during flow
    ),
    payload: v.any(), // raw answers captured from prompts at this point
    createdAt: v.number(),
  }).index("bySession", ["sessionId"]).index("byUser", ["userId"]).index("byType", ["measurementType"]),

  // Per-dimension summarized measurements (normalized and deltas)
  success_measurements: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    dimension: v.union(
      v.literal("confidence"),
      v.literal("action"),
      v.literal("mindset"),
      v.literal("satisfaction")
    ),
    // Raw values may be numeric (1-10) or categorical (mindset states)
    initialRaw: v.optional(v.union(v.number(), v.string())),
    finalRaw: v.optional(v.union(v.number(), v.string())),
    increase: v.optional(v.number()), // numeric delta where applicable
    normalizedScore: v.optional(v.number()), // 0-100 per dimension
    calculatedAt: v.number(),
    calculationVersion: v.string(),
  }).index("bySession", ["sessionId"]).index("byUser", ["userId"]).index("byDimension", ["dimension"]),

  // Final CSS score with full breakdown and metadata for reproducibility
  css_scores: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    composite_success_score: v.number(), // 0-100
    success_level: v.union(
      v.literal("EXCELLENT"),
      v.literal("GOOD"),
      v.literal("FAIR"),
      v.literal("MARGINAL"),
      v.literal("INSUFFICIENT")
    ),
    breakdown: v.object({
      confidence_score: v.number(),
      confidence_growth: v.number(),
      action_score: v.number(),
      mindset_score: v.number(),
      satisfaction_score: v.number(),
    }),
    // Input snapshot for transparency/debug
    raw_inputs: v.any(), // includes initial/final confidence/clarity, mindset states, satisfaction, etc.
    calculatedAt: v.number(),
    calculationVersion: v.string(),
    calculation_metadata: v.optional(v.object({
      dimension_weights: v.object({
        confidence: v.number(),
        confidence_growth: v.number(),
        action: v.number(),
        mindset: v.number(),
        satisfaction: v.number(),
      }),
      thresholds: v.object({
        excellent: v.number(),
        good: v.number(),
        fair: v.number(),
        marginal: v.number(),
      }),
    })),
  }).index("bySession", ["sessionId"]).index("byUser", ["userId"]).index("byLevel", ["success_level"]),

  // Generated narrative insights, flags, and notes supporting the score
  css_insights: defineTable({
    orgId: v.id("orgs"),
    userId: v.id("users"),
    sessionId: v.id("sessions"),
    insights: v.optional(v.array(v.string())),
    flags: v.optional(v.array(v.string())), // e.g., "high_confidence_path", "breakthrough_detected"
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("bySession", ["sessionId"]).index("byUser", ["userId"]),

  // === Vector Embeddings for Semantic Search & RAG ===
  
  // Session-level embeddings for cross-session context and similarity search
  sessionEmbeddings: defineTable({
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    orgId: v.id("orgs"),
    framework: v.string(), // "GROW" | "COMPASS" etc.
    embedding: v.array(v.float64()), // 1536-dim vector from OpenAI
    // Summary text used to generate embedding (for debugging/transparency)
    embeddedText: v.string(),
    createdAt: v.number(),
  })
    .index("bySession", ["sessionId"])
    .index("byUser", ["userId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536, // OpenAI text-embedding-3-small
      filterFields: ["userId", "framework"], // Filter by user and framework type
    }),

  // Reflection-level embeddings for granular context retrieval
  reflectionEmbeddings: defineTable({
    reflectionId: v.id("reflections"),
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    orgId: v.id("orgs"),
    step: v.string(), // "goal" | "reality" | "options" | "will"
    framework: v.string(),
    embedding: v.array(v.float64()),
    embeddedText: v.string(), // The reflection content
    createdAt: v.number(),
  })
    .index("byReflection", ["reflectionId"])
    .index("bySession", ["sessionId"])
    .index("byUser", ["userId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId", "step", "framework"],
    }),

  // Knowledge base embeddings (for Management Bible, frameworks, etc.)
  knowledgeEmbeddings: defineTable({
    source: v.string(), // "management_bible" | "grow_framework" | "compass_framework"
    category: v.string(), // "performance_management" | "conflict_resolution" etc.
    title: v.string(), // Scenario or topic title
    content: v.string(), // The actual knowledge/advice
    embedding: v.array(v.float64()),
    metadata: v.optional(v.any()), // Additional structured data
    createdAt: v.number(),
  })
    .index("bySource", ["source"])
    .index("byCategory", ["category"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["source", "category"],
    }),
});
