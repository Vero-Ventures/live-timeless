import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
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
