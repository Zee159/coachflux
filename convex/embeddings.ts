/**
 * Vector Embeddings Module
 * 
 * Provides semantic search and cross-session context capabilities using OpenAI embeddings.
 * 
 * Key Features:
 * - Session-level embeddings for similarity search
 * - Reflection-level embeddings for granular context
 * - Knowledge base embeddings for RAG
 * - Privacy-first: Always filtered by userId
 * 
 * Cost: ~$0.00001 per session (negligible vs Claude API costs)
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
const OPENAI_API_URL = "https://api.openai.com/v1/embeddings";

interface EmbeddingResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * Generate embedding vector from text using OpenAI API
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (apiKey === null || apiKey === undefined || apiKey.trim() === "") {
    throw new Error("OPENAI_API_KEY environment variable not set");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input: text,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json() as EmbeddingResponse;
  if (data.data === null || data.data === undefined || data.data[0] === undefined) {
    throw new Error("Invalid response from OpenAI API");
  }
  return data.data[0].embedding;
}

/**
 * Generate session-level embedding for cross-session context and similarity search
 * 
 * Call this when a session closes to enable:
 * - "Similar Sessions" feature
 * - Cross-session memory for AI coach
 * - Pattern recognition across user's journey
 * 
 * @example
 * ```typescript
 * // In your session close mutation:
 * await ctx.scheduler.runAfter(0, internal.embeddings.generateSessionEmbedding, {
 *   sessionId: session._id
 * });
 * ```
 */
export const generateSessionEmbedding = action({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    // Get session data
    // @ts-ignore - Convex type instantiation depth limitation
    const session = await ctx.runQuery(api.queries.getSession, args);
    if (session === null || session === undefined) {
      throw new Error(`Session ${args.sessionId} not found`);
    }

    // Get all reflections for this session
    const reflections = await ctx.runQuery(api.queries.getSessionReflections, args);
    
    // Build comprehensive text summary
    const textParts: string[] = [
      `Framework: ${session.framework}`,
      `Step: ${session.step}`,
    ];

    // Add reflection content
    for (const reflection of reflections) {
      const payload = reflection.payload as Record<string, unknown>;
      
      // Extract coach reflection
      if (typeof payload["coach_reflection"] === 'string' && payload["coach_reflection"].trim() !== '') {
        textParts.push(payload["coach_reflection"]);
      }

      // Extract user input if available
      if (reflection.userInput !== null && reflection.userInput !== undefined && reflection.userInput.trim() !== '') {
        textParts.push(`User: ${reflection.userInput}`);
      }

      // Extract key fields based on step
      if (typeof payload["goal_statement"] === 'string' && payload["goal_statement"].trim() !== '') {
        textParts.push(`Goal: ${payload["goal_statement"]}`);
      }
      if (typeof payload["current_state"] === 'string' && payload["current_state"].trim() !== '') {
        textParts.push(`Reality: ${payload["current_state"]}`);
      }
    }

    const embeddedText = textParts.join("\n\n");

    // Generate embedding
    const embedding = await generateEmbedding(embeddedText);

    // Store embedding
    // @ts-ignore - Convex type instantiation depth limitation
    await ctx.runMutation(internal.embeddingsInternal.storeSessionEmbedding, {
      sessionId: args.sessionId,
      userId: session.userId,
      orgId: session.orgId,
      framework: session.framework,
      embedding,
      embeddedText,
    });

    return { success: true, dimensions: embedding.length };
  },
});

/**
 * Generate reflection-level embedding for granular context retrieval
 * 
 * Optional: Use this for more fine-grained semantic search within sessions.
 * Most use cases are covered by session-level embeddings.
 */
