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

export const updateUserProfile = mutation({
  args: {
    id: v.id("users"),
    name: v.string(),
    email: v.string(),
    dob: v.optional(v.string()),
    gender: v.optional(v.string()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      email: args.email,
      dob: args.dob,
      gender: args. gender,
      height: args.height,
      weight: args.weight,
    }
    );
  },
});
