import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return { ...user, organization: await ctx.db.get(user.organizationId) };
  },
});

export const getUsers = internalQuery({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();

    if (!users) {
      throw new Error("Users not found");
    }

    return users;
  },
});

export const getUserByOrgIdAndRole = internalQuery({
  args: {
    organizationId: v.id("organizations"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("role"), args.role)
        )
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

export const getUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    return user;
  },
});

export const createUser = internalMutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...(args.name && { name: args.name }),
      email: args.email,
      organizationId: args.organizationId,
      role: args.role,
      hasOnboarded: false,
      tokens: 0,
    });
  },
});

export const createAuthAccount = internalMutation({
  args: {
    provider: v.string(),
    email: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("authAccounts", {
      providerAccountId: args.email,
      provider: args.provider,
      userId: args.userId,
    });
  },
});

export const deleteAuthAccount = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", args.userId))
      .unique();
    if (!authAccount) {
      throw new Error("Can't find auth account to delete");
    }
    await ctx.db.delete(authAccount._id);
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    dob: v.optional(v.number()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    await ctx.db.patch(userId, {
      name: args.name,
      email: args.email,
      dob: args.dob,
      height: args.height,
      weight: args.weight,
    });
  },
});

export const updateUserName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    await ctx.db.patch(userId, {
      name: args.name,
      hasOnboarded: true,
    });
  },
});

export const updatePartialProfile = mutation({
  args: {
    dob: v.optional(v.number()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    await ctx.db.patch(userId, {
      dob: args.dob,
      height: args.height,
      weight: args.weight,
    });
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!(user.role === "owner") && !(user.role === "admin")) {
      throw new Error("Not the owner or admin of the organization");
    }

    await ctx.db.delete(args.userId);
  },
});

export const checkUserEmail = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) =>
    ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique(),
});
