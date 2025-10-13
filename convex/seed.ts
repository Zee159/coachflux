import { mutation } from "./_generated/server";

/**
 * Seed script for initial demo data
 * Run with: npx convex run seed:seedDemoData
 */
export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create demo organization
    const orgId = await ctx.db.insert("orgs", {
      name: "Demo Corp",
      values: [
        { key: "Integrity", description: "We act with honesty and accountability" },
        { key: "Innovation", description: "We embrace creativity and continuous improvement" },
        { key: "Collaboration", description: "We work together to achieve common goals" },
        { key: "Excellence", description: "We strive for the highest quality in everything we do" },
        { key: "Customer-First", description: "We prioritize our customers' needs and success" },
      ],
    });

    // Create demo users
    const adminId = await ctx.db.insert("users", {
      authId: "admin@democorp.com",
      orgId,
      role: "admin",
      displayName: "Admin User",
    });

    const managerId = await ctx.db.insert("users", {
      authId: "manager@democorp.com",
      orgId,
      role: "manager",
      displayName: "Manager User",
    });

    const memberId = await ctx.db.insert("users", {
      authId: "member@democorp.com",
      orgId,
      role: "member",
      displayName: "Team Member",
    });

    return {
      orgId,
      users: {
        admin: adminId,
        manager: managerId,
        member: memberId,
      },
      message: "Demo data seeded successfully",
    };
  },
});
