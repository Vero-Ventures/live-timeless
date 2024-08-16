import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
  goals: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),
  habitPlans: defineTable({
    plan: v.string(),
    goalId: v.string(),
  }).index("by_goal_id", ["goalId"]),
});
