import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrganizationById = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    return await ctx.db.get(organizationId);
  },
});

export const createOrganization = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    logo: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect()
      .then((res) => res.at(0));
    if (!member) {
      throw new Error("Not a member of any organization");
    }

    const organizationId = await ctx.db.insert("organizations", args);
    return organizationId;
  },
});
