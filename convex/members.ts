import { v } from "convex/values";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const getMemberByOrgIdAndRole = internalQuery({
  args: {
    orgId: v.id("organizations"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("members")
      .withIndex("by_organization_id")
      .filter((q) => q.eq(q.field("role"), args.role))
      .unique();

    if (!member) {
      throw new Error("Member not found");
    }

    return member;
  },
});

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

export const updateMemberRole = mutation({
  args: {
    memberId: v.id("members"),
    role: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const memberRole = await ctx.runQuery(
      internal.utils.getMemberOrganizationRole,
      {
        organizationId: args.organizationId,
      }
    );

    if (!memberRole?.isOwner && !memberRole?.isAdmin) {
      throw new Error("Not the owner or admin of the organization");
    }

    await ctx.db.patch(args.memberId, {
      role: args.role,
    });
  },
});
