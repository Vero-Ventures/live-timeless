import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrganizationBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_slug")
      .filter((q) => q.eq(q.field("slug"), slug))
      .collect()
      .then((res) => res.at(0));

    if (!organization) {
      throw new Error("Organization not found");
    }

    return organization;
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

export const updateOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    slug: v.string(),
    logo: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, { organizationId, ...args }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("organizationId"), organizationId)
        )
      )
      .collect()
      .then((res) => res.at(0));
    if (!member) {
      throw new Error("Not a member of any organization");
    }

    if (member.role === "owner") {
      await ctx.db.patch(organizationId, args);
    } else {
      throw new Error("Not the owner of the organization");
    }
  },
});

export const deleteOrganization = mutation({
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
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("organizationId"), organizationId)
        )
      )
      .collect()
      .then((res) => res.at(0));
    if (!member) {
      throw new Error("Not a member of any organization");
    }

    if (member.role === "owner") {
      const organizationMembers = await ctx.db
        .query("members")
        .filter((q) => q.eq(q.field("organizationId"), organizationId))
        .collect();

      await Promise.all(
        organizationMembers.map(async (member) => {
          await ctx.db.delete(member._id);
          await ctx.db.delete(member.userId);
        })
      );
      await ctx.db.delete(organizationId);
    } else {
      throw new Error("Not the owner of the organization");
    }
  },
});
