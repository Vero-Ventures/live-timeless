import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

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
    const memberRole = await ctx.runQuery(
      internal.utils.getMemberOrganizationRole,
      {
        organizationId,
      }
    );

    if (!memberRole?.isOwner) {
      throw new Error("Not the owner of the organization");
    }

    await ctx.db.patch(organizationId, args);
  },
});

export const deleteOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const memberRole = await ctx.runQuery(
      internal.utils.getMemberOrganizationRole,
      {
        organizationId,
      }
    );

    if (!memberRole?.isOwner) {
      throw new Error("Not the owner of the organization");
    }

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
  },
});
