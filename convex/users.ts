import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("kindeId"), args.userId));
    return user;
  },
});

export const createUser = mutation({
  args: {
    kindeId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    const userId = await ctx.db.insert("users", args);
    return userId;
  },
});
