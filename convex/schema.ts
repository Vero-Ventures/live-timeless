import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  goals: defineTable({
    description: v.string(),
  }),
  users: defineTable({
    kindeId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
  }).index("by_kinde_id", ["kindeId"]),
  processedWebhooks: defineTable({
    webhookId: v.string(),
    processedAt: v.number(),
  }).index("by_webhook_id", ["webhookId"]),
});
