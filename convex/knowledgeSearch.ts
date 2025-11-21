/**
 * Knowledge Base Search for Post-Session Recommendations
 * 
 * Provides semantic search over 1,200-word enhanced knowledge articles
 * to recommend relevant content after coaching sessions.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { action } from "./_generated/server";
import { v } from "convex/values";
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
  if (data.data?.[0] === undefined) {
    throw new Error("Invalid response from OpenAI API");
  }
  return data.data[0].embedding;
}

/**
 * Search knowledge base for relevant articles
 * Used for post-session recommendations
 * 
 * @example
 * ```typescript
 * const recommendations = await ctx.runAction(api.knowledgeSearch.searchKnowledge, {
 *   query: "career transition to product management",
 *   limit: 5
 * });
 * ```
 */
export const searchKnowledge = action({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    source: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    
    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(args.query);
    
    // Build filter function
    const buildFilter = (q: any) => {
      let filtered = q;
      if (args.category !== null && args.category !== undefined && args.category.trim() !== "") {
        filtered = filtered.eq("category", args.category);
      }
      if (args.source !== null && args.source !== undefined && args.source.trim() !== "") {
        filtered = filtered.eq("source", args.source);
      }
      return filtered;
    };
    
    // Vector search with optional filters
    const results = await ctx.vectorSearch(
      "knowledgeEmbeddings",
      "by_embedding",
      {
        vector: queryEmbedding,
        limit,
        filter: (args.category !== null && args.category !== undefined) || 
                (args.source !== null && args.source !== undefined)
          ? buildFilter
          : undefined
      }
    );
    
    type KnowledgeResult = Doc<"knowledgeEmbeddings"> & { _score: number };
    return (results as KnowledgeResult[]).map((r) => ({
      id: r._id,
      title: r.title,
      category: r.category,
      content: r.content.substring(0, 300) + '...', // Preview only
      fullContent: r.content, // Full content for display
      relevance: r._score,
      source: r.source,
      createdAt: r.createdAt
    }));
  },
});

/**
 * Get full knowledge article by ID
 * Used when user wants to read the complete article
 * 
 * Note: This is a simple pass-through action. In production, you may want to
 * create an internal query for this to avoid the action overhead.
 */
export const getKnowledgeArticle = action({
  args: {
    articleId: v.id("knowledgeEmbeddings"),
  },
  handler: async (ctx, args) => {
    // For now, we'll use vectorSearch to find the article by ID
    // This is a workaround since we can't directly query from actions
    const allArticles = await ctx.vectorSearch(
      "knowledgeEmbeddings",
      "by_embedding",
      {
        vector: new Array(1536).fill(0) as number[], // Dummy vector
        limit: 1000, // Get all articles
      }
    );
    
    type KnowledgeDoc = Doc<"knowledgeEmbeddings"> & { _score: number };
    const article = (allArticles as KnowledgeDoc[]).find(a => a._id === args.articleId);
    
    if (article === null || article === undefined) {
      throw new Error(`Article ${args.articleId} not found`);
    }
    
    return {
      id: article._id,
      title: article.title,
      category: article.category,
      content: article.content,
      source: article.source,
      createdAt: article.createdAt
    };
  },
});

/**
 * Search knowledge by category
 * Useful for browsing specific topic areas
 */
export const searchByCategory = action({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    // Use vectorSearch with filter instead of direct query
    const results = await ctx.vectorSearch(
      "knowledgeEmbeddings",
      "by_embedding",
      {
        vector: new Array(1536).fill(0) as number[], // Dummy vector for category browsing
        limit,
        filter: (q) => q.eq("category", args.category)
      }
    );
    
    type KnowledgeDoc = Doc<"knowledgeEmbeddings"> & { _score: number };
    return (results as KnowledgeDoc[]).map((r) => ({
      id: r._id,
      title: r.title,
      category: r.category,
      content: r.content.substring(0, 300) + '...',
      source: r.source,
      createdAt: r.createdAt
    }));
  },
});

/**
 * Get all available categories
 * For building category filters in UI
 */
export const getCategories = action({
  args: {},
  handler: async (ctx) => {
    // Get all articles using vectorSearch
    const articles = await ctx.vectorSearch(
      "knowledgeEmbeddings",
      "by_embedding",
      {
        vector: new Array(1536).fill(0) as number[], // Dummy vector
        limit: 1000, // Get all articles
      }
    );
    
    // Extract unique categories
    type KnowledgeDoc = Doc<"knowledgeEmbeddings"> & { _score: number };
    const categories = new Set<string>();
    for (const article of (articles as KnowledgeDoc[])) {
      categories.add(article.category);
    }
    
    return Array.from(categories).sort();
  },
});
