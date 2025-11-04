/* eslint-disable no-console */
/**
 * Utility functions to check and manage knowledge base
 */

import { query, mutation } from "./_generated/server";

export const count = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("knowledgeEmbeddings").collect();
    
    const byCategory: Record<string, number> = {};
    for (const item of all) {
      byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
    }
    
    return {
      total: all.length,
      byCategory,
    };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("knowledgeEmbeddings").collect();
    
    return all.map((item) => ({
      id: item._id,
      source: item.source,
      category: item.category,
      title: item.title,
      contentPreview: item.content.substring(0, 100) + "...",
      createdAt: new Date(item._creationTime).toISOString(),
    }));
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("knowledgeEmbeddings").collect();
    
    console.log(`🗑️  Deleting ${all.length} knowledge entries...`);
    
    for (const item of all) {
      await ctx.db.delete(item._id);
    }
    
    console.log(`✅ Deleted ${all.length} entries`);
    
    return {
      deleted: all.length,
      message: "All knowledge entries cleared. Ready to re-seed.",
    };
  },
});

export const clearManagementBible = mutation({
  args: {},
  handler: async (ctx) => {
    const managementScenarios = await ctx.db
      .query("knowledgeEmbeddings")
      .filter((q) => 
        q.or(
          q.eq(q.field("source"), "management_bible"),
          q.eq(q.field("source"), "management_bible_enhanced")
        )
      )
      .collect();
    
    console.log(`🗑️  Deleting ${managementScenarios.length} Management Bible scenarios...`);
    
    for (const item of managementScenarios) {
      console.log(`   Deleting: ${item.title}`);
      await ctx.db.delete(item._id);
    }
    
    console.log(`✅ Deleted ${managementScenarios.length} Management Bible entries`);
    
    return {
      deleted: managementScenarios.length,
      message: "Management Bible scenarios cleared. Ready to re-seed with enhanced versions.",
    };
  },
});
