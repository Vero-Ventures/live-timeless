import { getAuthUserId } from "@convex-dev/auth/server";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";

export const getOrganizationById = internalQuery({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const organization = await ctx.db.get(organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    return organization;
  },
});

export const getOrganizationBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!organization) {
      throw new Error("Organization not found");
    }

    return organization;
  },
});

function getSlug(name: string) {
  return name.toLowerCase().split(" ").join("-");
}
export const createOrganization = internalMutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("organizations", {
      name: args.name,
      slug: getSlug(args.name),
    });
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
      .withIndex("by_user_id_organization_id", (q) =>
        q.eq("userId", userId).eq("organizationId", organizationId)
      )
      .unique();
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
      .withIndex("by_user_id_organization_id", (q) =>
        q.eq("userId", userId).eq("organizationId", organizationId)
      )
      .unique();
    if (!member) {
      throw new Error("Not a member of any organization");
    }

    if (member.role === "owner") {
      const organizationMembers = await ctx.db
        .query("members")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", organizationId)
        )
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
