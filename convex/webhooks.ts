import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

export const getProcessedWebhook = internalQuery({
  args: { webhookId: v.string() },
  handler: async (ctx, { webhookId }) => {
    return await ctx.db
      .query("processedWebhooks")
      .filter((q) => q.eq(q.field("webhookId"), webhookId))
      .first();
  },
});

export const markWebhookProcessed = internalMutation({
  args: { webhookId: v.string() },
  handler: async (ctx, { webhookId }) => {
    await ctx.db.insert("processedWebhooks", {
      webhookId,
      processedAt: Date.now(),
    });
  },
});
