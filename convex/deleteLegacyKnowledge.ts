import { mutation } from "./_generated/server";

export const deleteLegacyManagementBible = mutation({
  args: {},
  handler: async (ctx) => {
    const legacyRecords = await ctx.db
      .query("knowledgeEmbeddings")
      .withIndex("bySource", (q) => q.eq("source", "management_bible"))
      .collect();

    for (const record of legacyRecords) {
      await ctx.db.delete(record._id);
    }

    return { deleted: legacyRecords.length };
  }
});
