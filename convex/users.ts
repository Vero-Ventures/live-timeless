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
    return user;
  },
});

export const getUserById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

export const createUser = internalMutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...(args.name && { name: args.name }),
      email: args.email,
    });
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
