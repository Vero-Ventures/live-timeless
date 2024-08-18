import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    kindeId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    // Check if the user already exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("kindeId"), args.kindeId))
      .first();
    if (user) {
      return user._id;
    }

    const userId = await ctx.db.insert("users", args);
    return userId;
  },
});