export const generateReflectionEmbedding = action({
  args: { reflectionId: v.id("reflections") },
  handler: async (ctx, args) => {
    // Get reflection
    const reflection = await ctx.runQuery(internal.embeddingsInternal.getReflection, args);
    if (reflection === null || reflection === undefined) {
      throw new Error(`Reflection ${args.reflectionId} not found`);
    }

    // Get session for context
    const session = await ctx.runQuery(api.queries.getSession, {
      sessionId: reflection.sessionId,
    });
    if (session === null || session === undefined) {
      throw new Error(`Session ${reflection.sessionId} not found`);
    }

    // Build text from reflection payload
    const payload = reflection.payload as Record<string, unknown>;
    const textParts: string[] = [
      `Step: ${reflection.step}`,
    ];

    if (typeof payload["coach_reflection"] === 'string' && payload["coach_reflection"].trim() !== '') {
      textParts.push(payload["coach_reflection"]);
    }
    if (reflection.userInput !== null && reflection.userInput !== undefined && reflection.userInput.trim() !== '') {
      textParts.push(`User: ${reflection.userInput}`);
    }

    const embeddedText = textParts.join("\n\n");

    // Generate embedding
    const embedding = await generateEmbedding(embeddedText);

    // Store embedding
    await ctx.runMutation(internal.embeddingsInternal.storeReflectionEmbedding, {
      reflectionId: args.reflectionId,
      sessionId: reflection.sessionId,
      userId: reflection.userId,
      orgId: reflection.orgId,
      step: reflection.step,
      framework: session.framework,
      embedding,
      embeddedText,
    });

    return { success: true, dimensions: embedding.length };
  },
});

/**
 * Find sessions similar to a given session
 * 
 * Use this to show users their past sessions that dealt with similar challenges.
 * 
 * @example
 * ```typescript
 * const similar = await ctx.runAction(api.embeddings.findSimilarSessions, {
 *   sessionId: currentSessionId,
 *   limit: 5
 * });
 * ```
 */
