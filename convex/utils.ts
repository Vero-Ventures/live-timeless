import { getAuthUserId } from "@convex-dev/auth/server";
import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getMemberOrganizationRole = internalQuery({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_organization_id", (q) =>
        q.eq("userId", userId).eq("organizationId", organizationId)
      )
      .unique();
    if (!member) {
      throw new Error("Not a member of any organization");
    }

    return {
      isOwner: member.role === "owner",
      isAdmin: member.role === "admin",
    };
  },
});
