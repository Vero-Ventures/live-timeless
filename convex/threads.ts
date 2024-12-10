import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getThread = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const threads = await ctx.db
      .query("threads")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    return threads;
  },
});

export const deleteThread = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();
    if (!thread) return;

    await ctx.db.delete(thread._id);
  },
});