export const findSimilarSessions = action({
  args: {
    sessionId: v.id("sessions"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Array<{
    sessionId: string;
    framework: string;
    similarity: number;
    preview: string;
  }>> => {
    const limit = args.limit ?? 5;

    // Get embedding for current session
    const sessionEmbedding: Doc<"sessionEmbeddings"> | null = await ctx.runQuery(
      internal.embeddingsInternal.getSessionEmbedding,
      { sessionId: args.sessionId }
    );

    if (sessionEmbedding === null || sessionEmbedding === undefined) {
      return [];
    }

    // Vector search for similar sessions (same user only)
    const results = await ctx.vectorSearch(
      "sessionEmbeddings",
      "by_embedding",
      {
        vector: sessionEmbedding.embedding,
        limit: limit + 1, // +1 because current session will be in results
        filter: (q) => q.eq("userId", sessionEmbedding.userId),
      }
    ) as Array<Doc<"sessionEmbeddings"> & { _score: number }>;

    // Filter out current session and return
    return results
      .filter((r) => r._id !== sessionEmbedding._id)
      .slice(0, limit)
      .map((r) => ({
        sessionId: r.sessionId,
        framework: r.framework,
        similarity: r._score,
        preview: r.embeddedText.slice(0, 200) + "...",
      }));
  },
});

/**
 * Search reflections semantically across user's history
 * 
 * Use this to find specific moments or insights from past sessions.
 * 
 * @example
 * ```typescript
 * const results = await ctx.runAction(api.embeddings.searchReflections, {
 *   userId: user._id,
 *   query: "times I felt confident about a decision",
 *   limit: 10
 * });
 * ```
 */
export const searchReflections = action({
  args: {
    userId: v.id("users"),
    query: v.string(),
    framework: v.optional(v.string()),
    step: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(args.query);

    // Vector search with filters
    const results = await ctx.vectorSearch(
      "reflectionEmbeddings",
      "by_embedding",
      {
        vector: queryEmbedding,
        limit,
        filter: (q) => {
          let filtered = q.eq("userId", args.userId);
          if (args.framework !== null && args.framework !== undefined && args.framework.trim() !== "") {
            filtered = q.eq("framework", args.framework);
          }
          if (args.step !== null && args.step !== undefined && args.step.trim() !== "") {
            filtered = q.eq("step", args.step);
          }
          return filtered;
        },
      }
    );

    type ReflectionEmbeddingResult = Doc<"reflectionEmbeddings"> & { _score: number };
    return (results as ReflectionEmbeddingResult[]).map((r) => ({
      reflectionId: r.reflectionId,
      sessionId: r.sessionId,
      step: r.step,
      framework: r.framework,
      similarity: r._score,
      content: r.embeddedText,
    }));
  },
});

/**
 * Get cross-session context for AI coach
 * 
 * Use this to provide the AI coach with relevant context from user's past sessions.
 * This enables the coach to reference past insights and build on previous work.
 * 
 * @example
 * ```typescript
 * // In your coaching prompt:
 * const context = await ctx.runAction(api.embeddings.getCrossSessionContext, {
 *   userId: user._id,
 *   currentStep: "goal",
 *   limit: 3
 * });
 * 
 * const prompt = `
 *   ${basePrompt}
 *   
 *   RELEVANT PAST CONTEXT:
 *   ${context.map(c => c.content).join('\n\n')}
 * `;
 * ```
 */
export const getCrossSessionContext = action({
  args: {
    userId: v.id("users"),
    currentStep: v.string(),
    framework: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;

    // Generate query embedding from current step context
    const frameworkText = (args.framework !== null && args.framework !== undefined && args.framework.trim() !== "")
      ? ` in ${args.framework} framework`
      : "";
    const queryText = `Coaching session at ${args.currentStep} step${frameworkText}`;
    const queryEmbedding = await generateEmbedding(queryText);

    // Vector search for relevant past sessions
    const results = await ctx.vectorSearch(
      "sessionEmbeddings",
      "by_embedding",
      {
        vector: queryEmbedding,
        limit,
        filter: (q) => {
          let filtered = q.eq("userId", args.userId);
          if (args.framework !== null && args.framework !== undefined && args.framework.trim() !== "") {
            filtered = q.eq("framework", args.framework);
          }
          return filtered;
        },
      }
    );

    type SessionEmbeddingResult = Doc<"sessionEmbeddings"> & { _score: number };
    return (results as SessionEmbeddingResult[])
      .filter((r) => r.embeddedText !== null && r.embeddedText !== undefined && r.embeddedText.length > 0)
      .map((r) => ({
        sessionId: r.sessionId,
        framework: r.framework,
        relevance: r._score,
        content: r.embeddedText,
      }));
  },
});

/**
 * Backfill embeddings for existing sessions
 * 
 * Run this once to generate embeddings for all existing sessions.
 * 
 * @example
 * ```typescript
 * npx convex run embeddings:backfillSessionEmbeddings
 * ```
 */
export const backfillSessionEmbeddings = action({
  args: {
    userId: v.optional(v.id("users")),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{
    processed: number;
    errors: number;
    remaining: number;
  }> => {
    const batchSize = args.batchSize ?? 10;

    // Get sessions without embeddings
    const sessionsToProcess = await ctx.runQuery(
      internal.embeddingsInternal.getSessionsWithoutEmbeddings,
      {
        userId: args.userId,
        limit: batchSize,
      }
    );

    let processed = 0;
    let errors = 0;

    for (const session of sessionsToProcess) {
      try {
        await ctx.runAction(api.embeddings.generateSessionEmbedding, { sessionId: session._id });
        processed++;
      } catch (error) {
        console.error(`Failed to generate embedding for session ${session._id}:`, error);
        errors++;
      }
    }

    return {
      processed,
      errors,
      remaining: sessionsToProcess.length - processed,
    };
  },
});

/**
 * Generate knowledge base embedding
 * 
 * Use this to load Management Bible content and other coaching knowledge.
 * 
 * @example
 * ```typescript
 * await ctx.runAction(api.embeddings.generateKnowledgeEmbedding, {
 *   source: "management_bible",
 *   category: "performance_management",
 *   title: "Handling Underperformance",
 *   content: "...",
 *   tags: ["underperformance", "feedback", "pip"]
 * });
 * ```
 */
export const generateKnowledgeEmbedding = action({
  args: {
    source: v.string(),
    category: v.string(),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Build text for embedding
    const embeddedText = `${args.title}\n\nCategory: ${args.category}\n\n${args.content}`;
    
    // Generate embedding
    const embedding = await generateEmbedding(embeddedText);
    
    // Store in knowledgeEmbeddings table
    await ctx.runMutation(internal.embeddingsInternal.storeKnowledgeEmbedding, {
      source: args.source,
      category: args.category,
      title: args.title,
      content: args.content,
      tags: args.tags,
      embedding,
      embeddedText,
    });
    
    return { success: true, dimensions: embedding.length };
  },
});
