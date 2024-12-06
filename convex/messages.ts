import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getMessages = query({
  args: { threadId: v.optional(v.string()) },
  handler: async (ctx, { threadId }) => {
    if (!threadId) {
      return null;
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_thread_id", (q) => q.eq("threadId", threadId))
      .collect();

    return messages;
  },
});

export const sendMessage = mutation({
  args: {
    message: v.string(),
    threadId: v.optional(v.string()),
  },
  handler: async (ctx, { message, threadId }) => {
    await ctx.scheduler.runAfter(0, internal.serve.answer, {
      existingThreadId: threadId,
      message,
    });
  },
});

export const clear = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .collect();
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));
  },
});
