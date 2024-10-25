import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createMember = internalMutation({
  args: {
    orgId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("members", {
      organizationId: args.orgId,
      userId: args.userId,
      role: args.role,
    });
  },
});
